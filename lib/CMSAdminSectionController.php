<?php

class CMSAdminSectionController extends CMSAdminComponent {
  
  public $model_class = 'CmsSection';
	public $model_name = "cms_section";													
	public $display_name = "Site Sections";
	public $scaffold_columns = array(
    "title"   =>array(),
		"section_type"=>array()
  );
  public $filter_columns = array("title");

	public function controller_global() {
		$this->tree_collection = $this->model->sections_as_collection();
	}
	
	public function index() {
		$this->all_rows = $this->model->find_ordered_sections();
		$this->list = $this->render_partial("list");
	}
	
	
	
	

}

?>