require('dotenv').config();
const { Router } = require('express');
const cloudinary = require('cloudinary');
const fse = require('fs-extra');
const CardsDb =  require('../db-connection');

const router = Router();
const db = new CardsDb('card_images');
const tableName = 'card_content'

router.get('/card-contents/:card_id', async (req, res) => {
    try{
        const card_id = req.params.card_id;
        const query = `SELECT * FROM ${tableName} WHERE card_id=?`
        const result = await db.safeQuery(query, [card_id]);
        return res.send(result);        
    } catch(error){
        res.json({error: error.toString()})
    }
})

router.post('/card-contents/:card_id', async (req, res) => {
    try{
        const cardId = req.params.card_id;
        const { heading, content, card_color } = req.body;
        
        const query = `INSERT INTO ${tableName} (card_id, heading, content, card_color) VALUES (?, ?, ?, ?)`;
        await db.safeQuery(query, [cardId, heading, content,card_color]);
        
        return res.send({message: "success"});       
    } catch(error){
        res.json({error: error.toString()})
    }
})

router.put('/card-contents/:id', async (req, res) => {
    try{
        const messageCardId = req.params.id;
        const { heading, content } = req.body;
        const query = `UPDATE ${tableName} SET heading='${heading}', content='${content}' WHERE id=${messageCardId}`;
        
        db.runQuery(query, (err, result) =>{
            if(err) throw new Error(err.toString())
            else res.send({message: 'success'})
        })
    } catch(error){
        res.json({error: error.toString()})
    }
})

router.delete('/card-contents/:id', (req, res) => {
    try{
        const imageId = req.params.id;
        const query = `DELETE FROM ${tableName} WHERE id=${imageId}`;
        
        db.runQuery(query, (err, result) =>{
            if(err) throw new Error(err.toString())
            else res.send({message: 'success'});
        })
    } catch(error){
        res.json({error: error.toString()})
    }
})

module.exports = router;