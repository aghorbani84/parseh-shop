/* پارسه — کد مشترک همهٔ صفحه‌ها: سربرگ/پاصفحه، خواندن products.json، کارت محصول، نشان سبد. */
(function () {
  'use strict';

  var IG_HANDLE = 'parseh'; /* PLACEHOLDER — هندل واقعی اینستاگرام هنوز مشخص نیست؛ جایگزین شود. */
  var IG_DM_URL = 'https://ig.me/m/' + IG_HANDLE;

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function loadJSON(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('load failed: ' + url);
      return r.json();
    });
  }
  function updateCartBadge() {
    var els = document.querySelectorAll('[data-cart-count]');
    var n = window.ParsehCart ? ParsehCart.count() : 0;
    els.forEach(function (el) {
      el.textContent = Number(n).toLocaleString('fa-IR');
      el.style.display = n > 0 ? '' : 'none';
    });
  }
  function includePart(id, url) {
    var host = document.getElementById(id);
    if (!host) return Promise.resolve();
    return fetch(url).then(function (r) { return r.text(); }).then(function (html) {
      host.innerHTML = html;
      updateCartBadge();
      var here = location.pathname.split('/').pop() || 'index.html';
      host.querySelectorAll('a[data-nav]').forEach(function (a) {
        if (a.getAttribute('href') === here) a.classList.add('active');
      });
    }).catch(function () { /* header/footer include failed: page still works without it */ });
  }
  function productCard(p, catName) {
    return '<article class="card">' +
      '<div class="card-img"><a href="product.html?sku=' + encodeURIComponent(p.sku) + '" aria-label="' + escapeHtml(p.name) + '">' +
      '<img src="' + escapeHtml(p.image) + '" alt="' + escapeHtml(p.name) + '" loading="lazy"></a>' +
      '<span class="badge-demo">' + escapeHtml(p.badge || 'نمونه') + '</span></div>' +
      '<div class="card-body">' +
      '<span class="card-cat">' + escapeHtml(catName || '') + '</span>' +
      '<h3><a href="product.html?sku=' + encodeURIComponent(p.sku) + '">' + escapeHtml(p.name) + '</a></h3>' +
      '<p class="card-short">' + escapeHtml(p.short || '') + '</p>' +
      '<div class="card-foot"><span class="price">' + escapeHtml(window.ParsehCart.formatToman(p.price_toman)) + '</span>' +
      '<span class="stock">' + (p.stock > 0 ? 'موجود: ' + Number(p.stock).toLocaleString('fa-IR') + ' عدد' : 'ناموجود') + '</span></div>' +
      '<button class="btn btn-block" data-add-to-cart="' + escapeHtml(p.sku) + '"' + (p.stock > 0 ? '' : ' disabled') + '>افزودن به سبد</button>' +
      '</div></article>';
  }
  function bindAddToCart(root) { /* kept for clarity: add-to-cart is handled by the delegated listener below */ }

  document.addEventListener('DOMContentLoaded', function () {
    includePart('site-header', 'header.html');
    includePart('site-footer', 'footer.html');
    updateCartBadge();
    document.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('[data-add-to-cart]') : null;
      if (btn && !btn.disabled) {
        var sku = btn.getAttribute('data-add-to-cart');
        var max = parseInt(btn.getAttribute('data-max') || '99', 10);
        window.ParsehCart.add(sku, 1, max);
        updateCartBadge();
        var old = btn.textContent;
        btn.textContent = 'به سبد اضافه شد';
        btn.disabled = true;
        setTimeout(function () { btn.textContent = old; btn.disabled = false; }, 1200);
      }
    });
  });

  window.Parseh = {
    IG_HANDLE: IG_HANDLE, IG_DM_URL: IG_DM_URL,
    escapeHtml: escapeHtml, loadJSON: loadJSON,
    updateCartBadge: updateCartBadge, productCard: productCard, bindAddToCart: bindAddToCart
  };
})();
