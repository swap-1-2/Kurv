// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAHYAgCbh7Su_j94P2NocHPAS61YGjYnQw",
    authDomain: "kurv-mobile-app.firebaseapp.com",
    projectId: "kurv-mobile-app",
    storageBucket: "kurv-mobile-app.firebasestorage.app",
    messagingSenderId: "74456064312",
    appId: "1:74456064312:web:b55d2056b7a07873b821cd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Firebase auth variables
let confirmationResult;
let recaptchaVerifier;

// Categories and products data (will be loaded from Firestore)
let categories = [];
let allProducts = {};

// Global variables
let cart = {};
let orders = [];
let products = [];
let user = null;
let currentSection = 'categories';
let currentCategory = null;
let currentAddress = null;
let viewMode = 'grid'; // 'grid' or 'list'
let categoryViewMode = 'grid'; // 'grid' or 'list' for categories
let otpSent = false; // Track if OTP has been sent

// Smooth scroll for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scroll offset for fixed header
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                // First, ensure the home section is visible
                const homeSection = document.getElementById('home');
                if (homeSection && homeSection.classList.contains('hidden')) {
                    showHome();
                    // Wait a moment for the section to be visible
                    setTimeout(() => {
                        const headerHeight = document.querySelector('.pro-header').offsetHeight;
                        const targetPosition = targetSection.offsetTop - headerHeight - 40;
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }, 100);
                } else {
                    const headerHeight = document.querySelector('.pro-header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 40;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Highlight active section on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.content-section');
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.style.color = '#1E40AF';
                        link.style.fontWeight = '600';
                    } else {
                        link.style.fontWeight = '500';
                    }
                });
            }
        });
    });
});

// Mobile menu functions
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.toggle('mobile-active');
    document.body.style.overflow = mobileNav.classList.contains('mobile-active') ? 'hidden' : '';
}

function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    mobileNav.classList.remove('mobile-active');
    document.body.style.overflow = '';
}

function handleMobileNav(event) {
    if (window.innerWidth <= 768) {
        event.preventDefault();
        const navItem = event.target.closest('.nav-item-dropdown');
        navItem.classList.toggle('mobile-open');
    }
}

// Debug function for testing
function testOTP() {
    const storedOTP = localStorage.getItem('temp_otp');
    const phone = localStorage.getItem('temp_phone');
    const timestamp = localStorage.getItem('otp_timestamp');
    console.log('Debug - Stored OTP:', storedOTP);
    console.log('Debug - Stored Phone:', phone);
    console.log('Debug - Timestamp:', timestamp);
    
    if (storedOTP) {
        const otpInput = document.getElementById('otpInput');
        if (otpInput) {
            otpInput.value = storedOTP;
            console.log('Auto-filled OTP for testing');
        }
    }
}

// Load categories and products from Firestore
async function loadCategoriesFromFirestore() {
    try {
        console.log('🔍 Loading categories from Firestore...');
        const snapshot = await db.collection('categories').get();
        categories = [];
        snapshot.forEach(doc => {
            const categoryData = doc.data();
            console.log('✅ Found category:', categoryData);
            categories.push(categoryData);
        });
        console.log('📊 Total categories loaded:', categories.length);
        console.log('📋 Categories:', categories);
        
        if (categories.length === 0) {
            console.warn('⚠️ No categories found in Firestore! Please add categories via admin panel.');
        }
    } catch (error) {
        console.error('❌ Error loading categories:', error);
        showToast('Error loading categories: ' + error.message);
    }
}

async function loadProductsFromFirestore() {
    try {
        console.log('🔍 Loading products from Firestore...');
        const snapshot = await db.collection('products').get();
        allProducts = {};
        snapshot.forEach(doc => {
            const product = doc.data();
            console.log('✅ Found product:', product);
            if (!allProducts[product.category]) {
                allProducts[product.category] = [];
            }
            allProducts[product.category].push(product);
        });
        console.log('📊 Total product categories:', Object.keys(allProducts).length);
        console.log('📋 Products by category:', allProducts);
        
        if (Object.keys(allProducts).length === 0) {
            console.warn('⚠️ No products found in Firestore! Please add products via admin panel.');
        }
    } catch (error) {
        console.error('❌ Error loading products:', error);
        showToast('Error loading products: ' + error.message);
    }
}

// Global arrays to store services and solutions
let services = [];
let solutions = [];

async function loadSolutionsFromFirestore() {
    try {
        console.log('🔍 Loading solutions from Firestore...');
        const snapshot = await db.collection('solutions').get();
        solutions = [];
        snapshot.forEach(doc => {
            const solutionData = doc.data();
            console.log('✅ Found solution:', solutionData);
            solutions.push(solutionData);
        });
        console.log('📊 Total solutions loaded:', solutions.length);
        console.log('📋 Solutions:', solutions);
        
        if (solutions.length === 0) {
            console.warn('⚠️ No solutions found in Firestore! Using default solutions.');
            solutions = [
                { id: 'solution1', title: 'Custom Manufacturing', description: 'Tailored manufacturing solutions for your specific requirements', icon: 'fa-cog' },
                { id: 'solution2', title: 'Supply Chain Management', description: 'Streamlined supply chain and logistics management', icon: 'fa-box' },
                { id: 'solution3', title: 'Technical Support', description: '24/7 technical support and maintenance services', icon: 'fa-headset' }
            ];
        }
        
        // Render solutions on the page
        renderSolutions();
    } catch (error) {
        console.error('❌ Error loading solutions:', error);
        showToast('Error loading solutions: ' + error.message);
    }
}

async function loadServicesFromFirestore() {
    try {
        console.log('🔍 Loading services from Firestore...');
        const snapshot = await db.collection('services').get();
        services = [];
        snapshot.forEach(doc => {
            const serviceData = doc.data();
            console.log('✅ Found service:', serviceData);
            services.push(serviceData);
        });
        console.log('📊 Total services loaded:', services.length);
        console.log('📋 Services:', services);
        
        if (services.length === 0) {
            console.warn('⚠️ No services found in Firestore! Using default services.');
            services = [
                { id: 'service1', title: 'Manufacturing Solutions', description: 'Comprehensive manufacturing solutions for industrial needs', icon: 'fa-industry' },
                { id: 'service2', title: 'Trading & Distribution', description: 'Efficient trading and distribution services', icon: 'fa-truck' },
                { id: 'service3', title: 'Quality Assurance', description: 'Rigorous quality control and assurance processes', icon: 'fa-check-circle' }
            ];
        }
        
        // Render services on the page
        renderServices();
    } catch (error) {
        console.error('❌ Error loading services:', error);
        showToast('Error loading services: ' + error.message);
    }
}

function renderServices() {
    const servicesContainer = document.querySelector('#services-details .content-wrapper');
    if (!servicesContainer) return;
    
    if (services.length === 0) {
        servicesContainer.innerHTML = '<p style="text-align: center; color: #666;">No services available at the moment.</p>';
        return;
    }
    
    servicesContainer.innerHTML = services.map(service => {
        // Check if icon is an image URL or Font Awesome class
        const isImageUrl = service.icon && (service.icon.startsWith('http://') || service.icon.startsWith('https://') || service.icon.startsWith('data:'));
        const iconDisplay = isImageUrl 
            ? `<img src="${service.icon}" alt="${service.title}" style="width: 60px; height: 60px; object-fit: contain; margin-bottom: 1rem;">` 
            : `<i class="fas ${service.icon || 'fa-cogs'}"></i>`;
        
        return `
            <div class="service-detail-card" onclick="showServiceDetails('${service.id}')" style="cursor: pointer;">
                ${iconDisplay}
                <h3>${service.title}</h3>
                <p>${service.description}</p>
            </div>
        `;
    }).join('');
}

