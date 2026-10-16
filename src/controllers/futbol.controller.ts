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

    if(!req.body){
        res.status(400).json({
            message: "Me tienes que pasar algo"
        })
        return
    }

    if(!req.body.nombre){
        res.status(400).json({
            message: "Necesito el nombre del equipo"
        })
        return
    }

    if(!req.body.division){
        res.status(400).json({
            message: "Necesito la division del equipo"
        })
        return
    }

    const nuevoEquipo: EquipoT = {
        id: equipoId,
        nombre: req.body.nombre,
        division: req.body.division,
        jugadores: []
    }

    equipoId++;

    equipos.push(nuevoEquipo);

    res.status(201).json({
        message: "Equipo creado correctamente",
        equipo: nuevoEquipo
    })
}

export const changeEquipo = (
    req: Request,
    res: Response
) => {

    const id = Number(req.params.id);

    const equipo = findEquipo(id,res);

    if(equipo){

        if(!req.body){
            res.status(400).json({
                message: "Me tienes que pasar algo"
            })
            return
        }

        if(!req.body.nombre){
            res.status(400).json({
                message: "Necesito el nombre"
            })
            return
        }

        if(!req.body.division){
            res.status(400).json({
                message: "Necesito la division"
            })
            return
        }

        const updatedEquipo: EquipoT = {
            ...equipo,
            ...req.body,
            id: equipo.id,
            jugadores: equipo.jugadores
        }

        changeEquipos(
            equipos.map(x=>x.id===id?updatedEquipo:x)
        );

        res.json({
            message: "Equipo actualizado",
            equipo: updatedEquipo
        })
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

    if(!equipo){
        return
    }

    if(!req.body){
        res.status(400).json({
            message: "Me tienes que pasar algo"
        })
        return
    }

    if(!req.body.nombre){
        res.status(400).json({
            message: "Necesito el nombre del jugador"
        })
        return
    }

    if(req.body.goles === undefined){
        res.status(400).json({
            message: "Necesito los goles"
        })
        return
    }

    const goles = Number(req.body.goles);

    if(
        goles < 0 ||
        !Number.isInteger(goles)
    ){
        res.status(400).json({
            message: "Goles incorrectos"
        })
        return
    }

    const nuevoJugador: JugadorT = {
        id: jugadorId,
        nombre: req.body.nombre,
        goles: goles
    }

    jugadorId++;

    equipo.jugadores.push(nuevoJugador);

    res.status(201).json({
        message: "Jugador creado correctamente",
        jugador: nuevoJugador
    })
}

export const deleteJugador = (
    req: Request,
    res: Response
) => {

    const id = Number(req.params.id);

    const jugadorId = Number(req.params.jugadorId);

    const equipo = findEquipo(id,res);

    if(!equipo){
        return
    }

    const jugador = equipo.jugadores.find(
        x=>x.id===jugadorId
    );

    if(!jugador){
        res.status(404).json({
            message: "No existe el jugador"
        })
        return
    }

    equipo.jugadores = equipo.jugadores.filter(
        x=>x.id!==jugadorId
    );

    res.json({
        message: "Jugador eliminado"
    })
}

export const moveJugador = (
    req: Request,
    res: Response
) => {

    const id = Number(req.params.id);

    const jugadorId = Number(req.params.jugadorId);

    if(!req.body){
        res.status(400).json({
            message: "Me tienes que pasar algo"
        })
        return
    }

    if(!req.body.equipoDestinoId){
        res.status(400).json({
            message: "Necesito el equipo destino"
        })
        return
    }

    const equipoDestinoId = Number(
        req.body.equipoDestinoId
    );

    if(id===equipoDestinoId){
        res.status(400).json({
            message: "No puede ir al mismo equipo"
        })
        return
    }

    const equipoOrigen = equipos.find(
        x=>x.id===id
    );

    if(!equipoOrigen){
        res.status(404).json({
            message: "No existe el equipo origen"
        })
        return
    }

    const equipoDestino = equipos.find(
        x=>x.id===equipoDestinoId
    );

    if(!equipoDestino){
        res.status(404).json({
            message: "No existe el equipo destino"
        })
        return
    }

    const jugador = equipoOrigen.jugadores.find(
        x=>x.id===jugadorId
    );

    if(!jugador){
        res.status(404).json({
            message: "No existe el jugador"
        })
        return
    }

    equipoOrigen.jugadores =
        equipoOrigen.jugadores.filter(
            x=>x.id!==jugadorId
        );

    equipoDestino.jugadores.push(jugador);

    res.json({
        message: "Jugador cambiado de equipo",
        jugador: jugador
    })
}