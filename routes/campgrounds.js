var express=require("express");
var router=express.Router();
var Campground=require("../models/campground.js");
var methodOverride = require("method-override");
var middleware=require("../middleware/index");
router.use(methodOverride("_method"));

//ALL CAMPGROUNDS
router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if (err){
            console.log(err);
        } else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser:req.user});
        }

    });
    
});

//CREATE CAMPGROUND
router.post("/",middleware.isLoggedIn,function(req,res){
    name=req.body.name;
    price=req.body.price;
    image=req.body.image;
    desc=req.body.description;
    author={
        id: req.user._id,
        username: req.user.username
    }
    newCampground={name:name,price:price,image:image,description:desc,author:author};
    console.log(newCampground);
    Campground.create(newCampground,function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            //console.log(campground);
            req.flash("success","Successfully Created a Campground");
            res.redirect("/campgrounds");
        }

    });
    
});

//FORM FOR NEW CAMPGROUND
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

//SHOW PAGE
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err || !foundCampground){
            req.flash("error","Campground Not Found");
            res.redirect("back");
            console.log(err);
        }else{
            console.log(foundCampground);
            res.render("campgrounds/show",{campground:foundCampground,currentUser:req.user});
        }
    })
});

router.get("/:id/edit",middleware.checkCampgroundOwership,function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err || !foundCampground){
            req.flash("error","Campground Not Found");
            res.redirect("back");
        }
        else{
            res.render("campgrounds/edit",{campground:foundCampground});
        }
        

    });
    
});

router.put("/:id",middleware.checkCampgroundOwership,function(req,res){
    // console.log(req.body.campground);
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,newCampground){
        if(err || !newCampground){
            console.log(err);
            req.flash("error","Campground Not Found");
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success","Successfully Updated a Campground");
            res.redirect("/campgrounds/"+ req.params.id);
        }
    })
    // res.send("you hit post");
});

router.delete("/:id",middleware.checkCampgroundOwership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            req.flash("error","Campground Not Found");
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success","Successfully Deleted a Campground");
            res.redirect("/campgrounds");
        }
    })
});



module.exports=router;

