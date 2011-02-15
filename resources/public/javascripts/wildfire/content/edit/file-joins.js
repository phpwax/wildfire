function checkboxes_to_button(container){
  
  container.find("input[type=checkbox]:not(.converted-to-button)").each(function(){
    var obj = jQuery(this);
    //insert a button to the dom
    if(obj.attr('checked')) obj.parent().append("<a href='#' data-fileid='"+obj.val()+"' data-input-link='"+obj.attr('id')+"' class='button js-added remove-button' id='button-"+obj.attr('id')+"'>REMOVE</a>");
    else obj.parent().append("<a href='#' data-fileid='"+obj.val()+"' data-input-link='"+obj.attr('id')+"' class='button js-added add-button' id='button-"+obj.attr('id')+"'>ADD</a>");
    //hide the check box and hide the label
    obj.hide().addClass('converted-to-button').siblings("label").hide();
    //on clicking the buttons, update the input and swap the classes&copy
    jQuery("#button-"+obj.attr('id')).click(function(){
      var bu = jQuery(this), checkbox_ele = jQuery("#"+bu.attr('data-input-link'));
      if(bu.hasClass('remove-button')){
        bu.removeClass('remove-button').addClass('add-button').html('ADD');
        checkbox_ele.attr('checked', false);
      }else{
        bu.removeClass('add-button').addClass('remove-button').html('REMOVE');
        checkbox_ele.attr('checked', 'checked');
      }
      return false;
    });
  });
}

jQuery(document).ready(function(){
  jQuery('#files').ajaxSuccess(function(){
    setTimeout(function(){checkboxes_to_button(jQuery("#files"));}, 500);
  });

});

