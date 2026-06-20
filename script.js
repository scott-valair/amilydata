const EMAIL = "scott.valair@amilydata.com";

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const navLinks = [...document.querySelectorAll(".primary-nav a")];
const revealEls = [...document.querySelectorAll(".reveal")];
const countEls = [...document.querySelectorAll("[data-count]")];
const fitTextEls = [...document.querySelectorAll(".float-card strong, .metric-grid strong, .ring-label strong, .breakdown-list strong, .pipeline-step strong")];

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
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      fitGraphicText();
    }
  }

  requestAnimationFrame(tick);
}

function fitGraphicText() {
  fitTextEls.forEach((el) => {
    const box = el.closest(".metric-grid div, .ring-label, .breakdown-list li, .pipeline-step, .category-card li, .float-card");
    if (!box) return;

    el.style.fontSize = "";
    const baseSize = parseFloat(getComputedStyle(el).fontSize);
    let size = baseSize;
    const minSize = Math.max(11, baseSize * 0.64);
    let passes = 0;

    while (el.scrollWidth > box.clientWidth - 2 && size > minSize && passes < 20) {
      size -= 1;
      el.style.fontSize = `${size}px`;
      passes += 1;
    }
  });
}

requestAnimationFrame(fitGraphicText);

if ("ResizeObserver" in window) {
  const fitObserver = new ResizeObserver(() => requestAnimationFrame(fitGraphicText));
  document.querySelectorAll(".float-card, .metric-grid div, .ring-label, .breakdown-list li, .pipeline-step, .category-card li").forEach((el) => {
    fitObserver.observe(el);
  });
} else {
  window.addEventListener("resize", fitGraphicText);
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
    detailList.replaceChildren(...content.items.map((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      return listItem;
    }));
  });
});

function randomLinePoints(width = 330, height = 120, points = 11) {
  const insetX = width > 400 ? 24 : 8;
  const xGap = (width - insetX * 2) / (points - 1);
  return Array.from({ length: points }, (_, index) => {
    const trend = height * 0.74 - index * ((height * 0.48) / (points - 1));
    const wave = Math.sin(index * 1.35) * (height * 0.07);
    const jitter = (Math.random() - 0.5) * (height * 0.16);
    const y = Math.max(height * 0.14, Math.min(height * 0.82, trend + wave + jitter));
    return `${Math.round(insetX + index * xGap)},${Math.round(y)}`;
  }).join(" ");
}

function formatPercent(value) {
  return `${value > 0 ? "+" : ""}${value}%`;
}

function setText(selector, value) {
  document.querySelector(selector)?.replaceChildren(document.createTextNode(value));
}

function setMetric(key, value, delta) {
  setText(`[data-sample-metric="${key}"]`, value);
  setText(`[data-sample-delta="${key}"]`, formatPercent(delta));
}

