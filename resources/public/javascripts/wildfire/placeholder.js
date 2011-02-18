jQuery(document).ready(function(){
  var ua_placeholder = (jQuery.browser == "webkit")?true:false; 
  jQuery('input[type="text"]').each(function(){
    if(jQuery(this).attr('placeholder') && !ua_placeholder) jQuery(this).val(jQuery(this).attr('placeholder'));
  }).live("focus", function(){
    if(jQuery(this).attr('placeholder') && !ua_placeholder && jQuery(this).val() == jQuery(this).attr('placeholder')) jQuery(this).val('');
  }).live("blur", function(){
    if(jQuery(this).attr('placeholder') && !ua_placeholder && jQuery(this).val().length == 0) jQuery(this).val(jQuery(this).attr('placeholder'));
  });
});