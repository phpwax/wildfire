/*
 * jQuery 1.2.6 - New Wave Javascript
 *
 * Copyright (c) 2008 John Resig (jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2008-05-24 14:22:17 -0400 (Sat, 24 May 2008) $
 * $Rev: 5685 $
 */
(function(){var _jQuery=window.jQuery,_$=window.$;var jQuery=window.jQuery=window.$=function(selector,context){return new jQuery.fn.init(selector,context);};var quickExpr=/^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/,isSimple=/^.[^:#\[\.]*$/,undefined;jQuery.fn=jQuery.prototype={init:function(selector,context){selector=selector||document;if(selector.nodeType){this[0]=selector;this.length=1;return this;}if(typeof selector=="string"){var match=quickExpr.exec(selector);if(match&&(match[1]||!context)){if(match[1])selector=jQuery.clean([match[1]],context);else{var elem=document.getElementById(match[3]);if(elem){if(elem.id!=match[3])return jQuery().find(selector);return jQuery(elem);}selector=[];}}else
return jQuery(context).find(selector);}else if(jQuery.isFunction(selector))return jQuery(document)[jQuery.fn.ready?"ready":"load"](selector);return this.setArray(jQuery.makeArray(selector));},jquery:"1.2.6",size:function(){return this.length;},length:0,get:function(num){return num==undefined?jQuery.makeArray(this):this[num];},pushStack:function(elems){var ret=jQuery(elems);ret.prevObject=this;return ret;},setArray:function(elems){this.length=0;Array.prototype.push.apply(this,elems);return this;},each:function(callback,args){return jQuery.each(this,callback,args);},index:function(elem){var ret=-1;return jQuery.inArray(elem&&elem.jquery?elem[0]:elem,this);},attr:function(name,value,type){var options=name;if(name.constructor==String)if(value===undefined)return this[0]&&jQuery[type||"attr"](this[0],name);else{options={};options[name]=value;}return this.each(function(i){for(name in options)jQuery.attr(type?this.style:this,name,jQuery.prop(this,options[name],type,i,name));});},css:function(key,value){if((key=='width'||key=='height')&&parseFloat(value)<0)value=undefined;return this.attr(key,value,"curCSS");},text:function(text){if(typeof text!="object"&&text!=null)return this.empty().append((this[0]&&this[0].ownerDocument||document).createTextNode(text));var ret="";jQuery.each(text||this,function(){jQuery.each(this.childNodes,function(){if(this.nodeType!=8)ret+=this.nodeType!=1?this.nodeValue:jQuery.fn.text([this]);});});return ret;},wrapAll:function(html){if(this[0])jQuery(html,this[0].ownerDocument).clone().insertBefore(this[0]).map(function(){var elem=this;while(elem.firstChild)elem=elem.firstChild;return elem;}).append(this);return this;},wrapInner:function(html){return this.each(function(){jQuery(this).contents().wrapAll(html);});},wrap:function(html){return this.each(function(){jQuery(this).wrapAll(html);});},append:function(){return this.domManip(arguments,true,false,function(elem){if(this.nodeType==1)this.appendChild(elem);});},prepend:function(){return this.domManip(arguments,true,true,function(elem){if(this.nodeType==1)this.insertBefore(elem,this.firstChild);});},before:function(){return this.domManip(arguments,false,false,function(elem){this.parentNode.insertBefore(elem,this);});},after:function(){return this.domManip(arguments,false,true,function(elem){this.parentNode.insertBefore(elem,this.nextSibling);});},end:function(){return this.prevObject||jQuery([]);},find:function(selector){var elems=jQuery.map(this,function(elem){return jQuery.find(selector,elem);});return this.pushStack(/[^+>] [^+>]/.test(selector)||selector.indexOf("..")>-1?jQuery.unique(elems):elems);},clone:function(events){var ret=this.map(function(){if(jQuery.browser.msie&&!jQuery.isXMLDoc(this)){var clone=this.cloneNode(true),container=document.createElement("div");container.appendChild(clone);return jQuery.clean([container.innerHTML])[0];}else
return this.cloneNode(true);});var clone=ret.find("*").andSelf().each(function(){if(this[expando]!=undefined)this[expando]=null;});if(events===true)this.find("*").andSelf().each(function(i){if(this.nodeType==3)return;var events=jQuery.data(this,"events");for(var type in events)for(var handler in events[type])jQuery.event.add(clone[i],type,events[type][handler],events[type][handler].data);});return ret;},filter:function(selector){return this.pushStack(jQuery.isFunction(selector)&&jQuery.grep(this,function(elem,i){return selector.call(elem,i);})||jQuery.multiFilter(selector,this));},not:function(selector){if(selector.constructor==String)if(isSimple.test(selector))return this.pushStack(jQuery.multiFilter(selector,this,true));else
selector=jQuery.multiFilter(selector,this);var isArrayLike=selector.length&&selector[selector.length-1]!==undefined&&!selector.nodeType;return this.filter(function(){return isArrayLike?jQuery.inArray(this,selector)<0:this!=selector;});},add:function(selector){return this.pushStack(jQuery.unique(jQuery.merge(this.get(),typeof selector=='string'?jQuery(selector):jQuery.makeArray(selector))));},is:function(selector){return!!selector&&jQuery.multiFilter(selector,this).length>0;},hasClass:function(selector){return this.is("."+selector);},val:function(value){if(value==undefined){if(this.length){var elem=this[0];if(jQuery.nodeName(elem,"select")){var index=elem.selectedIndex,values=[],options=elem.options,one=elem.type=="select-one";if(index<0)return null;for(var i=one?index:0,max=one?index+1:options.length;i<max;i++){var option=options[i];if(option.selected){value=jQuery.browser.msie&&!option.attributes.value.specified?option.text:option.value;if(one)return value;values.push(value);}}return values;}else
return(this[0].value||"").replace(/\r/g,"");}return undefined;}if(value.constructor==Number)value+='';return this.each(function(){if(this.nodeType!=1)return;if(value.constructor==Array&&/radio|checkbox/.test(this.type))this.checked=(jQuery.inArray(this.value,value)>=0||jQuery.inArray(this.name,value)>=0);else if(jQuery.nodeName(this,"select")){var values=jQuery.makeArray(value);jQuery("option",this).each(function(){this.selected=(jQuery.inArray(this.value,values)>=0||jQuery.inArray(this.text,values)>=0);});if(!values.length)this.selectedIndex=-1;}else
this.value=value;});},html:function(value){return value==undefined?(this[0]?this[0].innerHTML:null):this.empty().append(value);},replaceWith:function(value){return this.after(value).remove();},eq:function(i){return this.slice(i,i+1);},slice:function(){return this.pushStack(Array.prototype.slice.apply(this,arguments));},map:function(callback){return this.pushStack(jQuery.map(this,function(elem,i){return callback.call(elem,i,elem);}));},andSelf:function(){return this.add(this.prevObject);},data:function(key,value){var parts=key.split(".");parts[1]=parts[1]?"."+parts[1]:"";if(value===undefined){var data=this.triggerHandler("getData"+parts[1]+"!",[parts[0]]);if(data===undefined&&this.length)data=jQuery.data(this[0],key);return data===undefined&&parts[1]?this.data(parts[0]):data;}else
return this.trigger("setData"+parts[1]+"!",[parts[0],value]).each(function(){jQuery.data(this,key,value);});},removeData:function(key){return this.each(function(){jQuery.removeData(this,key);});},domManip:function(args,table,reverse,callback){var clone=this.length>1,elems;return this.each(function(){if(!elems){elems=jQuery.clean(args,this.ownerDocument);if(reverse)elems.reverse();}var obj=this;if(table&&jQuery.nodeName(this,"table")&&jQuery.nodeName(elems[0],"tr"))obj=this.getElementsByTagName("tbody")[0]||this.appendChild(this.ownerDocument.createElement("tbody"));var scripts=jQuery([]);jQuery.each(elems,function(){var elem=clone?jQuery(this).clone(true)[0]:this;if(jQuery.nodeName(elem,"script"))scripts=scripts.add(elem);else{if(elem.nodeType==1)scripts=scripts.add(jQuery("script",elem).remove());callback.call(obj,elem);}});scripts.each(evalScript);});}};jQuery.fn.init.prototype=jQuery.fn;function evalScript(i,elem){if(elem.src)jQuery.ajax({url:elem.src,async:false,dataType:"script"});else
jQuery.globalEval(elem.text||elem.textContent||elem.innerHTML||"");if(elem.parentNode)elem.parentNode.removeChild(elem);}function now(){return+new Date;}jQuery.extend=jQuery.fn.extend=function(){var target=arguments[0]||{},i=1,length=arguments.length,deep=false,options;if(target.constructor==Boolean){deep=target;target=arguments[1]||{};i=2;}if(typeof target!="object"&&typeof target!="function")target={};if(length==i){target=this;--i;}for(;i<length;i++)if((options=arguments[i])!=null)for(var name in options){var src=target[name],copy=options[name];if(target===copy)continue;if(deep&&copy&&typeof copy=="object"&&!copy.nodeType)target[name]=jQuery.extend(deep,src||(copy.length!=null?[]:{}),copy);else if(copy!==undefined)target[name]=copy;}return target;};var expando="jQuery"+now(),uuid=0,windowData={},exclude=/z-?index|font-?weight|opacity|zoom|line-?height/i,defaultView=document.defaultView||{};jQuery.extend({noConflict:function(deep){window.$=_$;if(deep)window.jQuery=_jQuery;return jQuery;},isFunction:function(fn){return!!fn&&typeof fn!="string"&&!fn.nodeName&&fn.constructor!=Array&&/^[\s[]?function/.test(fn+"");},isXMLDoc:function(elem){return elem.documentElement&&!elem.body||elem.tagName&&elem.ownerDocument&&!elem.ownerDocument.body;},globalEval:function(data){data=jQuery.trim(data);if(data){var head=document.getElementsByTagName("head")[0]||document.documentElement,script=document.createElement("script");script.type="text/javascript";if(jQuery.browser.msie)script.text=data;else
script.appendChild(document.createTextNode(data));head.insertBefore(script,head.firstChild);head.removeChild(script);}},nodeName:function(elem,name){return elem.nodeName&&elem.nodeName.toUpperCase()==name.toUpperCase();},cache:{},data:function(elem,name,data){elem=elem==window?windowData:elem;var id=elem[expando];if(!id)id=elem[expando]=++uuid;if(name&&!jQuery.cache[id])jQuery.cache[id]={};if(data!==undefined)jQuery.cache[id][name]=data;return name?jQuery.cache[id][name]:id;},removeData:function(elem,name){elem=elem==window?windowData:elem;var id=elem[expando];if(name){if(jQuery.cache[id]){delete jQuery.cache[id][name];name="";for(name in jQuery.cache[id])break;if(!name)jQuery.removeData(elem);}}else{try{delete elem[expando];}catch(e){if(elem.removeAttribute)elem.removeAttribute(expando);}delete jQuery.cache[id];}},each:function(object,callback,args){var name,i=0,length=object.length;if(args){if(length==undefined){for(name in object)if(callback.apply(object[name],args)===false)break;}else
for(;i<length;)if(callback.apply(object[i++],args)===false)break;}else{if(length==undefined){for(name in object)if(callback.call(object[name],name,object[name])===false)break;}else
for(var value=object[0];i<length&&callback.call(value,i,value)!==false;value=object[++i]){}}return object;},prop:function(elem,value,type,i,name){if(jQuery.isFunction(value))value=value.call(elem,i);return value&&value.constructor==Number&&type=="curCSS"&&!exclude.test(name)?value+"px":value;},className:{add:function(elem,classNames){jQuery.each((classNames||"").split(/\s+/),function(i,className){if(elem.nodeType==1&&!jQuery.className.has(elem.className,className))elem.className+=(elem.className?" ":"")+className;});},remove:function(elem,classNames){if(elem.nodeType==1)elem.className=classNames!=undefined?jQuery.grep(elem.className.split(/\s+/),function(className){return!jQuery.className.has(classNames,className);}).join(" "):"";},has:function(elem,className){return jQuery.inArray(className,(elem.className||elem).toString().split(/\s+/))>-1;}},swap:function(elem,options,callback){var old={};for(var name in options){old[name]=elem.style[name];elem.style[name]=options[name];}callback.call(elem);for(var name in options)elem.style[name]=old[name];},css:function(elem,name,force){if(name=="width"||name=="height"){var val,props={position:"absolute",visibility:"hidden",display:"block"},which=name=="width"?["Left","Right"]:["Top","Bottom"];function getWH(){val=name=="width"?elem.offsetWidth:elem.offsetHeight;var padding=0,border=0;jQuery.each(which,function(){padding+=parseFloat(jQuery.curCSS(elem,"padding"+this,true))||0;border+=parseFloat(jQuery.curCSS(elem,"border"+this+"Width",true))||0;});val-=Math.round(padding+border);}if(jQuery(elem).is(":visible"))getWH();else
jQuery.swap(elem,props,getWH);return Math.max(0,val);}return jQuery.curCSS(elem,name,force);},curCSS:function(elem,name,force){var ret,style=elem.style;function color(elem){if(!jQuery.browser.safari)return false;var ret=defaultView.getComputedStyle(elem,null);return!ret||ret.getPropertyValue("color")=="";}if(name=="opacity"&&jQuery.browser.msie){ret=jQuery.attr(style,"opacity");return ret==""?"1":ret;}if(jQuery.browser.opera&&name=="display"){var save=style.outline;style.outline="0 solid black";style.outline=save;}if(name.match(/float/i))name=styleFloat;if(!force&&style&&style[name])ret=style[name];else if(defaultView.getComputedStyle){if(name.match(/float/i))name="float";name=name.replace(/([A-Z])/g,"-$1").toLowerCase();var computedStyle=defaultView.getComputedStyle(elem,null);if(computedStyle&&!color(elem))ret=computedStyle.getPropertyValue(name);else{var swap=[],stack=[],a=elem,i=0;for(;a&&color(a);a=a.parentNode)stack.unshift(a);for(;i<stack.length;i++)if(color(stack[i])){swap[i]=stack[i].style.display;stack[i].style.display="block";}ret=name=="display"&&swap[stack.length-1]!=null?"none":(computedStyle&&computedStyle.getPropertyValue(name))||"";for(i=0;i<swap.length;i++)if(swap[i]!=null)stack[i].style.display=swap[i];}if(name=="opacity"&&ret=="")ret="1";}else if(elem.currentStyle){var camelCase=name.replace(/\-(\w)/g,function(all,letter){return letter.toUpperCase();});ret=elem.currentStyle[name]||elem.currentStyle[camelCase];if(!/^\d+(px)?$/i.test(ret)&&/^\d/.test(ret)){var left=style.left,rsLeft=elem.runtimeStyle.left;elem.runtimeStyle.left=elem.currentStyle.left;style.left=ret||0;ret=style.pixelLeft+"px";style.left=left;elem.runtimeStyle.left=rsLeft;}}return ret;},clean:function(elems,context){var ret=[];context=context||document;if(typeof context.createElement=='undefined')context=context.ownerDocument||context[0]&&context[0].ownerDocument||document;jQuery.each(elems,function(i,elem){if(!elem)return;if(elem.constructor==Number)elem+='';if(typeof elem=="string"){elem=elem.replace(/(<(\w+)[^>]*?)\/>/g,function(all,front,tag){return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i)?all:front+"></"+tag+">";});var tags=jQuery.trim(elem).toLowerCase(),div=context.createElement("div");var wrap=!tags.indexOf("<opt")&&[1,"<select multiple='multiple'>","</select>"]||!tags.indexOf("<leg")&&[1,"<fieldset>","</fieldset>"]||tags.match(/^<(thead|tbody|tfoot|colg|cap)/)&&[1,"<table>","</table>"]||!tags.indexOf("<tr")&&[2,"<table><tbody>","</tbody></table>"]||(!tags.indexOf("<td")||!tags.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||!tags.indexOf("<col")&&[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"]||jQuery.browser.msie&&[1,"div<div>","</div>"]||[0,"",""];div.innerHTML=wrap[1]+elem+wrap[2];while(wrap[0]--)div=div.lastChild;if(jQuery.browser.msie){var tbody=!tags.indexOf("<table")&&tags.indexOf("<tbody")<0?div.firstChild&&div.firstChild.childNodes:wrap[1]=="<table>"&&tags.indexOf("<tbody")<0?div.childNodes:[];for(var j=tbody.length-1;j>=0;--j)if(jQuery.nodeName(tbody[j],"tbody")&&!tbody[j].childNodes.length)tbody[j].parentNode.removeChild(tbody[j]);if(/^\s/.test(elem))div.insertBefore(context.createTextNode(elem.match(/^\s*/)[0]),div.firstChild);}elem=jQuery.makeArray(div.childNodes);}if(elem.length===0&&(!jQuery.nodeName(elem,"form")&&!jQuery.nodeName(elem,"select")))return;if(elem[0]==undefined||jQuery.nodeName(elem,"form")||elem.options)ret.push(elem);else
ret=jQuery.merge(ret,elem);});return ret;},attr:function(elem,name,value){if(!elem||elem.nodeType==3||elem.nodeType==8)return undefined;var notxml=!jQuery.isXMLDoc(elem),set=value!==undefined,msie=jQuery.browser.msie;name=notxml&&jQuery.props[name]||name;if(elem.tagName){var special=/href|src|style/.test(name);if(name=="selected"&&jQuery.browser.safari)elem.parentNode.selectedIndex;if(name in elem&&notxml&&!special){if(set){if(name=="type"&&jQuery.nodeName(elem,"input")&&elem.parentNode)throw"type property can't be changed";elem[name]=value;}if(jQuery.nodeName(elem,"form")&&elem.getAttributeNode(name))return elem.getAttributeNode(name).nodeValue;return elem[name];}if(msie&&notxml&&name=="style")return jQuery.attr(elem.style,"cssText",value);if(set)elem.setAttribute(name,""+value);var attr=msie&&notxml&&special?elem.getAttribute(name,2):elem.getAttribute(name);return attr===null?undefined:attr;}if(msie&&name=="opacity"){if(set){elem.zoom=1;elem.filter=(elem.filter||"").replace(/alpha\([^)]*\)/,"")+(parseInt(value)+''=="NaN"?"":"alpha(opacity="+value*100+")");}return elem.filter&&elem.filter.indexOf("opacity=")>=0?(parseFloat(elem.filter.match(/opacity=([^)]*)/)[1])/100)+'':"";}name=name.replace(/-([a-z])/ig,function(all,letter){return letter.toUpperCase();});if(set)elem[name]=value;return elem[name];},trim:function(text){return(text||"").replace(/^\s+|\s+$/g,"");},makeArray:function(array){var ret=[];if(array!=null){var i=array.length;if(i==null||array.split||array.setInterval||array.call)ret[0]=array;else
while(i)ret[--i]=array[i];}return ret;},inArray:function(elem,array){for(var i=0,length=array.length;i<length;i++)if(array[i]===elem)return i;return-1;},merge:function(first,second){var i=0,elem,pos=first.length;if(jQuery.browser.msie){while(elem=second[i++])if(elem.nodeType!=8)first[pos++]=elem;}else
while(elem=second[i++])first[pos++]=elem;return first;},unique:function(array){var ret=[],done={};try{for(var i=0,length=array.length;i<length;i++){var id=jQuery.data(array[i]);if(!done[id]){done[id]=true;ret.push(array[i]);}}}catch(e){ret=array;}return ret;},grep:function(elems,callback,inv){var ret=[];for(var i=0,length=elems.length;i<length;i++)if(!inv!=!callback(elems[i],i))ret.push(elems[i]);return ret;},map:function(elems,callback){var ret=[];for(var i=0,length=elems.length;i<length;i++){var value=callback(elems[i],i);if(value!=null)ret[ret.length]=value;}return ret.concat.apply([],ret);}});var userAgent=navigator.userAgent.toLowerCase();jQuery.browser={version:(userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)||[])[1],safari:/webkit/.test(userAgent),opera:/opera/.test(userAgent),msie:/msie/.test(userAgent)&&!/opera/.test(userAgent),mozilla:/mozilla/.test(userAgent)&&!/(compatible|webkit)/.test(userAgent)};var styleFloat=jQuery.browser.msie?"styleFloat":"cssFloat";jQuery.extend({boxModel:!jQuery.browser.msie||document.compatMode=="CSS1Compat",props:{"for":"htmlFor","class":"className","float":styleFloat,cssFloat:styleFloat,styleFloat:styleFloat,readonly:"readOnly",maxlength:"maxLength",cellspacing:"cellSpacing"}});jQuery.each({parent:function(elem){return elem.parentNode;},parents:function(elem){return jQuery.dir(elem,"parentNode");},next:function(elem){return jQuery.nth(elem,2,"nextSibling");},prev:function(elem){return jQuery.nth(elem,2,"previousSibling");},nextAll:function(elem){return jQuery.dir(elem,"nextSibling");},prevAll:function(elem){return jQuery.dir(elem,"previousSibling");},siblings:function(elem){return jQuery.sibling(elem.parentNode.firstChild,elem);},children:function(elem){return jQuery.sibling(elem.firstChild);},contents:function(elem){return jQuery.nodeName(elem,"iframe")?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.childNodes);}},function(name,fn){jQuery.fn[name]=function(selector){var ret=jQuery.map(this,fn);if(selector&&typeof selector=="string")ret=jQuery.multiFilter(selector,ret);return this.pushStack(jQuery.unique(ret));};});jQuery.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(name,original){jQuery.fn[name]=function(){var args=arguments;return this.each(function(){for(var i=0,length=args.length;i<length;i++)jQuery(args[i])[original](this);});};});jQuery.each({removeAttr:function(name){jQuery.attr(this,name,"");if(this.nodeType==1)this.removeAttribute(name);},addClass:function(classNames){jQuery.className.add(this,classNames);},removeClass:function(classNames){jQuery.className.remove(this,classNames);},toggleClass:function(classNames){jQuery.className[jQuery.className.has(this,classNames)?"remove":"add"](this,classNames);},remove:function(selector){if(!selector||jQuery.filter(selector,[this]).r.length){jQuery("*",this).add(this).each(function(){jQuery.event.remove(this);jQuery.removeData(this);});if(this.parentNode)this.parentNode.removeChild(this);}},empty:function(){jQuery(">*",this).remove();while(this.firstChild)this.removeChild(this.firstChild);}},function(name,fn){jQuery.fn[name]=function(){return this.each(fn,arguments);};});jQuery.each(["Height","Width"],function(i,name){var type=name.toLowerCase();jQuery.fn[type]=function(size){return this[0]==window?jQuery.browser.opera&&document.body["client"+name]||jQuery.browser.safari&&window["inner"+name]||document.compatMode=="CSS1Compat"&&document.documentElement["client"+name]||document.body["client"+name]:this[0]==document?Math.max(Math.max(document.body["scroll"+name],document.documentElement["scroll"+name]),Math.max(document.body["offset"+name],document.documentElement["offset"+name])):size==undefined?(this.length?jQuery.css(this[0],type):null):this.css(type,size.constructor==String?size:size+"px");};});function num(elem,prop){return elem[0]&&parseInt(jQuery.curCSS(elem[0],prop,true),10)||0;}var chars=jQuery.browser.safari&&parseInt(jQuery.browser.version)<417?"(?:[\\w*_-]|\\\\.)":"(?:[\\w\u0128-\uFFFF*_-]|\\\\.)",quickChild=new RegExp("^>\\s*("+chars+"+)"),quickID=new RegExp("^("+chars+"+)(#)("+chars+"+)"),quickClass=new RegExp("^([#.]?)("+chars+"*)");jQuery.extend({expr:{"":function(a,i,m){return m[2]=="*"||jQuery.nodeName(a,m[2]);},"#":function(a,i,m){return a.getAttribute("id")==m[2];},":":{lt:function(a,i,m){return i<m[3]-0;},gt:function(a,i,m){return i>m[3]-0;},nth:function(a,i,m){return m[3]-0==i;},eq:function(a,i,m){return m[3]-0==i;},first:function(a,i){return i==0;},last:function(a,i,m,r){return i==r.length-1;},even:function(a,i){return i%2==0;},odd:function(a,i){return i%2;},"first-child":function(a){return a.parentNode.getElementsByTagName("*")[0]==a;},"last-child":function(a){return jQuery.nth(a.parentNode.lastChild,1,"previousSibling")==a;},"only-child":function(a){return!jQuery.nth(a.parentNode.lastChild,2,"previousSibling");},parent:function(a){return a.firstChild;},empty:function(a){return!a.firstChild;},contains:function(a,i,m){return(a.textContent||a.innerText||jQuery(a).text()||"").indexOf(m[3])>=0;},visible:function(a){return"hidden"!=a.type&&jQuery.css(a,"display")!="none"&&jQuery.css(a,"visibility")!="hidden";},hidden:function(a){return"hidden"==a.type||jQuery.css(a,"display")=="none"||jQuery.css(a,"visibility")=="hidden";},enabled:function(a){return!a.disabled;},disabled:function(a){return a.disabled;},checked:function(a){return a.checked;},selected:function(a){return a.selected||jQuery.attr(a,"selected");},text:function(a){return"text"==a.type;},radio:function(a){return"radio"==a.type;},checkbox:function(a){return"checkbox"==a.type;},file:function(a){return"file"==a.type;},password:function(a){return"password"==a.type;},submit:function(a){return"submit"==a.type;},image:function(a){return"image"==a.type;},reset:function(a){return"reset"==a.type;},button:function(a){return"button"==a.type||jQuery.nodeName(a,"button");},input:function(a){return/input|select|textarea|button/i.test(a.nodeName);},has:function(a,i,m){return jQuery.find(m[3],a).length;},header:function(a){return/h\d/i.test(a.nodeName);},animated:function(a){return jQuery.grep(jQuery.timers,function(fn){return a==fn.elem;}).length;}}},parse:[/^(\[) *@?([\w-]+) *([!*$^~=]*) *('?"?)(.*?)\4 *\]/,/^(:)([\w-]+)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/,new RegExp("^([:.#]*)("+chars+"+)")],multiFilter:function(expr,elems,not){var old,cur=[];while(expr&&expr!=old){old=expr;var f=jQuery.filter(expr,elems,not);expr=f.t.replace(/^\s*,\s*/,"");cur=not?elems=f.r:jQuery.merge(cur,f.r);}return cur;},find:function(t,context){if(typeof t!="string")return[t];if(context&&context.nodeType!=1&&context.nodeType!=9)return[];context=context||document;var ret=[context],done=[],last,nodeName;while(t&&last!=t){var r=[];last=t;t=jQuery.trim(t);var foundToken=false,re=quickChild,m=re.exec(t);if(m){nodeName=m[1].toUpperCase();for(var i=0;ret[i];i++)for(var c=ret[i].firstChild;c;c=c.nextSibling)if(c.nodeType==1&&(nodeName=="*"||c.nodeName.toUpperCase()==nodeName))r.push(c);ret=r;t=t.replace(re,"");if(t.indexOf(" ")==0)continue;foundToken=true;}else{re=/^([>+~])\s*(\w*)/i;if((m=re.exec(t))!=null){r=[];var merge={};nodeName=m[2].toUpperCase();m=m[1];for(var j=0,rl=ret.length;j<rl;j++){var n=m=="~"||m=="+"?ret[j].nextSibling:ret[j].firstChild;for(;n;n=n.nextSibling)if(n.nodeType==1){var id=jQuery.data(n);if(m=="~"&&merge[id])break;if(!nodeName||n.nodeName.toUpperCase()==nodeName){if(m=="~")merge[id]=true;r.push(n);}if(m=="+")break;}}ret=r;t=jQuery.trim(t.replace(re,""));foundToken=true;}}if(t&&!foundToken){if(!t.indexOf(",")){if(context==ret[0])ret.shift();done=jQuery.merge(done,ret);r=ret=[context];t=" "+t.substr(1,t.length);}else{var re2=quickID;var m=re2.exec(t);if(m){m=[0,m[2],m[3],m[1]];}else{re2=quickClass;m=re2.exec(t);}m[2]=m[2].replace(/\\/g,"");var elem=ret[ret.length-1];if(m[1]=="#"&&elem&&elem.getElementById&&!jQuery.isXMLDoc(elem)){var oid=elem.getElementById(m[2]);if((jQuery.browser.msie||jQuery.browser.opera)&&oid&&typeof oid.id=="string"&&oid.id!=m[2])oid=jQuery('[@id="'+m[2]+'"]',elem)[0];ret=r=oid&&(!m[3]||jQuery.nodeName(oid,m[3]))?[oid]:[];}else{for(var i=0;ret[i];i++){var tag=m[1]=="#"&&m[3]?m[3]:m[1]!=""||m[0]==""?"*":m[2];if(tag=="*"&&ret[i].nodeName.toLowerCase()=="object")tag="param";r=jQuery.merge(r,ret[i].getElementsByTagName(tag));}if(m[1]==".")r=jQuery.classFilter(r,m[2]);if(m[1]=="#"){var tmp=[];for(var i=0;r[i];i++)if(r[i].getAttribute("id")==m[2]){tmp=[r[i]];break;}r=tmp;}ret=r;}t=t.replace(re2,"");}}if(t){var val=jQuery.filter(t,r);ret=r=val.r;t=jQuery.trim(val.t);}}if(t)ret=[];if(ret&&context==ret[0])ret.shift();done=jQuery.merge(done,ret);return done;},classFilter:function(r,m,not){m=" "+m+" ";var tmp=[];for(var i=0;r[i];i++){var pass=(" "+r[i].className+" ").indexOf(m)>=0;if(!not&&pass||not&&!pass)tmp.push(r[i]);}return tmp;},filter:function(t,r,not){var last;while(t&&t!=last){last=t;var p=jQuery.parse,m;for(var i=0;p[i];i++){m=p[i].exec(t);if(m){t=t.substring(m[0].length);m[2]=m[2].replace(/\\/g,"");break;}}if(!m)break;if(m[1]==":"&&m[2]=="not")r=isSimple.test(m[3])?jQuery.filter(m[3],r,true).r:jQuery(r).not(m[3]);else if(m[1]==".")r=jQuery.classFilter(r,m[2],not);else if(m[1]=="["){var tmp=[],type=m[3];for(var i=0,rl=r.length;i<rl;i++){var a=r[i],z=a[jQuery.props[m[2]]||m[2]];if(z==null||/href|src|selected/.test(m[2]))z=jQuery.attr(a,m[2])||'';if((type==""&&!!z||type=="="&&z==m[5]||type=="!="&&z!=m[5]||type=="^="&&z&&!z.indexOf(m[5])||type=="$="&&z.substr(z.length-m[5].length)==m[5]||(type=="*="||type=="~=")&&z.indexOf(m[5])>=0)^not)tmp.push(a);}r=tmp;}else if(m[1]==":"&&m[2]=="nth-child"){var merge={},tmp=[],test=/(-?)(\d*)n((?:\+|-)?\d*)/.exec(m[3]=="even"&&"2n"||m[3]=="odd"&&"2n+1"||!/\D/.test(m[3])&&"0n+"+m[3]||m[3]),first=(test[1]+(test[2]||1))-0,last=test[3]-0;for(var i=0,rl=r.length;i<rl;i++){var node=r[i],parentNode=node.parentNode,id=jQuery.data(parentNode);if(!merge[id]){var c=1;for(var n=parentNode.firstChild;n;n=n.nextSibling)if(n.nodeType==1)n.nodeIndex=c++;merge[id]=true;}var add=false;if(first==0){if(node.nodeIndex==last)add=true;}else if((node.nodeIndex-last)%first==0&&(node.nodeIndex-last)/first>=0)add=true;if(add^not)tmp.push(node);}r=tmp;}else{var fn=jQuery.expr[m[1]];if(typeof fn=="object")fn=fn[m[2]];if(typeof fn=="string")fn=eval("false||function(a,i){return "+fn+";}");r=jQuery.grep(r,function(elem,i){return fn(elem,i,m,r);},not);}}return{r:r,t:t};},dir:function(elem,dir){var matched=[],cur=elem[dir];while(cur&&cur!=document){if(cur.nodeType==1)matched.push(cur);cur=cur[dir];}return matched;},nth:function(cur,result,dir,elem){result=result||1;var num=0;for(;cur;cur=cur[dir])if(cur.nodeType==1&&++num==result)break;return cur;},sibling:function(n,elem){var r=[];for(;n;n=n.nextSibling){if(n.nodeType==1&&n!=elem)r.push(n);}return r;}});jQuery.event={add:function(elem,types,handler,data){if(elem.nodeType==3||elem.nodeType==8)return;if(jQuery.browser.msie&&elem.setInterval)elem=window;if(!handler.guid)handler.guid=this.guid++;if(data!=undefined){var fn=handler;handler=this.proxy(fn,function(){return fn.apply(this,arguments);});handler.data=data;}var events=jQuery.data(elem,"events")||jQuery.data(elem,"events",{}),handle=jQuery.data(elem,"handle")||jQuery.data(elem,"handle",function(){if(typeof jQuery!="undefined"&&!jQuery.event.triggered)return jQuery.event.handle.apply(arguments.callee.elem,arguments);});handle.elem=elem;jQuery.each(types.split(/\s+/),function(index,type){var parts=type.split(".");type=parts[0];handler.type=parts[1];var handlers=events[type];if(!handlers){handlers=events[type]={};if(!jQuery.event.special[type]||jQuery.event.special[type].setup.call(elem)===false){if(elem.addEventListener)elem.addEventListener(type,handle,false);else if(elem.attachEvent)elem.attachEvent("on"+type,handle);}}handlers[handler.guid]=handler;jQuery.event.global[type]=true;});elem=null;},guid:1,global:{},remove:function(elem,types,handler){if(elem.nodeType==3||elem.nodeType==8)return;var events=jQuery.data(elem,"events"),ret,index;if(events){if(types==undefined||(typeof types=="string"&&types.charAt(0)=="."))for(var type in events)this.remove(elem,type+(types||""));else{if(types.type){handler=types.handler;types=types.type;}jQuery.each(types.split(/\s+/),function(index,type){var parts=type.split(".");type=parts[0];if(events[type]){if(handler)delete events[type][handler.guid];else
for(handler in events[type])if(!parts[1]||events[type][handler].type==parts[1])delete events[type][handler];for(ret in events[type])break;if(!ret){if(!jQuery.event.special[type]||jQuery.event.special[type].teardown.call(elem)===false){if(elem.removeEventListener)elem.removeEventListener(type,jQuery.data(elem,"handle"),false);else if(elem.detachEvent)elem.detachEvent("on"+type,jQuery.data(elem,"handle"));}ret=null;delete events[type];}}});}for(ret in events)break;if(!ret){var handle=jQuery.data(elem,"handle");if(handle)handle.elem=null;jQuery.removeData(elem,"events");jQuery.removeData(elem,"handle");}}},trigger:function(type,data,elem,donative,extra){data=jQuery.makeArray(data);if(type.indexOf("!")>=0){type=type.slice(0,-1);var exclusive=true;}if(!elem){if(this.global[type])jQuery("*").add([window,document]).trigger(type,data);}else{if(elem.nodeType==3||elem.nodeType==8)return undefined;var val,ret,fn=jQuery.isFunction(elem[type]||null),event=!data[0]||!data[0].preventDefault;if(event){data.unshift({type:type,target:elem,preventDefault:function(){},stopPropagation:function(){},timeStamp:now()});data[0][expando]=true;}data[0].type=type;if(exclusive)data[0].exclusive=true;var handle=jQuery.data(elem,"handle");if(handle)val=handle.apply(elem,data);if((!fn||(jQuery.nodeName(elem,'a')&&type=="click"))&&elem["on"+type]&&elem["on"+type].apply(elem,data)===false)val=false;if(event)data.shift();if(extra&&jQuery.isFunction(extra)){ret=extra.apply(elem,val==null?data:data.concat(val));if(ret!==undefined)val=ret;}if(fn&&donative!==false&&val!==false&&!(jQuery.nodeName(elem,'a')&&type=="click")){this.triggered=true;try{elem[type]();}catch(e){}}this.triggered=false;}return val;},handle:function(event){var val,ret,namespace,all,handlers;event=arguments[0]=jQuery.event.fix(event||window.event);namespace=event.type.split(".");event.type=namespace[0];namespace=namespace[1];all=!namespace&&!event.exclusive;handlers=(jQuery.data(this,"events")||{})[event.type];for(var j in handlers){var handler=handlers[j];if(all||handler.type==namespace){event.handler=handler;event.data=handler.data;ret=handler.apply(this,arguments);if(val!==false)val=ret;if(ret===false){event.preventDefault();event.stopPropagation();}}}return val;},fix:function(event){if(event[expando]==true)return event;var originalEvent=event;event={originalEvent:originalEvent};var props="altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target timeStamp toElement type view wheelDelta which".split(" ");for(var i=props.length;i;i--)event[props[i]]=originalEvent[props[i]];event[expando]=true;event.preventDefault=function(){if(originalEvent.preventDefault)originalEvent.preventDefault();originalEvent.returnValue=false;};event.stopPropagation=function(){if(originalEvent.stopPropagation)originalEvent.stopPropagation();originalEvent.cancelBubble=true;};event.timeStamp=event.timeStamp||now();if(!event.target)event.target=event.srcElement||document;if(event.target.nodeType==3)event.target=event.target.parentNode;if(!event.relatedTarget&&event.fromElement)event.relatedTarget=event.fromElement==event.target?event.toElement:event.fromElement;if(event.pageX==null&&event.clientX!=null){var doc=document.documentElement,body=document.body;event.pageX=event.clientX+(doc&&doc.scrollLeft||body&&body.scrollLeft||0)-(doc.clientLeft||0);event.pageY=event.clientY+(doc&&doc.scrollTop||body&&body.scrollTop||0)-(doc.clientTop||0);}if(!event.which&&((event.charCode||event.charCode===0)?event.charCode:event.keyCode))event.which=event.charCode||event.keyCode;if(!event.metaKey&&event.ctrlKey)event.metaKey=event.ctrlKey;if(!event.which&&event.button)event.which=(event.button&1?1:(event.button&2?3:(event.button&4?2:0)));return event;},proxy:function(fn,proxy){proxy.guid=fn.guid=fn.guid||proxy.guid||this.guid++;return proxy;},special:{ready:{setup:function(){bindReady();return;},teardown:function(){return;}},mouseenter:{setup:function(){if(jQuery.browser.msie)return false;jQuery(this).bind("mouseover",jQuery.event.special.mouseenter.handler);return true;},teardown:function(){if(jQuery.browser.msie)return false;jQuery(this).unbind("mouseover",jQuery.event.special.mouseenter.handler);return true;},handler:function(event){if(withinElement(event,this))return true;event.type="mouseenter";return jQuery.event.handle.apply(this,arguments);}},mouseleave:{setup:function(){if(jQuery.browser.msie)return false;jQuery(this).bind("mouseout",jQuery.event.special.mouseleave.handler);return true;},teardown:function(){if(jQuery.browser.msie)return false;jQuery(this).unbind("mouseout",jQuery.event.special.mouseleave.handler);return true;},handler:function(event){if(withinElement(event,this))return true;event.type="mouseleave";return jQuery.event.handle.apply(this,arguments);}}}};jQuery.fn.extend({bind:function(type,data,fn){return type=="unload"?this.one(type,data,fn):this.each(function(){jQuery.event.add(this,type,fn||data,fn&&data);});},one:function(type,data,fn){var one=jQuery.event.proxy(fn||data,function(event){jQuery(this).unbind(event,one);return(fn||data).apply(this,arguments);});return this.each(function(){jQuery.event.add(this,type,one,fn&&data);});},unbind:function(type,fn){return this.each(function(){jQuery.event.remove(this,type,fn);});},trigger:function(type,data,fn){return this.each(function(){jQuery.event.trigger(type,data,this,true,fn);});},triggerHandler:function(type,data,fn){return this[0]&&jQuery.event.trigger(type,data,this[0],false,fn);},toggle:function(fn){var args=arguments,i=1;while(i<args.length)jQuery.event.proxy(fn,args[i++]);return this.click(jQuery.event.proxy(fn,function(event){this.lastToggle=(this.lastToggle||0)%i;event.preventDefault();return args[this.lastToggle++].apply(this,arguments)||false;}));},hover:function(fnOver,fnOut){return this.bind('mouseenter',fnOver).bind('mouseleave',fnOut);},ready:function(fn){bindReady();if(jQuery.isReady)fn.call(document,jQuery);else
jQuery.readyList.push(function(){return fn.call(this,jQuery);});return this;}});jQuery.extend({isReady:false,readyList:[],ready:function(){if(!jQuery.isReady){jQuery.isReady=true;if(jQuery.readyList){jQuery.each(jQuery.readyList,function(){this.call(document);});jQuery.readyList=null;}jQuery(document).triggerHandler("ready");}}});var readyBound=false;function bindReady(){if(readyBound)return;readyBound=true;if(document.addEventListener&&!jQuery.browser.opera)document.addEventListener("DOMContentLoaded",jQuery.ready,false);if(jQuery.browser.msie&&window==top)(function(){if(jQuery.isReady)return;try{document.documentElement.doScroll("left");}catch(error){setTimeout(arguments.callee,0);return;}jQuery.ready();})();if(jQuery.browser.opera)document.addEventListener("DOMContentLoaded",function(){if(jQuery.isReady)return;for(var i=0;i<document.styleSheets.length;i++)if(document.styleSheets[i].disabled){setTimeout(arguments.callee,0);return;}jQuery.ready();},false);if(jQuery.browser.safari){var numStyles;(function(){if(jQuery.isReady)return;if(document.readyState!="loaded"&&document.readyState!="complete"){setTimeout(arguments.callee,0);return;}if(numStyles===undefined)numStyles=jQuery("style, link[rel=stylesheet]").length;if(document.styleSheets.length!=numStyles){setTimeout(arguments.callee,0);return;}jQuery.ready();})();}jQuery.event.add(window,"load",jQuery.ready);}jQuery.each(("blur,focus,load,resize,scroll,unload,click,dblclick,"+"mousedown,mouseup,mousemove,mouseover,mouseout,change,select,"+"submit,keydown,keypress,keyup,error").split(","),function(i,name){jQuery.fn[name]=function(fn){return fn?this.bind(name,fn):this.trigger(name);};});var withinElement=function(event,elem){var parent=event.relatedTarget;while(parent&&parent!=elem)try{parent=parent.parentNode;}catch(error){parent=elem;}return parent==elem;};jQuery(window).bind("unload",function(){jQuery("*").add(document).unbind();});jQuery.fn.extend({_load:jQuery.fn.load,load:function(url,params,callback){if(typeof url!='string')return this._load(url);var off=url.indexOf(" ");if(off>=0){var selector=url.slice(off,url.length);url=url.slice(0,off);}callback=callback||function(){};var type="GET";if(params)if(jQuery.isFunction(params)){callback=params;params=null;}else{params=jQuery.param(params);type="POST";}var self=this;jQuery.ajax({url:url,type:type,dataType:"html",data:params,complete:function(res,status){if(status=="success"||status=="notmodified")self.html(selector?jQuery("<div/>").append(res.responseText.replace(/<script(.|\s)*?\/script>/g,"")).find(selector):res.responseText);self.each(callback,[res.responseText,status,res]);}});return this;},serialize:function(){return jQuery.param(this.serializeArray());},serializeArray:function(){return this.map(function(){return jQuery.nodeName(this,"form")?jQuery.makeArray(this.elements):this;}).filter(function(){return this.name&&!this.disabled&&(this.checked||/select|textarea/i.test(this.nodeName)||/text|hidden|password/i.test(this.type));}).map(function(i,elem){var val=jQuery(this).val();return val==null?null:val.constructor==Array?jQuery.map(val,function(val,i){return{name:elem.name,value:val};}):{name:elem.name,value:val};}).get();}});jQuery.each("ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","),function(i,o){jQuery.fn[o]=function(f){return this.bind(o,f);};});var jsc=now();jQuery.extend({get:function(url,data,callback,type){if(jQuery.isFunction(data)){callback=data;data=null;}return jQuery.ajax({type:"GET",url:url,data:data,success:callback,dataType:type});},getScript:function(url,callback){return jQuery.get(url,null,callback,"script");},getJSON:function(url,data,callback){return jQuery.get(url,data,callback,"json");},post:function(url,data,callback,type){if(jQuery.isFunction(data)){callback=data;data={};}return jQuery.ajax({type:"POST",url:url,data:data,success:callback,dataType:type});},ajaxSetup:function(settings){jQuery.extend(jQuery.ajaxSettings,settings);},ajaxSettings:{url:location.href,global:true,type:"GET",timeout:0,contentType:"application/x-www-form-urlencoded",processData:true,async:true,data:null,username:null,password:null,accepts:{xml:"application/xml, text/xml",html:"text/html",script:"text/javascript, application/javascript",json:"application/json, text/javascript",text:"text/plain",_default:"*/*"}},lastModified:{},ajax:function(s){s=jQuery.extend(true,s,jQuery.extend(true,{},jQuery.ajaxSettings,s));var jsonp,jsre=/=\?(&|$)/g,status,data,type=s.type.toUpperCase();if(s.data&&s.processData&&typeof s.data!="string")s.data=jQuery.param(s.data);if(s.dataType=="jsonp"){if(type=="GET"){if(!s.url.match(jsre))s.url+=(s.url.match(/\?/)?"&":"?")+(s.jsonp||"callback")+"=?";}else if(!s.data||!s.data.match(jsre))s.data=(s.data?s.data+"&":"")+(s.jsonp||"callback")+"=?";s.dataType="json";}if(s.dataType=="json"&&(s.data&&s.data.match(jsre)||s.url.match(jsre))){jsonp="jsonp"+jsc++;if(s.data)s.data=(s.data+"").replace(jsre,"="+jsonp+"$1");s.url=s.url.replace(jsre,"="+jsonp+"$1");s.dataType="script";window[jsonp]=function(tmp){data=tmp;success();complete();window[jsonp]=undefined;try{delete window[jsonp];}catch(e){}if(head)head.removeChild(script);};}if(s.dataType=="script"&&s.cache==null)s.cache=false;if(s.cache===false&&type=="GET"){var ts=now();var ret=s.url.replace(/(\?|&)_=.*?(&|$)/,"$1_="+ts+"$2");s.url=ret+((ret==s.url)?(s.url.match(/\?/)?"&":"?")+"_="+ts:"");}if(s.data&&type=="GET"){s.url+=(s.url.match(/\?/)?"&":"?")+s.data;s.data=null;}if(s.global&&!jQuery.active++)jQuery.event.trigger("ajaxStart");var remote=/^(?:\w+:)?\/\/([^\/?#]+)/;if(s.dataType=="script"&&type=="GET"&&remote.test(s.url)&&remote.exec(s.url)[1]!=location.host){var head=document.getElementsByTagName("head")[0];var script=document.createElement("script");script.src=s.url;if(s.scriptCharset)script.charset=s.scriptCharset;if(!jsonp){var done=false;script.onload=script.onreadystatechange=function(){if(!done&&(!this.readyState||this.readyState=="loaded"||this.readyState=="complete")){done=true;success();complete();head.removeChild(script);}};}head.appendChild(script);return undefined;}var requestDone=false;var xhr=window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):new XMLHttpRequest();if(s.username)xhr.open(type,s.url,s.async,s.username,s.password);else
xhr.open(type,s.url,s.async);try{if(s.data)xhr.setRequestHeader("Content-Type",s.contentType);if(s.ifModified)xhr.setRequestHeader("If-Modified-Since",jQuery.lastModified[s.url]||"Thu, 01 Jan 1970 00:00:00 GMT");xhr.setRequestHeader("X-Requested-With","XMLHttpRequest");xhr.setRequestHeader("Accept",s.dataType&&s.accepts[s.dataType]?s.accepts[s.dataType]+", */*":s.accepts._default);}catch(e){}if(s.beforeSend&&s.beforeSend(xhr,s)===false){s.global&&jQuery.active--;xhr.abort();return false;}if(s.global)jQuery.event.trigger("ajaxSend",[xhr,s]);var onreadystatechange=function(isTimeout){if(!requestDone&&xhr&&(xhr.readyState==4||isTimeout=="timeout")){requestDone=true;if(ival){clearInterval(ival);ival=null;}status=isTimeout=="timeout"&&"timeout"||!jQuery.httpSuccess(xhr)&&"error"||s.ifModified&&jQuery.httpNotModified(xhr,s.url)&&"notmodified"||"success";if(status=="success"){try{data=jQuery.httpData(xhr,s.dataType,s.dataFilter);}catch(e){status="parsererror";}}if(status=="success"){var modRes;try{modRes=xhr.getResponseHeader("Last-Modified");}catch(e){}if(s.ifModified&&modRes)jQuery.lastModified[s.url]=modRes;if(!jsonp)success();}else
jQuery.handleError(s,xhr,status);complete();if(s.async)xhr=null;}};if(s.async){var ival=setInterval(onreadystatechange,13);if(s.timeout>0)setTimeout(function(){if(xhr){xhr.abort();if(!requestDone)onreadystatechange("timeout");}},s.timeout);}try{xhr.send(s.data);}catch(e){jQuery.handleError(s,xhr,null,e);}if(!s.async)onreadystatechange();function success(){if(s.success)s.success(data,status);if(s.global)jQuery.event.trigger("ajaxSuccess",[xhr,s]);}function complete(){if(s.complete)s.complete(xhr,status);if(s.global)jQuery.event.trigger("ajaxComplete",[xhr,s]);if(s.global&&!--jQuery.active)jQuery.event.trigger("ajaxStop");}return xhr;},handleError:function(s,xhr,status,e){if(s.error)s.error(xhr,status,e);if(s.global)jQuery.event.trigger("ajaxError",[xhr,s,e]);},active:0,httpSuccess:function(xhr){try{return!xhr.status&&location.protocol=="file:"||(xhr.status>=200&&xhr.status<300)||xhr.status==304||xhr.status==1223||jQuery.browser.safari&&xhr.status==undefined;}catch(e){}return false;},httpNotModified:function(xhr,url){try{var xhrRes=xhr.getResponseHeader("Last-Modified");return xhr.status==304||xhrRes==jQuery.lastModified[url]||jQuery.browser.safari&&xhr.status==undefined;}catch(e){}return false;},httpData:function(xhr,type,filter){var ct=xhr.getResponseHeader("content-type"),xml=type=="xml"||!type&&ct&&ct.indexOf("xml")>=0,data=xml?xhr.responseXML:xhr.responseText;if(xml&&data.documentElement.tagName=="parsererror")throw"parsererror";if(filter)data=filter(data,type);if(type=="script")jQuery.globalEval(data);if(type=="json")data=eval("("+data+")");return data;},param:function(a){var s=[];if(a.constructor==Array||a.jquery)jQuery.each(a,function(){s.push(encodeURIComponent(this.name)+"="+encodeURIComponent(this.value));});else
for(var j in a)if(a[j]&&a[j].constructor==Array)jQuery.each(a[j],function(){s.push(encodeURIComponent(j)+"="+encodeURIComponent(this));});else
s.push(encodeURIComponent(j)+"="+encodeURIComponent(jQuery.isFunction(a[j])?a[j]():a[j]));return s.join("&").replace(/%20/g,"+");}});jQuery.fn.extend({show:function(speed,callback){return speed?this.animate({height:"show",width:"show",opacity:"show"},speed,callback):this.filter(":hidden").each(function(){this.style.display=this.oldblock||"";if(jQuery.css(this,"display")=="none"){var elem=jQuery("<"+this.tagName+" />").appendTo("body");this.style.display=elem.css("display");if(this.style.display=="none")this.style.display="block";elem.remove();}}).end();},hide:function(speed,callback){return speed?this.animate({height:"hide",width:"hide",opacity:"hide"},speed,callback):this.filter(":visible").each(function(){this.oldblock=this.oldblock||jQuery.css(this,"display");this.style.display="none";}).end();},_toggle:jQuery.fn.toggle,toggle:function(fn,fn2){return jQuery.isFunction(fn)&&jQuery.isFunction(fn2)?this._toggle.apply(this,arguments):fn?this.animate({height:"toggle",width:"toggle",opacity:"toggle"},fn,fn2):this.each(function(){jQuery(this)[jQuery(this).is(":hidden")?"show":"hide"]();});},slideDown:function(speed,callback){return this.animate({height:"show"},speed,callback);},slideUp:function(speed,callback){return this.animate({height:"hide"},speed,callback);},slideToggle:function(speed,callback){return this.animate({height:"toggle"},speed,callback);},fadeIn:function(speed,callback){return this.animate({opacity:"show"},speed,callback);},fadeOut:function(speed,callback){return this.animate({opacity:"hide"},speed,callback);},fadeTo:function(speed,to,callback){return this.animate({opacity:to},speed,callback);},animate:function(prop,speed,easing,callback){var optall=jQuery.speed(speed,easing,callback);return this[optall.queue===false?"each":"queue"](function(){if(this.nodeType!=1)return false;var opt=jQuery.extend({},optall),p,hidden=jQuery(this).is(":hidden"),self=this;for(p in prop){if(prop[p]=="hide"&&hidden||prop[p]=="show"&&!hidden)return opt.complete.call(this);if(p=="height"||p=="width"){opt.display=jQuery.css(this,"display");opt.overflow=this.style.overflow;}}if(opt.overflow!=null)this.style.overflow="hidden";opt.curAnim=jQuery.extend({},prop);jQuery.each(prop,function(name,val){var e=new jQuery.fx(self,opt,name);if(/toggle|show|hide/.test(val))e[val=="toggle"?hidden?"show":"hide":val](prop);else{var parts=val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),start=e.cur(true)||0;if(parts){var end=parseFloat(parts[2]),unit=parts[3]||"px";if(unit!="px"){self.style[name]=(end||1)+unit;start=((end||1)/e.cur(true))*start;self.style[name]=start+unit;}if(parts[1])end=((parts[1]=="-="?-1:1)*end)+start;e.custom(start,end,unit);}else
e.custom(start,val,"");}});return true;});},queue:function(type,fn){if(jQuery.isFunction(type)||(type&&type.constructor==Array)){fn=type;type="fx";}if(!type||(typeof type=="string"&&!fn))return queue(this[0],type);return this.each(function(){if(fn.constructor==Array)queue(this,type,fn);else{queue(this,type).push(fn);if(queue(this,type).length==1)fn.call(this);}});},stop:function(clearQueue,gotoEnd){var timers=jQuery.timers;if(clearQueue)this.queue([]);this.each(function(){for(var i=timers.length-1;i>=0;i--)if(timers[i].elem==this){if(gotoEnd)timers[i](true);timers.splice(i,1);}});if(!gotoEnd)this.dequeue();return this;}});var queue=function(elem,type,array){if(elem){type=type||"fx";var q=jQuery.data(elem,type+"queue");if(!q||array)q=jQuery.data(elem,type+"queue",jQuery.makeArray(array));}return q;};jQuery.fn.dequeue=function(type){type=type||"fx";return this.each(function(){var q=queue(this,type);q.shift();if(q.length)q[0].call(this);});};jQuery.extend({speed:function(speed,easing,fn){var opt=speed&&speed.constructor==Object?speed:{complete:fn||!fn&&easing||jQuery.isFunction(speed)&&speed,duration:speed,easing:fn&&easing||easing&&easing.constructor!=Function&&easing};opt.duration=(opt.duration&&opt.duration.constructor==Number?opt.duration:jQuery.fx.speeds[opt.duration])||jQuery.fx.speeds.def;opt.old=opt.complete;opt.complete=function(){if(opt.queue!==false)jQuery(this).dequeue();if(jQuery.isFunction(opt.old))opt.old.call(this);};return opt;},easing:{linear:function(p,n,firstNum,diff){return firstNum+diff*p;},swing:function(p,n,firstNum,diff){return((-Math.cos(p*Math.PI)/2)+0.5)*diff+firstNum;}},timers:[],timerId:null,fx:function(elem,options,prop){this.options=options;this.elem=elem;this.prop=prop;if(!options.orig)options.orig={};}});jQuery.fx.prototype={update:function(){if(this.options.step)this.options.step.call(this.elem,this.now,this);(jQuery.fx.step[this.prop]||jQuery.fx.step._default)(this);if(this.prop=="height"||this.prop=="width")this.elem.style.display="block";},cur:function(force){if(this.elem[this.prop]!=null&&this.elem.style[this.prop]==null)return this.elem[this.prop];var r=parseFloat(jQuery.css(this.elem,this.prop,force));return r&&r>-10000?r:parseFloat(jQuery.curCSS(this.elem,this.prop))||0;},custom:function(from,to,unit){this.startTime=now();this.start=from;this.end=to;this.unit=unit||this.unit||"px";this.now=this.start;this.pos=this.state=0;this.update();var self=this;function t(gotoEnd){return self.step(gotoEnd);}t.elem=this.elem;jQuery.timers.push(t);if(jQuery.timerId==null){jQuery.timerId=setInterval(function(){var timers=jQuery.timers;for(var i=0;i<timers.length;i++)if(!timers[i]())timers.splice(i--,1);if(!timers.length){clearInterval(jQuery.timerId);jQuery.timerId=null;}},13);}},show:function(){this.options.orig[this.prop]=jQuery.attr(this.elem.style,this.prop);this.options.show=true;this.custom(0,this.cur());if(this.prop=="width"||this.prop=="height")this.elem.style[this.prop]="1px";jQuery(this.elem).show();},hide:function(){this.options.orig[this.prop]=jQuery.attr(this.elem.style,this.prop);this.options.hide=true;this.custom(this.cur(),0);},step:function(gotoEnd){var t=now();if(gotoEnd||t>this.options.duration+this.startTime){this.now=this.end;this.pos=this.state=1;this.update();this.options.curAnim[this.prop]=true;var done=true;for(var i in this.options.curAnim)if(this.options.curAnim[i]!==true)done=false;if(done){if(this.options.display!=null){this.elem.style.overflow=this.options.overflow;this.elem.style.display=this.options.display;if(jQuery.css(this.elem,"display")=="none")this.elem.style.display="block";}if(this.options.hide)this.elem.style.display="none";if(this.options.hide||this.options.show)for(var p in this.options.curAnim)jQuery.attr(this.elem.style,p,this.options.orig[p]);}if(done)this.options.complete.call(this.elem);return false;}else{var n=t-this.startTime;this.state=n/this.options.duration;this.pos=jQuery.easing[this.options.easing||(jQuery.easing.swing?"swing":"linear")](this.state,n,0,1,this.options.duration);this.now=this.start+((this.end-this.start)*this.pos);this.update();}return true;}};jQuery.extend(jQuery.fx,{speeds:{slow:600,fast:200,def:400},step:{scrollLeft:function(fx){fx.elem.scrollLeft=fx.now;},scrollTop:function(fx){fx.elem.scrollTop=fx.now;},opacity:function(fx){jQuery.attr(fx.elem.style,"opacity",fx.now);},_default:function(fx){fx.elem.style[fx.prop]=fx.now+fx.unit;}}});jQuery.fn.offset=function(){var left=0,top=0,elem=this[0],results;if(elem)with(jQuery.browser){var parent=elem.parentNode,offsetChild=elem,offsetParent=elem.offsetParent,doc=elem.ownerDocument,safari2=safari&&parseInt(version)<522&&!/adobeair/i.test(userAgent),css=jQuery.curCSS,fixed=css(elem,"position")=="fixed";if(elem.getBoundingClientRect){var box=elem.getBoundingClientRect();add(box.left+Math.max(doc.documentElement.scrollLeft,doc.body.scrollLeft),box.top+Math.max(doc.documentElement.scrollTop,doc.body.scrollTop));add(-doc.documentElement.clientLeft,-doc.documentElement.clientTop);}else{add(elem.offsetLeft,elem.offsetTop);while(offsetParent){add(offsetParent.offsetLeft,offsetParent.offsetTop);if(mozilla&&!/^t(able|d|h)$/i.test(offsetParent.tagName)||safari&&!safari2)border(offsetParent);if(!fixed&&css(offsetParent,"position")=="fixed")fixed=true;offsetChild=/^body$/i.test(offsetParent.tagName)?offsetChild:offsetParent;offsetParent=offsetParent.offsetParent;}while(parent&&parent.tagName&&!/^body|html$/i.test(parent.tagName)){if(!/^inline|table.*$/i.test(css(parent,"display")))add(-parent.scrollLeft,-parent.scrollTop);if(mozilla&&css(parent,"overflow")!="visible")border(parent);parent=parent.parentNode;}if((safari2&&(fixed||css(offsetChild,"position")=="absolute"))||(mozilla&&css(offsetChild,"position")!="absolute"))add(-doc.body.offsetLeft,-doc.body.offsetTop);if(fixed)add(Math.max(doc.documentElement.scrollLeft,doc.body.scrollLeft),Math.max(doc.documentElement.scrollTop,doc.body.scrollTop));}results={top:top,left:left};}function border(elem){add(jQuery.curCSS(elem,"borderLeftWidth",true),jQuery.curCSS(elem,"borderTopWidth",true));}function add(l,t){left+=parseInt(l,10)||0;top+=parseInt(t,10)||0;}return results;};jQuery.fn.extend({position:function(){var left=0,top=0,results;if(this[0]){var offsetParent=this.offsetParent(),offset=this.offset(),parentOffset=/^body|html$/i.test(offsetParent[0].tagName)?{top:0,left:0}:offsetParent.offset();offset.top-=num(this,'marginTop');offset.left-=num(this,'marginLeft');parentOffset.top+=num(offsetParent,'borderTopWidth');parentOffset.left+=num(offsetParent,'borderLeftWidth');results={top:offset.top-parentOffset.top,left:offset.left-parentOffset.left};}return results;},offsetParent:function(){var offsetParent=this[0].offsetParent;while(offsetParent&&(!/^body|html$/i.test(offsetParent.tagName)&&jQuery.css(offsetParent,'position')=='static'))offsetParent=offsetParent.offsetParent;return jQuery(offsetParent);}});jQuery.each(['Left','Top'],function(i,name){var method='scroll'+name;jQuery.fn[method]=function(val){if(!this[0])return;return val!=undefined?this.each(function(){this==window||this==document?window.scrollTo(!i?val:jQuery(window).scrollLeft(),i?val:jQuery(window).scrollTop()):this[method]=val;}):this[0]==window||this[0]==document?self[i?'pageYOffset':'pageXOffset']||jQuery.boxModel&&document.documentElement[method]||document.body[method]:this[0][method];};});jQuery.each(["Height","Width"],function(i,name){var tl=i?"Left":"Top",br=i?"Right":"Bottom";jQuery.fn["inner"+name]=function(){return this[name.toLowerCase()]()+num(this,"padding"+tl)+num(this,"padding"+br);};jQuery.fn["outer"+name]=function(margin){return this["inner"+name]()+num(this,"border"+tl+"Width")+num(this,"border"+br+"Width")+(margin?num(this,"margin"+tl)+num(this,"margin"+br):0);};});})();/* -------------------------------------------------- *
 * JQuery Hints
 * -------------------------------------------------- *
 * Author: Ross Riley
 * License: MIT License
** -------------------------------------------------- */

