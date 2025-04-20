const Listing = require("../models/listing");
const fetch = require("node-fetch"); // Ensure 'node-fetch' is installed
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapToken = process.env.MAP_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapToken });



module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
    
}


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}




module.exports.createListing = async (req, res, next) => {
    try {
        const { location, country } = req.body.listing;
        const query = `${location}, ${country}`;
        const radarUrl = `https://api.radar.io/v1/geocode/forward?query=${encodeURIComponent(query)}`;

        let response = await fetch(radarUrl, {
            method: "GET",
            headers: {
                "Authorization": "prj_test_pk_a2b6a33fc0a53c3a067ce311b0a6ad2ad50ef2cf" // Replace with your actual API key
            }
        });

        let data = await response.json();
        // console.log("🛰️ Radar API Response:", JSON.stringify(data, null, 2));

        let geometry;
        if (data.addresses && data.addresses.length > 0) {
            const { latitude, longitude } = data.addresses[0];

            // Validate coordinates
            if (typeof latitude === "number" && typeof longitude === "number") {
                geometry = { type: "Point", coordinates: [longitude, latitude] };
            } else {
                // console.warn("⚠️ Invalid coordinates received from Radar API, using default.");
                geometry = { type: "Point", coordinates: [77.216721, 28.6448] }; // Default to Delhi
            }
        } else {
            // console.warn("⚠️ Warning: Radar API did not return valid coordinates. Using default.");
            geometry = { type: "Point", coordinates: [77.216721, 28.6448] }; // Default to Delhi
        }

        let url = req.file?.path || "";
        let filename = req.file?.filename || "";

        const newListing = new Listing({
            ...req.body.listing,
            geometry,
            image: { url, filename },
            owner: req.user._id
        });

        // console.log("📌 New Listing Before Saving:", JSON.stringify(newListing, null, 2));
        await newListing.save();
        // console.log("✅ Listing saved successfully with geometry:", geometry.coordinates);

        req.flash("success", "Successfully created a new listing");
        res.redirect("/listings");
    } catch (error) {
        console.error("❌ Error creating listing:", error);
        req.flash("error", "Something went wrong. Please try again.");
        res.redirect("/listings/new");
    }
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl =originalImageUrl.replace('/upload/', '/upload/w_200,h_100,c_fill,q_10,f_auto/')
    res.render("listings/edit.ejs", { listing  ,  originalImageUrl});
}


module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Successfully Deleted listing");
    res.redirect("/listings");
}

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;

    // Find and update listing with form data
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    // Check if a new image was uploaded
    if (req.file) {
        // Ensure `listing.image` exists before assigning properties
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save(); // Save changes to DB

    req.flash("success", "Successfully updated listing");
    res.redirect(`/listings/${listing._id}`);
};

