import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

// controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileUploadController from './app/controllers/FileUploadController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';

import authenticationMiddleware from './app/middlewares/auth';

const routes = new Router();
const fileUpload = multer(multerConfig);
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// colocando aqui o middleware , vai ser aplicado apenas para as rotas abaixo dele
// esta acima não passara pelo middleware
routes.use(authenticationMiddleware);

routes.put('/users', UserController.update);
routes.post('/files', fileUpload.single('file'), FileUploadController.store);
routes.get('/providers', ProviderController.index);
routes.post('/appointments', AppointmentController.store);
routes.get('/appointments', AppointmentController.index);
routes.get('/schedule', ScheduleController.index);
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);
routes.delete('/appointments/:id', AppointmentController.delete);

export default routes;
