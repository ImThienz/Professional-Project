const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/doanchuyennganh", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Could not connect to MongoDB:", error));

// Routes for comics
const comicRoutes = require("./routes/comicRoutes");
app.use("/api/v1/comics", comicRoutes);

// Routes for chapters
const chapterRoutes = require("./routes/chapterRoutes");
app.use("/api/v1/chapters", chapterRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
