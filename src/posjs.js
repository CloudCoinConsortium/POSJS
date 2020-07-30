import raidaJS from 'raidajs'

class POSJS {

	constructor(options) {
		console.log(options)

		this.options = {
			timeout: 10000, //ms
			assetURL: 'https://cloudcoin.global/posassets',
			...options

		}
	
		this.echoDone = new Promise(resolve => {
			this.raidajs = new RaidaJS({'timeout' : this.options.timeout})
			this.raidajs.apiEcho().then((resp) => {
				console.log("done")
				console.log(resp)
				resolve(resp)

			})
		})

		this.data = {}
		this.initWidget()
	}

	async show(data) {
		this.hideError()

		let guid
		console.log(data)
		if (!('guid' in data)) {
			guid = this.raidajs._generatePan()
		} else {
			guid = data.guid
			if (!/^([A-Fa-f0-9]{32})$/.test(guid)) {
				this.showError("Invalid GUID format")
				this._toggleModal()
				return
			}
		}

		if (!('skywallet' in data)) {
			this.showError("Merchant SkyWallet is not defined")
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

		let sn = await this.raidajs._resolveDNS(data.skywallet)
		if (sn == null) {
			this.showError("Failed to resolve Merchant SkyWallet")
			this._toggleModal()
			return
		}

		data.sn = sn
		this.data = data
		this.fillData()

		this._toggleModal()
		this.echoDone.then(resp => {
			console.log("echo done")
			console.log(resp)
		})

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
			'posImg' : 'max.skywallet.cc.png'
		}

		for (var key of Object.keys(data)) {
			console.log(key)
			let file = data[key]
			let node = document.getElementById(key)
			let img = new Image()
			img.onload = function() {
				node.src = this.src
			}
			img.src = this.options.assetURL + "/" + file
			console.log(img.src)
		}
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

	handleSend() {
		this.showLightError("Sorry")


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

		console.log("yyy")

	}

	initWidget() {
		let html = `
		<div class="posModal" style='visibility: hidden'>
			<div class="posModalContent">
				<div class="posModalHeader"><span class="posCloseButton">&times;</span></div>
				<div class="posError" id="posError">Error</div>
				<div class="posMain" id="posMain">
					<div class="posRow">
						<img id="posImg" />
					</div>
					<div class="posRow">
						Total Due: <span id="posDue"></span> CC
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
								<input class="posInputSmall" type="text" name="cvv" id="posCVV" maxlength="6" autocomplete="cc-csc" type="password">
							</div>
							<div class="posCol">
								<button class="posButton" id="posSendButton">Send</button>
							</div>
						</div>
					</div>

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

			closeButton.addEventListener("click", () => { this._toggleModal() })
			sendButton.addEventListener("click", () => { this.handleSend() })
			window.addEventListener("click", event => {
				if (event.target === this.modal) {
					this._toggleModal()
				}

			})
		})
	}

	_toggleModal() {
		console.log(this.modal)
		if (this.modal == null)
			return
		this.modal.classList.toggle("posShowModal")
		this.modal.style = ""
	}

}

window.POSJS = POSJS

