<?php

class CMSHelper extends WXHelpers {
  public function simple_wysiwyg($object, $attribute, $options=array(), $with_label=true) {
    if($options["class"]) $options["class"].=" widgEditor";
    else $options["class"] = "widgEditor";
		print stylesheet_link_tag('/javascripts/editors/simple/css/widget-content.css');
    return text_area($object, $attribute, $options, $with_label, "Put your content here");
  }
  public function simple_wysiwyg_tag($name, $value="", $options=array(), $with_label=true) {
    if($options["class"]) $options["class"].=" widgEditor";
    else $options["class"] = "widgEditor";
		print stylesheet_link_tag('/javascripts/editors/simple/css/widget-content.css');
    return text_area_tag($name, $value, $options, $with_label, "Put your content here");
  }
	/*
	* generates a select input with visual appearence of nested elements - long winded but works
	* don't hate me for this code - i'll sort it, honest.
	*/
	public function tag_structure_as_select($model,$id,$tag_result,$indent_string = '::', $select_options = array()){
		$this->select_options = array();
		$this->select_options[0] = 'None';
		self::flatten_nested_array($tag_result,$indent_string);
		foreach( $this->select_options as $key => $value ){
			$this->select_options[$key]=$value->name;
		}
		return select($model, $id, $this->select_options,$select_options);
	}
	public function tag_structure_as_array($tag_result,$indent_string = '-',$column='tag'){
		$this->select_options = array();
		self::flatten_nested_array($tag_result,$indent_string,$column);
		return $this->select_options;
	}
	private function flatten_nested_array($tag_result,$indent_string,$column='tag'){
		$tag_array = self::tag_structure($tag_result);
		$select_array = array();
		$select_array['0'] = '';
		if(sizeof($tag_array)>0){
			foreach($tag_array as $key => $tag){
				$this->indent_count = 0;
				$tag['tag']->name = self::print_indent($indent_string,$this->indent_count).$tag['tag']->$column;
				$this->select_options[$key] = $tag['tag'];
				if(isset( $tag['children'] )){
					$this->indent_count = 1;
					self::iterate_array($tag['children'],$indent_string, $column);
				}
			}
		}
	}
	private function iterate_array($tag_array,$indent_string,$column='tag'){
		foreach($tag_array as $key => $tag){
			$tag['tag']->name = self::print_indent($indent_string,$this->indent_count).$tag['tag']->$column;
			$this->select_options[$key] = $tag['tag'];
		//	$this->select_options[$key] = self::print_indent($indent_string,$this->indent_count).$tag['tag']->name;
			if(isset( $tag['children'] )){
				$this->indent_count++;
				self::iterate_array($tag['children'],$indent_string, $column);
				$this->indent_count--;
			}
		}
	}
	private function print_indent($indent_string,$indent_count){
		$str = '';
		for($i=0;$i<$indent_count;$i++){
			$str .= $indent_string;
		}
		return $str;
	}
	/*
	* organise tags result as nested array
	*/
	public function tag_structure($tag_result){
		$no_parent_array = array();
		$with_parent_array = array();
		foreach($tag_result as $tag){
			if($tag->parent_id == 0) $no_parent_array[$tag->id] = $tag;
			else $with_parent_array[$tag->id] = $tag;
		}
		ksort($no_parent_array);
		ksort($with_parent_array);
		$tag_result = array_merge($no_parent_array,$with_parent_array);
		foreach($tag_result as $tag){
			if($tag->parent_id == 0) $tag_array[$tag->id]['tag'] = $tag;
			else $tag_array = self::add_tag_to_array( $tag_array, $tag );
		}
		return $tag_array;
	}
	private function add_tag_to_array($tag_array, $tag){
		if(array_key_exists($tag->parent_id,$tag_array)) {
			$tag_array[$tag->parent_id]['children'][$tag->id]['tag'] = $tag;
			return $tag_array;
		} else{
			// todo - end loop when parent_tag found, note:need to maintain key structue
			foreach($tag_array as $key => $node){
				if(isset($node['children'])){
					$tag_array_tmp = self::add_tag_to_array( $node['children'], $tag );
					$tag_array[$key]['children'] = $tag_array_tmp;
				}else{
					// exit loop here
				}
			}
			return $tag_array;
		}
	}
	/*
	* take list of file objects and display as list
	*/
	public function files_as_checkbox($id,$file_objects,$related_files=array(),$select_options = array('class'=>'checkbox')){
		$str='';
		foreach($file_objects as $file){
			$checked = false;
			if(array_key_exists($file->id,$related_files)) $checked = true;
			$str .= check_box_tag($id,$file->id,$checked,$select_options,false) ." $file->filename<br />";
		}
		return $str;
	}
	/*
	* tags as checkbox options
	*/
	public function tags_as_checkbox($id,$tags_objects,$related_tags=array(),$select_options = array('class'=>'checkbox')){
		$str='';		
		foreach($tags_objects as $tag){
			$checked = false;
			if(array_key_exists($tag->id,$related_tags)) $checked = true;
			$str .= check_box_tag($id,$tag->id,$checked,$select_options,false) ." $tag->name<br />";
		}
		return $str;
	}
	/*
	* tree as select
	*/
	public function parent_tree_as_select($model, $model_class,$sort_col,$select_options=array()){
		$items = $model->find_all(array('order'=>'parent_id ASC'));
		$this->select_options[] = '';
		self::tag_structure_as_array($items,'::',$sort_col);
		foreach($this->select_options as $key=>$value){
			$this->select_options[$key]=$value->name;
		}
		array_unshift($this->select_options,'');
		return select($model, 'parent_id', $this->select_options,$select_options);
	}
	public function sort_order_as_select($model, $model_class,$print_col,$select_options=array()){
		$items = $model->find_all(array('order'=>'sort ASC'));
		$this->select_options[] = '';
		self::tag_structure_as_array($items,'::',$print_col);
		foreach($this->select_options as $key=>$value){
			$this->select_options[$key]=$value->name;
		}
		array_unshift($this->select_options,'');
		return select($model, 'sort', $this->select_options,$select_options);
	}
	
	
	
	/*
	* hooks available in the app
	*/
	public function generate_menu($parent_id,$model_class){
		
	}
}