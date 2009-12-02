jQuery(window).load(function(){
  jQuery(".wildfire_audio").each(function(){
    var aud_link = jQuery(this);
    var aud_image = aud_link.find("img");
    aud_link.replaceWith('<embed type="application/x-shockwave-flash" src="http://www.google.com/reader/ui/3247397568-audio-player.swf?audioUrl='+aud_link.attr('href')+'" width="'+aud_image.outerWidth()+'" height="'+aud_image.outerHeight()+'" allowscriptaccess="never" quality="best" bgcolor="#ffffff" wmode="window" flashvars="playerMode=embedded" />');
  });
});