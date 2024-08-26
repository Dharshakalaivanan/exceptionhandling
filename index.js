import express from "express";

import {appRouter} from "./routes/index.js"
const app = express();
app.use(express.json());
app.use('/',appRouter)



app.listen(5002, () => {
  console.log("PORT 5002 is listening");
});
