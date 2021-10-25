const auth = require("../middlewares/auth");
const express = require("express");
const router = express.Router();
const multer = require('multer');
const teamController = require('../controllers/team.controller');




const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/images');
    },
    filename: function(req, file, cb){
      if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg')
        cb(null, Date.now().toString(36) + ".jpg");

        if(file.mimetype === 'image/png')
        cb(null, Date.now().toString(36) + ".png");
    }
    
  });
  
  /* filter by the type of the format to image */
  const _fileFilter = (req , file, cb) => {
    // reject a file 
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, true);
    }else{
        cb(null, false)
    }
  };
  
  const upload = multer({
    storage: storage,
    limits:{ fileSize: 1024 * 1024 * 5 },
    fileFilter: _fileFilter
  });



/* add team */
router.post("/add", auth, upload.single('logo'), teamController.addTeam);






module.exports = router;