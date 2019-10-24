const express = require('express')
const bodyParser = require('body-parser')
const ipfsApi = require('ipfs-api')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const createHTTPServer = async (db) => {
    const app = express();
    const DocumentController = require('../../interface_adapters/controllers/DocumentController');
    DocumentController.init(db);
    const ipfs = ipfsApi({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https'
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.post('/add', DocumentController.createDokumen);
    app.post('/upload', upload.single('image'), (req, res) => {
        ipfs.files.add(req.file.buffer, function (err, file) {
            if (err) {
                console.log(err);
            }
            console.log(file);
            return file;
        })
    });
    app.get('/get/:legalitas', DocumentController.getDokumen);
    app.get('/get', DocumentController.listDokumen);
    app.get('/pembanding/:id', DocumentController.getPembanding);
    return app;
}

module.exports = createHTTPServer;