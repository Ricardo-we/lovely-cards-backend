const path = require('path');
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(morgan('dev'));
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'uploads/cards'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
app.use(multer({storage}).any())

// routes
app.use(require('./src/routes/users.js'))
app.use(require('./src/routes/cards.js'))
app.use(require('./src/routes/card-contents.js'))
app.use(require('./src/routes/card-images.js'))

app.listen(process.env.PORT || 5000)