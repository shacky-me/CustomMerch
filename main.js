// Application State Management
class AppState {
  constructor() {
    this.products = [
      {
        id: 1,
        name: "Custom T-Shirt",
        price: 24.99,
        category: "apparel",
        description: "Premium cotton t-shirt perfect for custom designs",
        icon: "fas fa-tshirt",
        customizable: true,
      },
      {
        id: 2,
        name: "Custom Mug",
        price: 14.99,
        category: "home",
        description: "Ceramic mug ideal for personalized messages",
        icon: "fas fa-mug-hot",
        customizable: true,
      },
      {
        id: 3,
        name: "Custom Hat",
        price: 19.99,
        category: "accessories",
        description: "Adjustable cap perfect for logos and text",
        icon: "fas fa-hat-cowboy",
        customizable: true,
      },
      {
        id: 4,
        name: "Custom Hoodie",
        price: 39.99,
        category: "apparel",
        description: "Comfortable hoodie with custom design options",
        icon: "fas fa-tshirt",
        customizable: true,
      },
      {
        id: 5,
        name: "Custom Phone Case",
        price: 16.99,
        category: "accessories",
        description: "Protective case with personalization options",
        icon: "fas fa-mobile-alt",
        customizable: true,
      },
      {
        id: 6,
        name: "Custom Notebook",
        price: 12.99,
        category: "home",
        description: "High-quality notebook for custom covers",
        icon: "fas fa-book",
        customizable: true,
      },
      {
        id: 7,
        name: "Custom Tote Bag",
        price: 18.99,
        category: "accessories",
        description: "Eco-friendly tote bag for custom prints",
        icon: "fas fa-shopping-bag",
        customizable: true,
      },
      {
        id: 8,
        name: "Custom Mouse Pad",
        price: 11.99,
        category: "home",
        description: "Professional mouse pad with custom graphics",
        icon: "fas fa-desktop",
        customizable: true,
      },
    ];

    this.cart = this.loadCart();
    this.currentProduct = null;
    this.currentCustomization = {
      color: "#000000",
      text: "",
      textColor: "#000000",
      fontSize: 24,
      design: "",
    };
    this.filteredProducts = [...this.products];

    this.initializeEventListeners();
    this.renderProducts();
    this.updateCartUI();
  }

  // Local Storage Management
  saveCart() {
    localStorage.setItem("customcraft-cart", JSON.stringify(this.cart));
  }

