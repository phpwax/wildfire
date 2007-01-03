function add_form_listeners() {
  document.getElementsByClassName("input_field").each(function(num) {
    Event.observe(num, "focus", function(event){ Event.element(event).parentNode.style.backgroundColor="#FCF9AD";});
  });
  document.getElementsByClassName("input_field").each(function(num) {
    Event.observe(num, "blur", function(event){ Event.element(event).parentNode.style.backgroundColor="transparent";});
  });
}

function page_setup() {
  add_form_listeners();
  widgInit();
}

Event.observe(window, "load", page_setup);
