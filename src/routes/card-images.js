require('dotenv').config();
const { Router } = require('express');
const cloudinary = require('cloudinary');
const fse = require('fs-extra');
const CardsDb =  require('../db-connection');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const router = Router();
const db = new CardsDb('card_images');
const tableName = 'card_images'

router.get('/card-images/:card_id', (req, res) => {
    const card_id = req.params.card_id;
    const query = `SELECT * FROM ${tableName} WHERE card_id=${card_id}`

    db.runQuery(query, (err, result) => {
        if(err) res.send(err);
        else res.send(result);
    })
})

router.post('/card-images/:cards_id', async (req, res) => {
    const cardId = req.params.cards_id;
    const image = req.files[0];
    const fileUrl = await cloudinary.v2.uploader.upload(image.path);
    await fse.unlink(image.path)
    console.log(fileUrl);
    const query = `INSERT INTO ${tableName} (card_id, image, image_id) VALUES ('${cardId}', '${fileUrl.url}', '${fileUrl.public_id}')`;

    db.runQuery(query, (err, result) =>{
        if(err) res.send(err);
        else res.send({message: 'success'})
    })
})

router.delete('/card-images/:id', (req, res) => {
    const id = req.params.id;
    const image_id = req.body['image-id'];
    cloudinary.v2.uploader.destroy(image_id)
    const query = `DELETE FROM ${tableName} WHERE id=${id}`;

    db.runQuery(query, (err, result) =>{
        if(err) res.send(err)
        else res.send(result);
    })
})

module.exports = router;