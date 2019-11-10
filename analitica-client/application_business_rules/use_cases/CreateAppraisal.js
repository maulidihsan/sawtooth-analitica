const Appraisal = require('../../enterprise_business_rules/entities/Appraisal');

module.exports = (dataDokumen, appraisalRepo) => {
    const appraisal = new Appraisal(
        null,
        dataDokumen.legalitas,
        dataDokumen.jenisLegalitas,
        dataDokumen.jenisAset,
        dataDokumen.alamatAset,
        dataDokumen.luasTanah,
        dataDokumen.luasBangunan,
        dataDokumen.bentukTanah,
        dataDokumen.lebarJalan,
        dataDokumen.frontage,
        dataDokumen.letakTanah,
        dataDokumen.elevasi,
        dataDokumen.daerahBanjir,
        dataDokumen.RCNterdepresiasi,
        dataDokumen.nilaiTanah,
        dataDokumen.koordinat,
        dataDokumen.adjustment,
        dataDokumen.pembobotan,
    );
    return appraisalRepo.store(appraisal);
};