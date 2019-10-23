const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction, InternalError } = require('sawtooth-sdk/processor/exceptions')
const cbor = require('cbor')
const AnaliticaState = require('./state');
var { TP_FAMILY, TP_NAMESPACE } = require("./constants");

class AnaliticaHandler extends TransactionHandler {
    constructor() {
        super(TP_FAMILY, ['1.0'], [TP_NAMESPACE])
    }

    apply(transactionProcessRequest, context) {
        let payload = cbor.decode(transactionProcessRequest.payload);
        let state = new AnaliticaState(context);

        if (payload.action === 'get') {
            return state.getValue(payload.data.legalitas)
        } else  if (payload.action === 'set') {
            return state.setValue(payload.data.legalitas, payload.data)
        } else {
            throw  new InvalidTransaction(
            `Action must be set, get, or take not ${payload.action}`
            )
        }
    }
}
module.exports = AnaliticaHandler