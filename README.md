# FlavorFleet - A Manifest-Powered Food App

FlavorFleet is a full-stack food ordering application built entirely with React and Manifest. It provides a seamless experience for customers to browse restaurants and place orders, and for restaurant owners to manage their business.

## Features

- **Role-Based Access Control**: Separate dashboards and functionality for Customers and Restaurant Owners, enforced by Manifest policies.
- **Restaurant & Menu Management**: Owners can create, update, and delete their restaurants and menu items.
- **Customer Ordering**: Customers can browse all restaurants, view menus, add items to a cart, and place orders.
- **Order History**: Customers can view their past orders and their status.
- **Built-in Admin Panel**: A complete admin interface is available at `/admin` for platform management.
- **100% Manifest Backend**: All data operations, authentication, and file storage are handled by the Manifest backend and SDK.

## Getting Started

### Prerequisites

- Node.js and npm
- Manifest CLI

### Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository_url>
    cd flavor-fleet
    ```

2.  **Install frontend dependencies**:
    ```bash
    npm install
    ```

3.  **Run the Manifest backend**:
    From the project root, start the Manifest development server:
    ```bash
    mnfst dev
    ```
    The backend will be running, typically at `http://localhost:3000`.

4.  **Run the React frontend**:
    In a new terminal, start the Vite development server:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Demo Credentials

- **Customer**: `customer@example.com` / `password`
- **Owner**: `owner@example.com` / `password`
- **Admin**: Access the admin panel at `http://localhost:3000/admin` with `admin@manifest.build` / `admin`.