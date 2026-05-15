'use strict';

// ── ADD / REMOVE IMAGES HERE ─────────────────────────────
const GALLERY_IMAGES = [
  { src: 'gallery/Eagle_Stars_Team_pic.jpg', caption: 'The Team'    },
  { src: 'gallery/EagleStars-1.jpg',         caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-2.jpg',         caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-4.jpg',         caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-5.jpg',         caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-6.jpg',         caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-7.jpg',         caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-8.jpg',         caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-9.jpg',         caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-10.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-11.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-12.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-15.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-16.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-18.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-19.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-20.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-21.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-22.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-23.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-24.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-25.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-27.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-28.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-29.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-31.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-32.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-34.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-35.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-36.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-40.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-41.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-42.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-43.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-44.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-45.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-46.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-47.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-48.jpg',        caption: 'Eagle Stars' },
  { src: 'gallery/EagleStars-49.jpg',        caption: 'Eagle Stars' },
];
// ─────────────────────────────────────────────────────────

const mosaic = document.getElementById('gallery-mosaic');

GALLERY_IMAGES.forEach((img, i) => {
  const tile  = document.createElement('div');
  const imgEl = document.createElement('img');
  const capEl = document.createElement('div');

  tile.className      = 'g-tile';
  imgEl.src           = img.src;
  imgEl.alt           = img.caption + ' ' + (i + 1);
  imgEl.loading       = 'lazy';
  capEl.className     = 'caption';
  capEl.textContent   = img.caption;

  imgEl.addEventListener('load', () => {
    const { naturalWidth: w, naturalHeight: h } = imgEl;
    if (h > w * 1.2)      tile.classList.add('g-portrait');
    else if (w > h * 1.2) tile.classList.add('g-landscape');
  });

  tile.appendChild(imgEl);
  tile.appendChild(capEl);
  tile.addEventListener('click', () => openLB(i));
  mosaic.appendChild(tile);
});

// ── LIGHTBOX ─────────────────────────────────────────────
let lbIndex = 0;

function lbShow(index) {
  lbIndex = (index + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
  const lbImg = document.getElementById('lb-img');
  lbImg.classList.add('fade');
  setTimeout(() => {
    lbImg.src = GALLERY_IMAGES[lbIndex].src;
    lbImg.alt = GALLERY_IMAGES[lbIndex].caption;
    lbImg.classList.remove('fade');
  }, 160);
  document.getElementById('lb-counter').textContent = (lbIndex + 1) + ' / ' + GALLERY_IMAGES.length;
}

function openLB(index) {
  document.getElementById('lightbox').classList.add('active');
  document.body.style.overflow = 'hidden';
  lbShow(index);
}

function lbStep(dir) { lbShow(lbIndex + dir); }

function closeLB(e, force) {
  if (force || (e && e.target === document.getElementById('lightbox'))) {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('active')) return;
  if (e.key === 'Escape')     closeLB(null, true);
  if (e.key === 'ArrowRight') lbStep(1);
  if (e.key === 'ArrowLeft')  lbStep(-1);
});
