
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true, 
        ref: 'User' 
    },
    name: {
        type: String,
        required: false,
    },
    dob: {
        type: Date,
        required: false,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: false,
    },
    contactNumber: {
        type: String,
        required: false,
    },
    interestedInFhir: {
        type: Boolean,
        required: false,
    },
}, {
    timestamps: true 
});

module.exports = mongoose.model('Profile', ProfileSchema);
