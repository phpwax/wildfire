<?php

class CMSAdminSectionController extends CMSAdminComponent {

  public $module_name = "sections";												
  public $model_class = 'CmsSection';
	public $model_name = "cms_section";													
	public $display_name = "Site Sections";
	public $scaffold_columns = array(
    "title"   =>array(),
		"template_style"=>array()
  );
  public $filter_columns = array("title");

	public function controller_global() {
		$this->tree_collection = $this->model->sections_as_collection();
		$this->sub_links["order"] = "Change the order of sections";
	}
	
	public function index() {
		parent::index();
		$this->all_rows = $this->model->find_ordered_sections();
		$this->list = $this->render_partial("list");
	}
	
	public function order() {
		$root_section = $this->model->find_by_parent_id(0);
		$this->main_sections = $root_section->get_children("`order` ASC");
	}
	
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