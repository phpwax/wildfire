<?

class CmsSubscriber extends WXActiveRecord {  
	public $status_options = array("0" => "Unsubscribed", "1"=>"Subscribed");
	
	static public $subscribable_modules = array('all_sections' => array('model_name'=>"CmsSection", 'get_method'=>"get_subscribe_info"));
	
	//static function to allow multiple modules to subscribe to 
	static public function register_subscribable_module($name, $values) {
		self::$subscribable_modules[$name] = $values;
	}	
	//remove a module
	static public function unregister_subscribable_module($name) {
		unset(self::$subscribable_modules[$name]);
	}
	
	public function get_subscribed_content(){
		$modules = self::$subscribable_modules;
		$results = array();
		foreach($modules as $name => $details){
			//if the modules handle matches this subscribers handle call the relevant function	
			if($name == $this->handle){
				$model = $details['model_name'];
				$model = new $model();
				$function = $details['get_method'];
				$results[$name] = $model->$function($name);
			}			
		}
		return $results;
	}
	
	public function handle_options(){
		$modules = self::$subscribable_modules;
		$options = array_keys($modules);
		foreach($options as $k=> $option){
			$results[$option] = WXInflections::humanize_undasherize($option);
		}
		return $results;
	}
	
}

?>