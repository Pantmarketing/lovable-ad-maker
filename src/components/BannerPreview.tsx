import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, FileImage, Code } from "lucide-react";
import type { PlannerInput } from "@/types/banner";
import { PreviewCard } from "./PreviewCard";

interface BannerPreviewProps {
  banners: Record<string, string>;
  formData: PlannerInput;
  onBack: () => void;
  onExport: () => void;
  exportMode: "html" | "jpg" | "both";
  onExportModeChange: (mode: "html" | "jpg" | "both") => void;
}

export function BannerPreview({ banners, formData, onBack, onExport, exportMode, onExportModeChange }: BannerPreviewProps) {
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
        {Object.entries(banners).map(([size, html]) => (
          <PreviewCard key={size} size={size} html={html} />
        ))}
      </div>

      <Card className="bg-gradient-subtle border-primary/20">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Opções de Exportação</h3>
              <p className="text-sm text-muted-foreground">
                Escolha o formato dos arquivos que deseja baixar
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  exportMode === "html" || exportMode === "both" 
                    ? "border-primary bg-primary/5" 
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => onExportModeChange(exportMode === "html" ? "both" : "html")}
              >
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={exportMode === "html" || exportMode === "both"}
                    onChange={() => {}}
                  />
                  <Code className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">ZIP HTML5</div>
                    <div className="text-sm text-muted-foreground">
                      Banners interativos para Google Ads
                    </div>
                  </div>
                </div>
              </div>
              
              <div 
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  exportMode === "jpg" || exportMode === "both" 
                    ? "border-primary bg-primary/5" 
                    : "border-muted hover:border-primary/50"
                }`}
                onClick={() => onExportModeChange(exportMode === "jpg" ? "both" : "jpg")}
              >
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={exportMode === "jpg" || exportMode === "both"}
                    onChange={() => {}}
                  />
                  <FileImage className="w-5 h-5 text-primary" />
                  <div>
                    <div className="font-medium">JPG Estático</div>
                    <div className="text-sm text-muted-foreground">
                      Imagens para redes sociais e impressão
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Após exportar, você pode fazer upload dos banners diretamente no Google Ads. 
                Cada tamanho está otimizado para máxima performance e compliance.
              </p>
              <Button 
                variant="creative" 
                size="lg" 
                onClick={onExport}
                disabled={exportMode === "both" ? false : !exportMode}
              >
                <Download className="w-4 h-4" />
                {exportMode === "both" ? "Exportar Ambos" : 
                 exportMode === "html" ? "Exportar HTML5" : 
                 exportMode === "jpg" ? "Exportar JPG" : "Selecione um Formato"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}