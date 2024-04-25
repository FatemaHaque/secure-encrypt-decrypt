import mongoose from "mongoose";

const connect = async () => {
  //   pass: i70aR1t8EVYDCoST;
  //   user: muktadirplanetx;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connection successful");
  } catch (error) {
    throw new Error("Error in connecting to mongobd");
  }
};

export default connect;
