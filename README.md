# Point of Sale

In order to use POS JS library you need to instantiate POSJS Object
The widget is opened by the show() method of the object

Example:

```html
<!DOCTYPE html>
<html lang="en">
        <head>
                <script src="posjs.min.js" type="text/javascript"></script>
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


## POSJS configuration

```js
{
'timeout' : Number // Timeout for calling RAIDA servers
'action' : String // URL to send results
'merchant_skywallet' : String // Merchant Skywallet
}
```


## Data structure
```js
{
'amount' : Number // Amount to send
'param1' : String // Any parameter to send
}
```
