function initNavigation() {
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const navbar = document.querySelector(".navbar");

  if (!hamburger || !navMenu || !navbar) return;

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  document.addEventListener("click", e => {
    if (!navbar.contains(e.target)) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
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

  window.addEventListener("scroll", () => {
    const y = window.pageYOffset;
    if (hero) hero.style.transform = `translateY(${y * 0.15}px)`;
    if (divider) divider.style.backgroundPositionY = y * 0.4 + "px";
    if (registry) registry.style.transform = `translateY(${(y - 3000) * 0.08}px)`;
  });
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
  initMusic();
});
