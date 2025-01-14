const Listing = require('../models/listing');

module.exports.index =  async (req, res) => {
    const listings = await Listing.find({});
    if(!listings){
        req.flash("error"," listing not exist")
        res.render('listings/index', { listings });
    }

    res.render('listings/index', { listings });  // Render the correct view path
}


module.exports.renderNewForm = (req, res) => {
    res.render('listings/new');
}


module.exports.postListing =  async( req,res,)=>{
    let url = req.file.path
    let filename = req.file.filename
    console.log(url)
    console.log("..", filename)
    const newlisting = new Listing(req.body.listing)
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename}
    await newlisting.save()
    req.flash("message","new listing created!")
    res.redirect("/listing")
}

module.exports.showListing = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate({ path: "review", populate: { path: "author"} })
        .populate('owner');
        res.render('listings/show', { listing });
}

module.exports.renderEditform = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    if(!listing){
        req.flash("error"," listing not exist")
        res.redirect("/listing")
    }
    req.flash("message"," listing updated!")
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_200");
    res.render("listings/edit",{listing, originalImageUrl})
}

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing})  
    if(typeof req.file !== "undefined"){
        let url = req.file.path
        let filename = req.file.filename
        listing.image = {url,filename}
        await listing.save()
        
    }
     res.redirect(`/listing/${id}`)
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    // Find the listing
    let listing = await Listing.findById(id);
    if (listing) {
        await Listing.findByIdAndDelete(id);
        console.log(`Listing ${listing._id} deleted`);
    }  
    // Flash message for successful deletion
    req.flash("message", "Listing deleted!");
    res.redirect("/listing");
}