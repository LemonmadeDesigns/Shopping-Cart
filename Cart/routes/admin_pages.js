const express = require('express')
const router = express.Router()

// GET PAGE MODELS
let Page = require('../models/page')

// GET ADMIN PAGE = (index)
router.get('/', (req, res) => {
  Page.find({}).sort({ sorting: 1 }).exec(function (err, pages) {
    res.render('admin/pages', {
      pages: pages
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
    res.redirect('admin/add_page', {
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

// POST REODER PAGE 
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

// EXPORTS
module.exports = router;