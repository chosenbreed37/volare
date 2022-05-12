import db from '../db';
import logger from './logger';

const resultHandler = (application) => {
   return(error) => {
       if (error) {
           logger.error(`error saving application ${application.id}: error: ${error}`);
       } else {
           logger.info(`save application ${application.id} succeeded`);
       }
   }
}
const saveApplication = (application) => {
    logger.info(`start:save application ${application.id}`);
    logger.info(JSON.stringify(application));
    db.run("INSERT INTO applications (id, username, firstname, lastname) values ($id, $username, $firstname, $lastname)", {
        $id: application.id,
        $username: application.username,
        $firstname: application.firstname,
        $lastname: application.lastname
    }, resultHandler);
    logger.info(`end:save application ${application.id}`);
}

export {
    saveApplication
}