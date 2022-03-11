import express from "express"
import createHttpError from "http-errors"
import passport from "passport"
import UsersModel from "./schema.js"

import JWTAuthMiddleware from "../../auth/middlewares.js"

import {
  JWTAuthenticate,
  verifyRefreshTokenAndGenerateNewTokens,
} from "../../auth/tools.js"

const usersRouter = express.Router()

usersRouter.post("/", async (req, res, next) => {
  try {
    const user = new UsersModel(req.body)
    const { _id } = await user.save()

    res.status(201).send({ _id })
  } catch (error) {
    next(error)
  }
})

usersRouter.get(
  "/",
  // JWTAuthMiddleware,
 
  async (req, res, next) => {
    try {
      const users = await UsersModel.find()
      res.send(users)
    } catch (error) {
      next(error)
    }
  }
)

usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findByIdAndUpdate(req.user._id, req.body)
    if (user) {
      res.send(user)
    } else {
      next(401, `User with id ${req.user._id} not found!`)
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  const user = await UsersModel.findById(req.user._id)
  if (user) {
    res.send(user)
  } else {
    next(401, `User with id ${req.user._id} not found!`)
  }
})

usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findByIdAndDelete(req.user._id)
    if (user) {
      res.send()
    } else {
      next(401, `User with id ${req.user._id} not found!`)
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
) // This endpoint receives Google Login requests from our FE, and it is going to redirect users to Google Consent Screen

usersRouter.get(
  "/googleRedirect", // This endpoint URL should match EXACTLY the one configured on google.cloud dashboard
  passport.authenticate("google"),
  async (req, res, next) => {
    try {
      console.log("TOKENS: ", req.user.tokens)
      // SEND BACK TOKENS
      res.redirect(
        `${process.env.FE_URL}?accessToken=${req.user.tokens.accessToken}&refreshToken=${req.user.tokens.refreshToken}`
      )
    } catch (error) {
      next(error)
    }
  }
)

usersRouter.get("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId)
    if (user) {
      res.send(user)
    } else {
      next(createHttpError(404, `User with id ${req.params.userId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})
usersRouter.put(
  "/:userId",
  JWTAuthMiddleware,
  
  async (req, res, next) => {
    try {
      const user = await UsersModel.findByIdAndUpdate(req.params.userId)
      if (user) {
        res.send(user)
      } else {
        next(
          createHttpError(404, `User with id ${req.params.userId} not found!`)
        )
      }
    } catch (error) {
      next(error)
    }
  }
)

usersRouter.delete(
  "/:userId",
  JWTAuthMiddleware,
  
  async (req, res, next) => {
    try {
      const user = await UsersModel.findByIdAndDelete(req.params.userId)
      if (user) {
        res.status(204).send()
      } else {
        next(
          createHttpError(404, `User with id ${req.params.userId} not found!`)
        )
      }
    } catch (error) {
      next(error)
    }
  }
)

usersRouter.post("/login", async (req, res, next) => {
  try {
    // 1. Obtain credentials from req.body
    const { email, password } = req.body
    console.log(req.body)

    // 2. Verify credentials
    const user = await UsersModel.checkCredentials(email, password)

    if (user) {
      console.log(user)
      // 3. If credentials are fine we are going to generate an access token and a refresh token and send them as a response
      const { accessToken, refreshToken } = await JWTAuthenticate(user)
      res.send({ accessToken, refreshToken })
    } else {
      // 4. If they are not --> error (401)
      next(createHttpError(401, "Credentials are not ok!"))
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.post("/refreshToken", async (req, res, next) => {
  try {
    // 1. Receive the current refresh token in req.body
    const { currentRefreshToken } = req.body

    // 2. Check the validity of that token (check if token is not expired, check if it hasn't been compromised, check if it is in user's record in db)
    const { accessToken, refreshToken } =
      await verifyRefreshTokenAndGenerateNewTokens(currentRefreshToken)

    // 3. If everything is fine --> generate a new pair of tokens (accessToken2 and refreshToken2)
    // 4. Send tokens back as a response
    res.send({ accessToken, refreshToken })
  } catch (error) {
    next(error)
  }
})

/* FE EXAMPLE

await fetch("/certainResource", {headers: {Authorization: accessToken}})

if(401) {
  const {newAccessToken, newRefreshToken }= await fetch("/users/refreshToken", {method: "POST", body: {currentRefreshToken}})
  localStorage.setItem("accessToken", newAccessToken)
  localStorage.setItem("refreshToken", newRefreshToken)

  await fetch("/certainResource", {headers: {Authorization: newAccessToken}})
}

*/

export default usersRouter
