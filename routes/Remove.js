const express=require('express')
const router=express.Router()
const Accommodation = require("../Models/Accomodations");

router.delete('/items',async(req,res)=>{
  console.log("hiiii")
   try {
       const id=req.body.id;
       const document= await Accommodation.findById(id)
       if(!document)
       {
        res.status(404).json({message:"No such hotel"})
       }
       const result=await Accommodation.deleteOne({_id:id})
       res.json({message:"Successfully deleted",result:result})
     } catch (error) {
       res.status(500).json({ message: "Internal server error", error: error.message });
     }
})

module.exports=router