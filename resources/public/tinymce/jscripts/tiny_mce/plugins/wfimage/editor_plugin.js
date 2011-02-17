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
	tinymce.create('tinymce.plugins.WildfireImagePlugin', {
		init : function(ed, url) {
			this.editor = ed;
			// Register commands
			ed.addCommand('wfImageLink', function() {

				ed.windowManager.open({
					ui_dialog: "#wildfire-image-dialog",
					width : 800,
					height : 520,
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
			ed.addButton('image', {
				title : 'Insert Image',
				cmd : 'wfImageLink'
			});

		},

		
	});

	// Register plugin
	tinymce.PluginManager.add('wfimage', tinymce.plugins.WildfireImagePlugin);
})();