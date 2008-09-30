<?php

/**
 * CmsTextFilter class
 *
 * @package default
 **/
class CmsTextFilter  {
  
  
  static public $filters = array(
    "before_save"=>array("convert_chars", "correct_entities", "strip_attributes", "strip_slashes"),
    "before_output"=> array("first_para_hook", "no_widows", "ampersand_hook", "strip_slashes", "nice_quotes", "videos")
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
		$text = preg_replace("/<(table|td|tr|tbody|thead|tfoot)\s+([^>]*)(border|bgcolor|background|style)+([^>]*)>/", "<$1 $2 $3\>", $text);
    return preg_replace("/<(p|h1|h2|h3|h4|h5|h6|ul|ol|li|span|font)\s+([^>]*)>/", "<$1>", $text);
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
    return preg_replace("/<p>/u", "<p class='first_para'>", $text, 1);
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
    $amp_finder = "/(\s|&nbsp;)(&|&amp;|&\#38;)(\s|&nbsp;)/u";
    return preg_replace($amp_finder, '\\1<span class="amp">&amp;</span>\\3', $text);
  }
  
  static public function nice_quotes($text) {
    return preg_replace("/(\s{1})\\\"([^<>\\\"]*)\\\"/u", "$1<span class='leftquote'>&ldquo;</span>$2<span class='rightquote'>&rdquo;</span>",$text);
  }
  
	static public function videos($text){
		/*standard youtube*/
		$youtube = '<object width="$2" height="$3">
	    <param name="movie" value="http://www.youtube.com/v/$6"></param>
	    <embed src="http://www.youtube.com/v/$6" type="application/x-shockwave-flash" width="$2" height="$3"></embed>
	  </object>';

		$text = preg_replace("/<a href=\"(.*)\" rel=\"([0-9]*px):([0-9]*px)\">(.*)youtube(.*)\?v=([a-zA-Z\-0-9_]*)([&]*)(.*)<\/a>/u", $youtube, $text);

		/*VIMEO*/
		$vimeo ='<object width="$2" height="$3">
							<param name="allowfullscreen" value="true" />
							<param name="allowscriptaccess" value="always" />
							<param name="movie" value="http://vimeo.com/moogaloop.swf?clip_id=$6&amp;server=vimeo.com&amp;show_title=0&amp;show_byline=0&amp;show_portrait=0&amp;color=00ADEF&amp;fullscreen=1" />
							<embed src="http://vimeo.com/moogaloop.swf?clip_id=$6&amp;server=vimeo.com&amp;show_title=0&amp;show_byline=0&amp;show_portrait=0&amp;color=00ADEF&amp;fullscreen=1" type="application/x-shockwave-flash" allowfullscreen="true" allowscriptaccess="always" width="$2" height="$3">
							</embed>
						</object>';

		$text = preg_replace("/<a href=\"(.*)\" rel=\"([0-9]*px):([0-9]*px)\">(.*)vimeo(.*)\/([a-zA-Z\-0-9_]*)([&]*)(.*)<\/a>/u", $vimeo, $text);						

		/*GOOGLE*/
		$google = '<embed id="VideoPlayback" src="http://video.google.com/googleplayer.swf?docid=$6&hl=en&fs=true" width="$2" height="$3" allowFullScreen="true" allowScriptAccess="always" type="application/x-shockwave-flash"> </embed>';

		$text = preg_replace("/<a href=\"(.*)\" rel=\"([0-9]*px):([0-9]*px)\">(.*)google(.*)\?docid=([a-zA-Z\-0-9_]*)([&]*)(.*)<\/a>/u", $google, $text);						

		return $text;
	}
  
