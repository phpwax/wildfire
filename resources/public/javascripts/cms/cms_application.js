/**** Add application wide javascripts below this point  ******/

function setup_preview(permalink, trigger_id, preview_pane) {
  $(document).ready(function() {
    $('#'+trigger_id).click(function(){
      $('#'+preview_pane).jqm();
      $('#'+preview_pane).jqmShow();
      $('#'+preview_pane).html("<iframe src='"+permalink+"' width='100%' height='100%' border='0' />");
    });
  });
}

$(document).ready(function() {
  $("#container").tabs();
  $(".email_send_button").click(function(){
    if($("#test_emails").val().length > 4) return confirm('This will be sent to TEST EMAILS ONLY!\n (Real email would be sent to '+this.id.substring(0,this.id.indexOf("_")) +' recipients)');
    else return confirm('Are you sure you want to send this to '+this.id.substring(0,this.id.indexOf("_")) +' recipients?');
  })
});
