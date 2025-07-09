const express=require('express')
const router=express.Router()
const Booking = require("../Models/Bookings");
const User=require("../Models/User");
const fetchUser = require('../Middlewares/fetchUser');
const cors = require('cors');

router.post('/add', async (req, res) => {
    
    try {
      const obj = req.body;
      console.log(obj);
      const user = await User.findOne({ email: obj.contactInfo.email });
      console.log(user);
      console.log("Received booking data:", obj);

      if (!user) {
        return res.status(404).json({ message: "User not found with this email" });
      }
      obj.userId = user._id;
  
      const booking = await Booking.create(obj);
      res.json(booking);
  
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  });
  
router.delete('/cancel',fetchUser,async(req,res)=>{
    try{
        let id=req.body.id;
        // console.log(id);
        const response =await Booking.deleteOne({_id:id})
        res.json({message:"Booking successfully cancelled"})
    }
    catch(error)
    {
        res.status(500).json({ message: "Could not cancel the booking", error: error.message });
    }
    
})
router.get('/fetch',async(req,res)=>{
    try{
    const bookings=await Booking.find()
    res.json(bookings)
}
    catch(error)
    {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
})
router.get('/fetchById',fetchUser,async(req,res)=>{
    try{
    const bookings=await Booking.find({userId:req.userId})
    res.json(bookings)
}
    catch(error)
    {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});
router.get("/user/:userId", async (req, res) => {
    try {
      const { userId} = req.params;
      
      console.log("Finding bookings for userId:", userId);
      
      const bookings = await Booking.find({userId:userId});
      console.log("Bookings found:", bookings);
  
      res.json(bookings);
    } catch (err) {
      console.error("Error fetching bookings:", err); 
      res.status(500).json({ error: "Server error" });
    }
  });
  
  
module.exports=router