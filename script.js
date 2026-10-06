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

// ===== COUNTDOWN (27 NOVEMBER — OPENING CEREMONY) =====
const targetDate = new Date("2026-11-27T18:00:00+03:00");

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
const committees = [
  {
    name: "Disarmament Committee",
    size: "60–70 Delegates",
    agendas: [
      "The Question of Robotisation of Armed Forces",
      "Measures to Tackle the Link Between Terrorism and Organized Crime"
    ]
  },
  {
    name: "Economic and Financial Committee",
    size: "60–70 Delegates",
    agendas: [
      "Mitigating the Expansion of Illicit Trade and Shadow Economies in Developing Nations",
      "Expanding Access to Financial Technologies and Digital Economic Tools in Least Developed Countries"
    ]
  },
  {
    name: "Political Committee",
    size: "60–70 Delegates",
    agendas: [
      "Promoting Political Stability in the Sahel Region",
      "Addressing the Haitian Crisis"
    ]
  },
  {
    name: "Legal Committee",
    size: "60–70 Delegates",
    agendas: [
      "Addressing the Legal Ambiguities of Artificial Intelligence Regarding Intellectual Property Rights, Liability, and Accountability",
      "Addressing International Legal Gaps in Cyber Warfare"
    ]
  },
  {
    name: "Economic and Social Council",
    size: "60–70 Delegates",
    agendas: [
      "Addressing Long-Term Displacement in Syria and Yemen",
      "Socio-Economic Integration for Refugees in Host Nations"
    ]
  },
  {
    name: "Security Council",
    size: "30 Delegates / Double Delegate",
    agendas: [
      "De-escalating Nuclear Tensions and Ensuring Regional Security in the Kashmir Region",
      "Mitigating Armed Conflict in Myanmar"
    ]
  },
  {
    name: "Human Rights Council (UNHRC)",
    size: "60–70 Delegates",
    agendas: [
      "Protecting Fundamental Freedoms and the Rights of Women and Minorities in Conflict and Post-Conflict Settings",
      "Addressing Human Rights Violations in Conflict-Affected Areas of the Middle East"
    ]
  },
  {
    name: "Historical Committee",
    size: "Maximum 50 Delegates",
    agendas: ["Korean Civil War"]
  }
];

const committeeGrid = document.getElementById("committeeGrid");

function renderCommittees() {
  if (!committeeGrid) return;

  committeeGrid.innerHTML = committees
    .map(
      (c) => `
      <article class="committee-card">
        <div class="committee-top">
          <span class="committee-tag">${c.size}</span>
        </div>
        <h3>${c.name}</h3>
        <ul class="committee-agendas">
          ${c.agendas.map((a) => `<li>${a}</li>`).join("")}
        </ul>
      </article>
    `
    )
    .join("");
}

renderCommittees();

// ===== APPLICATIONS (DATE-GATED) =====
// Paste the Google Form links here once they are ready.
const applicationTracks = {
  chair: {
    label: "Chair Applications",
    url: "#",
    opens: new Date("2026-10-08T00:00:00+03:00"),
    closes: new Date("2026-10-21T00:00:00+03:00") // closes at the end of 20 October
  },
  delegate: {
    label: "Delegate Applications",
    url: "#",
    opens: new Date("2026-10-12T00:00:00+03:00"),
    closes: new Date("2026-11-06T00:00:00+03:00") // closes at the end of 5 November
  }
};

const shortDate = (date) =>
  date.toLocaleDateString("en-GB", { day: "numeric", month: "long", timeZone: "Europe/Istanbul" });

function updateApplyButtons() {
  const now = new Date();

  document.querySelectorAll("[data-apply-track]").forEach((card) => {
    const track = applicationTracks[card.dataset.applyTrack];
    const btn = card.querySelector("[data-apply-btn]");
    const status = card.querySelector("[data-apply-status]");
    if (!track || !btn) return;

    let state = "open";
    if (now < track.opens) state = "upcoming";
    else if (now >= track.closes) state = "closed";

    card.dataset.state = state;

    if (state === "open") {
      btn.textContent = track.label;
      btn.href = track.url;
      btn.classList.remove("is-disabled");
      btn.removeAttribute("aria-disabled");
      btn.removeAttribute("tabindex");
      if (status) status.textContent = "Open now";
    } else {
      btn.textContent = state === "closed" ? `${track.label} Closed` : `${track.label} · Opens ${shortDate(track.opens)}`;
      btn.removeAttribute("href");
      btn.classList.add("is-disabled");
      btn.setAttribute("aria-disabled", "true");
      btn.setAttribute("tabindex", "-1");
      if (status) status.textContent = state === "closed" ? "Closed" : "Coming soon";
    }
  });
}

updateApplyButtons();
setInterval(updateApplyButtons, 60 * 1000);

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
