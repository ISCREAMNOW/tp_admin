<?php
$options = array();
$options['apikey'] = sysconf('mobile_key'); //apikey
$options['signature'] =  sysconf('mobile_signature'); //签名
return $options;
?>