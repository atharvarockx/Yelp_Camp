var middlewareObj = {}
var Campground= require("../models/campground.js");
var Comment   = require("../models/comment");

middlewareObj.checkCommentOwership=function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err || !foundComment){
                req.flash("error","Comment not found");
                res.redirect("back");
            }
            else{
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
                    return next();
                }
                else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error","You need to be Loggged In to do that!!!");
        res.redirect("back");
    }
}

middlewareObj. checkCampgroundOwership=function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function(err,foundCampground){
            if(err || !foundCampground){
                req.flash("error","Campground Not Found");
                res.redirect("back");
            }
            else{
                if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                    return next();
                }
                else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error","You need to be Loggged In to do that!!!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First !!!");
    res.redirect("/login");
}
module.exports= middlewareObj;