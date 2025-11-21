// ===== DATA GLOBAL =====
let transactions = [];
let currentDiscount = 0;
let appliedPromoCode = "";

// Mapping warna metode pembayaran
const paymentMethodColors = {
    transfer: "bg-blue-100 text-blue-800",
    ewallet: "bg-purple-100 text-purple-800",
    credit: "bg-orange-100 text-orange-800",
    Pemerintah: "bg-yellow-100 text-yellow-800",
    cash: "bg-green-100 text-green-800"
};

// ===== ON LOAD =====
document.addEventListener("DOMContentLoaded", () => {
    initDarkMode();
    setupEventListeners();
});

// ===== DARK MODE =====
function initDarkMode() {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const darkModeIcon = document.getElementById("darkModeIcon");
    const darkModeText = document.getElementById("darkModeText");

    function updateDarkModeUI(isDark) {
        darkModeIcon.textContent = isDark ? "☀️" : "🌙";
        darkModeText.textContent = isDark ? "Light Mode" : "Dark Mode";
    }

    if (
        localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") &&
            window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
        document.documentElement.classList.add("dark");
        updateDarkModeUI(true);
    }

    darkModeToggle.addEventListener("click", () => {
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateDarkModeUI(isDark);
    });
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    const productSelect = document.getElementById("productSelect");
    const quantityInput = document.getElementById("quantity");
    const promoBtn = document.getElementById("applyPromoBtn");
    const paymentForm = document.getElementById("paymentForm");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const clearHistoryBtn = document.getElementById("clearHistoryBtn");

    productSelect.addEventListener("change", calculateTotal);
    quantityInput.addEventListener("input", calculateTotal);
    promoBtn.addEventListener("click", applyPromo);
    paymentForm.addEventListener("submit", handlePayment);
    closeModalBtn.addEventListener("click", closeModal);
    clearHistoryBtn.addEventListener("click", clearHistory);
}

// ===== HITUNG TOTAL =====
function calculateTotal() {
    const product = document.getElementById("productSelect");
    const quantity = parseInt(document.getElementById("quantity").value) || 1;

    const price = parseInt(product.selectedOptions[0]?.dataset.price || 0);

    const subtotal = price * quantity;
    const discount = currentDiscount;
    const total = subtotal - discount;

    document.getElementById("subtotal").textContent = formatRupiah(subtotal);
    document.getElementById("discount").textContent = formatRupiah(discount);
    document.getElementById("totalAmount").textContent = formatRupiah(total);

    document.getElementById("discountRow").classList.toggle("hidden", discount <= 0);
}

// ===== TERAPKAN PROMO =====
function applyPromo() {
    const promoInput = document.getElementById("promoCode").value.trim();
    const promoMessage = document.getElementById("promoMessage");

    const validPromo = {
        HEMAT10: 0.1, // diskon 10%
        HEMAT50: 0.5  // diskon 50%
    };

    if (!promoInput) return;

    if (validPromo[promoInput]) {
        appliedPromoCode = promoInput;

        const product = document.getElementById("productSelect");
        const quantity = parseInt(document.getElementById("quantity").value) || 1;
        const price = parseInt(product.selectedOptions[0]?.dataset.price || 0);
        const subtotal = price * quantity;

        currentDiscount = subtotal * validPromo[promoInput];
        promoMessage.textContent = "Kode promo berhasil diterapkan!";
        promoMessage.classList.remove("hidden");
        promoMessage.classList.add("text-green-600");

        calculateTotal();
    } else {
        promoMessage.textContent = "Kode promo tidak valid.";
        promoMessage.classList.remove("hidden");
        promoMessage.classList.add("text-red-600");
        currentDiscount = 0;
        calculateTotal();
    }
}

// ===== PROSES PEMBAYARAN =====
function handlePayment(e) {
    e.preventDefault();

    const name = document.getElementById("customerName").value;
    const email = document.getElementById("customerEmail").value;
    const nim = document.getElementById("customerNim").value;
    const product = document.getElementById("productSelect").value;
    const quantity = document.getElementById("quantity").value;
    const paymentMethod = document.querySelector("input[name='paymentMethod']:checked");

    if (!paymentMethod) {
        alert("Pilih metode pembayaran.");
        return;
    }

    const total = document.getElementById("totalAmount").textContent;

    const transaction = {
        id: Date.now(),
        name,
        email,
        nim,
        product,
        quantity,
        paymentMethod: paymentMethod.value,
        total,
        time: new Date().toLocaleString()
    };

    transactions.push(transaction);
    renderTransaction(transaction);
    updateStats();

    showModal(transaction);
    e.target.reset();

    currentDiscount = 0;
    appliedPromoCode = "";
    calculateTotal();

    document.getElementById("clearHistoryBtn").classList.remove("hidden");
    document.getElementById("emptyState").classList.add("hidden");
}

// ===== RENDER SATU TRANSAKSI =====
function renderTransaction(tx) {
    const list = document.getElementById("transactionList");
    const template = document.getElementById("transactionTemplate").content.cloneNode(true);

    template.querySelector(".transaction-customer").textContent = tx.name;
    template.querySelector(".transaction-product").textContent = `${tx.product} × ${tx.quantity}`;
    template.querySelector(".transaction-amount").textContent = tx.total;
    template.querySelector(".transaction-time").textContent = tx.time;

    const badge = template.querySelector(".transaction-method");
    badge.textContent = tx.paymentMethod;
    badge.className = `transaction-method px-2 py-1 rounded-full text-xs ${paymentMethodColors[tx.paymentMethod]}`;

    list.prepend(template);
}

// ===== MODAL =====
function showModal(tx) {
    const modal = document.getElementById("paymentModal");
    modal.classList.remove("hidden");

    document.getElementById("paymentDetails").innerHTML = `
        Nama: ${tx.name}<br>
        Email: ${tx.email}<br>
        Nim: ${tx.nim}<br>
        Produk: ${tx.product}<br>
        Jumlah: ${tx.quantity}<br>
        Metode: ${tx.paymentMethod}<br>
        Total: ${tx.total}
    `;
}

function closeModal() {
    document.getElementById("paymentModal").classList.add("hidden");
}

// ===== STATISTIK =====
function updateStats() {
    const totalTrans = transactions.length;
    const totalRevenue = transactions.reduce((a, b) => {
        return a + parseInt(b.total.replace(/[^0-9]/g, ""));
    }, 0);
    const avg = totalTrans > 0 ? totalRevenue / totalTrans : 0;

    document.getElementById("totalTransactions").textContent = totalTrans;
    document.getElementById("totalRevenue").textContent = formatRupiah(totalRevenue);
    document.getElementById("avgTransaction").textContent = formatRupiah(avg);
}

// ===== CLEAR HISTORY =====
function clearHistory() {
    transactions = [];
    document.getElementById("transactionList").innerHTML = "";
    document.getElementById("emptyState").classList.remove("hidden");
    document.getElementById("clearHistoryBtn").classList.add("hidden");
    updateStats();
}

// ===== FORMAT RUPIAH =====
function formatRupiah(number) {
    return "Rp " + number.toLocaleString("id-ID");
}
