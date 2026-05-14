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
const committees = [
  {
    type: "GA",
    name: "UNWOMEN",
    agenda: "Combating Violence Against Women in the Digital Age",
    files: [
      { label: "Study Guide", path: "assets/guides/unwomen-study-guide.pdf" }
    ],
    description: [
      "The UNWOMEN Committee, guided by the mission of UNWOMEN, focuses on advancing gender equality and protecting women's rights globally. In this session, delegates will address the growing issue of violence and harassment women face on the internet, including cyberbullying, online stalking, hate speech, and non-consensual content sharing.",
      "As digital spaces become central to public life, online abuse silences women's voices and limits their participation. The committee will work to develop effective, rights-based solutions that promote digital safety, accountability, and equal access to online platforms for all women and girls."
    ]
  },
  {
    type: "GA",
    name: "LEGAL",
    agenda: "State Sovereignty vs. Universal Jurisdiction",
    files: [
      { label: "Study Guide", path: "assets/guides/legal-study-guide.pdf" }
    ],
    description: [
      "The idea of state sovereignty holds that a state has complete control over its internal affairs and territory, free from outside intervention. On the other hand, universal jurisdiction permits governments or international courts to bring criminal charges against individuals for some serious crimes, including war crimes, crimes against humanity, and genocide, regardless of the accused's nationality or the location of the incident. The conflict between upholding a state's sovereign rights and guaranteeing accountability for major international crimes is examined in this agenda item, which also raises important moral and legal issues regarding when the international community has the right to supersede national jurisdiction in order to protect justice and human rights.",
      "In order to determine whether international or foreign tribunals may lawfully prosecute people for major international crimes without infringing on a state's power, delegates will analyse the legal and political balance between state sovereignty and universal jurisdiction. In addition to discussing protections against political abuse, selective enforcement, and jurisdictional overreach, they will examine current international legal frameworks, state practice, and precedent. In the end, delegates will try to suggest procedures that improve accountability for serious human rights abuses while simultaneously safeguarding sovereign equality."
    ]
  },
  {
    type: "GA",
    name: "SOCHUM",
    agenda: "The Impact of State Measures on the Protection of Human Rights and Fundamental Freedoms in Iran",
    files: [
      { label: "Study Guide", path: "assets/guides/sochum-study-guide.pdf" }
    ],
    description: [
      "The Social, Humanitarian, and Cultural Committee (SOCHUM), the Third Committee of the United Nations General Assembly, addresses issues related to human rights, fundamental freedoms, and social development, providing a platform for Member States to promote universal rights as outlined in the Universal Declaration of Human Rights while examining violations of civil, political, economic, social, and cultural rights and fostering international cooperation.",
      "In this session, the Committee will focus on the agenda item \"The Impact of State Measures on the Protection of Human Rights and Fundamental Freedoms in Iran,\" emphasizing the complex relationship between state governance and individual liberties within the Islamic Republic of Iran, where domestic laws, security policies, and institutional practices have faced significant international scrutiny. Reports from United Nations bodies and human rights organizations have raised concerns about restrictions on freedoms of expression, association, religion, and due process, as well as the broader impact of state responses to political dissent and civil society. While recognizing state sovereignty and diverse legal systems, the Committee underscores the need for balanced dialogue that upholds universally recognized human rights standards, encouraging delegates to assess the legality and humanitarian consequences of such measures and to propose solutions that strengthen the protection of fundamental freedoms in accordance with international law."
    ]
  },
  {
    type: "GA",
    name: "IAAP",
    agenda: "Addressing Perfectionism and Fear of Failure in Youth Mental Health",
    files: [
      { label: "Study Guide", path: "assets/guides/iaap-study-guide.pdf" }
    ],
    description: [
      "The International Association of Applied Psychology (IAAP) committee focuses on how psychological research can guide real-world policies and social change. Rather than looking at mental health only as an individual issue, IAAP examines how systems such as education, culture, and social expectations shape the emotional well-being of societies. Delegates are expected to approach topics with both empathy and practicality, developing realistic and impactful policy solutions.",
      "Under the agenda \"Addressing Perfectionism and Fear of Failure in Youth Mental Health,\" the committee will explore how increasing academic pressure, constant comparison, and the pursuit of flawless success affect young people today. As perfectionism becomes normalized within schools and social environments, many students struggle with anxiety, burnout, and a persistent fear of not being \"good enough.\" This committee will discuss the roots of these pressures and evaluate how governments and institutions can respond through preventive mental health strategies, education reforms, and support systems that promote resilience without reinforcing unhealthy expectations."
    ]
  },
  {
    type: "SPECIAL",
    name: "House of Commons",
    agenda: "Unemployment and Regional Disparities in Thatcher's Britain",
    files: [
      { label: "Study Guide", path: "assets/guides/house-of-commons-study-guide.pdf" },
      { label: "Rules of Procedure", path: "assets/guides/house-of-commons-rop.pdf" }
    ],
    description: [
      "The House of Commons committee simulates the British Parliament during a transformative period in modern history, specifically set in the era of Margaret Thatcher's leadership. This committee focuses on the socio-economic challenges arising from rapid economic restructuring, including rising unemployment, industrial decline, and increasing regional inequalities across the United Kingdom.",
      "Delegates will take on the roles of Members of Parliament and engage in dynamic debate, policy drafting, and legislative negotiation. The primary objective will be to evaluate the social and economic consequences of governmental reforms, particularly in heavily industrialized regions affected by deindustrialization. Participants are expected to propose policies that balance economic growth with social equity, ensuring that national development does not disproportionately disadvantage certain communities.",
      "Emphasizing realism and historical context, the committee encourages delegates to understand political ideologies, party dynamics, and public accountability. Through structured parliamentary procedures, participants will refine their skills in debate, negotiation, and policymaking. Ultimately, this committee offers a comprehensive simulation of democratic governance, where delegates must navigate competing interests while striving to create sustainable and inclusive economic solutions."
    ]
  },
  {
    type: "SPECIAL",
    name: "EGM",
    agenda: "The Palu Family Case: Faith-Based Coercive Mechanisms, Domestic Violence, and Concealed Deaths",
    files: [
      { label: "Study Guide", path: "assets/guides/egm-study-guide.pdf" }
    ],
    description: [
      "Dear Prosecutor, fellow lawyers, and esteemed police station officials, this year our EGM (General Directorate of Security) committee will be working on the \"The Palu Family Case\" agenda. Under the leadership of our USGs Berf and Göksu Efe, and with the support of ACAS Ekin, an excellent academic process awaits you. In addition to academic feedback, you will follow the process in the most enjoyable and productive way with plenty of humor and funny updates.",
      "In short, our expectation for you in this committee is to take on the role of a police officer, lawyer, or prosecutor — whichever allocation you get — and solve the mystery and enigma. More details would spoil the mystery, wouldn't they? Apply now and take one step closer to your chance to join this committee!"
    ]
  },
  {
    type: "SPECIAL",
    name: "FIA",
    agenda: "2016 — Jules Bianchi Accident Investigation",
    description: [
      "The agenda item for the FIA committee meeting at MostraMun will be the Jules Bianchi accident in Suzuka, Japan in 2016, which deeply saddened us all. Our committee will investigate this tragic accident that shocked everyone, and all delegates will be part of the FIA's investigative team.",
      "In summary, the accident occurred when Bianchi lost control of his car and crashed into a crane on the track, which was there to recover Adrian Sutil's car after Sutil's accident on the previous lap (lap 42) at the same spot, turn 7. The FIA at the time was inadequate in its investigation of this tragic accident, and even preventative measures were taken too late. We will be at MostraMun to commemorate this day, considered by some to be the most shameful day for the FIA, and to revisit these investigations. Simply lovely, isn't it?"
    ]
  },
  {
    type: "SPECIAL",
    name: "US Federal Court",
    agenda: "Judicial Review of Alleged Federal Election Manipulation in the 2024 United States Presidential Election",
    files: [
      { label: "Study Guide", path: "assets/guides/us-federal-court-study-guide.pdf" }
    ],
    description: [
      "This committee examines the manipulation of the 2024 United States presidential election, one of the most pressing challenges facing contemporary democratic governance. Delegates will analyze the impact of cyber operations, disinformation campaigns, and technological vulnerabilities on the integrity of the electoral process.",
      "The committee will explore the balance between constitutional safeguards, national security considerations, freedom of expression, and the protection of democratic legitimacy. Through structured debate, delegates will assess existing legal and institutional frameworks and propose policy measures aimed at strengthening electoral resilience and maintaining public confidence in democratic institutions."
    ]
  },
  {
    type: "SEMI",
    name: "European Parliament",
    agenda: "The alleged Chinese harsh power and assimilation policies over East Turkistan & Uighurs",
    description: [
      "The European Parliament is the legislative group of the European Union. It stands for its people's desires and forms plans on many matters. The parliament has Members who are chosen by direct voting, also known as MEPs; these members have a very important part in forming EU laws. They nurture conversation and make sure there is democratic rule inside the Union. Their duties involve looking into new political, social, and financial issues that could disturb Europe's peace or unity, to ensure that EU standards stay safe even when things around them are changing quickly worldwide.",
      "The committee will deliberate on the Chinese harsh power and assimilation policy on the Uyghur Muslims in East Turkestan, also referred to as the Xinjiang Uyghur Autonomous Region (XUAR). The delegates will deliberate on the claims of the Chinese harsh power on the Uyghur Muslims, such as the claims of mass surveillance, re-education camps, cultural restrictions, alleged cases of forced labor, and demographic restrictions, and their implications on EU-China relations. This case is complex and involves international law, sovereignty, human rights, and EU autonomy.",
      "While discussing the issue, the committee will rely on credible information, examine the appropriate international human rights frameworks, and consider the EU's possible actions within its powers. The possible measures that the delegates might use when discussing the issue include measures like sanctions, trade, and diplomacy. The measures aim to produce practical and moral recommendations that will be grounded in the fundamental values of the European Union."
    ]
  },
  {
    type: "SEMI",
    name: "SUMMIT",
    agenda: "1940 British War Summit",
    description: [
      "Set in May 1940, at a critical turning point in the Second World War, this Summit committee recreates the internal debates of the British War Cabinet during one of the most decisive moments in modern history. Following the rapid advancement of Nazi Germany across Europe, the United Kingdom faced a fundamental question: should it continue resisting or pursue negotiations for peace?",
      "Prime Minister Winston Churchill firmly advocated for continued resistance regardless of the deteriorating position of Britain's allies, emphasizing resilience and long-term strategic defense. In contrast, Foreign Secretary Lord Halifax supported the idea of entering negotiations, arguing that further conflict could lead to devastating consequences.",
      "Delegates will step into the roles of key political figures and advisors, engaging in high-level strategic discussions that will shape the future of the war. The committee demands strong analytical thinking, persuasive argumentation, and the ability to respond to evolving crisis updates.",
      "This Summit is not only about historical accuracy but also about understanding leadership under pressure. Delegates must evaluate military realities, political consequences, and moral considerations while determining whether Britain will stand alone or alter the course of history."
    ]
  },
  {
    type: "SEMI",
    name: "H-UNSC",
    agenda: "Concerning the deployment of nuclear missiles in Cuba and the implications of Cuban Missile Crisis for international peace and security",
    files: [
      { label: "Study Guide", path: "assets/guides/hunsc-study-guide.pdf" }
    ],
    description: [
      "The Historical United Nations Security Council (H-UNSC) simulates past sessions of the UNSC, offering delegates the opportunity to return to significant crises in international history aiming to reevaluate them through diplomacy.",
      "The Cuban Missile Crisis (1962) is one of the most critical confrontations of the Cold War era. In the aftermath of the discovery of Soviet nuclear missile deployments in Cuba, Cold War tensions between the Soviet Union and the United States deepened, bringing the world to the brink of nuclear conflict. Delegates of the H-UNSC committee will analyze the principles of nuclear deterrence and collective security while responding to rapidly evolving developments through strategic thinking and crisis diplomacy."
    ]
  },
  {
    type: "CRISIS",
    name: "HCC",
    agenda: "Indonesian Cabinet of Suharto",
    description: [
      "The Historical Crisis Committee (HCC) simulates the Indonesian Cabinet under President Suharto, focusing on the political and economic dynamics of his authoritarian regime during the late 20th century. Delegates will assume the roles of key government officials responsible for maintaining national stability while navigating internal and external challenges.",
      "Suharto's rule was characterized by centralized authority, economic development policies, and strict political control. The committee will explore how the regime responded to issues such as political opposition, economic management, and international relations within a strategically important region.",
      "Delegates must balance maintaining regime stability with addressing pressures from both domestic groups and global actors. Decisions may involve economic reforms, security measures, or diplomatic strategies.",
      "The committee operates in a fast-paced crisis format, requiring adaptability and strategic foresight. Participants must respond to evolving situations while preserving their political influence. This simulation offers a deep exploration of governance under authoritarian systems, challenging delegates to understand the complexities of power, control, and survival in a high-stakes political environment."
    ]
  },
  {
    type: "CRISIS",
    name: "Board of Peace",
    agenda: "Board of Peace",
    description: [
      "The Board of Peace (BoP), established by Donald J. Trump, is a high-stakes executive forum designed to bypass traditional diplomatic gridlock through a \"peace through strength\" mandate. Tasked with resolving urgent global crises, the committee serves as a diplomatic crucible where member states must navigate American-led stabilization efforts while fiercely defending their own national identities and strategic sovereignty.",
      "Delegates will face the ultimate challenge: achieving collective security without compromising their country's red lines in a landscape defined by power politics and national pride."
    ]
  },
  {
    type: "CRISIS",
    name: "FJCC",
    agenda: "Game of Thrones: Battle of Bastards",
    description: [
      "Inspired by Game of Thrones, this Fictional Joint Crisis Committee places delegates at the center of the legendary Battle of the Bastards — the clash between Jon Snow and Ramsay Bolton for control of Winterfell and the fate of the North.",
      "This committee explores far more than a battlefield encounter; it delves into legitimacy, leadership, loyalty, vengeance, and the brutal cost of power. Delegates will be divided into rival war councils, commanding armies, shaping formations, securing alliances, and responding to relentless crisis updates that will continuously reshape the course of the war. Every directive will influence morale, strategy, and survival.",
      "Designed as a fast-paced, high-intensity Joint Crisis Committee, the experience demands adaptability, creativity, and sharp strategic thinking. Reinforcements may arrive unexpectedly, alliances may fracture, and calculated risks may either secure victory or lead to complete annihilation.",
      "In the North, mercy is weakness, hesitation is fatal, and history is written by those who survive."
    ]
  },
  {
    type: "CRISIS",
    name: "FCC",
    agenda: "Alice in Borderland",
    description: [
      "Inspired by the series Alice in Borderland, this Fictional Crisis Committee places delegates in a mysterious and abandoned version of Tokyo, where survival depends on participating in dangerous and unpredictable games. Each participant must navigate this unfamiliar environment while facing both physical and psychological challenges.",
      "The central objective of the committee is to determine how to escape this world without losing one's life. Delegates will take on roles within the scenario, making decisions that directly affect their survival and the fate of others. Choices will involve moral dilemmas, alliances, and strategic risks.",
      "The committee emphasizes creativity, adaptability, and quick decision-making. Crisis updates will continuously reshape the environment, forcing delegates to reconsider strategies and respond to unexpected developments.",
      "Beyond entertainment, the simulation explores deeper themes such as human behavior under pressure, trust, fear, and the instinct for survival. Participants must decide whether to cooperate, compete, or challenge the system itself, making this committee both intellectually engaging and highly immersive."
    ]
  },
  {
    type: "CRISIS",
    name: "JCC",
    agenda: "Battle of Dyrrhachium (1081 Norman Invasion)",
    description: [
      "The Joint Crisis Committee (JCC) simulates one of the most decisive military confrontations of the medieval Mediterranean: the Battle of Dyrrhachium in 1081, where the Byzantine Empire faced the advancing Norman forces led by Robert Guiscard. This conflict marked a critical moment in Byzantine history, as the empire struggled to defend its western territories against a highly organized and aggressive invasion.",
      "Delegates will be divided into opposing crisis cabinets, representing the Byzantine command under Emperor Alexios I Komnenos and the Norman leadership under Robert Guiscard. Each side must develop military strategies, manage internal challenges, and respond to rapidly evolving battlefield conditions. The committee will not only focus on direct military engagement but also on logistics, morale, alliances, and political maneuvering.",
      "As a fast-paced crisis environment, JCC requires adaptability, strategic foresight, and decisive leadership. Delegates must navigate uncertainty, issue timely directives, and anticipate the moves of their opponents. Every decision will influence the course of the battle and the broader balance of power in the region.",
      "Ultimately, this committee challenges participants to rewrite history through strategy and diplomacy, determining whether Dyrrhachium becomes a turning point of collapse or resilience."
    ]
  }
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
    const paragraphs = Array.isArray(committee.description) ? committee.description : [committee.description || ""];
    modalDescription.innerHTML = paragraphs.map((p) => `<p>${p}</p>`).join("");
  }

  const modalFiles = document.getElementById("modalFiles");
  if (modalFiles) {
    if (committee.files && committee.files.length > 0) {
      modalFiles.innerHTML = `
        <div class="modal-files-inner">
          <h4>Documents</h4>
          <div class="modal-files-btns">
            ${committee.files.map((f) => `
              <a href="${f.path}" download class="btn btn-ghost modal-file-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                ${f.label}
              </a>
            `).join("")}
          </div>
        </div>
      `;
      modalFiles.style.display = "block";
    } else {
      modalFiles.innerHTML = "";
      modalFiles.style.display = "none";
    }
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

if (committeeGrid) {
  committeeGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".committee-card");
    if (!card) return;

    const index = Number(card.dataset.index);
    const committee = committees[index];
    if (committee) openModal(committee);
  });
}

if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);
if (modalClose) modalClose.addEventListener("click", closeModal);

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal?.classList.contains("open")) {
    closeModal();
  }
});

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
