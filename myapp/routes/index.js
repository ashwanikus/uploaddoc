var express = require('express');
var router = express.Router();
var User = require('../models/User');
const bcrypt = require('bcryptjs');

// Middleware to protect routes
function authMiddleware(req, res, next) {
  if (req.session.userId) {
      next();
  } else {
    res.status(401).send('Unauthorized');
  }
}

/* GET api. */
router.get('/', function(req, res, next) {
  res.render('index', { message: '' });
});

router.get('/signup', function(req, res) {
  res.render('signup', { message: "Signup" });
});

router.get('/login', function(req, res) {
  res.render('login', { message: "Login" });
});

/* POST  api. */
router.post('/signup', async (req, res)=> {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });

  try {
    await newUser.save();
    res.render('login', {message: "Register successfully"});
  } catch (error) {
    next(createError(400));
  }
});

router.post('/login',async (req, res)=> {
  const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        res.redirect('/dashboard');
    } else {
      next(createError(400));
    }
});

// User logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
        next(createError(500));
      }
      res.redirect('/login');
  });
});

router.get('/dashboard', authMiddleware, async (req, res) => {
  console.log("req.session.userId: ",req.session.userId);
  const user = await User.findOne({ _id: req.session.userId });

    if (user) {
        req.session.userId = user._id;
        res.render('dashboard', {message: "Login successfully", user});
    } else {
      next(createError(400));
    }
  
});

module.exports = router;
