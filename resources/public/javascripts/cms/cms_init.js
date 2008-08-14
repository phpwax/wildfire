function setup_preview(permalink, trigger_id, preview_pane) {
  $(document).ready(function() {
    $('#'+trigger_id).click(function(){
      $('#'+preview_pane).jqm();
      $('#'+preview_pane).jqmShow();
      $('#'+preview_pane).html("<iframe src='"+permalink+"' width='100%' height='100%' border='0' />");
    });
  });
}



/* JS Table initialisation for index.html */
$(document).ready(function() {
  if($("#item_list_container").length) {
    $("#item_list_container").tableSorter({dateFormat: 'dd/mm/yyyy', highlightClass: 'highlight_col',
      stripingRowClass: ['item_row1','item_row0'],stripeRowsOnStartUp: true});
  }
})