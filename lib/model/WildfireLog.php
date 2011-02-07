<?php

class WildfireLog extends WaxModel {
  
    
  public function setup() {
    $this->define("language", "CharField");
    $this->define("page", "CharField");
    $this->define("action", "CharField");
    $this->define("controller", "CharField");
    $this->define("user", "ForeignKey", array("target_model"=>"WildfireUser"));
    $this->define("param_string", "TextField");
    $this->define("time", "DateTimeField");
  }

  public function before_save(){
    $this->time = date("Y-m-d H:i:s");
  }
  
	
}

?>