function renderSolutions() {
    const solutionsContainer = document.querySelector('#solutions-details .content-wrapper');
    if (!solutionsContainer) return;
    
    if (solutions.length === 0) {
        solutionsContainer.innerHTML = `
            <div class="solution-card">
                <i class="fas fa-info-circle"></i>
                <h3>No Solutions Available</h3>
                <p>Solutions will be displayed here once added via admin panel.</p>
            </div>
        `;
        return;
    }
    
    solutionsContainer.innerHTML = solutions.map(solution => {
        // Check if icon is an image URL or Font Awesome class
        const isImageUrl = solution.icon && (solution.icon.startsWith('http://') || solution.icon.startsWith('https://') || solution.icon.startsWith('data:'));
        const iconDisplay = isImageUrl 
            ? `<img src="${solution.icon}" alt="${solution.title}" style="width: 60px; height: 60px; object-fit: contain; margin-bottom: 1rem;">` 
            : `<i class="fas ${solution.icon || 'fa-lightbulb'}"></i>`;
        
        return `
            <div class="solution-card" onclick="showSolutionDetails('${solution.id}')" style="cursor: pointer;">
                ${iconDisplay}
                <h3>${solution.title || 'Solution'}</h3>
                <p>${solution.description || ''}</p>
            </div>
        `;
    }).join('');
}


// Initialize app
document.addEventListener('DOMContentLoaded', async function() {
    console.log('App initializing...');
    
    // Load data from Firestore
    await loadCategoriesFromFirestore();
    await loadProductsFromFirestore();
    await loadServicesFromFirestore();
    await loadSolutionsFromFirestore();
    
    loadData();
    
    // Load saved view mode
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode) {
        viewMode = savedViewMode;
    }
    
    // Load saved category view mode
    const savedCategoryViewMode = localStorage.getItem('categoryViewMode');
    if (savedCategoryViewMode) {
        categoryViewMode = savedCategoryViewMode;
    }
    
    updateCartBadges();
    
    // Show home page by default (no login required)
    showHome();
    
    console.log('App initialized successfully');
    
    // Add debug functions to global scope
    window.clearAllData = function() {
        localStorage.clear();
        location.reload();
    };

    
    window.testSendOtp = function() {
        console.log('Testing sendOtp directly...');
        try {
            sendOtp();
        } catch (error) {
            console.error('Error in sendOtp:', error);
            alert('Error: ' + error.message);
        }
    };
});

// Load data from localStorage
function loadData() {
    // Clear any old cart data and start fresh
    localStorage.removeItem('cart');
    cart = {};
    
    // Load orders
    loadOrders();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load orders from localStorage
function loadOrders() {
    if (user) {
        const savedOrders = localStorage.getItem(`orders_${user}`);
        if (savedOrders && savedOrders !== 'undefined') {
            try {
                orders = JSON.parse(savedOrders);
            } catch (error) {
                console.error('Error parsing orders data:', error);
                orders = [];
            }
        }
    }
}

// Save orders to localStorage
function saveOrders() {
    if (user) {
        localStorage.setItem(`orders_${user}`, JSON.stringify(orders));
    }
}

// Firebase Authentication functions
function initializeRecaptcha() {
    if (!recaptchaVerifier) {
        try {
            // Show the reCAPTCHA container
            const recaptchaContainer = document.getElementById('recaptcha-container');
            if (recaptchaContainer) {
                recaptchaContainer.style.display = 'block';
                recaptchaContainer.innerHTML = ''; // Clear any previous content
            }
            
            console.log('Initializing reCAPTCHA...');
            
            recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'normal',
                'callback': (response) => {
                    console.log('✅ reCAPTCHA solved successfully!', response);
                },
                'expired-callback': () => {
                    console.log('❌ reCAPTCHA expired - please try again');
                    showToast('reCAPTCHA expired. Please try again.');
                },
                'error-callback': (error) => {
                    console.log('❌ reCAPTCHA error:', error);
                    showToast('reCAPTCHA error. Please refresh and try again.');
                }
            });
            
            // Render the reCAPTCHA
            return recaptchaVerifier.render().then(() => {
                console.log('✅ reCAPTCHA rendered successfully');
            }).catch((error) => {
                console.error('❌ reCAPTCHA render error:', error);
                throw error;
            });
            
        } catch (error) {
            console.error('❌ Error initializing reCAPTCHA:', error);
            recaptchaVerifier = null;
            throw error;
        }
    }
    
    return Promise.resolve();
}

