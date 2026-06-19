// ----- SHORT & COMPLETE SCRIPT -----
const $ = id => document.getElementById(id);
const products = [
  { id: 1, name: 'Migraine Relief drops', category: 'drops', price: 150, image: 'img/migraine.jpg', description: 'Fast-acting drops for migraine.' },
  { id: 2, name: 'Period pain relief drops', category: 'drops', price: 150, image: 'img/periodPain.jpg', description: 'Gentle relief during cycles.' },
  { id: 3, name: 'Womb pain relief drops', category: 'drops', price: 150, image: 'img/womb.jpg', description: 'Support for womb discomfort.' },
  { id: 4, name: 'Essential oil for headache', category: 'oil', price: 180, image: 'img/essentail oil.jpg', description: 'Topical blend for headaches.' }
];

// --- CART ---
const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
const saveCart = c => { localStorage.setItem('cart', JSON.stringify(c)); updateCount(); };
const updateCount = () => { let t = getCart().reduce((s, i) => s + i.qty, 0); document.querySelectorAll('.cart-count').forEach(e => e.textContent = t); };
const addToCart = id => { let c = getCart(), p = products.find(x => x.id === id), i = c.find(x => x.id === id); i ? i.qty++ : c.push({...p, qty: 1}); saveCart(c); alert(p.name + ' added!'); };

// --- LIGHTBOX ---
const openLightbox = src => { let m = $('lightbox-modal'), i = $('lightbox-img'); if(m && i) { i.src = src; m.style.display = 'flex'; } };
const closeLightbox = () => { let m = $('lightbox-modal'); if(m) m.style.display = 'none'; };

// --- RENDER PRODUCTS (search + filter) ---
const renderProducts = (f = 'all', q = '') => {
  const grid = $('product-grid');
  if (!grid) return;
  let items = products.filter(p => (f === 'all' || p.category === f) && (!q.trim() || p.name.toLowerCase().includes(q.toLowerCase())));
  grid.innerHTML = items.length ? items.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}" class="product-image" onclick="openLightbox('${p.image}')" />
      <h3>${p.name}</h3>
      <p>${p.description}</p>
      <p class="product-price">R${p.price}</p>
      <button class="add-to-cart" onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join('') : '<p style="text-align:center;">No products found.</p>';
};

// --- FORM VALIDATION (generic) ---
const validateForm = (formId, prefix) => {
  const form = $(formId);
  if (!form) return;
  form.onsubmit = e => {
    e.preventDefault();
    let valid = true;
    ['fname','lname','email','message'].forEach(f => {
      const el = $(`${prefix}-${f}`), err = $(`${prefix}-${f}-error`);
      if (err) err.textContent = '';
      if (el) {
        let v = el.value.trim();
        if (f === 'email' && !/^\S+@\S+\.\S+$/.test(v)) { err.textContent = 'Valid email required'; valid = false; }
        else if ((f === 'fname' || f === 'lname') && v.length < 2) { err.textContent = 'Min 2 chars'; valid = false; }
        else if (f === 'message' && v.length < 10) { err.textContent = 'Min 10 chars'; valid = false; }
      }
    });
    const fb = $(`${prefix}-form-feedback`);
    if (valid) { fb.className = 'form-feedback success'; fb.textContent = '✅ Sent!'; form.reset(); setTimeout(() => { fb.textContent = ''; fb.className = 'form-feedback'; }, 3000); }
    else { fb.className = 'form-feedback error'; fb.textContent = '⚠️ Fix errors.'; }
  };
};

// --- CART PAGE (render items) ---
const renderCart = () => {
  const container = $('cart-items-container');
  if (!container) return;
  const cart = getCart();
  if (!cart.length) { container.innerHTML = '<p>Cart empty. <a href="Products.html">Shop now</a></p>'; if($('cart-total')) $('cart-total').textContent = '0.00'; return; }
  let html = '', total = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    html += `<div class="cart-item"><img src="${item.image}" width="60"/><span>${item.name}</span><span>R${item.price}</span><input type="number" value="${item.qty}" min="1" onchange="updateQty(${idx}, this.value)" /><span>R${(item.price*item.qty).toFixed(2)}</span><button onclick="removeItem(${idx})">&times;</button></div>`;
  });
  container.innerHTML = html;
  if($('cart-total')) $('cart-total').textContent = total.toFixed(2);
};
window.updateQty = (idx, val) => { let c = getCart(); if (val < 1) val = 1; c[idx].qty = parseInt(val); saveCart(c); renderCart(); };
window.removeItem = (idx) => { let c = getCart(); c.splice(idx, 1); saveCart(c); renderCart(); };

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
  // Products page
  if ($('product-grid')) { renderProducts(); $('product-search')?.addEventListener('input', function(){ renderProducts($('product-filter').value, this.value); }); $('product-filter')?.addEventListener('change', function(){ renderProducts(this.value, $('product-search').value); }); }
  // Lightbox close
  if ($('lightbox-modal')) { $('close-lightbox')?.addEventListener('click', closeLightbox); $('lightbox-modal')?.addEventListener('click', e => { if (e.target === e.currentTarget) closeLightbox(); }); }
  // Forms
  validateForm('inquiry-form', 'inq');
  validateForm('contact-form', 'cont');
  // Cart page
  if ($('cart-items-container')) renderCart();
  updateCount();
});