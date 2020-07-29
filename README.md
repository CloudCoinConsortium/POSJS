CloudBank JS Library

## Table of Contents

[Install](README.md#Installing)

[Example](README.md#Example)

[RaidaJS](README.md#RaidaJS)

[apiPrintWelcome](README.md#apiPrintWelcome)

[apiEcho](README.md#apiEcho)

[apiDepositOneStack](README.md#apiDepositOneStack)

[apiWithdrawOneStack](README.md#apiWithdrawOneStack)

[apiGetReceipt](README.md#apiGetReceipt)

[apiShowCoins](README.md#apiShowCoins)

[apiSendToSkyWallet](README.md#apiSendToSkyWallet)

[apiTransferBetweenSkywallets](README.md#apiTransferBetweenSkywallets)

[apiReceiveFromSkywallet](README.md#apiReceiveFromSkywallet)

## Installing

Using npm:

```bash
$ npm install cloudbankjs
```

Using html:
```html
<script src="https://yourwebsite.com/dist/cloudbankjs.min.js"></script>
```

## Example


Browser:
```js
let cloudbankJS = new CloudBankJS({ 
	url : 'https://mycloudbank.domain',
	timeout: 20000,
	verifySSL: true
})
cloudbankJS.apiPrintWelcome().then(response => { 
	console.log("Welcome Result: " + response.status) 
})

```

Node.js ES6
```js
import CloudBankJS from "cloudbankjs"

let cloudbankJS = new CloudBankJS()
cloudbankJS.apiPrintWelcome()
```


Node.js ES5
```js
let RaidaJS = require('cloudbankjs').default

let cloudbankJS = new CloudBankJS()
cloudbankJS.apiPrintWelcome()
```

## CloudBankJS

Here are the available config options for making requests. URL is the only required option

```js
let options = {
	// CloudBank URL
	url : "https://cloudbank.domain", 

	// Read Timeout for HTTP requests in milliseconds
	timeout: 10000, 

	// Whether to verify SSL Certificate
	verifySSL: false
}

let cloudbankJS = new CloudBankJS(options)
```

## CloudBankJS Api Methods: Methods that contact CloudBank.

All methods are executed asynchronously and return Javascript Promise Object
If there is an error with the input data the method returns null

```js
raidaJS.apiWithdrawOneStack(data).then(response => console.log(response))	
```

### Set functions

```js
raidaJS.setTimeout(15000)
raidaJS.setVerifySSL(false)
```

### Api Methods

#### apiPrintWelcome

Returns Welcome Message

Input:

```js
cloudbankJS.apiPrintWelcome()
```

Data Returned:

```js
{
	"status" : String,  // "success" or "error"
	"text" : String 
}
```

#### apiEcho

Echoes the CloubBank which in turn echoes RAIDA servers and returns response

Input:

```js
cloudbankJS.apiEcho()
```

Data Returned:

```js
{
	"status" : String,  // "success" or "error"
	"text" : String 
}
```

#### apiDepositOneStack

Deposits an array of CloudCoins to the CloudBank

Input:

```js
let params = {
	'account' : '3AAF7BE8037B445F7B934FC06628ECBB', // Account Name
	'coins' : [{"nn":1,"sn":4164767,"an":["e0d4f8b2e2ceffa3d106048737479e9b","7bb6185e7c76a7faa94f05d344f5b1de","d6cf2da41fde469e8f047ef07d846f19","b93e1bbbf8a1eb8cd78dad732fa14e6c","d56b7fb7b703c206bdf73381a5a24f28","5e367ed28e46460c55a8671fa45c0e97","3978aa1d4e38ccd33c107f7fbeb718e7","6625378bc37fefefabf6f075013c16d1","3e0f2cbb1fe3d3cb316345077d11c49f","2f891b4b993037583aae0d9ab44bc092","bef5e72eb0f082b9fc59427229973e85","ad1ab9248fc29fd9737c26ed95fbca74","84d5f54f23f1eb90e2895b1b28d56ec2","174d238640acfe41d809ef3a6a32134c","83637485fb9ab1c8671a5cc88a36b35d","550ae2de3f2f841221ddcf681b21dfc7","0dc374a057895e36517e0c2a37e002b7","958ee32754f34aa3c2d808a63f82f1c0","8de72725e93d461a5b110f3a06ad879b","665390864223b59edb50abcb5c6a526e","68780680376c8b110562f31c8d69f974","5e529c1175237e4e22a1dee2fa82f93d","ee590f62eb577ddb0bd3399eabbe3abe","bc782602dffc83ec0591fc2d480c9074","434ae4c68d327c886eaab52fbebc3d9b"], "ed": "6-2021", "pown": "ppppppppppppppppppppppppp", "aoid": [] }],
	'memo' : 'MyDeposit' // Optional
}

cloudbankJS.apiDepositOneStack(params).then(response => {
	console.log("Deposit finished: " + response.status)
})
```

Data Returned:

```js
{
	"status" : String,  // "importing" or "error"
	"text" : String, // Information
	"receipt" : String // receipt Number
}
```

#### apiWithdrawOneStack

Withdraws CloudCoins from the CloudBank

Input:

```js
let params = {
	'account' : '3AAF7BE8037B445F7B934FC06628ECBB', // Account Name
	'pk' : '3AAF7BE8037B445F7B934FC06628ECBB', // Password
	'amount' : 10, // Amount to withraw
	'memo' : 'MyDeposit' // Optional
}

cloudbankJS.apiWithdrawOneStack(params).then(response => {
	console.log("Deposit finished: " + response.status)
})
```

Data Returned:

```js
{
	"status" : String,  // "success" or "error"
	"text" : String, // Information
	"stack" : String // Stack file
}
```

#### apiGetReceipt

Retrievs a receipt from the CloudBank

Input:

```js
let params = {
	'account' : '3AAF7BE8037B445F7B934FC06628ECBB', // Account Name
	'rn' : '1AAF7BE8037B445F7B934FC06628ECBB', // Receipt ID
}

cloudbankJS.apiGetReceipt(params).then(response => {
	console.log("GetReceipt finished: " + response.status)
})
```

Data Returned:

```js
{
	"status" : String,  // "success" or "error"
	"text" : String, // Information
	"receiptId" : String, // Receipt ID
	"total_authentic" : Number, // Total Number of authentic Notes
	"total_counterfeit" : Number, // Total Number of counterfeit Notes
	"total_fracked": Number, // Total Number of fracked Notes
	"total_unchecked": Number // Total Number of unchecked Notes
}
```

#### apiShowCoins

Shows Coins in the CloudBank

Input:

```js
let params = {
	'account' : '3AAF7BE8037B445F7B934FC06628ECBB', // Account Name
	'pk' : '1AAF7BE8037B445F7B934FC06628ECBB', // Private Key
}

cloudbankJS.apiShowCoins(params).then(response => {
	console.log("ShowCoins finished: " + response.status)
})
```

Data Returned:

```js
{
	"status" : String,  // "success" or "error"
	"text" : String, // Information
	"ones" : Number, // Total Number of 1s Notes
	"fives" : Number, // Total Number of 5s Notes
	"twentyfives" : Number, // Total Number of 25s Notes
	"hundreds" : Number, // Total Number of 100s Notes
	"twohundredfifties" : Number, // Total Number of 250s Notes
	"total" : Number // Total Amount
}
```

#### apiSendToSkyWallet

Sends Coins to a remote skywallet

Input:

```js
let params = {
	'account' : '3AAF7BE8037B445F7B934FC06628ECBB', // Account Name
	'pk' : '1AAF7BE8037B445F7B934FC06628ECBB', // Private Key
	'to : 'myskw.skywallet.cc', // Remote Skywallet
	'amount' : 10,  // Amount to send
	'memo' : 'mymemo' // Optional

}

cloudbankJS.apiSendToSkyWallet(params).then(response => {
	console.log("Sender finished: " + response.status)
})
```

Data Returned:

```js
{
	"status" : String,  // "importing" or "error"
	"text" : String, // Information
	"receipt" : String // receipt Number
}
```

#### apiTransferBetweenSkyWallets

Sends Coins from CloudBank Skywallet to a remote skywallet

Input:

```js
let params = {
	'account' : '3AAF7BE8037B445F7B934FC06628ECBB', // Account Name
	'pk' : '1AAF7BE8037B445F7B934FC06628ECBB', // Private Key
	'to : 'myskw.skywallet.cc', // Remote Skywallet
	'amount' : 10,  // Amount to send
	'memo' : 'mymemo' // Optional

}

cloudbankJS.apiTransferBetweenSkyWallets(params).then(response => {
	console.log("Transfer finished: " + response.status)
})
```

Data Returned:

```js
{
	"status" : String,  // "importing" or "error"
	"text" : String, // Information
	"receipt" : String // receipt Number
}
```

#### apiReceiveFromSkyWallet

Downloads Coins from Cloubank Skywallet

Input:

```js
let params = {
	'account' : '3AAF7BE8037B445F7B934FC06628ECBB', // Account Name
	'pk' : '1AAF7BE8037B445F7B934FC06628ECBB', // Private Key
	'memo' : 'mymemo' // Optional

}

cloudbankJS.apiReceiveFromSkyWallet(params).then(response => {
	console.log("Receiver finished: " + response.status)
})
```

Data Returned:

```js
{
	"status" : String,  // "importing" or "error"
	"text" : String, // Information
	"receipt" : String // receipt Number
}
```

# POSJS
