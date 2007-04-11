<?php
/* Each plugin can make use of a a file called setup.php which can be used to initialise
	 any required setup.
*/

define("CMS_VERSION", "0.1.5");
CMSApplication::register_module("home", array("display_name"=>"Admin Home", "link"=>"/admin/home/"));
CMSApplication::register_module("sections", array("display_name"=>"Site Sections", "link"=>"/admin/sections/"));
CMSApplication::register_module("categories", array("display_name"=>"Categories", "link"=>"/admin/categories/"));
CMSApplication::register_module("pages", array("display_name"=>"Site Pages", "link"=>"/admin/pages/"));
CMSApplication::register_module("articles", array("display_name"=>"Articles", "link"=>"/admin/articles/"));
CMSApplication::register_module("files", array("display_name"=>"Files", "link"=>"/admin/files/"));
?>