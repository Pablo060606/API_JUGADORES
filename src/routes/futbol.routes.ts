import { Router } from "express";

import {
    addJugador,
    changeEquipo,
    createEquipo,
    deleteEquipo,
    deleteJugador,
    getEquipos,
    getEquipoWithID,
    getJugadores,
    moveJugador
} from "../controllers/futbol.controller.js";


const router = Router();


router.get("/", getEquipos);

router.get("/:id", getEquipoWithID);

router.post("/", createEquipo);

router.put("/:id", changeEquipo);

router.delete("/:id", deleteEquipo);


router.get("/:id/jugadores", getJugadores);

router.post("/:id/jugadores", addJugador);

router.delete(
    "/:id/jugadores/:jugadorId",
    deleteJugador
);

router.patch(
    "/:id/jugadores/:jugadorId/mover",
    moveJugador
);


export default router;