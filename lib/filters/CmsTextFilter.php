<?php

/**
 * CmsTextFilter class
 *
 * @package default
 **/
class CmsTextFilter  {
  
  
  static public $filters = array(
    "before_save"=>array("convert_chars", "strip_attributes", "strip_slashes", "inline_images"),
    "before_output"=> array("first_para_hook", "ampersand_hook", "strip_slashes", "yt_video", "videos", "csv_table", "flash_object")
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
  
  static public function utf($text) {
    return utf8_encode($text);
  }
  
  static public function htmlentities($text) {
    return htmlentities($text);
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
		$text = preg_replace("/<(table|td|tr|tbody|thead|tfoot|p)\s+([^>]*)(border|bgcolor|background|style)+([^>]*)>/i", "<$1 $2 $3\>", $text);
    return preg_replace("/<(p|h1|h2|h3|h4|h5|h6|ul|ol|li|span|font)\s+([^>]*)( class=\".*?\")([^>]*)>/i", "<$1$3>", $text);
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
      /xu";
    return preg_replace($widont_finder, '&nbsp;\\2', $text);
  }
  
  static public function ampersand_hook($text) {
    $amp_finder = "/(\s|&nbsp;)(&|&amp;|&\#38;)(\s|&nbsp;)/";
    return preg_replace($amp_finder, '\\1&amp;\\3', $text);
  }
  
  static public function nice_quotes($text) {
    return preg_replace("/(\s{1})\\\"([^<>\\\"]*)\\\"/", "$1<span class='leftquote'>&ldquo;</span>$2<span class='rightquote'>&rdquo;</span>",$text);
  }
  
	static public function videos($text){
		/*standard youtube*/
		$youtube = '<object width="$2" height="$3">
		  <param name="movie" value="http://www.youtube.com/v/$6" />
		  <embed src="http://www.youtube.com/v/$6" type="application/x-shockwave-flash" width="$2" height="$3"></embed>
		</object>';

		$text = preg_replace("/<a href=\"([^\"]*)\" rel=\"([0-9]*px):([0-9]*px)\">([^<]*)youtube([^<]*)\?v=([a-zA-Z\-0-9_]*)&?[^<]*<\/a>/", $youtube, $text);
		

		/*VIMEO*/
		$vimeo ='<object width="$2" height="$3">
							<param name="allowfullscreen" value="true" />
							<param name="allowscriptaccess" value="always" />
							<param name="movie" value="http://vimeo.com/moogaloop.swf?clip_id=$6&amp;server=vimeo.com&amp;show_title=0&amp;show_byline=0&amp;show_portrait=0&amp;color=00ADEF&amp;fullscreen=1" />
							<embed src="http://vimeo.com/moogaloop.swf?clip_id=$6&amp;server=vimeo.com&amp;show_title=0&amp;show_byline=0&amp;show_portrait=0&amp;color=00ADEF&amp;fullscreen=1" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="$2" height="$3">
							</embed>
						</object>';

		$text = preg_replace("/<a href=\"(.*)\" rel=\"([0-9]*px):([0-9]*px)\">(.*)vimeo(.*)\/([a-zA-Z\-0-9_*)([&]*)(.*)<\/a>/", $vimeo, $text);						

		/*GOOGLE*/
		$google = '<embed id="VideoPlayback" src="http://video.google.com/googleplayer.swf?docid=$6&hl=en&fs=true" width="$2" height="$3" allowFullScreen="true" allowScriptAccess="always" type="application/x-shockwave-flash"> </embed>';

		$text = preg_replace("/<a href=\"(.*)\" rel=\"([0-9]*px):([0-9]*px)\">(.*)google(.*)\?docid=([a-zA-Z\-0-9_]*)([&]*)(.*)<\/a>/", $google, $text);						

		/*LOCAL*/
		$local ='<object width="$2" height="$3">
							<param name="allowfullscreen" value="true" />
							<param name="allowscriptaccess" value="always" />
							<param name="movie" value="$4" />
							<embed src="$4" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="$2" height="$3">
							</embed>
						</object>';
		$text = preg_replace("/<a href=\"(.*)\" rel=\"([0-9]*px):([0-9]*px)\">LOCAL:(.*)<\/a>/", $local, $text);						
		
		
		return $text;
	}
  
  static public function yt_video($text) {
    $replace = '<object width="425" height="350">
      <param name="movie" value="http://www.youtube.com/v/$1"></param>
      <embed src="http://www.youtube.com/v/$1" type="application/x-shockwave-flash" width="425" height="350"></embed>
    </object>';
    $text = preg_replace("/<a href=\"#\" rel=\"yt_video\">([a-zA-Z\-0-9_]*)<\/a>/", $replace, $text);
    $text = preg_replace("/<a href=\"#\" rel=\"youtube\">([a-zA-Z\-0-9_]*)<\/a>/", $replace, $text);
    return $text;
  }
  
  static public function csv_table($text) {
    preg_match_all("/<a class=\"wildfire_csv_table\" href=\"(.*?)\".*?<\/a>/", $text, $matches, PREG_OFFSET_CAPTURE);
    foreach($matches[1] as $table_index => $table){
      $csv_file = $table[0];
      if(strpos($csv_file,"http://") !== 0) $csv_file = "http://".$_SERVER['SERVER_NAME'].$csv_file;
      if(($handle = fopen($csv_file, "r")) !== FALSE){
        $row = 0;
        $table = array();
        while(($data = fgetcsv($handle, 1000, ",")) !== FALSE){
          $row++;
          foreach($data as $col_value) $table[$row][] = $col_value;
        }
        fclose($handle);
      }
      $table_html = '<table class="wildfire_csv_table">';
      foreach($table as $row){
        $table_html .= "<tr>";
        foreach($row as $col) $table_html .= "<td>$col</td>";
        $table_html .= "</tr>\n";
      }
      $table_html .= "</table>\n";
      $start_of_match = $matches[0][$table_index][1];
      $length_of_match = strlen($matches[0][$table_index][0]);
      $text = substr($text,0,$start_of_match).$table_html.substr($text,$start_of_match+$length_of_match);
    }
    return $text;
  }
  
  static public function flash_object($text) {
    $replace = '<object {dimensions} type="application/x-shockwave-flash">
      <param name="movie" value="$1"></param>
      <embed src="$1" type="application/x-shockwave-flash" {dimensions}></embed>
      $2
    </object>';
    $source = preg_match("/<a class=\"wildfire_flash\" href=\"(.*?)\">.*?<\/a>/", $text, $matches);
    $text = preg_replace("/<a class=\"wildfire_flash\" href=\"(.*?)\">(.*?)<\/a>/", $replace, $text);
    $url = $matches[1];
    if(strpos($url,"http://")===false) $url = PUBLIC_DIR.$url;
    $info = getimagesize($url);
    return str_replace("{dimensions}",$info[3], $text);    
  }

  
  public function convert_chars($content, $flag = 'obsolete') {
  	// Translation of invalid Unicode references range to valid range
  	$wp_htmltranswinuni = array(
  	'&#128;' => '&#8364;', // the Euro sign
  	'&#129;' => '',
  	'&#130;' => '&#8218;', // these are Windows CP1252 specific characters
  	'&#131;' => '&#402;',  // they would look weird on non-Windows browsers
  	'&#132;' => '&#8222;',
  	'&#133;' => '&#8230;',
  	'&#134;' => '&#8224;',
  	'&#135;' => '&#8225;',
  	'&#136;' => '&#710;',
  	'&#137;' => '&#8240;',
  	'&#138;' => '&#352;',
  	'&#139;' => '&#8249;',
  	'&#140;' => '&#338;',
  	'&#141;' => '',
  	'&#142;' => '&#382;',
  	'&#143;' => '',
  	'&#144;' => '',
  	'&#145;' => '&#8216;',
  	'&#146;' => '&#8217;',
  	'&#147;' => '&#8220;',
  	'&#148;' => '&#8221;',
  	'&#149;' => '&#8226;',
  	'&#150;' => '&#8211;',
  	'&#151;' => '&#8212;',
  	'&#152;' => '&#732;',
  	'&#153;' => '&#8482;',
  	'&#154;' => '&#353;',
  	'&#155;' => '&#8250;',
  	'&#156;' => '&#339;',
  	'&#157;' => '',
  	'&#158;' => '',
  	'&#159;' => '&#376;'
  	);


  	// Converts lone & characters into &#38; (a.k.a. &amp;)
  	$content = preg_replace('/&([^#])(?![a-z1-4]{1,8};)/i', '&#038;$1', $content);

  	// Fix Word pasting
  	$content = strtr($content, $wp_htmltranswinuni);

  	// Just a little XHTML help
  	$content = str_replace('<br>', '<br />', $content);
  	$content = str_replace('<hr>', '<hr />', $content);

  	return $content;
  }
  
  static public function inline_images($text) {
    $matches=array();
    preg_match_all("/<img([^>]*class=\"inline_image[^>]*)>/", $text, $matches, PREG_SET_ORDER);
    foreach($matches as $match) {      
      if(!preg_match("/width=\"([0-9]*)\"/i", $match[0], $width)) {
        preg_match("/WIDTH:\s*([0-9]*)/i", $match[0], $width);
      }        
      $width = $width[1];
      
      if($width) {
        $new_img = preg_replace("/(.*show_image\/[0-9]*\/)([0-9]*)(.*)/", "\${1}$width\\3", $match[0]);
        $new_img = preg_replace("/width=\"[0-9]*\"/", "", $new_img);
        $new_img = preg_replace("/height=\"[0-9]*\"/", "", $new_img);
        $new_img = preg_replace("/(style=\"[0-9A-Za-z\s:;]*)\"/", "", $new_img);
        $text = str_replace($match[0], $new_img, $text);
      }
    }    
    return $text;
  }
  
} 