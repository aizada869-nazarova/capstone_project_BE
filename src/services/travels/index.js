import express from "express"
import createHttpError from "http-errors"
import NewTripModel from "./schema.js"

const travelsRouter = express.Router()

 travelsRouter.get("/", async (req, res, next) => {
  try { 
      const newTrip = await NewTripModel.find()
    res.send(newTrip)

  } catch (error) {
    console.log(error)
    next(error)
  }
})

 travelsRouter.get("/:travelId", async (req, res, next) => {
  try { const trip = await NewTripModel.findById(req.params.travelId)
    if (trip) {
      res.send(trip)
    } else {
      next(createHttpError(404, `trip with id ${req.params.travelId} not found!`))
    }
     

  } catch (error) {
    next(error)
  }
})

 travelsRouter.post("/", async (req, res, next) => {
  try {
    const newTrip = new NewTripModel(req.body)
    const { _id } = await newTrip.save()

    res.status(201).send({ _id })
  } catch (error) {
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