(function($) {
	$.fn.hint = function(defaults) {
		// check whether we want real options, or to destroy functionality
		if(!defaults || typeof(defaults) == "object") {
			defaults = $.extend({
				focus_class: "hint_focus", // class during focus
				changed_class: "hint_changed", // class after focus
				populate_from: "default", // choose from: default, label, custom, or alt
				text: null, // text to use in conjunction with populate_from: custom
				remove_labels: false // remove labels associated with the fields
			}, defaults);
		}
		else if(typeof(defaults) == "string" && defaults.toLowerCase() == "destroy") {
			var destroy = true;
		}
		return this.each(function() {
			// unbind everything if we're destroying, and stop executing the script
			if(destroy) {
			  $(this).unbind("focus.hint").unbind("blur.hint").removeData("defText");
				return false;
			}
		  hint_setup($(this));
		});
	  function hint_setup(ele){ 
	    // define our variables
			var defText = "";

			// let's populate the text, if not default
			switch(defaults.populate_from) {
				case "alt":
					defText = ele.attr("alt");
					ele.val(defText);
					break;
				case "label":
					defText = $("label[for='" + ele.attr("id") + "']").text();
					ele.val(defText);
					break;
				case "custom":
					defText = defaults.text;
					ele.val(defText);
					break;
				default:
					defText = ele.val();
			}

			// let's give this field a special class, so we can identify it later
			// also, we'll give it a data attribute, which will help jQuery remember what the default value is
			ele.addClass("hint").data("defText", defText);

			// now that fields are populated, let's remove the labels if applicable
			if(defaults.remove_labels == true) { $("label[for='" + ele.attr("id") + "']").remove(); }
			
			// Handles password fields by creating a clone that's a text field.
			if(ele.attr("type")=="password") {
			  var eledef = ele.data("defText");
			  var el = ele.clone().data("defType", "password").data("defText", eledef).attr("type", "text");
        ele.after(el).remove();
        var ele = el;
		  }
			hint_focus(ele);
			hint_blur(ele);
	  };
	  function hint_focus(ele){ 
	    ele.bind("focus.hint",function(){
	      if(ele.val() == ele.data("defText")) { ele.val(""); }
				// add the focus class, remove changed_class
				ele.addClass(defaults.focus_class).removeClass(defaults.changed_class);
	      if(ele.data("defType")=="password") {
	        var eledef = ele.data("defText");
  			  var el = ele.clone().data("defText", eledef).data("defType","password").attr("type", "password");
          ele.after(el).remove();
          hint_blur(el);
          el.eq(0).focus();
  			}
			});
	  };
	  function hint_blur(ele){ 
	    ele.bind("blur.hint",function(){
	      if(ele.val() == "") { ele.val(ele.data("defText")); }
				// remove focus_class, add changed_class.
				ele.removeClass(defaults.focus_class);
				if(ele.val() != ele.data("defText")) { ele.addClass(defaults.changed_class); }
					else { ele.removeClass(defaults.changed_class); }
				if(ele.data("defType")=="password" && ele.val()==ele.data("defText")) {
				  var eledef = ele.data("defText");
				  var el = ele.clone().data("defText", eledef).data("defType", "password").attr("type", "text");
          ele.after(el);
          ele.remove();
          hint_focus(el);
				}
	    });
	  };
	};
})(jQuery);jQuery.imgAreaSelect=function(img,options){var $area=jQuery('<div></div>'),$border1=jQuery('<div></div>'),$border2=jQuery('<div></div>'),$outLeft=jQuery('<div></div>'),$outTop=jQuery('<div></div>'),$outRight=jQuery('<div></div>'),$outBottom=jQuery('<div></div>'),left,top,imgOfs,imgWidth,imgHeight,parent,parOfs,parScroll,adjusted,zIndex=0,fixed,$p,startX,startY,moveX,moveY,resizeMargin=10,resize=[],V=0,H=1,d,aspectRatio,x1,x2,y1,y2,x,y,selection={x1:0,y1:0,x2:0,y2:0,width:0,height:0};var $a=$area.add($border1).add($border2);var $o=$outLeft.add($outTop).add($outRight).add($outBottom);function viewX(x){return x+imgOfs.left+parScroll.left-parOfs.left}function viewY(y){return y+imgOfs.top+parScroll.top-parOfs.top}function selX(x){return x-imgOfs.left-parScroll.left+parOfs.left}function selY(y){return y-imgOfs.top-parScroll.top+parOfs.top}function evX(event){return event.pageX+parScroll.left-parOfs.left}function evY(event){return event.pageY+parScroll.top-parOfs.top}function adjust(){imgOfs=jQuery(img).offset();imgWidth=jQuery(img).width();imgHeight=jQuery(img).height();if(jQuery(parent).is('body'))parOfs=parScroll={left:0,top:0};else{parOfs=jQuery(parent).offset();parScroll={left:parent.scrollLeft,top:parent.scrollTop}}left=viewX(0);top=viewY(0)}function update(){$a.css({left:viewX(selection.x1)+'px',top:viewY(selection.y1)+'px',width:Math.max(selection.width-options.borderWidth*2,0)+'px',height:Math.max(selection.height-options.borderWidth*2,0)+'px'});$outLeft.css({left:left+'px',top:top+'px',width:selection.x1+'px',height:imgHeight+'px'});$outTop.css({left:left+selection.x1+'px',top:top+'px',width:selection.width+'px',height:selection.y1+'px'});$outRight.css({left:left+selection.x2+'px',top:top+'px',width:imgWidth-selection.x2+'px',height:imgHeight+'px'});$outBottom.css({left:left+selection.x1+'px',top:top+selection.y2+'px',width:selection.width+'px',height:imgHeight-selection.y2+'px'})}function areaMouseMove(event){if(!adjusted){adjust();adjusted=true;$a.one('mouseout',function(){adjusted=false})}x=selX(evX(event))-selection.x1;y=selY(evY(event))-selection.y1;resize=[];if(options.resizable){if(y<=resizeMargin)resize[V]='n';else if(y>=selection.height-resizeMargin)resize[V]='s';if(x<=resizeMargin)resize[H]='w';else if(x>=selection.width-resizeMargin)resize[H]='e'}$border2.css('cursor',resize.length?resize.join('')+'-resize':options.movable?'move':'')}function areaMouseDown(event){if(event.which!=1)return false;adjust();if(options.resizable&&resize.length>0){jQuery('body').css('cursor',resize.join('')+'-resize');x1=viewX(resize[H]=='w'?selection.x2:selection.x1);y1=viewY(resize[V]=='n'?selection.y2:selection.y1);jQuery(document).mousemove(selectingMouseMove);$border2.unbind('mousemove',areaMouseMove);jQuery(document).one('mouseup',function(){resize=[];jQuery('body').css('cursor','');if(options.autoHide)$a.add($o).hide();options.onSelectEnd(img,selection);jQuery(document).unbind('mousemove',selectingMouseMove);$border2.mousemove(areaMouseMove)})}else if(options.movable){moveX=selection.x1+left;moveY=selection.y1+top;startX=evX(event);startY=evY(event);jQuery(document).mousemove(movingMouseMove).one('mouseup',function(){options.onSelectEnd(img,selection);jQuery(document).unbind('mousemove',movingMouseMove)})}else jQuery(img).mousedown(event);return false}function aspectRatioXY(){x2=Math.max(left,Math.min(left+imgWidth,x1+Math.abs(y2-y1)*aspectRatio*(x2>x1?1:-1)));y2=Math.round(Math.max(top,Math.min(top+imgHeight,y1+Math.abs(x2-x1)/aspectRatio*(y2>y1?1:-1))));x2=Math.round(x2)}function aspectRatioYX(){y2=Math.max(top,Math.min(top+imgHeight,y1+Math.abs(x2-x1)/aspectRatio*(y2>y1?1:-1)));x2=Math.round(Math.max(left,Math.min(left+imgWidth,x1+Math.abs(y2-y1)*aspectRatio*(x2>x1?1:-1))));y2=Math.round(y2)}function selectingMouseMove(event){x2=!resize.length||resize[H]||aspectRatio?evX(event):viewX(selection.x2);y2=!resize.length||resize[V]||aspectRatio?evY(event):viewY(selection.y2);if(options.minWidth&&Math.abs(x2-x1)<options.minWidth){x2=x1-options.minWidth*(x2<x1?1:-1);if(x2<left)x1=left+options.minWidth;else if(x2>left+imgWidth)x1=left+imgWidth-options.minWidth}if(options.minHeight&&Math.abs(y2-y1)<options.minHeight){y2=y1-options.minHeight*(y2<y1?1:-1);if(y2<top)y1=top+options.minHeight;else if(y2>top+imgHeight)y1=top+imgHeight-options.minHeight}x2=Math.max(left,Math.min(x2,left+imgWidth));y2=Math.max(top,Math.min(y2,top+imgHeight));if(aspectRatio)if(Math.abs(x2-x1)/aspectRatio>Math.abs(y2-y1))aspectRatioYX();else aspectRatioXY();if(options.maxWidth&&Math.abs(x2-x1)>options.maxWidth){x2=x1-options.maxWidth*(x2<x1?1:-1);if(aspectRatio)aspectRatioYX()}if(options.maxHeight&&Math.abs(y2-y1)>options.maxHeight){y2=y1-options.maxHeight*(y2<y1?1:-1);if(aspectRatio)aspectRatioXY()}selection.x1=selX(Math.min(x1,x2));selection.x2=selX(Math.max(x1,x2));selection.y1=selY(Math.min(y1,y2));selection.y2=selY(Math.max(y1,y2));selection.width=Math.abs(x2-x1);selection.height=Math.abs(y2-y1);update();options.onSelectChange(img,selection);return false}function movingMouseMove(event){x1=Math.max(left,Math.min(moveX+evX(event)-startX,left+imgWidth-selection.width));y1=Math.max(top,Math.min(moveY+evY(event)-startY,top+imgHeight-selection.height));x2=x1+selection.width;y2=y1+selection.height;selection.x1=selX(x1);selection.y1=selY(y1);selection.x2=selX(x2);selection.y2=selY(y2);update();options.onSelectChange(img,selection);event.preventDefault();return false}function imgMouseDown(event){if(event.which!=1)return false;adjust();selection.x1=selection.x2=selX(startX=x1=x2=evX(event));selection.y1=selection.y2=selY(startY=y1=y2=evY(event));selection.width=0;selection.height=0;resize=[];update();$a.add($o).show();jQuery(document).mousemove(selectingMouseMove);$border2.unbind('mousemove',areaMouseMove);options.onSelectStart(img,selection);jQuery(document).one('mouseup',function(){if(options.autoHide)$a.add($o).hide();options.onSelectEnd(img,selection);jQuery(document).unbind('mousemove',selectingMouseMove);$border2.mousemove(areaMouseMove)});return false}function windowResize(){adjust();update()}this.setOptions=function(newOptions){options=jQuery.extend(options,newOptions);if(newOptions.x1!=null){selection.x1=newOptions.x1;selection.y1=newOptions.y1;selection.x2=newOptions.x2;selection.y2=newOptions.y2;newOptions.show=true}parent=jQuery(options.parent).get(0);adjust();$p=jQuery(img);while($p.length&&!$p.is('body')){if(!isNaN($p.css('z-index'))&&$p.css('z-index')>zIndex)zIndex=$p.css('z-index');if($p.css('position')=='fixed')fixed=true;$p=$p.parent()}x1=viewX(selection.x1);y1=viewY(selection.y1);x2=viewX(selection.x2);y2=viewY(selection.y2);selection.width=x2-x1;selection.height=y2-y1;update();if(newOptions.hide)$a.add($o).hide();else if(newOptions.show)$a.add($o).show();$o.addClass(options.classPrefix+'-outer');$area.addClass(options.classPrefix+'-selection');$border1.addClass(options.classPrefix+'-border1');$border2.addClass(options.classPrefix+'-border2');$a.css({borderWidth:options.borderWidth+'px'});$area.css({backgroundColor:options.selectionColor,opacity:options.selectionOpacity});$border1.css({borderStyle:'solid',borderColor:options.borderColor1});$border2.css({borderStyle:'dashed',borderColor:options.borderColor2});$o.css({opacity:options.outerOpacity,backgroundColor:options.outerColor});aspectRatio=options.aspectRatio&&(d=options.aspectRatio.split(/:/))?d[0]/d[1]:null;if(options.disable||options.enable===false){$a.unbind('mousemove',areaMouseMove).unbind('mousedown',areaMouseDown);jQuery(img).add($o).unbind('mousedown',imgMouseDown);jQuery(window).unbind('resize',windowResize)}else if(options.enable||options.disable===false){if(options.resizable||options.movable)$a.mousemove(areaMouseMove).mousedown(areaMouseDown);jQuery(img).add($o).mousedown(imgMouseDown);jQuery(window).resize(windowResize)}jQuery(options.parent).append($o.add($a));options.enable=options.disable=undefined};if(jQuery.browser.msie)jQuery(img).attr('unselectable','on');$a.add($o).css({display:'none',position:fixed?'fixed':'absolute',overflow:'hidden',zIndex:zIndex>0?zIndex:null});$area.css({borderStyle:'solid'});initOptions={borderColor1:'#000',borderColor2:'#fff',borderWidth:1,classPrefix:'imgareaselect',movable:true,resizable:true,selectionColor:'#fff',selectionOpacity:0.2,outerColor:'#000',outerOpacity:0.2,parent:'body',onSelectStart:function(){},onSelectChange:function(){},onSelectEnd:function(){}};options=jQuery.extend(initOptions,options);this.setOptions(options)};jQuery.fn.imgAreaSelect=function(options){options=options||{};this.each(function(){if(jQuery(this).data('imgAreaSelect'))jQuery(this).data('imgAreaSelect').setOptions(options);else{if(options.enable===undefined&&options.disable===undefined)options.enable=true;jQuery(this).data('imgAreaSelect',new jQuery.imgAreaSelect(this,options))}});return this};
function show_preview_window(permalink, preview_pane){
  $('#'+preview_pane).jqm();
  $('#'+preview_pane).jqmShow();
  $('#'+preview_pane).html("<iframe src='"+permalink+"' width='100%' height='100%' border='0' />");
}

