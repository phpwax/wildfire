function checkboxes_to_button(container){

  container.find("input[type=checkbox]:not(.converted-to-button)").each(function(){
    var obj = jQuery(this);
    //insert a button to the dom
    if(obj.attr('checked') && jQuery('.f'+obj.val()).length) obj.parent().append("<a href='#' data-fileid='"+obj.val()+"' data-input-link='"+obj.attr('id')+"' class='button js-added remove-button button-"+obj.attr('id')+"'>REMOVE</a>");
    else obj.parent().append("<a href='#' data-fileid='"+obj.val()+"' data-input-link='"+obj.attr('id')+"' class='button js-added add-button button-"+obj.attr('id')+"'>ADD</a>");
    //hide the check box and hide the label
    obj.hide().addClass('converted-to-button').siblings("label").hide();
  });
}


jQuery(document).ready(function(){
  jQuery('#files').ajaxSuccess(function(){
    setTimeout(function(){
      checkboxes_to_button(jQuery("#files"));
    }, 500);
  });

  //on clicking the buttons, update the input and swap the classes&copy
  jQuery(".js-added").live("click",function(){
    var bu = jQuery(this), checkbox_ele = jQuery("#"+bu.attr('data-input-link')),
        field_block = bu.parents(".file-info"),
        imgs = jQuery(field_block).find('img'),
        insert_str = "",
        fid = bu.attr('data-fileid');

    if(bu.hasClass('remove-button')){
      bu.removeClass('remove-button').addClass('add-button').html('ADD');
      checkbox_ele.attr('checked', false);
      if(checkbox_ele.hasClass('joined_field')) checkbox_ele.parent().remove();
      jQuery('.f'+fid).remove();
      jQuery('.button-join_file_'+fid).removeClass('remove-button').addClass('add-button').html('ADD');
    }else{
      bu.removeClass('add-button').addClass('remove-button').html('REMOVE');
      //if this was a info panel add, copy the item in to the exisiting files block
      if(!checkbox_ele.hasClass('joined_field')){
        var tag_option_str = "<div class='tag_options clearfix'>";
        for(x in file_tags){
          tag_option_str += "<div class='clearfix'><input type='radio' name='tags["+fid+"][tag]' value='"+file_tags[x]+"' id='inserted_tag_"+fid+"_"+x+"' class='radio_field'"+(x==0?" checked='checked'": "")+"><label for='inserted_tag_"+fid+"_"+x+"'>"+file_tags[x]+"</label></div>";
        }
        tag_option_str += "</div>";
        var ord = jQuery('#exisiting-files .joined-file').length;
        insert_str = '<div class="joined-file clearfix f'+fid+'"><input type="hidden" name="tags['+fid+'][order]" value="'+ord+'" class="join-order-field"><img src="'+jQuery(imgs).attr('src')+'" alt="'+jQuery(imgs).attr('alt')+'">'+tag_option_str+'<a id="button-joined_file_'+fid+'" class="button js-added remove-button" data-input-link="join_file_'+fid+'" data-fileid="'+fid+'" href="#">REMOVE</a></div>';
        jQuery('#exisiting-files').append(insert_str);
      }
      checkbox_ele.attr('checked', 'checked');
    }
    return false;
  });

});

