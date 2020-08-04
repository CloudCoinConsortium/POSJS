# Point of Sale Java Script Library

In order to use POS JS library you need to instantiate POSJS Object
The widget is opened by the show() method of the object

Example:

```html
<!DOCTYPE html>
<html lang="en">
        <head>
                <script src="https://cloudcoin.global/assets/posjs.min.v003.js" type="text/javascript"></script>
                <script type="text/javascript">
                        var pos = new POSJS({'timeout':'5000', 'action': 'https://e12.miroch.ru/backend.php', 'merchant_skywallet':'ax2.skywallet.cc'})
                        var data = {
                                'amount' : 100,
				'param1' : 'value1',
				'param2' : 'vaule2'
                        }
                </script>
        </head>
        <body>
                <div><button onclick="pos.show(data)">PAY WITH CLOUDCOIN</button></div>
        </body>
</html>

```
Another Example:

```html
<!DOCTYPE html>
<html lang="en">
        <head>
                <script src="https://cloudcoin.global/assets/posjs.min.v003.js" type="text/javascript"></script>
                <script type="text/javascript">
                  
                        var pos = new POSJS({
				'timeout':'5000',
				'action': 'https://yourdomain.com/your_action_page.php', 
				'merchant_skywallet' : 'Your.skywallet.cc'
			})
                         var get_parameters = {}; // Create a get_parameters object to hold GET parameters for your action page.
                         get_parameters.amount = 100;  // Mandatory GET variable specifies the amount of CloudCoins to be paid.                        
                         get_parameters.customerID = '1554887'; // Optional Merchant Variable customized by you but must be a String. 
                </script>
        </head>
        <body>
                <div>
			<img onclick='pos.show(get_parameters)' src='https://cloudcoin.global/assets.paywithcc.001.png' width='100' alt='Pay with Cloud Coin'>
		</div>
        </body>
</html>

```


## POSJS configuration

```js
{
'timeout' : Number // Timeout for calling RAIDA servers
'action : String // URL to send results
'merchant_skywallet' // The merchant's skywallet that will receive payments such as 'payments.domain.com'
}
```


## Data structure
```js
{
'amount' : Number // Amount of Cloudcoins the customer should send you. This is manditory and must be included. 
'param1' : String // Any GET parameter that you want to create and have sent to  your action page.
'param2' : String // You can create all the GET parameters you like. 
```
