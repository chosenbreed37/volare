import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requiresAuth } from 'express-openid-connect';
import { saveApplication } from '../services/datastore';
import * as mailer from '../services/mailer';

import logger from '../services/logger';
const router = express.Router();

const toApplication = (request) => {
    const { username, fullname } = request;
    const timestamp = new Date().toISOString();
    return {
        id: uuidv4(),
        username,
        fullname,
        form: JSON.stringify(request),
        timestamp,
        country: 'Mozambique',
        status: 'submitted'
    };
}

router.get('/', requiresAuth(), (req, res) => {
    logger.info('/apply...');
    res.render('apply', { title: 'Apply', user: req.oidc.user });
});

router.post('/', async (req, res) => {

    logger.info('post apply...');
    logger.info('>>> user: ', req.oidc.user);
    const user = req.oidc.user;

    try {
        const application = toApplication({ ...req.body, username: user.email });

        // save the application
        saveApplication(application);

        // send the confirmation email
        await mailer.send(user.email, 'Volare - Application received', `We have an application for ${application.fullname}`);

        res.redirect(`submitted?fullname=${application.fullname}&id=${application.id}`);
    } catch (error) {
        res.redirect('error');
    }
});

export default router;
