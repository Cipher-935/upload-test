const mongoose = require("mongoose");
const file_schema = mongoose.Schema({

    uploded_file_name:{
        type: String,
        required: true
    },
    
    uploaded_file_description:{
        type: String,
        required: true
    },

    uploaded_file_date:{
        type: Date,
        default: Date.now,
        required: true
    },

    uploaded_file_category:{
        type: String,
        default: "General"
    },

    uploaded_file_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    
    uploaded_file_size: {
        type: Number,
        required: true
    },
    
    uploaded_file_storage_location: {
        type: String,
        unique: true,
        required: true
    }
});

const file_data_model = mongoose.model("file_details", file_schema);
module.exports = file_data_model;
