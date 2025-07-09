import Accommodation from "../models/Accomodation.js";

// Fetch all accommodations
export const getAccommodations = async (req, res) => {
  try {
    const { query } = req.query;
    let filter = {};
    if (query) {
      filter = { 
        $or: [
          { name: new RegExp(query, "i") },
          { "location.city": new RegExp(query, "i") }
        ]
      };
    }
    const accommodations = await Accommodation.find(filter);
    res.json(accommodations);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Fetch accommodation by ID
export const getAccommodationById = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);
    if (accommodation) {
      res.json(accommodation);
    } else {
      res.status(404).json({ message: "Accommodation not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
