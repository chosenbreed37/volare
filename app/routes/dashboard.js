import express from 'express';
import { requiresAuth } from 'express-openid-connect';

const router = express.Router();

router.get('/', requiresAuth(), (req, res) => {
    res.render('dashboard', { title: 'Dashboard', user: req.oidc.user });
});

export default router;
