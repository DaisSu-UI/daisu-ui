# Demo illustration and media sources

These geometric SVG scenes were authored for Daisu UI. The committed raster assets are rendered from them. The local 12-second video pans across the lake illustration; the local melody synthesizes a C-major chord. They require no remote media server.

Generate with `node scripts/generate-demo-assets.mjs` using rsvg-convert, ImageMagick convert and ffmpeg. These optional maintenance tools are not needed for normal npm builds because the output assets are committed.
