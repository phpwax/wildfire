<?php

class CmsConfiguration extends WaxModel {
	
	public function setup(){
		$this->define("name", "CharField", array('maxlength'=>128));
		$this->define("value", "TextField");		
	}
    
  static public function get($name, $value=false) {
    $conf = new CmsConfiguration;
    if($result = $conf->filter(array('name'=>$name))->first()) {
      if(!$value) return unserialize($result->value);
      else {
        $set = unserialize($result->value);
        return $set[$value];
      }
    }
    return false;
  }
  
  static public function set($name, $value) {
    $conf = new CmsConfiguration;
		$result = $conf->filter(array('name'=>$name))->first();
		print_r($result);
    if($result) return $result->update_attributes(array("value"=>serialize($value)));
    else {
      $conf = new CmsConfiguration;
      return $conf->update_attributes(array("name"=>$name, "value"=>serialize($value)));
    }
  }
  
 	
}
?>