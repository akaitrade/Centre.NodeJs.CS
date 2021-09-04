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

    TransactionsGet(PubKey,Offset=0, Index=10){
      return new Promise(resolve => {
          resolve(this.client.TransactionsGet(base58tobytes(PubKey),Offset,Index));
      })
    }

    DeploySmart(PubKey,Offset=0, Index=10){
      return new Promise(resolve => {
          resolve(this.client.TransactionsGet(base58tobytes(PubKey),Offset,Index));
      })
    }
    
    SendTransaction(PubKey,Offset=0, Index=10){
      return new Promise(resolve => {
          resolve(this.client.TransactionsGet(base58tobytes(PubKey),Offset,Index));
      })
    }

    SyncState(){
      return new Promise(resolve => {
          resolve(this.client.SyncStateGet());
      })
    }

    ActualFeeGet(TransactionSize){
      return new Promise(resolve => {
          resolve(this.client.ActualFeeGet(TransactionSize));
      })
    }

    WalletIdGet(Address){
      return new Promise(resolve => {
          resolve(this.client.WalletIdGet(base58tobytes(Address)));
      })
    }

    PoolListGetStable(Sequence=0, Limit=10){
      return new Promise(resolve => {
          resolve(this.client.PoolListGetStable(Sequence, Limit));
      })
    }

    PoolListGet(Offset=0, Limit=10){
      return new Promise(resolve => {
          resolve(this.client.PoolListGet(Offset, Limit));
      })
    }

    PoolInfoGet(Offset=0, Limit=10){
      return new Promise(resolve => {
          resolve(this.client.PoolInfoGet(Offset, Limit));
      })
    }

    PoolTransactionsGet(Sequence,Offset=0, Limit=10){
      return new Promise(resolve => {
          resolve(this.client.PoolTransactionsGet(Sequence,Offset, Limit));
      })
    }
    SmartContractGet(Address){
      return new Promise(resolve => {
          resolve(this.client.SmartContractGet(base58tobytes(Address)));
      })
    }

    SmartContractsListGet(Deployer, Offset=0, Limit=10){
      return new Promise(resolve => {
          resolve(this.client.SmartContractGet(base58tobytes(Deployer),Offset,Limit));
      })
    }

    TransactionsStateGet(Address, Id){
      return new Promise(resolve => {
          resolve(this.client.TransactionsStateGet(base58tobytes(Address),Id));
      })
    }

    ContractAllMethodsGet(byteCodeObjects){
      return new Promise(resolve => {
          resolve(this.client.TransactionsStateGet(byteCodeObjects));
      })
    }

    SmartMethodParamsGet(Address, Id){
      return new Promise(resolve => {
          resolve(this.client.TransactionsStateGet(base58tobytes(Address), Id));
      })
    }

    SmartContractDataGet(Address){
      return new Promise(resolve => {
          resolve(this.client.SmartContractDataGet(base58tobytes(Address)));
      })
    }

    SmartContractCompile(SCcode){
      return new Promise(resolve => {
          resolve(this.client.SmartContractCompile(SCcode));
      })
    }

    TokenBalancesGet(Address){
      return new Promise(resolve => {
          resolve(this.client.SmartContractCompile(base58tobytes(Address)));
      })
    }

    TokenTransfersGet(Token, Offset=0, Limit=0){
      return new Promise(resolve => {
          resolve(this.client.TokenTransfersGet(base58tobytes(Token),Offset,Limit));
      })
    }

    TokenTransferGet(Token, TxsID){
      return new Promise(resolve => {
          resolve(this.client.TokenTransferGet(base58tobytes(Token),TxsID));
      })
    }

    TokenTransferGet(Token, TxsID){
      return new Promise(resolve => {
          resolve(this.client.TokenTransferGet(base58tobytes(Token),TxsID));
      })
    }

    TokenTransfersListGet(Offset=0, Limit=0){
      return new Promise(resolve => {
          resolve(this.client.TokenTransfersListGet(Offset, Limit));
      })
    }

    TokenWalletTransfersGet(Token, Address,Offset=0, Limit=0){
      return new Promise(resolve => {
          resolve(this.client.TokenWalletTransfersGet(base58tobytes(Token),base58tobytes(Address),Offset, Limit));
      })
    }

    TokenInfoGet(Token){
      return new Promise(resolve => {
          resolve(this.client.TokenInfoGet(base58tobytes(Token)));
      })
    }

    TokenHoldersGet(Token, Order, Desc, Offset=0, Limit=0){
      return new Promise(resolve => {
          resolve(this.client.TokenHoldersGet(base58tobytes(Token), Order, Desc, Offset, Limit));
      })
    }

    TokensListGet(Order, Filters, Desc, Offset=0, Limit=10){
      return new Promise(resolve => {
          resolve(this.client.TokensListGet(Order, Filters, Desc, Offset, Limit));
      })
    }

    WalletsGet(OrdCol, Desc, Offset=0, Limit=10){
      return new Promise(resolve => {
          resolve(this.client.WalletsGet(OrdCol, Desc, Offset, Limit));
      })
    }

    TrustedGet(Page){
      return new Promise(resolve => {
          resolve(this.client.TrustedGet(Page));
      })
    }



}



