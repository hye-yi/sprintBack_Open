import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./src/routes/index.js";
import mongoose from "mongoose";
import "./src/utils/env.js";
import { logger } from "./src/utils/logger.js";
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({ contentSecurityPolicy: false }));

app.use(express.static("public"));

app.use("/", router);

mongoose.connect(process.env.MONGODB_URL,
  {
    dbName: "eventdb",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info("Successfully connected to mongodb"))
  .catch((e) => console.log(e));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("server on! http://localhost:" + port));

export default app;
