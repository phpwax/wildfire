function setup_preview(permalink, trigger_id, preview_pane) {
  $(document).ready(function() {
    $('#'+trigger_id).click(function(){
      $('#'+preview_pane).jqm();
      $('#'+preview_pane).jqmShow();
      $('#'+preview_pane).html("<iframe src='"+permalink+"' width='100%' height='100%' border='0' />");
    });
  });
}



/* Tab setup and emailer setup for CMSGeneralEmailer */
$(document).ready(function() {
  if($("#container").length) $("#container").tabs();
  $(".email_send_button").click(function(){
    if($("#test_emails").val().length > 4) return confirm('This will be sent to TEST EMAILS ONLY!\n (Real email would be sent to '+this.id.substring(0,this.id.indexOf("_")) +' recipients)');
    else return confirm('Are you sure you want to send this to '+this.id.substring(0,this.id.indexOf("_")) +' recipients?');
  })
});


/* JS Table initialisation for index.html */
$(document).ready(function() {
  if($("#item_list_container").length) {
    $("#item_list_container").tableSorter({dateFormat: 'dd/mm/yyyy', highlightClass: 'highlight_col',
      stripingRowClass: ['item_row1','item_row0'],stripeRowsOnStartUp: true});
  }
})