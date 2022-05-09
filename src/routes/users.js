require('dotenv').config()
const CardsDb = require('./../db-connection.js');
const { Router } = require('express');

const router = Router();
const db = new CardsDb('users');

function basicQueryCallBack(res, err, result){
    if(err) res.send(err)
    else res.send(result)
}

router.get('/users/:id', (req, res) => {
    try{

        const id = req.params.id;
        const query = `SELECT * FROM user WHERE id=${id}`;
        db.runQuery(query, (err, result) => basicQueryCallBack(res, err, result));
    } catch(error){
        res.json(error)
    }
})

router.post('/check-user', (req, res) => {
    try {
        const { password, gmail, username } = req.body;
        const query = `SELECT * FROM user WHERE username='${username}' AND password='${password}' AND gmail='${gmail}'`;
        db.runQuery(query, (err, result) => {
            if(err) res.send({message: 'invalid'})
            else res.send(result[0])
        });
    }
    catch{
        res.send('Something went wrong')
    }
})

router.post('/users', (req, res) => {
    try {
        const { username, password, gmail } = req.body;
        const query = `INSERT INTO user (username, password, gmail) VALUES ('${username}','${password}','${gmail}')`
        const checkIfExistsQuery = `SELECT * FROM user WHERE username=${username} AND gmail=${gmail}`;

        db.runQuery(checkIfExistsQuery, (err, result) => {
            if(result.length > 0 || err) throw new Error('User data already exists or error');
            
            db.runQuery(query, (err, result) => {
                if(err) throw new Error('');
                else db.runQuery('SELECT * FROM user WHERE id=(SELECT LAST_INSERT_ID());', (err, result) => {
                    res.json(result[0]);
                })
            })
        })
    }
    catch(err){
        res.json({error: error.toString()})
    }
})

router.put('/users/:id', (req, res) => {
    try{

        const { username, password, gmail } = req.body;
        const id = req.params['id'];
        const query = `UPDATE FROM user username=${username}, password=${password}, gmail=${gmail} WHERE id=${id}`;
        db.runQuery(query, (err, result) => basicQueryCallBack(res, err, result))
    } catch(error){
        res.json({error: error.toString()})
    }
})

router.delete('/users/:id', (req, res) =>{
    try {
        const id = req.params['id'];
        const query = `DELETE FROM user WHERE id=${id}`
        db.runQuery(query, (err, result) => basicQueryCallBack(res, err, result));
    } catch (error) {
        res.json({error: error.toString()})
    }
})

module.exports = router;