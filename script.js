let cart = JSON.parse(localStorage.getItem("cart")) || [];

// cart

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(name + " byl přidán do košíku");
}

function loadCart() {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("total");

    if (!container) return;

    let total = 0;
    container.innerHTML = "";

    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            ${item.name} - ${item.price} Kč
            <button onclick="removeFromCart(${index})">❌</button>
        `;

        container.appendChild(div);
        total += item.price;
    });

    if (totalEl) totalEl.textContent = total + " Kč";
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function clearCart() {
    localStorage.removeItem("cart");
    cart = [];
    loadCart();
}

// firebase databáze

async function loadProductsFromDB() {
    const container = document.querySelector(".grid");
    if (!container || !window.db) return;

    container.innerHTML = "";

    const querySnapshot = await getDocs(collection(db, "products"));

    querySnapshot.forEach(doc => {
        const p = doc.data();

        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <h3>${p.name}</h3>
            <p>${p.price} Kč</p>
            <button onclick="addToCart('${p.name}', ${p.price})">
                Přidat do košíku
            </button>
        `;

        container.appendChild(div);
    });
}

async function submitProduct(event) {
    event.preventDefault();

    if (!window.db) {
        alert("Databáze se ještě načítá, zkus to za chvíli.");
        return;
    }

    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;

    await addDoc(collection(db, "products"), {
        name: name,
        price: Number(price)
    });

    alert("Uloženo do databáze!");
}

// animace, juchu

window.addEventListener("load", () => {

    // animace
    document.body.classList.remove("fade-out");

    loadProductsFromDB();

    loadCart();

    // při hoveru fade transition
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function(e) {
            if (this.href && this.href.includes(window.location.hostname)) {
                e.preventDefault();

                document.body.classList.add("fade-out");

                setTimeout(() => {
                    window.location.href = this.href;
                }, 400);
            }
        });
    });
});