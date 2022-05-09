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
    try{
        const cardID = req.params.cardID;
        const query = `SELECT * FROM ${tableName} WHERE id=${cardID}`;
        db.runQuery(query, (err, result) => {
            if(err) throw new Error(err.toString()); 
            else res.send(result)
        })
    } catch(error){
        res.json({error: error.toString()});
    }
})

router.get('/manage-cards/:userid', (req, res) => {
    try{
        const userId = req.params.userid;
        const query = `SELECT * FROM ${tableName} WHERE user_id=${userId}`
        
        db.runQuery(query, (err, result) => {
            if(err) throw new Error(err.toString());
            else res.send(result);
        })
    } catch(error){
        res.json({error: error.toString()});
    }
})

router.post('/manage-cards/:user_id', async (req, res) => {
    try{

        const userId = req.params.user_id
        const cardName = req.body['card-name']; 
        const music = req.files[0];
        const uploadedFile = await cloudinary.v2.uploader.upload(music.path, {resource_type: 'raw'})
        await fse.unlink(music.path)
        const query = `INSERT INTO ${tableName} (user_id, music, card_name) VALUES ('${userId}', '${uploadedFile.url}', '${cardName}')`;
        
        db.runQuery(query, (err, result) => {
            if(err) throw new Error(err.toString());
            else res.send({message:'success'});
        })
    } catch(error){
        res.json({error: error.toString()});
    } 
})

router.put('/manage-cards/:id', async (req, res) => {
    try{

        const cardName = req.body['card-name'];
        const id  = req.params.id;   
        
        let query = `UPDATE ${tableName} SET card_name='${cardName}'`;
        
        if(req.files[0]) {
            try{
                
                const file = req.files[0];
                const musicUrl = await cloudinary.v2.uploader.upload(file.path, {resource_type: 'raw'});
                await fse.unlink(file.path)
                query += `, music='${musicUrl.url}'`;
            } catch(err){
                throw new Error(err.toString())
            }
        }
        
        query += ` WHERE id=${id}`
        
        db.runQuery(query, (err, result) => {
            if(err) throw new Error(err.toString());
            res.send(result)
        })
    } catch(error){
        res.json({error: error.toString()});
    } 
})

router.delete('/manage-cards/:id', (req, res) => {
    try{
        db.remove(req.params.id, res)
        res.json({message: 'success'})
    } catch(error){
        res.json(error)
    }
})

module.exports = router;