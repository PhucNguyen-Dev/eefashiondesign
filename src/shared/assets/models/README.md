# 3D Models Directory

This directory contains 3D garment and mannequin models for the 3D Atelier feature.

## Structure

```
models/
├── garments/          # Garment 3D models
│   ├── jumpsuit.glb
│   ├── dress.glb
│   ├── pants.glb
│   └── ...
└── mannequins/        # Body/mannequin models
    ├── base.glb
    ├── female.glb
    └── male.glb
```

## Model Specifications

### Format
- **Preferred:** GLTF 2.0 (.glb binary format)
- **Alternative:** GLTF (.gltf + separate textures)

### Requirements
- **Polygon Count:** Max 50,000 triangles per model
- **Texture Resolution:** Max 2048x2048 pixels
- **File Size:** Max 10MB per model
- **Materials:** PBR materials (Metallic-Roughness workflow)

### Naming Convention
- Use lowercase
- Use hyphens for spaces
- Include garment type: `{type}-{variant}.glb`
- Examples: `jumpsuit-casual.glb`, `dress-summer.glb`

## Adding New Models

1. Export from 3D software (Blender, Marvelous Designer, etc.)
2. Optimize using gltf-pipeline or similar tools
3. Place in appropriate subfolder
4. Update model registry (if applicable)

## Model Sources

- **Custom Models:** Created in-house or commissioned
- **Asset Libraries:** Sketchfab, TurboSquid, etc. (with proper licensing)
- **Marvelous Designer:** Exported garment simulations

## 🚪 BACKDOOR: Future Implementation

When backend is ready, models will be:
- Loaded from CDN: `https://cdn.3datelier.com/models/`
- Cached locally for performance
- Dynamically loaded based on user selection

For now, place models here for local development.

