import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('submitted', { title: 'Submitted', user: req.oidc.user });
});

export default router;
