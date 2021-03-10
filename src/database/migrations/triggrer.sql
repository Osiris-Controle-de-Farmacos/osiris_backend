DELIMITER $$
CREATE TRIGGER AU_STATUS_UPDATE_STORAGE AFTER UPDATE
ON prescription
FOR EACH ROW
BEGIN
DECLARE finished INT DEFAULT 0;
		DECLARE medicineId int default 0;
		DECLARE curMedicines
			CURSOR 
				FOR 
					SELECT idMedicine FROM prescriptionMedicine  where idPrescription = old.id;
		DECLARE CONTINUE HANDLER 
			FOR NOT FOUND SET finished = 1;
            
	if new.status != old.status and new.status = 1 THEN
		OPEN curMedicines;
		updateStorage: LOOP
			FETCH curMedicines INTO medicineId;
			IF finished = 1 THEN 
					LEAVE updateStorage;
			END IF;
			UPDATE `storage` SET AMOUNT =  AMOUNT - 1 WHERE storage.idMedicine = medicineId;
		END LOOP updateStorage;
		close curMedicines;
	end if;
END$$
DELIMITER ;
