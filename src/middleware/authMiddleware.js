import jwt from "jsonwebtoken";
const protegerRuta = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            msg: "Acceso denegado, token inválido"
        });
    }try {
        const tokenLimpio = token.replace("Bearer ", "");
        const decoded = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            msg: "Token inválido"
        });
    }
};
export default protegerRuta;