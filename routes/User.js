const express=require('express')
const router=express.Router()
const User=require("../Models/User")
const bcrypt=require('bcryptjs')
router.post('/add',async(req,res)=>{
    try{
     let user=await User.findOne({email:req.body.email})
        if(user)
        {
            return res.status(400).json({error:"Sorry a user with this email already exists"})
        }
         const salt=await bcrypt.genSalt(10)
        secPass=await bcrypt.hash(req.body.password,salt)
    const obj={
        username:req.body.username,
        email:req.body.email,
        password:secPass
    }
    user=await User.create(obj)
    res.json(user)
    console.log("User saved")
}
catch(error)
{
    res.status(500).json({ message: "Internal server error", error: error.message });
}
})
router.delete('/remove',async(req,res)=>{
    try{
    let user=await User.findOne({email:req.body.email})
       if(!user)
       {
           return res.status(400).json({error:"Sorry a user with this email does not exist"})
       }
       let id=user._id;
       const response =await User.deleteOne({_id:id})
       res.json({message:"Successfully deleted",result:response})
    }
    catch(error)
    {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
    
        
})
router.get('/fetch',async(req,res)=>{
    try{
    const users=await User.find()
    res.json(users)
}
    catch(error)
    {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
})
module.exports=router