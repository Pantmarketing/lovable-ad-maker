import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { GlobalConfig, AdSize, Palette } from "@/types/ads";

const ALL_SIZES: AdSize[] = [
  "200x200","250x250","300x250","300x600","320x100","320x50","320x480","336x280","728x90","970x250"
];

const BASE_PALETTES: Palette[] = [
  { primary: "#2563EB", secondary: "#1E40AF", bg: "#FFFFFF", textOnPrimary: "#fff" },
  { primary: "#16A34A", secondary: "#065F46", bg: "#FFFFFF", textOnPrimary: "#fff" },
  { primary: "#F97316", secondary: "#9A3412", bg: "#FFFFFF", textOnPrimary: "#111" },
  { primary: "#EF4444", secondary: "#991B1B", bg: "#FFFFFF", textOnPrimary: "#fff" },
  { primary: "#374151", secondary: "#111827", bg: "#F7F7F7", textOnPrimary: "#fff" },
];

interface Props {
  global: GlobalConfig;
  setGlobal: (updater: (prev: GlobalConfig) => GlobalConfig) => void;
  onCreate: () => void;
}

export default function AdConfigPanel({ global, setGlobal, onCreate }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleSize = (s: AdSize) => {
    setGlobal(prev => ({
      ...prev,
      sizes: prev.sizes.includes(s) ? prev.sizes.filter(x => x !== s) : [...prev.sizes, s],
    }));
  };

  const togglePalette = (p: Palette) => {
    const key = JSON.stringify(p);
    setGlobal(prev => {
      const exists = prev.palettes.find(x => JSON.stringify(x) === key);
      return {
        ...prev,
        palettes: exists ? prev.palettes.filter(x => JSON.stringify(x) !== key) : [...prev.palettes, p],
      };
    });
  };

  const handleHeadlineImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setGlobal(prev => ({ ...prev, headlineImage: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle>Configuração do Anúncio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="mb-2 block">Tamanhos</Label>
          <div className="grid grid-cols-2 gap-2">
            {ALL_SIZES.map(size => (
              <label key={size} className="flex items-center gap-2 text-sm">
                <Checkbox checked={global.sizes.includes(size)} onCheckedChange={() => toggleSize(size)} />
                {size}
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Paleta de cores</Label>
          <div className="flex flex-wrap gap-3">
            {BASE_PALETTES.map((p, idx) => {
              const active = !!global.palettes.find(x => JSON.stringify(x) === JSON.stringify(p));
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => togglePalette(p)}
                  aria-pressed={active}
                  className={`w-7 h-7 rounded-full border ${active ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                  style={{ background: p.primary }}
                  title={p.primary}
                />
              );
            })}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Selecione várias cores para gerar cartões por cor.</div>
        </div>

        <div className="space-y-2">
          <Label>Título (headline)</Label>
          <Input
            value={global.headline}
            onChange={(e) => setGlobal(prev => ({ ...prev, headline: e.target.value }))}
            placeholder="Escolha qual limite você precisa:"
          />
          <div className="grid grid-cols-2 gap-3 items-center">
            <div>
              <Label>Imagem do título (opcional)</Label>
              <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleHeadlineImage} />
            </div>
            <div>
              <Label>Margem inferior do título (px)</Label>
              <Input type="number" value={global.headlineMarginBottom}
                onChange={(e) => setGlobal(prev => ({ ...prev, headlineMarginBottom: Number(e.target.value || 0) }))}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Textos dos botões (um por linha)</Label>
          <Textarea
            value={global.buttonLines.join("\n")}
            onChange={(e) => setGlobal(prev => ({ ...prev, buttonLines: e.target.value.split(/\r?\n/).filter(Boolean) }))}
            rows={4}
            placeholder={"R$600\nR$1200\nOutro valor"}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="mb-1 block">Alinhamento do título</Label>
            <select className="w-full border rounded p-2 text-sm" value={global.alignments.title} onChange={(e) => setGlobal(prev => ({ ...prev, alignments: { ...prev.alignments, title: e.target.value as any } }))}>
              <option value="left">Esquerda</option>
              <option value="center">Centro</option>
              <option value="right">Direita</option>
            </select>
          </div>
          <div>
            <Label className="mb-1 block">Alinhamento dos botões</Label>
            <select className="w-full border rounded p-2 text-sm" value={global.alignments.buttons} onChange={(e) => setGlobal(prev => ({ ...prev, alignments: { ...prev.alignments, buttons: e.target.value as any } }))}>
              <option value="left">Esquerda</option>
              <option value="center">Centro</option>
              <option value="right">Direita</option>
            </select>
          </div>
          <div>
            <Label className="mb-1 block">Alinhamento do logo</Label>
            <select className="w-full border rounded p-2 text-sm" value={global.alignments.logo} onChange={(e) => setGlobal(prev => ({ ...prev, alignments: { ...prev.alignments, logo: e.target.value as any } }))}>
              <option value="left">Esquerda</option>
              <option value="center">Centro</option>
              <option value="right">Direita</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Modo de conteúdo</Label>
            <select className="w-full border rounded p-2 text-sm" value={global.mode} onChange={(e) => setGlobal(prev => ({ ...prev, mode: e.target.value as any }))}>
              <option value="datas">Datas (05/15/30)</option>
              <option value="limite">Limite</option>
            </select>
          </div>
          <div>
            <Label>ClickTag URL final</Label>
            <Input placeholder="https://exemplo.com" value={global.clickTag} onChange={(e) => setGlobal(prev => ({ ...prev, clickTag: e.target.value }))} />
          </div>
        </div>

        <div className="pt-2">
          <Button className="w-full" onClick={onCreate}>Criar Pré-visualizações</Button>
        </div>
      </CardContent>
    </Card>
  );
}

