# PWA Icons Setup

## Required Icons

For a complete PWA experience, you need the following icon sizes:

### Required Sizes
- `pwa-192x192.png` - Android Chrome
- `pwa-512x512.png` - Android Chrome (high-res)
- `apple-touch-icon.png` (180x180) - iOS Safari
- `favicon.ico` - Browser tab

## Quick Icon Generation

### Option 1: Use Online Tool (Recommended)
1. Go to https://realfavicongenerator.net/
2. Upload a 512x512 PNG image
3. Configure settings for all platforms
4. Download and extract to `public/` folder

### Option 2: Use PWA Asset Generator
```bash
npx @vite-pwa/assets-generator --preset minimal public/logo.svg
```

### Option 3: Manual Creation
Create icons with these specifications:

**Design Guidelines:**
- Use your brand colors (primary: #0ea5e9)
- Keep design simple and recognizable at small sizes
- Use transparent or solid background
- Ensure good contrast
- Test on both light and dark backgrounds

**Icon Suggestions:**
- Dashboard/chart icon
- Dollar sign with target
- Minimalist "LT" monogram (Life Tracker)
- Abstract geometric shapes representing goals + finance

## Icon Files Needed

Place these in the `public/` directory:

```
public/
├── pwa-192x192.png       # 192x192 PNG
├── pwa-512x512.png       # 512x512 PNG
├── apple-touch-icon.png  # 180x180 PNG
├── favicon.ico           # 32x32 ICO
└── mask-icon.svg         # SVG (optional, for Safari)
```

## Temporary Solution

Until you create custom icons, you can:

1. **Use Vite's default icon** (already in public/vite.svg)
2. **Create a simple colored square**:
   - Background: #0ea5e9 (primary blue)
   - Text: "LT" in white
   - Font: Bold, sans-serif

3. **Use an emoji** (quick placeholder):
   - 📊 (chart)
   - 🎯 (target)
   - 💰 (money bag)
   - 📝 (memo)

## Testing Icons

After adding icons:

1. Clear browser cache
2. Reload app
3. Check browser tab for favicon
4. Try installing PWA
5. Verify icon appears on home screen/desktop

## Icon Update in Code

The icons are already referenced in:
- `vite.config.js` (manifest configuration)
- `index.html` (apple-touch-icon link)

No code changes needed - just add the image files!

## Color Scheme

Use these colors from your app:
- Primary: #0ea5e9 (cyan blue)
- Dark: #0369a1 (darker blue)
- Background: #0c4a6e (darkest blue)
- Accent: #38bdf8 (light blue)

## Resources

- **Icon Generator**: https://realfavicongenerator.net/
- **PWA Builder**: https://www.pwabuilder.com/
- **Icon Design**: https://www.figma.com/ (free design tool)
- **Free Icons**: https://lucide.dev/ (matches your app's icon library)

## Checklist

- [ ] Create or generate 192x192 icon
- [ ] Create or generate 512x512 icon
- [ ] Create or generate 180x180 Apple touch icon
- [ ] Create favicon.ico
- [ ] Place all files in public/ folder
- [ ] Test PWA installation
- [ ] Verify icons display correctly
- [ ] Update manifest theme_color if needed
