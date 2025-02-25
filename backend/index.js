const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const petRoute = require("./routes/pet");
const userRoute = require("./routes/user");


const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



const PORT = process.env.PORT || 8001;

// connect to mongodb
const URI = process.env.MongoDBURI;

try {
  mongoose.connect(URI);
  console.log("Mongodb Connected");
} catch (error) {
  console.log("Error: ", error);
}

app.use("/pets", petRoute);
app.use("/user", userRoute);


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