function randomInt(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

const insightSets = [
  [
    { signal: "+22%", tone: "up", copy: "Attendance rises when reminders go out two days before a program." },
    { signal: "3", tone: "hold", copy: "Three funders account for most restricted grant reporting." },
    { signal: "-11%", tone: "down", copy: "Late intake forms dropped after simplifying required fields." }
  ],
  [
    { signal: "+18%", tone: "up", copy: "Follow-up calls convert faster when client records are cleaned first." },
    { signal: "4", tone: "hold", copy: "Four program categories drive most monthly dashboard questions." },
    { signal: "-9%", tone: "down", copy: "Duplicate contact rows fell after standardizing intake labels." }
  ],
  [
    { signal: "+26%", tone: "up", copy: "Donation response improves when outreach is grouped by audience." },
    { signal: "2", tone: "hold", copy: "Two reports cover most board and grant update needs." },
    { signal: "-14%", tone: "down", copy: "Manual spreadsheet checks dropped after validation rules were added." }
  ]
];

function refreshDashboardData() {
  const served = randomInt(1120, 1680);
  const completed = randomInt(720, 980);
  const satisfaction = randomInt(90, 98);
  const funding = randomInt(27, 46);

  setMetric("served", new Intl.NumberFormat("en-US").format(served), randomInt(9, 22));
  setMetric("completed", new Intl.NumberFormat("en-US").format(completed), randomInt(6, 17));
  setMetric("satisfaction", `${satisfaction}%`, randomInt(3, 8));
  setMetric("funding", `$${funding}k`, randomInt(10, 24));

  const programs = randomInt(54, 64);
  const operations = randomInt(18, 25);
  const fundraising = randomInt(9, 15);
  const other = Math.max(4, 100 - programs - operations - fundraising);
  const mission = programs + fundraising;
  const mix = { programs, operations, fundraising, other };
  const stops = [
    programs,
    programs + operations,
    programs + operations + fundraising
  ];

  document.querySelector("[data-sample-ring]")?.style.setProperty(
    "background",
    `conic-gradient(var(--blue) 0 ${programs}%, #51b8d6 ${programs}% ${stops[1]}%, #56bd8f ${stops[1]}% ${stops[2]}%, #9cb4dc ${stops[2]}% 100%)`
  );
  document.querySelector('[data-sample-metric="mission"]')?.replaceChildren(
    document.createTextNode(String(mission)),
    Object.assign(document.createElement("span"), { textContent: "%" })
  );

  Object.entries(mix).forEach(([key, value]) => {
    setText(`[data-breakdown-value="${key}"]`, `${value}%`);
  });

  document.querySelectorAll(".mix-bars i").forEach((bar, index) => {
    const value = [programs, operations, fundraising, other][index];
    bar.style.setProperty("--h", `${Math.max(8, value)}%`);
  });

  const requests = randomInt(38, 58);
  const received = randomInt(Math.round(requests * 0.62), Math.round(requests * 0.78));
  const draft = randomInt(Math.round(received * 0.45), Math.round(received * 0.64));
  const review = randomInt(Math.max(6, Math.round(draft * 0.35)), Math.round(draft * 0.58));
  const pipeline = { requests, received, draft, review };

  Object.entries(pipeline).forEach(([key, value]) => {
    setText(`[data-pipeline-value="${key}"]`, String(value));
  });

  document.querySelectorAll(".pipeline-step").forEach((step) => {
    const value = Number(step.querySelector("[data-pipeline-value]")?.textContent || 0);
    const width = Math.max(16, Math.round((value / requests) * 92));
    step.querySelector(".stage-meter i")?.style.setProperty("--w", `${width}%`);
  });

  const insights = insightSets[randomInt(0, insightSets.length - 1)];
  insights.forEach((item, index) => {
    const signal = document.querySelector(`[data-insight-signal="${index}"]`);
    const copy = document.querySelector(`[data-insight-copy="${index}"]`);
    signal.textContent = item.signal;
    signal.className = `signal ${item.tone}`;
    copy.textContent = item.copy;
  });
}

function refreshCharts() {
  document.querySelectorAll(".dynamic-line").forEach((line) => {
    const box = line.ownerSVGElement?.viewBox?.baseVal;
    const width = box?.width || 330;
    const height = box?.height || 120;
    const points = randomLinePoints(width, height);
    line.setAttribute("points", points);

    const fill = line.ownerSVGElement?.querySelector(".chart-fill");
    if (fill) {
      const coords = points.split(" ");
      const firstX = coords[0].split(",")[0];
      const lastX = coords.at(-1).split(",")[0];
      const baseline = Math.round(height - (height > 150 ? 24 : 12));
      fill.setAttribute("points", `${points} ${lastX},${baseline} ${firstX},${baseline}`);
    }

    const coords = points.split(" ").map((point) => point.split(",").map(Number));
    line.ownerSVGElement?.querySelectorAll(".chart-dots circle").forEach((dot, index) => {
      const [x, y] = coords[[3, 7, 10][index] || coords.length - 1];
      dot.setAttribute("cx", String(x));
      dot.setAttribute("cy", String(y));
    });

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

  refreshDashboardData();
  fitGraphicText();
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
