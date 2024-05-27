import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "./models/index.js";
import Routes from "./routes/index.js";
import session from "express-session";
import passport from "passport";

const app = express();

app.disable('x-powered-by');

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'this is a cat',
    resave: false,
    saveUninitialized: false,
    })
  );
  
  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api", Routes);

  app.listen(6969, (err) => {
    if(err){
        console.error("Fail to start the server...", err)
    } else {
        console.info("Server started successfully...")
    }
  })