import { Request, Response } from "express";
import db from "../database/";

export default class PrescriptionController {
	async index(req: Request, res: Response) {
		try {
			const prescriptions = await db("prescription")
				.join("user", "prescription.idDoctor", "user.id")
				.select(
					"prescription.id",
					"prescription.date",
					"prescription.pacient",
					"prescription.status",
					"user.name"
				)
				.orderByRaw("prescription.id DESC");
			for (let prescription of prescriptions) {
				const medicines = await db("prescriptionMedicine")
					.join("medicine", "prescriptionMedicine.idMedicine", "medicine.id")
					.where("prescriptionMedicine.idPrescription", prescription.id)
					.select(
						"medicine.id",
						"medicine.name",
						"medicine.description",
						"prescriptionMedicine.dosage"
					);
				prescription.medicines = medicines;
			}
			console.log(prescriptions);
			return res.status(200).json(prescriptions);
		} catch (err) {
			console.log(err);
			return res.status(400).json({
				error: "Houve um erro ao listar as receitas.",
			});
		}
	}

	async show(req: Request, res: Response) {
		try {
			const id = req.params.id;
			let prescription = await db("prescription")
				.join("user", "prescription.idDoctor", "user.id")
				.where("prescription.id", id)
				.select(
					"prescription.id",
					"prescription.date",
					"prescription.pacient",
					"prescription.status",
					"user.name"
				);

			const medicines = await db("prescriptionMedicine")
				.join("medicine", "prescriptionMedicine.idMedicine", "medicine.id")
				.join("storage", "medicine.id", "storage.idMedicine")
				.where("prescriptionMedicine.idPrescription", id)
				.select(
					"medicine.id",
					"medicine.name",
					"storage.amount",
					"medicine.description",
					"prescriptionMedicine.dosage"
				);

			const prescriptionJSON = { ...prescription[0], medicines };
			return res.status(200).json(prescriptionJSON);
		} catch (err) {
			console.log(err);
			return res.status(400).json({
				error: "Houve um erro ao listar a receita.",
			});
		}
	}

	async create(req: Request, res: Response) {
		const trxProvider = await db.transactionProvider();
		const trx = await trxProvider();
		try {
			const prescription = await trx("prescription").insert(
				req.body.prescription
			);
			const prescriptionId = prescription[0];
			for (const medicine of req.body.medicines) {
				const prescriptionMedicine = {
					dosage: medicine.dosage,
					idPrescription: prescriptionId,
					idMedicine: medicine.id,
				};
				await trx("prescriptionMedicine").insert(prescriptionMedicine);
			}
			await trx.commit();
			return res.status(201).json({
				msg: "Receita cadastrada com sucesso",
				id: prescriptionId,
			});
		} catch (err) {
			console.log(err);
			await trx.rollback();
			return res.status(400).json({
				error: "Houve um erro ao criar a receita.",
			});
		}
	}

	async update(req: Request, res: Response) {
		const trxProvider = db.transactionProvider();
		const trx = await trxProvider();
		try {
			await trx("prescription").update(req.body).where("id", req.body.id);
			await trx.commit();
			return res.status(201).json({
				msg: "Receita atualizada com sucesso.",
			});
		} catch (err) {
			await trx.rollback();
			console.log(err);
			return res.status(400).json({
				error: "Houve um erro ao atualizar a receita.",
			});
		}
	}

	async delete(req: Request, res: Response) {
		const trxProvider = await db.transactionProvider();
		const trx = await trxProvider();
		try {
			const { id } = req.params;
			await trx("prescriptionMedicine").delete().where("idPrescription", id);
			await trx("prescription").delete().where("id", id);
			await trx.commit();
			res.status(204).json({
				msg: "Medicação removida com sucesso.",
			});
		} catch (err) {
			await trx.rollback();
			return res.status(400).json({
				error: "Houve um erro ao deletar a receita.",
			});
		}
	}
}
