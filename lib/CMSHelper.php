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
    $id = $section->find_by_title($section_title)->id;
    $content = new CmsContent;
    return $content->published_content("", $id, $params);
  }
  
  public function smart_truncate($paragraph, $limit, $link=false){
    $tok = strtok($paragraph, " ");
    $text="";
    $words='0';
    while($tok){
      $text .= " ".$tok;
      $words++;
      if(($words >= $limit) && ((substr($tok, -1) == "!")||(substr($tok, -1) == ".")))
        break;
      $tok = strtok(" ");
    }
    return ltrim($text);
  }
  
  public function word_truncate($text, $words, $striph = false) {
    preg_match("/([\S]+\s*){0,$words}/", $text, $regs);  
    $result = trim($regs[0])."...";
    $result = preg_replace("/<h[0-9]?>.*<\/h[0-9]?>/", "", $result);
    echo strip_tags($result);
  }
  
  public function smart_nav($url, $display, $current, $selected_id) {
    if(substr($current, 1) == $url) return content_tag("li", content_tag("a", $display, array("href"=>$url)), array("id"=>$selected_id));
    return content_tag("li", content_tag("a", $display, array("href"=>$url)));
  }
	
}