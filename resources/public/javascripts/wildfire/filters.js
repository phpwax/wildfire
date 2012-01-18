var filter_listener = false, inline_filter_listener = false;

function filter_list(form, replace){
  var form = jQuery(form), 
      data={}, 
      dest = form.find("fieldset.filters_container").attr('data-action'),
      r = form.find("fieldset.filters_container").attr('data-replace')
      ;
  form.addClass('loading').find("fieldset.filters_container input[type='text'], fieldset.filters_container select").each(function(){
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
      if(typeof replace != "undefined") jQuery(replace).replaceWith(res);
      else form.find(r).replaceWith(res);
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
    obj.unbind("change keyup").bind("change keyup", function(){ clearTimeout(filter_listener); filter_listener = setTimeout(function(){filter_list(parent_form, replace);}, 500);});
  });
  jQuery('form fieldset.filters_container').find("input[type='text'],select").each(function(){
    var obj = jQuery(this), parent_form = obj.parents("form");
    if(parent_form.find(".data_table").length) jQuery(window).trigger("filter.bind", [obj, parent_form ]);
    else jQuery(window).trigger("filter.bind", [obj, parent_form, "#data-listing .data_table" ]);
  });
  jQuery(".inline-filter").each(function(){
    var obj = jQuery(this);
    obj.unbind("change keyup").bind("change keyup", function(){clearTimeout(inline_filter_listener); inline_filter_listener = setTimeout(function(){inline_filter(obj);}, 500);});
  });
  if(jQuery("form .media-listing") && jQuery("form .media-listing").length){
    jQuery('form fieldset.filters_container').find("input[type='text']").trigger("change");
  }
});