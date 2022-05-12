import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { requiresAuth } from 'express-openid-connect';
import { saveApplication } from '../services/datastore';

import logger  from '../services/logger';
const router = express.Router();

const toApplication = (request) => {
    const { username, visatype, firstname, lastname } = request;

    return {
        id: uuidv4(),
        username,
        visatype,
        firstname,
        lastname
    };
}

router.get('/', requiresAuth(), (req, res) => {
    logger.info('/apply...');
    res.render('apply', { title: 'Apply', user: req.oidc.user });
});

router.post('/', (req, res) => {
    logger.info('post apply...');
    const user = req.oidc.user;
    logger.info('>>> request.body: ', req.body);
    const application = toApplication({...req.body, username: user.email});
    logger.info(`application: ${JSON.stringify(application)}`);
    
    saveApplication(application);

    res.redirect('submitted');
});

export default router;