function setup_preview(l_permalink, trigger_id, l_preview_pane) {
  $(document).ready(function() {
    $('#'+trigger_id).click(function(){
      show_preview_window(l_permalink, l_preview_pane);
    });
  });
}



/* JS Table initialisation for index.html */
$(document).ready(function() {
  if($("#item_list_container").length) {
    $("#item_list_container").tablesorter({dateFormat: 'dd/mm/yyyy', highlightClass: 'highlight_col',
      stripingRowClass: ['item_row1','item_row0'],stripeRowsOnStartUp: true});
  }
  $(".form_datepicker").datepicker();
});


$(document).ready(function() {
	inline_status_change();	
});


function inline_status_change(){
	if($('.status_change').length){	
		$('.status_change').click(function(){
			current_status = $(this).attr('rel');
			dest = $(this).attr('href');
			dest = dest.replace('?status=0', '').replace('?status=1', '');
			replace = "#"+this.id;
			$.get(dest, {status: current_status, ajax:'yes'}, function(response){				
				$(replace).replaceWith(response);
				inline_status_change();
			});
			return false;
		});
	}
}


jQuery.fn.centerScreen = function(loaded) { 
  var obj = this; 
  if(!loaded) { 
    obj.css('top', $(window).height()/2-this.height()/2); 
    obj.css('left', $(window).width()/2-this.width()/2); 
    $(window).resize(function() { obj.centerScreen(!loaded); }); 
  } else { 
    obj.stop(); 
    obj.animate({ 
      top: $(window).height()/2-this.height()/2, 
      left: $(window).width()/2-this.width()/2}, 200, 'linear'); 
  } 
};
/**
 * SWFUpload: http://www.swfupload.org, http://swfupload.googlecode.com
 *
 * mmSWFUpload 1.0: Flash upload dialog - http://profandesign.se/swfupload/,  http://www.vinterwebb.se/
 *
 * SWFUpload is (c) 2006-2007 Lars Huring, Olov Nilzén and Mammon Media and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * SWFUpload 2 is (c) 2007-2008 Jake Roberts and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */


/* ******************* */
/* Constructor & Init  */
/* ******************* */
var SWFUpload;

if (SWFUpload == undefined) {
	SWFUpload = function (settings) {
		this.initSWFUpload(settings);
	};
}

SWFUpload.prototype.initSWFUpload = function (settings) {
	try {
		this.customSettings = {};	// A container where developers can place their own settings associated with this instance.
		this.settings = settings;
		this.eventQueue = [];
		this.movieName = "SWFUpload_" + SWFUpload.movieCount++;
		this.movieElement = null;


		// Setup global control tracking
		SWFUpload.instances[this.movieName] = this;

		// Load the settings.  Load the Flash movie.
		this.initSettings();
		this.loadFlash();
		this.displayDebugInfo();
	} catch (ex) {
		delete SWFUpload.instances[this.movieName];
		throw ex;
	}
};

/* *************** */
/* Static Members  */
/* *************** */
SWFUpload.instances = {};
SWFUpload.movieCount = 0;
SWFUpload.version = "2.2.0 2009-03-25";
SWFUpload.QUEUE_ERROR = {
	QUEUE_LIMIT_EXCEEDED	  		: -100,
	FILE_EXCEEDS_SIZE_LIMIT  		: -110,
	ZERO_BYTE_FILE			  		: -120,
	INVALID_FILETYPE		  		: -130
};
SWFUpload.UPLOAD_ERROR = {
	HTTP_ERROR				  		: -200,
	MISSING_UPLOAD_URL	      		: -210,
	IO_ERROR				  		: -220,
	SECURITY_ERROR			  		: -230,
	UPLOAD_LIMIT_EXCEEDED	  		: -240,
	UPLOAD_FAILED			  		: -250,
	SPECIFIED_FILE_ID_NOT_FOUND		: -260,
	FILE_VALIDATION_FAILED	  		: -270,
	FILE_CANCELLED			  		: -280,
	UPLOAD_STOPPED					: -290
};
SWFUpload.FILE_STATUS = {
	QUEUED		 : -1,
	IN_PROGRESS	 : -2,
	ERROR		 : -3,
	COMPLETE	 : -4,
	CANCELLED	 : -5
};
SWFUpload.BUTTON_ACTION = {
	SELECT_FILE  : -100,
	SELECT_FILES : -110,
	START_UPLOAD : -120
};
SWFUpload.CURSOR = {
	ARROW : -1,
	HAND : -2
};
SWFUpload.WINDOW_MODE = {
	WINDOW : "window",
	TRANSPARENT : "transparent",
	OPAQUE : "opaque"
};

// Private: takes a URL, determines if it is relative and converts to an absolute URL
// using the current site. Only processes the URL if it can, otherwise returns the URL untouched
SWFUpload.completeURL = function(url) {
	if (typeof(url) !== "string" || url.match(/^https?:\/\//i) || url.match(/^\//)) {
		return url;
	}
	
	var currentURL = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : "");
	
	var indexSlash = window.location.pathname.lastIndexOf("/");
	if (indexSlash <= 0) {
		path = "/";
	} else {
		path = window.location.pathname.substr(0, indexSlash) + "/";
	}
	
	return /*currentURL +*/ path + url;
	
};


/* ******************** */
/* Instance Members  */
/* ******************** */

// Private: initSettings ensures that all the
// settings are set, getting a default value if one was not assigned.
SWFUpload.prototype.initSettings = function () {
	this.ensureDefault = function (settingName, defaultValue) {
		this.settings[settingName] = (this.settings[settingName] == undefined) ? defaultValue : this.settings[settingName];
	};
	
	// Upload backend settings
	this.ensureDefault("upload_url", "");
	this.ensureDefault("preserve_relative_urls", false);
	this.ensureDefault("file_post_name", "Filedata");
	this.ensureDefault("post_params", {});
	this.ensureDefault("use_query_string", false);
	this.ensureDefault("requeue_on_error", false);
	this.ensureDefault("http_success", []);
	this.ensureDefault("assume_success_timeout", 0);
	
	// File Settings
	this.ensureDefault("file_types", "*.*");
	this.ensureDefault("file_types_description", "All Files");
	this.ensureDefault("file_size_limit", 0);	// Default zero means "unlimited"
	this.ensureDefault("file_upload_limit", 0);
	this.ensureDefault("file_queue_limit", 0);

	// Flash Settings
	this.ensureDefault("flash_url", "swfupload.swf");
	this.ensureDefault("prevent_swf_caching", true);
	
	// Button Settings
	this.ensureDefault("button_image_url", "");
	this.ensureDefault("button_width", 1);
	this.ensureDefault("button_height", 1);
	this.ensureDefault("button_text", "");
	this.ensureDefault("button_text_style", "color: #000000; font-size: 16pt;");
	this.ensureDefault("button_text_top_padding", 0);
	this.ensureDefault("button_text_left_padding", 0);
	this.ensureDefault("button_action", SWFUpload.BUTTON_ACTION.SELECT_FILES);
	this.ensureDefault("button_disabled", false);
	this.ensureDefault("button_placeholder_id", "");
	this.ensureDefault("button_placeholder", null);
	this.ensureDefault("button_cursor", SWFUpload.CURSOR.ARROW);
	this.ensureDefault("button_window_mode", SWFUpload.WINDOW_MODE.WINDOW);
	
	// Debug Settings
	this.ensureDefault("debug", false);
	this.settings.debug_enabled = this.settings.debug;	// Here to maintain v2 API
	
	// Event Handlers
	this.settings.return_upload_start_handler = this.returnUploadStart;
	this.ensureDefault("swfupload_loaded_handler", null);
	this.ensureDefault("file_dialog_start_handler", null);
	this.ensureDefault("file_queued_handler", null);
	this.ensureDefault("file_queue_error_handler", null);
	this.ensureDefault("file_dialog_complete_handler", null);
	
	this.ensureDefault("upload_start_handler", null);
	this.ensureDefault("upload_progress_handler", null);
	this.ensureDefault("upload_error_handler", null);
	this.ensureDefault("upload_success_handler", null);
	this.ensureDefault("upload_complete_handler", null);
	
	this.ensureDefault("debug_handler", this.debugMessage);

	this.ensureDefault("custom_settings", {});

	// Other settings
	this.customSettings = this.settings.custom_settings;
	
	// Update the flash url if needed
	if (!!this.settings.prevent_swf_caching) {
		this.settings.flash_url = this.settings.flash_url + (this.settings.flash_url.indexOf("?") < 0 ? "?" : "&") + "preventswfcaching=" + new Date().getTime();
	}
	
	if (!this.settings.preserve_relative_urls) {
		//this.settings.flash_url = SWFUpload.completeURL(this.settings.flash_url);	// Don't need to do this one since flash doesn't look at it
		this.settings.upload_url = SWFUpload.completeURL(this.settings.upload_url);
		this.settings.button_image_url = SWFUpload.completeURL(this.settings.button_image_url);
	}
	
	delete this.ensureDefault;
};

// Private: loadFlash replaces the button_placeholder element with the flash movie.
SWFUpload.prototype.loadFlash = function () {
	var targetElement, tempParent;

	// Make sure an element with the ID we are going to use doesn't already exist
	if (document.getElementById(this.movieName) !== null) {
		throw "ID " + this.movieName + " is already in use. The Flash Object could not be added";
	}

	// Get the element where we will be placing the flash movie
	targetElement = document.getElementById(this.settings.button_placeholder_id) || this.settings.button_placeholder;

	if (targetElement == undefined) {
		throw "Could not find the placeholder element: " + this.settings.button_placeholder_id;
	}

	// Append the container and load the flash
	tempParent = document.createElement("div");
	tempParent.innerHTML = this.getFlashHTML();	// Using innerHTML is non-standard but the only sensible way to dynamically add Flash in IE (and maybe other browsers)
	targetElement.parentNode.replaceChild(tempParent.firstChild, targetElement);

	// Fix IE Flash/Form bug
	if (window[this.movieName] == undefined) {
		window[this.movieName] = this.getMovieElement();
	}
	
};

// Private: getFlashHTML generates the object tag needed to embed the flash in to the document
SWFUpload.prototype.getFlashHTML = function () {
	// Flash Satay object syntax: http://www.alistapart.com/articles/flashsatay
	return ['<object id="', this.movieName, '" type="application/x-shockwave-flash" data="', this.settings.flash_url, '" width="', this.settings.button_width, '" height="', this.settings.button_height, '" class="swfupload">',
				'<param name="wmode" value="', this.settings.button_window_mode, '" />',
				'<param name="movie" value="', this.settings.flash_url, '" />',
				'<param name="quality" value="high" />',
				'<param name="menu" value="false" />',
				'<param name="allowScriptAccess" value="always" />',
				'<param name="flashvars" value="' + this.getFlashVars() + '" />',
				'</object>'].join("");
};

// Private: getFlashVars builds the parameter string that will be passed
// to flash in the flashvars param.
SWFUpload.prototype.getFlashVars = function () {
	// Build a string from the post param object
	var paramString = this.buildParamString();
	var httpSuccessString = this.settings.http_success.join(",");
	
	// Build the parameter string
	return ["movieName=", encodeURIComponent(this.movieName),
			"&amp;uploadURL=", encodeURIComponent(this.settings.upload_url),
			"&amp;useQueryString=", encodeURIComponent(this.settings.use_query_string),
			"&amp;requeueOnError=", encodeURIComponent(this.settings.requeue_on_error),
			"&amp;httpSuccess=", encodeURIComponent(httpSuccessString),
			"&amp;assumeSuccessTimeout=", encodeURIComponent(this.settings.assume_success_timeout),
			"&amp;params=", encodeURIComponent(paramString),
			"&amp;filePostName=", encodeURIComponent(this.settings.file_post_name),
			"&amp;fileTypes=", encodeURIComponent(this.settings.file_types),
			"&amp;fileTypesDescription=", encodeURIComponent(this.settings.file_types_description),
			"&amp;fileSizeLimit=", encodeURIComponent(this.settings.file_size_limit),
			"&amp;fileUploadLimit=", encodeURIComponent(this.settings.file_upload_limit),
			"&amp;fileQueueLimit=", encodeURIComponent(this.settings.file_queue_limit),
			"&amp;debugEnabled=", encodeURIComponent(this.settings.debug_enabled),
			"&amp;buttonImageURL=", encodeURIComponent(this.settings.button_image_url),
			"&amp;buttonWidth=", encodeURIComponent(this.settings.button_width),
			"&amp;buttonHeight=", encodeURIComponent(this.settings.button_height),
			"&amp;buttonText=", encodeURIComponent(this.settings.button_text),
			"&amp;buttonTextTopPadding=", encodeURIComponent(this.settings.button_text_top_padding),
			"&amp;buttonTextLeftPadding=", encodeURIComponent(this.settings.button_text_left_padding),
			"&amp;buttonTextStyle=", encodeURIComponent(this.settings.button_text_style),
			"&amp;buttonAction=", encodeURIComponent(this.settings.button_action),
			"&amp;buttonDisabled=", encodeURIComponent(this.settings.button_disabled),
			"&amp;buttonCursor=", encodeURIComponent(this.settings.button_cursor)
		].join("");
};

// Public: getMovieElement retrieves the DOM reference to the Flash element added by SWFUpload
// The element is cached after the first lookup
SWFUpload.prototype.getMovieElement = function () {
	if (this.movieElement == undefined) {
		this.movieElement = document.getElementById(this.movieName);
	}

	if (this.movieElement === null) {
		throw "Could not find Flash element";
	}
	
	return this.movieElement;
};

// Private: buildParamString takes the name/value pairs in the post_params setting object
// and joins them up in to a string formatted "name=value&amp;name=value"
SWFUpload.prototype.buildParamString = function () {
	var postParams = this.settings.post_params; 
	var paramStringPairs = [];

	if (typeof(postParams) === "object") {
		for (var name in postParams) {
			if (postParams.hasOwnProperty(name)) {
				paramStringPairs.push(encodeURIComponent(name.toString()) + "=" + encodeURIComponent(postParams[name].toString()));
			}
		}
	}

	return paramStringPairs.join("&amp;");
};

// Public: Used to remove a SWFUpload instance from the page. This method strives to remove
// all references to the SWF, and other objects so memory is properly freed.
// Returns true if everything was destroyed. Returns a false if a failure occurs leaving SWFUpload in an inconsistant state.
// Credits: Major improvements provided by steffen
SWFUpload.prototype.destroy = function () {
	try {
		// Make sure Flash is done before we try to remove it
		this.cancelUpload(null, false);
		

		// Remove the SWFUpload DOM nodes
		var movieElement = null;
		movieElement = this.getMovieElement();
		
		if (movieElement && typeof(movieElement.CallFunction) === "unknown") { // We only want to do this in IE
			// Loop through all the movie's properties and remove all function references (DOM/JS IE 6/7 memory leak workaround)
			for (var i in movieElement) {
				try {
					if (typeof(movieElement[i]) === "function") {
						movieElement[i] = null;
					}
				} catch (ex1) {}
			}

			// Remove the Movie Element from the page
			try {
				movieElement.parentNode.removeChild(movieElement);
			} catch (ex) {}
		}
		
		// Remove IE form fix reference
		window[this.movieName] = null;

		// Destroy other references
		SWFUpload.instances[this.movieName] = null;
		delete SWFUpload.instances[this.movieName];

		this.movieElement = null;
		this.settings = null;
		this.customSettings = null;
		this.eventQueue = null;
		this.movieName = null;
		
		
		return true;
	} catch (ex2) {
		return false;
	}
};


// Public: displayDebugInfo prints out settings and configuration
// information about this SWFUpload instance.
// This function (and any references to it) can be deleted when placing
// SWFUpload in production.
SWFUpload.prototype.displayDebugInfo = function () {
	this.debug(
		[
			"---SWFUpload Instance Info---\n",
			"Version: ", SWFUpload.version, "\n",
			"Movie Name: ", this.movieName, "\n",
			"Settings:\n",
			"\t", "upload_url:               ", this.settings.upload_url, "\n",
			"\t", "flash_url:                ", this.settings.flash_url, "\n",
			"\t", "use_query_string:         ", this.settings.use_query_string.toString(), "\n",
			"\t", "requeue_on_error:         ", this.settings.requeue_on_error.toString(), "\n",
			"\t", "http_success:             ", this.settings.http_success.join(", "), "\n",
			"\t", "assume_success_timeout:   ", this.settings.assume_success_timeout, "\n",
			"\t", "file_post_name:           ", this.settings.file_post_name, "\n",
			"\t", "post_params:              ", this.settings.post_params.toString(), "\n",
			"\t", "file_types:               ", this.settings.file_types, "\n",
			"\t", "file_types_description:   ", this.settings.file_types_description, "\n",
			"\t", "file_size_limit:          ", this.settings.file_size_limit, "\n",
			"\t", "file_upload_limit:        ", this.settings.file_upload_limit, "\n",
			"\t", "file_queue_limit:         ", this.settings.file_queue_limit, "\n",
			"\t", "debug:                    ", this.settings.debug.toString(), "\n",

			"\t", "prevent_swf_caching:      ", this.settings.prevent_swf_caching.toString(), "\n",

			"\t", "button_placeholder_id:    ", this.settings.button_placeholder_id.toString(), "\n",
			"\t", "button_placeholder:       ", (this.settings.button_placeholder ? "Set" : "Not Set"), "\n",
			"\t", "button_image_url:         ", this.settings.button_image_url.toString(), "\n",
			"\t", "button_width:             ", this.settings.button_width.toString(), "\n",
			"\t", "button_height:            ", this.settings.button_height.toString(), "\n",
			"\t", "button_text:              ", this.settings.button_text.toString(), "\n",
			"\t", "button_text_style:        ", this.settings.button_text_style.toString(), "\n",
			"\t", "button_text_top_padding:  ", this.settings.button_text_top_padding.toString(), "\n",
			"\t", "button_text_left_padding: ", this.settings.button_text_left_padding.toString(), "\n",
			"\t", "button_action:            ", this.settings.button_action.toString(), "\n",
			"\t", "button_disabled:          ", this.settings.button_disabled.toString(), "\n",

			"\t", "custom_settings:          ", this.settings.custom_settings.toString(), "\n",
			"Event Handlers:\n",
			"\t", "swfupload_loaded_handler assigned:  ", (typeof this.settings.swfupload_loaded_handler === "function").toString(), "\n",
			"\t", "file_dialog_start_handler assigned: ", (typeof this.settings.file_dialog_start_handler === "function").toString(), "\n",
			"\t", "file_queued_handler assigned:       ", (typeof this.settings.file_queued_handler === "function").toString(), "\n",
			"\t", "file_queue_error_handler assigned:  ", (typeof this.settings.file_queue_error_handler === "function").toString(), "\n",
			"\t", "upload_start_handler assigned:      ", (typeof this.settings.upload_start_handler === "function").toString(), "\n",
			"\t", "upload_progress_handler assigned:   ", (typeof this.settings.upload_progress_handler === "function").toString(), "\n",
			"\t", "upload_error_handler assigned:      ", (typeof this.settings.upload_error_handler === "function").toString(), "\n",
			"\t", "upload_success_handler assigned:    ", (typeof this.settings.upload_success_handler === "function").toString(), "\n",
			"\t", "upload_complete_handler assigned:   ", (typeof this.settings.upload_complete_handler === "function").toString(), "\n",
			"\t", "debug_handler assigned:             ", (typeof this.settings.debug_handler === "function").toString(), "\n"
		].join("")
	);
};

/* Note: addSetting and getSetting are no longer used by SWFUpload but are included
	the maintain v2 API compatibility
*/
// Public: (Deprecated) addSetting adds a setting value. If the value given is undefined or null then the default_value is used.
SWFUpload.prototype.addSetting = function (name, value, default_value) {
    if (value == undefined) {
        return (this.settings[name] = default_value);
    } else {
        return (this.settings[name] = value);
	}
};

// Public: (Deprecated) getSetting gets a setting. Returns an empty string if the setting was not found.
SWFUpload.prototype.getSetting = function (name) {
    if (this.settings[name] != undefined) {
        return this.settings[name];
	}

    return "";
};



// Private: callFlash handles function calls made to the Flash element.
// Calls are made with a setTimeout for some functions to work around
// bugs in the ExternalInterface library.
SWFUpload.prototype.callFlash = function (functionName, argumentArray) {
	argumentArray = argumentArray || [];
	
	var movieElement = this.getMovieElement();
	var returnValue, returnString;

	// Flash's method if calling ExternalInterface methods (code adapted from MooTools).
	try {
		returnString = movieElement.CallFunction('<invoke name="' + functionName + '" returntype="javascript">' + __flash__argumentsToXML(argumentArray, 0) + '</invoke>');
		returnValue = eval(returnString);
	} catch (ex) {
		throw "Call to " + functionName + " failed";
	}
	
	// Unescape file post param values
	if (returnValue != undefined && typeof returnValue.post === "object") {
		returnValue = this.unescapeFilePostParams(returnValue);
	}

	return returnValue;
};

/* *****************************
	-- Flash control methods --
	Your UI should use these
	to operate SWFUpload
   ***************************** */

// WARNING: this function does not work in Flash Player 10
// Public: selectFile causes a File Selection Dialog window to appear.  This
// dialog only allows 1 file to be selected.
SWFUpload.prototype.selectFile = function () {
	this.callFlash("SelectFile");
};

// WARNING: this function does not work in Flash Player 10
// Public: selectFiles causes a File Selection Dialog window to appear/ This
// dialog allows the user to select any number of files
// Flash Bug Warning: Flash limits the number of selectable files based on the combined length of the file names.
// If the selection name length is too long the dialog will fail in an unpredictable manner.  There is no work-around
// for this bug.
SWFUpload.prototype.selectFiles = function () {
	this.callFlash("SelectFiles");
};


// Public: startUpload starts uploading the first file in the queue unless
// the optional parameter 'fileID' specifies the ID 
SWFUpload.prototype.startUpload = function (fileID) {
	this.callFlash("StartUpload", [fileID]);
};

// Public: cancelUpload cancels any queued file.  The fileID parameter may be the file ID or index.
// If you do not specify a fileID the current uploading file or first file in the queue is cancelled.
// If you do not want the uploadError event to trigger you can specify false for the triggerErrorEvent parameter.
SWFUpload.prototype.cancelUpload = function (fileID, triggerErrorEvent) {
	if (triggerErrorEvent !== false) {
		triggerErrorEvent = true;
	}
	this.callFlash("CancelUpload", [fileID, triggerErrorEvent]);
};

// Public: stopUpload stops the current upload and requeues the file at the beginning of the queue.
// If nothing is currently uploading then nothing happens.
SWFUpload.prototype.stopUpload = function () {
	this.callFlash("StopUpload");
};

/* ************************
 * Settings methods
 *   These methods change the SWFUpload settings.
 *   SWFUpload settings should not be changed directly on the settings object
 *   since many of the settings need to be passed to Flash in order to take
 *   effect.
 * *********************** */

// Public: getStats gets the file statistics object.
SWFUpload.prototype.getStats = function () {
	return this.callFlash("GetStats");
};

// Public: setStats changes the SWFUpload statistics.  You shouldn't need to 
// change the statistics but you can.  Changing the statistics does not
// affect SWFUpload accept for the successful_uploads count which is used
// by the upload_limit setting to determine how many files the user may upload.
SWFUpload.prototype.setStats = function (statsObject) {
	this.callFlash("SetStats", [statsObject]);
};

