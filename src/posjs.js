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

		this.initWidget()
	}

	show(data) {
		console.log(data)

		let guid
		if (!data.hasOwnProperty('guid')) {
			guid = this.raidajs._generatePan()
		} else {
			guid = data.guid
		}

		console.log(guid)

		console.log("tm")
		console.log(this.modal)
		this._toggleModal()
		this.echoDone.then(resp => {
			console.log("echo done")
			console.log(resp)
		})

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


	initWidget() {
		let html = `
		<div class="posModal" style='visibility: hidden'>
			<div class="posModalContent">
				<span class="posCloseButton">&times;</span>
				<h1>sdsds</h1>
			</div>
		</div>
		`

		let div = document.createElement('div')
		div.innerHTML = html.trim()

		document.addEventListener('DOMContentLoaded', () => {
			this.loadCSS()

			document.body.appendChild(div)
			this.modal = document.querySelector(".posModal")
			let closeButton = document.querySelector(".posCloseButton")

			closeButton.addEventListener("click", () => { this._toggleModal() })
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

