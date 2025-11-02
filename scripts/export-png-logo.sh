#!/bin/bash
# Script to export PNG logo from SVG
# Requires: rsvg-convert or Inkscape or ImageMagick

LOGO_SVG="public/brand/logo/logo.svg"
LOGO_PNG="public/brand/logo/logo.png"

if command -v rsvg-convert &> /dev/null; then
    echo "Converting with rsvg-convert..."
    rsvg-convert -w 448 -h 96 "$LOGO_SVG" -o "$LOGO_PNG"
elif command -v inkscape &> /dev/null; then
    echo "Converting with Inkscape..."
    inkscape "$LOGO_SVG" --export-type=png --export-filename="$LOGO_PNG" --export-width=448
elif command -v convert &> /dev/null; then
    echo "Converting with ImageMagick..."
    convert -background none -density 300 "$LOGO_SVG" -resize 448x96 "$LOGO_PNG"
else
    echo "No conversion tool found. Please install one of:"
    echo "  - librsvg2-bin (rsvg-convert)"
    echo "  - inkscape"
    echo "  - imagemagick (convert)"
    echo ""
    echo "Or export manually from the SVG using your design tool."
    exit 1
fi

echo "PNG logo exported to $LOGO_PNG"
