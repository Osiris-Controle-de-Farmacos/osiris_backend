import express from 'express';
import UserControllers from './controllers/user';

const userControllers = new UserControllers();
const routes = express.Router();

routes.get('/', userControllers.index);

export default routes;