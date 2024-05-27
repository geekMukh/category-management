import { Strategy as LocalStrategy } from "passport-local";
import express from "express";
import passport from "passport";
import JWT from "jsonwebtoken";
import User from "../models/user.js"
import router from "./action.js";
import bcrypt from "bcrypt";
import {jwtDecode}  from "jwt-decode";


// Local Auth
passport.use(
    new LocalStrategy(async (username, password, done) => {
      let userData = await User.findOne({ email: username });
      if (userData) {
        let bcyptCompare = await bcrypt.compare(password, userData.password)
        if(!bcyptCompare){
          return done("Invald password", {});
        }
        let responsePayload = {
          status: true,
          message: "Success",
          token: JWT.sign(
            {
              userId: userData._id,
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 15,
            },
            "SOME_KEY"
          ),
        };
        return done(null, responsePayload);
      }
      return done("Invald email", {});
    })
  );
  
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  router.post("/login", passport.authenticate("local"), (req, res) => {
    return res.status(200).send({ status: true });
  });

  // Registration route
  router.post('/register', async (req, res) => {
    try {
      let { email, password, confirmPasswrod } = req.body;
      if(!email|| !password || !confirmPasswrod) {
        return res.status(400).send({
          status: false,
          message: "Please enter email, password or confirm password",
          payload: {}
      })
      }
      if(password !== confirmPasswrod) {
        return res.status(400).send({
          status: false,
          message: "Password and confirm password should match",
          payload: {}
      })
      }
      password = await bcrypt.hash(password, 10)
      console.log("passport", password)
      const newUser = new User({ email, password });
      await newUser.save()
      return res.status(200).send({
        status: true,
        message: "User registered successfully",
        payload: {}
    })
    } catch (error) {
      console.log(error)
      return res.status(500).send({
        status: false,
        message: "Internal Server Error!"
    })
    }
  
});

// Get Current User
router.get('/get-current-user', async (req, res) => {
  if (req.user) {
    let getUser;
    if (req.user.token) {
      let decodedToken = jwtDecode(req.user.token);
      getUser = await User.findOne({ _id: decodedToken.userId, is_active: true },{name:1,email:1,phone_number:1,gender:1});
      req.user = { ...req.user, ...getUser._doc };
      delete req.user["token"];
    }
    res.status(200).send({
      status: true,
      message: "Success",
      user: req.user,
    });
  } else {
    res.status(400).send({
      status: false,
      message: "Failed",
      user: {},
    });
  }
});

// user Logout
router.get('/user-logout', (req, res) => {
  console.log("Logging out user");
  req.logout((err) => {
    if(err) {
      return res.status(500).send({
        status: false,
        message: "We have some issue to breaking up with you!",
      });
    }
    return res.status(200).send({
      status: true,
      message: "Success",
    });
  });
  
})

export default router