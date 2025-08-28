import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BannerSizeSelector } from "./BannerSizeSelector";
import { PreviewCard } from "./PreviewCard";
import { buildBannerHTML } from "@/lib/bannerBuilder";
import { autoFitHeadline } from "@/lib/utils";
import {
  exportHTMLZip,
  exportStaticJPG,
  downloadFile,
} from "@/lib/exportService";

export function BannerGenerator() {
  const [headline, setHeadline] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [buttonsText, setButtonsText] = useState("R$600,R$1200,Outro valor");
  const [color, setColor] = useState("#2E7D32");
  const [mode, setMode] = useState<"limite" | "datas">("limite");
  const [clickTag, setClickTag] = useState("https://example.com");
  const [banners, setBanners] = useState<Record<string, string>>({});
  const [exportHtml, setExportHtml] = useState(true);
  const [exportJpg, setExportJpg] = useState(false);

  const handleGenerate = () => {
    const options = buttonsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const result: Record<string, string> = {};
    sizes.forEach((size) => {
      const [width, height] = size.split("x").map(Number);
      const { text, adjust } = autoFitHeadline(size, headline);
      result[size] = buildBannerHTML({
        width,
        height,
        headline: text,
        options: options.length ? options : undefined,
        mode,
        palette: { primary: color, bg: "#FFFFFF" },
        clickTag,
        fontAdjust: adjust,
      });
    });
    setBanners(result);
  };

  const handleExport = async () => {
    const timestamp = new Date().toISOString().slice(0, 16).replace(/[:-]/g, "");
    if (exportHtml) {
      const zip = await exportHTMLZip(banners);
      downloadFile(zip, `banners-html5-${timestamp}.zip`);
    }
    if (exportJpg) {
      const zip = await exportStaticJPG({
        htmlBySize: banners,
        background: "#FFFFFF",
        quality: 0.92,
      });
      downloadFile(zip, `banners-static-${timestamp}.zip`);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label>Headline</Label>
            <Input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="Escolha a headline"
            />
          </div>
          <div>
            <Label>Tamanhos</Label>
            <BannerSizeSelector selectedSizes={sizes} onSizesChange={setSizes} />
          </div>
          <div>
            <Label>Textos dos botões (separados por vírgula)</Label>
            <Input
              value={buttonsText}
              onChange={(e) => setButtonsText(e.target.value)}
            />
          </div>
          <div>
            <Label>Cor principal</Label>
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div>
            <Label>Interatividade</Label>
            <Select value={mode} onValueChange={(v: "limite" | "datas") => setMode(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="limite">Limite</SelectItem>
                <SelectItem value="datas">Datas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>ClickTag</Label>
            <Input
              value={clickTag}
              onChange={(e) => setClickTag(e.target.value)}
            />
          </div>
          <Button onClick={handleGenerate}>Gerar Banners</Button>
        </div>
        <div className="space-y-4">
          {Object.entries(banners).map(([size, html]) => (
            <PreviewCard key={size} size={size} html={html} />
          ))}
        </div>
      </div>
      {Object.keys(banners).length > 0 && (
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="expHtml"
              checked={exportHtml}
              onCheckedChange={(v) => setExportHtml(!!v)}
            />
            <Label htmlFor="expHtml">Exportar ZIP HTML5</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="expJpg"
              checked={exportJpg}
              onCheckedChange={(v) => setExportJpg(!!v)}
            />
            <Label htmlFor="expJpg">Exportar JPG Estático</Label>
          </div>
          <Button onClick={handleExport} disabled={!exportHtml && !exportJpg}>
            Exportar
          </Button>
        </div>
      )}
    </div>
  );
}

