/*
    Rutas de Eventos / Events
    host + /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();
//Todas las rutas tienen que validar el Token
router.use(validarJWT);


router.get('/', getEventos);

router.post(
    '/new',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatorio').custom(isDate),
        check('end', 'Fecha de finalización es obligatorio').custom(isDate),
        validarCampos
    ],
    crearEvento);

router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatorio').custom(isDate),
        check('end', 'Fecha de finalización es obligatorio').custom(isDate),
        validarCampos
    ],
    actualizarEvento);

router.delete('/:id', eliminarEvento);

module.exports = router;