require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); // ✅ fixed typo
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressLayouts);

app.set('layout', 'layout');
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
app.use('/', frontendRoutes);

// Admin layout middleware (before admin routes)
app.use('/admin', (req, res, next) => {
  res.locals.layout = 'admin/layout';
  next();
});

// Admin routes
app.use('/admin', adminRoutes);

// --------------------
// 🚀 Server Start
// --------------------
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
