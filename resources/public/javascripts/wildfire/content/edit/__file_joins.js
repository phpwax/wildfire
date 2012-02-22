function convert_to_media_join(obj){
  var i = jQuery(".joined-file:visible").length,
      field = obj.closest(".media-listing, .existing-files").attr("data-field"),
      obj = obj.clone(),
      primval = obj.find("input[type='checkbox']").val(),
      img = obj.find(".preview_link span").html(),
      p = jQuery(document.createElement("p")),
      title = p.append(obj.find(".title_link").text()),
      file_types = jQuery(document.createElement("div")),
      file_join = jQuery(document.createElement("div")),
      id_input = jQuery(document.createElement("input")),
      order = jQuery(document.createElement("input")),
      caption = jQuery(document.createElement("div")),
      caption_input =jQuery(document.createElement("input")),
      options = jQuery(document.createElement("div"))
      ;
  id_input.attr("type", "hidden").attr("name", "joins[media]["+primval+"][id]").val(primval);
  order.attr("type", "hidden").attr("name", "joins[media]["+primval+"][extra_fields][join_order]").val(i).addClass("join-order-field");
  file_join.addClass("joined-file clearfix f_"+field+"_"+primval);
  file_join.append("<div class='image_wrap'>"+img+"</div>").append(title).append(id_input).append(order);


  for(var i=0; i<file_tags.length; i++){
    var tag = jQuery(document.createElement("div")),
        label = jQuery(document.createElement("label")),
        radio = jQuery(document.createElement("input")),
        id = "tf_"+primval+"_"+i
        ;
    label.attr("for", id).html(file_tags[i]);
    radio.attr("id", id).attr("type", "radio").attr("name", 'joins[media]['+primval+'][extra_fields][tag]').val(file_tags[i]).addClass("radio_field");
    if(i == 0) radio.attr("checked", true);
    tag.addClass("clearfix tag_"+i);
    tag.append(radio).append(label);
    file_join.append(tag);
  }
  caption_input.attr("type", "text").attr("name", "joins[media]["+primval+"][extra_fields][title]").val("").attr("placeholder", "caption");
  caption.addClass("join_title").append(caption_input);
  options.addClass("tag_options clearfix").append("<a href='#' data-primval='"+primval+"' class='button js-added remove-button'>REMOVE</a>");

  file_join.append(caption).append(options);

  jQuery(".existing-files:visible").append(file_join);
}

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
  //on click we will now copy that
  jQuery(".button.add-button").live("click", function(e){
    e.preventDefault();
    var primval = jQuery(this).data("primval"), 
        base = jQuery(this).closest(".media-data"),
        insert = convert_to_media_join(base);
    jQuery("a[data-primval='"+primval+"']").addClass("remove-button").removeClass("add-button").text("REMOVE");
    jQuery(window).trigger("join.files.highlight");
  });
  jQuery(".button.remove-button").live("click", function(e){
    e.preventDefault();
    var primval = jQuery(this).data("primval"),
        field = jQuery(this).closest(".media-listing, .existing-files").attr("data-field");
    jQuery("a[data-primval='"+primval+"']").addClass("add-button").removeClass("remove-button").text("ADD");
    jQuery(".f_"+field+"_"+primval).remove();
    jQuery(window).trigger("join.files.highlight");
  });

});