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
                        var pos = new POSJS({'timeout':'5000', 'assetURL' : 'https://e12.miroch.ru', 'backendEndpoint': 'https://e12.miroch.ru/backend.php'})
                        var data = {
                                'skywallet' : 'ax2.skywallet.cc',
                                'amount' : 100,
                                'guid' : '6de9439834c9147569741d3c9c9fc011',
                                'merchantData' : 'key0=value0;key1=value1;key2=value2'
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
'assetURL' : String // Optional. URL to download assets (images, scripts & stylesheets)
'backendEndpoint : String // URL to send results
}
```


## Data structure
```js
{
'skywallet' : String // Merchant's SkyWallet
'amount' : Number // Amount to send
'guid' : String // 32hex chars receipt ID. Optional. If not defined it will be generated by the POSJS
'merchantData' : String // String to send to the Backend
}
```
