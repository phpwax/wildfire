<?
/**
* Search class
* Uses the models passed in, relies on the describe method to 
* get a list of the columns, uses a like command for the search
* on each. Stores results in the array
*/
class Search
{
	/**
	 * default array of the models that will be used in the searches
	 */
	private $models 	= array('CmsPage', 'CmsPost');
	/**
	 * array used to assign a display name to a model
	 */
	private $names		= array();
	/**
	 * array of results - index links to the model and contains an array of 
	 * results for that model
	 */
	private $results	= array();
	/**
	 * DB columns to return in the results array - for formating 
	 * auto updated when a model is added
	 * WARNING - ONLY used when in_tables is true
	 */
	private $columns	= array();
	/**
	 * Used when in_tables is false. Maps model column names to 
	 * common column that will be 
	 */
	private $column_map = array();
	/**
	 * the value thats been searched for
	 */
	private $search_for 		= "";
	/**
	 * when true all the results are shown in tables - needs html to be true as well
	 */
	private $in_tables;
	/**
	 * determines if the results will be in html or array
	 */
	private $in_html;
	/**
	 * default action for the links to go to
	 */
	public $actions	= array();
	
	public function __construct($show_in_html=true,$show_in_tables=false){
		$this->in_tables = $show_in_tables;
		$this->in_html	 = $show_in_html;
		foreach($this->models as $model_name) {
			if($this->in_tables) {
				self::add_columns_for_model($model_name);
			}	else {
				self::set_column_map();
			}		
			self::add_display_name($model_name, $model_name);
			self::set_action($model_name, "view");
		}
		
	}	
	
	public function __destruct(){		
	}
	
	public function set_action($model, $action){
		$this->actions[$model] = $action;
		
	}
	/**
	 * add a column to the results - only works with in_tables set to true
	 * otherwise need to setup a column map
	 */
	public function add_column($column_name, $model_name) {
		$this->columns[$model_name] = $column_name;
	}	
	public function remove_column($column_name, $model_name) {
		
		foreach($this->columns[$model_name] as $k => $v){
			if($v == $column_name) {
				unset($this->columns[$model_name][$k]);
			}
		}	
	}
	/**
	 * clear the columns for either a specific model
	 * or all models
	 */
	public function clear_columns($model_name="") {
		if(empty($model_name)) {
			$this->columns = array();
		} else {
			$this->columns[$model_name] = array();
		}
	}
	/**
	 * add all the models from the array passed
	 */
	public function add_all_models($model_array){
		foreach($model_array as $model) {
			self::add_model($model, $model);
		}
	}
	/**
	 * add a model to the array for searching
	 */
	public function add_model($model_name, $display_name="", $action="view"){
		//if the class exists then add it to the array
		
		if(class_exists($model_name)) {
			$this->models[] = $model_name;
			//add the columns for this model to the columns array
			self::add_columns_for_model($model_name);				
			self::set_action($model_name, $action);
			self::add_display_name($model_name, $display_name);		
			return true;
		} 
		//if the class doesnt exist then return false
		else {
			return false;
		}
	}
	/**
	 * remove a model from the search array
	 */
	public function remove_model($model_name) {
		unset($this->models[$model_name]);
	}
	
	/**
	 * wipe the models array to blank
	 */
	public function clear_models() {
		$this->models = array();
	}
	
	public function clear_column_map($column="") {
		if(!empty($column)) {
			$this->column_map[$column] = array();
		} else {
			$this->column_map = array();
		}
	}
	
