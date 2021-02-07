import { Request, Response } from 'express';
import db from '../database/';
export default class UsersTypeController {
  async index(req: Request, res: Response) {
    try {
      const usersType = await db('userType').select('*');
      return res.status(200).json(usersType);
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: 'Houve um erro ao listar os tipos de usuários.'
      });
    }
  }
  async show(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const usersType = await db('userType')
        .select('*')
        .where('userType.id', id)
        ;
      return res.status(200).json(usersType);
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: 'Houve um erro ao listar o tipo de usuário.'
      });
    }
  }
  async create(req: Request, res: Response) {
    const trxProvider = await db.transactionProvider();
    const trx = await trxProvider();

    try {
      const {
        name,
      } = req.body;

      await trx('userType').insert({ name});

      await trx.commit();
      return res.status(201).json({
        msg : "Tipo de usuário cadastrado com sucesso."
      });

    } catch (err) {
      await trx.rollback();
      return res.status(400).json({
        error: 'Erro ao cadastrar tipo de usuário.'
      });
    }
  }
  async update(req: Request, res: Response) {
    const trxProvider = await db.transactionProvider();
    const trx = await trxProvider();

    try {
      const {
        id,
        name,
      } = req.body;
      
      const userType = {
        id: id,
        name: name,
      }

      await trx('userType').update(userType).where('id', id);

      await trx.commit();

      return res.status(201).json({
        msg : "Tipo de usuário atualizado com sucesso."
      });

    } catch (error) {
      console.log(error);
      await trx.rollback();
      return res.status(400).json({
        error: 'Erro ao atualizar tipo de usuário.'
      });
    }
  }
  async delete(req: Request, res: Response) {
    const trxProvider = await db.transactionProvider();
    const trx = await trxProvider();
    try {
      const { id } = req.params;
      await trx('userType').delete().where('id',id);
      await trx.commit();

      return res.status(201).json({
        msg : "Tipo de usuário removido com sucesso."
      });
    } catch (error) {
      await trx.rollback();
      return res.status(400).json({
        error: 'Erro ao remover o tipo de usuário.'
      });
    }
  }
}