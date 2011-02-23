function filter_list(form){
  var form = jQuery(form), data={}, dest = form.attr('data-action');
  form.addClass('loading').find("input[type='text'],select").each(function(){
    var field = jQuery(this), nm = field.attr('name'), pl = field.attr('placeholder'), val = field.val();
    if(val != pl) data[nm] = val;
    else data[nm]='';
  });
  jQuery.ajax({
    url:dest,
    data:data,
    type:"post",
    success:function(res){
      form.removeClass('loading');
      jQuery(form.attr('data-replace')).replaceWith(res);
    },
    error:function(){}
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
  var filter_listener = inline_filter_listener = false;
  jQuery('form.filters').find("input[type='text'],select").each(function(){
    var obj = jQuery(this), parent_form = obj.parents("form");
    obj.unbind("change keyup").bind("change keyup", function(){clearTimeout(filter_listener); filter_listener = setTimeout(function(){filter_list(parent_form);}, 500);});
  });
  jQuery("input.inline-filter").each(function(){
    var obj = jQuery(this);
    obj.unbind("change keyup").bind("change keyup", function(){clearTimeout(inline_filter_listener); inline_filter_listener = setTimeout(function(){inline_filter(obj);}, 500);});
  });
});