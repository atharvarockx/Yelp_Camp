var mongoose=require("mongoose");
var Campground=require("./models/campground");
var Comment=require("./models/comment");

data=   [
            {
                name:"Jack's Hill" , 
                image:"https://images.unsplash.com/photo-1511993807578-701168605ad3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
                description: "blah blah blah jabcjcnsdo ddj wdjo jwdwjqwijwd dwqkdhqwd hdjq wbdhj"
            },
            {
                name:"Granite Hill" , 
                image:"https://images.unsplash.com/photo-1516013894828-b214a58fdba7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
                description: "blah blah blah jabcjcnsdo ddj wdjo jwdwjqwijwd dwqkdhqwd hdjq wbdhj"
            },
            {
                name:"NightAngel's Creek", 
                image:"https://images.unsplash.com/photo-1564577160324-112d603f750f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
                description: "blah blah blah jabcjcnsdo ddj wdjo jwdwjqwijwd dwqkdhqwd hdjq wbdhj"
            }
        ]
function seedDB(){
    Campground.remove({},function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            // console.log("Removed Campgrounds");
            // data.forEach(function(campground){
            //     Campground.create(campground,function(err,campground){
            //         if(err){
            //             console.log(err);
            //         }
            //         else{
            //             console.log("campground added");
            //         }

            //         Comment.create({text:"This place has a great view",author:"Atharva"},function(err,comment){
            //             if(err){
            //                 console.log(err);
            //             }
            //             else{
            //                 campground.comments.push(comment);
            //                 campground.save();
            //                 console.log("comment added to post");
            //             }

            //         });
            //     });
            // });
        };
    });
};   
module.exports = seedDB;