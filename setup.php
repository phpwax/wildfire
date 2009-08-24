<?php
/* Each plugin can make use of a a file called setup.php which can be used to initialise
	 any required setup.
*/

define("CMS_VERSION", "v3");
define("CMS_DIR", dirname(__FILE__));

CMSApplication::register_module("home", array("display_name"=>"Dashboard", "link"=>"/admin/home/", 'auth_level'=>0));
CMSApplication::register_module("sections", array("display_name"=>"Site Sections", "link"=>"/admin/sections/",'auth_level'=>30));
CMSApplication::register_module("categories", array("display_name"=>"Categories", "link"=>"/admin/categories/",'auth_level'=>20));
CMSApplication::register_module("content", array("display_name"=>"Content", "link"=>"/admin/content/",'auth_level'=>10));
CMSApplication::register_module("comments", array("display_name"=>"Comments", "link"=>"/admin/comments/",'auth_level'=>5));
CMSApplication::register_module("files", array("display_name"=>"Files", "link"=>"/admin/files/", 'auth_level'=>0));
CMSApplication::register_module("users", array("display_name"=>"CMS Users", "link"=>"/admin/users/",'auth_level'=>30));

Autoloader::include_from_registry('CMSHelper');
Autoloader::register_helpers();
//use the expiry date filter on cms_content models
//Config::set('use_expiry_date', true);