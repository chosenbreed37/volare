import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requiresAuth } from 'express-openid-connect';
import { saveApplication } from '../services/datastore';

import logger  from '../services/logger';
const router = express.Router();

const toApplication = (request) => {
    const { username } = request;
    const timestamp = new Date().toISOString();
    return {
        id: uuidv4(),
        username,
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

router.post('/', (req, res) => {
    logger.info('post apply...');
    logger.info('>>> user: ', req.oidc.user);
    const user = req.oidc.user;

    const application = toApplication({...req.body, username: user.email});
    
    saveApplication(application);

    res.redirect('submitted');
});

export default router;
