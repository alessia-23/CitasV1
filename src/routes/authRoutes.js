import express from "express";
import { register, login } from "../controllers/authController.js";

const router = express.Router();

// Colocamos las rutas de registro y login, que se encargan de manejar las solicitudes de autenticación de los usuarios, recoordar que es importante el orden de las rutas y que en el server es donde coloco con la protección de rutas 
router.post("/register", register);
router.post("/login", login);


export default router;