// Font utilities for Persian and English typography

export const loadFonts = async (): Promise<void> => {
  // Load Vazir font for Persian
  const vazirFont = new FontFace(
    'Vazir',
    'url(https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/Vazir-Regular.woff2)',
    {
      style: 'normal',
      weight: '400',
      display: 'swap'
    }
  );

  const vazirBoldFont = new FontFace(
    'Vazir',
    'url(https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/Vazir-Bold.woff2)',
    {
      style: 'normal',
      weight: '700',
      display: 'swap'
    }
  );

  // Load Inter font for English
  const interFont = new FontFace(
    'Inter',
    'url(https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2)',
    {
      style: 'normal',
      weight: '400',
      display: 'swap'
    }
  );

  try {
    await Promise.all([
      vazirFont.load(),
      vazirBoldFont.load(),
      interFont.load()
    ]);

    // Add fonts to document
    document.fonts.add(vazirFont);
    document.fonts.add(vazirBoldFont);
    document.fonts.add(interFont);

    console.log('Fonts loaded successfully');
  } catch (error) {
    console.error('Error loading fonts:', error);
  }
};

export const getFontFamily = (language: 'en' | 'fa'): string => {
  return language === 'fa' ? 'Vazir, sans-serif' : 'Inter, sans-serif';
};

export const getTextDirection = (language: 'en' | 'fa'): 'ltr' | 'rtl' => {
  return language === 'fa' ? 'rtl' : 'ltr';
};

export const applyFontToDocument = (language: 'en' | 'fa'): void => {
  const fontFamily = getFontFamily(language);
  const direction = getTextDirection(language);
  
  document.documentElement.style.fontFamily = fontFamily;
  document.documentElement.dir = direction;
  document.documentElement.lang = language;
};

// Font size utilities for better readability
export const getFontSizeClasses = (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl'): string => {
  const sizeMap = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl'
  };
  
  return sizeMap[size];
};

// Line height utilities for better typography
export const getLineHeightClasses = (height: 'tight' | 'normal' | 'relaxed' | 'loose'): string => {
  const heightMap = {
    tight: 'leading-tight',
    normal: 'leading-normal',
    relaxed: 'leading-relaxed',
    loose: 'leading-loose'
  };
  
  return heightMap[height];
};