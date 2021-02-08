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

  async show(req: Request, res: Response) {
    try {
      const id = req.params.id;
      let prescription = await db('prescription')
        .join('user', 'prescription.idDoctor', 'user.id')
        .select(
          'prescription.id',
          'prescription.date',
          'prescription.pacient',
          'prescription.status',
          'user.name',
        );

      const medicines = await db('prescriptionMedicine')
        .join('medicine', 'prescriptionMedicine.idMedicine', 'medicine.id')
        .where('prescriptionMedicine.idPrescription', 1)
        .select(
          'medicine.id',
          'medicine.name',
          'medicine.description',
          'prescriptionMedicine.dosage'
        );

      prescription = { prescription, medicines };

      return res.status(200).json(prescription);
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: 'Houve um erro ao listar a receita.'
      });
    }
  }

  async create(req: Request, res: Response) {
    const trxProvider = await db.transactionProvider();
    const trx = await trxProvider();
    try {
      const prescription = await trx('prescription').insert(req.body.prescription);
      const prescriptionId = prescription[0];
      for (const medicine of req.body.medicines) {
        const prescriptionMedicine = {
          dosage: medicine.dosage,
          idPrescription: prescriptionId,
          idMedicine: medicine.id
        }
        await trx('prescriptionMedicine').insert(prescriptionMedicine);
        await trx.commit();
        return res.status(201).json({
          msg: "Receita cadastrada com sucesso"
        });
      }

    } catch (err) {
      console.log(err);
      await trx.rollback();
      return res.status(400).json({
        error: 'Houve um erro ao criar a receita.'
      });
    }
  }

  async update(req: Request, res: Response) {
    const trxProvider = await db.transactionProvider();
    const trx = await trxProvider();
    try {
      await trx('prescription').update(req.body.prescription)
        .where('id', req.body.prescription.id);
      await trx.commit();
      return res.status(201).json({
        msg: "Receita atualizada com sucesso."
      });
    } catch (err) {
      await trx.rollback();
      return res.status(400).json({
        error: 'Houve um erro ao atualizar a receita.'
      });
    }
  }

  async delete(req: Request, res: Response) {
    const trxProvider = await db.transactionProvider();
    const trx = await trxProvider();
    try {
      const { id } = req.params;
      await trx('prescriptionMedicine').delete().where('idPrescription', id);
      await trx('prescription').delete().where('id', id);
      await trx.commit();
      res.status(204).json({
        msg: "Medicação removida com sucesso."
      });
    } catch (err) {
      await trx.rollback();
      return res.status(400).json({
        error: 'Houve um erro ao deletar a receita.'
      });
    }
  }
}