<?php
	$nombre = $_POST['nombre'];
	$email = $_POST['email'];
	$mensaje = $_POST['mensaje'];
	$para = 'sanvidal1@gmail.com';
	$titulo = 'Message from www.rafaelsanvidal.com';
	$header = 'From: ' . $email;
	$msjCorreo = "Name: $nombre\n E-Mail: $email\n Message:\n $mensaje";
	  
	if ($_POST['submit']) 
	{
		if (mail($para, $titulo, $msjCorreo, $header)) {
			echo "<script language='javascript'>
					alert('The message has been sent sucessully, thank you');
					window.location.href = 'http://www.rafaelsanvidal.com';
				</script>";
		}
		else {
			echo "<script language='javascript'>
				alert('Sorry, the message hasn't been sent');
				window.location.href = 'http://www.rafaelsanvidal.com';
			</script>";
		}
	}
?>
