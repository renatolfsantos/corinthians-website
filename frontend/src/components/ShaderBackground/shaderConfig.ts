export const SHADER_CONFIG = {
  colors: {
    background: '#010201',
    shadow: '#142807',
    highlight: '#DADADA',
  },
  density: 350,
  contrast: 1.15,
  brightness: 0.01,
  dot: {
    minimum: 0.025,
    maximum: 0.35,
    softness: 0.025,
  },
  grain: 0.06,
  scanlines: 0.012,
  motion: 0.2,
} as const
