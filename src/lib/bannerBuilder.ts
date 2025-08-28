import { getContrastColor } from "./utils";

export interface BannerBuildInput {
  width: number;
  height: number;
  headline: string;
  sub?: string;
  cta: string;
  mode: "datas" | "limite";
  palette: { primary: string; secondary: string; bg: string };
  clickTag: string;
  overrides?: { hide_sub?: boolean; cta_compact?: boolean; fontAdjust?: number };
}

const TYPE_SPECS: Record<string, { headline: number; sub?: number; cta: number }> = {
  "300x250": { headline: 19, sub: 12, cta: 14 },
  "320x50": { headline: 12, cta: 11 },
  "728x90": { headline: 23, sub: 14, cta: 15 },
  "300x600": { headline: 22, sub: 15, cta: 16 },
  "160x600": { headline: 17, sub: 12, cta: 14 },
  "970x250": { headline: 28, sub: 16, cta: 18 },
};

export function buildBannerHTML(input: BannerBuildInput): string {
  const { width, height, headline, sub, cta, mode, palette, clickTag, overrides } = input;
  const sizeKey = `${width}x${height}`;
  const spec = TYPE_SPECS[sizeKey] || { headline: 20, sub: 13, cta: 16 };
  const adjust = overrides?.fontAdjust ?? 0;

  const headlineSize = spec.headline + adjust;
  const subSize = spec.sub ? spec.sub + adjust : undefined;
  const ctaSize = spec.cta + adjust;

  const showSub = !!sub && !overrides?.hide_sub && spec.sub !== undefined;

  const textColor = getContrastColor(palette.bg);
  const ctaText = getContrastColor(palette.primary);

  const modeContent =
    mode === "datas"
      ? `<div class="options-grid">
          <div class="option" onclick="selectOption(0)"><span>05</span></div>
          <div class="option" onclick="selectOption(1)"><span>15</span></div>
          <div class="option" onclick="selectOption(2)"><span>30</span></div>
        </div>`
      : `<div class="options-grid">
          <div class="option" onclick="selectOption(0)"><span>R$600</span></div>
          <div class="option" onclick="selectOption(1)"><span>R$1200</span></div>
          <div class="option" onclick="selectOption(2)"><span>Outro valor</span></div>
        </div>`;

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="ad.size" content="width=${width},height=${height}">
<title>Banner ${sizeKey}</title>
<style>
html,body{margin:0;padding:0;background:#fff;}
#ad{width:${width}px;height:${height}px;position:relative;overflow:hidden;background:${palette.bg};color:${textColor};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;text-decoration:none;display:flex;flex-direction:column;justify-content:space-between;}
.header{text-align:center;padding:4px;}
.headline{font-size:${headlineSize}px;font-weight:700;line-height:1.2;}
.sub{font-size:${subSize}px;line-height:1.3;margin-top:2px;display:${showSub ? "block" : "none"};}
.options{flex:1;display:flex;align-items:center;justify-content:center;}
.options-grid{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;}
.option{border:2px solid #ddd;border-radius:6px;padding:4px 8px;cursor:pointer;transition:all .2s;background:#f5f5f5;user-select:none;}
.option.selected{background:${palette.primary};border-color:${palette.primary};color:${ctaText};}
.cta{width:100%;background:${palette.primary};color:${ctaText};text-align:center;padding:6px 0;font-size:${ctaSize}px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;}
.logo{position:absolute;bottom:16px;right:8px;width:40px;height:20px;background:${palette.secondary};opacity:.5;}
.micro{position:absolute;bottom:0;left:0;width:100%;text-align:center;font-size:10px;color:${textColor};}
@keyframes ctaGlow{0%,100%{box-shadow:0 0 0 ${palette.primary}40;}50%{box-shadow:0 0 10px ${palette.primary}60;}}
.cta{animation:ctaGlow 2s ease-in-out 3;}
</style>
</head>
<body>
<a id="ad" href="javascript:window.open(window.clickTag)">
  <div class="header">
    <div class="headline">${headline}</div>
    ${showSub ? `<div class="sub">${sub}</div>` : ""}
  </div>
  <div class="options">${modeContent}</div>
  <div class="cta">${cta}</div>
  <div class="logo"></div>
  <div class="micro">Este anúncio pode conter elementos visuais não interativos. Sujeito à análise do emissor.</div>
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
  if (!html.includes(`<meta name="ad.size" content="width=${width},height=${height}">`)) throw new Error('ad.size missing');
  const clean = html.replace(new RegExp(clickTag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
  if (/https?:\/\//i.test(clean)) throw new Error('External URLs not allowed');
  if (!html.includes(`#ad{width:${width}px;height:${height}px`)) throw new Error('size mismatch');

  return html;
}

