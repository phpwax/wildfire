<?php
/**
* CMS Controller
* @package wxFramework
* @subpackage CMSPlugin
* @author WebXpress <john@webxpress.com>
* @version 1.0
*/

class CMSAdminPostController extends CMSAdminComponent{
	public $model_class = 'CmsPost';
	public $model_class_vc = 'CmsPostVc';
	public $access = 'editor';
	public $display_name = "Posts";
	public $list_scaffold_columns = array( 'id' => 'ID', 'title' => 'Title', 'excerpt' => 'Excerpt', 'created' => 'Created', 'status' => 'Status', 'checkout' => 'Checked Out' );
	public $list_scaffold_columns_vc = array( 'title' => 'Title', 'author_id' => 'Author', 'excerpt' => 'Excerpt', 'created_vc' => 'Created');
	
	function __construct( ) {
		parent::__construct();
		$this->sub_links["show_trash"] = "View Trash";
		$this->sub_links["global_checkin"] = "Checkin all Posts";
		$this->categories = self::get_categories();
		$this->set_selected_menu_item( 'post' );
		$this->before_filter("view", "set_display_action_name", null, array('name'=>'View Post / Update Options'));
	}
	
	public function index( ) {
		$this->total_items = $this->model->count( array( 'conditions' => 'status > 0' ) );
		$this->all_rows = $this->model->find_all( array( 'conditions' => 'status > 0', 'order' => $this->get_list_order(), 'limit' => $this->get_list_limit(), 'offset' => $this->get_list_offset( ) ) );
		if(!$this->all_rows) $this->all_rows=array();
	}
	
	public function create() {
		$this->post = new $this->model_class;
		$this->save($this->post);
		$this->form = $this->render_partial("form");
	}
	
	protected function save($post) {
		if( $post->is_posted() ) {
			$post->author_id = $this->current_user->id;
			if($post->update_attributes($_POST[$this->model_name]) ) {
        Session::add_message("Post Successfully Saved");
				self::delete_related_categories($post->id);
				if( sizeof($_POST['category']) > 0 ){
					foreach( $_POST['category'] as $value ){
						$post_to_category = new CmsPostToCategory;
						$post_to_category->post_id = $post->id;
						$post_to_category->category_id = $value;
						if( $post_to_category->save() ){
							Session::add_message("Post Successfully Saved to category");
						}
					}
				}
        $this->redirect_to('index');
      }
		}
		return false;
	}
	
	public function view(){
		if(!$id = $this->route_array[0]) $this->redirect_to("index");
		$this->post = new $this->model_class($id);
		$this->post->do_before_save = false;
		$this->save($this->post);
		
		$model_vc = new $this->model_class_vc;
		$version_wc_rows = $model_vc->find_all( array( 'conditions' => "record_id=$id AND working_copy = 1" ) );
		$this->working_copy = $version_wc_rows[0];
		
		$this->version_rows = $model_vc->find_all( array( 'conditions' => "record_id=$id AND working_copy != 1" ) );
		
		$this->categories = self::get_categories($id);
	}
	
	public function delete(){
		$this->accept_routes=1;
		if($_POST['delete']) {
			self::delete_related_categories($this->route_array[0]);	
			$this->model->delete($this->route_array[0]);
			Session::add_message("Post successfully deleted");		
			$this->redirect_to('show_trash');
		}
		else{
			Session::add_message("Problem deleting post");
		}
		$this->redirect_to('show_trash');
	}
	
	public function update_categories(){
		self::delete_related_categories($_POST['id']);
		if( sizeof($_POST['category']) > 0 ){
			foreach( $_POST['category'] as $value ){
				$post_to_category = new CmsPostToCategory;
				$post_to_category->post_id = $_POST['id'];
				$post_to_category->category_id = $value;
				if( $post_to_category->save() ){
					Session::add_message("Post Successfully Saved to category");
				}
			}
		}
		$this->redirect_to("view/".$_POST['id']);
	}
	
	private function get_categories( $post_id = null ){
		$category_model = new CmsCategory;
		$categories_result = $category_model->find_all( );
		
		// if post_id map selected items
		$selected = array();
		if( $post_id != null ){
			$post_to_category_model = new CmsPostToCategory;
			$selected_categories = $post_to_category_model->find_all( array( 'conditions' => "post_id = '$post_id'" ) );

			foreach( $selected_categories as $cat ){
				$selected[] = $cat->category_id;
			}
		}
		
		$categories = array();
		foreach( $categories_result as $cat ){
			$categories[$cat->id] = array( 'name'=>$cat->name, 'selected'=>false);
			if( in_array( $cat->id, $selected ) ){
				$categories[$cat->id]['selected'] = true;
			}
		}
		return $categories;
	}
	
	private function delete_related_categories( $post_id ){
		$post_to_category_model = new CmsPostToCategory;
		$categories = $post_to_category_model->find_all( array( 'conditions' => "post_id = '$post_id'" ) );
		foreach( $categories as $category ){
			if( $post_to_category_model->delete($category->id) == 0){
				throw new WXException("Error deleting records.", 'CMS Plugin Error');
			}
		}
	}
}
?>