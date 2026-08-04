// AOS Animation //
AOS.init({
    duration: 1000,
    once: true,
    easing: "ease-in-out"
});

// Navigation Elements //
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");

//Open / Close Menu// 
function toggleMenu() {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
    document.body.classList.toggle("menu-open");

    // Accessibility
    const isOpen = hamburger.classList.contains("active");
    hamburger.setAttribute("aria-expanded", isOpen);
}

// Close Menu //
function closeMenu() {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    document.body.classList.remove("menu-open");
    hamburger.setAttribute("aria-expanded", "false");
}

// Hamburger Click //
hamburger.addEventListener("click", toggleMenu);

// Close Menu After Clicking Link //
navItems.forEach(link => {
    link.addEventListener("click", closeMenu);
});

// Close Menu When Clicking Outside // 
document.addEventListener("click", (event) => {

    if (
        !hamburger.contains(event.target) &&
        !navLinks.contains(event.target)
    ) {
        closeMenu();
    }

});

// Close Menu Using ESC Key//
document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {
        closeMenu();
    }

});

// Highlight Active Navigation// 
const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;

        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }

    });

    navItems.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }

    });

});