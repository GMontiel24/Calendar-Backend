const { response, request } = require('express');
const Evento = require('../models/Evento');


const getEventos = async (req, res = response) => {
    try {
        const eventos = await Evento.find()
            .populate('user', 'name');

        return res.json({
            ok: true,
            eventos
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor contactese con el administrador.'
        });
    }
}

const crearEvento = async (req = request, res = response) => {
    try {
        const evento = new Evento(req.body);
        evento.user = req.uid;

        const eventoGuardado = await evento.save();

        return res.status(201).json({
            ok: true,
            evento: eventoGuardado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor contactese con el administrador.'
        });
    }
}

const actualizarEvento = async (req = request, res = response) => {
    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el evento'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permiso para editar este evento'
            });
        }

        const eventoActualizado = {
            ...req.body,
            user: uid
        }

        // El 3er argumento es para indicarle que nos retorne el nuevo documento actualizado,
        // caso contrario nos retorna el doc. viejo que se va actualizar. 
        const eventoActualizadoDb = await Evento.findByIdAndUpdate(eventoId, eventoActualizado, { new: true });

        return res.json({
            ok: true,
            evento: eventoActualizadoDb
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor contactese con el administrador.'
        });
    }
}

const eliminarEvento = async (req = request, res = response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);

        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el evento'
            });
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permiso para eliminar este evento'
            });
        }

        await Evento.findByIdAndDelete(eventoId);

        return res.json({
            ok: true,
            msg: 'Evento eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor contactese con el administrador.'
        });
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}