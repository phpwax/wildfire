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
	
	public function filters() {
	  $this->use_layout=false;
	  $cat = new CmsCategory;
	  if(strlen($fil = $_POST['filter'])<1) {
  	  $this->all_categories = $cat->order("parent_id ASC, name ASC")->all();
  	} else {
      $this->all_categories = $cat->filter("name LIKE '%$fil%'")->order("parent_id ASC, name ASC")->all();
    }
  	$this->cat_partial = $this->render_partial("cat_list");
	}

}

?>