<?php

function run_tests() {
  if($_GET['p']) $argv[1] = $_GET['p'];
  ob_start();
  include("../script/run_all_tests");
  $res = ob_get_contents(); 
  ob_clean();
  $res = str_replace("#!/usr/bin/php", "", $res);
  echo $res;
}
run_tests();


?>