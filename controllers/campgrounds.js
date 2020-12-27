const Campground=require('../models/campground')
const mbxGeoCoding=require('@mapbox/mapbox-sdk/services/geocoding')
const mapbox_token=process.env.MAPBOX_TOKEN
const geocoder=mbxGeoCoding({accessToken:mapbox_token})
const {cloudinary}=require('../cloudinary')

module.exports.index=async (req,res)=>{
    const campgrounds= await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}

module.exports.renderNewForm=(req,res)=>{
    res.render("campgrounds/new");
}

module.exports.createCampground=async (req,res,next)=>{
    const geoData=await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
      }).send()

    const campground= new Campground(req.body.campground);
    campground.geometry=geoData.body.features[0].geometry;
    campground.images= req.files.map(f => ({ url : f.path , filename : f.filename }))
    campground.author=req.user._id;
    // res.send(campground);
    await campground.save();
    req.flash('success','Successfully added a new Campground');
    res.redirect('campgrounds/'+campground._id);
}

module.exports.showCampground=async (req,res)=>{
    // const {id}=req.params;
    const campground= await (await Campground.findById(req.params.id).populate({path:'reviews',populate:{path:'author'}}).populate('author'));
    console.log(campground);
    if(!campground){
        req.flash('error','Cannot find that camground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground});
}

module.exports.editCampgroundForm=async (req,res)=>{
    const {id}=req.params;
    const campground= await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error','Cannot find that camground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground});
}

module.exports.editCampground=async (req,res)=>{
    const {id}=req.params;
    const campground= await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs=req.files.map(f => ({ url : f.path , filename : f.filename }))
    campground.images.push(...imgs)
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    await campground.save();
    req.flash('success','Successfully edited campground');
    res.redirect("/campgrounds/"+id);
}

module.exports.deleteCampground=async (req,res)=>{
    const {id}=req.params;
    const campground= await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted a campground');
    res.redirect("/campgrounds");
}