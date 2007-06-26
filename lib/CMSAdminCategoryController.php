<?php

class CMSAdminCategoryController extends CMSAdminComponent {

  public $module_name = "categories";												
  public $model_class = 'CmsCategory';
	public $model_name = "cms_category";													
	public $display_name = "Site Categories";
	public $scaffold_columns = array(
    "name"   =>array(),
  );
  public $filter_columns = array("name");

	public function controller_global() {
	  $array = array(0 => 'No Parent');
		$this->tree_collection = $this->model->categories_as_collection(null, $array);
	}

}

?>