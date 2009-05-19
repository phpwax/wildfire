<?php

class OpenFlashChart {
  
  public $title =     array();
  public $elements =  array();
  public $y_legend =  array();
  public $x_axis =    array();
  public $y_axis =    array();
  
  public function add_title($text, $style="{font-size: 20px; color:#333; font-family: Verdana; text-align: center;}") {
    $this->title = array("text"=>$text, "style"=>$style);
  }
  
  public function add_element($options=array()) {
    $this->elements[]=$options;
  }
  
  public function add_y_legend($text, $style="{font-size: 20px; color:#333; font-family: Verdana; text-align: center;}") {
    $this->y_legend=array("text"=>$text,"style"=>$style);
  }
  
  public function add_x_axis($options=array()) {
    $this->x_axis = $options;
  }
  
  public function add_y_axis($options=array()) {
    $this->y_axis = $options;
  }
  
  public function render() {
    return json_encode($this);
  }
  
}

