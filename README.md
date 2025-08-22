 Banking Dashboard Frontend

This is the frontend application for the **Banking Dashboard** project, built using **Next.js**, **TypeScript**, and **Tailwind CSS**. It connects to a secure Express.js backend via REST API for features such as user authentication, transaction history, account management, and admin operations.

## 🖥️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **API Communication:** Axios
- **Authentication:** JWT (via cookies)

---

## 🔐 Key Features

- User registration and login
- Secure authentication with JWT tokens (stored in HttpOnly cookies)
- View current account balance
- View transaction history
- Initiate money transfers
- Admin user management (view all users, search, filter, pagination)
- Error handling and input validation
- Responsive UI

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Backend server running at `http://localhost:5000` (or your configured backend URL)

### Installation


# Clone the repository
git clone https://github.com/yourusername/bank_frontend.git
cd bank_frontend

# Install dependencies
npm install
# or
yarn install
Running the Development Server

npm run dev
# or
yarn dev
Open http://localhost:3000 to view the app in your browser.

📂 Project Structure

bank_frontend/
│
├── app/                  # Next.js App Router pages
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   ├── dashboard/        # Main user dashboard
│   └── admin/            # Admin section
│
├── components/           # Reusable UI components
├── services/             # Axios API service functions
├── utils/                # Utility functions and types
├── styles/               # Tailwind & global CSS
├── public/               # Static assets
└── README.md


<img width="691" height="526" alt="image" src="https://github.com/user-attachments/assets/07fcb6f0-a4a0-46a6-a4d7-d5082eea8d97" />
<img width="564" height="590" alt="image" src="https://github.com/user-attachments/assets/2b69ceed-e1a4-4df6-baff-f766186b15ef" />

<img width="1302" height="596" alt="image" src="https://github.com/user-attachments/assets/ff8163b8-ef37-4711-8eab-2462fa36a08c" />



<img width="1278" height="577" alt="image" src="https://github.com/user-attachments/assets/7932b556-0a7a-4e81-aa42-c9315f07d601" />
