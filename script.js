const EMAIL = "scott.valair@amilydata.com";

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = [...document.querySelectorAll(".primary-nav a")];
const revealEls = [...document.querySelectorAll(".reveal")];
const countEls = [...document.querySelectorAll("[data-count]")];

const serviceContent = {
  cleanup: {
    title: "Spreadsheet Cleanup",
    copy: "Clean, organized spreadsheets make everything easier. I can help remove duplicate rows, standardize columns, repair simple formulas, and prepare files for reports or dashboards.",
    items: ["Remove duplicates and empty rows", "Standardize dates, categories, and labels", "Prepare clean files for reporting"]
  },
  dashboard: {
    title: "Dashboard Design",
    copy: "Dashboards help you see what is changing without digging through tabs. I can build simple visuals that track the numbers you care about most.",
    items: ["Choose useful metrics", "Create clean charts and KPI cards", "Build a layout that is easy to read"]
  },
  reporting: {
    title: "Reporting Support",
    copy: "Reports are useful when they are clear. I can help turn raw data into summaries for meetings, donors, leaders, or team updates.",
    items: ["Monthly or quarterly summaries", "Plain-language insights", "Charts and tables that support the story"]
  },
  volunteer: {
    title: "Volunteer / Low-Cost Projects",
    copy: "I am building experience and want to help community-focused organizations. Select projects may qualify for discounted or pro bono support.",
    items: ["Good fit for small nonprofits", "Useful for one-time cleanup projects", "Clear scope before work begins"]
  }
};

function setHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  nav?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle?.setAttribute("aria-expanded", "false");
    nav?.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  });
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute("id");
    if (!id) return;
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  });
}, { rootMargin: "-45% 0px -45% 0px", threshold: 0.01 });

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach((el) => revealObserver.observe(el));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    animateCount(entry.target);
    countObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });

countEls.forEach((el) => countObserver.observe(el));

function animateCount(el) {
  const target = Number(el.dataset.count || 0);
  const duration = 900;
  const start = performance.now();
  const formatter = new Intl.NumberFormat("en-US");

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = formatter.format(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const serviceButtons = [...document.querySelectorAll("[data-service]")];
const detail = document.querySelector("[data-service-detail]");
const detailTitle = document.querySelector("[data-detail-title]");
const detailCopy = document.querySelector("[data-detail-copy]");
const detailList = document.querySelector("[data-detail-list]");

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.service;
    const content = serviceContent[key];
    if (!content) return;

    serviceButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    detail?.animate([
      { opacity: 0.55, transform: "translateY(10px)" },
      { opacity: 1, transform: "translateY(0)" }
    ], { duration: 240, easing: "ease-out" });

    detailTitle.textContent = content.title;
    detailCopy.textContent = content.copy;
    detailList.innerHTML = content.items.map((item) => `<li>${item}</li>`).join("");
  });
});

const workTrack = document.querySelector("[data-work-track]");
const workPrev = document.querySelector("[data-work-prev]");
const workNext = document.querySelector("[data-work-next]");

function scrollWork(direction) {
  if (!workTrack) return;
  const amount = Math.min(workTrack.clientWidth * 0.85, 420);
  workTrack.scrollBy({ left: direction * amount, behavior: "smooth" });
}

workPrev?.addEventListener("click", () => scrollWork(-1));
workNext?.addEventListener("click", () => scrollWork(1));

function randomLinePoints(width = 330, height = 120, points = 11) {
  const xGap = width / (points - 1);
  let last = height * 0.62;
  return Array.from({ length: points }, (_, index) => {
    const drift = (Math.random() - 0.48) * 36;
    const trend = -index * 4.4;
    last = Math.max(16, Math.min(height - 18, last + drift + trend / 8));
    return `${Math.round(index * xGap)},${Math.round(last)}`;
  }).join(" ");
}

function refreshCharts() {
  document.querySelectorAll(".dynamic-line").forEach((line) => {
    line.setAttribute("points", randomLinePoints());
    line.style.animation = "none";
    void line.getBoundingClientRect();
    line.style.animation = "draw-line 1.2s ease forwards";
  });

  document.querySelectorAll(".bar-chart i, .tiny-bars i").forEach((bar) => {
    const height = Math.round(32 + Math.random() * 68);
    bar.style.setProperty("--h", `${height}%`);
    bar.style.animation = "none";
    void bar.getBoundingClientRect();
    bar.style.animation = "grow-bar 0.7s ease both";
  });
}

document.querySelector("[data-refresh-charts]")?.addEventListener("click", refreshCharts);

const builder = document.querySelector("[data-request-builder]");
const requestOutput = document.querySelector("[data-request-output]");
const copyRequest = document.querySelector("[data-copy-request]");
const emailRequest = document.querySelector("[data-email-request]");

function makeSentence(items) {
  if (!items.length) return "I need help reviewing my data and deciding where to start.";
  if (items.length === 1) return `I need help to ${items[0]}.`;
  if (items.length === 2) return `I need help to ${items[0]} and ${items[1]}.`;
  return `I need help to ${items.slice(0, -1).join(", ")}, and ${items.at(-1)}.`;
}

function updateRequest() {
  if (!builder || !requestOutput || !emailRequest) return;
  const selected = [...builder.querySelectorAll("input:checked")].map((input) => input.value);
  const sentence = makeSentence(selected);
  requestOutput.textContent = sentence;
  emailRequest.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Data project request")}&body=${encodeURIComponent(sentence)}`;
}

builder?.addEventListener("change", updateRequest);
updateRequest();

copyRequest?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(requestOutput.textContent);
    copyRequest.textContent = "Copied";
    setTimeout(() => { copyRequest.textContent = "Copy request"; }, 1400);
  } catch {
    copyRequest.textContent = "Select and copy text";
    setTimeout(() => { copyRequest.textContent = "Copy request"; }, 1800);
  }
});

const copyEmailButton = document.querySelector("[data-copy-email]");
copyEmailButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(EMAIL);
    copyEmailButton.textContent = "Copied";
    setTimeout(() => { copyEmailButton.textContent = "Copy"; }, 1400);
  } catch {
    copyEmailButton.textContent = "Copy failed";
    setTimeout(() => { copyEmailButton.textContent = "Copy"; }, 1600);
  }
});

const contactForm = document.querySelector("[data-contact-form]");
contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(contactForm);
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const message = String(form.get("message") || "").trim();

  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Project details:",
    message
  ].join("\n");

  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("New data project inquiry")}&body=${encodeURIComponent(body)}`;
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();
