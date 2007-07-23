(function($){
$.fn.ajaxSubmit=function(_2){
if(typeof _2=="function"){
_2={success:_2};
}
_2=$.extend({url:this.attr("action")||window.location,type:this.attr("method")||"GET"},_2||{});
var a=this.formToArray(_2.semantic);
if(_2.beforeSubmit&&_2.beforeSubmit(a,this,_2)===false){
return this;
}
var _4={};
$.event.trigger("form.submit.validate",[a,this,_2,_4]);
if(_4.veto){
return this;
}
var q=$.param(a);
if(_2.type.toUpperCase()=="GET"){
_2.url+=(_2.url.indexOf("?")>=0?"&":"?")+q;
_2.data=null;
}else{
_2.data=q;
}
var _6=this,_7=[];
if(_2.resetForm){
_7.push(function(){
_6.resetForm();
});
}
if(_2.clearForm){
_7.push(function(){
_6.clearForm();
});
}
if(!_2.dataType&&_2.target){
var _8=_2.success;
_7.push(function(_9,_a){
$(_2.target).attr("innerHTML",_9).evalScripts().each(_8,[_9,_a]);
});
}else{
if(_2.success){
_7.push(_2.success);
}
}
_2.success=function(_b,_c){
for(var i=0,_e=_7.length;i<_e;i++){
_7[i](_b,_c);
}
};
var _f=$("input:file",this).fieldValue();
var _10=false;
for(var j=0;j<_f.length;j++){
if(_f[j]){
_10=true;
}
}
if(_2.iframe||_10){
fileUpload();
}else{
$.ajax(_2);
}
$.event.trigger("form.submit.notify",[this,_2]);
return this;
function fileUpload(){
var _12=_6[0];
var _13=$.extend({},$.ajaxSettings,_2);
var id="jqFormIO"+$.fn.ajaxSubmit.counter++;
var $io=$("<iframe id=\""+id+"\" name=\""+id+"\" />");
var io=$io[0];
var op8=$.browser.opera&&window.opera.version()<9;
if($.browser.msie||op8){
io.src="javascript:false;document.write(\"\");";
}
$io.css({position:"absolute",top:"-1000px",left:"-1000px"});
var xhr={responseText:null,responseXML:null,status:0,statusText:"n/a",getAllResponseHeaders:function(){
},getResponseHeader:function(){
},setRequestHeader:function(){
}};
var g=_13.global;
if(g&&!$.active++){
$.event.trigger("ajaxStart");
}
if(g){
$.event.trigger("ajaxSend",[xhr,_13]);
}
var _1a=0;
var _1b=0;
setTimeout(function(){
$io.appendTo("body");
io.attachEvent?io.attachEvent("onload",cb):io.addEventListener("load",cb,false);
var _1c=_12.encoding?"encoding":"enctype";
var t=_6.attr("target");
_6.attr({target:id,method:"POST",encAttr:"multipart/form-data",action:_13.url});
if(_13.timeout){
setTimeout(function(){
_1b=true;
cb();
},_13.timeout);
}
_12.submit();
_6.attr("target",t);
},10);
function cb(){
if(_1a++){
return;
}
io.detachEvent?io.detachEvent("onload",cb):io.removeEventListener("load",cb,false);
var ok=true;
try{
if(_1b){
throw "timeout";
}
var _1f,doc;
doc=io.contentWindow?io.contentWindow.document:io.contentDocument?io.contentDocument:io.document;
xhr.responseText=doc.body?doc.body.innerHTML:null;
xhr.responseXML=doc.XMLDocument?doc.XMLDocument:doc;
if(_13.dataType=="json"||_13.dataType=="script"){
var ta=doc.getElementsByTagName("textarea")[0];
_1f=ta?ta.value:xhr.responseText;
if(_13.dataType=="json"){
eval("data = "+_1f);
}else{
$.globalEval(_1f);
}
}else{
if(_13.dataType=="xml"){
_1f=xhr.responseXML;
if(!_1f&&xhr.responseText!=null){
_1f=toXml(xhr.responseText);
}
}else{
_1f=xhr.responseText;
}
}
}
catch(e){
ok=false;
$.handleError(_13,xhr,"error",e);
}
if(ok){
_13.success(_1f,"success");
if(g){
$.event.trigger("ajaxSuccess",[xhr,_13]);
}
}
if(g){
$.event.trigger("ajaxComplete",[xhr,_13]);
}
if(g&&!--$.active){
$.event.trigger("ajaxStop");
}
if(_13.complete){
_13.complete(xhr,ok?"success":"error");
}
setTimeout(function(){
$io.remove();
xhr.responseXML=null;
},100);
}
function toXml(s,doc){
if(window.ActiveXObject){
doc=new ActiveXObject("Microsoft.XMLDOM");
doc.async="false";
doc.loadXML(s);
}else{
doc=(new DOMParser()).parseFromString(s,"text/xml");
}
return (doc&&doc.documentElement&&doc.documentElement.tagName!="parsererror")?doc:null;
}
}
};
$.fn.ajaxSubmit.counter=0;
$.fn.ajaxForm=function(_24){
return this.ajaxFormUnbind().submit(submitHandler).each(function(){
this.formPluginId=$.fn.ajaxForm.counter++;
$.fn.ajaxForm.optionHash[this.formPluginId]=_24;
$(":submit,input:image",this).click(clickHandler);
});
};
$.fn.ajaxForm.counter=1;
$.fn.ajaxForm.optionHash={};
function clickHandler(e){
var _26=this.form;
_26.clk=this;
if(this.type=="image"){
if(e.offsetX!=undefined){
_26.clk_x=e.offsetX;
_26.clk_y=e.offsetY;
}else{
if(typeof $.fn.offset=="function"){
var _27=$(this).offset();
_26.clk_x=e.pageX-_27.left;
_26.clk_y=e.pageY-_27.top;
}else{
_26.clk_x=e.pageX-this.offsetLeft;
_26.clk_y=e.pageY-this.offsetTop;
}
}
}
setTimeout(function(){
_26.clk=_26.clk_x=_26.clk_y=null;
},10);
}
function submitHandler(){
var id=this.formPluginId;
var _29=$.fn.ajaxForm.optionHash[id];
$(this).ajaxSubmit(_29);
return false;
}
$.fn.ajaxFormUnbind=function(){
this.unbind("submit",submitHandler);
return this.each(function(){
$(":submit,input:image",this).unbind("click",clickHandler);
});
};
$.fn.formToArray=function(_2a){
var a=[];
if(this.length==0){
return a;
}
var _2c=this[0];
var els=_2a?_2c.getElementsByTagName("*"):_2c.elements;
if(!els){
return a;
}
for(var i=0,max=els.length;i<max;i++){
var el=els[i];
var n=el.name;
if(!n){
continue;
}
if(_2a&&_2c.clk&&el.type=="image"){
if(!el.disabled&&_2c.clk==el){
a.push({name:n+".x",value:_2c.clk_x},{name:n+".y",value:_2c.clk_y});
}
continue;
}
var v=$.fieldValue(el,true);
if(v===null){
continue;
}
if(v.constructor==Array){
for(var j=0,_34=v.length;j<_34;j++){
a.push({name:n,value:v[j]});
}
}else{
a.push({name:n,value:v});
}
}
if(!_2a&&_2c.clk){
var _35=_2c.getElementsByTagName("input");
for(var i=0,max=_35.length;i<max;i++){
var _36=_35[i];
var n=_36.name;
if(n&&!_36.disabled&&_36.type=="image"&&_2c.clk==_36){
a.push({name:n+".x",value:_2c.clk_x},{name:n+".y",value:_2c.clk_y});
}
}
}
return a;
};
$.fn.formSerialize=function(_37){
return $.param(this.formToArray(_37));
};
$.fn.fieldSerialize=function(_38){
var a=[];
this.each(function(){
var n=this.name;
if(!n){
return;
}
var v=$.fieldValue(this,_38);
if(v&&v.constructor==Array){
for(var i=0,max=v.length;i<max;i++){
a.push({name:n,value:v[i]});
}
}else{
if(v!==null&&typeof v!="undefined"){
a.push({name:this.name,value:v});
}
}
});
return $.param(a);
};
$.fn.fieldValue=function(_3e){
for(var val=[],i=0,max=this.length;i<max;i++){
var el=this[i];
var v=$.fieldValue(el,_3e);
if(v===null||typeof v=="undefined"||(v.constructor==Array&&!v.length)){
continue;
}
v.constructor==Array?$.merge(val,v):val.push(v);
}
return val;
};
$.fieldValue=function(el,_45){
var n=el.name,t=el.type,tag=el.tagName.toLowerCase();
if(typeof _45=="undefined"){
_45=true;
}
if(_45&&(!n||el.disabled||t=="reset"||t=="button"||(t=="checkbox"||t=="radio")&&!el.checked||(t=="submit"||t=="image")&&el.form&&el.form.clk!=el||tag=="select"&&el.selectedIndex==-1)){
return null;
}
if(tag=="select"){
var _49=el.selectedIndex;
if(_49<0){
return null;
}
var a=[],ops=el.options;
var one=(t=="select-one");
var max=(one?_49+1:ops.length);
for(var i=(one?_49:0);i<max;i++){
var op=ops[i];
if(op.selected){
var v=$.browser.msie&&!(op.attributes["value"].specified)?op.text:op.value;
if(one){
return v;
}
a.push(v);
}
}
return a;
}
return el.value;
};
$.fn.clearForm=function(){
return this.each(function(){
$("input,select,textarea",this).clearFields();
});
};
$.fn.clearFields=$.fn.clearInputs=function(){
return this.each(function(){
var t=this.type,tag=this.tagName.toLowerCase();
if(t=="text"||t=="password"||tag=="textarea"){
this.value="";
}else{
if(t=="checkbox"||t=="radio"){
this.checked=false;
}else{
if(tag=="select"){
this.selectedIndex=-1;
}
}
}
});
};
$.fn.resetForm=function(){
return this.each(function(){
if(typeof this.reset=="function"||(typeof this.reset=="object"&&!this.reset.nodeType)){
this.reset();
}
});
};
})(jQuery);

