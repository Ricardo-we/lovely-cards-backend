const path = require("path");
const express = require("express");
const multer = require("multer");
const cors = require("cors");
// const morgan = require('morgan');
const CardsDb = require("./src/db-connection");
const fs = require("fs");

const app = express();
// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(morgan('dev'));
const storage = multer.diskStorage({
	destination: path.join(__dirname, "uploads/cards"),
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});
app.use(multer({ storage }).any());

// routes
app.use(require("./src/routes/users.js"));
app.use(require("./src/routes/cards.js"));
app.use(require("./src/routes/card-contents.js"));
app.use(require("./src/routes/card-images.js"));
app.get("/", (req, res) => {
	res.send("Welcome to lovely cards API, try with other url");
});

app.post("/db/create-all", async (req, res) => {
	try {
		const db = new CardsDb("");
		const query = fs
			.readFileSync(path.join(__dirname, "src/sql/lovely-cards.sql"))
			.toString();
		
		// db.safeQuery(`ALTER TABLE cards MODIFY COLUMN music TEXT NULL`)
		// await db.safeQuery(`
        //     ALTER TABLE card_content ADD \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP;
        //     ALTER TABLE card_content ADD \`updated_at\` DATETIME ON UPDATE CURRENT_TIMESTAMP;
        //     ALTER TABLE card_images ADD \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP;
        //     ALTER TABLE card_images ADD \`updated_at\` DATETIME ON UPDATE CURRENT_TIMESTAMP;
        // `);
		// await db.safeQuery(`ALTER TABLE \`card_content\` ADD \`card_color\` VARCHAR(255) NOT NULL DEFAULT '#ff0000';`);
        // await db.safeQuery(query);
		return res.send({ message: "Success" });
	} catch (error) {
		return res.send({ error: error.toString() });
	}
});

app.listen(process.env.PORT || 5000);
