# Void Culture: Frontend & 3D Animation Guide

This document explains the high-fidelity 3D design system and animations implemented in the Void Culture boutique platform.

## 1. The 3D Cinematic Intro (`IntroLoader.jsx`)
The entry point of the application features a 3D rotating circular gallery that creates a premium first impression.

### Key Logic:
- **Circular Math**: Images are positioned in 3D space using `rotateY` and `translateZ`. The rotation angle for each card is calculated as `i * (360 / images.length)`.
- **Perspective**: The container uses `perspective-2000` to create a realistic sense of depth.
- **Mobile Responsiveness**: We use a CSS variable `--gallery-depth` that adjusts from `450px` (desktop) to `250px` (mobile) to ensure the gallery fits on all screens.
- **Animation**: A continuous CSS animation `rotate-3d` handles the smooth 360-degree rotation.

## 2. 3D Card System (`three-d-card`)
We established a global utility class for consistent 3D depth across the site.

### CSS Strategy:
- **Perspective & Preserve-3D**: Components use `transform-style: preserve-3d` to allow children to exist in the Z-axis.
- **Depth Tokens**: 
  - `depth-sm`: 10px elevation.
  - `depth-md`: 25px elevation.
  - `depth-lg`: 50px elevation (used for main hero cards).
- **Tilt Interaction**: On hover, cards use `translateY` and `rotate` transforms to simulate a "floating" effect.

## 3. Glassmorphism Design System
The visual "premium" feel is achieved through a centralized `glass-premium` utility.

- **Background Blur**: Uses `backdrop-blur-xl` for a frosted glass effect.
- **Borders**: Thin, semi-transparent white borders (`border-white/50`) simulate light reflecting off the edges of glass.
- **Backgrounds**: Soft `bg-white/70` (light) or `bg-black/80` (dark) to maintain readability while showing the background grid.

## 4. 3D Loading Spinner (`LoadingSpinner.jsx`)
Instead of a standard circle, we created a 3D "Culture Sync" animation.

- **Animate-Spin-Slow**: Rotating rings on the X and Y axes simultaneously using `rotateX(45deg)` and `rotateY(45deg)`.
- **Emerald Glow**: Uses `shadow-[0_0_20px_#50C878]` to create the signature emerald green lighting effect.

## 5. Responsive Grid Theme
The signature background is a mathematical grid drawn using CSS `linear-gradient`.
```css
background-image: 
  linear-gradient(to right, #50C878 1px, transparent 1px), 
  linear-gradient(to bottom, #50C878 1px, transparent 1px);
background-size: 80px 80px;
```
This creates a consistent brand texture without using heavy image assets.
