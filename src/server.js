const express = require("express");
const cors = require("cors");

const developerRoutes = require("./routes/developer.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "DevGraph API is running"
  });
});

app.use("/api/developers", developerRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`DevGraph API running on port ${PORT}`);
});