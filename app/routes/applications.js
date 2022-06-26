import express from 'express';
import { requiresAuth } from 'express-openid-connect';

import logger from '../services/logger';

const router = express.Router();

router.get('/', requiresAuth(), (req, res) => {
    logger.info('/applications');
    res.render('applications', { title: 'Applications', user: req.oidc.user });
});

export default router;