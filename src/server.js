import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import mongoose from "mongoose";

import { errorMiddlewares } from "./errorMiddlewares.js"

const server = express();
const port = process.env.PORT || 3003

// ****************** MIDDLEWARES ****************************

server.use(express.json());
server.use(cors())


// ****************** ROUTES *******************************



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
