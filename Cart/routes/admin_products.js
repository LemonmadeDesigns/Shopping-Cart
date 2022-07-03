const express = require('express')
const router = express.Router()
const mkdirp = require('mkdirp')
const fs = require('fs-extra')
const resizeImg = require('resize-img') 

// GET PAGE MODELS
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

// TESTING ROUTES
router.get('/test', (req, res) => {
  res.send("Test Working!")
});

// GET ADD PAGE = (index)
router.get('/add-page', function (req, res) {

  var title = "";
  var slug = "";
  var content = "";

  res.render('admin/add_page', {
    title: title,
    slug: slug,
    content: content
  })

});

// POST ADD PAGE = (index)
router.post('/add-page', function (req, res) {

  req.checkBody('title', 'Title must have a value.').notEmpty();
  req.checkBody('content', 'Content must have a value.').notEmpty();

  var title = req.body.title;
  var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();

  // IF SLUG IS EMPTY, IT WILL BE FILLED WITH TITLE
  if (slug === "") slug = title.replace(/\s+/g, '-').toLowerCase();

  var content = req.body.content;
  var errors = req.validationErrors();

  if (errors) {
    console.log('ERRORS!!!')
    res.render('admin/add_page', {
      errors: errors,
      title: title,
      slug: slug,
      content: content
    })

  } else {
    Page.findOne({ slug: slug }, function (err, page) {
      if (page) {
        req.flash('danger', "Page slug exists, choose another.")
        res.redirect('admin/add_page', {
          title: title,
          slug: slug,
          content: content
        })
      } else {
        var page = new Page({
          title: title,
          slug: slug,
          content: content,
          sorting: 100
        })

        console.log(title)
        console.log(slug)
        console.log(content)
        console.log('SUCCESS!!!')

        page.save(function (err) {
          if (err) return console.log(err)

          req.flash('success', "Page Added Successfully")
          res.redirect('/admin/pages')
        }) 
      }
    })
  }

});

// POST REORDER PAGE 
router.post('/reorder-pages', function (req, res)  {
  let ids = req.body['id[]']

  let count = 0

  for (let i = 0; i < ids.length; i++) {
    let id = ids[i]
    count++;

    (function(count) {
      Page.findById(id, function (err, page) {
        page.sorting = count
        page.save(function (err) {
          if (err) return console.log(err)
        })
      })
    })(count)

  }

  console.log(req.body);
});

// GET EDIT PAGE
router.get('/edit-page/:id', function (req, res) {

  Page.findById( req.params.id, function (err, page) {
    if (err) 
      return console.log(err)
    
    res.render('admin/edit_page', {
      title: page.title,
      slug: page.slug,
      content: page.content,
      id: page._id
    })

  })

});

// POST EDIT PAGE = (index)
router.post('/edit-page/:id', function (req, res) {

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

    res.render('admin/edit_page', {
      errors: errors,
      title: title,
      slug: slug,
      content: content,
      id: id
    })

  } else {

    Page.findOne({ slug: slug, _id:{'$ne':id} }, function (err, page) {
      if (page) {
        req.flash('danger', "Page slug exists, choose another.")
        res.redirect('admin/edit_page', {
          title: title,
          slug: slug,
          content: content,
          id: id
        })
      } else {

        Page.findById(id, function(err, page) {
          if (err) return console.log(err)

          page.title = title;
          page.slug = slug;
          page.content = content;

          page.save(function (err) {
            if (err) 
              return console.log(err)

            req.flash('success', "Page Added Successfully")
            res.redirect(`/admin/pages/edit-page/${id}`)
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

// GET DELETE PAGE = (index)
router.get('/delete_page/:id', (req, res) => {
  Page.findByIdAndRemove(req.params.id, function (err) {
    if (err) console.log(err)

    req.flash('success', "Page Deleted Successfully")
    res.redirect('/admin/pages/')
  })
 
});

// EXPORTS
module.exports = router;