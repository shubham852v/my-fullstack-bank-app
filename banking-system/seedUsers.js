// banking-system/seedUsers.js
const connectDB = require('./src/config/db');
const User = require('./src/models/userModel');
const Account = require('./src/models/accountModel');
const mongoose = require('mongoose'); // Import mongoose here to use disconnect in finally block

async function seed() {
    await connectDB(); // Ensure MongoDB is connected

    try {
        console.log('Starting database seeding...');

        // --- IMPORTANT: Clear existing data before seeding to ensure fresh state ---
        console.log('Clearing existing User and Account data...');
        await User.deleteMany({});
        await Account.deleteMany({});
        console.log('Existing User and Account data cleared.');


        // --- Banker User (admin) ---
        // Use `new User()` and `save()` to explicitly trigger the pre('save') hook for hashing.
        const adminUser = new User({
            username: 'admin',
            email: 'adminr@bank.com',
            password: 'admin123', // This plain text will be hashed by the pre-save hook
            role: 'banker'
        });
        await adminUser.save(); // Save the new user document
        console.log('Banker user "admin" created.');

        // --- Customer User (shubham) ---
        const shubhamUser = new User({
            username: 'shubham',
            email: 'shubham@bank.com',
            password: '123456', // This plain text will be hashed by the pre-save hook
            role: 'customer'
        });
        await shubhamUser.save(); // Save the new user document
        console.log('Customer user "shubham" created.');

        // Create an account for shubham
        const accountNumber1 = 'ACC' + Math.floor(100000000 + Math.random() * 900000000);
        await Account.create({
            user: shubhamUser._id, // Use the _id from the newly saved shubhamUser
            accountNumber: accountNumber1,
            balance: 1000.00
        });
        console.log('Customer account created for "shubham".');


        // --- New User (vishwakarmashubham852@gmail.com) ---
        const newUsername = "vishwakarmashubham852@gmail.com";
        const newPassword = "123456"; // Password at least 6 characters

        const newUser = new User({
            username: newUsername,
            email: newUsername,
            password: newPassword, // This plain text will be hashed by the pre-save hook
            role: 'customer'
        });
        await newUser.save(); // Save the new user document
        console.log(`New user '${newUsername}' created.`);

        // Create an account for the new user
        const accountNumber2 = 'ACC' + Math.floor(100000000 + Math.random() * 900000000);
        await Account.create({
            user: newUser._id, // Use the _id from the newly saved newUser
            accountNumber: accountNumber2,
            balance: 500.00
        });
        console.log(`New user's account created for ${newUsername}.`);


        console.log('Database seeding complete.');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Ensure mongoose is connected before trying to disconnect
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect(); // Disconnect from MongoDB
        }
        process.exit();
    }
}

seed();
