import { getContrastColor } from "./utils";

export interface BannerBuildInput {
  width: number;
  height: number;
  headline: string;
  /** override default button labels */
  options?: string[];
  /** fallback presets for options */
  mode?: "datas" | "limite";
  palette: { primary: string; bg: string };
  clickTag: string;
  /** optional font size adjustment from auto-fit */
  fontAdjust?: number;
}

const TYPE_SPECS: Record<string, { headline: number }> = {
  "300x250": { headline: 19 },
  "320x50": { headline: 12 },
  "728x90": { headline: 23 },
  "300x600": { headline: 22 },
  "160x600": { headline: 17 },
  "970x250": { headline: 28 },
};

export function buildBannerHTML(input: BannerBuildInput): string {
  const { width, height, headline, options, mode = "limite", palette, clickTag, fontAdjust } = input;
  const sizeKey = `${width}x${height}`;
  const spec = TYPE_SPECS[sizeKey] || { headline: 20 };
  const headlineSize = spec.headline + (fontAdjust ?? 0);

  const defaultOptions =
    mode === "datas" ? ["05", "15", "30"] : ["R$600", "R$1200", "Outro valor"];
  const opts = options && options.length > 0 ? options : defaultOptions;

  const textColor = getContrastColor(palette.bg);
  const optSelected = getContrastColor(palette.primary);

  const optionsHtml = opts
    .map(
      (o, i) =>
        `<div class="option" onclick="selectOption(${i})"><span>${o}</span></div>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="ad.size" content="width=${width},height=${height}">
<title>Banner ${sizeKey}</title>
<style>
html,body{margin:0;padding:0;background:#fff;}
#ad{width:${width}px;height:${height}px;position:relative;overflow:hidden;background:${palette.bg};color:${textColor};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;text-decoration:none;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:12px;}
.headline{text-align:center;font-weight:700;font-size:${headlineSize}px;line-height:1.2;padding:4px;}
.options{display:flex;flex-direction:column;gap:8px;}
.option{border:2px solid ${textColor};border-radius:6px;padding:6px 12px;cursor:pointer;transition:all .2s;background:#f5f5f5;user-select:none;}
.option.selected{background:${palette.primary};border-color:${palette.primary};color:${optSelected};}
</style>
</head>
<body>
<a id="ad" href="javascript:window.open(window.clickTag)">
  <div class="headline">${headline}</div>
  <div class="options">${optionsHtml}</div>
</a>
<script>
window.clickTag="${clickTag}";
function selectOption(i){var opts=document.querySelectorAll('.option');opts.forEach(o=>o.classList.remove('selected'));if(opts[i])opts[i].classList.add('selected');event.stopPropagation();}
document.addEventListener('DOMContentLoaded',function(){selectOption(0);});
</script>
</body>
</html>`;

  // Basic validations
  if (!html.includes('window.clickTag')) throw new Error('clickTag missing');
  if (!html.includes(`<meta name="ad.size" content="width=${width},height=${height}">`))
    throw new Error('ad.size missing');
  const clean = html.replace(
    new RegExp(clickTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
    ''
  );
  if (/https?:\/\//i.test(clean)) throw new Error('External URLs not allowed');
  if (!html.includes(`#ad{width:${width}px;height:${height}px`))
    throw new Error('size mismatch');

  return html;
}

