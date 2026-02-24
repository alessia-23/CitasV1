import jwt from "jsonwebtoken";

// Crear token
const crearTokenJWT = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET
    );
};

// Verificar token (middleware)
const verificarTokenJWT = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ msg: "Acceso denegado: token no proporcionado" });
    }
    try {
        const token = authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = decoded; // guardamos info del usuario
        next();
    } catch (error) {
        return res.status(401).json({ msg: "Token inválido" });
    }
};

export {
    crearTokenJWT,
    verificarTokenJWT
};
