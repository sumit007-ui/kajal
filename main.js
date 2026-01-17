function closeMenu() {
  const check = document.getElementById("check");
  if (check) check.checked = false;
}

function initNavigation() {
  const check = document.getElementById("check");
  const navLinks = document.querySelectorAll(".nav-links a");

  if (!check) return;

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      check.checked = false;
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", e => {
    const nav = document.querySelector("nav");
    if (nav && !nav.contains(e.target) && check.checked) {
      check.checked = false;
    }
  });

  window.addEventListener("scroll", () => {
    const nav = document.querySelector("nav");
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 50);
  });
}

function initCountdown() {
  const target = new Date("March 11, 2026 20:00:00").getTime();

  function update() {
    const now = Date.now();
    const diff = target - now;

    const d = diff > 0 ? Math.floor(diff / 86400000) : 0;
    const h = diff > 0 ? Math.floor((diff % 86400000) / 3600000) : 0;
    const m = diff > 0 ? Math.floor((diff % 3600000) / 60000) : 0;
    const s = diff > 0 ? Math.floor((diff % 60000) / 1000) : 0;

    const ids = ["days", "hours", "minutes", "seconds"];
    const ids2 = ["days2", "hours2", "mins2", "secs2"];
    const vals = [d, h, m, s];

    ids.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(vals[i]).padStart(2, "0");
    });
    
    ids2.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(vals[i]).padStart(2, "0");
    });
  }

  update();
  setInterval(update, 1000);
}

function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;

  window.addEventListener("scroll", () => {
    const scrolled =
      (window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight)) *
      100;
    bar.style.width = scrolled + "%";
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add("revealed");
      });
    },
    { threshold: 0.15 }
  );

  items.forEach(el => observer.observe(el));
}

function initParallax() {
  const hero = document.getElementById("parallaxHero");
  const divider = document.getElementById("parallaxDivider");
  const registry = document.getElementById("parallaxRegistry");

  if (!hero && !divider && !registry) return;

  // Detect iOS (incl. touch Macs) reliably enough for our needs
  function isIOS() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return true;
    // iPad on iOS 13+ may report MacIntel, check for touch
    if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) return true;
    return false;
  }

  // Android and desktop - keep current behavior (simple scroll handler)
  if (!isIOS()) {
    window.addEventListener("scroll", () => {
      const y = window.pageYOffset;
      if (hero) hero.style.transform = `translateY(${y * 0.15}px)`;
      if (divider) divider.style.backgroundPositionY = y * 0.4 + "px";
      if (registry) registry.style.transform = `translateY(${(y - 3000) * 0.08}px)`;
    }, { passive: true });
    return;
  }

  // iOS: create an inner layer and animate via rAF for smoother GPU-accelerated motion
  let dividerInner = null;
  if (divider) {
    // create inner only on iOS to avoid changing Android behavior
    dividerInner = document.createElement('div');
    dividerInner.className = 'parallax-inner';
    // copy background-image from divider to inner if present
    const style = window.getComputedStyle(divider);
    const bg = style.backgroundImage;
    if (bg && bg !== 'none') {
      dividerInner.style.backgroundImage = bg;
      divider.style.backgroundImage = 'none';
    }
    divider.appendChild(dividerInner);
  }

  let latestKnownScrollY = 0;
  let ticking = false;

  function onScroll() {
    latestKnownScrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (!ticking) requestAnimationFrame(update);
    ticking = true;
  }

  function update() {
    const y = latestKnownScrollY;

    if (hero) {
      // Slightly stronger multiplier on iOS for more noticeable parallax
      hero.style.transform = `translate3d(0, ${y * 0.09}px, 0)`;
    }

    if (divider && dividerInner) {
      const rect = divider.getBoundingClientRect();
      // rect.top is distance to viewport top; use it to compute relative translate
      const translateY = -rect.top * 0.16; // slightly stronger for clearer parallax
      dividerInner.style.transform = `translate3d(0, ${translateY}px, 0)`;
    }

    if (registry) {
      const offsetTop = registry.offsetTop || 0;
      const offset = y - offsetTop;
      registry.style.transform = `translate3d(0, ${offset * 0.05}px, 0)`;
    }

    ticking = false;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  latestKnownScrollY = window.pageYOffset || document.documentElement.scrollTop;
  requestAnimationFrame(update);
}

