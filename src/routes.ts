import express from 'express';

// Imports dos controllers
import UserControllers from './controllers/user';
import MedicineControllers from './controllers/medicine';
import StorageControllers from './controllers/storage';
import UserTypeControllers from './controllers/userType';
import PrescriptionControllers from './controllers/prescription';

// Estanciamento dos controllers
const userControllers = new UserControllers();
const medicineControllers = new MedicineControllers();
const storageControllers = new StorageControllers();
const userTypeControllers = new UserTypeControllers();
const prescriptionControllers = new PrescriptionControllers();

const routes = express.Router();

// Criação das rotas para executar cada controller

//Users
routes.get('/users', userControllers.index);
routes.get('/user/:id', userControllers.show);
routes.post('/user', userControllers.create);
routes.put('/user', userControllers.update);
routes.delete('/user/:id', userControllers.delete);


// Medicines
routes.get('/medicines', medicineControllers.index);
routes.get('/medicine/:id', medicineControllers.show);
routes.post('/medicine', medicineControllers.create);
routes.put('/medicine', medicineControllers.update);
routes.delete('/medicine/:id', medicineControllers.delete);

//Storage
routes.get('/storage', storageControllers.index);
routes.get('/storage/:id', storageControllers.show);

//UserType
routes.get('/usersType', userTypeControllers.index);
routes.get('/userType/:id', userTypeControllers.show);
routes.post('/userType', userTypeControllers.create);
routes.put('/userType', userTypeControllers.update);
routes.delete('/userType/:id', userTypeControllers.delete);

//Prescription
routes.get('/prescriptions', prescriptionControllers.index);
export default routes;