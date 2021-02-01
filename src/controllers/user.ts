import { Request, Response } from 'express';
import knex from '../database/';
export default class ClientsController {
  async index(req: Request, res: Response) {
    const users = await knex('user').select('*');
    return res.status(200).json(users);
  }
}