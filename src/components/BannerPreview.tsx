import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, ExternalLink, Code2 } from "lucide-react";
import type { PlannerInput } from "@/types/banner";

interface BannerPreviewProps {
  banners: Record<string, string>;
  formData: PlannerInput;
  onBack: () => void;
  onExport: () => void;
}

export function BannerPreview({ banners, formData, onBack, onExport }: BannerPreviewProps) {
  const openPreview = (html: string) => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(html);
      newWindow.document.close();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Visualização dos Banners</h2>
          <p className="text-muted-foreground">
            Revise seus banners antes de exportar
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <Button variant="creative" onClick={onExport}>
            <Download className="w-4 h-4" />
            Exportar ZIP
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(banners).map(([size, html]) => {
          const [width, height] = size.split('x').map(Number);
          
          return (
            <Card key={size} className="shadow-elegant">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{size}</CardTitle>
                    <CardDescription>
                      {width} × {height} pixels
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">HTML5</Badge>
                    <Badge variant="outline">Otimizado</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 bg-muted/10">
                  <div className="flex items-center justify-center min-h-[120px]">
                    <div 
                      className="border border-border bg-white rounded shadow-sm overflow-hidden"
                      style={{ 
                        width: Math.min(width, 400), 
                        height: Math.min(height, 300),
                        transform: width > 400 || height > 300 ? 'scale(0.8)' : 'scale(1)',
                        transformOrigin: 'center'
                      }}
                    >
                      <iframe
                        srcDoc={html}
                        width={width}
                        height={height}
                        style={{ 
                          width: width, 
                          height: height, 
                          border: 'none',
                          pointerEvents: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openPreview(html)}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Abrir em Nova Janela
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(html);
                    }}
                  >
                    <Code2 className="w-4 h-4" />
                    Copiar HTML
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-subtle border-primary/20">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">Próximos Passos</h3>
            <p className="text-sm text-muted-foreground">
              Após exportar, você pode fazer upload dos banners diretamente no Google Ads. 
              Cada tamanho está otimizado para maximum performance e compliance.
            </p>
            <Button variant="creative" size="lg" onClick={onExport} className="mt-4">
              <Download className="w-4 h-4" />
              Exportar Todos os Banners
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}