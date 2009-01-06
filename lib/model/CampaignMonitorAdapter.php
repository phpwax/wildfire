<?php

class CampaignMonitorAdapter extends WaxDbAdapter {	
 
  public $db;
  protected $date = false;
	protected $timestamp = false;
	protected $db_settings;
	
  //new params for the api
	public $url = false; //address to go to
	public $headers = false; //headers to send
	public $post_arguments = false; //post information
	public $return_curl_data = true; //return data from the curl session?
	public $max_retries = 3; //number of times to try connection
	public $sync_prefix = "Client.Get";
	
	public $all_results = false;
	

  public function __construct($db_settings=array()) {
    $this->db_settings = $db_settings;
    if($db_settings['url']=="none") return false;
		if(!$db_settings['url']) $this->url = $db_settings['url'] = 'http://api.createsend.com/api/api.asmx/';
    if(!$db_settings['content_type']) $db_settings['content_type']= 'application/x-www-form-urlencoded';
    if(!$db_settings['char_set']) $db_settings['char_set']='UTF-8';
    if(!$db_settings['header_accept']) $db_settings['header_accept']='application/x-www-form-urlencoded';
		if(!$db_settings['max_retries']) $db_settings['max_retries']=3;
    
    $this->db = $this->connect($db_settings);
		//load new yaml file
		if(Config::$initialised){
			$this->headers[] = 'Content-Type: '.$db_settings['content_type'].'; charset='.$db_settings['char_set'];
	    $this->headers[] = 'Accept: '.$db_settings['header_accept'].'; charset='.$db_settings['char_set'];
			$conf = Config::get("campaign_monitor");
			if($this->apikey = $conf['ApiKey']) $this->post_arguments = "ApiKey=".$this->apikey.'&';
		}else throw new WaxDbException("Cannot Initialise Campaign Monitor API", "Database Configuration Error");
  }
  
  public function connect($db_settings) {
    return curl_init($db_settings['url']);
  }

  public function insert(WaxModel $model) {
    $url = $this->url.get_class($model).$model->save_action;  
		$this->post_arguments .= $this->insert_sql($model);
		$res = $this->parse_xml($this->curl_command($url), $model);
    return $model;
	}
  
  public function update(WaxModel $model) {
    return $this->insert($model); //no difference between save and update?
  }
  
  public function delete(WaxModel $model) {
    return $this; //no delete function
  }
  
  public function select(WaxModel $model) {
		//rewrite
    return $this;
  }
  
  public function prepare($sql) {
    try { $stmt = $this->db->prepare($sql); } 
    catch(PDOException $e) {
		  $err = $e->getMessage();
			throw new WaxSqlException( "{$err}", "Error Preparing Database Query", $sql );
      exit;
		}
		return $stmt;
  }
  
	//does nothing now
  public function exec($pdo_statement, $bindings = array(), $swallow_errors=false){}
  public function query($sql) {return $this;}
  public function quote($string) {return $this;}  
  public function random() {return "";}
	public function left_join($model){return "";}
  public function group($model){ return "";}
  public function having($model){return ""; }
  public function order($model){return "";}
  public function limit($model){return "";}
	//no longer used
  protected function map_operator_value($operator, $value) {}
  
  
  /**
   * Query Specific methods, construct driver specific language
   */
	public function insert_sql($model) {
		$query_string = "";
		foreach($model->columns as $col=>$setup){
			if($val = $model->$col)	$query_string .= $col.'='.$val.'&';
		}
	  return $query_string;
	}
	//no difference between insert and update
  public function update_sql($model) {
    return $this->insert_sql($model);
  }
   
  public function select_sql($model) {
  	$query_string = "";
    if(is_array($model->select_columns) && count($model->select_columns)){
			foreach($model->select_columns as $count=>$col){
				if($val = $model->$col) $query_string .= $col.='='.$val.'&';
			}
		}elseif(is_string($model->select_columns)) $query_string.=$model->select_columns;		
		return $query_string;
  }
  
