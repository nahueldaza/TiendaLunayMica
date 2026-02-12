// ===== GUÍA PARA MARCAR PRODUCTOS COMO VENDIDO =====
// Cambiar: sold: false → sold: true
// Ejemplo:
// {
//     id: 1,
//     name: 'Musculosa Blanco Crema',
//     ...
//     sold: true  ← Cambiar esto para marcar como vendido
// }
// ====================================================

// Productos de la tienda
const products = [
    {
        id: 1,
        name: 'Musculosa Blanco Crema',
        category: 'remeras',
        price: 2000,
        description: 'Nueva ',
        images: ['images/musculosablancaid1.jpeg', 'images/musculosablancaid1f2.jpeg'],   
        emoji: '👕',
        sizes: ['Talle 2'],
        sold: false
    },
    {
        id: 2,
        name: 'Musculosa Negra',
        category: 'remeras',
        price: 2000,
        description: 'Musculosa negra con tirantes de plastico',
        images: ['images/musculosanegraid2.jpg', 'images/musculosanegraid2f2.jpg'],
        emoji: '🖤',
        sizes: ['Talle 2'],
        sold: false
    },
    {
        id: 3,
        name: 'Jeans Azul Clásico',
        category: 'jeans',
        price: 49.99,
        description: 'Jeans ajustado con estilo clásico',
        emoji: '👖',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        sold: false
    },
    {
        id: 4,
        name: 'Short Nike Bordo',
        category: 'shorts',
        price: 2000,
        description: 'Short deportivo Nike ultra cómodo y resistente',
        images: ['images/shortnikeid4.jpg', 'images/shortnikeid4f2.jpg'],
        emoji: '🩳',
        sizes: ['Talle 2'],
        sold: false
    },
    {
        id: 5,
        name: 'Short negro',
        category: 'shorts',
        price: 2000,
        description: 'Short negro con rayas blancas',
        images: ['images/shortnegrorayasid5.jpeg'],
        emoji: '🩳',
        sizes: ['Talle 2'],
        sold: false
    },
    {
        id: 6,
        name: 'Vestido',
        category: 'vestidos',
        price: 79.99,
        description: 'Vestido negro sofisticado y elegante',
        emoji: '💃',
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        sold: false
    },
    {
        id: 7,
        name: 'Campera de Jean',
        category: 'abrigos',
        price: 14.99,
        description: 'Campera de jean cómoda y de moda',
        emoji: '🧥',
        sizes: ['One Size'],
        sold: false
    },
    {
        id: 8,
        name: 'Campera Slim',
        category: 'abrigos',
        price: 24.99,
        description: 'Campera slim de lana suave y caliente',
        emoji: '🧥',
        sizes: ['One Size'],
        sold: false
    },
    {
        id: 9,
        name: 'Sueter',
        category: 'abrigos',
        price: 89.99,
        description: 'Sueter elegante de lana de alta calidad',
        emoji: '🧣',
        sizes: ['One Size'],
        sold: false
    },
    {
        id: 10,
        name: 'Musculosa blanca',
        category: 'remeras',
        price: 2000,
        description: 'Musculosa blanca rayada con dibujos ',
        images: ['images/musculosarayadaid10.jpeg', 'images/musculosarayadaid10f2.jpeg'],
        emoji: '🌈',
        sizes: ['Talle 2'],
        sold: false
    }
];

// Carrito
let cart = [];

// DOM Elements
const productsList = document.getElementById('productsList');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const filterBtns = document.querySelectorAll('.filter-btn');
const checkoutBtn = document.getElementById('checkoutBtn');

let currentFilter = 'all';

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    setupEventListeners();
    loadCartFromStorage();
    updateCartUI();
});

