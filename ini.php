<?php
/**
 * The first file loaded in for each plugin, should do very little and only manipulate simple values.
 * DO NOT DO ANYTHING COMPLICATED HERE!
 */
Autoloader::add_asset_type("help", "help");
AutoLoader::register_view_path("plugin", __DIR__."/view/");
AutoLoader::register_controller_path("plugin", __DIR__."/lib/controller/");
AutoLoader::register_controller_path("plugin", __DIR__."/resources/app/controller/");