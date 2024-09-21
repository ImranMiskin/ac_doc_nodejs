const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://connexgrow:Connex%401234@cluster0.mppg7du.mongodb.net/ac_doc', {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully.');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
