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

jQuery(document).ready(function(){
  var filter_listener = false;
  jQuery('form.filters').find("input[type='text'],select").each(function(){
    var obj = jQuery(this), parent_form = obj.parents("form");
    obj.unbind("change keyup").bind("change keyup", function(){clearTimeout(filter_listener); filter_listener = setTimeout(function(){filter_list(parent_form);}, 800);});
  });
  
});