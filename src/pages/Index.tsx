import { useMemo, useState } from "react";
import AdConfigPanel from "@/components/AdConfigPanel";
import PreviewGrid from "@/components/PreviewGrid";
import PreviewSettings from "@/components/PreviewSettings";
import ExportPanel from "@/components/ExportPanel";
import type { GlobalConfig, Palette, PreviewCardModel } from "@/types/ads";
import { buildHtmlAd } from "@/lib/buildHtmlAd";

const defaultPalette: Palette = { primary: "#2563EB", secondary: "#1E40AF", bg: "#FFFFFF", textOnPrimary: "#fff" };

const Index = () => {
  const [global, setGlobal] = useState<GlobalConfig>({
    sizes: ["200x200", "300x250", "320x50"],
    palettes: [defaultPalette],
    headline: "Escolha qual limite você precisa:",
    headlineMarginBottom: 6,
    buttonLines: ["R$600", "R$1200", "Outro valor"],
    alignments: { title: 'center', buttons: 'center', logo: 'right' },
    clickTag: "javascript:;", // will be validated; UI will set real
    mode: 'limite'
  });

  const [cards, setCards] = useState<PreviewCardModel[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(() => cards.find(c => c.id === selectedId) || null, [cards, selectedId]);

  const createPreviews = () => {
    const next: PreviewCardModel[] = [];
    global.sizes.forEach(size => {
      (global.palettes.length ? global.palettes : [defaultPalette]).forEach((palette) => {
        const id = `${size}-${palette.primary}-${Math.random().toString(36).slice(2, 7)}`;
        const base: PreviewCardModel = { id, size, palette, overrides: {} };
        const html = buildHtmlAd(base, global);
        next.push({ ...base, html });
      });
    });
    setCards(next);
    setSelectedId(next[0]?.id || null);
  };

  const updateSelected = (changes: Partial<PreviewCardModel["overrides"]>) => {
    setCards(prev => prev.map(c => {
      if (c.id !== selectedId) return c;
      const overrides = { ...c.overrides, ...changes, buttons: { ...c.overrides.buttons, ...changes.buttons }, title: { ...c.overrides.title, ...changes.title }, logo: { ...c.overrides.logo, ...changes.logo } };
      const updated = { ...c, overrides };
      const html = buildHtmlAd(updated, global);
      return { ...updated, html };
    }));
  };

  const removeCard = (id: string) => {
    setCards(prev => prev.filter(c => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-background">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-1 h-[calc(100vh-2rem)]">
          <AdConfigPanel global={global} setGlobal={(u) => setGlobal(typeof u === 'function' ? (u as any)(global) : u)} onCreate={createPreviews} />
        </div>
        <div className="lg:col-span-1 h-[calc(100vh-2rem)]">
          <PreviewGrid
            items={cards.map(c => ({ id: c.id, size: c.size, html: c.html || '' }))}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onRemove={removeCard}
          />
        </div>
        <div className="lg:col-span-1 h-[calc(100vh-2rem)] space-y-4">
          <PreviewSettings selected={selected} onChange={updateSelected} />
          <ExportPanel items={cards.map(c => ({ size: c.size, html: c.html || '' }))} bg={global.palettes[0]?.bg} />
        </div>
      </div>
    </div>
  );
};

export default Index;
