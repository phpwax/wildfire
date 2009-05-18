<?php
/* Each plugin can make use of a a file called setup.php which can be used to initialise
	 any required setup.
*/

define("CMS_VERSION", "0.5-devel");
define("CMS_DIR", dirname(__FILE__));
CMSApplication::register_module("home", array("display_name"=>"Dashboard", "link"=>"/admin/home/"));
CMSApplication::register_module("settings", array("display_name"=>"Settings", "link"=>"/admin/settings/"));
CMSApplication::register_module("sections", array("display_name"=>"Site Sections", "link"=>"/admin/sections/"));
CMSApplication::register_module("categories", array("display_name"=>"Categories", "link"=>"/admin/categories/"));
CMSApplication::register_module("content", array("display_name"=>"Content", "link"=>"/admin/content/"));
CMSApplication::register_module("comments", array("display_name"=>"Comments", "link"=>"/admin/comments/"));
CMSApplication::register_module("files", array("display_name"=>"Files", "link"=>"/admin/files/"));
CMSApplication::register_module("users", array("display_name"=>"CMS Users", "link"=>"/admin/users/"));
//CMSApplication::register_module("email", array("display_name"=>"Email", "link"=>"/admin/email/"));
Autoloader::include_from_registry('CMSHelper');
Autoloader::register_helpers();
?>