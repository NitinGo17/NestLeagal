# NestLegal

A production-oriented static frontend for NestLegal, a law firm website, with a local development blog CMS.

## Included

- Six public pages: Home, About, Services, Courts, Blogs, Contact
- Admin CMS at `admin.html` for blog management
- 21 legal practice areas displayed dynamically
- Court hierarchy diagram (Supreme Court -> High Courts -> District Courts -> Civil/Criminal/Revenue Courts)
- Team section with 3 placeholder photo slots and descriptions
- Floating WhatsApp button (bounce + glow animation) linking to +91 9064049832
- Service card hover animation with burgundy accent line (matches trust-item style)
- Responsive luxury editorial legal design
- Public blog search, filter, and article reader
- Blog drafts, publishing, featured flag, and delete
- Rich-text editing using browser contenteditable
- Preview article in a new window
- Persistent localStorage blog data
- Scroll-reveal animations
- Accessibility: skip-link, focus-visible, aria-expanded, reduced-motion support

## Contact details

- Phone / WhatsApp: +91 9064049832
- Email: madhurima.bhowmick@nestlegal.in
- Office: Kolkata [exact address to be supplied]
- Chamber: Shyamnagar [exact address to be supplied]
- Timing: 09:00 AM - 10:30 PM

## File structure

```
nestlegal-website/
  index.html          Home page (with team section)
  about.html          About page (with team section)
  services.html       Services page (21 practice areas)
  courts.html         Courts page (with hierarchy diagram)
  blogs.html          Blog listing and article reader
  contact.html        Contact / consultation form
  admin.html          Blog CMS (development login)
  css/
    style.css         All website and admin styling
  js/
    blog-store.js     Shared utilities (localStorage, slugify, HTML escape, date format)
    main.js           Navigation, mobile menu, services grid, featured blogs, animations
    blogs.js          Blog listing, search, filter, article reader
    admin.js          Admin login, blog CRUD, rich-text editor, preview
```

## Local preview

```bash
python -m http.server 5500
```

Then open `http://127.0.0.1:5500/index.html`

## Production checklist

1. Add Firebase Authentication
2. Move blog data to Firestore
3. Sanitize HTML before rendering
4. Replace document.execCommand with a modern editor
5. Connect the contact form to a real backend
6. Replace court/forum placeholders with verified information
7. Replace team placeholders with real names, photos, and descriptions
8. Replace remote Unsplash images with licensed production assets
9. Add sitemap.xml and robots.txt