// Public: getFile retrieves a File object by ID or Index.  If the file is
// not found then 'null' is returned.
SWFUpload.prototype.getFile = function (fileID) {
	if (typeof(fileID) === "number") {
		return this.callFlash("GetFileByIndex", [fileID]);
	} else {
		return this.callFlash("GetFile", [fileID]);
	}
};

// Public: addFileParam sets a name/value pair that will be posted with the
// file specified by the Files ID.  If the name already exists then the
// exiting value will be overwritten.
SWFUpload.prototype.addFileParam = function (fileID, name, value) {
	return this.callFlash("AddFileParam", [fileID, name, value]);
};

// Public: removeFileParam removes a previously set (by addFileParam) name/value
// pair from the specified file.
SWFUpload.prototype.removeFileParam = function (fileID, name) {
	this.callFlash("RemoveFileParam", [fileID, name]);
};

// Public: setUploadUrl changes the upload_url setting.
SWFUpload.prototype.setUploadURL = function (url) {
	this.settings.upload_url = url.toString();
	this.callFlash("SetUploadURL", [url]);
};

// Public: setPostParams changes the post_params setting
SWFUpload.prototype.setPostParams = function (paramsObject) {
	this.settings.post_params = paramsObject;
	this.callFlash("SetPostParams", [paramsObject]);
};

// Public: addPostParam adds post name/value pair.  Each name can have only one value.
SWFUpload.prototype.addPostParam = function (name, value) {
	this.settings.post_params[name] = value;
	this.callFlash("SetPostParams", [this.settings.post_params]);
};

// Public: removePostParam deletes post name/value pair.
SWFUpload.prototype.removePostParam = function (name) {
	delete this.settings.post_params[name];
	this.callFlash("SetPostParams", [this.settings.post_params]);
};

// Public: setFileTypes changes the file_types setting and the file_types_description setting
SWFUpload.prototype.setFileTypes = function (types, description) {
	this.settings.file_types = types;
	this.settings.file_types_description = description;
	this.callFlash("SetFileTypes", [types, description]);
};

// Public: setFileSizeLimit changes the file_size_limit setting
SWFUpload.prototype.setFileSizeLimit = function (fileSizeLimit) {
	this.settings.file_size_limit = fileSizeLimit;
	this.callFlash("SetFileSizeLimit", [fileSizeLimit]);
};

// Public: setFileUploadLimit changes the file_upload_limit setting
SWFUpload.prototype.setFileUploadLimit = function (fileUploadLimit) {
	this.settings.file_upload_limit = fileUploadLimit;
	this.callFlash("SetFileUploadLimit", [fileUploadLimit]);
};

// Public: setFileQueueLimit changes the file_queue_limit setting
SWFUpload.prototype.setFileQueueLimit = function (fileQueueLimit) {
	this.settings.file_queue_limit = fileQueueLimit;
	this.callFlash("SetFileQueueLimit", [fileQueueLimit]);
};

// Public: setFilePostName changes the file_post_name setting
SWFUpload.prototype.setFilePostName = function (filePostName) {
	this.settings.file_post_name = filePostName;
	this.callFlash("SetFilePostName", [filePostName]);
};

// Public: setUseQueryString changes the use_query_string setting
SWFUpload.prototype.setUseQueryString = function (useQueryString) {
	this.settings.use_query_string = useQueryString;
	this.callFlash("SetUseQueryString", [useQueryString]);
};

// Public: setRequeueOnError changes the requeue_on_error setting
SWFUpload.prototype.setRequeueOnError = function (requeueOnError) {
	this.settings.requeue_on_error = requeueOnError;
	this.callFlash("SetRequeueOnError", [requeueOnError]);
};

// Public: setHTTPSuccess changes the http_success setting
SWFUpload.prototype.setHTTPSuccess = function (http_status_codes) {
	if (typeof http_status_codes === "string") {
		http_status_codes = http_status_codes.replace(" ", "").split(",");
	}
	
	this.settings.http_success = http_status_codes;
	this.callFlash("SetHTTPSuccess", [http_status_codes]);
};

// Public: setHTTPSuccess changes the http_success setting
SWFUpload.prototype.setAssumeSuccessTimeout = function (timeout_seconds) {
	this.settings.assume_success_timeout = timeout_seconds;
	this.callFlash("SetAssumeSuccessTimeout", [timeout_seconds]);
};

// Public: setDebugEnabled changes the debug_enabled setting
SWFUpload.prototype.setDebugEnabled = function (debugEnabled) {
	this.settings.debug_enabled = debugEnabled;
	this.callFlash("SetDebugEnabled", [debugEnabled]);
};

// Public: setButtonImageURL loads a button image sprite
SWFUpload.prototype.setButtonImageURL = function (buttonImageURL) {
	if (buttonImageURL == undefined) {
		buttonImageURL = "";
	}
	
	this.settings.button_image_url = buttonImageURL;
	this.callFlash("SetButtonImageURL", [buttonImageURL]);
};

// Public: setButtonDimensions resizes the Flash Movie and button
SWFUpload.prototype.setButtonDimensions = function (width, height) {
	this.settings.button_width = width;
	this.settings.button_height = height;
	
	var movie = this.getMovieElement();
	if (movie != undefined) {
		movie.style.width = width + "px";
		movie.style.height = height + "px";
	}
	
	this.callFlash("SetButtonDimensions", [width, height]);
};
// Public: setButtonText Changes the text overlaid on the button
SWFUpload.prototype.setButtonText = function (html) {
	this.settings.button_text = html;
	this.callFlash("SetButtonText", [html]);
};
// Public: setButtonTextPadding changes the top and left padding of the text overlay
SWFUpload.prototype.setButtonTextPadding = function (left, top) {
	this.settings.button_text_top_padding = top;
	this.settings.button_text_left_padding = left;
	this.callFlash("SetButtonTextPadding", [left, top]);
};

// Public: setButtonTextStyle changes the CSS used to style the HTML/Text overlaid on the button
SWFUpload.prototype.setButtonTextStyle = function (css) {
	this.settings.button_text_style = css;
	this.callFlash("SetButtonTextStyle", [css]);
};
// Public: setButtonDisabled disables/enables the button
SWFUpload.prototype.setButtonDisabled = function (isDisabled) {
	this.settings.button_disabled = isDisabled;
	this.callFlash("SetButtonDisabled", [isDisabled]);
};
// Public: setButtonAction sets the action that occurs when the button is clicked
SWFUpload.prototype.setButtonAction = function (buttonAction) {
	this.settings.button_action = buttonAction;
	this.callFlash("SetButtonAction", [buttonAction]);
};

// Public: setButtonCursor changes the mouse cursor displayed when hovering over the button
SWFUpload.prototype.setButtonCursor = function (cursor) {
	this.settings.button_cursor = cursor;
	this.callFlash("SetButtonCursor", [cursor]);
};

/* *******************************
	Flash Event Interfaces
	These functions are used by Flash to trigger the various
	events.
	
	All these functions a Private.
	
	Because the ExternalInterface library is buggy the event calls
	are added to a queue and the queue then executed by a setTimeout.
	This ensures that events are executed in a determinate order and that
	the ExternalInterface bugs are avoided.
******************************* */

SWFUpload.prototype.queueEvent = function (handlerName, argumentArray) {
	// Warning: Don't call this.debug inside here or you'll create an infinite loop
	
	if (argumentArray == undefined) {
		argumentArray = [];
	} else if (!(argumentArray instanceof Array)) {
		argumentArray = [argumentArray];
	}
	
	var self = this;
	if (typeof this.settings[handlerName] === "function") {
		// Queue the event
		this.eventQueue.push(function () {
			this.settings[handlerName].apply(this, argumentArray);
		});
		
		// Execute the next queued event
		setTimeout(function () {
			self.executeNextEvent();
		}, 0);
		
	} else if (this.settings[handlerName] !== null) {
		throw "Event handler " + handlerName + " is unknown or is not a function";
	}
};

// Private: Causes the next event in the queue to be executed.  Since events are queued using a setTimeout
// we must queue them in order to garentee that they are executed in order.
SWFUpload.prototype.executeNextEvent = function () {
	// Warning: Don't call this.debug inside here or you'll create an infinite loop

	var  f = this.eventQueue ? this.eventQueue.shift() : null;
	if (typeof(f) === "function") {
		f.apply(this);
	}
};

// Private: unescapeFileParams is part of a workaround for a flash bug where objects passed through ExternalInterface cannot have
// properties that contain characters that are not valid for JavaScript identifiers. To work around this
// the Flash Component escapes the parameter names and we must unescape again before passing them along.
SWFUpload.prototype.unescapeFilePostParams = function (file) {
	var reg = /[$]([0-9a-f]{4})/i;
	var unescapedPost = {};
	var uk;

	if (file != undefined) {
		for (var k in file.post) {
			if (file.post.hasOwnProperty(k)) {
				uk = k;
				var match;
				while ((match = reg.exec(uk)) !== null) {
					uk = uk.replace(match[0], String.fromCharCode(parseInt("0x" + match[1], 16)));
				}
				unescapedPost[uk] = file.post[k];
			}
		}

		file.post = unescapedPost;
	}

	return file;
};

// Private: Called by Flash to see if JS can call in to Flash (test if External Interface is working)
SWFUpload.prototype.testExternalInterface = function () {
	try {
		return this.callFlash("TestExternalInterface");
	} catch (ex) {
		return false;
	}
};

// Private: This event is called by Flash when it has finished loading. Don't modify this.
// Use the swfupload_loaded_handler event setting to execute custom code when SWFUpload has loaded.
SWFUpload.prototype.flashReady = function () {
	// Check that the movie element is loaded correctly with its ExternalInterface methods defined
	var movieElement = this.getMovieElement();

	if (!movieElement) {
		this.debug("Flash called back ready but the flash movie can't be found.");
		return;
	}

	this.cleanUp(movieElement);
	
	this.queueEvent("swfupload_loaded_handler");
};

// Private: removes Flash added fuctions to the DOM node to prevent memory leaks in IE.
// This function is called by Flash each time the ExternalInterface functions are created.
SWFUpload.prototype.cleanUp = function (movieElement) {
	// Pro-actively unhook all the Flash functions
	try {
		if (this.movieElement && typeof(movieElement.CallFunction) === "unknown") { // We only want to do this in IE
			this.debug("Removing Flash functions hooks (this should only run in IE and should prevent memory leaks)");
			for (var key in movieElement) {
				try {
					if (typeof(movieElement[key]) === "function") {
						movieElement[key] = null;
					}
				} catch (ex) {
				}
			}
		}
	} catch (ex1) {
	
	}

	// Fix Flashes own cleanup code so if the SWFMovie was removed from the page
	// it doesn't display errors.
	window["__flash__removeCallback"] = function (instance, name) {
		try {
			if (instance) {
				instance[name] = null;
			}
		} catch (flashEx) {
		
		}
	};

};


/* This is a chance to do something before the browse window opens */
SWFUpload.prototype.fileDialogStart = function () {
	this.queueEvent("file_dialog_start_handler");
};


/* Called when a file is successfully added to the queue. */
SWFUpload.prototype.fileQueued = function (file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("file_queued_handler", file);
};


/* Handle errors that occur when an attempt to queue a file fails. */
SWFUpload.prototype.fileQueueError = function (file, errorCode, message) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("file_queue_error_handler", [file, errorCode, message]);
};

/* Called after the file dialog has closed and the selected files have been queued.
	You could call startUpload here if you want the queued files to begin uploading immediately. */
SWFUpload.prototype.fileDialogComplete = function (numFilesSelected, numFilesQueued, numFilesInQueue) {
	this.queueEvent("file_dialog_complete_handler", [numFilesSelected, numFilesQueued, numFilesInQueue]);
};

SWFUpload.prototype.uploadStart = function (file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("return_upload_start_handler", file);
};

SWFUpload.prototype.returnUploadStart = function (file) {
	var returnValue;
	if (typeof this.settings.upload_start_handler === "function") {
		file = this.unescapeFilePostParams(file);
		returnValue = this.settings.upload_start_handler.call(this, file);
	} else if (this.settings.upload_start_handler != undefined) {
		throw "upload_start_handler must be a function";
	}

	// Convert undefined to true so if nothing is returned from the upload_start_handler it is
	// interpretted as 'true'.
	if (returnValue === undefined) {
		returnValue = true;
	}
	
	returnValue = !!returnValue;
	
	this.callFlash("ReturnUploadStart", [returnValue]);
};



SWFUpload.prototype.uploadProgress = function (file, bytesComplete, bytesTotal) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_progress_handler", [file, bytesComplete, bytesTotal]);
};

SWFUpload.prototype.uploadError = function (file, errorCode, message) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_error_handler", [file, errorCode, message]);
};

SWFUpload.prototype.uploadSuccess = function (file, serverData, responseReceived) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_success_handler", [file, serverData, responseReceived]);
};

SWFUpload.prototype.uploadComplete = function (file) {
	file = this.unescapeFilePostParams(file);
	this.queueEvent("upload_complete_handler", file);
};

/* Called by SWFUpload JavaScript and Flash functions when debug is enabled. By default it writes messages to the
   internal debug console.  You can override this event and have messages written where you want. */
SWFUpload.prototype.debug = function (message) {
	this.queueEvent("debug_handler", message);
};


/* **********************************
	Debug Console
	The debug console is a self contained, in page location
	for debug message to be sent.  The Debug Console adds
	itself to the body if necessary.

	The console is automatically scrolled as messages appear.
	
	If you are using your own debug handler or when you deploy to production and
	have debug disabled you can remove these functions to reduce the file size
	and complexity.
********************************** */
   
// Private: debugMessage is the default debug_handler.  If you want to print debug messages
// call the debug() function.  When overriding the function your own function should
// check to see if the debug setting is true before outputting debug information.
SWFUpload.prototype.debugMessage = function (message) {
	if (this.settings.debug) {
		var exceptionMessage, exceptionValues = [];

		// Check for an exception object and print it nicely
		if (typeof message === "object" && typeof message.name === "string" && typeof message.message === "string") {
			for (var key in message) {
				if (message.hasOwnProperty(key)) {
					exceptionValues.push(key + ": " + message[key]);
				}
			}
			exceptionMessage = exceptionValues.join("\n") || "";
			exceptionValues = exceptionMessage.split("\n");
			exceptionMessage = "EXCEPTION: " + exceptionValues.join("\nEXCEPTION: ");
			SWFUpload.Console.writeLine(exceptionMessage);
		} else {
			SWFUpload.Console.writeLine(message);
		}
	}
};

SWFUpload.Console = {};
SWFUpload.Console.writeLine = function (message) {
	var console, documentForm;

	try {
		console = document.getElementById("SWFUpload_Console");

		if (!console) {
			documentForm = document.createElement("form");
			document.getElementsByTagName("body")[0].appendChild(documentForm);

			console = document.createElement("textarea");
			console.id = "SWFUpload_Console";
			console.style.fontFamily = "monospace";
			console.setAttribute("wrap", "off");
			console.wrap = "off";
			console.style.overflow = "auto";
			console.style.width = "700px";
			console.style.height = "350px";
			console.style.margin = "5px";
			documentForm.appendChild(console);
		}

		console.value += message + "\n";

		console.scrollTop = console.scrollHeight - console.clientHeight;
	} catch (ex) {
		alert("Exception: " + ex.name + " Message: " + ex.message);
	}
};
/*
	Queue Plug-in
	
	Features:
		*Adds a cancelQueue() method for cancelling the entire queue.
		*All queued files are uploaded when startUpload() is called.
		*If false is returned from uploadComplete then the queue upload is stopped.
		 If false is not returned (strict comparison) then the queue upload is continued.
		*Adds a QueueComplete event that is fired when all the queued files have finished uploading.
		 Set the event handler with the queue_complete_handler setting.
		
	*/

var SWFUpload;
if (typeof(SWFUpload) === "function") {
	SWFUpload.queue = {};
	
	SWFUpload.prototype.initSettings = (function (oldInitSettings) {
		return function () {
			if (typeof(oldInitSettings) === "function") {
				oldInitSettings.call(this);
			}
			
			this.customSettings.queue_cancelled_flag = false;
			this.customSettings.queue_upload_count = 0;
			
			this.settings.user_upload_complete_handler = this.settings.upload_complete_handler;
			this.settings.upload_complete_handler = SWFUpload.queue.uploadCompleteHandler;
			
			this.settings.queue_complete_handler = this.settings.queue_complete_handler || null;
		};
	})(SWFUpload.prototype.initSettings);

	SWFUpload.prototype.startUpload = function (fileID) {
		this.customSettings.queue_cancelled_flag = false;
		this.callFlash("StartUpload", false, [fileID]);
	};

	SWFUpload.prototype.cancelQueue = function () {
		this.customSettings.queue_cancelled_flag = true;
		this.stopUpload();
		
		var stats = this.getStats();
		while (stats.files_queued > 0) {
			this.cancelUpload();
			stats = this.getStats();
		}
	};
	
	SWFUpload.queue.uploadCompleteHandler = function (file) {
		var user_upload_complete_handler = this.settings.user_upload_complete_handler;
		var continueUpload;
		
		if (file.filestatus === SWFUpload.FILE_STATUS.COMPLETE) {
			this.customSettings.queue_upload_count++;
		}

		if (typeof(user_upload_complete_handler) === "function") {
			continueUpload = (user_upload_complete_handler.call(this, file) === false) ? false : true;
		} else {
			continueUpload = true;
		}
		
		if (continueUpload) {
			var stats = this.getStats();
			if (stats.files_queued > 0 && this.customSettings.queue_cancelled_flag === false) {
				this.startUpload();
			} else if (this.customSettings.queue_cancelled_flag === false) {
				this.queueEvent("queue_complete_handler", [this.customSettings.queue_upload_count]);
				this.customSettings.queue_upload_count = 0;
			} else {
				this.customSettings.queue_cancelled_flag = false;
				this.customSettings.queue_upload_count = 0;
			}
		}
	};
}/*
	A simple class for displaying file information and progress
	Note: This is a demonstration only and not part of SWFUpload.
	Note: Some have had problems adapting this class in IE7. It may not be suitable for your application.
*/

// Constructor
// file is a SWFUpload file object
// targetID is the HTML element id attribute that the FileProgress HTML structure will be added to.
// Instantiating a new FileProgress object with an existing file will reuse/update the existing DOM elements
function FileProgress(file, targetID) {
	this.fileProgressID = file.id;

	this.opacity = 100;
	this.height = 0;

	this.fileProgressWrapper = document.getElementById(this.fileProgressID);
	if (!this.fileProgressWrapper) {
		this.fileProgressWrapper = document.createElement("div");
		this.fileProgressWrapper.className = "progressWrapper";
		this.fileProgressWrapper.id = this.fileProgressID;

		this.fileProgressElement = document.createElement("div");
		this.fileProgressElement.className = "progressContainer";

		var progressCancel = document.createElement("a");
		progressCancel.className = "progressCancel";
		progressCancel.href = "#";
		progressCancel.style.visibility = "hidden";
		progressCancel.appendChild(document.createTextNode(" "));

		var progressText = document.createElement("div");
		progressText.className = "progressName";
		progressText.appendChild(document.createTextNode(file.name));

		var progressBar = document.createElement("div");
		progressBar.className = "progressBarInProgress";

		var progressStatus = document.createElement("div");
		progressStatus.className = "progressBarStatus";
		progressStatus.innerHTML = "&nbsp;";

		this.fileProgressElement.appendChild(progressCancel);
		this.fileProgressElement.appendChild(progressText);
		this.fileProgressElement.appendChild(progressStatus);
		this.fileProgressElement.appendChild(progressBar);

		this.fileProgressWrapper.appendChild(this.fileProgressElement);

		document.getElementById(targetID).appendChild(this.fileProgressWrapper);
	} else {
		this.fileProgressElement = this.fileProgressWrapper.firstChild;
	}

	this.height = this.fileProgressWrapper.offsetHeight;

}
FileProgress.prototype.setProgress = function (percentage) {
	this.fileProgressElement.className = "progressContainer green";
	this.fileProgressElement.childNodes[3].className = "progressBarInProgress";
	this.fileProgressElement.childNodes[3].style.width = percentage + "%";
};
FileProgress.prototype.setComplete = function () {
	this.fileProgressElement.className = "progressContainer blue";
	this.fileProgressElement.childNodes[3].className = "progressBarComplete";
	this.fileProgressElement.childNodes[3].style.width = "";

	var oSelf = this;
	setTimeout(function () {
		oSelf.disappear();
	}, 10000);
};
FileProgress.prototype.setError = function () {
	this.fileProgressElement.className = "progressContainer red";
	this.fileProgressElement.childNodes[3].className = "progressBarError";
	this.fileProgressElement.childNodes[3].style.width = "";

	var oSelf = this;
	setTimeout(function () {
		oSelf.disappear();
	}, 5000);
};
FileProgress.prototype.setCancelled = function () {
	this.fileProgressElement.className = "progressContainer";
	this.fileProgressElement.childNodes[3].className = "progressBarError";
	this.fileProgressElement.childNodes[3].style.width = "";

	var oSelf = this;
	setTimeout(function () {
		oSelf.disappear();
	}, 2000);
};
FileProgress.prototype.setStatus = function (status) {
	this.fileProgressElement.childNodes[2].innerHTML = status;
};

// Show/Hide the cancel button
FileProgress.prototype.toggleCancel = function (show, swfUploadInstance) {
	this.fileProgressElement.childNodes[0].style.visibility = show ? "visible" : "hidden";
	if (swfUploadInstance) {
		var fileID = this.fileProgressID;
		this.fileProgressElement.childNodes[0].onclick = function () {
			swfUploadInstance.cancelUpload(fileID);
			return false;
		};
	}
};

// Fades out and clips away the FileProgress box.
FileProgress.prototype.disappear = function () {

	var reduceOpacityBy = 15;
	var reduceHeightBy = 4;
	var rate = 30;	// 15 fps

	if (this.opacity > 0) {
		this.opacity -= reduceOpacityBy;
		if (this.opacity < 0) {
			this.opacity = 0;
		}

		if (this.fileProgressWrapper.filters) {
			try {
				this.fileProgressWrapper.filters.item("DXImageTransform.Microsoft.Alpha").opacity = this.opacity;
			} catch (e) {
				// If it is not set initially, the browser will throw an error.  This will set it if it is not set yet.
				this.fileProgressWrapper.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + this.opacity + ")";
			}
		} else {
			this.fileProgressWrapper.style.opacity = this.opacity / 100;
		}
	}

	if (this.height > 0) {
		this.height -= reduceHeightBy;
		if (this.height < 0) {
			this.height = 0;
		}

		this.fileProgressWrapper.style.height = this.height + "px";
	}

	if (this.height > 0 || this.opacity > 0) {
		var oSelf = this;
		setTimeout(function () {
			oSelf.disappear();
		}, rate);
	} else {
		this.fileProgressWrapper.style.display = "none";
	}
};/* Demo Note:  This demo uses a FileProgress class that handles the UI for displaying the file name and percent complete.
The FileProgress class is not part of SWFUpload.
*/


/* **********************
   Event Handlers
   These are my custom event handlers to make my
   web application behave the way I went when SWFUpload
   completes different tasks.  These aren't part of the SWFUpload
   package.  They are part of my application.  Without these none
   of the actions SWFUpload makes will show up in my application.
   ********************** */
function fileQueued(file) {
	try {
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setStatus("Pending...");
		progress.toggleCancel(true, this);

	} catch (ex) {
		this.debug(ex);
	}

}

