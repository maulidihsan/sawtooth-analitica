const Document = require('../../enterprise_business_rules/entities/Document');
const Appraisal = require('../../enterprise_business_rules/entities/Appraisal');

class RethinkDB {
    constructor(connection, model) {
        this.con = connection;
        this.model = model;
    }

    async get(documentId) {
        try {
            const doc = await this.model.table('documents').get(documentId).run(this.con);
            return new Document(doc.id,
                doc.legalitas,
                doc.jenisLegalitas,
                doc.nama,
                doc.telepon,
                doc.tahun,
                doc.tahunRenovasi,
                doc.hubungan,
                doc.jenisAset,
                doc.alamatAset,
                doc.luasTanah,
                doc.luasBangunan,
                doc.bentukTanah,
                doc.lebarJalan,
                doc.frontage,
                doc.letakTanah,
                doc.elevasi,
                doc.daerahBanjir,
                doc.RCNterdepresiasi,
                doc.nilaiTanah,
                doc.koordinat,
                doc.gambarAset,
                doc.createdAt);
        }
        catch(err) {
            console.log(err);
            return null;
        }
    }

    async getPembanding(koordinat) {
        try {
            const coordinate = this.model.point(koordinat.long, koordinat.lat);
            let pembanding = await this.model.table('documents').getNearest(coordinate, {index: 'koordinat', maxResults: 3, maxDist: 5000, unit: 'km'}).run(this.con);
            pembanding = await pembanding.toArray();
            return pembanding.map(doc => new Document(
                doc.id,
                doc.legalitas,
                doc.jenisLegalitas,
                doc.nama,
                doc.telepon,
                doc.tahun,
                doc.tahunRenovasi,
                doc.hubungan,
                doc.jenisAset,
                doc.alamatAset,
                doc.luasTanah,
                doc.luasBangunan,
                doc.bentukTanah,
                doc.lebarJalan,
                doc.frontage,
                doc.letakTanah,
                doc.elevasi,
                doc.daerahBanjir,
                doc.RCNterdepresiasi,
                doc.nilaiTanah,
                doc.koordinat,
                doc.gambarAset,
                doc.createdAt
            ));
        }
        catch(err) {
            console.log(err);
            return null;
        }
    }

    async getAll() {
        try {
            let docs = await this.model.table('documents').run(this.con);
            docs = await docs.toArray();
            console.log(docs);
            return docs.map(doc => new Document(
                doc.id,
                doc.legalitas,
                doc.jenisLegalitas,
                doc.nama,
                doc.telepon,
                doc.tahun,
                doc.tahunRenovasi,
                doc.hubungan,
                doc.jenisAset,
                doc.alamatAset,
                doc.luasTanah,
                doc.luasBangunan,
                doc.bentukTanah,
                doc.lebarJalan,
                doc.frontage,
                doc.letakTanah,
                doc.elevasi,
                doc.daerahBanjir,
                doc.RCNterdepresiasi,
                doc.nilaiTanah,
                doc.koordinat,
                doc.gambarAset,
                doc.createdAt
            ));
        }
        catch(err) {
            console.log(err);
            return null;
        }
    }

    async getAppraisal() {
        try {
            let docs = await this.model.table('appraisals').run(this.con);
            docs = await docs.toArray();
            console.log(docs);
            return docs.map(doc => new Appraisal(
                doc.id,
                doc.legalitas,
                doc.jenisLegalitas,
                doc.jenisAset,
                doc.alamatAset,
                doc.luasTanah,
                doc.luasBangunan,
                doc.bentukTanah,
                doc.lebarJalan,
                doc.frontage,
                doc.letakTanah,
                doc.elevasi,
                doc.daerahBanjir,
                doc.RCNterdepresiasi,
                doc.nilaiTanah,
                doc.koordinat,
                doc.adjustment,
                doc.pembobotan,
                doc.createdAt
            ));
        }
        catch(err) {
            console.log(err);
            return null;
        }
    }

}

module.exports = RethinkDB;