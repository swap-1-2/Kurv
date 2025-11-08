// Categories data
const categories = [
    {
        id: 'bakery',
        name: 'Bakery',
        icon: '🍞',
        description: 'Fresh bread, pastries & baked goods',
        className: 'bakery'
    },
    {
        id: 'dairy',
        name: 'Dairy',
        icon: '🥛',
        description: 'Milk, cheese, yogurt & dairy products',
        className: 'dairy'
    },
    {
        id: 'pulses',
        name: 'Pulses',
        icon: '🫘',
        description: 'Lentils, beans & legumes',
        className: 'pulses'
    },
    {
        id: 'rice',
        name: 'Rice',
        icon: '🍚',
        description: 'Basmati, jasmine & specialty rice',
        className: 'rice'
    },
    {
        id: 'spices',
        name: 'Spices',
        icon: '🌶️',
        description: 'Herbs, spices & seasonings',
        className: 'spices'
    },
    {
        id: 'snacks',
        name: 'Snacks',
        icon: '🍿',
        description: 'Chips, crackers & ready-to-eat',
        className: 'snacks'
    },
    {
        id: 'beverages',
        name: 'Beverages',
        icon: '🥤',
        description: 'Juices, soft drinks & beverages',
        className: 'beverages'
    },
    {
        id: 'household',
        name: 'Household',
        icon: '🧽',
        description: 'Cleaning & household items',
        className: 'household'
    }
];

// Sample products data
const allProducts = {
    bakery: [
        { id: 'p1', name: 'White Bread', price: 12.00, unit: 'loaf', image: '🍞' },
        { id: 'p2', name: 'Whole Wheat Bread', price: 15.00, unit: 'loaf', image: '🍞' },
        { id: 'p3', name: 'Croissant', price: 8.50, unit: 'piece', image: '🥐' },
        { id: 'p4', name: 'Bagel', price: 6.00, unit: 'piece', image: '🥯' }
    ],
    dairy: [
        { id: 'p5', name: 'Milk', price: 14.50, unit: 'liter', image: '🥛' },
        { id: 'p6', name: 'Cheese', price: 25.00, unit: '200g', image: '🧀' },
        { id: 'p7', name: 'Yogurt', price: 8.00, unit: 'cup', image: '🍦' },
        { id: 'p8', name: 'Butter', price: 18.00, unit: '250g', image: '🧈' }
    ],
    pulses: [
        { id: 'p9', name: 'Red Lentils', price: 35.00, unit: 'kg', image: '🫘' },
        { id: 'p10', name: 'Black Beans', price: 40.00, unit: 'kg', image: '🫘' },
        { id: 'p11', name: 'Chickpeas', price: 38.00, unit: 'kg', image: '🫘' },
        { id: 'p12', name: 'Green Peas', price: 32.00, unit: 'kg', image: '🫛' }
    ],
    rice: [
        { id: 'p13', name: 'Basmati Rice', price: 55.00, unit: 'kg', image: '🍚' },
        { id: 'p14', name: 'Jasmine Rice', price: 48.00, unit: 'kg', image: '🍚' },
        { id: 'p15', name: 'Brown Rice', price: 42.00, unit: 'kg', image: '🍚' },
        { id: 'p16', name: 'Wild Rice', price: 65.00, unit: 'kg', image: '🍚' }
    ],
    spices: [
        { id: 'p17', name: 'Turmeric', price: 22.00, unit: '100g', image: '🌶️' },
        { id: 'p18', name: 'Cumin', price: 28.00, unit: '100g', image: '🌶️' },
        { id: 'p19', name: 'Coriander', price: 25.00, unit: '100g', image: '🌿' },
        { id: 'p20', name: 'Black Pepper', price: 45.00, unit: '100g', image: '🌶️' }
    ],
    snacks: [
        { id: 'p21', name: 'Potato Chips', price: 12.00, unit: 'pack', image: '🍟' },
        { id: 'p22', name: 'Crackers', price: 8.50, unit: 'pack', image: '🍘' },
        { id: 'p23', name: 'Nuts Mix', price: 35.00, unit: '250g', image: '🥜' },
        { id: 'p24', name: 'Popcorn', price: 6.00, unit: 'pack', image: '🍿' }
    ],
    beverages: [
        { id: 'p25', name: 'Orange Juice', price: 18.00, unit: 'liter', image: '🧃' },
        { id: 'p26', name: 'Cola', price: 15.00, unit: 'bottle', image: '🥤' },
        { id: 'p27', name: 'Green Tea', price: 25.00, unit: 'box', image: '🍵' },
        { id: 'p28', name: 'Coffee', price: 45.00, unit: '250g', image: '☕' }
    ],
    household: [
        { id: 'p29', name: 'Dish Soap', price: 12.00, unit: 'bottle', image: '🧽' },
        { id: 'p30', name: 'Toilet Paper', price: 25.00, unit: 'pack', image: '🧻' },
        { id: 'p31', name: 'Laundry Detergent', price: 35.00, unit: 'bottle', image: '🧴' },
        { id: 'p32', name: 'All-Purpose Cleaner', price: 18.00, unit: 'bottle', image: '🧽' }
    ]
};