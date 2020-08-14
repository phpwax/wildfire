/*
 * A few useful plugins for Wildfire Specific Functionality
 * ADDS:
 *    1. Link interceptor to give a choice between regular urls and file urls
 *    2. Insert Video Button
 *    3. Insert Audio Button
 *    4. Overwrite default image insert to be awesome
 */


//Extend WYMeditor
wildfire_containersItems = [
    {'name': 'P', 'title': 'Paragraph', 'css': 'wym_containers_p'},
    {'name': 'H3', 'title': 'Main_Heading', 'css': 'wym_containers_h3'},
    {'name': 'H4', 'title': 'Sub_Heading', 'css': 'wym_containers_h4'},
    {'name': 'H5', 'title': 'Small_Heading', 'css': 'wym_containers_h5'},
    {'name': 'PRE', 'title': 'Preformatted', 'css': 'wym_containers_pre'},
    {'name': 'BLOCKQUOTE', 'title': 'Blockquote','css': 'wym_containers_blockquote'}
];
/******** Overides of base WYMeditor Object ****************/
WYMeditor.MAIN_CONTAINERS = new Array("p","h3","h4","h5","h6","pre","blockquote", "address");

WYMeditor.editor.prototype.wildfire = function() {
  var wym = this;

  /*************Additions to language code***************/
  WYMeditor.STRINGS['en'].Source_Code = 'Source code';
  WYMeditor.STRINGS['en'].Main_Heading = 'Main Heading';
  WYMeditor.STRINGS['en'].Sub_Heading = 'Sub Heading';
  WYMeditor.STRINGS['en'].Small_Heading = 'Small Heading';
	
	
  WYMeditor.BLOCKS = new Array("address", "blockquote", "div", "dl",
   "fieldset", "form", "h3", "h4", "h5", "h6", "hr",
   "noscript", "ol", "p", "pre", "table", "ul", "dd", "dt",
   "li", "tbody", "td", "tfoot", "th", "thead", "tr");

  /****** Allow more things through the xhtml parse *******/
  wym.parser._Listener.validator._tags.a.attributes[7]="target";
  wym.parser._Listener.validator._tags.embed = {
    "attributes":[
    "allowscriptaccess",
    "allowfullscreen",
    "height",
    "src",
    "type",
    "width",
    "flashvars",
    "scale"
    ]
  };
  wym.parser._Listener.validator._tags.param = {
      "attributes":
    {
      "0":"name",
      "1":"type",
      "valuetype":/^(data|ref|object)$/,
      "2":"valuetype",
      "3":"value"
    },
    "required":[
    "name"
    ]
  };
  wym.parser._Listener.block_tags = ["a", "abbr", "acronym", "address", "area", "b",
    "base", "bdo", "big", "blockquote", "body", "button",
    "caption", "cite", "code", "col", "colgroup", "dd", "del", "div",
    "dfn", "dl", "dt", "em", "fieldset", "form", "head", "h1", "h2",
    "h3", "h4", "h5", "h6", "html", "i", "ins",
    "kbd", "label", "legend", "li", "map", "noscript",
    "object", "ol", "optgroup", "option", "p", "pre", "q",
    "samp", "script", "select", "small", "span", "strong", "style",
    "sub", "sup", "table", "tbody", "td", "textarea", "tfoot", "th",
    "thead", "title", "tr", "tt", "ul", "var", "extends"];
  wym.parser._Listener.inline_tags = ["br", "hr", "img", "input", "embed", "param", "iframe"];

  /*******************************************/
  
  jQuery(wym._box).find(".wym_tools_superscript").remove();
  jQuery(wym._box).find(".wym_tools_subscript").remove();
  jQuery(wym._box).find(".wym_tools_preview").remove();
  jQuery(wym._box).find(".wym_classes").removeClass("wym_panel").addClass("wym_dropdown");

  /*******************************************/
  /* Overwrite default link insert */
  /*******************************************/

  jQuery(wym._box).find(".wym_tools_link a").unbind("click").click(function(){
    jQuery.get(file_options_location, function(response){
      jQuery("#link_file").replaceWith(response);
      jQuery("#link_dialog #link_file").change(link_dialog_file_choose);
      var insert_dialog = jQuery("#link_dialog");
      insert_dialog.dialog('option', 'title', 'Insert Link');
      insert_dialog.data('execute_on_insert',function(){
        var theURL = insert_dialog.find("#link_url").val();
        var str_target = insert_dialog.find("#link_target").val();
        if(theURL.length) {
          wym.wrap("<a href = '" + theURL + "' " + ( str_target ? ( "target='" + str_target + "'" ) : "" ) + ">", "</a>");
        }
      });
      insert_dialog.dialog("open");
    });
    return false;
  });
  
  jQuery("#link_dialog").dialog({width:400});
  
  /*******************************************/
  /* Video Insertion Button */
  /*******************************************/
  
  var vidhtml = wym_button("video", "Insert a Video");
  jQuery(wym._box).find(".wym_tools_image").after(vidhtml);
  jQuery(wym._box).find(".wym_tools_video a").click(function(){
    jQuery.get(file_options_location+"/?mime_type=video", function(response){
      jQuery("#link_file").replaceWith(response);
      jQuery("#link_dialog #link_file").change(link_dialog_file_choose);
      var insert_dialog = jQuery("#link_dialog");
      insert_dialog.dialog('option', 'title', 'Insert a Video');
      insert_dialog.data('execute_on_insert',function(){
        var theURL = insert_dialog.find("#link_url").val();
        var str_target = insert_dialog.find("#link_target").val();
        if(theURL.length) {
          wym.insert("<a class='wildfire_video' href='" + theURL + "' " + ( str_target ? ( "target='" + str_target + "' " ) : "" ) + "><img class='fallback' src='/images/cms/wildfirevideo.gif' alt='Download video file: " + theURL + "' /></a>");
        }
      });
      insert_dialog.dialog("open");
    });
    return false;
  });
  
  /*******************************************/
  /* Flash Insertion Button */
  /*******************************************/
  
  var flashhtml = wym_button("flash", "Insert a Flash Movie");
  jQuery(wym._box).find(".wym_tools_image").after(flashhtml);
  jQuery(wym._box).find(".wym_tools_flash a").click(function(){
    jQuery.get(file_options_location+"/?mime_type=shockwave", function(response){
      jQuery("#link_file").replaceWith(response);
      jQuery("#link_dialog #link_file").change(link_dialog_file_choose);
      var insert_dialog = jQuery("#link_dialog");
      insert_dialog.dialog('option', 'title', 'Insert a Flash File');
      insert_dialog.data('execute_on_insert',function(){
        var theURL = insert_dialog.find("#link_url").val();
        var str_target = insert_dialog.find("#link_target").val();
        if(theURL.length) {
          wym.insert("<a class='wildfire_flash' href='" + theURL + "' " + ( str_target ? ( "target='" + str_target + "' " ) : "" ) + "><img src='/images/cms/flash_placeholder.png' alt='Flash file: " + theURL + "' /></a>");
        }
      });
      insert_dialog.dialog("open");
    });
    return false;
  });

	/*******************************************/
  /* Youtube Insertion Button */
  /*******************************************/
  
  var flashhtml = wym_button("youtube", "Insert a Youtube Movie");
  jQuery(wym._box).find(".wym_tools_image").after(flashhtml);
  jQuery(wym._box).find(".wym_tools_youtube a").click(function(){
    jQuery.get(file_options_location+"/?mime_type=shockwave", function(response){
			jQuery("#link_target").parent().css("display","none");
      jQuery("#link_file").parent().css("display","none");
      //jQuery("#link_dialog #link_file").change(link_dialog_file_choose);
      var insert_dialog = jQuery("#link_dialog");
      insert_dialog.dialog('option', 'title', 'Insert a Youtube Movie');
      insert_dialog.data('execute_on_insert',function(){
        var theURL = insert_dialog.find("#link_url").val();
				var yt_image = "";
				var source_id = "";
				
				//youtube url id grabing
				var source_query = theURL.split("/").pop().split("?").pop().split("&").shift().split("=");
				if(source_query[0] == "v") {
					source_id = source_query[1];
				}else {
					if(theURL.split("#").pop().split("/").shift() == "p") {
						source_id = theURL.split("#").pop().split("/").pop().split("?").shift();
					}
				}
				if(source_id){
					theURL =  "http://www.youtube.com/v/" + source_id;
					yt_image = "http://i.ytimg.com/vi/"+ source_id +"/default.jpg";
				}else yt_image = "/images/cms/youtube_placeholder.png";
				

        var str_target = insert_dialog.find("#link_target").val();
        if(theURL.length) {
          wym.insert("<a class='wildfire_youtube' rel='youtube' href='" + theURL + "'><img src='"+ yt_image +"' alt='Flash file: " + theURL + "' /></a>");
        }
      });
      insert_dialog.dialog("open");
    });
    return false;
  });
  
  /*******************************************/
  /* Audio Insertion Button */
  /*******************************************/
  
  var audhtml = wym_button("audio", "Insert Audio");
  jQuery(wym._box).find(".wym_tools_video").after(audhtml);
  jQuery(wym._box).find(".wym_tools_audio a").click(function(){
    jQuery.get(file_options_location+"/?mime_type=audio", function(response){
      jQuery("#link_file").replaceWith(response);
      jQuery("#link_dialog #link_file").change(link_dialog_file_choose);
      var insert_dialog = jQuery("#link_dialog");
      insert_dialog.dialog('option', 'title', 'Insert Audio');
      insert_dialog.data('execute_on_insert',function(){
        var theURL = insert_dialog.find("#link_url").val();
        var str_target = insert_dialog.find("#link_target").val();
        if(theURL.length) {
          wym.insert("<a class='wildfire_audio' href='" + theURL + "' " + ( str_target ? ( "target='" + str_target + "' " ) : "" ) + "><img src='/images/cms/googleaudioplayer.gif' alt='Download audio file: " + theURL + "' /></a>");
        }
      });
      insert_dialog.dialog("open");
    });
    return false;
  });
  
  /*******************************************/
  /* CSV Table Insertion Button */
  /*******************************************/
  
  var audhtml = wym_button("csv_table", "Insert CSV Data Table");
  jQuery(wym._box).find(".wym_tools_audio").after(audhtml);
  jQuery(wym._box).find(".wym_tools_csv_table a").click(function(){
    jQuery.get(file_options_location+"/?mime_type=text", function(response){
      jQuery("#link_file").replaceWith(response);
      jQuery("#link_dialog #link_file").change(link_dialog_file_choose);
      var insert_dialog = jQuery("#link_dialog");
      insert_dialog.dialog('option', 'title', 'Insert CSV Data Table');
      insert_dialog.data('execute_on_insert',function(){
        var theURL = insert_dialog.find("#link_url").val();
        var str_target = insert_dialog.find("#link_target").val();
        if(theURL.length) {
          wym.insert("<a class='wildfire_csv_table' href='" + theURL + "' " + ( str_target ? ( "target='" + str_target + "' " ) : "" ) + "><img src='/images/cms/table_placeholder.jpg' alt='Download csv file: " + theURL + "' /></a>");
        }
      });
      insert_dialog.dialog("open");
    });
    return false;
  });
  
  /*******************************************/
  /* Inline Image Insertion Button */
  /*******************************************/
  jQuery(wym._box).find(".wym_tools_image a").unbind("click").click(function(){
    popup_file_browse_dialog(wym);
    return false;
  });
  
  initialise_inline_image_edit(wym);
  
  /*******************************************/
  /* Overwrite default paste from word */
  /*******************************************/
  jQuery(wym._box).find(".wym_tools_paste a").unbind("click").click(function(){
    var paste_dialog = jQuery('#paste_word');
    paste_dialog.data("wym",wym);
    paste_dialog.dialog({width:540});
    paste_dialog.dialog("open");
    return false;
  });
  
  /*******************************************/
  /* Table Insertion Button */
  /*******************************************/
  jQuery(wym._box).find(".wym_tools_table a").unbind("click").click(function(){
    var table_dialog = jQuery("#table_dialog");
    table_dialog.data("wym",wym);
    table_dialog.dialog({width:340});
    table_dialog.dialog("open");
  });
  jQuery(".subnav a.dd, .subnav .issub").unbind("hover").hover(
    function(){jQuery(this).parents(".subnav").children("ul").removeClass("wym_classes_hidden").show();},
    function(){jQuery(this).parents(".subnav").children("ul").addClass("wym_classes_hidden").hide();}
  );

};

