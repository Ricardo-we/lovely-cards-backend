require('dotenv').config()
const CardsDb = require('./../db-connection.js');
const { Router } = require('express');

const router = Router();
const db = new CardsDb('users');

// router.get('/users/:id', (req, res) => {
//     try{

//         const id = req.params.id;
//         const query = `SELECT * FROM user WHERE id=?`;
//         db.runQuery(query, (err, result) => basicQueryCallBack(res, err, result));
//     } catch(error){
//         res.json(error)
//     }
// })

router.post('/check-user', async (req, res) => {
    try {
        const { password, gmail, username } = req.body;
        const query = `SELECT * FROM user WHERE username=? AND password=? AND gmail=?`;
        const result = await db.safeQuery(query, [username, password, gmail]);
        res.send(result[0])
    }
    catch{
        res.send('Something went wrong')
    }
})

router.post('/users', async (req, res) => {
    try {
        const { username, password, gmail } = req.body;
        const query = `INSERT INTO user (username, password, gmail) VALUES (?,?,?)`
        const checkIfExistsQuery = `SELECT * FROM user WHERE username=? AND gmail=?`;

        const existingUser = await db.safeQuery(checkIfExistsQuery, [username,gmail]);
        if(existingUser[0]?.id) throw new Error("User data already exists");
        await db.safeQuery(query, [username, password, gmail]);
        const createdUser = await db.safeQuery("SELECT * FROM user WHERE id=(SELECT LAST_INSERT_ID())", []);
        return res.json(createdUser[0]);
    }
    catch(err){
        res.json({error: err?.toString()})
    }
})

router.put('/users/:id', async (req, res) => {
    try{

        const { username, password, gmail } = req.body;
        const id = req.params['id'];
        const query = `UPDATE FROM user username=?, password=?, gmail=? WHERE id=?`;
        await db.safeQuery(query, [username, password, gmail, id]);
        return res.send({message: "Success"});
    } catch(error){
        res.json({error: error.toString()})
    }
})

router.delete('/users/:id', async (req, res) =>{
    try {
        const id = req.params['id'];
        const query = `DELETE FROM user WHERE id=?`
        await db.safeQuery(query, [id]);
        return res.json({ message: "Success" })
    } catch (error) {
        res.json({error: error.toString()})
    }
})

module.exports = router;