// Importamos express nuevamente para poder incluir la ayuda del intellisense
// Al volver a importar express vuelve a utilizar la libreria ya carga en memoria
// es decir que no vuelve a cargar la libreria de nuevo.
// const { validationResult } = require('express-validator');
const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');


const crearUsuario = async (req = request, res = response) => {
    // Manejo de errores
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({
    //         ok: false,
    //         errors: errors.mapped()
    //     });
    // }
    //Usamos el manejo de errors en nuestro custom middleware (validar-campos.js)
    const { email, password } = req.body;

    try {
        let usuario = await Usuario.findOne({ email });

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo'
            });
        }

        usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();
        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor contactese con el administrador.'
        });
    }
}

const loginUsuario = async (req, res = response) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     res.status(400).json({
    //         ok: false,
    //         errors: errors.mapped()
    //     });
    // }
    const { email, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ email });

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }

        // Confirmar password
        const validPassword = bcrypt.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.name);

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor contactese con el administrador.'
        });
    }
}

const revalidarToken = async (req, res = response) => {
    // const uid = req.uid;
    const { uid, name } = req;

    const token = await generarJWT(uid, name);

    res.json({
        ok: true,
        token,
        uid,
        name
    });
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}