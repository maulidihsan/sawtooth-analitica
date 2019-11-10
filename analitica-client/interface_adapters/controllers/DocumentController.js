const { check, param, query, validationResult } = require('express-validator');

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
        check('legalitas').exists().not().isEmpty(),
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
            const doc = await GetDocument(req.params.legalitas, blockchain);
            return res.status(200).json(doc);
        }
    ],
    getPembanding: [
        query('lang').exists(),
        query('long').exists(),
        async (req, res, next) => {
            let errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array())
            }
            const koordinat = {
                long: req.query.long,
                lat: req.query.lat
            }
            const pembanding = await GetPembanding(koordinat, dokumenRepo);
            return res.status(200).json(pembanding);
        }
    ],
    listDokumen: async (req, res, next) => {
        const docs = await ListDocument(dokumenRepo);
        return res.status(200).json(docs);
    }
}