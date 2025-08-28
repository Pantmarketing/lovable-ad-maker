import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Download, Play, CheckCircle, AlertCircle, Palette, Target, Zap } from "lucide-react";
import { BannerSizeSelector } from "./BannerSizeSelector";
import { ColorPalettePicker } from "./ColorPalettePicker";
import { BannerPreview } from "./BannerPreview";
import type { PlannerInput, BannerSize } from "@/types/banner";
import { buildBannerHTML, type BannerBuildInput } from "@/lib/bannerBuilder";
import { exportHTMLZip, exportStaticJPG, downloadFile } from "@/lib/exportService";

const TONE_OPTIONS = [
  { value: "direto", label: "Direto", description: "Tom objetivo e claro", icon: Target },
  { value: "amigável", label: "Amigável", description: "Tom casual e próximo", icon: CheckCircle },
  { value: "premium", label: "Premium", description: "Tom sofisticado e elegante", icon: Sparkles },
  { value: "urgente", label: "Urgente", description: "Tom de scarcidade e ação", icon: Zap },
  { value: "educativo", label: "Educativo", description: "Tom informativo e útil", icon: AlertCircle },
];

export function BannerGenerator() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<"config" | "preview" | "export">("config");
  const [generatedBanners, setGeneratedBanners] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<PlannerInput>({
    nicho: "",
    proposta: "",
    tom: "",
    tamanhos: [],
    paletaPreferida: {},
    clickTag: "",
  });

  const [exportMode, setExportMode] = useState<"html" | "jpg" | "both">("html");

  const handleGenerate = async () => {
    if (!formData.nicho || !formData.proposta || !formData.tom || formData.tamanhos.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Generate banners using the new builder
      const generatedBanners: Record<string, string> = {};
      
      const palette = {
        primary: formData.paletaPreferida?.primary || '#E53935',
        secondary: formData.paletaPreferida?.secondary || '#666666',
        bg: formData.paletaPreferida?.bg || '#FFFFFF'
      };
      
      formData.tamanhos.forEach(size => {
        const [width, height] = size.split('x').map(Number);
        
        const bannerInput: BannerBuildInput = {
          width,
          height,
          headline: formData.proposta.slice(0, width <= 320 ? 18 : 36),
          sub: width <= 320 ? undefined : `Aproveite as melhores condições do ${formData.nicho}`,
          cta: "FAÇA O TESTE",
          mode: formData.nicho.toLowerCase().includes('cartão') || formData.nicho.toLowerCase().includes('crédit') ? "limite" : "datas",
          palette,
          clickTag: formData.clickTag || 'https://example.com',
          overrides: {
            hide_sub: width <= 320,
            cta_compact: width <= 320
          }
        };
        
        generatedBanners[size] = buildBannerHTML(bannerInput);
      });
      
      setGeneratedBanners(generatedBanners);
      setCurrentStep("preview");
      
      toast({
        title: "Banners gerados com sucesso!",
        description: `${formData.tamanhos.length} banners foram criados e estão prontos para visualização.`,
      });
    } catch (error) {
      toast({
        title: "Erro na geração",
        description: "Ocorreu um erro ao gerar os banners. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async () => {
    try {
      const timestamp = new Date().toISOString().slice(0, 16).replace(/[:-]/g, '');
      
      if (exportMode === "html" || exportMode === "both") {
        toast({
          title: "Exportando HTML5",
          description: "Preparando arquivo ZIP com banners HTML5...",
        });
        
        const htmlZip = await exportHTMLZip(generatedBanners);
        downloadFile(htmlZip, `banners-html5-${timestamp}.zip`);
      }
      
      if (exportMode === "jpg" || exportMode === "both") {
        toast({
          title: "Exportando JPG",
          description: "Gerando imagens estáticas...",
        });
        
        try {
          const jpgZip = await exportStaticJPG({
            htmlBySize: generatedBanners,
            background: formData.paletaPreferida?.bg || '#FFFFFF',
            quality: 0.92
          });
          downloadFile(jpgZip, `banners-static-${timestamp}.zip`);
        } catch (error) {
          toast({
            title: "Erro na exportação JPG",
            description: "Usando HTML5 como fallback. Para JPG, configure o servidor.",
            variant: "destructive",
          });
          // Fallback to HTML export
          const htmlZip = await exportHTMLZip(generatedBanners);
          downloadFile(htmlZip, `banners-html5-${timestamp}.zip`);
        }
      }
      
      setCurrentStep("export");
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Ocorreu um erro ao exportar os banners. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const updateFormData = (field: keyof PlannerInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-primary bg-clip-text text-transparent mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">AI Banner Studio</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Crie banners HTML5 profissionais para Google Ads com inteligência artificial. 
            Otimizados para performance e compliance.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {[
              { key: "config", label: "Configuração", icon: Target },
              { key: "preview", label: "Visualização", icon: Play },
              { key: "export", label: "Exportar", icon: Download },
            ].map(({ key, label, icon: Icon }, index) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  currentStep === key 
                    ? "bg-primary text-primary-foreground shadow-creative" 
                    : index < ["config", "preview", "export"].indexOf(currentStep)
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </div>
                {index < 2 && (
                  <div className={`w-8 h-0.5 ${
                    index < ["config", "preview", "export"].indexOf(currentStep)
                      ? "bg-primary"
                      : "bg-muted"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        {currentStep === "config" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configuration Form */}
            <div className="space-y-6">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Briefing Criativo
                  </CardTitle>
                  <CardDescription>
                    Defina os parâmetros básicos para seus banners
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="space-y-2">
                     <Label htmlFor="nicho">Nicho / Segmento *</Label>
                     <Input
                       id="nicho"
                       placeholder="Ex: Cartão de Crédito, E-commerce, SaaS, Educação..."
                       value={formData.nicho}
                       onChange={(e) => updateFormData("nicho", e.target.value)}
                     />
                     <div className="flex gap-2 mt-2">
                       <Button
                         type="button"
                         variant="outline"
                         size="sm"
                         onClick={() => {
                           updateFormData("nicho", "Cartão de Crédito");
                           updateFormData("proposta", "Cartão disponível para negativados - Escolha a data do vencimento");
                           updateFormData("tom", "urgente");
                           updateFormData("clickTag", "https://exemplo.com/cartao-credito");
                         }}
                       >
                         Exemplo: Cartão de Crédito
                       </Button>
                     </div>
                   </div>

                  <div className="space-y-2">
                    <Label htmlFor="proposta">Proposta de Valor *</Label>
                    <Textarea
                      id="proposta"
                      placeholder="Descreva o benefício principal do seu produto/serviço..."
                      value={formData.proposta}
                      onChange={(e) => updateFormData("proposta", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tom de Comunicação *</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {TONE_OPTIONS.map(({ value, label, description, icon: Icon }) => (
                        <div
                          key={value}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                            formData.tom === value 
                              ? "border-primary bg-primary/5 shadow-sm" 
                              : "border-border"
                          }`}
                          onClick={() => updateFormData("tom", value)}
                        >
                          <Icon className="w-4 h-4 text-primary" />
                          <div className="flex-1">
                            <div className="font-medium">{label}</div>
                            <div className="text-sm text-muted-foreground">{description}</div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            formData.tom === value 
                              ? "border-primary bg-primary" 
                              : "border-muted-foreground"
                          }`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="clickTag">URL de Destino *</Label>
                    <Input
                      id="clickTag"
                      placeholder="https://seusite.com/landing-page"
                      value={formData.clickTag}
                      onChange={(e) => updateFormData("clickTag", e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <BannerSizeSelector
                selectedSizes={formData.tamanhos}
                onSizesChange={(sizes) => updateFormData("tamanhos", sizes)}
              />

              <ColorPalettePicker
                selectedPalette={formData.paletaPreferida || {}}
                onPaletteChange={(palette) => updateFormData("paletaPreferida", palette)}
              />
            </div>

            {/* Preview/Info Panel */}
            <div className="space-y-6">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Resumo da Configuração
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nicho</Label>
                      <p className="text-sm">{formData.nicho || "Não definido"}</p>
                    </div>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Tom</Label>
                      <p className="text-sm">{TONE_OPTIONS.find(t => t.value === formData.tom)?.label || "Não definido"}</p>
                    </div>
                    <Separator />
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Tamanhos Selecionados</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.tamanhos.map(size => (
                          <Badge key={size} variant="secondary">{size}</Badge>
                        ))}
                        {formData.tamanhos.length === 0 && (
                          <span className="text-sm text-muted-foreground">Nenhum tamanho selecionado</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button 
                  variant="creative" 
                  size="lg" 
                  className="flex-1"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Gerando Banners...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Gerar Banners
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === "preview" && (
          <BannerPreview
            banners={generatedBanners}
            formData={formData}
            onBack={() => setCurrentStep("config")}
            onExport={handleExport}
            exportMode={exportMode}
            onExportModeChange={setExportMode}
          />
        )}

        {currentStep === "export" && (
          <Card className="max-w-2xl mx-auto shadow-elegant">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Banners Exportados!
              </CardTitle>
              <CardDescription>
                Seus banners HTML5 foram empacotados e estão prontos para uso
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-gradient-subtle p-6 rounded-lg">
                <Download className="w-12 h-12 text-primary mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  O arquivo ZIP contém todos os banners nos tamanhos selecionados, 
                  prontos para upload no Google Ads.
                </p>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep("config")}
                >
                  Gerar Novos Banners
                </Button>
                <Button variant="creative">
                  <Download className="w-4 h-4" />
                  Download ZIP
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}