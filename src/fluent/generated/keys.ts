import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    bom_json: {
                        table: 'sys_module'
                        id: '06d60cef70eb4a2f90a961f9e0519a50'
                    }
                    br_enforce_consent_and_protection: {
                        table: 'sys_script'
                        id: '872dde1cc7a946c7a330eb4deb9e60f7'
                    }
                    bridge360_agent_apply_decision_route: {
                        table: 'sys_ws_operation'
                        id: '40cdc77c41d74bcc8842095e4eeac4b0'
                    }
                    bridge360_agent_approve_route: {
                        table: 'sys_ws_operation'
                        id: 'd7ccc3a74ba749b182d7f790cc3e00ac'
                    }
                    bridge360_agent_case_summary_route: {
                        table: 'sys_ws_operation'
                        id: 'b08fd0e2c4fc4edbacd486f07b5acff2'
                    }
                    bridge360_agent_diag_route: {
                        table: 'sys_ws_operation'
                        id: '1771b266b4a34de09b1cd1638c61f674'
                    }
                    bridge360_agent_draft_decision_route: {
                        table: 'sys_ws_operation'
                        id: '957f3354e12b47ddae90432887b2b5fd'
                    }
                    bridge360_agent_draft_message_route: {
                        table: 'sys_ws_operation'
                        id: 'd88840323fa549edb713c5d6bbf27ef2'
                    }
                    bridge360_agent_start_route: {
                        table: 'sys_ws_operation'
                        id: '4f42ffbdc292464388111cc7963ec5a6'
                    }
                    bridge360_agent_status_route: {
                        table: 'sys_ws_operation'
                        id: 'e58b657bb6074276b9aabe58b6387944'
                    }
                    bridge360_ai_verification: {
                        table: 'sys_script_include'
                        id: '1f270128ce334a098356b757e43efe84'
                    }
                    bridge360_api: {
                        table: 'sys_script_include'
                        id: 'b3b9d587ccec4cf5a4c11247b99d3a05'
                    }
                    bridge360_create_ticket_route: {
                        table: 'sys_ws_operation'
                        id: 'cf6b5ac1f2dc42939163efc4bd51f431'
                    }
                    bridge360_dashboard_route: {
                        table: 'sys_ws_operation'
                        id: 'bb925993163b4a11b6e1190565158fee'
                    }
                    bridge360_extract_doc_route: {
                        table: 'sys_ws_operation'
                        id: '081e526c946846a5986ca21db2845b8d'
                    }
                    bridge360_register_route: {
                        table: 'sys_ws_operation'
                        id: 'c890d0af047a4b019ae0eecb3c082ae5'
                    }
                    bridge360_reply_ticket_route: {
                        table: 'sys_ws_operation'
                        id: 'fe45408e34dc4d52aa8a7fb43133d6e9'
                    }
                    bridge360_request_docs_route: {
                        table: 'sys_ws_operation'
                        id: '599c38143de84c71bf53f49fc534d7f4'
                    }
                    bridge360_request_documents_route: {
                        table: 'sys_ws_operation'
                        id: '38ebcd875a4547a7ade756ff0105fd6f'
                    }
                    bridge360_rest_api: {
                        table: 'sys_ws_definition'
                        id: 'c118114f770e424c97c13a0f9553e9cc'
                    }
                    bridge360_run_agentic_workflow_route: {
                        table: 'sys_ws_operation'
                        id: '1595e5794dd94e16a168b7f4118ef63b'
                    }
                    bridge360_send_otp_route: {
                        table: 'sys_ws_operation'
                        id: 'f7d250c2d2de456c9cc573db087a20c7'
                    }
                    bridge360_toggle_customer_edit_route: {
                        table: 'sys_ws_operation'
                        id: '482c8e615bfb41b5a262e583d2c81583'
                    }
                    bridge360_update_customer_profile_route: {
                        table: 'sys_ws_operation'
                        id: '346861510f3a477fb87bb8cf60079dc8'
                    }
                    bridge360_upload_customer_doc_route: {
                        table: 'sys_ws_operation'
                        id: '221d2e56d84944759e4050a28080d0c0'
                    }
                    bridge360_verification_agent: {
                        table: 'sys_script_include'
                        id: '1309814c8d604d21a9feba21d76d7a15'
                    }
                    bridge360_verify_doc_route: {
                        table: 'sys_ws_operation'
                        id: 'ba05cb0d629b42e1929ddae37bb17d37'
                    }
                    bridge360_verify_otp_route: {
                        table: 'sys_ws_operation'
                        id: '606af266a3ec4fb98fac45ee9cf5bef9'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '1aa96d40a5e54ebe9249a720ccfa612e'
                    }
                }
                composite: [
                    {
                        table: 'sys_choice_set'
                        id: '03361c5d596d49caa39ed02fa423d8a1'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_priority'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0383398266d44f529aeeee28716754e3'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_contact_portal_url'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '03a32721af6043b5b891c850f0ae324d'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_completed_at'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '03ca1d82793d44379edccac6bb81c2f4'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_category'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '047ff12be39a4c54888655669a92f75b'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_document_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '05374f2920ad48d0a8f074c309cb87d4'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_verification_status'
                            value: 'rejected'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '05629682de97462894c1fe119f258981'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_country_of_origin'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '056e864679d24638a227fbb237998c84'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_family'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '063cb5c6eb5d496f86e66c79f8077ef0'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_consent_status'
                            value: 'withheld'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0644e56a388f46fbb8f4b362e582b038'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_status'
                            value: 'in_progress'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '07769aa932854f18bcdf57f4d849c041'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_category'
                            value: 'document_update'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '07965bb974f048688f360b33289afce7'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_otp_expiry'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '07a3b1a298324749b0392a515c251301'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_primary_document_types'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '07d1c5e296504e309f4c0477997ab656'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_service_type'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '085102e3a43e420987750bc0d24e4791'
                        key: {
                            name: 'u_bridge360_verification_request'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '08caf0133a17496daf27b9f0fcfa9c92'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_document_category'
                            value: 'family_relationship'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '08d09b34759e4acda36508b8e3916c27'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_application_id'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '09c8dea14d624bba8faa00ee93a8136a'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_extracted_json'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0ae985501dfc45919128e105fd371174'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_document_type'
                            value: 'birth_certificate'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0b4095b38a294384b986c32eb08801d6'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_alternative_document_types'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: '0c9486d8feab46969a027bd1bf15c64d'
                        deleted: false
                        key: {
                            application_file: 'f4ee552715294b00b64870ab547d3a0e'
                            source_artifact: '9273002f432840a591c3115f791fd518'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0cf8b0de44354a03b7594da235993e26'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_member'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0ec7b5f0e6e14dec915156266ab15663'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_verification_status'
                            value: 'pending_review'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0f0f0975a1614090b70ef8c4ecbeed65'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_immigration_status'
                            value: 'asylum_applicant'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0f2cd0b62c684db4bc28138c8e6e5913'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_relationship_to_head'
                            value: 'spouse'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '0fd5e4693ba2465bb7f21b11e03bb847'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_registration_status'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0ff87c63157340e68427ea703a32cd1f'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_relationship_to_head'
                            value: 'son'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '12a4921f9495481b994f71fcf6c4a4d3'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_category'
                            value: 'housing'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '131e9d6bdee247c8bdd91bdb340b9c07'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_protection_review_required'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1369cd5824844d239ed807f57557ddb6'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_transliteration_notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '136bccf60b9445ddb340fe6f945bf04f'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_is_head'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '137cfced57554894ac566f4f7571055b'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_refugee_id'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '14137a7b26654594af8aef66ca423b51'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '150ff217a4804b8e9f3da1a75238ebc7'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_address'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '15cb99dc798a4c19a7f9d564d6e363f9'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_alternative_document_types'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '15f64a5b5bd144cf8344412bd7748c5c'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_allow_customer_edit'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '160787bce8594b97a49f7a90e0bfe69d'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_document_type'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1610aeb5ebfb47048bba8cc870199b9a'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_verification_status'
                            value: 'in_review'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1628cce8532743e084003749824a7c8a'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_claim_type'
                            value: 'parent_child'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '16bc4ab8418940158bcd75e5885a99d4'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_priority'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '16e29b67970440178026f6e6f34dd605'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_family'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '174476f85ffb46e797561de14dc03a8e'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_family_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1880a717037e45448d2f2dbbfc062d32'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_status'
                            value: 'in_progress'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '18a4df2f4dd44e8ab4eb867b5937d3a8'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_postal_code'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '18b5f774759e4e9890fe4c865290010f'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_state'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '1986305856fd44838fced50f373f236a'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_immigration_status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1993869af2e04bfba548b80f89cf12aa'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_typical_fields'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '19a2160f9ff047e689ed3e2d3ac3b2ff'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_relationship_to_head'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '19c7171ddcf140eaa393308354204b17'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_middle_name'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1a3869466fc54a7bac8df5686385c763'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1ab5eb1f6c424e2aa0b1c46e76845e1c'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_mobile_number'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '1af29ca60d9c4ad380163937a44ab45f'
                        key: {
                            name: 'u_bridge360_country'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1b890e71b7994c068ccf0893e7d115ec'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_immigration_status'
                            value: 'refugee_granted'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1e2dcd98d896423fb1189c9193c9b5c5'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_language'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1eec70992b3348a19846a39bf396ea50'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1f32ffc751004054b925bf58aad4a429'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_priority'
                            value: 'normal'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1fd05c11791745f9b6fb70150bac6be1'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2137d3fb27af41768551feddc98cade8'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_source'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '213ca05ac94947288f1906dd4ea519c9'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_active'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '214842e276fa4fb8918a7026e19f30b0'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_verification_status'
                            value: 'verified'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '218d5f12a5b9425b8c0149c628903565'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '21ecec55a34e49ab8caffbceffdcf634'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_application_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '21fe13adfb6b44d3a1ec3b40cb719a42'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_electronic_verification_available'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '226e5deeb6ad4673a816b2e4b03f6376'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_completed_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '22daa06fac044089b0ce9b5f88781aec'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_strictness'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '22f19499e1054227a3ccfd868e0a88e2'
                        deleted: true
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_category'
                            value: 'legal'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '23b6f24283004e02bc95d41c05531eff'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_verification_method'
                            value: 'REFERENCE_ONLY'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '242f41d154844b5da616f5831a426248'
                        key: {
                            name: 'u_bridge360_country_document_field'
                            element: 'u_country_document'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '244971fdcb2f46c3928f36cf4e341cea'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_national_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '24890166ee064e18a533784f07dd3da1'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_status'
                            value: 'discrepancy_flagged'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '2569b899ebd047c5adecd490d7be4676'
                        key: {
                            name: 'u_bridge360_document'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '26d662b883a84a0dbc8dc134eb911b18'
                        key: {
                            name: 'u_bridge360_country_document_field'
                            element: 'u_field_type'
                            value: 'date'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '27774b5e4ee04b87a4203c4eb61249c3'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_naming_convention'
                            value: 'compound'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '28c3741fe3414d5a981940658e1d0b2b'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_family'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '28ebf215f8584f1181946332124006c6'
                        deleted: false
                        key: {
                            name: 'global/index.js.map'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '291c7114c6d54cf0a66b5fed9e0acd92'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_priority'
                            value: 'critical'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2921f88ff23240e2873a813b5442b668'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_mobile_number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '294729c4564e4a6f93596ca29320b056'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_middle_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2a5a0534e37b4feea345ee2b97f31c3e'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_pending_raw'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2ac325878e9e46cba85ee733ae972d66'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2adad5ca8c754d808bc5c0e7fac6d95f'
                        key: {
                            name: 'u_bridge360_country_document_field'
                            element: 'u_notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '2b1223c5e27f4cae8601c4285ec841e0'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2b16c5aa72fb4e58940f2e4e8b53d917'
                        key: {
                            name: 'u_bridge360_country_document_field'
                            element: 'u_field_type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2b4bfa477a5548dc9f705b0d2aad60d2'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_verification_guidance'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2c0d81276d444eeeaebad2ed2fb04091'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_status'
                            value: 'verified'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2c68cb669ad74e898617c2ff1bd3efdf'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2d8ab92727a648658206158ca2dea12e'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_family'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2d8fcd2f47174a558a24ed734069d387'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_status'
                            value: 'open'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2f404e61814b4618a4f19414a8337f16'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_status'
                            value: 'draft'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2f8f7a21ea474fec9582aa9a271a4d8f'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_pending_action'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '301f8e6392504282adc8ecb82ac18fc4'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_document_type'
                            value: 'national_id'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3082db171cad42e4a9300983088da0c5'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_registration_status'
                            value: 'approved'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '30e323e511ab4ed1b0df46650e629ca3'
                        deleted: true
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_category'
                            value: 'healthcare'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '31a227f9d47a4c7ea4882eb409b3291b'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_verification_method'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '31fb871c9745495fb024c1681d94333d'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_service_type'
                            value: 'food'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '32b6bac39f2348b19b5e333db4f02aba'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_doc_request_notes'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3309e6794a944529a2aa7ef8ee10b8ea'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_city'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '332245f922ec4886943104dd1e690dc8'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3345261ec76644c98423649f9647e1c1'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_service_type'
                            value: 'legal'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3498abfd50ce42f6b70398a17f454af4'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_api_available'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '34eacbc7ed184e4c94580564f98346ca'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_claim_type'
                            value: 'address_verification'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '355ac85549174e5c87140114a8199f69'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_consent_required'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '35f4ddc853034a0a81ec2f02e00b15be'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_verification_notes'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '364985d4c9b44e99ad5fa71f309e47e4'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_claim_type'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3654c866f6c941c98b848bd7f951c9c9'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_application_id'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '36cd3b07858f4f2c8c312a5d49716455'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_family'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '36e51eb4b04a4aa682be39fac86e75bf'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_immigration_status'
                            value: 'temporary_protection'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3714b294d4a84af082a81ae203f478c9'
                        deleted: true
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_verification_status'
                            value: 'pending'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3840aa4f8519441eb993a8d96a9e78a6'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_registration_status'
                            value: 'submitted'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '39368ce728a24b4c9a6d353026d88d94'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_subject'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '39c8b424c259418bafd37c7de94efe5f'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_status'
                            value: 'closed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '3a21d7b53fe749a99ede2d485faa0844'
                        key: {
                            name: 'u_bridge360_ticket'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3a80236f6ec0492588de71c0de217259'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_needs_interpreter'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3a8361e972ed4504abdf36bba81f53b5'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_family_name'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3b802a1e3c8648bca3d7d569724deaf3'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_consent_status'
                            value: 'pending'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3bc3b7db5ba4408a86cff0a2d05bff7e'
                        key: {
                            name: 'u_bridge360_country_document_field'
                            element: 'u_field_name'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3ceff83a114543bbb481994c1bf34e1e'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_pending_summary'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3d20b11ef6434ece87a331b182e4de44'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_bridge360_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3dd2e210de494a97a6b269b8345f5eeb'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_family'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '3e771bd05ecf4e02846c28f563ebeb60'
                        key: {
                            name: 'u_bridge360_ticket'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3effdc5d370f480d9462ade6e60e00ca'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_request_type'
                            value: 'document_authenticity'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3f59760d047e42f9b435517be968d97c'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_registration_status'
                            value: 'under_review'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3f625704e57b4c60b3b1eec20c4922dc'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_authority'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '413f37ba315042ef96397babac2b8cf7'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_issuing_authority_desc'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '422f88c60f344aabb7babda7813b1669'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '42596858346444ce8dec69813e1d5d07'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_arrival_date'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '42a617bc8d23401291a7f40978223541'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_authority_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4390db5facda424e9fd8b3f53e438615'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_ticket_id'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '43af1769351144ed9730c9c4ffad6865'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_dispatched_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '43fd37d52e694c37a07599b9255d9197'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_relationship_to_head'
                            value: 'father'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '445ef2b5e9fb413f9300908b46eaaec0'
                        deleted: true
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_priority'
                            value: 'low'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '448162b1f35f4dd482c0508e8d4b9c00'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_consent_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4494a3c3488e4c5d9d3834e6ad27ad6f'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_country'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '45ba1771fcf243f89cc16cc3ab82a5de'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_gender'
                            value: 'female'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '45c8fbc6ec7c4414b36b661814d659bc'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_security_features'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: '45e0d7df543c472a96717ba491c75e85'
                        deleted: false
                        key: {
                            name: 'global/main.js.map'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '47ff464a8bd3437f9ed0f0cac2a1489b'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_active'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4841e15ada774575b4479170c621d9f5'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_category'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '496af3ad61a6477baa9862b3ff858317'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_category'
                            value: 'education'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '497a6531ed2448708d2a9b279e8701d4'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_claim_type'
                            value: 'primary_identity'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '498a3258664941e4ae32be61b1a2b92a'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4a6a7a6db7cc4c40979f1f889302bc2b'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_active'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4b90474e0ff240ff94a17e529dc11188'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_category'
                            value: 'resettlement'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4c1ea15b6857481798fff004af48335e'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_active'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4c2b50689d004ad5b11737cb8f07b0f7'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_gender'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '4cf0ced961a74d45b0d5af68e42b5142'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_category'
                            value: 'general'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4cf3392b1d034356bb906cda55c3b1d1'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_protection_review_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4dd2887f8d6c4e778fcbe972763d6ed2'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '4e464c86b6c8498490837a5ce16d2529'
                        key: {
                            name: 'u_bridge360_member'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '4f06affeefed432ab1393a474ffec89e'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '500c1ecb9fb1454e920a497dd674e1c0'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_active'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '508332f88c884465822dd634cca90c1a'
                        deleted: true
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_partner_agency_name'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '52a0429fed0b42989e7ce1cd2e71e55e'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_verification_status'
                            value: 'verified'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '533a9f7366e7480ea92aec5c0b6a3ebf'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_city'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '537b96c7ce2f4cdf8e0ff304a65734a7'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_country_name'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '53a8defa74c74a1b84faf9533651d69a'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '53d548c42c5f448bb9112a9d61334156'
                        key: {
                            name: 'u_bridge360_country_document_field'
                            element: 'u_active'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '554e832d41034820bc2a6be155445365'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_assigned_officer'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '55e9ed39e0eb4e64bdf1f59314e557fd'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_scripts_used'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '564c903cc738424e9bbc988804bb0815'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_family'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '567cc5e01c3b480d81cfcce5a6bc05ec'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_gender'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '567d3083229a48efa076367e269f50c0'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '570d7460a8fd45f0bb947e2fc86e97f5'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_assigned_officer'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '57af384445034832ab166f3beb563093'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_category'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5854fa4bbd1c47e89409a320114f5e09'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_target_table'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5945887ef0ce4f008f388f21062c08b2'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '59e0b7392b0246bd8a8afa2b0e93fad6'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '59eeb2ca0ed346cf8be6eb71247f7895'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_due_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5a1d835d6d4f46faa8cfb4ac83325276'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_needs_interpreter'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5a5ddf5e38794b9c86ff9474d3508198'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_document'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5b11e15514ed4f1381a813786b7ceda3'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_officer_notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '5b3271a4ee15446a93941f108636ddaa'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_verification_method'
                            value: 'AUTHORIZED_API'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5b610f4a8a164783a982760afe88fac9'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5ba73471ed6e4be2bbb65407384c819a'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_pending_action'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5bb38adefa1b496e847b045024ccf308'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '5cd5ede927094314b4acd2c04be374bc'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_priority'
                            value: 'critical'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '5dbe21b18af94460b382c7a5baefb72c'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_document_category'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5eb67ad4526e470390466a3a98a9085d'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5f390b01656a4be1835cf91ed02b1bea'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_registration_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5f41c96eb6f74ac8b63891ac4812a266'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_primary_language'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5f55ac1527254ade85543610f9a7ef8e'
                        key: {
                            name: 'u_bridge360_country_document_field'
                            element: 'u_field_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5f70c10dbfb5434682c4c25a6981c4f8'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_priority'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '600f76c20ab74af3ab9408e7a0e1f41b'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_member'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '607273ccaf69477faeb90b78efff068a'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_relationship_to_head'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '6094959a4b4b4a9dbc6d4b271a2e5e84'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_verification_status'
                            value: 'rejected'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '60a01673896f423095b83e9ed5ba6b24'
                        key: {
                            name: 'u_bridge360_case'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '60c0949801dd443db2897e2619be8f77'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_status'
                            value: 'in_progress'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6125c89907c84c3c998d0327136010d2'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_scripts_used'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '61cd1c9e17db40d393ed1e8bbc584cbe'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_country'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '6220f734c13b4848920caf7151d01fa6'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_relationship_to_head'
                            value: 'sibling'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6223a4cc85cc451db38ce0b3792f7eb7'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_priority'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '622b78e6d62f443f884a184ed16cca22'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_email'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '638c864942874bf09bf66732f0184ee2'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '63bdc4880c114a7a8b2c7211b42db6de'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '645abe5d83eb42458a1faba559286d97'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_verification_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '650358b14e014a0a80ec7087c37f6220'
                        deleted: true
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_application_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '65154feec6244cd2b420a36d70122ae1'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_target_record'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '65f2e9822c194bc6994a215c49c21ce0'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_issuing_authority_desc'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '662e374eb6574a2e8d31f7d6115633e4'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_status'
                            value: 'pending_protection_review'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '66a5fac39d0a4d82b84f2fccb37ea7ed'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_country'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '66bb6c977c6b4e73bca2a8f44587be45'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6750dc5556f94cccb8c10f072714317f'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_first_name'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '68e49e14387a441f9d82b4ccaf5b5a56'
                        deleted: true
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '69c2afc4f2f94011adb9c343b11894d4'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_consent_status'
                            value: 'granted'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6a791f273c124217982c54ca114a43d2'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_ticket_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6b0d15e0ddd44874a15b7cb9c204a5d7'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_category'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6bcf0b7626494e8aa3a2f8586181999c'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_country_document'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6cbbc4943ab04e6881937e52419e7201'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6ce67f7bad13457e9b5e8788d7de419f'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_national_id'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6d8ae434f3474b65a1411fb76bf490ab'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_otp_code'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '6e26b962db8a4e6887a9481afa5e1bb0'
                        deleted: true
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_status'
                            value: 'pending'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '6e745c46de7c4d9fa4f775f0403a4d98'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_document_type'
                            value: 'police_clearance'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '6e9162ec95a04282866263b0c82c689a'
                        key: {
                            name: 'u_bridge360_verification_request'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '708295dddef74e78a6f97e5673b5cf6b'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_email'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '711b569fe9c44d0fbe32601eb33268dd'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_passport_number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '725283edb46d4b959f6b58cae3db58e7'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_strictness'
                            value: 'flexible_humanitarian'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '729ab9afc90d41c7b71e7f51f09b17c2'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_service_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '72bf898a02204198a271d4ff10224329'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_gender'
                            value: 'male'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '73ccaeb93b8648879c96000d5cbcbf30'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '742775bfb0b64c359fdbc9b42bb5437a'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_gender'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '74a39e6894c44b25a8cd9737f73a6033'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_category'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '74c6d23e03af4a18a791be076dc17e14'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '752ae596e521497fb7e60f3c08102e67'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_country'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '75c0ab67dac941ce84083012032d463d'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_description'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '75eeb1cd46344173a55d278168debbea'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_relationship_to_head'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '76ae2ac4e80c4811bd2ca3202b1becd8'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_objective'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7765a3db66e34a0e93fefdbaaf4df61b'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_naming_convention'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '77a81f89a55d4fda819e3336ef8c1d21'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_nationality'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '77ddcc1427164aeab6dbc8c5d0ac3bb3'
                        key: {
                            name: 'u_bridge360_case'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '781f91df16d54801889ff2cba064f55d'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_relationship_to_head'
                            value: 'other'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '787882cd97594cac841d033058db35e2'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_title'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '78c66e031e84472697c06cbf2f5848b3'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_dispatched_at'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '78e3856762334299b0aed3bfef659fb8'
                        key: {
                            name: 'u_bridge360_family'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '79511b9a86b940edaf526d94df7b8647'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_security_features'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '795f86716efa41f38cc96ded8b26e2b7'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_document_category'
                            value: 'address'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '79e462fe581846578daea682cfec9b4e'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_file_size'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7a43de094f4147ccad8b33e38f25c742'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_primary_language'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7a7b7c5cac554289a099ed7acef00163'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_family'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7a869c54f55e4e4e84ebf4d6b8eebf6e'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_case_status'
                            value: 'active'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7aa9c65fae934cd79700e7a2c7d5e4f7'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_agent'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7aad414dbbe546d78cc703565093b10c'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_messages'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7b272fcd7ff445c3958e18bdfa97a13f'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_immigration_status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7b960e4685624d4086fd5bad154bacfc'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7c71130909fe43999002ebb6f279ec82'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7c997497e31c4a0787e0c9441538e376'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_service_type'
                            value: 'translation'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7d9312f7a1f24d4db797cb4fc4b6fadc'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_verification_notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7dd40523cbb24cee8466f80acadfdd8f'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_officer_notes'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7e124f1bf6fd42e9bd5c9cc2c56dcf5e'
                        key: {
                            name: 'u_bridge360_country_document_field'
                            element: 'u_field_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7f1669e89f0e4b5bb96e10847e6f0629'
                        deleted: true
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_status'
                            value: 'open'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7f38598681a942139c7d6c6f14cf3693'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_country_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8083da56de8043918c0ce2b8526b89b2'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_date_of_birth'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '8086d579db2d44da94618098b4b95168'
                        key: {
                            name: 'u_bridge360_country_document_field'
                            element: 'u_field_type'
                            value: 'image'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '80944f00baab445abddab25b3a021ecb'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_naming_convention'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '80cfcc72e6f94ec394d49e2726850e5f'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_status'
                            value: 'completed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '82662ea45e7b4e97b3abe47f4f6bf98f'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_request_type'
                            value: 'consular_query'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '82cf0fa8b52247ca962a395c3bdfd3ca'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_verification_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '83691fd7874d449f905d6b8f2af2d149'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_nationality'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8375c14299e34ffe9bf61b74a27ce92c'
                        key: {
                            name: 'u_bridge360_country_document_field'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '83edfb0bc53347a7bd915a5c258ebe00'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_assigned_officer'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '84ba5e1452bc449190d7707309513d36'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_status'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '867df1718877465ab969476c9f100cae'
                        key: {
                            name: 'u_bridge360_country_document'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '86a46d5afbea46d2a627cee9b004c5d5'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_document_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '870449994f084b8ab486d83f84ddb17a'
                        deleted: true
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_registration_status'
                            value: 'verified'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '873ce073fcde4ac0a46505539c68dbc5'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_doc_request_pending'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '874a67f401464c4fa915124beb2d4961'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_case_status'
                            value: 'new'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '8788096e9f6144e2af5695eb7d654db7'
                        key: {
                            name: 'u_bridge360_referral'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '87bd5993630d48348cf6a9a7988692c2'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_min_confidence_threshold'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8812ddab260846149cae2badfbc5b239'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_country'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '88e2d38ed81c416eb7f2c9a5a8e4ff05'
                        key: {
                            name: 'u_bridge360_country_document_field'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '89217c3003c842a6a2027cc1dbc40a0f'
                        key: {
                            name: 'u_bridge360_country_document_field'
                            element: 'u_country_document'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8a492ad810d34170ad16f989d3d2715e'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_document_type'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8a52daa1f4364000b0bc39f133c782a3'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8b236ac585a8494c839f6f4c74ac9956'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_source'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8bc6357103a94e52a1a461605621d9a9'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_ocr_text'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8cb7d132deae4b8eacc3616e8aa507e6'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_messages'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8d7b732944c640c0b0acee76d76eae96'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_member'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8d7c85f8b898437197f06d35e56fe439'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '8dbc4bfaef7e4f4e93eba6aca07d744e'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_verification_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8e0a49273b044f50aada9f503ac19b43'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_subject'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8e31efd0f2774a3fab4e993f9486e81d'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_verification_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8e9a9789255a4e26baa13f0c41d8c135'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_local_name'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8f4253e898974d5fa8f088e86c2a780f'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_min_confidence_threshold'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8fe6c8a882c8474298a50809ed934526'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_postal_code'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8feb8e20e71c416fb82917f6adc19293'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_language'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '8ff239ca8dcc499bbf14eb96b0f422df'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_naming_convention'
                            value: 'single_name'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9017d7a56e9441a8a8e9f0cc684448cc'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_response_sla_days'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '91078f75503a46bf9050d2ba6085fc1d'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_active'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '921f1021ed524f3eb889faf38f3d9b23'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_contact_email'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9233d348ff3b4cf0b49cb0ec077c1782'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_protection_review_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact'
                        id: '9273002f432840a591c3115f791fd518'
                        deleted: false
                        key: {
                            name: 'bridge360.do - BYOUI Files'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '928c6265bb2a42a499fe39a74495e35f'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_immigration_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '92975f1bb80e4fcfb7e524e6d4a27d96'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_member'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '939d5900c40d469ea2a283c5cb79becc'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_last_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '94cd0c58d6bc4bc4a8f65098cb993a98'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_protection_review_status'
                            value: 'exempt'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9523a0814b4348b484ff2e7a6c74dae7'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_status'
                            value: 'cancelled'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '954f92f6a997437f8cdd9425b2a7903a'
                        key: {
                            name: 'u_bridge360_referral'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '95e2b6e13c6d4230ba33e226e20bf21a'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_jurisdiction'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '95ed7a4677a74fc6bd0c1faaccb222d1'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_status'
                            value: 'pending_dispatch'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '96181b5d8df04a569a6db61a66367acf'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '974d1d9ead174bde90f542ae78006175'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9871daa9b7264aa6a1c5c7baee771314'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_claim_type'
                            value: 'legal_custody'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '98abb1146410427a8accc03c19b091c7'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_typical_fields'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '98c926f7b70e4cbe82102c944b81f2c3'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '99278ec543994fa78997cf52e850d2e6'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_verification_status'
                            value: 'pending'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '99a8ebabde934641af9b55b78b50f6c9'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9a09f511b27c42938e37f9681b0c6bd8'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_document_name'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9b26153ed3804f2b97c5277fa172d671'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_family'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9bc31f27793744ea905e3c2fc9ce7d4c'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_status'
                            value: 'new'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9bdee3894508430b81b61a9bdfaafcdb'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_family'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9c0288e7def8485a8b277c4ccda851a5'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_consent_required'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9c7053237ad4437ea264de7179d0c659'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_first_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9ca0c447819a4f0d8456126f23907cb9'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_local_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9ceb1e76b195482c865af042097f6ac0'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_status'
                            value: 'inconclusive'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '9cf3bc8f896d4a5ead1b0a50aeeed821'
                        key: {
                            name: 'u_bridge360_country_document_field'
                            element: 'u_field_type'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9d0c344ee48a460cb8ccfd1a0656d108'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_protection_review_status'
                            value: 'cleared_safe_to_contact'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9de66919a373497fad8989775c4be001'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_family_id'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '9dfe61babdb241daad303c9a32ebf016'
                        key: {
                            name: 'u_bridge360_country_document_field'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9e3f8b04c3b64c86b767292590cf5206'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_case_status'
                            value: 'closed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '9f0dc57a66f64a50984bb6752bcedb9c'
                        key: {
                            name: 'u_bridge360_verification_authority'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9f38507d4ea640db919f7edc1b291d5c'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_service_type'
                            value: 'housing'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9f90861ecfca45c6b2f2c4276dddb5ed'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_ocr_text'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9fdbd5c76f0649ad938b3e305535867c'
                        deleted: true
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_category'
                            value: 'status_inquiry'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a05db84c49b4418e8217644c2221849e'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_relationship_to_head'
                            value: 'mother'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a0fa2b5237b946f0b4e1efd4c3896660'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_electronic_verification_available'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a122990394c844b1b833cb3e7707e549'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_verification_status'
                            value: 'rejected'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a29df58f23cb4f538b01fd099f41a5b2'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_file_name'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a3690ad78aa14744be644a170631764a'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_status'
                            value: 'resolved'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a3ff006344b64406b9b795f0059ba41c'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a45da9e800cf49aa8018cb4f129b356f'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_response_sla_days'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a57dab0e03544416ad4d94c2f15e2f9f'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_notes'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a66ad9a4a2b347d5936488c4e3f6eb84'
                        deleted: true
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_application_id'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a6d6034eaa604ce8b99978724c7cfb16'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_status'
                            value: 'in_review'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a723804997a34ad782602a102705d7bd'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_verification_status'
                            value: 'pending'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a7a857f9dacc4f83a1baadc1df41407d'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_strictness'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a7bdd557cc794b2d9dbc33b41831e921'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_validity_period_desc'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a7c97e5194e445fdbf2f89990a9116d2'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_case_id'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a7d08aa93f5f4f66bc84189114b4b9d9'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_category'
                            value: 'appointment'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a7df98488aca41f89327032fa6cd6432'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_request_type'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'a822272068df45978af3ac838d9225d7'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a8a3008a21504dbfa236568ad39581ef'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_country_document'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'a8b6a55bd129412aa681301e30a7e1d6'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_verification_status'
                            value: 'verified'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'a99f42a41cb64ae790e553075a863dc6'
                        deleted: false
                        key: {
                            application_file: 'e128f469876d4b3bb0883ad18a79b4bd'
                            source_artifact: '9273002f432840a591c3115f791fd518'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'aa95cb4308af4ac388f998fc8f5c004e'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_gender'
                            value: 'other'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ab081a676be542c9b70ff4e9a1cee73f'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_status'
                            value: 'closed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ab4d447726eb4646bdaa2566c9a221d3'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_doc_request_notes'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'ab71805d7ee945be944cee5a94a258a1'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_verification_status'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'aba9a41d1d3b42e085f97e23bddb9cc6'
                        deleted: true
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_category'
                            value: 'general_support'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'abc7e72304d14dc9b955a174a8515359'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_official_languages'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ac40fe46fad84d439bb07c80664d45c9'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_authority_name'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ac921ed86d1c404483cf219be0749988'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_transliteration_notes'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'acb2f031452b4a7aaf88661d37ee9c27'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_protection_review_status'
                            value: 'pending'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ad2538957d5c4fdca9a780ad11e74561'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_country'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sn_glider_source_artifact_m2m'
                        id: 'ad36a0a68a4a408bba02f63963bced35'
                        deleted: false
                        key: {
                            application_file: '45e0d7df543c472a96717ba491c75e85'
                            source_artifact: '9273002f432840a591c3115f791fd518'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'ad67b189c0da4ff9bb65e9d3b1f12f1e'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_document_type'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'aea71477e8b24dbc902770d224f3a4cc'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_last_name'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'af20d5df98e1494a8e4aa0043b9f40b4'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_last_message'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'af97a4a5b1894854bbbe68c7e7b63da0'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_claim_type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b02ec1d9de1b493c9c7204b8f7c8eafe'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_email'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b0686d37f9f242fe80ecbff0f51fdca5'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_is_head'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b0abb049e7434ea79189f2bd7e3c5d3d'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_doc_request_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'b0b549609caf466b864eb51a552eacbf'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_consent_status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b1499e1af1f04afda13493535bd202cc'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_verification_status'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b15c08084ce845cbbb36c40edcb4bc6b'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_verification_status'
                            value: 'in_review'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b18b68fc47b6455aa73eb60f3065299e'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_naming_convention'
                            value: 'patronymic'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b226e3ff454e498f850903cbb7ba90ba'
                        deleted: true
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_category'
                            value: 'document_issue'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b2c0d1e9c1b7416f97a24149671db083'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b339daada00c494eb49056ecb74df0e3'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_family_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b51da40b4863476d96f3525b44953caa'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_state'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b561ac47dd1041e497f4f9341117bfac'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_family'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b5a5159f66ba443c89246d77e1731650'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_request_type'
                            value: 'civil_status_lookup'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b5b13462723b4ee3910e108e2be31bba'
                        deleted: true
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_status'
                            value: 'resolved'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b68c576d6c9e456ab3b1a46adb256162'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_protection_review_status'
                            value: 'flagged_do_not_contact'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'b6cfb443dae04578b7d3c3a2659f41c7'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_request_type'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'b6d4d3bbe6784a9da99619c197fa43fc'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b6d7a067ded5455ebee24fde574f527f'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_household_size'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b754cbc7f1b34b00b76b8a24c6b637c0'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_verification_guidance'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b7a1896667374e7db5e5a5ca01a54c78'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_authority'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b818de860ed34398b0cbe1240c340d71'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_verification_status'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b9267eb5bd70462eaec8546e666f3616'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_priority'
                            value: 'medium'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b9273ad510df422da94c450facde19b2'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_outcome_summary'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b9cf2524611548a883b171475aac5cbc'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_opened_date'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ba5d0a60374841b6a9dfd9e877b5c6b3'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_verification_method'
                            value: 'OTHER'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'bae8e564e2924ca8b10ec6fee4383b69'
                        key: {
                            name: 'u_bridge360_family'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'bb2b20feaf5444f2b8e3245b28a12ada'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_priority'
                            value: 'high'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bb3052b337bd412b80eda5bb4aee2bb1'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_file_size'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bc4996981c264767b05c31c8e6a39aaa'
                        key: {
                            name: 'u_bridge360_country_document_field'
                            element: 'u_active'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bc4e5d48d7c4421c893bf3f4f97cf284'
                        key: {
                            name: 'u_bridge360_country_document_field'
                            element: 'u_notes'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bceccd2ca16a4557bf5fe1e2179eca93'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_pending_summary'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bdd34fd916674be08bc5ff77a3098f93'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_case_status'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'bdf6c9f91c084e6db36034c5716888ee'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_status'
                            value: 'pending_docs'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'be90925b79cb4ff7b9c1f2bda325b195'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bec6e5cf7a02465bbe85f443a1bb5007'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_iso2'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bff9dfbd95f546cca090b40a637177d5'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_active'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c03bdd7fd5e8456194b813971a9cecac'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_notes'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c0987c1ce97449ab832b18b3580cb211'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_objective'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c17e77ad990241719fbe983e9fb1eb53'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_agent'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c1e0e68f87e9410790c04993ca783f01'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_document_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c1f073a58a6c4eb381134f488cd3d5e1'
                        deleted: true
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_description'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c29f912611354adab5b469e342b6b9c0'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_otp_code'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c30ae05c31c249a58b61d483b290b8e4'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_case_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c34d58629e154f59b7e4ad947783c028'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_country_of_origin'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c36ba40d32004d118ea7126438f5886a'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_assigned_officer'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c49ceeb936e049478ef20785e0b51e30'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_request_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c57cd73361e946e6b9c1e8474ac151f3'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_iso3'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c5f7701b914f491a9528d058d78b963e'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_title'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c76dcf64401644bdb1bcff3ffb184f14'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_due_date'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'c78ccc80d8da4707aedc8cca896c636e'
                        key: {
                            name: 'u_bridge360_country_document'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c86b6096c4ef485b8495b3cdcf3d64af'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_country'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'c8f11db882de45179cc3bb2aff32d381'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_document_type'
                            value: 'passport'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'caa6bc7b89424ad1add8024318506432'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_status'
                            value: 'pending_consent'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cb0a7d37dcbb4d169a985d02cf8de7cd'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_consent_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cb9f84954c6c459186f114e58aa237a4'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_case_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cba7b35e92ec4f46baff67303fc63397'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_contact_email'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'cbc05c2b69d04798a13379e7a378385c'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_registration_status'
                            value: 'rejected'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cc0cf1414188472f8a3cade7a8f851b0'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_notes'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'cc1575b171b14ba6af637ca0668f8a1f'
                        deleted: true
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_category'
                            value: 'appointment_request'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cccdada1d8b740cd8ee9ec98e5f67102'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_assigned_officer'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ccd613687e0243a181ea8d57672fd4e4'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_active'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cd11a49ecc2a4a658f0400de14a57c79'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_official_languages'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'cd7571de667d4739a86aa96b3412e00e'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_service_type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cfea03ac3f9645c0b6ca5d93f2ddfd09'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_family'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'd07a98e194314c7ebd8cb0fc6e76cf56'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_protection_review_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd08d33a21b7a467cbe98858c8526f270'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd091f0a8c2e54725b06170505dce4568'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_status'
                            value: 'referred'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd0e2903e8dc14e98b35fe79d29d0aad1'
                        deleted: true
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_status'
                            value: 'pending_action'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd1cd1ba318a84065a4204ac3ebc59917'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_relationship_to_head'
                            value: 'daughter'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'd2bc577d1893479ea7788deb62a0219a'
                        deleted: false
                        key: {
                            name: 'global/index'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd306ce07501244e981849b02f7594394'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_file_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd35079df44f24936b55d08dd5cc81039'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_date_of_birth'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd42fe45b6e1e469182247d23258c19c3'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_application_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd448535e95bf4031ac5fcf08b4b3c189'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd4946870df1d4b9aa46cc07ae4e6a135'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_iso3'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd4d2360f69ac47afa6ec794a619d570c'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_naming_convention'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd4f93da5fa2041db8b90ad5ef7bf8bba'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_extracted_json'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'd58efc63000a4aedaa43a9d95c0f232e'
                        key: {
                            name: 'u_bridge360_verification_authority'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd5fa299ac0d1477cab4f61e884005b46'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_agency_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd655c4500e544aab9a9cf06068ce744c'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_country'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd71ff6e5a5184b518a60a5aee67447a3'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_strictness'
                            value: 'standard'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd7506c238e3e4858bebb5acccf200870'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_passport_number'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd76fd3fd0a414ef7b45c4625d9f50ce4'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd814987a30d74944bc315376af02f4c9'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_agency_name'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd82d343dff874731a14d6bfe2551bddf'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_api_available'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd838aa1970f54e059df7d98fbbd0ccd9'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_primary_document_types'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd8694eed2a4f451487cbc1388651942a'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_naming_convention'
                            value: 'family_surname'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd86c2d94a6624b0e8afc706837b16f4d'
                        deleted: true
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_partner_agency_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'd8de9c971c1e4a13a740aed10cd999d2'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_verification_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd92eb7b3a9b14e47b8211504bd771dca'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_civil_registry_info'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'd9b7e444cc5f4bc0895480cd39b48940'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_verification_method'
                            value: 'MANUAL_REQUEST'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'da37422d23c4436eb9a1edd82b80cff9'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_assigned_officer'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'dc33e5ba4a2d473e979526f46986459c'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_status'
                            value: 'answered'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'dcddfca0c01c4c3e92d72bcbda9ce854'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_category'
                            value: 'emergency'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'dd45e7d2b6cb496cad8ead3185d0d33b'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_category'
                            value: 'medical'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'de0f8f82aa844835be42881e0ceaada7'
                        key: {
                            name: 'u_bridge360_member'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'de8d7776a3fe41cf8cb3d803b2878627'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'dedf9c2dbc4e4f5b8b42e9e6ef51fd4a'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_refugee_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dee792c8e15343a9805c0adee234cc4f'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_civil_registry_info'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'df3e57e99e8e45918bc2de82270a5e85'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_validity_period_desc'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'dfc06a43bbe54b24a7c743ccb4ee5b9e'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_otp_expiry'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e0e5a21e6f2d460ca76712822e937cbd'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_household_size'
                        }
                    },
                    {
                        table: 'sys_ux_lib_asset'
                        id: 'e128f469876d4b3bb0883ad18a79b4bd'
                        deleted: false
                        key: {
                            name: 'global/main'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e175b7d30f3a4e5ea8a1a83e1ac8d8fc'
                        deleted: true
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_status'
                            value: 'cancelled'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e1780bdfd5174c4cb82198b195b99cb1'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_target_record'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'e1b8a9dabffd4e6ebdb30121c08548ab'
                        key: {
                            name: 'u_bridge360_country'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e35742cc0f5f4a61898db4613d621c4f'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_document_type'
                            value: 'medical_certificate'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e379d7a3ca1c414283b585df71209480'
                        deleted: true
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_status'
                            value: 'in_progress'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e4cfbebd3bde4ff4bada9b2ec2e731e8'
                        deleted: true
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_category'
                            value: 'immigration'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e502f33298854f1abd7a9f83720ed2e2'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_bridge360_id'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e65400dea14a4b3ca1e3b1f7313e9af6'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_doc_request_pending'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e6a454e98f1d4520b8b20cf7f37bf41b'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_opened_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e6dfd6b2e71f462e8b0d75ab626db453'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_immigration_status'
                            value: 'humanitarian_placement'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e6e77c74bc104ef686b5ef7c52244d54'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_verification_status'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e7851f2a3ff449c4bccacc53b9e3195c'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_status'
                            value: 'dispatched'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e794c956b97d4050b80f64e390dc36a3'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_status'
                            value: 'accepted'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e7a56f31bb35431e955e4540a6ef6549'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_document_category'
                            value: 'civil_status'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'e7e4ace1fd6a48c8a1dab32dc1b37d40'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_strictness'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e82f225272224f55bb86c8811ad1cb2e'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_consent_status'
                            value: 'exempt_legal'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'e9223381e0e548d9b96aa37b23c94aa5'
                        key: {
                            name: 'u_bridge360_document'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e96f559f026d42e383e67364af70d86d'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_document_category'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ea3c5a33b0fa43fdb616699d9f7bfa55'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_arrival_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'eaf3e573fcf44139abfcbecd0429ff9d'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_relationship_to_head'
                            value: 'self'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'eb2da237813846668ade3fa596baab12'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_strictness'
                            value: 'heightened_scrutiny'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'eb4be742f19c42939cd39136e24d03fc'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_document'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'eb7128a274ce40d4ba23eb05be0d10c3'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_nationality'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'eb9de328ac8e44f99c606cd74e1d6ae8'
                        key: {
                            name: 'u_bridge360_document'
                            element: 'u_document_type'
                            value: 'visa'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ebc29756f6b042cc999d869a39a7aaf2'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_request_id'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'ebf60dbf4a9c4f299041b70f08bbd858'
                        key: {
                            name: 'u_bridge360_country_document_field'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ec4075e734084209a1db9b60e8dd5347'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_document_category'
                            value: 'identity'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ee317f9d267c4f75a2ea04f5bfadfe67'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_priority'
                            value: 'medium'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'eee2ded6244e42c5b55559ee010740e5'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_target_table'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ef7b224fd11541ab871c2cfa4ce0c274'
                        key: {
                            name: 'u_bridge360_referral'
                            element: 'u_service_type'
                            value: 'medical'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'eff7c412ef714ca98f769e64530670de'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_verification_method'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f0166b63cca6426596cd5ef0aee35066'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_request_type'
                            value: 'unhcr_crosscheck'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f0ae250a1d7b4714b05412f6f104a9eb'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_priority'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f0bf257aef9c42c0a7708314483b3779'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_priority'
                            value: 'high'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f19477971fe64ea7bc594d8ff578e073'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_description'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f1dba97ae2e947e9b62a396e0f327a60'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_allow_customer_edit'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f1f377ab31f545d0b0cc200f8caf7190'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_pending_raw'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f2459d6328854e2283479d67bdb8acd7'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_jurisdiction'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f2618209917844c885115fc579eb614c'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f41d2256343444f498b00ec1f6aaf9e6'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_claim_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f45c3866999d47a682aac270d1f75c02'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f4d5bc5ae54c41a1ba711e35ee9a039b'
                        key: {
                            name: 'u_bridge360_evidence_rule'
                            element: 'u_claim_type'
                            value: 'spousal_union'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_ui_page'
                        id: 'f4ee552715294b00b64870ab547d3a0e'
                        key: {
                            name: 'bridge360'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f5a28d5c263245e7b427290f828528a8'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_doc_request_type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f62317182d0f40349d0e58d397ee3401'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_contact_portal_url'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f6539db2e12a43a4b0d41ad87d3059c1'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_naming_convention'
                            value: 'tripartite'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f677620a36b549a9a74487527046f3fa'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_category'
                            value: 'protection'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f74e0419fa7d4df7ae5c6de2804edfa5'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_address'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'f7f4652f0910470090a383de05d89923'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_case_status'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f94b21f91207467aa70d0cc506061e3f'
                        key: {
                            name: 'u_bridge360_country_document_field'
                            element: 'u_field_type'
                            value: 'text'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f9aa5428e4cb4c688c09b432e190b051'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fa45b53545934ec2a1f34a0a0008f1b2'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_document_category'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fa9e2a66d54f497d81d92e4658441162'
                        key: {
                            name: 'u_bridge360_verification_authority'
                            element: 'u_verification_method'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fab227b0a8eb4295a04b3b506cfb88d9'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_outcome_summary'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fbb5ed76a13344739b6a146aa6f92538'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_email'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fbf1d84251d74beebf2318814877047a'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_request_id'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'fd245260631d42859b693c7789c15008'
                        key: {
                            name: 'u_bridge360_country_document'
                            element: 'u_document_category'
                            value: 'supporting'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'fd3cdc40a5cb44c5ba1664ad7c8fa24f'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_priority'
                            value: 'normal'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fe14641b7cfc47dd9258418b4d236dee'
                        key: {
                            name: 'u_bridge360_verification_request'
                            element: 'u_protection_review_required'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fe2b2485221f4f61b98ca992ccd5c643'
                        key: {
                            name: 'u_bridge360_country'
                            element: 'u_iso2'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'fe9d2decf4e14860875479d7f3167d70'
                        key: {
                            name: 'u_bridge360_case'
                            element: 'u_priority'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'feef8195bdd64c8ca98a5fc975464d86'
                        key: {
                            name: 'u_bridge360_ticket'
                            element: 'u_category'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ff03e58cc5bb4e1fb83945c105aa0459'
                        key: {
                            name: 'u_bridge360_family'
                            element: 'u_registration_status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ff0a688be0c74edbaf7797bb6c403fb3'
                        key: {
                            name: 'u_bridge360_member'
                            element: 'u_nationality'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ff6b1c64c7c44e929a528c8f0a1be142'
                        key: {
                            name: 'u_bridge360_agent_conversation'
                            element: 'u_last_message'
                        }
                    },
                ]
            }
        }
    }
}
