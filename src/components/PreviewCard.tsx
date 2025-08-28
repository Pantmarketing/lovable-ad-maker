import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Code2 } from "lucide-react";

interface PreviewCardProps {
  size: string;
  html: string;
  selected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
}

/**
 * Preview a banner in correct scale inside a card.
 * The iframe is scaled using a wrapper so the internal
 * HTML remains untouched.
 */
export function PreviewCard({ size, html, selected, onSelect, onRemove }: PreviewCardProps) {
  const [width, height] = size.split("x").map(Number);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const newScale = Math.min(clientWidth / width, clientHeight / height);
      setScale(newScale);
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [width, height]);

  const openPreview = () => {
    const win = window.open();
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  };

  return (
    <Card className={`shadow-elegant ${selected ? 'ring-2 ring-primary' : ''}`} onClick={onSelect} role="button" tabIndex={0}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{size}</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="xs" onClick={openPreview}>
            <ExternalLink className="w-4 h-4" />
            Abrir em Nova Janela
          </Button>
          {onRemove && (
            <Button variant="ghost" size="xs" onClick={(e) => { e.stopPropagation(); onRemove(); }}>Remover</Button>
          )}
          <Button
            variant="ghost"
            size="xs"
            onClick={() => navigator.clipboard.writeText(html)}
          >
            <Code2 className="w-4 h-4" />
            Copiar HTML
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={containerRef}
          className="relative w-full h-64 bg-[#F5F5F7] overflow-hidden"
        >
          <div
            style={{
              width,
              height,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <iframe
              srcDoc={html}
              width={width}
              height={height}
              style={{ border: "none", pointerEvents: "none" }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

