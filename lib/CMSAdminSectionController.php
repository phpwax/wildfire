<?php

class CMSAdminSectionController extends CMSAdminComponent {
  
  public $model_class = 'CmsSection';
	public $model_name = "cms_section";													
	public $display_name = "Site Sections";
	public $scaffold_columns = array(
    "title"   =>array(),
    "page_status" => array()
  );
  public $filter_columns = array("title");
	
	public function controller_global() {
		
	}
	
	public function make_tree_array($level=0) {
		$sections = new CmsSection;
		foreach(new RecursiveIteratorIterator($sections) as $node) {
			$this->tree_array[]=$node;
		}
	}


}

?>