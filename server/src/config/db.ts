import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbName = "ReciPie";
    const password = "Helikopter1";
    const con = await mongoose.connect(
      `mongodb+srv://Rasmus:${password}@cluster.vcgef.mongodb.net/${dbName}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    );
    console.log(`Database connected : ${con.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
