require("dotenv").config();
const { Router } = require("express");
const cloudinary = require("cloudinary");
const fse = require("fs-extra");
const CardsDb = require("../db-connection");
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = Router();
const tableName = "card_images";
const db = new CardsDb(tableName);

router.get("/card-images/:card_id", async (req, res) => {
	try {
		const card_id = req.params.card_id;
		const query = `SELECT * FROM ${tableName} WHERE card_id=?`;
		const result = await db.safeQuery(query, [card_id]);

		res.send(result);
	} catch (error) {
		res.json({ error: error.toString() });
	}
});

router.post("/card-images/:cards_id", async (req, res) => {
	try {
		const cardId = req.params.cards_id;
		const image = req.files[0];
		const fileUrl = await cloudinary.v2.uploader.upload(image.path);
		await fse.unlink(image.path);

		const query = `INSERT INTO ${tableName} (card_id, image, image_id) VALUES (?, ?, ?)`;
		await db.safeQuery(query, [cardId, fileUrl.url, fileUrl.public_id]);
		res.send({ message: "success" });
	} catch (error) {
		res.json({ error: error?.toString() });
	}
});

router.delete("/card-images/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const image_id = req.body["image-id"];
		await cloudinary.v2.uploader.destroy(image_id);
		const query = `DELETE FROM ${tableName} WHERE id=?`;
		const result = await db.safeQuery(query, [id]);
		return res.send(result);
	} catch (error) {
		res.json({ error: error.toString() });
	}
});

module.exports = router;
