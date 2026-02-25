import { Router } from "express";
import {crearPaciente,obtenerPacientes,buscarPaciente,actualizarPaciente,eliminarPaciente} from "../controllers/pacienteController.js";
import protegerRuta from "../middleware/authMiddleware.js";
const router = Router();

router.post("/crear", protegerRuta, crearPaciente);
router.get("/listar", protegerRuta, obtenerPacientes);
router.get("/buscar", protegerRuta, buscarPaciente);
router.put("/actualizar/:id", protegerRuta, actualizarPaciente);
router.delete("/eliminar/:id", protegerRuta, eliminarPaciente);

export default router;