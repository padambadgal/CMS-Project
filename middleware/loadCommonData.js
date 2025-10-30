const categoryModel = require('../models/category');
const newsModel = require('../models/news');
const settingModel = require('../models/Setting');
const nodeCache = require('node-cache');

const cache = new nodeCache();

const loadCommonData = async (req, res, next) => {
    try{

        var latestNews = cache.get('latestNewsCache');
        var categories= cache.get('categoriesCache');
        var setting = cache.get('settingCache');

        if(!latestNews && !categories && !setting){

            setting = await settingModel.findOne().lean();
    
            latestNews = await newsModel.find().populate('category',{'name':1, 'slug':1}).populate('author','fullname').sort({createAt: -1}).limit(5).lean();
           
           const categoriesInUse = await newsModel.distinct('category');
            categories = await categoryModel.find({_id: {$in: categoriesInUse}}).lean();

            cache.set('latestNewsCache', latestNews, 3600);
            cache.set('categoriesCache', categories, 3600);
            cache.set('settingCache', setting, 3600);
        }

        res.locals.setting = setting;
        res.locals.latestNews = latestNews;
        res.locals.categories = categories;
        next();
    }catch(err){
        next(err) 
   }
}

module.exports = loadCommonData