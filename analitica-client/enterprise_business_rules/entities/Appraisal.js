class Appraisal {

    constructor(
        id = null,
        legalitas,
        jenisLegalitas,
        jenisAset,
        alamatAset,
        luasTanah,
        luasBangunan,
        bentukTanah,
        lebarJalan,
        frontage,
        letakTanah,
        elevasi,
        daerahBanjir,
        RCNterdepresiasi,
        nilaiTanah,
        koordinat,
        adjustment,
        pembobotan,
        createdAt = null
    ) {

        this.id = id;
        this.legalitas = legalitas;
        this.jenisLegalitas = jenisLegalitas;
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
        this.nilaiTanah = nilaiTanah;
        this.koordinat = koordinat;
        this.adjustment = adjustment;
        this.pembobotan = pembobotan;
        this.createdAt = createdAt;
    }
}

module.exports = Appraisal;