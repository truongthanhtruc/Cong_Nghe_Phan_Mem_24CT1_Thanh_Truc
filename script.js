// ==========================
// DỮ LIỆU SẢN PHẨM
// ==========================

const products = [
    const products = [
    {
        id: 1,
        name: "Son Romand",
        price: 129000,
        stock: 20,
        category: "Son môi",
        image: "images/romand.jpg"
    },
    {
        id: 2,
        name: "Kem dưỡng ẩm Laneige",
        price: 189000,
        stock: 15,
        category: "Skincare",
        image: "images/laneige.jpg"
    },
    {
        id: 3,
        name: "Kem nền Maybelline",
        price: 249000,
        stock: 10,
        category: "Kem nền",
        image: "images/maybelline.jpg"
    },
    {
        id: 4,
        name: "Nước hoa hồng",
        price: 159000,
        stock: 12,
        category: "Skincare",
        image: "images/toner.jpg"
    },
    {
        id: 5,
        name: "Phấn má hồng",
        price: 199000,
        stock: 8,
        category: "Trang điểm",
        image: "images/blush.jpg"
    },
    {
        id: 6,
        name: "Nước hoa nữ",
        price: 399000,
        stock: 7,
        category: "Nước hoa",
        image: "images/perfume.jpg"
    }
];  
    


// ==========================
// GIỎ HÀNG
// ==========================

let cart = JSON.parse(localStorage.getItem("beautyCart")) || [];

let orders = JSON.parse(localStorage.getItem("beautyOrders")) || [];


// ==========================
// FORMAT TIỀN
// ==========================

function formatMoney(number) {
    return number.toLocaleString("vi-VN") + "đ";
}


// ==========================
// HIỂN THỊ SẢN PHẨM
// ==========================

function renderProducts() {
    const productList = document.getElementById("productList");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");

    const searchText = searchInput
        ? searchInput.value.toLowerCase()
        : "";

    const category = categoryFilter
        ? categoryFilter.value
        : "all";

    const filteredProducts = products.filter(product => {
        const matchSearch =
            product.name.toLowerCase().includes(searchText);

        const matchCategory =
            category === "all" ||
            product.category === category;

        return matchSearch && matchCategory;
    });

    productList.innerHTML = "";

    filteredProducts.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img 
                    src="${product.image}" 
                    alt="${product.name}"
                    onerror="this.src='https://via.placeholder.com/400x400?text=Beauty+Product'"
                >
            </div>

            <div class="product-info">
                <span class="product-category">
                    ${product.category}
                </span>

                <h3>${product.name}</h3>

                <p class="product-price">
                    ${formatMoney(product.price)}
                </p>

                <p class="product-stock">
                    Còn ${product.stock} sản phẩm
                </p>

                <button 
                    class="add-cart-btn"
                    onclick="addToCart(${product.id})"
                    ${product.stock <= 0 ? "disabled" : ""}
                >
                    🛒 Thêm vào giỏ
                </button>
            </div>
        `;

        productList.appendChild(card);
    });

    const productTotal = document.getElementById("productTotal");

    if (productTotal) {
        productTotal.textContent =
            ${filteredProducts.length} sản phẩm;
    }
}


    document.getElementById("productTotal")
        .textContent =
        '${filteredProducts.length} sản phẩm';
}


// ==========================
// THÊM VÀO GIỎ
// ==========================

function addToCart(productId) {

    const product =
        products.find(p => p.id === productId);

    if (!product) return;


    const existing =
        cart.find(item => item.id === productId);


    if (existing) {

        if (existing.quantity >= product.quantity) {

            alert("Số lượng sản phẩm không đủ!");

            return;
        }

        existing.quantity++;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            icon: product.icon,
            quantity: 1
        });

    }


    saveCart();

    updateCartCount();

    alert('Đã thêm "${product.name}" vào giỏ hàng 🛒');
}


// ==========================
// LƯU GIỎ HÀNG
// ==========================

function saveCart() {

    localStorage.setItem(
        "beautyCart",
        JSON.stringify(cart)
    );

}


// ==========================
// ĐẾM GIỎ HÀNG
// ==========================

function updateCartCount() {

    const count =
        cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

    document.getElementById("cartCount")
        .textContent = count;
}


// ==========================
// MỞ GIỎ HÀNG
// ==========================

function openCart() {

    document.getElementById("cartModal")
        .style.display = "flex";

    renderCart();
}


// ==========================
// ĐÓNG GIỎ HÀNG
// ==========================

function closeCart() {

    document.getElementById("cartModal")
        .style.display = "none";
}


// ==========================
// CLICK RA NGOÀI GIỎ
// ==========================

function closeCartOutside(event) {

    if (event.target.id === "cartModal") {

        closeCart();

    }
}


// ==========================
// HIỂN THỊ GIỎ HÀNG
// ==========================

function renderCart() {

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                🛍️ Giỏ hàng đang trống
            </p>
        `;

        cartTotal.textContent = "0đ";

        return;
    }


    let total = 0;


    cart.forEach(item => {

        total += item.price * item.quantity;


        const div =
            document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `

            <div class="cart-item-icon">
                ${item.icon}
            </div>

            <div class="cart-item-info">

                <h4>${item.name}</h4>

                <p>
                    ${formatMoney(item.price)}
                </p>

            </div>

            <div class="quantity-control">

                <button
                    onclick="changeQuantity(${item.id}, -1)"
                >
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="changeQuantity(${item.id}, 1)"
                >
                    +
                </button>

            </div>

            <button
                class="remove-cart"
                onclick="removeFromCart(${item.id})"
            >
                🗑️
            </button>
        `;

        cartItems.appendChild(div);

    });


    cartTotal.textContent =
        formatMoney(total);
}


