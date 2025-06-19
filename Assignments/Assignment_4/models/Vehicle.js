const mongoose = require('mongoose')

const vehicleSchema = mongoose.Schema({
    name:String,
    brand:String,
    price:Number,
    type:String,
    image:String
});
const Vehicle = mongoose.model("Vehicle",vehicleSchema);
module.exports = Vehicle;