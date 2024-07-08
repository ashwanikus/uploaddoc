var express = require('express');
var router = express.Router();
var User = require('../models/User');
var uploadedFiles = require('../models/Upload');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

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
  const user = await User.findOne({ _id: req.session.userId });

    if (user) {
        req.session.userId = user._id;
        res.render('dashboard', {message: "Login successfully", user});
    } else {
      next(createError(400));
    }
});

router.post('/upload', authMiddleware, upload.single('file') , async (req,res)=>{
  const {originalname,mimetype, path, size, filename} = req.file;
  const user = await User.findOne({ _id: req.session.userId });
  const uploadedby = user.username;
  const uploadedbyid = user._id;
  const uploadedon = new Date();
  
  const newFileInfo = new uploadedFiles({ originalname,mimetype, filepath: path, size, filename, uploadedby, uploadedbyid, uploadedon});

  try {
    await newFileInfo.save();
    res.send('File uploaded successfully.');
  }catch(error){
    return res.status(400).send('No file uploaded.');
  }
  
});

module.exports = router;
