exports.up = function (knex) {
	return knex.schema
		.createTable("userType", function (table) {
			table.increments("id");
			table.string("name", 255).notNullable();
		})
		.createTable("medicine", function (table) {
			table.increments("id");
			table.string("name", 255).notNullable();
			table.string("description", 255);
		})
		.createTable("storage", function (table) {
			table.increments("id");
			table.integer("amount").notNullable();
			table.integer("idMedicine").unsigned();
			table.foreign("idMedicine").references("medicine.id");
		})
		.createTable("user", function (table) {
			table.increments("id");
			table.string("name", 255).notNullable();
			table.string("login", 11).notNullable();
			table.string("password", 255).notNullable();
			table.integer("idUserType").unsigned();
			table.foreign("idUserType").references("userType.id");
		})
		.createTable("prescription", function (table) {
			table.increments("id");
			table.date("date").notNullable();
			table.string("pacient", 255).notNullable();
			table.integer("status").unsigned().notNullable();
			table.integer("idDoctor").unsigned();
			table.foreign("idDoctor").references("user.id");
			table.integer("idMedicine").unsigned();
			table.foreign("idMedicine").references("medicine.id");
		})
		.createTable("prescriptionMedicine", function (table) {
			table.increments("id");
			table.string("dosage").notNullable();
			table.integer("idPrescription").unsigned();
			table.foreign("idPrescription").references("prescription.id");
			table.integer("idMedicine").unsigned();
			table.foreign("idMedicine").references("medicine.id");
		});
};

exports.down = function (knex) {
	return knex.schema
		.dropTable("prescriptionMedicine")
		.dropTable("prescription")
		.dropTable("user")
		.dropTable("storage")
		.dropTable("medicine")
		.dropTable("userType");
};

exports.config = { transaction: false };
