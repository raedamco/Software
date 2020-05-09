<?php
//DO NOT ADD ANYTHING ABOVE THIS LINE, AS YOUR PHP SCRIPT WILL NOT WORK

$email = "austinmckee@hotmail.com";
$message = "The following information was submitted from the form on your website:\n
";
$message .= "First Name: ".$_REQUEST["First_Name__1"]."\n\n";
$message .= "Last Name: ".$_REQUEST["Last_Name__2"]."\n\n";
$message .= "Email: ".$_REQUEST["Email__3"]."\n\n";
$message .= "Subject: ".$_REQUEST["Subject__4"]."\n\n";
$message .= "Inquiry: ".$_REQUEST["Inquiry__5"]."\n\n";
$headers2 = "MIME-Version: 1.0\r\n"
           ."Content-Type: $contentType; charset=utf-8\r\n"
           ."Content-Transfer-Encoding: 8bit\r\n"
           ."From: =?UTF-8?B?".base64_encode(".$email.")."?= <".$email.">\r\n"
           ."Reply-To: ".$email."\r\n"
           ."X-Mailer: PHP/".phpversion();
mail( $email, "Form Submission from your www.gourmetgiftbasketsanddesigns.com website", $message, $headers2 );
header("Location: google.com");
?>