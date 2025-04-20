const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  geometry: {  
    type: {
      type: String,
      enum: ["Point"],
      default: "Point", // ✅ Prevents validation error
      required: true
    },
    coordinates: {
      type: [Number], // ✅ Should be an array [longitude, latitude]
      default: [77.216721, 28.644800], // ✅ Default to Delhi, India
      required: true
    }
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// ✅ Automatically delete reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

// ✅ Enables geospatial queries
listingSchema.index({ geometry: "2dsphere" });

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
