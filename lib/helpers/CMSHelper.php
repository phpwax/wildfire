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
  
  public function smart_truncate($content, $min_words, $max_words=false, $suffix="..."){
		$total_words = 0;
		$counter = 0;
		$content = preg_replace("/<h[0-9]?>.*<\/h[0-9]?>/", " ", $content);		
		$content = preg_replace("/<ul>.*<\/ul?>/", " ", $content);		
		$content = preg_replace("/<ol>.*<\/ol?>/", " ", $content);
		$content = str_replace("</p>", " </p>", $content);
		$content = strip_tags($content);	
		$sentences =  explode(".", str_replace("  ", " ", $content));	
		$parsed_words = array();
		while(($total_words < $min_words) && ($counter < count($sentences)) ){			
			$words = array_values(explode(" ", trim($sentences[$counter])."." ) );
			$parsed_words = array_merge($parsed_words, $words);
			$total_words += count($words);			
			$counter ++;				
		}		
		if($max_words && ($total_words > $max_words))	$result = implode(" ", array_slice($parsed_words, 0, $max_words+1) ) . $suffix;		
		else $result = implode(" ", $parsed_words);
		return preg_replace( '|([^\s])\s+([^\s]+)\s*$|', '$1&nbsp;$2', $result);
	}
  
  public function word_truncate($text, $words) {
    $text = preg_replace("/<h[0-9]?>.*<\/h[0-9]?>/", "", $text);
    $text = strip_tags($text);
    preg_match("/([\S]+\s*){0,$words}/", $text, $regs);  
    $result = trim($regs[0])."...";
    return $result;
  }
  
  public function smart_nav($url, $display, $current, $selected_id, $options=array()) {
    if(is_array($url)) {
      if(is_array($current) && $url["action"]==$current["action"] && $url["controller"]=$current["controller"]) {
        $li_options["id"]=$selected_id;
				$options['href']=url_for($url);
        return content_tag("li", content_tag("a", $display, $options), $li_options );
      }
      elseif($url["action"] == $current) {
        $li_options["id"]=$selected_id;
				$options['href']=url_for($url);
        return content_tag("li", content_tag("a", $display, $options), $li_options );
      }
      $url = url_for($url);
    }
		$options['href']= $url;
    if(substr($url, 1) == $current) return content_tag("li", content_tag("a", $display, $options), array("id"=>$selected_id));
    return content_tag("li", content_tag("a", $display, $options));
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
  
  public function text_format($text) {
    $text = str_replace("<br/><br/>", "\n", $text);
    $text = str_replace("<br /><br />", "\n", $text);
    $text = $this->p2nl($text);
    $text = str_replace("\n\n", "\n", $text);
    
    $text = $this->nl2p($text);
    return preg_replace("/<p>/", "<p class='first_para'>", $text, 0);
  }
  
  public function nl2p($str) {
	  return "<p class='first_para'>" . str_replace("\n", "</p><p>", $str) . "</p>";
	}
	
	public function p2nl($text) {
    return preg_replace(array("/<p[^>]*>/iU","/<\/p[^>]*>/iU"),
                        array("","\n"),
                        $text);
	}
	
	public function subscription_form($model, $action="", $handle=false, $show_name_field = true, $extra1=false, $extra2 =false, $image_submit=false){
		if(!$handle) $handle = "all_sections";
		
		$form = '<div id="subscription-form">
							<form action="'.$action.'" method="post" class="form_container">'
							. hidden_field($model, "handle", array('value'=>$handle) ) . 
								hidden_field($model, "status", array('value'=> 1) ) .	'<fieldset>';
								
								if($show_name_field) $form .= large(text_field($model, "name", array(), "Name <span class='mandatory'>*</span>")) . form_divider();
								
								$form .= large(text_field($model, "email", array(), "Email <span class='mandatory'>*</span>"));
								if($extra1) $form .= form_divider().large(text_field($model, "extra1", array(), $extra1));
								if($extra2) $form .= form_divider().large(text_field($model, "extra2", array(), $extra2));
								$form.= form_divider() . '<span id="mandatory">* Compulsory fields</span>';
								if($image_submit) $form .= image_submit_tag($image_submit, array('alt'=>"submit button", "title"=>"Submit"));
								else $form .= small(submit_field($model, "Subscribe"));
						   $form .= '</fieldset>
					 		</form>							
						</div>';
		return $form;
	}
	
	public function preview_window($permalink, $trigger_id, $preview_pane) {
	  return content_tag("script", "setup_preview('$permalink', '$trigger_id', '$preview_pane');");
	}
	
	public function inject_into_content($content, $injection, $offset=1, $pattern = "<\/p>") {
	  $split_content = preg_split("/(".$pattern.")/i", $content, -1, PREG_SPLIT_NO_EMPTY|PREG_SPLIT_OFFSET_CAPTURE|PREG_SPLIT_OFFSET_CAPTURE);
	  $position = $split_content[$offset][1];
	  $first = substr($content, 0, $position);
	  $second = substr($content, $position);
	  return $first.$injection.$second;
	}
	
	public function random_image($directory="images", $class="", $alt="") {
	  $images = File::scandir(PUBLIC_DIR."images", "[a-z0-9_-]\.jpg|gif");	  
	  $image = $images[rand(0, count($images))];
	  return "<img src='/".$directory."/".$image."' alt='".$alt."' class='".$class."' />";
	}
	
	
	/**
	 * page title helper - pass in cms_content, cms_section, site name, title separator and model field
	 * to pull the text from
	 */
	public function page_title($page, $section, $name, $seperator = " - ", $field="title"){
		return $this->make_title($page, $seperator, $field) . $this->make_title($section, $seperator, $field) . $name;
	}	
	/**
	 * use the cms filter to tidy up the title text and if it has a parent section then append that as well
	 */	
	protected function make_title($info, $seperator = " - ", $field=""){
		if($info->parent_id > 1) return CmsTextFilter::filter("before_output",html_entity_decode($info->$field) ) . $seperator . $this->make_title(new CmsSection($info->parent_id), $seperator ) ;
		elseif($info->$field) return CmsTextFilter::filter("before_output", html_entity_decode($info->$field) ) . $seperator;
		elseif(is_string($info)) return CmsTextFilter::filter("before_output",html_entity_decode($info)) . $seperator;
		else return "";
	}
	
	/**
	 * meta keyword helper - takes the object & field, uses a truncation function and returns the result
	 */	
	public function keywords($object, $field="title", $words=8){
		if($string = $object->$field) return $this->word_truncation($string, $words, true, ",");
		else return "";
	}
	
	/**
	 * meta description helper - uses the object to generate a description of the page
	 */	
	public function description($object, $field="title", $words=10){
		if($string = $object->$field) return $this->word_truncation($string, $words, true, " ");
		else return "";
	}
	
	/**
	 * new improved truncation method!
	 * pass in the string you want truncating and set how many words you want and if you want to keep the html.
	 * If you keep the html then the clever stuff triggers; it finds all tags used, hunts down any missing end tags
	 * adds them to the end of the string
	 */
	public function word_truncation($content, $word_limit=30, $striptags=false, $seperator=" ",$offset=0) {		
		if($striptags) $content = strip_tags($content);
    $parts = preg_split("/[\s]+/i", $content, -1, PREG_SPLIT_NO_EMPTY|PREG_SPLIT_OFFSET_CAPTURE|PREG_SPLIT_DELIM_CAPTURE);
		$chunk = array_slice($parts, $offset, $word_limit);
		$words = $tags = $order = array();
		$self_closing = array('br', 'hr', 'input', 'img', 'link', 'meta');
		foreach($chunk as $segmant) $words[] = $segmant[0];
		$string = implode($seperator,$words);
		//if html is being kept, append closing tags - WILL ONLY WORK IN VALID HTML!
		if(!$striptags){
			//find all tags
			$pattern = "/<([\/]*)([^>]+)>/i";
			preg_match_all($pattern, $string, $tags, PREG_SET_ORDER);
			$counter = array();
			foreach($tags as $i => $tag){				
				//find the end of the tag markup ie where a is or code or b etc
				if(!$pos = strpos($tag[0]," ")) $pos = strlen($tag[0])-2;
				$clean_tag = substr($tag[0],1,$pos);
				//strip off all the gubbings so its just the tag type
				$tag_type = trim(str_replace("/", "", $clean_tag));	
				//if its not self closing then add to counter			
				if(!in_array($tag_type, $self_closing)){
					//if its the close tag decrease it
					if(strlen($tag[1])>0){
						$counter[$tag_type]-=1;
						array_pop($order[$tag_type]);						
					}
					//otherwise increase it
					else{
						$index = $tag[0];
						$order[$tag_type][$index]=true;
						$counter[$tag_type] += 1;
					}
				}


			}
			$order = array_reverse($order);			
			$i=0;
			foreach($order as $type => $missing){
				if(is_array($missing)){
					$vals = array_values($missing);					
					if($vals[0]>0 && ($i+1 == count($order) ) ) $string .="...";
					if($vals[0]>0) $string .= "</".$type.">";
				}
				$i++;
			}			
		}elseif(count($chunk)>$word_limit) $string .= "...";
		return $string;
  }
  	
}
?>