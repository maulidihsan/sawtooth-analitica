const Document = require('../../enterprise_business_rules/entities/Document');

module.exports = (dataDokumen, dokumenRepo) => {
    const dokumen = new Document(
        null,
        dataDokumen.legalitas,
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
        dataDokumen.koordinat,
        dataDokumen.gambarAset,
        dataDokumen.AJB
    );
    return dokumenRepo.store(dokumen);
};