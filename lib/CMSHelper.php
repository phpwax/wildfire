<?php
/**
* CMS Helper
* @package wxFramework
* @subpackage CMSPlugin
* @author WebXpress <charles@webxpress.com>, <john@webxpress.com>
* @version 0.1
*
* DETAILS ON OPTIONS ARRAY
*		- model : 
*				name of the DB model to use (overwritten in the class functions, there for validations)
*		- limit : 
*				value for SQL limit command, by default empty
*		- conditions :
*				the WHERE part of the sql without the keyword where
*		- direction :
*				order direction, either ASC or DESC (default).
*		- html :
*				boolean deciding if the function should return a html string or an array
*		- order :
*				column to order the results by - can be any field in the DB - defaults to id. 
*				WARNING! can break if column specified doesnt exist
*		- action :
*				the action to use in the url path (default: view). For example if you are
*				viewing a list of pages on the root or the url (/) and you want to view page 
*				number 4 url would be /view/4
*		- name_field :
*				this is the column from the DB to use as the display name for the a tag
*				WARNING! can break if column specified doesnt exist
*		- class
*				the name of a class that can be applied to the items
*		- show_sub
*				boolean that if set to true will display any sub categories when calling the
*				list_categories functions  	
*/
/**
* HELPER FUNCTIONS INCLUDED BELOW
*/

class CMSHelper extends WXHelpers {
	
	private $options = array('model'=>"", 'limit' => '', 'conditions' => '', 'direction' => 'DESC', 'html' =>true, 'order'=>"id", 'action'=>"view", 'name_field'=>"title", 'class'=>"itemsaved", 'show_sub' => false);
	

	/**
	 * public wrapper - calls private function do_list_categories to
	 * return a ul of all categories
	 * @return html string or array depending on value of options['html']
	 */
	public function list_categories($parent_id=0, $options=array()) {
		$options 	= $this->overwrite_options( $this->options, $options );
		if($options['html'] === true) {
			return "<ul>" . self::do_html_list_categories($options, $parent_id) . "</ul>";
		} else {
			return self::do_list_categories($options, $parent_id);
		}
	}
	
	/**
	 * public wrapper - calls private function do_list_categories to
	 * return a ul of all posts - only pulls posts in category
	 */
	public function list_posts( $category_id=0, $options=array() ) {
		$options 	= $this->overwrite_options( $this->options, $options );
		if($options['html'] === true) {
			return "<ul>" . self::do_list_posts($options, $category_id) . "</ul>";
		} else {
			return self::do_list_posts($options, $category_id) ;
		}
	}	
	/**
	 * returns a ul of all posts - no filtering 
	 */
	public function list_all_posts($options) {
		$options 	= $this->overwrite_options( $this->options, $options );
		if($options['html'] == true) {
			return "<ul>" . self::do_list_all_posts($options) . "</ul>";
		} else {
			return self::do_list_all_posts($options);
		}
	}
	/**
	 * returns all the users stored on the system
	 */
	public function list_users($options=array()) {
		$options['model'] 			= "CmsUser";
		$options 	= $this->overwrite_options( $this->options, $options );
		if($options['html'] === true) {
			return "<ul>" . self::sub_menu($options) . "</ul>";
		} else {
			return self::sub_menu($options);
		}
	}
	
	/**
	 * list all the pages
	 */
	public function list_pages($options=array()) {
		$options['model'] = "CmsPage";
		$options 	= $this->overwrite_options( $this->options, $options );
		if($options['html'] === true) {
			return "<ul>" . self::sub_menu($options) . "</ul>";
		} else {
			return self::sub_menu($options);
		}
	}
	/**
	 * list all the resources
	 */
	public function list_resources($options=array()) {
		$options['model'] 			= "CmsResource";
		$options 	= $this->overwrite_options( $this->options, $options );
		if($options['html'] === true) {
			return "<ul>" . self::sub_menu($options) . "</ul>";
		} else {
			return self::sub_menu($options);
		}
	}
	
	/**
	 * this is used to return a short list of items that are in the 
	 * same category (so id and category are required - id so this post isnt pulled)
	 */
	public function related_posts($id, $options = array(), $category_id="") {
		$options['limit'] = 4;
		if(empty($category_id)) {
			$category_id = self::get_category_id($id);
		}
		
		$options 	= $this->overwrite_options( $this->options, $options );
		if($options['html'] == true) {
		
			return "<ul>" . self::do_list_posts($options, $category_id, $id) . "</ul>";	
		} else {
			return self::do_list_posts($options, $category_id, $id);	
		}	
	}
	
