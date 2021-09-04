var api = require('./API')
var thrift = require('thrift')
var ttypes = require('./api_types');
var general_ttypes = require('./general_types');
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

    

    fee(v) {
      let s = v > 0 ? 0 : 1;
      v = Math.abs(v);
      let exp = v === 0 ? 0 : Math.log10(v);
      exp = Math.floor(exp >= 0 ? exp + 0.5 : exp - 0.5);
      v /= Math.pow(10, exp);
      if (v >= 1) {
          v *= 0.1;
          ++exp;
      }
      v = Number((v * 1024).toFixed(0));
      return { exp: exp + 18, man: v === 1024 ? 1023 : v };
    }

    numbToBits(int) {
      let Bits = "";
      let numb = String(int);
      while (true) {
          Bits = (numb % 2) + Bits;
          numb = Math.floor(numb / 2);

          if (numb <= 1) {
              Bits = numb + Bits;
              break;
          }
      }
      return Bits;
    } 
    bitsToNumb(Bits) {
      let numb = 0;
      let mnoj = 1;
      for (var i = Bits.length - 1; i > 0; i -= 1) {
          if (Bits[i] !== 0) {
              numb += mnoj * Bits[i];
          }
          mnoj *= 2;
      }
      return numb;
    }

    numbToByte(numb, CountByte) {
      let InnerId = new Uint8Array(CountByte);
      numb = String(numb);
      let i = 1;
      let index = 0;
      while (true) {
          InnerId[index] += (numb % 2) * i;
          numb = Math.floor(numb / 2);
          if (numb === 0) {
              break;
          }
          if (numb === 1) {
              var b = (numb % 2) * i * 2;
              if (b === 256) {
                  ++InnerId[index + 1];
              } else {
                  InnerId[index] += (numb % 2) * i * 2;
              }
              break;
          }

          if (i === 128) {
              i = 1;
              index++;
          } else {
              i *= 2;
          }
      }
      return InnerId;
    }

    

    Close(){
        this.connection.end();
    }

    TransactionsListGet(Offset=0,Limit=10){
        return new Promise(resolve => {
            resolve(this.client.TransactionsListGet(Offset,Limit));
        })
    }
    transfer_coins(){

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
    createTransaction(integral, fraction, fee, publickey, privatekey, target, txsid) {
      return new Promise(resolve => {
        let res = this.client.WalletTransactionsCountGet(base58tobytes(publickey));
        var tran = new ttypes.Transaction();
        tran.id = res.lastTransactionInnerId + 1;
        tran.source = base58tobytes(publickey);
        tran.target = base58tobytes(target);
        tran.amount = new general_ttypes.Amount({integral: integral, fraction: fraction});

        let F = this.fee(fee);
        let FE = this.numbToBits(F.exp);
        while (FE.length < 5){
            FE = "0" + FE;
        }
        let FM = this.numbToBits(F.man);
        while (FM.length < 10) {
            FM = "0" + FM;
        }

        tran.fee = new ttypes.AmountCommission({
            commission: this.bitsToNumb("0" + FE + FM)
        });

        tran.currency = 1;

        let PerStr = this.numbToByte(tran.id, 6);
        PerStr = this.concatTypedArrays(PerStr, tran.source);
        PerStr = this.concatTypedArrays(PerStr, tran.target);
        PerStr = this.concatTypedArrays(PerStr, this.numbToByte(tran.amount.integral, 4));
        PerStr = this.concatTypedArrays(PerStr, this.numbToByte(tran.amount.fraction, 8));
        PerStr = this.concatTypedArrays(PerStr, this.numbToByte(tran.fee.commission, 2));
        PerStr = this.concatTypedArrays(PerStr, new Uint8Array([1]));
        PerStr = this.concatTypedArrays(PerStr, new Uint8Array(1));
        tran.signature = nacl.sign.detached(PerStr, base58tobytes(privatekey));
        resolve(tran);
      })
      
  }
  SendTransaction(Integeral,fraction,fee,PublicKey,PrivateKey,Target,UserData=null,TxsID=0,Transaction = null){
    return new Promise(resolve => {
        resolve(this.client.TransactionFlow(this.createTransaction(Integeral,fraction,fee,PublicKey,PrivateKey,Target)));
    })
  }



}



var connect_ = new Connector("194.163.152.177", 9091);
connect_.SendTransaction(0,0,0.1,"5B3YXqDTcWQFGAqEJQJP3Bg1ZK8FFtHtgCiFLT5VAxpe","3rUevsW5xfob6qDxWMDFwwTQCq39SYhzstuyfUGSDvF2QHBRyPD8fSk49wFXaPk3GztfxtuU85QHfMV3ozfqa7rN","7TAp6BWBMJ3Ep6Wayu1TSApXifBFVAoZtCx6fALjo4At").then((res) => {connect_.Close();console.log(res); });
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