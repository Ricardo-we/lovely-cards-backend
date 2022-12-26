require("dotenv").config();
const { Router } = require("express");
const cloudinary = require("cloudinary");
const fse = require("fs-extra");
const CardsDb = require("../db-connection");
const { compareTwoDates } = require("../utils/date.utils");
const { getCloudinaryLinkId } = require("../utils/cloudinary.utils");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = Router();
const db = new CardsDb("cards");
const tableName = "cards";

// ROUTES
router.get("/card/:cardID", async (req, res) => {
	try {
		const cardID = req.params.cardID;
		const query = `SELECT * FROM ${tableName} WHERE id=?`;
		const result = await db.safeQuery(query, [cardID]);
		res.send(result);
	} catch (error) {
		res.json({ error: error.toString() });
	}
});

router.get("/full-card/:cardID", async (req, res) => {
	try {
		const { cardID } = req.params;
		const query = ` 
            SELECT * FROM cards WHERE id = ?;
            SELECT * FROM card_content WHERE card_id = ?; 
            SELECT * FROM card_images WHERE card_id = ?;
        `;
		const result = await db.safeQuery(query, [cardID, cardID, cardID]);
		const card = result[0][0];
		const card_contents = result[1];
		const card_images = result[2];
		if (!card || !result)
			return res.status(404).send({ message: "Card not found" });

		const formattedResult = {
			...card,
			mixedCards: [...card_images, ...card_contents].sort(
				(current, prev) =>
					compareTwoDates(current.created_at, prev.created_at),
			),
		};

		return res.send(formattedResult);
	} catch (error) {
		res.json({ error: error.toString() });
	}
});

router.get("/manage-cards/:userid", async (req, res) => {
	try {
		const userId = req.params.userid;
		const query = `SELECT * FROM ${tableName} WHERE user_id=?`;
		const result = await db.safeQuery(query, [userId]);

		res.send(result);
	} catch (error) {
		res.json({ error: error.toString() });
	}
});

router.post("/manage-cards/:user_id", async (req, res) => {
	try {
		const userId = req.params.user_id;
		const cardName = req.body["card-name"];
		const music = req.files[0];
		const uploadedFile = await cloudinary.v2.uploader.upload(music.path, {
			resource_type: "raw",
		});
		await fse.unlink(music.path);
		const query = `INSERT INTO ${tableName} (user_id, music, card_name) VALUES (?, ?, ?)`;
		await db.safeQuery(query, [userId, uploadedFile.url, cardName]);

		return res.send({ message: "success" });
	} catch (error) {
		res.json({ error: error.toString() });
	}
});

router.put("/manage-cards/:id", async (req, res) => {
	try {
		const cardName = req.body["card-name"];
		const id = req.params.id;

		const sqlBindings = [cardName];

		let query = `UPDATE ${tableName} SET card_name=?`;

		if (req.files[0]) {
			try {
				const file = req.files[0];
				const musicUrl = await cloudinary.v2.uploader.upload(
					file.path,
					{ resource_type: "raw" },
				);
				await fse.unlink(file.path);
				query += `, music=?`;
				sqlBindings.push(musicUrl.url);
			} catch (err) {
				throw new Error(err.toString());
			}
		}
		
		sqlBindings.push(id);

		query += ` WHERE id=?`;
		db.safeQuery(query, sqlBindings);

		db.runQuery(query, (err, result) => {
			if (err) throw new Error(err.toString());
			res.send(result);
		});
	} catch (error) {
		res.json({ error: error.toString() });
	}
});

router.delete("/manage-cards/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const query = `DELETE FROM ${tableName} WHERE id = ?`;
		const allImages = await db.safeQuery(
			"SELECT * FROM card_images WHERE card_id = ?",
			[id],
		);
		const card = (await db.safeQuery(`SELECT * FROM ${tableName} WHERE id = ?`, [id]))[0];

		await Promise.all(
			allImages?.map((image) =>
				cloudinary.v2.uploader.destroy(image.image_id),
			),
		);
		const [public_id, extension] = getCloudinaryLinkId(card.music);
		console.log(public_id, extension)
		await cloudinary.v2.uploader.destroy(public_id)
		await db.safeQuery(query, [id]);
		res.json({ message: "success" });
	} catch (error) {
		res.json(error);
	}
});

module.exports = router;
