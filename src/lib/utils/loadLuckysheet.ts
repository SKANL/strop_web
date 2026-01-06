/**
 * LuckySheet CDN Loader
 * Loads LuckySheet and its dependencies dynamically from CDN
 */

/**
 * Load a script from URL
 */
export const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
};

/**
 * Load a CSS stylesheet from URL
 */
export const loadCSS = (href: string): void => {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
};

/**
 * Initialize all LuckySheet dependencies from CDN
 */
export const initLuckysheetDeps = async (): Promise<void> => {
  // Load CSS first
  loadCSS(
    "https://cdn.jsdelivr.net/npm/luckysheet@2.1.13/dist/plugins/css/pluginsCss.css"
  );
  loadCSS(
    "https://cdn.jsdelivr.net/npm/luckysheet@2.1.13/dist/plugins/plugins.css"
  );
  loadCSS(
    "https://cdn.jsdelivr.net/npm/luckysheet@2.1.13/dist/css/luckysheet.css"
  );
  loadCSS(
    "https://cdn.jsdelivr.net/npm/luckysheet@2.1.13/dist/assets/iconfont/iconfont.css"
  );

  // Load jQuery if not present
  if (!(window as any).jQuery) {
    await loadScript("https://code.jquery.com/jquery-3.6.0.min.js");
  }

  // Load LuckySheet plugins
  await loadScript(
    "https://cdn.jsdelivr.net/npm/luckysheet@2.1.13/dist/plugins/js/plugin.js"
  );

  // Load LuckySheet core
  await loadScript(
    "https://cdn.jsdelivr.net/npm/luckysheet@2.1.13/dist/luckysheet.umd.js"
  );

  // Load LuckyExcel for file parsing
  await loadScript(
    "https://cdn.jsdelivr.net/npm/luckyexcel@1.0.1/dist/luckyexcel.umd.js"
  );
};

// Type declarations for LuckySheet global APIs
declare global {
  interface Window {
    luckysheet: {
      create: (options: LuckysheetOptions) => void;
      destroy: () => void;
      resize: () => void;
      getCellValue: (row: number, col: number) => any;
      setCellFormat: (
        row: number,
        col: number,
        attr: string,
        value: any
      ) => void;
      getRange: () => LuckysheetRange[];
      setRangeShow: (range: { row: number[]; column: number[] }) => void;
      getAllSheets: () => any[];
    };
    LuckyExcel: {
      transformExcelToLucky: (
        file: File,
        callback: (result: { sheets: any[] }) => void
      ) => void;
    };
    jQuery: any;
  }
}

export interface LuckysheetOptions {
  container: string;
  data?: any[];
  showinfobar?: boolean;
  lang?: "en" | "es" | "zh";
  allowEdit?: boolean;
  forceCalculation?: boolean;
  hook?: {
    rangeSelect?: (range: LuckysheetRange[]) => void;
  };
}

export interface LuckysheetRange {
  row: [number, number];
  column: [number, number];
}
