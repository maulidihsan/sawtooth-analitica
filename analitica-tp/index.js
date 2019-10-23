const { TransactionProcessor } = require('sawtooth-sdk/processor')
const AnaliticaHandler = require('./handler')

let address = 'tcp://localhost:4004'
if (process.argv.length < 3) {
    console.log('using default transaction processor address (tcp://localhost:4004)')
} else {
    address = process.argv[2]
}

const transactionProcessor = new TransactionProcessor(address)

transactionProcessor.addHandler(new AnaliticaHandler())
transactionProcessor.start()

console.log(`Starting Analitica transaction processor`)