const express = require('express')
const router = express.Router()
const mkdirp = require('mkdirp')
const fs = require('fs-extra')
const resizeImg = require('resize-img')

// GET PAGE MODELS
var Category = require('../models/category')
var Product = require('../models/product')
const product = require('../models/product')

// GET PRODUCT PAGE = (index)
router.get('/', (req, res) => {
  var count;

  Product.count(function (err, c) {
    count = c
  })

  Product.find(function (err, products) {
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

// POST ADD PRODUCT PAGE
// router.post('/add-product', function (req, res) {

//   var imageFile;

//   if (req.files) {
//     imageFile = typeof (req.files.image) !== "undefined" ? req.files.image.name : "";
//   }

//   if (!req.files) {
//     imageFile = "";
//   }

router.post('/add-product', function(req, res) {     
  
  let imageFile = '';     
  
  if(req.files !== null) {       
    imageFile = typeof(req.files.image)  !== undefined || null ? req.files.image.name: "";
  }

  req.checkBody('title', 'Title must have a value.').notEmpty();
  req.checkBody('description', 'Description must have a value.').notEmpty();
  req.checkBody('price', 'Price must have a value.').isDecimal();
  req.checkBody('image', 'You must upload an image.').isImage(imageFile);

  var title = req.body.title;
  var slug = title.replace(/\s+/g, '-').toLowerCase();
  var description = req.body.description;
  var price = req.body.price;
  var category = req.body.category;

  var errors = req.validationErrors();

  if (errors) {
    console.log(`ERRORS!!! ${errors}`)

    Category.find(function (err, categories) {
      res.render('admin/add_product', {
        errors: errors,
        title: title,
        description: description,
        categories: categories,
        price: price
      })
    })

  } else {
    Product.findOne({ slug: slug }, function (err, product) {
      if (product) {
        req.flash('danger', "Product Title exists, choose another.")

        Category.find(function (err, categories) {
          res.render('admin/add_product', {
            title: title,
            description: description,
            categories: categories,
            price: price
          })
        })

      } else {
        var price2 = parseFloat(price).toFixed(2)

        var product = new Product({
          title: title,
          slug: slug,
          description: description,
          category: category,
          price: price2,
          image: imageFile
        })

        console.log('Product: SUCCESS!!!')

        product.save(function (err) {
          if (err)
            return console.log(err)

          mkdirp(`public/product_images/${product._id}`, function (err) {
            return console.log(err)
          })

          mkdirp(`public/product_images/${product._id}/gallery`, function (err) {
            return console.log(err)
          })

          mkdirp(`public/product_images/${product._id}/gallery/thumbs`, function (err) {
            return console.log(err)
          })

          if (imageFile != "") {
            var productImage = req.files.image;
            var path = `public/product_images/${product._id}/${imageFile}`;

            productImage.mv(path, function (err) {
              return console.log(err)
            })
          }

          req.flash('success', "Product Added Successfully")
          res.redirect('/admin/products')
        })
      }
    })
  }

});

// GET EDIT PRODUCT
router.get('/edit-product/:id', function (req, res) {

  var errors;

  if (req.session.errors) errors = req.session.errors;
  req.session.errors = null

  Category.find(function (err, categories) {

    product.findById(req.params.id, function (err, prod) {
      if (err) {
        console.log(err)
        res.redirect('/admin/products')
      } else {
        var galleryDir = `public/product_images/${prod._id}/gallery`;
        var galleryImages = null;
      
        fs.readdir(galleryDir, function (err, files) {
          if (err) {
            console.log(err);
          } else {
            galleryImages = files;

            res.render('admin/edit_product', {
              errors: errors,
              title: prod.title,
              description: prod.description,
              categories: categories,
              category: prod.category.replace(/\s+/g, '-').toLowerCase(),
              price: prod.price,
              image: prod.image,
              galleryImages: galleryImages
            })
          }
        })
      }
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
  var id = req.params.id;

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

    Product.findOne({ slug: slug, _id: { '$ne': id } }, function (err, product) {
      if (product) {
        req.flash('danger', "Product exists, choose another.")
        res.redirect('admin/edit_product', {
          title: title,
          slug: slug,
          content: content,
          id: id
        })
      } else {

        Product.findById(id, function (err, product) {
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