async function sendFirebaseOtp() {
    const phoneInput = document.getElementById('phone');
    
    if (!phoneInput) {
        showToast('Phone input not found');
        return;
    }
    
    const phone = phoneInput.value.trim();
    
    // Validate phone number
    if (!phone) {
        showToast('Please enter a mobile number');
        return;
    }
    
    // Validate phone number format
    if (!phone.startsWith('+') || phone.length < 10) {
        showToast('Please enter phone number with country code (e.g., +47000000)');
        return;
    }
    
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    
    // Show loading state
    if (sendOtpBtn) {
        sendOtpBtn.textContent = 'Sending...';
        sendOtpBtn.disabled = true;
    }
    
    try {
        // Initialize reCAPTCHA if not already done or if this is a resend
        const isResend = sendOtpBtn && sendOtpBtn.textContent === 'Resend OTP';
        
        if (!recaptchaVerifier || isResend) {
            // Clear any existing success message
            const recaptchaContainer = document.getElementById('recaptcha-container');
            if (recaptchaContainer && isResend) {
                recaptchaContainer.innerHTML = '';
                recaptchaContainer.style.display = 'none';
                
                // Clear existing verifier for resend
                if (recaptchaVerifier) {
                    try {
                        recaptchaVerifier.clear();
                    } catch (e) {
                        console.log('Error clearing reCAPTCHA for resend:', e);
                    }
                    recaptchaVerifier = null;
                }
            }
            
            await initializeRecaptcha();
        }
        
        console.log('Attempting to send OTP to:', phone);
        console.log('reCAPTCHA verifier ready:', !!recaptchaVerifier);
        console.log('Firebase auth instance:', !!auth);
        console.log('Phone format check:', phone.startsWith('+') ? 'Valid format' : 'Invalid format');
        
        // Send OTP via Firebase
        console.log('Calling signInWithPhoneNumber...');
        confirmationResult = await auth.signInWithPhoneNumber(phone, recaptchaVerifier);
        
        console.log('OTP sent successfully, confirmation result:', !!confirmationResult);
        console.log('Confirmation result details:', confirmationResult);
        
        // Hide reCAPTCHA after successful OTP send
        const recaptchaContainer = document.getElementById('recaptcha-container');
        if (recaptchaContainer) {
            recaptchaContainer.style.display = 'none';
            // Show success message in place of reCAPTCHA
            recaptchaContainer.innerHTML = '<div style="text-align: center; color: #4CAF50; padding: 10px; font-size: 14px;">✅ Verification completed</div>';
            recaptchaContainer.style.display = 'block';
        }
        
        // Show OTP section
        const otpSection = document.getElementById('otpSection');
        if (otpSection) {
            otpSection.style.display = 'block';
        }
        
        // Store phone for later use
        localStorage.setItem('temp_phone', phone);
        
        showToast('OTP sent successfully! Check your phone.');
        
        // Update button text to indicate success
        if (sendOtpBtn) {
            sendOtpBtn.textContent = 'Resend OTP';
            sendOtpBtn.disabled = false;
        }
        
    } catch (error) {
        console.error('Detailed error sending OTP:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        
        let errorMessage = 'Error sending OTP: ';
        
        // Handle specific Firebase errors
        switch (error.code) {
            case 'auth/invalid-phone-number':
                errorMessage = 'Invalid phone number format. Use +4796985758';
                break;
            case 'auth/missing-phone-number':
                errorMessage = 'Please enter a phone number';
                break;
            case 'auth/quota-exceeded':
                errorMessage = 'SMS quota exceeded. Try again later.';
                break;
            case 'auth/captcha-check-failed':
                errorMessage = 'reCAPTCHA verification failed. Please try again.';
                break;
            default:
                errorMessage += error.message;
        }
        
        showToast(errorMessage);
        
        // Reset reCAPTCHA on error
        if (recaptchaVerifier) {
            try {
                recaptchaVerifier.clear();
            } catch (e) {
                console.log('reCAPTCHA clear error:', e);
            }
            recaptchaVerifier = null;
        }
        
        // Hide reCAPTCHA container on error and reset
        const recaptchaContainer = document.getElementById('recaptcha-container');
        if (recaptchaContainer) {
            recaptchaContainer.style.display = 'none';
            recaptchaContainer.innerHTML = '';
        }
        
        // Reset button to initial state
        if (sendOtpBtn) {
            sendOtpBtn.textContent = 'Send OTP';
            sendOtpBtn.disabled = false;
        }
    }
}

async function verifyFirebaseOtp() {
    const otpInput = document.getElementById('otpInput');
    
    if (!otpInput) {
        showToast('OTP input not found');
        return;
    }
    
    const enteredOtp = otpInput.value.trim();
    
    if (!enteredOtp) {
        showToast('Please enter the OTP');
        return;
    }
    
    if (!confirmationResult) {
        showToast('Please request OTP first');
        return;
    }
    
    const verifyBtn = document.querySelector('[onclick="verifyFirebaseOtp()"]');
    if (verifyBtn) {
        verifyBtn.textContent = 'Verifying...';
        verifyBtn.disabled = true;
    }
    
    try {
        // Verify OTP with Firebase
        const result = await confirmationResult.confirm(enteredOtp);
        const firebaseUser = result.user;
        
        console.log('Firebase user verified:', firebaseUser);
        
        // Set user as logged in
        const phone = localStorage.getItem('temp_phone');
        user = phone;
        localStorage.setItem('user', user);
        
        // Clear temp data
        localStorage.removeItem('temp_phone');
        
        // Load user's orders
        loadOrders();
        
        // Show navigation and header
        const bottomNav = document.getElementById('bottomNav');
        const appHeader = document.getElementById('appHeader');
        if (bottomNav) bottomNav.style.display = 'flex';
        if (appHeader) appHeader.style.display = 'block';
        
        showToast('Login successful! Welcome to Kurv');
        showCategories();
        
    } catch (error) {
        console.error('Error verifying OTP:', error);
        showToast('Invalid OTP. Please try again.');
    } finally {
        // Reset button
        if (verifyBtn) {
            verifyBtn.textContent = 'Verify OTP';
            verifyBtn.disabled = false;
        }
    }
}

// Quick test login (bypass OTP for testing)
function quickTestLogin() {
    // Set a test user
    const testPhone = '+47' + Math.floor(Math.random() * 100000000);
    user = testPhone;
    localStorage.setItem('user', user);
    
    // Load user's orders
    loadOrders();
    
    // Show navigation and header
    const bottomNav = document.getElementById('bottomNav');
    const appHeader = document.getElementById('appHeader');
    if (bottomNav) bottomNav.style.display = 'flex';
    if (appHeader) appHeader.style.display = 'block';
    
    showToast('🚀 Test login successful! Phone: ' + testPhone);
    showCategories();
}

// Reload data from Firestore
async function reloadData() {
    await loadCategoriesFromFirestore();
    await loadProductsFromFirestore();
    await loadServicesFromFirestore();
    await loadSolutionsFromFirestore();
    renderCategories();
}

// Add reload data to global scope
window.reloadData = reloadData;

// Legacy Authentication functions (keeping for backward compatibility)
function sendOtp() {
    const phoneInput = document.getElementById('phone');
    
    if (!phoneInput) {
        showToast('Phone input not found');
        return;
    }
    
    const phone = phoneInput.value.trim();
    
    // Validate phone number
    if (!phone) {
        showToast('Please enter a mobile number');
        return;
    }
    
    // Remove any non-digit characters for validation
    const phoneDigits = phone.replace(/\D/g, '');
    
    // Accept 8+ digit numbers for demo purposes
    if (phoneDigits.length < 8 || phoneDigits.length > 15) {
        showToast(`Please enter a valid mobile number (${phoneDigits.length} digits entered, need 8-15)`);
        return;
    }
    
    // Normalize the phone number for storage
    let normalizedPhone = phoneDigits;
    if (phoneDigits.length === 12 && phoneDigits.startsWith('91')) {
        normalizedPhone = phoneDigits.substring(2);
    } else if (phoneDigits.length === 11 && phoneDigits.startsWith('1')) {
        normalizedPhone = phoneDigits.substring(1);
    }
    
    // Clear any previous OTP data
    localStorage.removeItem('temp_otp');
    localStorage.removeItem('temp_phone');
    localStorage.removeItem('otp_timestamp');
    
    // Generate 6-digit OTP for demo
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    
    // Show OTP section
    const otpSection = document.getElementById('otpSection');
    const otpCode = document.getElementById('otpCode');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    
    if (otpSection && otpCode) {
        otpSection.style.display = 'block';
        otpCode.textContent = otp;
        
        // Update button text
        if (sendOtpBtn) {
            sendOtpBtn.textContent = 'Resend OTP';
        }
        
        // Store OTP data
        localStorage.setItem('temp_otp', otp);
        localStorage.setItem('temp_phone', normalizedPhone);
        localStorage.setItem('otp_timestamp', Date.now().toString());
        
        // Set OTP sent state
        otpSent = true;
        
        showToast('OTP sent: ' + otp);
    } else {
        showToast('Error: Could not display OTP section');
    }
}

function verifyOtp() {
    // Check if OTP section is visible
    const otpSection = document.getElementById('otpSection');
    if (!otpSection || otpSection.style.display === 'none') {
        showToast('Please send OTP first');
        return;
    }
    
    const otpInput = document.getElementById('otpInput');
    
    if (!otpInput) {
        showToast('OTP input not found');
        return;
    }
    
    const enteredOtp = otpInput.value.trim();
    const storedOtp = localStorage.getItem('temp_otp');
    const phone = localStorage.getItem('temp_phone');
    const otpTimestamp = localStorage.getItem('otp_timestamp');
    
    if (!enteredOtp) {
        showToast('Please enter the OTP');
        return;
    }
    
    if (!storedOtp) {
        showToast('No OTP found. Please request a new one');
        return;
    }
    
    // Check if OTP is expired (5 minutes)
    if (otpTimestamp) {
        const now = Date.now();
        const otpAge = now - parseInt(otpTimestamp);
        if (otpAge > 5 * 60 * 1000) {
            localStorage.removeItem('temp_otp');
            localStorage.removeItem('temp_phone');
            localStorage.removeItem('otp_timestamp');
            showToast('OTP expired. Please request a new one');
            resetAuthForm();
            return;
        }
    }
    
    // Verify OTP
    if (String(enteredOtp) === String(storedOtp)) {
        // Set user as logged in
        user = phone;
        localStorage.setItem('user', user);
        
        // Clear OTP data
        localStorage.removeItem('temp_otp');
        localStorage.removeItem('temp_phone');
        localStorage.removeItem('otp_timestamp');
        otpSent = false;
        
        // Load user's orders
        loadOrders();
        
        // Show navigation and header
        const bottomNav = document.getElementById('bottomNav');
        const appHeader = document.getElementById('appHeader');
        if (bottomNav) bottomNav.style.display = 'flex';
        if (appHeader) appHeader.style.display = 'block';
        
        showToast('Login successful! Welcome to Kurv');
        showCategories();
    } else {
        showToast('Invalid OTP. Please try again');
    }
}

function logout() {
    user = null;
    cart = {};
    orders = [];
    otpSent = false;
    
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('temp_otp');
    localStorage.removeItem('temp_phone');
    localStorage.removeItem('otp_timestamp');
    
    // Reset Firebase auth state
    if (recaptchaVerifier) {
        try {
            recaptchaVerifier.clear();
        } catch (e) {
            console.log('reCAPTCHA clear error on logout:', e);
        }
        recaptchaVerifier = null;
    }
    confirmationResult = null;
    
    // Hide OTP section and reCAPTCHA
    const otpSection = document.getElementById('otpSection');
    const recaptchaContainer = document.getElementById('recaptcha-container');
    
    if (otpSection) {
        otpSection.style.display = 'none';
    }
    
    if (recaptchaContainer) {
        recaptchaContainer.style.display = 'none';
        recaptchaContainer.innerHTML = ''; // Clear reCAPTCHA content completely
    }
    
    // Clear input fields
    const phoneInput = document.getElementById('phone');
    const otpInput = document.getElementById('otpInput');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    
    if (phoneInput) phoneInput.value = '';
    if (otpInput) otpInput.value = '';
    
    // Reset send OTP button
    if (sendOtpBtn) {
        sendOtpBtn.textContent = 'Send OTP';
        sendOtpBtn.disabled = false;
    }
    
    // Hide header and navigation
    const bottomNav = document.getElementById('bottomNav');
    const appHeader = document.getElementById('appHeader');
    if (bottomNav) bottomNav.style.display = 'none';
    if (appHeader) appHeader.style.display = 'none';
    
    showLaunch();
    updateCartBadges();
    showToast('Logged out successfully');
}

// Navigation functions
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.style.display = 'block';
        currentSection = sectionName;
    }
    
    // Initialize view mode buttons for current section
    if (sectionName === 'categories') {
        initializeCategoryViewButtons();
    } else if (sectionName === 'catalog') {
        initializeCatalogViewButtons();
    }
    
    // Update navigation
    updateNavigation();
}

