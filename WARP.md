# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Gatsby-based e-commerce theme designed by Matter Design for Netlify. It's a static site generator project focused on styling and scaffolding for e-commerce sites. **Important**: This is a theme/template with mock data - it does not include actual cart, payment, or product management functionality.

## Development Commands

### Running the Development Server
```bash
npm start
# or
yarn start
```
Runs the Gatsby development server on port 5000. Access at http://localhost:5000

Alternative development command:
```bash
npm run develop
# Runs on default Gatsby port (8000)
```

Using Netlify CLI:
```bash
netlify run dev
```

### Building
```bash
npm run build
# or
gatsby build
```
Creates production build in the `public/` directory.

### Serving Production Build
```bash
npm run serve
# or
gatsby serve
```

### Code Formatting
```bash
npm run format
```
Runs Prettier on Gatsby config files and all JS files in `src/`.

### Cleaning Build Cache
```bash
npm run clean
# or
gatsby clean
```
Clears Gatsby's cache and public directories. Run this if you encounter build issues.

### Scaffolding Components/Pages
```bash
npm run plop
```
Interactive CLI to generate:
- New components (with index.js, component.js, module.css, and readme.md)
- New icons
- New pages

## Architecture

### Directory Structure
- **`src/components/`** - Reusable UI components (60+ components)
- **`src/pages/`** - File-based routing (each `.js` file becomes a route)
- **`src/helpers/`** - Mock data (`blog.json`, `product.json`) and utility functions
- **`src/context/`** - React Context providers (e.g., `AddItemNotificationProvider`)
- **`src/config.json`** - Site configuration for navigation, footer, filters, currencies, etc.
- **`src/plop/`** - Plop templates for code generation
- **`public/`** - Build output directory

### Component Architecture
Components follow a consistent structure:
```
ComponentName/
├── index.js              # Re-exports the component
├── ComponentName.js      # Main component implementation
├── ComponentName.module.css  # CSS Modules styling
└── readme.md             # Component documentation
```

### Key Components
- **`Layout`** - Wraps pages with Header/Footer, includes global styles and external CSS (Slick carousel)
- **`Hero`** - Full-width image banner with title, subtitle, and CTA
- **`Header`/`Footer`** - Navigation components driven by `src/config.json`
- **Product Components** - `ProductCard`, `ProductCardGrid`, `ProductCollectionGrid`
- **Blog Components** - `BlogPreview`, `BlogPreviewGrid`

### Routing
Gatsby uses file-based routing:
- `src/pages/index.js` → `/`
- `src/pages/shop.js` → `/shop`
- `src/pages/about.js` → `/about`
- `src/pages/blog/sample.js` → `/blog/sample`
- `src/pages/product/sample.js` → `/product/sample`

Navigation uses Gatsby's `Link` component and `navigate` function for programmatic routing.

### Data Management
Currently uses mock data from JSON files:
- **`src/helpers/product.json`** - Product catalog with pricing, colors, sizes, galleries
- **`src/helpers/blog.json`** - Blog post previews
- **`src/helpers/mock.js`** - Helper functions to filter/slice mock data

### Styling
- **CSS Modules** for component-scoped styles
- **Global styles** in `src/components/Layout/Globals.css`
- **Slick Carousel** loaded via CDN in Layout component
- Uses CSS custom properties for theming (e.g., `var(--standard-light-grey)`)

### Configuration
`src/config.json` controls:
- Header navigation (with dropdown support via `category` key)
- Footer links (organized by columns with `subTitle` and `links`)
- Currency/language options
- Social media links
- Payment options
- Product filters (colour, size, gender)

To modify navigation, edit the `headerLinks` or `footerLinks` arrays in this file.

### Context Providers
- **`NotificationContext`** - Manages add-to-cart notifications (2-second auto-dismiss)

## Technology Stack
- **Gatsby 5.x** - Static site generator
- **React 18** - UI library
- **React Helmet** - Head management for SEO
- **CSS Modules** - Scoped styling
- **Prettier** - Code formatting
- **Plop** - Code scaffolding tool
- **Netlify** - Deployment platform with image CDN support

## Deployment
The project is configured for Netlify deployment via `netlify.toml`:
- Build command: `gatsby build`
- Publish directory: `public`
- Netlify Image CDN redirects configured for `imgcdn=true` query params

Deploy commands:
```bash
netlify init      # First-time setup
netlify deploy    # Preview deploy
netlify deploy --prod  # Production deploy
netlify open      # Open project dashboard
```

## Development Notes
- The theme is non-functional for e-commerce operations (no real cart, checkout, or backend)
- Mock data should be replaced with real data sources (CMS, headless commerce platform)
- The README suggests integrating with BigCommerce, Builder.io, and Klaviyo for production
- No testing framework is currently configured
- Renovate is included for dependency updates (can be removed by deleting `renovate.json`)
