<?php
/**
* CMSAdminCategoryController extends abstarct CMSAdminComponent - Manage Post Categories
* @package wxFramework
* @subpackage CMSPlugin
* @author WebXpress <john@webxpress.com>
* @version 1.0
*/

class CMSAdminCategoryController extends CMSAdminComponent{
	public $model_class = 'CmsCategory';
	public $access = 'editor';
	public $display_name = "Categories";
	
	public function create() {
		$this->category = new $this->model_class;		
		$this->save($this->category);
		
		$all_categories = $this->category->find_all();
		$this->categories = array();
		$this->categories[] = '';
		foreach($all_categories as $row){
			$this->categories[$row->id] = $row->name;
		}
		$this->form = $this->render_partial("form");
	}
}
?>