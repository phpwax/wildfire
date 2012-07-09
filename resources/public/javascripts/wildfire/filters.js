function filter_list(trigger_element, replace){
  var form = trigger_element.closest("form"),
      data = {},
      fieldset = trigger_element.closest("fieldset.filters_container"),
      dest = fieldset.attr('data-action'),
      r = fieldset.attr('data-replace')
      ;
  form.addClass('loading');
  fieldset.find("input[type='text'], select").each(function(){
    var field = jQuery(this), nm = field.attr('name'), pl = field.attr('placeholder'), val = field.val();
    if(val != pl) data[nm] = val;
    else data[nm]='';
  });
  jQuery.ajax({
    url:dest,
    data:data,
    type:"post",
    success:function(res){
      form.removeClass("loading");
      if(typeof replace != "undefined") jQuery(r).replaceWith(res);
      else fieldset.closest(".filter-block-and-listing").find(r).replaceWith(res);
      jQuery(window).trigger("filter.trigger");
      jQuery(window).trigger("join.files.highlight");
    },
    error:function(){
      jQuery(window).trigger("filter.trigger");
    }
  });
}

function inline_filter(form_input){
  var dest = form_input.attr('data-filter-destination'),
      nm = form_input.attr('name'),
      pl = form_input.attr('placeholder'),
      val = form_input.val(),
      data = {};

  data['search_model'] = form_input.attr('data-model-class');
  data['origin_model'] = form_input.attr('data-origin-class');
  data['origin_primval'] = form_input.attr('data-origin-primval');
  data['name'] = form_input.attr('data-name');
  data['type'] = form_input.parents(".join").attr('data-type');
  form_input.addClass('loading');

  if(val != pl) data[nm] = val;
  else data[nm]='';

  jQuery.ajax({
    url:dest,
    data:data,
    type:"post",
    success:function(res){
      form_input.removeClass('loading');
      form_input.siblings("ul").replaceWith(res);
    },
    error:function(){}
  });
}

jQuery(document).ready(function(){

  jQuery(window).bind("filter.bind", function(e, obj, parent_form, replace){
    var filter_listener = false;
    obj.unbind("change keyup").bind("change keyup", function(){ clearTimeout(filter_listener); filter_listener = setTimeout(function(){filter_list(obj, replace);}, 500);});
  });

  jQuery('form fieldset.filters_container').find("input[type='text'],select").each(function(){
    var obj = jQuery(this), parent_form = obj.closest("form");
    if(parent_form.find(".data_table").length) jQuery(window).trigger("filter.bind", [obj, parent_form ]);
    else jQuery(window).trigger("filter.bind", [obj, parent_form, "#data-listing .data_table" ]);
  });
  jQuery(".inline-filter").each(function(){
    var obj = jQuery(this);
    var inline_filter_listener = false;
    obj.unbind("keydown").bind("keydown", function(){clearTimeout(inline_filter_listener); inline_filter_listener = setTimeout(function(){inline_filter(obj);}, 500);});
  });
  if(jQuery("form .media-listing") && jQuery("form .media-listing").length){
    jQuery('form fieldset.filters_container').find("input[type='text']").trigger("change");
  }
});