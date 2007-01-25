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
	
	public function index() {
		$this->all_rows = $this->final_array;
		$this->list = $this->render_partial("list");
	}
	
	protected function traverse_tree($object_array) {
		foreach($object_array as $node) {
			$this->final_array[] = $node;
			if($node->has_children()) {
				$this->traverse_tree($node->get_children("title ASC"));
			} 
		}
	}
	
	protected function create_section_tree() {
		$collection["0"]="Default";
		foreach($this->final_array as $item) {
	  	$value = str_pad($item->title, strlen($item->title) + $item->get_level(), "^", STR_PAD_LEFT);
			$value = str_replace("^", "&nbsp;", $value);
			$collection["{$item->id}"] = $value;
		}
		return $collection;
	}
	
	

}

?>