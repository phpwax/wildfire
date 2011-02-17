/**
 * editor_plugin_src.js
 *
 * Copyright 2009, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://tinymce.moxiecode.com/license
 * Contributing: http://tinymce.moxiecode.com/contributing
 */

(function() {
	tinymce.create('tinymce.plugins.WildfireTemplatePlugin', {
		init : function(ed, url) {
			this.editor = ed;
			// Register commands
			ed.addCommand('wfTemplateView', function() {

				ed.windowManager.open({
					ui_dialog: "#wildfire-templates",
					width : 600,
					height : 500,
					inline : 1,
					button_actions:{
					  'Insert':function(){
					    
					  },
					  'Cancel':function(){jQuery(this).dialog("close");}
					}
				}, {
					plugin_url : url
				});
			});

			// Register buttons
			ed.addButton('template', {
				title : 'Insert template',
				cmd : 'wfTemplateView'
			});

		},

		
	});

	// Register plugin
	tinymce.PluginManager.add('wfhtml', tinymce.plugins.WildfireTemplatePlugin);
})();