	public function new_column_map($column, $alias) {
		$this->column_map[$column][] = $alias;
	}
	/**
	 * public search function - loops round the models listed and
	 * calls the private search function
	 */
	public function search($search_for) {
		$search_for = trim(strip_tags($search_for));
		$this->search_for = $search_for;
		foreach($this->models as $model_name) {
			$this->results[$model_name] = self::search_model($model_name, $search_for);
		}
				
	}	
	/**
	 * pulls the results found from the seach 
	 * if html is false then returns the raw array
	 */
	public function results()
	{
		if($this->in_html) {
			return self::process_results($this->in_tables);
		} else {
			return $this->results;
		}
	}
	/**************************
	 * PRIVATE FUNCTIONS
	 **************************/
	private function set_column_map() {
		$id_alts 			= array('id', 'uid');
		$title_alts		= array('title', 'name', 'username');
		$content_alts	= array('content', 'body');
		$excerpt_alts = array('excerpt', 'tagline', 'tag', 'intro', 'introduction');
		
		$this->column_map['id'] 			= $id_alts;
		$this->column_map['title']		= $title_alts;
		$this->column_map['content']	= $content_alts;
		$this->column_map['excerpt']	= $excerpt_alts;
	}
	/**
	 * use this function to add a plain english name to a model
	 */
	private function add_display_name($model_name, $display_name) {
		
		if(empty($model_name)) { 
			return false;
		}
		if(!empty($display_name)) {
			$this->names[$model_name] = $display_name;
		} else {
			$this->names[$model_name] = $model_name;
		}
		return true;
	}
	/**
	 * loop around the results array and display the information
	 */
	private function process_results()
	{
		$html = "";
		foreach($this->models as $model_name) {
			$html .= self::get_model_results($model_name);
		}
		return $html;
	}
	/**
	 * private function to get the results for the specific model
	 */
	private function get_model_results($model_name) {
		$action	 = $this->actions[$model_name];
		$results = $this->results[$model_name];
		$fields	 = $this->columns[$model_name];
		$name		 = $this->names[$model_name];
		$html = "<div class='search_results'>
							<h2>Search Results For '" .$this->search_for. "' in ". $name. "</h2>
							<p>Found ". sizeof($results) . " results</p>							
						";
		if($this->in_tables) {
			$html .= self::tableise($fields, $results);
		}	else {
			$html .= self::inline($results, $action);
		}			
		$html .= "</div>";
		return $html;
	}
	/**
	 * parses the search data into styled p's, h2's etc
	 */
	private function inline($results, $action) {
		
		$html = "";
		foreach($results as $result) {
			$tmp 	= "<h4>".self::get_mapped("title", $result) . "</h4>";
			$raw 	= self::get_mapped("excerpt", $result);
			$tmp.= "<p>".self::highlight($raw, $this->search_for) . "</p>";
			$raw 	= self::get_mapped("content", $result);
			$tmp.= "<p>".self::highlight($raw, $this->search_for) . "</p>";
			$tmp .= "<p><a href='". $action . "/" . self::get_mapped("id", $result) . "' >View more..</a></p><br />\n";
			$html .= $tmp;
		}
		return $html;
	}
	/**
	 * use the results information and turns it into a table
	 */
	private function tableise($fields, $results) {
		$html = "<table><tr>";
		foreach($fields as $col){
			$html .= "<th>" . $col . "</th>";
		}
		$html .= "</tr>";
		if(empty($results)) { 
			$html .= "<tr><td colspan='" . sizeof($fields)."'><em>No Results Found</em></td></tr>";
		}
		foreach($results as $result){
			
			$html .= "<tr>";
			foreach($fields as $field) {
				
				$html .= "<td>" . $result[$field] . "</td>";
			}
			$html .= "</tr>";
		}
		$html .= "</table>";
		return $html;
	}
	/**
	 * return the value for the mapped column 
	 */
	private function get_mapped($column, $result) {
		$vaule = "";
		foreach($this->column_map[$column] as $alias) {
			if(isset($result[$alias])) {
				$value = $result[$alias];
			}
		}
		return $value;
	}
	/**
	 * adds the columns from the model to the list to be checked
	 * plus merges them so its unique
	 * WARNING only used when in_tables is true
	 */
	private function add_columns_for_model($model_name) {
	
		$model 												= new $model_name;
		$columns 											= $model->column_info();
		$columns											= array_keys($columns);
		if(!is_array($this->columns[$model_name])) {
			$this->columns[$model_name] = array();
		}
		$this->columns[$model_name] 	= array_merge($columns, $this->columns[$model_name]);
		$this->columns[$model_name]		= array_unique($this->columns[$model_name]);		
	}
	
	/**
	 * search the model for the string requested
	 */
	private function search_model($model_name, $search_for) {
		//if the class exists then - check again
		if(class_exists($model_name)) {
			//create the model
			$model = new $model_name();
			//create the columns to search
			$columns = $model->column_info();
			$columns = array_keys($columns);
			//create the sql conditions string
			$conditions = "";
			foreach($columns as $column) {
				$conditions .= $column ." LIKE '%" . $search_for . "%' OR ";
			}
			//remove the trailing OR
			$conditions = substr($conditions, 0, -3);
			$results		= $model->find_all(array('conditions'=>$conditions));			
			$data				= array();
			$index			= 0;
			$cols				= $this->columns[$model_name];
			foreach($results as $result) {	
							
				foreach($cols as $column) {
					$data[$index][$column] = $result->$column;
				}
				$index ++;
			}			
			return $data;
		}
		//class isnt loaded, return false 
		else {
			return false;
		}
	}
	
	/**
	 * highlight the item thats been searched for and shrink the string size to max of 90
	 * showing 45 chars both sides
	 */
	private function highlight($content, $highlight) {
		$content 	= strip_tags($content);
		$pos			= strpos($content, $highlight);
		if($pos > 0) {
			$content = ".." . substr($content, $pos-45, 90) . "..";
			$content 	= str_ireplace($highlight, "<em>".$highlight."</em>", $content);		
			return $content;
		}
		return "";
	}
}

?>