const cart = []; // { kotaId?|extraId?, label, toppingsText?, noText?, price, qty }
const R = n => "R" + n;
const TOPPINGS = EXTRAS.filter(x => x.topping);
const SIDES = EXTRAS.filter(x => x.side);

/* ---- Kota cards ---- */
const kotaList = document.getElementById("kota-list");
const kotaUI = {};

KOTAS.forEach(k => {
  const atcharCost = k.qa - k.q;
  const card = document.createElement("div");
  card.className = "kota";

  const toppingRows = TOPPINGS.map(x => `
    <button type="button" class="top-row" data-extra="${x.id}" aria-pressed="false">
      <span class="top-check" aria-hidden="true"></span>
      <span class="name">${x.name}</span>
      <span class="p">+${R(x.price)}</span>
    </button>`).join("");

  const noBubbles = REMOVABLE.map(ing => `
    <button type="button" class="no-bubble" data-no="${ing}" aria-pressed="false">No ${ing.toLowerCase()}</button>`).join("");

  card.innerHTML = `
    <div class="kota-head">
      <h3>${k.name}</h3>
      <span class="qty-pill"><span class="count">0</span> in order</span>
    </div>
    <p class="fill">${k.fill}</p>
    <div class="size-row" role="group" aria-label="Choose bread size">
      <button type="button" class="size-card" data-size="q" aria-pressed="true">
        <span class="size-left"><span class="dot"></span><span class="size-name">Quarter</span></span>
        <span class="size-price">${R(k.q)}</span>
      </button>
      <button type="button" class="size-card" data-size="h" aria-pressed="false">
        <span class="size-left"><span class="dot"></span><span class="size-name">Half</span></span>
        <span class="size-price">${R(k.h)}</span>
      </button>
    </div>
    <div class="atchar-row">
      <span class="lbl">Add atchar <small>+R${atcharCost}</small></span>
      <span class="switch">
        <input type="checkbox" data-atchar aria-label="Add atchar for R${atcharCost} more">
        <span class="track"></span><span class="knob"></span>
      </span>
    </div>
    <div class="no-row">
      <span class="no-lbl">Leave out:</span>
      ${noBubbles}
    </div>
    <button type="button" class="top-toggle" aria-expanded="false">
      <span>Add toppings <span class="picked"></span></span>
      <svg class="arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
    </button>
    <div class="toppings">${toppingRows}</div>
    <button type="button" class="add-btn"></button>
    <div class="built-list">
      <div class="built-title">Your ${k.name} kotas</div>
      <div class="built-lines"></div>
    </div>`;

  let size = "q";
  const toppings = new Set(); // extraIds — max one of each
  const noes = new Set(); // removed ingredients
  const atcharEl = card.querySelector("[data-atchar]");
  const sizeCards = card.querySelectorAll(".size-card");
  const addBtn = card.querySelector(".add-btn");
  const priceEls = { q: sizeCards[0].querySelector(".size-price"), h: sizeCards[1].querySelector(".size-price") };
  const pill = card.querySelector(".qty-pill");
  const topToggle = card.querySelector(".top-toggle");
  const topPanel = card.querySelector(".toppings");
  const pickedEl = topToggle.querySelector(".picked");
  kotaUI[k.id] = {
    pill, count: pill.querySelector(".count"),
    builtList: card.querySelector(".built-list"),
    builtLines: card.querySelector(".built-lines")
  };

  const toppingsTotal = () => TOPPINGS.reduce((a, x) => a + (toppings.has(x.id) ? x.price : 0), 0);
  const currentPrice = () => k[size + (atcharEl.checked ? "a" : "")] + toppingsTotal();
  const toppingsText = () => TOPPINGS
    .filter(x => toppings.has(x.id))
    .map(x => x.name.toLowerCase())
    .join(", ");
  const noText = () => [...noes].map(n => "no " + n.toLowerCase()).join(", ");

  const refresh = () => {
    priceEls.q.textContent = R(atcharEl.checked ? k.qa : k.q);
    priceEls.h.textContent = R(atcharEl.checked ? k.ha : k.h);
    const tt = toppingsText();
    pickedEl.textContent = tt ? "· " + tt : "";
    const sizeName = size === "q" ? "quarter" : "half";
    addBtn.innerHTML = `Add ${sizeName}${atcharEl.checked ? " + atchar" : ""}${tt ? " + toppings" : ""} &nbsp;&middot;&nbsp; <span class="p">${R(currentPrice())}</span>`;
  };

  sizeCards.forEach(b => b.addEventListener("click", () => {
    size = b.dataset.size;
    sizeCards.forEach(x => x.setAttribute("aria-pressed", x === b));
    refresh();
  }));
  atcharEl.addEventListener("change", refresh);

  card.querySelectorAll(".no-bubble").forEach(b => {
    b.addEventListener("click", () => {
      const ing = b.dataset.no;
      const on = !noes.has(ing);
      on ? noes.add(ing) : noes.delete(ing);
      b.setAttribute("aria-pressed", on);
    });
  });

  topToggle.addEventListener("click", () => {
    const open = topPanel.classList.toggle("open");
    topToggle.setAttribute("aria-expanded", open);
  });

  card.querySelectorAll(".top-row").forEach(row => {
    const id = row.dataset.extra;
    row.addEventListener("click", () => {
      /* one of each topping only , tap toggles it on or off */
      if (toppings.has(id)) toppings.delete(id);
      else toppings.add(id);
      row.setAttribute("aria-pressed", toppings.has(id));
      refresh();
    });
  });

  addBtn.addEventListener("click", () => {
    const label = `${size === "q" ? "Quarter" : "Half"} ${k.name}${atcharEl.checked ? " + atchar" : ""}`;
    addToCart({ kotaId: k.id, label, toppingsText: toppingsText(), noText: noText(), price: currentPrice() });
    /* reset build for the next kota */
    toppings.clear();
    noes.clear();
    card.querySelectorAll(".top-row").forEach(row => row.setAttribute("aria-pressed", "false"));
    card.querySelectorAll(".no-bubble").forEach(b => b.setAttribute("aria-pressed", "false"));
    topPanel.classList.remove("open");
    topToggle.setAttribute("aria-expanded", "false");
    refresh();
  });

  refresh();
  kotaList.appendChild(card);
});

