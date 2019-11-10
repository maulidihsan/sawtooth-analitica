const { check, param, query, validationResult } = require('express-validator');

const CreateAppraisal = require('../../application_business_rules/use_cases/CreateAppraisal');
const ListAppraisal = require('../../application_business_rules/use_cases/ListAppraisal');
const AppraisalRepository = require('../../application_business_rules/repositories/AppraisalRepository');
const AnaliticaClient = require('../storage/Blockchain');
const blockchain = new AppraisalRepository(new AnaliticaClient());
let appraisalRepo;

module.exports = {
    init: (db) => {
        dokumenRepo = new DocumentRepository(db);
    },
    createAppraisal: [
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
            const doc = await CreateAppraisal(req.body, blockchain);
            return res.status(200).json(doc);
        }
    ],
    listAppraisal: async (req, res, next) => {
        const docs = await ListAppraisal(appraisalRepo);
        return res.status(200).json(docs);
    }
};


