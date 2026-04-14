# Crimson Hosting — Website

Modern, responsive marketing site for **Crimson Hosting** (web design + hosting).
Dark + crimson theme, built with plain HTML / CSS / JS — no build step, no dependencies.

## Files

- `index.html` — All sections (clearly separated with comment headers)
- `styles.css` — Design tokens, components, responsive rules
- `script.js` — Navbar, mobile menu, scroll reveal, before/after slider, form validation

## Run it

Just open `index.html` in a browser. That's it.

## Where to edit placeholders

Search `index.html` for these to customize:

| Placeholder | What to replace |
|---|---|
| `$XX` in `.amount` | Pricing for each tier (Bronze / Silver / Gold) |
| `[Name Placeholder]` | Team member names |
| `[Client Name]`, `[Company]` | Testimonial attributions |
| `hello@crimsonhosting.com` | Real contact email |
| `[+1 (000) 000-0000]` | Real phone number |
| Unsplash URLs (`src="https://images.unsplash.com/...`) | Your real portfolio / team images |

## Sections

1. Navbar (sticky, blurs on scroll, mobile hamburger)
2. Hero — headline, CTA, stat badges, animated glow
3. About / What We Do — 4 service cards
4. Services — 3 pricing tiers (Silver highlighted as best value)
5. Portfolio — drag-to-compare before/after slider
6. Why Choose Us — 4 selling points
7. Team — avatar cards with socials
8. Testimonials — 5 quote cards with star ratings
9. Contact — form with client-side validation + contact info
10. Footer — nav links, socials, copyright

## Wire up the contact form

In `script.js`, the success branch currently just shows a message. Replace the
`// Placeholder success` block with a `fetch()` call to your backend, Formspree,
Netlify Forms, or similar service.

## Design tokens

Tweak colors in `styles.css` under `:root`:

```css
--crimson: #dc143c;
--crimson-bright: #ff2b52;
--bg: #0a0a0c;
```