	/**
	 * gets the individual information for the post whose id is passed in
	 */
	public function get_post( $id, $html = true, $fields=array('title', 'id'), $show_related=false )
	{
		$post = new CmsPost($id);
		
		if( $html === false )
		{
			return $post;
		}
		else
		{
			$html = '';
			foreach($fields as $name) {
				$html .= self::content_tag( 'div', $post->$name, array( 'class' => 'post_'.$name ) );
			}
			if($show_related) {
				$html .= "<br />" . self::related_posts($id, $options);
			}
		
			return $html;
		}		
	}
	
	/**
	 * gets the individual page data for the id thats passed in
	 */
	public function get_page( $id, $html = true, $fields=array('title', 'id') )
	{				
		$page = new CmsPage($id);
		
		if( $html === false ){
			return $page;
		}
		else{
			$html = '';
			foreach($fields as $name) {
				$html .= self::content_tag( 'div', $page->$name, array( 'class' => 'page_'.$name ) );
			}						
			return $html;
		}
	}
	
	public function search_box($models = array()) {
		if(empty($models)) {
			$models = array('CmsPage' => "Pages", 'CmsPost'=>"Posts");
		}
		$contents = start_form_tag(array('action'=>"search"));
		$options = "<option value='all'>Search All..</option>";
		foreach($models as $k => $model) {
			$options .= "<option value='$k~$model'>$model</option>";
		}
		$contents .= "<label for='search[query]'>Search</label><br />".text_field_tag("search[query]");
		$contents .= select_tag("search[model][]", $options, $models);
		$contents .= "<input src='/images/submit-button.gif' title='submit the form' id='submit' name='submit' type='image' />";
		       
		$contents	.= end_form_tag();
		$html = self::content_tag( 'div', $contents, array( 'class' => 'searchbox' ) );
		
		return $html;
	}
	/****************************
	 * PRIVATE FUNCTIONS
	 ****************************/
	private function get_category_id($post_id) {
		$post_cat = new CmsPostToCategory();
		$res			= $post_cat->find_all(array('limit'=>1, 'conditions'=>"post_id = $post_id"));
		
		return $res[0]->category_id;
	}
	/**
	 * uses the model passed in to create a string of li's (or array) from the database
	 * of all the entries - ie if thie is page model all the published pages
	 * will be shown
	 * if the html param is false then just returns the db results 
	 */	
	private function sub_menu( $options = array() ){
		
		$options 	= $this->overwrite_options( $this->options, $options );
		$model 		= $options['model'];	
				
		$model 		= new $model;
		/* the name field is the name of the field that should be shown in the link - 
		ie the username for the user model	*/		
		$name			= $options['name_field'];
		$params		= $options;			
		$posts = $model->find_all( $params );
				
		if( $options['html'] === false ){
			return $posts;
		}
		else{
			$html = '';
		
			foreach($posts as $info) {								
				$html .= "<li>". link_to($info->$name, array('action'=>$options['action'], 'id'=>$info->id), array('class'=>$options['class']) ) . "</li>";
			}//end foreach
			
			return $html;
		}//end if
	}
	
