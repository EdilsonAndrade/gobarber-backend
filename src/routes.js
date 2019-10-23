import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

// controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileUploadController from './app/controllers/FileUploadController';

import authMiddleWare from './app/middlewares/auth';

const routes = new Router();
const fileUpload = multer(multerConfig);
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// colocando aqui o middleware , vai ser aplicado apenas para as rotas abaixo dele
// esta acima não passara pelo middleware
routes.use(authMiddleWare);

routes.put('/users', UserController.update);

routes.post('/files', fileUpload.single('file'), FileUploadController.store);

export default routes;
