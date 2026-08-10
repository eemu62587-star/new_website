/* ==========================================================================
   GOLDEN PIZZA CAFE — APP LOGIC
   ========================================================================== */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     STATE
     --------------------------------------------------------------------- */
  let activeCategory = "ALL";
  let searchTerm = "";
  const uiState = {};       // per-item transient UI state: { [itemId]: { size, qty } }
  let cart = loadCart();    // [{ lineId, itemId, name, category, icon, sizeLabel, price, qty }]

  const checkout = {
    customer: { name: "", mobile: "", address: "", area: "", landmark: "", pincode: "" },
    distanceKm: null,
    distanceSource: null,   // "gps" | "manual"
    paymentMethod: null,
  };

  /* ---------------------------------------------------------------------
     HELPERS
     --------------------------------------------------------------------- */
  function rupee(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }

  function loadCart() {
    try {
      const raw = localStorage.getItem("gpc_cart");
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }
  function saveCart() {
    try { localStorage.setItem("gpc_cart", JSON.stringify(cart)); } catch (e) { /* ignore */ }
  }

  function itemById(id) { return MENU_ITEMS.find(function (i) { return i.id === id; }); }

  function getUIState(item) {
    if (!uiState[item.id]) {
      uiState[item.id] = {
        size: item.sizes ? item.sizes[0].label : null,
        qty: 1,
      };
    }
    return uiState[item.id];
  }

  function currentPrice(item, sizeLabel) {
    if (item.sizes) {
      const s = item.sizes.find(function (x) { return x.label === sizeLabel; });
      return s ? s.price : item.sizes[0].price;
    }
    return item.price;
  }

  function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  function haversineKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function deliveryChargeFor(km) {
    if (km === null || km === undefined || isNaN(km)) return 0;
    if (km <= CAFE_INFO.freeDeliveryKm) return 0;
    return Math.round((km - CAFE_INFO.freeDeliveryKm) * CAFE_INFO.perKmCharge);
  }

  /* ---------------------------------------------------------------------
     RENDER: CATEGORY PILLS
     --------------------------------------------------------------------- */
  function renderCategories() {
    const wrap = document.getElementById("categoryScroll");
    wrap.innerHTML = CATEGORIES.map(function (cat) {
      const active = cat === activeCategory ? " active" : "";
      return '<button class="stamp-pill' + active + '" data-cat="' + cat + '">' + cat + "</button>";
    }).join("");
    wrap.querySelectorAll(".stamp-pill").forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeCategory = btn.getAttribute("data-cat");
        renderCategories();
        renderMenu();
      });
    });
  }

  /* ---------------------------------------------------------------------
     RENDER: MENU GRID
     --------------------------------------------------------------------- */
  function filteredItems() {
    const term = searchTerm.trim().toLowerCase();
    return MENU_ITEMS.filter(function (item) {
      const catOk = activeCategory === "ALL" || item.category === activeCategory;
      const searchOk = !term ||
        item.name.toLowerCase().includes(term) ||
        item.desc.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term);
      return catOk && searchOk;
    });
  }

  function itemCardHTML(item) {
    const st = getUIState(item);
    const price = currentPrice(item, st.size);

    let sizeHTML = "";
    if (item.sizes) {
      sizeHTML = '<div class="size-select">' + item.sizes.map(function (s) {
        const active = s.label === st.size ? " active" : "";
        return '<button class="size-chip' + active + '" data-action="size" data-item="' + item.id +
          '" data-size="' + s.label + '">' + s.label + " · " + rupee(s.price) + "</button>";
      }).join("") + "</div>";
    }

    return (
      '<div class="item-card" data-item-card="' + item.id + '">' +
        '<div class="item-top">' +
          '<div class="item-icon">' + item.icon + '</div>' +
          '<div>' +
            '<p class="item-name">' + item.name + '</p>' +
            '<p class="item-desc">' + item.desc + '</p>' +
          '</div>' +
        '</div>' +
        sizeHTML +
        '<div class="item-price-row">' + rupee(price) + '</div>' +
        '<div class="item-bottom">' +
          '<div class="qty-stepper">' +
            '<button data-action="qtyminus" data-item="' + item.id + '" aria-label="Decrease quantity">−</button>' +
            '<span>' + st.qty + '</span>' +
            '<button data-action="qtyplus" data-item="' + item.id + '" aria-label="Increase quantity">+</button>' +
          '</div>' +
          '<button class="add-btn" data-action="add" data-item="' + item.id + '">ADD TO CART</button>' +
        '</div>' +
      '</div>'
    );
  }

  function renderMenu() {
    const grid = document.getElementById("menuGrid");
    const items = filteredItems();
    document.getElementById("resultCount").textContent =
      items.length + (items.length === 1 ? " item" : " items");
    if (!items.length) {
      grid.innerHTML = '<div class="empty-note">No dishes match your search. Try a different keyword or category.</div>';
      return;
    }
    grid.innerHTML = items.map(itemCardHTML).join("");
  }

  // Event delegation for menu grid interactions
  document.getElementById("menuGrid").addEventListener("click", function (e) {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    const itemId = btn.getAttribute("data-item");
    const item = itemById(itemId);
    if (!item) return;
    const st = getUIState(item);

    if (action === "qtyplus") { st.qty = Math.min(st.qty + 1, 20); rerenderCard(item); }
    if (action === "qtyminus") { st.qty = Math.max(st.qty - 1, 1); rerenderCard(item); }
    if (action === "size") { st.size = btn.getAttribute("data-size"); rerenderCard(item); }
    if (action === "add") { addToCart(item); flashAdded(btn); }
  });

  function rerenderCard(item) {
    const card = document.querySelector('[data-item-card="' + item.id + '"]');
    if (card) card.outerHTML = itemCardHTML(item);
  }

  function flashAdded(btn) {
    const original = btn.textContent;
    btn.textContent = "ADDED ✓";
    btn.classList.add("added");
    setTimeout(function () {
      btn.textContent = original;
      btn.classList.remove("added");
    }, 900);
  }

  document.getElementById("searchInput").addEventListener("input", function (e) {
    searchTerm = e.target.value;
    renderMenu();
  });

  /* ---------------------------------------------------------------------
     CART
     --------------------------------------------------------------------- */
  function addToCart(item) {
    const st = getUIState(item);
    const price = currentPrice(item, st.size);
    const lineId = item.id + "__" + (st.size || "std");
    const existing = cart.find(function (l) { return l.lineId === lineId; });
    if (existing) {
      existing.qty += st.qty;
    } else {
      cart.push({
        lineId: lineId,
        itemId: item.id,
        name: item.name,
        category: item.category,
        icon: item.icon,
        sizeLabel: st.size,
        price: price,
        qty: st.qty,
      });
    }
    saveCart();
    renderCartBadges();
    renderCartDrawer();
    showToast(item.name + " added to cart");
  }

  function changeCartQty(lineId, delta) {
    const line = cart.find(function (l) { return l.lineId === lineId; });
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) cart = cart.filter(function (l) { return l.lineId !== lineId; });
    saveCart();
    renderCartBadges();
    renderCartDrawer();
  }

  function removeCartLine(lineId) {
    cart = cart.filter(function (l) { return l.lineId !== lineId; });
    saveCart();
    renderCartBadges();
    renderCartDrawer();
  }

  function cartSubtotal() {
    return cart.reduce(function (sum, l) { return sum + l.price * l.qty; }, 0);
  }
  function cartCount() {
    return cart.reduce(function (sum, l) { return sum + l.qty; }, 0);
  }

  function renderCartBadges() {
    const count = cartCount();
    const countEl = document.getElementById("cartCount");
    if (count > 0) { countEl.style.display = "inline-flex"; countEl.textContent = count; }
    else { countEl.style.display = "none"; }

    const bar = document.getElementById("mobileBar");
    document.getElementById("mbCount").textContent = count;
    document.getElementById("mbTotal").textContent = Math.round(cartSubtotal()).toLocaleString("en-IN");
    if (count > 0) bar.classList.add("show"); else bar.classList.remove("show");
  }

  function cartLineHTML(l) {
    const sizeText = l.sizeLabel ? l.sizeLabel + " · " : "";
    return (
      '<div class="cart-line">' +
        '<div class="cart-line-icon">' + l.icon + '</div>' +
        '<div class="cart-line-info">' +
          '<div class="cart-line-name">' + l.name + '</div>' +
          '<div class="cart-line-meta">' + sizeText + rupee(l.price) + ' × ' + l.qty + '</div>' +
          '<button class="remove-btn" data-remove="' + l.lineId + '">Remove</button>' +
        '</div>' +
        '<div class="cart-line-controls">' +
          '<div class="qty-stepper">' +
            '<button data-cartminus="' + l.lineId + '">−</button>' +
            '<span>' + l.qty + '</span>' +
            '<button data-cartplus="' + l.lineId + '">+</button>' +
          '</div>' +
        '</div>' +
        '<div class="cart-line-total">' + rupee(l.price * l.qty) + '</div>' +
      '</div>'
    );
  }

  function renderCartDrawer() {
    const body = document.getElementById("cartBody");
    if (!cart.length) {
      body.innerHTML = '<div class="empty-note">Your cart is empty.<br>Add something delicious from the menu!</div>';
    } else {
      body.innerHTML = cart.map(cartLineHTML).join("");
    }
    document.getElementById("cartSubtotal").textContent = rupee(cartSubtotal());
    document.getElementById("checkoutBtn").disabled = cart.length === 0;
  }

  document.getElementById("cartBody").addEventListener("click", function (e) {
    const plus = e.target.closest("[data-cartplus]");
    const minus = e.target.closest("[data-cartminus]");
    const remove = e.target.closest("[data-remove]");
    if (plus) changeCartQty(plus.getAttribute("data-cartplus"), 1);
    if (minus) changeCartQty(minus.getAttribute("data-cartminus"), -1);
    if (remove) removeCartLine(remove.getAttribute("data-remove"));
  });

  /* ---------------------------------------------------------------------
     DRAWERS: open / close
     --------------------------------------------------------------------- */
  const overlay = document.getElementById("overlay");
  const cartDrawer = document.getElementById("cartDrawer");
  const checkoutDrawer = document.getElementById("checkoutDrawer");

  function openDrawer(drawer) {
    overlay.classList.add("show");
    drawer.classList.add("show");
  }
  function closeDrawers() {
    overlay.classList.remove("show");
    cartDrawer.classList.remove("show");
    checkoutDrawer.classList.remove("show");
  }
  overlay.addEventListener("click", closeDrawers);
  document.getElementById("openCartBtn").addEventListener("click", function () { renderCartDrawer(); openDrawer(cartDrawer); });
  document.getElementById("closeCartBtn").addEventListener("click", closeDrawers);
  document.getElementById("mbViewCart").addEventListener("click", function () { renderCartDrawer(); openDrawer(cartDrawer); });
  document.getElementById("closeCheckoutBtn").addEventListener("click", closeDrawers);

  document.getElementById("checkoutBtn").addEventListener("click", function () {
    if (!cart.length) return;
    cartDrawer.classList.remove("show");
    goToStep(1);
    openDrawer(checkoutDrawer);
  });

  /* ---------------------------------------------------------------------
     CHECKOUT: step navigation
     --------------------------------------------------------------------- */
  let currentStep = 1;
  function goToStep(n) {
    currentStep = n;
    for (let i = 1; i <= 4; i++) {
      document.getElementById("step" + i).style.display = i === n ? "block" : "none";
      document.getElementById("stepDot" + i).classList.toggle("active", i <= n);
    }
    hideCheckoutError();
    if (n === 4) renderOrderSummary();
  }

  function showCheckoutError(msg) {
    const el = document.getElementById("checkoutError");
    el.textContent = msg;
    el.classList.add("show");
  }
  function hideCheckoutError() {
    document.getElementById("checkoutError").classList.remove("show");
  }

  function markInvalid(fieldId, invalid) {
    document.getElementById(fieldId).classList.toggle("invalid", invalid);
  }

  /* ---- Step 1: customer details ---- */
  document.getElementById("toStep2").addEventListener("click", function () {
    const name = document.getElementById("custName").value.trim();
    const mobile = document.getElementById("custMobile").value.trim();
    const address = document.getElementById("custAddress").value.trim();
    const pincode = document.getElementById("custPincode").value.trim();
    const mobileValid = /^[6-9]\d{9}$/.test(mobile);

    markInvalid("f-name", !name);
    markInvalid("f-mobile", !mobileValid);
    markInvalid("f-address", !address);
    markInvalid("f-pincode", !pincode);

    if (!name) return showCheckoutError("Please enter your name.");
    if (!mobileValid) return showCheckoutError("Please enter a valid 10-digit mobile number.");
    if (!address) return showCheckoutError("Please enter your delivery address.");
    if (!pincode) return showCheckoutError("Please enter your pincode.");

    checkout.customer = {
      name: name,
      mobile: mobile,
      address: address,
      area: document.getElementById("custArea").value.trim(),
      landmark: document.getElementById("custLandmark").value.trim(),
      pincode: pincode,
    };
    goToStep(2);
  });

  /* ---- Step 2: delivery distance ---- */
  document.getElementById("useLocationBtn").addEventListener("click", function () {
    const resultEl = document.getElementById("autoDistanceResult");
    if (!navigator.geolocation) {
      resultEl.textContent = "Location isn't available on this device — please enter the distance manually below.";
      return;
    }
    resultEl.textContent = "Requesting location access…";
    navigator.geolocation.getCurrentPosition(
      function (pos) {
        const km = haversineKm(CAFE_INFO.lat, CAFE_INFO.lng, pos.coords.latitude, pos.coords.longitude);
        checkout.distanceKm = Math.round(km * 10) / 10;
        checkout.distanceSource = "gps";
        document.getElementById("manualDistance").value = checkout.distanceKm;
        resultEl.textContent = "📍 Approx. distance from cafe: " + checkout.distanceKm + " KM";
      },
      function () {
        resultEl.textContent = "Location access denied. Please enter your delivery distance manually below.";
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });

  document.getElementById("manualDistance").addEventListener("input", function (e) {
    checkout.distanceSource = "manual";
    checkout.distanceKm = e.target.value === "" ? null : parseFloat(e.target.value);
  });

  document.getElementById("backTo1").addEventListener("click", function () { goToStep(1); });
  document.getElementById("toStep3").addEventListener("click", function () {
    const val = document.getElementById("manualDistance").value;
    if (checkout.distanceKm === null && val !== "") checkout.distanceKm = parseFloat(val);
    markInvalid("f-distance", checkout.distanceKm === null || isNaN(checkout.distanceKm));
    if (checkout.distanceKm === null || isNaN(checkout.distanceKm)) {
      return showCheckoutError("Please share your location or enter the delivery distance.");
    }
    goToStep(3);
  });

  /* ---- Step 3: payment method ---- */
  const payUpiOption = document.getElementById("payUpiOption");
  const payCodOption = document.getElementById("payCodOption");
  const upiSection = document.getElementById("upiSection");
  const codSection = document.getElementById("codSection");

  function selectPayment(method) {
    checkout.paymentMethod = method;
    payUpiOption.classList.toggle("selected", method === "upi");
    payCodOption.classList.toggle("selected", method === "cod");
    upiSection.style.display = method === "upi" ? "block" : "none";
    codSection.style.display = method === "cod" ? "block" : "none";
    if (method === "upi") renderQr();
  }
  payUpiOption.addEventListener("click", function () {
    payUpiOption.querySelector('input').checked = true;
    selectPayment("upi");
  });
  payCodOption.addEventListener("click", function () {
    payCodOption.querySelector('input').checked = true;
    selectPayment("cod");
  });

  function renderQr() {
    const amount = cartSubtotal() + deliveryChargeFor(checkout.distanceKm);
    document.getElementById("upiAmount").textContent = Math.round(amount).toLocaleString("en-IN");
    const upiUri = "upi://pay?pa=" + encodeURIComponent(CAFE_INFO.upiId) +
      "&pn=" + encodeURIComponent(CAFE_INFO.name) +
      "&am=" + Math.round(amount) +
      "&cu=INR";
    const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(upiUri);
    document.getElementById("qrImage").src = qrUrl;
  }

  document.getElementById("copyUpiBtn").addEventListener("click", function () {
    const btn = this;
    navigator.clipboard.writeText(CAFE_INFO.upiId).then(function () {
      btn.textContent = "Copied ✓";
      btn.classList.add("copied");
      setTimeout(function () { btn.textContent = "Copy UPI ID"; btn.classList.remove("copied"); }, 1500);
    }).catch(function () {
      showToast("Could not copy — UPI ID: " + CAFE_INFO.upiId);
    });
  });

  document.getElementById("backTo2").addEventListener("click", function () { goToStep(2); });
  document.getElementById("toStep4").addEventListener("click", function () {
    if (!checkout.paymentMethod) return showCheckoutError("Please select a payment method.");
    goToStep(4);
  });

  /* ---- Step 4: order summary ---- */
  function renderOrderSummary() {
    const c = checkout.customer;
    document.getElementById("summaryCustomer").innerHTML =
      '<div class="summary-line"><span>Name</span><span>' + c.name + '</span></div>' +
      '<div class="summary-line"><span>Mobile</span><span>' + c.mobile + '</span></div>' +
      '<div class="summary-line"><span>Address</span><span>' + c.address + (c.area ? ", " + c.area : "") + '</span></div>' +
      (c.landmark ? '<div class="summary-line"><span>Landmark</span><span>' + c.landmark + '</span></div>' : "") +
      '<div class="summary-line"><span>Pincode</span><span>' + c.pincode + '</span></div>';

    document.getElementById("summaryItems").innerHTML = cart.map(function (l) {
      const sizeText = l.sizeLabel ? l.sizeLabel + " · " : "";
      return '<div class="summary-line">' +
        '<span class="summary-item-name">' + l.name + '</span>' +
        '<span class="summary-item-meta">' + sizeText + rupee(l.price) + ' × ' + l.qty + ' = ' + rupee(l.price * l.qty) + '</span>' +
        '</div>';
    }).join("");

    const subtotal = cartSubtotal();
    const delivery = deliveryChargeFor(checkout.distanceKm);
    const grand = subtotal + delivery;

    document.getElementById("sumSubtotal").textContent = rupee(subtotal);
    document.getElementById("sumDistance").textContent = checkout.distanceKm + " KM";
    document.getElementById("sumDelivery").innerHTML = delivery === 0
      ? '<span class="badge-free">FREE</span>'
      : rupee(delivery);
    document.getElementById("sumPayment").textContent =
      checkout.paymentMethod === "upi" ? "UPI / QR Payment" : "Cash on Delivery";
    document.getElementById("sumGrandTotal").textContent = rupee(grand);
  }

  document.getElementById("backTo3").addEventListener("click", function () { goToStep(3); });

  /* ---- Place order ---- */
  document.getElementById("placeOrderBtn").addEventListener("click", function () {
    if (!cart.length) return showCheckoutError("Please add at least one item to your cart.");
    if (!checkout.customer.name) return showCheckoutError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(checkout.customer.mobile)) return showCheckoutError("Please enter a valid mobile number.");
    if (!checkout.customer.address) return showCheckoutError("Please enter your delivery address.");
    if (!checkout.customer.pincode) return showCheckoutError("Please enter your pincode.");
    if (checkout.distanceKm === null || isNaN(checkout.distanceKm)) return showCheckoutError("Delivery distance is missing.");
    if (!checkout.paymentMethod) return showCheckoutError("Please select a payment method.");

    const subtotal = cartSubtotal();
    const delivery = deliveryChargeFor(checkout.distanceKm);
    const grand = subtotal + delivery;
    const c = checkout.customer;

    let msg = "Hello Golden Pizza Cafe 👋\n\nI want to place an order.\n\n";
    msg += "CUSTOMER DETAILS\nName: " + c.name + "\nMobile: " + c.mobile + "\n";
    msg += "Delivery Address: " + c.address + (c.area ? ", " + c.area : "") + "\n";
    msg += "Landmark: " + (c.landmark || "-") + "\nPincode: " + c.pincode + "\n\n";
    msg += "DELIVERY\nDistance: " + checkout.distanceKm + " KM\nDelivery Charge: " + rupee(delivery) + "\n\n";
    msg += "ORDER ITEMS\n";
    cart.forEach(function (l, idx) {
      const sizeText = l.sizeLabel ? " (" + l.sizeLabel + ")" : "";
      msg += (idx + 1) + ". " + l.name + sizeText + "\nQuantity: " + l.qty + "\nPrice: " + rupee(l.price) + "\nTotal: " + rupee(l.price * l.qty) + "\n\n";
    });
    msg += "FOOD SUBTOTAL: " + rupee(subtotal) + "\n";
    msg += "DELIVERY CHARGE: " + rupee(delivery) + "\n";
    msg += "GRAND TOTAL: " + rupee(grand) + "\n\n";
    msg += "PAYMENT METHOD: " + (checkout.paymentMethod === "upi" ? "UPI / QR Payment" : "Cash on Delivery") + "\n\n";
    msg += "Thank you!\nGolden Pizza Cafe";

    const waUrl = "https://wa.me/" + CAFE_INFO.phone + "?text=" + encodeURIComponent(msg);
    window.open(waUrl, "_blank", "noopener");

    cart = [];
    saveCart();
    renderCartBadges();
    renderCartDrawer();
    closeDrawers();
    showToast("Order sent! Complete it on WhatsApp.");
  });

  /* ---------------------------------------------------------------------
     INIT
     --------------------------------------------------------------------- */
  renderCategories();
  renderMenu();
  renderCartBadges();
  renderCartDrawer();
})();
