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
	tinymce.create('tinymce.plugins.WildfireHtmlPlugin', {
		init : function(ed, url) {
			this.editor = ed;
			// Register commands
			ed.addCommand('wfHtmlLink', function() {

				ed.windowManager.open({
					ui_dialog: "#wildfire-source-code",
					width : 800,
					height : 300,
					inline : 1,
					button_actions:{
					  'Update':function(){
					    ed.setContent(document.getElementById('wildfire-source-code').value, {source_view : true});
					    jQuery("#wildfire-source-code").html('');
          		jQuery(this).dialog("close");
					  },
					  'Cancel':function(){jQuery(this).dialog("close");}
					}
				}, {
					plugin_url : url
				});
			});

			// Register buttons
			ed.addButton('code', {
				title : 'HMTL',
				cmd : 'wfHtmlLink'
			});

		},

		
	});

	// Register plugin
	tinymce.PluginManager.add('wflink', tinymce.plugins.WildfireHtmlPlugin);
})();