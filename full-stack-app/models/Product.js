let mongoose = require('mongoose')
const productSchema = mongoose.Schema({
    name: String,
    price: String,
    size: String,
    department:String,
    image: String
})
const Product = mongoose.model("Product",productSchema)

module.exports = Product