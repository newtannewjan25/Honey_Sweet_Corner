/* Honey Sweet Corner website interactions.
   This is a static demo: product edits are stored in this browser only.
   Public deployment needs a secure backend/database and server-side authentication. */
'use strict';
const DEFAULT_PRODUCTS = [
  {id:'p1',name:'Traditional Laddoo',category:'Traditional Sweets',price:650,emoji:'🍡',description:'A festive favourite for sharing with family.'},
  {id:'p2',name:'Milk Toffee',category:'Traditional Sweets',price:450,emoji:'🍬',description:'Sweet, creamy bites for a little treat.'},
  {id:'p3',name:'Chocolate Cake',category:'Cakes & Pastries',price:1800,emoji:'🍰',description:'A rich chocolate treat for special moments.'},
  {id:'p4',name:'Cupcake',category:'Cakes & Pastries',price:350,emoji:'🧁',description:'A small cake with a big happy feeling.'},
  {id:'p5',name:'Chocolate Bar',category:'Chocolates',price:300,emoji:'🍫',description:'A classic chocolate snack to enjoy anytime.'},
  {id:'p6',name:'Assorted Biscuits',category:'Biscuits & Snacks',price:250,emoji:'🍪',description:'Crunchy snack-time favourites.'},
  {id:'p7',name:'Jalebi',category:'Traditional Sweets',price:500,emoji:'🥨',description:'A bright, syrupy traditional sweet.'},
  {id:'p8',name:'Sweet Gift Pack',category:'Gift Packs',price:2200,emoji:'🎁',description:'A lovely selection for someone special.'}
];
const PRODUCTS_KEY='hsc_products_v2';
const SESSION_KEY='hsc_admin_demo_session';
const DEMO_USER='admin', DEMO_PASS='Honey@123';
const $=id=>document.getElementById(id);
function escapeHTML(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function getProducts(){try{const saved=localStorage.getItem(PRODUCTS_KEY);if(saved){const parsed=JSON.parse(saved);if(Array.isArray(parsed))return parsed;}}catch(error){}return DEFAULT_PRODUCTS.map(p=>({...p}));}
function saveProducts(products){try{localStorage.setItem(PRODUCTS_KEY,JSON.stringify(products));window.dispatchEvent(new CustomEvent('hsc-products-updated'));return true;}catch(error){alert('Could not save changes in this browser. Please check browser storage settings.');return false;}}
function formatPrice(price){return 'LKR '+Number(price||0).toLocaleString('en-LK',{maximumFractionDigits:2});}

// Customer product listing and category filters.
const productGrid=$('productGrid');
if(productGrid){let activeCategory='All';function renderProducts(){const products=getProducts().filter(p=>activeCategory==='All'||p.category===activeCategory);productGrid.innerHTML=products.length?products.map(p=>`<article class="product-card"><div class="product-art" aria-hidden="true"><span>${escapeHTML(p.emoji||'🍯')}</span></div><div class="product-info"><span class="product-category">${escapeHTML(p.category)}</span><h3>${escapeHTML(p.name)}</h3><p>${escapeHTML(p.description||'A lovely treat from Honey Sweet Corner.')}</p><div class="product-bottom"><span class="price">${formatPrice(p.price)}</span><a class="ask-link" href="https://wa.me/94777549646?text=${encodeURIComponent('Hello Honey Sweet Corner, is '+p.name+' available at '+formatPrice(p.price)+'?')}" target="_blank" rel="noopener noreferrer">ASK ABOUT IT ↗</a></div></div></article>`).join(''):'<p class="empty-products">No products in this category yet.</p>';}
renderProducts();document.querySelectorAll('.filter-btn').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('selected'));button.classList.add('selected');activeCategory=button.dataset.category||'All';renderProducts();}));window.addEventListener('storage',event=>{if(event.key===PRODUCTS_KEY)renderProducts();});window.addEventListener('hsc-products-updated',renderProducts);}

