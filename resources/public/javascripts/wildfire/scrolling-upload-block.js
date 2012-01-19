jQuery(document).ready(function(){
  
  if(jQuery(".cms-uploads-1 .upload_block").length){
    var w = jQuery(".cms-uploads-1 .upload_block").outerWidth(), pos = jQuery(".cms-uploads-1 .upload_block").offset();
    jQuery(".cms-uploads-1 .upload_block").css({position:"fixed", width:w, left:pos.left-10});
  }

});