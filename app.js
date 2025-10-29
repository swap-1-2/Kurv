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

// Firebase auth variables
let confirmationResult;
let recaptchaVerifier;

// Categories data
const categories = [
    {
        id: 'munchies',
        name: 'Munchies',
        icon: '�',
        description: 'Chips & Snacks',
        className: 'munchies',
        color: '#4CAF50'
    },
    {
        id: 'beverages',
        name: 'Beverages',
        icon: '�',
        description: 'Soft Drinks & More',
        className: 'beverages',
        color: '#FF5722'
    },
    {
        id: 'instant',
        name: 'Instant Food',
        icon: '🍜',
        description: 'Ready to Eat',
        className: 'instant',
        color: '#2196F3'
    },
    {
        id: 'breakfast',
        name: 'Breakfast & Spreads',
        icon: '�',
        description: 'Morning Essentials',
        className: 'breakfast',
        color: '#FFC107'
    },
    {
        id: 'fruits',
        name: 'Fruits & Vegetables',
        icon: '🥬',
        description: 'Fresh Produce',
        className: 'fruits',
        color: '#8BC34A'
    },
    {
        id: 'meat',
        name: 'Fresh & Tender Meat',
        icon: '🥩',
        description: 'Quality Meat',
        className: 'meat',
        color: '#E91E63'
    },
    {
        id: 'sweet',
        name: 'Sweet Tooth',
        icon: '�',
        description: 'Chocolates & Sweets',
        className: 'sweet',
        color: '#9C27B0'
    },
    {
        id: 'cooking',
        name: 'Cooking Essentials',
        icon: '🧄',
        description: 'Spices & Oil',
        className: 'cooking',
        color: '#FF9800'
    },
    {
        id: 'dairy',
        name: 'Dairy, Bread & Eggs',
        icon: '🥛',
        description: 'Daily Essentials',
        className: 'dairy',
        color: '#03A9F4'
    },
    {
        id: 'health',
        name: 'Health & Hygiene',
        icon: '�',
        description: 'Personal Care',
        className: 'health',
        color: '#009688'
    },
    {
        id: 'personal',
        name: 'Personal Care',
        icon: '🧼',
        description: 'Beauty & Care',
        className: 'personal',
        color: '#E91E63'
    },
    {
        id: 'home',
        name: 'Home & Cleaning',
        icon: '🧽',
        description: 'Household Items',
        className: 'home',
        color: '#607D8B'
    }
];

