require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/projects/:projectId/sections', require('./routes/sections'));
app.use('/api/sections', require('./routes/standaloneSections'));
app.use('/api/sections/:sectionId/env', require('./routes/envVariables'));
app.use('/api/env', require('./routes/standaloneEnvVariables'));
app.use('/api/credentials', require('./routes/credentials'));
app.use('/api/notes', require('./routes/notes'));
// app.use('/api/vault', require('./routes/vault'));

app.get('/', (req, res) => res.send('Vaultix Server Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
