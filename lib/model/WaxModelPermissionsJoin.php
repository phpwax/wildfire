<?php

class WaxModelPermissionsJoin extends WaxModelJoin{

  public function setup(){
    parent::setup();
    $this->define("operation", "CharField");
   
  }
  
}

?>