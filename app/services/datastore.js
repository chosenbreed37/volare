import db from '../db';
import logger from './logger';

const resultHandler = (application) => {
    return (error) => {
        if (error) {
            logger.error(`error saving application ${application.id}: error: ${error}`);
        } else {
            logger.info(`save application ${application.id} succeeded`);
        }
    }
}
const saveApplication = (application) => {
    logger.info(`start:save application ${application.id}`);

    db.run('INSERT INTO applications (id, username, form, timestamp, sequence_number, status) values ($id, $username, $form, $timestamp, $sequence_number, $status)', {
        $id: application.id,
        $username: application.username,
        $form: application.form,
        $timestamp: application.timestamp,
        $sequence_number: 1,
        $status: application.status
    }, resultHandler(application));

    logger.info(`end:save application ${application.id}`);
}

const getApplication = (id) => {
    return new Promise((resolve, reject) => {

        const query = 'select * from applications where id = ?';
        db.all(query, [id], (error, rows) => {
            if (error) {
                logger.error(`Error retrieving application ${id}. ${error}`);
                reject(error);
            } else {
                logger.debug('>>> applications: ', JSON.stringify(rows));
                resolve(rows && rows[0] || null);
            }
        })
    });
}

const getApplications = (username) => {
    return new Promise((resolve, reject) => {

        const query = 'select * from applications where username = ?';
        db.all(query, [username], (error, rows) => {
            if (error) {
                logger.error(`Error retrieving applications for ${username}. ${error}`);
                reject(error);
            } else {
                logger.debug('>>> applications: ', JSON.stringify(rows));
                resolve(rows || []);
            }
        })
    });
}

const getAllApplications = (username) => {
    return new Promise((resolve, reject) => {
        const query = 'select * from applications';
        db.all(query, [username], (error, rows) => {
            if (error) {
                logger.error(`Error retrieving applications. ${error}`);
                reject(error);
            } else {
                resolve(rows || []);
            }
        })
    });
}

export {
    saveApplication,
    getApplications,
    getAllApplications,
    getApplication
}