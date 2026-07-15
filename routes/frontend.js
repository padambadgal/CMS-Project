const express = require('express');
const router = express.Router();

const siteController = require('../controllers/siteController');
const loadCommonData = require('../middleware/loadCommonData');

// Apply loadCommonData to all frontend routes
router.use(loadCommonData);

// Frontend Routes
router.get('/', siteController.index);
router.get('/category/:name', siteController.articleByCategories);
router.get('/single/:id', siteController.singleArticle);
router.get('/search', siteController.search);
router.get('/author/:name', siteController.author);
router.post('/single/:id/comment', siteController.addComment);

// Testing route (remove in production)
router.get('/testing', siteController.testing);

// ============================================
// 404 Error Handling Middleware
// ============================================
router.use((req, res, next) => {
    res.status(404).render('404', {    
        message: 'Page not found',
        layout: 'layout' // Make sure layout is applied
    });
});

// ============================================
// 500 Error Handler
// ============================================
router.use((err, req, res, next) => {
    console.error('❌ Frontend Error:', err.stack);
    const status = err.status || 500; 
    const message = err.message || 'Something went wrong';

    // If it's a 404, render 404 page
    if (status === 404) {
        return res.status(404).render('404', { 
            message: err.message || 'Page not found',
            layout: 'layout'
        });
    }

    res.status(status).render('errors', {    
        message: message,
        status: status,
        layout: 'layout'
    });
});

module.exports = router;