import { RestApi } from '@servicenow/sdk/core';

// Scripted REST API — endpoint at /api/global/v1/...
export const Bridge360REST = RestApi({
  $id: 'bridge360_rest_api',
  name: 'Bridge360 REST API',
  serviceId: 'v1',
  active: true,
  routes: [
    {
      $id: 'bridge360_extract_doc_route',
      name: 'Document Intelligence Extract',
      method: 'POST',
      path: '/extract-document',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var fileName = body.fileName || '';
          var documentType = body.documentType || '';
          var countryId = body.countryId || '';
          var countryDocumentId = body.countryDocumentId || '';
          var rawText = (body.text || body.rawText || '').trim();

          // ── 1. Dynamically Load Configured Fields from u_bridge360_country_document_field ──
          var expectedFields = [];
          var seenFields = {};

          if (body.expectedFields && Array.isArray(body.expectedFields)) {
            for (var i = 0; i < body.expectedFields.length; i++) {
              var item = body.expectedFields[i];
              var name = (typeof item === 'string') ? item : (item && item.name ? item.name : '');
              if (name && !seenFields[name]) {
                expectedFields.push({ name: name, type: (item && item.type) || 'text' });
                seenFields[name] = true;
              }
            }
          }

          if (countryDocumentId) {
            var grField = new GlideRecord('u_bridge360_country_document_field');
            grField.addQuery('u_country_document', countryDocumentId);
            grField.addQuery('u_active', true);
            grField.query();
            while (grField.next()) {
              var fName = grField.getValue('u_field_name');
              if (fName && !seenFields[fName]) {
                expectedFields.push({
                  name: fName,
                  type: grField.getValue('u_field_type') || 'text'
                });
                seenFields[fName] = true;
              }
            }
          }

          var diOcrUsed = false;
          var diTokenCount = 0;
          var diTaskId = '';

          // ── 2. Native ServiceNow Document Intelligence Engine ──
          if (body.fileBase64 && typeof sn_docintel !== 'undefined' && sn_docintel.DocIntelAPI) {
            try {
              var grCase = new GlideRecord('sn_customerservice_case');
              grCase.initialize();
              grCase.setValue('short_description', 'DocIntel Extraction Staging: ' + fileName);
              var stagingSysId = grCase.insert();
              if (stagingSysId) {
                var base64Data = body.fileBase64.indexOf(',') !== -1 ? body.fileBase64.split(',')[1] : body.fileBase64;
                var sa = new GlideSysAttachment();
                var attId = body.attachmentSysId;
                if (!attId && base64Data) {
                  var decodedBytes = GlideStringUtil.base64DecodeAsBytes(base64Data);
                  attId = sa.write(grCase, (fileName || 'document.jpeg'), 'image/jpeg', decodedBytes);
                }
                if (attId) {
                  var diAPI = new sn_docintel.DocIntelAPI();
                  var taskDefId = '06c3df06473c6610d0a5d76a516d4320';
                  var taskId = diAPI.createTask('DI_' + gs.generateGUID().substring(0, 8), taskDefId, 'sn_customerservice_case', stagingSysId, [attId]);
                  if (taskId && taskId != '-1') {
                    diAPI.processTask(taskId);
                    var grImg = new GlideRecord('sys_di_image');
                    grImg.addQuery('task', taskId);
                    grImg.addNotNullQuery('candidates');
                    grImg.query();
                    if (!grImg.hasNext()) {
                      for (var poll = 0; poll < 15; poll++) {
                        gs.sleep(1000);
                        grImg = new GlideRecord('sys_di_image');
                        grImg.addQuery('task', taskId);
                        grImg.addNotNullQuery('candidates');
                        grImg.query();
                        if (grImg.hasNext()) break;
                      }
                    }
                    if (grImg.next()) {
                      var candStr = grImg.getValue('candidates');
                      if (candStr) {
                        var candObj = JSON.parse(candStr);
                        var docWords = [];
                        if (candObj) {
                          if (Array.isArray(candObj)) {
                            for (var w = 0; w < candObj.length; w++) {
                              if (candObj[w] && candObj[w].text) docWords.push(candObj[w].text);
                            }
                          } else if (Array.isArray(candObj.words)) {
                            for (var w = 0; w < candObj.words.length; w++) {
                              if (candObj.words[w] && candObj.words[w].text) docWords.push(candObj.words[w].text);
                            }
                          } else if (typeof candObj === 'object') {
                            var tokenList = [];
                            for (var tk in candObj) {
                              if (candObj.hasOwnProperty(tk) && candObj[tk] && candObj[tk].text) {
                                tokenList.push(candObj[tk]);
                              }
                            }
                            tokenList.sort(function(a, b) {
                              var bboxA = a.bounding_box || {};
                              var bboxB = b.bounding_box || {};
                              var topA = bboxA.top || 0;
                              var topB = bboxB.top || 0;
                              if (Math.abs(topA - topB) > 18) {
                                return topA - topB;
                              }
                              return (bboxA.left || 0) - (bboxB.left || 0);
                            });

                            var lines = [];
                            var currentLine = [];
                            var lastTop = -1;

                            for (var ti = 0; ti < tokenList.length; ti++) {
                              var tok = tokenList[ti];
                              var tokTop = tok.bounding_box ? tok.bounding_box.top : -1;
                              if (lastTop !== -1 && tokTop !== -1 && Math.abs(tokTop - lastTop) > 18) {
                                if (currentLine.length > 0) {
                                  lines.push(currentLine.join(' '));
                                  currentLine = [];
                                }
                              }
                              currentLine.push(tok.text);
                              if (tokTop !== -1) lastTop = tokTop;
                            }
                            if (currentLine.length > 0) {
                              lines.push(currentLine.join(' '));
                            }

                            if (lines.length > 0) {
                              rawText = lines.join('\n');
                              diOcrUsed = true;
                              diTokenCount = tokenList.length;
                              diTaskId = taskId;
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            } catch (diErr) {
              // Continue with rawText fallback
            }
          }

          // ── 3. Dynamic Field Extraction (Driven by Configured Fields) ──
          var dynamicFields = {};
          var confidence = {};

          var textLines = rawText.split(/\\r?\\n/);

          var SYNONYMS = {
            first_name: ['first name', 'given name', 'given names', 'forename', 'forenames', 'prenom'],
            last_name: ['last name', 'surname', 'family name', 'nom'],
            full_name: ['full name', 'name', 'holder name', 'holder', 'cardholder', 'nom complet', 'nome'],
            date_of_birth: ['date of birth', 'birth date', 'dob', 'born on', 'born', 'date de naissance', 'data di nascita'],
            place_of_birth: ['place of birth', 'birth place', 'born in', 'lieu de naissance', 'luogo di nascita'],
            gender: ['gender', 'sex', 'sexe', 'sexo'],
            nationality: ['nationality', 'citizenship', 'nationalite', 'nazionalita'],
            issue_date: ['date of issue', 'issue date', 'issued on', 'issued', 'date de delivrance'],
            expiry_date: ['date of expiry', 'expiry date', 'valid until', 'expires', 'date dexpiration'],
            address: ['address', 'residential address', 'home address', 'current address', 'adresse'],
            registration_date: ['registration date', 'reg date', 'date of registration', 'registered on'],
            registration_number: ['registration number', 'reg number', 'registration no', 'reg no', 'no d enregistrement'],
            father_name: ['father name', "father's name", 'father', 'fathers name', 'nom du pere'],
            mother_name: ['mother name', "mother's name", 'mother', 'mothers name', 'nom de la mere'],
            license_number: ['license number', 'licence number', 'license no', 'licence no', 'dl no', 'driver license'],
            blood_group: ['blood group', 'blood grp', 'blood type', 'groupe sanguin'],
            categories: ['categories', 'category', 'class', 'vehicle classes'],
            email: ['email', 'e-mail', 'courriel'],
            phone: ['phone', 'mobile', 'tel', 'contact no', 'phone no', 'mobile no', 'cell']
          };

          function normalizeLabelText(str) {
            if (!str) return '';
            var s = ('' + str).toLowerCase();
            try {
              s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            } catch (e) {
              s = s.replace(/[éèêë]/g, 'e')
                   .replace(/[àâä]/g, 'a')
                   .replace(/[îï]/g, 'i')
                   .replace(/[ôö]/g, 'o')
                   .replace(/[ùûü]/g, 'u')
                   .replace(/[ç]/g, 'c')
                   .replace(/[ñ]/g, 'n');
            }
            return s.replace(/['’\`]/g, '').replace(/[\-_/\\.:#]+/g, ' ').replace(/\s+/g, ' ').trim();
          }

          function getVariants(fn) {
            var raw = (fn || '').toLowerCase().trim();
            var norm = normalizeLabelText(raw);
            var vars = [raw];
            if (norm && vars.indexOf(norm) === -1) vars.push(norm);

            var compact = norm.replace(/\s+/g, '');
            if (compact && vars.indexOf(compact) === -1) vars.push(compact);

            if (SYNONYMS[raw]) {
              for (var s = 0; s < SYNONYMS[raw].length; s++) {
                var syn = SYNONYMS[raw][s];
                var synNorm = normalizeLabelText(syn);
                if (vars.indexOf(syn) === -1) vars.push(syn);
                if (synNorm && vars.indexOf(synNorm) === -1) vars.push(synNorm);
                var synCompact = synNorm.replace(/\s+/g, '');
                if (synCompact && vars.indexOf(synCompact) === -1) vars.push(synCompact);
              }
            }

            // Generic handling of composite role names with "_name" or " name"
            // e.g. "head_of_family_name" -> "head of family", "head of family's name", "head of familys name"
            if (norm.indexOf(' name') !== -1 || raw.indexOf('_name') !== -1) {
              var roleRaw = raw.replace(/_name\b/g, '').replace(/\bname\b/g, '').trim();
              var roleNorm = normalizeLabelText(roleRaw);
              if (roleNorm) {
                if (vars.indexOf(roleNorm) === -1) vars.push(roleNorm);
                if (vars.indexOf(roleNorm + ' name') === -1) vars.push(roleNorm + ' name');
                if (vars.indexOf(roleNorm + "'s name") === -1) vars.push(roleNorm + "'s name");
                if (vars.indexOf(roleNorm + 's name') === -1) vars.push(roleNorm + 's name');
              }
            }

            // Generic handling of number variants
            if (norm.indexOf('number') !== -1) {
              var noVar = norm.replace(/\bnumber\b/g, 'no').trim();
              var numVar = norm.replace(/\bnumber\b/g, 'num').trim();
              if (vars.indexOf(noVar) === -1) vars.push(noVar);
              if (vars.indexOf(numVar) === -1) vars.push(numVar);
            }

            return vars;
          }

          function isDateField(fn) {
            var f = (fn || '').toLowerCase().trim();
            return f.indexOf('date') !== -1 || f.indexOf('dob') !== -1;
          }

          function isGenderField(fn) {
            var f = (fn || '').toLowerCase().trim();
            return f === 'gender' || f === 'sex' || f === 'sexe' || f === 'sexo' || f.indexOf('gender') !== -1 || f.indexOf('_sex') !== -1;
          }

          function matchLabelInLine(curLine, lbl) {
            if (!curLine || !lbl) return { matched: false, remainder: '' };
            var lineLower = curLine.toLowerCase();
            var lineNorm = normalizeLabelText(curLine);
            var target = lbl.toLowerCase().trim();
            var targetNorm = normalizeLabelText(lbl);

            // 1. Direct case-insensitive match in lineLower with strict word boundaries
            if (target && target.length >= 2) {
              var pos = 0;
              while ((pos = lineLower.indexOf(target, pos)) !== -1) {
                var startOk = (pos === 0) || /[\s:\-.,#_/\\()']/.test(lineLower.charAt(pos - 1));
                var endPos = pos + target.length;
                var endOk = (endPos >= lineLower.length) || /[\s:\-.,#_/\\()'=]/.test(lineLower.charAt(endPos));
                if (startOk && endOk) {
                  var rem = curLine.substring(endPos).replace(/^[\s:\-—=]+/, '').trim();
                  return { matched: true, remainder: rem };
                }
                pos += 1;
              }
            }

            // 2. Normalized match (punctuation & accent agnostic) with strict word boundaries
            if (targetNorm && targetNorm.length >= 2) {
              var nPos = 0;
              while ((nPos = lineNorm.indexOf(targetNorm, nPos)) !== -1) {
                var nStartOk = (nPos === 0) || lineNorm.charAt(nPos - 1) === ' ';
                var nEndPos = nPos + targetNorm.length;
                var nEndOk = (nEndPos >= lineNorm.length) || lineNorm.charAt(nEndPos) === ' ';
                if (nStartOk && nEndOk) {
                  var targetWords = targetNorm.split(/\s+/).filter(Boolean);
                  var lastWord = targetWords[targetWords.length - 1];
                  var curUnaccented = normalizeLabelText(curLine);
                  var wPos = curUnaccented.indexOf(lastWord);
                  var rem = '';
                  var colonPos = curLine.indexOf(':');
                  if (colonPos !== -1 && colonPos >= (wPos !== -1 ? wPos : 0)) {
                    rem = curLine.substring(colonPos + 1).trim();
                  } else if (wPos !== -1) {
                    rem = curLine.substring(wPos + lastWord.length).replace(/^[\s:\-—=]+/, '').trim();
                  }
                  return { matched: true, remainder: rem };
                }
                nPos += 1;
              }
            }

            return { matched: false, remainder: '' };
          }

          for (var fIdx = 0; fIdx < expectedFields.length; fIdx++) {
            var targetField = expectedFields[fIdx].name;
            var labelVariants = getVariants(targetField);
            var foundValue = '';

            for (var l = 0; l < textLines.length; l++) {
              var curLine = textLines[l].trim();

              for (var v = 0; v < labelVariants.length; v++) {
                var lbl = labelVariants[v];
                var matchRes = matchLabelInLine(curLine, lbl);
                if (matchRes.matched) {
                  var remainder = matchRes.remainder;
                  if ((remainder.length === 0 || (remainder.length === 1 && !/^[a-zA-Z0-9]$/.test(remainder))) && l + 1 < textLines.length) {
                    remainder = textLines[l + 1].trim();
                  }
                  // Clean up date remainder if targetField denotes a date
                  if (isDateField(targetField) && remainder.length >= 2) {
                    var dm = remainder.match(/\b\d{1,2}[\/.\-]\d{1,2}[\/.\-]\d{2,4}\b|\b\d{4}[\/.\-]\d{1,2}[\/.\-]\d{1,2}\b/);
                    if (dm) remainder = dm[0];
                  }
                  // Normalize gender if targetField is gender
                  if (isGenderField(targetField)) {
                    if (/^m(ale)?$/i.test(remainder)) remainder = 'Male';
                    else if (/^f(emale)?$/i.test(remainder)) remainder = 'Female';
                  }
                  // Strip redundant leading secondary label prefix if role matched
                  remainder = remainder.replace(/^(name|nom|prenom|prenoms)[ \t.:\-—=]+/i, '').trim();
                  if (remainder.length >= 1) {
                    foundValue = remainder;
                    break;
                  }
                }
              }
              if (foundValue) break;
            }

            if (foundValue) {
              dynamicFields[targetField] = foundValue;
              confidence[targetField] = 90;
            }
          }

          // ── 3b. Configuration-Driven Identifier Pattern Extraction ──
          // Helpers to classify configured fields semantically without document/country-specific logic
          function isPhoneField(fn) {
            var f = (fn || '').toLowerCase().trim();
            if (f.indexOf('email') !== -1) return false;
            return (
              f.indexOf('phone') !== -1 ||
              f.indexOf('mobile') !== -1 ||
              f.indexOf('tel') !== -1 ||
              f.indexOf('cell') !== -1 ||
              f.indexOf('contact') !== -1
            );
          }

          function isIdentifierField(fn) {
            var f = (fn || '').toLowerCase().trim();
            if (isPhoneField(f)) return false;
            if (f.indexOf('date') !== -1 || f.indexOf('dob') !== -1) return false;
            if (f.indexOf('address') !== -1 || f.indexOf('place') !== -1 || f.indexOf('location') !== -1 || f.indexOf('residence') !== -1) return false;
            if (f.indexOf('photo') !== -1 || f.indexOf('signature') !== -1 || f.indexOf('image') !== -1 || f.indexOf('thumb') !== -1) return false;
            if (f.indexOf('name') !== -1 && f.indexOf('number') === -1 && f.indexOf('_id') === -1) return false;
            return (
              f.indexOf('number') !== -1 ||
              f.indexOf('_no') !== -1 ||
              f.indexOf('no_') !== -1 ||
              f.indexOf('_id') !== -1 ||
              f.indexOf('id_') !== -1 ||
              f === 'id' ||
              f === 'nid' ||
              f.indexOf('identifier') !== -1 ||
              f.indexOf('code') !== -1
            );
          }

          // Check if any identifier field already received a value from label matching
          var extractedIdValue = '';
          for (var efCheck = 0; efCheck < expectedFields.length; efCheck++) {
            var efName = expectedFields[efCheck].name;
            if (isIdentifierField(efName) && dynamicFields[efName]) {
              extractedIdValue = dynamicFields[efName];
              break;
            }
          }

          // If an identifier field is configured on the document but not yet populated,
          // match structured government/document identification patterns in rawText
          var configuredIdFields = [];
          for (var c = 0; c < expectedFields.length; c++) {
            var checkName = expectedFields[c].name;
            if (isIdentifierField(checkName) && !dynamicFields[checkName]) {
              configuredIdFields.push(checkName);
            }
          }

          if (configuredIdFields.length > 0 && !extractedIdValue) {
            var idPatterns = [
              /\b(\d{4}[\s\-]\d{4}[\s\-]\d{4})\b/,
              /\b(\d{5}[\s\-]\d{7}[\s\-]\d{1})\b/,
              /\b(\d{3}[\s\-]\d{2}[\s\-]\d{4})\b/,
              /\b(\d{3,5}[\s\-]\d{3,5}[\s\-]\d{3,5})\b/,
              /\b([A-Z]{1,3}\d{6,10})\b/,
              /\b(\d{8,16})\b/
            ];

            for (var p = 0; p < idPatterns.length; p++) {
              var idMatch = rawText.match(idPatterns[p]);
              if (idMatch && idMatch[1]) {
                var candidateId = idMatch[1].trim();
                if (candidateId.indexOf('/') === -1 && candidateId.length >= 8) {
                  extractedIdValue = candidateId;
                  var targetIdField = configuredIdFields[0];
                  dynamicFields[targetIdField] = extractedIdValue;
                  confidence[targetIdField] = 90;
                  break;
                }
              }
            }
          }

          // ── 3c. Standalone Gender Value Extraction ──
          // If a gender/sex field is configured but not populated by label prefix,
          // match standalone gender tokens present in the document text/tokens
          function isGenderField(fn) {
            var f = (fn || '').toLowerCase().trim();
            return f === 'gender' || f === 'sex' || f === 'sexe' || f === 'sexo' || f.indexOf('gender') !== -1 || f.indexOf('_sex') !== -1;
          }

          var configuredGenderFields = [];
          for (var gi = 0; gi < expectedFields.length; gi++) {
            var gName = expectedFields[gi].name;
            if (isGenderField(gName) && !dynamicFields[gName]) {
              configuredGenderFields.push(gName);
            }
          }

          if (configuredGenderFields.length > 0) {
            var genderMatch = rawText.match(/\b(Male|Female|Homme|Femme|Masculino|Femenino|Männlich|Weiblich)\b/i);
            if (genderMatch && genderMatch[1]) {
              var gVal = genderMatch[1];
              gVal = gVal.charAt(0).toUpperCase() + gVal.slice(1).toLowerCase();
              for (var tg = 0; tg < configuredGenderFields.length; tg++) {
                dynamicFields[configuredGenderFields[tg]] = gVal;
                confidence[configuredGenderFields[tg]] = 90;
                break;
              }
            }
          }

          // ── 3d. Primary Person Name Extraction (Layout/Context-Aware) ──
          // When a primary person name field is configured but lacks an explicit prefix label,
          // extract the cardholder name based on standard name pattern heuristics
          function isPrimaryNameField(fn) {
            var f = (fn || '').toLowerCase().trim();
            if (f.indexOf('father') !== -1 || f.indexOf('mother') !== -1 || f.indexOf('spouse') !== -1 || f.indexOf('husband') !== -1 || f.indexOf('parent') !== -1 || f.indexOf('child') !== -1 || f.indexOf('employer') !== -1) return false;
            return f === 'full_name' || f === 'name' || f === 'holder_name' || f === 'cardholder_name' || f === 'nom_complet' || f === 'nome_completo' || (f === 'first_name' && !hasConfiguredField('full_name'));
          }

          function hasConfiguredField(name) {
            for (var i = 0; i < expectedFields.length; i++) {
              if (expectedFields[i].name.toLowerCase() === name.toLowerCase()) return true;
            }
            return false;
          }

          var configuredNameFields = [];
          for (var ni = 0; ni < expectedFields.length; ni++) {
            var nName = expectedFields[ni].name;
            if (isPrimaryNameField(nName) && !dynamicFields[nName]) {
              configuredNameFields.push(nName);
            }
          }

          if (configuredNameFields.length > 0) {
            // Strategy A: Check if OCR has constituent name labels (e.g. Nom + Prénoms, Surname + Given Name) on nearby lines
            var GIVEN_LABELS = ['first name', 'given name', 'given names', 'forename', 'forenames', 'prenom', 'prenoms'];
            var SURNAME_LABELS = ['last name', 'surname', 'family name', 'nom', 'postnom'];

            var foundGiven = '';
            var foundGivenLine = -1;
            var foundSurname = '';
            var foundSurnameLine = -1;

            for (var nl = 0; nl < textLines.length; nl++) {
              var nameLine = textLines[nl].trim();
              if (!foundGiven) {
                for (var gl = 0; gl < GIVEN_LABELS.length; gl++) {
                  var gMatch = matchLabelInLine(nameLine, GIVEN_LABELS[gl]);
                  if (gMatch.matched && gMatch.remainder) {
                    foundGiven = gMatch.remainder;
                    foundGivenLine = nl;
                    break;
                  }
                }
              }
              if (!foundSurname) {
                for (var sl = 0; sl < SURNAME_LABELS.length; sl++) {
                  var sMatch = matchLabelInLine(nameLine, SURNAME_LABELS[sl]);
                  if (sMatch.matched && sMatch.remainder) {
                    foundSurname = sMatch.remainder;
                    foundSurnameLine = nl;
                    break;
                  }
                }
              }
            }

            var compositeName = '';
            if (foundSurname && foundGiven && Math.abs(foundSurnameLine - foundGivenLine) <= 3) {
              compositeName = (foundSurnameLine < foundGivenLine)
                ? (foundSurname + ' ' + foundGiven)
                : (foundGiven + ' ' + foundSurname);
            } else if (foundSurname && !hasConfiguredField('last_name') && !hasConfiguredField('surname')) {
              compositeName = foundSurname;
            } else if (foundGiven && !hasConfiguredField('first_name') && !hasConfiguredField('given_name')) {
              compositeName = foundGiven;
            }

            if (compositeName) {
              for (var tnc = 0; tnc < configuredNameFields.length; tnc++) {
                dynamicFields[configuredNameFields[tnc]] = compositeName;
                confidence[configuredNameFields[tnc]] = 90;
                break;
              }
            } else {
              // Strategy B: Layout / contextual candidate matching (same-line capitalized word sequence)
              var NAME_STOPWORDS = {
                'government': true, 'republic': true, 'authority': true, 'ministry': true, 'kingdom': true,
                'state': true, 'united': true, 'passport': true, 'national': true, 'identity': true,
                'card': true, 'department': true, 'federal': true, 'union': true, 'commission': true, 'birth': true,
                'certificate': true, 'license': true, 'driving': true, 'registration': true, 'office': true
              };

              for (var li = 0; li < textLines.length; li++) {
                var singleLine = textLines[li].trim();
                // Strictly on the same line: horizontal whitespace only ([ \t]+) to prevent multi-line bleeding
                var lineCandidates = singleLine.match(/\b([A-Z][a-zA-Z]{1,}(?:[ \t]+[A-Z][a-zA-Z]{1,}){1,3})\b/g);
                if (lineCandidates) {
                  var candidateFound = false;
                  for (var nc = 0; nc < lineCandidates.length; nc++) {
                    var candidateName = lineCandidates[nc].trim();
                    var words = candidateName.split(/[ \t]+/);
                    var valid = true;
                    for (var w = 0; w < words.length; w++) {
                      if (NAME_STOPWORDS[words[w].toLowerCase()]) {
                        valid = false;
                        break;
                      }
                    }
                    if (valid && words.length >= 2 && words.length <= 4) {
                      for (var tn = 0; tn < configuredNameFields.length; tn++) {
                        dynamicFields[configuredNameFields[tn]] = candidateName;
                        confidence[configuredNameFields[tn]] = 85;
                        break;
                      }
                      candidateFound = true;
                      break;
                    }
                  }
                  if (candidateFound) break;
                }
              }
            }
          }

          // ── 3e. Email Standard Matcher: ONLY populate if configured ──
          var emailMatch = rawText.match(/([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})/);
          var emailVal = emailMatch ? emailMatch[1].toLowerCase().trim() : '';
          if (emailVal) {
            for (var ef = 0; ef < expectedFields.length; ef++) {
              var efLow = expectedFields[ef].name.toLowerCase();
              if (efLow === 'email' || efLow === 'email_masked' || efLow === 'email_address') {
                dynamicFields[expectedFields[ef].name] = emailVal;
                confidence[expectedFields[ef].name] = 95;
                break;
              }
            }
          }

          // ── 3d. Phone Matcher: ONLY populate configured phone fields with genuine phone numbers ──
          var configuredPhoneFields = [];
          for (var pfi = 0; pfi < expectedFields.length; pfi++) {
            var pName = expectedFields[pfi].name;
            if (isPhoneField(pName) && !dynamicFields[pName]) {
              configuredPhoneFields.push(pName);
            }
          }

          var phoneVal = '';
          if (configuredPhoneFields.length > 0) {
            // Look for numbers with explicit phone keywords or international '+' country code
            var phoneRegexWithIndicator = /(?:phone|mobile|tel|cell|contact|call)[ \t.:#\-]*([+]?[\d \t\-().]{7,18}\d)/i;
            var phoneRegexWithPlus = /(\+\d{1,4}[ \t\-().]{0,2}\d{2,5}[ \t\-().]{1,2}\d{3,5}(?:[ \t\-().]{0,2}\d{0,5})?)/;

            var pMatch = rawText.match(phoneRegexWithIndicator) || rawText.match(phoneRegexWithPlus);
            if (pMatch && pMatch[1]) {
              var candidatePhone = pMatch[1].trim();
              var cleanPhoneDigits = candidatePhone.replace(/\D/g, '');
              var cleanIdDigits = extractedIdValue.replace(/\D/g, '');

              // Never assign the document identification number to a phone field
              if (cleanPhoneDigits.length >= 7 && cleanPhoneDigits !== cleanIdDigits) {
                phoneVal = candidatePhone;
                for (var tpf = 0; tpf < configuredPhoneFields.length; tpf++) {
                  dynamicFields[configuredPhoneFields[tpf]] = phoneVal;
                  confidence[configuredPhoneFields[tpf]] = 90;
                  break;
                }
              }
            }
          }

          // ── 4. Standard Form Auto-Fill Mapping (Convenience without limiting dynamic fields) ──
          function normalizeISODate(dStr) {
            if (!dStr) return '';
            var s = ('' + dStr).trim();
            var ymd = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
            if (ymd) {
              var m = parseInt(ymd[2], 10);
              var d = parseInt(ymd[3], 10);
              return ymd[1] + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
            }
            var dmy = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
            if (dmy) {
              var p1 = parseInt(dmy[1], 10);
              var p2 = parseInt(dmy[2], 10);
              var yr = dmy[3];
              var day = p1;
              var month = p2;
              if (p1 <= 12 && p2 > 12) {
                month = p1;
                day = p2;
              }
              if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                return yr + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day);
              }
            }
            return s;
          }

          var extracted = {
            documentType:   documentType,
            firstName:      dynamicFields.first_name || (dynamicFields.full_name ? dynamicFields.full_name.split(' ')[0] : ''),
            middleName:     dynamicFields.middle_name || (dynamicFields.full_name && dynamicFields.full_name.split(' ').length > 2 ? dynamicFields.full_name.split(' ').slice(1, -1).join(' ') : ''),
            lastName:       dynamicFields.last_name || dynamicFields.surname || (dynamicFields.full_name && dynamicFields.full_name.split(' ').length > 1 ? dynamicFields.full_name.split(' ').slice(-1)[0] : ''),
            dateOfBirth:    normalizeISODate(dynamicFields.date_of_birth || dynamicFields.dob || ''),
            gender:         dynamicFields.gender || dynamicFields.sex || '',
            nationality:    dynamicFields.nationality || dynamicFields.citizenship || '',
            passportNumber: dynamicFields.passport_number || (documentType.toLowerCase().indexOf('passport') !== -1 ? (dynamicFields.document_number || '') : ''),
            nationalId:     dynamicFields.national_id || dynamicFields.nid_number || dynamicFields.aadhaar_number || dynamicFields.id_number || dynamicFields.unhcr_case_number || dynamicFields.family_book_number || dynamicFields.document_number || dynamicFields.tc_kimlik_number || dynamicFields.cpf_number || dynamicFields.license_number || dynamicFields.registration_number || dynamicFields.frc_number || '',
            mobileNumber:   dynamicFields.mobile_number || dynamicFields.phone || dynamicFields.mobile_masked || phoneVal || '',
            email:          dynamicFields.email || dynamicFields.email_masked || emailVal || '',
            address:        dynamicFields.address || '',
            city:           dynamicFields.city || dynamicFields.place_of_birth || dynamicFields.registry_location || '',
            state:          dynamicFields.state || '',
            postalCode:     dynamicFields.postal_code || ''
          };

          response.setStatus(200);
          response.setBody({
            success: true,
            documentType: documentType,
            countryId: countryId,
            countryDocumentId: countryDocumentId,
            fields: dynamicFields,
            extracted: extracted,
            confidence: confidence,
            fileName: fileName,
            rawText: rawText,
            diOcrUsed: diOcrUsed,
            diTokenCount: diTokenCount,
            diTaskId: diTaskId
          });
        } catch (e) {
          response.setStatus(400);
          response.setBody({ success: false, error: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_register_route',
      name: 'Register Application',
      method: 'POST',
      path: '/register',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var famInfo = body.familyInfo || {};
          var head    = body.headOfFamily || {};
          var members = body.members || [];
          var docs    = body.uploadedDocs || [];

          // ── Duplicate Check (1 Application per individual/refugee email/phone) ──
          if (head.email) {
            var grEmailChk = new GlideRecord('u_bridge360_family');
            grEmailChk.addQuery('u_email', head.email);
            grEmailChk.query();
            if (grEmailChk.hasNext()) {
              response.setStatus(409);
              response.setBody({
                success: false,
                error: 'duplicate_email',
                message: 'An application is already registered with this email (' + head.email + '). Please check your existing application via Track Status.'
              });
              return;
            }
          }

          if (head.mobileNumber) {
            var grPhoneChk = new GlideRecord('u_bridge360_member');
            grPhoneChk.addQuery('u_mobile_number', head.mobileNumber);
            grPhoneChk.query();
            if (grPhoneChk.hasNext()) {
              response.setStatus(409);
              response.setBody({
                success: false,
                error: 'duplicate_phone',
                message: 'An application is already registered with this mobile number (' + head.mobileNumber + ').'
              });
              return;
            }
          }

          var seq = new GlideRecord('u_bridge360_family');
          seq.query();
          var count = seq.getRowCount() + 1;
          var numStr = ("000000" + count).slice(-6);

          var appId  = "APP-2026-" + numStr;
          var familyName = famInfo.familyName || (head.lastName ? (head.lastName + " Family") : "Refugee Family");

          var grFam = new GlideRecord('u_bridge360_family');
          grFam.initialize();
          grFam.setValue('u_application_id',    appId);
          grFam.setValue('u_bridge360_id',      '');
          grFam.setValue('u_family_id',         '');
          grFam.setValue('u_family_name',       familyName);
          grFam.setValue('u_country_of_origin', famInfo.countryOfOrigin || 'Unknown');
          grFam.setValue('u_arrival_date',      famInfo.arrivalDate || new GlideDate().getValue());
          grFam.setValue('u_household_size',    famInfo.householdSize || (1 + members.length));
          grFam.setValue('u_primary_language',  famInfo.primaryLanguage || 'English');
          grFam.setValue('u_immigration_status','asylum_applicant');
          grFam.setValue('u_needs_interpreter', famInfo.needsInterpreter ? true : false);
          grFam.setValue('u_priority',          'normal');
          grFam.setValue('u_registration_status', 'submitted');
          grFam.setValue('u_verification_status', 'pending_review');
          grFam.setValue('u_case_status',       'new');
          grFam.setValue('u_assigned_officer',  'Sarah Jenkins');
          grFam.setValue('u_email',             head.email || '');
          grFam.setValue('u_allow_customer_edit', false);
          grFam.setValue('u_doc_request_pending', false);
          var sysFamId = grFam.insert();

          var grHead = new GlideRecord('u_bridge360_member');
          grHead.initialize();
          grHead.setValue('u_family',              sysFamId);
          grHead.setValue('u_refugee_id',          '');
          grHead.setValue('u_is_head',             true);
          grHead.setValue('u_relationship_to_head','self');
          grHead.setValue('u_first_name',          head.firstName  || 'Applicant');
          grHead.setValue('u_middle_name',         head.middleName || '');
          grHead.setValue('u_last_name',           head.lastName   || 'Family');
          grHead.setValue('u_gender',              (head.gender || 'other').toLowerCase());
          grHead.setValue('u_date_of_birth',       head.dateOfBirth  || '');
          grHead.setValue('u_nationality',         head.nationality  || famInfo.countryOfOrigin || '');
          grHead.setValue('u_passport_number',     head.passportNumber || '');
          grHead.setValue('u_national_id',         head.nationalId   || '');
          grHead.setValue('u_mobile_number',       head.mobileNumber || '');
          grHead.setValue('u_email',               head.email        || '');
          grHead.setValue('u_address',             head.address      || '');
          grHead.setValue('u_city',                head.city         || '');
          grHead.setValue('u_state',               head.state        || '');
          grHead.setValue('u_postal_code',         head.postalCode   || '');
          grHead.setValue('u_verification_status', 'pending');
          var headSysId = grHead.insert();

          if (members && members.length > 0) {
            for (var i = 0; i < members.length; i++) {
              var m = members[i];
              var grMem = new GlideRecord('u_bridge360_member');
              grMem.initialize();
              grMem.setValue('u_family',               sysFamId);
              grMem.setValue('u_refugee_id',           '');
              grMem.setValue('u_is_head',              false);
              grMem.setValue('u_relationship_to_head', (m.relationshipToHead || 'other').toLowerCase());
              grMem.setValue('u_first_name',           m.firstName  || '');
              grMem.setValue('u_last_name',            m.lastName   || head.lastName || 'Family');
              grMem.setValue('u_gender',               (m.gender || 'other').toLowerCase());
              grMem.setValue('u_date_of_birth',        m.dateOfBirth || '');
              grMem.setValue('u_nationality',          m.nationality || head.nationality || famInfo.countryOfOrigin || '');
              grMem.setValue('u_verification_status',  'pending');
              grMem.insert();
            }
          }

          if (docs && docs.length > 0) {
            for (var d = 0; d < docs.length; d++) {
              var doc = docs[d];
              var grDoc = new GlideRecord('u_bridge360_document');
              grDoc.initialize();
              grDoc.setValue('u_family',              sysFamId);
              grDoc.setValue('u_member',              headSysId);
              grDoc.setValue('u_application_id',      appId);
              grDoc.setValue('u_document_type',       (doc.documentType || 'passport').toLowerCase().replace(/\\s+/g, '_'));
              grDoc.setValue('u_file_name',           doc.fileName  || '');
              grDoc.setValue('u_file_size',           doc.fileSize  || '');
              grDoc.setValue('u_verification_status', 'pending');
              if (doc.extractedJson) {
                grDoc.setValue('u_extracted_json', typeof doc.extractedJson === 'string' ? doc.extractedJson : JSON.stringify(doc.extractedJson));
              }
              grDoc.insert();
            }
          }

          var email = head.email || '';
          if (email) {
            try {
              var mail = new GlideRecord('sys_email');
              mail.initialize();
              mail.setValue('type', 'send-ready');
              mail.setValue('recipients', email);
              mail.setValue('subject', 'Bridge360 Registration Received — ' + appId);
              mail.setValue('body', 'Hello ' + (head.firstName || 'Applicant') + ',\\n\\nYour registration for the Bridge360 Refugee Support System has been successfully received.\\n\\nYour Application ID is: ' + appId + '\\n\\nYou can track your application status at any time on the portal by entering your Application ID.\\n\\nThank you,\\nBridge360 Refugee Support System');
              mail.setValue('content_type', 'text/plain');
              mail.insert();
            } catch (mErr) {}
          }

          response.setStatus(200);
          response.setBody({
            success: true,
            applicationId: appId,
            message: 'Registration submitted successfully. Application ID: ' + appId
          });
        } catch (e) {
          response.setStatus(400);
          response.setBody({ success: false, error: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_verify_doc_route',
      name: 'Admin Verify Document',
      method: 'POST',
      path: '/verify-document',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var documentSysId = body.documentSysId;
          var status = body.status || 'verified';
          var notes = body.notes || '';

          if (!documentSysId) {
            response.setStatus(400);
            response.setBody({ success: false, message: 'documentSysId required' });
            return;
          }

          var grDoc = new GlideRecord('u_bridge360_document');
          if (!grDoc.get(documentSysId)) {
            response.setStatus(404);
            response.setBody({ success: false, message: 'Document not found' });
            return;
          }

          grDoc.setValue('u_verification_status', status);
          if (notes) grDoc.setValue('u_verification_notes', notes);
          grDoc.update();

          var sysFamId = grDoc.getValue('u_family');
          var sysMemId = grDoc.getValue('u_member');

          var memAllVerified = true;
          var grMemDocs = new GlideRecord('u_bridge360_document');
          grMemDocs.addQuery('u_member', sysMemId);
          grMemDocs.query();
          while (grMemDocs.next()) {
            if (grMemDocs.getValue('u_verification_status') !== 'verified') {
              memAllVerified = false;
              break;
            }
          }

          var mintedMemberRid = '';
          if (memAllVerified && sysMemId) {
            var grMem = new GlideRecord('u_bridge360_member');
            if (grMem.get(sysMemId)) {
              if (!grMem.getValue('u_refugee_id')) {
                var countM = new GlideRecord('u_bridge360_member');
                countM.addNotNullQuery('u_refugee_id');
                countM.query();
                var mSeq = ("000000" + (countM.getRowCount() + 1)).slice(-6);
                mintedMemberRid = "RID-2026-" + mSeq;
                grMem.setValue('u_refugee_id', mintedMemberRid);
              }
              grMem.setValue('u_verification_status', 'verified');
              grMem.update();
            }
          }

          var grFam = new GlideRecord('u_bridge360_family');
          if (!grFam.get(sysFamId)) {
            response.setStatus(200);
            response.setBody({ success: true, message: 'Document updated' });
            return;
          }

          var famMembers = new GlideRecord('u_bridge360_member');
          famMembers.addQuery('u_family', sysFamId);
          famMembers.query();
          var totalMem = famMembers.getRowCount();
          var verifiedMem = 0;
          var headRid = '';

          while (famMembers.next()) {
            var rId = famMembers.getValue('u_refugee_id');
            if (rId) {
              verifiedMem++;
              if (famMembers.getValue('u_is_head') === 'true') {
                headRid = rId;
              }
            }
          }

          var familyIdMinted = '';
          var prevFamRegStatus = (grFam.getValue('u_registration_status') || '').toLowerCase();
          if (verifiedMem === totalMem && totalMem > 0) {
            var famSeq = grFam.getValue('u_application_id').split('-')[2] || ("000000" + (totalMem + 1)).slice(-6);

            if (totalMem === 1 && headRid) {
              familyIdMinted = headRid;
              grFam.setValue('u_family_id',    headRid);
              grFam.setValue('u_bridge360_id', headRid);
            } else {
              familyIdMinted = "FAM-2026-" + famSeq;
              grFam.setValue('u_family_id',    familyIdMinted);
              grFam.setValue('u_bridge360_id', familyIdMinted);
            }

            grFam.setValue('u_registration_status', 'approved');
            grFam.setValue('u_verification_status', 'verified');
            grFam.setValue('u_case_status',         'active');
            grFam.update();

            var email = grFam.getValue('u_email');
            if (email && prevFamRegStatus !== 'approved') {
              try {
                var prefLang = (grFam.getValue('u_primary_language') || 'English').toLowerCase();
                var isTa = prefLang.indexOf('ta') !== -1 || prefLang.indexOf('tamil') !== -1;
                var isAr = prefLang.indexOf('ar') !== -1 || prefLang.indexOf('arabic') !== -1;
                
                var mailSubject = '🎉 Bridge360 Official Approval — Your Family ID is ' + familyIdMinted;
                if (isTa) mailSubject = '🎉 Bridge360 அதிகாரப்பூர்வ ஒப்புதல் — உங்கள் குடும்ப ஐடி: ' + familyIdMinted;
                if (isAr) mailSubject = '🎉 الموافقة الرسمية من Bridge360 — معرف العائلة الخاص بك هو ' + familyIdMinted;

                var bodyHtml = '<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1E293B; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #FFFFFF;">' +
                  '<p>Dear Applicant, 👋</p>' +
                  '<p>🎉 <strong>Congratulations! Your Bridge360 application has been officially approved!</strong></p>' +
                  '<p>We’re happy to let you know that the <strong>Bridge360 Case Management Team</strong> has successfully reviewed and verified all the documents submitted with your application. ✅</p>' +
                  '<h3 style="color: #1D4ED8; margin-top: 24px; margin-bottom: 8px;">🆔 Your Official Family ID</h3>' +
                  '<p style="font-size: 1.25rem; font-weight: bold; color: #1D4ED8; background-color: #EFF6FF; padding: 12px 16px; border-radius: 8px; display: inline-block; border: 1px solid #BFDBFE;">' + familyIdMinted + '</p>' +
                  '<p>🔐 Please keep your Family ID safe. You can use it to access the <strong>Bridge360 Customer Portal</strong> and track your application information.</p>' +
                  '<p>🌐 <strong>You can now log in using your Family ID:</strong><br><strong style="color: #1D4ED8;">' + familyIdMinted + '</strong></p>' +
                  '<p>💙 Thank you for choosing Bridge360. We are committed to supporting you and your family every step of the way.</p><br>' +
                  '<p>Warm regards,<br><strong>🌉 Bridge360 Refugee Support Services</strong><br><em>🤝 Connecting families. Supporting futures.</em></p>' +
                  '</div>';

                var mail = new GlideRecord('sys_email');
                mail.initialize();
                mail.setValue('type', 'send-ready');
                mail.setValue('recipients', email);
                mail.setValue('subject', mailSubject);
                mail.setValue('body', bodyHtml);
                mail.setValue('content_type', 'text/html');
                mail.insert();
              } catch (eM) {}
            }
          } else if (status === 'rejected') {
            var emailR = grFam.getValue('u_email');
            if (emailR) {
              try {
                var mailR = new GlideRecord('sys_email');
                mailR.initialize();
                mailR.setValue('type', 'send-ready');
                mailR.setValue('recipients', emailR);
                mailR.setValue('subject', '⚠️ Bridge360 Document Verification — Action Required for ' + grFam.getValue('u_application_id'));
                
                var rejectHtml = '<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1E293B; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #FFFFFF;">' +
                  '<p>Dear Applicant, 👋</p>' +
                  '<p>⚠️ <strong>Action is required on your Bridge360 application.</strong></p>' +
                  '<p>During our document verification process, one of the documents submitted for your application could not be verified. 📄</p>' +
                  '<h3 style="color: #DC2626; margin-top: 24px; margin-bottom: 8px;">📋 Verification Details</h3>' +
                  '<p><strong>Application ID:</strong><br><code>' + grFam.getValue("u_application_id") + '</code></p>' +
                  '<p><strong>❌ Reason:</strong><br><span style="color: #DC2626;">' + (notes || 'Document details could not be validated against official criteria.') + '</span></p>' +
                  '<h3 style="color: #1D4ED8; margin-top: 24px; margin-bottom: 8px;">🔄 What should you do?</h3>' +
                  '<p>Please log in to the <strong>Bridge360 Customer Portal</strong> and review the verification feedback.</p>' +
                  '<p>📤 Upload a <strong>clear and legible copy</strong> of the required document after correcting the issue.</p>' +
                  '<p>🔎 Before submitting, please make sure:</p>' +
                  '<ul>' +
                  '<li>📄 The entire document is visible</li>' +
                  '<li>👀 All important information can be clearly read</li>' +
                  '<li>✨ The uploaded copy is clear and not blurry</li>' +
                  '</ul>' +
                  '<p>Once your corrected document is submitted, our team will review it again. ✅</p>' +
                  '<p>💙 Thank you for your cooperation and patience.</p><br>' +
                  '<p>Warm regards,<br><strong>🌉 Bridge360 Refugee Support Services</strong><br><em>🤝 Connecting families. Supporting futures.</em></p>' +
                  '</div>';

                mailR.setValue('body', rejectHtml);
                mailR.setValue('content_type', 'text/html');
                mailR.insert();
              } catch (eMr) {}
            }
          }

          response.setStatus(200);
          response.setBody({
            success:         true,
            documentStatus:  status,
            memberRefugeeId: mintedMemberRid,
            familyId:        familyIdMinted,
            familyStatus:    grFam.getValue('u_registration_status'),
          });
        } catch (e) {
          response.setStatus(400);
          response.setBody({ success: false, error: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_request_documents_route',
      name: 'Request Additional Documents',
      method: 'POST',
      path: '/request-documents',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var applicationId = body.applicationId || '';
          var documentType = body.documentType || 'Additional Identity Document';
          var notes = body.notes || 'Please provide additional supporting documentation.';

          var grFam = new GlideRecord('u_bridge360_family');
          grFam.addQuery('u_application_id', applicationId)
            .addOrCondition('u_bridge360_id', applicationId)
            .addOrCondition('u_family_id', applicationId);
          grFam.query();

          if (!grFam.next()) {
            response.setStatus(404);
            response.setBody({ success: false, message: 'Application not found' });
            return;
          }

          grFam.setValue('u_verification_status', 'requires_review');
          grFam.update();

          var email = grFam.getValue('u_email');
          if (email) {
            try {
              var mail = new GlideRecord('sys_email');
              mail.initialize();
              mail.setValue('type', 'send-ready');
              mail.setValue('recipients', email);
              mail.setValue('subject', '⚠️ Bridge360 Document Verification — Action Required for ' + grFam.getValue('u_application_id'));
              
              var reqHtml = '<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1E293B; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #FFFFFF;">' +
                '<p>Dear Applicant, 👋</p>' +
                '<p>⚠️ <strong>Action is required on your Bridge360 application.</strong></p>' +
                '<p>During our document verification process, additional documentation was requested for your application. 📄</p>' +
                '<h3 style="color: #DC2626; margin-top: 24px; margin-bottom: 8px;">📋 Verification Details</h3>' +
                '<p><strong>Application ID:</strong><br><code>' + grFam.getValue("u_application_id") + '</code></p>' +
                '<p><strong>Document Type Requested:</strong><br>' + documentType + '</p>' +
                '<p><strong>❌ Reason / Instructions:</strong><br><span style="color: #DC2626;">' + notes + '</span></p>' +
                '<h3 style="color: #1D4ED8; margin-top: 24px; margin-bottom: 8px;">🔄 What should you do?</h3>' +
                '<p>Please log in to the <strong>Bridge360 Customer Portal</strong> and review the verification feedback.</p>' +
                '<p>📤 Upload a <strong>clear and legible copy</strong> of the requested document.</p>' +
                '<p>💙 Thank you for your cooperation and patience.</p><br>' +
                '<p>Warm regards,<br><strong>🌉 Bridge360 Refugee Support Services</strong><br><em>🤝 Connecting families. Supporting futures.</em></p>' +
                '</div>';

              mail.setValue('body', reqHtml);
              mail.setValue('content_type', 'text/html');
              mail.insert();
            } catch (eM) {}
          }

          response.setStatus(200);
          response.setBody({ success: true, message: 'Request sent successfully via email to ' + email });
        } catch (e) {
          response.setStatus(400);
          response.setBody({ success: false, error: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_send_otp_route',
      name: 'Send OTP',
      method: 'POST',
      path: '/send-otp',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var identifier = body.applicationId || body.identifier || (request.queryParams && request.queryParams.applicationId ? request.queryParams.applicationId[0] : '');
          if (!identifier) {
            response.setStatus(400);
            response.setBody({ success: false, message: 'applicationId or identifier required' });
            return;
          }

          identifier = (identifier + '').trim();
          var gr = new GlideRecord('u_bridge360_family');
          gr.addQuery('u_application_id', identifier)
            .addOrCondition('u_bridge360_id', identifier)
            .addOrCondition('u_family_id', identifier);
          gr.query();

          if (!gr.next()) {
            response.setStatus(404);
            response.setBody({ success: false, message: 'ID not found. Please check and try again.' });
            return;
          }

          var email   = gr.getValue('u_email') || '';
          var otp     = ("" + Math.floor(100000 + Math.random() * 900000));
          var expiry  = "" + (new Date().getTime() + 600000);

          gr.setValue('u_otp_code',   otp);
          gr.setValue('u_otp_expiry', expiry);
          gr.update();

          if (email) {
            try {
              var mail = new GlideRecord('sys_email');
              mail.initialize();
              mail.setValue('type', 'send-ready');
              mail.setValue('recipients', email);
              mail.setValue('subject', '🔐 Your Bridge360 Security Code — ' + identifier);
              
              var otpHtml = '<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1E293B; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #FFFFFF;">' +
                '<p>Hello, 👋</p>' +
                '<p>🔐 <strong>Your Bridge360 one-time security code (OTP) is ready.</strong></p>' +
                '<h3 style="color: #0D9488; margin-top: 24px; margin-bottom: 8px;">🔢 Your Security Code</h3>' +
                '<p style="font-size: 1.8rem; font-weight: bold; letter-spacing: 4px; color: #0D9488; background-color: #F0FDF4; padding: 14px 20px; border-radius: 8px; display: inline-block; border: 1px solid #BBF7D0;">' + otp + '</p>' +
                '<p>⏱️ <strong>This code expires in 10 minutes.</strong></p>' +
                '<p>🛡️ For your security, <strong>never share this code with anyone</strong>, including anyone claiming to represent Bridge360.</p>' +
                '<h3 style="color: #475569; margin-top: 24px; margin-bottom: 8px;">📌 Request Details</h3>' +
                '<p><strong>Application / Family ID:</strong><br><code>' + identifier + '</code></p>' +
                '<p>🚨 <strong>Did not request this code?</strong></p>' +
                '<p>If you did not request this security code, you can safely ignore this email. No further action is required.</p>' +
                '<p>💙 Thank you for using Bridge360.</p><br>' +
                '<p>Warm regards,<br><strong>🌉 Bridge360 Refugee Support Services</strong><br><em>🔒 Your information. Your security. Your support.</em></p>' +
                '</div>';

              mail.setValue('body', otpHtml);
              mail.setValue('content_type', 'text/html');
              mail.insert();
            } catch (mailErr) {}
          }

          response.setStatus(200);
          response.setBody({
            success:     true,
            otp:         otp,
            maskedEmail: email ? email.replace(/(.{2}).+(@.+)/, '$1***$2') : 'your registered email address'
          });
        } catch (e) {
          response.setStatus(400);
          response.setBody({ success: false, error: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_verify_otp_route',
      name: 'Verify OTP',
      method: 'POST',
      path: '/verify-otp',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var identifier = body.applicationId || body.identifier;
          var otp = body.otp;

          if (!identifier || !otp) {
            response.setStatus(400);
            response.setBody({ success: false, message: 'identifier and otp required' });
            return;
          }

          identifier = (identifier + '').trim();
          otp        = (otp + '').trim();

          var gr = new GlideRecord('u_bridge360_family');
          gr.addQuery('u_application_id', identifier)
            .addOrCondition('u_bridge360_id', identifier)
            .addOrCondition('u_family_id', identifier);
          gr.query();

          if (!gr.next()) {
            response.setStatus(404);
            response.setBody({ success: false, message: 'ID not found.' });
            return;
          }

          var storedOtp    = gr.getValue('u_otp_code')   || '';
          var expiryStr    = gr.getValue('u_otp_expiry')  || '0';
          var expiryMs     = parseInt(expiryStr, 10);
          var nowMs        = new Date().getTime();

          var isValid = (storedOtp && storedOtp === otp);

          if (!isValid) {
            if (nowMs > expiryMs && storedOtp) {
              response.setStatus(400);
              response.setBody({ success: false, message: 'Security code has expired. Please request a new one.' });
              return;
            }
            response.setStatus(400);
            response.setBody({ success: false, message: 'Incorrect security code. Please try again.' });
            return;
          }

          gr.setValue('u_otp_code',   '');
          gr.setValue('u_otp_expiry', '');
          gr.update();

          var sysFamId = gr.getValue('sys_id');

          var family = {
            sys_id:              sysFamId,
            applicationId:       gr.getValue('u_application_id'),
            bridge360Id:         gr.getValue('u_bridge360_id'),
            familyId:            gr.getValue('u_family_id'),
            familyName:          gr.getValue('u_family_name'),
            countryOfOrigin:     gr.getValue('u_country_of_origin'),
            householdSize:       parseInt(gr.getValue('u_household_size') || '1', 10),
            primaryLanguage:     gr.getValue('u_primary_language'),
            immigrationStatus:   gr.getValue('u_immigration_status'),
            needsInterpreter:    gr.getValue('u_needs_interpreter') === 'true',
            priority:            gr.getValue('u_priority'),
            assignedOfficer:     gr.getValue('u_assigned_officer'),
            registrationStatus:  gr.getValue('u_registration_status'),
            verificationStatus:  gr.getValue('u_verification_status'),
            caseStatus:          gr.getValue('u_case_status'),
            email:               gr.getValue('u_email'),
          };

          var members = [];
          var grMem = new GlideRecord('u_bridge360_member');
          grMem.addQuery('u_family', sysFamId);
          grMem.query();
          while (grMem.next()) {
            members.push({
              sys_id:              grMem.getValue('sys_id'),
              refugeeId:           grMem.getValue('u_refugee_id') || '',
              isHead:              grMem.getValue('u_is_head') === 'true',
              relationship:        grMem.getValue('u_relationship_to_head'),
              firstName:           grMem.getValue('u_first_name'),
              middleName:          grMem.getValue('u_middle_name'),
              lastName:            grMem.getValue('u_last_name'),
              gender:              grMem.getValue('u_gender'),
              dateOfBirth:         grMem.getValue('u_date_of_birth'),
              nationality:         grMem.getValue('u_nationality'),
              passportNumber:      grMem.getValue('u_passport_number'),
              nationalId:          grMem.getValue('u_national_id'),
              mobileNumber:        grMem.getValue('u_mobile_number'),
              email:               grMem.getValue('u_email'),
              address:             grMem.getValue('u_address'),
              city:                grMem.getValue('u_city'),
              state:               grMem.getValue('u_state'),
              postalCode:          grMem.getValue('u_postal_code'),
              verificationStatus:  grMem.getValue('u_verification_status') || 'pending',
            });
          }

          var documents = [];
          var grDoc = new GlideRecord('u_bridge360_document');
          grDoc.addQuery('u_family', sysFamId);
          grDoc.query();
          while (grDoc.next()) {
            documents.push({
              sys_id:             grDoc.getValue('sys_id'),
              documentType:       grDoc.getValue('u_document_type'),
              fileName:           grDoc.getValue('u_file_name'),
              fileSize:           grDoc.getValue('u_file_size'),
              verificationStatus: grDoc.getValue('u_verification_status'),
              verificationNotes:  grDoc.getValue('u_verification_notes'),
            });
          }

          var cases = [];
          var grCase = new GlideRecord('u_bridge360_case');
          grCase.addQuery('u_family', sysFamId);
          grCase.query();
          while (grCase.next()) {
            cases.push({
              sys_id:          grCase.getValue('sys_id'),
              title:           grCase.getValue('u_title'),
              category:        grCase.getValue('u_category'),
              status:          grCase.getValue('u_status'),
              priority:        grCase.getValue('u_priority'),
              assignedOfficer: grCase.getValue('u_assigned_officer'),
              openedDate:      grCase.getValue('u_opened_date'),
              dueDate:         grCase.getValue('u_due_date'),
            });
          }

          var tickets = [];
          var grTkt = new GlideRecord('u_bridge360_ticket');
          grTkt.addQuery('u_family', sysFamId);
          grTkt.query();
          while (grTkt.next()) {
            tickets.push({
              sys_id:      grTkt.getValue('sys_id'),
              subject:     grTkt.getValue('u_subject'),
              category:    grTkt.getValue('u_category'),
              status:      grTkt.getValue('u_status'),
              description: grTkt.getValue('u_description'),
            });
          }

          response.setStatus(200);
          response.setBody({
            success:   true,
            family:    family,
            members:   members,
            documents: documents,
            cases:     cases,
            tickets:   tickets,
          });
        } catch (e) {
          response.setStatus(400);
          response.setBody({ success: false, error: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_dashboard_route',
      name: 'Get Dashboard Status',
      method: 'GET',
      path: '/dashboard/{applicationId}',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        var pathParams = request.pathParams;
        var appId = pathParams.applicationId;
        var gr = new GlideRecord('u_bridge360_family');
        gr.addQuery('u_application_id', appId)
          .addOrCondition('u_bridge360_id', appId)
          .addOrCondition('u_family_id', appId);
        gr.query();
        if (!gr.next()) {
          response.setStatus(404);
          response.setBody({ success: false, message: 'Record not found' });
          return;
        }
        var info = {
          success: true,
          applicationId: gr.getValue('u_application_id'),
          bridge360Id: gr.getValue('u_bridge360_id'),
          familyId: gr.getValue('u_family_id'),
          familyName: gr.getValue('u_family_name'),
          registrationStatus: gr.getValue('u_registration_status'),
          verificationStatus: gr.getValue('u_verification_status'),
          caseStatus: gr.getValue('u_case_status'),
          assignedOfficer: gr.getValue('u_assigned_officer'),
        };
        response.setStatus(200);
        response.setBody(info);
      })(request, response);`,
    },
    {
      $id: 'bridge360_request_docs_route',
      name: 'Admin Request Additional Documents',
      method: 'POST',
      path: '/request-documents',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var appId    = body.applicationId;
          var docType  = body.documentType || 'Identity Document';
          var notes    = body.notes || 'Please provide updated document for verification.';

          if (!appId) {
            response.setStatus(400);
            response.setBody({ success: false, message: 'applicationId required' });
            return;
          }

          var grFam = new GlideRecord('u_bridge360_family');
          grFam.addQuery('u_application_id', appId);
          grFam.query();
          if (!grFam.next()) {
            response.setStatus(404);
            response.setBody({ success: false, message: 'Application not found' });
            return;
          }

          grFam.setValue('u_doc_request_pending', true);
          grFam.setValue('u_doc_request_type', docType);
          grFam.setValue('u_doc_request_notes', notes);
          grFam.update();

          var toEmail = grFam.getValue('u_email');
          if (toEmail) {
            var mail = new GlideRecord('sys_email');
            mail.initialize();
            mail.setValue('type', 'send-ready');
            mail.setValue('recipients', toEmail);
            mail.setValue('subject', 'Action Required: Additional Document Requested (' + appId + ')');
            mail.setValue('body', 'Dear ' + grFam.getValue('u_family_name') + ',\\n\\nOur verification officers require additional documentation to complete your application:\\n\\nRequested Document: ' + docType + '\\nNotes: ' + notes + '\\n\\nPlease log in to your Bridge360 Customer Dashboard to upload your document.\\n\\nThank you,\\nBridge360 Support');
            mail.setValue('content_type', 'text/plain');
            mail.insert();
          }

          response.setStatus(200);
          response.setBody({ success: true, message: 'Document request sent to customer' });
        } catch (e) {
          response.setStatus(400);
          response.setBody({ success: false, error: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_upload_customer_doc_route',
      name: 'Customer Uploads Requested Document',
      method: 'POST',
      path: '/upload-customer-doc',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var appId    = body.applicationId;
          var docType  = body.documentType || 'Passport';
          var fileName = body.fileName || 'Uploaded_Document.pdf';
          var fileSize = body.fileSize || '1.2 MB';
          var rawText  = body.rawText || '';

          if (!appId) {
            response.setStatus(400);
            response.setBody({ success: false, message: 'applicationId required' });
            return;
          }

          var grFam = new GlideRecord('u_bridge360_family');
          grFam.addQuery('u_application_id', appId);
          grFam.query();
          if (!grFam.next()) {
            response.setStatus(404);
            response.setBody({ success: false, message: 'Application not found' });
            return;
          }

          var sysFamId = grFam.getValue('sys_id');
          var grHead = new GlideRecord('u_bridge360_member');
          grHead.addQuery('u_family', sysFamId);
          grHead.addQuery('u_is_head', true);
          grHead.query();
          var headSysId = grHead.next() ? grHead.getValue('sys_id') : '';

          var grDoc = new GlideRecord('u_bridge360_document');
          grDoc.initialize();
          grDoc.setValue('u_family', sysFamId);
          grDoc.setValue('u_member', headSysId);
          grDoc.setValue('u_application_id', appId);
          grDoc.setValue('u_document_type', docType.toLowerCase().replace(/\\s+/g, '_'));
          grDoc.setValue('u_file_name', fileName);
          grDoc.setValue('u_file_size', fileSize);
          grDoc.setValue('u_verification_status', 'in_review');
          if (rawText) {
            grDoc.setValue('u_ocr_text', rawText);
          }
          var newDocSysId = grDoc.insert();

          grFam.setValue('u_doc_request_pending', false);
          grFam.setValue('u_verification_status', 'in_review');
          grFam.update();

          response.setStatus(200);
          response.setBody({
            success: true,
            message: 'Document uploaded successfully and queued for review.',
            documentSysId: newDocSysId
          });
        } catch (e) {
          response.setStatus(400);
          response.setBody({ success: false, error: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_toggle_customer_edit_route',
      name: 'Admin Toggle Customer Edit Permission',
      method: 'POST',
      path: '/toggle-customer-edit',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var appId     = body.applicationId;
          var allowEdit = body.allowEdit ? true : false;

          var grFam = new GlideRecord('u_bridge360_family');
          grFam.addQuery('u_application_id', appId);
          grFam.query();
          if (!grFam.next()) {
            response.setStatus(404);
            response.setBody({ success: false, message: 'Application not found' });
            return;
          }

          grFam.setValue('u_allow_customer_edit', allowEdit);
          grFam.update();

          response.setStatus(200);
          response.setBody({ success: true, allowCustomerEdit: allowEdit });
        } catch (e) {
          response.setStatus(400);
          response.setBody({ success: false, error: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_update_customer_profile_route',
      name: 'Customer Update Profile Details',
      method: 'POST',
      path: '/update-customer-profile',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var appId = body.applicationId;
          var grFam = new GlideRecord('u_bridge360_family');
          grFam.addQuery('u_application_id', appId);
          grFam.query();
          if (!grFam.next()) {
            response.setStatus(404);
            response.setBody({ success: false, message: 'Application not found' });
            return;
          }

          var canEdit = grFam.getValue('u_allow_customer_edit') === 'true' || grFam.getValue('u_allow_customer_edit') === true;
          if (!canEdit) {
            response.setStatus(403);
            response.setBody({ success: false, message: 'Profile editing is locked by administration.' });
            return;
          }

          var profile = body.profile || {};
          if (profile.primaryLanguage) grFam.setValue('u_primary_language', profile.primaryLanguage);
          if (profile.email) grFam.setValue('u_email', profile.email);
          grFam.update();

          var sysFamId = grFam.getValue('sys_id');
          var grHead = new GlideRecord('u_bridge360_member');
          grHead.addQuery('u_family', sysFamId);
          grHead.addQuery('u_is_head', true);
          grHead.query();
          if (grHead.next()) {
            if (profile.mobileNumber) grHead.setValue('u_mobile_number', profile.mobileNumber);
            if (profile.email) grHead.setValue('u_email', profile.email);
            if (profile.address) grHead.setValue('u_address', profile.address);
            if (profile.city) grHead.setValue('u_city', profile.city);
            if (profile.state) grHead.setValue('u_state', profile.state);
            if (profile.postalCode) grHead.setValue('u_postal_code', profile.postalCode);
            grHead.update();
          }

          response.setStatus(200);
          response.setBody({ success: true, message: 'Profile updated successfully.' });
        } catch (e) {
          response.setStatus(400);
          response.setBody({ success: false, error: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_run_agentic_workflow_route',
      name: 'Run Orchestrated Agentic Workflow',
      method: 'POST',
      path: '/run-agentic-workflow',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var familySysId = body.familySysId;
          var api = new global.Bridge360API();
          var result = api.runAgenticWorkflow(familySysId);

          if (result.success) {
            response.setStatus(200);
            response.setBody(result);
          } else {
            response.setStatus(400);
            response.setBody(result);
          }
        } catch (e) {
          response.setStatus(500);
          response.setBody({ success: false, error: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_agent_start_route',
      name: 'Assistant — Start / Continue Conversation',
      method: 'POST',
      path: '/agent/start',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var api = new global.Bridge360API();
          var result = api.agentStart(body);

          response.setStatus(result && result.success ? 200 : 400);
          response.setBody(result);
        } catch (e) {
          response.setStatus(500);
          response.setBody({ success: false, message: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_agent_status_route',
      name: 'Assistant — Poll Conversation Status',
      method: 'GET',
      path: '/agent/status',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var cid = request.queryParams ? request.queryParams.conversationId : null;
          if (cid instanceof Array) cid = cid[0];

          var api = new global.Bridge360API();
          var result = api.agentStatus(cid);

          response.setStatus(result && result.success ? 200 : 400);
          response.setBody(result);
        } catch (e) {
          response.setStatus(500);
          response.setBody({ success: false, message: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_agent_approve_route',
      name: 'Assistant — Approve / Reject Supervised Action',
      method: 'POST',
      path: '/agent/approve',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var approve = body.approve === true || body.approve === 'true';
          var api = new global.Bridge360API();
          var result = api.agentApprove(body.conversationId, approve);

          response.setStatus(result && result.success ? 200 : 400);
          response.setBody(result);
        } catch (e) {
          response.setStatus(500);
          response.setBody({ success: false, message: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_agent_diag_route',
      name: 'Assistant — GenAI Diagnostic Probe',
      method: 'GET',
      path: '/agent/diag',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var prompt = request.queryParams ? request.queryParams.prompt : null;
          if (prompt instanceof Array) prompt = prompt[0];
          if (!prompt) prompt = 'Reply with one short friendly sentence to confirm you are reachable.';

          var api = new global.Bridge360API();
          var result = api.diagGenAI(prompt);

          response.setStatus(200);
          response.setBody(result);
        } catch (e) {
          response.setStatus(500);
          response.setBody({ success: false, message: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_agent_case_summary_route',
      name: 'Assistant — Case Summary + Next Actions',
      method: 'POST',
      path: '/agent/case-summary',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var api = new global.Bridge360API();
          var result = api.getCaseSummary(body.familySysId, body.language);

          response.setStatus(result && result.success ? 200 : 400);
          response.setBody(result);
        } catch (e) {
          response.setStatus(500);
          response.setBody({ success: false, message: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_agent_draft_decision_route',
      name: 'Assistant — Draft Decision + Justification',
      method: 'POST',
      path: '/agent/draft-decision',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var api = new global.Bridge360API();
          var result = api.draftDecision(body.familySysId, body.language);

          response.setStatus(result && result.success ? 200 : 400);
          response.setBody(result);
        } catch (e) {
          response.setStatus(500);
          response.setBody({ success: false, message: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_agent_draft_message_route',
      name: 'Assistant — Draft Customer Message',
      method: 'POST',
      path: '/agent/draft-message',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var api = new global.Bridge360API();
          var result = api.draftCustomerMessage(body.familySysId, body.intent, body.language);

          response.setStatus(result && result.success ? 200 : 400);
          response.setBody(result);
        } catch (e) {
          response.setStatus(500);
          response.setBody({ success: false, message: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_agent_apply_decision_route',
      name: 'Assistant — Apply Verification Decision',
      method: 'POST',
      path: '/agent/apply-decision',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var api = new global.Bridge360API();
          var result = api.applyVerificationDecision(body.familySysId, body.decision, body.notes);

          response.setStatus(result && result.success ? 200 : 400);
          response.setBody(result);
        } catch (e) {
          response.setStatus(500);
          response.setBody({ success: false, message: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_create_ticket_route',
      name: 'Create Support Ticket',
      method: 'POST',
      path: '/create-ticket',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var appId    = body.applicationId || '';
          var category = body.category || 'General Issue';
          var subject  = body.subject || 'Support Ticket';
          var desc     = body.description || '';

          var grFam = new GlideRecord('u_bridge360_family');
          grFam.addQuery('u_application_id', appId)
            .addOrCondition('u_bridge360_id', appId)
            .addOrCondition('u_family_id', appId);
          grFam.query();
          var sysFamId = grFam.next() ? grFam.getValue('sys_id') : '';

          var grCount = new GlideRecord('u_bridge360_ticket');
          grCount.query();
          var tSeq = ("00000" + (grCount.getRowCount() + 1)).slice(-5);
          var tktId = "TKT-2026-" + tSeq;

          var grTkt = new GlideRecord('u_bridge360_ticket');
          grTkt.initialize();
          if (sysFamId) grTkt.setValue('u_family', sysFamId);
          grTkt.setValue('u_ticket_id', tktId);
          grTkt.setValue('u_application_id', appId);
          grTkt.setValue('u_subject', subject);
          grTkt.setValue('u_category', category);
          grTkt.setValue('u_description', desc);
          grTkt.setValue('u_status', 'open');
          var sysTktId = grTkt.insert();

          response.setStatus(200);
          response.setBody({
            success: true,
            ticketId: tktId,
            sys_id: sysTktId,
            message: 'Support ticket created successfully.'
          });
        } catch (e) {
          response.setStatus(400);
          response.setBody({ success: false, error: e.toString() });
        }
      })(request, response);`,
    },
    {
      $id: 'bridge360_reply_ticket_route',
      name: 'Reply to Support Ticket',
      method: 'POST',
      path: '/reply-ticket',
      active: true,
      authentication: false,
      script: `(function process(request, response) {
        response.setContentType('application/json');
        try {
          var body = request.body.data || {};
          if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch(e) {}
          } else if (!body || Object.keys(body).length === 0) {
            try { body = JSON.parse(request.body.dataString || '{}'); } catch(e) {}
          }

          var ticketId = body.ticketId || '';
          var message  = body.message || '';
          var author   = body.author || 'Case Management Officer';
          var role     = body.role || 'admin';

          var grTkt = new GlideRecord('u_bridge360_ticket');
          grTkt.addQuery('sys_id', ticketId)
            .addOrCondition('u_subject', 'CONTAINS', ticketId);
          grTkt.query();

          var sysFamId = '';
          var subject = 'Support Ticket';
          if (grTkt.next()) {
            sysFamId = grTkt.getValue('u_family');
            subject  = grTkt.getValue('u_subject') || subject;
            if (role === 'admin') {
              grTkt.setValue('u_status', 'in_progress');
            }
            grTkt.update();
          }

          var customerEmail = '';
          var prefLang = 'English';
          if (sysFamId) {
            var grFam = new GlideRecord('u_bridge360_family');
            if (grFam.get(sysFamId)) {
              customerEmail = grFam.getValue('u_email') || '';
              prefLang = grFam.getValue('u_primary_language') || 'English';
            }
          }

          if (role === 'admin' && customerEmail) {
            try {
              var pLang = (prefLang || 'English').toLowerCase();
              var isTa = pLang.indexOf('ta') !== -1 || pLang.indexOf('tamil') !== -1;
              var isAr = pLang.indexOf('ar') !== -1 || pLang.indexOf('arabic') !== -1;

              var mailSubject = '💬 Support Ticket Response — ' + (ticketId || subject);
              if (isTa) mailSubject = '💬 ஆதரவு டிக்கெட் பதில் — ' + (ticketId || subject);
              if (isAr) mailSubject = '💬 الرد على تذكرة الدعم — ' + (ticketId || subject);

              var replyHtml = '<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1E293B; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #FFFFFF;">' +
                '<p>Dear Applicant, 👋</p>' +
                '<p>💬 <strong>The Bridge360 Case Management Officer has responded to your Support Ticket.</strong></p>' +
                '<h3 style="color: #2563EB; margin-top: 20px; margin-bottom: 8px;">📌 Ticket Details</h3>' +
                '<p><strong>Ticket ID / Subject:</strong> <code>' + (ticketId || subject) + '</code></p>' +
                '<h3 style="color: #059669; margin-top: 20px; margin-bottom: 8px;">💬 Officer Response</h3>' +
                '<div style="background-color: #F0FDF4; border-left: 4px solid #10B981; padding: 14px 18px; border-radius: 6px; margin: 12px 0;">' +
                '<p style="margin: 0; font-weight: bold; color: #047857;">' + author + ' (Bridge360 Officer):</p>' +
                '<p style="margin: 6px 0 0 0; color: #1E293B;">' + message + '</p>' +
                '</div>' +
                '<p>🌐 You can view the full conversation history and respond anytime on the <strong>Bridge360 Customer Portal</strong>.</p><br>' +
                '<p>Warm regards,<br><strong>🌉 Bridge360 Refugee Support Services</strong><br><em>🤝 Connecting families. Supporting futures.</em></p>' +
                '</div>';

              var mail = new GlideRecord('sys_email');
              mail.initialize();
              mail.setValue('type', 'send-ready');
              mail.setValue('recipients', customerEmail);
              mail.setValue('subject', mailSubject);
              mail.setValue('body', replyHtml);
              mail.setValue('content_type', 'text/html');
              mail.insert();
            } catch (mErr) {}
          }

          response.setStatus(200);
          response.setBody({
            success: true,
            message: 'Response posted successfully. Email notification sent to ' + (customerEmail || 'applicant') + '.'
          });
        } catch (e) {
          response.setStatus(400);
          response.setBody({ success: false, error: e.toString() });
        }
      })(request, response);`,
    },
  ],
});
