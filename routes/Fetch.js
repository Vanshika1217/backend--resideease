const express=require('express')
const router=express.Router()
const Accommodation = require("../Models/Accomodations");
router.get('/Hotels',async(req,res)=>{
   try {
       const hotels = await Accommodation.find({ type: "Hotel" });
   
       if (!hotels.length) {
         return res.status(404).json({ message: "No hotels found" });
       }
   
       res.json(hotels);
     } catch (error) {
       res.status(500).json({ message: "Error fetching hotels", error: error.message });
     }
})
router.get('/Flats',async(req,res)=>{
    try {
        const flats = await Accommodation.find({ type: "Flat" });
    
        if (!flats.length) {
          return res.send([])
        }
    
        res.json(flats);
      } catch (error) {
        res.status(500).json({ message: "Error fetching flats", error: error.message });
      }
})
router.get('/PGs',async(req,res)=>{
    try {
        const pgs = await Accommodation.find({ type: "PG" });
    
        if (!pgs.length) {
          return res.status(404).json({ message: "No PGs found" });
        }
    
        res.json(pgs);
      } catch (error) {
        res.status(500).json({ message: "Error fetching PGs", error: error.message });
      }
})
module.exports=router