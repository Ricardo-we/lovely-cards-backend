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
    const id = req.params.id;
    const query = `SELECT * FROM user WHERE id=${id}`;
    db.runQuery(query, (err, result) => basicQueryCallBack(res, err, result));
})

router.post('/check-user', (req, res) => {
    const { password, gmail, username } = req.body;
    const query = `SELECT * FROM user WHERE username='${username}' AND password='${password}' AND gmail='${gmail}'`;
    try {
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
    const { username, password, gmail } = req.body;
    const query = `INSERT INTO user (username, password, gmail) VALUES ('${username}','${password}','${gmail}')`

    try {

        db.runQuery('SELECT * FROM user', (err, result) => {
            if(err) res.send(err);
            else {
                for(let row of result){
                    if(row.username === username ||row.gmail === gmail) return res.send({message: 'Already exists'})
                }
                
                db.runQuery(query, (err, result) => {
                    if(err) res.send(err);
                    else db.runQuery('SELECT * FROM user WHERE id=(SELECT LAST_INSERT_ID());', (err, result) => {
                        res.send(JSON.stringify(result[0]))
                    })
                })
            }
        })
    }
    catch(err){
        req.send({message: 'failed'})
    }
})

router.put('/users/:id', (req, res) => {
    const { username, password, gmail } = req.body;
    const id = req.params['id'];
    const query = `UPDATE FROM user username=${username}, password=${password}, gmail=${gmail} WHERE id=${id}`;
    db.runQuery(query, (err, result) => basicQueryCallBack(res, err, result))
})

router.delete('/users/:id', (req, res) =>{
    const id = req.params['id'];
    const query = `DELETE FROM user WHERE id=${id}`
    db.runQuery(query, (err, result) => basicQueryCallBack(res, err, result));
})

module.exports = router;