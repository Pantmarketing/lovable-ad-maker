import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Sidebar, Maximize } from "lucide-react";
import type { BannerSize } from "@/types/banner";

const STANDARD_BANNER_SIZES: { size: BannerSize; name: string; category: string; popular?: boolean }[] = [
  { size: "300x250", name: "Medium Rectangle", category: "Popular", popular: true },
  { size: "728x90", name: "Leaderboard", category: "Popular", popular: true },
  { size: "320x50", name: "Mobile Banner", category: "Mobile", popular: true },
  { size: "300x600", name: "Half Page", category: "Sidebar" },
  { size: "160x600", name: "Wide Skyscraper", category: "Sidebar" },
  { size: "970x250", name: "Billboard", category: "Large Format" },
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Popular": return Monitor;
    case "Mobile": return Smartphone;
    case "Sidebar": return Sidebar;
    case "Large Format": return Maximize;
    default: return Monitor;
  }
};

interface BannerSizeSelectorProps {
  selectedSizes: BannerSize[];
  onSizesChange: (sizes: BannerSize[]) => void;
}

export function BannerSizeSelector({ selectedSizes, onSizesChange }: BannerSizeSelectorProps) {
  const toggleSize = (size: BannerSize) => {
    if (selectedSizes.includes(size)) {
      onSizesChange(selectedSizes.filter(s => s !== size));
    } else {
      onSizesChange([...selectedSizes, size]);
    }
  };

  const selectAllPopular = () => {
    const popularSizes = STANDARD_BANNER_SIZES.filter(s => s.popular).map(s => s.size);
    onSizesChange(popularSizes);
  };

  const clearAll = () => {
    onSizesChange([]);
  };

  return (
    <Card className="shadow-elegant">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary" />
              Tamanhos de Banner *
            </CardTitle>
            <CardDescription>
              Selecione os formatos que deseja gerar
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <button
              onClick={selectAllPopular}
              className="text-sm text-primary hover:underline"
            >
              Selecionar Populares
            </button>
            <span className="text-muted-foreground">•</span>
            <button
              onClick={clearAll}
              className="text-sm text-muted-foreground hover:underline"
            >
              Limpar Tudo
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {STANDARD_BANNER_SIZES.map(({ size, name, category, popular }) => {
            const Icon = getCategoryIcon(category);
            const isSelected = selectedSizes.includes(size);
            const [width, height] = size.split('x');
            
            return (
              <div
                key={size}
                className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                  isSelected 
                    ? "border-primary bg-primary/5 shadow-sm" 
                    : "border-border hover:bg-muted/50"
                }`}
                onClick={() => toggleSize(size)}
              >
                <Checkbox 
                  checked={isSelected}
                  onChange={() => {}} // Controlled by parent click
                />
                <Icon className="w-5 h-5 text-primary" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{name}</span>
                    {popular && (
                      <Badge variant="secondary" className="text-xs">Popular</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {size} • {category}
                  </div>
                </div>
                <div className="text-right">
                  <div 
                    className="bg-muted rounded border border-border"
                    style={{
                      width: Math.max(Math.min(parseInt(width) / 8, 40), 20),
                      height: Math.max(Math.min(parseInt(height) / 8, 30), 12),
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {selectedSizes.length > 0 && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg">
            <div className="text-sm font-medium text-primary mb-2">
              {selectedSizes.length} tamanho{selectedSizes.length > 1 ? 's' : ''} selecionado{selectedSizes.length > 1 ? 's' : ''}:
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedSizes.map(size => (
                <Badge key={size} variant="secondary">{size}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}