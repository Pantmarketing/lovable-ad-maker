import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PreviewCard } from "./PreviewCard";

interface Item {
  id: string;
  size: string;
  html: string;
}

interface Props {
  items: Item[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function PreviewGrid({ items, selectedId, onSelect, onRemove }: Props) {
  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle>Pré-visualizações ({items.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((it) => (
          <PreviewCard
            key={it.id}
            size={it.size}
            html={it.html}
            selected={selectedId === it.id}
            onSelect={() => onSelect(it.id)}
            onRemove={() => onRemove(it.id)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

