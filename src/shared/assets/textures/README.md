# Textures Directory

This directory contains fabric textures for materials in the 3D Atelier feature.

## Structure

```
textures/
├── denim/             # Denim fabric textures
│   ├── albedo.jpg
│   ├── normal.jpg
│   ├── roughness.jpg
│   └── ao.jpg
├── cotton/            # Cotton fabric textures
│   └── ...
├── leather/           # Leather textures
│   └── ...
└── ...
```

## Texture Specifications

### PBR Texture Maps
Each material should include:
- **Albedo/Base Color:** RGB color map
- **Normal:** Normal map for surface detail
- **Roughness:** Grayscale roughness map
- **Metalness:** Grayscale metalness map (if applicable)
- **AO (Ambient Occlusion):** Grayscale AO map (optional)

### Requirements
- **Resolution:** 1024x1024 or 2048x2048 pixels
- **Format:** JPEG (for albedo) or PNG (for maps with alpha)
- **File Size:** Max 2MB per texture
- **Seamless:** Textures should tile seamlessly

### Naming Convention
- `{map-type}.{ext}`
- Examples: `albedo.jpg`, `normal.png`, `roughness.jpg`

## Texture Sources

- **Free Resources:**
  - Poly Haven (polyhaven.com)
  - CC0 Textures (cc0textures.com)
  - Texture Haven
  
- **Commercial:**
  - Poliigon
  - Quixel Megascans
  - Substance Source

## Adding New Textures

1. Create a new folder for the material type
2. Add all PBR maps (albedo, normal, roughness, etc.)
3. Ensure textures are seamless and optimized
4. Update material presets in code

## 🚪 BACKDOOR: Future Implementation

When backend is ready, textures will be:
- Loaded from CDN: `https://cdn.3datelier.com/textures/`
- Cached locally for performance
- User-uploadable custom textures
- Procedurally generated variations

For now, place textures here for local development.

