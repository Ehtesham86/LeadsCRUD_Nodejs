const express = require("express");
const router = express.Router();
const PrimeassetForm = require("../models/leadsCRUD");
const LeadsCRUD = require("../models/leadsCRUD");

const mongoose = require("mongoose");
  

router.get("/", (req, res, next) => {
  LeadsCRUD.find()
    .then((result) => {
      res.status(200).json({
        leadsCRUDData: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

// POST /leads → Add a new lead
router.post("/", async (req, res) => {
  try {
    const { name, email, status } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: "Email and Name are required" });
    }

    // Check if email already exists
    const existingLead = await LeadsCRUD.findOne({ email });
    if (existingLead) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const lead = new LeadsCRUD({ name, email, status });
    await lead.save();
    
    res.status(200).json({ message: "Lead created successfully", lead });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/:id", (req, res, next) => {
  console.log(req.params.id);
  LeadsCRUD.findById(req.params.id).then(result=>{
res.status(200).json({
  leadsCRUD:result
})
  }).catch(err=>{
    console.log(err);
    res.status(500).json({
        error:err
    })
  })
});
router.delete('/:id',(req,res,next)=>{
  LeadsCRUD.remove({_id:req.params.id})
.then(result=>{
    res.status(200).json({
        message:"Beds deleted",
        result:result
    })
}).catch(err=>{
    res.status(500).json({
        error:err
    })
})
})
 
module.exports = router;
