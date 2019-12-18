const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    bookedTime:{
        type:Number,
        default:new Date().getTime()
    },
    bookingDate:{
        type: String,
        required: true
    },
    bookingId:{
        type: String,
        required: true
    },
    bookingTime:{
        type: String,
        required: true
    },
    bookingAddress:{
        type: String,
        required: true
    },
    paymentStatus:{
        type: String,
        required: true
    },
    userComment: {
        type: String
    },
    services:[
        {
            serviceId:{
                type: Schema.Types.ObjectId,
                ref: 'Services'
            },
            quantity:{
                type: Number
            },
            id: {
                type: Number
            },
            name: {
                type: String
            }
        }
    ],
    paymentMode:{
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    mihpayid:{
        type: String
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderStatus:{
        type:String,
        default:'Pendingssss'
    }
});

module.exports = mongoose.model('Booking', bookingSchema);