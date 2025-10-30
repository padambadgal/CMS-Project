require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); // ✅ fixed typo
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const minifyHTML = require('express-minify-html-terser');
const flash = require('connect-flash');
const compression = require('compression');
const port = 3000;
const app = express();

// --------------------
// ⚙️ Database Connection
// --------------------
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// --------------------
// ⚙️ Middleware Setup
// --------------------
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json({limit: '10mb'}));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '1d'}));
app.use(cookieParser());
app.use(expressLayouts);
app.set('layout', 'layout');
app.use(compression({
  level: 9,
  threshold: 10 * 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

app.use(minifyHTML({
    override:      true,
    exception_url: false,
    htmlMinifier: {
        removeComments:            true,
        collapseWhitespace:        true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes:     true,
        removeEmptyAttributes:     true,
        minifyJS:                  true
    }
}));

//View Engine
app.set('view engine', 'ejs');

// --------------------
// 💾 Session & Flash
// --------------------
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());

// --------------------
// 🌐 Global Flash Messages
// --------------------
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// --------------------
// 🛣️ Routes
// --------------------
const frontendRoutes = require('./routes/frontend');
const adminRoutes = require('./routes/admin');

// Frontend routes

// Admin layout middleware (before admin routes)
app.use('/admin', (req, res, next) => {
  res.locals.layout = 'admin/layout';
  next();
});

// Admin routes
app.use('/admin', adminRoutes);

app.use('/', frontendRoutes);

// --------------------
// 🚀 Server Start
// --------------------
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
