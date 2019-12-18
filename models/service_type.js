const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const servicesTypeSchema = new Schema({
   
    type: {
        type: String,
        required: true,
    },
    type_img: {
        type: String
    }
});

module.exports = mongoose.model('service_type', servicesTypeSchema);