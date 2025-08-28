import JSZip from "jszip";

export interface ExportOptions {
  htmlBySize: Record<string, string>;
  background?: string;
  quality?: number;
}

export async function exportHTMLZip(htmlBySize: Record<string, string>): Promise<Blob> {
  // Prefer hitting server endpoint for streaming zip when available
  try {
    const response = await fetch('/api/export-zip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ htmlBySize })
    });
    if (response.ok) return await response.blob();
  } catch {}
  // Fallback to client-side zip
  const zip = new JSZip();
  Object.entries(htmlBySize).forEach(([size, html]) => {
    const folder = zip.folder(size) as JSZip;
    folder.file("index.html", html);
    const assetsFolder = folder.folder("assets") as JSZip;
    assetsFolder.file("logo.png", "", { binary: true });
    assetsFolder.file("bg.jpg", "", { binary: true });
  });
  return await zip.generateAsync({ type: 'blob' });
}

export async function exportStaticJPG(options: ExportOptions): Promise<Blob> {
  const { htmlBySize, background = "#FFFFFF", quality = 0.92 } = options;
  
  // Since we can't run Puppeteer in the browser, we'll create a mock implementation
  // In a real implementation, this would be a server endpoint
  const response = await fetch('/api/export-static', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      htmlBySize,
      background,
      quality
    })
  });
  
  if (!response.ok) {
    throw new Error('Failed to export static images');
  }
  
  return await response.blob();
}

// Utility function to trigger file download
export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}