// ==========================
// TĂNG / GIẢM SỐ LƯỢNG
// ==========================

function changeQuantity(productId, change) {

    const item =
        cart.find(item => item.id === productId);

    const product =
        products.find(product => product.id === productId);


    if (!item || !product) return;


    item.quantity += change;


    if (item.quantity <= 0) {

        cart =
            cart.filter(item => item.id !== productId);

    }


    if (item.quantity > product.quantity) {

        item.quantity = product.quantity;

        alert("Không còn đủ sản phẩm!");

    }


    saveCart();

    renderCart();

    updateCartCount();
}


// ==========================
// XÓA KHỎI GIỎ
// ==========================

function removeFromCart(productId) {

    cart =
        cart.filter(item => item.id !== productId);

    saveCart();

    renderCart();

    updateCartCount();
}


// ==========================
// MỞ FORM ĐẶT HÀNG
// ==========================

function openCheckout() {

    if (cart.length === 0) {

        alert("Giỏ hàng đang trống!");

        return;
    }


    let total = 0;

    cart.forEach(item => {

        total +=
            item.price * item.quantity;

    });


    document.getElementById("checkoutTotal")
        .textContent =
        formatMoney(total);


    document.getElementById("checkoutModal")
        .style.display = "flex";
}


// ==========================
// ĐÓNG FORM ĐẶT HÀNG
// ==========================

function closeCheckout() {

    document.getElementById("checkoutModal")
        .style.display = "none";
}


// ==========================
// ĐẶT HÀNG
// ==========================

function placeOrder() {

    const name =
        document.getElementById("customerName")
        .value.trim();

    const phone =
        document.getElementById("customerPhone")
        .value.trim();

    const address =
        document.getElementById("customerAddress")
        .value.trim();


    if (!name || !phone || !address) {

        alert("Vui lòng nhập đầy đủ thông tin!");

        return;
    }


    let total = 0;


    cart.forEach(item => {

        total +=
            item.price * item.quantity;

    });


    const order = {

        id: Date.now(),

        customerName: name,

        phone: phone,

        address: address,

        items: [...cart],

        total: total,

        status: "order",

        date: new Date().toLocaleString("vi-VN")

    };


    orders.push(order);


    localStorage.setItem(
        "beautyOrders",
        JSON.stringify(orders)
    );


    cart = [];

    saveCart();

    updateCartCount();


    document.getElementById("customerName")
        .value = "";

    document.getElementById("customerPhone")
        .value = "";

    document.getElementById("customerAddress")
        .value = "";


    closeCheckout();

    closeCart();

    renderOrders();


    alert(
        "🎉 Đặt hàng thành công!\n\n" +
        "Cảm ơn bạn đã mua hàng tại Beauty Store 💕"
    );
}


// ==========================
// HIỂN THỊ ĐƠN HÀNG
// ==========================

function renderOrders() {

    const orderList =
        document.getElementById("orderList");

    const shippingList =
        document.getElementById("shippingList");

    const doneList =
        document.getElementById("doneList");


    orderList.innerHTML = "";
    shippingList.innerHTML = "";
    doneList.innerHTML = "";


    let orderCount = 0;
    let shippingCount = 0;
    let doneCount = 0;


    orders.forEach(order => {

        const card =
            createOrderCard(order);


        if (order.status === "order") {

            orderList.appendChild(card);

            orderCount++;

        } else if (order.status === "shipping") {

            shippingList.appendChild(card);

            shippingCount++;

        } else if (order.status === "done") {

            doneList.appendChild(card);

            doneCount++;

        }

    });


    document.getElementById("orderCount")
        .textContent = orderCount;

    document.getElementById("shippingCount")
        .textContent = shippingCount;

    document.getElementById("doneCount")
        .textContent = doneCount;
}


// ==========================
// TẠO CARD ĐƠN HÀNG
// ==========================