  public function delete_sql($model) {
    return $model->primary_key .'='.$model->primval();
  }
  
  public function row_count_query($model) {
    if($model->is_paginated)  $this->total_without_limits = count($this->all_results);
  }
  
  
  public function filter_sql($model) {  
    $query_str = "";
    if(count($model->filters)) {
      foreach($model->filters as $filter) {
        if(is_array($filter["value"])){
					foreach($filter["value"] as $val) $query_str.= $filter['name']. '[]='.$val.'&';
        }else $query_str.= $filter['name']. '='.$filter['value'].'&';
      }
    }
    $sql = rtrim($sql, "&");
    return array("sql"=>$sql, "params"=>false);
  }
  

  public function search(WaxModel $model, $search_for, $columns=array()) {
    //hmm, this will be fun...
  }
  
  public function syncdb(WaxModel $model) {    
    //there is no db...
		return "NO DB REQUIRED";
  }
  
  
  public function view_table(WaxModel $model) {
		//this needs to pull either all lists or all campaigns
		//so this should make http://api.createsend.com/api/Client.Get[x]s where [x] = Campaign/List/Segment depending on model
		$url = $this->url.$this->sync_prefix.get_class($model).'s'; 
		//this should make the ClientID=[x] or 
		$this->post_arguments = $model->primary_key .'='.$model->primval(); 
		return $this->parse_xml($this->curl_command($url), $model);
  }
  
  public function view_columns(WaxModel $model) {
    //no way to remotely check fields
		return ".. no remote view ..";
  }
  
  public function create_table(WaxModel $model) {
    //
		return ".. no remote view ..";
  }
  
  public function drop_table($table_name) {
    return ".. no drop allowed ..\n";
  }
  //columns cannot be added/created/deleted
  public function column_sql(WaxModelField $field, WaxModel $model) {    
    return "";
  }
  public function add_column(WaxModelField $field, WaxModel $model, $swallow_errors=false) {   
    return ".. no column adding allowed ..\n";
  }
  
  public function alter_column(WaxModelField $field, WaxModel $model, $swallow_errors=false) {
    return ".. no column updated allowed ..\n";
  }
   
	public function api(WaxModel $model, $api_action){
		$url = $this->url.get_class($model).$api_action;  
		//print_r($model);
		$this->post_arguments .= $this->insert_sql($model);
		print_r( $this->parse_xml($this->curl_command($url), $model));exit;
	}
	

	protected function curl_command($url){	
		$this->db = curl_init($url);	
		if($this->post_arguments){
			curl_setopt($this->db, CURLOPT_POST, true);	  	
	  	curl_setopt($this->db, CURLOPT_POSTFIELDS, $this->post_arguments);
		}
		curl_setopt($this->db, CURLOPT_HTTPHEADER, $this->headers);		
	  curl_setopt($this->db, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($this->db, CURLOPT_FOLLOWLOCATION, 1);
		$res = false;
		while(!$res && $i < $this->max_retries){
			$res = $this->curl_send();
			$i ++;
		}
		return $res;
	}

	private function curl_send(){
		$exec =  curl_exec($this->db);		
		$info = curl_getInfo($this->db);
		if($info['http_code'] == 200){
			if($this->return_curl_data) return $exec;
			else return true;
		}else return false;		
	}


	protected function parse_xml($xml_str, $model){
		$simple = simplexml_load_string($xml_str, "SimpleXMLElement", LIBXML_NOCDATA);
    if($child_node = $model->child_node()) {
      for($i=0; $i<$model->limit; $i++) {
        if($simple->{$child_node}[$i]){
					$info = (array) $simple->{$child_node}[$i];
					foreach($info as $field=>$val){
						if(isset($model->columns[$field])) $res[$i][$field] = $val;
						elseif($model->rename_mappings[$field]) $res[$i][$model->rename_mappings[$field]] = $val;
					}
				}
      }
      $model->row = $res;
    }
    return $model;
	}
	
}

?>