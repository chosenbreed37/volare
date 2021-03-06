import 'dotenv/config';
import express from 'express';
import { requiresAuth } from 'express-openid-connect';
import { getApplications } from '../services/datastore';
import logger from '../services/logger';

const router = express.Router();
const OFFLINE = process.env.OFFLINE || false;

(() => {
    if (OFFLINE) {
        router.get('/', async (req, res) => {
            const username = 'chosenbreed@gmail.com';
            logger.info(`get applications for ${username}`);
            const applications = await getApplications(username);
            logger.info('>>> applications: ', JSON.stringify(applications));
            logger.info(JSON.stringify(applications.map(x => ({id: x.id, username: x.username}))));
            res.render('dashboard', { title: 'Dashboard', applications });
        });        
    } else {
        router.get('/', requiresAuth(), async (req, res) => {
            const username = req.oidc.user && req.oidc.user.email;
            logger.info(`get applications for ${username}`);
            const applications = await getApplications('chosenbreed@gmail.com');
            logger.info('>>> applications: ', JSON.stringify(applications));
            logger.info(JSON.stringify(applications.map(x => ({id: x.id, username: x.username}))));
            res.render('dashboard', { title: 'Dashboard', user: req.oidc.user, applications });
        });            }
})();

export default router;
