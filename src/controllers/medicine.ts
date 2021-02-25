import { Request, Response } from "express";
import db from "../database/";
export default class MedicineController {
	// Retorna todas as medicações
	async index(req: Request, res: Response) {
		try {
			const medicines = await db("medicine")
				.join("storage", "medicine.id", "storage.idMedicine")
				.select(
					"medicine.id",
					"medicine.name",
					"medicine.description",
					"storage.amount"
				);
			return res.status(200).json(medicines);
		} catch (err) {
			console.log(err);
			return res.status(400).json({
				error: "Houve um erro ao listar as medicações.",
			});
		}
	}
	async show(req: Request, res: Response) {
		const { id } = req.params;

		try {
			const medicine = await db("medicine")
				.join("storage", "medicine.id", "storage.idMedicine")
				.where("medicine.id", id)
				.select(
					"medicine.id",
					"medicine.name",
					"medicine.description",
					"storage.amount"
				);
			return res.status(200).json(medicine[0]);
		} catch (err) {
			console.log(err);
			return res.status(400).json({
				error: "Houve um erro ao listar a medicação.",
			});
		}
	}
	async create(req: Request, res: Response) {
		const trxProvider = db.transactionProvider();
		const trx = await trxProvider();

		try {
			const { name, description, initialAmount } = req.body;

			const medicine = await trx("medicine").insert({ name, description });

			const storage = {
				amount: initialAmount,
				idMedicine: medicine[0],
			};

			await trx("storage").insert(storage);

			await trx.commit();
			return res.status(201).json({
				msg: "Medicação cadastrada com sucesso",
			});
		} catch (err) {
			await trx.rollback();
			return res.status(400).json({
				error: "Erro ao cadastrar cliente.",
			});
		}
	}
	async update(req: Request, res: Response) {
		const trxProvider = await db.transactionProvider();
		const trx = await trxProvider();

		try {
			const { id, name, description, amount } = req.body;

			const medicine = {
				id: id,
				name: name,
				description: description,
			};
			const storage = {
				amount: amount,
				idMedicine: id,
			};

			await trx("medicine").update(medicine).where("id", id);
			if (amount !== null) {
				await trx("storage").update(storage).where("idMedicine", id);
			}
			await trx.commit();

			return res.status(201).json({
				msg: "Medicação atualizada com sucesso.",
			});
		} catch (error) {
			console.log(error);
			await trx.rollback();
			return res.status(400).json({
				error: "Erro ao atualizar medicação.",
			});
		}
	}
	async delete(req: Request, res: Response) {
		const trxProvider = await db.transactionProvider();
		const trx = await trxProvider();
		try {
			const { id } = req.params;
			await trx("storage").delete().where("idMedicine", id);
			await trx("medicine").delete().where("id", id);
			await trx.commit();

			res.status(201).json({
				msg: "Medicação removida com sucesso.",
			});
		} catch (error) {
			await trx.rollback();
			res.status(400).json({
				error: "Erro ao remover medicação.",
			});
		}
	}
}
