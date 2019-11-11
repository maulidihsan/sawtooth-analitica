const {createHash} = require('crypto')
const {CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const protobuf = require('sawtooth-sdk/protobuf')
const pb = require('protobufjs');
const path = require('path');
const cbor = require('cbor')
const fetch = require('node-fetch');
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')

const FAMILY_NAME = 'analitica'
const FAMILY_VERSION = '1.0'
const PREFIX = '00'

const hash = (v) => createHash('sha512').update(v).digest('hex');

class AnaliticaClient {
    constructor() {
        const context = createContext('secp256k1');
        const privateKey = context.newRandomPrivateKey();

        this.signer = new CryptoFactory(context).newSigner(privateKey);
        this.publicKey = this.signer.getPublicKey().asHex();
        this.address = hash(FAMILY_NAME).substr(0, 6);
        console.log("Storing at: " + this.address);
    }

    store(payload) {
        let type = payload.type;
        delete payload['type'];
        return this._wrap_and_send("set", type, JSON.stringify(payload));
    }

    get(legalitas) {
        return this._get_from_rest_api(this._make_address(legalitas));
    }

    _loadProtos(filename, protoNames) {
        const protoPath = path.resolve('./protos', filename)
        return pb.load(protoPath)
            .then(root => {
                let protos = {};
                return Promise.all(protoNames.map(name => {
                    protos[name] = root.lookupType(name)
                })).then(() => protos)
            })
    }

    _make_address(value) {
        return this.address + PREFIX + hash(value).toLowerCase().substring(0, 62);
    }

    _wrap_and_send(action, type, values){
        let payload = {};
        payload.action = action;
        payload.type = type;
        payload.data = JSON.parse(values);
        console.log('blockchain payload:', payload)
        const payloadBytes = cbor.encode(payload);

        const transactionHeaderBytes = protobuf.TransactionHeader.encode({
            familyName: FAMILY_NAME,
            familyVersion: FAMILY_VERSION,
            inputs: [this.address],
            outputs: [this.address],
            signerPublicKey: this.signer.getPublicKey().asHex(),
            nonce: "" + Math.random(),
            batcherPublicKey: this.signer.getPublicKey().asHex(),
            dependencies: [],
            payloadSha512: hash(payloadBytes),
        }).finish();

        const transaction = protobuf.Transaction.create({
            header: transactionHeaderBytes,
            headerSignature: this.signer.sign(transactionHeaderBytes),
            payload: payloadBytes
        });

        const transactions = [transaction];

        const batchHeaderBytes = protobuf.BatchHeader.encode({
            signerPublicKey: this.signer.getPublicKey().asHex(),
            transactionIds: transactions.map((txn) => txn.headerSignature),
        }).finish();

        const batchSignature = this.signer.sign(batchHeaderBytes);

        const batch = protobuf.Batch.create({
            header: batchHeaderBytes,
            headerSignature: batchSignature,
            transactions: transactions,
        });

        const batchListBytes = protobuf.BatchList.encode({
            batches: [batch]
        }).finish();

        return this._send_to_rest_api(batchListBytes);
    }

    _get_from_rest_api(address) {
        var geturl = 'http://'+process.env.REST+':'+process.env.REST_PORT+'/state/'+address;
        console.log("Getting from: " + geturl);
        return fetch(geturl, {
            method: 'GET',
        })
        .then((response) => response.json())
        .then((responseJson) => {
            var data = responseJson.data;
            var buffer = new Buffer.from(data, 'base64');
            return buffer;
        })
        .then(buffer => {
            return this._loadProtos('documents.proto', ['Document', 'Location'])
            .then(protos => {
                let decoded = protos['Document'].decode(buffer);
                return protos['Document'].toObject(decoded, {
                    enums: String,
                    longs: String,
                    bytes: String,
                    defaults: true
                })
            })
        })
        .catch((error) => {
            console.error(error);
        });
    }

    _send_to_rest_api(batchListBytes){
        return fetch('http://'+process.env.REST+':'+process.env.REST_PORT+'/batches', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/octet-stream'
            },
            body: batchListBytes
        })
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson;
        })
        .catch((error) => {
            console.error(error);
        });
    }
}
module.exports = AnaliticaClient;
