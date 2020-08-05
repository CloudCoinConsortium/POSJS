<?php
// sample_backend.php
// Created by RAIDATech
// Author Sean H. Worthington 7/31/2020
// Demo to confirm that a customer has sent enough CloudCoins to your Skywallet.
// Sample Call:
// http://localhost/pos/action.php?amount=100&guid=fbc9d52a08bf41ffbb8361ca804ef138&merchant_skwyallet=sean.cloudcoin.global&merchantData=nothinghere

/* 1. LOAD THE 'GET' VARIABLES   */

	$received_from = $_GET['merchant_skywallet'];
	$amount_due = $_GET['amount'];
	$receipt_guid = $_GET['guid'];
	$merchantData = $_GET['merchantData'];
	//Validate inputs (see helper functions below)
	
	echo( "<h2>GET Variables Sent</h2>skywallet : $received_from<br>amount : $amount_due<br>guid : $receipt_guid<br>merchantData : $merchantData<br>");
	
	
/* 2. Check that this order has not been processed before */
	// $past_order_count = SELECT COUNT(*) FROM orders WHERE order_id = $receipt_guid
			$past_order_count = 0;
	if( $past_order_count > 0 ) {
		echo("This order has already been processed.");
	}

 
/* 3. Parse Merchant's data  */ 
	
	// Simulating that merchant data is for one product. Checking DB for price. 
	$merchantData ="1 each product 3388773";
	// SELECT price FROM products WHERE product_name ='$merchantData';
	// $total_due = $row['price'];
	$total_due = 100; 
	
	
/* 4. Call raida_go program to see how many CloudCoins were sent to your Skywallet */
 
	//$command = "./raida_go receive $receipt_guid"; //This is for Linux. 
	$command = "E:/Documents/pos/raida_go.exe receive $receipt_guid $received_from"; //This is for Windows 
	echo "<br>The command is $command<br>";
	$json_obj = exec($command); //Returns something like: {"amount_verified":100}
	echo "<br>The comand returned: $json_obj<br>";
	$arr = json_decode($json_obj, true);
	$amount_verified = $arr["amount_verified"];
	echo "<br>The amount verfified is $amount_verified.<br>";
	


/* 5. Decisions based on amount verified */

	if( $amount_verified == $total_due ){
		
		echo("Thank you for your payment. Your order is being processed");
		/* Process Payment */
		// INSERT INTO orders ( order_id, product, amount, customer) 
		// VALUES ( $recrupt_guid, $merchantData, $total_due, $received_from );
		die();
	
	}// end if no CloudCoins were received

	if( $amount_verified == 0 ){
		// This should not happen
		die("No CloudCoins Were Received. Please check your Skywallet's balance to see if you have funds.");
	}// end if no CloudCoins were received

	if( $amount_verified > $total_due ){
		// The customer sent too much money. 
		echo( "Thank you for your purchase. You sent us more CloudCoins than were owed. We have credited your account.");
		// or
		// echo( "Thank you for your purchase. You have sent your change to your Skywallet Account.");
		// $command = "./raida_go send $received_from $change_due";//Linux. Different for Windows
		// $exec($command); 
		die();
	}
	
	if( $amount_verified < $total_due ){
	
		echo( "$amount_due was needed but we only received $amount_verified. We have credited your account.");
		// or
		// echo( "$amount_due was needed but we only received $amount_verified. We have returned your payment.");
		// $command = "./raida_go send $received_from $change_due";//Linux. Different for Windows
		// $exec($command); 
		die();
	}
		
	die();

/* Helper Functions */

	function isValidSkywallet( $received_from ){
		//A skywallet address should have three parts like this: billy.mydomain.com
		$pattern = "(?=^.{1,254}$)(^(?:(?!\d+\.)[a-zA-Z0-9_\-]{1,63}\.?)+(?:[a-zA-Z]{2,})$)";
		return preg_match($pattern, $received_from );
	}//end validate skywallet address
	
	function isValidHexStr(string $hexStr, int $length){
		if( strlen($hexStr) === $length && ctype_xdigit($hexStr)){ 
			return true;
		}else{ 
			return false;
		} 
	}//end is valide hex

?>
