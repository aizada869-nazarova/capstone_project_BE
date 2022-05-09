import express from "express";
import createHttpError from "http-errors";
import ItineraryModel from "./schema.js";
import JWTAuthMiddleware from "../../auth/middlewares.js";

const itineraryRouter = express.Router();

itineraryRouter.get(
  "/:itineraryId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const itinerary = await ItineraryModel.findById(
        req.params.itineraryId
      ).populate({ path: "travelId", select: "_id" });
      if (itinerary) {
        res.send(itinerary);
      } else {
        next(
          createHttpError(
            404,
            `itinerary with id ${req.params.itineraryId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

itineraryRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const itineraryIdRef = req.params.travelId;
    console.log(itineraryIdRef);

    const newItinerary = await ItineraryModel.find({ itineraryIdRef }).populate(
      { path: "travelId", select: "_id" }
    );

    res.send(newItinerary);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

itineraryRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newItinerary = new ItineraryModel(req.body);
    console.log(req.body);

    const { _id } = await newItinerary.save();
    console.log({ _id });

    res.status(201).send({ _id });
  } catch (error) {
    console.log(error);
    next(error, console.log(error));
  }
});

itineraryRouter.put(
  "/:itineraryId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const id = req.params.itineraryId;
      if (id.length !== 24) return next(createHttpError(400, "Invalid ID"));
      const updatedItinerary = await ItineraryModel.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
        }
      );
      if (updatedItinerary) {
        res.send(updatedItinerary);
      } else {
        next(createHttpError(404, `Itinerary with id ${id} not found!`));
      }
    } catch (error) {
      next(error);
    }
  }
);

itineraryRouter.delete(
  "/:itineraryId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const id = req.params.itineraryId;
      if (id.length !== 24) return next(createHttpError(400, "Invalid ID"));
      const deletedItinerary = await ItineraryModel.findByIdAndDelete(id);
      if (deletedItinerary) {
        res.status(204).send();
      } else {
        next(createHttpError(404, "Not found!"));
      }
    } catch (error) {
      next(error);
    }
  }
);

// --places to visit endpoints--
itineraryRouter.post(
  "/:itineraryId/place",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const modifiedItinerary = await ItineraryModel.findByIdAndUpdate(
        req.params.itineraryId,
        { $push: { placesToVisit: req.body } },
        { new: true }
      );
      if (modifiedItinerary) {
        res.send(modifiedItinerary);
      } else {
        next(
          createHttpError(
            404,
            `itinerary with id ${req.params.itineraryId} not found!`
          )
        );
      }
    } catch (error) {
      console.log(error);
      next(error, console.log(error));
    }
  }
);

itineraryRouter.get(
  "/:itineraryId/place",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      console.log(req.params.itineraryId);
      const itineraries = await ItineraryModel.findById(req.params.itineraryId);
      if (itineraries) {
        res.send(itineraries.placesToVisit);
      } else {
        next(
          createHttpError(
            404,
            `itinerary with id ${req.params.itineraryId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

itineraryRouter.get(
  "/:itineraryId/place/:placeId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const itinerary = await ItineraryModel.findById(req.params.itineraryId);
      if (itinerary) {
        const singleItinerary = itinerary.placesToVisit.find(
          (single) => single._id.toString() === req.params.placeId
        );
        if (singleItinerary) {
          res.send(singleItinerary);
        } else {
          next(
            createHttpError(
              404,
              `place with id ${req.params.placeId} not found!`
            )
          );
        }
      } else {
        next(
          createHttpError(
            404,
            `itinerary with id ${req.params.itineraryId} not found!`
          )
        );
      }
    } catch (error) {
      next(error, console.log(error));
    }
  }
);

itineraryRouter.put("/:itineraryId/place/:placeId", async (req, res, next) => {
  try {
    const itinerary = await ItineraryModel.findById(req.params.itineraryId);
    if (itinerary) {
      const index = itinerary.placesToVisit.findIndex(
        (singleIt) => singleIt._id.toString() === req.params.placeId
      );

      if (index !== -1) {
        itinerary.placesToVisit[index] = {
          ...itinerary.placesToVisit[index].toObject(),
          ...req.body,
        };
        await itinerary.save();
        res.send(itinerary);
      } else {
        next(
          createHttpError(404, `place with id ${req.params.placeId} not found!`)
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `itinerary with id ${req.params.itineraryId} not found!`,
          console.log(error)
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

itineraryRouter.delete(
  "/:itineraryId/place/:placeId",
  async (req, res, next) => {
    try {
      const modifieditinerary = await ItineraryModel.findByIdAndUpdate(
        req.params.itineraryId,
        { $pull: { placesToVisit: { _id: req.params.placeId } } },
        { new: true }
      );

      if (modifieditinerary) {
        res.status(204).send();
      } else {
        next(
          createHttpError(
            404,
            `itinerary with id ${req.params.itineraryId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

// --to do list endpoints--
itineraryRouter.post(
  "/:itineraryId/todo",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const modifiedItinerary = await ItineraryModel.findByIdAndUpdate(
        req.params.itineraryId,
        { $push: { todoLists: req.body } },
        { new: true }
      );
      if (modifiedItinerary) {
        res.send(modifiedItinerary);
      } else {
        next(
          createHttpError(
            404,
            `itinerary with id ${req.params.itineraryId} not found!`
          )
        );
      }
    } catch (error) {
      console.log(error);
      next(error, console.log(error));
    }
  }
);

itineraryRouter.get(
  "/:itineraryId/todo",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      console.log(req.params.itineraryId);
      const itineraries = await ItineraryModel.findById(req.params.itineraryId);
      if (itineraries) {
        res.send(itineraries.todoLists);
      } else {
        next(
          createHttpError(
            404,
            `itinerary with id ${req.params.itineraryId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

itineraryRouter.get(
  "/:itineraryId/todo/:todoId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const itinerary = await ItineraryModel.findById(req.params.itineraryId);
      if (itinerary) {
        const singleItinerary = itinerary.todoLists.find(
          (single) => single._id.toString() === req.params.todoId
        );
        if (singleItinerary) {
          res.send(singleItinerary);
        } else {
          next(
            createHttpError(
              404,
              `to do list with id ${req.params.todoId} not found!`
            )
          );
        }
      } else {
        next(
          createHttpError(
            404,
            `itinerary with id ${req.params.itineraryId} not found!`
          )
        );
      }
    } catch (error) {
      next(error, console.log(error));
    }
  }
);

itineraryRouter.put("/:itineraryId/todo/:todoId", async (req, res, next) => {
  try {
    const itinerary = await ItineraryModel.findById(req.params.itineraryId);
    if (itinerary) {
      const index = itinerary.todoLists.findIndex(
        (singleIt) => singleIt._id.toString() === req.params.todoId
      );

      if (index !== -1) {
        itinerary.todoLists[index] = {
          ...itinerary.todoLists[index].toObject(),
          ...req.body,
        };
        await itinerary.save();
        res.send(itinerary);
      } else {
        next(
          createHttpError(
            404,
            `to do list with id ${req.params.todoId} not found!`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `itinerary with id ${req.params.itineraryId} not found!`,
          console.log(error)
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

itineraryRouter.delete("/:itineraryId/todo/:todoId", async (req, res, next) => {
  try {
    const modifieditinerary = await ItineraryModel.findByIdAndUpdate(
      req.params.itineraryId,
      { $pull: { todoLists: { _id: req.params.todoId } } },
      { new: true }
    );

    if (modifieditinerary) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `itinerary with id ${req.params.itineraryId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default itineraryRouter;