	/**
	 * Uses the CmsCategory model to pull all the categories 
	 * from the DB and depending upon the options passed in
	 * can return either an array of results or a html string
	 * Can also show all sub categories
	 * HTML ONLY
	 * @return string
	 */
	private function do_html_list_categories($options = array(), $parent_id=0) {
		$options 									= $this->overwrite_options( $this->options, $options );
		$options['model']					= "CmsCategory";
		$newoptions 							= $options;		
		$newoptions['html'] 			= false;		
		if(!empty($options['conditions'])) {
			$and = " AND ";
		} else {
			$and = "";
		}
		$newoptions['conditions'] = $options['conditions'] . $and ." parent_id=". $parent_id;
		$results									= self::sub_menu($newoptions);		
			
		foreach($results as $cat) {			
			$loopoptions	= $options;				
			$html	.= "<li>" . link_to($cat->$options['name_field'], array('action'=>$options['action'], 'id'=>$cat->id), array('class'=>$options['class']) );
			//if show sub is set then append the sub categories
			if($options['show_sub'] === true) {			
				$tmp 	= self::do_html_list_categories($loopoptions, $cat->id);
				if(!empty($tmp)) {
					$html .= "<ul>" . $tmp . "</ul>";
				}
			}
			$html .= "</li>";
		}				
		return $html;
	}
	/**
	 * Uses the CmsCategory model to pull all the categories 
	 * from the DB and depending upon the options passed in
	 * can return either an array of results or a html string
	 * Can also show all sub categories
	 * ARRAY ONLY
	 * @return array
	 */
	private function do_list_categories($options = array(), $parent_id=0) {
		$options 									= $this->overwrite_options( $this->options, $options );
		$options['model']					= "CmsCategory";
		$newoptions 							= $options;		
		$newoptions['html'] 			= false;		
		if(!empty($options['conditions'])) {
			$and = " AND ";
		} else {
			$and = "";
		}
		$newoptions['conditions'] = $options['conditions'] . $and ." parent_id=". $parent_id;
		$results									= self::sub_menu($newoptions);		
		$res	= array();
			
		foreach($results as $cat) {			
			$loopoptions	= $options;				
			$res[$parent_id][$cat->id] = $cat;
			//if show sub is set then append the sub categories
			if($options['show_sub'] === true) {			
				$res[$cat->id] = self::do_list_categories($loopoptions, $cat->id);
			}
			
		}		
		
		return $res;
	}
	/**
	 * finds all the posts associated with the category, if the current_post_id is
	 * set then adds in a fliter so current isnt shown (used for get_related_posts)
	 */
	private function do_list_posts($options, $category_id, $current_post_id="") {
		$category_post 	= new CmsPostToCategory();
		$conditions			= "category_id =" . $category_id;
		$name						= $options['name_field'];
		$newoptions 		= $options;
		if(!empty($current_post_id)) {
			$conditions .= " AND post_id <> " . $current_post_id;
		}		
		
		if(!empty($options['conditions'])) {
			$newoptions['conditions'] = $options['conditions'] . " AND " .$conditions;
		} else {
			$newoptions['conditions'] = $conditions;
		}
		//blank the limit so all results are found
		$newoptions['limit'] = "";
		
		$options  = $this->overwrite_options( $this->options, $newoptions );
		$post_ids	= $category_post->find_all($newoptions);
		$postobj	= new CmsPost();
		$id_str		= "";
		//make a string of the the ids to call in sql
		foreach($post_ids as $id) {
			$id_str .= $id->post_id . ",";
		}
		$id_str		= substr($id_str,0,-1);
		$condition= " id IN ($id_str)";
		
		$options['conditions'] = $condition;
		
		$posts 		= $postobj->find_all($options);
		if($options['html'] === false) {
			return $posts;
		}
		
		$html = "";
		$res = array();
		foreach($posts as $post) {
			$html	.= "<li>" . link_to($post->$name, array('action'=>$options['action'], 'id'=>$post->id), array('class'=>$options['class']) );
				$html .= "</li>";
		
		}		
		return $html;
		
	}
	/**
	 * list all the posts stored in the db - link only
	 */ 
	private function do_list_all_posts($options) {
		$post 		= new CmsPost();
		$options  = $this->overwrite_options( $this->options, $options );
		$post_ids	= $post->find_all($options);
		$name			= $options['name_field'];
		$html = "";
		
		if($options['html'] == false) {
			return $post_ids;
		}
		
		foreach($post_ids as $post) {
			$html	.= "<li>" . link_to($post->$name, array('action'=>$options['action'], 'id'=>$post->id), array('class'=>$options['class']) );
			$html .= "</li>";						
		}	
		return $html;
	}
	
	private function obj_to_array(){}
	
	private function overwrite_options( $default_options, $options ){
		foreach( $options as $key => $value ){
			if( array_key_exists( $key, $default_options ) ){
				$default_options[$key] = $value;
			}
			else{
				throw new WXException( "'{$key}' is an invalid CMShelper option.", "Parameter is invalid" );
			}
		}
		return $default_options;
	}
}
/* ******* END HELPER CLASS ***************** */
function list_posts() {
	$cms_helper = new CMSHelper();
  $args = func_get_args();
  return call_user_func_array(array($cms_helper, 'list_posts'), $args);
}
function list_all_posts() {
	$cms_helper = new CMSHelper();
  $args = func_get_args();
  return call_user_func_array(array($cms_helper, 'list_all_posts'), $args);
}

function list_categories() {
	$cms_helper = new CMSHelper();
  $args = func_get_args();
  return call_user_func_array(array($cms_helper, 'list_categories'), $args);
}

function list_users() {
	$cms_helper = new CMSHelper();
  $args = func_get_args();
  return call_user_func_array(array($cms_helper, 'list_users'), $args);
}

function list_pages() {
	$cms_helper = new CMSHelper();
  $args = func_get_args();
  return call_user_func_array(array($cms_helper, 'list_pages'), $args);
}

function list_resources() {
	$cms_helper = new CMSHelper();
  $args = func_get_args();
  return call_user_func_array(array($cms_helper, 'list_resources'), $args);
}

function related_posts() {
	$cms_helper = new CMSHelper();
  $args = func_get_args();
  return call_user_func_array(array($cms_helper, 'related_posts'), $args);
}

function get_post() {
	$cms_helper = new CMSHelper();
  $args = func_get_args();
  return call_user_func_array(array($cms_helper, 'get_post'), $args);
}

function get_page() {
	$cms_helper = new CMSHelper();
  $args = func_get_args();
  return call_user_func_array(array($cms_helper, 'get_page'), $args);
}

function search_box() {
	$cms_helper = new CMSHelper();
  $args = func_get_args();
  return call_user_func_array(array($cms_helper, 'search_box'), $args);
}
?>