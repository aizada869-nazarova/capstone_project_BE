import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";
import passport from "passport"
import googleStrategy from "./auth/oauth.js";
import usersRouter from "./services/users/index.js";
import visitedCountryRouter from "./services/visitedCountries/index.js"

import { errorMiddlewares } from "./errorMiddlewares.js"
import travelsRouter from "./services/travels/index.js";
import pakingListsRouter from "./services/pakingLists/index.js";

const server = express();
const port = process.env.PORT || 3001

// ****************** MIDDLEWARES ****************************
passport.use("google", googleStrategy)
server.use(express.json());
server.use(cors())
server.use(passport.initialize())


// ****************** ROUTES *******************************

server.use("/users", usersRouter)
server.use("/travels", travelsRouter)
server.use('/pakinglists', pakingListsRouter)
server.use("/visitedCountry", visitedCountryRouter)
// ****************** ERROR HANDLERS ***********************

server.use([errorMiddlewares])

mongoose.connect(process.env.MONGO_CONNECTION)
mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo!")

  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server running on port ${port}`)
  })
})

mongoose.connection.on("error", err => {
  console.log(err)
})
