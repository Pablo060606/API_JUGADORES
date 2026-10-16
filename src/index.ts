import express from "express";
import futbolRoutes from "./routes/futbol.routes.js";

const app = express();

app.use(express.json());

app.use("/api/equipos", futbolRoutes);

app.listen(3001, ()=>{
    console.log("Api funcionando en el puerto 3001")
})