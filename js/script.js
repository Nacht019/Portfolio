// Set up each feature once. Never register click handlers inside a scroll handler.
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
if (window.AOS && !reducedMotion.matches) {
    window.AOS.init({ duration: 700, once: true, easing: "ease-in-out" });
} else {
    document.querySelectorAll("[data-aos]").forEach(element => element.removeAttribute("data-aos"));
}

// Navigation
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const navItems = [...navLinks.querySelectorAll("a")];
const mobile = window.matchMedia("(max-width: 768px)");

function setMenu(open) {
    hamburger.classList.toggle("active", open);
    navLinks.classList.toggle("active", open);
    hamburger.setAttribute("aria-expanded", String(open));
    navLinks.inert = mobile.matches && !open;
    document.body.classList.toggle("menu-open", open);
}

hamburger.addEventListener("click", () => setMenu(!navLinks.classList.contains("active")));
navLinks.addEventListener("click", event => {
    if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("click", event => {
    if (!event.target.closest("nav")) setMenu(false);
});
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && navLinks.classList.contains("active")) {
        setMenu(false);
        hamburger.focus();
    }
});
mobile.addEventListener("change", () => setMenu(false));
setMenu(false);

// Only page sections with IDs participate in active-link tracking.
const sections = [...document.querySelectorAll("main > section[id]")];
let scrollPending = false;
function updateActiveLink() {
    let current = "";
    sections.forEach(section => {
        if (section.getBoundingClientRect().top <= 140) current = section.id;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections.at(-1)?.id || current;
    }
    navItems.forEach(link => {
        const active = link.hash === "#" + current;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
    });
    scrollPending = false;
}
window.addEventListener("scroll", () => {
    if (!scrollPending) {
        scrollPending = true;
        requestAnimationFrame(updateActiveLink);
    }
}, { passive: true });
window.addEventListener("resize", updateActiveLink);
updateActiveLink();

// Native dialog provides Escape handling and keeps keyboard focus inside.
const modal = document.querySelector("#kulture-modal");
const opener = document.querySelector('[data-project="kulture"]');
const mainImage = modal.querySelector("#gallery-main-image");
const thumbnails = [...modal.querySelectorAll(".gallery-thumbnail")];
const playButton = modal.querySelector(".gallery-play");
let imageIndex = 0;
let timer;
let playing = false;

function showImage(index) {
    if (!thumbnails.length) return;
    imageIndex = (index + thumbnails.length) % thumbnails.length;
    const selected = thumbnails[imageIndex];
    mainImage.src = selected.dataset.image;
    mainImage.alt = selected.querySelector("img").alt;
    thumbnails.forEach((thumbnail, i) => {
        thumbnail.classList.toggle("active", i === imageIndex);
        thumbnail.setAttribute("aria-pressed", String(i === imageIndex));
    });
}

function syncPlayback() {
    clearInterval(timer);
    playButton.textContent = playing ? "Pause slideshow" : "Play slideshow";
    playButton.setAttribute("aria-pressed", String(playing));
    if (playing && modal.open && !document.hidden && thumbnails.length > 1) {
        timer = setInterval(() => showImage(imageIndex + 1), 3000);
    }
}

function navigate(index) {
    showImage(index);
    syncPlayback();
}

opener.addEventListener("click", () => {
    setMenu(false);
    showImage(0);
    modal.showModal();
    modal.querySelector(".project-modal-content").scrollTop = 0;
    document.body.classList.add("modal-open");
    playing = !reducedMotion.matches;
    syncPlayback();
});
modal.querySelector(".project-modal-close").addEventListener("click", () => modal.close());
modal.querySelector(".project-modal-overlay").addEventListener("click", () => modal.close());
modal.addEventListener("close", () => {
    playing = false;
    syncPlayback();
    document.body.classList.remove("modal-open");
    opener.focus();
});
modal.querySelector(".gallery-prev").addEventListener("click", () => navigate(imageIndex - 1));
modal.querySelector(".gallery-next").addEventListener("click", () => navigate(imageIndex + 1));
thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => navigate(index));
});
playButton.addEventListener("click", () => {
    playing = !playing;
    syncPlayback();
});
document.addEventListener("visibilitychange", syncPlayback);
reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
        playing = false;
        syncPlayback();
    }
});
showImage(0);
