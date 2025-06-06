# SIMPLE-BANKING-SYSTEM

Transforming traditional banking into a modern, secure, and user-friendly experience.

## Deployment

The project is deployed on Render.com.


* Deployed Frontend Application: https://my-fullstack-bank-app-frontend.onrender.com/



## Overview

This project is a full-stack banking application designed to provide basic banking functionalities for both customers and bankers. It features a responsive user interface built with React.js and a robust backend API developed with Node.js and Express, backed by a MongoDB database. The architecture follows a Model-View-Controller (MVC) pattern on the backend for clear separation of concerns.

## Features

### Customer Module:

* **Secure Login:** Authenticate as a customer.
* **Dashboard:** View current account balance and transaction history.
* **Deposit Funds:** Easily deposit money into the account.
* **Withdraw Funds:** Withdraw money from the account, with balance checks.
* **Responsive Design:** Optimized for various devices (mobile, tablet, desktop).

### Banker Module:

* **Secure Login:** Authenticate as a banker.
* **View All Customer Accounts:** Overview of all customer accounts, including usernames, emails, account numbers, and balances.
* **View Customer Transactions:** Detailed transaction history for any specific customer.
* **Responsive Design:** Optimized for various devices (mobile, tablet, desktop).

## Technologies Used

Built with the following tools and technologies:

* React.js
* Node.js
* Express
* MongoDB

## Project Structure

The project is organized into two main folders:

* `bank-app/`: Contains the React.js frontend application.
* `banking-system/`: Contains the Node.js/Express backend API.

The backend specifically follows an MVC (Model-View-Controller) inspired architecture with dedicated folders for:

* `src/models/`: MongoDB schemas and Mongoose models.
* `src/controllers/`: Business logic and request handling.
* `src/routes/`: API endpoint definitions.
* `src/config/`: Database connection configuration.
* `src/middleware/`: Authentication and authorization middleware.
* `src/utils/`: Helper functions.

## Setup and Installation (Local)

To run this project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/shubham852v/my-fullstack-bank-app.git](https://github.com/shubham852v/my-fullstack-bank-app.git)
    cd my-fullstack-bank-app
    ```

2.  **Backend Setup (banking-system):**

    1.  Navigate to the backend directory:

        ```bash
        cd banking-system
        ```

    2.  Install dependencies:

        ```bash
        npm install
        ```

    3.  Create a `.env` file in the `banking-system/` directory and add your MongoDB connection string and JWT secret:

        ```
        MONGO_URI=mongodb+srv://<your_username>:<your_password>@cluster0.xxxxx.mongodb.net/<your_database_name>
        JWT_SECRET=a_very_strong_random_secret_key_for_jwt
        FRONTEND_URL=http://localhost:5173
        PORT=5000
        ```

        Replace placeholders with your actual MongoDB Atlas URI.

    4.  Seed the database: This will create initial banker and customer accounts.

        ```bash
        node seedUsers.js
        ```

    5.  Start the backend server:

        ```bash
        npm start
        ```

        (or `node src/app.js`)

3.  **Frontend Setup (bank-app):**

    1.  Open a new terminal window and navigate to the frontend directory:

        ```bash
        cd ../bank-app
        ```

    2.  Install dependencies:

        ```bash
        npm install
        ```

    3.  Create a `.env` file in the `bank-app/` directory and add your backend API URL (for local development):

        ```
        VITE_API_URL=http://localhost:5000/api
        ```

    4.  Start the frontend development server:

        ```bash
        npm run dev
        ```

        The frontend application will typically open in your browser at [http://localhost:5173/](http://localhost:5173/).


## Image

Here's an image representing a modern banking application interface:

http://googleusercontent.com/image_generation_content/0

## Contributing

Contributions are welcome! If you have suggestions for improvements or find issues, please open an issue or submit a pull request.

## License

This project is licensed under the ISC License. See the [ISC License - Open Source Initiative](https://opensource.org/license/isc-license-txt) for details.