/* ---- Standalone sides ---- */
const extrasList = document.getElementById("extras-list");
const extraUI = {};

SIDES.forEach(x => {
  const row = document.createElement("div");
  row.className = "extra-row";
  row.innerHTML = `
    <span class="name">${x.name}</span>
    <span class="p">${R(x.price)}</span>
    <span class="stepper">
      <button type="button" class="minus" aria-label="Remove one ${x.name}">&minus;</button>
      <span class="count"></span>
      <button type="button" class="plus" aria-label="Add ${x.name}">+</button>
    </span>`;
  const stepper = row.querySelector(".stepper");
  extraUI[x.id] = { stepper, count: stepper.querySelector(".count") };
  stepper.querySelector(".plus").addEventListener("click", () => addToCart({ extraId: x.id, label: x.name, price: x.price }));
  stepper.querySelector(".minus").addEventListener("click", () => removeExtra(x.id));
  extrasList.appendChild(row);
});

/* ---- Cart logic ---- */
function addToCart(item) {
  const existing = cart.find(i =>
    i.label === item.label &&
    i.price === item.price &&
    (i.toppingsText || "") === (item.toppingsText || "") &&
    (i.noText || "") === (item.noText || "")
  );
  existing ? existing.qty++ : cart.push({ ...item, qty: 1 });
  const bits = [item.label, item.noText, item.toppingsText].filter(Boolean).join(", ");
  showToast(bits + " added");
  renderCart();
}
function removeAt(idx) {
  cart[idx].qty > 1 ? cart[idx].qty-- : cart.splice(idx, 1);
  renderCart();
}
function removeExtra(extraId) {
  const i = cart.findIndex(c => c.extraId === extraId);
  if (i > -1) removeAt(i);
}

let toastTimer;
function showToast(text) {
  const toast = document.getElementById("toast");
  document.getElementById("toast-text").textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1700);
}

const bar = document.getElementById("cart-bar");
const slipLines = document.getElementById("slip-lines");
const totals = () => cart.reduce((a, i) => ({ n: a.n + i.qty, r: a.r + i.qty * i.price }), { n: 0, r: 0 });

