<?php

class CMSHelper extends WXHelpers {
  public function simple_wysiwyg($object, $attribute, $options=array(), $with_label=true) {
    if($options["class"]) $options["class"].=" widgEditor";
    else $options["class"] = "widgEditor";
    return text_area($object, $attribute, $options, $with_label, "Put your content here");
  }
  public function simple_wysiwyg_tag($name, $value="", $options=array(), $with_label=true) {
    if($options["class"]) $options["class"].=" widgEditor";
    else $options["class"] = "widgEditor";
    return text_area_tag($name, $value, $options, $with_label, "Put your content here");
  }
  
  public function get_content($section_title, $params=array()) {
    $section = new CmsSection;
    $sec = $section->find_by_title($section_title);
    $content = new CmsContent;
    return $content->published_content($sec->url, $sec->id, $params);
  }
  
  public function smart_truncate($paragraph, $limit){
    $tok = strtok($paragraph, " ");
    $text="";
    $words='0';
    while($tok){
      $text .= " ".$tok;
      $words++;
      if(($words >= $limit) && ((substr($tok, -1) == "!")||(substr($tok, -1) == ".")||(substr($tok, -1) == "\n")))
        break;
      $tok = strtok(" ");
    }
    return strip_tags(ltrim($text));
  }
  
  public function word_truncate($text, $words) {
    preg_match("/([\S]+\s*){0,$words}/", $text, $regs);  
    $result = trim($regs[0])."...";
    $result = preg_replace("/<h[0-9]?>.*<\/h[0-9]?>/", "", $result);
    return strip_tags($result);
  }
  
  public function smart_nav($url, $display, $current, $selected_id) {
    if(substr($url, 1) == $current) return content_tag("li", content_tag("a", $display, array("href"=>$url)), array("id"=>$selected_id));
    return content_tag("li", content_tag("a", $display, array("href"=>$url)));
  }
  
  public function parse_rss($url, $items) {
    $simple = @simplexml_load_file($url, "SimpleXMLElement", LIBXML_NOCDATA);
    for($i=0; $i<$items; $i+=1) {
      $title = $simple->channel->item[$i]->title;
      $desc = $simple->channel->item[$i]->description;
      $link = $simple->channel->item[$i]->link;
      $rss[]=array($title, $desc, $link);
    }
    return $rss;
  }
	
}