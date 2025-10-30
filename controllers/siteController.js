const mongoose = require('mongoose');
const categoryModel = require('../models/category');
const newsModel = require('../models/news');
const userModel = require('../models/user');
const commentModel = require('../models/comment')
const settingModel = require('../models/Setting');
const paginate = require('../utils/paginate');
const { query } = require('express-validator');
const createError = require('../utils/error-message');

const index = async (req, res) =>{

const paginatedNews = await paginate(newsModel, {}, 
                                                req.query, {
                                                  populate:[
                                                    {path: 'category', select: 'name slug'},
                                                    {path: 'author', select: 'fullname'}
                                                  ],
                                                sort: '-createAt'});
  // res.json({paginatedNews});  
  res.render('index', {paginatedNews, query: req.query});
}
const articleByCategories = async (req, res, next) => {
  const category = await categoryModel.findOne({slug: req.params.name});

  if (!category)  return next(createError('Category not found', 404));

  const paginatedNews = await paginate(newsModel, {category}, 
                                                req.query, {
                                                  populate:[
                                                    {path: 'category', select: 'name slug'},
                                                    {path: 'author', select: 'fullname'}
                                                  ],
                                                sort: '-createAt'});

  res.render('category',{paginatedNews, category, query: req.query});
};
const singleArticle = async (req, res, next) =>{

  const singleNews = await newsModel.findById(req.params.id).populate('category',{'name':1, 'slug':1}).populate('author','fullname').sort({createAt: -1});

  if(!singleNews) return next(createError('Article not found', 404));

  //Get all Comment for this article
  const comments = await commentModel.find({  article: req.params.id, status:'approved' })
                                    .sort('-createdAt')

  // res.json({singleNews, comments})
  res.render('single', {singleNews, comments});
}
const search = async (req, res) =>{
  const searchQuery = req.query.search

  // const news = await newsModel.find({
  //   $or: [
  //     {title: {$regex: searchQuery, $options: 'i'}},
  //     {content: {$regex: searchQuery, $options: 'i'}}
  //   ]
  // }).populate('category',{'name':1, 'slug':1}).populate('author','fullname').sort({createAt: -1});

  const paginatedNews = await paginate(newsModel, {$or: [
                                            {title: {$regex: searchQuery, $options: 'i'}},
                                            {content: {$regex: searchQuery, $options: 'i'}}
                                            ] 
                                              }, 
                                                req.query, {
                                                  populate:[
                                                    {path: 'category', select: 'name slug'},
                                                    {path: 'author', select: 'fullname'}
                                                  ],
                                                sort: '-createAt'});
    res.render('search', {paginatedNews, searchQuery, query: req.query });
}

const author = async (req, res, next) =>{
  const author = await userModel.findOne({_id : req.params.name});

  if (!author) return next(createError('Author not found', 404));


  const paginatedNews = await paginate(newsModel, {author: req.params.name}, 
                                                req.query, {
                                                  populate:[
                                                    {path: 'category', select: 'name slug'},
                                                    {path: 'author', select: 'fullname'}
                                                  ],
                                                sort: '-createAt'});
 
    res.render('author',  {paginatedNews, author, query: req.query});
}

const addComment = async (req, res,next) =>{
  try {
    const {  name, email, content } = req.body;
    const comment = new commentModel({
      name,
      email,
      content,
      article: req.params.id
    });
    await comment.save();
    res.redirect(`/single/${req.params.id}`);
  } catch (error) {
     return next(createError('Error Adding Comment', 500));
  }
}

const testing = async (req, res) =>{
  // res.send('This is long String'.repeat(50))
  const news = await newsModel().find()
  res.json(news)
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