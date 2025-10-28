const categoryModel = require('../models/category');
const newsModel = require('../models/news');
const settingModel = require('../models/Setting');

const loadCommonData = async (req, res, next) => {
    try{
        const setting = await settingModel.findOne();

        const latestNews = await newsModel.find().populate('category',{'name':1, 'slug':1}).populate('author','fullname').sort({createAt: -1}).limit(5);
        
        const categoriesInuse = await newsModel.distinct('category');
        const categories = await categoryModel.find({_id: {$in: categoriesInuse}});

        res.locals.setting = setting;
        res.locals.latestNews = latestNews;
        res.locals.categories = categories;
        next();
    }catch(err){
        next(err) 
   }
}

module.exports = loadCommonData