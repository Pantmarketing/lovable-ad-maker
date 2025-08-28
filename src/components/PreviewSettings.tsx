import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { CardOverrides, PreviewCardModel } from "@/types/ads";

interface Props {
  selected?: PreviewCardModel | null;
  onChange: (changes: CardOverrides) => void;
}

export default function PreviewSettings({ selected, onChange }: Props) {
  if (!selected) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Ajustes da Pré-visualização</CardTitle>
        </CardHeader>
        <CardContent>Selecione um cartão para editar.</CardContent>
      </Card>
    );
  }

  const buttonsTexts = selected.overrides.buttons?.texts;

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle>Componentes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Título</Label>
          <Input
            value={selected?.overrides.title?.fontSize ?? ''}
            onChange={(e) => onChange({ title: { ...(selected.overrides.title || {}), fontSize: Number(e.target.value || 0) } })}
            placeholder="fontSize"
            type="number"
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="fontFamily"
              value={selected?.overrides.title?.fontFamily ?? ''}
              onChange={(e) => onChange({ title: { ...(selected.overrides.title || {}), fontFamily: e.target.value } })}
            />
            <Input
              type="number"
              placeholder="fontWeight"
              value={selected?.overrides.title?.fontWeight ?? ''}
              onChange={(e) => onChange({ title: { ...(selected.overrides.title || {}), fontWeight: Number(e.target.value || 0) } })}
            />
          </div>
          <Input
            type="number"
            placeholder="marginBottom"
            value={selected?.overrides.title?.marginBottom ?? ''}
            onChange={(e) => onChange({ title: { ...(selected.overrides.title || {}), marginBottom: Number(e.target.value || 0) } })}
          />
        </div>

        <div className="space-y-2">
          <Label>Botões</Label>
          <Textarea
            rows={4}
            placeholder={"R$600\nR$1200\nOutro valor"}
            value={(buttonsTexts && buttonsTexts.join('\n')) || ''}
            onChange={(e) => onChange({ buttons: { ...(selected.overrides.buttons || {}), texts: e.target.value.split(/\r?\n/).filter(Boolean) } })}
          />
          <div className="grid grid-cols-3 gap-2">
            {new Array(3).fill(0).map((_, i) => (
              <Input key={i} type="number" placeholder={`fontSize ${i+1}`}
                value={selected.overrides.buttons?.fontSizes?.[i] ?? ''}
                onChange={(e) => {
                  const arr = [...(selected.overrides.buttons?.fontSizes || [])];
                  arr[i] = Number(e.target.value || 0);
                  onChange({ buttons: { ...(selected.overrides.buttons || {}), fontSizes: arr } });
                }}
              />
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={selected.overrides.buttons?.autoAdjust ?? true} onCheckedChange={(v) => onChange({ buttons: { ...(selected.overrides.buttons || {}), autoAdjust: !!v } })} />
            Ajuste automático do tamanho do texto
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input type="number" placeholder="altura (px)" value={selected.overrides.buttons?.height ?? ''} onChange={(e) => onChange({ buttons: { ...(selected.overrides.buttons || {}), height: Number(e.target.value || 0) } })} />
            <Input type="number" placeholder="espaçamento (px)" value={selected.overrides.buttons?.spacing ?? ''} onChange={(e) => onChange({ buttons: { ...(selected.overrides.buttons || {}), spacing: Number(e.target.value || 0) } })} />
            <Input type="number" placeholder="raio (px)" value={selected.overrides.buttons?.radius ?? ''} onChange={(e) => onChange({ buttons: { ...(selected.overrides.buttons || {}), radius: Number(e.target.value || 0) } })} />
            <select className="border rounded p-2" value={selected.overrides.buttons?.textAlign || 'center'} onChange={(e) => onChange({ buttons: { ...(selected.overrides.buttons || {}), textAlign: e.target.value as any } })}>
              <option value="left">Esquerda</option>
              <option value="center">Centro</option>
              <option value="right">Direita</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input type="text" placeholder="Font family" value={selected.overrides.buttons?.fontFamily ?? ''} onChange={(e) => onChange({ buttons: { ...(selected.overrides.buttons || {}), fontFamily: e.target.value } })} />
            <Input type="number" placeholder="Font weight" value={selected.overrides.buttons?.fontWeight ?? ''} onChange={(e) => onChange({ buttons: { ...(selected.overrides.buttons || {}), fontWeight: Number(e.target.value || 0) } })} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input type="text" placeholder="Seta esquerda (dataURL)" value={selected.overrides.buttons?.leftArrow ?? ''} onChange={(e) => onChange({ buttons: { ...(selected.overrides.buttons || {}), leftArrow: e.target.value } })} />
            <Input type="text" placeholder="Seta direita (dataURL)" value={selected.overrides.buttons?.rightArrow ?? ''} onChange={(e) => onChange({ buttons: { ...(selected.overrides.buttons || {}), rightArrow: e.target.value } })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Logo</Label>
          <Input type="text" placeholder="Logo dataURL" value={selected.overrides.logo?.src ?? ''} onChange={(e) => onChange({ logo: { ...(selected.overrides.logo || {}), src: e.target.value } })} />
          <select className="border rounded p-2" value={selected.overrides.logo?.align ?? 'right'} onChange={(e) => onChange({ logo: { ...(selected.overrides.logo || {}), align: e.target.value as any } })}>
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
}

