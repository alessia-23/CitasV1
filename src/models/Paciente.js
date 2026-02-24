import mongoose from "mongoose";

const pacienteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    cedula: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v.length === 10 && !isNaN(v);
            },
            message: "La cédula debe tener exactamente 10 números"
        }
    },
fecha_nacimiento: {
    type: Date,
    required: true,
    validate: {
        validator: function (value) {
            const hoy = new Date();
            const fechaMinima = new Date();
            fechaMinima.setFullYear(hoy.getFullYear() - 100);
            return value <= hoy && value >= fechaMinima;
        },
        message: "La edad debe estar entre 0 y 100 años"
    }
},
    genero: {
        type: String,
        enum: ["Masculino", "Femenino", "Otro"]
    },
    ciudad: {
        type: String,
        trim: true
    },
    direccion: {
        type: String,
        required: true,
        trim: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return v.length === 10 && !isNaN(v);
            },
            message: "El teléfono debe tener exactamente 10 números"
        }
    },
    email: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true,
    versionKey: false
});

export default mongoose.model("Paciente", pacienteSchema);