function fileQueueError(file, errorCode, message) {
	try {
		if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
			alert("You have attempted to queue too many files.\n" + (message === 0 ? "You have reached the upload limit." : "You may select " + (message > 1 ? "up to " + message + " files." : "one file.")));
			return;
		}

		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setError();
		progress.toggleCancel(false);

		switch (errorCode) {
		case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
			progress.setStatus("File is too big.");
			this.debug("Error Code: File too big, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
			progress.setStatus("Cannot upload Zero Byte files.");
			this.debug("Error Code: Zero byte file, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
			progress.setStatus("Invalid File Type.");
			this.debug("Error Code: Invalid File Type, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		default:
			if (file !== null) {
				progress.setStatus("Unhandled Error");
			}
			this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		}
	} catch (ex) {
        this.debug(ex);
    }
}

function fileDialogComplete(numFilesSelected, numFilesQueued) {
	try {
		if (numFilesSelected > 0) {
			document.getElementById(this.customSettings.cancelButtonId).disabled = false;
		}
		
		/* I want auto start the upload and I can do that here 
		this.startUpload(); */
	} catch (ex)  {
        this.debug(ex);
	}
}

function uploadStart(file) {
	try {
		/* I don't want to do any file validation or anything,  I'll just update the UI and
		return true to indicate that the upload should start.
		It's important to update the UI here because in Linux no uploadProgress events are called. The best
		we can do is say we are uploading.
		 */
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setStatus("Uploading...");
		progress.toggleCancel(true, this);
	}
	catch (ex) {}
	
	return true;
}

function uploadProgress(file, bytesLoaded, bytesTotal) {
	try {
		var percent = Math.ceil((bytesLoaded / bytesTotal) * 100);		
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setProgress(percent);
		progress.setStatus("Uploading...");
	} catch (ex) {
		this.debug(ex);
	}
}

function uploadSuccess(file, serverData) {
	try {
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setComplete();
		progress.setStatus("Complete.");
		progress.toggleCancel(false);

	} catch (ex) {
		this.debug(ex);
	}
}

function uploadError(file, errorCode, message) {
	try {
		var progress = new FileProgress(file, this.customSettings.progressTarget);
		progress.setError();
		progress.toggleCancel(false);
		switch (errorCode) {
		case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
			progress.setStatus("Upload Error: " + message);
			this.debug("Error Code: HTTP Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
			progress.setStatus("Upload Failed.");
			this.debug("Error Code: Upload Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.IO_ERROR:
			progress.setStatus("Server (IO) Error");
			this.debug("Error Code: IO Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
			progress.setStatus("Security Error");
			this.debug("Error Code: Security Error, File name: " + file.name + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
			progress.setStatus("Upload limit exceeded.");
			this.debug("Error Code: Upload Limit Exceeded, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
			progress.setStatus("Failed Validation.  Upload skipped.");
			this.debug("Error Code: File Validation Failed, File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
			// If there aren't any files left (they were all cancelled) disable the cancel button
			if (this.getStats().files_queued === 0) {
				document.getElementById(this.customSettings.cancelButtonId).disabled = true;
			}
			progress.setStatus("Cancelled");
			progress.setCancelled();
			break;
		case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
			progress.setStatus("Stopped");
			break;
		default:
			progress.setStatus("Unhandled Error: " + errorCode);
			this.debug("Error Code: " + errorCode + ", File name: " + file.name + ", File size: " + file.size + ", Message: " + message);
			break;
		}
	} catch (ex) {
        this.debug(ex);
    }
  jQuery("#start_button").fadeTo("fast", 1.0);
}

function uploadComplete(file) {
	if (this.getStats().files_queued === 0) {
		document.getElementById(this.customSettings.cancelButtonId).disabled = true;
	}
	jQuery("#start_button").fadeTo("fast", 1.0);
	if(typeof(reload_images)!='undefined'){
		reload_images();
	}
  if(typeof updateAll!="undefined") updateAll(root);
}

// This event comes from the Queue Plugin
function queueComplete(numFilesUploaded) {
	var status = document.getElementById("divStatus");
	status.innerHTML = numFilesUploaded + " file" + (numFilesUploaded === 1 ? "" : "s") + " uploaded.";
}
function init_upload(){
	

			var settings = {
				flash_url : "/swfupload.swf",
				upload_url: "/file_upload.php",	// Relative to the SWF file
        post_params: {
    			content_id: jQuery("#content_page_id").val(),
    			model_string: jQuery("#content_page_type").val(),
    			join_field: jQuery("#join_field").val()
    		},				
    		file_size_limit : "100 MB",
				file_types : "*.*",
				file_types_description : "All Files",
				file_upload_limit : 100,
				file_queue_limit : 100,
				custom_settings : {
					progressTarget : "fsUploadProgress",
					cancelButtonId : "btnCancel"
				},
				debug: false,

				// Button settings
				button_image_url: "/images/cms/add_files_button.png",	// Relative to the Flash file
				button_width: "254",
				button_height: "27",
				button_placeholder_id: "spanButtonPlaceHolder",
				button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
				button_cursor: SWFUpload.CURSOR.HAND,
				
				// The event handler functions are defined in handlers.js
				file_queued_handler : fileQueued,
				file_queue_error_handler : fileQueueError,
				file_dialog_complete_handler : fileDialogComplete,
				upload_start_handler : uploadStart,
				upload_progress_handler : uploadProgress,
				upload_error_handler : uploadError,
				upload_success_handler : uploadSuccess,
				upload_complete_handler : uploadComplete,
				queue_complete_handler : queueComplete	// Queue plugin event
			};

			swfu = new SWFUpload(settings);
}
var swfu;



   
function set_post_params(){
  var fold = jQuery("#dest").html();
  if(fold == "select a folder") {
    alert("You must choose a folder first");
    return false;
  }
  if(!fold) var fold = jQuery("#wildfire_file_folder").val();
  if(jQuery("#upload_from").length && jQuery("#upload_from").val().length >1) {
    jQuery.post("/file_upload.php?", { 
      wildfire_file_folder: fold, 
      wildfire_file_description: jQuery("#wildfire_file_description").val(),
      upload_from_url: jQuery("#upload_from").val(),
      wildfire_file_filename: jQuery("#wildfire_file_filename").val(),
			content_id: jQuery("#url_content_page_id").val(),
			model_string: jQuery("#url_content_page_type").val(),
			join_field: jQuery("#url_join_field").val()
    }, function() {
      jQuery("#start_button").fadeTo("fast",1.0);
      alert("Image Successfully Retrieved");
			if(typeof(reload_images)!='undefined'){
				reload_images();
			}
    });
    return true;
  } 
  swfu.addPostParam("wildfire_file_folder", fold);
  swfu.addPostParam("wildfire_file_description", jQuery("#wildfire_file_description").val());
  swfu.startUpload();
}

/*  Prototype JavaScript framework, version 1.4.0
 *  (c) 2005 Sam Stephenson <sam@conio.net>
 *
 *  Prototype is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://prototype.conio.net/
 *
/*--------------------------------------------------------------------------*/

var Prototype = {
  Version: '1.4.0',
  ScriptFragment: '(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)',

  emptyFunction: function() {},
  K: function(x) {return x}
}

var Class = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
}

var Abstract = new Object();

Object.extend = function(destination, source) {
  for (property in source) {
    destination[property] = source[property];
  }
  return destination;
}

Object.inspect = function(object) {
  try {
    if (object == undefined) return 'undefined';
    if (object == null) return 'null';
    return object.inspect ? object.inspect() : object.toString();
  } catch (e) {
    if (e instanceof RangeError) return '...';
    throw e;
  }
}

Function.prototype.bind = function() {
  var __method = this, args = $A(arguments), object = args.shift();
  return function() {
    return __method.apply(object, args.concat($A(arguments)));
  }
}

Function.prototype.bindAsEventListener = function(object) {
  var __method = this;
  return function(event) {
    return __method.call(object, event || window.event);
  }
}

Object.extend(Number.prototype, {
  toColorPart: function() {
    var digits = this.toString(16);
    if (this < 16) return '0' + digits;
    return digits;
  },

  succ: function() {
    return this + 1;
  },

  times: function(iterator) {
    $R(0, this, true).each(iterator);
    return this;
  }
});

var Try = {
  these: function() {
    var returnValue;

    for (var i = 0; i < arguments.length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) {}
    }

    return returnValue;
  }
}

/*--------------------------------------------------------------------------*/

var PeriodicalExecuter = Class.create();
PeriodicalExecuter.prototype = {
  initialize: function(callback, frequency) {
    this.callback = callback;
    this.frequency = frequency;
    this.currentlyExecuting = false;

    this.registerCallback();
  },

  registerCallback: function() {
    setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },

  onTimerEvent: function() {
    if (!this.currentlyExecuting) {
      try {
        this.currentlyExecuting = true;
        this.callback();
      } finally {
        this.currentlyExecuting = false;
      }
    }
  }
}

/*--------------------------------------------------------------------------*/

function $() {
  var elements = new Array();

  for (var i = 0; i < arguments.length; i++) {
    var element = arguments[i];
    if (typeof element == 'string')
      element = document.getElementById(element);

    if (arguments.length == 1)
      return element;

    elements.push(element);
  }

  return elements;
}
Object.extend(String.prototype, {
  stripTags: function() {
    return this.replace(/<\/?[^>]+>/gi, '');
  },

  stripScripts: function() {
    return this.replace(new RegExp(Prototype.ScriptFragment, 'img'), '');
  },

  extractScripts: function() {
    var matchAll = new RegExp(Prototype.ScriptFragment, 'img');
    var matchOne = new RegExp(Prototype.ScriptFragment, 'im');
    return (this.match(matchAll) || []).map(function(scriptTag) {
      return (scriptTag.match(matchOne) || ['', ''])[1];
    });
  },

  evalScripts: function() {
    return this.extractScripts().map(eval);
  },

  escapeHTML: function() {
    var div = document.createElement('div');
    var text = document.createTextNode(this);
    div.appendChild(text);
    return div.innerHTML;
  },

  unescapeHTML: function() {
    var div = document.createElement('div');
    div.innerHTML = this.stripTags();
    return div.childNodes[0] ? div.childNodes[0].nodeValue : '';
  },

  toQueryParams: function() {
    var pairs = this.match(/^\??(.*)$/)[1].split('&');
    return pairs.inject({}, function(params, pairString) {
      var pair = pairString.split('=');
      params[pair[0]] = pair[1];
      return params;
    });
  },

  toArray: function() {
    return this.split('');
  },

  camelize: function() {
    var oStringList = this.split('-');
    if (oStringList.length == 1) return oStringList[0];

    var camelizedString = this.indexOf('-') == 0
      ? oStringList[0].charAt(0).toUpperCase() + oStringList[0].substring(1)
      : oStringList[0];

    for (var i = 1, len = oStringList.length; i < len; i++) {
      var s = oStringList[i];
      camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
    }

    return camelizedString;
  },

  inspect: function() {
    return "'" + this.replace('\\', '\\\\').replace("'", '\\\'') + "'";
  }
});

String.prototype.parseQuery = String.prototype.toQueryParams;

var $break    = new Object();
var $continue = new Object();

var Enumerable = {
  each: function(iterator) {
    var index = 0;
    try {
      this._each(function(value) {
        try {
          iterator(value, index++);
        } catch (e) {
          if (e != $continue) throw e;
        }
      });
    } catch (e) {
      if (e != $break) throw e;
    }
  },

  all: function(iterator) {
    var result = true;
    this.each(function(value, index) {
      result = result && !!(iterator || Prototype.K)(value, index);
      if (!result) throw $break;
    });
    return result;
  },

  any: function(iterator) {
    var result = true;
    this.each(function(value, index) {
      if (result = !!(iterator || Prototype.K)(value, index))
        throw $break;
    });
    return result;
  },

  collect: function(iterator) {
    var results = [];
    this.each(function(value, index) {
      results.push(iterator(value, index));
    });
    return results;
  },

  detect: function (iterator) {
    var result;
    this.each(function(value, index) {
      if (iterator(value, index)) {
        result = value;
        throw $break;
      }
    });
    return result;
  },

  findAll: function(iterator) {
    var results = [];
    this.each(function(value, index) {
      if (iterator(value, index))
        results.push(value);
    });
    return results;
  },

  grep: function(pattern, iterator) {
    var results = [];
    this.each(function(value, index) {
      var stringValue = value.toString();
      if (stringValue.match(pattern))
        results.push((iterator || Prototype.K)(value, index));
    })
    return results;
  },

  include: function(object) {
    var found = false;
    this.each(function(value) {
      if (value == object) {
        found = true;
        throw $break;
      }
    });
    return found;
  },

  inject: function(memo, iterator) {
    this.each(function(value, index) {
      memo = iterator(memo, value, index);
    });
    return memo;
  },

  invoke: function(method) {
    var args = $A(arguments).slice(1);
    return this.collect(function(value) {
      return value[method].apply(value, args);
    });
  },

  max: function(iterator) {
    var result;
    this.each(function(value, index) {
      value = (iterator || Prototype.K)(value, index);
      if (value >= (result || value))
        result = value;
    });
    return result;
  },

  min: function(iterator) {
    var result;
    this.each(function(value, index) {
      value = (iterator || Prototype.K)(value, index);
      if (value <= (result || value))
        result = value;
    });
    return result;
  },

  partition: function(iterator) {
    var trues = [], falses = [];
    this.each(function(value, index) {
      ((iterator || Prototype.K)(value, index) ?
        trues : falses).push(value);
    });
    return [trues, falses];
  },

  pluck: function(property) {
    var results = [];
    this.each(function(value, index) {
      results.push(value[property]);
    });
    return results;
  },

  reject: function(iterator) {
    var results = [];
    this.each(function(value, index) {
      if (!iterator(value, index))
        results.push(value);
    });
    return results;
  },

  sortBy: function(iterator) {
    return this.collect(function(value, index) {
      return {value: value, criteria: iterator(value, index)};
    }).sort(function(left, right) {
      var a = left.criteria, b = right.criteria;
      return a < b ? -1 : a > b ? 1 : 0;
    }).pluck('value');
  },

  toArray: function() {
    return this.collect(Prototype.K);
  },

  zip: function() {
    var iterator = Prototype.K, args = $A(arguments);
    if (typeof args.last() == 'function')
      iterator = args.pop();

    var collections = [this].concat(args).map($A);
    return this.map(function(value, index) {
      iterator(value = collections.pluck(index));
      return value;
    });
  },

  inspect: function() {
    return '#<Enumerable:' + this.toArray().inspect() + '>';
  }
}

Object.extend(Enumerable, {
  map:     Enumerable.collect,
  find:    Enumerable.detect,
  select:  Enumerable.findAll,
  member:  Enumerable.include,
  entries: Enumerable.toArray
});
var $A = Array.from = function(iterable) {
  if (!iterable) return [];
  if (iterable.toArray) {
    return iterable.toArray();
  } else {
    var results = [];
    for (var i = 0; i < iterable.length; i++)
      results.push(iterable[i]);
    return results;
  }
}

Object.extend(Array.prototype, Enumerable);

Array.prototype._reverse = Array.prototype.reverse;

Object.extend(Array.prototype, {
  _each: function(iterator) {
    for (var i = 0; i < this.length; i++)
      iterator(this[i]);
  },

  clear: function() {
    this.length = 0;
    return this;
  },

  first: function() {
    return this[0];
  },

  last: function() {
    return this[this.length - 1];
  },

  compact: function() {
    return this.select(function(value) {
      return value != undefined || value != null;
    });
  },

  flatten: function() {
    return this.inject([], function(array, value) {
      return array.concat(value.constructor == Array ?
        value.flatten() : [value]);
    });
  },

  without: function() {
    var values = $A(arguments);
    return this.select(function(value) {
      return !values.include(value);
    });
  },

  indexOf: function(object) {
    for (var i = 0; i < this.length; i++)
      if (this[i] == object) return i;
    return -1;
  },

  reverse: function(inline) {
    return (inline !== false ? this : this.toArray())._reverse();
  },

  shift: function() {
    var result = this[0];
    for (var i = 0; i < this.length - 1; i++)
      this[i] = this[i + 1];
    this.length--;
    return result;
  },

  inspect: function() {
    return '[' + this.map(Object.inspect).join(', ') + ']';
  }
});
var Hash = {
  _each: function(iterator) {
    for (key in this) {
      var value = this[key];
      if (typeof value == 'function') continue;

      var pair = [key, value];
      pair.key = key;
      pair.value = value;
      iterator(pair);
    }
  },

  keys: function() {
    return this.pluck('key');
  },

  values: function() {
    return this.pluck('value');
  },

  merge: function(hash) {
    return $H(hash).inject($H(this), function(mergedHash, pair) {
      mergedHash[pair.key] = pair.value;
      return mergedHash;
    });
  },

  toQueryString: function() {
    return this.map(function(pair) {
      return pair.map(encodeURIComponent).join('=');
    }).join('&');
  },

  inspect: function() {
    return '#<Hash:{' + this.map(function(pair) {
      return pair.map(Object.inspect).join(': ');
    }).join(', ') + '}>';
  }
}

function $H(object) {
  var hash = Object.extend({}, object || {});
  Object.extend(hash, Enumerable);
  Object.extend(hash, Hash);
  return hash;
}
ObjectRange = Class.create();
Object.extend(ObjectRange.prototype, Enumerable);
Object.extend(ObjectRange.prototype, {
  initialize: function(start, end, exclusive) {
    this.start = start;
    this.end = end;
    this.exclusive = exclusive;
  },

  _each: function(iterator) {
    var value = this.start;
    do {
      iterator(value);
      value = value.succ();
    } while (this.include(value));
  },

  include: function(value) {
    if (value < this.start)
      return false;
    if (this.exclusive)
      return value < this.end;
    return value <= this.end;
  }
});

var $R = function(start, end, exclusive) {
  return new ObjectRange(start, end, exclusive);
}

var Ajax = {
  getTransport: function() {
    return Try.these(
      function() {return new ActiveXObject('Msxml2.XMLHTTP')},
      function() {return new ActiveXObject('Microsoft.XMLHTTP')},
      function() {return new XMLHttpRequest()}
    ) || false;
  },

  activeRequestCount: 0
}

Ajax.Responders = {
  responders: [],

  _each: function(iterator) {
    this.responders._each(iterator);
  },

  register: function(responderToAdd) {
    if (!this.include(responderToAdd))
      this.responders.push(responderToAdd);
  },

  unregister: function(responderToRemove) {
    this.responders = this.responders.without(responderToRemove);
  },

  dispatch: function(callback, request, transport, json) {
    this.each(function(responder) {
      if (responder[callback] && typeof responder[callback] == 'function') {
        try {
          responder[callback].apply(responder, [request, transport, json]);
        } catch (e) {}
      }
    });
  }
};

Object.extend(Ajax.Responders, Enumerable);

Ajax.Responders.register({
  onCreate: function() {
    Ajax.activeRequestCount++;
  },

  onComplete: function() {
    Ajax.activeRequestCount--;
  }
});

Ajax.Base = function() {};
Ajax.Base.prototype = {
  setOptions: function(options) {
    this.options = {
      method:       'post',
      asynchronous: true,
      parameters:   ''
    }
    Object.extend(this.options, options || {});
  },

  responseIsSuccess: function() {
    return this.transport.status == undefined
        || this.transport.status == 0
        || (this.transport.status >= 200 && this.transport.status < 300);
  },

  responseIsFailure: function() {
    return !this.responseIsSuccess();
  }
}

Ajax.Request = Class.create();
Ajax.Request.Events =
  ['Uninitialized', 'Loading', 'Loaded', 'Interactive', 'Complete'];

Ajax.Request.prototype = Object.extend(new Ajax.Base(), {
  initialize: function(url, options) {
    this.transport = Ajax.getTransport();
    this.setOptions(options);
    this.request(url);
  },

  request: function(url) {
    var parameters = this.options.parameters || '';
    if (parameters.length > 0) parameters += '&_=';

    try {
      this.url = url;
      if (this.options.method == 'get' && parameters.length > 0)
        this.url += (this.url.match(/\?/) ? '&' : '?') + parameters;

      Ajax.Responders.dispatch('onCreate', this, this.transport);

      this.transport.open(this.options.method, this.url,
        this.options.asynchronous);

      if (this.options.asynchronous) {
        this.transport.onreadystatechange = this.onStateChange.bind(this);
        setTimeout((function() {this.respondToReadyState(1)}).bind(this), 10);
      }

      this.setRequestHeaders();

      var body = this.options.postBody ? this.options.postBody : parameters;
      this.transport.send(this.options.method == 'post' ? body : null);

    } catch (e) {
      this.dispatchException(e);
    }
  },

  setRequestHeaders: function() {
    var requestHeaders =
      ['X-Requested-With', 'XMLHttpRequest',
       'X-Prototype-Version', Prototype.Version];

    if (this.options.method == 'post') {
      requestHeaders.push('Content-type',
        'application/x-www-form-urlencoded');

      /* Force "Connection: close" for Mozilla browsers to work around
       * a bug where XMLHttpReqeuest sends an incorrect Content-length
       * header. See Mozilla Bugzilla #246651.
       */
      if (this.transport.overrideMimeType)
        requestHeaders.push('Connection', 'close');
    }

    if (this.options.requestHeaders)
      requestHeaders.push.apply(requestHeaders, this.options.requestHeaders);

    for (var i = 0; i < requestHeaders.length; i += 2)
      this.transport.setRequestHeader(requestHeaders[i], requestHeaders[i+1]);
  },

  onStateChange: function() {
    var readyState = this.transport.readyState;
    if (readyState != 1)
      this.respondToReadyState(this.transport.readyState);
  },

  header: function(name) {
    try {
      return this.transport.getResponseHeader(name);
    } catch (e) {}
  },

  evalJSON: function() {
    try {
      return eval(this.header('X-JSON'));
    } catch (e) {}
  },

  evalResponse: function() {
    try {
      return eval(this.transport.responseText);
    } catch (e) {
      this.dispatchException(e);
    }
  },

  respondToReadyState: function(readyState) {
    var event = Ajax.Request.Events[readyState];
    var transport = this.transport, json = this.evalJSON();

    if (event == 'Complete') {
      try {
        (this.options['on' + this.transport.status]
         || this.options['on' + (this.responseIsSuccess() ? 'Success' : 'Failure')]
         || Prototype.emptyFunction)(transport, json);
      } catch (e) {
        this.dispatchException(e);
      }

      if ((this.header('Content-type') || '').match(/^text\/javascript/i))
        this.evalResponse();
    }

    try {
      (this.options['on' + event] || Prototype.emptyFunction)(transport, json);
      Ajax.Responders.dispatch('on' + event, this, transport, json);
    } catch (e) {
      this.dispatchException(e);
    }

    /* Avoid memory leak in MSIE: clean up the oncomplete event handler */
    if (event == 'Complete')
      this.transport.onreadystatechange = Prototype.emptyFunction;
  },

  dispatchException: function(exception) {
    (this.options.onException || Prototype.emptyFunction)(this, exception);
    Ajax.Responders.dispatch('onException', this, exception);
  }
});

Ajax.Updater = Class.create();

Object.extend(Object.extend(Ajax.Updater.prototype, Ajax.Request.prototype), {
  initialize: function(container, url, options) {
    this.containers = {
      success: container.success ? $(container.success) : $(container),
      failure: container.failure ? $(container.failure) :
        (container.success ? null : $(container))
    }

    this.transport = Ajax.getTransport();
    this.setOptions(options);

    var onComplete = this.options.onComplete || Prototype.emptyFunction;
    this.options.onComplete = (function(transport, object) {
      this.updateContent();
      onComplete(transport, object);
    }).bind(this);

    this.request(url);
  },

  updateContent: function() {
    var receiver = this.responseIsSuccess() ?
      this.containers.success : this.containers.failure;
    var response = this.transport.responseText;

    if (!this.options.evalScripts)
      response = response.stripScripts();

    if (receiver) {
      if (this.options.insertion) {
        new this.options.insertion(receiver, response);
      } else {
        Element.update(receiver, response);
      }
    }

    if (this.responseIsSuccess()) {
      if (this.onComplete)
        setTimeout(this.onComplete.bind(this), 10);
    }
  }
});

Ajax.PeriodicalUpdater = Class.create();
Ajax.PeriodicalUpdater.prototype = Object.extend(new Ajax.Base(), {
  initialize: function(container, url, options) {
    this.setOptions(options);
    this.onComplete = this.options.onComplete;

    this.frequency = (this.options.frequency || 2);
    this.decay = (this.options.decay || 1);

    this.updater = {};
    this.container = container;
    this.url = url;

    this.start();
  },

  start: function() {
    this.options.onComplete = this.updateComplete.bind(this);
    this.onTimerEvent();
  },

  stop: function() {
    this.updater.onComplete = undefined;
    clearTimeout(this.timer);
    (this.onComplete || Prototype.emptyFunction).apply(this, arguments);
  },

  updateComplete: function(request) {
    if (this.options.decay) {
      this.decay = (request.responseText == this.lastText ?
        this.decay * this.options.decay : 1);

      this.lastText = request.responseText;
    }
    this.timer = setTimeout(this.onTimerEvent.bind(this),
      this.decay * this.frequency * 1000);
  },

  onTimerEvent: function() {
    this.updater = new Ajax.Updater(this.container, this.url, this.options);
  }
});
document.getElementsByClassName = function(className, parentElement) {
  var children = ($(parentElement) || document.body).getElementsByTagName('*');
  return $A(children).inject([], function(elements, child) {
    if (child.className.match(new RegExp("(^|\\s)" + className + "(\\s|$)")))
      elements.push(child);
    return elements;
  });
}

/*--------------------------------------------------------------------------*/

if (!window.Element) {
  var Element = new Object();
}

Object.extend(Element, {
  visible: function(element) {
    return $(element).style.display != 'none';
  },

  toggle: function() {
    for (var i = 0; i < arguments.length; i++) {
      var element = $(arguments[i]);
      Element[Element.visible(element) ? 'hide' : 'show'](element);
    }
  },

  hide: function() {
    for (var i = 0; i < arguments.length; i++) {
      var element = $(arguments[i]);
      element.style.display = 'none';
    }
  },

  show: function() {
    for (var i = 0; i < arguments.length; i++) {
      var element = $(arguments[i]);
      element.style.display = '';
    }
  },

  remove: function(element) {
    element = $(element);
    element.parentNode.removeChild(element);
  },

  update: function(element, html) {
    $(element).innerHTML = html.stripScripts();
    setTimeout(function() {html.evalScripts()}, 10);
  },

  getHeight: function(element) {
    element = $(element);
    return element.offsetHeight;
  },

  classNames: function(element) {
    return new Element.ClassNames(element);
  },

  hasClassName: function(element, className) {
    if (!(element = $(element))) return;
    return Element.classNames(element).include(className);
  },

  addClassName: function(element, className) {
    if (!(element = $(element))) return;
    return Element.classNames(element).add(className);
  },

  removeClassName: function(element, className) {
    if (!(element = $(element))) return;
    return Element.classNames(element).remove(className);
  },

  // removes whitespace-only text node children
  cleanWhitespace: function(element) {
    element = $(element);
    for (var i = 0; i < element.childNodes.length; i++) {
      var node = element.childNodes[i];
      if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
        Element.remove(node);
    }
  },

  empty: function(element) {
    return $(element).innerHTML.match(/^\s*$/);
  },

  scrollTo: function(element) {
    element = $(element);
    var x = element.x ? element.x : element.offsetLeft,
        y = element.y ? element.y : element.offsetTop;
    window.scrollTo(x, y);
  },

  getStyle: function(element, style) {
    element = $(element);
    var value = element.style[style.camelize()];
    if (!value) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        var css = document.defaultView.getComputedStyle(element, null);
        value = css ? css.getPropertyValue(style) : null;
      } else if (element.currentStyle) {
        value = element.currentStyle[style.camelize()];
      }
    }

    if (window.opera && ['left', 'top', 'right', 'bottom'].include(style))
      if (Element.getStyle(element, 'position') == 'static') value = 'auto';

    return value == 'auto' ? null : value;
  },

  setStyle: function(element, style) {
    element = $(element);
    for (name in style)
      element.style[name.camelize()] = style[name];
  },

  getDimensions: function(element) {
    element = $(element);
    if (Element.getStyle(element, 'display') != 'none')
      return {width: element.offsetWidth, height: element.offsetHeight};

    // All *Width and *Height properties give 0 on elements with display none,
    // so enable the element temporarily
    var els = element.style;
    var originalVisibility = els.visibility;
    var originalPosition = els.position;
    els.visibility = 'hidden';
    els.position = 'absolute';
    els.display = '';
    var originalWidth = element.clientWidth;
    var originalHeight = element.clientHeight;
    els.display = 'none';
    els.position = originalPosition;
    els.visibility = originalVisibility;
    return {width: originalWidth, height: originalHeight};
  },

  makePositioned: function(element) {
    element = $(element);
    var pos = Element.getStyle(element, 'position');
    if (pos == 'static' || !pos) {
      element._madePositioned = true;
      element.style.position = 'relative';
      // Opera returns the offset relative to the positioning context, when an
      // element is position relative but top and left have not been defined
      if (window.opera) {
        element.style.top = 0;
        element.style.left = 0;
      }
    }
  },

  undoPositioned: function(element) {
    element = $(element);
    if (element._madePositioned) {
      element._madePositioned = undefined;
      element.style.position =
        element.style.top =
        element.style.left =
        element.style.bottom =
        element.style.right = '';
    }
  },

  makeClipping: function(element) {
    element = $(element);
    if (element._overflow) return;
    element._overflow = element.style.overflow;
    if ((Element.getStyle(element, 'overflow') || 'visible') != 'hidden')
      element.style.overflow = 'hidden';
  },

  undoClipping: function(element) {
    element = $(element);
    if (element._overflow) return;
    element.style.overflow = element._overflow;
    element._overflow = undefined;
  }
});

var Toggle = new Object();
Toggle.display = Element.toggle;

/*--------------------------------------------------------------------------*/

Abstract.Insertion = function(adjacency) {
  this.adjacency = adjacency;
}

Abstract.Insertion.prototype = {
  initialize: function(element, content) {
    this.element = $(element);
    this.content = content.stripScripts();

    if (this.adjacency && this.element.insertAdjacentHTML) {
      try {
        this.element.insertAdjacentHTML(this.adjacency, this.content);
      } catch (e) {
        if (this.element.tagName.toLowerCase() == 'tbody') {
          this.insertContent(this.contentFromAnonymousTable());
        } else {
          throw e;
        }
      }
    } else {
      this.range = this.element.ownerDocument.createRange();
      if (this.initializeRange) this.initializeRange();
      this.insertContent([this.range.createContextualFragment(this.content)]);
    }

    setTimeout(function() {content.evalScripts()}, 10);
  },

  contentFromAnonymousTable: function() {
    var div = document.createElement('div');
    div.innerHTML = '<table><tbody>' + this.content + '</tbody></table>';
    return $A(div.childNodes[0].childNodes[0].childNodes);
  }
}

var Insertion = new Object();

Insertion.Before = Class.create();
Insertion.Before.prototype = Object.extend(new Abstract.Insertion('beforeBegin'), {
  initializeRange: function() {
    this.range.setStartBefore(this.element);
  },

  insertContent: function(fragments) {
    fragments.each((function(fragment) {
      this.element.parentNode.insertBefore(fragment, this.element);
    }).bind(this));
  }
});

Insertion.Top = Class.create();
Insertion.Top.prototype = Object.extend(new Abstract.Insertion('afterBegin'), {
  initializeRange: function() {
    this.range.selectNodeContents(this.element);
    this.range.collapse(true);
  },

  insertContent: function(fragments) {
    fragments.reverse(false).each((function(fragment) {
      this.element.insertBefore(fragment, this.element.firstChild);
    }).bind(this));
  }
});

Insertion.Bottom = Class.create();
Insertion.Bottom.prototype = Object.extend(new Abstract.Insertion('beforeEnd'), {
  initializeRange: function() {
    this.range.selectNodeContents(this.element);
    this.range.collapse(this.element);
  },

  insertContent: function(fragments) {
    fragments.each((function(fragment) {
      this.element.appendChild(fragment);
    }).bind(this));
  }
});

Insertion.After = Class.create();
Insertion.After.prototype = Object.extend(new Abstract.Insertion('afterEnd'), {
  initializeRange: function() {
    this.range.setStartAfter(this.element);
  },

  insertContent: function(fragments) {
    fragments.each((function(fragment) {
      this.element.parentNode.insertBefore(fragment,
        this.element.nextSibling);
    }).bind(this));
  }
});

/*--------------------------------------------------------------------------*/

Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
  initialize: function(element) {
    this.element = $(element);
  },

  _each: function(iterator) {
    this.element.className.split(/\s+/).select(function(name) {
      return name.length > 0;
    })._each(iterator);
  },

  set: function(className) {
    this.element.className = className;
  },

  add: function(classNameToAdd) {
    if (this.include(classNameToAdd)) return;
    this.set(this.toArray().concat(classNameToAdd).join(' '));
  },

  remove: function(classNameToRemove) {
    if (!this.include(classNameToRemove)) return;
    this.set(this.select(function(className) {
      return className != classNameToRemove;
    }).join(' '));
  },

  toString: function() {
    return this.toArray().join(' ');
  }
}

Object.extend(Element.ClassNames.prototype, Enumerable);
var Field = {
  clear: function() {
    for (var i = 0; i < arguments.length; i++)
      $(arguments[i]).value = '';
  },

  focus: function(element) {
    $(element).focus();
  },

  present: function() {
    for (var i = 0; i < arguments.length; i++)
      if ($(arguments[i]).value == '') return false;
    return true;
  },

  select: function(element) {
    $(element).select();
  },

  activate: function(element) {
    element = $(element);
    element.focus();
    if (element.select)
      element.select();
  }
}

/*--------------------------------------------------------------------------*/

var Form = {
  serialize: function(form) {
    var elements = Form.getElements($(form));
    var queryComponents = new Array();

    for (var i = 0; i < elements.length; i++) {
      var queryComponent = Form.Element.serialize(elements[i]);
      if (queryComponent)
        queryComponents.push(queryComponent);
    }

    return queryComponents.join('&');
  },

  getElements: function(form) {
    form = $(form);
    var elements = new Array();

    for (tagName in Form.Element.Serializers) {
      var tagElements = form.getElementsByTagName(tagName);
      for (var j = 0; j < tagElements.length; j++)
        elements.push(tagElements[j]);
    }
    return elements;
  },

  getInputs: function(form, typeName, name) {
    form = $(form);
    var inputs = form.getElementsByTagName('input');

    if (!typeName && !name)
      return inputs;

    var matchingInputs = new Array();
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      if ((typeName && input.type != typeName) ||
          (name && input.name != name))
        continue;
      matchingInputs.push(input);
    }

    return matchingInputs;
  },

  disable: function(form) {
    var elements = Form.getElements(form);
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.blur();
      element.disabled = 'true';
    }
  },

  enable: function(form) {
    var elements = Form.getElements(form);
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.disabled = '';
    }
  },

  findFirstElement: function(form) {
    return Form.getElements(form).find(function(element) {
      return element.type != 'hidden' && !element.disabled &&
        ['input', 'select', 'textarea'].include(element.tagName.toLowerCase());
    });
  },

  focusFirstElement: function(form) {
    Field.activate(Form.findFirstElement(form));
  },

  reset: function(form) {
    $(form).reset();
  }
}

Form.Element = {
  serialize: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    var parameter = Form.Element.Serializers[method](element);

    if (parameter) {
      var key = encodeURIComponent(parameter[0]);
      if (key.length == 0) return;

      if (parameter[1].constructor != Array)
        parameter[1] = [parameter[1]];

      return parameter[1].map(function(value) {
        return key + '=' + encodeURIComponent(value);
      }).join('&');
    }
  },

  getValue: function(element) {
    element = $(element);
    var method = element.tagName.toLowerCase();
    var parameter = Form.Element.Serializers[method](element);

    if (parameter)
      return parameter[1];
  }
}

Form.Element.Serializers = {
  input: function(element) {
    switch (element.type.toLowerCase()) {
      case 'submit':
      case 'hidden':
      case 'password':
      case 'text':
        return Form.Element.Serializers.textarea(element);
      case 'checkbox':
      case 'radio':
        return Form.Element.Serializers.inputSelector(element);
    }
    return false;
  },

  inputSelector: function(element) {
    if (element.checked)
      return [element.name, element.value];
  },

  textarea: function(element) {
    return [element.name, element.value];
  },

  select: function(element) {
    return Form.Element.Serializers[element.type == 'select-one' ?
      'selectOne' : 'selectMany'](element);
  },

  selectOne: function(element) {
    var value = '', opt, index = element.selectedIndex;
    if (index >= 0) {
      opt = element.options[index];
      value = opt.value;
      if (!value && !('value' in opt))
        value = opt.text;
    }
    return [element.name, value];
  },

  selectMany: function(element) {
    var value = new Array();
    for (var i = 0; i < element.length; i++) {
      var opt = element.options[i];
      if (opt.selected) {
        var optValue = opt.value;
        if (!optValue && !('value' in opt))
          optValue = opt.text;
        value.push(optValue);
      }
    }
    return [element.name, value];
  }
}

/*--------------------------------------------------------------------------*/

var $F = Form.Element.getValue;

/*--------------------------------------------------------------------------*/

Abstract.TimedObserver = function() {}
Abstract.TimedObserver.prototype = {
  initialize: function(element, frequency, callback) {
    this.frequency = frequency;
    this.element   = $(element);
    this.callback  = callback;

    this.lastValue = this.getValue();
    this.registerCallback();
  },

  registerCallback: function() {
    setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },

  onTimerEvent: function() {
    var value = this.getValue();
    if (this.lastValue != value) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  }
}

Form.Element.Observer = Class.create();
Form.Element.Observer.prototype = Object.extend(new Abstract.TimedObserver(), {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

Form.Observer = Class.create();
Form.Observer.prototype = Object.extend(new Abstract.TimedObserver(), {
  getValue: function() {
    return Form.serialize(this.element);
  }
});

/*--------------------------------------------------------------------------*/

Abstract.EventObserver = function() {}
Abstract.EventObserver.prototype = {
  initialize: function(element, callback) {
    this.element  = $(element);
    this.callback = callback;

    this.lastValue = this.getValue();
    if (this.element.tagName.toLowerCase() == 'form')
      this.registerFormCallbacks();
    else
      this.registerCallback(this.element);
  },

  onElementEvent: function() {
    var value = this.getValue();
    if (this.lastValue != value) {
      this.callback(this.element, value);
      this.lastValue = value;
    }
  },

  registerFormCallbacks: function() {
    var elements = Form.getElements(this.element);
    for (var i = 0; i < elements.length; i++)
      this.registerCallback(elements[i]);
  },

  registerCallback: function(element) {
    if (element.type) {
      switch (element.type.toLowerCase()) {
        case 'checkbox':
        case 'radio':
          Event.observe(element, 'click', this.onElementEvent.bind(this));
          break;
        case 'password':
        case 'text':
        case 'textarea':
        case 'select-one':
        case 'select-multiple':
          Event.observe(element, 'change', this.onElementEvent.bind(this));
          break;
      }
    }
  }
}

Form.Element.EventObserver = Class.create();
Form.Element.EventObserver.prototype = Object.extend(new Abstract.EventObserver(), {
  getValue: function() {
    return Form.Element.getValue(this.element);
  }
});

Form.EventObserver = Class.create();
Form.EventObserver.prototype = Object.extend(new Abstract.EventObserver(), {
  getValue: function() {
    return Form.serialize(this.element);
  }
});
if (!window.Event) {
  var Event = new Object();
}

Object.extend(Event, {
  KEY_BACKSPACE: 8,
  KEY_TAB:       9,
  KEY_RETURN:   13,
  KEY_ESC:      27,
  KEY_LEFT:     37,
  KEY_UP:       38,
  KEY_RIGHT:    39,
  KEY_DOWN:     40,
  KEY_DELETE:   46,

  element: function(event) {
    return event.target || event.srcElement;
  },

  isLeftClick: function(event) {
    return (((event.which) && (event.which == 1)) ||
            ((event.button) && (event.button == 1)));
  },

  pointerX: function(event) {
    return event.pageX || (event.clientX +
      (document.documentElement.scrollLeft || document.body.scrollLeft));
  },

  pointerY: function(event) {
    return event.pageY || (event.clientY +
      (document.documentElement.scrollTop || document.body.scrollTop));
  },

  stop: function(event) {
    if (event.preventDefault) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.returnValue = false;
      event.cancelBubble = true;
    }
  },

  // find the first node with the given tagName, starting from the
  // node the event was triggered on; traverses the DOM upwards
  findElement: function(event, tagName) {
    var element = Event.element(event);
    while (element.parentNode && (!element.tagName ||
        (element.tagName.toUpperCase() != tagName.toUpperCase())))
      element = element.parentNode;
    return element;
  },

  observers: false,

  _observeAndCache: function(element, name, observer, useCapture) {
    if (!this.observers) this.observers = [];
    if (element.addEventListener) {
      this.observers.push([element, name, observer, useCapture]);
      element.addEventListener(name, observer, useCapture);
    } else if (element.attachEvent) {
      this.observers.push([element, name, observer, useCapture]);
      element.attachEvent('on' + name, observer);
    }
  },

  unloadCache: function() {
    if (!Event.observers) return;
    for (var i = 0; i < Event.observers.length; i++) {
      Event.stopObserving.apply(this, Event.observers[i]);
      Event.observers[i][0] = null;
    }
    Event.observers = false;
  },

  observe: function(element, name, observer, useCapture) {
    var element = $(element);
    useCapture = useCapture || false;

    if (name == 'keypress' &&
        (navigator.appVersion.match(/Konqueror|Safari|KHTML/)
        || element.attachEvent))
      name = 'keydown';

    this._observeAndCache(element, name, observer, useCapture);
  },

  stopObserving: function(element, name, observer, useCapture) {
    var element = $(element);
    useCapture = useCapture || false;

    if (name == 'keypress' &&
        (navigator.appVersion.match(/Konqueror|Safari|KHTML/)
        || element.detachEvent))
      name = 'keydown';

    if (element.removeEventListener) {
      element.removeEventListener(name, observer, useCapture);
    } else if (element.detachEvent) {
      element.detachEvent('on' + name, observer);
    }
  }
});

/* prevent memory leaks in IE */
Event.observe(window, 'unload', Event.unloadCache, false);
var Position = {
  // set to true if needed, warning: firefox performance problems
  // NOT neeeded for page scrolling, only if draggable contained in
  // scrollable elements
  includeScrollOffsets: false,

  // must be called before calling withinIncludingScrolloffset, every time the
  // page is scrolled
  prepare: function() {
    this.deltaX =  window.pageXOffset
                || document.documentElement.scrollLeft
                || document.body.scrollLeft
                || 0;
    this.deltaY =  window.pageYOffset
                || document.documentElement.scrollTop
                || document.body.scrollTop
                || 0;
  },

  realOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.scrollTop  || 0;
      valueL += element.scrollLeft || 0;
      element = element.parentNode;
    } while (element);
    return [valueL, valueT];
  },

  cumulativeOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
    	// edited by Chris Iufer
      if(element.style.position == 'fixed') {
      	
      	valueT += window.pageYOffset + element.offsetTop;
      	valueL += window.pageXOffset + element.offsetLeft;
      	element = null;
      }
      else {
      	valueT += element.offsetTop  || 0;
      	valueL += element.offsetLeft || 0;
      	element = element.offsetParent;
      }
    } while (element);
    return [valueL, valueT];
  },

  positionedOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
      if (element) {
        p = Element.getStyle(element, 'position');
        if (p == 'relative' || p == 'absolute') break;
      }
    } while (element);
    return [valueL, valueT];
  },

  offsetParent: function(element) {
    if (element.offsetParent) return element.offsetParent;
    if (element == document.body) return element;

    while ((element = element.parentNode) && element != document.body)
      if (Element.getStyle(element, 'position') != 'static')
        return element;

    return document.body;
  },

  // caches x/y coordinate pair to use with overlap
  within: function(element, x, y) {
    if (this.includeScrollOffsets )
      return this.withinIncludingScrolloffsets(element, x, y);
    this.xcomp = x;
    this.ycomp = y;
    this.offset = this.cumulativeOffset(element);

    return (y >= this.offset[1] &&
            y <  this.offset[1] + element.offsetHeight &&
            x >= this.offset[0] &&
            x <  this.offset[0] + element.offsetWidth);
  },

  withinIncludingScrolloffsets: function(element, x, y) {
    var offsetcache = this.realOffset(element);

    this.xcomp = x + offsetcache[0] - this.deltaX;
    this.ycomp = y + offsetcache[1] - this.deltaY;
    this.offset = this.cumulativeOffset(element);

    return (this.ycomp >= this.offset[1] &&
            this.ycomp <  this.offset[1] + element.offsetHeight &&
            this.xcomp >= this.offset[0] &&
            this.xcomp <  this.offset[0] + element.offsetWidth);
  },

  // within must be called directly before
  overlap: function(mode, element) {
    if (!mode) return 0;
    if (mode == 'vertical')
      return ((this.offset[1] + element.offsetHeight) - this.ycomp) /
        element.offsetHeight;
    if (mode == 'horizontal')
      return ((this.offset[0] + element.offsetWidth) - this.xcomp) /
        element.offsetWidth;
  },

  clone: function(source, target) {
    source = $(source);
    target = $(target);
    target.style.position = 'absolute';
    var offsets = this.cumulativeOffset(source);
    target.style.top    = offsets[1] + 'px';
    target.style.left   = offsets[0] + 'px';
    target.style.width  = source.offsetWidth + 'px';
    target.style.height = source.offsetHeight + 'px';
  },

  page: function(forElement) {
    var valueT = 0, valueL = 0;

    var element = forElement;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;

      // Safari fix
      if (element.offsetParent==document.body)
        if (Element.getStyle(element,'position')=='absolute') break;

    } while (element = element.offsetParent);

    element = forElement;
    do {
      valueT -= element.scrollTop  || 0;
      valueL -= element.scrollLeft || 0;
    } while (element = element.parentNode);

    return [valueL, valueT];
  },

  clone: function(source, target) {
    var options = Object.extend({
      setLeft:    true,
      setTop:     true,
      setWidth:   true,
      setHeight:  true,
      offsetTop:  0,
      offsetLeft: 0
    }, arguments[2] || {})

    // find page position of source
    source = $(source);
    var p = Position.page(source);

    // find coordinate system to use
    target = $(target);
    var delta = [0, 0];
    var parent = null;
    // delta [0,0] will do fine with position: fixed elements,
    // position:absolute needs offsetParent deltas
    if (Element.getStyle(target,'position') == 'absolute') {
      parent = Position.offsetParent(target);
      delta = Position.page(parent);
    }

    // correct by body offsets (fixes Safari)
    if (parent == document.body) {
      delta[0] -= document.body.offsetLeft;
      delta[1] -= document.body.offsetTop;
    }

    // set position
    if(options.setLeft)   target.style.left  = (p[0] - delta[0] + options.offsetLeft) + 'px';
    if(options.setTop)    target.style.top   = (p[1] - delta[1] + options.offsetTop) + 'px';
    if(options.setWidth)  target.style.width = source.offsetWidth + 'px';
    if(options.setHeight) target.style.height = source.offsetHeight + 'px';
  },

  absolutize: function(element) {
    element = $(element);
    if (element.style.position == 'absolute') return;
    Position.prepare();

    var offsets = Position.positionedOffset(element);
    var top     = offsets[1];
    var left    = offsets[0];
    var width   = element.clientWidth;
    var height  = element.clientHeight;

    element._originalLeft   = left - parseFloat(element.style.left  || 0);
    element._originalTop    = top  - parseFloat(element.style.top || 0);
    element._originalWidth  = element.style.width;
    element._originalHeight = element.style.height;

    element.style.position = 'absolute';
    element.style.top    = top + 'px';;
    element.style.left   = left + 'px';;
    element.style.width  = width + 'px';;
    element.style.height = height + 'px';;
  },

  relativize: function(element) {
    element = $(element);
    if (element.style.position == 'relative') return;
    Position.prepare();

    element.style.position = 'relative';
    var top  = parseFloat(element.style.top  || 0) - (element._originalTop || 0);
    var left = parseFloat(element.style.left || 0) - (element._originalLeft || 0);

    element.style.top    = top + 'px';
    element.style.left   = left + 'px';
    element.style.height = element._originalHeight;
    element.style.width  = element._originalWidth;
  }
}

