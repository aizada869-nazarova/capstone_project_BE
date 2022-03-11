import express from "express"
import createHttpError from "http-errors"
import PakingListsModel from "./schema.js"

const pakingListsRouter = express.Router()

 pakingListsRouter.get("/", async (req, res, next) => {
  try { 
      const lists = await PakingListsModel.find()
    res.send(lists)

  } catch (error) {
    console.log(error)
    next(error)
  }
})

 pakingListsRouter.get("/:pakingId", async (req, res, next) => {
  try { const list= await PakingListsModel.findById(req.params.pakingId)
    if (list) {
      res.send(list)
    } else {
      next(createHttpError(404, `pakinglist with id ${req.params.pakingId} not found!`))
    }
     
     

  } catch (error) {
    next(error)
  }
})

 pakingListsRouter.post("/", async (req, res, next) => {
  try {
    const addPakingList = new PakingListsModel(req.body)
    const { _id } = await addPakingList.save()

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

 pakingListsRouter.put("/:pakingId", async (req, res, next) => {
  try { 
      const id=req.params.pakingId
    if (id.length !== 24)
    return next(createHttpError(400, "Invalid ID"));
  const updatedList = await PakingListsModel.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if(updatedList){
      res.send(updatedList)
  }else{
    next(createHttpError(404, `category with id ${id} not found!`))
  }

  } catch (error) {
    next(error)
  }
})

 pakingListsRouter.delete("/:pakingId", async (req, res, next) => {
    try { 
        const id=req.params.pakingId
        if (id.length !== 24)
        return next(createHttpError(400, "Invalid ID"));
      const deletedList = await PakingListsModel.findByIdAndDelete(id);
      if (deletedList) {
        res.status(204).send();
      } else {
        next(createHttpError(404, "Not found!"));
      }

    } catch (error) {
      next(error)
    }
  }
)

export default  pakingListsRouter