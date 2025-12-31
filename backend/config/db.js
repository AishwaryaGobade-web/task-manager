// import mongoose from "mongoose"


// export const connectDB =async()=>{
//     await mongoose.connect('mongodb+srv://waru:waru2002@cluster0.mchs21o.mongodb.net/taskflow1')
//     .then(()=>console.log('DB CONNECTED'))
// }

import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB CONNECTED");
  } catch (error) {
    console.log("DB ERROR", error.message);
  }
};
