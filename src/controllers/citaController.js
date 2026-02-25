import Cita from "../models/Cita.js";
import Paciente from "../models/Paciente.js";
import Especialidad from "../models/Especialidad.js";
import mongoose from "mongoose";

// CREAR CITA
const crearCita = async (req, res) => {
    try {
        let { codigo, descripcion, paciente, especialidad } = req.body;
        if (!codigo || !descripcion || !paciente || !especialidad) {
            return res.status(400).json({
                msg: "Campos obligatorios incompletos"
            });
        }
        codigo = codigo.trim();
        // Validar ObjectId
        if (
            !mongoose.Types.ObjectId.isValid(paciente) ||
            !mongoose.Types.ObjectId.isValid(especialidad)
        ) {
            return res.status(400).json({
                msg: "ID de paciente o especialidad no válido"
            });
        }
        // Verificar existencia
        const [existePaciente, existeEspecialidad] = await Promise.all([
            Paciente.findById(paciente),
            Especialidad.findById(especialidad)
        ]);
        if (!existePaciente || !existeEspecialidad) {
            return res.status(404).json({
                msg: "Paciente o especialidad no encontrados"
            });
        }
        // Validar código único
        const codigoExiste = await Cita.findOne({ codigo });
        if (codigoExiste) {
            return res.status(400).json({
                msg: "El código de la cita ya está en uso"
            });
        }
        // Validar duplicado paciente + especialidad
        const yaExisteCita = await Cita.findOne({ paciente, especialidad });
        if (yaExisteCita) {
            return res.status(400).json({
                msg: "Este paciente ya tiene una cita en esta especialidad"
            });
        }
        const cita = await Cita.create({
            codigo,
            descripcion,
            paciente,
            especialidad
        });
        res.status(201).json({
            msg: "Cita creada correctamente",
            cita
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error del servidor al crear cita"
        });
    }
};


// OBTENER CITAS
const obtenerCitas = async (req, res) => {
    try {
        const citas = await Cita.find()
            .populate("paciente", "nombre apellido cedula")
            .populate("especialidad", "codigo nombre");
        res.json(citas);
    } catch (error) {
        res.status(500).json({
            msg: "Error del servidor al obtener citas"
        });
    }
};

// BUSCAR CITA
const buscarCita = async (req, res) => {
    try {
        let { codigo, paciente, especialidad } = req.query;
        if (codigo) codigo = codigo.trim();
        if (paciente) paciente = paciente.trim();
        if (especialidad) especialidad = especialidad.trim();
        if (!codigo && !paciente && !especialidad) {
            return res.status(400).json({
                msg: "Debe enviar al menos un parámetro de búsqueda"
            });
        }
        const filtro = {};
        // Buscar por código
        if (codigo) {
            filtro.codigo = { $regex: codigo, $options: "i" };
        }
        // Buscar por paciente
        if (paciente) {
            const pacientes = await Paciente.find({
                $or: [
                    { nombre: { $regex: paciente, $options: "i" } },
                    { apellido: { $regex: paciente, $options: "i" } },
                    { cedula: { $regex: paciente, $options: "i" } }
                ]
            });
            const idsPacientes = pacientes.map(p => p._id);
            filtro.paciente = { $in: idsPacientes };
        }
        // Buscar por especialidad
        if (especialidad) {
            const especialidades = await Especialidad.find({
                $or: [
                    { codigo: { $regex: especialidad, $options: "i" } },
                    { nombre: { $regex: especialidad, $options: "i" } }
                ]
            });
            const idsEspecialidades = especialidades.map(e => e._id);
            filtro.especialidad = { $in: idsEspecialidades };
        }
        const citas = await Cita.find(filtro)
            .populate("paciente", "nombre apellido cedula")
            .populate("especialidad", "codigo nombre");
        if (citas.length === 0) {
            return res.status(404).json({
                msg: "No se encontraron citas"
            });
        }
        res.json({ citas });
    } catch (error) {
        res.status(500).json({
            msg: "Error del servidor al buscar citas"
        });
    }
};

// ACTUALIZAR CITA
const actualizarCita = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "ID no válido" });
        }
        const cita = await Cita.findById(id);
        if (!cita) {
            return res.status(404).json({ msg: "Cita no encontrada" });
        }
        let { codigo, descripcion, paciente, especialidad } = req.body;
        //  Validar código único si viene
        if (codigo) {
            codigo = codigo.trim();
            const codigoExiste = await Cita.findOne({
                codigo,
                _id: { $ne: id }
            });
            if (codigoExiste) {
                return res.status(400).json({
                    msg: "El código ya está en uso"
                });
            }
            cita.codigo = codigo;
        }
        //  Validar paciente
        if (paciente) {
            if (!mongoose.Types.ObjectId.isValid(paciente)) {
                return res.status(400).json({
                    msg: "ID de paciente no válido"
                });
            }
            const existePaciente = await Paciente.findById(paciente);
            if (!existePaciente) {
                return res.status(404).json({
                    msg: "Paciente no encontrado"
                });
            }
            cita.paciente = paciente;
        }
        // Validar especialidad
        if (especialidad) {
            if (!mongoose.Types.ObjectId.isValid(especialidad)) {
                return res.status(400).json({
                    msg: "ID de especialidad no válido"
                });
            }
            const existeEspecialidad = await Especialidad.findById(especialidad);
            if (!existeEspecialidad) {
                return res.status(404).json({
                    msg: "Especialidad no encontrada"
                });
            }
            cita.especialidad = especialidad;
        }
        // Validar duplicado paciente + especialidad
        const yaExiste = await Cita.findOne({
            paciente: cita.paciente,
            especialidad: cita.especialidad,
            _id: { $ne: id }
        });
        if (yaExiste) {
            return res.status(400).json({
                msg: "Ya existe una cita con este paciente y especialidad"
            });
        }
        if (descripcion !== undefined) {
            cita.descripcion = descripcion;
        }
        await cita.save();
        res.json({
            msg: "Cita actualizada correctamente",
            cita
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: "Error del servidor al actualizar cita"
        });
    }
};

// ELIMINAR CITA
const eliminarCita = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                msg: "ID no válido"
            });
        }
        const cita = await Cita.findByIdAndDelete(id);
        if (!cita) {
            return res.status(404).json({
                msg: "Cita no encontrada"
            });
        }
        res.json({
            msg: "Cita eliminada correctamente"
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error del servidor"
        });
    }
};

export {
    crearCita,
    obtenerCitas,
    buscarCita,
    actualizarCita,
    eliminarCita
};