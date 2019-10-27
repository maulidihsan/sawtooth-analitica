var { TP_NAMESPACE, _hash } = require("./constants");
const path = require('path');
const protobuf = require('protobufjs');

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

    setValue(nomorSertifikat, data) {
        return this.loadProtos('documents.proto', ['Document', 'Location'])
        .then(protos => {
            var address = makeAddress(nomorSertifikat);
            var stateEntriesSend = {}
            data.createdAt = Math.round((new Date()).getTime() / 1000);
            data.koordinat = protos['Location'].create(data.koordinat);
            var payload = protos['Document'].create(data)
            console.log(payload);
            let encoded = protos['Document'].encode(payload).finish()
            console.log(encoded);
            console.log(protos['Document'].decode(encoded))
            stateEntriesSend[address] = encoded;
            return  this.context.setState(stateEntriesSend, this.timeout).then(function(result) {
                console.log("Success", result)
            }).catch(function(error) {
                console.error("Error", error)
            })
        })
    }

    getValue(value) {
        return this.loadProtos('documents.proto', ['Document', 'Location'])
        .then(protos => {
            var address = makeAddress(value);
            console.log(address);
            return  this.context.getState([address], this.timeout).then((stateEntries) => {
                Object.assign(this.stateEntries, stateEntries);
                console.log(protos['Document'].decode(this.stateEntries[address]));
            })
        })
    }
}

const makeAddress = (x) => TP_NAMESPACE + '00' + _hash(x)

module.exports = AnaliticaState;