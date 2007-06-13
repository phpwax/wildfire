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
  
  public function get_content($section_title, $params=array(), $model = "CmsContent") {
    $section = new CmsSection;
    $sec = $section->find_by_title($section_title);
    if(!$sec) $sec = $section->find_by_url($section_title);
    if(!$sec) $sec = $section->find($section_title);
    $content = new $model;
    return $content->published_content($sec->url, $sec->id, $params);
  }
  
  public function smart_truncate($paragraph, $limit) {
    $paragraph = preg_replace("/<h[0-9]?>.*<\/h[0-9]?>/", "\n\n", $paragraph);
    $paragraph = preg_replace(array("/<(p|ul|li)[^>]*>/iU","/<\/(p|ul|li)[^>]*>/iU"), "\n", $paragraph);
    $text_array = preg_split("/\s/",$paragraph);
    $text="";
    $words='0';
    foreach($text_array as $word) {
      $text .= " ".$word;
      $words++;
      if($words >= $limit && (substr($word, -1) == "!" || substr($word, -1) == "." || strlen($word)<1))
        break;
    }
    return ltrim($text);
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
      $pubdate= $simple->channel->item[$i]->pubDate;
      $rss[]=array($title, $desc, $link, $pubdate);
    }
    return $rss;
  }
  
  public function cms_paginate($obj_array, $per_page="10", $offset="1") {
    $offset = $offset-1;
    if(count($obj_array) > 0 && $offset * $per_page < count($obj_array)) {
      return new LimitIterator(new ArrayIterator($obj_array), $offset, $per_page);
    }
    return $obj_array;
  }
  	
}