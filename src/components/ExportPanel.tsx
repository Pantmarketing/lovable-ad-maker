import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { exportHTMLZip, exportStaticJPG, downloadFile } from "@/lib/exportService";

interface Item { size: string; html: string }

interface Props {
  items: Item[];
  bg?: string;
}

export default function ExportPanel({ items, bg = '#FFFFFF' }: Props) {
  const [zipHtml, setZipHtml] = useState(true);
  const [jpg, setJpg] = useState(false);

  const onExport = async () => {
    const htmlBySize = Object.fromEntries(items.map(i => [i.size, i.html]));
    const ts = new Date().toISOString().slice(0,16).replace(/[:-]/g,'');
    if (zipHtml) {
      const blob = await exportHTMLZip(htmlBySize);
      downloadFile(blob, `banners-html5-${ts}.zip`);
    }
    if (jpg) {
      try {
        const blob = await exportStaticJPG({ htmlBySize, background: bg, quality: 0.92 });
        downloadFile(blob, `banners-static-${ts}.zip`);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={zipHtml} onCheckedChange={(v) => setZipHtml(!!v)} />
          Exportar ZIP HTML5
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={jpg} onCheckedChange={(v) => setJpg(!!v)} />
          Exportar JPG Estático
        </label>
        <Button className="w-full" disabled={!zipHtml && !jpg} onClick={onExport}>Baixar</Button>
      </CardContent>
    </Card>
  );
}

