const mysql = require('mysql');

class CardsDb{
    constructor(tableName){
        this.tableName = tableName;
        
        const databaseName = 'bjqemgrzxwvqn5t8maxt';
        this.conn = mysql.createPool({
            host: 'bjqemgrzxwvqn5t8maxt-mysql.services.clever-cloud.com',
            user: 'ujzidyhlwvcsjkf7',
            password: '1Y9hNQKXRUfCgwO4rTyq',
            database: databaseName,
            multipleStatements: true
        })

        this.conn.connect(err => {
            if(err) return err;
        })

        this.conn.on('error', () => {

        })
    }

    runQuery(query, callback){
        this.conn.query(query, callback)
    }

    insert(values, callback){
        let query = `INSERT INTO cards(\`id\`, \`user_id\`, \`title\`, \`content\`, \`background-image\`, \`first-image\`, \`second-image\`, \`music\`) VALUES (null, ${values.userId}, '${values.title}', '${values.content}', '${values.backgroundImage}', '${values.firstImage}', '${values.secondImage}', '${values.music}')`
        this.conn.query(query, callback)
    }

    getAll(callback){
        let query = `SELECT * FROM ${this.tableName}`

        this.conn.query(query, callback)
    }

    update(id, { title, content, backgroundImage, firstImage, secondImage, music }, callback){
        let query = `UPDATE ${this.tableName} SET \`title\`=${title}, \`content\`=${content}, \`background-image\`=${backgroundImage}, \`first-image\`=${firstImage}, \`second-image\`=${secondImage}, \`music\`=${music} WHERE id=${id}`
        this.conn.query(query, callback);
    }

    remove(id,res){
        let query = `DELETE FROM ${this.tableName} WHERE id=${id}` 
        this.conn.query(query, (err, result) => {
            if(err) throw err
            res.send(result)
        });
    }
}

module.exports = CardsDb;