// Responsive mobile navigation.
const menuToggle=$('menuToggle');
if(menuToggle){const nav=$('mainNav');function closeMenu(){nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open navigation');}menuToggle.addEventListener('click',()=>{const isOpen=nav.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(isOpen));menuToggle.setAttribute('aria-label',isOpen?'Close navigation':'Open navigation');});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));window.addEventListener('resize',()=>{if(window.innerWidth>760)closeMenu();});}
const year=$('year');if(year)year.textContent=new Date().getFullYear();

// Demo admin login. Client-side credentials are not secure for production.
const loginForm=$('loginForm'),loginPanel=$('loginPanel'),dashboardPanel=$('dashboardPanel'),loginError=$('loginError'),productForm=$('productForm');
function showDashboard(){if(loginPanel)loginPanel.classList.add('hidden');if(dashboardPanel)dashboardPanel.classList.remove('hidden');renderAdminProducts();}
function showLogin(){if(dashboardPanel)dashboardPanel.classList.add('hidden');if(loginPanel)loginPanel.classList.remove('hidden');}
if(loginForm){try{if(sessionStorage.getItem(SESSION_KEY)==='yes')showDashboard();}catch(error){}loginForm.addEventListener('submit',event=>{event.preventDefault();const username=$('username').value.trim(),password=$('password').value;if(username===DEMO_USER&&password===DEMO_PASS){try{sessionStorage.setItem(SESSION_KEY,'yes');}catch(error){}if(loginError)loginError.textContent='';showDashboard();}else if(loginError){loginError.textContent='Incorrect username or password. Please try again.';}});}
$('logoutBtn')?.addEventListener('click',()=>{try{sessionStorage.removeItem(SESSION_KEY);}catch(error){}showLogin();});
function resetProductForm(){productForm?.reset();if($('editId'))$('editId').value='';if($('saveProductBtn'))$('saveProductBtn').textContent='Add product';$('cancelEditBtn')?.classList.add('hidden');}
function renderAdminProducts(){const list=$('adminProductList');if(!list)return;const products=getProducts();if($('productCount'))$('productCount').textContent=`${products.length} item${products.length===1?'':'s'}`;list.innerHTML=products.length?products.map(p=>`<div class="admin-product-row"><div class="admin-product-emoji">${escapeHTML(p.emoji||'🍯')}</div><div><h3>${escapeHTML(p.name)} · ${formatPrice(p.price)}</h3><p>${escapeHTML(p.category)} — ${escapeHTML(p.description||'No description')}</p></div><div class="admin-product-actions"><button class="small-btn" type="button" data-edit="${escapeHTML(p.id)}">Edit</button><button class="small-btn delete" type="button" data-delete="${escapeHTML(p.id)}">Delete</button></div></div>`).join(''):'<p class="muted">No products yet. Add your first product above.</p>';
list.querySelectorAll('[data-edit]').forEach(button=>button.addEventListener('click',()=>{const item=getProducts().find(p=>p.id===button.dataset.edit);if(!item)return;$('editId').value=item.id;$('productName').value=item.name;$('productCategory').value=item.category;$('productPrice').value=item.price;$('productEmoji').value=item.emoji||'';$('productDescription').value=item.description||'';$('saveProductBtn').textContent='Save changes';$('cancelEditBtn').classList.remove('hidden');productForm.scrollIntoView({behavior:'smooth',block:'start'});}));
list.querySelectorAll('[data-delete]').forEach(button=>button.addEventListener('click',()=>{const item=getProducts().find(p=>p.id===button.dataset.delete);if(item&&confirm(`Delete "${item.name}"?`)){if(saveProducts(getProducts().filter(p=>p.id!==item.id)))renderAdminProducts();}}));}
if(productForm){productForm.addEventListener('submit',event=>{event.preventDefault();const id=$('editId').value||'p'+Date.now();const item={id,name:$('productName').value.trim(),category:$('productCategory').value,price:Number($('productPrice').value),emoji:$('productEmoji').value.trim()||'🍯',description:$('productDescription').value.trim()};if(!item.name||!Number.isFinite(item.price)||item.price<0){alert('Please enter a valid product name and price.');return;}const products=getProducts(),index=products.findIndex(p=>p.id===id);if(index>=0)products[index]=item;else products.unshift(item);if(saveProducts(products)){resetProductForm();renderAdminProducts();}});$('cancelEditBtn')?.addEventListener('click',resetProductForm);}
