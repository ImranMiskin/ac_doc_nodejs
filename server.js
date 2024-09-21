const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./src/routes/UserRoutes/user.routes');
const adminRoutes = require('./src/routes/AdminRoutes/admin.routes');
const locationRoutes = require('./src/routes/LocationRoutes/location.routes');
const serviceRoutes = require('./src/routes/ServiceRoutes/service.routes');
const connectDB = require('./src/Config/db');

dotenv.config();
const app = express();
app.use(express.json());

// Convert process.env.PORT to a number or default to 3500
const port = parseInt(process.env.PORT || '3500', 10);

// Config Cross-Origin Resource Sharing (CORS) for all origins.
app.use(cors());

// Database connection
connectDB();

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/service", serviceRoutes);

app.get("*", (req, res) => {
    res.status(404).send("HTTP 404 Not Found");
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
