var express=require("express");
var router=express.Router();
var Campground=require("../models/campground.js");
var Comment=require("../models/comment");
var middleware=require("../middleware/index");
//Comments New
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    // find campground by id
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            console.log(err);
            req.flash("error","Campground Not Found");
            res.redirect("back");
        } else {
            //console.log(campground);
            res.render("comments/new", {campground: campground});
        }
    })
});

//Comments Create
router.post("/campgrounds/:id/comments",middleware.isLoggedIn,function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err || !campground){
           console.log(err);
           req.flash("error","Campground Not Found");
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               campground.comments.push(comment);
               campground.save();
               console.log(comment);
               req.flash("success","Successfully added a Comment");
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwership,function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            console.log(err);
            req.flash("error","Campground Not Found");
            res.redirect("/campgrounds");
        } else {
            Comment.findById(req.params.comment_id,function(err,foundComment){
                if(err || !foundComment){
                    req.flash("error","Comment Not Found")
                    res.redirect("back");
                }
                else{
                    res.render("comments/edit",{campground_id:req.params.id,comment:foundComment});
                }
            });
        }  
    });
});

router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwership,function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            console.log(err);
            req.flash("error","Campground Not Found");
            res.redirect("/campgrounds");
        } else {
            Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
                if(err || !updatedComment){
                    //console.log(err);
                    req.flash("error","Comment Not Found");
                    res.redirect("back");
                }
                else{
                    req.flash("success","Successfully Updated Comment");
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }    
    });
});

router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwership,function(req,res){
    Campground.findById(req.params.id, function(err, campground){
        if(err || !campground){
            console.log(err);
            req.flash("error","Campground Not Found");
            res.redirect("/campgrounds");
        } else {
            Comment.findByIdAndRemove(req.params.comment_id,function(err){
                if(err){
                    req.flash("error","Commment Not Found");
                    res.redirect("back");
                }
                else{
                    req.flash("success","Successfully Deleted a Comment");
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }
    });        
});

module.exports=router;