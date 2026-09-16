// LARELLI — menu mobile, filtro de catálogo e lightbox de produto

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFiltros();
  initLightbox();
});

function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

function initFiltros() {
  const botoes = document.querySelectorAll('.filtro-btn');
  const cards = document.querySelectorAll('.produto-card');
  if (!botoes.length) return;

  botoes.forEach(btn => {
    btn.addEventListener('click', () => {
      botoes.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const categoria = btn.dataset.categoria;

      cards.forEach(card => {
        const match = categoria === 'todos' || card.dataset.categoria === categoria;
        card.style.display = match ? '' : 'none';
      });
    });
  });
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const mainImg = lightbox.querySelector('.lightbox-main img');
  const thumbsWrap = lightbox.querySelector('.lightbox-thumbs');
  const titleEl = lightbox.querySelector('.lightbox-info h3');
  const precoEl = lightbox.querySelector('.lightbox-info .preco');
  const whatsBtn = lightbox.querySelector('.lightbox-info .btn');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentImages = [];
  let currentIndex = 0;

  function openFromCard(card) {
    currentImages = JSON.parse(card.dataset.fotos);
    currentIndex = 0;
    titleEl.textContent = card.dataset.nome;
    precoEl.textContent = card.dataset.preco;
    whatsBtn.href = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent('Olá! Tenho interesse no produto: ' + card.dataset.nome + '. Ele ainda está disponível?')}`;
    renderThumbs();
    showImage(0);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function renderThumbs() {
    thumbsWrap.innerHTML = '';
    currentImages.forEach((src, i) => {
      const img = document.createElement('img');
      img.src = src;
      img.addEventListener('click', () => showImage(i));
      thumbsWrap.appendChild(img);
    });
  }

  function showImage(i) {
    currentIndex = (i + currentImages.length) % currentImages.length;
    mainImg.src = currentImages[currentIndex];
    thumbsWrap.querySelectorAll('img').forEach((img, idx) => {
      img.classList.toggle('active', idx === currentIndex);
    });
  }

  document.querySelectorAll('.produto-card').forEach(card => {
    const photo = card.querySelector('.produto-photo');
    if (photo) photo.addEventListener('click', () => openFromCard(card));
  });

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
  nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });
}
