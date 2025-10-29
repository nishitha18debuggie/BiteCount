require('dotenv').config();
const mongoose = require('mongoose');
const Food = require('./models/Food');

// Sample food data
const sampleFoods = [
    // Breakfast
    { name: 'Oatmeal', calories: 68, protein: 2.4, carbs: 12, fats: 1.4, servingSize: '100g', category: 'breakfast' },
    { name: 'Scrambled Eggs', calories: 149, protein: 10, carbs: 1.6, fats: 11, servingSize: '100g', category: 'breakfast' },
    { name: 'Whole Wheat Toast', calories: 247, protein: 13, carbs: 41, fats: 3.4, servingSize: '100g', category: 'breakfast' },
    { name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fats: 0.4, servingSize: '100g', category: 'breakfast' },
    { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fats: 0.3, servingSize: '1 medium', category: 'breakfast' },
    
    // Lunch/Dinner
    { name: 'Grilled Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 3.6, servingSize: '100g', category: 'lunch' },
    { name: 'Brown Rice', calories: 111, protein: 2.6, carbs: 23, fats: 0.9, servingSize: '100g', category: 'lunch' },
    { name: 'Steamed Broccoli', calories: 35, protein: 2.4, carbs: 7, fats: 0.4, servingSize: '100g', category: 'dinner' },
    { name: 'Salmon', calories: 208, protein: 20, carbs: 0, fats: 13, servingSize: '100g', category: 'dinner' },
    { name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fats: 0.1, servingSize: '100g', category: 'dinner' },
    { name: 'Quinoa', calories: 120, protein: 4.4, carbs: 21, fats: 1.9, servingSize: '100g', category: 'lunch' },
    { name: 'Lentils', calories: 116, protein: 9, carbs: 20, fats: 0.4, servingSize: '100g', category: 'lunch' },
    
    // Snacks
    { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fats: 0.2, servingSize: '1 medium', category: 'snack' },
    { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fats: 50, servingSize: '100g', category: 'snack' },
    { name: 'Carrot Sticks', calories: 41, protein: 0.9, carbs: 10, fats: 0.2, servingSize: '100g', category: 'snack' },
    { name: 'Hummus', calories: 166, protein: 8, carbs: 14, fats: 10, servingSize: '100g', category: 'snack' },
    { name: 'Protein Bar', calories: 200, protein: 20, carbs: 22, fats: 7, servingSize: '1 bar', category: 'snack' },
    
    // Beverages
    { name: 'Green Tea', calories: 1, protein: 0, carbs: 0, fats: 0, servingSize: '1 cup', category: 'beverage' },
    { name: 'Black Coffee', calories: 2, protein: 0.3, carbs: 0, fats: 0, servingSize: '1 cup', category: 'beverage' },
    { name: 'Skim Milk', calories: 34, protein: 3.4, carbs: 5, fats: 0.1, servingSize: '100ml', category: 'beverage' },
    { name: 'Orange Juice', calories: 45, protein: 0.7, carbs: 10, fats: 0.2, servingSize: '100ml', category: 'beverage' },
    
    // Indian Foods
    { name: 'Roti (Whole Wheat)', calories: 71, protein: 3, carbs: 15, fats: 0.4, servingSize: '1 piece', category: 'lunch' },
    { name: 'Dal (Lentil Curry)', calories: 104, protein: 7, carbs: 18, fats: 0.5, servingSize: '100g', category: 'lunch' },
    { name: 'Paneer', calories: 265, protein: 18, carbs: 1.2, fats: 20, servingSize: '100g', category: 'dinner' },
    { name: 'Idli', calories: 39, protein: 2, carbs: 8, fats: 0.1, servingSize: '1 piece', category: 'breakfast' },
    { name: 'Dosa', calories: 133, protein: 2.6, carbs: 28, fats: 0.5, servingSize: '1 piece', category: 'breakfast' },
];

async function seedDatabase() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Clear existing foods (optional)
        await Food.deleteMany({ isCustom: false });
        console.log('Cleared existing foods');

        // Insert sample foods
        await Food.insertMany(sampleFoods);
        console.log(`✅ Successfully seeded ${sampleFoods.length} food items`);

        mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();
