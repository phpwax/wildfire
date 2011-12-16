<?php
/* Each plugin can make use of a a file called setup.php which can be used to initialise
	 any required setup.
*/

define("CMS_VERSION", "v6");
define("CMS_DIR", dirname(__FILE__));

CMSApplication::register_module("home", array("display_name"=>"Dashboard", "link"=>"/admin/home/"));
CMSApplication::register_module("categories", array("display_name"=>"Categories", "link"=>"/admin/categories/"));
CMSApplication::register_module("content", array("display_name"=>"Content", "link"=>"/admin/content/"));
CMSApplication::register_module("files", array("display_name"=>"Files", "link"=>"/admin/files/"));
CMSApplication::register_module("users", array("display_name"=>"CMS Users", "link"=>"/admin/users/", 'split'=>true));

Autoloader::include_from_registry('CMSHelper');
Autoloader::register_helpers();
//use the expiry date filter on cms_content models
//Config::set('use_expiry_date', true);