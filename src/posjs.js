import raidaJS from 'raidajs'
//import CryptoJS from 'crypto-js'
//
import md5 from 'blueimp-md5'

class POSJS {

	constructor(options) {
		this.options = {
			timeout: 10000, //ms
			assetURL: 'https://cloudcoin.global/assets',
			action : '',
			maxFailedEchoRaidas : 2,
			merchant_skywallet: '',
			maxCoins: 20000,
			maxCoinsPerIteraiton: 50,
			...options

		}
	
		this.echoDone = new Promise(resolve => {
			this.raidajs = new RaidaJS({'timeout' : this.options.timeout, 'maxCoins': this.options.maxCoins, 'maxCoinsPerIteraiton' : this.options.maxCoinsPerIteraiton})
			this.raidajs.apiEcho().then((resp) => {
				resolve(resp)
			})
		})

		this.data = {}
		this.initWidget()
	}

	async show(data) {
		this.hideError()

		document.getElementById("posMain").style.display = "flex"
		document.getElementById("posSecondary").style.display = "none"

		if (!('guid' in data)) {
			data.guid = this.raidajs._generatePan()
		} else {
			if (!/^([A-Fa-f0-9]{32})$/.test(data.guid)) {
				this.showError("Invalid GUID format")
				this._toggleModal()
				return
			}
		}

		if (this.options.merchant_skywallet == '') {
			this.showError("Merchant SkyWallet is not defined")
			this._toggleModal()
			return
		}

		if (this.options.action == '') {
			this.showError("Action is not defined")
			this._toggleModal()
			return
		}


		if (!('amount' in data)) {
			this.showError("Amount is not defined")
			this._toggleModal()
			return
		}

		if (data.amount <= 0) {
			this.showError("Amount is negative or zero")
			this._toggleModal()
			return
		}

		//if ('merchantData' in data)
		//	data.merchantData = encodeURIComponent(data.merchantData)

		let sn = await this.raidajs._resolveDNS(this.options.merchant_skywallet)
		if (sn == null) {
			this.showError("Failed to resolve Merchant SkyWallet")
			this._toggleModal()
			return
		}

		data.sn = sn
		data.merchant_skywallet = this.options.merchant_skywallet
		this.data = data
		this.fillData()

		this._toggleModal()
	//	this.echoDone.then(resp => {
	//		console.log("echo done")
	//		console.log(resp)
	///	})

	}
	showLightError(errTxt) {
		let e = document.getElementById("posError")
		e.style.display = 'flex'
		e.innerHTML = "Error: " + errTxt
	}

	showError(errTxt) {
		let e = document.getElementById("posError")
		e.style.display = 'flex'
		e.innerHTML = "Error: " + errTxt

		let m = document.getElementById("posMain")
		m.style.display = 'none'

		this.setText("")
	}

	hideError() {
		let e = document.getElementById("posError")
		e.style.display = 'none'

		let m = document.getElementById("posMain")
		m.style.display = 'flex'
	}

	fillData(data) {
		let e = document.getElementById("posDue")
		e.innerHTML = this.numberWithCommas(this.data.amount)
	}

	loadCSS() {
		let cssId = 'posExtCss'
		if (document.getElementById(cssId))
			return

		let head = document.getElementsByTagName('head')[0]
		let link = document.createElement('link')
		link.id = cssId
		link.rel = 'stylesheet'
		link.type = 'text/css'
		link.href = this.options.assetURL + "/ext.css"
		link.media = "all"

		head.appendChild(link)
	}

	loadImages() {
		let data = {
			'posImg' : 'background.jpg',
			'posImgDue' : 'cc.jpg'
		}

		for (var key of Object.keys(data)) {
			let file = data[key]
			let node = document.getElementById(key)
			let img = new Image()
			img.onload = function() {
				node.src = this.src
			}
			img.src = this.options.assetURL + "/" + file
		}

		document.getElementById("posSendButton").style.backgroundImage = "url('" + this.options.assetURL + "/button.png')"
	}

	loadFonts() {
		let wf = document.createElement('script')
		let s = document.scripts[0];
		wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
		wf.async = true;
		s.parentNode.insertBefore(wf, s);
		wf.onload = function() {
			WebFont.load({
				google: { 
					families: ['Roboto'] 
				} 
			}); 
		}
	}

	numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	setText(text) {
		let d = document.getElementById("posText")
		if (d == null)
			return
		d.innerHTML = text
	}


	sendDataToBackend() {
		let str = Object.keys(this.data).map(key => key + "=" + this.data[key]).join("&")
		let redirectURL = this.options.action + "?" + str

		document.location = redirectURL
	}

	async handleSend() {
		let posName = document.querySelector("#posName").value
		let posDate = document.querySelector("#posDate").value
		let posNumber = document.querySelector("#posNumber").value
		let posCVV = document.querySelector("#posCVV").value

	//	this.showScreen()
	//	this.setText("Sending Coins... Please wait")
	//	this.showError("sss")
	//	return
	//
	//
	
		if (posName == "" || posCVV == "" || posDate == "" || posNumber == "") {
			this.showLightError("All fields are required")
			return
		}

		let sn = await this.raidajs._resolveDNS(posName)
		if (sn == null) {
			this.showLightError("DNS problem. Try again later")
			return
		}

		if (!posNumber.startsWith("401") && !posNumber.startsWith("901")) {
			this.showLightError("Invalid Card")
			return
		}

		if (!/^\d{4,6}$/.test(posCVV)) {
			this.showLightError("Invalid CVV")
			return
		}

		posNumber = posNumber.split(' ').join("")
		let precardNumber = posNumber.substring(0, posNumber.length - 1)
		let reverse = precardNumber.split("").reverse().join("")
		let total = 0
		for (let i = 0; i < reverse.length; i++) {
			let num = parseInt(reverse.charAt(i))
			if ((i + 3) % 2) {
				num *= 2
				if (num > 9)
					num -= 9
			}
			total += num;
		}

		let remainder = posNumber.substring(posNumber.length - 1)
		let calcRemainder = 10 - (total % 10)
		if (calcRemainder == 10)
			calcRemainder = 0

		if (calcRemainder != remainder) {
			this.showLightError("Card Validation Failed")
			return
		}

		let part = posNumber.substring(3, posNumber.length - 1)
		let ans = []
		for (let i = 0; i < 25; i++) {
			let seed = "" + i + sn + part + posCVV
			//ans[i] = "" + CryptoJS.MD5(seed)
			ans[i] = md5(seed)
		}

		let data = {
			'sn' : sn,
			'to' : this.options.merchant_skywallet,
			'amount' : this.data['amount'],
			'memo': this.data['guid'],
			'an' : ans
		}

		this.showScreen()
		this.setText("Sending Coins... Please wait<br>Completed: 0/50")

		let resp = await this.echoDone
		if (resp.status != 'done') {
			this.showError("Echo Failed. Can't continue")
			return
		}

		let maxOnline = 25 - this.options.maxFailedEchoRaidas
		if (resp.onlineServers < maxOnline) {
			this.showError("Only " + maxOnline + " RAIDA servers can be contacted")
			return
		}


		let cnt = 0
		let prevbatch = 0;
		let prevoperation = "";
		this.raidajs.apiTransfer(data, (raidaNumber, operation, batch) => {
			console.log("r = " +raidaNumber + ", op="+operation + " b="+batch)
			if (prevoperation != operation) {
				prevoperation = operation
				cnt = 0
			}

			if (operation == 'show') {
				cnt++
				this.setText("Querying Coins... Please wait<br>Completed: " + cnt + "/25")
				return
			}

			if (operation == 'break_in_bank') {
				cnt++
				this.setText("Breaking Coins... Please wait<br>Completed: " + cnt + "/25")
				return
			}


			if (batch != prevbatch) {
				prevbatch = batch
				cnt = 0
			}

			cnt++
			if (cnt > 25)
				return

			this.setText("Sending Coins... Please wait<br>Completed: " + cnt + "/25<br>Batch #" + batch)
		}).then(response => {
			if (response.status == 'error') {
				this.showError(response.errorText)
				return
			}

			this.setText("Transfer Completed")
			this.data.customer_skywallet = posName
			this.sendDataToBackend()
		})
		

//		let res = this.raidajs
	}