function initializeCategoryViewButtons() {
    const gridBtn = document.getElementById('categoryGridViewBtn');
    const listBtn = document.getElementById('categoryListViewBtn');
    
    if (gridBtn && listBtn) {
        gridBtn.classList.toggle('active', categoryViewMode === 'grid');
        listBtn.classList.toggle('active', categoryViewMode === 'list');
    }
    
    // Update categories grid class
    const categoryGrid = document.getElementById('categoryGrid');
    if (categoryGrid) {
        categoryGrid.classList.toggle('list-view', categoryViewMode === 'list');
    }
}

function initializeCatalogViewButtons() {
    const gridBtn = document.getElementById('gridViewBtn');
    const listBtn = document.getElementById('listViewBtn');
    
    if (gridBtn && listBtn) {
        gridBtn.classList.toggle('active', viewMode === 'grid');
        listBtn.classList.toggle('active', viewMode === 'list');
    }
    
    // Update catalog container class
    const catalogGrid = document.getElementById('catalogGrid');
    if (catalogGrid) {
        catalogGrid.classList.toggle('list-view', viewMode === 'list');
    }
}

function updateNavigation() {
    // Add any navigation updates here if needed
}

// Navigation functions
function showHome() {
    hideAllSections();
    document.getElementById('home').classList.remove('hidden');
    updateNavActive('home');
    
    // Show navigation and header
    const bottomNav = document.getElementById('bottomNav');
    const appHeader = document.getElementById('appHeader');
    if (bottomNav) bottomNav.style.display = 'flex';
    if (appHeader) appHeader.style.display = 'block';
}

function showServicesDetails() {
    hideAllSections();
    document.getElementById('services-details').classList.remove('hidden');
}

function showSolutionsDetails() {
    hideAllSections();
    document.getElementById('solutions-details').classList.remove('hidden');
}

function hideAllSections() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('hidden'));
}

function updateNavActive(activeNav) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    // Find and activate the matching nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const onclick = item.getAttribute('onclick');
        if (onclick && onclick.includes(activeNav)) {
            item.classList.add('active');
        }
    });
}

function showCategories() {
    console.log('📱 Showing categories page...');
    console.log('📊 Available categories:', categories);
    
    hideAllSections();
    document.getElementById('categories').classList.remove('hidden');
    renderCategories();
    initializeCategoryViewButtons();
    
    // Show navigation and header
    const bottomNav = document.getElementById('bottomNav');
    const appHeader = document.getElementById('appHeader');
    if (bottomNav) bottomNav.style.display = 'flex';
    if (appHeader) appHeader.style.display = 'block';
}

function showCategory(categoryId) {
    currentCategory = categoryId;
    products = allProducts[categoryId] || [];
    hideAllSections();
    document.getElementById('catalog').classList.remove('hidden');
    
    // Initialize view mode buttons
    setTimeout(() => {
        initializeCatalogViewButtons();
    }, 100);
    
    renderCatalog();
}

function showCart() {
    hideAllSections();
    document.getElementById('cart').classList.remove('hidden');
    currentSection = 'cart';
    renderCart();
    updateNavActive('cart');
}

function showOrders() {
    hideAllSections();
    document.getElementById('orders').classList.remove('hidden');
    renderOrders();
}

function showProfile() {
    // Check if we're in the single-page layout (home section visible)
    const homeSection = document.getElementById('home');
    if (homeSection && !homeSection.classList.contains('hidden')) {
        // In single-page layout, just scroll to profile section
        const profileSection = document.getElementById('profile');
        if (profileSection) {
            const headerHeight = document.querySelector('.pro-header')?.offsetHeight || 0;
            const targetPosition = profileSection.offsetTop - headerHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    } else {
        // In multi-section layout (catalog mode), hide other sections
        hideAllSections();
        document.getElementById('profile').classList.remove('hidden');
        renderProfile();
        updateNavActive('profile');
    }
}

function showAddress() {
    // Allow access to contact form even with empty cart
    // Users can make enquiries without adding items to cart
    
    hideAllSections();
    document.getElementById('address').classList.remove('hidden');
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Add real-time validation listeners
    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('customerEmail');
    const phoneInput = document.getElementById('deliveryPhone');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    
    if (nameInput && !nameInput.hasAttribute('data-listener-added')) {
        nameInput.setAttribute('data-listener-added', 'true');
        nameInput.addEventListener('blur', function() {
            const name = this.value.trim();
            if (!name) {
                nameError.textContent = 'Full name is required';
                nameError.style.display = 'block';
            } else {
                nameError.style.display = 'none';
            }
        });
    }
    
    if (emailInput && !emailInput.hasAttribute('data-listener-added')) {
        emailInput.setAttribute('data-listener-added', 'true');
        emailInput.addEventListener('input', function() {
            const email = this.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailRegex.test(email)) {
                emailError.textContent = 'Please enter a valid email address';
                emailError.style.display = 'block';
            } else {
                emailError.style.display = 'none';
            }
        });
    }
    
    if (phoneInput && !phoneInput.hasAttribute('data-listener-added')) {
        phoneInput.setAttribute('data-listener-added', 'true');
        phoneInput.addEventListener('input', function() {
            // Only allow digits
            this.value = this.value.replace(/\D/g, '');
            
            const phone = this.value;
            const phoneRegex = /^[6-9]\d{9}$/;
            if (phone && !phoneRegex.test(phone)) {
                if (phone.length < 10) {
                    phoneError.textContent = 'Mobile number must be 10 digits';
                } else if (!/^[6-9]/.test(phone)) {
                    phoneError.textContent = 'Mobile number must start with 6, 7, 8, or 9';
                } else {
                    phoneError.textContent = 'Please enter a valid 10-digit Indian mobile number';
                }
                phoneError.style.display = 'block';
            } else {
                phoneError.style.display = 'none';
            }
        });
    }
}

// View mode functions
function setViewMode(mode) {
    viewMode = mode;
    localStorage.setItem('viewMode', mode);
    
    // Update button states for catalog
    const gridBtn = document.getElementById('gridViewBtn');
    const listBtn = document.getElementById('listViewBtn');
    
    if (gridBtn && listBtn) {
        gridBtn.classList.toggle('active', mode === 'grid');
        listBtn.classList.toggle('active', mode === 'list');
    }
    
    // Update catalog view
    const catalogGrid = document.getElementById('catalogGrid');
    if (catalogGrid) {
        catalogGrid.classList.toggle('list-view', mode === 'list');
    }
    
    // Re-render catalog if we're in catalog section
    if (currentSection === 'catalog') {
        renderCatalog();
    }
    
    console.log('View mode changed to:', mode);
}

