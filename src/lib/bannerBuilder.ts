export interface BannerBuildInput {
  width: number;
  height: number;
  headline: string;
  sub?: string;
  cta: string;
  mode: "datas" | "limite";
  palette: { primary: string; secondary: string; bg: string };
  clickTag: string;
  overrides?: { hide_sub?: boolean; cta_compact?: boolean };
}

export function buildBannerHTML(input: BannerBuildInput): string {
  const { width, height, headline, sub, cta, mode, palette, clickTag, overrides } = input;
  
  // Responsive text sizing based on banner dimensions
  const isNarrow = width <= 320;
  const isSmall = width <= 300 || height <= 100;
  const headlineSize = isNarrow ? '14px' : isSmall ? '16px' : '20px';
  const subSize = isNarrow ? '11px' : isSmall ? '12px' : '14px';
  const ctaSize = isNarrow ? '12px' : isSmall ? '14px' : '16px';
  
  // Hide sub for narrow banners or if specified in overrides
  const showSub = sub && !isNarrow && !overrides?.hide_sub;
  
  // Content based on mode
  const modeContent = mode === "datas" 
    ? `
      <div class="options-grid">
        <div class="option-item" onclick="selectOption(0)">
          <span class="option-number">05</span>
        </div>
        <div class="option-item" onclick="selectOption(1)">
          <span class="option-number">15</span>
        </div>
        <div class="option-item" onclick="selectOption(2)">
          <span class="option-number">30</span>
        </div>
      </div>
    `
    : `
      <div class="options-grid">
        <div class="option-item" onclick="selectOption(0)">
          <span class="option-text">R$600</span>
        </div>
        <div class="option-item" onclick="selectOption(1)">
          <span class="option-text">R$1200</span>
        </div>
        <div class="option-item" onclick="selectOption(2)">
          <span class="option-text">Outro valor</span>
        </div>
      </div>
    `;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="ad.size" content="width=${width},height=${height}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Banner ${width}x${height}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      width: ${width}px;
      height: ${height}px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
    }
    
    .banner-container {
      width: 100%;
      height: 100%;
      background: ${palette.bg};
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      padding: ${isSmall ? '8px' : '12px'};
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      text-decoration: none;
      color: inherit;
    }
    
    .header {
      text-align: center;
      margin-bottom: ${isSmall ? '6px' : '8px'};
    }
    
    .headline {
      font-size: ${headlineSize};
      font-weight: 700;
      color: #333;
      line-height: 1.2;
      margin-bottom: ${showSub ? '4px' : '0'};
      word-wrap: break-word;
    }
    
    .sub {
      font-size: ${subSize};
      color: #666;
      line-height: 1.3;
      display: ${showSub ? 'block' : 'none'};
    }
    
    .options-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: ${isSmall ? '4px 0' : '8px 0'};
    }
    
    .options-grid {
      display: flex;
      gap: ${isSmall ? '4px' : '8px'};
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .option-item {
      flex: 1;
      min-width: ${mode === "datas" ? '24px' : '60px'};
      height: ${isSmall ? '24px' : '32px'};
      background: #f5f5f5;
      border: 2px solid #ddd;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }
    
    .option-item:hover {
      background: ${palette.primary}20;
      border-color: ${palette.primary};
    }
    
    .option-item.selected {
      background: ${palette.primary};
      border-color: ${palette.primary};
      color: white;
    }
    
    .option-number, .option-text {
      font-size: ${isSmall ? '11px' : '13px'};
      font-weight: 600;
    }
    
    .cta-button {
      width: 100%;
      height: ${isSmall ? '28px' : '36px'};
      background: ${palette.primary};
      color: white;
      border: none;
      border-radius: 6px;
      font-size: ${ctaSize};
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: ${isSmall ? '4px' : '8px'};
    }
    
    .cta-button:hover {
      background: ${palette.secondary};
      transform: translateY(-1px);
    }
    
    .disclaimer {
      font-size: 8px;
      color: #999;
      text-align: center;
      margin-top: 4px;
      line-height: 1.2;
    }
    
    .logo-placeholder {
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: 20px;
      height: 20px;
      background: url('assets/logo.png') center/contain no-repeat;
      opacity: 0.7;
    }
    
    /* Animation */
    .banner-container {
      animation: fadeIn 0.5s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.98); }
      to { opacity: 1; transform: scale(1); }
    }
    
    .option-item {
      animation: slideUp 0.3s ease-out forwards;
      opacity: 0;
    }
    
    .option-item:nth-child(1) { animation-delay: 0.1s; }
    .option-item:nth-child(2) { animation-delay: 0.2s; }
    .option-item:nth-child(3) { animation-delay: 0.3s; }
    
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .cta-button {
      animation: ctaGlow 2s ease-in-out infinite;
    }
    
    @keyframes ctaGlow {
      0%, 100% { box-shadow: 0 2px 8px ${palette.primary}40; }
      50% { box-shadow: 0 4px 16px ${palette.primary}60; }
    }
  </style>
</head>
<body>
  <a href="javascript:void(0)" onclick="window.open(window.clickTag || '${clickTag}', '_blank')" class="banner-container">
    <div class="header">
      <div class="headline">${headline}</div>
      ${showSub ? `<div class="sub">${sub}</div>` : ''}
    </div>
    
    <div class="options-container">
      ${modeContent}
    </div>
    
    <button class="cta-button" type="button">${cta}</button>
    
    <div class="disclaimer">
      Este anúncio pode conter elementos visuais não interativos. Sujeito à análise do emissor.
    </div>
    
    <div class="logo-placeholder"></div>
  </a>

  <script>
    window.clickTag = "${clickTag}";
    
    function selectOption(index) {
      // Remove selected class from all options
      const options = document.querySelectorAll('.option-item');
      options.forEach(option => option.classList.remove('selected'));
      
      // Add selected class to clicked option
      if (options[index]) {
        options[index].classList.add('selected');
      }
      
      // Prevent event bubbling to avoid triggering the banner click
      event.stopPropagation();
    }
    
    // Preselect first option
    document.addEventListener('DOMContentLoaded', () => {
      selectOption(0);
    });
  </script>
</body>
</html>`;
}