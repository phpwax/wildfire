<?php

/**
 * Base Database Class
 *
 * @package PHP-Wax
 * @author Ross Riley
 * 
 * Allows models to be mapped to application objects
 **/
class CampaignMonitorModel extends WaxModel {
  
  static public $adapter = "CampaignMonitorAdapter";
	//new var to setup save method
	public $save_action = ".Create";
	//new var for fetch prefix
	public $get_action = ".Get";	
	public $delete_action = false;
	//this is a special action so you can switch the action called to select info	
	public $select_action = false; 
	//default limit  
	public $limit = 20;
	//mappings from xml name to col name
	public $rename_mappings = false;

 	function __construct($params=null) {
 		if(self::$adapter && !$this->db = new self::$adapter(self::$db_settings)) {
    	throw new WaxDbException("Cannot Initialise API Connection", "Database Configuration Error");
    }
 		$class_name =  get_class($this) ;
 		if( $class_name != 'WaxModel' && !$this->table ) {
 			$this->table = Inflections::underscore( $class_name );
 		}
 		if($params && is_string($params)) { //set the primary key to the right value;
 		  $this->{$this->primary_key} = $params;
 		}
 		
 		$this->define($this->primary_key, $this->primary_type, $this->primary_options);
 		$this->setup();
 		$this->set_identifier();
 		
 	}
 	
 	static public function load_adapter($db_settings) {
 	  if($db_settings["dbtype"]=="none") return true;
 	  $adapter = "CampaignMonitorAdapter";
 	  self::$adapter = $adapter;
 	  self::$db_settings = $db_settings;
 	}
  	
 		
 	//no joins possbile so simple version of validate
 	public function validate() {
 	  foreach($this->columns as $column=>$setup) {
 	    $field = new $setup[0]($column, $this, $setup[1]);
 	    $field->validate();
 	    if($field->errors) {
 	      $this->errors[$column] = $field->errors;
      }
 	  }
 	  if(count($this->errors)) return false;
 	  return true;
 	}
 	
 	//change the get to also see if its a requested api action
	public function __get($name) {
		if(is_array($this->get_action)){
			foreach($this->get_action as $act){
				if(substr_count($act, $name)){
					$this->row = $this->db->api($this, "get_action", $act);
					return $this;
				}
			}
		}elseif(is_string($this->get_action) && substr_count($this->get_action,$name)){
			$this->row = $this->db->api($this, "get_action",'.'.$name);
			return $this;
		}
		return parent::__get($name);
  }


  //no cache at the mo
  static public function get_cache($model, $field, $id, $transform = true) {
    return false;
  }  
  static public function set_cache($model, $field, $id, $value) {}
  
	static public function unset_cache($model, $field, $id){}
  
 /**
  *  Insert record to table, or update record data
  *  Note that this operation is only carried out if the model
  *  is configured to be persistent.
  */
 	public function save() {
		$this->before_save();
		if(!$this->validate) return false;
		if($this->persistent) {
			//as there is no update on this api - just run insert 	    
 	    $res = $this->insert();
 		}
 		$res->after_save();
 		return $res;
  }


 	public function delete(){
		return $this->db->delete($this);
	}
	
	public function update( $id_list = array() ) {
    $this->before_update();
    $res = $this->db->update($this);
    $res->after_update();
    return $res;
  }

	//these dont do anything any more!
 	public function order($order_by){return $this;}
	public function random($limit){return $this;}
	public function dates($start, $end) {}
	public function offset($offset){return $this;}
	public function group($group_by){return $this;}
	public function sql($query) {return $this;}
	public function left_join($target){return $this;}
	public function join_condition($conditions){return $this;}
	
	public function limit($limit){return $this;} //need rewrite this
	//take the page number, number to show per page, return paginated record set..
	public function page($page_number="1", $per_page=10){
		return $this;
	}
  //no join - so simple version  
 	public function set_attributes($array) {
		foreach((array)$array as $k=>$v) {
		  $this->$k=$v;
		}
	  return $this;
	}
 	
	public function filter($filters) {
 	  if(is_string($filters)) return $this;
 	  elseif(is_array($filter)) {
      foreach($filters as $key=>$filter) {
        if(!is_array($filter)) $this->filters[]= array("name"=>$key,"operator"=>"=", "value"=>$filter);
      }
    }
    return $this;
 	}

	//new function
	public function child_node(){
		return get_class($this);
	}
	public function before_select(){
		if(!$this->Date){
			$twoyearsago = gmmktime(01,01,01,date("m"), date("d"), date("Y")-2);
			$this->Date = date("Y-m-d H:i:s", $twoyearsago);
		}
	}
 	
}
?>
