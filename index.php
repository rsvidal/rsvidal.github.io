<?php 

include "app/config.php";
include "app/detect.php";

if ($page_name=='') {
	include 'web/index.html';
	}
elseif ($page_name=='index.html') {
	include 'web/index.html';
	}
else {
	include 'web/404.html';
}
?>
