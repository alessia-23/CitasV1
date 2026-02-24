import mongoose from "mongoose";

const citaSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    },
    paciente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Paciente",
        required: true
    },
    especialidad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Especialidad",
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model("Cita", citaSchema);