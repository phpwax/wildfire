<?
class CmsSubscriber extends WXActiveRecord {  
	private $from_email = "info@waa.co.uk";
	private $from_name = "Latest Information";
	
	public $status_options = array("0" => "Unsubscribed", "1"=>"Subscribed");
	
	public function validations(){
    $this->valid_required("email");
	}
	
	public function before_save(){
		if($this->first_name && $this->surname) $this->name = $this->first_name . " " . $this->surname;
	}
	
	static public $subscribable_modules = array(																	
																	'all_sections' => array(
																								'model_name'=>"CmsSection",
																								'get_data_method' => "get_subscribe_info",
																								'get_subscribers_method' => "get_subscribers",
																								'from_email' => "info@webxpress.com",
																								'from_email_name' => "Latest News"
																									)
																						);
	
	//static function to allow multiple modules to subscribe to 
	static public function register_subscribable_module($name, $values) {
		self::$subscribable_modules[$name] = $values;
	}	
	//remove a module
	static public function unregister_subscribable_module($name) {
		unset(self::$subscribable_modules[$name]);
	}
	
	//get the content for this person
	public function get_subscribed_content(){
		$modules = self::$subscribable_modules;
		$results = array();
		foreach($modules as $name => $details){
			$model = $details['model_name'];
			$model = new $model();
			//if the modules handle matches this subscribers handle call the relevant function as long as it exists	
			if($name == $this->handle && method_exists($model, $details['get_data_method']) ){				
				$function = $details['get_data_method'];
				$results[$name] = $model->$function($name);
			}			
		}
		return $results;
	}
	
	public function get_subscribers($handle = false){
		if(!$handle) $handle = $this->handle;
		$all = self::$subscribable_modules;
		$selected = $all[$handle];
		$name = $selected['model_name'];
		$function = $selected['get_subscribers_method'];
		$model = new $name();
		if(method_exists($model, $function)) return $model->$function($handle);
		else return false;
	}
	public function get_all_subscribable_module_names(){
		$modules = self::$subscribable_modules;
		$names = array_keys($modules);
		return $names;
	}
	
	public function handle_options(){
		$options = $this->get_all_subscribable_module_names();
		foreach($options as $k=> $option){
			$results[$option] = ucwords(WXInflections::humanize_undasherize($option));
		}
		return $results;
	}	
	
	public function count_of_handle($handle){
		$params = array('conditions'=>"`handle`  = '$handle' AND status=1");
		$res = $this->find_all($params);	
		return count($res);
	}
	
	public function get_from_email($handle){
		$modules = self::$subscribable_modules;
		$details = $modules[$handle];
		if($details['from_email']) return $details['from_email'];
		else return $this->from_email;
	}
	
	public function get_from_email_name($handle){
		$modules = self::$subscribable_modules;
		$details = $modules[$handle];
		if($details['from_email_name']) return $details['from_email_name'];
		else return $this->from_name;
	}
	
	public function email_footer($handle){
		$modules = self::$subscribable_modules;
		$details = $modules[$handle];
		$model = new $details['model_name']();
		$function = $details['email_footer_method'];
		if($function && method_exists($model, $function)) return $model->$function($handle);
		else return "\n\n----------------\nUnsubscribe here %UNSUBSCRIBE%\n\n";
	}
	
}

?>