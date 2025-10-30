const { body } = require('express-validator')

const loginValidation = [
    body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .matches(/^\S+$/)
    .withMessage('Fullname must not contain spaces.')
    .isLength({ min: 5, max: 15})
    .withMessage('Username must be 5 to 10  characters long.'),

     body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 4, max: 12})
    .withMessage('Password must be 4 to 12 characters long.')
]

const  userValidation = [
    body('fullname')
    .trim()
    .notEmpty()
    .withMessage('Fullname is required')
    .matches(/^(?!\s*$)[A-Za-z]+(?:\s[A-Za-z]+)*$/)
    .withMessage('Full name must only contain letters and spaces, not special characters or numbers.')
    .isLength({ min: 5, max: 20})
    .withMessage('Fullname must be 5 to 20 characters long.'),

    body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .matches(/^\S+$/)
    .withMessage('Username must not contain spaces.')
    .isLength({ min: 5, max: 15})
    .withMessage('Username must be 5 to 15 characters long.'),

    body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 4, max: 12})
    .withMessage('Password must be 4 to 12 characters long.'),

    body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['author', 'admin'])
    .withMessage('Role must be author or admin.')
]

const  userUpdateValidation = [
    body('fullname')
    .trim()
    .notEmpty()
    .withMessage('Fullname is required')
    .withMessage('Fullname is required')
    .matches(/^(?!\s*$)[A-Za-z]+(?:\s[A-Za-z]+)*$/)

    .isLength({ min: 5, max: 20})
    .withMessage('Fullname must be 5 to 20 characters long.'),

    body('password')
    .optional({checkFalsy: true})
    .isLength({ min: 4, max: 12})
    .withMessage('Password must be 4 to 12 characters long.'),

    body('role')
    .trim()
    .notEmpty()
    .withMessage('Role is required')
    .isIn(['author', 'admin'])
    .withMessage('Role must be author or admin.')
]

const  categoryValidation = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3, max: 12})
    .withMessage('Category name must be 3 to 12 characters long.'),

    body('description')
    .isLength({ max: 100 })
    .withMessage('Description must be at more 100 characters long.')
]

const  articleValidation = [
    body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 7, max: 50 })
    .withMessage('Title must be 7 to 50 characters long.'),

    body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 50})
    .withMessage('Content must be 50 to 1500 characters long.'),

    body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),

]
module.exports = { 
    loginValidation,
    userValidation,
    userUpdateValidation,
    categoryValidation,
    articleValidation
 }