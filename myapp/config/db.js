const mongoose = require('mongoose');
const uri = "mongodb+srv://ashwanikus:admin@cluster0.zqnutif.mongodb.net/pipLearning";

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = {uri, connectDB};