function setCategoryViewMode(mode) {
    categoryViewMode = mode;
    localStorage.setItem('categoryViewMode', mode);
    
    // Update button states for categories
    const gridBtn = document.getElementById('categoryGridViewBtn');
    const listBtn = document.getElementById('categoryListViewBtn');
    
    if (gridBtn && listBtn) {
        gridBtn.classList.toggle('active', mode === 'grid');
        listBtn.classList.toggle('active', mode === 'list');
    }
    
    // Update categories view
    const categoryGrid = document.getElementById('categoryGrid');
    if (categoryGrid) {
        categoryGrid.classList.toggle('list-view', mode === 'list');
    }
    
    console.log('Category view mode changed to:', mode);
}

// Render functions
function renderCategories() {
    const grid = document.getElementById('categoryGrid');
    if (!grid) {
        console.error('❌ Category grid element not found!');
        return;
    }
    
    console.log('🎨 Rendering categories...');
    console.log('📊 Categories to render:', categories);
    
    if (!categories || categories.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-inbox" style="font-size: 80px; color: #ddd; margin-bottom: 20px;"></i>
                <h2 style="color: #666; margin-bottom: 10px;">No Categories Yet</h2>
                <p style="color: #999;">Please add categories via the admin panel to get started!</p>
                <p style="color: #999; margin-top: 10px;">
                    <a href="admin.html" target="_blank" style="color: #3B82F6; text-decoration: underline;">
                        Open Admin Panel
                    </a>
                </p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = categories.map(category => {
        // Check if icon is an image URL or data URL
        const isImageUrl = category.icon && (category.icon.startsWith('http://') || category.icon.startsWith('https://') || category.icon.startsWith('data:image/'));
        const iconDisplay = isImageUrl 
            ? `<img src="${category.icon}" alt="${category.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px;">` 
            : category.icon;
        
        return `
            <div class="category-card ${category.className}" onclick="showCategory('${category.id}')">
                <div class="category-icon">${iconDisplay}</div>
                <h3>${category.name}</h3>
                <p>${category.description || ''}</p>
            </div>
        `;
    }).join('');
    
    console.log('✅ Categories rendered successfully');
}

function renderCatalog() {
    const catalogGrid = document.getElementById('catalogGrid');
    const catalogTitle = document.getElementById('catalogTitle');
    const catalogSubtitle = document.getElementById('catalogSubtitle');
    
    if (!catalogGrid) return;
    
    const category = categories.find(cat => cat.id === currentCategory);
    if (category && catalogTitle) {
        catalogTitle.textContent = category.name;
        catalogSubtitle.textContent = `Fresh ${category.name.toLowerCase()} products`;
    }
    
    // Always use list view for products (Trading)
    catalogGrid.className = 'catalog-list';
    
    // List view layout for products
    catalogGrid.innerHTML = products.map(product => {
        const isImageUrl = product.image && (product.image.startsWith('http://') || product.image.startsWith('https://') || product.image.startsWith('data:'));
        const imageDisplay = isImageUrl 
            ? `<img src="${product.image}" alt="${product.name}">` 
            : product.image;
        
        const productId = product.itemNumber || product.id;
        const unitDisplay = product.uomCode || product.unit;
        
        return `
            <div class="product-card" onclick="showProductDetails('${productId}')">
                <div class="product-image">${imageDisplay}</div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    ${product.subCategory ? `<p style="color: #888; font-size: 12px;">${product.subCategory}</p>` : ''}
                    ${product.make ? `<p style="color: #666; font-size: 11px; margin-top: 3px;"><strong>Make:</strong> ${product.make}</p>` : ''}
                    <p class="product-price">₹${product.price}/${unitDisplay}</p>
                </div>
                <div class="quantity-controls" onclick="event.stopPropagation()">
                    <button onclick="decreaseQuantity('${productId}')" class="quantity-btn">-</button>
                    <input type="number" 
                           class="quantity-input" 
                           value="${cart[productId] || 0}" 
                           min="0" 
                           max="99999999"
                           onchange="updateQuantity('${productId}', this.value)"
                           onclick="this.select()"
                           title="Click to edit quantity">
                    <button onclick="increaseQuantity('${productId}')" class="quantity-btn">+</button>
                </div>
            </div>
        `;
    }).join('');
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    
    if (!cartItems) return;
    
    const cartEntries = Object.entries(cart);
    
    if (cartEntries.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. You can still submit an enquiry with your requirements in the notes section.</p>';
        if (cartTotal) cartTotal.textContent = '0.00';
        // Keep the button enabled even when cart is empty
        if (placeOrderBtn) {
            placeOrderBtn.disabled = false;
            placeOrderBtn.style.opacity = '1';
            placeOrderBtn.style.cursor = 'pointer';
        }
        return;
    }
    
    // Enable the button when cart has items
    if (placeOrderBtn) {
        placeOrderBtn.disabled = false;
        placeOrderBtn.style.opacity = '1';
        placeOrderBtn.style.cursor = 'pointer';
    }
    
    let total = 0;
    
    cartItems.innerHTML = cartEntries.map(([productId, quantity]) => {
        const product = findProduct(productId);
        if (!product) return '';
        
        const subtotal = product.price * quantity;
        total += subtotal;
        
            const isImageUrl = product.image && (product.image.startsWith('http://') || product.image.startsWith('https://'));
            const imageDisplay = isImageUrl 
                ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: contain;">` 
                : product.image;        const unitDisplay = product.uomCode || product.unit;
        
        return `
            <div class="cart-item">
                <div class="item-info">
                    <span class="item-icon">${imageDisplay}</span>
                    <div class="item-details">
                        <h4>${product.name}</h4>
                        <p>₹${product.price}/${unitDisplay}</p>
                        ${product.specification ? `<small style="color: #888;">${product.specification}</small>` : ''}
                    </div>
                </div>
                <div class="item-controls">
                    <button onclick="decreaseQuantity('${productId}')" class="quantity-btn">-</button>
                    <input type="number" 
                           class="quantity-input" 
                           value="${quantity}" 
                           min="1" 
                           max="99999999"
                           onchange="updateQuantity('${productId}', this.value)"
                           onclick="this.select()"
                           title="Click to edit quantity">
                    <button onclick="increaseQuantity('${productId}')" class="quantity-btn">+</button>
                    <span class="item-total">₹${subtotal.toFixed(2)}</span>
                </div>
            </div>
        `;
    }).join('');
    
    if (cartTotal) {
        cartTotal.textContent = total.toFixed(2);
    }
}

function renderOrders() {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p class="no-orders">No orders yet</p>';
        return;
    }
    
    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <h3>Order #${order.id}</h3>
                <span class="order-status ${order.status}">${order.status.toUpperCase()}</span>
            </div>
            <div class="order-details">
                <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                <p><strong>Total:</strong> ${order.total} kr</p>
                <p><strong>Items:</strong> ${order.items.length}</p>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            ${item.image} ${item.name} x${item.quantity}
                        </div>
                    `).join('')}
                </div>
                ${order.address ? `
                    <div class="order-address">
                        <strong>Delivery Address:</strong><br>
                        ${order.address.fullName}<br>
                        ${order.address.streetAddress}<br>
                        ${order.address.city}, ${order.address.postalCode}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function renderProfile() {
    // Get user phone from localStorage or current user
    const userPhone = user || localStorage.getItem('user') || '+91 XXXXXXXXXX';
    
    // Update profile information
    document.getElementById('profileName').textContent = 'User';
    document.getElementById('profilePhone').textContent = userPhone;
    document.getElementById('profileMobile').textContent = userPhone;
    
    // Set default email (could be enhanced to store real email)
    document.getElementById('profileEmail').textContent = 'user@example.com';
    
    // Get saved address from localStorage
    const savedAddress = localStorage.getItem('currentAddress');
    let addressText = 'No address saved';
    
    if (savedAddress) {
        try {
            const address = JSON.parse(savedAddress);
            addressText = `${address.streetAddress}, ${address.city}, ${address.postalCode}`;
        } catch (e) {
            addressText = 'No address saved';
        }
    }
    
    document.getElementById('profileAddress').textContent = addressText;
}

function editProfile() {
    showToast('Edit profile feature coming soon!');
}

// Cart functions
function increaseQuantity(productId) {
    cart[productId] = (cart[productId] || 0) + 1;
    saveCart();
    updateCartBadges();
    
    // If we're on the cart page, re-render it
    if (currentSection === 'cart') {
        renderCart();
    } else {
        // Update the specific input field on other pages
        const input = document.querySelector(`input[onchange*="${productId}"]`);
        if (input) {
            input.value = cart[productId];
        }
    }
}

function decreaseQuantity(productId) {
    if (cart[productId] && cart[productId] > 0) {
        cart[productId]--;
        if (cart[productId] === 0) {
            delete cart[productId];
        }
        saveCart();
        updateCartBadges();
        
        // If we're on the cart page, re-render it
        if (currentSection === 'cart') {
            renderCart();
        } else {
            // Update the specific input field on other pages
            const input = document.querySelector(`input[onchange*="${productId}"]`);
            if (input) {
                input.value = cart[productId] || 0;
            }
        }
    }
}

function updateQuantity(productId, newQuantity) {
    const quantity = parseInt(newQuantity);
    
    // Validate quantity
    if (isNaN(quantity) || quantity < 0) {
        // Update the input field to show 0
        const input = document.querySelector(`input[onchange*="${productId}"]`);
        if (input) {
            input.value = cart[productId] || 0;
        }
        return;
    }
    
    if (quantity > 99999999) {
        // Reset to previous value
        const input = document.querySelector(`input[onchange*="${productId}"]`);
        if (input) {
            input.value = cart[productId] || 0;
        }
        return;
    }
    
    // If quantity is 0, remove from cart
    if (quantity === 0) {
        delete cart[productId];
        saveCart();
        updateCartBadges();
        
        // Update the input field
        const input = document.querySelector(`input[onchange*="${productId}"]`);
        if (input) {
            input.value = 0;
        }
        
        // Only re-render if in cart section
        if (currentSection === 'cart') {
            renderCart();
        }
        return;
    }
    
    // Update cart with new quantity
    cart[productId] = quantity;
    saveCart();
    updateCartBadges();
    
    // Only re-render cart if in cart section
    if (currentSection === 'cart') {
        renderCart();
    }
}

function updateCartBadges() {
    const totalItems = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
    const cartBadge = document.getElementById('cartBadge');
    const navCartBadge = document.getElementById('navCartBadge');
    
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        if (totalItems > 0) {
            cartBadge.classList.add('show');
        } else {
            cartBadge.classList.remove('show');
        }
    }
    
    if (navCartBadge) {
        navCartBadge.textContent = totalItems;
        if (totalItems > 0) {
            navCartBadge.classList.add('show');
        } else {
            navCartBadge.classList.remove('show');
        }
    }
}

