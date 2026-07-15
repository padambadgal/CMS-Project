const mongoose = require('mongoose');
const categoryModel = require('../models/category');
const newsModel = require('../models/news');
const userModel = require('../models/user');
const commentModel = require('../models/comment');
const settingModel = require('../models/Setting');
const paginate = require('../utils/paginate');
const createError = require('../utils/error-message');

const index = async (req, res, next) => {
    try {
        console.log('🔍 Index route called');
        
        const paginatedNews = await paginate(newsModel, {},
            req.query, {
            populate: [
                { path: 'category', select: 'name slug' },
                { path: 'author', select: 'fullname' }
            ],
            sort: '-createAt'
        });
        
        console.log('📊 Paginated News:', JSON.stringify(paginatedNews, null, 2));
        console.log('📰 Total Articles:', paginatedNews.totalDocs);
        console.log('📄 Data Length:', paginatedNews.data ? paginatedNews.data.length : 0);
        
        res.render('index', { paginatedNews, query: req.query });
    } catch (error) {
        console.error('❌ Index Error:', error);
        next(error);
    }
}

const articleByCategories = async (req, res, next) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.name });
        if (!category) return next(createError('Category not found', 404));

        const paginatedNews = await paginate(newsModel, { category },
            req.query, {
            populate: [
                { path: 'category', select: 'name slug' },
                { path: 'author', select: 'fullname' }
            ],
            sort: '-createAt'
        });

        res.render('category', { paginatedNews, category, query: req.query });
    } catch (error) {
        next(error);
    }
}

const singleArticle = async (req, res, next) => {
    try {
        const singleNews = await newsModel.findById(req.params.id)
            .populate('category', { 'name': 1, 'slug': 1 })
            .populate('author', 'fullname')
            .sort({ createAt: -1 });

        if (!singleNews) return next(createError('Article not found', 404));

        const comments = await commentModel.find({ 
            article: req.params.id, 
            status: 'approved' 
        }).sort('-createdAt');

        res.render('single', { singleNews, comments });
    } catch (error) {
        next(error);
    }
}

const search = async (req, res, next) => {
    try {
        const searchQuery = req.query.search;
        
        if (!searchQuery || searchQuery.trim() === '') {
            return res.redirect('/');
        }

        const paginatedNews = await paginate(newsModel, {
            $or: [
                { title: { $regex: searchQuery, $options: 'i' } },
                { content: { $regex: searchQuery, $options: 'i' } }
            ]
        },
        req.query, {
            populate: [
                { path: 'category', select: 'name slug' },
                { path: 'author', select: 'fullname' }
            ],
            sort: '-createAt'
        });

        res.render('search', { paginatedNews, searchQuery, query: req.query });
    } catch (error) {
        next(error);
    }
}

const author = async (req, res, next) => {
    try {
        const author = await userModel.findOne({ _id: req.params.name });
        if (!author) return next(createError('Author not found', 404));

        const paginatedNews = await paginate(newsModel, { author: req.params.name },
            req.query, {
            populate: [
                { path: 'category', select: 'name slug' },
                { path: 'author', select: 'fullname' }
            ],
            sort: '-createAt'
        });

        res.render('author', { paginatedNews, author, query: req.query });
    } catch (error) {
        next(error);
    }
}

const addComment = async (req, res, next) => {
    try {
        const { name, email, content } = req.body;
        
        // Validate input
        if (!name || !email || !content) {
            req.flash('error_msg', 'All fields are required');
            return res.redirect(`/single/${req.params.id}`);
        }

        const comment = new commentModel({
            name: name.trim(),
            email: email.trim(),
            content: content.trim(),
            article: req.params.id
        });
        
        await comment.save();
        req.flash('success_msg', 'Comment added successfully');
        res.redirect(`/single/${req.params.id}`);
    } catch (error) {
        next(createError('Error Adding Comment', 500));
    }
}

const testing = async (req, res) => {
    const news = await newsModel.find().limit(10);
    res.json(news);
}

module.exports = {
    index,
    articleByCategories,
    singleArticle,
    search,
    author,
    addComment,
    testing
}