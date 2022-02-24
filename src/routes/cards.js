require('dotenv').config();
const { Router, request } = require('express');
const cloudinary = require('cloudinary');
const fse = require('fs-extra');
const CardsDb =  require('../db-connection');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const router = Router();
const db = new CardsDb('cards');
const tableName = 'cards';

// ROUTES 
router.get('/card/:cardID', (req, res) => {
    const cardID = req.params.cardID;
    const query = `SELECT * FROM ${tableName} WHERE id=${cardID}`;
    db.runQuery(query, (err, result) => {
        if(err) throw err; 
        else res.send(result)
    })
})

router.get('/manage-cards/:userid', (req, res) => {
    const userId = req.params.userid;
    const query = `SELECT * FROM ${tableName} WHERE user_id=${userId}`

    db.runQuery(query, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.post('/manage-cards/:user_id', async (req, res) => {
    const userId = req.params.user_id
    const cardName = req.body['card-name']; 
    const music = req.files[0];
    const uploadedFile = await cloudinary.v2.uploader.upload(music.path, {resource_type: 'raw'})
    await fse.unlink(music.path)
    const query = `INSERT INTO ${tableName} (user_id, music, card_name) VALUES ('${userId}', '${uploadedFile.url}', '${cardName}')`;
    db.runQuery(query, (err, result) => {
        if(err) throw err;
        res.send({message:'success'});
    })
})

router.put('/manage-cards/:id', async (req, res) => {
    const cardName = req.body['card-name'];
    const id  = req.params.id;   
    
    let query = `UPDATE ${tableName} SET card_name='${cardName}'`;

    if(req.files[0]) {
        try{

            const file = req.files[0];
            const musicUrl = await cloudinary.v2.uploader.upload(file.path, {resource_type: 'raw'});
            console.log(musicUrl.url)
            await fse.unlink(file.path)
            query += `, music='${musicUrl.url}'`;
        }
        catch(err){
            console.log(err)
        }
    }

    query += ` WHERE id=${id}`

    db.runQuery(query, (err, result) => {
        if(err) throw err
        res.send(result)
    })
})

router.delete('/manage-cards/:id', (req, res) => db.remove(req.params.id, res))

module.exports = router;