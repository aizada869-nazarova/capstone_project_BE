import express from "express"
import createHttpError from "http-errors"
import NewTripModel from "./schema.js"
import JWTAuthMiddleware from "../../auth/middlewares.js"

const travelsRouter = express.Router()

 

 travelsRouter.get("/:travelId", JWTAuthMiddleware, async (req, res, next) => {
  try { const trip = await NewTripModel.findById(req.params.travelId).populate({ path: "userId" })
    if (trip) {
      res.send(trip)
    } else {
      next(createHttpError(404, `trip with id ${req.params.travelId} not found!`))
    }
     

  } catch (error) {
    next(error)
  }
})

travelsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try { 
    
    const userIdR = req.user._id
    console.log("userIdR", userIdR)
      const newTrip = await NewTripModel.find({userId: userIdR}).populate({ path: "userId"})
   console.log("hello world", newTrip)
      res.send(newTrip)

  } catch (error) {
    console.log(error)
    next(error)
  }
})

 travelsRouter.post("/",  JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newTrip = new NewTripModel(req.body)
    console.log(req.body)
    
    const {_id} = await newTrip.save()
    console.log({_id})

    res.status(201).send({ _id })
    
  } catch (error) {
    console.log(error)
    next(error)
  }
})

 travelsRouter.put("/:travelId", async (req, res, next) => {
  try { 
      const id=req.params.travelId
    if (id.length !== 24)
    return next(createHttpError(400, "Invalid ID"));
  const updatedTrip = await NewTripModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if(updatedTrip){
      res.send(updatedTrip)
  }else{
    next(createHttpError(404, `trip with id ${id} not found!`))
  }

  } catch (error) {
    next(error)
  }
})

 travelsRouter.delete("/:travelId", async (req, res, next) => {
    try { 
        const id=req.params.travelId
        if (id.length !== 24)
        return next(createHttpError(400, "Invalid ID"));
      const deletedTrip = await NewTripModel.findByIdAndDelete(id);
      if (deletedTrip) {
        res.status(204).send();
      } else {
        next(createHttpError(404, "Not found!"));
      }

    } catch (error) {
      next(error)
    }
  }
)

export default  travelsRouter