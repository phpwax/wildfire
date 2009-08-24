<?php

class WildfireLog extends WaxModel {
  
    
  public function setup() {
    $this->define("language", "CharField");
    $this->define("page", "CharField");
    $this->define("action", "CharField");
    $this->define("controller", "CharField");
    $this->define("user", "ForeignKey", array("target_model"=>"WildfireUser"));
    $this->define("time", "DateTimeField");
  }

  public function by() {
    return $this->user->fullname;
  }
  
  public function action_time(){
		return date('jS F Y @ H:i', strtotime($this->time));
	}
	
}

?>