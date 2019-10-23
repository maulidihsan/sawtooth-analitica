const Document = require('../../enterprise_business_rules/entities/Document');

class RethinkDB {
    constructor(connection, model) {
        this.con = connection;
        this.model = model;
    }

    async get(documentId) {
        try {
            const doc = await this.model.table('documents').get(documentId).run(this.con);
            return new Document(doc.id, doc.legalitas, doc.jenisAset, doc.alamatAset, doc.luasTanah,
                doc.luasBangunan, doc.bentukTanah, doc.lebarJalan, doc.frontage, doc.letakTanah,
                doc.elevasi, doc.daerahBanjir, doc.RCNterdepresiasi, doc.koordinat, doc.gambarAset, doc.AJB);
        }
        catch(err) {
            console.log(err);
            return null;
        }
    }

    async getPembanding(long, lat) {
        try {
            const coordinate = this.model.point(long, lat);
            let pembanding = await this.model.table('documents').getNearest(coordinate, {index: 'koordinat', maxResults: 3, maxDist: 500}).run(this.con);
            pembanding = await pembanding.toArray();
            return pembanding.map(doc => new Document(doc.id, doc.legalitas, doc.jenisAset, doc.alamatAset, doc.luasTanah,
                doc.luasBangunan, doc.bentukTanah, doc.lebarJalan, doc.frontage, doc.letakTanah,
                doc.elevasi, doc.daerahBanjir, doc.RCNterdepresiasi, doc.koordinat, doc.gambarAset, doc.AJB));
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
            return docs.map(doc => new Document(doc.id, doc.legalitas, doc.jenisAset, doc.alamatAset, doc.luasTanah,
                doc.luasBangunan, doc.bentukTanah, doc.lebarJalan, doc.frontage, doc.letakTanah,
                doc.elevasi, doc.daerahBanjir, doc.RCNterdepresiasi, doc.koordinat, doc.gambarAset, doc.AJB));
        }
        catch(err) {
            console.log(err);
            return null;
        }
    }

}

module.exports = RethinkDB;