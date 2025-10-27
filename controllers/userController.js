const userModel = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const newsModel = require('../models/news');
const categoryModel = require('../models/category');
const settingModel = require('../models/Setting'); // ✅ import correctly
const { validationResult } = require('express-validator');
const createError = require('../utils/error-message');
const fs = require ('fs')

const loginPage = async (req, res) =>{ 
   res.render('admin/login', {
    layout: false,
    errors : 0
});
}

const adminLogin = async (req, res, next) =>{ 

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    // return res.status(400).json({errors: errors.array()});
   return res.render('admin/login', {
      layout: false,
      errors: errors.array()
    })  
}


  const {username, password} = req.body;    
  try {
    const user = await userModel.findOne({username});
    if (!user) {
        return next(createError('Invalid username or password', 401));
  }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(createError('Invalid username or password', 401));
    }
    const payload = {
      id: user._id,
      fullname: user.fullname,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true, maxAge: 60*60*1000});

   res.redirect('/admin/dashboard');
  } catch (error) {
    // console.error(error);
    // res.status(500).send('Internal Server Error');
    next(error);
  }
}

const logout = async (req, res) =>{ 
    res.clearCookie('jwt');
    res.redirect('/admin');
}

const dashboard = async (req, res, next) =>{ 
  try{
    let articleCount;
    if(req.role == 'author'){
        articleCount = await newsModel.countDocuments({ author : req.id});
    } else {
       articleCount =await newsModel.countDocuments();
    }

  const categoryCount = await categoryModel.countDocuments();
  const userCount = await userModel.countDocuments();

  res.render('admin/dashboard', {
    role: req.role,
    fullname: req.fullname,
    articleCount,
    categoryCount,
    userCount
  });
  }catch(error){
    // console.log(error);
    // res.status(500).send('Internal Server Error');
    next(error);
  }
}


const settings = async (req, res, next) =>{ 
  try {
    const settings = await settingModel.findOne(); 
    res.render('admin/settings', {role: req.role, settings});
  } catch (error) {
    // console.error(error);
    // res.status(500).send('Internal Server Error');
    next(error);
  }
}

const saveSettings = async (req, res, next) => {
  const { website_title, footer_description } = req.body;
  const website_logo = req.file ? req.file.filename : null;

  try {
    const setting = await settingModel.findOne();
    if(!setting){
      setting = new settingModel();
    }
    setting.website_title = website_title;
    setting.footer_description = footer_description;

    if(website_logo){
      if(setting.website_logo){
        const logoPath = `./public/uploads/${setting.website_logo}`;
        if(fs.existsSync(logoPath)){
          fs.unlinkSync(logoPath);
        }
      }
      setting.website_logo = website_logo;
    }

    await setting.save();
    res.redirect('/admin/settings');
  } catch (error) {
    // console.error(error);
    // res.status(500).send('Internal Server Error');
    next(error);
  }
};


const allUser = async (req, res) =>{ 
    const users = await userModel.find();
    res.render('admin/users',{ users, role: req.role});
}

const addUserPage = async (req, res) =>{
    res.render('admin/users/create', {role: req.role, errors: 0});
}

const addUser = async (req, res) =>{ 
  const errors = validationResult(req)
  if(!errors.isEmpty()){
   return res.render('admin/users/create', {
    role: req.role,
    errors: errors.array()
    })  
} 
    //  console.log('Form data:', req.body);
    await userModel.create(req.body);
   res.redirect('/admin/users');
}

const updateUserPage = async (req, res, next) =>{ 
    const id = req.params.id
    try {
        const user = await userModel.findById(id);
        if(!user){
            return next(createError('User not found', 404))
        }
        res.render('admin/users/update',{ user , role: req.role, errors: 0});
    } catch (error) {
      //   console.log(error)
      //  res.status(500).send('Internal Server Error');
        next(error);
    }

}

const updateUser = async (req, res, next) => {
  const id = req.params.id;
  const errors = validationResult(req)
  if(!errors.isEmpty()){
   return res.render('admin/users/update', {
    user: req.body,
    role: req.role,
    errors: errors.array()
    })  
} 
  const { fullname, password, role } = req.body;

  try {
    const user = await userModel.findById(id);
    if (!user) {
        return next(createError('Category not found', 404))
    };

    user.fullname = fullname || user.fullname;
    if (password) user.password = password;
    user.role = role || user.role;

    await user.save();

res.redirect('/admin/users');
  } catch (error) {
    // console.error(error);
    // res.status(500).send('Internal Server Error');
    next(error);
  }
};



const deleteUser = async (req, res, next) =>{ 
    const id = req.params.id
    try{
        const user = await userModel.findById(id)
        if(!user){
            return next(createError('User not found', 404))
        }
        const article = await newsModel.findOne({ author : id })
        if(article){
            return res.status(400).json({ success: false, message : 'User is associated with an article.'});;
        }

        await user.deleteOne();
        res.json({success:true})
    }catch(error){
        // console.log(error)
        // res.status(500).send('Internal Server Error')
        next(error);
      }
}

module.exports = {
    loginPage,
    adminLogin,
    logout,
    dashboard,
    settings,
    saveSettings,
    allUser,
    addUserPage,
    addUser,
    updateUserPage,
    updateUser,
    deleteUser
}