function createOrderCard(order) {

    const card =
        document.createElement("div");

    card.className = "order-card";


    const productNames =
        order.items
            .map(item =>
                ('${item.name} × ${item.quantity}')
            )
            .join(", ");


    let button = "";


    if (order.status === "order") {

        button = `
            <button
                class="next-btn"
                onclick="changeOrderStatus(${order.id}, 'shipping')"
            >
                🚚 Giao hàng
            </button>
        `;

    } else if (order.status === "shipping") {

        button = `
            <button
                class="next-btn"
                onclick="changeOrderStatus(${order.id}, 'done')"
            >
                ✅ Hoàn thành
            </button>
        `;

    }


    card.innerHTML = `

        <h4>
            👤 ${order.customerName}
        </h4>

        <p>
            📱 ${order.phone}
        </p>

        <p>
            🏠 ${order.address}
        </p>

        <p>
            🛍️ ${productNames}
        </p>

        <p>
            💰 <strong>
                ${formatMoney(order.total)}
            </strong>
        </p>

        <p>
            🕒 ${order.date}
        </p>

        <div class="order-actions">

            ${button}

            <button
                class="delete-order"
                onclick="deleteOrder(${order.id})"
            >
                🗑️ Xóa
            </button>

        </div>
    `;


    return card;
}


// ==========================
// ĐỔI TRẠNG THÁI ĐƠN
// ==========================

function changeOrderStatus(id, status) {

    const order =
        orders.find(order => order.id === id);


    if (!order) return;


    order.status = status;


    localStorage.setItem(
        "beautyOrders",
        JSON.stringify(orders)
    );


    renderOrders();
}


// ==========================
// XÓA ĐƠN
// ==========================

function deleteOrder(id) {

    if (!confirm("Bạn có chắc muốn xóa đơn này?")) {

        return;
    }


    orders =
        orders.filter(order => order.id !== id);


    localStorage.setItem(
        "beautyOrders",
        JSON.stringify(orders)
    );


    renderOrders();
}


// ==========================
// CHẠY KHI MỞ WEB
// ==========================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderProducts();

        updateCartCount();

        renderOrders();

    });
    // ================================
// ĐĂNG NHẬP / ĐĂNG KÝ
// ================================


// MỞ MODAL ĐĂNG NHẬP
function openAuthModal() {
    document.getElementById("authModal").style.display = "flex";
    showLogin();
}


// ĐÓNG MODAL
function closeAuthModal() {
    document.getElementById("authModal").style.display = "none";
}


// HIỆN FORM ĐĂNG NHẬP
function showLogin() {
    document.getElementById("authTitle").textContent = "🔐 Đăng nhập";

    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registerForm").style.display = "none";
}


// HIỆN FORM ĐĂNG KÝ
function showRegister() {
    document.getElementById("authTitle").textContent = "✨ Đăng ký tài khoản";

    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
}


// ================================
// ĐĂNG KÝ
// ================================

function register() {

    const name =
        document.getElementById("registerName").value.trim();

    const email =
        document.getElementById("registerEmail").value.trim();

    const password =
        document.getElementById("registerPassword").value;

    const confirm =
        document.getElementById("registerConfirm").value;


    if (!name || !email || !password || !confirm) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }


    if (password !== confirm) {
        alert("Mật khẩu nhập lại không khớp!");
        return;
    }


    const existingUser = users.find(
        user => user.email === email
    );


    if (existingUser) {
        alert("Email này đã được đăng ký!");
        return;
    }


    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        password: password
    };


    users.push(newUser);

    localStorage.setItem(
        "beautyUsers",
        JSON.stringify(users)
    );


    alert("🎉 Đăng ký thành công!");


    // Xóa form
    document.getElementById("registerName").value = "";
    document.getElementById("registerEmail").value = "";
    document.getElementById("registerPassword").value = "";
    document.getElementById("registerConfirm").value = "";


    showLogin();
}


// ================================
// ĐĂNG NHẬP
// ================================

function login() {

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value;


    if (!email || !password) {
        alert("Vui lòng nhập email và mật khẩu!");
        return;
    }


    const user = users.find(
        user =>
            user.email === email &&
            user.password === password
    );


    if (!user) {
        alert("❌ Email hoặc mật khẩu không đúng!");
        return;
    }


    currentUser = {
        id: user.id,
        name: user.name,
        email: user.email
    };


    localStorage.setItem(
        "beautyCurrentUser",
        JSON.stringify(currentUser)
    );


    alert('🎉 Chào mừng ${user.name} đến với Beauty Store!');

    closeAuthModal();

    updateAccountUI();
}


// ================================
// HIỂN THỊ TÀI KHOẢN
// ================================

function updateAccountUI() {

    const loginButton =
        document.querySelector(".account-btn");

    const welcome =
        document.getElementById("userWelcome");

    const logoutButton =
        document.getElementById("logoutBtn");


    if (currentUser) {

        loginButton.style.display = "none";

        welcome.style.display = "inline";

        welcome.textContent ='👋 Xin chào, ${currentUser.name}';

        logoutButton.style.display = "inline-block";

    } else {

        loginButton.style.display = "inline-block";

        welcome.style.display = "none";

        logoutButton.style.display = "none";
    }
}


// ================================
// ĐĂNG XUẤT
// ================================

function logout() {

    currentUser = null;

    localStorage.removeItem("beautyCurrentUser");

    updateAccountUI();

    alert("👋 Bạn đã đăng xuất!");
}


// ================================
// KHỞI ĐỘNG
// ================================

document.addEventListener("DOMContentLoaded", function () {
    updateAccountUI();
});
