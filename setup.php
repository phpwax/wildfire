<?php
/* Each plugin can make use of a a file called setup.php which can be used to initialise
	 any required setup.
*/

define("CMS_VERSION", "v7");
define("CMS_DIR", dirname(__FILE__));

CMSApplication::register_module("home", array("display_name"=>"Dashboard", "link"=>"/admin/home/", 'plugin_name'=>'cms', 'assets_for_cms'=>true));
CMSApplication::register_module("categories", array("display_name"=>"Categories", "link"=>"/admin/categories/"));
CMSApplication::register_module("content", array("display_name"=>"Content", "link"=>"/admin/content/"));
CMSApplication::register_module("media", array("display_name"=>"Media", "link"=>"/admin/media/"));
CMSApplication::register_module("users", array("display_name"=>"CMS Users", "link"=>"/admin/users/", 'split'=>true));
CMSApplication::register_module("redirect", array("display_name"=>"Redirects", "link"=>"/admin/redirect/", 'split'=>true));

Autoloader::include_from_registry('CMSHelper');
Autoloader::register_helpers();

WildfireMedia::$classes[] = 'WildfireDiskFile';
//set the default media types for uploads
WildfireMedia::$allowed  = array(
                            'jpg'=>'WildfireDiskFile',
                            'jpeg'=>'WildfireDiskFile',
                            'JPG'=>'WildfireDiskFile',
                            'png'=>'WildfireDiskFile',
                            'gif'=>'WildfireDiskFile',
                            'txt'=>'WildfireDiskFile',
                            'doc'=>'WildfireDiskFile',
                            'xsl'=>'WildfireDiskFile',
                            'zip'=>'WildfireDiskFile',
                            'pdf'=>'WildfireDiskFile'
                          );

?>