  loadCart() {
    const savedCart = localStorage.getItem("customcraft-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  }

  // Product Management
  getProductById(id) {
    return this.products.find((product) => product.id === parseInt(id));
  }

  filterProducts(category = "all", searchTerm = "") {
    this.filteredProducts = this.products.filter((product) => {
      const matchesCategory =
        category === "all" || product.category === category;
      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    this.renderProducts();
  }

  renderProducts() {
    const productsGrid = document.getElementById("productsGrid");

    if (this.filteredProducts.length === 0) {
      productsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: hsl(var(--text-secondary));">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; color: hsl(var(--primary));"></i>
                    <p>No products found matching your criteria.</p>
                </div>
            `;
      return;
    }

    productsGrid.innerHTML = this.filteredProducts
      .map(
        (product) => `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <i class="${product.icon}"></i>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">$${product.price.toFixed(
                      2
                    )}</div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-actions">
                        <button class="btn btn-secondary" onclick="app.openProductModal(${
                          product.id
                        })">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="btn btn-primary" onclick="app.selectProductForCustomization(${
                          product.id
                        })">
                            <i class="fas fa-paint-brush"></i> Customize
                        </button>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  // Product Selection and Customization
  selectProductForCustomization(productId) {
    this.currentProduct = this.getProductById(productId);
    this.resetCustomization();
    this.showCustomizationWorkspace();
    this.updateProductPreview();
    this.scrollToCustomization();
  }

  showCustomizationWorkspace() {
    document.getElementById("customizationWorkspace").style.display = "grid";
    document.getElementById("selectProductPrompt").style.display = "none";
  }

  hideCustomizationWorkspace() {
    document.getElementById("customizationWorkspace").style.display = "none";
    document.getElementById("selectProductPrompt").style.display = "block";
  }

  resetCustomization() {
    this.currentCustomization = {
      color: "#000000",
      text: "",
      textColor: "#000000",
      fontSize: 24,
      design: "",
    };

    // Reset UI elements
    document.getElementById("textInput").value = "";
    document.getElementById("fontSizeSlider").value = 24;
    document.getElementById("textColorPicker").value = "#000000";

    // Reset active states
    document.querySelectorAll(".color-option").forEach((option) => {
      option.classList.remove("active");
    });
    document
      .querySelector('.color-option[data-color="#000000"]')
      .classList.add("active");

    document.querySelectorAll(".design-option").forEach((option) => {
      option.classList.remove("active");
    });

    this.updateProductPreview();
  }

  updateProductPreview() {
    if (!this.currentProduct) return;

    const baseProduct = document.getElementById("baseProduct");
    const customText = document.getElementById("customText");
    const customDesign = document.getElementById("customDesign");

    // Update base product
    baseProduct.style.backgroundColor = this.currentCustomization.color;
    baseProduct.innerHTML = `<i class="${this.currentProduct.icon}"></i>`;

    // Update custom text
    customText.textContent = this.currentCustomization.text;
    customText.style.color = this.currentCustomization.textColor;
    customText.style.fontSize = `${this.currentCustomization.fontSize}px`;

    // Update custom design
    customDesign.textContent = this.currentCustomization.design;
  }

  // Cart Management
  addToCart(product = null, customization = null) {
    const productToAdd = product || this.currentProduct;
    const customizationToAdd = customization || {
      ...this.currentCustomization,
    };

    if (!productToAdd) return;

    const cartItem = {
      id: Date.now(), // Unique ID for cart item
      productId: productToAdd.id,
      product: productToAdd,
      customization: customizationToAdd,
      quantity: 1,
      price: productToAdd.price,
    };

    // Check if similar item exists
    const existingItemIndex = this.cart.findIndex(
      (item) =>
        item.productId === productToAdd.id &&
        JSON.stringify(item.customization) ===
          JSON.stringify(customizationToAdd)
    );

    if (existingItemIndex > -1) {
      this.cart[existingItemIndex].quantity += 1;
    } else {
      this.cart.push(cartItem);
    }

    this.saveCart();
    this.updateCartUI();
    this.showSuccessMessage("Item added to cart!");
  }

  removeFromCart(cartItemId) {
    this.cart = this.cart.filter((item) => item.id !== cartItemId);
    this.saveCart();
    this.updateCartUI();
  }

  updateCartItemQuantity(cartItemId, newQuantity) {
    const item = this.cart.find((item) => item.id === cartItemId);
    if (item) {
      if (newQuantity <= 0) {
        this.removeFromCart(cartItemId);
      } else {
        item.quantity = newQuantity;
        this.saveCart();
        this.updateCartUI();
      }
    }
  }

  getCartTotal() {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  updateCartUI() {
    const cartCount = document.getElementById("cartCount");
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    // Update cart count
    const totalItems = this.cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? "flex" : "none";

    // Update cart items
    if (this.cart.length === 0) {
      cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem; color: hsl(var(--primary));"></i>
                    <p>Your cart is empty</p>
                    <p>Add some products to get started!</p>
                </div>
            `;
    } else {
      cartItems.innerHTML = this.cart
        .map(
          (item) => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <i class="${item.product.icon}"></i>
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.product.name}</div>
                        <div class="cart-item-price">$${(
                          item.price * item.quantity
                        ).toFixed(2)}</div>
                        ${this.getCustomizationSummary(item.customization)}
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="app.updateCartItemQuantity(${
                              item.id
                            }, ${item.quantity - 1})">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="app.updateCartItemQuantity(${
                              item.id
                            }, ${item.quantity + 1})">+</button>
                        </div>
                        <button class="remove-item" onclick="app.removeFromCart(${
                          item.id
                        })">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `
        )
        .join("");
    }

    // Update cart total
    cartTotal.textContent = this.getCartTotal().toFixed(2);
  }

  getCustomizationSummary(customization) {
    const details = [];
    if (customization.text) details.push(`Text: "${customization.text}"`);
    if (customization.design) details.push(`Design: ${customization.design}`);
    if (customization.color !== "#000000")
      details.push(`Color: ${customization.color}`);

    return details.length > 0
      ? `<div class="cart-item-customization">${details.join(", ")}</div>`
      : "";
  }

  // Modal Management
  openProductModal(productId) {
    const product = this.getProductById(productId);
    if (!product) return;

    document.getElementById("productModalTitle").textContent = product.name;
    document.getElementById(
      "productModalImage"
    ).innerHTML = `<i class="${product.icon}"></i>`;
    document.getElementById(
      "productModalPrice"
    ).textContent = `$${product.price.toFixed(2)}`;
    document.getElementById("productModalDescription").textContent =
      product.description;

    // Set up modal buttons
    document.getElementById("customizeProductBtn").onclick = () => {
      this.closeModal("productModal");
      this.selectProductForCustomization(productId);
    };

    document.getElementById("quickAddToCart").onclick = () => {
      this.addToCart(product, {
        color: "#000000",
        text: "",
        textColor: "#000000",
        fontSize: 24,
        design: "",
      });
      this.closeModal("productModal");
    };

    this.openModal("productModal");
  }

  openCheckoutModal() {
    if (this.cart.length === 0) {
      this.showSuccessMessage("Your cart is empty!");
      return;
    }

    // Populate checkout summary
    const checkoutSummary = document.getElementById("checkoutSummary");
    checkoutSummary.innerHTML = `
            <div style="background: hsl(var(--surface-secondary)); padding: 1rem; border-radius: 8px;">
                ${this.cart
                  .map(
                    (item) => `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>${item.product.name} x${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `
                  )
                  .join("")}
                <hr style="margin: 1rem 0; border: none; border-top: 1px solid hsl(var(--border));">
                <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.25rem;">
                    <span>Total:</span>
                    <span>$${this.getCartTotal().toFixed(2)}</span>
                </div>
            </div>
        `;

    this.openModal("checkoutModal");
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById("overlay");

    modal.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById("overlay");

    modal.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Utility Functions
  showSuccessMessage(message) {
    const successMessage = document.getElementById("successMessage");
    const successText = document.getElementById("successText");

    successText.textContent = message;
    successMessage.classList.add("show");

    setTimeout(() => {
      successMessage.classList.remove("show");
    }, 3000);
  }

  scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }

  scrollToCustomization() {
    setTimeout(() => {
      this.scrollToSection("customize");
    }, 100);
  }

  // Event Listeners
  initializeEventListeners() {
    // Navigation
    document.addEventListener("DOMContentLoaded", () => {
      this.updateActiveNavLink();
    });

    window.addEventListener("scroll", () => {
      this.updateActiveNavLink();
    });

    // Mobile menu
    document.getElementById("mobileMenuBtn").addEventListener("click", () => {
      const navMenu = document.getElementById("navMenu");
      navMenu.classList.toggle("active");
    });

    // Search
    document.getElementById("searchInput").addEventListener("input", (e) => {
      const searchTerm = e.target.value;
      const activeFilter =
        document.querySelector(".filter-btn.active").dataset.category;
      this.filterProducts(activeFilter, searchTerm);
    });

    // Filters
    document.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");

        const category = e.target.dataset.category;
        const searchTerm = document.getElementById("searchInput").value;
        this.filterProducts(category, searchTerm);
      });
    });

