/**
 * @author stvhl00@gmail.com (Steven Hall)
 */

(function() {
  var i = document.createElement('input');
  jQuery.support.placeholder = 'placeholder' in i;
})();

jQuery(document).ready(function(){
  if(!jQuery.support.placeholder){
    jQuery('input[type="text"]').each(function(){
      if(jQuery(this).attr('placeholder') && (jQuery(this).val() == jQuery(this).attr('placeholder') || jQuery(this).val() == '' || jQuery(this).val() == 0 || jQuery(this).val() == 0.0 )) jQuery(this).val(jQuery(this).attr('placeholder'));
    }).live("focus", function(){          
      if(jQuery(this).attr('placeholder')  && jQuery(this).val() == jQuery(this).attr('placeholder')) jQuery(this).val('');
    }).live("blur", function(){           
      if(jQuery(this).attr('placeholder')  && jQuery(this).val().length == 0) jQuery(this).val(jQuery(this).attr('placeholder'));
    });
  }
});