function wym_button(name, title) {
  var html = "<li class='wym_tools_"+name+"'>"
              + "<a name='"+name+"' href='#' title='"+title+"'>"
              + title
              + "</a></li>";
  return html;
}

function popup_file_browse_dialog(wym,existing_image){
  jQuery.get(file_browser_location, {mime_type:file_mime_type}, function(response){
    jQuery(".image_display").html(response);
    
    init_inline_image_select(wym);
    
    var insert_dialog = jQuery(".inline_image_dialog");
    insert_dialog.data('wym',wym);
    if(existing_image && existing_image.length){
      existing_image.attr("width",existing_image.attr("width")); //needed so that the new image source with lower res will be the correct size
      insert_dialog.find(".selected_image img").attr("src", existing_image.attr("src")).css("width","90px");
      insert_dialog.find(".meta_description").val(existing_image.attr("alt"));
      
      var existing_flow = "flow_left";
      if(existing_image.hasClass("flow_right")) existing_flow = "flow_right";
      else if(existing_image.hasClass("flow_normal")) existing_flow = "flow_normal";
      jQuery('input:radio[name=flow]').val([existing_flow]);
      
      insert_dialog.data('existing_image',existing_image);
    }
    insert_dialog.dialog('option', 'title', 'Insert an Image');
    insert_dialog.dialog("open");
  });
}

function initialise_inline_image_edit(wym) {
  jQuery(wym._doc).find("img.inline_image").unbind("dblclick").dblclick(function(){
    popup_file_browse_dialog(wym,jQuery(this));
  });
}

function init_inline_image_select(wym) {
  jQuery(".image_display .add_image a").click(function(){
    jQuery(".inline_image_dialog .selected_image img").attr("src", "/show_image/"+jQuery(this).parent().parent().attr("id")+"/90.jpg");
  });
}

WYMeditor.editor.prototype.computeBasePath = function() { return "/javascripts/wymeditor/"; };
