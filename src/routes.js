import { Router } from 'express';

// controllers
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleWare from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// colocando aqui o middleware , vai ser aplicado apenas para as rotas abaixo dele
// esta acima não passara pelo middleware
routes.use(authMiddleWare);

routes.put('/users', UserController.update);

export default routes;
