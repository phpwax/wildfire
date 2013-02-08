<?php

/**
 * A class to control the setup of a cms application.
 * It exposes methods which define the runtime environment of the app
 * which also allow other plugins to register themselves with the application.
 *
 * @package PHP-WAX CMS
 **/


class CMSApplication {

  static public $modules = array();
  static public $default_module_order = array();
  static public $enable_permissions = true;
  //static array to attach handlers for certain functions to..
  static public $handlers = array();
  /**
   * language in use gets set in session value - wildfire_language_id
   * can be triggered by alternative url such as /en/xx /es/xx
   * or by params - ?language=en / ?language=es / ?language=0
   */
  public static $languages = array(
                            0=>array( //0 is the default language, is content with this language cannot be found, then it will revert to this
                                'name'=>"english",
                                'url' =>''
                                )
                            );

  /**
   * Lets the application know there is a module available
   * the array is made up of the following:
   * array("name"=>"value", "controller"=>"value")
   * @param array $module
   **/

  static public function register_module($name, $values, $parent) {
		$level = &self::$modules;
		if($parent) $level = $level[$parent]["subs"];
  	$level[$name] = $values;
  }

  static public function get_modules($for_display=false) {
    return self::$modules;
  }

  static public function get_module($name) {
    return self::$modules[$name];
  }

  static public function unregister_module($name){
    unset(self::$modules[$name]);
  }

  static public function is_registered($name){
    if(array_key_exists($name,self::$modules)){
      return true;
    } else {
      return false;
    }
  }

  static public function configure_modules() {

  }


}