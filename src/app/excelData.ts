export const products = [
    { id: 1, date: "2024-03-01", price: 49.29, name: "Wireless Bluetooth Speaker", productCategory: "Electronics", productStock: 50, productRating: 4.5, productSupplier: "ABC Corp", productColor: "Black", warrantyPeriod: 12, discount: 10, isFeatured: true, deliveryType: "Express" },
    { id: 2, date: "2024-02-15", price: 1299, name: "Noise Cancelling Headphones", productCategory: "Electronics", productStock: 40, productRating: 4.8, productSupplier: "XYZ Audio", productColor: "White", warrantyPeriod: 24, discount: 15, isFeatured: true, deliveryType: "Standard" },
    { id: 3, date: "2024-03-02", price: 199, name: "Wireless Mouse", productCategory: "Accessories", productStock: 150, productRating: 4.2, productSupplier: "LogiTech", productColor: "Blue", warrantyPeriod: 12, discount: 5, isFeatured: false, deliveryType: "Same-Day" },
    // Keep your original 20 records with these extra columns, or fill them manually if needed...
];

// Extra columns data generation
const colors = ['Red', 'Blue', 'Black', 'White', 'Green', 'Gray'];
const deliveryTypes = ['Standard', 'Express', 'Same-Day'];

for (let i = 4; i <= 500; i++) {
    products.push({
        id: i,
        date: `2024-${('0' + (Math.floor(Math.random() * 12) + 1)).slice(-2)}-${('0' + (Math.floor(Math.random() * 28) + 1)).slice(-2)}`,
        price: Math.floor(Math.random() * 5000) + 100,
        name: `Product Description ${i}`,
        productCategory: ['Electronics', 'Accessories', 'Wearables', 'Smart Home', 'Appliances'][Math.floor(Math.random() * 5)],
        productStock: Math.floor(Math.random() * 200) + 10,
        productRating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
        productSupplier: `Supplier ${i}`,
        productColor: colors[Math.floor(Math.random() * colors.length)],   // New column
        warrantyPeriod: [6, 12, 24, 36][Math.floor(Math.random() * 4)],   // New column
        discount: Math.floor(Math.random() * 51),                          // New column (0 to 50%)
        isFeatured: Math.random() < 0.5,                                   // New column (boolean)
        deliveryType: deliveryTypes[Math.floor(Math.random() * deliveryTypes.length)] // New column
    });
}
