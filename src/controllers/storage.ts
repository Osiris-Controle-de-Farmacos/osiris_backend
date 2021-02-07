import { Request, Response } from 'express';
import db from '../database/';

export default class StorageController {
  // Retorna todas as medicações
  async index(req: Request, res: Response) {
    try {
      const storage = await
        db('storage')
          .join('medicine', 'storage.idMedicine', 'medicine.id')
          .select('medicine.name',
            'storage.amount');
      return res.status(200).json(storage);
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: 'Houve um erro ao listar o estoque.'
      });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const storage = await db('storage').join('medicine', 'storage.idMedicine', 'medicine.id')
        .select('medicine.name',
          'storage.amount')
        .where('medicine.id', id);
      return res.status(200).json(storage);
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: 'Houve um erro ao listar o estoque da medicação.'
      });
    }
  }
}