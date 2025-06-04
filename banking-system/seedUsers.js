// banking-system/seedUsers.js
const pool = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        // --- Banker User ---
        const hashedPasswordBanker = await bcrypt.hash('1234', 10);
        await pool.execute(
            `INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE password = VALUES(password), role = VALUES(role)`,
            ['admin', 'admin@bank.com', hashedPasswordBanker, 'banker']
        );
        console.log('Banker user seeded.');

        // --- Customer1 User ---
        const hashedPasswordCustomer1 = await bcrypt.hash('123456', 10);
        await pool.execute(
            `INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE password = VALUES(password), role = VALUES(role)`,
            ['shubham', 'shubham@bank.com', hashedPasswordCustomer1, 'customer']
        );
        console.log('Customer user seeded.');

        // Get customer1's user_id
        const [customer1Rows] = await pool.execute('SELECT user_id FROM Users WHERE username = ?', ['shubham']);
        const customer1UserId = customer1Rows[0].user_id;

        // Check if an account already exists for customer1
        const [existingAccount1] = await pool.execute('SELECT account_id FROM Accounts WHERE user_id = ?', [customer1UserId]);
        if (existingAccount1.length === 0) {
            // Create an account for customer1 only if it doesn't exist
            const accountNumber1 = 'ACC' + Math.floor(100000000 + Math.random() * 900000000);
            await pool.execute(
                `INSERT INTO Accounts (user_id, account_number, balance) VALUES (?, ?, ?)`,
                [customer1UserId, accountNumber1, 1000.00]
            );
            console.log('Customer account seeded for customer1.');
        } else {
            console.log('Account for customer1 already exists, skipping creation.');
        }


        // --- New User (vishwakarmashubham852@gmail.com) ---
        const newUsername = "vishwakarmashubham852@gmail.com";
        const newPassword = "1234";
        const hashedPasswordNewUser = await bcrypt.hash(newPassword, 10);

        await pool.execute(
            `INSERT INTO Users (username, email, password, role) VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE password = VALUES(password), role = VALUES(role)`,
            [newUsername, newUsername, hashedPasswordNewUser, 'customer']
        );
        console.log(`New user '${newUsername}' seeded.`);

        // Get the new user's user_id
        const [newUserRows] = await pool.execute('SELECT user_id FROM Users WHERE username = ?', [newUsername]);
        const newUserId = newUserRows[0].user_id;

        // Check if an account already exists for the new user
        const [existingAccount2] = await pool.execute('SELECT account_id FROM Accounts WHERE user_id = ?', [newUserId]);
        if (existingAccount2.length === 0) {
            // Create an account for the new user only if it doesn't exist
            const accountNumber2 = 'ACC' + Math.floor(100000000 + Math.random() * 900000000);
            await pool.execute(
                `INSERT INTO Accounts (user_id, account_number, balance) VALUES (?, ?, ?)`,
                [newUserId, accountNumber2, 500.00]
            );
            console.log(`New user's account seeded for ${newUsername}.`);
        } else {
            console.log(`Account for ${newUsername} already exists, skipping creation.`);
        }


    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        if (pool) await pool.end();
        process.exit();
    }
}

seed();
