#Smarterp
Smarterp is a business management web application for handling accounting, inventory, companies, customers, suppliers, vouchers, ledgers, reports, GST summaries, banking, and stock workflows.

The project contains a React/TanStack frontend and an Express/MongoDB backend.

## Features

- Company and company profile management
- Customer and supplier management
- Stock items, stock transfers, reserved stock, damaged stock, and inventory adjustments
- Sales, purchase, receipt, payment, contra, and journal voucher workflows
- Sales returns and purchase returns
- Ledgers, customer ledgers, and supplier ledgers
- Trial balance, balance sheet, profit and loss, cash flow, day book, and GST summary reports
- Banking transaction management
- Dashboard data APIs
- JWT-based authentication backend

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Tailwind CSS
- Radix UI
- Lucide React
- Recharts

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- dotenv
- cors

## Project Structure

```text
nebula-biz-forge-main/
├── backend/
│   ├── controllers/          # Request handlers and business logic
│   ├── middleware/           # Authentication and request middleware
│   ├── models/               # Mongoose schemas and models
│   ├── routes/               # Express route definitions
│   ├── server.js             # Backend application entry point
│   └── package.json          # Backend dependencies and scripts
├── frontend/
│   ├── public/               # Static public assets
│   ├── src/
│   │   ├── assets/           # Frontend images and static assets
│   │   ├── components/
│   │   │   ├── common/       # Shared app components
│   │   │   ├── companies/    # Company-related UI
│   │   │   ├── layout/       # Navbar, sidebar, app layout
│   │   │   ├── parties/      # Customer/supplier UI modules
│   │   │   ├── reports/      # Report UI components
│   │   │   ├── stock/        # Stock and inventory UI
│   │   │   ├── transactions/ # Voucher and transaction UI
│   │   │   └── ui/           # Base reusable UI primitives
│   │   ├── data/             # Static/mock data used by the frontend
│   │   ├── hooks/            # Reusable React hooks
│   │   ├── lib/              # Utility helpers and app configuration
│   │   ├── routes/           # TanStack Router route files
│   │   ├── services/         # API client/service functions
│   │   ├── types/            # Shared TypeScript types
│   │   ├── router.tsx        # Router setup
│   │   ├── routeTree.gen.ts  # Generated route tree
│   │   ├── start.ts          # Frontend start entry
│   │   └── styles.css        # Global styles
│   ├── package.json          # Frontend dependencies and scripts
│   ├── tsconfig.json
│   └── vite.config.ts
├── README.md
└── .gitignore
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB database connection string

## Installation

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/nebula-biz-forge
JWT_SECRET=replace_with_a_secure_secret
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

## Running the Project

Start the backend API:

```bash
cd backend
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The frontend usually runs on:

```text
http://localhost:5173
```

## Available Scripts

### Frontend

```bash
npm run dev        # Start Vite development server
npm run build      # Build production frontend
npm run build:dev  # Build frontend in development mode
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm run format     # Format files with Prettier
```

### Backend

```bash
npm start          # Start backend with Node.js
npm run dev        # Start backend with Nodemon
```

## API Overview

The backend exposes REST APIs under `/api`.

```text
GET  /                         Backend health message
POST /api/auth                  Authentication routes
     /api/companies             Company management
     /api/company-profile       Company profile management
     /api/customers             Customer management
     /api/suppliers             Supplier management
     /api/stock-items           Stock item management
     /api/stock-transfers       Stock transfer management
     /api/inventory-adjustments Inventory adjustment management
     /api/inventory-movement    Inventory movement reports
     /api/reserved-stock        Reserved stock management
     /api/damaged-stock         Damaged stock management
     /api/sales                 Sales vouchers
     /api/sales-returns         Sales returns
     /api/sales-register        Sales register
     /api/purchases             Purchase vouchers
     /api/purchase-returns      Purchase returns
     /api/purchase-register     Purchase register
     /api/receipts              Receipt vouchers
     /api/payments              Payment vouchers
     /api/contra                Contra vouchers
     /api/journals              Journal vouchers
     /api/ledgers               Ledger management
     /api/customer-ledger       Customer ledger reports
     /api/supplier-ledger       Supplier ledger reports
     /api/trial-balance         Trial balance report
     /api/balance-sheet         Balance sheet report
     /api/profit-loss           Profit and loss report
     /api/cash-flow             Cash flow report
     /api/day-book              Day book report
     /api/gst-summary           GST summary report
     /api/banking               Banking transactions
     /api/dashboard             Dashboard data
```

## Development Notes

- Keep frontend API calls inside `frontend/src/services/`.
- Keep shared frontend types inside `frontend/src/types/`.
- Keep reusable UI primitives inside `frontend/src/components/ui/`.
- Keep feature-specific components inside their related component folder.
- Keep backend request handlers in `backend/controllers/`.
- Keep Express route registration in `backend/routes/`.
- Keep database schemas in `backend/models/`.

## Recommended Cleanup

Before committing or sharing the project, remove generated and local-only files:

```text
node_modules/
backend/node_modules/
.output/
.tanstack/
.wrangler/
*.log
```

Make sure these are included in `.gitignore`.

## Build

Create a production frontend build:

```bash
cd frontend
npm run build
```

Preview the production build:

```bash
cd frontend
npm run preview
```

## License

This project is currently private. Add a license before publishing or distributing it.
