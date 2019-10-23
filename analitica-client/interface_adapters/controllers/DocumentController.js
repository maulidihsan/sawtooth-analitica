const { check, param, validationResult } = require('express-validator');

const CreateDocument = require('../../application_business_rules/use_cases/CreateDocument');
const ListDocument = require('../../application_business_rules/use_cases/ListDocument');
const GetDocument = require('../../application_business_rules/use_cases/GetDocument');
const GetPembanding = require('../../application_business_rules/use_cases/GetPembanding');
const DocumentRepository = require('../../application_business_rules/repositories/DocumentRepository');
const AnaliticaClient = require('../storage/Blockchain');
const blockchain = new DocumentRepository(new AnaliticaClient());
let dokumenRepo;

module.exports = {
    init: (db) => {
        dokumenRepo = new DocumentRepository(db);
    },
    createDokumen: [
        check('legalitas').isLength({min: 14, max: 14}),
        check('luasTanah').isNumeric(),
        check('luasBangunan').isNumeric(),
        check('lebarJalan').isNumeric(),
        check('frontage').isNumeric(),
        check('elevasi').isNumeric(),
        check('koordinat.long').isNumeric(),
        check('koordinat.lat').isNumeric(),
        async (req, res, next) => {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }
            console.log(blockchain);
            const doc = await CreateDocument(req.body, blockchain);
            return res.status(200).json(doc);
        }
    ],
    getDokumen: [
        param('legalitas').exists(),
        async (req, res, next) => {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }
            const doc = await GetDocument(req.param.legalitas, blockchain);
            return res.status(200).json(doc);
        }
    ],
    getPembanding: [
        param('legalitas').exists(),
        async (req, res, next) => {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }
            const doc = await GetDocument(req.param.legalitas, blockchain);
            const pembanding = await GetPembanding(doc.location.long, doc.location.lat, dokumenRepo);
            return res.status(200).json(pembanding);
        }
    ],
    listDokumen: async (req, res, next) => {
        const docs = await ListDocument(dokumenRepo);
        return res.status(200).json(docs);
    }
}