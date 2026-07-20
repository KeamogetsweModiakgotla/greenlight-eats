/* ============================================================
    EDIT PRICES HERE 
   "q"  = quarter bread price, "h" = half bread price
   "qa" = quarter + atchar,    "ha" = half + atchar
   ============================================================ */
const KOTAS = [
  { id: "original", name: "Original",       fill: "French, cheese & chips",          q: 20, qa: 21, h: 21, ha: 22 },
  { id: "vienna",   name: "Vienna",         fill: "French, cheese, chips & vienna",  q: 24, qa: 25, h: 25, ha: 26 },
  { id: "burger",   name: "Burger / Patty", fill: "French, cheese, chips & burger",  q: 29, qa: 30, h: 30, ha: 31 },
  { id: "russian",  name: "Russian",        fill: "French, cheese, chips & russian", q: 39, qa: 40, h: 40, ha: 41 },
];

                       
const EXTRAS = [
  { id: "sauce",    name: "Sauce",         price: 1,  topping: true,  side: false },
  { id: "dcheese",  name: "Double cheese", price: 2,  topping: true,  side: false },
  { id: "egg",      name: "Egg",           price: 4,  topping: true,  side: false },
  { id: "xcheese",  name: "Extra cheese",  price: 4,  topping: true,  side: false },
  { id: "vienna-x", name: "Vienna",        price: 7,  topping: true,  side: false },
  { id: "burger-x", name: "Burger patty",  price: 10, topping: true,  side: false },
  { id: "xchips",   name: "Extra chips",   price: 10, topping: true,  side: false },
  { id: "hruss",    name: "Half russian",  price: 18, topping: true,  side: true  },
  { id: "fruss",    name: "Full russian",  price: 30, topping: false,  side: true  },
  { id: "Mchips",   name: "Medium chips",   price: 35, topping: false, side: true  },
];

/* Ingredients a customer may leave OUT (free).          */
const REMOVABLE = ["French", "Cheese"];

/* Phone numbers (no spaces, SA format). Orders number is used
   for the WhatsApp button. */
const ORDERS_NUMBER   = "27747615967";  // 074 761 5967
const DELIVERY_NUMBER = "27737500541";  // 073 750 0541

/* Card machine minimum (Rands) */
const CARD_MINIMUM = 50;
