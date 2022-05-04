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
   
      const newTrip = await NewTripModel.find({userId: userIdR}).populate({ path: "userId"})
  
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
    next(error, console.log(error))
  }
})

 travelsRouter.put("/:travelId", JWTAuthMiddleware, async (req, res, next) => {
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

// ----itinerary endpoints---

 travelsRouter.post("/:travelId/itinerary",JWTAuthMiddleware, async (req, res, next)=>{
  try {  
   
  
    const modifiedTravel = await NewTripModel.findByIdAndUpdate(
      req.params.travelId,
      { $push: {  itineraries:  req.body } }, 
      { new: true } 
    )
    if (modifiedTravel) {
      res.send(modifiedTravel)
    } else {
      next(createHttpError(404, `trip with id ${req.params.travelId} not found!`))
    }
  
  } catch (error) {
    console.log(error)
    next(error, console.log(error))
    
  }
})

 travelsRouter.get("/:travelId/itinerary", JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.params.travelId)
    const trip= await NewTripModel.findById(req.params.travelId)
    if (trip) {
      res.send(trip.itineraries)
    } else {
      next(createHttpError(404, `trip with id ${req.params. travelId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

 travelsRouter.get("/:travelId/itinerary/:itineraryId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const trip = await NewTripModel.findById(req.params.travelId)
    if (trip) {
      const singleItinerary= trip.itineraries.find(single => single._id.toString() === req.params.itineraryId) 
      if ( singleItinerary) {
        res.send(  singleItinerary)
      } else {
        next(createHttpError(404, `itinerary with id ${req.params.itineraryId} not found!`))
      }
    } else {
      next(createHttpError(404, `trip with id ${req.params. travelId} not found!`))
    }
  } catch (error) {
    next(error, console.log(error))
  }
})

 travelsRouter.put("/:travelId/itinerary/:itineraryId", async (req, res, next) => {
  try {
    const trip = await NewTripModel.findById(req.params.travelId)
    if (trip) {
      const index = trip.itineraries.findIndex(singleIt => singleIt._id.toString() === req.params.itineraryIdId)

      if (index !== -1) {
       
        trip.itineraries[index] = { ...trip.itineraries[index].toObject(), ...req.body } 
        await trip.save() 
        res.send(trip)
      } else {
        next(createHttpError(404, `itinerary with id ${req.params.itineraryId} not found!`))
      }
    } else {
      next(createHttpError(404, `trip with id ${req.params. travelId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

 travelsRouter.delete("/:travelId/itinerary/:itineraryId", async (req, res, next) => {
  try {
    const modifiedtrip = await NewTripModel.findByIdAndUpdate(
      req.params.travelId, 
      { $pull: { itineraries: { _id: req.params.itineraryId } } }, 
      { new: true } 
    )

    if (modifiedtrip) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `trip with id ${req.params.travelId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

// ----pakinglists endpoints---
travelsRouter.post("/:travelId/pakinglist",JWTAuthMiddleware, async (req, res, next)=>{
  try {  
   
  
    const modifiedTravel = await NewTripModel.findByIdAndUpdate(
      req.params.travelId,
      { $push: {  pakingLists: req.body } }, 
      { new: true } 
    )
    if (modifiedTravel) {
      res.send(modifiedTravel)
    } else {
      next(createHttpError(404, `trip with id ${req.params.travelId} not found!`))
    }
  
  } catch (error) {
    console.log(error)
    next(error, console.log(error))
    
  }
})

 travelsRouter.get("/:travelId/pakinglist", JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.params.travelId)
    const trip= await NewTripModel.findById(req.params.travelId)
    if (trip) {
      res.send(trip.pakingLists)
    } else {
      next(createHttpError(404, `trip with id ${req.params. travelId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

 travelsRouter.get("/:travelId/pakinglist/:pakinglistId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const trip = await NewTripModel.findById(req.params.travelId)
    if (trip) {
      const singlePakinglist= trip.pakingLists.find(single => single._id.toString() === req.params.pakinglistId) 
      if ( singlePakinglist) {
        res.send( singlePakinglist)
      } else {
        next(createHttpError(404, `pakinglist with id ${req.params. pakinglistId} not found!`))
      }
    } else {
      next(createHttpError(404, `trip with id ${req.params. travelId} not found!`))
    }
  } catch (error) {
    next(error, console.log(error))
  }
})

 travelsRouter.put("/:travelId/pakinglist/:pakinglistId", async (req, res, next) => {
  try {
    const trip = await NewTripModel.findById(req.params.travelId)
    if (trip) {
      const index = trip.pakingLists.findIndex(singlePar => singlePar._id.toString() === req.params.pakinglistId)

      if (index !== -1) {
       
        trip.pakingLists[index] = { ...trip.pakingLists[index].toObject(), ...req.body } 
        await trip.save() 
        res.send(trip)
      } else {
        next(createHttpError(404, `pakinglist with id ${req.params.pakinglistId} not found!`))
      }
    } else {
      next(createHttpError(404, `trip with id ${req.params. travelId} not found!`))
    }
  } catch (error) {
    next(error, console.log(error))
  }
})

 travelsRouter.delete("/:travelId/pakinglist/:pakinglistId", async (req, res, next) => {
  try {
    const modifiedtrip = await NewTripModel.findByIdAndUpdate(
      req.params.travelId, 
      { $pull: { pakingLists: { _id: req.params.pakinglistId } } }, 
      { new: true } 
    )

    if (modifiedtrip) {
      res.status(204).send()
    } else {
      next(createHttpError(404, `trip with id ${req.params.travelId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default  travelsRouter