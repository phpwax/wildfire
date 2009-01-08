<?php

class CampaignMonitorAdapter extends WaxDbAdapter {	
 
  public $db;
  protected $date = false;
	protected $timestamp = false;
	protected $db_settings; 
	
  //new params for the api
	public $base_url = false;
	public $url = false; //address to go to
	//curl session details
	public $curl_post_arguments = false; //post information
	public $return_curl_data = true; //return data from the curl session?
	public $max_retries = 3; //number of times to try connection
	public $sync_prefix = "Client.Get"; //call to make to sync things
	public $curl_headers = false;
	
	public $call_method = false; //if your using http (curl) or soap
	//an array of everything
	public $all_results = false;
	
	/**
	 * 	in the constructor you create the settings array start to create curl data
	 *
	 * @param string $db_settings 
	 * @return void
	 * @author charles marshall
	 */
  public function __construct($db_settings=array()) {
    $this->db_settings = $db_settings;
    if($db_settings['url']=="none") return false;
		if(!$db_settings['url']) $this->base_url = $this->url = $db_settings['url'] = 'http://api.createsend.com/api/api.asmx/';
    if(!$db_settings['content_type']) $db_settings['content_type']= 'application/x-www-form-urlencoded';
    if(!$db_settings['char_set']) $db_settings['char_set']='UTF-8';
    if(!$db_settings['header_accept']) $db_settings['header_accept']='application/x-www-form-urlencoded';
		if(!$db_settings['max_retries']) $db_settings['max_retries']=3;
		//init a connection
    $this->db = $this->connect($db_settings);
		//setup curl headers
		$this->curl_headers[] = 'Content-Type: '.$db_settings['content_type'].'; charset='.$db_settings['char_set'];
    $this->curl_headers[] = 'Accept: '.$db_settings['header_accept'].'; charset='.$db_settings['char_set'];
		//load vars from config file
		if(Config::$initialised){			
			$conf = Config::get("campaign_monitor");
			if($this->apikey = $conf['ApiKey']) $this->curl_post_arguments = "ApiKey=".$this->apikey.'&';
		}else throw new WaxDbException("Cannot Initialise Campaign Monitor API", "Database Configuration Error");
  }
  
	/**
	 * the default connection function - curl based
	 *
	 * @param string $db_settings 
	 * @return void
	 * @author charles marshall
	 */	
  public function connect($db_settings) {
    return curl_init($db_settings['url']);
  }

	/**
	 * uses the model passed in to work out the the what command to call 
	 * on the api to insert a new value - also works out to use soap or curl..
	 * @param string $CampaignMonitorModel 
	 * @return void
	 */	
  public function insert(CampaignMonitorModel $model) {
		if($model->save_action)	return $this->api($model, "save_action");			
		else return $model;
	}
  /**
   * update just does the insert
   *
   * @param string $CampaignMonitorModel 
   * @return void
   */  
  public function update($model) {
    return $model;
  }
  /**
   * deletes if there is an action set - most parts of the api don't have a delete
   * 
   * @param string $CampaignMonitorModel 
   * @return void
   */  
  public function delete(CampaignMonitorModel $model) {
    if($model->delete_action) return $this->api($model, "delete_action");
		else return $model;
  }
  /**
   * calls the before select hook, if the all_results var is not set
   * then call the api and find all the records and then filter them according to 
	 * whats set on the model filters array
   * @param string $CampaignMonitorModel 
   * @return void
   */  
  public function select(CampaignMonitorModel $model) {
		$model->before_select();  //before hook	
	 	//call the api to find everything
		if($model->select_action) $model->row = $this->all_results = $this->api($model, "select_action");
		else $model->row = $this->all_results =  $this->api($model, "get_action");
		//if filters then check data
		if(count($model->filters) && is_array($model->row)){
			$res = array();
			foreach($model->row as $data){ //loop round each record on the model
				foreach($model->filters as $filter){ //compare to each filter
					if(!is_array($filter["value"])){ //if the filter value is an array
						if($found = $this->match_in_row($filter['name'], $filter['value'], $data, $model) ) $res[] = $found;
					}
				}
			}		
		//otherwise return all results					
		}else $res=$this->all_results;
		
    return $res;
  }

	/**
	 * compare value of $col against $val on model
	 * @param string $col 
	 * @param string $val 
	 * @param string $data 
	 * @param string $model 
	 * @return void
	 */	
  public function match_in_row($col, $val, $data, $model){
		if($data[$col] == $val) return $data;
		else return false;
	}

	/**
	 * convert the model columns into a &arg=val string
	 * @param string $model 
	 * @return void
	 */	
	public function query_string($model){
		$query_string = "";
		foreach($model->columns as $col=>$setup){
				if($val = $model->$col)	$query_string .= $col.'='.$val.'&';
		}
	  return $query_string;
	}
	/**
	 * takes the model and return the primary key in col=val string
	 * @param string $model 
	 * @return string
	 */	
	public function primary_key_string($model){return $model->primary_key .'='.$model->primval();}
	/**
	 * count all the entries in the all_results and return
	 * @param string $model 
	 * @return integer
	 */	
  public function row_count_query($model) {return count(array_keys($this->all_results));}
	/**
	 * return all results, no search facility as yet
	 * @param string $CampaignMonitorModel 
	 * @param string $search_for 
	 * @param string $columns 
	 * @return array
	 */	
  public function search(CampaignMonitorModel $model, $search_for, $columns=array()){ return $this->all_results;}
	
