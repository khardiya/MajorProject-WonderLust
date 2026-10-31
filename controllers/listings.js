const Listing = require("../models/listing");
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

        // Default coordinates: Delhi
        let geometry = {
            type: "Point",
            coordinates: [77.216721, 28.6448]
        };

        // Try Radar geocoding, but don't block listing creation
        // Radar Geocoding
        const query = `${location}, ${country}`;
        const params = new URLSearchParams({ query });

        try {
            const response = await fetch(
                `https://api.radar.io/v1/geocode/forward?${params}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: process.env.MAP_TOKEN,
                        Accept: "application/json"
                    },
                    signal: AbortSignal.timeout(10000)
                }
            );

            if (!response.ok) {
                throw new Error(`Radar API error: ${response.status}`);
            }

            const data = await response.json();

            if (data.addresses?.length > 0) {
                const { latitude, longitude } = data.addresses[0];

                if (
                    Number.isFinite(latitude) &&
                    Number.isFinite(longitude)
                ) {
                    geometry = {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    };
                }
            }

        } catch (radarError) {
            console.error("Radar geocoding failed:", radarError.message);
            console.log("Using default coordinates.");
        }

        // Cloudinary image information
        const url = req.file?.path || "";
        const filename = req.file?.filename || "";

        // Create listing
        const newListing = new Listing({
            ...req.body.listing,
            geometry,
            image: { url, filename },
            owner: req.user._id
        });

        await newListing.save();

        console.log("LISTING SAVED SUCCESSFULLY:", newListing._id);

        req.flash("success", "Successfully created a new listing");

        return res.redirect("/listings");

    } catch (error) {
        console.error("LISTING CREATION FAILED:", error);
        return next(error);
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
    originalImageUrl = originalImageUrl.replace('/upload/', '/upload/w_200,h_100,c_fill,q_10,f_auto/')
    res.render("listings/edit.ejs", { listing, originalImageUrl });
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

    console.log("4. ABOUT TO SAVE LISTING:", newListing);

    await newListing.save();

    console.log("5. LISTING SAVED SUCCESSFULLY");
    req.flash("success", "Successfully updated listing");
    res.redirect(`/listings/${listing._id}`);
};

