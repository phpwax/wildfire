/* -------------------------------------------------- *
 * JQuery Hints
 * -------------------------------------------------- *
 * Author: Ross Riley
 * License: MIT License
** -------------------------------------------------- */

(function($) {
	$.fn.hint = function(defaults) {
		// check whether we want real options, or to destroy functionality
		if(!defaults || typeof(defaults) == "object") {
			defaults = $.extend({
				focus_class: "hint_focus", // class during focus
				changed_class: "hint_changed", // class after focus
				populate_from: "default", // choose from: default, label, custom, or alt
				text: null, // text to use in conjunction with populate_from: custom
				remove_labels: false // remove labels associated with the fields
			}, defaults);
		}
		else if(typeof(defaults) == "string" && defaults.toLowerCase() == "destroy") {
			var destroy = true;
		}
		return this.each(function() {
			// unbind everything if we're destroying, and stop executing the script
			if(destroy) {
			  $(this).unbind("focus.hint").unbind("blur.hint").removeData("defText");
				return false;
			}
		  hint_setup($(this));
		});
	  function hint_setup(ele){ 
	    // define our variables
			var defText = "";

			// let's populate the text, if not default
			switch(defaults.populate_from) {
				case "alt":
					defText = ele.attr("alt");
					ele.val(defText);
					break;
				case "label":
					defText = $("label[for='" + ele.attr("id") + "']").text();
					ele.val(defText);
					break;
				case "custom":
					defText = defaults.text;
					ele.val(defText);
					break;
				default:
					defText = ele.val();
			}

			// let's give this field a special class, so we can identify it later
			// also, we'll give it a data attribute, which will help jQuery remember what the default value is
			ele.addClass("hint").data("defText", defText);

			// now that fields are populated, let's remove the labels if applicable
			if(defaults.remove_labels == true) { $("label[for='" + ele.attr("id") + "']").remove(); }
			
			// Handles password fields by creating a clone that's a text field.
			if(ele.attr("type")=="password") {
			  var eledef = ele.data("defText");
			  var el = ele.clone().data("defType", "password").data("defText", eledef).attr("type", "text");
        ele.after(el).remove();
        var ele = el;
		  }
			hint_focus(ele);
			hint_blur(ele);
	  };
	  function hint_focus(ele){ 
	    ele.bind("focus.hint",function(){
	      if(ele.val() == ele.data("defText")) { ele.val(""); }
				// add the focus class, remove changed_class
				ele.addClass(defaults.focus_class).removeClass(defaults.changed_class);
	      if(ele.data("defType")=="password") {
	        var eledef = ele.data("defText");
  			  var el = ele.clone().data("defText", eledef).data("defType","password").attr("type", "password");
          ele.after(el).remove();
          hint_blur(el);
  			}
			});
	  };
	  function hint_blur(ele){ 
	    ele.bind("blur.hint",function(){
	      if(ele.val() == "") { ele.val(ele.data("defText")); }
				// remove focus_class, add changed_class.
				ele.removeClass(defaults.focus_class);
				if(ele.val() != ele.data("defText")) { ele.addClass(defaults.changed_class); }
					else { ele.removeClass(defaults.changed_class); }
				if(ele.data("defType")=="password" && ele.val()==ele.data("defText")) {
				  var eledef = ele.data("defText");
				  var el = ele.clone().data("defText", eledef).data("defType", "password").attr("type", "text");
          ele.after(el);
          ele.remove();
          hint_focus(el);
				}
	    });
	  };
	};
})(jQuery);