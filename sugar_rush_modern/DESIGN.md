# Design System Document

## 1. Overview & Creative North Star: "The Confectionery Editorial"
This design system moves away from the sterile, "app-in-a-box" aesthetic to embrace a high-end, tactile experience dubbed **The Confectionery Editorial**. Our North Star is the intersection of a boutique dessert magazine and a playful, modern mobile interface. 

The goal is to create an experience that feels as appetizing as the products themselves. We achieve this through:
*   **Intentional Asymmetry:** Breaking the grid with "hero" product shots that overlap containers.
*   **Soft Geometry:** Utilizing extreme roundedness to mimic the organic shapes of sweets.
*   **Tonal Depth:** Replacing harsh structural lines with soft color transitions and "frosted glass" layering.

---

## 2. Color & Atmosphere
The palette is built on the warmth of `primary` (#FF6B6B) and the refreshing contrast of `secondary` (#4ECDC4). It is designed to feel bright, airy, and premium.

### The "No-Line" Rule
To maintain a high-end editorial feel, **1px solid borders are strictly prohibited for sectioning or containment.** You must define boundaries through background color shifts.
*   Place a `surface-container-low` card on a `surface` background to create a soft, natural edge.
*   Use `surface-container-highest` only for the most critical interactive elements (like an active cart item).

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper or frosted glass. 
*   **Level 0 (Base):** `surface` (#fff8f7)
*   **Level 1 (Sections):** `surface-container-low` (#fff0ef)
*   **Level 2 (Cards/Interaction):** `surface-container` (#ffe9e7) or `surface-container-lowest` (#ffffff) to pop against the section.

### The Glass & Gradient Rule
To prevent the app from feeling "flat," use subtle linear gradients for primary CTAs (e.g., transitioning from `primary` to `primary-container`). For floating elements like navigation bars or category filters, use **Glassmorphism**:
*   **Background:** `surface` at 70% opacity.
*   **Effect:** `backdrop-blur: 12px`.
*   **Feel:** This mimics the look of a frosted glass candy jar, adding "soul" to the UI.

---

## 3. Typography
Our typography pairing balances premium editorial authority with a friendly, approachable voice.

*   **Display & Headline (Plus Jakarta Sans):** These are your "flavor" fonts. Use `display-lg` for hero marketing titles. The generous x-height and rounded terminals of Plus Jakarta Sans evoke a sense of modern playfulness.
*   **Title & Body (Be Vietnam Pro):** This is your "functional" font. It provides exceptional legibility for menus, descriptions, and price points.
*   **Hierarchy Note:** Always lead with high contrast. A `display-sm` headline should be paired with a `body-md` description to create a sophisticated, magazine-style layout.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are often too "heavy" for a sweet delivery app. We use **Tonal Layering** to create lift.

*   **Ambient Shadows:** If a floating effect is required (e.g., a "Floating Action Button"), the shadow must be extra-diffused. Use a blur of 20px–40px and an opacity of 6%. The shadow color should be a tinted version of `on-surface` (#251818), never pure black.
*   **The "Ghost Border" Fallback:** If accessibility requires a border (e.g., in high-glare environments), use the `outline-variant` token at **15% opacity**. This provides a hint of structure without breaking the soft aesthetic.
*   **Interaction Depth:** When a user presses a card, instead of a shadow, shift the background color from `surface-container` to `surface-dim`.

---

## 5. Components
All components follow the `DEFAULT` (1rem) to `xl` (3rem) rounding scale to ensure they feel "hand-held" and friendly.

### Buttons
*   **Primary:** Uses `primary` (#ae2f34) or a gradient to `primary-container` (#ff6b6b). Corner radius: `full`. No border.
*   **Secondary:** Uses `secondary-container`. This is for "Add to Cart" or "Filter" actions.
*   **Tertiary:** Text-only using `primary` color, reserved for low-emphasis actions like "View All."

### Cards & Lists (The Divider Ban)
*   **Rule:** Never use a line to separate list items.
*   **Execution:** Use `spacing-4` (1.4rem) of vertical white space or alternate background colors (`surface` vs `surface-container-low`) to define list items.
*   **Product Cards:** Use `rounded-lg` (2rem). The product image should "break" the top edge of the card (negative margin) to create a premium, 3D effect.

### Input Fields
*   **Base:** `surface-container-low` background. 
*   **Focus State:** A 2px "Ghost Border" using `secondary` (#006a65) at 40% opacity. No harsh outlines.
*   **Shape:** `rounded-md` (1.5rem).

### Specialized App Components
*   **The "Sweet Scale" (Slider):** A custom slider using `tertiary` (#6d5e00) to indicate sugar levels or portion sizes.
*   **Delivery Progress:** Use a thick, `rounded-full` progress bar using `secondary` to represent the "freshness" of the delivery.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use `tertiary-fixed` (#fbe36a) for highlights like "Sale" or "New" badges—it acts as a "sprinkle" of color.
*   **Do** use overlapping elements. A cupcake image should slightly overlap the headline text to create depth.
*   **Do** prioritize `surface-bright` for areas where you want the user to feel "energy" (e.g., the checkout button area).

### Don't:
*   **Don't** use 100% opaque `outline` colors. It makes the app feel like a utility tool rather than a luxury service.
*   **Don't** use `none` or `sm` rounding. Everything in this system should feel soft to the touch.
*   **Don't** use standard grey shadows. Always tint your shadows with the primary or secondary hue to keep the "delicious" atmosphere intact.