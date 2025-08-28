import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Palette, Wand2 } from "lucide-react";

const COLOR_PRESETS = [
  { name: "Tecnologia", primary: "#6366f1", secondary: "#8b5cf6", bg: "#f8fafc" },
  { name: "Saúde", primary: "#10b981", secondary: "#06b6d4", bg: "#f0fdf4" },
  { name: "Finanças", primary: "#3b82f6", secondary: "#1d4ed8", bg: "#eff6ff" },
  { name: "E-commerce", primary: "#f59e0b", secondary: "#ef4444", bg: "#fffbeb" },
  { name: "Educação", primary: "#8b5cf6", secondary: "#ec4899", bg: "#faf5ff" },
  { name: "Alimentação", primary: "#ef4444", secondary: "#f97316", bg: "#fef2f2" },
];

interface ColorPalettePickerProps {
  selectedPalette: { primary?: string; secondary?: string; bg?: string };
  onPaletteChange: (palette: { primary?: string; secondary?: string; bg?: string }) => void;
}

export function ColorPalettePicker({ selectedPalette, onPaletteChange }: ColorPalettePickerProps) {
  const [customMode, setCustomMode] = useState(false);

  const selectPreset = (preset: typeof COLOR_PRESETS[0]) => {
    onPaletteChange({
      primary: preset.primary,
      secondary: preset.secondary,
      bg: preset.bg,
    });
    setCustomMode(false);
  };

  const updateCustomColor = (field: 'primary' | 'secondary' | 'bg', value: string) => {
    onPaletteChange({
      ...selectedPalette,
      [field]: value,
    });
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Paleta de Cores
        </CardTitle>
        <CardDescription>
          Escolha as cores principais dos seus banners
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={!customMode ? "default" : "outline"}
            size="sm"
            onClick={() => setCustomMode(false)}
          >
            Presets
          </Button>
          <Button
            variant={customMode ? "default" : "outline"}
            size="sm"
            onClick={() => setCustomMode(true)}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Personalizar
          </Button>
        </div>

        {!customMode ? (
          <div className="grid grid-cols-2 gap-3">
            {COLOR_PRESETS.map((preset) => {
              const isSelected = 
                selectedPalette.primary === preset.primary &&
                selectedPalette.secondary === preset.secondary &&
                selectedPalette.bg === preset.bg;

              return (
                <div
                  key={preset.name}
                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                    isSelected 
                      ? "border-primary bg-primary/5 shadow-sm" 
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => selectPreset(preset)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      <div 
                        className="w-4 h-4 rounded border border-white/20"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded border border-white/20"
                        style={{ backgroundColor: preset.secondary }}
                      />
                      <div 
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: preset.bg }}
                      />
                    </div>
                    <span className="text-sm font-medium">{preset.name}</span>
                  </div>
                  {isSelected && (
                    <Badge variant="secondary" className="text-xs">Selecionado</Badge>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primary">Cor Primária</Label>
                <div className="flex gap-2">
                  <Input
                    id="primary"
                    type="color"
                    value={selectedPalette.primary || "#6366f1"}
                    onChange={(e) => updateCustomColor("primary", e.target.value)}
                    className="w-12 h-10 p-1 border-2"
                  />
                  <Input
                    value={selectedPalette.primary || "#6366f1"}
                    onChange={(e) => updateCustomColor("primary", e.target.value)}
                    placeholder="#6366f1"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary">Cor Secundária</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondary"
                    type="color"
                    value={selectedPalette.secondary || "#8b5cf6"}
                    onChange={(e) => updateCustomColor("secondary", e.target.value)}
                    className="w-12 h-10 p-1 border-2"
                  />
                  <Input
                    value={selectedPalette.secondary || "#8b5cf6"}
                    onChange={(e) => updateCustomColor("secondary", e.target.value)}
                    placeholder="#8b5cf6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bg">Fundo</Label>
                <div className="flex gap-2">
                  <Input
                    id="bg"
                    type="color"
                    value={selectedPalette.bg || "#f8fafc"}
                    onChange={(e) => updateCustomColor("bg", e.target.value)}
                    className="w-12 h-10 p-1 border-2"
                  />
                  <Input
                    value={selectedPalette.bg || "#f8fafc"}
                    onChange={(e) => updateCustomColor("bg", e.target.value)}
                    placeholder="#f8fafc"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-muted/30">
              <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                Preview da Paleta
              </Label>
              <div className="flex gap-2">
                <div 
                  className="flex-1 h-12 rounded border flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: selectedPalette.primary || "#6366f1" }}
                >
                  Primária
                </div>
                <div 
                  className="flex-1 h-12 rounded border flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: selectedPalette.secondary || "#8b5cf6" }}
                >
                  Secundária
                </div>
                <div 
                  className="flex-1 h-12 rounded border flex items-center justify-center text-gray-700 text-sm font-medium"
                  style={{ backgroundColor: selectedPalette.bg || "#f8fafc" }}
                >
                  Fundo
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}