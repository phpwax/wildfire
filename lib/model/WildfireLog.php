<?php

class WildfireLog extends WaxModel {
  
    
  public function setup() {
    $this->define("action", "CharField");
    $this->define("user", "ForeignKey", array("target_model"=>"WildfireUser"));
    $this->define("action_time", "DateTimeField");
  }

  public function by() {
    return $this->user->fullname;
  }
  
  public function action_time(){
		return date('d/m/Y @ H:i', strtotime($this->time));
	}
	
}

?>