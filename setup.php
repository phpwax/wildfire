<?php
/* Each plugin can make use of a a file called setup.php which can be used to initialise
	 any required setup.
*/

define("CMS_VERSION", "0.1.5");
CMSApplication::register_module("home", array("display_name"=>"Admin Home", "controller"=>"CMSAdminHomeController"));
CMSApplication::register_module("sections", array("display_name"=>"Site Sections", "controller"=>"CMSAdminSectionController"));
CMSApplication::register_module("pages", array("display_name"=>"Site Pages", "controller"=>"CMSAdminPageController"));
CMSApplication::register_module("articles", array("display_name"=>"Articles", "controller"=>"CMSAdminArticleController"));
CMSApplication::register_module("files", array("display_name"=>"Files", "controller"=>"CMSAdminFileController"));

?>