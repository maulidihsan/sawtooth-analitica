var { TP_NAMESPACE, _hash } = require("./constants");
const path = require('path');
const protobuf = require('protobufjs');

const PREFIX = {
    document: '00',
    appraisal: '11',
};

class AnaliticaState {
    constructor(context) {
        this.context = context;
        this.timeout = 500;
        this.stateEntries = {};
    }

    loadProtos(filename, protoNames) {
        const protoPath = path.resolve(__dirname, './protos', filename)
        return protobuf.load(protoPath)
            .then(root => {
                let protos = {};
                return Promise.all(protoNames.map(name => {
                    protos[name] = root.lookupType(name)
                })).then(() => protos)
            })
        }

    setValue(type, nomorSertifikat, data) {
        var address = makeAddress(nomorSertifikat, type);
        var stateEntriesSend = {}
        data.createdAt = Math.round((new Date()).getTime() / 1000);
        if (type == 'document') {
            return this.loadProtos('documents.proto', ['Document', 'Location'])
                .then(protos => {
                    data.koordinat = protos['Location'].create(data.koordinat);
                    var payload = protos['Document'].create(data)
                    console.log(payload);
                    let encoded = protos['Document'].encode(payload).finish()
                    console.log(encoded);
                    stateEntriesSend[address] = encoded;
                })
        } else if (type == 'appraisal') {
            return this.loadProtos('appraisals.proto', ['Appraisal', 'Location', 'Adjustment'])
                .then(protos => {
                    data.koordinat = protos['Location'].create(data.koordinat);
                    data.adjustment = protos['Adjustment'].create(data.adjustment);
                    var payload = protos['Appraisal'].create(data)
                    console.log(payload);
                    let encoded = protos['Appraisal'].encode(payload).finish()
                    stateEntriesSend[address] = encoded;
                })
        }
        return  this.context.setState(stateEntriesSend, this.timeout).then(function(result) {
            console.log("Success", result)
        }).catch(function(error) {
            console.error("Error", error)
        })
    }

    getValue(type, value) {
        var address = makeAddress(value, type);
        if (type == 'document') {
            return this.loadProtos('documents.proto', ['Document', 'Location'])
                .then(protos => {
                    console.log(address);
                    return  this.context.getState([address], this.timeout).then((stateEntries) => {
                        Object.assign(this.stateEntries, stateEntries);
                        console.log(protos['Document'].decode(this.stateEntries[address]));
                    })
                })
        } else if (type == 'appraisal') {
            return this.loadProtos('appraisal.proto', ['Appraisal', 'Location', 'Adjustment'])
                .then(protos => {
                    return  this.context.getState([address], this.timeout).then((stateEntries) => {
                        Object.assign(this.stateEntries, stateEntries);
                        console.log(protos['Appraisal'].decode(this.stateEntries[address]));
                    })
                })
        }
    }
}

const makeAddress = (x, type) => TP_NAMESPACE + PREFIX[type] + _hash(x)

module.exports = AnaliticaState;