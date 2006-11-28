<?php
/**
* Class defining minimum requirments for CMS component
* Depends on CMSAuthorise.php to provide authentication
* @package wxFramework
* @subpackage CMSPlugin
* @author WebXpress <john@webxpress.com>
* @version 1.0
*/

require_once( 'CMSAdminHelper.php' );

class CMSAdminComponent extends WXControllerBase {
		
	protected $model;	
	protected $model_class;
	public $model_name;													
	protected $access = "administrator";
	protected $unauthorised_redirect="/admin/home/login";
	protected $current_user;
	public $auth_database_table="CmsUser";
	public $roles_array = array("all"=>"0", "user"=>"10", "editor"=>"20", "administrator"=>"30");
	public $status_array = array("1"=>"Unpublished", "2"=>"Published", "0"=>"Trash" );
	public $menu_array = array( 'home' => array( 'name' => 'Home Page', 'url' => '/admin/home', 'selected' => true, 'children' => array() ) );
	public $use_plugin = "cms";
	public $use_layout = "admin";
	public $sub_links;
	public $display_name = 'CMS';
	public $list_limit = 10;
	public $list_offset = 0;
	public $page_no = 0;
	
	/** scaffold columns can be overrided to specify
	 * @var array
	 **/
	public $scaffold_columns = null;	

	function __construct() {
		$auth = new CMSAuthorise($this->auth_database_table);
		$this->current_user = $auth->get_user();
		$this->before_filter("all", "check_authorised", array("login"));
		if($this->model_class) {
		  $this->model = new $this->model_class;
		  $this->model_name = underscore($this->model_class);
		  if (!$this->scaffold_columns) {
			  $this->scaffold_columns = array_keys($this->model->column_info());
		  }
	  }
		$this->sub_links["index"] = $this->display_name." Home";
		$this->sub_links["create"] = "Create ". $this->display_name;
		
		// set generic var set throughout app
		if( isset( $_GET['order'] ) ){ $this->set_list_order( $_GET['order'] );  }
		if( isset( $_GET['list_limit'] ) ){ $this->set_list_limit( $_GET['list_limit'] );  }
		if( isset( $_GET['page'] ) ){ $this->set_list_offset( $_GET['page'] );  }
		$this->get_list_limit();
		
		// set display action names
		$this->before_filter("index", "set_display_action_name", null, array('name'=>'List Items'));
		$this->before_filter("create", "set_display_action_name", null, array('name'=>'Create Item'));
		$this->before_filter("edit", "set_display_action_name", null, array('name'=>'Edit Item'));
		$this->before_filter("show_trash", "set_display_action_name", null, array('name'=>'Trash Items'));
		$this->before_filter("working_copy", "set_display_action_name", null, array('name'=>'Working Copy'));
		
		// set default menu items - these can be removed using the unset method by any controller extending this class
		$this->set_menu_item( 'page', 'Pages', '/admin/pages' );
		$this->set_menu_item( 'category', 'Categories', '/admin/category' );
		$this->set_menu_item( 'post', 'Posts', '/admin/posts' );
		$this->set_menu_item( 'user', 'Users', '/admin/users' );
		$this->set_menu_item( 'page', 'Page', '/admin/pages' );
		$this->set_menu_item( 'file', 'Files', '/admin/files' );
	}

	/**
	* Check if user authorised
	* @return boolean
	*/
  public function check_authorised() {
    if($this->current_user) {
			if($this->access=="all") {
				return true;
			}
			if($this->get_access_level($this->current_user->usergroup) >= $this->get_access_level($this->access)) {
				return true;
			}
		}
		$this->redirect_to($this->unauthorised_redirect);
  }

	/**
	* Returns access level of specified users role as a integer
	* @param string $role_name 
	* @return integer $access_level
	*/
	public function get_access_level($role_name) {
		return $this->roles_array[$role_name];
	}

	/**
	* Returns the access url for class 
	* @return integer $access_level
	*/		
  protected function getUrl( ){ return str_replace( 'Controller', '', get_class($this) ); }

	/**
	* List model items - has shared view cms/view/shared/list.html 
	*/
	public function index( ) {
		$this->total_items = $this->model->count( );
		$this->all_rows = $this->model->find_all( array( 'order' => $this->get_list_order(), 'limit' => $this->get_list_limit(), 'offset' => $this->get_list_offset( ) ) );
		if(!$this->all_rows) $this->all_rows=array();
		$this->list = $this->render_partial("list");
	}

	/**
	* Create model item - has shared view cms/view/CONTROLLER/_form.html
	*/
	public function create() {
		$this->model = new $this->model_class;		
		$this->save($this->model);
		$this->form = $this->render_partial("form");
	}
	
	public function inline_edit() {
	  $this->accept_routes=1;
	  $this->use_layout=false;
    $this->model = new $this->model_class($this->route_array[0]);
		$this->form = $this->render_partial("form");
		$this->save($this->model);
	}

