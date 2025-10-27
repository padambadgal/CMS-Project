const mongoose = require('mongoose');
const categoryModel = require('../models/category');
const newsModel = require('../models/news');
const userModel = require('../models/user');
const commentModel = require('../models/comment')
const settingModel = require('../models/Setting');

const index = async (req, res) =>{
  const news = await newsModel.find().populate('category',{'name':1, 'slug':1}).populate('author','fullname').sort({createAt: -1});


  // res.json({news, categories, latestNews, setting});  
  res.render('index', {news});
}
const articleByCategories = async (req, res) => {
  const category = await categoryModel.findOne({slug: req.params.name});

  if (!category) {
    return res.status(404).send('Category not found');
  } 

  const news = await newsModel.find({category: category._id}).populate('category',{'name':1, 'slug':1}).populate('author','fullname').sort({createAt: -1});

  // const categoryName = req.params.name;
  // res.render('category', { title: `Category: ${categoryName}` });
  res.render('category',{news, category});
};
const singleArticle = async (req, res) =>{
  
  const singleNews = await newsModel.findById(req.params.id).populate('category',{'name':1, 'slug':1}).populate('author','fullname').sort({createAt: -1});

    res.render('single', {singleNews});
}
const search = async (req, res) =>{
  const searchQuery = req.query.search

  const news = await newsModel.find({
    $or: [
      {title: {$regex: searchQuery, $options: 'i'}},
      {content: {$regex: searchQuery, $options: 'i'}}
    ]
  }).populate('category',{'name':1, 'slug':1}).populate('author','fullname').sort({createAt: -1});

    res.render('search', {news, searchQuery });
}

const author = async (req, res) =>{
  const author = await userModel.findOne({_id : req.params.name});

  if (!author) {
    return res.status(404).send('Author not found');
  }

  const news = await newsModel.find({author: req.params.name}).populate('category',{'name':1, 'slug':1}).populate('author','fullname').sort({createAt: -1});
 
    res.render('author',  {news, author});
}
const addComment = async (req, res) =>{
    
}

module.exports = {
  index,
  articleByCategories,
  singleArticle,
  search,
  author,
  addComment
}