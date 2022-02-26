require('dotenv').config()
const CardsDb = require('./../db-connection.js');
const { Router } = require('express');

const router = Router();
const db = new CardsDb('users');

function basicQueryCallBack(res, err, result){
    if(err) throw err
    res.send(result)
}

// router.get('/users', (req, res) => {
//     const query = 'SELECT * FROM user'; 
//     db.runQuery(query, (err, result) => basicQueryCallBack(res, err, result))
// })

router.get('/users/:id', (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM user WHERE id=${id}`;
    db.runQuery(query, (err, result) => basicQueryCallBack(res, err, result));
})

router.post('/check-user', (req, res) => {
    const { password, gmail, username } = req.body;
    const query = `SELECT * FROM user WHERE username='${username}' AND password='${password}' AND gmail='${gmail}'`;
    
    db.runQuery(query, (err, result) => {
        if(err) res.send('Something failed')
        else if(result.length > 0) {
            res.send(result[0])
        }
        else res.send({message: 'invalid'})
    });
})

router.post('/users', (req, res) => {
    const { username, password, gmail } = req.body;
    const query = `INSERT INTO user (username, password, gmail) VALUES ('${username}','${password}','${gmail}')`

    db.runQuery('SELECT * FROM user', (err, result) => {
        if(err) throw err;
        for(let row of result){
            if(row.username === username ||row.gmail === gmail) return res.send({message: 'Already exists'})
        }

        db.runQuery(query, (err, result) => {
            if(err) throw err;
            db.runQuery('SELECT * FROM user WHERE id=(SELECT LAST_INSERT_ID());', (err, result) => {
                res.send(JSON.stringify(result[0]))
            })
        })
    })
})

router.put('/users/:id', (req, res) => {
    const { username, password, gmail } = req.body;
    const id = req.param('id');
    const query = `UPDATE FROM user username=${username}, password=${password}, gmail=${gmail} WHERE id=${id}`;
    db.runQuery(query, (err, result) => basicQueryCallBack(res, err, result))
})

router.delete('/users/:id', (req, res) =>{
    const id = req.param('id');
    const query = `DELETE FROM user WHERE id=${id}`
    db.runQuery(query, (err, result) => basicQueryCallBack(res, err, result));

})

module.exports = router;