// Order functions
function placeOrder() {
    // Allow enquiry even with empty cart
    // if (Object.keys(cart).length === 0) {
    //     showToast('Your cart is empty');
    //     return;
    // }
    
    // Validate email
    const customerEmailInput = document.getElementById('customerEmail');
    const emailError = document.getElementById('emailError');
    const customerEmail = customerEmailInput.value.trim();
    
    if (!customerEmail) {
        emailError.textContent = 'Email address is required';
        emailError.style.display = 'block';
        customerEmailInput.style.borderColor = '#ff4757';
        customerEmailInput.focus();
        showToast('Please enter your email address');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
        emailError.textContent = 'Please enter a valid email address';
        emailError.style.display = 'block';
        customerEmailInput.style.borderColor = '#ff4757';
        customerEmailInput.focus();
        showToast('Please enter a valid email address');
        return;
    }
    
    // Hide error if validation passes
    emailError.style.display = 'none';
    customerEmailInput.style.borderColor = 'rgba(102, 126, 234, 0.2)';
    
    // Store email and additional notes for later use
    window.customerEmail = customerEmail;
    window.additionalNotes = document.getElementById('additionalNotes').value.trim();
    
    // Debug: Log captured additional notes
    console.log('=== CAPTURED FROM CART PAGE ===');
    console.log('Additional Notes:', window.additionalNotes);
    console.log('Length:', window.additionalNotes.length);
    
    // Show address form before submitting enquiry
    showAddress();
}

async function confirmOrder() {
    // Get full name and validate
    const fullNameInput = document.getElementById('fullName');
    const nameError = document.getElementById('nameError');
    const fullName = fullNameInput.value.trim();
    
    // Validate full name
    if (!fullName) {
        nameError.textContent = 'Full name is required';
        nameError.style.display = 'block';
        fullNameInput.focus();
        return;
    }
    nameError.style.display = 'none';
    
    // Get email and validate
    const customerEmailInput = document.getElementById('customerEmail');
    const emailError = document.getElementById('emailError');
    const customerEmail = customerEmailInput.value.trim();
    
    // Validate email
    if (!customerEmail) {
        emailError.textContent = 'Email address is required';
        emailError.style.display = 'block';
        customerEmailInput.focus();
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
        emailError.textContent = 'Please enter a valid email address';
        emailError.style.display = 'block';
        customerEmailInput.focus();
        return;
    }
    emailError.style.display = 'none';
    
    // Get mobile and validate
    const deliveryPhoneInput = document.getElementById('deliveryPhone');
    const phoneError = document.getElementById('phoneError');
    const deliveryPhone = deliveryPhoneInput.value.trim();
    
    // Validate mobile number
    if (!deliveryPhone) {
        phoneError.textContent = 'Mobile number is required';
        phoneError.style.display = 'block';
        deliveryPhoneInput.focus();
        return;
    }
    
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(deliveryPhone)) {
        phoneError.textContent = 'Please enter a valid 10-digit Indian mobile number';
        phoneError.style.display = 'block';
        deliveryPhoneInput.focus();
        return;
    }
    phoneError.style.display = 'none';
    
    // Get and validate Company Name
    const companyNameInput = document.getElementById('companyName');
    const companyError = document.getElementById('companyError');
    const companyName = companyNameInput.value.trim();
    
    // Validate company name
    if (!companyName) {
        companyError.textContent = 'Company name is required';
        companyError.style.display = 'block';
        companyNameInput.focus();
        return;
    }
    companyError.style.display = 'none';
    
    // Store email for order
    window.customerEmail = customerEmail;
    
    // Get address form values
    const gstin = document.getElementById('gstin').value.trim();
    const streetAddress = document.getElementById('streetAddress').value.trim();
    const city = document.getElementById('city').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const landmark = document.getElementById('landmark').value.trim();
    const addressType = document.getElementById('addressType').value;
    const additionalNotes = document.getElementById('additionalNotes').value.trim();
    
    // Store additional notes
    window.additionalNotes = additionalNotes;
    
    // Save address with +91 prefix for phone
    currentAddress = {
        fullName: fullName,
        phone: '+91' + deliveryPhone,
        companyName: companyName,
        gstin: gstin || 'Not provided',
        streetAddress: streetAddress || 'Not provided',
        city: city || 'Not provided',
        postalCode,
        landmark,
        type: addressType
    };
    
    // Save to localStorage for profile page
    localStorage.setItem('currentAddress', JSON.stringify(currentAddress));
    
    // Create order
    const cartEntries = Object.entries(cart);
    const orderItems = cartEntries.map(([productId, quantity]) => {
        const product = findProduct(productId);
        return {
            ...product,
            quantity,
            total: product.price * quantity
        };
    });
    
    const total = orderItems.reduce((sum, item) => sum + item.total, 0);
    
    // Debug: Log additional notes before creating order
    console.log('=== CREATING ORDER ===');
    console.log('window.additionalNotes:', window.additionalNotes);
    
    // Create order with numeric ID and IST timestamp
    const numericId = Date.now();
    const istDate = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const order = {
        id: 'ENQ-' + numericId,
        numericId: numericId,
        date: new Date().toISOString(),
        dateIST: istDate,
        items: orderItems,
        total: total.toFixed(2),
        status: 'confirmed',
        address: currentAddress,
        customerPhone: currentAddress.phone,
        customerEmail: window.customerEmail || customerEmail,
        additionalNotes: window.additionalNotes || ''
    };
    
    // Debug: Log the complete order object
    console.log('Order object created:', order);
    console.log('Order additionalNotes field:', order.additionalNotes);
    
    // Save order to Firestore
    try {
        await db.collection('orders').doc(order.id).set(order);
        console.log('Order saved to Firestore:', order.id);
    } catch (error) {
        console.error('Error saving order to Firestore:', error);
    }
    
    // Add to local orders
    orders.unshift(order);
    saveOrders();
    
    // Send enquiry confirmation email via Firebase Function
    sendOrderConfirmationEmail(order);
    
    // Clear cart
    cart = {};
    saveCart();
    updateCartBadges();
    
    showToast('Enquiry submitted successfully! Confirmation email sent.');
    
    // Navigate back to home (categories) instead of orders
    showCategories();
}

