const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError=require('../utils/ExpressError')
const Campground=require('../models/campground')
const campgrounds=require('../controllers/campgrounds')
const {isLoggedIn,validateCampground,isAuthor}=require('../middleware')
var multer  = require('multer')
const {storage}=require('../cloudinary')
var upload = multer({ storage})

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground))

router.get('/new',isLoggedIn,campgrounds.renderNewForm)

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground, catchAsync(campgrounds.editCampground))
    .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(campgrounds.editCampgroundForm))

module.exports=router;