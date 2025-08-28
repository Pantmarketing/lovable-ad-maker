import type { PreviewCardModel, GlobalConfig } from "@/types/ads";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function parseSize(size: string): { width: number; height: number } {
  const [w, h] = size.split("x").map(Number);
  return { width: w, height: h };
}

function pickTypeSpec(width: number, height: number) {
  const key = `${width}x${height}`;
  const map: Record<string, { title: number; button: number }> = {
    "200x200": { title: 17, button: 13 },
    "250x250": { title: 19, button: 14 },
    "300x250": { title: 19, button: 14 },
    "320x50": { title: 12, button: 11 },
    "728x90": { title: 23, button: 15 },
    "300x600": { title: 22, button: 16 },
    "160x600": { title: 17, button: 13 },
    "970x250": { title: 28, button: 18 },
  };
  return map[key] || { title: clamp(Math.round(height * 0.09), 12, 28), button: clamp(Math.round(height * 0.07), 11, 18) };
}

export function buildHtmlAd(card: PreviewCardModel, global: GlobalConfig): string {
  const { width, height } = parseSize(card.size);
  const palette = card.palette;
  const overrides = card.overrides || {};

  const spec = pickTypeSpec(width, height);

  const titleFontSize = overrides.title?.fontSize ?? spec.title;
  const titleFontWeight = overrides.title?.fontWeight ?? 700;
  const titleFontFamily = overrides.title?.fontFamily ?? "system-ui, Arial, sans-serif";
  const titleMarginBottom = overrides.title?.marginBottom ?? global.headlineMarginBottom ?? 6;

  const buttonTexts = overrides.buttons?.texts ?? (global.mode === "datas" ? ["05", "15", "30"] : global.buttonLines);
  const buttonFontSizes = overrides.buttons?.fontSizes ?? new Array(buttonTexts.length).fill(spec.button);
  const autoAdjust = overrides.buttons?.autoAdjust ?? true;
  const buttonFontFamily = overrides.buttons?.fontFamily ?? "system-ui, Arial, sans-serif";
  const buttonFontWeight = overrides.buttons?.fontWeight ?? 700;
  const buttonHeight = overrides.buttons?.height ?? 50;
  const buttonSpacing = overrides.buttons?.spacing ?? 6;
  const buttonRadius = overrides.buttons?.radius ?? 6;
  const buttonsTextAlign = overrides.buttons?.textAlign ?? global.alignments.buttons;
  const leftArrow = overrides.buttons?.leftArrow;
  const rightArrow = overrides.buttons?.rightArrow;

  const logoSrc = overrides.logo?.src;
  const logoAlign = overrides.logo?.align ?? global.alignments.logo;

  const titleAlign = global.alignments.title;

  const textOnPrimary = palette.textOnPrimary === "#111" ? "#111" : "#fff";

  const headlineImage = global.headlineImage ? `<img alt="" src="${global.headlineImage}" style="height:${Math.round(titleFontSize * 1.4)}px;margin-right:6px;vertical-align:middle;border:0;"/>` : "";

  const optionsMarkup = buttonTexts
    .map((txt, idx) => {
      const fs = buttonFontSizes[idx] ?? spec.button;
      const dataLeft = leftArrow ? `<img alt="" src="${leftArrow}" style="height:${Math.max(12, fs)}px;margin-right:6px;"/>` : "";
      const dataRight = rightArrow ? `<img alt="" src="${rightArrow}" style="height:${Math.max(12, fs)}px;margin-left:6px;"/>"` : "";
      return `<button class=\"btn\" data-i=\"${idx}\" style=\"font-size:${fs}px;\">${dataLeft}<span class=\"btn-txt\">${txt}</span>${dataRight}</button>`;
    })
    .join("");

  const html = `<!DOCTYPE html><html lang="pt-BR"><head>
<meta charset="utf-8">
<meta name="ad.size" content="width=${width},height=${height}">
<title>Ad ${width}x${height}</title>
<style>
html,body{margin:0;padding:0}
#ad{width:${width}px;height:${height}px;position:relative;overflow:hidden;background:${palette.bg};font-family:system-ui,Arial,sans-serif;color:#111;text-decoration:none;display:flex;flex-direction:column}
.top{padding:8px 10px 0 10px;text-align:${titleAlign}}
.headline{display:inline-flex;align-items:center;gap:6px;font-size:${titleFontSize}px;font-weight:${titleFontWeight};font-family:${titleFontFamily};margin-bottom:${titleMarginBottom}px}
.buttons{flex:1;display:flex;align-items:center;justify-content:center;padding:0 8px}
.stack{display:flex;flex-direction:column;gap:${buttonSpacing}px;align-items:${buttonsTextAlign === 'left' ? 'flex-start' : buttonsTextAlign === 'right' ? 'flex-end' : 'center'};width:100%}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-width:40%;height:${buttonHeight}px;padding:0 12px;border-radius:${buttonRadius}px;border:0;background:${palette.primary};color:${textOnPrimary};font-weight:${buttonFontWeight};font-family:${buttonFontFamily};cursor:default;user-select:none;transition:opacity .2s}
.btn.selected{outline:2px solid ${palette.secondary}}
.cta{position:absolute;left:0;right:0;bottom:0;height:${Math.max(24, Math.round(height*0.14))}px;background:${palette.primary};color:${textOnPrimary};display:flex;align-items:center;justify-content:center;font-weight:700;letter-spacing:.3px}
.logo{position:absolute;right:${logoAlign==='right'?8:logoAlign==='center'?width/2-20:8}px;bottom:${Math.max(6, Math.round(height*0.14)+6)}px;width:40px;height:20px;background:${palette.secondary}80}
.foot{position:absolute;left:0;right:0;bottom:0;transform:translateY(100%);white-space:normal;text-align:center;font-size:10px;line-height:1.2;color:#333}
@keyframes fadeUp{0%{opacity:0;transform:translateY(6px)}60%{opacity:1;transform:translateY(0)}100%{opacity:1}}
.headline,.btn,.cta{animation:fadeUp 3s ease-in-out 3}
.btn .btn-txt{max-width:${Math.round(width*0.6)}px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
</style>
</head><body>
<a id="ad" href="javascript:window.open(window.clickTag)">
  <div class="top"><div class="headline">${headlineImage}${global.headline}</div></div>
  <div class="buttons"><div class="stack">${optionsMarkup}</div></div>
  <div class="cta">${global.mode === 'datas' ? 'FAÇA O TESTE' : (global.buttonLines?.[0] || 'FAÇA O TESTE')}</div>
  <div class="logo" aria-hidden="true"></div>
  <div class="foot">Este anúncio pode conter elementos visuais não interativos. Sujeito à análise do emissor.</div>
</a>
<script>
window.clickTag = "${global.clickTag}";
var buttons = Array.from(document.querySelectorAll('.btn'));
function applyAutoFit(el){
  var label = el.querySelector('.btn-txt');
  if(!label) return;
  var fs = parseInt(window.getComputedStyle(el).fontSize,10);
  var limit = fs - 3;
  if(${autoAdjust ? 'true' : 'false'}){
    while(label.scrollWidth > el.clientWidth - 20 && fs > limit){
      fs -= 1; el.style.fontSize = fs + 'px';
    }
    if(label.scrollWidth > el.clientWidth - 20){ label.style.textOverflow = 'ellipsis'; label.style.overflow='hidden'; }
  }
}
buttons.forEach(function(b){b.addEventListener('click', function(e){e.stopPropagation();buttons.forEach(function(x){x.classList.remove('selected')});b.classList.add('selected')});applyAutoFit(b)});
</script>
</body></html>`;

  // Validations
  if (!html.includes('window.clickTag')) throw new Error('clickTag missing');
  if (!html.includes(`<meta name="ad.size" content="width=${width},height=${height}">`)) throw new Error('ad.size missing');
  if (/https?:\/\//i.test(html)) throw new Error('External URLs not allowed');
  if (!html.includes(`#ad{width:${width}px;height:${height}px`)) throw new Error('size mismatch');

  return html;
}

