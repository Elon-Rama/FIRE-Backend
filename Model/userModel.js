
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
        type: String,
        required: false,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: false,
    },
    address:{
        type:String,
        required:false,
    },
    city:{
        type:String,
        required:false,
    },
    occupation:{
        type:String,
        required:false,
    },
    contactNumber: {
        type: String,
        required: false,
    },
    // interestedInFIFP: {
    //     type: Boolean,
    //     required: false,
    // },
}, {
    timestamps: true 
});

module.exports = mongoose.model('Profile', ProfileSchema);
