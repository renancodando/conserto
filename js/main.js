(() => {
  const B = window.BRAND || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Whitelabel: aplica marca ---------- */
  const root = document.documentElement;
  Object.entries(B.colors || {}).forEach(([k, v]) => root.style.setProperty(`--${k}`, v));

  $$("[data-brand]").forEach(el => {
    const v = B[el.dataset.brand];
    if (v !== undefined) el.textContent = v;
  });
  const years = new Date().getFullYear() - (B.founded || 2014);
  $$("[data-brand-years]").forEach(el => (el.textContent = `${years}+`));
  $$("[data-tel]").forEach(a => (a.href = `tel:+${(B.whatsapp || "").replace(/\D/g, "")}`));
  $$("[data-mail]").forEach(a => (a.href = `mailto:${B.email}`));
  document.title = `${B.name} ${B.suffix} — ${B.tagline}`;
  $("#year").textContent = new Date().getFullYear();

  const waLink = msg =>
    `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(msg || `Olá, ${B.name} ${B.suffix}! Gostaria de atendimento.`)}`;
  $$("[data-whatsapp]").forEach(a => {
    a.href = waLink(a.dataset.msg);
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* ---------- Header / menu ---------- */
  const header = $(".header");
  const nav = $(".nav");
  const toggle = $(".nav__toggle");
  addEventListener("scroll", () => header.classList.toggle("is-scrolled", scrollY > 20), { passive: true });
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  $$(".nav__links a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  /* ---------- Produtos ---------- */
  const products = [
    { name: "iPhone 15", spec: "128 GB · Preto", type: "novo", price: 4999, old: 5499, c1: "#3a3f4b", c2: "#7C6CFF" },
    { name: "Galaxy S24", spec: "256 GB · Violeta", type: "novo", price: 4299, old: 4799, c1: "#6b5bd6", c2: "#3DDBB4" },
    { name: "iPhone 13", spec: "128 GB · Azul · Bateria 91%", type: "seminovo", price: 2699, old: 3199, c1: "#2f5d8a", c2: "#5ab0ff" },
    { name: "Moto Edge 50", spec: "256 GB · Verde", type: "novo", price: 2299, old: 2599, c1: "#2d6b5c", c2: "#3DDBB4" },
    { name: "Redmi Note 13", spec: "256 GB · Grafite", type: "novo", price: 1499, old: 1699, c1: "#2b2f3a", c2: "#FFB547" },
    { name: "Galaxy S22", spec: "128 GB · Branco · Grade A", type: "seminovo", price: 1899, old: 2399, c1: "#c9cdd8", c2: "#7C6CFF" },
    { name: "iPhone 12", spec: "64 GB · Roxo · Bateria 88%", type: "seminovo", price: 1999, old: 2499, c1: "#8b7ad8", c2: "#ff8fb1" },
    { name: "Galaxy A55", spec: "128 GB · Azul-gelo", type: "novo", price: 1899, old: 2199, c1: "#9fc3e6", c2: "#3DDBB4" }
  ];
  const brl = n => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  $("#products").innerHTML = products.map(p => `
    <article class="product glass" data-type="${p.type}" style="--c1:${p.c1};--c2:${p.c2}">
      <div class="product__stage">
        <span class="product__badge product__badge--${p.type}">${p.type}</span>
        <div class="product__device"></div>
      </div>
      <div class="product__body">
        <h3>${p.name}</h3>
        <span class="product__spec">${p.spec}</span>
        <div class="product__price"><b>${brl(p.price)}</b><s>${brl(p.old)}</s></div>
        <span class="product__inst">ou 10x de ${brl(Math.ceil(p.price / 10))} sem juros</span>
        <a class="btn btn--glass" target="_blank" rel="noopener"
           href="${waLink(`Olá! Tenho interesse no ${p.name} (${p.spec}) por ${brl(p.price)}.`)}">Tenho interesse</a>
      </div>
    </article>`).join("");

  $$(".tab").forEach(tab => tab.addEventListener("click", () => {
    $$(".tab").forEach(t => t.classList.toggle("is-active", t === tab));
    const f = tab.dataset.filter;
    $$(".product").forEach(p => p.classList.toggle("is-hidden", f !== "all" && p.dataset.type !== f));
  }));

  /* ---------- Orçamento ---------- */
  const table = { // [valor base, prazo]
    tela: [289, "1 a 2 horas"], bateria: [159, "40 minutos"], carga: [119, "1 hora"],
    liquido: [199, "24 a 48 horas"], camera: [179, "1 a 2 horas"], outro: [null, "após diagnóstico"]
  };
  const factor = { apple: 1.6, samsung: 1.25, motorola: 1, xiaomi: 1, outra: 1 };
  const form = $("#quoteForm");
  const calc = () => {
    const d = new FormData(form);
    const [base, time] = table[d.get("issue")];
    const v = base && Math.round(base * factor[d.get("brand")] / 10) * 10 - 1;
    $("#quoteValue").textContent = v ? `a partir de ${brl(v)}` : "Diagnóstico grátis";
    $("#quoteTime").textContent = `Prazo médio: ${time}`;
    return { d, v, time };
  };
  form.addEventListener("input", calc);
  calc();
  form.addEventListener("submit", e => {
    e.preventDefault();
    const model = form.model;
    if (!model.value.trim()) { model.classList.add("is-invalid"); model.focus(); return; }
    model.classList.remove("is-invalid");
    const { d, v } = calc();
    const brandLabel = form.brand.selectedOptions[0].textContent;
    const issueLabel = $(`input[name=issue][value=${d.get("issue")}]`).nextElementSibling.textContent;
    const msg = `Olá! Gostaria de um orçamento.\nAparelho: ${brandLabel} — ${model.value.trim()}\nProblema: ${issueLabel}` +
      (v ? `\nEstimativa do site: a partir de ${brl(v)}` : "");
    window.open(waLink(msg), "_blank", "noopener");
  });

  /* ---------- Contador ---------- */
  $$("[data-count]").forEach(el => {
    const end = +el.dataset.count;
    if (reduceMotion) { el.textContent = end.toLocaleString("pt-BR") + "+"; return; }
    const t0 = performance.now(), dur = 1800;
    const step = t => {
      const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(end * e).toLocaleString("pt-BR") + (k === 1 ? "+" : "");
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  /* ---------- Revelação ao rolar ---------- */
  const revealEls = $$(".section__head, .services, .steps, .products, .tradein, .quote, .about__visual, .about__copy, .reviews, .faq__list, .contact, .brands__strip");
  if (!reduceMotion && "IntersectionObserver" in window) {
    revealEls.forEach(el => el.classList.add("reveal"));
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
    }), { threshold: .12 });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Spatial: parallax do hero e tilt dos cards ---------- */
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduceMotion || !finePointer) return;

  const sceneWrap = $("[data-tilt-scene]");
  const scene = $(".scene", sceneWrap);
  const layers = $$("[data-depth]", sceneWrap);
  sceneWrap.addEventListener("pointermove", e => {
    const r = sceneWrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    scene.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 10}deg)`;
    layers.forEach(l => {
      const d = +l.dataset.depth;
      if (d) l.style.transform = `translate3d(${x * d * .4}px, ${y * d * .4}px, ${d}px)`;
    });
  });
  sceneWrap.addEventListener("pointerleave", () => {
    scene.style.transform = "";
    layers.forEach(l => (l.style.transform = ""));
  });

  $$("[data-tilt]").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.transform = `perspective(900px) rotateX(${(.5 - y) * 8}deg) rotateY(${(x - .5) * 10}deg) translateZ(10px)`;
      card.style.setProperty("--mx", `${x * 100}%`);
      card.style.setProperty("--my", `${y * 100}%`);
    });
    card.addEventListener("pointerleave", () => (card.style.transform = ""));
  });
})();
