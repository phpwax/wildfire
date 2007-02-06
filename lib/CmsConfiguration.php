<?php

class CmsConfiguration extends WXActiveRecord{
    
  static public function get($name) {
    $conf = new CmsConfiguration;
    if($result = $conf->find_by_name($name)) {
      return $result->value;
    }
    return false;
  }
  
  public function set($name, $value) {
    $conf = new CmsConfiguration;
    if($result = $conf->find_by_name($name)) {
      $result->update_attributes("value"=>$value);
    } else {
      $conf = new CmsConfiguration;
      $conf->update_attributes("name"=>$name, "value"=>$value);
    }
    return true;
  }
 	
}
?>