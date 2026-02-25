import { Router } from "express";
import {crearCita,obtenerCitas,buscarCita,actualizarCita,eliminarCita} from "../controllers/citaController.js";
import protegerRuta from "../middleware/authMiddleware.js";

const router = Router();

// CRUD
router.post("/crear",protegerRuta ,crearCita);          // Crear
router.get("/listar", protegerRuta, obtenerCitas);        // Listar
router.get("/buscar", protegerRuta, buscarCita);    // Buscar
router.put("/actualizar/:id", protegerRuta, actualizarCita);   // Actualizar
router.delete("/eliminar/:id", protegerRuta, eliminarCita);  // Eliminar

export default router;