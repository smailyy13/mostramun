// ===== MOBILE MENU =====
const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsHover = window.matchMedia("(hover: hover)").matches;

if (menuBtn && mobileNav) {
  const closeMobileNav = () => {
    mobileNav.classList.remove("open");
    menuBtn.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    mobileNav.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  };

  menuBtn.addEventListener("click", () => {
    const isOpen = !mobileNav.classList.contains("open");
    mobileNav.classList.toggle("open", isOpen);
    menuBtn.classList.toggle("open", isOpen);
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    mobileNav.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileNav();
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMobileNav();
  });
}

// ===== COUNTDOWN (15 MAY) =====
// Adjust the year if needed.
const targetDate = new Date("2026-05-15T09:00:00");

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function pad(num) {
  return String(num).padStart(2, "0");
}

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    if (daysEl) daysEl.textContent = "00";
    if (hoursEl) hoursEl.textContent = "00";
    if (minutesEl) minutesEl.textContent = "00";
    if (secondsEl) secondsEl.textContent = "00";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);

  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  if (daysEl) daysEl.textContent = pad(days);
  if (hoursEl) hoursEl.textContent = pad(hours);
  if (minutesEl) minutesEl.textContent = pad(minutes);
  if (secondsEl) secondsEl.textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== COMMITTEES DATA =====
// Replace/expand with exact list from your MOSTRAMUN'26 document if needed.
const committees = [
  { type: "GA", name: "UNWOMEN", agenda: "Combating Violence Against Women in the Digital Age" },
  { type: "GA", name: "LEGAL", agenda: "State Sovereignty vs. Universal Jurisduction" },
  { type: "GA", name: "SOCHUM", agenda: "The Impact of State Measures on the Protection of Human Rights and Fundamental Freedoms in Iran" },
  { type: "GA", name: "IAAP", agenda: "Addressing Perfectionism and Fear of Failure in Youth Mental Health" },
  { type: "SPECIAL", name: "House of Commons", agenda: "Unemployment and Regional Disparities in Thatcher's Britain" },
  { type: "SPECIAL", name: "EGM", agenda: "The Palu Family Case: Faith-Based Coercive Mechanisms, Domestic Violence, and Concealed Deaths" },
  { type: "SPECIAL", name: "FIA", agenda: "2016-Jules Bianchi Accident Investigation" },
  { type: "SPECIAL", name: "ICC", agenda: "Judicial Review of Alleged Federal Election Manipulation in the 2024 United States Presidential Election" },
  { type: "SEMI", name: "European Parliament", agenda: "The alleged Chinese harsh power and assimilation policies over East Turkistan & Uighurs" },
  { type: "SEMI", name: "SUMMIT", agenda: "1940 British war summit" },
  { type: "SEMI", name: "H-UNSC", agenda: "Concerning the deployment of nuclear missiles in Cuba and the implications of Cuban Missile Crisis for international peace and security." },
  { type: "CRISIS", name: "HCC", agenda: "Indonesian Cabinet of Suharto" },
  { type: "CRISIS", name: "Board of Peace", agenda: "Board of Peace" },
  { type: "CRISIS", name: "FJCC", agenda: "Game of Thrones: Battle of Bastards" },
  { type: "CRISIS", name: "FCC", agenda: "Alice in Borderland" },
  { type: "CRISIS", name: "JCC", agenda: "Battle of Dyrrhachium (1081 Norman Invasion)" }
];

const committeeGrid = document.getElementById("committeeGrid");

function renderCommittees() {
  if (!committeeGrid) return;

  committeeGrid.innerHTML = committees
    .map(
      (c, index) => `
      <button class="committee-card" data-index="${index}" type="button">
        <div class="committee-top">
          <span class="committee-tag">${c.type}</span>
        </div>
        <h3>${c.name}</h3>
        <p>${c.agenda}</p>
      </button>
    `
    )
    .join("");
}

renderCommittees();

// ===== COMMITTEE MODAL =====
const modal = document.getElementById("committeeModal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose = document.getElementById("modalClose");
const modalType = document.getElementById("modalType");
const modalTitle = document.getElementById("modalTitle");
const modalAgenda = document.getElementById("modalAgenda");
const modalDescription = document.getElementById("modalDescription");

function openModal(committee) {
  if (!modal) return;

  if (modalType) modalType.textContent = committee.type;
  if (modalTitle) modalTitle.textContent = committee.name;
  if (modalAgenda) modalAgenda.textContent = committee.agenda;
  if (modalDescription) {
    modalDescription.textContent =
      `${committee.name} committee details will be published soon. ` +
      `You can place committee-specific background information, level (beginner/intermediate/advanced), ` +
      `procedural notes and chairboard expectations here.`;
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Committee popup interaction is temporarily disabled.
// if (committeeGrid) {
//   committeeGrid.addEventListener("click", (e) => {
//     const card = e.target.closest(".committee-card");
//     if (!card) return;
//
//     const index = Number(card.dataset.index);
//     const committee = committees[index];
//     if (committee) openModal(committee);
//   });
// }
//
// if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
// if (modalClose) modalClose.addEventListener("click", closeModal);
//
// window.addEventListener("keydown", (e) => {
//   if (e.key === "Escape" && modal?.classList.contains("open")) {
//     closeModal();
//   }
// });

// ===== HEADER SHADOW ON SCROLL =====
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  if (!header) return;
  if (window.scrollY > 12) {
    header.style.background = "rgba(6,10,8,0.78)";
    header.style.borderBottomColor = "rgba(255,255,255,0.08)";
  } else {
    header.style.background = "rgba(6,10,8,0.65)";
    header.style.borderBottomColor = "rgba(255,255,255,0.06)";
  }
});

// ===== SCROLL REVEAL + POINTER GLOW =====
const revealSelectors = [
  ".section-head",
  ".about-text p",
  ".stat-card",
  ".team-card",
  ".committee-card",
  ".venue-content > *",
  ".timeline-item",
  ".faq-item",
  ".apply-card",
  ".contact-card"
];

if (!prefersReducedMotion) {
  document.body.classList.add("js-enabled");

  const revealItems = document.querySelectorAll(revealSelectors.join(","));
  revealItems.forEach((item, index) => {
    item.classList.add("reveal-item");
    item.style.setProperty("--reveal-delay", `${(index % 6) * 70}ms`);
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const interactiveCards = document.querySelectorAll(
    ".stat-card, .team-card, .committee-card, .apply-card, .contact-card"
  );

  interactiveCards.forEach((card) => {
    card.classList.add("interactive-card");
  });

  if (supportsHover) {
    interactiveCards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty("--mx", `${x}%`);
        card.style.setProperty("--my", `${y}%`);
      });

      card.addEventListener("pointerleave", () => {
        card.style.removeProperty("--mx");
        card.style.removeProperty("--my");
      });
    });
  }
}
