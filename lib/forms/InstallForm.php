<?php
class InstallForm extends WaxForm {
  public $submit_text = "Create Administrator";
    
  public function setup() {
    $this->attributes['class'] .= " form_container";
    $this->define("username", "TextInput", array("required"=>true));
    $this->define("password", "TextInput", array("required"=>true));
  }
}

?>