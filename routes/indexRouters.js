const { Router } = require("express");
const {body}=require("express-validator")
const indexRouter = Router();
const controller = require("../controllers/usercontroller")
const passport = require("../config/passport")



indexRouter.get("/",controller.gethome);
indexRouter.post("/sign-up",[
    body("first_name").trim().notEmpty().escape(),
    body("last_name").trim().notEmpty().escape(),
    body("username").trim().notEmpty().escape(),
    body("password").isLength({ min: 5 }).withMessage("Password must be at least 5 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
  ], controller.createUsersPost);
indexRouter.get("/sign-up",controller.createUsersGet);
indexRouter.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/failed",
    failureMessage: true,
  })
);
indexRouter.get("/log-out",controller.logout );
indexRouter.get("/log-in",controller.loginGet);
indexRouter.post("/new",controller.CreateMessagePost)
indexRouter.post("/delete/:id",controller.DeleteMessagePost)

module.exports=indexRouter;