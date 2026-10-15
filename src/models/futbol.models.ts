export type JugadorT = {
    id: number,
    nombre: string,
    goles: number
}


export type EquipoT = {
    id: number,
    nombre: string,
    division: string,
    jugadores: JugadorT[]
}