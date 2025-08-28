import JSZip from 'jszip';

export interface HtmlZipRequest {
  htmlBySize: Record<string, string>;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { htmlBySize }: HtmlZipRequest = await req.json();
    const zip = new JSZip();

    for (const [size, html] of Object.entries(htmlBySize)) {
      const folder = zip.folder(size)!;
      folder.file('index.html', html);
      const assets = folder.folder('assets')!;
      assets.file('bg.jpg', '', { binary: true });
      assets.file('logo.png', '', { binary: true });
    }

    const buffer = await zip.generateAsync({ type: 'nodebuffer' });
    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="banners-html5.zip"'
      }
    });
  } catch (e) {
    console.error(e);
    return new Response('Server error', { status: 500 });
  }
}

