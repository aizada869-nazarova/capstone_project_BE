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


 travelsRouter.post("/:travelId", async (req, res, next)=>{
  try {  const newItinerary = await new commentsModel(req.body) 
    const { _id } = await  newItinerary.save()
   
  if ( newItinerary) {
   
    const addToInsert = { ... newItinerary.toObject()} 
    console.log( addToInsert)

    const modifiedTravel = await NewTripModel.findByIdAndUpdate(
      req.params.travelId,
      { $push: { comments:  addToInsert } }, 
      { new: true } 
    )
    if (modifiedBlog) {
      res.send(modifiedBlog)
    } else {
      next(createHttpError(404, `blog with id ${req.params.travelId} not found!`))
    }
  } else {
    next(createHttpError(404, `Blog with id ${req.body.travelId} not found!`))
  }
  } catch (error) {
    next(error)
    
  }
})

 travelsRouter.get("/:travelId/comments", async (req, res, next) => {
  try {
    console.log(req.params.travelId)
    const blog = await NewTripModel.findById(req.params.travelId)
    if (blog) {
      res.send(blog.comments)
    } else {
      next(createHttpError(404, `blog with id ${req.params. travelId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

 travelsRouter.get("/:travelId/comments/:commentId", async (req, res, next) => {
  try {
    const blog = await NewTripModel.findById(req.params.travelId)
    if (blog) {
      const purchasedItem = blog.comments.find(book => book._id.toString() === req.params.commentId) // You CANNOT compare an ObjectId (book._id) with a string (req.params.commentId) --> book._id needs to be converted into a string
      if (purchasedItem) {
        res.send(purchasedItem)
      } else {
        next(createHttpError(404, `Book with id ${req.params.commentId} not found!`))
      }
    } else {
      next(createHttpError(404, `blog with id ${req.params. travelId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

 travelsRouter.put("/:travelId/comments/:commentId", async (req, res, next) => {
  try {
    const blog = await NewTripModel.findById(req.params.travelId)
    if (blog) {
      const index = blog.comments.findIndex(book => book._id.toString() === req.params.commentId)

      if (index !== -1) {
       
        blog.comments[index] = { ...blog.comments[index].toObject(), ...req.body } 
        await blog.save() 
        res.send(blog)
      } else {
        next(createHttpError(404, `comment with id ${req.params.commentId} not found!`))
      }
    } else {
      next(createHttpError(404, `blog with id ${req.params. travelId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

 travelsRouter.delete("/:travelId/comments/:commentId", async (req, res, next) => {
  try {
    const modifiedblog = await NewTripModel.findByIdAndUpdate(
      req.params.travelId, 
      { $pull: { comments: { _id: req.params.commentId } } }, 
      { new: true } 
    )

    if (modifiedblog) {
      res.send(modifiedblog)
    } else {
      next(createHttpError(404, `blog with id ${req.params.travelId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

export default  travelsRouter