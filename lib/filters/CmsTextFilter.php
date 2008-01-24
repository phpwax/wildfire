<?php

/**
 * CmsTextFilter class
 *
 * @package default
 **/
class CmsTextFilter  {
  
  static public $allowed_tags = '<p><strong><em><a><h1><h2><h3><h4><h4><h5><h6><blockquote><ul><ol><li><span><form><input><img>';
  
  static public $filters = array(
    "before_save"=>array("clean_word", "strip_attributes", "correct_entities", "clean_html"),
    "before_output"=> array("first_para_hook", "no_widows", "ampersand_hook", "strip_slashes")
  );
  
  static public function add_filter($trigger, $method) {
    self::$filters[$trigger][]=$method;
  }
  
  static public function remove_filter($trigger, $method) {
    unset(self::$filters[$trigger][array_search($method, self::$filters[$trigger])]);
  }

  static public function filter($trigger, $text) {
    foreach(self::$filters[$trigger] as $method) {
      $text = self::$method($text);
    }
    return $text;
  }
  
  static public function clean_html($text) {
    // strip tags, still leaving attributes, second variable is allowable tags
    return strip_tags($text, self::$allowed_tags);
  }
  
  static public function correct_entities($text) {
    return str_replace("£", "&pound;", $text);
  }
  
  static public function strip_slashes($text) {
    return stripslashes($text);
  }
  
  static public function strip_attributes($text) {
    return preg_replace("/<(p|h1|h2|h3|h4|h5|h6|ul|ol|li|span)([^>]*)>/", "<$1>", $text);
  }
  
  static public function clean_word($text) {
    $search = array(chr(0xe2) . chr(0x80) . chr(0x98),
                      chr(0xe2) . chr(0x80) . chr(0x99),
                      chr(0xe2) . chr(0x80) . chr(0x9c),
                      chr(0xe2) . chr(0x80) . chr(0x9d),
                      chr(0xe2) . chr(0x80) . chr(0x93),
                      chr(0xe2) . chr(0x80) . chr(0x94),
                      chr(0xe2) . chr(0x80) . chr(0xa6),
											chr(194) );

    $replace = array("'",
                     "'",
                     '"',
                     '"',
                     '&ndash;',
                     '&mdash;',
                     "...");

    return str_replace($search, $replace, $text);
  }
  
  
  static public function first_para_hook($text) {
    return preg_replace("/<p>/", "<p class='first_para'>", $text, 1);
  }
  
  static public function dots_to_hr($text) {
    return preg_replace("/\.{4,}/", "<hr />", $text);
  }
  
  static public function no_widows($text) {
    $widont_finder = "/(\s+)                    # the space to replace
      ([^<>\s]+                                 # must be followed by non-tag non-space characters
      \s*                                       # optional white space! 
      (<\/(a|em|span|strong|i|b)[^>]*>\s*)*     # optional closing inline tags with optional white space after each
      (<\/(p|h[1-6]|li)|$))                     # end with a closing p, h1-6, li or the end of the string
      /x";
    return preg_replace($widont_finder, '&nbsp;\\2', $text);
  }
  
  static public function ampersand_hook($text) {
    $amp_finder = "/(\s|&nbsp;)(&|&amp;|&\#38;)(\s|&nbsp;)/";
    return preg_replace($amp_finder, '\\1<span class="amp">&amp;</span>\\3', $text);
  }


} // END class 