import mongoose from 'mongoose'

const { Schema, model } = mongoose
const PakingListsSchema = new Schema( 
    {
        nameOfList: { type: String },
        category: { type: String, required: true, enum: ["other", "clothes"] }
        }
   ,
    { timestamps: true }
  )
// { category1: [{type: String, required: true}],
// category2: [{type: String, required: true}],
// category3: [{type: String, required: true}]}
    
    // ,
    

export default model("PakingLists", PakingListsSchema  )