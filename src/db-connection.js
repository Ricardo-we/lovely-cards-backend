const mysql = require("mysql");
require("dotenv").config();

class CardsDb {
	constructor(tableName) {
		this.tableName = tableName;

		const databaseName = process.env.DB_NAME;
		this.conn = mysql.createPool({
			host:process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: databaseName,
			multipleStatements: true,
		});

	}

	runQuery(query, callback) {
		this.conn.query(query, callback);
	}

	safeQuery(query, values) {
		return new Promise((resolve, reject) => {
			this.conn.query(query, values, (err, result) => {
                if(err) reject(err);
                else resolve(result);
            });
		});
	}

	insert(values, callback) {
		let query = `INSERT INTO cards(\`id\`, \`user_id\`, \`title\`, \`content\`, \`background-image\`, \`first-image\`, \`second-image\`, \`music\`) VALUES (null, ${values.userId}, '${values.title}', '${values.content}', '${values.backgroundImage}', '${values.firstImage}', '${values.secondImage}', '${values.music}')`;
		this.conn.query(query, callback);
	}

	getAll(callback) {
		let query = `SELECT * FROM ${this.tableName}`;

		this.conn.query(query, callback);
	}

	update(
		id,
		{ title, content, backgroundImage, firstImage, secondImage, music },
		callback,
	) {
		let query = `UPDATE ${this.tableName} SET \`title\`=${title}, \`content\`=${content}, \`background-image\`=${backgroundImage}, \`first-image\`=${firstImage}, \`second-image\`=${secondImage}, \`music\`=${music} WHERE id=${id}`;
		this.conn.query(query, callback);
	}

	remove(id, res) {
		let query = `DELETE FROM ${this.tableName} WHERE id=${id}`;
		this.conn.query(query, (err, result) => {
			if (err) throw err;
			res.send(result);
		});
	}
}

module.exports = CardsDb;
