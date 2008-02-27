<?php

class CmsConfiguration extends WXActiveRecord {
    
  static public function get($name, $value=false) {
    $conf = new CmsConfiguration;
    if($result = $conf->find_by_name($name)) {
      if(!$value) return unserialize($result->value);
      else {
        $set = unserialize($result->value);
        return $set[$value];
      }
    }
    return false;
  }
  
  public function set($name, $value) {
    $conf = new CmsConfiguration;
    if($result = $conf->find_by_name($name)) {
      return $result->update_attributes(array("value"=>serialize($value)));
    } else {
      $conf = new CmsConfiguration;
      return $conf->update_attributes(array("name"=>$name, "value"=>serialize($value)));
    }
  }
  
 	
}
?>