const categoryModel = require('../models/category');
const newsModel = require('../models/news');
const settingModel = require('../models/Setting');
const nodeCache = require('node-cache');

const cache = new nodeCache();

const loadCommonData = async (req, res, next) => {
    try {
        console.log('🔄 loadCommonData called');
        
        let latestNews = cache.get('latestNewsCache');
        let categories = cache.get('categoriesCache');
        let setting = cache.get('settingCache');

        if (latestNews === undefined || categories === undefined || setting === undefined) {
            console.log('📦 Cache miss - fetching from database');
            
            // Get setting
            setting = await settingModel.findOne().lean() || {};
            console.log('⚙️ Setting loaded:', setting);

            // Get latest news with proper population
            latestNews = await newsModel.find()
                .populate('category', 'name slug')
                .populate('author', 'fullname')
                .sort({ createAt: -1 })
                .limit(5)
                .lean();
            console.log('📰 Latest News count:', latestNews ? latestNews.length : 0);

            // Get categories that have articles
            const categoriesInUse = await newsModel.distinct('category');
            console.log('📁 Categories in use:', categoriesInUse);
            
            categories = await categoryModel.find({ 
                _id: { $in: categoriesInUse } 
            }).lean();
            console.log('📁 Categories count:', categories ? categories.length : 0);

            // Cache the data
            if (setting) cache.set('settingCache', setting, 3600);
            if (latestNews) cache.set('latestNewsCache', latestNews, 3600);
            if (categories) cache.set('categoriesCache', categories, 3600);
        } else {
            console.log('💾 Cache hit - using cached data');
        }

        // Make data available to all views
        res.locals.setting = setting || {};
        res.locals.latestNews = latestNews || [];
        res.locals.categories = categories || [];
        
        console.log('✅ loadCommonData completed');
        next();
    } catch (err) {
        console.error('❌ loadCommonData Error:', err);
        console.error('Stack:', err.stack);
        // Set empty data so the app doesn't crash
        res.locals.setting = {};
        res.locals.latestNews = [];
        res.locals.categories = [];
        next(err);
    }
};

module.exports = loadCommonData;