// imageCompression.ts
// Turns an uploaded file into a small, self-contained JPEG data URL that is safe
// to PERSIST to ServiceNow (the `u_file_data` column on u_bridge360_document) and
// to render later from any browser/session — not just the uploader's localStorage.
//
// Why this exists: document previews are shown via <img src={dataUrl}>. Raw camera
// scans are multiple MB; storing them verbatim risks blowing the string column and
// the Scripted REST body, and previously overflowed localStorage. We downscale +
// recompress so the stored payload stays well under a safe character budget.
//
// Non-image files (e.g. PDF) return '' — the viewer only renders `data:image`
// sources anyway and falls back to OCR text / metadata for everything else.
// Never throws: on any failure it returns '' so the upload flow is never blocked.

interface CompressOptions {
  /** Longest edge (px) the image is scaled down to. */
  maxEdge?: number;
  /** Hard ceiling on the resulting data-URL length (chars). ~600k ≈ 450 KB binary. */
  maxChars?: number;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || '');
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image decode failed'));
    img.src = src;
  });
}

/**
 * Compress an image File into a JPEG data URL small enough to persist. Returns ''
 * for non-images or on any error.
 */
export async function fileToStorableDataUrl(file: File, opts: CompressOptions = {}): Promise<string> {
  const maxEdge = opts.maxEdge ?? 1400;
  const maxChars = opts.maxChars ?? 600_000;

  if (!file || !file.type || !file.type.startsWith('image/')) return '';

  try {
    const rawUrl = await readAsDataUrl(file);
    if (!rawUrl) return '';

    const img = await loadImage(rawUrl);
    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;
    if (!width || !height) return rawUrl.length <= maxChars ? rawUrl : '';

    const longest = Math.max(width, height);
    if (longest > maxEdge) {
      const scale = maxEdge / longest;
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const draw = (w: number, h: number, quality: number): string => {
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';
      ctx.drawImage(img, 0, 0, w, h);
      return canvas.toDataURL('image/jpeg', quality);
    };

    // Step quality down until we fit the budget.
    let quality = 0.72;
    let out = draw(width, height, quality);
    while (out && out.length > maxChars && quality > 0.35) {
      quality -= 0.12;
      out = draw(width, height, quality);
    }

    // Still too big → shrink dimensions once more at low quality.
    if (out && out.length > maxChars) {
      out = draw(Math.round(width * 0.7), Math.round(height * 0.7), 0.5);
    }

    if (out && out.length <= maxChars) return out;

    // Last resort: only keep the raw bytes if they happen to be tiny.
    return rawUrl.length <= maxChars ? rawUrl : '';
  } catch {
    return '';
  }
}
