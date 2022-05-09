import mongoose from 'mongoose'

const { Schema, model } = mongoose
const PakingListsSchema = new Schema( 
    {
        toDoList: { type: String,required:true },
        itineraryId: { type: String, required: true, enum: ["other", "clothes"] }
        }
   ,
    { timestamps: true }
  )

    

export default model("PakingLists", PakingListsSchema  )