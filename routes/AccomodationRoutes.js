const express = require("express");
const Accommodation = require("../Models/Accomodations"); // Ensure correct path!

const router = express.Router();

// Fetch only Hotels
router.get("/hotels", async (req, res) => {
  try {
    const hotels = await Accommodation.find({ type: "Hotel" });

    if (!hotels.length) {
      return res.status(404).json({ message: "No hotels found" });
    }

    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels", error: error.message });
  }
});
// Route example to handle dynamic route using _id:
router.get("/hotel/:hotelId", async (req, res) => {
  try {
    const hotel = await Accommodation.findById(req.params.hotelId)
      .populate("owner", "_id name email"); // 👈 populates owner details

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    res.json({
      _id: hotel._id,
      name: hotel.name,
      type: hotel.type,
      location: hotel.location,
      price: hotel.price,
      images: hotel.images,
      description: hotel.description,
      amenities: hotel.amenities,
      ownerId: hotel.owner?._id,          // ✅ Required for chat feature
      ownerName: hotel.owner?.name,       // Optional (can show in chat)
      ownerEmail: hotel.owner?.email      // Optional
    });
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


router.get("/pgs", async (req, res) => {
  try {
    const pgs = await Accommodation.find({ type: "PG" });

    if (!pgs.length) {
      return res.status(404).json({ message: "No PGs found" });
    }

    res.json(pgs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching PGs", error: error.message });
  }
});
router.get("/pgs/:pgId", async (req, res) => {
  try {
    const pg = await Accommodation.findById(req.params.pgId);
    if (!pg) return res.status(404).json({ message: "PG not found" });
    res.json(pg);
  } catch (error) {
    console.error("Error fetching PG details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Fetch all accommodations
router.get("/all", async (req, res) => {
  try {
    const accommodations = await Accommodation.find();
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching accommodations", error: error.message });
  }
});

module.exports = router;