  static public function yt_video($text) {
    $replace = '<object width="425" height="350">
      <param name="movie" value="http://www.youtube.com/v/$1"></param>
      <embed src="http://www.youtube.com/v/$1" type="application/x-shockwave-flash" width="425" height="350"></embed>
    </object>';
    $text = preg_replace("/<a href=\"#\" rel=\"yt_video\">([a-zA-Z\-0-9_]*)<\/a>/u", $replace, $text);
    $text = preg_replace("/<!--yt_video-->([a-zA-Z\-0-9_]*)<!--\/yt_video-->/", $replace, $text);
    $text = preg_replace("/<a href=\"#\" rel=\"youtube\">([a-zA-Z\-0-9_]*)<\/a>/u", $replace, $text);
    return preg_replace("/<!--yt_video-->([^\s<]*)/", $replace, $text);
  }
  
  static public function nl2p($pee, $br=true) {
    $pee = $pee . "\n"; // just to make things a little easier, pad the end
  	$pee = preg_replace('|<br />\s*<br />|', "\n\n", $pee);
  	// Space things out a little
  	$allblocks = '(?:table|thead|tfoot|caption|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|select|form|map|area|blockquote|address|math|style|input|p|h[1-6]|hr)';
  	$pee = preg_replace('!(<' . $allblocks . '[^>]*>)!', "\n$1", $pee);
  	$pee = preg_replace('!(</' . $allblocks . '>)!', "$1\n\n", $pee);
  	$pee = str_replace(array("\r\n", "\r"), "\n", $pee); // cross-platform newlines
  	if ( strpos($pee, '<object') !== false ) {
  		$pee = preg_replace('|\s*<param([^>]*)>\s*|', "<param$1>", $pee); // no pee inside object/embed
  		$pee = preg_replace('|\s*</embed>\s*|', '</embed>', $pee);
  	}
  	$pee = preg_replace("/\n\n+/", "\n\n", $pee); // take care of duplicates
  	$pee = preg_replace('/\n?(.+?)(?:\n\s*\n|\z)/s', "<p>$1</p>\n", $pee); // make paragraphs, including one at the end
  	$pee = preg_replace('|<p>\s*?</p>|', '', $pee); // under certain strange conditions it could create a P of entirely whitespace
  	$pee = preg_replace('!<p>([^<]+)\s*?(</(?:div|address|form)[^>]*>)!', "<p>$1</p>$2", $pee);
  	$pee = preg_replace( '|<p>|', "$1<p>", $pee );
  	$pee = preg_replace('!<p>\s*(</?' . $allblocks . '[^>]*>)\s*</p>!', "$1", $pee); // don't pee all over a tag
  	$pee = preg_replace("|<p>(<li.+?)</p>|", "$1", $pee); // problem with nested lists
  	$pee = preg_replace('|<p><blockquote([^>]*)>|i', "<blockquote$1><p>", $pee);
  	$pee = str_replace('</blockquote></p>', '</p></blockquote>', $pee);
  	$pee = preg_replace('!<p>\s*(</?' . $allblocks . '[^>]*>)!', "$1", $pee);
  	$pee = preg_replace('!(</?' . $allblocks . '[^>]*>)\s*</p>!', "$1", $pee);
  	if ($br) {
  		$pee = preg_replace('/<(script|style).*?<\/\\1>/se', 'str_replace("\n", "<WPPreserveNewline />", "\\0")', $pee);
  		$pee = preg_replace('|(?<!<br />)\s*\n|', "<br />\n", $pee); // optionally make line breaks
  		$pee = str_replace('<WPPreserveNewline />', "\n", $pee);
  	}
  	$pee = preg_replace('!(</?' . $allblocks . '[^>]*>)\s*<br />!', "$1", $pee);
  	$pee = preg_replace('!<br />(\s*</?(?:p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)!', '$1', $pee);
  	if (strpos($pee, '<pre') !== false)
  		$pee = preg_replace_callback('!(<pre.*?>)(.*?)</pre>!is', 'clean_pre', $pee );
  	$pee = preg_replace( "|\n</p>$|", '</p>', $pee );

  	return $pee;
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


} // END class 