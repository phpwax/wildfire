<?php

/**
 * Content Filter Class
 * Stores a chain of filters that can pre and post process the content
 *
 * Custom filters can also be made by the user to process content.
 *
 * @package PhpWax
 **/
class CmsContentFilter {
  
  public $pre_filters = array();
  public $post_filters = array();
  public $content = "";
  
  public function __construct() {
    
  }
  
  /**
   * run_pre_filters function
   *
   * @return $content
   **/
  public function run_pre_filters() {
    
  }
  
  /**
   * undocumented function
   *
   * @return void
   * @author /bin/bash: niutil: command not found
   **/
  function ()
  {
  }

} 
?>