---
name: tactical-controls-design
description: Tactical Mobile Shooter button architecture, visual aesthetic guidelines, and 2-fire button mechanics
---

# Tactical Mobile Shooter Controls & UI Design Agent

This skill defines the control layout, input mechanics, and visual design language modeled for premium handheld tactical shooters.

## Core Control Mechanics

### 1. Two-Fire Button System
Tactical mobile shooters feature two distinct fire buttons serving distinct tactical functions:
1. **1-Tap ADS Fire Button (Primary Right Fire)**:
   - **Behavior**: Touching down immediately transitions the player into Aim Down Sights (ADS zoom) and triggers continuous firing. Dragging rotates the camera to track targets while shooting. Releasing stops firing and returns to hip stance.
   - **Visual**: Prominent circular button with an integrated crosshair and firing burst icon.
   - **Placement**: Primary right thumb zone (Right ~36px, Bottom ~40px).

2. **Hip Fire Button (Secondary Fire)**:
   - **Behavior**: Touching down fires the weapon instantly from the hip without zooming into ADS. Ideal for close-quarters reflex engagements, shotguns, and rapid spray.
   - **Visual**: Solid circular or tactical button with bullet projectile iconography.
   - **Placement**: Upper-left of right cluster or dedicated left-hand fire zone (for claw/2-thumb flexibility).

3. **ADS / Aim Button**:
   - **Behavior**: Enters ADS zoom or Katana guard without shooting. Enables precise scoping with sniper or rifle before choosing when to fire.

### 2. Button Visual Language
- **No Emojis**: Always use crisp, clean SVG vector glyphs that integrate with the game's pen-on-paper and tactical ink theme.
- **Surface**: Translucent frosted paper-glass (`rgba(246, 243, 230, 0.9)`) with high-contrast ink borders (`2.5px solid var(--ink)`).
- **Primary ADS Fire**: Rich crimson tactical gradient (`#e02438` to `#b01424`) with bright white reticle glyph.
- **Hip Fire**: Rich blue ink gradient (`#2d46e6` to `#1a30c0`) with white bullet burst.
- **Tactile Feedback**: Subtle active compression (`scale(0.92)`), haptic vibration (`navigator.vibrate`), and ink shadows.