	/**
	* Edit model item, gets exiting record before sending to view - has shared view cms/view/shared/edit.html 
	*/
	public function edit( ) {
		if(!$id = $this->route_array[0]) $this->redirect_to("index");
    $this->page = new $this->model_class($id);
		$this->save($this->page);
		
		$this->form = $this->render_partial("form");
	}
	
	protected function save($model) {		
		if( $model->is_posted() ) {
			if($model->update_attributes($_POST[$this->model_name]) ) {
        Session::add_message($this->display_name." Successfully Saved");
        $this->redirect_to('index');
      }
		}
		return false;
	}
	
	public function show_trash( ) {
		$this->trash_allowed();
		$this->all_rows = $this->model->find_all( array( 'conditions' => 'status = 0'));
		if(!$this->all_rows) {
			Session::add_message("No items in Trash.");
			$this->redirect_to('index');
		}
	}
	
	public function trash(){
		$this->trash_allowed();
		if(!$id = $this->route_array[0]) $this->redirect_to("index");
		$this->checkout($id);
		$this->model->id = $id;
		$this->model->status = 0;
		if($this->model->update() ) {
      Session::add_message("Page Successfully Sent to Trash");
			$this->checkin($this->id);
      $this->redirect_to('index');
    }
	}
	
	public function restore_trash(){
		$this->trash_allowed();
		if(!$id = $this->route_array[0]) $this->redirect_to("index");
		$this->model->id = $id;
		$this->model->status = 1;
		if($this->model->update() ) {
      Session::add_message("Page Successfully restored as an Unpublished item");
      $this->redirect_to('show_trash');
    }
	}
	
	public function empty_trash_confirm(){
		$trash_items = $this->model->find_all( array( 'conditions' => 'status = 0' ) );
		$this->total_trash_items = sizeof( $trash_items );
		if( $this->total_trash_items == 0 ){
			Session::add_message("No items to delete.");
			$this->redirect_to('index');
		}
		$this->timestamp = time();
		Session::set( 'empty_trash_timestamp', $this->timestamp );
	}
	
	public function empty_trash(){
		if( Session::get( 'empty_trash_timestamp' ) != $_GET['empty_trash_timestamp'] ){
			Session::add_message("You have not confirmed the removal of all items in the trash, please try again.");
			$this->redirect_to('show_trash');
		}
		else{
			$this->trash_allowed();
			$trash_items = $this->model->find_all( array( 'conditions' => 'status = 0' ) );
			$count = 0;
			$total_trash_items = sizeof( $trash_items );
			foreach( $trash_items as $item ){
				$this->model->delete($item->id);
				$count++;
			}
			Session::set( 'empty_trash_timestamp', '' );
			Session::add_message("$count of $total_trash_items items deleted permanently");
			$this->redirect_to('index');
		}
	}
	
	private function trash_allowed(){
		if( !array_search( 'status', $this->scaffold_columns ) ){
			throw new WXException("This type of item can not be trashed. Model requires a status column.");
		}
		return true;
	}
	
	/**
	* delete model record
	*/	
	public function delete(){
		if($_POST['delete']) {
			$record_to_delete = $this->route_array[0];
			$this->model->delete($this->route_array[0]);
			Session::add_message("Item successfully deleted");
			$this->redirect_to('index');
		}
		$this->redirect_to("index");
	}
	
	public function working_copy(){
		$this->version_control_allowed();
		if(!$this->id = $this->route_array[0]) $this->redirect_to("index");
		$model = $this->model->find($this->id);
		if( $model->status == 0 ){
			Session::add_message("Item is Trashed, please restore to edit.");
			$this->redirect_to('index');
		}
		$this->model_vc = $model->get_working_copy();
		$this->save_working_copy($this->model_vc);
		$this->checkout($this->id);
		$this->scaffold_columns_vc = array_keys($this->model_vc->column_info());
		$this->form = $this->render_partial("form_vc");
	}
	
	public function save_working_copy( $modeL_vc ){
		$this->version_control_allowed();
		if( $modeL_vc->is_posted() ) {
			$modeL_vc->author_id = $this->current_user->id;
			if($modeL_vc->update_attributes($_POST[underscore($this->model_class_vc)]) ) {
				$this->checkin($modeL_vc->record_id);
        Session::add_message("Page VC Successfully Saved");
        $this->redirect_to("view/$modeL_vc->record_id");
      }
		}
		return false;
	}
	
	public function restore(){
		$this->version_control_allowed();
		$this->checkout( $this->route_array[0] );
		$this->model->restore( $_REQUEST['vid'], false );
		Session::add_message("Page Successfully Restored");
		$this->redirect_to("index");
	}
	
	public function update_from_working_copy(){
		$this->version_control_allowed();
		$this->checkout( $this->route_array[0] );
		$this->model->restore( $_REQUEST['vid'] );
		Session::add_message("Page Successfully Updated");
		$this->redirect_to("index");
	}
	
	private function version_control_allowed(){
		if( !isset( $this->model_class_vc ) ) {
			throw new WXException("This type of model does not support version control.", 'CMS Plugin Error');
		}
		return true;
	}
	
