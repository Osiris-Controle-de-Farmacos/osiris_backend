import { Request, Response } from 'express';
import db from '../database/';
export default class PrescriptionController {

  async index(req: Request, res: Response) {
    try {
      const prescriptions = await db('prescription')
        .join('user', 'prescription.idDoctor', 'user.id')
        .select(
          'prescription.date',
          'prescription.pacient',
          'prescription.status',
          'user.name',
        );
      return res.status(200).json(prescriptions);
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: 'Houve um erro ao listar as receitas.'
      });
    }
  }
  
}