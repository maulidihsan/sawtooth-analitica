class Document {

    constructor(id =null, legalitas, jenisAset, alamatAset, luasTanah, luasBangunan, bentukTanah, lebarJalan, frontage, letakTanah, elevasi, daerahBanjir, RCNterdepresiasi, koordinat, gambarAset = null, AJB = null) {
        this.id = id;
        this.legalitas = legalitas;
        this.jenisAset = jenisAset;
        this.alamatAset = alamatAset;
        this.luasTanah = luasTanah;
        this.luasBangunan = luasBangunan;
        this.bentukTanah = bentukTanah;
        this.lebarJalan = lebarJalan;
        this.frontage = frontage;
        this.letakTanah = letakTanah;
        this.elevasi = elevasi;
        this.daerahBanjir = daerahBanjir;
        this.RCNterdepresiasi = RCNterdepresiasi;
        this.koordinat = koordinat;
        this.gambarAset = gambarAset;
        this.AJB = AJB;
    }
}

module.exports = Document;