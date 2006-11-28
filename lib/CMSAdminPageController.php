<?php
/**
* CMSAdminPageController - version controlled
* @package wxFramework
* @subpackage CMSPlugin
* @author WebXpress <john@webxpress.com>
* @version 1.0
*/

class CMSAdminPageController extends CMSAdminComponent{
	public $model_class = 'CmsPage';
	public $model_class_vc = 'CmsPageVc';
	public $access = 'editor';
	public $display_name = "Pages";
	public $display_action_name = '';
	public $list_scaffold_columns = array( 'id' => 'ID', 'title' => 'Title', 'excerpt' => 'Excerpt', 'created' => 'Created', 'status' => 'Status', 'checkout' => 'Checked Out' );
	public $list_scaffold_columns_vc = array( 'title' => 'Title', 'author_id' => 'Author', 'excerpt' => 'Excerpt', 'created_vc' => 'Created');
	
	function __construct( ) {
		parent::__construct();
		$this->sub_links["show_trash"] = "View Trash";
		$this->sub_links["global_checkin"] = "Checkin all Pages";
		$this->before_filter("view", "set_display_action_name", null, array('name'=>'View Page / Update Options'));
		$this->set_selected_menu_item( 'page' );
	}
	
	public function index( ) {
		$this->total_items = $this->model->count( array( 'conditions' => 'status > 0' ) );
		$this->all_rows = $this->model->find_all( array( 'conditions' => 'status > 0', 'order' => $this->get_list_order(), 'limit' => $this->get_list_limit(), 'offset' => $this->get_list_offset( ) ) );
		if(!$this->all_rows) $this->all_rows=array();
	}
	
	public function create() {
		$this->page = new $this->model_class;
		$this->save($this->page);
		$this->form = $this->render_partial("form");
	}
	
	public function edit( ) {}
	
	protected function save($page) {
		if( $page->is_posted() ) {
			$page->author_id = $this->current_user->id;
			if($page->update_attributes($_POST[$this->model_name]) ) {
				$this->checkin($page->id);
        Session::add_message("Page Successfully Saved");
        $this->redirect_to("view/$page->id");
      }
		}
		return false;
	}
	
	public function view(){
		if(!$id = $this->route_array[0]) $this->redirect_to("index");
		$this->page = new $this->model_class($id);
		$this->page->do_before_save = false;
		$this->save($this->page);
		
		$model_vc = new $this->model_class_vc;
		$version_wc_rows = $model_vc->find_all( array( 'conditions' => "record_id=$id AND working_copy = 1" ) );
		$this->working_copy = $version_wc_rows[0];
		
		$this->version_rows = $model_vc->find_all( array( 'conditions' => "record_id=$id  AND working_copy != 1" ) );
		$this->scaffold_columns_vc = array_keys($model_vc->column_info());
	}	
}
?>