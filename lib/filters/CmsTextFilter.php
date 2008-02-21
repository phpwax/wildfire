<?php

/**
 * CmsTextFilter class
 *
 * @package default
 **/
class CmsTextFilter  {
  
  static public $allowed_tags = '<p><strong><em><a><h1><h2><h3><h4><h4><h5><h6><blockquote><ul><ol><li><span><form><input><img>';
  static public $strip_tags_allow = array("<p>","<strong>","<em>","<a>","<h1>","<h2>","<h3>","<h4>","<h4>","<h5>","<h6>",
        "<blockquote>","<ul>","<ol>","<li>","<span>","<img>");
  
  static public $filters = array(
    "before_save"=>array("clean_word", "strip_attributes", "correct_entities", "strip_slashes"),
    "before_output"=> array("first_para_hook", "no_widows", "ampersand_hook", "strip_slashes", "yt_video")
  );
  
  static public function add_filter($trigger, $method) {
    self::$filters[$trigger][]=$method;
  }
  
  static public function remove_filter($trigger, $method) {
    unset(self::$filters[$trigger][array_search($method, self::$filters[$trigger])]);
  }

  static public function filter($trigger, $text) {
    foreach(self::$filters[$trigger] as $method) {
      if(is_array($method)) {
        $class = $method[0];
        $method=$method[1];
      } else $class="self";
      $text = call_user_func(array($class, $method), $text);
    }
    return $text;
  }
  
  
  static public function correct_entities($text) {
		$modified = str_replace("£", "&pound;", $text);
		$modified = str_replace("€", "&euro;", $modified);
    return $modified;
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
  
  static public function nice_quotes($text) {
    return preg_replace("/([\w\s>]?)\\\"([^\\\"]*)\\\"/", "$1<span class='leftquote'>&ldquo;</span>$2<span class='rightquote'>&rdquo;</span>",$text);
  }
  
  
  static public function yt_video($text) {
    $replace = '<object width="425" height="350">
      <param name="movie" value="http://www.youtube.com/v/$1"></param>
      <embed src="http://www.youtube.com/v/$1" type="application/x-shockwave-flash" width="425" height="350"></embed>
    </object>';
    $text = preg_replace("/<a href=\"#\" rel=\"yt_video\">([a-zA-Z\-0-9]*)<\/a>/", $replace, $text);
    return preg_replace("/<!--yt_video-->([a-zA-Z\-0-9]*)<!--\/yt_video-->/", $replace, $text);
  }


} // END class 