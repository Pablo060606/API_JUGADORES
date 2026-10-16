import type { EquipoT } from "../models/futbol.models.js";

export let equipos: EquipoT[] = [];

export const changeEquipos = (equiposParam: EquipoT[]) => {
    equipos = equiposParam
}