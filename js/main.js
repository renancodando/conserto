(() => {
  const B = window.BRAND || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const brl = n => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

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
  const toggle = $(".nav__toggle");
  addEventListener("scroll", () => header.classList.toggle("is-scrolled", scrollY > 20), { passive: true });
  toggle.addEventListener("click", () => toggle.setAttribute("aria-expanded", header.classList.toggle("is-open")));
  const navLinks = $$(".nav__links a");
  navLinks.forEach(a => a.addEventListener("click", () => {
    header.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }));
  // Link ativo conforme a seção visível
  const sections = navLinks.map(a => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle("is-active", a.getAttribute("href") === `#${en.target.id}`));
    }), { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(s => spy.observe(s));
  }

  /* ---------- Serviços ---------- */
  const services = {
    tela:        ["Troca de tela", "Telas originais e premium, com película de brinde e calibração do touch.", 189, "1 a 2 horas"],
    bateria:     ["Troca de bateria", "Bateria nova com certificação, teste de ciclos e saúde em 100%.", 129, "40 minutos"],
    conector:    ["Reparo de conector", "Celular não carrega? Limpeza ou troca do conector com teste completo.", 99, "1 hora"],
    camera:      ["Reparo de câmera", "Câmera embaçada, tremendo ou sem foco: trocamos módulo e vidro da lente.", 119, "1 a 2 horas"],
    aquecimento: ["Superaquecimento", "Diagnóstico de placa, troca de pasta térmica e correção de consumo anormal.", 149, "24 horas"],
    manutencao:  ["Manutenção geral", "Limpeza interna, atualização de sistema, backup e revisão completa.", 79, "2 horas"]
  };
  const showService = key => {
    const [t, d, p, time] = services[key];
    $("#sdTitle").textContent = t;
    $("#sdText").textContent = d;
    $("#sdPrice").textContent = brl(p);
    $("#sdTime").textContent = `Prazo médio: ${time}`;
    $$(".tile").forEach(b => {
      const on = b.dataset.service === key;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on);
    });
  };
  $$(".tile").forEach(b => b.addEventListener("click", () => showService(b.dataset.service)));
  showService("tela");

  /* ---------- Produtos ---------- */
  const products = [
    { name: "iPhone 15", spec: "128 GB · Preto", type: "novo", price: 4999, old: 5499, c1: "#3a3a40" },
    { name: "Galaxy S24", spec: "256 GB · Grafite", type: "novo", price: 4299, old: 4799, c1: "#4a4a52" },
    { name: "iPhone 13", spec: "128 GB · Estelar · Bateria 91%", type: "seminovo", price: 2699, old: 3199, c1: "#cfc8bd" },
    { name: "Moto Edge 50", spec: "256 GB · Verde", type: "novo", price: 2299, old: 2599, c1: "#2f5a4e" },
    { name: "Redmi Note 13", spec: "256 GB · Laranja", type: "novo", price: 1499, old: 1699, c1: "#c8541a" },
    { name: "Galaxy S22", spec: "128 GB · Branco · Grade A", type: "seminovo", price: 1899, old: 2399, c1: "#d9d9de" },
    { name: "iPhone 12", spec: "64 GB · Azul · Bateria 88%", type: "seminovo", price: 1999, old: 2499, c1: "#2c4a6e" },
    { name: "Galaxy A55", spec: "128 GB · Azul-gelo", type: "novo", price: 1899, old: 2199, c1: "#9fb6cc" }
  ];
  $("#products").innerHTML = products.map(p => `
    <article class="product glass" data-type="${p.type}" style="--c1:${p.c1}">
      <div class="product__stage">
        <span class="product__badge product__badge--${p.type}">${p.type}</span>
        <div class="product__device"></div>
      </div>
      <div class="product__body">
        <h3>${p.name}</h3>
        <span class="product__spec">${p.spec}</span>
        <div class="product__price"><b>${brl(p.price)}</b><s>${brl(p.old)}</s></div>
        <span class="product__inst">ou 10x de ${brl(Math.ceil(p.price / 10))} sem juros</span>
        <a class="btn btn--ghost" target="_blank" rel="noopener"
           href="${waLink(`Olá! Tenho interesse no ${p.name} (${p.spec}) por ${brl(p.price)}.`)}">Tenho interesse</a>
      </div>
    </article>`).join("");

  $$(".tab").forEach(tab => tab.addEventListener("click", () => {
    $$(".tab").forEach(t => t.classList.toggle("is-active", t === tab));
    const f = tab.dataset.filter;
    $$(".product").forEach(p => p.classList.toggle("is-hidden", f !== "all" && p.dataset.type !== f));
  }));

  /* ---------- Orçamento ---------- */
  const table = {
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
    return { d, v };
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
    const fmt = n => n.toLocaleString("pt-BR");
    if (reduceMotion) { el.textContent = fmt(end); return; }
    const t0 = performance.now(), dur = 1800;
    const step = t => {
      const k = Math.min(1, (t - t0) / dur);
      el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  /* ---------- Revelação ao rolar ---------- */
  const revealEls = $$(".services, .how, .section__head, .products, .tradein, .quote, .about__visual, .about__copy, .reviews, .faq__list, .contact");
  if (!reduceMotion && "IntersectionObserver" in window) {
    revealEls.forEach(el => el.classList.add("reveal"));
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
    }), { threshold: .1 });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Spatial: parallax da cena e tilt ---------- */
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reduceMotion || !finePointer) return;

  const hero = $(".hero");
  const scene = $(".scene");
  const layers = $$("[data-depth]", scene);
  hero.addEventListener("pointermove", e => {
    const r = hero.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    scene.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
    layers.forEach(l => {
      const d = +l.dataset.depth;
      l.style.transform = `translate(${x * d * .5}px, ${y * d * .5}px)`;
    });
  });
  hero.addEventListener("pointerleave", () => {
    scene.style.transform = "";
    layers.forEach(l => (l.style.transform = ""));
  });

  $$("[data-tilt]").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.transform = `perspective(900px) rotateX(${(.5 - y) * 8}deg) rotateY(${(x - .5) * 10}deg)`;
    });
    card.addEventListener("pointerleave", () => (card.style.transform = ""));
  });
})();