function initGalleryLightbox() {
  const images = document.querySelectorAll(".gallery-img, .gallery-item img");
  if (!images.length) return;

  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.innerHTML = `
    <div class="lightbox-overlay"></div>
    <div class="lightbox-content">
      <img />
      <button class="lightbox-close">&times;</button>
      <button class="lightbox-prev">&#10094;</button>
      <button class="lightbox-next">&#10095;</button>
    </div>
  `;
  document.body.appendChild(lightbox);

  const img = lightbox.querySelector("img");
  const overlay = lightbox.querySelector(".lightbox-overlay");
  const close = lightbox.querySelector(".lightbox-close");
  const prev = lightbox.querySelector(".lightbox-prev");
  const next = lightbox.querySelector(".lightbox-next");

  let index = 0;

  function open(i) {
    index = i;
    img.src =
      images[i].src ||
      images[i].style.backgroundImage.replace(/url\(|\)|"/g, "");
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeBox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  images.forEach((el, i) => el.addEventListener("click", () => open(i)));

  overlay.onclick = closeBox;
  close.onclick = closeBox;
  prev.onclick = () => open((index - 1 + images.length) % images.length);
  next.onclick = () => open((index + 1) % images.length);

  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") closeBox();
    if (e.key === "ArrowLeft") prev.click();
    if (e.key === "ArrowRight") next.click();
  });
}

function initBlessings() {
  const btn = document.getElementById("blessBtn");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;

    for (let i = 0; i < 15; i++) {
      createEmoji(x, y, "❤", "heart");
    }
  });
}

function initGuestInteractions() {
  const hashtag = document.getElementById("hashtagItem");
  const dress = document.getElementById("dressCodeItem");

  hashtag?.addEventListener("click", (e) => {
    navigator.clipboard.writeText("#KajDeep2026");
    const rect = hashtag.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;
    
    // Sparkle effect for copy
    for (let i = 0; i < 12; i++) {
      createEmoji(x, y, "✨", "sparkle");
    }
    
    // Show temporary "Copied!" text
    const msg = document.createElement("div");
    msg.textContent = "Hashtag Copied!";
    msg.className = "copy-msg";
    msg.style.left = x + "px";
    msg.style.top = (y - 40) + "px";
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
  });

  dress?.addEventListener("click", (e) => {
    const rect = dress.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;
    const emojis = ["😊", "😄", "✨", "😊", "🙂", "✨"];
    
    for (let i = 0; i < 12; i++) {
      createEmoji(x, y, emojis[Math.floor(Math.random() * emojis.length)], "dress");
    }
  });
}

function initMapEmbed() {
  const containers = document.querySelectorAll('.map-container');
  if (!containers.length) return;

  containers.forEach(container => {
    const thumb = container.querySelector('.map-thumb');
    const closeBtn = container.querySelector('.map-close');

    // On desktop hover is handled by CSS; on touch devices we'll toggle a class
    const toggleOpen = (e) => {
      container.classList.toggle('open');
      e && e.stopPropagation();
    };

    if (thumb) {
      thumb.addEventListener('click', (e) => {
        // toggle on click/tap
        toggleOpen(e);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        container.classList.remove('open');
        e && e.stopPropagation();
      });
    }

    // Close map if user taps outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) container.classList.remove('open');
    });
  });
}

function createEmoji(x, y, char, className) {
  const el = document.createElement("div");
  el.className = `floating-emoji ${className}`;
  el.innerHTML = char;
  el.style.left = x + (Math.random() - 0.5) * 100 + "px";
  el.style.top = y + (Math.random() - 0.5) * 50 + "px";
  el.style.setProperty("--rot", (Math.random() - 0.5) * 360 + "deg");
  document.body.appendChild(el);

  setTimeout(() => el.remove(), 2000);
}

function initMusic() {
  const music = document.getElementById("bgMusic");
  const btn = document.getElementById("musicToggle");
  if (!music || !btn) return;

  function play() {
    music.play().then(() => {
      btn.classList.add("playing");
    }).catch(() => {
      // Autoplay blocked - will wait for interaction
    });
  }

  btn.addEventListener("click", () => {
    if (music.paused) {
      music.play();
      btn.classList.add("playing");
    } else {
      music.pause();
      btn.classList.remove("playing");
    }
  });

  // Try to play on first interaction
  const startMusic = () => {
    play();
    document.removeEventListener("click", startMusic);
    document.removeEventListener("scroll", startMusic);
    document.removeEventListener("touchstart", startMusic);
  };

  document.addEventListener("click", startMusic);
  document.addEventListener("scroll", startMusic);
  document.addEventListener("touchstart", startMusic);
}

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initCountdown();
  initScrollProgress();
  initReveal();
  initParallax();
  initGalleryLightbox();
  initBlessings();
  initGuestInteractions();
  initMapEmbed();
  initMusic();
});
