const { response } = require('express');
const { validationResult } = require('express-validator');


const validarCampos = (req, res = response, next) => {

    // Manejo de errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }

    next();
}

// Exportar por default:
// module.exports = validarCampos

// Exportar desestructurando:
module.exports = {
    validarCampos
}