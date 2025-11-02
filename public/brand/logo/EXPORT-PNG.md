# PNG Logo Export Instructions

The site header references `logo.png` which needs to be exported from `logo.svg`.

## Quick Export Options

### Option 1: Online Tool
1. Open https://cloudconvert.com/svg-to-png
2. Upload `/public/brand/logo/logo.svg`
3. Set width to **448px** (2x for retina)
4. Download as `logo.png`
5. Place in `/public/brand/logo/logo.png`

### Option 2: Command Line (if tools available)
```bash
cd /home/mind-protocol/scopelock
npm run export-logo-png
```

Or manually:
```bash
# With rsvg-convert
rsvg-convert -w 448 -h 96 public/brand/logo/logo.svg -o public/brand/logo/logo.png

# With Inkscape
inkscape public/brand/logo/logo.svg --export-type=png --export-filename=public/brand/logo/logo.png --export-width=448

# With ImageMagick
convert -background none -density 300 public/brand/logo/logo.svg -resize 448x96 public/brand/logo/logo.png
```

### Option 3: Design Tool
1. Open `logo.svg` in Figma/Sketch/Illustrator
2. Export at 2x (448×96px)
3. Save as `logo.png`

## Current Status

✓ SVG logo created and working
⚠ PNG export needed for `logo.png` reference

The site will work with SVG, but to use the PNG as specified, export it using one of the methods above.
