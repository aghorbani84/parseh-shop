/* پارسه — سبد خرید. ذخیره در localStorage، بدون سرور، بدون پرداخت. */
(function (global) {
  'use strict';
  var KEY = 'parseh_cart_v1';
  var ORDERS_KEY = 'parseh_orders_v1';

  function readCart() {
    try {
      var raw = localStorage.getItem(KEY);
      var data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data.filter(function (i) { return i && typeof i.sku === 'string' && i.qty > 0; }) : [];
    } catch (e) { return []; }
  }
  function writeCart(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* storage full/blocked: cart stays in memory only */ }
  }
  function find(items, sku) {
    for (var i = 0; i < items.length; i++) { if (items[i].sku === sku) return items[i]; }
    return null;
  }

  function add(sku, qty, maxStock) {
    var items = readCart();
    var line = find(items, sku);
    var want = Math.max(1, qty || 1);
    if (line) {
      line.qty = Math.min(line.qty + want, typeof maxStock === 'number' ? maxStock : 99);
    } else {
      items.push({ sku: sku, qty: Math.min(want, typeof maxStock === 'number' ? maxStock : 99) });
    }
    writeCart(items);
    return items;
  }
  function setQty(sku, qty, maxStock) {
    var items = readCart();
    var line = find(items, sku);
    if (!line) return items;
    var q = Math.floor(qty);
    if (q <= 0) { items = items.filter(function (i) { return i.sku !== sku; }); }
    else { line.qty = typeof maxStock === 'number' ? Math.min(q, maxStock) : q; }
    writeCart(items);
    return items;
  }
  function remove(sku) {
    var items = readCart().filter(function (i) { return i.sku !== sku; });
    writeCart(items);
    return items;
  }
  function clear() { writeCart([]); return []; }
  function count(items) {
    return (items || readCart()).reduce(function (s, i) { return s + i.qty; }, 0);
  }
  /* totals: subtotal + flat shipping (150,000 T) — free above 10,000,000 T. Sample rule, see products.json meta.shipping. */
  function totals(items, products, shippingRule) {
    var subtotal = 0;
    (items || []).forEach(function (line) {
      var p = null;
      for (var i = 0; i < products.length; i++) { if (products[i].sku === line.sku) { p = products[i]; break; } }
      if (p) subtotal += p.price_toman * line.qty;
    });
    var fee = shippingRule && shippingRule.flat_fee_toman ? shippingRule.flat_fee_toman : 150000;
    var freeAbove = shippingRule && shippingRule.free_above_toman ? shippingRule.free_above_toman : 10000000;
    var shipping = subtotal <= 0 ? 0 : (subtotal >= freeAbove ? 0 : fee);
    return { subtotal: subtotal, shipping: shipping, total: subtotal + shipping };
  }
  function formatToman(n) {
    return Number(n).toLocaleString('fa-IR') + ' تومان';
  }
  function newOrderId() {
    var d = new Date();
    var yymmdd = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0');
    var rand = Math.floor(1000 + Math.random() * 9000);
    return 'PRS-' + yymmdd + '-' + rand;
  }
  function saveOrder(order) {
    var list = [];
    try { list = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch (e) { list = []; }
    if (!Array.isArray(list)) list = [];
    list.push(order);
    try { localStorage.setItem(ORDERS_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
    return order;
  }
  function getOrder(id) {
    var list = [];
    try { list = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'); } catch (e) { list = []; }
    if (!Array.isArray(list)) return null;
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) return list[i]; }
    return null;
  }

  global.ParsehCart = {
    read: readCart, add: add, setQty: setQty, remove: remove, clear: clear,
    count: count, totals: totals, formatToman: formatToman,
    newOrderId: newOrderId, saveOrder: saveOrder, getOrder: getOrder
  };
})(window);
