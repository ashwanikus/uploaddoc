const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    uploadedby: {
        type: String,
        required: true,
    },
    uploadedon:{
        type: Date
    },
    uploadedbyid:{
        type: String
    },
    mimetype: {
        type: String
    },
    filename: {
        type: String
    },
    filepath: {
        type: String
    },
    size: {
        type: Number
    },
    originalname: {
        type: String
    }
});

const uploadedFiles = mongoose.model('uploadedFiles', FileSchema);

module.exports = uploadedFiles;
