<?php

class CMSAdminSectionController extends CMSAdminComponent {

  public $module_name = "sections";												
  public $model_class = 'CmsSection';
	public $model_name = "cms_section";													
	public $display_name = "Site Sections";
	public $scaffold_columns = array(
    "title"   =>array(),
		"url" =>  array()
  );
  public $filter_columns = array("title");
	public $order_by_columns = array("title","url");

	public function controller_global() {
		$this->tree_collection = $this->model->sections_as_collection();
	}
	
	public function index() {
		parent::index();
		$this->all_rows = $this->model->find_ordered_sections();
		$this->list = $this->render_partial("list");
	}
	
	/*public function order() {
		if($root_section = $this->model->find_by_parent_id(0)) {
			$this->main_sections = $root_section->get_children("`order` ASC");
		} else $this->main_sections = array();
	}*/
	
	public function reorder() {
		$this->use_layout=false;
		$this->use_view=false;
		foreach($_POST['sortable_sections'] as $order=>$id) {
			if(!is_numeric($order) && !is_numeric($id)) return false;
			$section = new $this->model_class($id);
			$section->update_attributes(array("order"=>$order));
		}
		echo "ok";
	}	
	

}

?>