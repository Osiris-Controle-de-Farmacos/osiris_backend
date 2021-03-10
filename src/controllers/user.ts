import { Request, Response } from 'express';
import db from '../database/';
export default class UsersController {

  async index(req: Request, res: Response) {
    try {
      const users = await db('user')
        .join('userType', 'user.idUserType', 'userType.id')
        .select(
          'user.id',
          'user.name',
          'user.login',
          'user.password',
          'userType.name as userType',
        );
      return res.status(200).json(users);
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: 'Houve um erro ao listar os usuários.'
      });
    }
  }
  async show(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const users = await db('user')
        .join('userType', 'user.idUserType', 'userType.id')
        .select(
          'user.id',
          'user.name',
          'user.login',
          'user.password',
          'userType.name as userType',
        )
        .where('user.id', id)
        ;
      return res.status(200).json(users);
    } catch (err) {
      console.log(err);
      return res.status(400).json({
        error: 'Houve um erro ao listar o usuário.'
      });
    }
  }
  async create(req: Request, res: Response) {
    const trxProvider = await db.transactionProvider();
    const trx = await trxProvider();

    try {
      const {
        name,
        login,
        password,
        idUserType,
      } = req.body;

      const user = await trx('user').insert({ name, login, password, idUserType});

      await trx.commit();
      return res.status(201).json({
        msg : "Usuário cadastrado com sucesso."
      });

    } catch (err) {
      await trx.rollback();
      return res.status(400).json({
        error: 'Erro ao cadastrar usuário.'
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
        login,
        password,
        idUserType,
      } = req.body;
      
      const user = {
        id: id,
        name: name,
        login: login,
        password: password,
        idUserType: idUserType,
      }

      await trx('user').update(user).where('id', id);

      await trx.commit();

      return res.status(201).json({
        msg : "Usuário atualizado com sucesso."
      });

    } catch (error) {
      console.log(error);
      await trx.rollback();
      return res.status(400).json({
        error: 'Erro ao atualizar usuário.'
      });
    }
  }
  async delete(req: Request, res: Response) {
    const trxProvider = await db.transactionProvider();
    const trx = await trxProvider();
    try {
      const { id } = req.params;
      await trx('user').delete().where('id',id);
      await trx.commit();

      return res.status(201).json({
        msg : "Usuário atualizado com sucesso."
      });
    } catch (error) {
      await trx.rollback();
      return res.status(400).json({
        error: 'Erro ao remover usuário.'
      });
    }
  }
}