	public function global_checkin(){
		$this->checkout_allowed();
		$model = new $this->model_class();
		$result = $model->find_all( array( 'conditions' => ' checkout > 0' ) );
		$count = 0;
		foreach( $result as $row ){
			$this->do_before_save = false;
			$this->checkin( $row->id );
			$count++;
		}
		Session::add_message("$count pages were checked in.");
		$this->redirect_to('index');
	}
	
	protected function checkout( $id ){
		$this->checkout_allowed();
		$model = new $this->model_class($id);
		if( $model->checkout == 0 || $model->checkout == $this->current_user->id ){
			$model->checkout = $this->current_user->id;
			$model->do_before_save = false;
			$model->save();
			return true;
		}
		else{
			Session::add_message("This item is currently checked out by someone else.", 'CMS Plugin Error');
			$this->redirect_to($this->referrer);
		}
	}
	
	protected function checkin( $id ){
		$this->checkout_allowed();
		$this->model->id = $id;
		$this->model->checkout = 0;
		$this->model->do_before_save = false;
		$this->model->save();
		return true;
	}
	
	private function checkout_allowed(){
		if( !array_search( 'checkout', $this->scaffold_columns ) ){
			throw new WXException("This type of model cannot be checked out - add 'checkout' column to model", 'CMS Plugin Error');
		}
		return true;
	}
	
	public function set_method_access(){ }
	
	protected function set_list_order( $order_by ){
		Session::set( $this->model_class.'_order_by', $order_by );
		$order = Session::get( $this->model_class.'_order' );
		if( $order == 'ASC' ){
			Session::set( $this->model_class.'_order', 'DESC' );
		}
		else if( $order = 'DESC' ){
			Session::set( $this->model_class.'_order', 'ASC' );
		}
	}
	
	protected function get_list_order(){
		$order_by = Session::get( $this->model_class.'_order_by');
		$order = Session::get( $this->model_class.'_order' );
		if( $order_by == null ){
			Session::set( $this->model_class.'_order_by', 'id' );
			$order_by = 'id';
		}
		if( $order == null ){
			Session::set( $this->model_class.'_order', 'ASC' );
			$order = 'ASC';
		}

		return $order_by .' '. $order;
	}
	
	protected function set_list_limit( $list_limit ){
		Session::set( 'list_limit', $list_limit );
		$this->list_limit = $list_limit;
		return true;
	}
	
	protected function get_list_limit( ){
		$list_limit = Session::get( 'list_limit' );
		if( $list_limit == null ) { $list_limit = $this->list_limit; } else{ $this->list_limit = $list_limit; }
		return $list_limit;
	}
	
	protected function set_list_offset( $page_no ){
		$this->page_no = $page_no;
		$this->list_offset = $page_no * $this->get_list_limit();
		Session::set( $this->model_class .'_list_offset', $this->list_offset );
	}
	
	protected function get_list_offset( ){
		$list_offset = Session::get( $this->model_class .'_list_offset' );
		if( $list_offset == null ) { $list_offset = $this->list_offset; } else{ $this->list_offset = $list_offset; }
		return $list_offset;
	}
	
	protected function set_display_action_name($array = array() ){
		$this->display_action_name = $array['name'];
	}
	
	protected function set_menu_item( $ref, $name, $url, $selected = false ){
		$this->menu_array[$ref] = array( 'name' => $name, 'url' => $url, 'selected' => $selected, 'children' => array() );
	}
	
	protected function unset_menu_item( $ref ){
		unset( $this->menu_array[$ref]);
	}
	
	protected function set_selected_menu_item( $ref ){
		if( array_key_exists( $ref, $this->menu_array ) === true ){
			if( $this->menu_array[$ref]['selected'] === true ){
				return true;
			}
			else{
				// unset existing seletce item
				foreach( $this->menu_array as $key => $value ){
					$this->menu_array[$key]['selected'] = false;
				}
				$this->menu_array[$ref]['selected'] = true;
				return true;
			}
		}
		else{
			throw new WXException("This menu Item does not exist", 'CMS Plugin Error');
		}
	}
	
/*
* method below overwrite WXControllerBase methods
*
*
*/
	/*  OVERWRITES METHOD IN WXControllerBase */
	public function run_before_filters() {
		
    foreach($this->filters as $key=>$filter) {
      if($key == $this->action || $key == "all") {
        if($filter[0]=="before") {
					if(is_array($filter[2])) {
							foreach($filter[2] as $excluded_filter) {
								if($this->action !=$excluded_filter) {
									$param = $filter[3];
									$filter = $filter[1];
									if( sizeof( $param ) > 0){$this->$filter($param);}
									else{$this->$filter();}
								}
							}
					} else {

						$param = $filter[3];          	
						$filter = $filter[1];
          	if( sizeof( $param ) > 0){$this->$filter($param);}
						else{$this->$filter();}
					}
        }
      }
    }
  }
	/*  OVERWRITES METHOD IN WXControllerBase */
	public function before_filter($action, $action_to_run, $except=null, $param = array() ) {
    $this->filters[$action]=array("before", $action_to_run, $except, $param );
  }
}
?>