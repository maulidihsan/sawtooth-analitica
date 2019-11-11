const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const ipfsApi = require('ipfs-api')
const multer = require('multer')

const storage = multer.memoryStorage()
const upload = multer({storage: storage})

const createHTTPServer = async (db) => {
    const app = express();
    app.use(cors());
    const DocumentController = require('../../interface_adapters/controllers/DocumentController');
    const AppraisalController = require('../../interface_adapters/controllers/AppraisalController');
    DocumentController.init(db);
    AppraisalController.init(db);
    const ipfs = ipfsApi({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https'
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.post('/add', DocumentController.createDokumen);
    app.get('/appraisal/list', AppraisalController.listAppraisal);
    app.post('/appraisal', AppraisalController.createAppraisal);
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
    app.get('/pembanding', DocumentController.getPembanding);
    return app;
}

module.exports = createHTTPServer;