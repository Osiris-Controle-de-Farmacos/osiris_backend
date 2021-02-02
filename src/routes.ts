import express from 'express';

// Imports dos controllers
import UserControllers from './controllers/user';
import MedicineControllers from './controllers/medicine';

// Estanciamento dos controllers
const userControllers = new UserControllers();
const medicineControllers = new MedicineControllers();

const routes = express.Router();

// Criação das rotas para executar cada controller

//Users
routes.get('/', userControllers.index);

// Medicines
routes.get('/medicines', medicineControllers.index);
routes.get('/medicine/:id', medicineControllers.show);
routes.post('/medicine', medicineControllers.create);
routes.put('/medicine', medicineControllers.update);
routes.delete('/medicine/:id', medicineControllers.delete);

export default routes;