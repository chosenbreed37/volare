import express from 'express';
import { requiresAuth } from 'express-openid-connect';
import { getAllApplications, getApplication } from '../services/datastore';

import logger from '../services/logger';

const router = express.Router();

const mapStatus = (status) => {
    switch (status) {
        case 'submitted':
            return 'Submitted';
        default:
            return 'Unknown';    
    }
}

const Months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const formatMonth = month => Months[month];

const dateToString = input => {
    const date = new Date(input);
    return date && `${date.getDate()} ${formatMonth(date.getMonth())} ${date.getFullYear()}`;
}

const toObject = (form) => {
    try {
      return JSON.parse(form);
    } catch (error) {
      console.log('>>> Error: ', error);
      return {};
    }
}

export const toSummary = (application) => {
    const {id, country, status, application_date, form} = application;
    
    const details = toObject(form);

    try {
      const details = JSON.parse(form);
      return {
        id,
        fullname: details.fullname,
        nationality: details.nationality,
        country,
        date: dateToString(application_date),
        status: mapStatus(status)
      };

    } catch (error) {
      console.log('>>> Error: ', error);
      return {};
    }
}

router.get('/', /*requiresAuth(),*/ async (req, res) => {
    logger.info('/applications');
    const applications = await getAllApplications();
    const dtos = applications.map(toSummary);
    //    res.render('applications', { title: 'Applications', user: req.oidc.user });
    res.render('applications', { title: 'Applications', applications: dtos });
});

router.get('/:id', /*requiresAuth(),*/ async (req, res) => {
    logger.info('/applications/:id');
    const { id } = req.params;
    const application = await getApplication(id);
    const dto = toSummary(application);
    //    res.render('applications', { title: 'Applications', user: req.oidc.user });
    res.render('application', { title: 'Application', application: dto });
});

export default router;