	handleDate(event) {
		let posDate = document.querySelector("#posDate")

		let keyCode = event.keyCode ? event.keyCode : event.which
                if (keyCode == 13) 
                        return false

		let x = String.fromCharCode(keyCode)
		if (!/^\d$/.test(x))
			return false

		let val = posDate.value
		if (val.length == 2)
			posDate.value = val + "/"

	}

	handlePosNumber(event) {
		let posNumber = document.querySelector("#posNumber")
		let keyCode = event.keyCode ? event.keyCode : event.which
                if (keyCode == 13) 
                        return false

		let x = String.fromCharCode(keyCode)
		if (!/^\d$/.test(x))
			return false

		let val = posNumber.value
		let l = val.replace(/ +/g, "")
		if (l.length >= 16)
			return false

		if (val && !(l.length % 4))
			posNumber.value = val + " " 

	}

	
	showScreen() {
		let html = `
			<div class="posRow" id="posText">
			</div>
		`

		let div = document.getElementById("posMain")
		div.style.display = "none"
		
		div = document.getElementById("posSecondary")
		div.style.display = "flex"
		div.innerHTML = html
	}

	initWidget() {
		let html = `
		<div class="posModal" style='visibility: hidden'>
			<div class="posModalContent">
				<div class="posModalHeader"><span class="posCloseButton">&times;</span></div>
				<div class="posError" id="posError">Error</div>
				<div class="posMain" id="posMain">
					<form>
					<div class="posRowImg">
						<img id="posImg" />
					</div>
					<div class="posRow posRowDue">
						Total Due: <span id="posDue"></span><img id="posImgDue">
					</div>
					<div class="posRow">
						<label class="posLabel">SkyWallet Address</label>
						<input class="posInput" type="text" id="posName" autocomplete="cc-name" placeholder="john.skywallet.cc">
					</div>
					<div class="posRow">
						<label class="posLabel">Card Number</label>
						<input class="posInput" type="text" id="posNumber" placeholder="0000 0000 0000 0000" autocomplete="cc-number" maxlength="19">
					</div>
					<div class="posRow">
						<div class="posHolder">
							<div class="posCol">
								<label class="posLabel">Expiry Date</label>
								<input class="posInputSmall" type="text" name="posexpirydate" placeholder="MM/YY" autocomplete="cc-exp" maxlength="5" id="posDate">
							</div>
							<div class="posCol">
								<label class="posLabel">CVV</label>
								<input class="posInputSmall" name="cvv" id="posCVV" maxlength="6" autocomplete="cc-csc" type="password">
							</div>
							<div class="posCol">
								<label class="posLabel">&nbsp;</label>
								<button class="posButton" id="posSendButton" type="button"></button>
							</div>
						</div>
					</div>
					<div class="posRow" style="text-align:center">&nbsp;
						Get a Skywallet <a href="https://www.skywallet.cc/debit_card.html">Here</a>
					</div>
					</form>
				</div>
				<div class="posMain" style="display:none" id="posSecondary">
				</div>
			</div>
		</div>
		`

		let div = document.createElement('div')
		div.innerHTML = html.trim()

		document.addEventListener('DOMContentLoaded', () => {
			this.loadCSS()
			this.loadFonts()

			document.body.appendChild(div)
			this.loadImages()
			this.modal = document.querySelector(".posModal")
			let closeButton = document.querySelector(".posCloseButton")
			let sendButton = document.querySelector("#posSendButton")

			let posNumber = document.querySelector("#posNumber")
			let posDate = document.querySelector("#posDate")
			posNumber.addEventListener("keypress", (e) => { this.handlePosNumber(e) })
			posDate.addEventListener("keypress", (e) => { this.handleDate(e) })

			closeButton.addEventListener("click", (evt) => { evt.preventDefault(); this._toggleModal() })
			sendButton.addEventListener("click", (evt) => { evt.preventDefault(); this.handleSend() })
			window.addEventListener("click", event => {
				if (event.target === this.modal) {
					this._toggleModal()
				}

			})
		})
	}

	_toggleModal() {
		if (this.modal == null)
			return
		this.modal.classList.toggle("posShowModal")
		this.modal.style = ""
	}

}

window.POSJS = POSJS

