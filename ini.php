<?php
/**
 * The first file loaded in for each plugin, should do very little and only manipulate simple values.
 * DO NOT DO ANYTHING COMPLICATED HERE!
 */


AutoLoader::register_assets("stylesheets/wildfire",__DIR__."/resources/public/stylesheets/wildfire/", "/*.css");
AutoLoader::register_assets("javascripts/wildfire",__DIR__."/resources/public/javascripts/wildfire/", "/*.js");
AutoLoader::register_assets("javascripts/wildfire-plugins",__DIR__."/resources/public/javascripts/wildfire-plugins/", "/*.js");
AutoLoader::register_assets("images/wildfire",__DIR__."/resources/public/images/wildfire/");
AutoLoader::register_assets("fonts/wildfire",__DIR__."/resources/public/fonts/wildfire/","/*");
AutoLoader::register_assets("tinymce",__DIR__."/resources/public/tinymce/");


AutoLoader::register_view_path("plugin", __DIR__."/view/");
AutoLoader::register_controller_path("plugin", __DIR__."/lib/controller/");
AutoLoader::register_controller_path("plugin", __DIR__."/resources/app/controller/");
AutoLoader::$plugin_array[] = array("name"=>"wildfire","dir"=>__DIR__,"assets_for_cms"=>true);
AutoLoader::$plugin_array[] = array("name"=>"wildfire-plugins","dir"=>__DIR__,"assets_for_cms"=>true);

AutoLoader::add_plugin_setup_script(__DIR__."/setup.php");


