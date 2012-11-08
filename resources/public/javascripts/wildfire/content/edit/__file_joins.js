jQuery(document).ready(function(){
  
  jQuery(window).bind("join.files.highlight", function(){
    jQuery(".joined-to-model").removeClass("joined-to-model");
    jQuery(".joined-file").each(function(){
      var primval = jQuery(this).data("primval");
      jQuery(this).closest("fieldset").find(".file-listing #row_"+primval).addClass("joined-to-model");
    });
  });

  //this inserts the ability to join media to the content
  jQuery(window).bind("preview.click", function(e, row, preview_container){
    var primval = row.data("model-id"),
        checkbox = jQuery(".default_value_to_unset_join").clone(),
        field = row.closest(".media-listing, .existing-files").attr("data-field"),
        button = (jQuery(".f_"+field+"_"+primval).length) ? "<a href='#' class='button js-added remove-button' data-primval='"+primval+"'>REMOVE</a>" : "<a href='#' class='button js-added add-button' data-primval='"+primval+"'>ADD</a>"
        ;
    if(row.parents(".file-listing").length){
      if(jQuery(".media-listing, .existing-files").length){
        checkbox.attr("name", checkbox.attr("name").replace("[0]", "["+primval+"][id]")).attr("type", "checkbox").attr("checked", false).val(primval).hide();
        preview_container.html(preview_container.html()+button).append(checkbox);
      }
    }
  });

  jQuery(".media-listing").closest("fieldset").bind("add-media", function(e, result){
    var existing = jQuery(this).find(".existing-files").append(result);
    existing.find(".joined-file:last .join-order-field").val(existing.find(".joined-file").length);
  });

  //on click we will now copy that
  jQuery(".button.add-button").live("click", function(e){
    e.preventDefault();

    var target = jQuery(this),
        primval = target.data("primval"),
        holder = target.closest(".media-listing, .existing-files"),
        field = holder.attr("data-field"),
        url = holder.attr("data-new-join-url");

    jQuery.ajax({
      "url":url,
      "data":{
        "target_id":primval,
        "field":field
      },
      "success":function(result){
        var fieldset = target.closest("fieldset");
        fieldset.trigger("add-media", result);
        fieldset.find("a[data-primval='"+primval+"']").addClass("remove-button").removeClass("add-button").text("REMOVE");
        jQuery(window).trigger("join.files.highlight");
        jQuery(window).trigger("join.added");
      }
    });
  });
  jQuery(".button.remove-button").live("click", function(e){
    e.preventDefault();
    var primval = jQuery(this).data("primval"),
        field = jQuery(this).closest(".media-listing, .existing-files").attr("data-field");
    jQuery("a[data-primval='"+primval+"']").addClass("add-button").removeClass("remove-button").text("ADD");
    jQuery(".f_"+field+"_"+primval).remove();
    jQuery(window).trigger("join.files.highlight");
    jQuery(window).trigger("join.removed");
  });

});