// Safari returns margins on body which is incorrect if the child is absolutely
// positioned.  For performance reasons, redefine Position.cumulativeOffset for
// KHTML/WebKit only.
if (/Konqueror|Safari|KHTML/.test(navigator.userAgent)) {
  Position.cumulativeOffset = function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      if (element.offsetParent == document.body)
        if (Element.getStyle(element, 'position') == 'absolute') break;

      element = element.offsetParent;
    } while (element);

    return [valueL, valueT];
  }
}// Copyright (c) 2005 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
// 
// See scriptaculous.js for full license.

/*--------------------------------------------------------------------------*/

dropList = new Array();

var Droppables = {
  drops: [],

  remove: function(element) {
    this.drops = this.drops.reject(function(d) { return d.element==$(element) });
  },

  add: function(element) {
    element = $(element);
    var options = Object.extend({
      greedy:     true,
      hoverclass: null  
    }, arguments[1] || {});

    // cache containers
    if(options.containment) {
      options._containers = [];
      var containment = options.containment;
      if((typeof containment == 'object') && 
        (containment.constructor == Array)) {
        containment.each( function(c) { options._containers.push($(c)) });
      } else {
        options._containers.push($(containment));
      }
    }
    
    if(options.accept) options.accept = [options.accept].flatten();

    Element.makePositioned(element); // fix IE
    options.element = element;

    this.drops.push(options);

    dropList[element.id] = this.drops.length - 1;
 
  },

  isContained: function(element, drop) {
    var parentNode = element.parentNode;
    return drop._containers.detect(function(c) { return parentNode == c });
  },

  isAffected: function(point, element, drop) {
    return (
      (drop.element!=element) &&
      ((!drop._containers) ||
        this.isContained(element, drop)) &&
      ((!drop.accept) ||
        (Element.classNames(element).detect( 
          function(v) { return drop.accept.include(v) } ) )) && 
      Position.within(drop.element, point[0], point[1]) );
  },

  deactivate: function(drop) {
    if(drop.hoverclass)
      Element.removeClassName(drop.element, drop.hoverclass);
    this.last_active = null;
  },

  activate: function(drop) {
    if(drop.hoverclass)
      Element.addClassName(drop.element, drop.hoverclass);
    this.last_active = drop;
  },

  show: function(point, element) {
    if(!this.drops.length) return;
    
    if(this.last_active) this.deactivate(this.last_active);
    this.drops.each( function(drop) {
      if(Droppables.isAffected(point, element, drop)) {
        if(drop.onHover)
           drop.onHover(element, drop.element, Position.overlap(drop.overlap, drop.element));
        if(drop.greedy) { 
          Droppables.activate(drop);
          throw $break;
        }
      }
    });
  },

  fire: function(event, element) {
    if(!this.last_active) return;
    Position.prepare();

    if (this.isAffected([Event.pointerX(event), Event.pointerY(event)], element, this.last_active))
      if (this.last_active.onDrop) 
        this.last_active.onDrop(element, this.last_active.element, event);
  },

  reset: function() {
    if(this.last_active)
      this.deactivate(this.last_active);
  }
}

var Draggables = {
  drags: [],
  observers: [],
  
  register: function(draggable) {
    if(this.drags.length == 0) {
      this.eventMouseUp   = this.endDrag.bindAsEventListener(this);
      this.eventMouseMove = this.updateDrag.bindAsEventListener(this);
      this.eventKeypress  = this.keyPress.bindAsEventListener(this);
      
      Event.observe(document, "mouseup", this.eventMouseUp);
      Event.observe(document, "mousemove", this.eventMouseMove);
      Event.observe(document, "keypress", this.eventKeypress);
    }
    this.drags.push(draggable);
  },
  
  unregister: function(draggable) {
    this.drags = this.drags.reject(function(d) { return d==draggable });
    if(this.drags.length == 0) {
      Event.stopObserving(document, "mouseup", this.eventMouseUp);
      Event.stopObserving(document, "mousemove", this.eventMouseMove);
      Event.stopObserving(document, "keypress", this.eventKeypress);
    }
  },
  
  activate: function(draggable) {
    window.focus(); // allows keypress events if window isn't currently focused, fails for Safari
    this.activeDraggable = draggable;
  },
  
  deactivate: function(draggbale) {
    this.activeDraggable = null;
  },
  
  updateDrag: function(event) {
    if(!this.activeDraggable) return;
    var pointer = [Event.pointerX(event), Event.pointerY(event)];
    // Mozilla-based browsers fire successive mousemove events with
    // the same coordinates, prevent needless redrawing (moz bug?)
    if(this._lastPointer && (this._lastPointer.inspect() == pointer.inspect())) return;
    this._lastPointer = pointer;
    this.activeDraggable.updateDrag(event, pointer);
  },
  
  endDrag: function(event) {
    if(!this.activeDraggable) return;
    this._lastPointer = null;
    this.activeDraggable.endDrag(event);
    this.activeDraggable = null;
  },
  
  keyPress: function(event) {
    if(this.activeDraggable)
      this.activeDraggable.keyPress(event);
  },
  
  addObserver: function(observer) {
    this.observers.push(observer);
    this._cacheObserverCallbacks();
  },
  
  removeObserver: function(element) {  // element instead of observer fixes mem leaks
    this.observers = this.observers.reject( function(o) { return o.element==element });
    this._cacheObserverCallbacks();
  },
  
  notify: function(eventName, draggable, event) {  // 'onStart', 'onEnd', 'onDrag'
    if(this[eventName+'Count'] > 0)
      this.observers.each( function(o) {
        if(o[eventName]) o[eventName](eventName, draggable, event);
      });
  },
  
  _cacheObserverCallbacks: function() {
    ['onStart','onEnd','onDrag'].each( function(eventName) {
      Draggables[eventName+'Count'] = Draggables.observers.select(
        function(o) { return o[eventName]; }
      ).length;
    });
  }
}

/*--------------------------------------------------------------------------*/

var Draggable = Class.create();
Draggable.prototype = {
  initialize: function(element) {
    var options = Object.extend({
      handle: false,
      starteffect: function(element) {
      	Element.addClassName(element, 'dragging');
        new Effect.Opacity(element, {duration:0.2, from:1.0, to:0.7}); 
      },
      reverteffect: function(element, top_offset, left_offset) {
        var dur = Math.sqrt(Math.abs(top_offset^2)+Math.abs(left_offset^2))*0.02;
        element._revert = new Effect.Move(element, { x: -left_offset, y: -top_offset, duration: dur});
      },
      endeffect: function(element) { 
      	
        new Effect.Opacity(element, {duration:0.2, from:0.7, to:1.0}); 
        Element.removeClassName(element, 'dragging');
      },
      zindex: 1000,
      revert: false,
      snap: false   // false, or xy or [x,y] or function(x,y){ return [x,y] }
    }, arguments[1] || {});

    this.element = $(element);
    
    if(options.handle && (typeof options.handle == 'string'))
      this.handle = Element.childrenWithClassName(this.element, options.handle)[0];  
    if(!this.handle) this.handle = $(options.handle);
    if(!this.handle) this.handle = this.element;

    Element.makePositioned(this.element); // fix IE    

    this.delta    = this.currentDelta();
    this.options  = options;
    this.dragging = false;   

    this.eventMouseDown = this.initDrag.bindAsEventListener(this);
    Event.observe(this.handle, "mousedown", this.eventMouseDown);
    
    Draggables.register(this);
  },
  
  destroy: function() {
    Event.stopObserving(this.handle, "mousedown", this.eventMouseDown);
    Draggables.unregister(this);
  },
  
  currentDelta: function() {
    return([
      parseInt(Element.getStyle(this.element,'left') || '0'),
      parseInt(Element.getStyle(this.element,'top') || '0')]);
  },
  
  initDrag: function(event) {
    if(Event.isLeftClick(event)) {    
      // abort on form elements, fixes a Firefox issue
      var src = Event.element(event);
      if(src.tagName && (
        src.tagName=='INPUT' ||
        src.tagName=='SELECT' ||
        src.tagName=='BUTTON' ||
        src.tagName=='TEXTAREA')) return;
        
      if(this.element._revert) {
        this.element._revert.cancel();
        this.element._revert = null;
      }
      
      var pointer = [Event.pointerX(event), Event.pointerY(event)];
      var pos     = Position.cumulativeOffset(this.element);
      this.offset = [0,1].map( function(i) { return (pointer[i] - pos[i]) });
      
      Draggables.activate(this);
      Event.stop(event);
    }
  },
  
  startDrag: function(event) {
    this.dragging = true;
    
    if(this.options.zindex) {
      this.originalZ = parseInt(Element.getStyle(this.element,'z-index') || 0);
      this.element.style.zIndex = this.options.zindex;
    }
    
    if(this.options.ghosting) {
      this._clone = this.element.cloneNode(true);
      Position.absolutize(this.element);
      this.element.parentNode.insertBefore(this._clone, this.element);
    }
    
    Draggables.notify('onStart', this, event);
    if(this.options.starteffect) this.options.starteffect(this.element);
  },
  
  updateDrag: function(event, pointer) {
    if(!this.dragging) this.startDrag(event);
    Position.prepare();
    Droppables.show(pointer, this.element);
    Draggables.notify('onDrag', this, event);
    this.draw(pointer);
    if(this.options.change) this.options.change(this);
    
    // fix AppleWebKit rendering
    if(navigator.appVersion.indexOf('AppleWebKit')>0) window.scrollBy(0,0);
    Event.stop(event);
  },
  
  finishDrag: function(event, success) {
    this.dragging = false;

    if(this.options.ghosting) {
      Position.relativize(this.element);
      Element.remove(this._clone);
      this._clone = null;
    }

    if(success) Droppables.fire(event, this.element);
    Draggables.notify('onEnd', this, event);

    var revert = this.options.revert;
    if(revert && typeof revert == 'function') revert = revert(this.element);
    
    var d = this.currentDelta();
    if(revert && this.options.reverteffect) {
      this.options.reverteffect(this.element, 
        d[1]-this.delta[1], d[0]-this.delta[0]);
    } else {
      this.delta = d;
    }

    if(this.options.zindex)
      this.element.style.zIndex = this.originalZ;

    if(this.options.endeffect) 
      this.options.endeffect(this.element);

    Draggables.deactivate(this);
    Droppables.reset();
  },
  
  keyPress: function(event) {
    if(!event.keyCode==Event.KEY_ESC) return;
    this.finishDrag(event, false);
    Event.stop(event);
  },
  
  endDrag: function(event) {
    if(!this.dragging) return;
    this.finishDrag(event, true);
    Event.stop(event);
  },
  
  draw: function(point) {
    var pos = Position.cumulativeOffset(this.element);
    var d = this.currentDelta();
    pos[0] -= d[0]; pos[1] -= d[1];
    
    var p = [0,1].map(function(i){ return (point[i]-pos[i]-this.offset[i]) }.bind(this));
    
    if(this.options.snap) {
      if(typeof this.options.snap == 'function') {
        p = this.options.snap(p[0],p[1]);
      } else {
      if(this.options.snap instanceof Array) {
        p = p.map( function(v, i) {
          return Math.round(v/this.options.snap[i])*this.options.snap[i] }.bind(this))
      } else {
        p = p.map( function(v) {
          return Math.round(v/this.options.snap)*this.options.snap }.bind(this))
      }
    }}
    
    var style = this.element.style;
    if((!this.options.constraint) || (this.options.constraint=='horizontal'))
      style.left = p[0] + "px";
    if((!this.options.constraint) || (this.options.constraint=='vertical'))
      style.top  = p[1] + "px";
    if(style.visibility=="hidden") style.visibility = ""; // fix gecko rendering
  }
}

/*--------------------------------------------------------------------------*/

var SortableObserver = Class.create();
SortableObserver.prototype = {
  initialize: function(element, observer) {
    this.element   = $(element);
    this.observer  = observer;
    this.lastValue = Sortable.serialize(this.element);
  },
  
  onStart: function() {
    this.lastValue = Sortable.serialize(this.element);
  },
  
  onEnd: function() {
    Sortable.unmark();
    if(this.lastValue != Sortable.serialize(this.element))
      this.observer(this.element)
  }
}

var Sortable = {
  sortables: new Array(),
  
  options: function(element){
    element = $(element);
    return this.sortables.detect(function(s) { return s.element == element });
  },
  
  destroy: function(element){
    element = $(element);
    this.sortables.findAll(function(s) { return s.element == element }).each(function(s){
      Draggables.removeObserver(s.element);
      s.droppables.each(function(d){ Droppables.remove(d) });
      s.draggables.invoke('destroy');
    });
    this.sortables = this.sortables.reject(function(s) { return s.element == element });
  },
  
  create: function(element) {
    element = $(element);
    var options = Object.extend({ 
      element:     element,
      tag:         'li',       // assumes li children, override with tag: 'tagname'
      dropOnEmpty: false,
      tree:        false,      // fixme: unimplemented
      overlap:     'vertical', // one of 'vertical', 'horizontal'
      constraint:  'vertical', // one of 'vertical', 'horizontal', false
      containment: element,    // also takes array of elements (or id's); or false
      handle:      false,      // or a CSS class
      only:        false,
      hoverclass:  null,
      ghosting:    false,
      format:      null,
      onChange:    Prototype.emptyFunction,
      onUpdate:    Prototype.emptyFunction
    }, arguments[1] || {});

    // clear any old sortable with same element
    this.destroy(element);

    // build options for the draggables
    var options_for_draggable = {
      revert:      true,
      ghosting:    options.ghosting,
      constraint:  options.constraint,
      handle:      options.handle };

    if(options.starteffect)
      options_for_draggable.starteffect = options.starteffect;

    if(options.reverteffect)
      options_for_draggable.reverteffect = options.reverteffect;
    else
      if(options.ghosting) options_for_draggable.reverteffect = function(element) {
        element.style.top  = 0;
        element.style.left = 0;
      };

    if(options.endeffect)
      options_for_draggable.endeffect = options.endeffect;

    if(options.zindex)
      options_for_draggable.zindex = options.zindex;

    // build options for the droppables  
    var options_for_droppable = {
      overlap:     options.overlap,
      containment: options.containment,
      hoverclass:  options.hoverclass,
      onHover:     Sortable.onHover,
      greedy:      !options.dropOnEmpty
    }

    // fix for gecko engine
    Element.cleanWhitespace(element); 

    options.draggables = [];
    options.droppables = [];

    // make it so

    // drop on empty handling
    if(options.dropOnEmpty) {
      Droppables.add(element,
        {containment: options.containment, onHover: Sortable.onEmptyHover, greedy: false});
      options.droppables.push(element);
    }

    (this.findElements(element, options) || []).each( function(e) {
      // handles are per-draggable
      var handle = options.handle ? 
        Element.childrenWithClassName(e, options.handle)[0] : e;    
      options.draggables.push(
        new Draggable(e, Object.extend(options_for_draggable, { handle: handle })));
      Droppables.add(e, options_for_droppable);
      options.droppables.push(e);      
    });

    // keep reference
    this.sortables.push(options);

    // for onupdate
    Draggables.addObserver(new SortableObserver(element, options.onUpdate));

  },

  // return all suitable-for-sortable elements in a guaranteed order
  findElements: function(element, options) {
    if(!element.hasChildNodes()) return null;
    var elements = [];
    $A(element.childNodes).each( function(e) {
      if(e.tagName && e.tagName.toUpperCase()==options.tag.toUpperCase() &&
        (!options.only || (Element.hasClassName(e, options.only))))
          elements.push(e);
      if(options.tree) {
        var grandchildren = this.findElements(e, options);
        if(grandchildren) elements.push(grandchildren);
      }
    });

    return (elements.length>0 ? elements.flatten() : null);
  },

  onHover: function(element, dropon, overlap) {
    if(overlap>0.5) {
      Sortable.mark(dropon, 'before');
      if(dropon.previousSibling != element) {
        var oldParentNode = element.parentNode;
        element.style.visibility = "hidden"; // fix gecko rendering
        dropon.parentNode.insertBefore(element, dropon);
        if(dropon.parentNode!=oldParentNode) 
          Sortable.options(oldParentNode).onChange(element);
        Sortable.options(dropon.parentNode).onChange(element);
      }
    } else {
      Sortable.mark(dropon, 'after');
      var nextElement = dropon.nextSibling || null;
      if(nextElement != element) {
        var oldParentNode = element.parentNode;
        element.style.visibility = "hidden"; // fix gecko rendering
        dropon.parentNode.insertBefore(element, nextElement);
        if(dropon.parentNode!=oldParentNode) 
          Sortable.options(oldParentNode).onChange(element);
        Sortable.options(dropon.parentNode).onChange(element);
      }
    }
  },

  onEmptyHover: function(element, dropon) {
    if(element.parentNode!=dropon) {
      var oldParentNode = element.parentNode;
      dropon.appendChild(element);
      Sortable.options(oldParentNode).onChange(element);
      Sortable.options(dropon).onChange(element);
    }
  },

  unmark: function() {
    if(Sortable._marker) Element.hide(Sortable._marker);
  },

  mark: function(dropon, position) {
    // mark on ghosting only
    var sortable = Sortable.options(dropon.parentNode);
    if(sortable && !sortable.ghosting) return; 

    if(!Sortable._marker) {
      Sortable._marker = $('dropmarker') || document.createElement('DIV');
      Element.hide(Sortable._marker);
      Element.addClassName(Sortable._marker, 'dropmarker');
      Sortable._marker.style.position = 'absolute';
      document.getElementsByTagName("body").item(0).appendChild(Sortable._marker);
    }    
    var offsets = Position.cumulativeOffset(dropon);
    Sortable._marker.style.left = offsets[0] + 'px';
    Sortable._marker.style.top = offsets[1] + 'px';
    
    if(position=='after')
      if(sortable.overlap == 'horizontal') 
        Sortable._marker.style.left = (offsets[0]+dropon.clientWidth) + 'px';
      else
        Sortable._marker.style.top = (offsets[1]+dropon.clientHeight) + 'px';
    
    Element.show(Sortable._marker);
  },

  serialize: function(element) {
    element = $(element);
    var sortableOptions = this.options(element);
    var options = Object.extend({
      tag:  sortableOptions.tag,
      only: sortableOptions.only,
      name: element.id,
      format: sortableOptions.format || /^[^_]*_(.*)$/
    }, arguments[1] || {});
    return $(this.findElements(element, options) || []).map( function(item) {
      return (encodeURIComponent(options.name) + "[]=" + 
              encodeURIComponent(item.id.match(options.format) ? item.id.match(options.format)[1] : ''));
    }).join("&");
  }
}// Copyright (c) 2005 Thomas Fuchs (http://script.aculo.us, http://mir.aculo.us)
// Contributors:
//  Justin Palmer (http://encytemedia.com/)
//  Mark Pilgrim (http://diveintomark.org/)
//  Martin Bialasinki
// 
// See scriptaculous.js for full license.  

/* ------------- element ext -------------- */  
 
// converts rgb() and #xxx to #xxxxxx format,  
// returns self (or first argument) if not convertable  
String.prototype.parseColor = function() {  
  var color = '#';  
  if(this.slice(0,4) == 'rgb(') {  
    var cols = this.slice(4,this.length-1).split(',');  
    var i=0; do { color += parseInt(cols[i]).toColorPart() } while (++i<3);  
  } else {  
    if(this.slice(0,1) == '#') {  
      if(this.length==4) for(var i=1;i<4;i++) color += (this.charAt(i) + this.charAt(i)).toLowerCase();  
      if(this.length==7) color = this.toLowerCase();  
    }  
  }  
  return(color.length==7 ? color : (arguments[0] || this));  
}

Element.collectTextNodes = function(element) {  
  return $A($(element).childNodes).collect( function(node) {
    return (node.nodeType==3 ? node.nodeValue : 
      (node.hasChildNodes() ? Element.collectTextNodes(node) : ''));
  }).flatten().join('');
}

Element.collectTextNodesIgnoreClass = function(element, className) {  
  return $A($(element).childNodes).collect( function(node) {
    return (node.nodeType==3 ? node.nodeValue : 
      ((node.hasChildNodes() && !Element.hasClassName(node,className)) ? 
        Element.collectTextNodes(node) : ''));
  }).flatten().join('');
}

Element.setStyle = function(element, style) {
  element = $(element);
  for(k in style) element.style[k.camelize()] = style[k];
}

Element.setContentZoom = function(element, percent) {  
  Element.setStyle(element, {fontSize: (percent/100) + 'em'});   
  if(navigator.appVersion.indexOf('AppleWebKit')>0) window.scrollBy(0,0);  
}

Element.getOpacity = function(element){  
  var opacity;
  if (opacity = Element.getStyle(element, 'opacity'))  
    return parseFloat(opacity);  
  if (opacity = (Element.getStyle(element, 'filter') || '').match(/alpha\(opacity=(.*)\)/))  
    if(opacity[1]) return parseFloat(opacity[1]) / 100;  
  return 1.0;  
}

Element.setOpacity = function(element, value){  
  element= $(element);  
  if (value == 1){
    Element.setStyle(element, { opacity: 
      (/Gecko/.test(navigator.userAgent) && !/Konqueror|Safari|KHTML/.test(navigator.userAgent)) ? 
      0.999999 : null });
    if(/MSIE/.test(navigator.userAgent))  
      Element.setStyle(element, {filter: Element.getStyle(element,'filter').replace(/alpha\([^\)]*\)/gi,'')});  
  } else {  
    if(value < 0.00001) value = 0;  
    Element.setStyle(element, {opacity: value});
    if(/MSIE/.test(navigator.userAgent))  
     Element.setStyle(element, 
       { filter: Element.getStyle(element,'filter').replace(/alpha\([^\)]*\)/gi,'') +
                 'alpha(opacity='+value*100+')' });  
  }   
}  
 
Element.getInlineOpacity = function(element){  
  return $(element).style.opacity || '';
}  

Element.childrenWithClassName = function(element, className) {  
  return $A($(element).getElementsByTagName('*')).select(
    function(c) { return Element.hasClassName(c, className) });
}

Array.prototype.call = function() {
  var args = arguments;
  this.each(function(f){ f.apply(this, args) });
}

/*--------------------------------------------------------------------------*/

var Effect = {
  tagifyText: function(element) {
    var tagifyStyle = 'position:relative';
    if(/MSIE/.test(navigator.userAgent)) tagifyStyle += ';zoom:1';
    element = $(element);
    $A(element.childNodes).each( function(child) {
      if(child.nodeType==3) {
        child.nodeValue.toArray().each( function(character) {
          element.insertBefore(
            Builder.node('span',{style: tagifyStyle},
              character == ' ' ? String.fromCharCode(160) : character), 
              child);
        });
        Element.remove(child);
      }
    });
  },
  multiple: function(element, effect) {
    var elements;
    if(((typeof element == 'object') || 
        (typeof element == 'function')) && 
       (element.length))
      elements = element;
    else
      elements = $(element).childNodes;
      
    var options = Object.extend({
      speed: 0.1,
      delay: 0.0
    }, arguments[2] || {});
    var masterDelay = options.delay;

    $A(elements).each( function(element, index) {
      new effect(element, Object.extend(options, { delay: index * options.speed + masterDelay }));
    });
  },
  PAIRS: {
    'slide':  ['SlideDown','SlideUp'],
    'blind':  ['BlindDown','BlindUp'],
    'appear': ['Appear','Fade']
  },
  toggle: function(element, effect) {
    element = $(element);
    effect = (effect || 'appear').toLowerCase();
    var options = Object.extend({
      queue: { position:'end', scope:(element.id || 'global') }
    }, arguments[2] || {});
    Effect[Element.visible(element) ? 
      Effect.PAIRS[effect][1] : Effect.PAIRS[effect][0]](element, options);
  }
};

var Effect2 = Effect; // deprecated

/* ------------- transitions ------------- */

Effect.Transitions = {}

Effect.Transitions.linear = function(pos) {
  return pos;
}
Effect.Transitions.sinoidal = function(pos) {
  return (-Math.cos(pos*Math.PI)/2) + 0.5;
}
Effect.Transitions.reverse  = function(pos) {
  return 1-pos;
}
Effect.Transitions.flicker = function(pos) {
  return ((-Math.cos(pos*Math.PI)/4) + 0.75) + Math.random()/4;
}
Effect.Transitions.wobble = function(pos) {
  return (-Math.cos(pos*Math.PI*(9*pos))/2) + 0.5;
}
Effect.Transitions.pulse = function(pos) {
  return (Math.floor(pos*10) % 2 == 0 ? 
    (pos*10-Math.floor(pos*10)) : 1-(pos*10-Math.floor(pos*10)));
}
Effect.Transitions.none = function(pos) {
  return 0;
}
Effect.Transitions.full = function(pos) {
  return 1;
}

/* ------------- core effects ------------- */

Effect.ScopedQueue = Class.create();
Object.extend(Object.extend(Effect.ScopedQueue.prototype, Enumerable), {
  initialize: function() {
    this.effects  = [];
    this.interval = null;
  },
  _each: function(iterator) {
    this.effects._each(iterator);
  },
  add: function(effect) {
    var timestamp = new Date().getTime();
    
    var position = (typeof effect.options.queue == 'string') ? 
      effect.options.queue : effect.options.queue.position;
    
    switch(position) {
      case 'front':
        // move unstarted effects after this effect  
        this.effects.findAll(function(e){ return e.state=='idle' }).each( function(e) {
            e.startOn  += effect.finishOn;
            e.finishOn += effect.finishOn;
          });
        break;
      case 'end':
        // start effect after last queued effect has finished
        timestamp = this.effects.pluck('finishOn').max() || timestamp;
        break;
    }
    
    effect.startOn  += timestamp;
    effect.finishOn += timestamp;
    this.effects.push(effect);
    if(!this.interval) 
      this.interval = setInterval(this.loop.bind(this), 40);
  },
  remove: function(effect) {
    this.effects = this.effects.reject(function(e) { return e==effect });
    if(this.effects.length == 0) {
      clearInterval(this.interval);
      this.interval = null;
    }
  },
  loop: function() {
    var timePos = new Date().getTime();
    this.effects.invoke('loop', timePos);
  }
});

Effect.Queues = {
  instances: $H(),
  get: function(queueName) {
    if(typeof queueName != 'string') return queueName;
    
    if(!this.instances[queueName])
      this.instances[queueName] = new Effect.ScopedQueue();
      
    return this.instances[queueName];
  }
}
Effect.Queue = Effect.Queues.get('global');

Effect.DefaultOptions = {
  transition: Effect.Transitions.sinoidal,
  duration:   1.0,   // seconds
  fps:        25.0,  // max. 25fps due to Effect.Queue implementation
  sync:       false, // true for combining
  from:       0.0,
  to:         1.0,
  delay:      0.0,
  queue:      'parallel'
}

Effect.Base = function() {};
Effect.Base.prototype = {
  position: null,
  start: function(options) {
    this.options      = Object.extend(Object.extend({},Effect.DefaultOptions), options || {});
    this.currentFrame = 0;
    this.state        = 'idle';
    this.startOn      = this.options.delay*1000;
    this.finishOn     = this.startOn + (this.options.duration*1000);
    this.event('beforeStart');
    if(!this.options.sync)
      Effect.Queues.get(typeof this.options.queue == 'string' ? 
        'global' : this.options.queue.scope).add(this);
  },
  loop: function(timePos) {
    if(timePos >= this.startOn) {
      if(timePos >= this.finishOn) {
        this.render(1.0);
        this.cancel();
        this.event('beforeFinish');
        if(this.finish) this.finish(); 
        this.event('afterFinish');
        return;  
      }
      var pos   = (timePos - this.startOn) / (this.finishOn - this.startOn);
      var frame = Math.round(pos * this.options.fps * this.options.duration);
      if(frame > this.currentFrame) {
        this.render(pos);
        this.currentFrame = frame;
      }
    }
  },
  render: function(pos) {
    if(this.state == 'idle') {
      this.state = 'running';
      this.event('beforeSetup');
      if(this.setup) this.setup();
      this.event('afterSetup');
    }
    if(this.state == 'running') {
      if(this.options.transition) pos = this.options.transition(pos);
      pos *= (this.options.to-this.options.from);
      pos += this.options.from;
      this.position = pos;
      this.event('beforeUpdate');
      if(this.update) this.update(pos);
      this.event('afterUpdate');
    }
  },
  cancel: function() {
    if(!this.options.sync)
      Effect.Queues.get(typeof this.options.queue == 'string' ? 
        'global' : this.options.queue.scope).remove(this);
    this.state = 'finished';
  },
  event: function(eventName) {
    if(this.options[eventName + 'Internal']) this.options[eventName + 'Internal'](this);
    if(this.options[eventName]) this.options[eventName](this);
  },
  inspect: function() {
    return '#<Effect:' + $H(this).inspect() + ',options:' + $H(this.options).inspect() + '>';
  }
}