var connect_ = new Connector("165.22.212.253", 9090);
//connect_.TransactionsListGet(0,10).then((res) => {connect_.Close();console.log(res); });
//connect_.TransactionGet(63192736,0).then((res) => {connect_.Close();console.log(res); });
//connect_.WalletGetBalance("Ba2Uhtcy4cZ6nJNaQKXWcdLgPH7Kat2R67CUkRU2bkTk").then((res) => {connect_.Close();console.log(res); });
//connect_.WalletTransactionsCountGet("Ba2Uhtcy4cZ6nJNaQKXWcdLgPH7Kat2R67CUkRU2bkTk").then((res) => {connect_.Close();console.log(res); });
//connect_.WalletDataGet("Ba2Uhtcy4cZ6nJNaQKXWcdLgPH7Kat2R67CUkRU2bkTk").then((res) => {connect_.Close();console.log(res); });
//connect_.StatsGet().then((res) => {connect_.Close();console.log(res); });
//connect_.TransactionsGet("ACkyon3ERkNEcNwpjUn4S6TLP3L76LFg3X6kWoJx82dK").then((res) => {connect_.Close();console.log(res); }); 
//connect_.SyncState().then((res) => {connect_.Close();console.log(res); });
//connect_.ActualFeeGet().then((res) => {connect_.Close();console.log(res); });
//connect_.WalletIdGet("ACkyon3ERkNEcNwpjUn4S6TLP3L76LFg3X6kWoJx82dK").then((res) => {connect_.Close();console.log(res); });
//connect_.PoolListGetStable(0,10).then((res) => {connect_.Close();console.log(res); });
//connect_.PoolListGet(0,10).then((res) => {connect_.Close();console.log(res); });
//connect_.PoolInfoGet(0,10).then((res) => {connect_.Close();console.log(res); });
//connect_.PoolTransactionsGet(544,0,10).then((res) => {connect_.Close();console.log(res); });
//connect_.SmartContractGet("12DHXQ8rzYUawD6VSD6WuVaTQ4uen7fStWsTmZASnDv1").then((res) => {connect_.Close();console.log(res); });
//connect_.SmartContractsListGet("EoPibFsGPE4xqXH2tYTBQUeJqSMMFvCZUdqAW9Bnh3nd",0,2).then((res) => {connect_.Close();console.log(res); });
//connect_.TransactionsStateGet("EoPibFsGPE4xqXH2tYTBQUeJqSMMFvCZUdqAW9Bnh3nd",null).then((res) => {connect_.Close();console.log(res); });
//connect_.SmartContractGet("12DHXQ8rzYUawD6VSD6WuVaTQ4uen7fStWsTmZASnDv1").then((res) => {
//  connect_.ContractAllMethodsGet("12DHXQ8rzYUawD6VSD6WuVaTQ4uen7fStWsTmZASnDv1",res.smartContract.smartContractDeploy.byteCodeObjects).then((res) => {connect_.Close();console.log(res); });
//});
//connect_.SmartMethodParamsGet("EoPibFsGPE4xqXH2tYTBQUeJqSMMFvCZUdqAW9Bnh3nd",1).then((res) => {connect_.Close();console.log(res); });
//connect_.SmartContractDataGet("12DHXQ8rzYUawD6VSD6WuVaTQ4uen7fStWsTmZASnDv1").then((res) => {connect_.Close();console.log(res); });
//connect_.SmartContractCompile("import com.credits.scapi.annotations.*; import com.credits.scapi.v0.*; public class MySmartContract extends SmartContract { public MySmartContract() {} public String hello2(String say) { return \"Hello\" + say; } }").then((res) => {connect_.Close();console.log(res); });
//connect_.TokenBalancesGet("4SFfA1S2xfA3BdgkTn2tK14yDhLuD11RVz78kqx35jct").then((res) => {connect_.Close();console.log(res); });
//connect_.TokenBalancesGet("4SFfA1S2xfA3BdgkTn2tK14yDhLuD11RVz78kqx35jct",0,10).then((res) => {connect_.Close();console.log(res); });
//connect_.TokenTransferGet("4SFfA1S2xfA3BdgkTn2tK14yDhLuD11RVz78kqx35jct").then((res) => {connect_.Close();console.log(res); });
//connect_.TokenTransfersListGet(0,10).then((res) => {connect_.Close();console.log(res); });
//connect_.TokenWalletTransfersGet("12DHXQ8rzYUawD6VSD6WuVaTQ4uen7fStWsTmZASnDv1","12DHXQ8rzYUawD6VSD6WuVaTQ4uen7fStWsTmZASnDv1",0,10).then((res) => {connect_.Close();console.log(res); });
//connect_.TokenInfoGet("12DHXQ8rzYUawD6VSD6WuVaTQ4uen7fStWsTmZASnDv1").then((res) => {connect_.Close();console.log(res); });