// Email notification function
async function sendOrderConfirmationEmail(order) {
    try {
        // Option 1: Firebase Cloud Functions (Professional)
        if (typeof firebase.functions === 'function') {
            const functions = firebase.functions();
            const sendOrderConfirmation = functions.httpsCallable('sendOrderConfirmation');
            
            const emailData = {
                order: order,
                customerPhone: order.customerPhone,
                customerEmail: order.customerEmail
            };
            
            console.log('Sending enquiry confirmation via Firebase Functions...', order.id);
            const result = await sendOrderConfirmation(emailData);
            console.log('Firebase email sent successfully:', result.data);
        }
        // Option 2: EmailJS (Easier alternative)
        else if (typeof emailjs !== 'undefined') {
            await sendEmailViaEmailJS(order);
        }
        
    } catch (error) {
        console.error('Error sending enquiry confirmation email:', error);
        // Try EmailJS as fallback
        try {
            if (typeof emailjs !== 'undefined') {
                await sendEmailViaEmailJS(order);
            }
        } catch (fallbackError) {
            console.error('Fallback email service also failed:', fallbackError);
        }
    }
}

// EmailJS alternative email function  
async function sendEmailViaEmailJS(order) {
    try {
        console.log('Sending enquiry confirmation via EmailJS...', order.id);
        
        // Prepare enquiry items for email (HTML format)
        const orderItemsHtml = order.items.map(item => 
            `<li>${item.name} x ${item.quantity} - ₹${item.price * item.quantity}</li>`
        ).join('');
        
        // Create CSV-formatted data for easy Excel import
        const csvHeader = 'Item Code,Category,Product Name,Make,Specification,Unit Price,Quantity,Total Price,UOM\n';
        const csvData = order.items.map(item => {
            const itemCode = item.itemNumber || '';
            const category = item.category || '';
            const name = (item.name || '').replace(/,/g, ';'); // Replace commas to avoid CSV issues
            const make = item.make || '';
            const spec = (item.specification || '').replace(/,/g, ';');
            const price = item.price || 0;
            const qty = item.quantity || 0;
            const total = price * qty;
            const uom = item.uomCode || '';
            
            return `${itemCode},${category},"${name}",${make},"${spec}",${price},${qty},${total},${uom}`;
        }).join('\n');
        
        const csvContent = csvHeader + csvData;
        const csvFooter = `\n\nTotal Amount,,,,,,,₹${order.total},`;
        const fullCsvContent = csvContent + csvFooter;
        
        // Create plain text table format for better email readability
        const textTable = order.items.map((item, index) => 
            `${index + 1}. ${item.itemNumber || 'N/A'} - ${item.name}\n   Make: ${item.make || 'N/A'} | Qty: ${item.quantity} ${item.uomCode || ''} | Price: ₹${item.price} | Total: ₹${item.price * item.quantity}`
        ).join('\n\n');
        
        // Format address
        const addressText = `${order.address.fullName}
${order.address.phone}
${order.address.companyName ? order.address.companyName + '\n' : ''}${order.address.gstin ? 'GSTIN: ' + order.address.gstin + '\n' : ''}${order.address.streetAddress}
${order.address.city}, ${order.address.postalCode}
${order.address.landmark ? 'Landmark: ' + order.address.landmark : ''}`;
        
        const templateParams = {
            enquiry_id: order.id,
            enquiry_total: '₹' + order.total,
            enquiry_items_html: orderItemsHtml,
            enquiry_items_text: textTable,
            enquiry_csv: fullCsvContent,
            customer_phone: order.customerPhone,
            customer_name: order.address.fullName,
            customer_email: order.customerEmail,
            company_name: order.address.companyName,
            gstin: order.address.gstin || 'N/A',
            enquiry_date: new Date(order.date).toLocaleString('en-IN', { 
                dateStyle: 'medium', 
                timeStyle: 'short',
                timeZone: 'Asia/Kolkata'
            }),
            delivery_address: addressText,
            item_count: order.items.length,
            additional_information: order.additionalNotes || 'None',
            subject: 'Enquiry received',
            closing_message: 'Thank you for choosing Swarup'
        };
        
        // Debug log to verify additional notes
        console.log('Additional Notes being sent:', order.additionalNotes);
        console.log('Full template params:', templateParams);
        
        // Replace these with your EmailJS service ID, template ID, and user ID
        await emailjs.send(
            'your_service_id',    // Replace with your EmailJS service ID
            'your_template_id',   // Replace with your EmailJS template ID  
            templateParams,
            'your_user_id'        // Replace with your EmailJS user ID
        );
        
        console.log('EmailJS email sent successfully');
        
    } catch (error) {
        console.error('EmailJS error:', error);
        throw error;
    }
}

// Utility functions
function findProduct(productId) {
    for (const categoryProducts of Object.values(allProducts)) {
        // Check both itemNumber and id for backward compatibility
        const product = categoryProducts.find(p => p.itemNumber === productId || p.id === productId);
        if (product) return product;
    }
    return null;
}

