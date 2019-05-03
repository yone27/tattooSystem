const express = require('express');
const router = express.Router();
const Tattoo = require('../models/Tattoo');
const Post = require('../models/Post');
const Cite = require('../models/Cite');
const User = require('../models/User');
const {unlink} = require('fs-extra')
const path = require('path')
const passport = require('passport');
const { isAuthenticated } = require('../helpers/auth');

router.get('/', async (req, res) => {
  const tattoos = await Tattoo.find().limit(8);
  const posts = await Post.find().limit(8);
  res.render('index', {tattoos, posts});
});
// user
router.get('/admin', (req, res) => {
  res.render('users/signin');
});
router.get('/admin/signup', (req, res) => {
  res.render('users/signup');
});
router.post('/admin', passport.authenticate('local', {
  successRedirect: '/admin/panel',
  failureRedirect: '/admin',
  failureFlash: true
}))
router.post('/admin/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (name.length < 1 || email.length < 1 || password.length < 1) {
      errors.push({ text: 'LLena todos los inputs ' })
  }
  if (errors.length > 0) {
      res.render('users/signup', { errors, name, email, password, passwordConfirm })
  } else {
      // Emails not repeat
      const emailUser = await User.findOne({ email: email });
      if (emailUser) {
          req.flash('errorMsg', 'Ya existe este email');
          res.redirect('/admin/signup');
      }
      const newUser = new User({ name, email, password });
      // contraseña cifrada
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash('successMsg', 'Estas registrado');
      res.redirect('/admin/signin');
  }
})
router.get('/admin/logout', (req, res) => {
  req.logout();
  res.redirect('/admin');
})

router.get('/admin/panel',isAuthenticated, (req, res) => {
  res.render('admin');
});

// blog arte
router.get('/admin/blog/add',isAuthenticated, (req, res) => {
  res.render('blog/add');
});

router.get('/admin/blog/:id',isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  res.render('blog/more', {post});
});

router.post('/admin/blog/add',isAuthenticated, async(req, res) => {
  const post = new Post();
  post.title = req.body.title;
  post.subtitle = req.body.subtitle;
  post.description = req.body.description;
  post.summary = req.body.summary;
  post.path = '/img/uploads/'+req.file.filename;
  post.originalname = req.file.originalname;
  post.cnt = await Post.countDocuments();
  await post.save();
  res.redirect("/admin/blog/add");
});

// tatto
router.get('/admin/tattoo/add',isAuthenticated, (req, res) => {
  res.render('tattoo/add');
});

router.get('/admin/tattoo/view',isAuthenticated, async(req, res) => {
  const tattoos = await Tattoo.find();
  res.render('tattoo/view', {tattoos});
});
router.post('/admin/tattoo/add',isAuthenticated, async(req, res) => {
  const tattoo = new Tattoo();
  tattoo.title = req.body.title;
  tattoo.description = req.body.description;
  tattoo.path = '/img/uploads/'+req.file.filename;
  tattoo.originalname = req.file.originalname;
  tattoo.cnt = await Tattoo.count();
  await tattoo.save();
  res.redirect("/admin/tattoo/add");
});

router.get('/admin/tattoo/:id/delete',isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const image = await Tattoo.findByIdAndDelete(id)
  await unlink(path.resolve('./src/public' + image.path))
  res.redirect('/admin/tattoo/view');
})
// cite
router.post('/cite', async(req, res) => {
  const cite = new Cite();
  cite.name = req.body.name;
  cite.email = req.body.email;
  cite.message = req.body.message;
  cite.cnt = await Cite.countDocuments();
  await cite.save();
  res.redirect("/");
});

router.get('/admin/cite',isAuthenticated, async(req, res) => {
  const cites = await Cite.find();
  res.render('cite/view', {cites});
});

router.get('/admin/blogs',isAuthenticated, async(req, res) => {
  const posts = await Post.find();
  res.render('blog/view', {posts});
});
router.get('/admin/blogs/:id/delete',isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const image = await Post.findByIdAndDelete(id)
  await unlink(path.resolve('./src/public' + image.path))
  res.redirect('/admin/blog/view');
})

router.get('/admin/cite/:id/delete',isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const cite = await Cite.findByIdAndDelete(id)
  res.redirect('/admin/cite/view');
})
module.exports = router;