// Global Variables
let cart = JSON.parse(localStorage.getItem('asfiFirmCart')) || [];
let isMenuOpen = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupMobileMenu();
    setupContactForm();
    setupShopFunctionality();
    updateCartDisplay();
    setupSmoothScrolling();
    setupModalEvents();
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            isMenuOpen = !isMenuOpen;
            navMenu.classList.toggle('active');
            
            // Animate hamburger menu
            const spans = menuToggle.querySelectorAll('span');
            if (isMenuOpen) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                if (isMenuOpen) {
                    navMenu.classList.remove('active');
                    isMenuOpen = false;
                    const spans = menuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        });
        
        // Close menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (isMenuOpen) {
                    navMenu.classList.remove('active');
                    isMenuOpen = false;
                    const spans = menuToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            });
        });
    }
}

// Contact Form Validation and Submission
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm()) {
                submitContactForm();
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    }
}

function validateContactForm() {
    const form = document.getElementById('contactForm');
    let isValid = true;
    
    // Name validation
    const name = form.name.value.trim();
    if (name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters long');
        isValid = false;
    }
    
    // Email validation
    const email = form.email.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation (optional but if provided, must be valid)
    const phone = form.phone.value.trim();
    if (phone && phone.length < 10) {
        showError('phoneError', 'Please enter a valid phone number');
        isValid = false;
    }
    
    // Subject validation
    if (!form.subject.value) {
        showError('subjectError', 'Please select a subject');
        isValid = false;
    }
    
    // Message validation
    const message = form.message.value.trim();
    if (message.length < 10) {
        showError('messageError', 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    
    switch(fieldName) {
        case 'name':
            if (value.length < 2) {
                showError('nameError', 'Name must be at least 2 characters long');
                return false;
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError('emailError', 'Please enter a valid email address');
                return false;
            }
            break;
        case 'phone':
            if (value && value.length < 10) {
                showError('phoneError', 'Please enter a valid phone number');
                return false;
            }
            break;
        case 'subject':
            if (!value) {
                showError('subjectError', 'Please select a subject');
                return false;
            }
            break;
        case 'message':
            if (value.length < 10) {
                showError('messageError', 'Message must be at least 10 characters long');
                return false;
            }
            break;
    }
    
    clearError(field);
    return true;
}

function showError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearError(field) {
    const errorElement = document.getElementById(field.name + 'Error');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function submitContactForm() {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    // Simulate form submission (in real app, you'd send to server)
    setTimeout(() => {
        form.style.display = 'none';
        formSuccess.style.display = 'block';
        
        // Reset form after 5 seconds
        setTimeout(() => {
            form.reset();
            form.style.display = 'block';
            formSuccess.style.display = 'none';
        }, 5000);
    }, 1000);
}

// Shop Functionality
function setupShopFunctionality() {
    setupProductFilters();
    setupAddToCart();
    setupCartModal();
    setupCheckout();
}

function setupProductFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const category = this.dataset.category;
            
            products.forEach(product => {
                if (category === 'all' || product.dataset.category.includes(category)) {
                    product.style.display = 'block';
                    product.style.animation = 'fadeIn 0.5s ease';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });
}

function setupAddToCart() {
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const product = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: parseFloat(this.dataset.price),
                image: this.dataset.image,
                quantity: 1
            };
            
            addToCart(product);
            showAddToCartAnimation(this);
        });
    });
}

function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }
    
    localStorage.setItem('asfiFirmCart', JSON.stringify(cart));
    updateCartDisplay();
}

function showAddToCartAnimation(btn) {
    const originalText = btn.textContent;
    btn.textContent = 'Added! ✓';
    btn.style.backgroundColor = '#27ae60';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        btn.disabled = false;
    }, 2000);
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total;
    }
}

