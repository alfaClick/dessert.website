let cart = [];
let total = 0;

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('orderConfirmationModal');
    const closeModalBtn = document.getElementById('closeModal');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');

    // Sembunyikan modal saat halaman dimuat
    modal.classList.add('hidden');
    modal.classList.remove('show');

    // Nonaktifkan tombol "Confirm Order" saat halaman dimuat jika keranjang kosong
    updateConfirmOrderButton();

    // Event listener untuk tombol tutup modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Event listener untuk tombol konfirmasi pesanan
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', showOrderConfirmation);
    }

    // Setup animasi untuk kartu produk
    setupProductCardAnimations();

    // Setup posisi keranjang
    updateCartPosition();
    window.addEventListener("resize", updateCartPosition);
});

function addToCart(productName, price) {
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        const image = getImageForProduct(productName);
        if (!image) {
            console.error(`Image for ${productName} not found`);
        }
        cart.push({ 
            name: productName, 
            price: price, 
            quantity: 1, 
            image: image  
        });
    }
    total += price;
    renderCart();
    updateConfirmOrderButton();
}

function getImageForProduct(productName) {
    // Fungsi untuk mendapatkan gambar produk sesuai dengan nama produk
    const productImages = {
        'Waffle with Berries': 'img/waffle enak.jpg',
        'Vanilla Bean Crème Brûlée': 'img/Creme-Brulee-21-720x720.jpg',
        'Macaron Mix of Five': 'img/how-to-make-macarons_top-down-beauty-shot.jpg',
        'Classic Tiramisu': 'img/1200x900px_Traditional-Tiramisu-with-Coffee-and-Sweet-Wine.png',
        'Pistachio Baklava': 'img/20230817182203-baklava.jpg',
        'Lemon Meringue Pie': 'img/lemon.jpg',
        'Red Velvet Cake': 'img/vegan red.jpeg',
        'Salted Caramel Brownie': 'img/salted.jpg',
        'Vanilla Panna Cotta': 'img/vanillapannacotta_87907_16x9.jpg'
    };
    return productImages[productName] || '';
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    

    cartItems.innerHTML = '';
    let totalItems = 0;

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.classList.add('flex', 'justify-between', 'my-2', 'items-center');
        li.innerHTML = `
            <div class="flex items-center">
                <span>${item.name} (${item.quantity}x)</span>
                <div class="flex items-center mx-4">
                    <button class="bg-gray-300 text-gray-600 px-2 py-1 rounded-md" onclick="decreaseQuantity(${index})">-</button>
                    <span class="mx-2">${item.quantity}</span>
                    <button class="bg-gray-300 text-gray-600 px-2 py-1 rounded-md" onclick="increaseQuantity(${index})">+</button>
                </div>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
        cartItems.appendChild(li);

        totalItems += item.quantity;
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = totalItems;
}


    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = totalItems;


function increaseQuantity(index) {
    cart[index].quantity += 1;
    total += cart[index].price;
    renderCart();
    updateConfirmOrderButton();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
        total -= cart[index].price;
    } else {
        removeFromCart(index);
    }
    renderCart();
    updateConfirmOrderButton();
}

function removeFromCart(index) {
    total -= cart[index].price * cart[index].quantity;
    cart.splice(index, 1);
    renderCart();
    updateConfirmOrderButton();
}

function populateOrderDetails() {
    const orderDetails = document.getElementById('orderDetails');
    const orderTotal = document.getElementById('orderTotal');
    orderDetails.innerHTML = '';

    let total = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('flex', 'justify-between', 'my-4');
        li.innerHTML = `
            <div class="flex items-center">
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 mr-4 object-cover rounded-md">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p class="text-gray-500">${item.quantity}x @$${item.price.toFixed(2)}</p>
                </div>
            </div>
            <span class="font-bold">$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        orderDetails.appendChild(li);

        total += item.price * item.quantity;
    });

    orderTotal.textContent = total.toFixed(2);
}

function showOrderConfirmation() {
    populateOrderDetails();
    const modal = document.getElementById('orderConfirmationModal');
    modal.classList.remove('hidden');
    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('orderConfirmationModal');
    modal.classList.add('hidden');
    modal.classList.remove('show');
}

function startNewOrder() {
    cart = [];
    total = 0;
    closeModal();
    renderCart();
    updateConfirmOrderButton();
}

function updateConfirmOrderButton() {
    const confirmOrderBtn = document.getElementById('confirm-order-btn');
    if (confirmOrderBtn) {
        confirmOrderBtn.disabled = cart.length === 0;
    }
}

function setupProductCardAnimations() {
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, { scale: 1.1, duration: 0.3, ease: "power2.out" });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
        });
    });

    gsap.from(".product-card", { 
        rotation: 360, 
        opacity: 0, 
        duration: 1.5, 
        ease: "power4.out", 
        stagger: 0.3 
    });
}

function updateCartPosition() {
    const screenWidth = window.innerWidth;
    const cart = document.querySelector("aside");

    if (screenWidth >= 1024) { // Untuk desktop
        cart.style.position = "sticky";
        cart.style.top = "20px";
    } else { // Untuk mobile
        cart.style.position = "static";
        cart.style.width = "100%";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('orderConfirmationModal');
    const closeModalBtn = document.getElementById('closeModal');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');
    

    // Sembunyikan modal saat halaman dimuat
    modal.classList.add('hidden');
    modal.classList.remove('show');

    // Nonaktifkan tombol "Confirm Order" saat halaman dimuat jika keranjang kosong
    updateConfirmOrderButton();

    // Event listener untuk tombol tutup modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    // Event listener untuk tombol konfirmasi pesanan
    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', showOrderConfirmation);
    }

   

    // Setup animasi untuk kartu produk
    setupProductCardAnimations();

    // Setup posisi keranjang
    updateCartPosition();
    window.addEventListener("resize", updateCartPosition);
});
