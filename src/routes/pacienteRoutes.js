import { Router } from "express";
import {crearPaciente,obtenerPacientes,buscarPaciente,actualizarPaciente,eliminarPaciente} from "../controllers/pacienteController.js";

const router = Router();

router.post("/crear", crearPaciente);
router.get("/listar", obtenerPacientes);
router.get("/buscar", buscarPaciente);
router.put("/actualizar/:id", actualizarPaciente);
router.delete("/eliminar/:id", eliminarPaciente);

export default router;