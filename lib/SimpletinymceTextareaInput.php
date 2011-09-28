<?php


/**
 * TinymceTextareaInput Widget class
 *
 * @package PHP-Wax
 **/
class SimpletinymceTextareaInput extends TextareaInput {

  public $class = "input_field textarea_field simpletinymce";
  
  public function tag_content(){
    return  $this->value;
  }


} // END class