export interface AuraSurfaceTokens {
  blur?: string       // glass, frosted blur amount
  opacity?: number    // background opacity
  border?: string     // border color
}

export interface AuraConfig {
  tokens?: {
    tone?: {
      primary?: string
      danger?: string
      success?: string
      warning?: string
      neutral?: string
      info?: string
      accent?: string
      [key: string]: string | undefined  // custom tones
    }
    surface?: {
      glass?: AuraSurfaceTokens
      frosted?: AuraSurfaceTokens
    }
    density?: {
      compact?: string
      default?: string
      spacious?: string
    }
    radius?: {
      sm?: string
      md?: string
      lg?: string
      xl?: string
    }
    gap?: {
      xs?: string
      sm?: string
      md?: string
      lg?: string
      xl?: string
    }
    motion?: {
      subtle?: { duration?: string; ease?: string }
      expressive?: { duration?: string; ease?: string }
      dramatic?: { duration?: string; ease?: string }
    }
    typography?: {
      display?: string
      heading?: string
      subheading?: string
      body?: string
      caption?: string
      label?: string
      fontSans?: string
      fontMono?: string
    }
    elevation?: {
      low?: string
      mid?: string
      high?: string
      float?: string
    }
    form?: {
      inputBg?: string
      inputBorder?: string
      inputBorderFocus?: string
      inputFocusRing?: string
    }
    layout?: {
      sidebarWidth?: string
      headerHeight?: string
      proseWidth?: string
      masonryCols?: number
    }
  }
}
