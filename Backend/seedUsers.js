const connectDB = require('./src/config/db');
const User = require('./src/models/userModel');
const Account = require('./src/models/accountModel');
const mongoose = require('mongoose');

async function seed() {
    await connectDB();

    try {
        console.log('Starting database seeding...');

        console.log('Clearing existing User and Account data...');
        await User.deleteMany({});
        await Account.deleteMany({});
        console.log('Existing User and Account data cleared.');

        const adminUser = new User({
            username: 'admin',
            email: 'adminr@bank.com',
            password: 'admin123',
            role: 'banker'
        });
        await adminUser.save();
        console.log('Banker user "admin" created.');

        const shubhamUser = new User({
            username: 'shubham',
            email: 'shubham@bank.com',
            password: '123456',
            role: 'customer'
        });
        await shubhamUser.save();
        console.log('Customer user "shubham" created.');

        const accountNumber1 = 'ACC' + Math.floor(100000000 + Math.random() * 900000000);
        await Account.create({
            user: shubhamUser._id,
            accountNumber: accountNumber1,
            balance: 1000.00
        });
        console.log('Customer account created for "shubham".');

        const newUsername = "shubham852@gmail.com";
        const newPassword = "123456";

        const newUser = new User({
            username: newUsername,
            email: newUsername,
            password: newPassword,
            role: 'customer'
        });
        await newUser.save();
        console.log(`New user '${newUsername}' created.`);

        const accountNumber2 = 'ACC' + Math.floor(100000000 + Math.random() * 900000000);
        await Account.create({
            user: newUser._id,
            accountNumber: accountNumber2,
            balance: 500.00
        });
        console.log(`New user's account created for ${newUsername}.`);

        console.log('Database seeding complete.');

    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        process.exit();
    }
}

seed();
