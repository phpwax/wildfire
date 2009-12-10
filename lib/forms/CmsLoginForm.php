<?php


class CmsLoginForm extends WaxForm {
  
  public $submit=false;
  
  public function setup(){
    $this->add_element("username", "TextInput", array("editable"=>true));
    $this->add_element("password", "PasswordInput", array("editable"=>true));
  }
}