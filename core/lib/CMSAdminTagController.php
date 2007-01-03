<?php
/**
* Used to add / manage Tags
* @package wxFramework
* @subpackage CMSPlugin
* @author WebXpress <john@webxpress.com>
* @version 1.0
*/
Autoloader::include_from_registry('CMSHelper');
Autoloader::register_helpers();

class CMSAdminTagController extends CMSAdminComponent {
	public $model_class = 'CmsTag';
	public $model_name = "cms_tag";													
	public $display_name = "Tags";
	
	public function create() {
		$tag_model = new CmsTag;
	  $this->tags = $tag_model->find_all();
		parent::create();
	}
	
	public function edit() {
		$tag_model = new CmsTag;
	  $this->tags = $tag_model->find_all();
		parent::inline_edit();
	}
	
	public function before_delete(){
		$tag_to_item = new CmsTagToItem;
		$tags = $tag_to_item->find_all(array('conditions'=>"item={$this->id} AND model='{$this->table}'"));
		foreach($tags as $tag){
			$tag_to_item->delete($tag->id);
		}
	}
}
?>