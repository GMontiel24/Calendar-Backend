const jwt = require('jsonwebtoken');


const generarJWT = (uid, name) => {

    return new Promise((resolve, reject) => {

        const payload = { uid, name };
        // Generamos la firma:
        /* firma: (payload,
             "palabra secreta que voy a usar para firmar mis tokens",
              tiempo de expiracion,
              callback para devolver el token)
        */
        jwt.sign(payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pudo generar el token.');
            }

            resolve(token);
        });

    })
}

module.exports = {
    generarJWT
}