# Envora

Envora is a personal developer vault that allows users to store environment variables, account credentials, and secure notes.

## Project Structure

- `client/`: React frontend application built with Vite, Tailwind CSS, React Router, and Axios.
- `server/`: Node.js backend server built with Express.js, MongoDB/Mongoose, using JWT for authentication.

## Installation & Setup

### Prerequisites

- Node.js installed
- MongoDB installed and running on `localhost:27017` (or update the `.env` file)

### Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd Envora/server
   ```
2. The dependencies have already been installed (`express`, `mongoose`, `dotenv`, `cors`, `bcrypt`, `jsonwebtoken`). If you cloned it fresh, run `npm install`.
3. Check the `server/.env` file. It defaults to:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/Envora
   JWT_SECRET=your_jwt_secret_here
   ```
4. Start the development server:
   ```bash
   npm start
   # Important: you need to add "start": "node server.js" to server/package.json 
   # Or run 'node server.js' directly.
   node server.js
   ```

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd Envora/client
   ```
2. The dependencies have already been installed (Vite React app, Tailwind CSS, React Router DOM, Axios). If you cloned it fresh, run `npm install`.
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the application in your browser (typically at http://localhost:5173).

## Development

- Start adding your backend routes in `server/routes`.
- Add your frontend components in `client/src/components` and pages in `client/src/pages`.

Enjoy building Envora!
