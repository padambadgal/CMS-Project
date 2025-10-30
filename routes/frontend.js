const express = require('express');
const router = express.Router();

const siteController = require('../controllers/siteController');
const loadCommonData = require('../middleware/loadCommonData');

router.use(loadCommonData); // ✅ Middleware to be use.

router.get('/', siteController.index);
router.get('/category/:name', siteController.articleByCategories); // ✅ corrected name
router.get('/single/:id', siteController.singleArticle);
router.get('/search', siteController.search);
router.get('/author/:name', siteController.author);
router.post('/single/:id/comment', siteController.addComment);

router.get('/testing', siteController.testing);

//404 Error Handling Middleware
router.use((req, res, next) => {
    res.status(404).render('404',{    
        message: 'Page not found'
    })
});


//500 Error Handler
router.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500; 

    res.status(status).render('errors', {    
        message: err.message || 'something went wrong',
        // status:status
        status
    })
});


module.exports = router;