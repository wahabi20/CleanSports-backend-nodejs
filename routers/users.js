const auth = require("../middlewares/auth");
const multer = require('multer');
const express = require("express");
const router = express.Router();

const userController = require('../controllers/user.controller');





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




/* forgot password  */
router.put("/forgot-password", userController.forgotPassword)

/* reset Password */
router.put("/reset/:token", userController.resetPassword);

/* get all the users */
router.get('/', auth, userController.getUsers);

/* add user  */
router.post("/register", upload.single('logo'), userController.addUser);
 
/* delete user by id */
router.delete("/:id", auth, userController.deleteUser);

/* update user by id*/
router.put("/:id", auth, upload.single('logo'), userController.updateUser);

/* get user by id  */
router.get("/:id", userController.getUser);




module.exports = router;


