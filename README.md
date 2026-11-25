# Parseh Shop · پارسه

**A static, Persian-language (RTL) computer and electronics shop, hosted on GitHub Pages with no backend.**

[![Live demo](https://img.shields.io/badge/demo-GitHub%20Pages-2ea44f)](https://aghorbani84.github.io/parseh-shop/)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
[![GitHub stars](https://img.shields.io/github/stars/aghorbani84/parseh-shop?style=flat)](https://github.com/aghorbani84/parseh-shop/stargazers)

**Live demo:** https://aghorbani84.github.io/parseh-shop/

## Overview

Parseh (پارسه) is a storefront built from plain HTML, CSS, and JavaScript. Products are read from a single
`products.json` file, the cart is kept in `localStorage`, and orders are completed by direct message instead
of online payment. The interface is in Persian and uses the Vazirmatn font.

> **Demo catalog.** Every product and price in `products.json` is a sample and is labelled as such on the site.
> There is no online payment and no card data is collected or stored.

## Features

- **Pages**: home, shop, product details (`product.html?sku=…`), cart, checkout, order confirmation,
  and info pages (about, contact, FAQ, shipping, returns, privacy, terms).
- **Single source of product data**: `products.json` holds categories, prices, stock, SKUs, and specs.
- **Cart and order history** stored in `localStorage`, no server involved.
- **Order IDs** in the form `PRS-YYMMDD-XXXX`, with a ready-to-send order summary on the confirmation page.
- **SEO basics**: `robots.txt` and `sitemap.xml`.
- **Automatic deploy** to GitHub Pages on every push to `main`.

## Tech stack

| Area | Choice |
| --- | --- |
| Markup & styles | HTML, CSS (RTL, Vazirmatn font) |
| Scripts | Vanilla JavaScript (`assets/js/app.js`, `assets/js/cart.js`) |
| Data | `products.json` |
| Hosting | GitHub Pages via GitHub Actions |

## Getting started

No build step. Serve the folder with any static server, for example:

```bash
git clone https://github.com/aghorbani84/parseh-shop.git
cd parseh-shop
python3 -m http.server 8901
# open http://127.0.0.1:8901/
```

A static server is needed (rather than opening files directly) because pages load `products.json` and shared
header/footer fragments with `fetch`.

### Going from demo to real

1. Replace `products.json` with real products and set `demo` to `false`.
2. Set the shop's Instagram handle in `IG_HANDLE` in `assets/js/app.js`.
3. Replace the `#digipay-link-placeholder` payment link in `confirmation.html`.
4. Update shipping and warranty details in `products.json` (`meta.shipping`), `shipping.html`, and `returns.html`.
5. Add real product photos to `assets/img/products/` and update their file names in `products.json`.

## Project structure

```
index.html, shop.html, product.html, cart.html, checkout.html, confirmation.html
about.html, contact.html, faq.html, shipping.html, returns.html, privacy.html, terms.html
header.html, footer.html   shared fragments
products.json              product catalog
assets/css/style.css
assets/js/app.js, cart.js
assets/fonts/              Vazirmatn
assets/img/                logo and product images
robots.txt, sitemap.xml
.github/workflows/deploy.yml
```

A server-backed version on Cloudflare Workers + D1 lives in [aghorbani84/store](https://github.com/aghorbani84/store).

## Author

Built by [Abolfazl Ghorbani](https://github.com/aghorbani84).
