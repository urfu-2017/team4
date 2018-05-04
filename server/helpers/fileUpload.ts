import * as path from 'path';
import * as express from 'express';
import * as multer from 'multer';
import { UPLOADS_URL_PATH, UPLOADS_SERVER_PATH } from '../config';
import { v4 as uuid } from 'uuid';

export const uploadHandler: express.RequestHandler = (req, res) => {
    if (!req.session || !req.session.passport || !req.session.passport.user) {
        return res.sendStatus(403);
    }

    res.json({
        path: `${UPLOADS_URL_PATH}/${req.file.filename}`
    });
};

export const uploadStorage = multer.diskStorage({
    destination: UPLOADS_SERVER_PATH,
    filename: (req, file, cb) => {
        cb(null, uuid().split('-').join('') + path.extname(file.originalname))
    }
});