// Configurar event listeners
function setupEventListeners() {
    // Modal del carrito
    cartBtn.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartModal);
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) closeCartModal();
    });

    // Filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            const filtered = currentFilter === 'all' 
                ? products 
                : products.filter(p => p.category === currentFilter);
            renderProducts(filtered);
        });
    });

    // Checkout
    checkoutBtn.addEventListener('click', checkout);

    // Modal de foto detallada
    const photoModal = document.getElementById('photoModal');
    const photoClose = document.querySelector('.photo-close');
    const photoPrev = document.getElementById('photoPrev');
    const photoNext = document.getElementById('photoNext');
    
    photoClose.addEventListener('click', closePhotoModal);
    
    photoModal.addEventListener('click', (e) => {
        if (e.target === photoModal) closePhotoModal();
    });
    
    photoPrev.addEventListener('click', () => {
        const newIndex = (photoModalIndex - 1 + photoModalImages.length) % photoModalImages.length;
        showPhotoModalImage(newIndex);
    });
    
    photoNext.addEventListener('click', () => {
        const newIndex = (photoModalIndex + 1) % photoModalImages.length;
        showPhotoModalImage(newIndex);
    });
    
    // Navegación por teclado
    document.addEventListener('keydown', (e) => {
        if (photoModal.classList.contains('show')) {
            if (e.key === 'ArrowLeft') {
                photoPrev.click();
            } else if (e.key === 'ArrowRight') {
                photoNext.click();
            } else if (e.key === 'Escape') {
                closePhotoModal();
            }
        }
    });
}

// Renderizar productos
function renderProducts(productsToRender) {
    productsList.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productsList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No hay productos en esta categoría</p>';
        return;
    }

    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        if (product.sold) {
            card.classList.add('sold');
        }
        
        const sizesHTML = product.sizes.map(size => 
            `<button class="size-option" data-size="${size}">${size}</button>`
        ).join('');

        // HTML para la imagen del producto
        let imageHTML = '';
        if (product.images && product.images.length > 0) {
            // Carrusel de fotos
            imageHTML = `
                <div class="product-carousel">
                    <div class="carousel-container">
                        ${product.images.map((img, idx) => 
                            `<img src="${img}" alt="${product.name}" class="carousel-image ${idx === 0 ? 'active' : ''}" />`
                        ).join('')}
                    </div>
                    ${product.images.length > 1 ? `
                        <button class="carousel-btn prev" aria-label="Foto anterior">‹</button>
                        <button class="carousel-btn next" aria-label="Foto siguiente">›</button>
                        <div class="carousel-indicators">
                            ${product.images.map((_, idx) => 
                                `<span class="indicator ${idx === 0 ? 'active' : ''}" data-index="${idx}"></span>`
                            ).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        } else {
            // Modo emoji
            imageHTML = `<div class="product-image-emoji">${product.emoji}</div>`;
        }

        card.innerHTML = `
            ${imageHTML}
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-size">
                    <label>Talla:</label>
                    <div class="size-options">
                        ${sizesHTML}
                    </div>
                </div>
                <button class="btn btn-add-cart" data-product-id="${product.id}" ${product.sold ? 'disabled' : ''}>
                    ${product.sold ? 'Producto Vendido' : 'Agregar al Carrito'}
                </button>
            </div>
        `;

        // Event listeners para tamaño
        const sizeOptions = card.querySelectorAll('.size-option');
        sizeOptions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                sizeOptions.forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        });

        // Event listeners para carrusel
        const carousel = card.querySelector('.product-carousel');
        if (carousel) {
            const images = card.querySelectorAll('.carousel-image');
            const indicators = card.querySelectorAll('.indicator');
            let currentIndex = 0;

            const showImage = (index) => {
                images.forEach((img, i) => {
                    img.classList.toggle('active', i === index);
                });
                indicators.forEach((ind, i) => {
                    ind.classList.toggle('active', i === index);
                });
                currentIndex = index;
            };

            const prevBtn = card.querySelector('.carousel-btn.prev');
            const nextBtn = card.querySelector('.carousel-btn.next');

            if (prevBtn) prevBtn.addEventListener('click', () => {
                const newIndex = (currentIndex - 1 + images.length) % images.length;
                showImage(newIndex);
            });

            if (nextBtn) nextBtn.addEventListener('click', () => {
                const newIndex = (currentIndex + 1) % images.length;
                showImage(newIndex);
            });

            indicators.forEach(indicator => {
                indicator.addEventListener('click', () => {
                    showImage(parseInt(indicator.dataset.index));
                });
            });

            // Event listener para abrir modal de foto al hacer click
            images.forEach((img, idx) => {
                img.style.cursor = 'pointer';
                img.addEventListener('click', () => {
                    openPhotoModal(product.images, idx);
                });
            });
        }

        // Event listener para agregar al carrito
        const addCartBtn = card.querySelector('.btn-add-cart');
        addCartBtn.addEventListener('click', (e) => {
            const selectedSize = card.querySelector('.size-option.selected');
            if (!selectedSize) {
                alert('Por favor, selecciona una talla');
                return;
            }
            addToCart(product, selectedSize.dataset.size);
            sizeOptions.forEach(b => b.classList.remove('selected'));
            addCartBtn.textContent = '✓ Agregado!';
            setTimeout(() => {
                addCartBtn.textContent = 'Agregar al Carrito';
            }, 1500);
        });

        productsList.appendChild(card);
    });
}

