const express = require('express')
const router = express.Router()

// GET CATEGORY MODELS
const Category = require('../models/category')

// GET CATEGORIES PAGE = (index)
router.get('/', (req, res) => {

  Category.find(function (err, categories) {

    if (err)
      return console.log(err);

    res.render('admin/categories', {
      categories: categories
    });

  })
 
});

// GET ADD CATEGORY PAGE
router.get('/add-category', function (req, res) {

  var title = "";

  res.render('admin/add_category', {
    title: title
  })

});

// POST ADD CATEGORY PAGE
router.post('/add-category', function (req, res) {

  req.checkBody('title', 'Title must have a value.').notEmpty();

  var title = req.body.title;
  var slug = title.replace(/\s+/g, '-').toLowerCase();

  var errors = req.validationErrors();

  if (errors) {
    console.log('ERRORS!!!')
    res.redirect('admin/add_category', {
      errors: errors,
      title: title
    })

  } else {
    Category.findOne({ slug: slug }, function (err, category) {
      if (category) {
        req.flash('danger', "Category title exists, choose another.")
        res.render('admin/add_category', {
          title: title,
        })
      } else {
        var category = new Category({
          title: title,
          slug: slug
        })

        console.log(`Title: ${title}`)
        console.log('SUCCESS!!!')

        category.save(function (err) {
          if (err) return console.log(err)

          req.flash('success', "Category Added Successfully")
          res.redirect('/admin/categories')
        }) 
      }
    })
  }

});

// GET EDIT CATEGORY
router.get('/edit-category/:id', function (req, res) {

  Category.findById( req.params.id, function (err, category) {
    if (err) 
      return console.log(err)
    
    res.render('admin/edit_category', {
      title: category.title,
      id: category._id
    })

  })

});

// POST EDIT CATEGORY PAGE
router.post('/edit-category/:id', function (req, res) {

  req.checkBody('title', 'Title must have a value.').notEmpty();

  var title = req.body.title;
  var slug = title.replace(/\s+/g, '-').toLowerCase();
  var id = req.params.id;

  var errors = req.validationErrors();

  if (errors) {
    // CONSOLE ERRORS
    console.log('Found ERRORS!!!')

    res.render('admin/edit_category', {
      errors: errors,
      title: title,
      id: id
    })

  } else {

    Category.findOne({ slug: slug, _id:{'$ne':id} }, function (err, category) {
      if (category) {
        req.flash('danger', "Category Title exists, choose another.")
        res.render('admin/edit_category', {
          title: title,
          id: id
        })

      } else {
        Category.findById(id, function(err, category) {
          if (err) return console.log(err)

          category.title = title;
          category.slug = slug;

          category.save(function (err) {
            if (err) 
              return console.log(err)

            let CAT = `${category.title.toUpperCase()}`

            req.flash('success', `${CAT} Category Added Successfully`)
            res.redirect(`/admin/categories/edit-category/${id}`)
          }) 
        })

        console.log(`Title: ${title}`)
        console.log('SUCCESS!!!')
      }
    })
  }
});

// GET DELETE CATEGORY
router.get('/delete-category/:id', (req, res) => {
  Category.findByIdAndRemove(req.params.id, function (err) {
    if (err) console.log(err)

    req.flash('success', "Category Deleted Successfully")
    res.redirect('/admin/categories/')
  })
 
});

// EXPORTS
module.exports = router;