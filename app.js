var express                       = require("express");
var app                           = express();
var bodyParser                    = require("body-parser");
var mongoose                      = require("mongoose");
var Campground                    = require("./models/campground.js");
var Comment                       = require("./models/comment");
var passport                      = require("passport");
var localStrategy                 = require("passport-local");
var passportLocalMongoose         = require("passport-local-mongoose");
var flash                         = require("connect-flash"); 
var User                          = require("./models/user");
var seedDB                        = require("./seed");
var campgroundRoutes              = require("./routes/campgrounds");
var commmentRoutes                = require("./routes/comments");
var indexRoutes                   = require("./routes/index");
var methodOverride                = require("method-override");
var moment                        = require("moment");

mongoose.connect("mongodb://localhost/yelp_camp", {useUnifiedTopology: true,useNewUrlParser: true,useFindAndModify: false}).then(() => console.log('DB Connected!')).catch(err => {
console.log("DB Connection Error: ");
});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(flash());
app.locals.moment=moment;
//seedDB();
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
})


app.use(methodOverride("_method"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use(commmentRoutes);


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(){
    console.log("App started"+port);
});