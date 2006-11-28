<?php
/**
* CMSAdminCategoryController extends abstarct CMSAdminComponent - Manage Post Categories
* @package wxFramework
* @subpackage CMSPlugin
* @author WebXpress <john@webxpress.com>
* @version 1.0
*/

class CMSAdminTrashController extends CMSAdminComponent{
	public $model_class = 'CmsCategory';
	public $access = 'editor';
	public $display_name = "Trash";
	private $controllers_using_trash;
	
	function __contstruct(){
		$auth = new CMSAuthorise;
		$this->current_user = $auth->get_user();
		$this->before_filter("all", "check_authorised", array("login"));
		$this->sub_links["index"] = $this->display_name." Home";
		$this->sub_links["empty"] = "Empty ".$this->display_name;
		
		$this->controllers[] = 'CmsAdminPostController';
		$this->controllers[] = 'CmsAdminPageController';
	}
	
	public function index(){	}
}
?>