// Agregar al carrito
function addToCart(product, size) {
    const existingItem = cart.find(item => item.id === product.id && item.size === size);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            size: size,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartUI();
    console.log(`Agregado: ${product.name} - Talla: ${size}`);
}

// Actualizar UI del carrito
function updateCartUI() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">El carrito está vacío</p>';
        cartTotal.textContent = '0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-details">
                <div class="item-name">${item.emoji} ${item.name}</div>
                <div class="item-meta">Talla: ${item.size}</div>
                <div class="item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Eliminar</button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Actualizar cantidad
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCartToStorage();
            updateCartUI();
        }
    }
}

// Eliminar del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartUI();
}

// Abrir modal del carrito
function openCart() {
    cartModal.classList.add('show');
}

// Cerrar modal del carrito
function closeCartModal() {
    cartModal.classList.remove('show');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Crear mensaje para WhatsApp
    const messageContent = `¡Hola! Tengo un nuevo pedido:

${cart.map(item => `✓ ${item.name} - Talla: ${item.size} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

💰 Total: $${total.toFixed(2)}

Por favor confirmar disponibilidad y envío.
¡Gracias!`;
    
    // Número de WhatsApp (sin + ni espacios)
    const whatsappNumber = '541138092714';
    
    // Crear URL de WhatsApp
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageContent)}`;
    
    // Abrir WhatsApp en nueva ventana
    window.open(whatsappURL, '_blank');
    
    console.log('Pedido enviado a WhatsApp:', cart);
    
    // Limpiar carrito
    cart = [];
    saveCartToStorage();
    updateCartUI();
    closeCartModal();
}

// Modal de Foto Detallada
let photoModalImages = [];
let photoModalIndex = 0;

function openPhotoModal(images, index) {
    photoModalImages = images;
    photoModalIndex = index;
    
    const photoModal = document.getElementById('photoModal');
    const photoModalImage = document.getElementById('photoModalImage');
    const photoIndicators = document.getElementById('photoIndicators');
    
    // Mostrar imagen actual
    photoModalImage.src = images[index];
    
    // Crear indicadores
    photoIndicators.innerHTML = images.map((_, i) => 
        `<span class="photo-indicator ${i === index ? 'active' : ''}" data-index="${i}"></span>`
    ).join('');
    
    // Event listeners para indicadores
    document.querySelectorAll('.photo-indicator').forEach(ind => {
        ind.addEventListener('click', () => {
            showPhotoModalImage(parseInt(ind.dataset.index));
        });
    });
    
    // Mostrar modal
    photoModal.classList.add('show');
}

function showPhotoModalImage(index) {
    photoModalIndex = index;
    const photoModalImage = document.getElementById('photoModalImage');
    const indicators = document.querySelectorAll('.photo-indicator');
    
    photoModalImage.src = photoModalImages[index];
    
    indicators.forEach((ind, i) => {
        ind.classList.toggle('active', i === index);
    });
}

function closePhotoModal() {
    const photoModal = document.getElementById('photoModal');
    photoModal.classList.remove('show');
}

// Event listeners para modal de foto

// Guardar carrito en localStorage
function saveCartToStorage() {
    localStorage.setItem('tiendaDinamicaCart', JSON.stringify(cart));
}

// Cargar carrito de localStorage
function loadCartFromStorage() {
    const saved = localStorage.getItem('tiendaDinamicaCart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}
