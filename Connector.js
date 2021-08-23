var api = require('./API')
var thrift = require('thrift')
var ttypes = require('./api_types');
var base58 = require('./bs58')
const assert = require('assert');
var transport = thrift.TBufferedTransport;
var protocol = thrift.TBinaryProtocol;

function base58tobytes(key) {
  var ab = base58.from_b58(key)
  var buf = Buffer.alloc(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
  }
  return buf;
}

class Connector{
    constructor(ip,port){
        this.ip = ip;
        this.port = port;
        this.connection = thrift.createConnection(ip, port, {
            transport : transport,
            protocol : protocol
          });
        this.client = thrift.createClient(api, this.connection);
    }

    Close(){
        this.connection.end();
    }

    TransactionsListGet(Offset=0,Limit=10){
        return new Promise(resolve => {
            resolve(this.client.TransactionsListGet(Offset,Limit));
        })
    }

    TransactionGet(PoolSeq,Index){
      var txsid = new ttypes.TransactionId();
      txsid.poolSeq = PoolSeq;
      txsid.index = Index;
      return new Promise(resolve => {
          resolve(this.client.TransactionGet(txsid));
      })
    }

    WalletGetBalance(PubKey){
      return new Promise(resolve => {
          resolve(this.client.WalletBalanceGet(base58tobytes(PubKey)));
      })
    }

    WalletTransactionsCountGet(PubKey){
      return new Promise(resolve => {
          resolve(this.client.WalletTransactionsCountGet(base58tobytes(PubKey)));
      })
    }

    WalletDataGet(PubKey){
      return new Promise(resolve => {
          resolve(this.client.WalletDataGet(base58tobytes(PubKey)));
      })
    }

    StatsGet(){
      return new Promise(resolve => {
          resolve(this.client.StatsGet());
      })
    }


}



var connect_ = new Connector("207.244.228.131", 9091);
//connect_.TransactionsListGet(0,10).then((res) => {connect_.Close();console.log(res); });
//connect_.TransactionGet(63192736,0).then((res) => {connect_.Close();console.log(res); });
//connect_.WalletGetBalance("Ba2Uhtcy4cZ6nJNaQKXWcdLgPH7Kat2R67CUkRU2bkTk").then((res) => {connect_.Close();console.log(res); });
//connect_.WalletTransactionsCountGet("Ba2Uhtcy4cZ6nJNaQKXWcdLgPH7Kat2R67CUkRU2bkTk").then((res) => {connect_.Close();console.log(res); });
//connect_.WalletDataGet("Ba2Uhtcy4cZ6nJNaQKXWcdLgPH7Kat2R67CUkRU2bkTk").then((res) => {connect_.Close();console.log(res); });
connect_.StatsGet().then((res) => {connect_.Close();console.log(res); });
 