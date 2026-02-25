import Paciente from "../models/Paciente.js";
import mongoose from "mongoose";

// CREAR PACIENTE
const crearPaciente = async (req, res) => {
    try {const {nombre,apellido,cedula,fecha_nacimiento,genero,ciudad,direccion,telefono,email} = req.body;
        // Validar campos obligatorios
        if (!nombre || !apellido || !cedula || !fecha_nacimiento || !direccion || !telefono || !email || !ciudad || !genero) {
            return res.status(400).json({
                error: "Campos obligatorios incompletos"
            });
        }
        // Verificar si la cédula ya existe
        const existePaciente = await Paciente.findOne({ cedula });
        if (existePaciente) {
            return res.status(400).json({
                error: "La cédula ya está registrada"
            });
        }
        const paciente = new Paciente({nombre,apellido,cedula,fecha_nacimiento,genero,ciudad,direccion,telefono,email});
        await paciente.save();
        res.status(201).json({
            message: "Paciente creado correctamente",
            paciente
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

// OBTENER TODOS LOS PACIENTES
const obtenerPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.find();
        res.json({ pacientes });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// BUSCAR POR CÉDULA O APELLIDO
const buscarPaciente = async (req, res) => {
    try {
        let { cedula, apellido } = req.query;
        if (cedula) cedula = cedula.trim();
        if (apellido) apellido = apellido.trim();
        // Debe enviar uno no ambos
        if (!cedula && !apellido) {
            return res.status(400).json({
                error: "Debe enviar cédula o apellido"
            });
        }
        // No ambos
        if (cedula && apellido) {
            return res.status(400).json({
                error: "Debe buscar por cédula o por apellido, no por ambos"
            });
        }
        let filtro = {};
        if (cedula) {
            filtro.cedula = cedula;
        }
        if (apellido) {
            filtro.apellido = { $regex: apellido, $options: "i" };
        }
        const pacientes = await Paciente.find(filtro);
        if (pacientes.length === 0) {
            return res.status(404).json({
                error: "No se encontraron pacientes"
            });
        }
        res.json({ pacientes });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

// ACTUALIZAR PACIENTE
const actualizarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "ID no válido" });
        }
        const datosActualizados = { ...req.body };
        // Limpiar espacios y eliminar campos vacíos
        Object.keys(datosActualizados).forEach(key => {
            if (typeof datosActualizados[key] === "string") {
                datosActualizados[key] = datosActualizados[key].trim();
            }
            if (datosActualizados[key] === "") {
                delete datosActualizados[key];
            }
        });
        const paciente = await Paciente.findByIdAndUpdate(id,datosActualizados,
            {
                new: true,
                runValidators: true
            }
        );
        if (!paciente) {
            return res.status(404).json({ error: "Paciente no encontrado" });
        }
        res.json({
            message: "Paciente actualizado correctamente",paciente
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ error: error.message });
        }
        if (error.code === 11000) {
            return res.status(400).json({ error: "La cédula ya está registrada" });
        }
        res.status(500).json({ error: "Error del servidor" });
    }
};

//ELIMINAR PACIENTE
const eliminarPaciente = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "ID no válido"
            });
        }
        const paciente = await Paciente.findByIdAndDelete(id);
        if (!paciente) {
            return res.status(404).json({
                error: "Paciente no encontrado"
            });
        }
        res.json({
            message: "Paciente eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            error: "Error del servidor"
        });
    }
};

export {
    crearPaciente,
    obtenerPacientes,
    buscarPaciente,
    actualizarPaciente,
    eliminarPaciente
};