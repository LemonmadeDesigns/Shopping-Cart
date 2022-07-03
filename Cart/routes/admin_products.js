const express = require('express')
const router = express.Router()
const mkdirp = require('mkdirp')
const fs = require('fs-extra')
const resizeImg = require('resize-img') 

// GET PAGE MODELS
let Category = require('../models/category')
let Product = require('../models/product')

// GET PRODUCT PAGE = (index)
router.get('/', (req, res) => {
  let count;

  Product.count(function (err, c) {
    count = c
  })

  Product.find(function(err, products) {
    res.render('admin/products', {
      products: products,
      count: count
    })
  })
});

// GET ADD PRODUCT PAGE
router.get('/add-product', function (req, res) {

  var title = "";
  var description = "";
  var price = "";

  Category.find(function (err, categories) {

    res.render('admin/add_product', {
      title: title,
      description: description,
      categories: categories,
      price: price
    })

  })

});

// POST ADD PRODUCT = (index)
// router.post('/add-product', function (req, res) {

//   req.checkBody('title', 'Title must have a value.').notEmpty();
//   req.checkBody('content', 'Content must have a value.').notEmpty();

//   var title = req.body.title;
//   var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();

//   // IF SLUG IS EMPTY, IT WILL BE FILLED WITH TITLE
//   if (slug === "") slug = title.replace(/\s+/g, '-').toLowerCase();

//   var content = req.body.content;
//   var errors = req.validationErrors();

//   if (errors) {
//     console.log('ERRORS!!!')
//     res.render('admin/add_product', {
//       errors: errors,
//       title: title,
//       slug: slug,
//       content: content
//     })

//   } else {
//     Product.findOne({ slug: slug }, function (err, product) {
//       if (product) {
//         req.flash('danger', "Product exists, choose another.")
//         res.redirect('admin/add_product', {
//           title: title,
//           slug: slug,
//           content: content
//         })
//       } else {
//         var product = new Product({
//           title: title,
//           slug: slug,
//           content: content,
//           sorting: 100
//         })

//         console.log(title)
//         console.log(slug)
//         console.log(content)
//         console.log('SUCCESS!!!')

//         product.save(function (err) {
//           if (err) return console.log(err)

//           req.flash('success', "product Added Successfully")
//           res.redirect('/admin/products')
//         }) 
//       }
//     })
//   }

// });

// POST REORDER PRODUCT 
// router.post('/reorder-products', function (req, res)  {
//   let ids = req.body['id[]']

//   let count = 0

//   for (let i = 0; i < ids.length; i++) {
//     let id = ids[i]
//     count++;

//     (function(count) {
//       Product.findById(id, function (err, product) {
//         product.sorting = count
//         product.save(function (err) {
//           if (err) return console.log(err)
//         })
//       })
//     })(count)

//   }

//   console.log(req.body);
// });

// GET EDIT PRODUCT
router.get('/edit-product/:id', function (req, res) {

  Product.findById( req.params.id, function (err, product) {
    if (err) 
      return console.log(err)
    
    res.render('admin/edit_product', {
      title: product.title,
      slug: product.slug,
      content: product.content,
      id: product._id
    })

  })

});

// POST PRODUCT EDIT PAGE = (index)
router.post('/edit-product/:id', function (req, res) {

  req.checkBody('title', 'Title must have a value.').notEmpty();
  req.checkBody('content', 'Content must have a value.').notEmpty();

  var title = req.body.title;
  var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();

  // IF SLUG IS EMPTY, IT WILL BE FILLED WITH TITLE
  if (slug === "") 
    slug = title.replace(/\s+/g, '-').toLowerCase();

  var content = req.body.content;
  var      id = req.params.id;

  var errors = req.validationErrors();

  if (errors) {
    // CONSOLE ERRORS
    console.log('ERRORS!!!')

    res.render('admin/edit_product', {
      errors: errors,
      title: title,
      slug: slug,
      content: content,
      id: id
    })

  } else {

    Product.findOne({ slug: slug, _id:{'$ne':id} }, function (err, product) {
      if (product) {
        req.flash('danger', "Product exists, choose another.")
        res.redirect('admin/edit_product', {
          title: title,
          slug: slug,
          content: content,
          id: id
        })
      } else {

        Product.findById(id, function(err, product) {
          if (err) return console.log(err)

          product.title = title;
          product.slug = slug;
          product.content = content;

          product.save(function (err) {
            if (err) 
              return console.log(err)

            req.flash('success', "Product Added Successfully")
            res.redirect(`/admin/products/edit-product/${id}`)
          }) 
        })

        console.log(`Title: ${title}`)
        console.log(`Slug: ${slug}`)
        console.log(`Content: ${content}`)
        console.log('SUCCESS!!!')

     
      }
    })
  }
});

// GET PRODUCT DELETE PAGE = (index)
router.get('/delete_product/:id', (req, res) => {
  Product.findByIdAndRemove(req.params.id, function (err) {
    if (err) console.log(err)

    req.flash('success', "Product Deleted Successfully")
    res.redirect('/admin/products/')
  })
 
});

// EXPORTS
module.exports = router;