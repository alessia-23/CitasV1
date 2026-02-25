import { Router } from "express";
import {crearEspecialidad,obtenerEspecialidades,buscarEspecialidad,actualizarEspecialidad,eliminarEspecialidad} from "../controllers/especialidadController.js";
import protegerRuta from "../middleware/authMiddleware.js";
const router = Router();

router.post("/crear",protegerRuta, crearEspecialidad);
router.get("/listar", protegerRuta, obtenerEspecialidades);
router.get("/buscar", protegerRuta, buscarEspecialidad);
router.put("/actualizar/:id", protegerRuta, actualizarEspecialidad);
router.delete("/eliminar/:id", protegerRuta, eliminarEspecialidad);

export default router;