function detailText(i, sep = " · ") {
  const bits = [];
  if (i.noText) bits.push(i.noText);
  if (i.toppingsText) bits.push("with " + i.toppingsText);
  return bits.join(sep);
}

function renderCart() {
  const t = totals();
  document.getElementById("cart-count").textContent = t.n;
  document.getElementById("cart-total").textContent = R(t.r);
  bar.classList.toggle("show", t.n > 0);

  /* per-kota pill + breakdown of exactly what was built */
  KOTAS.forEach(k => {
    const items = cart.map((i, idx) => ({ ...i, idx })).filter(i => i.kotaId === k.id);
    const n = items.reduce((a, i) => a + i.qty, 0);
    const ui = kotaUI[k.id];
    ui.count.textContent = n;
    ui.pill.classList.toggle("on", n > 0);
    ui.builtList.classList.toggle("on", n > 0);
    ui.builtLines.innerHTML = "";
    items.forEach(i => {
      const d = detailText(i);
      const line = document.createElement("div");
      line.className = "built-line";
      line.innerHTML = `
        <span class="bqty">${i.qty}x</span>
        <span class="bwhat">${i.label.replace(" " + k.name, "")}${d ? `<small>${d}</small>` : ""}</span>
        <span class="bamt">${R(i.qty * i.price)}</span>
        <button type="button" class="brm" aria-label="Remove one">&minus;</button>`;
      line.querySelector(".brm").addEventListener("click", () => removeAt(i.idx));
      ui.builtLines.appendChild(line);
    });
  });

  /* per-side steppers */
  SIDES.forEach(x => {
    const n = cart.filter(i => i.extraId === x.id).reduce((a, i) => a + i.qty, 0);
    extraUI[x.id].count.textContent = n > 0 ? n : "";
    extraUI[x.id].stepper.classList.toggle("has", n > 0);
  });

  /* slip */
  slipLines.innerHTML = "";
  if (!cart.length) slipLines.innerHTML = `<p class="empty-note">Nothing here yet — add a kota!</p>`;
  cart.forEach((i, idx) => {
    const line = document.createElement("div");
    line.className = "slip-line";
    const no = i.noText ? `<small class="no">${i.noText}</small>` : "";
    const tt = i.toppingsText ? `<small>with ${i.toppingsText}</small>` : "";
    line.innerHTML = `
      <span class="qty">${i.qty}x</span>
      <span class="what">${i.label}${no}${tt}</span>
      <span class="amt">${R(i.qty * i.price)}</span>
      <button class="rm" aria-label="Remove one ${i.label}">&minus;</button>`;
    line.querySelector(".rm").addEventListener("click", () => removeAt(idx));
    slipLines.appendChild(line);
  });
  document.getElementById("slip-total").textContent = R(t.r);
  document.getElementById("slip-paynote").textContent =
    t.n === 0 ? "" :
    t.r >= CARD_MINIMUM ? "You can pay cash or card 💳" : `Cash only below R${CARD_MINIMUM} (card min)`;

  const msgLines = cart.map(i => {
    const d = detailText(i, "; ");
    return `${i.qty}x ${i.label}${d ? ` (${d})` : ""} — ${R(i.qty * i.price)}`;
  });
  const msg = `Hi Greenlight Eats! I'd like to order:\n\n${msgLines.join("\n")}\n\nTotal: ${R(t.r)}`;
  document.getElementById("wa-btn").href = `https://wa.me/${ORDERS_NUMBER}?text=${encodeURIComponent(msg)}`;
}

/* ---- Overlay ---- */
const overlay = document.getElementById("overlay");
document.getElementById("view-cart").addEventListener("click", () => overlay.classList.add("open"));
document.getElementById("keep-btn").addEventListener("click", () => overlay.classList.remove("open"));
overlay.addEventListener("click", e => { if (e.target === overlay) overlay.classList.remove("open"); });

/* ---- Contact links & card minimum ---- */
document.getElementById("orders-link").href = "tel:+" + ORDERS_NUMBER;
document.getElementById("delivery-link").href = "tel:+" + DELIVERY_NUMBER;
document.getElementById("chip-min").textContent = CARD_MINIMUM;
document.getElementById("note-min").textContent = CARD_MINIMUM;

renderCart();