Effect.Parallel = Class.create();
Object.extend(Object.extend(Effect.Parallel.prototype, Effect.Base.prototype), {
  initialize: function(effects) {
    this.effects = effects || [];
    this.start(arguments[1]);
  },
  update: function(position) {
    this.effects.invoke('render', position);
  },
  finish: function(position) {
    this.effects.each( function(effect) {
      effect.render(1.0);
      effect.cancel();
      effect.event('beforeFinish');
      if(effect.finish) effect.finish(position);
      effect.event('afterFinish');
    });
  }
});

Effect.Opacity = Class.create();
Object.extend(Object.extend(Effect.Opacity.prototype, Effect.Base.prototype), {
  initialize: function(element) {
    this.element = $(element);
    // make this work on IE on elements without 'layout'
    if(/MSIE/.test(navigator.userAgent) && (!this.element.hasLayout))
      Element.setStyle(this.element, {zoom: 1});
    var options = Object.extend({
      from: Element.getOpacity(this.element) || 0.0,
      to:   1.0
    }, arguments[1] || {});
    this.start(options);
  },
  update: function(position) {
    Element.setOpacity(this.element, position);
  }
});

Effect.Move = Class.create();
Object.extend(Object.extend(Effect.Move.prototype, Effect.Base.prototype), {
  initialize: function(element) {
    this.element = $(element);
    var options = Object.extend({
      x:    0,
      y:    0,
      mode: 'relative'
    }, arguments[1] || {});
    this.start(options);
  },
  setup: function() {
    // Bug in Opera: Opera returns the "real" position of a static element or
    // relative element that does not have top/left explicitly set.
    // ==> Always set top and left for position relative elements in your stylesheets 
    // (to 0 if you do not need them) 
    Element.makePositioned(this.element);
    this.originalLeft = parseFloat(Element.getStyle(this.element,'left') || '0');
    this.originalTop  = parseFloat(Element.getStyle(this.element,'top')  || '0');
    if(this.options.mode == 'absolute') {
      // absolute movement, so we need to calc deltaX and deltaY
      this.options.x = this.options.x - this.originalLeft;
      this.options.y = this.options.y - this.originalTop;
    }
  },
  update: function(position) {
    Element.setStyle(this.element, {
      left: this.options.x  * position + this.originalLeft + 'px',
      top:  this.options.y  * position + this.originalTop  + 'px'
    });
  }
});

// for backwards compatibility
Effect.MoveBy = function(element, toTop, toLeft) {
  return new Effect.Move(element, 
    Object.extend({ x: toLeft, y: toTop }, arguments[3] || {}));
};

Effect.Scale = Class.create();
Object.extend(Object.extend(Effect.Scale.prototype, Effect.Base.prototype), {
  initialize: function(element, percent) {
    this.element = $(element)
    var options = Object.extend({
      scaleX: true,
      scaleY: true,
      scaleContent: true,
      scaleFromCenter: false,
      scaleMode: 'box',        // 'box' or 'contents' or {} with provided values
      scaleFrom: 100.0,
      scaleTo:   percent
    }, arguments[2] || {});
    this.start(options);
  },
  setup: function() {
    this.restoreAfterFinish = this.options.restoreAfterFinish || false;
    this.elementPositioning = Element.getStyle(this.element,'position');
    
    this.originalStyle = {};
    ['top','left','width','height','fontSize'].each( function(k) {
      this.originalStyle[k] = this.element.style[k];
    }.bind(this));
      
    this.originalTop  = this.element.offsetTop;
    this.originalLeft = this.element.offsetLeft;
    
    var fontSize = Element.getStyle(this.element,'font-size') || '100%';
    ['em','px','%'].each( function(fontSizeType) {
      if(fontSize.indexOf(fontSizeType)>0) {
        this.fontSize     = parseFloat(fontSize);
        this.fontSizeType = fontSizeType;
      }
    }.bind(this));
    
    this.factor = (this.options.scaleTo - this.options.scaleFrom)/100;
    
    this.dims = null;
    if(this.options.scaleMode=='box')
      this.dims = [this.element.offsetHeight, this.element.offsetWidth];
    if(/^content/.test(this.options.scaleMode))
      this.dims = [this.element.scrollHeight, this.element.scrollWidth];
    if(!this.dims)
      this.dims = [this.options.scaleMode.originalHeight,
                   this.options.scaleMode.originalWidth];
  },
  update: function(position) {
    var currentScale = (this.options.scaleFrom/100.0) + (this.factor * position);
    if(this.options.scaleContent && this.fontSize)
      Element.setStyle(this.element, {fontSize: this.fontSize * currentScale + this.fontSizeType });
    this.setDimensions(this.dims[0] * currentScale, this.dims[1] * currentScale);
  },
  finish: function(position) {
    if (this.restoreAfterFinish) Element.setStyle(this.element, this.originalStyle);
  },
  setDimensions: function(height, width) {
    var d = {};
    if(this.options.scaleX) d.width = width + 'px';
    if(this.options.scaleY) d.height = height + 'px';
    if(this.options.scaleFromCenter) {
      var topd  = (height - this.dims[0])/2;
      var leftd = (width  - this.dims[1])/2;
      if(this.elementPositioning == 'absolute') {
        if(this.options.scaleY) d.top = this.originalTop-topd + 'px';
        if(this.options.scaleX) d.left = this.originalLeft-leftd + 'px';
      } else {
        if(this.options.scaleY) d.top = -topd + 'px';
        if(this.options.scaleX) d.left = -leftd + 'px';
      }
    }
    Element.setStyle(this.element, d);
  }
});

Effect.Highlight = Class.create();
Object.extend(Object.extend(Effect.Highlight.prototype, Effect.Base.prototype), {
  initialize: function(element) {
    this.element = $(element);
    var options = Object.extend({ startcolor: '#ffff99' }, arguments[1] || {});
    this.start(options);
  },
  setup: function() {
    // Prevent executing on elements not in the layout flow
    if(Element.getStyle(this.element, 'display')=='none') { this.cancel(); return; }
    // Disable background image during the effect
    this.oldStyle = {
      backgroundImage: Element.getStyle(this.element, 'background-image') };
    Element.setStyle(this.element, {backgroundImage: 'none'});
    if(!this.options.endcolor)
      this.options.endcolor = Element.getStyle(this.element, 'background-color').parseColor('#ffffff');
    if(!this.options.restorecolor)
      this.options.restorecolor = Element.getStyle(this.element, 'background-color');
    // init color calculations
    this._base  = $R(0,2).map(function(i){ return parseInt(this.options.startcolor.slice(i*2+1,i*2+3),16) }.bind(this));
    this._delta = $R(0,2).map(function(i){ return parseInt(this.options.endcolor.slice(i*2+1,i*2+3),16)-this._base[i] }.bind(this));
  },
  update: function(position) {
    Element.setStyle(this.element,{backgroundColor: $R(0,2).inject('#',function(m,v,i){
      return m+(Math.round(this._base[i]+(this._delta[i]*position)).toColorPart()); }.bind(this)) });
  },
  finish: function() {
    Element.setStyle(this.element, Object.extend(this.oldStyle, {
      backgroundColor: this.options.restorecolor
    }));
  }
});

Effect.ScrollTo = Class.create();
Object.extend(Object.extend(Effect.ScrollTo.prototype, Effect.Base.prototype), {
  initialize: function(element) {
    this.element = $(element);
    this.start(arguments[1] || {});
  },
  setup: function() {
    Position.prepare();
    var offsets = Position.cumulativeOffset(this.element);
    if(this.options.offset) offsets[1] += this.options.offset;
    var max = window.innerHeight ? 
      window.height - window.innerHeight :
      document.body.scrollHeight - 
        (document.documentElement.clientHeight ? 
          document.documentElement.clientHeight : document.body.clientHeight);
    this.scrollStart = Position.deltaY;
    this.delta = (offsets[1] > max ? max : offsets[1]) - this.scrollStart;
  },
  update: function(position) {
    Position.prepare();
    window.scrollTo(Position.deltaX, 
      this.scrollStart + (position*this.delta));
  }
});

/* ------------- combination effects ------------- */

Effect.Fade = function(element) {
  var oldOpacity = Element.getInlineOpacity(element);
  var options = Object.extend({
  from: Element.getOpacity(element) || 1.0,
  to:   0.0,
  afterFinishInternal: function(effect) { with(Element) { 
    if(effect.options.to!=0) return;
    hide(effect.element);
    setStyle(effect.element, {opacity: oldOpacity}); }}
  }, arguments[1] || {});
  return new Effect.Opacity(element,options);
}

Effect.Appear = function(element) {
  var options = Object.extend({
  from: (Element.getStyle(element, 'display') == 'none' ? 0.0 : Element.getOpacity(element) || 0.0),
  to:   1.0,
  beforeSetup: function(effect) { with(Element) {
    setOpacity(effect.element, effect.options.from);
    show(effect.element); }}
  }, arguments[1] || {});
  return new Effect.Opacity(element,options);
}

Effect.Puff = function(element) {
  element = $(element);
  var oldStyle = { opacity: Element.getInlineOpacity(element), position: Element.getStyle(element, 'position') };
  return new Effect.Parallel(
   [ new Effect.Scale(element, 200, 
      { sync: true, scaleFromCenter: true, scaleContent: true, restoreAfterFinish: true }), 
     new Effect.Opacity(element, { sync: true, to: 0.0 } ) ], 
     Object.extend({ duration: 1.0, 
      beforeSetupInternal: function(effect) { with(Element) {
        setStyle(effect.effects[0].element, {position: 'absolute'}); }},
      afterFinishInternal: function(effect) { with(Element) {
         hide(effect.effects[0].element);
         setStyle(effect.effects[0].element, oldStyle); }}
     }, arguments[1] || {})
   );
}

Effect.BlindUp = function(element) {
  element = $(element);
  Element.makeClipping(element);
  return new Effect.Scale(element, 0, 
    Object.extend({ scaleContent: false, 
      scaleX: false, 
      restoreAfterFinish: true,
      afterFinishInternal: function(effect) { with(Element) {
        [hide, undoClipping].call(effect.element); }} 
    }, arguments[1] || {})
  );
}

Effect.BlindDown = function(element) {
  element = $(element);
  var oldHeight = Element.getStyle(element, 'height');
  var elementDimensions = Element.getDimensions(element);
  return new Effect.Scale(element, 100, 
    Object.extend({ scaleContent: false, 
      scaleX: false,
      scaleFrom: 0,
      scaleMode: {originalHeight: elementDimensions.height, originalWidth: elementDimensions.width},
      restoreAfterFinish: true,
      afterSetup: function(effect) { with(Element) {
        makeClipping(effect.element);
        setStyle(effect.element, {height: '0px'});
        show(effect.element); 
      }},  
      afterFinishInternal: function(effect) { with(Element) {
        undoClipping(effect.element);
        setStyle(effect.element, {height: oldHeight});
      }}
    }, arguments[1] || {})
  );
}

Effect.SwitchOff = function(element) {
  element = $(element);
  var oldOpacity = Element.getInlineOpacity(element);
  return new Effect.Appear(element, { 
    duration: 0.4,
    from: 0,
    transition: Effect.Transitions.flicker,
    afterFinishInternal: function(effect) {
      new Effect.Scale(effect.element, 1, { 
        duration: 0.3, scaleFromCenter: true,
        scaleX: false, scaleContent: false, restoreAfterFinish: true,
        beforeSetup: function(effect) { with(Element) {
          [makePositioned,makeClipping].call(effect.element);
        }},
        afterFinishInternal: function(effect) { with(Element) {
          [hide,undoClipping,undoPositioned].call(effect.element);
          setStyle(effect.element, {opacity: oldOpacity});
        }}
      })
    }
  });
}

Effect.DropOut = function(element) {
  element = $(element);
  var oldStyle = {
    top: Element.getStyle(element, 'top'),
    left: Element.getStyle(element, 'left'),
    opacity: Element.getInlineOpacity(element) };
  return new Effect.Parallel(
    [ new Effect.Move(element, {x: 0, y: 100, sync: true }), 
      new Effect.Opacity(element, { sync: true, to: 0.0 }) ],
    Object.extend(
      { duration: 0.5,
        beforeSetup: function(effect) { with(Element) {
          makePositioned(effect.effects[0].element); }},
        afterFinishInternal: function(effect) { with(Element) {
          [hide, undoPositioned].call(effect.effects[0].element);
          setStyle(effect.effects[0].element, oldStyle); }} 
      }, arguments[1] || {}));
}

Effect.Shake = function(element) {
  element = $(element);
  var oldStyle = {
    top: Element.getStyle(element, 'top'),
    left: Element.getStyle(element, 'left') };
	  return new Effect.Move(element, 
	    { x:  20, y: 0, duration: 0.05, afterFinishInternal: function(effect) {
	  new Effect.Move(effect.element,
	    { x: -40, y: 0, duration: 0.1,  afterFinishInternal: function(effect) {
	  new Effect.Move(effect.element,
	    { x:  40, y: 0, duration: 0.1,  afterFinishInternal: function(effect) {
	  new Effect.Move(effect.element,
	    { x: -40, y: 0, duration: 0.1,  afterFinishInternal: function(effect) {
	  new Effect.Move(effect.element,
	    { x:  40, y: 0, duration: 0.1,  afterFinishInternal: function(effect) {
	  new Effect.Move(effect.element,
	    { x: -20, y: 0, duration: 0.05, afterFinishInternal: function(effect) { with(Element) {
        undoPositioned(effect.element);
        setStyle(effect.element, oldStyle);
  }}}) }}) }}) }}) }}) }});
}

Effect.SlideDown = function(element) {
  element = $(element);
  Element.cleanWhitespace(element);
  // SlideDown need to have the content of the element wrapped in a container element with fixed height!
  var oldInnerBottom = Element.getStyle(element.firstChild, 'bottom');
  var elementDimensions = Element.getDimensions(element);
  return new Effect.Scale(element, 100, Object.extend({ 
    scaleContent: false, 
    scaleX: false, 
    scaleFrom: 0,
    scaleMode: {originalHeight: elementDimensions.height, originalWidth: elementDimensions.width},
    restoreAfterFinish: true,
    afterSetup: function(effect) { with(Element) {
      makePositioned(effect.element);
      makePositioned(effect.element.firstChild);
      if(window.opera) setStyle(effect.element, {top: ''});
      makeClipping(effect.element);
      setStyle(effect.element, {height: '0px'});
      show(element); }},
    afterUpdateInternal: function(effect) { with(Element) {
      setStyle(effect.element.firstChild, {bottom:
        (effect.dims[0] - effect.element.clientHeight) + 'px' }); }},
    afterFinishInternal: function(effect) { with(Element) {
      undoClipping(effect.element); 
      undoPositioned(effect.element.firstChild);
      undoPositioned(effect.element);
      setStyle(effect.element.firstChild, {bottom: oldInnerBottom}); }}
    }, arguments[1] || {})
  );
}
  
Effect.SlideUp = function(element) {
  element = $(element);
  Element.cleanWhitespace(element);
  var oldInnerBottom = Element.getStyle(element.firstChild, 'bottom');
  return new Effect.Scale(element, 0, 
   Object.extend({ scaleContent: false, 
    scaleX: false, 
    scaleMode: 'box',
    scaleFrom: 100,
    restoreAfterFinish: true,
    beforeStartInternal: function(effect) { with(Element) {
      makePositioned(effect.element);
      makePositioned(effect.element.firstChild);
      if(window.opera) setStyle(effect.element, {top: ''});
      makeClipping(effect.element);
      show(element); }},  
    afterUpdateInternal: function(effect) { with(Element) {
      setStyle(effect.element.firstChild, {bottom:
        (effect.dims[0] - effect.element.clientHeight) + 'px' }); }},
    afterFinishInternal: function(effect) { with(Element) {
        [hide, undoClipping].call(effect.element); 
        undoPositioned(effect.element.firstChild);
        undoPositioned(effect.element);
        setStyle(effect.element.firstChild, {bottom: oldInnerBottom}); }}
   }, arguments[1] || {})
  );
}

// Bug in opera makes the TD containing this element expand for a instance after finish 
Effect.Squish = function(element) {
  return new Effect.Scale(element, window.opera ? 1 : 0, 
    { restoreAfterFinish: true,
      beforeSetup: function(effect) { with(Element) {
        makeClipping(effect.element); }},  
      afterFinishInternal: function(effect) { with(Element) {
        hide(effect.element); 
        undoClipping(effect.element); }}
  });
}

Effect.Grow = function(element) {
  element = $(element);
  var options = Object.extend({
    direction: 'center',
    moveTransistion: Effect.Transitions.sinoidal,
    scaleTransition: Effect.Transitions.sinoidal,
    opacityTransition: Effect.Transitions.full
  }, arguments[1] || {});
  var oldStyle = {
    top: element.style.top,
    left: element.style.left,
    height: element.style.height,
    width: element.style.width,
    opacity: Element.getInlineOpacity(element) };

  var dims = Element.getDimensions(element);    
  var initialMoveX, initialMoveY;
  var moveX, moveY;
  
  switch (options.direction) {
    case 'top-left':
      initialMoveX = initialMoveY = moveX = moveY = 0; 
      break;
    case 'top-right':
      initialMoveX = dims.width;
      initialMoveY = moveY = 0;
      moveX = -dims.width;
      break;
    case 'bottom-left':
      initialMoveX = moveX = 0;
      initialMoveY = dims.height;
      moveY = -dims.height;
      break;
    case 'bottom-right':
      initialMoveX = dims.width;
      initialMoveY = dims.height;
      moveX = -dims.width;
      moveY = -dims.height;
      break;
    case 'center':
      initialMoveX = dims.width / 2;
      initialMoveY = dims.height / 2;
      moveX = -dims.width / 2;
      moveY = -dims.height / 2;
      break;
  }
  
  return new Effect.Move(element, {
    x: initialMoveX,
    y: initialMoveY,
    duration: 0.01, 
    beforeSetup: function(effect) { with(Element) {
      hide(effect.element);
      makeClipping(effect.element);
      makePositioned(effect.element);
    }},
    afterFinishInternal: function(effect) {
      new Effect.Parallel(
        [ new Effect.Opacity(effect.element, { sync: true, to: 1.0, from: 0.0, transition: options.opacityTransition }),
          new Effect.Move(effect.element, { x: moveX, y: moveY, sync: true, transition: options.moveTransition }),
          new Effect.Scale(effect.element, 100, {
            scaleMode: { originalHeight: dims.height, originalWidth: dims.width }, 
            sync: true, scaleFrom: window.opera ? 1 : 0, transition: options.scaleTransition, restoreAfterFinish: true})
        ], Object.extend({
             beforeSetup: function(effect) { with(Element) {
               setStyle(effect.effects[0].element, {height: '0px'});
               show(effect.effects[0].element); }},
             afterFinishInternal: function(effect) { with(Element) {
               [undoClipping, undoPositioned].call(effect.effects[0].element); 
               setStyle(effect.effects[0].element, oldStyle); }}
           }, options)
      )
    }
  });
}

Effect.Shrink = function(element) {
  element = $(element);
  var options = Object.extend({
    direction: 'center',
    moveTransistion: Effect.Transitions.sinoidal,
    scaleTransition: Effect.Transitions.sinoidal,
    opacityTransition: Effect.Transitions.none
  }, arguments[1] || {});
  var oldStyle = {
    top: element.style.top,
    left: element.style.left,
    height: element.style.height,
    width: element.style.width,
    opacity: Element.getInlineOpacity(element) };

  var dims = Element.getDimensions(element);
  var moveX, moveY;
  
  switch (options.direction) {
    case 'top-left':
      moveX = moveY = 0;
      break;
    case 'top-right':
      moveX = dims.width;
      moveY = 0;
      break;
    case 'bottom-left':
      moveX = 0;
      moveY = dims.height;
      break;
    case 'bottom-right':
      moveX = dims.width;
      moveY = dims.height;
      break;
    case 'center':  
      moveX = dims.width / 2;
      moveY = dims.height / 2;
      break;
  }
  
  return new Effect.Parallel(
    [ new Effect.Opacity(element, { sync: true, to: 0.0, from: 1.0, transition: options.opacityTransition }),
      new Effect.Scale(element, window.opera ? 1 : 0, { sync: true, transition: options.scaleTransition, restoreAfterFinish: true}),
      new Effect.Move(element, { x: moveX, y: moveY, sync: true, transition: options.moveTransition })
    ], Object.extend({            
         beforeStartInternal: function(effect) { with(Element) {
           [makePositioned, makeClipping].call(effect.effects[0].element) }},
         afterFinishInternal: function(effect) { with(Element) {
           [hide, undoClipping, undoPositioned].call(effect.effects[0].element);
           setStyle(effect.effects[0].element, oldStyle); }}
       }, options)
  );
}

Effect.Pulsate = function(element) {
  element = $(element);
  var options    = arguments[1] || {};
  var oldOpacity = Element.getInlineOpacity(element);
  var transition = options.transition || Effect.Transitions.sinoidal;
  var reverser   = function(pos){ return transition(1-Effect.Transitions.pulse(pos)) };
  reverser.bind(transition);
  return new Effect.Opacity(element, 
    Object.extend(Object.extend({  duration: 3.0, from: 0,
      afterFinishInternal: function(effect) { Element.setStyle(effect.element, {opacity: oldOpacity}); }
    }, options), {transition: reverser}));
}