function setupCartModal() {
    const viewCartBtn = document.getElementById('viewCartBtn');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const continueShopping = document.getElementById('continueShopping');
    
    if (viewCartBtn && cartModal) {
        viewCartBtn.addEventListener('click', function() {
            displayCartItems();
            cartModal.style.display = 'block';
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
    }
    
    if (continueShopping) {
        continueShopping.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
    }
}

function displayCartItems() {
    const cartItems = document.getElementById('cartItems');
    const modalSubtotal = document.getElementById('modalSubtotal');
    const modalTotal = document.getElementById('modalTotal');
    const deliveryFee = 50;
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        modalSubtotal.textContent = '0';
        modalTotal.textContent = '0';
        return;
    }
    
    let cartHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>৳${item.price} each</p>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
                <div class="cart-item-price">৳${itemTotal}</div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">×</button>
            </div>
        `;
    });
    
    cartItems.innerHTML = cartHTML;
    modalSubtotal.textContent = subtotal;
    modalTotal.textContent = subtotal + (subtotal > 0 ? deliveryFee : 0);
}

function updateQuantity(productId, change) {
    const product = cart.find(item => item.id === productId);
    
    if (product) {
        product.quantity += change;
        
        if (product.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('asfiFirmCart', JSON.stringify(cart));
            updateCartDisplay();
            displayCartItems();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('asfiFirmCart', JSON.stringify(cart));
    updateCartDisplay();
    displayCartItems();
}

function setupCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckout = document.getElementById('closeCheckout');
    const backToCart = document.getElementById('backToCart');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const cartModal = document.getElementById('cartModal');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            cartModal.style.display = 'none';
            displayCheckoutItems();
            checkoutModal.style.display = 'block';
        });
    }
    
    if (closeCheckout) {
        closeCheckout.addEventListener('click', function() {
            checkoutModal.style.display = 'none';
        });
    }
    
    if (backToCart) {
        backToCart.addEventListener('click', function() {
            checkoutModal.style.display = 'none';
            cartModal.style.display = 'block';
        });
    }
    
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', function() {
            processOrder();
        });
    }
}

function displayCheckoutItems() {
    const checkoutItems = document.getElementById('checkoutItems');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutTotal = document.getElementById('checkoutTotal');
    const deliveryFee = 50;
    
    if (!checkoutItems) return;
    
    let itemsHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #eee;">
                <span>${item.name} × ${item.quantity}</span>
                <span>৳${itemTotal}</span>
            </div>
        `;
    });
    
    checkoutItems.innerHTML = itemsHTML;
    checkoutSubtotal.textContent = subtotal;
    checkoutTotal.textContent = subtotal + deliveryFee;
}

function processOrder() {
    const form = document.getElementById('checkoutForm');
    
    if (!validateCheckoutForm(form)) {
        return;
    }
    
    // Generate order ID
    const orderId = 'ASFI' + Date.now().toString().slice(-8);
    
    // Show success modal
    const checkoutModal = document.getElementById('checkoutModal');
    const successModal = document.getElementById('successModal');
    const orderIdElement = document.getElementById('orderId');
    
    checkoutModal.style.display = 'none';
    orderIdElement.textContent = orderId;
    successModal.style.display = 'block';
    
    // Clear cart
    cart = [];
    localStorage.removeItem('asfiFirmCart');
    updateCartDisplay();
    
    // Reset form
    form.reset();
}

function validateCheckoutForm(form) {
    const customerName = form.customerName.value.trim();
    const customerPhone = form.customerPhone.value.trim();
    const deliveryAddress = form.deliveryAddress.value.trim();
    
    if (!customerName) {
        alert('Please enter your full name');
        return false;
    }
    
    if (!customerPhone || customerPhone.length < 10) {
        alert('Please enter a valid phone number');
        return false;
    }
    
    if (!deliveryAddress) {
        alert('Please enter your delivery address');
        return false;
    }
    
    return true;
}

function setupModalEvents() {
    const successModal = document.getElementById('successModal');
    const closeSuccess = document.getElementById('closeSuccess');
    
    if (closeSuccess) {
        closeSuccess.addEventListener('click', function() {
            successModal.style.display = 'none';
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Smooth Scrolling for anchor links
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Scroll animations and effects
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.backgroundColor = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.feature, .gallery-item, .product-card, .faq-item, .delivery-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Utility Functions
function formatCurrency(amount) {
    return '৳' + amount.toLocaleString('bn-BD');
}

function generateOrderId() {
    return 'ASFI' + Date.now().toString(36).toUpperCase();
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);
