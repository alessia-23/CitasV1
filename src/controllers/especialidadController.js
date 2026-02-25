import Especialidad from "../models/Especialidad.js";
import mongoose from "mongoose";

// CREAR ESPECIALIDAD
const crearEspecialidad = async (req, res) => {
    try {
        const { codigo, nombre, descripcion } = req.body;
        // Validar campos obligatorios
        if (!codigo || !nombre || !descripcion) {
            return res.status(400).json({
                error: "Campos obligatorios incompletos"
            });
        }
        // Verificar código duplicado
        const existeEspecialidad = await Especialidad.findOne({ codigo });
        if (existeEspecialidad) {
            return res.status(400).json({
                error: "El código ya está registrado"
            });
        }
        const especialidad = new Especialidad({codigo,nombre,descripcion});
        await especialidad.save();
        res.status(201).json({
            message: "Especialidad creada correctamente",
            especialidad
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: error.message
            });
        }
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// OBTENER TODAS
const obtenerEspecialidades = async (req, res) => {
    try {
        const especialidades = await Especialidad.find();
        res.json({ especialidades });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// BUSCAR POR CÓDIGO O NOMBRE
const buscarEspecialidad = async (req, res) => {
    try {
        let { codigo, nombre } = req.query;
        if (codigo) codigo = codigo.trim();
        if (nombre) nombre = nombre.trim();
        if (!codigo && !nombre) {
            return res.status(400).json({
                error: "Debe enviar código o nombre"
            });
        }
        let filtro = {};
        if (codigo) {
            filtro.codigo = codigo;
        }
        if (nombre) {
            filtro.nombre = { $regex: nombre, $options: "i" };
        }
        const especialidades = await Especialidad.find(filtro);
        if (especialidades.length === 0) {
            return res.status(404).json({
                error: "No se encontraron especialidades"
            });
        }
        res.json({ especialidades });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// ACTUALIZAR ESPECIALIDAD
const actualizarEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "ID no válido"
            });
        }
        const datosActualizados = { ...req.body };
        // Eliminar campos vacíos
        Object.keys(datosActualizados).forEach(key => {
            if (typeof datosActualizados[key] === "string") {
                datosActualizados[key] = datosActualizados[key].trim();
            }
            if (datosActualizados[key] === "") {
                delete datosActualizados[key];
            }
        });
        const especialidad = await Especialidad.findByIdAndUpdate(
            id,
            datosActualizados,
            {
                new: true,
                runValidators: true
            }
        );
        if (!especialidad) {
            return res.status(404).json({
                error: "Especialidad no encontrada"
            });
        }
        res.json({
            message: "Especialidad actualizada correctamente",
            especialidad
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({
                error: error.message
            });
        }
        if (error.code === 11000) {
            return res.status(400).json({
                error: "El código ya está registrado"
            });
        }
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

//ELIMINAR ESPECIALIDAD
const eliminarEspecialidad = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "ID no válido"
            });
        }
        const especialidad = await Especialidad.findByIdAndDelete(id);
        if (!especialidad) {
            return res.status(404).json({
                error: "Especialidad no encontrada"
            });
        }
        res.json({
            message: "Especialidad eliminada correctamente"
        });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

export {
    crearEspecialidad,
    obtenerEspecialidades,
    buscarEspecialidad,
    actualizarEspecialidad,
    eliminarEspecialidad
};