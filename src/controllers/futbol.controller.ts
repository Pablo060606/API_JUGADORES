import type { Request, Response } from "express";
import { changeEquipos, equipos } from "../data/futbol.data.js";
import type { EquipoT, JugadorT } from "../models/futbol.models.js";


let equipoId = 1;
let jugadorId = 1;


const findEquipo = (id: number, res: Response) => {

    const equipo = equipos.find(x=>x.id===id);

    if(!equipo){
        res.status(404).json({
            message: "No existe el equipo"
        })
        return
    }

    return equipo;
}


// EQUIPOS


export const getEquipos = (
    req: Request,
    res: Response
) => {

    res.json(equipos);
}


export const getEquipoWithID = (
    req: Request,
    res: Response
) => {

    const id = Number(req.params.id);

    const equipo = findEquipo(id,res);

    if(equipo){
        res.json(equipo);
    }
}


export const createEquipo = (
    req: Request,
    res: Response
) => {

    const {nombre, division} = req.body || {};

    if(!nombre || typeof nombre !== "string" || nombre.trim()===""){
        res.status(400).json({
            message: "Nombre obligatorio"
        })
        return
    }

    if(!division || typeof division !== "string" || division.trim()===""){
        res.status(400).json({
            message: "Division obligatoria"
        })
        return
    }

    const nuevoEquipo: EquipoT = {
        id: equipoId,
        nombre: nombre.trim(),
        division: division.trim(),
        jugadores: []
    }

    equipoId++;

    equipos.push(nuevoEquipo);

    res.status(201).json(nuevoEquipo);
}


export const changeEquipo = (
    req: Request,
    res: Response
) => {

    const id = Number(req.params.id);

    const equipo = findEquipo(id,res);

    if(equipo){

        const {nombre, division} = req.body || {};

        if(!nombre || typeof nombre !== "string" || nombre.trim()===""){
            res.status(400).json({
                message: "Nombre no valido"
            })
            return
        }

        if(!division || typeof division !== "string" || division.trim()===""){
            res.status(400).json({
                message: "Division no valida"
            })
            return
        }

        equipo.nombre = nombre.trim();
        equipo.division = division.trim();

        res.json(equipo);
    }
}


export const deleteEquipo = (
    req: Request,
    res: Response
) => {

    const id = Number(req.params.id);

    const equipo = findEquipo(id,res);

    if(equipo){

        changeEquipos(
            equipos.filter(x=>x.id!==id)
        );

        res.json({
            message: "Equipo eliminado"
        })
    }
}


// JUGADORES


export const getJugadores = (
    req: Request,
    res: Response
) => {

    const id = Number(req.params.id);

    const equipo = findEquipo(id,res);

    if(equipo){
        res.json(equipo.jugadores);
    }
}


export const addJugador = (
    req: Request,
    res: Response
) => {

    const id = Number(req.params.id);

    const equipo = findEquipo(id,res);

    if(equipo){

        const {nombre, goles} = req.body || {};

        if(!nombre || typeof nombre !== "string" || nombre.trim()===""){
            res.status(400).json({
                message: "Nombre de jugador obligatorio"
            })
            return
        }

        if(
            goles === undefined ||
            typeof goles !== "number" ||
            goles < 0 ||
            !Number.isInteger(goles)
        ){
            res.status(400).json({
                message: "Goles debe ser un entero mayor o igual a 0"
            })
            return
        }

        const nuevoJugador: JugadorT = {
            id: jugadorId,
            nombre: nombre.trim(),
            goles: goles
        }

        jugadorId++;

        equipo.jugadores.push(nuevoJugador);

        res.status(201).json(nuevoJugador);
    }
}


export const deleteJugador = (
    req: Request,
    res: Response
) => {

    const id = Number(req.params.id);
    const idJugador = Number(req.params.jugadorId);

    const equipo = findEquipo(id,res);

    if(equipo){

        const jugador = equipo.jugadores.find(
            x=>x.id===idJugador
        );

        if(!jugador){
            res.status(404).json({
                message: "No existe el jugador"
            })
            return
        }

        equipo.jugadores = equipo.jugadores.filter(
            x=>x.id!==idJugador
        );

        res.json({
            message: "Jugador eliminado"
        })
    }
}


export const moveJugador = (
    req: Request,
    res: Response
) => {

    const id = Number(req.params.id);
    const idJugador = Number(req.params.jugadorId);

    const {equipoDestinoId} = req.body || {};

    const destinoId = Number(equipoDestinoId);

    if(!equipoDestinoId || isNaN(destinoId)){
        res.status(400).json({
            message: "Equipo destino no valido"
        })
        return
    }

    if(id===destinoId){
        res.status(400).json({
            message: "No puede ir al mismo equipo"
        })
        return
    }

    const equipoOrigen = findEquipo(id,res);

    if(!equipoOrigen){
        return
    }

    const equipoDestino = equipos.find(
        x=>x.id===destinoId
    );

    if(!equipoDestino){
        res.status(404).json({
            message: "No existe el equipo destino"
        })
        return
    }

    const jugador = equipoOrigen.jugadores.find(
        x=>x.id===idJugador
    );

    if(!jugador){
        res.status(404).json({
            message: "No existe el jugador"
        })
        return
    }

    equipoOrigen.jugadores = equipoOrigen.jugadores.filter(
        x=>x.id!==idJugador
    );

    equipoDestino.jugadores.push(jugador);

    res.json({
        message: "Jugador cambiado de equipo",
        jugador: jugador
    })
}