    // Cart
    document.getElementById("cartBtn").addEventListener("click", () => {
      document.getElementById("cartSidebar").classList.add("open");
      document.getElementById("overlay").classList.add("open");
    });

    document.getElementById("closeCart").addEventListener("click", () => {
      document.getElementById("cartSidebar").classList.remove("open");
      document.getElementById("overlay").classList.remove("open");
    });

    // Customization
    document.querySelectorAll(".color-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        document
          .querySelectorAll(".color-option")
          .forEach((o) => o.classList.remove("active"));
        e.target.classList.add("active");
        this.currentCustomization.color = e.target.dataset.color;
        this.updateProductPreview();
      });
    });

    document.getElementById("textInput").addEventListener("input", (e) => {
      this.currentCustomization.text = e.target.value;
      this.updateProductPreview();
    });

    document.getElementById("fontSizeSlider").addEventListener("input", (e) => {
      this.currentCustomization.fontSize = parseInt(e.target.value);
      this.updateProductPreview();
    });

    document
      .getElementById("textColorPicker")
      .addEventListener("change", (e) => {
        this.currentCustomization.textColor = e.target.value;
        this.updateProductPreview();
      });

    document.querySelectorAll(".design-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        document
          .querySelectorAll(".design-option")
          .forEach((o) => o.classList.remove("active"));
        e.target.classList.add("active");
        this.currentCustomization.design = e.target.textContent;
        this.updateProductPreview();
      });
    });

    document
      .getElementById("resetCustomization")
      .addEventListener("click", () => {
        this.resetCustomization();
      });

    document.getElementById("addToCartBtn").addEventListener("click", () => {
      this.addToCart();
    });

    // Checkout
    document.getElementById("checkoutBtn").addEventListener("click", () => {
      this.openCheckoutModal();
    });

    document.getElementById("checkoutForm").addEventListener("submit", (e) => {
      e.preventDefault();
      this.processCheckout();
    });

    document.getElementById("cancelCheckout").addEventListener("click", () => {
      this.closeModal("checkoutModal");
    });

    // Modal close events
    document.querySelectorAll(".close-modal").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.closest(".modal");
        this.closeModal(modal.id);
      });
    });

    document.getElementById("overlay").addEventListener("click", () => {
      document.querySelectorAll(".modal").forEach((modal) => {
        modal.classList.remove("open");
      });
      document.getElementById("cartSidebar").classList.remove("open");
      document.getElementById("overlay").classList.remove("open");
      document.body.style.overflow = "";
    });

    // Navigation links
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = e.target.getAttribute("href").substring(1);
        this.scrollToSection(targetId);
      });
    });
  }

  updateActiveNavLink() {
    const sections = ["home", "products", "customize"];
    const navLinks = document.querySelectorAll(".nav-link");

    let activeSection = "home";

    sections.forEach((sectionId) => {
      const section = document.getElementById(sectionId);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          activeSection = sectionId;
        }
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${activeSection}`) {
        link.classList.add("active");
      }
    });
  }

  processCheckout() {
    // Simulate checkout process
    const formData = new FormData(document.getElementById("checkoutForm"));
    const orderData = {
      customerInfo: Object.fromEntries(formData),
      items: this.cart,
      total: this.getCartTotal(),
      orderDate: new Date().toISOString(),
    };

    // In a real application, this would send data to a server
    console.log("Order processed:", orderData);

    // Clear cart and close modals
    this.cart = [];
    this.saveCart();
    this.updateCartUI();
    this.closeModal("checkoutModal");
    document.getElementById("cartSidebar").classList.remove("open");
    document.getElementById("overlay").classList.remove("open");

    this.showSuccessMessage("Order placed successfully!");

    // Reset form
    document.getElementById("checkoutForm").reset();
  }
}

// Global utility functions
function scrollToSection(sectionId) {
  if (window.app) {
    window.app.scrollToSection(sectionId);
  }
}

// Initialize application
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new AppState();
  window.app = app; // Make app globally accessible for inline event handlers
});

// Service Worker Registration (for future PWA capabilities)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // Service worker can be added here for offline functionality
    console.log("Service Worker support detected");
  });
}

// Performance optimization: Lazy loading for images
const observerOptions = {
  root: null,
  rootMargin: "50px",
  threshold: 0.1,
};

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    }
  });
}, observerOptions);

// Error handling
window.addEventListener("error", (e) => {
  console.error("Application error:", e.error);
  // In production, this could send errors to a logging service
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason);
  // In production, this could send errors to a logging service
});