function showToast(message) {
    // Simple toast implementation
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 12px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showLoading(message) {
    // Simple loading implementation
    let loading = document.getElementById('loading');
    if (!loading) {
        loading = document.createElement('div');
        loading.id = 'loading';
        loading.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 20px;
            border-radius: 5px;
            z-index: 10001;
        `;
        document.body.appendChild(loading);
    }
    loading.textContent = message;
    loading.style.display = 'block';
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'none';
    }
}

// Add CSS for toast animation
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
`;
document.head.appendChild(style);
// Product Details functionality
let currentProduct = null;

function showProductDetails(productId) {
    // Find the product from all products
    let product = null;
    for (const categoryProducts of Object.values(allProducts)) {
        product = categoryProducts.find(p => (p.itemNumber || p.id) === productId);
        if (product) break;
    }
    
    if (!product) {
        console.error('Product not found:', productId);
        return;
    }
    
    currentProduct = product;
    
    // Update product details UI
    const isImageUrl = product.image && (
        product.image.startsWith('http://') || 
        product.image.startsWith('https://') || 
        product.image.startsWith('data:image/')
    );
    const imageDisplay = isImageUrl 
        ? `<img src="${product.image}" alt="${product.name}" style="max-width: 100%; height: auto;">` 
        : product.image;
    
    document.getElementById('productDetailsImage').innerHTML = imageDisplay;
    
    // Add click event for image zoom (only for actual images, not emojis)
    if (isImageUrl) {
        const imageElement = document.querySelector('#productDetailsImage img');
        if (imageElement) {
            imageElement.onclick = () => openImageZoom(product.image);
        }
    }
    
    document.getElementById('productDetailsName').textContent = product.name || 'Product';
    document.getElementById('productDetailsMake').textContent = product.make || '';
    document.getElementById('productDetailsPrice').textContent = `₹${product.price || 0}`;
    document.getElementById('productDetailsUnit').textContent = `per ${product.uomCode || product.unit || 'unit'}`;
    document.getElementById('productDetailsItemNumber').textContent = product.itemNumber || product.id || 'N/A';
    
    // Description
    const descElement = document.getElementById('productDetailsDescription');
    const descSection = descElement.closest('.product-description-section');
    if (product.description) {
        descElement.textContent = product.description;
        if (descSection) descSection.style.display = 'block';
    } else {
        if (descSection) descSection.style.display = 'none';
    }
    
    // Specifications
    const specsContainer = document.getElementById('productDetailsSpecs');
    if (product.specification && product.specification.trim()) {
        const specs = product.specification.split('\n').filter(s => s.trim());
        specsContainer.innerHTML = specs.map(spec => {
            const cleaned = spec.trim().replace(/^[•\-\*]\s*/, '');
            return `<div class="spec-item"><i class="fas fa-check-circle"></i><span>${cleaned}</span></div>`;
        }).join('');
        document.querySelector('.product-specifications').style.display = 'block';
    } else {
        document.querySelector('.product-specifications').style.display = 'none';
    }
    
    // Set initial quantity
    const itemId = product.itemNumber || product.id;
    document.getElementById('productDetailsQuantity').textContent = cart[itemId] || 0;
    
    // Show the details section
    hideAllSections();
    document.getElementById('product-details').classList.remove('hidden');
}

function showServiceDetails(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (!service) {
        showToast('Service not found', 'error');
        return;
    }
    
    // Update service details
    document.getElementById('serviceDetailsTitle').textContent = service.title;
    document.getElementById('serviceDetailsDescription').textContent = service.description;
    
    // Handle icon display
    const iconContainer = document.getElementById('serviceDetailsImageContainer');
    const isImageUrl = service.icon && (service.icon.startsWith('http://') || service.icon.startsWith('https://') || service.icon.startsWith('data:'));
    if (isImageUrl) {
        iconContainer.innerHTML = `<img src="${service.icon}" alt="${service.title}" style="width: 100%; max-width: 300px; height: auto; object-fit: contain;">`;
    } else {
        iconContainer.innerHTML = `<i class="fas ${service.icon || 'fa-cogs'}" id="serviceDetailsIcon" style="font-size: 120px; color: #1E40AF;"></i>`;
    }
    
    // Display detailed description if available (shown first)
    const detailedDescSection = document.getElementById('serviceDetailedDescSection');
    const detailedDescContainer = document.getElementById('serviceDetailsDetailedDesc');
    if (service.detailedDescription && service.detailedDescription.trim()) {
        detailedDescContainer.textContent = service.detailedDescription;
        detailedDescSection.style.display = 'block';
    } else {
        detailedDescSection.style.display = 'none';
    }
    
    // Display key features if available (shown after description)
    const specsSection = document.getElementById('serviceSpecsSection');
    const specsContainer = document.getElementById('serviceDetailsSpecs');
    if (service.specification && service.specification.trim()) {
        const specs = service.specification.split('\n').filter(s => s.trim());
        specsContainer.innerHTML = specs.map(spec => {
            const cleaned = spec.trim().replace(/^[•\-\*]\s*/, '');
            return `<div class="spec-item"><i class="fas fa-check-circle"></i><span>${cleaned}</span></div>`;
        }).join('');
        specsSection.style.display = 'block';
    } else {
        specsSection.style.display = 'none';
    }
    
    // Show the details section
    hideAllSections();
    document.getElementById('service-details-page').classList.remove('hidden');
}

function showSolutionDetails(solutionId) {
    const solution = solutions.find(s => s.id === solutionId);
    if (!solution) {
        showToast('Solution not found', 'error');
        return;
    }
    
    // Update solution details
    document.getElementById('solutionDetailsTitle').textContent = solution.title;
    document.getElementById('solutionDetailsDescription').textContent = solution.description;
    
    // Handle icon display
    const iconContainer = document.getElementById('solutionDetailsImageContainer');
    const isImageUrl = solution.icon && (solution.icon.startsWith('http://') || solution.icon.startsWith('https://') || solution.icon.startsWith('data:'));
    if (isImageUrl) {
        iconContainer.innerHTML = `<img src="${solution.icon}" alt="${solution.title}" style="width: 100%; max-width: 300px; height: auto; object-fit: contain;">`;
    } else {
        iconContainer.innerHTML = `<i class="fas ${solution.icon || 'fa-lightbulb'}" id="solutionDetailsIcon" style="font-size: 120px; color: #1E40AF;"></i>`;
    }
    
    // Display detailed description if available (shown first)
    const detailedDescSection = document.getElementById('solutionDetailedDescSection');
    const detailedDescContainer = document.getElementById('solutionDetailsDetailedDesc');
    if (solution.detailedDescription && solution.detailedDescription.trim()) {
        detailedDescContainer.textContent = solution.detailedDescription;
        detailedDescSection.style.display = 'block';
    } else {
        detailedDescSection.style.display = 'none';
    }
    
    // Display highlights if available (shown after description)
    const specsSection = document.getElementById('solutionSpecsSection');
    const specsContainer = document.getElementById('solutionDetailsSpecs');
    if (solution.specification && solution.specification.trim()) {
        const specs = solution.specification.split('\n').filter(s => s.trim());
        specsContainer.innerHTML = specs.map(spec => {
            const cleaned = spec.trim().replace(/^[•\-\*]\s*/, '');
            return `<div class="spec-item"><i class="fas fa-check-circle"></i><span>${cleaned}</span></div>`;
        }).join('');
        specsSection.style.display = 'block';
    } else {
        specsSection.style.display = 'none';
    }
    
    // Show the details section
    hideAllSections();
    document.getElementById('solution-details-page').classList.remove('hidden');
}

function showCatalogFromDetails() {
    hideAllSections();
    document.getElementById('catalog').classList.remove('hidden');
}

function decreaseProductQuantity() {
    if (!currentProduct) return;
    const productId = currentProduct.itemNumber || currentProduct.id;
    if (cart[productId] && cart[productId] > 0) {
        cart[productId]--;
        if (cart[productId] === 0) {
            delete cart[productId];
        }
        saveCart();
        updateCartBadges();
        document.getElementById('productDetailsQuantity').textContent = cart[productId] || 0;
    }
}

function increaseProductQuantity() {
    if (!currentProduct) return;
    const productId = currentProduct.itemNumber || currentProduct.id;
    cart[productId] = (cart[productId] || 0) + 1;
    saveCart();
    updateCartBadges();
    document.getElementById('productDetailsQuantity').textContent = cart[productId];
}

function addToCartFromDetails() {
    if (!currentProduct) return;
    const productId = currentProduct.itemNumber || currentProduct.id;
    const currentQty = cart[productId] || 0;
    
    if (currentQty === 0) {
        // If quantity is 0, add 1
        cart[productId] = 1;
        document.getElementById('productDetailsQuantity').textContent = 1;
    }
    
    saveCart();
    updateCartBadges();
    showToast(`${currentProduct.name} added to cart!`);
}

// Image zoom functionality
function openImageZoom(imageSrc) {
    const modal = document.getElementById('imageZoomModal');
    const zoomedImage = document.getElementById('zoomedImage');
    zoomedImage.src = imageSrc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageZoom(event) {
    // Close if clicking on the modal background, image, or close button
    if (event.target.id === 'imageZoomModal' || 
        event.target.id === 'zoomedImage' ||
        event.target.classList.contains('image-zoom-close') ||
        event.target.classList.contains('fa-times')) {
        const modal = document.getElementById('imageZoomModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close zoom modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('imageZoomModal');
        if (modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});
