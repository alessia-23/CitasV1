import mongoose from "mongoose";

const especialidadSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model("Especialidad", especialidadSchema);