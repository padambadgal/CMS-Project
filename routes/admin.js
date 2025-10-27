const express = require('express');
const router = express.Router();

const articleController = require('../controllers/articleController');
const categoryController = require('../controllers/categoryController');
const commentController = require('../controllers/commentController');
const userController = require('../controllers/userController');    
const isLoggedIn = require('../middleware/isLoggedIn');
const isAdmin = require('../middleware/isAdmin');
const imageUpload = require('../middleware/multer');
const isValid = require('../middleware/validation') ;

//Login Routes
router.get('/', userController.loginPage);
router.post('/index', isValid.loginValidation, userController.adminLogin);
router.get('/logout', userController.logout);
router.get('/dashboard', isLoggedIn, userController.dashboard);
router.get('/settings', isLoggedIn, isAdmin,  userController.settings);
router.post('/save-settings', isLoggedIn, isAdmin,  imageUpload.single('website_logo'), userController.saveSettings);


//User CRUD Routes
router.get('/users', isLoggedIn, isAdmin, userController.allUser);
router.get('/add-user', isLoggedIn, isAdmin, userController.addUserPage);
router.post('/add-user', isLoggedIn, isAdmin, isValid.userValidation, userController.addUser);
router.get('/update-user/:id', isLoggedIn, isAdmin, userController.updateUserPage);
router.post('/update-user/:id', isLoggedIn, isAdmin, isValid.userUpdateValidation, userController.updateUser);
router.delete('/delete-user/:id', isLoggedIn, isAdmin, userController.deleteUser);


//Category CRUD Routes
router.get('/category', isLoggedIn, isAdmin, categoryController.allCategory);
router.get('/add-category', isLoggedIn, isAdmin, categoryController.addCategoryPage);
router.post('/add-category', isLoggedIn, isAdmin,isValid.categoryValidation, categoryController.addCategory);
router.get('/update-category/:id', isLoggedIn, isAdmin, categoryController.updateCategoryPage);
router.post('/update-category/:id', isLoggedIn, isAdmin,isValid.categoryValidation, categoryController.updateCategory);
router.delete('/delete-category/:id', isLoggedIn, isAdmin, categoryController.deleteCategory);

//Article CRUD Routes
router.get('/article', isLoggedIn, articleController.allArticle);
router.get('/add-article', isLoggedIn, articleController.addUserArticle);
router.post('/add-article', isLoggedIn, imageUpload.single('image'),isValid.articleValidation, articleController.addArticle);
router.get('/update-article/:id', isLoggedIn, articleController.updateArticlePage);
router.post('/update-article/:id', isLoggedIn, imageUpload.single('image'),isValid.articleValidation, articleController.updateArticle);
router.delete('/delete-article/:id',  isLoggedIn, articleController.deleteArticle);

//Comment Routes
router.get('/comments', isLoggedIn, commentController.allComments);

//404  Middleware
router.use(isLoggedIn, (req, res, next) => {
    res.status(404).render('admin/404',{    
        message: 'Page not found',
        role: req.role
    })
});

//500 Error Handler
router.use(isLoggedIn, (err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500; 
    let view;
    switch (status) {
        case 401:
            view = 'admin/401';
            break;
        case 404:
            view = 'admin/404';
            break;
        case 500:
            view = 'admin/500';
            break;
        default:
            view = 'admin/500';
    }
    res.status(status).render(view, {    
        message: err.message || 'something went wrong' ,
        role: req.role
    })
});
// router.use(isLoggedIn, (err, req, res, next) => {
//     console.error(err.stack)
//     res.status(500).render('admin/500',{    
//         message: err.message || 'Internal server error' ,
//         role: req.role
//     })
// });

module.exports = router;