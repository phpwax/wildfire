<?php

define("CMS_VERSION", "v7");
define("CMS_DIR", dirname(__FILE__));

AutoLoader::register_assets("stylesheets/wildfire",__DIR__."/resources/public/stylesheets/wildfire/", "/*.css");
AutoLoader::register_assets("javascripts/wildfire",__DIR__."/resources/public/javascripts/wildfire/", "/*.js");
AutoLoader::register_assets("javascripts/wildfire-plugins",__DIR__."/resources/public/javascripts/wildfire-plugins/", "/*.js");
AutoLoader::register_assets("images/wildfire",__DIR__."/resources/public/images/wildfire/");
AutoLoader::register_assets("tinymce",__DIR__."/resources/public/tinymce/");
AutoLoader::add_plugin_setup_script(__DIR__."/setup.php");
