const mongoose = require('mongoose')

// PRODUCT SCHEMA
let ProductSchema = mongoose.Schema({

  title: {
    type: String
    , required: true
  },

  slug: {
    type: String
  },

  description: {
    type: String
    , required: true
  },

  description: {
    type: String
    , required: true
  },

  price: {
    type: Number
    , required: true
  },

  image: {
    type: String
  },

});

let Product = module.exports = mongoose.model('Product', ProductSchema);