Effect.Fold = function(element) {
  element = $(element);
  var oldStyle = {
    top: element.style.top,
    left: element.style.left,
    width: element.style.width,
    height: element.style.height };
  Element.makeClipping(element);
  return new Effect.Scale(element, 5, Object.extend({   
    scaleContent: false,
    scaleX: false,
    afterFinishInternal: function(effect) {
    new Effect.Scale(element, 1, { 
      scaleContent: false, 
      scaleY: false,
      afterFinishInternal: function(effect) { with(Element) {
        [hide, undoClipping].call(effect.element); 
        setStyle(effect.element, oldStyle);
      }} });
  }}, arguments[1] || {}));
}
var Search = Class.create();Search.prototype = {	initialize: function(parent) {		this.parentElement = $(parent);		this.name = "Search Results:";		this.children = new Array();		this.readonly = false;		this.open = false;		this.createSearch();	},	createSearch: function() {		this.element = document.createElement('div');		this.span =    document.createElement('span');		this.link =    document.createElement('a');				Element.addClassName(this.element, 'directory');		Element.addClassName(this.element, 'search');		Element.addClassName(this.span, 'search');								// create a generic spinner		this.spinner = document.createElement('img');		this.spinner.src = spinnerIcon;		this.spinner.style.display="none";		Element.addClassName(this.spinner, 'spinner');				// lets make the collapse expand indicator		this.mark = document.createElement('img');		this.mark.src = vcollapsed;		Element.addClassName(this.mark, 'mark');				this.link.href = "javascript:go();";		this.link.innerHTML = this.name;		this.display ? this.link.innerHTML = this.display : null;				Element.addClassName(this.link, 'link');		this.del = document.createElement('a');		this.del.href = "javascript:go()";		this.del.innerHTML = "close";		Element.addClassName(this.del, 'del');		// Events		this.mark.onclick = this.openOrClose.bind(this);					this.span.ondblclick = this.openOrClose.bind(this);		this.del.onclick = this.hide.bind(this);		this.link.onselectstart = function() {return false; };				this.span.appendChild(this.link);		this.span.appendChild(this.mark);		this.span.appendChild(this.del);		this.span.appendChild(this.spinner);		this.element.appendChild(this.span);									this.element.id = "searchresults";		this.element.object = this;		this.element.style.display = "none";				this.parentElement.appendChild(this.element);	},		openOrClose: function() {		if(this.open) {			this.element.style.height="20px"; 			this.element.style.overflow = "hidden";			this.mark.src = vcollapsed;			this.open = false;		}		else {			this.open = true;			this.element.style.height="auto";			this.mark.src = vexpanded;		}	},	show: function() {		//Effect.Appear(this.element.id);		this.element.style.display = "block";	},	hide: function() {		this.open=false;		Effect.Fade(this.element.id);		//this.element.style.display = "none";	},	start: function(string) {		this.clearContents();				this.show();		this.element.style.height="auto";		this.mark.src = vexpanded;				var term = $('searchbar').value || string;		this.link.innerHTML = this.name + " <em>" + term + "</em>";		this.spinner.style.display = "block";		var params = $H({ relay: 'search', terms: term });		//plusAjax();		var ajax = new Ajax.Request(FC.URL, {			onSuccess: this.start_handler.bind(this),			method: 'post',			parameters: params.toQueryString(),			onFailusre: function() {showError(ER.ajax); }		});	},	start_handler: function(response) {		this.open = true;			this.spinner.style.display = "none";		this.mark.src = vexpanded;		var json_data = response.responseText;				eval("var jsonObject = ("+json_data+")");		for(var i=0; i < jsonObject.bindings.length; i++){			var newFile = new File(jsonObject.bindings[i].id, jsonObject.bindings[i].name, jsonObject.bindings[i].flags, $('searchresults'), jsonObject.bindings[i].date);			this.children.push(newFile);		}	},	clearContents: function () {		this.open = false;		while(this.children.length > 0) {			this.removeChild(this.children[0], 0);		}	},	removeChild: function (child, index) {		if(!index) {			for(var i=0; i< this.children.length; i++) {				if(this.children[i] == child){ var index = i; break; }			}		}		this.children.splice(index, 1);		// remove my droppable		Element.remove(child.element);		// and finally get rid of me		delete child;		}};function monitorSearch(event) {	alert(event);	var charCode = (event.charCode) ? event.charCode : ((event.which) ? event.which : event.keyCode);	switch(charCode) {		case Event.KEY_RETURN:			doSearch();			break;	}}// Copyright (c) 2006 Chris Iufer & David Barshow (http://ecosmear.com/relay)

var FC = {
	URL: '/admin/files/fs',
	TYPES: new Array('file','directory'),
	SELECTEDOBJECT: null,
	SHOWALL: false,
	SCRIPTSRC: location.href,
	SEARCHOBJ: null,
	NEXTPATH: null,
	AJAXCALL: 0,
	UPLOADURL: '/upload.pl',
	DEBUG:false
};

var Directory = Class.create();
Directory.prototype = {

	initialize: function (path, name, flag, parentElement, virtual, scheme, displayname) {
		this.path = path;
		this.type = 'directory';
		this.name = name;
		this.id = this.path;
		this.flag = flag;
		this.virtual = virtual || false;
		this.open = false;
		this.selected = false;
		this.changed = false;
		this.timer = null;
		this.interval = 1000;
		this.children = new Array();
		
		this.path == '' ? this.isRoot = true : this.isRoot = false;
		this.parentElement = parentElement;
		this.parentElement.object ? this.parentObject = this.parentElement.object :null;

		if(scheme) this.readonly = (scheme == 'read');
		else if(this.parentObject) this.readonly = this.parentObject.readonly;
		else this.readonly = true;
		
		displayname ? this.display = displayname: null;	
		this.createDirectory();
		FC.SHOWALL || this.virtual == "true" ? this.getContents() : this.virtual == "closed" ? this.virtual = true : null;
	},
	
	createDirectory: function () {
		this.element = document.createElement('div');
		this.link =    document.createElement('a');
		this.icon = document.createElement('img');
		this.handle = document.createElement('div');
		Element.addClassName(this.handle, 'handle');

		this.spinner = document.createElement('img');
		this.spinner.src = spinnerIcon;
		this.spinner.style.display="none";
		Element.addClassName(this.spinner, 'spinner');
		
		this.span =    document.createElement('span');
		this.icon.src = folderIcon;
		Element.addClassName(this.icon, 'icon');
		
		this.mark = document.createElement('img');
		this.virtual ? this.mark.src = vcollapsed : this.mark.src = collapsed;
		Element.addClassName(this.mark, 'mark');
		
		this.link.href = "javascript:go();";
		this.link.title = this.id;
		this.link.innerHTML = this.name;
		this.display ? this.link.innerHTML = this.display : null;
		
		Element.addClassName(this.link, this.flag);
		Element.addClassName(this.link, 'link');

		this.del = document.createElement('a');
		this.del.href = "javascript:go()";
		this.del.innerHTML = "delete";
		this.del.style.display = "none";
		Element.addClassName(this.del, 'del');
		
		this.note = document.createElement('span');
		this.note.innerHTML = '(read-only)';
		Element.addClassName(this.note, 'note');

		// Events
		this.mark.onclick = this.openOrClose.bindAsEventListener(this);			
		this.icon.onmousedown = this.select.bindAsEventListener(this);
		this.icon.ondblclick = this.openOrClose.bindAsEventListener(this);
		this.span.onmousedown = this.select.bindAsEventListener(this);
		this.link.onmousedown = this.select.bindAsEventListener(this);
		this.span.ondblclick = this.openOrClose.bindAsEventListener(this);

		!this.readonly ? this.del.onclick = this.unlink.bindAsEventListener(this) : null;
		this.link.onselectstart = function() {return false; }
		this.handle.appendChild(this.icon);
		this.handle.appendChild(this.link);
		this.span.appendChild(this.mark);
		this.span.appendChild(this.handle);
		
		if(this.readonly) this.span.appendChild(this.note);
		if(!this.virtual && !this.readonly ) {
			this.span.appendChild(this.del);
		}
		this.span.appendChild(this.spinner);
		this.element.appendChild(this.span);
				
		if (this.isRoot) this.span.style.display = "none";
		
		this.element.id = "root" + this.id;
		this.element.object = this;
		
		Element.addClassName(this.element, this.type);
		if(this.virtual) {
			Element.addClassName(this.element, 'virtual');
			Element.addClassName(this.span, 'virtual');
		}
		if(this.readonly) {
			Element.addClassName(this.element, 'read');
			Element.addClassName(this.span, 'read');
		}				
		this.parentElement.appendChild(this.element);	
		if(!this.isRoot && !this.readonly){
			if(!this.virtual) new Draggable(this.element.id, {revert:true, handle:'handle'});
			Droppables.add(this.element.id, { accept: FC.TYPES, hoverclass: 'hover', onDrop: this.moveTo.bind(this) });
			this.resetHierarchy();
		}
		
	 },
	 
	getContents: function () {
		if(this.opening) return false;
		this.opening = true;
		var params = $H({ relay: 'getFolder', path: this.path });
		this.showActivity();
		var ajax = new Ajax.Request(FC.URL, {
			onSuccess: this.getContents_handler.bind(this),
			method: 'get', 
			parameters: params.toQueryString(), 
			onFailure: function() { showError(ER.ajax); }
		});
	
	},

	getContents_handler: function (response) {
		this.open = true;
		Element.addClassName(this.span, 'open');
		this.opening = false;
		this.virtual ? this.mark.src = vexpanded : this.mark.src = expanded;		
		this.hideActivity();
		var json_data = response.responseText;
		eval("var jsonObject = ("+json_data+")");
		if(jsonObject.bindings.length == 0) {
			this.addBlank(); return true;
		}		
		if(jsonObject.bindings[0].error) 
			this.parentObject.update();
		for(var i=0; i < jsonObject.bindings.length; i++){
			this.addChild(jsonObject.bindings[i]);
		}
		if (this.andPick && i > 0) this.children[this.andPick].select();
		if (FC.NEXTPATH && !this.isRoot) { parsePath(FC.NEXTPATH); }


	},
	
	update: function () {
		if (this.open) {
			var params = $H({ relay: 'getFolder', path: this.path });
			this.showActivity();
			var ajax = new Ajax.Request(FC.URL,{
				onSuccess : this.update_handler.bind(this),
				method: 'get',
				parameters: params.toQueryString(),
				onFailure: function() { showError(ER.ajax); }
			});
		}
		else this.getContents();
	},

	update_handler: function(response) {
		this.hideActivity();
		this.open = true;
		var json_data = response.responseText; 
		eval("var jsonObject = ("+json_data+")");		
		if(jsonObject.bindings.length > 0) { this.removeBlank(); } else this.addBlank();
		
		for(var i=0; i < this.children.length; i++) {
			var found = false;			
			for (var j=0; j < jsonObject.bindings.length; j++) {
				if(this.children[i].id == jsonObject.bindings[j].id || this.children[i].id == jsonObject.bindings[j].path) {
					found = true;
					break;
				}
			}

			if (found) {
				if (this.children[i].name != jsonObject.bindings[j].name  || this.children[i].flag != jsonObject.bindings[j].flags && this.children[i].type == 'file') {
						this.children[i].name = jsonObject.bindings[j].name;
						this.children[i].flag = jsonObject.bindings[j].flags;
						this.children[i].refresh();
				}
				jsonObject.bindings.splice(j, 1);				
			}
			else { 
				this.removeChild(this.children[i], i); 
				i--;
			}
		}
		for (var k=0; k < jsonObject.bindings.length; k++) { 
			this.addChild(jsonObject.bindings[k]);
		}
		if (this.andPick && i > 0) this.children[this.andPick].select(); 
		if (FC.NEXTPATH) { parsePath(FC.NEXTPATH); }
	},
		
	openOrClose: function () {
			this.open ? this.clearContents() : this.getContents();
	},
	
	resetHierarchy: function () {
		if (this.parentObject.type == "directory" && this.parentObject.isRoot == false) {
			Droppables.remove(this.parentElement);
			Droppables.add(this.parentElement.id, { accept: FC.TYPES, hoverclass: 'hover', onDrop: this.parentObject.moveTo.bind(this.parentObject) });
			this.parentObject.resetHierarchy();
		}
	},
		
	clearContents: function () {
		this.removeBlank();
		while(this.children.length > 0) {
			(this.children[0].type == 'directory' && this.children[0].hasChildren()) ? this.children[0].clearContents() : this.removeChild(this.children[0], 0);
		}
		this.open = false;
		Element.removeClassName(this.span, 'open');
		this.virtual ? this.mark.src = vcollapsed : this.mark.src = collapsed;
	},

	removeChild: function (child, index) {
		if(!index) {
			for(var i=0; i< this.children.length; i++) {
				if(this.children[i] == child){ var index = i; break; }
			}
		}
		this.children.splice(index, 1);
		if(child.type == 'directory') Droppables.remove(child.id);
		Element.remove(child.element);
	},
	
	clear: function () { this.parentObject.removeChild(this); },

	addChild:  function (child) {
		if (child.type == 'file') {
			var newFile = new File(child.id, child.name, child.flags, this.element, child.date);
			this.children.push(newFile);
		}
		else if(child.type == 'directory') {
			var newDir = new Directory(child.path, child.name, child.flags, this.element, child.virtual, child.scheme, child.displayname);			
			this.children.push(newDir);
		}
		else return 0;
	 },
	
	moveTo: function (element) { 
		Element.removeClassName(this.element, 'hover');
		if (element.object.parentObject == this) { return false; }
		if ( element.object.type == 'directory' ) {
			var params = $H({ 
				relay: 'folderMove', 
				name: element.object.name, 
				path: element.object.parentObject.path, 
				newpath: this.path
			});
			FC.SEARCHOBJ = this;
			FC.NEXTPATH = '/'+ element.object.name;
			
			element.object.clearContents();	
			element.object.clear();
			var ajax = new Ajax.Request(FC.URL, {
				onSuccess: this.update.bind(this), 
				method: 'get', 
				parameters: params.toQueryString(), 
				onFailure: function() { showError(ER.ajax); }
			});

		} else {
			var params = $H({ 
				relay: 'fileMove', 
				fileid: element.object.id, 
				path: this.path 
			});
			FC.SEARCHOBJ = this;
			FC.NEXTPATH = '/'+ element.object.name;
			if(!element.object.search) {
				element.object.clear();
				//delete element.object;
			}
			var ajax = new Ajax.Request(FC.URL,{
				onSuccess: this.update.bind(this),
				method: 'get', 
				parameters: params.toQueryString(), 
				onFailure: function() { showError(ER.ajax); }
			});
		}		
						
	},
	
	select: function (event) {
		$('uploadPath').value = this.path;
		$('uploadstatus').innerHTML = "<em>Destination</em> <span id='dest'>"+this.path+"</span>";
		this.del.style.display = "block";
		if(FC.SELECTEDOBJECT != null && FC.SELECTEDOBJECT != this) FC.SELECTEDOBJECT.deselect(); 
		window.onkeypress = this.select_handler.bindAsEventListener(this);
		FC.SELECTEDOBJECT = this;		
		Element.addClassName(this.span, 'selected');
		
		if ($('meta').prevElement != this.path ) this.getMeta();
		return false;
	},
	
	select_handler: function (event) {
		var charCode = (event.charCode) ? event.charCode : ((event.which) ? event.which : event.keyCode);
		switch(charCode) {
			//case Event.KEY_RETURN:
			//	this.showRename();
			//	break;
			case Event.KEY_DOWN:
				this.parentObject.nextChild(this);
				break;
			case Event.KEY_UP:
				this.parentObject.prevChild(this);
				break;
			case Event.KEY_RIGHT:
				if(this.open) this.children[0].select(); 
				else { this.openOrClose(); this.andPick = '0'; }
				break;
			case Event.KEY_LEFT:
				this.parentObject.select(this);
				break;
			}
  	},
	
	deselect: function () {
			this.timer = null;
			window.onkeypress = null;
			this.del.style.display = 'none';
			Element.removeClassName(this.span, 'selected');
			this.selected = false; 
			this.clearRename();
	},
	
	getMeta: function () {
		$('meta').prevElement = this.path;
		var params = $H({ relay: 'getFolderMeta', path: this.path });
		var ajax = new Ajax.Request(FC.URL,{
			onLoading: showMetaSpinner(), 
			onSuccess: this.getMeta_handler.bind(this),
			method: 'get', 
			parameters: params.toQueryString(), 
			onFailure: function() { showError(ER.ajax); }
		});
	},
	
	getMeta_handler: function(response) {
		var json_data = response.responseText;		
		eval("var jsonObject = ("+json_data+")");
		if (jsonObject.bindings.length >= 1) {
			var meta = { name: jsonObject.bindings[0].name, size: jsonObject.bindings[0].size, path: this.path};
			updateMeta(meta);
		}
		else updateMeta({ ' ':'No Info to display'});	
	
	},
	
		
	nextChild: function(child) {
		var pos = this.checkIfChild(child);
		if(pos != this.children.length-1) this.children[pos+1].select();
		else if(!this.isRoot) this.parentObject.nextChild(this);
	},
	prevChild: function(child) {
		var pos = this.checkIfChild(child);
		if(pos != 0) this.children[pos-1].select();
		else if(pos == 0 && !this.isRoot) this.select();
	},
	
	checkIfChild: function (child) {
		if(this.hasChildren()){
		for (var i=0;i < this.children.length;i++){
			if(this.children[i].id == child.id) return i;
		} 
		return false;
		} else return false;
	},

	clearRename: function () {
		if(this.renameIsOpen) {
			Element.remove(this.newName);
			this.link.style.display = "block";
			this.renameIsOpen = false;
		}
	},
	
	rename_handler: function (event, direct) {
		if(!direct) { var charCode = (event.charCode) ? event.charCode : ((event.which) ? event.which : event.keyCode); 
		if (charCode == Event.KEY_ESC) this.clearRename(); }
		if (charCode == Event.KEY_RETURN || direct) {
			var params = $H({ relay : 'folderRename', path  : this.parentObject.path, name  : this.name, newname: direct || this.newName.value });
			this.link.innerHTML = params.newname;
			this.clearRename();
			
			var ajax = new Ajax.Request(FC.URL, {
				onComplete: this.select.bind(this),
				onSuccess: this.parentObject.update.bind(this.parentObject),
				method: 'get', 
				parameters: params.toQueryString(), 
				onFailure: function() { showError(ER.ajax); }
			});
		}		

	},
	
	showRename: function () {
		if(this.readonly) return false;
		if(this.virtual) return false;
		this.renameIsOpen = true;
		this.newName = document.createElement('input');
		this.newName.type = 'text';
		this.newName.name = this.id;
		this.newName.value = this.name;
		window.onkeypress = this.rename_handler.bindAsEventListener(this);
		Element.addClassName(this.newName, 'renamefield');
		this.link.style.display = "none";
		this.span.appendChild(this.newName);
		Field.select(this.newName);
	},
	
	showActivity: function () { 
		this.spinner.style.display = "block";
	},
	
	hideActivity: function () { 
		this.spinner.style.display = "none";
	},

	hasChildren: function () {
		if (this.children.length > 0) return true;
		else return false;
	},
	
	unlink: function () {
		if(this.readonly) return false;
		if(this.virtual) return false;
		if(confirm('delete the folder '+this.name+ '?')) {
			var params = $H({ relay: 'folderDelete', folder: this.path });
			this.parentObject.prevChild(this);
			var ajax = new Ajax.Request(FC.URL,{
				onComplete: this.parentObject.nextChild(this),
				onSuccess: this.clear.bind(this),
				method: 'get', 
				parameters: params.toQueryString(), 
				onFailure: function() { showError(ER.ajax); }
			});
		}
	},
	
	addBlank: function() {
		if(this.blankisshowing) return false;
		this.blankisshowing = true;
		this.blank = document.createElement('div');
		this.blank.innerHTML = "This folder is empty";
		Element.addClassName(this.blank, 'blank');
		this.element.appendChild(this.blank);
	},
	
	removeBlank: function() {
		if(this.blankisshowing) {
			Element.remove(this.blank);
			this.blankisshowing = false;
		}
	}
	
};

var File = Class.create();
File.prototype = {
	
	initialize: function (id, name, flag, parentElement, date) {
		this.type = 'file';
		this.fileDate = date;
		this.name = name;
		this.id = id;
		this.flag = flag;
		this.selected = false;
		this.timer = null;
		this.interval = 1000;
		this.parentElement = parentElement;
		this.parentObject = parentElement.object;
		this.readonly = this.parentObject.readonly;
		this.parentElement.id == 'searchresults' ? this.search = true : this.search = false;
		this.createFile();
	},
	
	createFile: function () { 
		this.element = document.createElement('div');
		this.span =    document.createElement('span');
		this.link =    document.createElement('a');
		this.icon = document.createElement('img');
		this.handle = document.createElement('div');
		Element.addClassName(this.handle, 'handle');
				
		this.flag != 'normal' ? this.icon.src = "/images/fs/"+this.flag+".png" : this.icon.src= fileIcon;
		Element.addClassName(this.icon, 'icon');
		this.link.title = this.id;
		this.link.innerHTML = this.name;
		Element.addClassName(this.link, this.flag);
		Element.addClassName(this.link, 'link');
		
		this.date = document.createElement('span');
		this.date.innerHTML = this.fileDate;
		Element.addClassName(this.date, 'date');
		
		this.dl = document.createElement('a');
		this.dl.href = "javascript:go()";
		this.dl.style.display = "none";			
		this.dl.title = "Add "+this.name+" to the download queue";
		Element.addClassName(this.dl, 'add');
	
		this.del = document.createElement('a');
		this.del.href = "javascript:go()"
		this.del.style.display = "none";			
		this.del.title = "Delete "+this.name;
		this.del.innerHTML = "&nbsp;&nbsp;delete";
		Element.addClassName(this.del, 'del');

		this.span.onmousedown = this.select.bind(this);
		this.link.onmousedown = this.select.bindAsEventListener(this);
		this.icon.onmousedown = this.select.bind(this);
		this.link.ondblclick = this.download.bindAsEventListener(this);
		this.icon.ondblclick = this.download.bindAsEventListener(this);
		this.dl.onclick = this.addDl.bind(this);
		this.del.onclick = this.unlink.bind(this);
	
		this.handle.appendChild(this.icon);
		this.handle.appendChild(this.link);
		this.span.appendChild(this.handle);
		this.span.appendChild(this.date);
		if(!this.readonly) {
			this.span.appendChild(this.del);
		}
		this.span.appendChild(this.dl);
		this.element.appendChild(this.span);
		
		this.search ? this.element.id = 'sid'+this.id : this.element.id = 'fid'+this.id;
		this.element.object = this;
		
		Element.addClassName(this.element, 'file');
		this.parentElement.appendChild(this.element);
		!this.readonly ? new Draggable(this.element.id, {revert:true, handle:'handle'}) : null;

	},
	appearTools: function () { Effect.Appear(this.del.id); },
	fadeTools:   function () { this.del.style.display="none";  },
	
	addDl : function() { cart.add(this.element); },
	
	download: function () { location.href = FC.URL + '?relay=getFile&fileid=' + this.id; },
	
	refresh: function () {
		this.link.className = 'link';
		this.link.innerHTML = this.name;
		this.flag != 'normal' ? this.icon.src = "/images/fs/"+this.flag+".png" : this.icon.src= fileIcon;
		
		Element.addClassName(this.link, this.flag);
	},
	
	select: function (ev) {
		$('uploadPath').value = this.parentObject.path;
		$('uploadstatus').innerHTML = "<em>Destination</em> <span id='dest'>"+this.parentObject.path+"</span>";
		
		this.del.style.display = this.dl.style.display = "block";
		if(FC.SELECTEDOBJECT != null && FC.SELECTEDOBJECT != this) FC.SELECTEDOBJECT.deselect(); 
		window.onkeypress = this.select_handler.bindAsEventListener(this);
		FC.SELECTEDOBJECT = this;
		Element.addClassName(this.span, 'selected');

		if ($('meta').prevElement != this.id) { this.getMeta(); }
		return false;
	},

	select_handler: function (event) {
		var charCode = (event.charCode) ? event.charCode : ((event.which) ? event.which : event.keyCode); 
		//if (charCode == Event.KEY_RETURN) this.showRename();
		if (charCode == Event.KEY_DOWN) this.parentObject.nextChild(this); 
		else if (charCode == Event.KEY_UP) this.parentObject.prevChild(this); 
		else if (charCode == Event.KEY_LEFT) this.parentObject.select(this);				
  	},
	
	deselect: function () {
			this.timer = null;
			window.onkeypress = null;
			this.del.style.display = this.dl.style.display ="none";
			Element.removeClassName(this.span, 'selected');
			this.selected = false; 
			this.clearRename();
	},
	
	getMeta: function () {
		$('meta').prevElement = this.id;
	
		var params = $H({ relay: 'getMeta', fileid: this.id });
		var ajax = new Ajax.Request(FC.URL,{
			onLoading: showMetaSpinner(), 
			onSuccess: this.getMeta_handler.bind(this),
			method: 'get', 
			parameters: params.toQueryString(), 
			onFailure: function() { showError(ER.ajax); }
		});
	},
	
	getMeta_handler: function (response) {
		var json_data = response.responseText;		
		eval("var jsonObject = ("+json_data+")");
		var meta = {	edit		: jsonObject.bindings[0].edit,
						filename  : jsonObject.bindings[1].filename,
						date		: jsonObject.bindings[1].date,
						downloads : jsonObject.bindings[1].downloads,
						flag		: jsonObject.bindings[1].flags,
						type		: jsonObject.bindings[1].type || 'Document',
						description: jsonObject.bindings[1].description,
						size		: jsonObject.bindings[1].size,
						file		: true,
						id			: this.id,
						image		: jsonObject.bindings[1].image,
						path		: jsonObject.bindings[1].path,
						resolution: jsonObject.bindings[1].resolution
					};
		updateMeta(meta);
	},
	
	clear: function () {
		for (var i=0;i<this.parentObject.children.length;i++){
			if (this.parentObject.children[i] == this) {
				this.parentObject.children.splice(i,1);
				break;
			}
		}
		Element.remove(this.element);
	},
	
	unlink: function () {
		if(this.readonly) return false;
			var params = $H({ relay: 'fileDelete', fileid: this.id });
			var ajax = new Ajax.Request(FC.URL,{
				onComplete: this.parentObject.nextChild(this),
				onSuccess: this.clear.bind(this),
				method: 'get', 
				parameters: params.toQueryString(), 
				onFailure: function() { showError(ER.ajax); }
			});
		//}
	},
	
	clearRename: function () {
		if(this.renameIsOpen) {
			this.newName.style.display="none";
			Element.remove(this.newName);
			this.link.style.display = "block";
			this.renameIsOpen = false;		
			this.getMeta();
		}
	},
	
	rename_handler: function (event) {
		var charCode = (event.charCode) ? event.charCode : ((event.which) ? event.which : event.keyCode); 
		if (charCode == Event.KEY_ESC) this.clearRename();
		if (charCode == Event.KEY_RETURN) {
			var params = $H({
				relay : 'fileRename',
				fileid : this.id,
				filename: this.newName.value
			});
			this.link.innerHTML = this.newName.value;
			this.name = this.newName.value;
			var ajax = new Ajax.Request(FC.URL, {
				onComplete: this.clearRename.bind(this),
				onSuccess: this.refresh.bind(this),
				method: 'get', 
				parameters: params.toQueryString(), 
				onFailure: function() { showError(ER.ajax); }
			});
		}		

	},
	
	showRename: function () {
		if(this.readonly) return false;
		this.renameIsOpen = true;
		this.newName = document.createElement('input');
		this.newName.type = 'text';
		this.newName.size = '40';
		this.newName.name = this.id;
		this.newName.value = this.name;
		window.onkeypress = this.rename_handler.bindAsEventListener(this);
		Element.addClassName(this.newName, 'renamefield');
		this.link.style.display = "none";
		this.span.appendChild(this.newName);
		this.newName.focus();
		this.newName.select();
		
	},
	
	update: function () {
		this.parentObject.update();
	}
};


// NON OBJECT METHODS


updateMeta = function (meta) {
	meta = $H(meta);
	$('meta').innerHTML = '';
	var path = meta.path.replace('/', ' /');
	if(meta.file) {
		var normalflag = hotflag = emergencyflag = '';
		
		switch(meta.flag) {
			case 'normal': normalflag = 'selected'; break;
			case 'hot': hotflag = 'selected'; break;
			case 'emergency': emergencyflag = 'selected'; break;
		}
		
		var metaFlags = '<option label="Normal" value="normal" '+normalflag+' >Normal</option><option label="Hot" value="hot" '+hotflag+' >Hot</option><option label="Emergency" value="emergency" '+emergencyflag+'>Emergency</option>';
		if(meta.image == '1') $('meta').innerHTML += '<div class="thumbbox"><a href="'+FC.URL+'?relay=getFile&fileid='+meta.id+'&rand='+Math.random()+'" ><img src="'+FC.URL+'?relay=getThumb&fileid='+meta.id+'&rand='+Math.random()+'" class="metaThumbnail" alt="" /></a><a href="/admin/files/edit/'+meta.id+'" class="edit_me_img"></a></div><div style="text-align:center; padding:2px;">'+meta.resolution+'</div>';
		$('meta').innerHTML += ' <table><tr><td class="l">Name</td><td><input type="text" name="filename" onfocus="window.onkeypress=\'null\'"; id="metaFilename" value="'+meta.filename+'" /></td></tr><tr><td class="l">Kind</td><td>'+meta.type+'</td></tr><tr><td class="l">Size</td><td>'+meta.size+'</td></tr><tr><td class="l">Date</td><td>'+meta.date+'</td></tr><tr><td class="l">Where</td><td><div style="width:115px; overflow:hidden"><a href="'+FC.SCRIPTSRC+'?path='+meta.path+'/'+meta.filename+'">'+path+' /'+meta.filename+'</a></div></td></tr><tr><td class="l">Edit</td><td><a href="/admin/files/edit/'+meta.id+'">edit me</a></td></tr><tr><td class="l">Flag</td><td><select id="metaFlag" name="metaFlag" id="metaFlag">'+metaFlags+'</select></td></tr><tr><td class="l"><a href="#" onclick="saveMeta(); return false"><img src="'+saveIcon+'" alt="" /></a></td><td><textarea name="description" onfocus="window.onkeypress=\'null\'"; id="metaDesc">'+meta.description+'</textarea></td></tr></table>';
	}
	else if (FC.SELECTEDOBJECT.virtual) {
		$('meta').innerHTML = '<table><tr><td class="l">Name</td><td>'+meta.name+'</td></tr><tr><td class="l">Size</td><td>'+meta.size+'</td></tr></table>';
	}
	else {
		$('meta').innerHTML = '<table><tr><td class="l">Name</td><td><input type="text" id="folderMeta" name="folderMeta" value="'+meta.name+'" /></td></tr><tr><td class="l">Kind</td><td>Folder</td></tr><tr><td class="l">Size</td><td>'+meta.size+'</td></tr><tr><td class="l">Location</td><td><div style="width:115px; overflow:hidden">'+path+'</div></td></tr><tr><td class="l">Label</td><td>Normal</td></tr><tr><td></td><td><a href="#" onclick="saveMeta(); return false"><img src="'+saveIcon+'" alt="" /></a></td></tr></table>';
	}
}


rotate_image = function(fileid, angle){
	href = '/admin/files/rotate/'+fileid+'?angle='+angle;
	var rimage = new Ajax.Request(href, {onComplete:FC.SELECTEDOBJECT.getMeta()});		
	return false;
}
resize_image = function(fileid, percent){
	href = '/admin/files/resize/'+fileid+'?percent='+percent;
	var rimage = new Ajax.Request(href, {onComplete:FC.SELECTEDOBJECT.getMeta()});		
	return false;
}

saveMeta = function () {
	if(FC.SELECTEDOBJECT.type == 'directory') {
		FC.SELECTEDOBJECT.rename_handler("", $('folderMeta').value);
		return false;
	}
	
	var metaFilename = $('metaFilename').value;
	var metaFlag = $('metaFlag').options[$('metaFlag').selectedIndex].value;
	var metaDesc = $('metaDesc').value;
	
	FC.SELECTEDOBJECT.name = metaFilename;
	FC.SELECTEDOBJECT.flag = metaFlag;
	
	var params = $H({relay: 'setMeta', fileid: FC.SELECTEDOBJECT.id, filename: metaFilename, description: metaDesc, flags: metaFlag });
	var ajax = new Ajax.Request(FC.URL, {
		onComplete: function() { $('metaSave').style.display = 'block'; Effect.Fade('metaSave', {duration:3}); },
		onSuccess: FC.SELECTEDOBJECT.refresh.bind(FC.SELECTEDOBJECT),
		method: 'get', 
		parameters: params.toQueryString(), 
		onFailure: function() { showError(ER.ajax); }
	});
}
function showMetaSpinner () { $('meta').innerHTML = '<div style="border-bottom:0;" class="thumbbox"><img src="'+spinnerIcon+'" alt="" /></div>'; }

function parsePath(searchPath) {
	var path = searchPath.split('/');
	var children = $A(FC.SEARCHOBJ.children);
	var object = children.detect( function(value, index) {
			if (value.name == path[1]) return true;
			else return false;
		});
	if (path[2]) {
		FC.NEXTPATH = searchPath.replace('/'+path[1], '');
		if(object) {
			if (object.open) {
				FC.SEARCHOBJ.hideActivity();
				FC.SEARCHOBJ = object;
				parsePath(FC.NEXTPATH);
			}
			else {
				FC.SEARCHOBJ.hideActivity();
				object.update();
				FC.SEARCHOBJ = object; 
			}
		}
		else { 
			FC.NEXTPATH = null; 
			return showError(ER.parsePath);
		}
	}
	else {
		FC.SEARCHOBJ = null;
		FC.NEXTPATH = null;
		object.select();
	}
}

function getQuery(variable) {
 	var query = window.location.search.substring(1);
 	query = query.toQueryParams();
 	
 	if(query[variable]) {
 		FC.NEXTPATH = decodeURIComponent(query[variable]);
 		FC.SEARCHOBJ = root;
 	}
 	return true;
 }

function jumpTo(path) {
	path = decodeURI(path);
	FC.SEARCHOBJ = root;
	FC.NEXTPATH = path;
	parsePath(path);
}

function go() {}

function newFolder(){
	if(FC.SELECTEDOBJECT == null) return false;
	if(FC.SELECTEDOBJECT.type == 'file') c = FC.SELECTEDOBJECT.parentObject;
	else c = FC.SELECTEDOBJECT;	

	var folderName = 'Untitled Folder';
	FC.NEXTPATH = '/'+folderName;
	FC.SEARCHOBJ = c;
	
	var params = $H({ relay: 'newFolder', name: folderName, path: c.path });
	var ajax = new Ajax.Request(FC.URL,{
		onSuccess: setTimeout("c.update()",100),
		method: 'get', 
		parameters: params.toQueryString(), 
		onFailure: function() { showError(ER.ajax); }
	});

}

uploadDestination = null

function uploadAuth() {
	if(QFiles.length == 0) {return false;}
	if(!FC.SELECTEDOBJECT) { return false;}
	if(FC.SELECTEDOBJECT.type == 'file') uploadDestination = FC.SELECTEDOBJECT.parentObject;
	else uploadDestination = FC.SELECTEDOBJECT;	
	
	var params = $H({ relay: 'uploadAuth', path: uploadDestination.path });
	var ajax = new Ajax.Request(FC.URL, { 
	  onSuccess: uploadAuth_handler, 
	  method: 'post', 
	  parameters: params.toQueryString(), 
	  onFailure: function() { showError(ER.ajax); } });	
}

function uploadAuth_handler(response) {
	var json_data = response.responseText; 
	eval("var jsonObject = ("+json_data+")");
	var auth = jsonObject.bindings[0];
	if(auth.auth == 'true') {
		sendUpload(auth.sessionid);
	}
	else showError(ER.upload);
}

function sendUpload(sid) {
		var uploadDumb = FC.UPLOADURL + '?'+ sid;
		$('uploadForm').action = uploadDumb;
		$('uploadForm').submit();
		
		$('uploadSubmit').src = uploadCancel;
		$('uploadSubmit').onclick = uploadStop;
		Element.toggle('uploadAdd');
		$('pgfg').style.width = "1px";	
		Effect.Appear('progress');
		window.setTimeout("uploadStatus()", 500);
}

function uploadStatus() {
		var params = $H({ relay: 'uploadSmart'});
		var ajax = new Ajax.Request(FC.URL, { onSuccess: uploadStatus_handler, method:'post', parameters: params.toQueryString(), onFailure: function() { showError(ER.ajax); } });		
}

uc = 0;
change = 0;
currentsize = 0;
destination = 0;
pginterval = 2000; 
refresh = 20;
pgwidth = 180;

function uploadStatus_handler(response) {
	var json_data = response.responseText; 
	eval("var jsonObject = ("+json_data+")");
	var progress = jsonObject.bindings[0];

	if(progress.done == 'false') {
		window.setTimeout( "uploadStatus()", 1800);
		if(FC.PG) clearInterval(FC.PG);
		
		var p =  pgwidth * progress.percent;
		$('pgfg').style.width = p + 'px';
		currentsize = p;
		
		var pixels = progress.percentSec * pgwidth;
		change = pixels / refresh;
		destination = currentsize + pixels;
		
		FC.PG = setInterval("updatePgFg()", pginterval/refresh);
		
		$('pgsp').innerHTML = progress.speed;
		$('pgeta').innerHTML = progress.secondsLeft;
		
	}
	else uploadFinish();
}

function updatePgFg() {
	if (currentsize < destination) {
		uc++;		
		currentsize = currentsize + change;
		if(currentsize < pgwidth) {
			$('pgpc').innerHTML = parseInt((currentsize/pgwidth)*100) + "%";
			$('pgfg').style.width = currentsize + 'px';
		}
	}
}

function uploadFinish(stop) {
		//var params = $H({ relay: 'uploadSmart'});
		//var ajax = new Ajax.Request(FC.URL, { method:'post', parameters: params.toQueryString(), onFailure: function() { showError(ER.ajax); } });		

		change = 0;
		currentsize = 0;
		destination = 0;
		clearInterval(FC.PG);
		if(stop) $('pgpc').innerHTML = "Canceled";
		else $('pgpc').innerHTML = "100%";

		$('uploadSubmit').src = uploadBtn;
		$('uploadSubmit').onclick = uploadAuth;		
		Element.toggle('uploadAdd');		
		$('pgfg').style.width = pgwidth + "px";
		Effect.Fade('progress');
		uploadDestination.update();
		clearQ();
}

function uploadStop() {
	$('uploadiframe').src = "about:blank";
	uploadFinish(true);
}

function unlink() {
	FC.SELECTEDOBJECT ? FC.SELECTEDOBJECT.unlink() : null;
}
function download() {
	FC.SELECTEDOBJECT ? (FC.SELECTEDOBJECT.type == 'file' ? FC.SELECTEDOBJECT.download() : null) : null;
}

function updateAll(obj) {
	if(obj.open && obj.type=='directory'){
		for(i in obj.children) { updateAll(obj.children[i]); }
		obj.update();
	}
}
function openAll() {
	FC.SHOWALL = true; 
	root.clearContents(); 
	root.getContents(); 
	return false;
}
function closeAll() {
	FC.SHOWALL = false; 
	root.clearContents(); 
	root.getContents(); 
	return false;
}

QFiles = new Array();

// var UploadManager = Class.create();
// UploadManager.prototype = {
//  initialize: function(element) {
//    this.uploadQ = $('uploadFiles');
//    this.buttons = $('uploadbuttons');
//    this.size = 1;
//    if(element) {
//      this.input = $(element);
//      this.id = element;
//      this.input.value != '' ? this.addToQ() : null;
//    }
//    else this.createElement();
//    this.input.onchange = this.addToQ.bind(this);
//  },
//  
//  createElement: function() {
//    this.id = 'upload'+ getRandom();
//    this.input = document.createElement('input');
//    this.input.type = 'file';
//    this.input.name = 'file[]';
//    this.input.size = this.size;
//    Element.addClassName(this.input, 'fileupload');
//    this.buttons.appendChild(this.input);
// 
//  },
//  
//  addToQ: function() {
//    $('uploadQ').style.height = "auto";
//    this.QPOS = QFiles.length;
//    QFiles[this.QPOS] = this;
//    var reg = /(.+(\\|\/))?(.*)/;
//    var results = this.input.value.match(reg);
//    this.filename = results[3];   
//    this.row = document.createElement('tr');
//    this.row.id = 'r'+getRandom();        
//    this.name = document.createElement('td');
//    this.name.innerHTML = '<div class="fileUp">'+this.filename+'</div>';    
//    this.del = document.createElement('td');    
//    this.link = document.createElement('img');
//    this.link.onclick = this.clear.bind(this);
//    this.link.src = removeIcon;   
//    this.del.appendChild(this.link);
//    this.row.appendChild(this.name);
//    this.row.appendChild(this.del);
//    this.uploadQ.appendChild(this.row);   
//    Effect.Appear('uploadSubmit');
//    next = new UploadManager();
//  },
//  
//  clear: function() {
//    Element.remove(this.row);
//    Element.remove(this.input);
//    QFiles.splice(this.QPOS, 1);
//    if(QFiles.length == 0) {
//       Effect.Fade('uploadSubmit');
//       $('uploadQ').style.height = "28px";
//    }
//  },
//  
//  remove: function() {
//    Element.remove(this.row);
//    Element.remove(this.input);
//  }
// };

function getRandom() { return Math.round(Math.random()*1000); }
function clearQ() {
	for(var i=0;i < QFiles.length; i++){ QFiles[i].remove(); }

	Effect.Fade('uploadSubmit');
	$('uploadQ').style.height = "28px";
	QFiles = new Array();
}

var Cart = Class.create();
Cart.prototype = {
	initialize: function() {
		this.element = $('cart');
		this.children = new Array();
		this.confirm = $('emailconfirm');
		Droppables.add('cart', { accept: 'file', hoverclass: 'hover', onDrop: this.add.bind(this) });
	},
	
	add: function (element) {
		var name = element.object.name;
		var fileid = element.object.id;
		for(var i=0; i < this.children.length; i++){
			if(fileid == this.children[i]) { return false; }
		}

		row = document.createElement('div');
		row.id = 'c'+fileid;
		row.innerHTML = '<div>'+name+'</div>';
		row.innerHTML += '<a href="#" onclick="cart.remove(\''+fileid+'\'); return false" class="remove"></a>';

		this.element.appendChild(row);
		this.children[this.children.length] = fileid;
		
	},
	addSpecial: function (fid, fname) {
		var e = { object: {name : fname, id: fid} };
		cart.add(e);
	},
			
	remove: function (fid) {
		for(var i=0; i < this.children.length; i++){
			if(fid == this.children[i]) { this.children.splice(i,1); Element.remove('c'+fid); break; }
		}
	},
	
	download: function() {
		if(this.children.length == 0 && FC.SELECTEDOBJECT == null) return false;
		if(this.children.length == 0 && FC.SELECTEDOBJECT) { FC.SELECTEDOBJECT.download(); return false; }
		var cartIDs = '';
		
		for(var i=0; i < this.children.length; i++) {
			if(this.children[i] != ''){
				cartIDs += this.children[i];
				if(i != this.children.length-1) cartIDs += ',';
			}
		}
		for(var i=0;i< this.children.length; i++){ 
			Element.remove('c'+this.children[i]);
		}
		this.children = new Array();

		if($('emailFormTo').value != '' && $('emailFormTo').value != 'Type email address') 
			this.email(cartIDs);
		else
			location.href = FC.URL+'?relay=getFilePackage&fileid=' + cartIDs;
			
	},
	
	email: function(cartIDs) {
		var params = $H({
			relay: 'emailFilePackage', 
			to: $('emailFormTo').value, 
			from: $('emailFormFrom').value, 
			message: $('emailFormMessage').value,
			fileid: cartIDs
		});	
		var ajax = new Ajax.Request(FC.URL,{
			onSuccess: this.email_handler.bind(this),
			method: 'get', 
			parameters: params.toQueryString()
		});
	},
	
	email_handler: function() {
		this.hideEmail();
		Effect.Appear(this.confirm);
		setTimeout("Effect.Fade('emailconfirm');", 2000);
	},
	showEmail: function() {
		Effect.Appear('emailform');
	},
	hideEmail: function() {
		Effect.Fade('emailform');
	}
	
};

var ER = {
	auth: 'You don\'t have authorization to use this app. Please try <a href="login.htm">logging in</a> again',
	ajax: 'Unable to make a connection to the server',
	upload: 'Can\'t upload to this folder. You may not have write privileges',
	download: 'Your download cart is empty',
	parsePath: 'The file you are looking for is not there'
};

showError = function(text) {
	$('error').innerHTML = "<p>" + text + "</p><a href=\"#\" class=\"close\" onclick=\"Effect.toggle('error', 'appear'); return false\" />close</a>";
	Effect.Appear('error');
	return false;
};

showLogin = function() {
	$('login').style.display = "block";
};



function submitenter(myfield,e) {
	var keycode;
	if (window.event) keycode = window.event.keyCode;
	else if (e) keycode = e.which;
	else return true;
	
	if (keycode == 13) {
	   userLogin();
	   return false;
	  }
	else return true;
}

search = null;
cart = null;
root = null;

windowLoader = function () {
	search = new Search('searcharea');
	root = new Directory('', '', false, $('fileList'));
	
	root.getContents();
	getQuery('path');
	
	//new UploadManager('fileUpload');
	cart = new Cart('cart');
	
	setInterval("updateAll(root)", 60000);
};

//Attach to the window loader

window.onload = windowLoader;

