module.exports = {
  content: ["./*.html", "./*.js"],
  darkMode: 'class',
  theme: {
      extend: {
          colors: {
              'neon-orange': '#6C63FF',
              'warm-gold': '#F5A623',
              'accent-glow': '#A78BFA',
              'dark-bg': '#0A0A0F',
              'dark-card': '#12121A',
              'light-bg': '#F8F9FC',
          },
          fontFamily: {
              clash: ['Space Grotesk', 'sans-serif'],
              outfit: ['Inter', 'sans-serif'],
              mono: ['JetBrains Mono', 'monospace'],
          }
      }
  }
}