	/**
	 * takes the model and the field name,checks them and
	 * then sets the call_method and appends the action used 
	 * to this objects url
	 * @param string $CampaignMonitorModel 
	 * @param string $field 
	 * @return void
	 */
	public function setup_call(CampaignMonitorModel $model, $action, $field=false){
		$this->call_method = false;
		$action = $model->$action;
		if($field && $model->$field) $this->url.=$field;
		elseif($field && is_array($action) && isset($action[$field])){ echo "@";
			$this->url.=$field;
			$this->call_method = $action[$field];
		}elseif(is_array($action) ){
			//get the keys
			$keys = array_keys($action);
			//if the key is not numeric (as in its a string - in this case the action to call)
			if(!is_numeric($keys[0])){				
				$this->url.=$keys[0]; //then add that to $url to be called
				$this->call_method = $action[0]; //and set the call method to the value of first save action
			}else	$this->url .= $action[0]; //if the array key was a number then use the value and dont set a method
		}else $this->url.=$action;
		if(!$this->call_method) $this->call_method = "http";
	}

	/**
	 * use the api_action requested to set if your using http (curl) or soap
	 * create the curl post arguments, send it off and return the parsed form of 
	 * the xml
	 * @param string $CampaignMonitorModel 
	 * @param string $api_action 
	 * @return array
	 */	
	public function api(CampaignMonitorModel $model, $action_type, $api_action=false){
		$this->url = $this->base_url;
		$this->setup_call($model, $action_type, $api_action);
		$func=$this->call_method."_command";
		if($api_action != "delete_action") $this->curl_post_arguments .= $this->query_string($model);
		else $this->curl_post_arguments .= $this->primary_key_string($model);
		if(method_exists($model, $func)) return $model->$func($this->url);
		else return $this->parse_xml($this->$func($this->url), $model);
	}
	
	/**
	 * setup the curl session ready for transporting data
	 * to the api
	 * call the api until either data is returned or max_retries 
	 * is reached
	 * @param string $url 
	 * @return mixed
	 */	
	protected function http_command($url){
		echo "http cmd...<br />";
		$this->db = curl_init($url);
		if($this->curl_post_arguments){
			curl_setopt($this->db, CURLOPT_POST, true);	  	
	  	curl_setopt($this->db, CURLOPT_POSTFIELDS, $this->curl_post_arguments);
		}
		curl_setopt($this->db, CURLOPT_HTTPHEADER, $this->curl_headers);		
	  curl_setopt($this->db, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($this->db, CURLOPT_FOLLOWLOCATION, 1);
		$res = false;
		while(!$res && $i < $this->max_retries){
			$res = $this->curl_send();
			$i ++;
		}
		return $res;
	}
	/**
	 * action the curl request, return result or false
	 * @return mixed
	 */	
	private function curl_send(){
		$exec =  curl_exec($this->db);		
		$info = curl_getInfo($this->db);
		if($info['http_code'] == 200){
			if($this->return_curl_data) return $exec;
			else return true;
		}else return false;		
	}

	/**
	 * parse the xml string passed in, pull the relevant data from the 
	 * doc and convert to an array
	 * @param string $xml_str 
	 * @param string $model 
	 * @return array
	 */	
	protected function parse_xml($xml_str, $model){

		$simple = simplexml_load_string($xml_str, "SimpleXMLElement", LIBXML_NOCDATA);
		$res = array();
    if($child_node = $model->child_node($this->call_method)) {
      for($i=0; $i<=count($simple); $i++) {
        if($simple->{$child_node}[$i]){
					$info = (array) $simple->{$child_node}[$i];
					foreach($info as $field=>$val){
						if(isset($model->columns[$field])) $res[$i][$field] = $val;
						elseif($model->rename_mappings[$field]) $res[$i][$model->rename_mappings[$field]] = $val;
					}
				}
      }
      
    }
    return $res;
	}	
	
	/** FUNCTIONS FROM DB ADAPTOR - no used **/
	//does nothing now
  public function group($model){ return "";}
  public function having($model){return ""; }
  public function order($model){return "";}
  public function limit($model){return "";}
	//no longer used
  public function syncdb(CampaignMonitorModel $model) { return "NO DB REQUIRED";}
  protected function map_operator_value($operator, $value) {return "";}
	//not sql based - these arent used
	public function prepare($sql){}	
  public function exec($pdo_statement, $bindings = array(), $swallow_errors=false){}
  public function query($sql) {return $this;}
  public function quote($string) {return $this;}  
  public function random() {return "";}
	public function left_join($model){return "";}
  public function filter_sql($model){ return "";}
  public function select_sql($model){ return "";}
  public function insert_sql($model){ return "";}
  public function update_sql($model){ return "";}  
  public function delete_sql($model){ return "";}  
  public function view_table(CampaignMonitorModel $model) { return " .. cannot check, remote api does not support this ..\n";}   
  public function view_columns(CampaignMonitorModel $model) { return ".. no remote view ..\n";}
  public function create_table(CampaignMonitorModel $model) {	return ".. no remote view ..\n";}
  public function drop_table($table_name) { return ".. no drop allowed ..\n";}
  public function column_sql(WaxModelField $field, WaxModel $model) {return "";}
  public function add_column(WaxModelField $field, WaxModel $model, $swallow_errors=false) { return ".. no column adding allowed ..\n";}
  public function alter_column(WaxModelField $field, WaxModel $model, $swallow_errors=false) {return ".. no column updated allowed ..\n";}


}

?>