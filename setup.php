<?php
/* Each plugin can make use of a a file called setup.php which can be used to initialise
	 any required setup.
*/



CMSApplication::register_module("home", array("display_name"=>"Dashboard", "link"=>"/admin/home/", 'plugin_name'=>'wildfire', 'assets_for_cms'=>true));


AutoLoader::register_helpers(array('CMSHelper'));

