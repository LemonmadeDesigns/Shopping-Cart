const mongoose = require('mongoose')

// CATEGORY SCHEMA
let CategorySchema = mongoose.Schema({

  title: {
    type: String
    // , required: true
  },

  slug: {
    type: String
  }

});

let Category = module.exports = mongoose.model('Category', CategorySchema);

