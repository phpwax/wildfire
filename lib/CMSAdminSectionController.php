<?php

class CMSAdminSectionController extends CMSAdminComponent {
  
  public $model_class = 'CmsSection';
	public $model_name = "cms_section";													
	public $display_name = "Site Sections";
	public $scaffold_columns = array(
    "title"   =>array()
  );
  public $filter_columns = array("title");

	public function controller_global() {
		$sections = $this->model->find_roots();
		$this->traverse_tree($sections);
		$this->tree_collection = $this->create_section_tree();
	}
	
	protected function traverse_tree($object_array) {
		foreach($object_array as $node) {
			$this->final_array[] = array($node->id, $node->title, $node->get_level());
			if($node->has_children()) {
				$this->traverse_tree($node->get_children("title ASC"));
			} 
		}
	}
	
	protected function create_section_tree() {
		$collection["0"]="Default";
		foreach($this->final_array as $item) {
	  	$value = str_pad($item[1], strlen($item[1]) + $item[2], "^", STR_PAD_LEFT);
	  	$value = str_replace("^", "&nbsp;&nbsp;", $value);
			$collection["{$item[0]}"] = $value;
		}
		return $collection;
	}


}

?>