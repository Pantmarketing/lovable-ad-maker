// Server-side export endpoint for static JPG generation
// This would typically be deployed as a serverless function

import puppeteer from 'puppeteer';
import JSZip from 'jszip';

export interface StaticExportRequest {
  htmlBySize: Record<string, string>;
  background?: string;
  quality?: number;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { htmlBySize, background = '#FFFFFF', quality = 0.92 }: StaticExportRequest = await req.json();
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const zip = new JSZip();
    
    for (const [size, html] of Object.entries(htmlBySize)) {
      const [width, height] = size.split('x').map(Number);
      
      const page = await browser.newPage();
      await page.setViewport({ width, height });
      
      // Disable animations for static capture
      const htmlWithoutAnimations = html.replace(
        /<style>(.*?)<\/style>/s,
        (match, styles) => {
          const staticStyles = styles.replace(
            /animation:[^;]+;/g, 
            'animation: none;'
          ).replace(
            /@keyframes[^}]+}/g, 
            ''
          );
          return `<style>${staticStyles}</style>`;
        }
      );
      
      await page.setContent(htmlWithoutAnimations, { 
        waitUntil: 'networkidle0',
        timeout: 10000 
      });
      
      // Set background if banner is transparent
      await page.evaluate((bg) => {
        document.body.style.background = bg;
      }, background);
      
      const screenshot = await page.screenshot({
        type: 'jpeg',
        quality: Math.round(quality * 100),
        clip: { x: 0, y: 0, width, height }
      });
      
      zip.file(`${size}.jpg`, screenshot);
      await page.close();
    }
    
    await browser.close();
    
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    const timestamp = new Date().toISOString().slice(0, 16).replace(/[:-]/g, '');
    
    return new Response(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="banners-static-${timestamp}.zip"`
      }
    });
    
  } catch (error) {
    console.error('Export error:', error);
    return new Response('Export failed', { status: 500 });
  }
}