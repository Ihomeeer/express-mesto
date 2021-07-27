const express = require("express");
const mongoose = require("mongoose");

const app = express();

const userRoute = require("./routes/users");

const { PORT = 3000 } = process.env;

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use("/", userRoute);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