// Sample products data
const allProducts = {
    munchies: [
        { id: 'p1', name: 'Lay\'s Classic', price: 25.00, unit: 'pack', image: '🍟' },
        { id: 'p2', name: 'Kurkure Masala', price: 20.00, unit: 'pack', image: '🌽' },
        { id: 'p3', name: 'Bingo Mad Angles', price: 30.00, unit: 'pack', image: '🔺' },
        { id: 'p4', name: 'Haldiram Mixture', price: 45.00, unit: 'pack', image: '🥜' }
    ],
    beverages: [
        { id: 'p5', name: 'Coca Cola', price: 40.00, unit: 'bottle', image: '🥤' },
        { id: 'p6', name: 'Pepsi', price: 40.00, unit: 'bottle', image: '🥤' },
        { id: 'p7', name: 'Sprite', price: 40.00, unit: 'bottle', image: '🥤' },
        { id: 'p8', name: 'Thums Up', price: 40.00, unit: 'bottle', image: '🥤' }
    ],
    instant: [
        { id: 'p9', name: 'Maggi Noodles', price: 15.00, unit: 'pack', image: '🍜' },
        { id: 'p10', name: 'Yippee Noodles', price: 12.00, unit: 'pack', image: '🍜' },
        { id: 'p11', name: 'Top Ramen', price: 20.00, unit: 'pack', image: '🍜' },
        { id: 'p12', name: 'Pasta', price: 35.00, unit: 'pack', image: '�' }
    ],
    breakfast: [
        { id: 'p13', name: 'Kellogg\'s Cornflakes', price: 125.00, unit: 'box', image: '🥣' },
        { id: 'p14', name: 'Chocos', price: 135.00, unit: 'box', image: '🥣' },
        { id: 'p15', name: 'Bread', price: 25.00, unit: 'pack', image: '🍞' },
        { id: 'p16', name: 'Jam', price: 85.00, unit: 'jar', image: '🍯' }
    ],
    fruits: [
        { id: 'p17', name: 'Banana', price: 40.00, unit: 'dozen', image: '🍌' },
        { id: 'p18', name: 'Apple', price: 120.00, unit: 'kg', image: '🍎' },
        { id: 'p19', name: 'Onion', price: 25.00, unit: 'kg', image: '�' },
        { id: 'p20', name: 'Tomato', price: 35.00, unit: 'kg', image: '🍅' }
    ],
    meat: [
        { id: 'p21', name: 'Chicken Breast', price: 250.00, unit: 'kg', image: '🍗' },
        { id: 'p22', name: 'Mutton', price: 450.00, unit: 'kg', image: '🥩' },
        { id: 'p23', name: 'Fish', price: 200.00, unit: 'kg', image: '🐟' },
        { id: 'p24', name: 'Prawns', price: 350.00, unit: 'kg', image: '�' }
    ],
    sweet: [
        { id: 'p25', name: 'Dairy Milk', price: 45.00, unit: 'bar', image: '🍫' },
        { id: 'p26', name: 'KitKat', price: 20.00, unit: 'bar', image: '🍫' },
        { id: 'p27', name: 'Gulab Jamun', price: 80.00, unit: 'pack', image: '🟤' },
        { id: 'p28', name: 'Rasgulla', price: 60.00, unit: 'pack', image: '⚪' }
    ],
    cooking: [
        { id: 'p29', name: 'Turmeric Powder', price: 35.00, unit: '100g', image: '🌶️' },
        { id: 'p30', name: 'Red Chili Powder', price: 40.00, unit: '100g', image: '🌶️' },
        { id: 'p31', name: 'Cooking Oil', price: 120.00, unit: 'liter', image: '�' },
        { id: 'p32', name: 'Salt', price: 20.00, unit: '1kg', image: '�' }
    ],
    dairy: [
        { id: 'p33', name: 'Milk', price: 50.00, unit: 'liter', image: '🥛' },
        { id: 'p34', name: 'Bread', price: 25.00, unit: 'pack', image: '�' },
        { id: 'p35', name: 'Eggs', price: 60.00, unit: 'dozen', image: '🥚' },
        { id: 'p36', name: 'Butter', price: 85.00, unit: '200g', image: '🧈' }
    ],
    health: [
        { id: 'p37', name: 'Hand Sanitizer', price: 50.00, unit: 'bottle', image: '🧴' },
        { id: 'p38', name: 'Face Mask', price: 120.00, unit: 'pack', image: '😷' },
        { id: 'p39', name: 'Vitamin C', price: 250.00, unit: 'bottle', image: '💊' },
        { id: 'p40', name: 'First Aid Kit', price: 450.00, unit: 'kit', image: '🩹' }
    ],
    personal: [
        { id: 'p41', name: 'Shampoo', price: 180.00, unit: 'bottle', image: '🧴' },
        { id: 'p42', name: 'Soap', price: 35.00, unit: 'bar', image: '🧼' },
        { id: 'p43', name: 'Toothpaste', price: 65.00, unit: 'tube', image: '�' },
        { id: 'p44', name: 'Deodorant', price: 150.00, unit: 'bottle', image: '🧴' }
    ],
    home: [
        { id: 'p45', name: 'Dish Soap', price: 75.00, unit: 'bottle', image: '�' },
        { id: 'p46', name: 'All Purpose Cleaner', price: 95.00, unit: 'bottle', image: '🧽' },
        { id: 'p47', name: 'Toilet Paper', price: 120.00, unit: 'pack', image: '🧻' },
        { id: 'p48', name: 'Laundry Detergent', price: 180.00, unit: 'bottle', image: '�' }
    ]
};

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

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initializing...');
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
    
    // Load user data if logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        user = savedUser;
        loadOrders();
        showCategories();
    } else {
        // Show launch screen for new users
        showLaunch();
    }
    
    console.log('App initialized successfully');
    
    // Add testOTP to global scope for debugging
    window.testOTP = testOTP;
    
    // Add debug functions to global scope
    window.clearAllData = function() {
        localStorage.clear();
        location.reload();
    };
    
    window.forceLogout = function() {
        logout();
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
    // Load cart
    const savedCart = localStorage.getItem('cart');
    if (savedCart && savedCart !== 'undefined') {
        try {
            cart = JSON.parse(savedCart);
        } catch (error) {
            console.error('Error parsing cart data:', error);
            cart = {};
        }
    }
    
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
        
        // Send OTP via Firebase
        confirmationResult = await auth.signInWithPhoneNumber(phone, recaptchaVerifier);
        
        console.log('OTP sent successfully, confirmation result:', !!confirmationResult);
        
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
        
        showToast('Login successful! Welcome to FreshMart');
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
        
        showToast('Login successful! Welcome to FreshMart');
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

// Launch and Auth functions
function showLaunch() {
    showSection('launch');
    const bottomNav = document.getElementById('bottomNav');
    const appHeader = document.getElementById('appHeader');
    if (bottomNav) bottomNav.style.display = 'none';
    if (appHeader) appHeader.style.display = 'none';
    
    // Reset form state
    resetAuthForm();
}

function showLogin() {
    // Since launch and auth are combined, just show launch
    showLaunch();
}

function resetAuthForm() {
    // Clear inputs
    const phoneInput = document.getElementById('phone');
    const otpInput = document.getElementById('otpInput');
    if (phoneInput) phoneInput.value = '';
    if (otpInput) otpInput.value = '';
    
    // Hide OTP section
    const otpSection = document.getElementById('otpSection');
    if (otpSection) otpSection.style.display = 'none';
    
    // Reset button text
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    if (sendOtpBtn) sendOtpBtn.textContent = 'Send OTP';
}

function requireAuth(callback) {
    if (!user) {
        showToast('Please login to access this feature');
        showLogin();
        return;
    }
    callback();
}

function showCategories() {
    if (!user) {
        showLogin();
        return;
    }
    showSection('categories');
    renderCategories();
    initializeCategoryViewButtons();
    
    // Show navigation and header for authenticated users
    const bottomNav = document.getElementById('bottomNav');
    const appHeader = document.getElementById('appHeader');
    if (bottomNav) bottomNav.style.display = 'flex';
    if (appHeader) appHeader.style.display = 'block';
}

function showCategory(categoryId) {
    currentCategory = categoryId;
    products = allProducts[categoryId] || [];
    showSection('catalog');
    
    // Initialize view mode buttons
    setTimeout(() => {
        initializeCatalogViewButtons();
    }, 100);
    
    renderCatalog();
}

function showCart() {
    showSection('cart');
    renderCart();
}

function showOrders() {
    showSection('orders');
    renderOrders();
}

function showProfile() {
    showSection('profile');
    renderProfile();
}

function showAddress() {
    showSection('address');
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
    if (!grid) return;
    
    grid.innerHTML = categories.map(category => `
        <div class="category-card ${category.className}" onclick="showCategory('${category.id}')">
            <div class="category-icon">${category.icon}</div>
            <h3>${category.name}</h3>
            <p>${category.description}</p>
        </div>
    `).join('');
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
    
    // Set container class based on view mode
    catalogGrid.className = viewMode === 'list' ? 'catalog-list' : 'catalog-grid';
    
    if (viewMode === 'list') {
        // List view layout
        catalogGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">${product.image}</div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">${product.price} kr/${product.unit}</p>
                </div>
                <div class="quantity-controls">
                    <button onclick="decreaseQuantity('${product.id}')" class="quantity-btn">-</button>
                    <span class="quantity">${cart[product.id] || 0}</span>
                    <button onclick="increaseQuantity('${product.id}')" class="quantity-btn">+</button>
                </div>
            </div>
        `).join('');
    } else {
        // Grid view layout (default)
        catalogGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">${product.image}</div>
                <h3>${product.name}</h3>
                <p class="product-price">${product.price} kr/${product.unit}</p>
                <div class="quantity-controls">
                    <button onclick="decreaseQuantity('${product.id}')" class="quantity-btn">-</button>
                    <span class="quantity">${cart[product.id] || 0}</span>
                    <button onclick="increaseQuantity('${product.id}')" class="quantity-btn">+</button>
                </div>
            </div>
        `).join('');
    }
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems) return;
    
    const cartEntries = Object.entries(cart);
    
    if (cartEntries.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (cartTotal) cartTotal.textContent = '0.00';
        return;
    }
    
    let total = 0;
    
    cartItems.innerHTML = cartEntries.map(([productId, quantity]) => {
        const product = findProduct(productId);
        if (!product) return '';
        
        const subtotal = product.price * quantity;
        total += subtotal;
        
        return `
            <div class="cart-item">
                <div class="item-info">
                    <span class="item-icon">${product.image}</span>
                    <div class="item-details">
                        <h4>${product.name}</h4>
                        <p>${product.price} kr/${product.unit}</p>
                    </div>
                </div>
                <div class="item-controls">
                    <button onclick="decreaseQuantity('${productId}')" class="quantity-btn">-</button>
                    <span class="quantity">${quantity}</span>
                    <button onclick="increaseQuantity('${productId}')" class="quantity-btn">+</button>
                    <span class="item-total">${subtotal.toFixed(2)} kr</span>
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
    
    // Update display based on current section
    if (currentSection === 'catalog') {
        renderCatalog();
    } else if (currentSection === 'cart') {
        renderCart();
    }
    
    showToast('Item added to cart');
}

function decreaseQuantity(productId) {
    if (cart[productId] && cart[productId] > 0) {
        cart[productId]--;
        if (cart[productId] === 0) {
            delete cart[productId];
        }
        saveCart();
        updateCartBadges();
        
        // Update display based on current section
        if (currentSection === 'catalog') {
            renderCatalog();
        } else if (currentSection === 'cart') {
            renderCart();
        }
        
        showToast('Item removed from cart');
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
    if (!user) {
        showToast('Please login to place an order');
        showLogin();
        return;
    }
    
    if (Object.keys(cart).length === 0) {
        showToast('Your cart is empty');
        return;
    }
    
    // Validate email
    const customerEmail = document.getElementById('customerEmail').value.trim();
    if (!customerEmail) {
        showToast('Please enter your email address');
        document.getElementById('customerEmail').focus();
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
        showToast('Please enter a valid email address');
        document.getElementById('customerEmail').focus();
        return;
    }
    
    // Store email for later use
    window.customerEmail = customerEmail;
    
    // Show address form before placing order
    showAddress();
}

function confirmOrder() {
    // Validate address form
    const fullName = document.getElementById('fullName').value.trim();
    const deliveryPhone = document.getElementById('deliveryPhone').value.trim();
    const streetAddress = document.getElementById('streetAddress').value.trim();
    const city = document.getElementById('city').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const landmark = document.getElementById('landmark').value.trim();
    const addressType = document.getElementById('addressType').value;
    
    if (!fullName || !deliveryPhone || !streetAddress || !city || !postalCode) {
        showToast('Please fill in all required fields (Name, Mobile, Address, City, Postal Code)');
        return;
    }
    
    // Validate mobile number
    const phoneDigits = deliveryPhone.replace(/\D/g, '');
    if (phoneDigits.length < 8) {
        showToast('Please enter a valid mobile number');
        return;
    }
    
    // Save address with mobile number
    currentAddress = {
        fullName,
        phone: deliveryPhone,
        streetAddress,
        city,
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
    
    const order = {
        id: 'ORD-' + Date.now(),
        date: new Date().toISOString(),
        items: orderItems,
        total: total.toFixed(2),
        status: 'confirmed',
        address: currentAddress
    };
    
    // Add to orders
    orders.unshift(order);
    saveOrders();
    
    // Send order confirmation email via Firebase Function
    sendOrderConfirmationEmail(order);
    
    // Clear cart
    cart = {};
    saveCart();
    updateCartBadges();
    
    showToast('Order placed successfully! Confirmation email sent.');
    showOrders();
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
                customerPhone: user,
                customerEmail: window.customerEmail || 'customer@example.com'
            };
            
            console.log('Sending order confirmation via Firebase Functions...', order.id);
            const result = await sendOrderConfirmation(emailData);
            console.log('Firebase email sent successfully:', result.data);
        }
        // Option 2: EmailJS (Easier alternative)
        else if (typeof emailjs !== 'undefined') {
            await sendEmailViaEmailJS(order);
        }
        
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
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
        console.log('Sending order confirmation via EmailJS...', order.id);
        
        // Prepare order items for email
        const orderItemsHtml = order.items.map(item => 
            `<li>${item.name} x ${item.quantity} - ₹${item.price * item.quantity}</li>`
        ).join('');
        
        const templateParams = {
            order_id: order.id,
            order_total: order.total,
            order_items: orderItemsHtml,
            customer_phone: user,
            order_date: new Date(order.date).toLocaleString(),
            delivery_address: order.address || 'Default Address'
        };
        
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
        const product = categoryProducts.find(p => p.id === productId);
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