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
	
}