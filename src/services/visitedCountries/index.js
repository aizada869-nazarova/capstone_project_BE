import express from "express";
import createHttpError from "http-errors";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import VisitedCountryModel from "./visitedCountryShema.js";
import JWTAuthMiddleware from "../../auth/middlewares.js";

const visitedCountryRouter = express.Router({ mergeParams: true });
//cloudinary config
const { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET, CLOUDINARY_URL } =
  process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_KEY,
  api_secret: CLOUDINARY_SECRET,
  api_url: CLOUDINARY_URL,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "experience-image",
  },
});

visitedCountryRouter.get(
  "/:visitedCountryId",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const visitedCounty = await VisitedCountryModel.findById(
        req.params.visitedCountryId
      ).populate({ path: "userId" });
      if (visitedCounty) {
        res.send(visitedCounty);
      } else {
        next(
          createHttpError(
            404,
            `a visited county with id ${req.params.visitedCountryId} not found!`
          )
        );
      }
    } catch (error) {
      next(error, console.log(error));
    }
  }
);

visitedCountryRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const userIdR = req.user._id;
    const newVisitedCounty = await VisitedCountryModel.find({
      userId: userIdR,
    }).populate({ path: "userId" });

    res.send(newVisitedCounty);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

visitedCountryRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const newVisitedCounty = new VisitedCountryModel(req.body);
    console.log(req.body);

    const { _id } = await newVisitedCounty.save();
    console.log({ _id });

    res.status(201).send({ _id });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

visitedCountryRouter.put("/:visitedCountryId", async (req, res, next) => {
  try {
    const id = req.params.visitedCountryId;
    if (id.length !== 24) return next(createHttpError(400, "Invalid ID"));
    const updatedvisitedCounty = await VisitedCountryModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    if (updatedvisitedCounty) {
      res.send(updatedvisitedCounty);
    } else {
      next(createHttpError(404, `a visited county with id ${id} not found!`));
    }
  } catch (error) {
    next(error);
  }
});

visitedCountryRouter.delete("/:visitedCountryId", async (req, res, next) => {
  try {
    const id = req.params.visitedCountryId;
    if (id.length !== 24) return next(createHttpError(400, "Invalid ID"));
    const deletedvisitedCounty = await VisitedCountryModel.findByIdAndDelete(
      id
    );
    if (deletedvisitedCounty) {
      res.status(204).send();
    } else {
      next(createHttpError(404, "Not found!"));
    }
  } catch (error) {
    next(error);
  }
});

const posterUploader = multer({ storage: cloudStorage }).single("exp-image");

visitedCountryRouter.post(
  "/:visitedCountryId/uploadPictures",
  posterUploader,
  async (req, res, next) => {
    try {
      // const user = req.file;
      // console.log(user, req.files);
      // const visitedCountryId = req.params.visitedCountryId;
      console.log(visitedCountryId, req.file);
      const updatedCountry = await VisitedCountryModel.findByIdAndUpdate(
        visitedCountryId,

        { $push: { images: req.file?.path } },
        {
          new: true,
        }
      );
      if (updatedCountry) {
        res.send(updatedCountry);
      } else {
        next(
          createHttpError(404, `vountry with id ${visitedCountryId} not found!`)
        );
      }
    } catch (error) {
      next(error, console.log(error));
    }
  }
);

export default visitedCountryRouter;
