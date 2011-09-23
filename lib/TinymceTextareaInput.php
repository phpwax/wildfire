<?php


/**
 * TinymceTextareaInput Widget class
 *
 * @package PHP-Wax
 **/
class TinymceTextareaInput extends TextareaInput {

  public $class = "input_field textarea_field tinymce";
  
  public function tag_content(){
    return  $this->value;
  }


} // END class