
(function($){$.extend({tablesorter:new function(){var parsers=[],widgets=[];this.defaults={cssHeader:"header",cssAsc:"headerSortUp",cssDesc:"headerSortDown",sortInitialOrder:"asc",sortMultiSortKey:"shiftKey",sortForce:null,sortAppend:null,textExtraction:"simple",parsers:{},widgets:[],widgetZebra:{css:["even","odd"]},headers:{},widthFixed:false,cancelSelection:true,sortList:[],headerList:[],dateFormat:"us",decimal:'.',debug:false};function benchmark(s,d){log(s+","+(new Date().getTime()-d.getTime())+"ms");}this.benchmark=benchmark;function log(s){if(typeof console!="undefined"&&typeof console.debug!="undefined"){console.log(s);}else{alert(s);}}function buildParserCache(table,$headers){if(table.config.debug){var parsersDebug="";}var rows=table.tBodies[0].rows;if(table.tBodies[0].rows[0]){var list=[],cells=rows[0].cells,l=cells.length;for(var i=0;i<l;i++){var p=false;if($.metadata&&($($headers[i]).metadata()&&$($headers[i]).metadata().sorter)){p=getParserById($($headers[i]).metadata().sorter);}else if((table.config.headers[i]&&table.config.headers[i].sorter)){p=getParserById(table.config.headers[i].sorter);}if(!p){p=detectParserForColumn(table,cells[i]);}if(table.config.debug){parsersDebug+="column:"+i+" parser:"+p.id+"\n";}list.push(p);}}if(table.config.debug){log(parsersDebug);}return list;};function detectParserForColumn(table,node){var l=parsers.length;for(var i=1;i<l;i++){if(parsers[i].is($.trim(getElementText(table.config,node)),table,node)){return parsers[i];}}return parsers[0];}function getParserById(name){var l=parsers.length;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==name.toLowerCase()){return parsers[i];}}return false;}function buildCache(table){if(table.config.debug){var cacheTime=new Date();}var totalRows=(table.tBodies[0]&&table.tBodies[0].rows.length)||0,totalCells=(table.tBodies[0].rows[0]&&table.tBodies[0].rows[0].cells.length)||0,parsers=table.config.parsers,cache={row:[],normalized:[]};for(var i=0;i<totalRows;++i){var c=table.tBodies[0].rows[i],cols=[];cache.row.push($(c));for(var j=0;j<totalCells;++j){cols.push(parsers[j].format(getElementText(table.config,c.cells[j]),table,c.cells[j]));}cols.push(i);cache.normalized.push(cols);cols=null;};if(table.config.debug){benchmark("Building cache for "+totalRows+" rows:",cacheTime);}return cache;};function getElementText(config,node){if(!node)return"";var t="";if(config.textExtraction=="simple"){if(node.childNodes[0]&&node.childNodes[0].hasChildNodes()){t=node.childNodes[0].innerHTML;}else{t=node.innerHTML;}}else{if(typeof(config.textExtraction)=="function"){t=config.textExtraction(node);}else{t=$(node).text();}}return t;}function appendToTable(table,cache){if(table.config.debug){var appendTime=new Date()}var c=cache,r=c.row,n=c.normalized,totalRows=n.length,checkCell=(n[0].length-1),tableBody=$(table.tBodies[0]),rows=[];for(var i=0;i<totalRows;i++){rows.push(r[n[i][checkCell]]);if(!table.config.appender){var o=r[n[i][checkCell]];var l=o.length;for(var j=0;j<l;j++){tableBody[0].appendChild(o[j]);}}}if(table.config.appender){table.config.appender(table,rows);}rows=null;if(table.config.debug){benchmark("Rebuilt table:",appendTime);}applyWidget(table);setTimeout(function(){$(table).trigger("sortEnd");},0);};function buildHeaders(table){if(table.config.debug){var time=new Date();}var meta=($.metadata)?true:false,tableHeadersRows=[];for(var i=0;i<table.tHead.rows.length;i++){tableHeadersRows[i]=0;};$tableHeaders=$("thead th",table);$tableHeaders.each(function(index){this.count=0;this.column=index;this.order=formatSortingOrder(table.config.sortInitialOrder);if(checkHeaderMetadata(this)||checkHeaderOptions(table,index))this.sortDisabled=true;if(!this.sortDisabled){$(this).addClass(table.config.cssHeader);}table.config.headerList[index]=this;});if(table.config.debug){benchmark("Built headers:",time);log($tableHeaders);}return $tableHeaders;};function checkCellColSpan(table,rows,row){var arr=[],r=table.tHead.rows,c=r[row].cells;for(var i=0;i<c.length;i++){var cell=c[i];if(cell.colSpan>1){arr=arr.concat(checkCellColSpan(table,headerArr,row++));}else{if(table.tHead.length==1||(cell.rowSpan>1||!r[row+1])){arr.push(cell);}}}return arr;};function checkHeaderMetadata(cell){if(($.metadata)&&($(cell).metadata().sorter===false)){return true;};return false;}function checkHeaderOptions(table,i){if((table.config.headers[i])&&(table.config.headers[i].sorter===false)){return true;};return false;}function applyWidget(table){var c=table.config.widgets;var l=c.length;for(var i=0;i<l;i++){getWidgetById(c[i]).format(table);}}function getWidgetById(name){var l=widgets.length;for(var i=0;i<l;i++){if(widgets[i].id.toLowerCase()==name.toLowerCase()){return widgets[i];}}};function formatSortingOrder(v){if(typeof(v)!="Number"){i=(v.toLowerCase()=="desc")?1:0;}else{i=(v==(0||1))?v:0;}return i;}function isValueInArray(v,a){var l=a.length;for(var i=0;i<l;i++){if(a[i][0]==v){return true;}}return false;}function setHeadersCss(table,$headers,list,css){$headers.removeClass(css[0]).removeClass(css[1]);var h=[];$headers.each(function(offset){if(!this.sortDisabled){h[this.column]=$(this);}});var l=list.length;for(var i=0;i<l;i++){h[list[i][0]].addClass(css[list[i][1]]);}}function fixColumnWidth(table,$headers){var c=table.config;if(c.widthFixed){var colgroup=$('<colgroup>');$("tr:first td",table.tBodies[0]).each(function(){colgroup.append($('<col>').css('width',$(this).width()));});$(table).prepend(colgroup);};}function updateHeaderSortCount(table,sortList){var c=table.config,l=sortList.length;for(var i=0;i<l;i++){var s=sortList[i],o=c.headerList[s[0]];o.count=s[1];o.count++;}}function multisort(table,sortList,cache){if(table.config.debug){var sortTime=new Date();}var dynamicExp="var sortWrapper = function(a,b) {",l=sortList.length;for(var i=0;i<l;i++){var c=sortList[i][0];var order=sortList[i][1];var s=(getCachedSortType(table.config.parsers,c)=="text")?((order==0)?"sortText":"sortTextDesc"):((order==0)?"sortNumeric":"sortNumericDesc");var e="e"+i;dynamicExp+="var "+e+" = "+s+"(a["+c+"],b["+c+"]); ";dynamicExp+="if("+e+") { return "+e+"; } ";dynamicExp+="else { ";}var orgOrderCol=cache.normalized[0].length-1;dynamicExp+="return a["+orgOrderCol+"]-b["+orgOrderCol+"];";for(var i=0;i<l;i++){dynamicExp+="}; ";}dynamicExp+="return 0; ";dynamicExp+="}; ";eval(dynamicExp);cache.normalized.sort(sortWrapper);if(table.config.debug){benchmark("Sorting on "+sortList.toString()+" and dir "+order+" time:",sortTime);}return cache;};function sortText(a,b){return((a<b)?-1:((a>b)?1:0));};function sortTextDesc(a,b){return((b<a)?-1:((b>a)?1:0));};function sortNumeric(a,b){return a-b;};function sortNumericDesc(a,b){return b-a;};function getCachedSortType(parsers,i){return parsers[i].type;};this.construct=function(settings){return this.each(function(){if(!this.tHead||!this.tBodies)return;var $this,$document,$headers,cache,config,shiftDown=0,sortOrder;this.config={};config=$.extend(this.config,$.tablesorter.defaults,settings);$this=$(this);$headers=buildHeaders(this);this.config.parsers=buildParserCache(this,$headers);cache=buildCache(this);var sortCSS=[config.cssDesc,config.cssAsc];fixColumnWidth(this);$headers.click(function(e){$this.trigger("sortStart");var totalRows=($this[0].tBodies[0]&&$this[0].tBodies[0].rows.length)||0;if(!this.sortDisabled&&totalRows>0){var $cell=$(this);var i=this.column;this.order=this.count++%2;if(!e[config.sortMultiSortKey]){config.sortList=[];if(config.sortForce!=null){var a=config.sortForce;for(var j=0;j<a.length;j++){if(a[j][0]!=i){config.sortList.push(a[j]);}}}config.sortList.push([i,this.order]);}else{if(isValueInArray(i,config.sortList)){for(var j=0;j<config.sortList.length;j++){var s=config.sortList[j],o=config.headerList[s[0]];if(s[0]==i){o.count=s[1];o.count++;s[1]=o.count%2;}}}else{config.sortList.push([i,this.order]);}};setTimeout(function(){setHeadersCss($this[0],$headers,config.sortList,sortCSS);appendToTable($this[0],multisort($this[0],config.sortList,cache));},1);return false;}}).mousedown(function(){if(config.cancelSelection){this.onselectstart=function(){return false};return false;}});$this.bind("update",function(){this.config.parsers=buildParserCache(this,$headers);cache=buildCache(this);}).bind("sorton",function(e,list){$(this).trigger("sortStart");config.sortList=list;var sortList=config.sortList;updateHeaderSortCount(this,sortList);setHeadersCss(this,$headers,sortList,sortCSS);appendToTable(this,multisort(this,sortList,cache));}).bind("appendCache",function(){appendToTable(this,cache);}).bind("applyWidgetId",function(e,id){getWidgetById(id).format(this);}).bind("applyWidgets",function(){applyWidget(this);});if($.metadata&&($(this).metadata()&&$(this).metadata().sortlist)){config.sortList=$(this).metadata().sortlist;}if(config.sortList.length>0){$this.trigger("sorton",[config.sortList]);}applyWidget(this);});};this.addParser=function(parser){var l=parsers.length,a=true;for(var i=0;i<l;i++){if(parsers[i].id.toLowerCase()==parser.id.toLowerCase()){a=false;}}if(a){parsers.push(parser);};};this.addWidget=function(widget){widgets.push(widget);};this.formatFloat=function(s){var i=parseFloat(s);return(isNaN(i))?0:i;};this.formatInt=function(s){var i=parseInt(s);return(isNaN(i))?0:i;};this.isDigit=function(s,config){var DECIMAL='\\'+config.decimal;var exp='/(^[+]?0('+DECIMAL+'0+)?$)|(^([-+]?[1-9][0-9]*)$)|(^([-+]?((0?|[1-9][0-9]*)'+DECIMAL+'(0*[1-9][0-9]*)))$)|(^[-+]?[1-9]+[0-9]*'+DECIMAL+'0+$)/';return RegExp(exp).test($.trim(s));};this.clearTableBody=function(table){if($.browser.msie){function empty(){while(this.firstChild)this.removeChild(this.firstChild);}empty.apply(table.tBodies[0]);}else{table.tBodies[0].innerHTML="";}};}});$.fn.extend({tablesorter:$.tablesorter.construct});var ts=$.tablesorter;ts.addParser({id:"text",is:function(s){return true;},format:function(s){return $.trim(s.toLowerCase());},type:"text"});ts.addParser({id:"digit",is:function(s,table){var c=table.config;return $.tablesorter.isDigit(s,c);},format:function(s){return $.tablesorter.formatFloat(s);},type:"numeric"});ts.addParser({id:"currency",is:function(s){return/^[Â£$â‚¬?.]/.test(s);},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/[^0-9.]/g),""));},type:"numeric"});ts.addParser({id:"ipAddress",is:function(s){return/^\d{2,3}[\.]\d{2,3}[\.]\d{2,3}[\.]\d{2,3}$/.test(s);},format:function(s){var a=s.split("."),r="",l=a.length;for(var i=0;i<l;i++){var item=a[i];if(item.length==2){r+="0"+item;}else{r+=item;}}return $.tablesorter.formatFloat(r);},type:"numeric"});ts.addParser({id:"url",is:function(s){return/^(https?|ftp|file):\/\/$/.test(s);},format:function(s){return jQuery.trim(s.replace(new RegExp(/(https?|ftp|file):\/\//),''));},type:"text"});ts.addParser({id:"isoDate",is:function(s){return/^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(s);},format:function(s){return $.tablesorter.formatFloat((s!="")?new Date(s.replace(new RegExp(/-/g),"/")).getTime():"0");},type:"numeric"});ts.addParser({id:"percent",is:function(s){return/\%$/.test($.trim(s));},format:function(s){return $.tablesorter.formatFloat(s.replace(new RegExp(/%/g),""));},type:"numeric"});ts.addParser({id:"usLongDate",is:function(s){return s.match(new RegExp(/^[A-Za-z]{3,10}\.? [0-9]{1,2}, ([0-9]{4}|'?[0-9]{2}) (([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(AM|PM)))$/));},format:function(s){return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"shortDate",is:function(s){return/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(s);},format:function(s,table){var c=table.config;s=s.replace(/\-/g,"/");if(c.dateFormat=="us"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$1/$2");}else if(c.dateFormat=="uk"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/,"$3/$2/$1");}else if(c.dateFormat=="dd/mm/yy"||c.dateFormat=="dd-mm-yy"){s=s.replace(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})/,"$1/$2/$3");}return $.tablesorter.formatFloat(new Date(s).getTime());},type:"numeric"});ts.addParser({id:"time",is:function(s){return/^(([0-2]?[0-9]:[0-5][0-9])|([0-1]?[0-9]:[0-5][0-9]\s(am|pm)))$/.test(s);},format:function(s){return $.tablesorter.formatFloat(new Date("2000/01/01 "+s).getTime());},type:"numeric"});ts.addParser({id:"metadata",is:function(s){return false;},format:function(s,table,cell){var c=table.config,p=(!c.parserMetadataName)?'sortValue':c.parserMetadataName;return $(cell).metadata()[p];},type:"numeric"});ts.addWidget({id:"zebra",format:function(table){if(table.config.debug){var time=new Date();}$("tr:visible",table.tBodies[0]).filter(':even').removeClass(table.config.widgetZebra.css[1]).addClass(table.config.widgetZebra.css[0]).end().filter(':odd').removeClass(table.config.widgetZebra.css[0]).addClass(table.config.widgetZebra.css[1]);if(table.config.debug){$.tablesorter.benchmark("Applying Zebra widget",time);}}});})(jQuery);/* -------------------------------------------------- *
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
			  jQ(this).unbind("focus.hint").unbind("blur.hint").removeData("defText");
				return false;
			}
		  hint_setup(jQ(this));
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
					defText = jQ("label[for='" + ele.attr("id") + "']").text();
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
			if(defaults.remove_labels == true) { jQ("label[for='" + ele.attr("id") + "']").remove(); }
			
			// Handles password fields by creating a clone that's a text field.
			if(ele.attr("type")=="password") {
			  var eledef = ele.data("defText");
        var el = jQ('<input type="text"/>');
        el.attr( 'name', ele.attr('name') );
        el.attr( 'size', ele.attr('size') );
        el.attr( 'class', ele.attr('class') );
        el.val( ele.val() );
        el.data("defType", "password").data("defText", eledef);
        ele.replaceWith(el);
        var ele = el;
		  }
			hint_focus(ele);
			hint_blur(ele);
	  };
	  function hint_focus(ele){ 
	    ele.bind("focus.hint",function(ele){
        var ele = jQ(this);
	      if(ele.val() == ele.data("defText")) { ele.val(""); }
				// add the focus class, remove changed_class
				ele.addClass(defaults.focus_class).removeClass(defaults.changed_class);
	      if(ele.data("defType")=="password") {
  			  var eledef = ele.data("defText");
          var el = jQ('<input type="password"/>');
          el.attr( 'name', ele.attr('name') );
          el.attr( 'size', ele.attr('size') );
          el.attr( 'class', ele.attr('class') );
          el.val( ele.val() );
          el.data("defType", "password").data("defText", eledef);
          ele.replaceWith(el);
          var ele = el;
          ele.focus();
          hint_blur(ele);
  			}
			});
	  };
	  function hint_blur(ele){ 
	    ele.bind("blur.hint",function(){
        var ele = jQ(this);
	      if(ele.val() == "") { ele.val(ele.data("defText")); }
				// remove focus_class, add changed_class.
				ele.removeClass(defaults.focus_class);
				if(ele.val() != ele.data("defText")) { ele.addClass(defaults.changed_class); }
					else { ele.removeClass(defaults.changed_class); }
				if(ele.data("defType")=="password" && ele.val()==ele.data("defText")) {
				  var eledef = ele.data("defText");
          var el = jQ('<input type="text"/>');
          el.attr( 'name', ele.attr('name') );
          el.attr( 'size', ele.attr('size') );
          el.attr( 'class', ele.attr('class') );
          el.val( ele.val() );
          el.data("defType", "password").data("defText", eledef);
          ele.replaceWith(el);
          var ele = el;
          hint_focus(el);
				}
	    });
	  };
	};
	var jQ = jQuery;
})(jQuery);jQuery.imgAreaSelect=function(img,options){var $area=jQuery('<div></div>'),$border1=jQuery('<div></div>'),$border2=jQuery('<div></div>'),$outLeft=jQuery('<div></div>'),$outTop=jQuery('<div></div>'),$outRight=jQuery('<div></div>'),$outBottom=jQuery('<div></div>'),left,top,imgOfs,imgWidth,imgHeight,parent,parOfs,parScroll,adjusted,zIndex=0,fixed,$p,startX,startY,moveX,moveY,resizeMargin=10,resize=[],V=0,H=1,d,aspectRatio,x1,x2,y1,y2,x,y,selection={x1:0,y1:0,x2:0,y2:0,width:0,height:0};var $a=$area.add($border1).add($border2);var $o=$outLeft.add($outTop).add($outRight).add($outBottom);function viewX(x){return x+imgOfs.left+parScroll.left-parOfs.left}function viewY(y){return y+imgOfs.top+parScroll.top-parOfs.top}function selX(x){return x-imgOfs.left-parScroll.left+parOfs.left}function selY(y){return y-imgOfs.top-parScroll.top+parOfs.top}function evX(event){return event.pageX+parScroll.left-parOfs.left}function evY(event){return event.pageY+parScroll.top-parOfs.top}function adjust(){imgOfs=jQuery(img).offset();imgWidth=jQuery(img).width();imgHeight=jQuery(img).height();if(jQuery(parent).is('body'))parOfs=parScroll={left:0,top:0};else{parOfs=jQuery(parent).offset();parScroll={left:parent.scrollLeft,top:parent.scrollTop}}left=viewX(0);top=viewY(0)}function update(){$a.css({left:viewX(selection.x1)+'px',top:viewY(selection.y1)+'px',width:Math.max(selection.width-options.borderWidth*2,0)+'px',height:Math.max(selection.height-options.borderWidth*2,0)+'px'});$outLeft.css({left:left+'px',top:top+'px',width:selection.x1+'px',height:imgHeight+'px'});$outTop.css({left:left+selection.x1+'px',top:top+'px',width:selection.width+'px',height:selection.y1+'px'});$outRight.css({left:left+selection.x2+'px',top:top+'px',width:imgWidth-selection.x2+'px',height:imgHeight+'px'});$outBottom.css({left:left+selection.x1+'px',top:top+selection.y2+'px',width:selection.width+'px',height:imgHeight-selection.y2+'px'})}function areaMouseMove(event){if(!adjusted){adjust();adjusted=true;$a.one('mouseout',function(){adjusted=false})}x=selX(evX(event))-selection.x1;y=selY(evY(event))-selection.y1;resize=[];if(options.resizable){if(y<=resizeMargin)resize[V]='n';else if(y>=selection.height-resizeMargin)resize[V]='s';if(x<=resizeMargin)resize[H]='w';else if(x>=selection.width-resizeMargin)resize[H]='e'}$border2.css('cursor',resize.length?resize.join('')+'-resize':options.movable?'move':'')}function areaMouseDown(event){if(event.which!=1)return false;adjust();if(options.resizable&&resize.length>0){jQuery('body').css('cursor',resize.join('')+'-resize');x1=viewX(resize[H]=='w'?selection.x2:selection.x1);y1=viewY(resize[V]=='n'?selection.y2:selection.y1);jQuery(document).mousemove(selectingMouseMove);$border2.unbind('mousemove',areaMouseMove);jQuery(document).one('mouseup',function(){resize=[];jQuery('body').css('cursor','');if(options.autoHide)$a.add($o).hide();options.onSelectEnd(img,selection);jQuery(document).unbind('mousemove',selectingMouseMove);$border2.mousemove(areaMouseMove)})}else if(options.movable){moveX=selection.x1+left;moveY=selection.y1+top;startX=evX(event);startY=evY(event);jQuery(document).mousemove(movingMouseMove).one('mouseup',function(){options.onSelectEnd(img,selection);jQuery(document).unbind('mousemove',movingMouseMove)})}else jQuery(img).mousedown(event);return false}function aspectRatioXY(){x2=Math.max(left,Math.min(left+imgWidth,x1+Math.abs(y2-y1)*aspectRatio*(x2>x1?1:-1)));y2=Math.round(Math.max(top,Math.min(top+imgHeight,y1+Math.abs(x2-x1)/aspectRatio*(y2>y1?1:-1))));x2=Math.round(x2)}function aspectRatioYX(){y2=Math.max(top,Math.min(top+imgHeight,y1+Math.abs(x2-x1)/aspectRatio*(y2>y1?1:-1)));x2=Math.round(Math.max(left,Math.min(left+imgWidth,x1+Math.abs(y2-y1)*aspectRatio*(x2>x1?1:-1))));y2=Math.round(y2)}function selectingMouseMove(event){x2=!resize.length||resize[H]||aspectRatio?evX(event):viewX(selection.x2);y2=!resize.length||resize[V]||aspectRatio?evY(event):viewY(selection.y2);if(options.minWidth&&Math.abs(x2-x1)<options.minWidth){x2=x1-options.minWidth*(x2<x1?1:-1);if(x2<left)x1=left+options.minWidth;else if(x2>left+imgWidth)x1=left+imgWidth-options.minWidth}if(options.minHeight&&Math.abs(y2-y1)<options.minHeight){y2=y1-options.minHeight*(y2<y1?1:-1);if(y2<top)y1=top+options.minHeight;else if(y2>top+imgHeight)y1=top+imgHeight-options.minHeight}x2=Math.max(left,Math.min(x2,left+imgWidth));y2=Math.max(top,Math.min(y2,top+imgHeight));if(aspectRatio)if(Math.abs(x2-x1)/aspectRatio>Math.abs(y2-y1))aspectRatioYX();else aspectRatioXY();if(options.maxWidth&&Math.abs(x2-x1)>options.maxWidth){x2=x1-options.maxWidth*(x2<x1?1:-1);if(aspectRatio)aspectRatioYX()}if(options.maxHeight&&Math.abs(y2-y1)>options.maxHeight){y2=y1-options.maxHeight*(y2<y1?1:-1);if(aspectRatio)aspectRatioXY()}selection.x1=selX(Math.min(x1,x2));selection.x2=selX(Math.max(x1,x2));selection.y1=selY(Math.min(y1,y2));selection.y2=selY(Math.max(y1,y2));selection.width=Math.abs(x2-x1);selection.height=Math.abs(y2-y1);update();options.onSelectChange(img,selection);return false}function movingMouseMove(event){x1=Math.max(left,Math.min(moveX+evX(event)-startX,left+imgWidth-selection.width));y1=Math.max(top,Math.min(moveY+evY(event)-startY,top+imgHeight-selection.height));x2=x1+selection.width;y2=y1+selection.height;selection.x1=selX(x1);selection.y1=selY(y1);selection.x2=selX(x2);selection.y2=selY(y2);update();options.onSelectChange(img,selection);event.preventDefault();return false}function imgMouseDown(event){if(event.which!=1)return false;adjust();selection.x1=selection.x2=selX(startX=x1=x2=evX(event));selection.y1=selection.y2=selY(startY=y1=y2=evY(event));selection.width=0;selection.height=0;resize=[];update();$a.add($o).show();jQuery(document).mousemove(selectingMouseMove);$border2.unbind('mousemove',areaMouseMove);options.onSelectStart(img,selection);jQuery(document).one('mouseup',function(){if(options.autoHide)$a.add($o).hide();options.onSelectEnd(img,selection);jQuery(document).unbind('mousemove',selectingMouseMove);$border2.mousemove(areaMouseMove)});return false}function windowResize(){adjust();update()}this.setOptions=function(newOptions){options=jQuery.extend(options,newOptions);if(newOptions.x1!=null){selection.x1=newOptions.x1;selection.y1=newOptions.y1;selection.x2=newOptions.x2;selection.y2=newOptions.y2;newOptions.show=true}parent=jQuery(options.parent).get(0);adjust();$p=jQuery(img);while($p.length&&!$p.is('body')){if(!isNaN($p.css('z-index'))&&$p.css('z-index')>zIndex)zIndex=$p.css('z-index');if($p.css('position')=='fixed')fixed=true;$p=$p.parent()}x1=viewX(selection.x1);y1=viewY(selection.y1);x2=viewX(selection.x2);y2=viewY(selection.y2);selection.width=x2-x1;selection.height=y2-y1;update();if(newOptions.hide)$a.add($o).hide();else if(newOptions.show)$a.add($o).show();$o.addClass(options.classPrefix+'-outer');$area.addClass(options.classPrefix+'-selection');$border1.addClass(options.classPrefix+'-border1');$border2.addClass(options.classPrefix+'-border2');$a.css({borderWidth:options.borderWidth+'px'});$area.css({backgroundColor:options.selectionColor,opacity:options.selectionOpacity});$border1.css({borderStyle:'solid',borderColor:options.borderColor1});$border2.css({borderStyle:'dashed',borderColor:options.borderColor2});$o.css({opacity:options.outerOpacity,backgroundColor:options.outerColor});aspectRatio=options.aspectRatio&&(d=options.aspectRatio.split(/:/))?d[0]/d[1]:null;if(options.disable||options.enable===false){$a.unbind('mousemove',areaMouseMove).unbind('mousedown',areaMouseDown);jQuery(img).add($o).unbind('mousedown',imgMouseDown);jQuery(window).unbind('resize',windowResize)}else if(options.enable||options.disable===false){if(options.resizable||options.movable)$a.mousemove(areaMouseMove).mousedown(areaMouseDown);jQuery(img).add($o).mousedown(imgMouseDown);jQuery(window).resize(windowResize)}jQuery(options.parent).append($o.add($a));options.enable=options.disable=undefined};if(jQuery.browser.msie)jQuery(img).attr('unselectable','on');$a.add($o).css({display:'none',position:fixed?'fixed':'absolute',overflow:'hidden',zIndex:zIndex>0?zIndex:null});$area.css({borderStyle:'solid'});initOptions={borderColor1:'#000',borderColor2:'#fff',borderWidth:1,classPrefix:'imgareaselect',movable:true,resizable:true,selectionColor:'#fff',selectionOpacity:0.2,outerColor:'#000',outerOpacity:0.2,parent:'body',onSelectStart:function(){},onSelectChange:function(){},onSelectEnd:function(){}};options=jQuery.extend(initOptions,options);this.setOptions(options)};jQuery.fn.imgAreaSelect=function(options){options=options||{};this.each(function(){if(jQuery(this).data('imgAreaSelect'))jQuery(this).data('imgAreaSelect').setOptions(options);else{if(options.enable===undefined&&options.disable===undefined)options.enable=true;jQuery(this).data('imgAreaSelect',new jQuery.imgAreaSelect(this,options))}});return this};
/* JS Table initialisation for index.html */
jQuery(document).ready(function() {
  if(jQuery("#item_list_container")) {
    jQuery("#item_list_container").tablesorter({dateFormat: 'dd/mm/yyyy', highlightClass: 'highlight_col',
      stripingRowClass: ['item_row1','item_row0'],stripeRowsOnStartUp: true});
  }
  if(jQuery(".form_datepicker")) jQuery(".form_datepicker").datepicker({changeMonth: true, changeYear: true, dateFormat: 'dd-MM-yy'});
  $("input.disable_enter").bind("keypress", function(e) {
    return e.keyCode == 13 ? false : true;
  });
});


jQuery(document).ready(function() {
	inline_status_change();	
});




function inline_status_change(){
	if(jQuery('.status_change')){	
		jQuery('.status_change').click(function(){
		  if(!confirm("Are you sure you want to change the publish status?")) return false;
			current_status = jQuery(this).attr('rel');
			dest = jQuery(this).attr('href');
			dest = dest.replace('?status=0', '').replace('?status=1', '');
			replace = "#"+this.id;
			jQuery.get(dest, {status: current_status, ajax:'yes'}, function(response){				
				jQuery(replace).replaceWith(response);
				inline_status_change();
			});
			return false;
		});
	}
}


jQuery.fn.centerScreen = function(loaded) { 
  var obj = this; 
  if(!loaded) { 
    obj.css('top', jQuery(window).height()/2-this.height()/2); 
    obj.css('left', jQuery(window).width()/2-this.width()/2); 
    jQuery(window).resize(function() { obj.centerScreen(!loaded); }); 
  } else { 
    obj.stop(); 
    obj.animate({ 
      top: jQuery(window).height()/2-this.height()/2, 
      left: jQuery(window).width()/2-this.width()/2}, 200, 'linear'); 
  } 
};


/**** Toggles for User Permissions *******/
$(document).ready(function() {
  $(".group_permission_check .group_toggle").change(function(){
    if($(this).is(":checked")) $(this).parent().find(".permission_check input").attr("checked", true);
    else $(this).parent().find(".permission_check input").removeAttr("checked");
  });
  
  
});







var content_page_id;
var model_string;
var init_upload;
var autosaver;
var inline_image_filter_timer;
wym_editors = [];
if(typeof(file_browser_location) == "undefined") var file_browser_location = "/admin/files/browse_images";
if(typeof(file_options_location) == "undefined") var file_options_location = "/admin/files/file_options";
var file_mime_type = "image";
jQuery(document).ready(function() {
    jQuery("#container").tabs();
    
    jQuery("#page_tab_title").html(jQuery("#cms_content_title").val());
    jQuery("#cms_content_title").keyup(function() {
      jQuery("#page_tab_title").html(jQuery("#cms_content_title").val());
    });
    jQuery("#new_cat_create").click(function() {
      jQuery.ajax({ url: "../../new_category/?cat="+jQuery("#new_cat").val(), 
        complete: function(response){jQuery("#category_list").html(response); initialise_draggables();}
      });
      return false;
    });   
    initialise_draggables();
    if(jQuery("#copy_permissions_from").length > 0) jQuery("#copy_permissions_from").change(function(){
      jQuery.get("../../copy_permissions_from/"+content_page_id+"?copy_from="+jQuery(this).val(),function(response){
        window.location.reload();
      });
      return false;
    });
    
    // link dialog
    jQuery("#link_dialog").dialog({modal: true, autoOpen:false, resizable: false, title:"Insert", width:"auto", height:"auto", buttons: {
			Insert: function() {
			  var execute_on_insert = $(this).data('execute_on_insert');
			  if(typeof execute_on_insert == 'function') execute_on_insert();
			  jQuery(this).dialog('close');
			},
			Cancel: function() { $(this).dialog('close'); }
		} ,close: function(){
      jQuery(this).removeData('execute_on_insert');
      jQuery(this).dialog('option', 'title', 'Insert');
		}});
		jQuery("#link_dialog #link_file").change(link_dialog_file_choose);
    
    // inline image dialog
    function post_inline_image_filter(){
      jQuery.get(file_browser_location,
        {
          filter: jQuery(".inline_image_dialog .filter_field").val(),
          filterfolder: jQuery(".inline_image_dialog .filter_image_folder .image_folder").val()
        },function(response){
          jQuery(".inline_image_dialog .image_display").html(response);
          init_inline_image_select(jQuery(".inline_image_dialog").data("wym"));
          clearTimeout(inline_image_filter_timer);
        }
      );
    }
    jQuery(".inline_image_dialog .filter_field").keyup(function(e) {
      if(e.which == 8 || e.which == 32 || (48 <= e.which && e.which <= 57) || (65 <= e.which && e.which <= 90) || (97 <= e.which && e.which <= 122) || e.which == 160 || e.which == 127){
        clearTimeout(inline_image_filter_timer);
        inline_image_filter_timer = setTimeout(post_inline_image_filter, 800);
      }
    });
    jQuery(".inline_image_dialog .filter_image_folder .image_folder").change(function() {
      post_inline_image_filter();
    });
    jQuery(".inline_image_dialog").dialog({modal: true, autoOpen:false, title:"Insert an Image", width:740, height:"auto", close: function(){
      jQuery(this).removeData('wym');
      jQuery(this).removeData('existing_image');
      jQuery(this).find(".selected_image img").attr("src", "/images/cms/add_image_blank.gif");
      jQuery(this).find(".meta_description").val("");
      jQuery(this).find(".inline_image_link").val("");
      jQuery(this).find(".image_folder").val("");
  	}, buttons: {
			Insert: function() {
			  var wym = jQuery(this).data('wym');
			  var existing_image = jQuery(this).data('existing_image');
        var img_class = "inline_image " + jQuery('input:radio[name=flow]:checked').val();
        if(existing_image && existing_image.length){
          var existing_image_parent = existing_image.parent();
          if(existing_image_parent[0].tagName.toLowerCase() == "a") var existing_link = existing_image_parent;
          existing_image.attr("class", img_class);
          existing_image.attr("src",jQuery(".selected_image img").attr("src"));
          existing_image.attr("alt",jQuery(".inline_image_dialog .meta_description").val());
        }else{
          var img_html= '<img style="" src="'+jQuery(".selected_image img").attr("src")+'" class="'+img_class+'" alt="'+jQuery(".inline_image_dialog .meta_description").val()+'" />';
          if(jQuery(".inline_image_link").val().length > 1) img_html = '<a href="'+jQuery(".inline_image_link").val()+'">'+img_html+"</a>";
          wym.insert(img_html);
        }
      	initialise_inline_image_edit(wym);
			  jQuery(this).dialog('close');
			},
			Cancel: function() { jQuery(this).dialog('close'); }
		}});
    // end of inline image dialog
    
    jQuery("#paste_word").dialog({modal: true, autoOpen:false, title:"Paste From Word", width:"auto", buttons: {
			Insert: function() {
			  var wym = jQuery(this).data('wym');
        wym.insert(jQuery(".wym_text").val());
			  jQuery(this).dialog('close');
			},
			Cancel: function() { jQuery(this).dialog('close'); }
		}});
    
    jQuery("#table_dialog").dialog({modal: true, autoOpen:false, title:"Insert a Table", width:"auto", buttons: {
			Insert: function() {
			  var wym = jQuery(this).data('wym');
        var sCaption = jQuery(".wym_caption").val();
        var sSummary = jQuery(".wym_summary").val();
        var iRows = jQuery(".wym_rows").val();
        var iCols = jQuery(".wym_cols").val();
        var table_c = "";
        if(iRows > 0 && iCols > 0) {
          var table = wym._doc.createElement(WYMeditor.TABLE);
          table_c = "<table>";
          table_c += "<caption>"+sCaption+"</caption>";
          for(x=0; x<iRows; x++) {
  			    table_c += "<tr>";
  			    for(y=0; y<iCols; y++) {table_c+="<td></td>";}
  			    table_c += "</tr>";
  		    }
  		    table_c += "</table>";
        }
        
        wym.insert( table_c);
			  jQuery(this).dialog('close');
			},
			Cancel: function() { jQuery(this).dialog('close'); }
		}});
    
    jQuery("#quick_upload_pane").dialog({modal: true, autoOpen:false, title:"Upload an Image", width:600});
    jQuery("#upload_url_pane").dialog({modal: true, autoOpen:false, title:"Get Image From URL", width:600,height:500});
    jQuery("#quick_upload_button").click(function(){
      jQuery("#quick_upload_pane").dialog("open");
      jQuery.ajax({
        url: "/admin/files/quickupload/"+content_page_id+"?model="+model_string+"&join_field="+join_field, 
        complete: function(response){
          jQuery("#quick_upload_pane").html(response.responseText); 
          init_upload();
        }
      });
      return false;
    });
    jQuery("#upload_url_button").click(function(){
      jQuery("#upload_url_pane").dialog("open");
      jQuery.ajax({
        url: "/admin/files/upload_url/"+content_page_id+"?model="+model_string+"&join_field="+join_field, 
        complete: function(response){
          jQuery("#upload_url_pane").html(response.responseText); 
          //init_upload();
        },
        global:false
      });
      return false;
    });
    
  
});

function initialise_draggables() {
  jQuery("#category_list .category_tag, #permission_list .permission_tag").draggable({opacity:0.5, revert:true, scroll:false, containment:'window', helper:'clone'});
  jQuery("#cat_dropzone").droppable(
  	{ accept: '.category_tag, .permission_tag', hoverClass:	'dropzone_active', tolerance:	'pointer',
  		drop:	function(event, ui) {
  		  if(ui.draggable.hasClass('permission_tag')) var end_url = "../../add_permission/";
  		  else var end_url = "../../add_category/";
  		  jQuery.post(end_url+content_page_id,{tagid: ui.draggable.attr("id"), id:ui.draggable.attr("id")},
  		  function(response){  jQuery("#cat_dropzone").html(response);  init_deletes(); });
  	}
  });
  jQuery("#category_list .category_tag, #permission_list .permission_tag").dblclick(function(){
    if(jQuery(this).hasClass('permission_tag')) var end_url = "../../add_permission/";
  	else var end_url = "../../add_category/";
    jQuery.post(end_url+content_page_id,{tagid: this.id, id:this.id},
	  function(response){  jQuery("#cat_dropzone").html(response); init_deletes(); });
  });
  init_deletes();
}

function init_deletes(){
  jQuery(".category_trash_button, .permission_trash_button").click(function(){
    if(jQuery(this).hasClass('permission_trash_button')){
      var end_url = "../../remove_permission/";
      var rid = this.id.replace("delete_permission_button_", "");
  	}else{
  	  var end_url = "../../remove_category/";
  	  var rid = this.id.substr(22);
	  }
    jQuery.get(end_url+content_page_id+"?cat="+rid,function(response){
      jQuery("#cat_dropzone").html(response); init_deletes();
    });
  });
}

function delayed_cat_filter(filter) {
  jQuery("#category_filter").css("background", "white url(/images/cms/indicator.gif) no-repeat right center");
  jQuery.ajax({type: "post", url: "/admin/categories/filters", data: {"filter":filter}, 
    success: function(response){ 
      jQuery("#category_list").html(response); 
      initialise_draggables();
      if(typeof(t) != "undefined" ) clearTimeout(t); 
      jQuery("#category_filter").css("background", "white");
    }
  });
}

function delayed_image_filter(filter) {
  jQuery("#image_filter").css("background", "white url(/images/cms/indicator.gif) no-repeat right center");
  jQuery.ajax({type: "get", url: file_browser_location, data: {"mime_type":file_mime_type, "filter":jQuery("#image_filter").val()},
    success: function(response){ 
      jQuery("#image_list").html(response); 
      initialise_images();  
      if(typeof(t) != "undefined" ) clearTimeout(t); 
      jQuery("#image_filter").css("background", "white");
    }
  });
}

/**** Setup for image drag and drop ******/
jQuery(document).ready(function(event) {
	
  jQuery("#image_filter").keyup(function() {
    if(typeof(t) != "undefined" ) clearTimeout(t);
    t = setTimeout('delayed_image_filter(jQuery("#image_filter").val())', 400);
  });
  
  jQuery("#category_filter").keyup(function() {
    if(typeof(t) != "undefined" ) clearTimeout(t);
    t = setTimeout('delayed_cat_filter(jQuery("#category_filter").val())', 400);
  });

  jQuery("#image_filter").focus(function(){if(jQuery(this).val() =="Filter") {jQuery(this).val('');}; });
  jQuery("#category_filter").focus(function(){
    if(jQuery(this).val() =="Filter") {jQuery(this).val('');} 
  });
  jQuery("#category_filter").blur(function(){if(jQuery(this).val() =="") {jQuery(this).val('Filter');} });
  jQuery("#wildfire_file_new_folder").change(function(t){
    jQuery.post(file_browser_location,{filterfolder:jQuery(this).val(), mime_type:file_mime_type},
      function(response) { 
        jQuery("#image_list").html(response); 
        initialise_images(); 
      }
    );
  });
  jQuery("#view_all_button").click(function(){
    jQuery.post(file_browser_location,{mime_type:file_mime_type},
      function(response) { 
        jQuery("#image_list").html(response); 
        initialise_images(); 
      }
    );
  });
  
  
  
  
  /*** Load in the first page of images via ajax ***/
  jQuery.get(file_browser_location, {mime_type:file_mime_type}, function(response){
    jQuery("#image_list").html(response);
    initialise_images();
  });
  jQuery('.jqwysi').wymeditor({
    skinPath: "/stylesheets/wymeditor/wildfire/",
    skin: 'wildfire',
    containersItems: wildfire_containersItems,
    stylesheet: '/stylesheets/wymeditor/wysiwyg_styles.css',
    
    toolsHtml: "<ul class='wym_tools wym_section'>" + WYMeditor.TOOLS_ITEMS + WYMeditor.CLASSES + "</ul>",
    toolsItemHtml:
      "<li class='" + WYMeditor.TOOL_CLASS + "'>"
      + "<a href='#' name='" + WYMeditor.TOOL_NAME + "' title='" + WYMeditor.TOOL_TITLE + "'>"  + WYMeditor.TOOL_TITLE  + "</a>"
      + "</li>", 
      
  
    classesHtml: "<li class='wym_tools_class'><a href='#' name='" + WYMeditor.APPLY_CLASS + "' title='"+ WYMeditor.APPLY_CLASS +"'></a><ul class='wym_classes wym_classes_hidden'>" + WYMeditor.CLASSES_ITEMS + "</ul></li>", 
    classesItemHtml: "<li><a href='#' name='"+ WYMeditor.CLASS_NAME + "'>"+ WYMeditor.CLASS_TITLE+ "</a></li>", 
    classesItemHtmlMultiple: "<li class='wym_tools_class_multiple_rules'><span>" + WYMeditor.CLASS_TITLE + "</span><ul>{classesItemHtml}</ul></li>", 
    containersHtml: "<ul class='wym_containers wym_section'>" + WYMeditor.CONTAINERS_ITEMS + "</ul>", 
    containersItemHtml:
      "<li class='" + WYMeditor.CONTAINER_CLASS + "'>"
        + "<a href='#' name='" + WYMeditor.CONTAINER_NAME + "' title='" + WYMeditor.CONTAINER_TITLE + "'></a>"
      + "</li>", 
    boxHtml:
      "<div class='wym_box'>"
      + "<div class='wym_area_top'>"
      + WYMeditor.TOOLS
      + WYMeditor.CONTAINERS
      + "</div>"
      + "<div class='wym_area_main'>"
      + WYMeditor.HTML
      + WYMeditor.IFRAME
      + WYMeditor.STATUS
      + "</div>"
      + "</div>",
   
    
    postInit: function(wym) {
      wym.wildfire(wym);
      wym_editors.push(wym);
      jQuery(".wym_containers").removeClass("wym_dropdown");
      jQuery(".wym_iframe, iframe").css("height","100%");
      jQuery(window).resize(calc_wym_height);
      calc_wym_height();
    }
  });              
  
  if(jQuery('#quicksave').length){
		autosaver = setInterval(function(){autosave_content(wym_editors);},40000);
  	jQuery("#autosave").click(function(){autosave_content(wym_editors);});
	}
	$("#show_advanced").click(function(){$("#advanced_options").slideToggle(100);});
});

function calc_wym_height(){
  var wymeditor = jQuery("#section-1 .wym_area_main");
  var footer_and_stuff = jQuery('#footer').outerHeight() + jQuery('#section-1 .content_options').outerHeight() + jQuery('#submit').outerHeight();
  var total_height = jQuery(window).height() - wymeditor.offset().top - footer_and_stuff - 15; //15 for good measure
  if(total_height < 200) total_height = 200;
  wymeditor.css("height", total_height);
}

function initialise_images() {
  jQuery(".drag_image").draggable({opacity:0.5, revert:true, scroll:true, containment:'window', helper:'clone'});
  jQuery(".remove_image").click(function(){
    jQuery.get("../../remove_image/"+content_page_id+"?image="+this.id.substr(13)+"&order="+this.parentNode.id.substr(8),function(response){
      jQuery("#drop_zones").html(response);
      initialise_images();
    });
    return false;
  });
  jQuery("#drop_zones").sortable({
    update: function(event, ui) {
      jQuery.post("../../sort_images/"+content_page_id, 
			  {sort: [$(event.target).sortable("serialize")]},
        function(response) {
          jQuery("#drop_zones").html(response);
          initialise_images();
          return true;
        }
      );
    }
  });
  
  /*** Setup image pagination ***/
  
  jQuery(".paginate_images").click(function(){
    jQuery.get(file_browser_location+"/"+this.id.substr(12)+'?pg=1&mime_type='+file_mime_type,{},function(response){
      jQuery("#image_list").html(response);
      initialise_images();
    });
  });

	jQuery("#drop_zones").droppable(
  	{
  	  accept: '.drag_image', hoverClass:'dropzone_active', tolerance: 'pointer',
  		drop:	function (event, ui) {
  			jQuery.post("../../add_image/"+content_page_id, 
				  {id: ui.draggable.attr("id"), order: jQuery('.dropped_image').size()},
          function(response) {
            jQuery("#drop_zones").html(response);
            initialise_images();
            return true;
          }
        );
  		}
  });
  
  jQuery(".url_image").click(function(){
    jQuery.get("/admin/files/image_urls/"+jQuery(this).attr("id").replace("url_image_", ""), function(response){
      jQuery("<div>"+response+"</div>").dialog({title:"Image URL",width:700}).dialog("open");
      
    });
  });
  
  jQuery(".add_image").unbind("click");
  jQuery(".add_image").click(function(){
    jQuery.post("../../add_image/"+content_page_id, 
		  {id: jQuery(this).attr("id").replace("add_image_", ""), order: jQuery('.dropped_image').size()},
      function(response) {
        jQuery("#drop_zones").html(response);
        initialise_images();        
    }); 
    return false;
  });
  
}


function get_query_var(query, variable) {
  var query=query.substring((query.indexOf("?")+1));
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
}

/******* Setup for the link modal window and quick upload window *******/
													
jQuery(document).ready(function() {	
	if(!join_field) var join_field="images";
});

function reload_images(){
	jQuery.post(file_browser_location,{filterfolder:jQuery("#wildfire_file_new_folder").val(), mime_type:file_mime_type},
    function(response) { 
      jQuery("#image_list").html(response); 
      initialise_images(); 
    }
  );
	jQuery.get("../../attached_images/"+content_page_id,
    function(response) { 
      jQuery("#drop_zones").html(response); 
      initialise_images(); 
    }
  );
	

}

/***********  Content editor helpers to add functionality ***************/

function cms_insert_url(type) {
  if(type=='web') {
    var theURL = prompt("Enter the URL for this link:", "http://");
  } else var theURL = type;
  if (theURL != null) {			
		theIframe.contentWindow.document.execCommand("CreateLink", false, theURL);
		theWidgEditor.theToolbar.setState("Link", "on");
	}
}

function cms_insert_video(url, width, height, local) {
	if(local.length > 0){
		theIframe.contentWindow.document.execCommand("inserthtml", false, "<a href='"+url+"' rel='"+width+"px:"+height+"px'>LOCAL:"+local+"</a>");
	}else{
		theIframe.contentWindow.document.execCommand("inserthtml", false, "<a href='"+url+"' rel='"+width+"px:"+height+"px'>"+url+"</a>");
	}
	theWidgEditor.theToolbar.setState("Video", "on");

}

/**** Auto Save Makes Sure Content Doesn't Get Lost *******/
jQuery(document).ready(function() {
  jQuery("#autosave_disable").click(function(){ 
    clearInterval(autosaver); 
    jQuery("#autosave_status").html("Autosave Disabled");
  });
});

function autosave_content(wyms, synchronous) {
  for(var i in wyms) wyms[i].update();
  var ajax_data = {
	  url: "/admin/content/autosave/"+content_page_id, 
	  beforeSend: function(){jQuery("#quicksave").effect("pulsate", { times: 3 }, 1000);},
	  type: "POST",
	  global: false,
    processData: false,
    data: jQuery('#content_edit_form').serialize(),
    success: function(response){
      jQuery("#autosave_status").html("Saved at "+response);
      jQuery('#ajaxBusy').hide();
	  }
	};
	if(synchronous){
	  ajax_data.global = true;
	  ajax_data.async = false;
  }
  jQuery.ajax(ajax_data);
}

function open_modal_preview(url){
	jQuery('body').append('<div id="modal_preview_window"><iframe src="" /></div>');
	jQuery('#modal_preview_window').dialog({
	  autoOpen:false,
	  width:(0.9 * jQuery(window).width()),
	  height:(0.9 * jQuery(window).height()),
	  modal:true,
	  close: function(event, ui){
	    jQuery(this).remove();
	  }
	});

	jQuery('#modal_preview_window iframe').attr('src', '').attr('src', url).load(function(){
		jQuery('#modal_preview_window').dialog('open');
		jQuery('#modal_preview_window iframe').css({'width':'100%','height':'98%','border':'none'});
	});
}

/** list view content preview modals **/
jQuery(document).ready(function(){
  jQuery('a.modal_preview').click(function(){
    open_modal_preview(jQuery(this).attr("href"));
    return false;
  });
});

/** save before preview **/
jQuery(document).ready(function(){
  jQuery('#preview_link').unbind("click").click(function(){
    var preview_but = jQuery(this);
    autosave_content(wym_editors, true); //do an autosave synchronously before the preview
    if(preview_but.hasClass("modal_preview")){
      open_modal_preview(preview_but.attr("href"));
      return false;
    }
  });
});

/****** Inline Edit for content title **************/
jQuery(document).ready(function() {
  jQuery("#content_title_edit").hover(
    function(){
      var target = jQuery(this).parent();
      target.css("background-color", "#fbf485");
      jQuery(this).bind("click.editable", function(){
        jQuery(this).unbind("click.editable");
        el = '<input type="text" value="'+jQuery("#content_title_label").text()+'" id="content_title_editing" />';
        elsave = jQuery("<a href='#' id='content_edit_save'><img src='/images/cms/cms_quick_save.gif'</a>");
        target.parent().after(el);
        jQuery("#content_title_editing").before(elsave);
        jQuery("#content_edit_save").css({position:"relative",left:"255px",top:"10px",width:"0px",cursor:"pointer"});
        elsave.click(function(){
          jQuery("#content_title").show();
          jQuery("#content_title_label").html(jQuery("#content_title_editing").val());
          jQuery("#content_title_editing").remove();
          jQuery(this).remove();
        });
        jQuery("#content_title").hide();
        jQuery("#content_title_editing").change(function(){
					var form_field_id = jQuery('#content_title').attr('rel');
          jQuery("#"+form_field_id).val(jQuery(this).val());
        });
        jQuery("#content_title_editing").blur(function(){
          jQuery("#content_title").show();
          jQuery("#content_title_label").html(jQuery("#content_title_editing").val());
          jQuery("#content_title_editing").remove();
          jQuery("#content_edit_save").remove();
        });
        jQuery("#content_title_editing").get(0).focus();
      });
    },
    function(){
      var target = jQuery(this).parent();
      target.css("background-color", "transparent");
      jQuery(this).unbind("click.editable");
    });
});

/***************************************************/
/*     Ajax Progress Indication                    */
/***************************************************/
jQuery(document).ready(function() { 
	// Setup the ajax indicator
	jQuery("body").append('<div id="ajaxBusy"><p>Loading<br /><img src="/images/cms/indicator_dark.gif"></p></div>');
	jQuery('#ajaxBusy').css({
		display:"none",
		margin:"0",
		position:"absolute",
		background:"#333",
		textAlign: "center",
		fontSize: "100%",
		color: "#999",
		letterSpacing: "5px",
		textTransform: "uppercase",
		border: "1px solid #c1c1c1",
		width:"200px",
		height:"90px",
		"-webkit-box-shadow": "5px 5px 5px #666",
    "-moz-box-shadow": "5px 5px 5px #666",
    lineHeight: "190%",
    "-webkit-border-radius":"7px",
    "-moz-border-radius":"7px"
	});

	// Ajax activity indicator bound 
	// to ajax start/stop document events
	jQuery(document).ajaxStart(function(ajaxevent){ 
	  if(jQuery('#ajaxBusy') && jQuery('#ajaxBusy').length)	jQuery('#ajaxBusy').show().centerScreen(); 
	});
	jQuery(document).ajaxStop(function(){
		if(jQuery('#ajaxBusy') && jQuery('#ajaxBusy').length) jQuery('#ajaxBusy').hide();
	});
	jQuery(document).ajaxError(function(){ 
  	if(jQuery('#ajaxBusy') && jQuery('#ajaxBusy').length) jQuery('#ajaxBusy').hide();
  });
  
  
	
});

function link_dialog_file_choose(){
  jQuery(this).closest('#link_dialog').find('#link_url').val(jQuery(this).val());
}

/** langauge dropdown **/
jQuery(document).ready(function(){
  jQuery('#cms_content_language').change(function(){
    var orig = window.location.href.split("?");
    window.location.replace(orig[0]+"?lang="+jQuery(this).val());
  });
});jQuery(document).ready(function() {
  jQuery("#dashboard #sub-navigation-container #quick_search").remove();
  jQuery("#quick_search form input, #quick_create form input").hint();
  jQuery("#live_search_field").keyup(function() {
    if(typeof(t) != "undefined" ) clearTimeout(t);
    t = setTimeout(function(){live_search(jQuery("#live_search_field").val());}, 400);
  });
  jQuery(".live_search_results").hover(function(){}, function(){
    s = setTimeout('live_search_close()', 800);
  });
  
  if(jQuery("#statistics").length){
    jQuery("#statistics").load("/admin/home/stats", false, function(){
      jQuery(this).css("background-image","none");
    });
  }
});

function live_search(filter) {
  jQuery("#live_search_field").css("background", "white url(/images/cms/indicator.gif) no-repeat right center");
  jQuery.ajax({type: "post", url: "/admin/content/search", data: "input="+filter, 
    complete: function(response){ 
      jQuery("#live_search_field").parent().find(".live_search_results").html(response.responseText).show(); 
      if(typeof(t) != "undefined" ) clearTimeout(t); 
      jQuery("#live_search_field").css("background", "white");
    }
  });
}

function live_search_close() {
  if(typeof(s) != "undefined" ) clearTimeout(s);
  jQuery(".live_search_results").empty();
  jQuery(".live_search_results").hide();
}/**
 * SWFUpload: http://www.swfupload.org, http://swfupload.googlecode.com
 *
 * mmSWFUpload 1.0: Flash upload dialog - http://profandesign.se/swfupload/,  http://www.vinterwebb.se/
 *
 * SWFUpload is (c) 2006-2007 Lars Huring, Olov Nilz�n and Mammon Media and is released under the MIT License:
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
	if(jQuery("#content_page_id").val()) {
	  var post_parameters = {
	    content_id: jQuery("#content_page_id").val(),
		  model_string: jQuery("#content_page_type").val(),
		  join_field: jQuery("#join_field").val()
		};
	} else var post_parameters = {};
	
			var settings = {
				flash_url : "/images/swfupload.swf",
				upload_url: "/file_upload.php",	// Relative to the SWF file
        post_params: post_parameters,				
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


jQuery(document).scroll(function() {

});

jQuery.fn.verticalCenter = function(loaded) { 
  var obj = this; 
  if(!loaded) { 
    obj.css('top', jQuery(window).height()/2-this.height()/2); 
    jQuery(window).resize(function() { obj.centerScreen(!loaded); }); 
  } else { 
    obj.stop(); 
    obj.animate({ 
      top: jQuery(window).height()/2-this.height()/2}, 200, 'linear'); 
  } 
};
jQuery(document).ready(function(){
  jQuery('#cms_users .tabs-nav').tabs();
  initialise_user_draggables();

  jQuery("#cms_users #section_browser_filter").keyup(function() {
    if(typeof(t) != "undefined" ) clearTimeout(t);
    t = setTimeout('delayed_sect_filter(jQuery("#section_browser_filter").val())', 400);
  });
});

function initialise_user_draggables() {
  jQuery("#cms_users .section_tag").draggable({ containment:'window', ghosting: true, opacity: 0.4, revert: true, scroll: false, helper: "clone" });
  jQuery("#cms_users #sect_dropzone").droppable(
  	{ accept: '.section_tag', hoverClass: 'dropzone_active', tolerance: 'pointer',
  		drop:	function(event, ui) {
  		  jQuery.post("../../add_section/"+content_page_id,{id: ui.draggable.attr("id")},
  		  function(response){ jQuery("#sect_dropzone").html(response); initialise_user_draggables(); });
  	}
  });
  jQuery("#cms_users .section_trash_button").click(function(){
    jQuery.get("../../remove_section/"+content_page_id+"?sect="+this.id.substr(21),function(response){
      jQuery("#sect_dropzone").html(response); initialise_user_draggables();
    });
  });
}

function delayed_sect_filter(filter) {
  jQuery("#cms_users #section_browser_filter").css("background", "white url(/images/cms/indicator.gif) no-repeat right center");
  jQuery.ajax({type: "post", url: "/admin/sections/filters", data: "filter="+filter,
    complete: function(response){
      jQuery("#section_list").html(response.responseText);
      initialise_user_draggables();
      if(typeof(t) != "undefined" ) clearTimeout(t);
      jQuery("#section_browser_filter").css("background", "white");
    }
  });
}/**
 * @version 0.5-rc1
 *
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2005 - 2009 Jean-Francois Hovinne, http://www.wymeditor.org/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File: jquery.wymeditor.js
 *
 *        Main JS file with core classes and functions.
 *        See the documentation for more info.
 *
 * About: authors
 *
 *        Jean-Francois Hovinne (jf.hovinne a-t wymeditor dotorg)
 *        Volker Mische (vmx a-t gmx dotde)
 *        Scott Lewis (lewiscot a-t gmail dotcom)
 *        Bermi Ferrer (wymeditor a-t bermi dotorg)
 *        Daniel Reszka (d.reszka a-t wymeditor dotorg)
 *        Jonatan Lundin (jonatan.lundin _at_ gmail.com)
 */

/*
   Namespace: WYMeditor
   Global WYMeditor namespace.
*/
if(!WYMeditor) var WYMeditor = {};

//Wrap the Firebug console in WYMeditor.console
(function() {
    if ( !window.console || !console.firebug ) {
        var names = ["log", "debug", "info", "warn", "error", "assert", "dir", "dirxml",
        "group", "groupEnd", "time", "timeEnd", "count", "trace", "profile", "profileEnd"];

        WYMeditor.console = {};
        for (var i = 0; i < names.length; ++i)
            WYMeditor.console[names[i]] = function() {}

    } else WYMeditor.console = window.console;
})();

jQuery.extend(WYMeditor, {

/*
    Constants: Global WYMeditor constants.

    VERSION             - Defines WYMeditor version.
    INSTANCES           - An array of loaded WYMeditor.editor instances.
    STRINGS             - An array of loaded WYMeditor language pairs/values.
    SKINS               - An array of loaded WYMeditor skins.
    NAME                - The "name" attribute.
    INDEX               - A string replaced by the instance index.
    WYM_INDEX           - A string used to get/set the instance index.
    BASE_PATH           - A string replaced by WYMeditor's base path.
    SKIN_PATH           - A string replaced by WYMeditor's skin path.
    WYM_PATH            - A string replaced by WYMeditor's main JS file path.
    SKINS_DEFAULT_PATH  - The skins default base path.
    SKINS_DEFAULT_CSS   - The skins default CSS file.
    LANG_DEFAULT_PATH   - The language files default path.
    IFRAME_BASE_PATH    - A string replaced by the designmode iframe's base path.
    IFRAME_DEFAULT      - The iframe's default base path.
    JQUERY_PATH         - A string replaced by the computed jQuery path.
    DIRECTION           - A string replaced by the text direction (rtl or ltr).
    LOGO                - A string replaced by WYMeditor logo.
    TOOLS               - A string replaced by the toolbar's HTML.
    TOOLS_ITEMS         - A string replaced by the toolbar items.
    TOOL_NAME           - A string replaced by a toolbar item's name.
    TOOL_TITLE          - A string replaced by a toolbar item's title.
    TOOL_CLASS          - A string replaced by a toolbar item's class.
    CLASSES             - A string replaced by the classes panel's HTML.
    CLASSES_ITEMS       - A string replaced by the classes items.
    CLASS_NAME          - A string replaced by a class item's name.
    CLASS_TITLE         - A string replaced by a class item's title.
    CONTAINERS          - A string replaced by the containers panel's HTML.
    CONTAINERS_ITEMS    - A string replaced by the containers items.
    CONTAINER_NAME      - A string replaced by a container item's name.
    CONTAINER_TITLE     - A string replaced by a container item's title.
    CONTAINER_CLASS     - A string replaced by a container item's class.
    HTML                - A string replaced by the HTML view panel's HTML.
    IFRAME              - A string replaced by the designmode iframe.
    STATUS              - A string replaced by the status panel's HTML.
    DIALOG_TITLE        - A string replaced by a dialog's title.
    DIALOG_BODY         - A string replaced by a dialog's HTML body.
    BODY                - The BODY element.
    STRING              - The "string" type.
    BODY,DIV,P,
    H1,H2,H3,H4,H5,H6,
    PRE,BLOCKQUOTE,
    A,BR,IMG,
    TABLE,TD,TH,
    UL,OL,LI            - HTML elements string representation.
    CLASS,HREF,SRC,
    TITLE,ALT           - HTML attributes string representation.
    DIALOG_LINK         - A link dialog type.
    DIALOG_IMAGE        - An image dialog type.
    DIALOG_TABLE        - A table dialog type.
    DIALOG_PASTE        - A 'Paste from Word' dialog type.
    BOLD                - Command: (un)set selection to <strong>.
    ITALIC              - Command: (un)set selection to <em>.
    CREATE_LINK         - Command: open the link dialog or (un)set link.
    INSERT_IMAGE        - Command: open the image dialog or insert an image.
    INSERT_TABLE        - Command: open the table dialog.
    PASTE               - Command: open the paste dialog.
    INDENT              - Command: nest a list item.
    OUTDENT             - Command: unnest a list item.
    TOGGLE_HTML         - Command: display/hide the HTML view.
    FORMAT_BLOCK        - Command: set a block element to another type.
    PREVIEW             - Command: open the preview dialog.
    UNLINK              - Command: unset a link.
    INSERT_UNORDEREDLIST- Command: insert an unordered list.
    INSERT_ORDEREDLIST  - Command: insert an ordered list.
    MAIN_CONTAINERS     - An array of the main HTML containers used in WYMeditor.
    BLOCKS              - An array of the HTML block elements.
    KEY                 - Standard key codes.
    NODE                - Node types.

*/

    VERSION             : "0.5-rc1",
    INSTANCES           : [],
    STRINGS             : [],
    SKINS               : [],
    NAME                : "name",
    INDEX               : "{Wym_Index}",
    WYM_INDEX           : "wym_index",
    BASE_PATH           : "{Wym_Base_Path}",
    CSS_PATH            : "{Wym_Css_Path}",
    WYM_PATH            : "{Wym_Wym_Path}",
    SKINS_DEFAULT_PATH  : "skins/",
    SKINS_DEFAULT_CSS   : "skin.css",
    SKINS_DEFAULT_JS    : "skin.js",
    LANG_DEFAULT_PATH   : "lang/",
    IFRAME_BASE_PATH    : "{Wym_Iframe_Base_Path}",
    IFRAME_DEFAULT      : "iframe/default/",
    JQUERY_PATH         : "{Wym_Jquery_Path}",
    DIRECTION           : "{Wym_Direction}",
    LOGO                : "{Wym_Logo}",
    TOOLS               : "{Wym_Tools}",
    TOOLS_ITEMS         : "{Wym_Tools_Items}",
    TOOL_NAME           : "{Wym_Tool_Name}",
    TOOL_TITLE          : "{Wym_Tool_Title}",
    TOOL_CLASS          : "{Wym_Tool_Class}",
    CLASSES             : "{Wym_Classes}",
    CLASSES_ITEMS       : "{Wym_Classes_Items}",
    CLASS_NAME          : "{Wym_Class_Name}",
    CLASS_TITLE         : "{Wym_Class_Title}",
    CONTAINERS          : "{Wym_Containers}",
    CONTAINERS_ITEMS    : "{Wym_Containers_Items}",
    CONTAINER_NAME      : "{Wym_Container_Name}",
    CONTAINER_TITLE     : "{Wym_Containers_Title}",
    CONTAINER_CLASS     : "{Wym_Container_Class}",
    HTML                : "{Wym_Html}",
    IFRAME              : "{Wym_Iframe}",
    STATUS              : "{Wym_Status}",
    DIALOG_TITLE        : "{Wym_Dialog_Title}",
    DIALOG_BODY         : "{Wym_Dialog_Body}",
    STRING              : "string",
    BODY                : "body",
    DIV                 : "div",
    P                   : "p",
    H1                  : "h1",
    H2                  : "h2",
    H3                  : "h3",
    H4                  : "h4",
    H5                  : "h5",
    H6                  : "h6",
    PRE                 : "pre",
    BLOCKQUOTE          : "blockquote",
    A                   : "a",
    BR                  : "br",
    IMG                 : "img",
    TABLE               : "table",
    TD                  : "td",
    TH                  : "th",
    UL                  : "ul",
    OL                  : "ol",
    LI                  : "li",
    CLASS               : "class",
    HREF                : "href",
    SRC                 : "src",
    TITLE               : "title",
    ALT                 : "alt",
    DIALOG_LINK         : "Link",
    DIALOG_IMAGE        : "Image",
    DIALOG_TABLE        : "Table",
    DIALOG_PASTE        : "Paste_From_Word",
    BOLD                : "Bold",
    ITALIC              : "Italic",
    CREATE_LINK         : "CreateLink",
    INSERT_IMAGE        : "InsertImage",
    INSERT_TABLE        : "InsertTable",
    INSERT_HTML         : "InsertHTML",
    PASTE               : "Paste",
    INDENT              : "Indent",
    OUTDENT             : "Outdent",
    TOGGLE_HTML         : "ToggleHtml",
    FORMAT_BLOCK        : "FormatBlock",
    PREVIEW             : "Preview",
    UNLINK			        : "Unlink",
    INSERT_UNORDEREDLIST: "InsertUnorderedList",
    INSERT_ORDEREDLIST	: "InsertOrderedList",

    MAIN_CONTAINERS : new Array("p","h1","h2","h3","h4","h5","h6","pre","blockquote"),

    BLOCKS : new Array("address", "blockquote", "div", "dl",
	   "fieldset", "form", "h1", "h2", "h3", "h4", "h5", "h6", "hr",
	   "noscript", "ol", "p", "pre", "table", "ul", "dd", "dt",
	   "li", "tbody", "td", "tfoot", "th", "thead", "tr"),

    KEY : {
      BACKSPACE: 8,
      ENTER: 13,
      END: 35,
      HOME: 36,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40,
      CURSOR: new Array(37, 38, 39, 40),
      DELETE: 46
    },

    NODE : {
      ELEMENT: 1,
      ATTRIBUTE: 2,
      TEXT: 3
    },
	
    /*
        Class: WYMeditor.editor
        WYMeditor editor main class, instanciated for each editor occurrence.
    */

	editor : function(elem, options) {

        /*
            Constructor: WYMeditor.editor

            Initializes main values (index, elements, paths, ...)
            and call WYMeditor.editor.init which initializes the editor.

            Parameters:

                elem - The HTML element to be replaced by the editor.
                options - The hash of options.

            Returns:

                Nothing.

            See Also:

                <WYMeditor.editor.init>
        */

        //store the instance in the INSTANCES array and store the index
        this._index = WYMeditor.INSTANCES.push(this) - 1;
        //store the element replaced by the editor
        this._element = elem;
        //store the options
        this._options = options;
        //store the element's inner value
        this._html = jQuery(elem).val();

        //store the HTML option, if any
        if(this._options.html) this._html = this._options.html;
        //get or compute the base path (where the main JS file is located)
        this._options.basePath = this._options.basePath
        || this.computeBasePath();
        //get or set the skin path (where the skin files are located)
        this._options.skinPath = this._options.skinPath
        || this._options.basePath + WYMeditor.SKINS_DEFAULT_PATH
           + this._options.skin + '/';
        //get or compute the main JS file location
        this._options.wymPath = this._options.wymPath
        || this.computeWymPath();
        //get or set the language files path
        this._options.langPath = this._options.langPath
        || this._options.basePath + WYMeditor.LANG_DEFAULT_PATH;
        //get or set the designmode iframe's base path
        this._options.iframeBasePath = this._options.iframeBasePath
        || this._options.basePath + WYMeditor.IFRAME_DEFAULT;
        //get or compute the jQuery JS file location
        this._options.jQueryPath = this._options.jQueryPath
        || this.computeJqueryPath();

        //initialize the editor instance
        this.init();
	
	}

});


/********** JQUERY **********/

/**
 * Replace an HTML element by WYMeditor
 *
 * @example jQuery(".wymeditor").wymeditor(
 *        {
 *
 *        }
 *      );
 * @desc Example description here
 * 
 * @name WYMeditor
 * @description WYMeditor is a web-based WYSIWYM XHTML editor
 * @param Hash hash A hash of parameters
 * @option Integer iExample Description here
 * @option String sExample Description here
 *
 * @type jQuery
 * @cat Plugins/WYMeditor
 * @author Jean-Francois Hovinne
 */
jQuery.fn.wymeditor = function(options) {

  options = jQuery.extend({

    html:       "",
    
    basePath:   false,
    
    skinPath:    false,
    
    wymPath:    false,
    
    iframeBasePath: false,
    
    jQueryPath: false,
    
    styles: false,
    
    stylesheet: false,
    
    skin:       "default",
    initSkin:   true,
    loadSkin:   true,

    lang:       "en",

    direction:  "ltr",

    boxHtml:   "<div class='wym_box'>"
              + "<div class='wym_area_top'>" 
              + WYMeditor.TOOLS
              + "</div>"
              + "<div class='wym_area_left'></div>"
              + "<div class='wym_area_right'>"
              + WYMeditor.CONTAINERS
              + WYMeditor.CLASSES
              + "</div>"
              + "<div class='wym_area_main'>"
              + WYMeditor.HTML
              + WYMeditor.IFRAME
              + WYMeditor.STATUS
              + "</div>"
              + "<div class='wym_area_bottom'>"
              + WYMeditor.LOGO
              + "</div>"
              + "</div>",

    logoHtml:  "<a class='wym_wymeditor_link' "
              + "href='http://www.wymeditor.org/'>WYMeditor</a>",

    iframeHtml:"<div class='wym_iframe wym_section'>"
              + "<iframe "
              + "src='"
              + WYMeditor.IFRAME_BASE_PATH
              + "wymiframe.html' "
              + "onload='this.contentWindow.parent.WYMeditor.INSTANCES["
              + WYMeditor.INDEX + "].initIframe(this)'"
              + "></iframe>"
              + "</div>",
              
    editorStyles: [],

    toolsHtml: "<div class='wym_tools wym_section'>"
              + "<h2>{Tools}</h2>"
              + "<ul>"
              + WYMeditor.TOOLS_ITEMS
              + "</ul>"
              + "</div>",
              
    toolsItemHtml:   "<li class='"
                        + WYMeditor.TOOL_CLASS
                        + "'><a href='#' name='"
                        + WYMeditor.TOOL_NAME
                        + "' title='"
                        + WYMeditor.TOOL_TITLE
                        + "'>"
                        + WYMeditor.TOOL_TITLE
                        + "</a></li>",

    toolsItems: [
        {'name': 'Bold', 'title': 'Strong', 'css': 'wym_tools_strong'}, 
        {'name': 'Italic', 'title': 'Emphasis', 'css': 'wym_tools_emphasis'},
        {'name': 'Superscript', 'title': 'Superscript',
            'css': 'wym_tools_superscript'},
        {'name': 'Subscript', 'title': 'Subscript',
            'css': 'wym_tools_subscript'},
        {'name': 'InsertOrderedList', 'title': 'Ordered_List',
            'css': 'wym_tools_ordered_list'},
        {'name': 'InsertUnorderedList', 'title': 'Unordered_List',
            'css': 'wym_tools_unordered_list'},
        {'name': 'Indent', 'title': 'Indent', 'css': 'wym_tools_indent'},
        {'name': 'Outdent', 'title': 'Outdent', 'css': 'wym_tools_outdent'},
        {'name': 'Undo', 'title': 'Undo', 'css': 'wym_tools_undo'},
        {'name': 'Redo', 'title': 'Redo', 'css': 'wym_tools_redo'},
        {'name': 'CreateLink', 'title': 'Link', 'css': 'wym_tools_link'},
        {'name': 'Unlink', 'title': 'Unlink', 'css': 'wym_tools_unlink'},
        {'name': 'InsertImage', 'title': 'Image', 'css': 'wym_tools_image'},
        {'name': 'InsertTable', 'title': 'Table', 'css': 'wym_tools_table'},
        {'name': 'Paste', 'title': 'Paste_From_Word',
            'css': 'wym_tools_paste'},
        {'name': 'ToggleHtml', 'title': 'HTML', 'css': 'wym_tools_html'},
        {'name': 'Preview', 'title': 'Preview', 'css': 'wym_tools_preview'}
    ],

    containersHtml:    "<div class='wym_containers wym_section'>"
                        + "<h2>{Containers}</h2>"
                        + "<ul>"
                        + WYMeditor.CONTAINERS_ITEMS
                        + "</ul>"
                        + "</div>",
                        
    containersItemHtml:"<li class='"
                        + WYMeditor.CONTAINER_CLASS
                        + "'>"
                        + "<a href='#' name='"
                        + WYMeditor.CONTAINER_NAME
                        + "'>"
                        + WYMeditor.CONTAINER_TITLE
                        + "</a></li>",
                        
    containersItems: [
        {'name': 'P', 'title': 'Paragraph', 'css': 'wym_containers_p'},
        {'name': 'H1', 'title': 'Heading_1', 'css': 'wym_containers_h1'},
        {'name': 'H2', 'title': 'Heading_2', 'css': 'wym_containers_h2'},
        {'name': 'H3', 'title': 'Heading_3', 'css': 'wym_containers_h3'},
        {'name': 'H4', 'title': 'Heading_4', 'css': 'wym_containers_h4'},
        {'name': 'H5', 'title': 'Heading_5', 'css': 'wym_containers_h5'},
        {'name': 'H6', 'title': 'Heading_6', 'css': 'wym_containers_h6'},
        {'name': 'PRE', 'title': 'Preformatted', 'css': 'wym_containers_pre'},
        {'name': 'BLOCKQUOTE', 'title': 'Blockquote',
            'css': 'wym_containers_blockquote'},
        {'name': 'TH', 'title': 'Table_Header', 'css': 'wym_containers_th'}
    ],

    classesHtml:       "<div class='wym_classes wym_section'>"
                        + "<h2>{Classes}</h2><ul>"
                        + WYMeditor.CLASSES_ITEMS
                        + "</ul></div>",

    classesItemHtml:   "<li class='wym_classes_"
                        + WYMeditor.CLASS_NAME
                        + "'><a href='#' name='"
                        + WYMeditor.CLASS_NAME
                        + "'>"
                        + WYMeditor.CLASS_TITLE
                        + "</a></li>",

    classesItems:      [],

    statusHtml:        "<div class='wym_status wym_section'>"
                        + "<h2>{Status}</h2>"
                        + "</div>",

    htmlHtml:          "<div class='wym_html wym_section'>"
                        + "<h2>{Source_Code}</h2>"
                        + "<textarea class='wym_html_val'></textarea>"
                        + "</div>",

    boxSelector:       ".wym_box",
    toolsSelector:     ".wym_tools",
    toolsListSelector: " ul",
    containersSelector:".wym_containers",
    classesSelector:   ".wym_classes",
    htmlSelector:      ".wym_html",
    iframeSelector:    ".wym_iframe iframe",
    iframeBodySelector:".wym_iframe",
    statusSelector:    ".wym_status",
    toolSelector:      ".wym_tools a",
    containerSelector: ".wym_containers a",
    classSelector:     ".wym_classes a",
    htmlValSelector:   ".wym_html_val",
    
    hrefSelector:      ".wym_href",
    srcSelector:       ".wym_src",
    titleSelector:     ".wym_title",
    altSelector:       ".wym_alt",
    textSelector:      ".wym_text",
    
    rowsSelector:      ".wym_rows",
    colsSelector:      ".wym_cols",
    captionSelector:   ".wym_caption",
    summarySelector:   ".wym_summary",
    
    submitSelector:    ".wym_submit",
    cancelSelector:    ".wym_cancel",
    previewSelector:   "",
    
    dialogTypeSelector:    ".wym_dialog_type",
    dialogLinkSelector:    ".wym_dialog_link",
    dialogImageSelector:   ".wym_dialog_image",
    dialogTableSelector:   ".wym_dialog_table",
    dialogPasteSelector:   ".wym_dialog_paste",
    dialogPreviewSelector: ".wym_dialog_preview",
    
    updateSelector:    ".wymupdate",
    updateEvent:       "click",
    
    dialogFeatures:    "menubar=no,titlebar=no,toolbar=no,resizable=no"
                      + ",width=560,height=300,top=0,left=0",
    dialogFeaturesPreview: "menubar=no,titlebar=no,toolbar=no,resizable=no"
                      + ",scrollbars=yes,width=560,height=300,top=0,left=0",

    dialogHtml:      "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN'"
                      + " 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'>"
                      + "<html dir='"
                      + WYMeditor.DIRECTION
                      + "'><head>"
                      + "<link rel='stylesheet' type='text/css' media='screen'"
                      + " href='"
                      + WYMeditor.CSS_PATH
                      + "' />"
                      + "<title>"
                      + WYMeditor.DIALOG_TITLE
                      + "</title>"
                      + "<script type='text/javascript'"
                      + " src='"
                      + WYMeditor.JQUERY_PATH
                      + "'></script>"
                      + "<script type='text/javascript'"
                      + " src='"
                      + WYMeditor.WYM_PATH
                      + "'></script>"
                      + "</head>"
                      + WYMeditor.DIALOG_BODY
                      + "</html>",
                      
    dialogLinkHtml:  "<body class='wym_dialog wym_dialog_link'"
               + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMeditor.DIALOG_LINK
               + "' />"
               + "<legend>{Link}</legend>"
               + "<div class='row'>"
               + "<label>{URL}</label>"
               + "<input type='text' class='wym_href' value='' size='40' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Title}</label>"
               + "<input type='text' class='wym_title' value='' size='40' />"
               + "</div>"
               + "<div class='row row-indent'>"
               + "<input class='wym_submit' type='button'"
               + " value='{Submit}' />"
               + "<input class='wym_cancel' type='button'"
               + "value='{Cancel}' />"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</body>",
    
    dialogImageHtml:  "<body class='wym_dialog wym_dialog_image'"
               + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMeditor.DIALOG_IMAGE
               + "' />"
               + "<legend>{Image}</legend>"
               + "<div class='row'>"
               + "<label>{URL}</label>"
               + "<input type='text' class='wym_src' value='' size='40' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Alternative_Text}</label>"
               + "<input type='text' class='wym_alt' value='' size='40' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Title}</label>"
               + "<input type='text' class='wym_title' value='' size='40' />"
               + "</div>"
               + "<div class='row row-indent'>"
               + "<input class='wym_submit' type='button'"
               + " value='{Submit}' />"
               + "<input class='wym_cancel' type='button'"
               + "value='{Cancel}' />"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</body>",
    
    dialogTableHtml:  "<body class='wym_dialog wym_dialog_table'"
               + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
               + ">"
               + "<form>"
               + "<fieldset>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMeditor.DIALOG_TABLE
               + "' />"
               + "<legend>{Table}</legend>"
               + "<div class='row'>"
               + "<label>{Caption}</label>"
               + "<input type='text' class='wym_caption' value='' size='40' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Summary}</label>"
               + "<input type='text' class='wym_summary' value='' size='40' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Number_Of_Rows}</label>"
               + "<input type='text' class='wym_rows' value='3' size='3' />"
               + "</div>"
               + "<div class='row'>"
               + "<label>{Number_Of_Cols}</label>"
               + "<input type='text' class='wym_cols' value='2' size='3' />"
               + "</div>"
               + "<div class='row row-indent'>"
               + "<input class='wym_submit' type='button'"
               + " value='{Submit}' />"
               + "<input class='wym_cancel' type='button'"
               + "value='{Cancel}' />"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</body>",

    dialogPasteHtml:  "<body class='wym_dialog wym_dialog_paste'"
               + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
               + ">"
               + "<form>"
               + "<input type='hidden' class='wym_dialog_type' value='"
               + WYMeditor.DIALOG_PASTE
               + "' />"
               + "<fieldset>"
               + "<legend>{Paste_From_Word}</legend>"
               + "<div class='row'>"
               + "<textarea class='wym_text' rows='10' cols='50'></textarea>"
               + "</div>"
               + "<div class='row'>"
               + "<input class='wym_submit' type='button'"
               + " value='{Submit}' />"
               + "<input class='wym_cancel' type='button'"
               + "value='{Cancel}' />"
               + "</div>"
               + "</fieldset>"
               + "</form>"
               + "</body>",

    dialogPreviewHtml: "<body class='wym_dialog wym_dialog_preview'"
                      + " onload='WYMeditor.INIT_DIALOG(" + WYMeditor.INDEX + ")'"
                      + "></body>",
                      
    dialogStyles: [],

    stringDelimiterLeft: "{",
    stringDelimiterRight:"}",
    
    preInit: null,
    preBind: null,
    postInit: null,
    
    preInitDialog: null,
    postInitDialog: null

  }, options);

  return this.each(function() {

    new WYMeditor.editor(jQuery(this),options);
  });
};

/* @name extend
 * @description Returns the WYMeditor instance based on its index
 */
jQuery.extend({
  wymeditors: function(i) {
    return (WYMeditor.INSTANCES[i]);
  }
});


/********** WYMeditor **********/

/* @name Wymeditor
 * @description WYMeditor class
 */

/* @name init
 * @description Initializes a WYMeditor instance
 */
WYMeditor.editor.prototype.init = function() {

  //load subclass - browser specific
  //unsupported browsers: do nothing
  if (jQuery.browser.msie) {
    var WymClass = new WYMeditor.WymClassExplorer(this);
  }
  else if (jQuery.browser.mozilla) {
    var WymClass = new WYMeditor.WymClassMozilla(this);
  }
  else if (jQuery.browser.opera) {
    var WymClass = new WYMeditor.WymClassOpera(this);
  }
  else if (jQuery.browser.safari) {
    var WymClass = new WYMeditor.WymClassSafari(this);
  }
  
  if(WymClass) {
  
      if(jQuery.isFunction(this._options.preInit)) this._options.preInit(this);

      var SaxListener = new WYMeditor.XhtmlSaxListener();
      jQuery.extend(SaxListener, WymClass);
      this.parser = new WYMeditor.XhtmlParser(SaxListener);
      
      if(this._options.styles || this._options.stylesheet){
        this.configureEditorUsingRawCss();
      }
      
      this.helper = new WYMeditor.XmlHelper();
      
      //extend the Wymeditor object
      //don't use jQuery.extend since 1.1.4
      //jQuery.extend(this, WymClass);
      for (var prop in WymClass) { this[prop] = WymClass[prop]; }

      //load wymbox
      this._box = jQuery(this._element).hide().after(this._options.boxHtml).next().addClass('wym_box_' + this._index);

      //store the instance index in wymbox and element replaced by editor instance
      //but keep it compatible with jQuery < 1.2.3, see #122
      if( jQuery.isFunction( jQuery.fn.data ) ) {
        jQuery.data(this._box.get(0), WYMeditor.WYM_INDEX, this._index);
        jQuery.data(this._element.get(0), WYMeditor.WYM_INDEX, this._index);
      }
      
      var h = WYMeditor.Helper;

      //construct the iframe
      var iframeHtml = this._options.iframeHtml;
      iframeHtml = h.replaceAll(iframeHtml, WYMeditor.INDEX, this._index);
      iframeHtml = h.replaceAll(iframeHtml, WYMeditor.IFRAME_BASE_PATH, this._options.iframeBasePath);
      
      //construct wymbox
      var boxHtml = jQuery(this._box).html();
      
      boxHtml = h.replaceAll(boxHtml, WYMeditor.LOGO, this._options.logoHtml);
      boxHtml = h.replaceAll(boxHtml, WYMeditor.TOOLS, this._options.toolsHtml);
      boxHtml = h.replaceAll(boxHtml, WYMeditor.CONTAINERS,this._options.containersHtml);
      boxHtml = h.replaceAll(boxHtml, WYMeditor.CLASSES, this._options.classesHtml);
      boxHtml = h.replaceAll(boxHtml, WYMeditor.HTML, this._options.htmlHtml);
      boxHtml = h.replaceAll(boxHtml, WYMeditor.IFRAME, iframeHtml);
      boxHtml = h.replaceAll(boxHtml, WYMeditor.STATUS, this._options.statusHtml);
      
      //construct tools list
      var aTools = eval(this._options.toolsItems);
      var sTools = "";

      for(var i = 0; i < aTools.length; i++) {
        var oTool = aTools[i];
        if(oTool.name && oTool.title)
          var sTool = this._options.toolsItemHtml;
          var sTool = h.replaceAll(sTool, WYMeditor.TOOL_NAME, oTool.name);
          sTool = h.replaceAll(sTool, WYMeditor.TOOL_TITLE, this._options.stringDelimiterLeft
            + oTool.title
            + this._options.stringDelimiterRight);
          sTool = h.replaceAll(sTool, WYMeditor.TOOL_CLASS, oTool.css);
          sTools += sTool;
      }

      boxHtml = h.replaceAll(boxHtml, WYMeditor.TOOLS_ITEMS, sTools);

      //construct classes list
      var aClasses = eval(this._options.classesItems);
      var sClasses = "";

      for(var i = 0; i < aClasses.length; i++) {
        var oClass = aClasses[i];
        if(oClass.name && oClass.title)
          var sClass = this._options.classesItemHtml;
          sClass = h.replaceAll(sClass, WYMeditor.CLASS_NAME, oClass.name);
          sClass = h.replaceAll(sClass, WYMeditor.CLASS_TITLE, oClass.title);
          sClasses += sClass;
      }

      boxHtml = h.replaceAll(boxHtml, WYMeditor.CLASSES_ITEMS, sClasses);
      
      //construct containers list
      var aContainers = eval(this._options.containersItems);
      var sContainers = "";

      for(var i = 0; i < aContainers.length; i++) {
        var oContainer = aContainers[i];
        if(oContainer.name && oContainer.title)
          var sContainer = this._options.containersItemHtml;
          sContainer = h.replaceAll(sContainer, WYMeditor.CONTAINER_NAME, oContainer.name);
          sContainer = h.replaceAll(sContainer, WYMeditor.CONTAINER_TITLE,
              this._options.stringDelimiterLeft
            + oContainer.title
            + this._options.stringDelimiterRight);
          sContainer = h.replaceAll(sContainer, WYMeditor.CONTAINER_CLASS, oContainer.css);
          sContainers += sContainer;
      }

      boxHtml = h.replaceAll(boxHtml, WYMeditor.CONTAINERS_ITEMS, sContainers);

      //l10n
      boxHtml = this.replaceStrings(boxHtml);
      
      //load html in wymbox
      jQuery(this._box).html(boxHtml);
      
      //hide the html value
      jQuery(this._box).find(this._options.htmlSelector).hide();
      
      //enable the skin
      this.loadSkin();
      
    }
};

WYMeditor.editor.prototype.bindEvents = function() {

  //copy the instance
  var wym = this;
  
  //handle click event on tools buttons
  jQuery(this._box).find(this._options.toolSelector).click(function() {
    wym._iframe.contentWindow.focus(); //See #154
    wym.exec(jQuery(this).attr(WYMeditor.NAME));    
    return(false);
  });
  
  //handle click event on containers buttons
  jQuery(this._box).find(this._options.containerSelector).click(function() {
    wym.container(jQuery(this).attr(WYMeditor.NAME));
    return(false);
  });
  
  //handle keyup event on html value: set the editor value
  //handle focus/blur events to check if the element has focus, see #147
  jQuery(this._box).find(this._options.htmlValSelector)
    .keyup(function() { jQuery(wym._doc.body).html(jQuery(this).val());})
    .focus(function() { jQuery(this).toggleClass('hasfocus'); })
    .blur(function() { jQuery(this).toggleClass('hasfocus'); });

  //handle click event on classes buttons
  jQuery(this._box).find(this._options.classSelector).click(function() {
  
    var aClasses = eval(wym._options.classesItems);
    var sName = jQuery(this).attr(WYMeditor.NAME);
    
    var oClass = WYMeditor.Helper.findByName(aClasses, sName);
    
    if(oClass) {
      var jqexpr = oClass.expr;
      wym.toggleClass(sName, jqexpr);
    }
    wym._iframe.contentWindow.focus(); //See #154
    return(false);
  });
  
  //handle event on update element
  jQuery(this._options.updateSelector)
    .bind(this._options.updateEvent, function() {
      wym.update();
  });
};

WYMeditor.editor.prototype.ready = function() {
  return(this._doc != null);
};


/********** METHODS **********/

/* @name box
 * @description Returns the WYMeditor container
 */
WYMeditor.editor.prototype.box = function() {
  return(this._box);
};

/* @name html
 * @description Get/Set the html value
 */
WYMeditor.editor.prototype.html = function(html) {

  if(typeof html === 'string') jQuery(this._doc.body).html(html);
  else return(jQuery(this._doc.body).html());
};

/* @name xhtml
 * @description Cleans up the HTML
 */
WYMeditor.editor.prototype.xhtml = function() {
    return this.parser.parse(this.html());
};

/* @name exec
 * @description Executes a button command
 */
WYMeditor.editor.prototype.exec = function(cmd) {
  
  //base function for execCommand
  //open a dialog or exec
  switch(cmd) {
    case WYMeditor.CREATE_LINK:
      var container = this.container();
      if(container || this._selected_image) this.dialog(WYMeditor.DIALOG_LINK);
    break;
    
    case WYMeditor.INSERT_IMAGE:
      this.dialog(WYMeditor.DIALOG_IMAGE);
    break;
    
    case WYMeditor.INSERT_TABLE:
      this.dialog(WYMeditor.DIALOG_TABLE);
    break;
    
    case WYMeditor.PASTE:
      this.dialog(WYMeditor.DIALOG_PASTE);
    break;
    
    case WYMeditor.TOGGLE_HTML:
      this.update();
      this.toggleHtml();

      //partially fixes #121 when the user manually inserts an image
      if(!jQuery(this._box).find(this._options.htmlSelector).is(':visible'))
        this.listen();
    break;
    
    case WYMeditor.PREVIEW:
      this.dialog(WYMeditor.PREVIEW, this._options.dialogFeaturesPreview);
    break;
    
    default:
      this._exec(cmd);
    break;
  }
};

/* @name container
 * @description Get/Set the selected container
 */
WYMeditor.editor.prototype.container = function(sType) {

  if(sType) {
  
    var container = null;
    
    if(sType.toLowerCase() == WYMeditor.TH) {
    
      container = this.container();
      
      //find the TD or TH container
      switch(container.tagName.toLowerCase()) {
      
        case WYMeditor.TD: case WYMeditor.TH:
          break;
        default:
          var aTypes = new Array(WYMeditor.TD,WYMeditor.TH);
          container = this.findUp(this.container(), aTypes);
          break;
      }
      
      //if it exists, switch
      if(container!=null) {
      
        sType = (container.tagName.toLowerCase() == WYMeditor.TD)? WYMeditor.TH: WYMeditor.TD;
        this.switchTo(container,sType);
        this.update();
      }
    } else {
  
      //set the container type
      var aTypes=new Array(WYMeditor.P,WYMeditor.H1,WYMeditor.H2,WYMeditor.H3,WYMeditor.H4,WYMeditor.H5,
      WYMeditor.H6,WYMeditor.PRE,WYMeditor.BLOCKQUOTE);
      container = this.findUp(this.container(), aTypes);
      
      if(container) {
  
        var newNode = null;
  
        //blockquotes must contain a block level element
        if(sType.toLowerCase() == WYMeditor.BLOCKQUOTE) {
        
          var blockquote = this.findUp(this.container(), WYMeditor.BLOCKQUOTE);
          
          if(blockquote == null) {
          
            newNode = this._doc.createElement(sType);
            container.parentNode.insertBefore(newNode,container);
            newNode.appendChild(container);
            this.setFocusToNode(newNode.firstChild);
            
          } else {
          
            var nodes = blockquote.childNodes;
            var lgt = nodes.length;
            var firstNode = null;
            
            if(lgt > 0) firstNode = nodes.item(0);
            for(var x=0; x<lgt; x++) {
              blockquote.parentNode.insertBefore(nodes.item(0),blockquote);
            }
            blockquote.parentNode.removeChild(blockquote);
            if(firstNode) this.setFocusToNode(firstNode);
          }
        }
        
        else this.switchTo(container,sType);
      
        this.update();
      }
    }
  }
  else return(this.selected());
};

/* @name toggleClass
 * @description Toggles class on selected element, or one of its parents
 */
WYMeditor.editor.prototype.toggleClass = function(sClass, jqexpr) {

  var container = (this._selected_image
                    ? this._selected_image
                    : jQuery(this.selected()));
  container = jQuery(container).parentsOrSelf(jqexpr);
  jQuery(container).toggleClass(sClass);

  if(!jQuery(container).attr(WYMeditor.CLASS)) jQuery(container).removeAttr(this._class);

};

/* @name findUp
 * @description Returns the first parent or self container, based on its type
 */
WYMeditor.editor.prototype.findUp = function(node, filter) {

  //filter is a string or an array of strings

  if(node) {

      var tagname = node.tagName.toLowerCase();
      
      if(typeof(filter) == WYMeditor.STRING) {
    
        while(tagname != filter && tagname != WYMeditor.BODY) {
        
          node = node.parentNode;
          tagname = node.tagName.toLowerCase();
        }
      
      } else {
      
        var bFound = false;
        
        while(!bFound && tagname != WYMeditor.BODY) {
          for(var i = 0; i < filter.length; i++) {
            if(tagname == filter[i]) {
              bFound = true;
              break;
            }
          }
          if(!bFound) {
            node = node.parentNode;
            tagname = node.tagName.toLowerCase();
          }
        }
      }
      
      if(tagname != WYMeditor.BODY) return(node);
      else return(null);
      
  } else return(null);
};

/* @name switchTo
 * @description Switch the node's type
 */
WYMeditor.editor.prototype.switchTo = function(node,sType) {

  var newNode = this._doc.createElement(sType);
  var html = jQuery(node).html();
  node.parentNode.replaceChild(newNode,node);
  jQuery(newNode).html(html);
  this.setFocusToNode(newNode);
};

WYMeditor.editor.prototype.replaceStrings = function(sVal) {
  //check if the language file has already been loaded
  //if not, get it via a synchronous ajax call
  if(!WYMeditor.STRINGS[this._options.lang]) {
    try {
      eval(jQuery.ajax({url:this._options.langPath
        + this._options.lang + '.js', async:false}).responseText);
    } catch(e) {
        WYMeditor.console.error("WYMeditor: error while parsing language file.");
        return sVal;
    }
  }

  //replace all the strings in sVal and return it
  for (var key in WYMeditor.STRINGS[this._options.lang]) {
    sVal = WYMeditor.Helper.replaceAll(sVal, this._options.stringDelimiterLeft + key 
    + this._options.stringDelimiterRight,
    WYMeditor.STRINGS[this._options.lang][key]);
  };
  return(sVal);
};

WYMeditor.editor.prototype.encloseString = function(sVal) {

  return(this._options.stringDelimiterLeft
    + sVal
    + this._options.stringDelimiterRight);
};

/* @name status
 * @description Prints a status message
 */
WYMeditor.editor.prototype.status = function(sMessage) {

  //print status message
  jQuery(this._box).find(this._options.statusSelector).html(sMessage);
};

/* @name update
 * @description Updates the element and textarea values
 */
WYMeditor.editor.prototype.update = function() {

  var html = this.xhtml();
  jQuery(this._element).val(html);
  jQuery(this._box).find(this._options.htmlValSelector).not('.hasfocus').val(html); //#147
};

/* @name dialog
 * @description Opens a dialog box
 */
WYMeditor.editor.prototype.dialog = function( dialogType, dialogFeatures, bodyHtml ) {
  
  var features = dialogFeatures || this._wym._options.dialogFeatures;
  var wDialog = window.open('', 'dialog', features);

  if(wDialog) {

    var sBodyHtml = "";
    
    switch( dialogType ) {

      case(WYMeditor.DIALOG_LINK):
        sBodyHtml = this._options.dialogLinkHtml;
      break;
      case(WYMeditor.DIALOG_IMAGE):
        sBodyHtml = this._options.dialogImageHtml;
      break;
      case(WYMeditor.DIALOG_TABLE):
        sBodyHtml = this._options.dialogTableHtml;
      break;
      case(WYMeditor.DIALOG_PASTE):
        sBodyHtml = this._options.dialogPasteHtml;
      break;
      case(WYMeditor.PREVIEW):
        sBodyHtml = this._options.dialogPreviewHtml;
      break;

      default:
        sBodyHtml = bodyHtml;
    }
    
    var h = WYMeditor.Helper;

    //construct the dialog
    var dialogHtml = this._options.dialogHtml;
    dialogHtml = h.replaceAll(dialogHtml, WYMeditor.BASE_PATH, this._options.basePath);
    dialogHtml = h.replaceAll(dialogHtml, WYMeditor.DIRECTION, this._options.direction);
    dialogHtml = h.replaceAll(dialogHtml, WYMeditor.CSS_PATH, this._options.skinPath + WYMeditor.SKINS_DEFAULT_CSS);
    dialogHtml = h.replaceAll(dialogHtml, WYMeditor.WYM_PATH, this._options.wymPath);
    dialogHtml = h.replaceAll(dialogHtml, WYMeditor.JQUERY_PATH, this._options.jQueryPath);
    dialogHtml = h.replaceAll(dialogHtml, WYMeditor.DIALOG_TITLE, this.encloseString( dialogType ));
    dialogHtml = h.replaceAll(dialogHtml, WYMeditor.DIALOG_BODY, sBodyHtml);
    dialogHtml = h.replaceAll(dialogHtml, WYMeditor.INDEX, this._index);
      
    dialogHtml = this.replaceStrings(dialogHtml);
    
    var doc = wDialog.document;
    doc.write(dialogHtml);
    doc.close();
  }
};

/* @name toggleHtml
 * @description Shows/Hides the HTML
 */
WYMeditor.editor.prototype.toggleHtml = function() {
  jQuery(this._box).find(this._options.htmlSelector).toggle();
};

WYMeditor.editor.prototype.uniqueStamp = function() {
	var now = new Date();
	return("wym-" + now.getTime());
};

WYMeditor.editor.prototype.paste = function(sData) {
  var sTmp;
  var container = this.selected();
	
  //split the data, using double newlines as the separator
  var aP = sData.split(this._newLine + this._newLine);
  var rExp = new RegExp(this._newLine, "g");

  //add a P for each item
  if(container && container.tagName.toLowerCase() != WYMeditor.BODY) {
    for(x = aP.length - 1; x >= 0; x--) {
        sTmp = aP[x];
        //simple newlines are replaced by a break
        sTmp = sTmp.replace(rExp, "<br />");
        jQuery(container).after("<p>" + sTmp + "</p>");
    }
  } else {
    for(x = 0; x < aP.length; x++) {
        sTmp = aP[x];
        //simple newlines are replaced by a break
        sTmp = sTmp.replace(rExp, "<br />");
        jQuery(this._doc.body).append("<p>" + sTmp + "</p>");
    }
  
  }
};

WYMeditor.editor.prototype.insert = function(html) {
    // Do we have a selection?
    if (this._iframe.contentWindow.getSelection().focusNode != null) {
        // Overwrite selection with provided html
        this._exec( WYMeditor.INSERT_HTML, html);
    } else {
        // Fall back to the internal paste function if there's no selection
        this.paste(html)
    }
};

WYMeditor.editor.prototype.wrap = function(left, right) {
    // Do we have a selection?
    if (this._iframe.contentWindow.getSelection().focusNode != null) {
        // Wrap selection with provided html
        this._exec( WYMeditor.INSERT_HTML, left + this._iframe.contentWindow.getSelection().toString() + right);
    }
};

WYMeditor.editor.prototype.unwrap = function() {
    // Do we have a selection?
    if (this._iframe.contentWindow.getSelection().focusNode != null) {
        // Unwrap selection
        this._exec( WYMeditor.INSERT_HTML, this._iframe.contentWindow.getSelection().toString() );
    }
};

WYMeditor.editor.prototype.addCssRules = function(doc, aCss) {
  var styles = doc.styleSheets[0];
  if(styles) {
    for(var i = 0; i < aCss.length; i++) {
      var oCss = aCss[i];
      if(oCss.name && oCss.css) this.addCssRule(styles, oCss);
    }
  }
};

/********** CONFIGURATION **********/

WYMeditor.editor.prototype.computeBasePath = function() {
  return jQuery(jQuery.grep(jQuery('script'), function(s){
    return (s.src && s.src.match(/jquery\.wymeditor(\.pack|\.min|\.packed)?\.js(\?.*)?$/ ))
  })).attr('src').replace(/jquery\.wymeditor(\.pack|\.min|\.packed)?\.js(\?.*)?$/, '');
};

WYMeditor.editor.prototype.computeWymPath = function() {
  return jQuery(jQuery.grep(jQuery('script'), function(s){
    return (s.src && s.src.match(/jquery\.wymeditor(\.pack|\.min|\.packed)?\.js(\?.*)?$/ ))
  })).attr('src');
};

WYMeditor.editor.prototype.computeJqueryPath = function() {
  return jQuery(jQuery.grep(jQuery('script'), function(s){
    return (s.src && s.src.match(/jquery(-(.*)){0,1}(\.pack|\.min|\.packed)?\.js(\?.*)?$/ ))
  })).attr('src');
};

WYMeditor.editor.prototype.computeCssPath = function() {
  return jQuery(jQuery.grep(jQuery('link'), function(s){
   return (s.href && s.href.match(/wymeditor\/skins\/(.*)screen\.css(\?.*)?$/ ))
  })).attr('href');
};

WYMeditor.editor.prototype.configureEditorUsingRawCss = function() {

  var CssParser = new WYMeditor.WymCssParser();
  if(this._options.stylesheet){
    CssParser.parse(jQuery.ajax({url: this._options.stylesheet,async:false}).responseText);
  }else{
    CssParser.parse(this._options.styles, false);
  }

  if(this._options.classesItems.length == 0) {
    this._options.classesItems = CssParser.css_settings.classesItems;
  }
  if(this._options.editorStyles.length == 0) {
    this._options.editorStyles = CssParser.css_settings.editorStyles;
  }
  if(this._options.dialogStyles.length == 0) {
    this._options.dialogStyles = CssParser.css_settings.dialogStyles;
  }
};

/********** EVENTS **********/

WYMeditor.editor.prototype.listen = function() {

  //don't use jQuery.find() on the iframe body
  //because of MSIE + jQuery + expando issue (#JQ1143)
  //jQuery(this._doc.body).find("*").bind("mouseup", this.mouseup);
  
  jQuery(this._doc.body).bind("mousedown", this.mousedown);
  var images = this._doc.body.getElementsByTagName("img");
  for(var i=0; i < images.length; i++) {
    jQuery(images[i]).bind("mousedown", this.mousedown);
  }
};

WYMeditor.editor.prototype.mousedown = function(evt) {
  
  var wym = WYMeditor.INSTANCES[this.ownerDocument.title];
  wym._selected_image = (this.tagName.toLowerCase() == WYMeditor.IMG) ? this : null;
  evt.stopPropagation();
};

/********** SKINS **********/

/*
 * Function: WYMeditor.loadCss
 *      Loads a stylesheet in the document.
 *
 * Parameters:
 *      href - The CSS path.
 */
WYMeditor.loadCss = function(href) {
    
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;

    var head = jQuery('head').get(0);
    head.appendChild(link);
};

/*
 *  Function: WYMeditor.editor.loadSkin
 *      Loads the skin CSS and initialization script (if needed).
 */
WYMeditor.editor.prototype.loadSkin = function() {

    //does the user want to automatically load the CSS (default: yes)?
    //we also test if it hasn't been already loaded by another instance
    //see below for a better (second) test
    if(this._options.loadSkin && !WYMeditor.SKINS[this._options.skin]) {

        //check if it hasn't been already loaded
        //so we don't load it more than once
        //(we check the existing <link> elements)

        var found = false;
        var rExp = new RegExp(this._options.skin
             + '\/' + WYMeditor.SKINS_DEFAULT_CSS + '$');

        jQuery('link').each( function() {
            if(this.href.match(rExp)) found = true;
        });

        //load it, using the skin path
        if(!found) WYMeditor.loadCss( this._options.skinPath
            + WYMeditor.SKINS_DEFAULT_CSS );
    }

    //put the classname (ex. wym_skin_default) on wym_box
    jQuery(this._box).addClass( "wym_skin_" + this._options.skin );

    //does the user want to use some JS to initialize the skin (default: yes)?
    //also check if it hasn't already been loaded by another instance
    if(this._options.initSkin && !WYMeditor.SKINS[this._options.skin]) {

        eval(jQuery.ajax({url:this._options.skinPath
            + WYMeditor.SKINS_DEFAULT_JS, async:false}).responseText);
    }

    //init the skin, if needed
    if(WYMeditor.SKINS[this._options.skin]
    && WYMeditor.SKINS[this._options.skin].init)
       WYMeditor.SKINS[this._options.skin].init(this);

};


/********** DIALOGS **********/

WYMeditor.INIT_DIALOG = function(index) {

  var wym = window.opener.WYMeditor.INSTANCES[index];
  var doc = window.document;
  var selected = wym.selected();
  var dialogType = jQuery(wym._options.dialogTypeSelector).val();
  var sStamp = wym.uniqueStamp();

  switch(dialogType) {

  case WYMeditor.DIALOG_LINK:
    //ensure that we select the link to populate the fields
    if(selected && selected.tagName && selected.tagName.toLowerCase != WYMeditor.A)
      selected = jQuery(selected).parentsOrSelf(WYMeditor.A);

    //fix MSIE selection if link image has been clicked
    if(!selected && wym._selected_image)
      selected = jQuery(wym._selected_image).parentsOrSelf(WYMeditor.A);
  break;

  }

  //pre-init functions
  if(jQuery.isFunction(wym._options.preInitDialog))
    wym._options.preInitDialog(wym,window);

  //add css rules from options
  var styles = doc.styleSheets[0];
  var aCss = eval(wym._options.dialogStyles);

  wym.addCssRules(doc, aCss);

  //auto populate fields if selected container (e.g. A)
  if(selected) {
    jQuery(wym._options.hrefSelector).val(jQuery(selected).attr(WYMeditor.HREF));
    jQuery(wym._options.srcSelector).val(jQuery(selected).attr(WYMeditor.SRC));
    jQuery(wym._options.titleSelector).val(jQuery(selected).attr(WYMeditor.TITLE));
    jQuery(wym._options.altSelector).val(jQuery(selected).attr(WYMeditor.ALT));
  }

  //auto populate image fields if selected image
  if(wym._selected_image) {
    jQuery(wym._options.dialogImageSelector + " " + wym._options.srcSelector)
      .val(jQuery(wym._selected_image).attr(WYMeditor.SRC));
    jQuery(wym._options.dialogImageSelector + " " + wym._options.titleSelector)
      .val(jQuery(wym._selected_image).attr(WYMeditor.TITLE));
    jQuery(wym._options.dialogImageSelector + " " + wym._options.altSelector)
      .val(jQuery(wym._selected_image).attr(WYMeditor.ALT));
  }

  jQuery(wym._options.dialogLinkSelector + " "
    + wym._options.submitSelector).click(function() {

      var sUrl = jQuery(wym._options.hrefSelector).val();
      if(sUrl.length > 0) {

        wym._exec(WYMeditor.CREATE_LINK, sStamp);

        jQuery("a[href=" + sStamp + "]", wym._doc.body)
            .attr(WYMeditor.HREF, sUrl)
            .attr(WYMeditor.TITLE, jQuery(wym._options.titleSelector).val());

      }
      window.close();
  });

  jQuery(wym._options.dialogImageSelector + " "
    + wym._options.submitSelector).click(function() {

      var sUrl = jQuery(wym._options.srcSelector).val();
      if(sUrl.length > 0) {

        wym._exec(WYMeditor.INSERT_IMAGE, sStamp);

        jQuery("img[src$=" + sStamp + "]", wym._doc.body)
            .attr(WYMeditor.SRC, sUrl)
            .attr(WYMeditor.TITLE, jQuery(wym._options.titleSelector).val())
            .attr(WYMeditor.ALT, jQuery(wym._options.altSelector).val());
      }
      window.close();
  });

  jQuery(wym._options.dialogTableSelector + " "
    + wym._options.submitSelector).click(function() {

      var iRows = jQuery(wym._options.rowsSelector).val();
      var iCols = jQuery(wym._options.colsSelector).val();

      if(iRows > 0 && iCols > 0) {

        var table = wym._doc.createElement(WYMeditor.TABLE);
        var newRow = null;
		var newCol = null;

		var sCaption = jQuery(wym._options.captionSelector).val();

		//we create the caption
		var newCaption = table.createCaption();
		newCaption.innerHTML = sCaption;

		//we create the rows and cells
		for(x=0; x<iRows; x++) {
			newRow = table.insertRow(x);
			for(y=0; y<iCols; y++) {newRow.insertCell(y);}
		}

        //set the summary attr
        jQuery(table).attr('summary',
            jQuery(wym._options.summarySelector).val());

        //append the table after the selected container
        var node = jQuery(wym.findUp(wym.container(),
          WYMeditor.MAIN_CONTAINERS)).get(0);
        if(!node || !node.parentNode) jQuery(wym._doc.body).append(table);
        else jQuery(node).after(table);
      }
      window.close();
  });

  jQuery(wym._options.dialogPasteSelector + " "
    + wym._options.submitSelector).click(function() {

      var sText = jQuery(wym._options.textSelector).val();
      wym.paste(sText);
      window.close();
  });

  jQuery(wym._options.dialogPreviewSelector + " "
    + wym._options.previewSelector)
    .html(wym.xhtml());

  //cancel button
  jQuery(wym._options.cancelSelector).mousedown(function() {
    window.close();
  });

  //pre-init functions
  if(jQuery.isFunction(wym._options.postInitDialog))
    wym._options.postInitDialog(wym,window);

};

/********** XHTML LEXER/PARSER **********/

/*
* @name xml
* @description Use these methods to generate XML and XHTML compliant tags and
* escape tag attributes correctly
* @author Bermi Ferrer - http://bermi.org
* @author David Heinemeier Hansson http://loudthinking.com
*/
WYMeditor.XmlHelper = function()
{
  this._entitiesDiv = document.createElement('div');
  return this;
};


/*
* @name tag
* @description
* Returns an empty HTML tag of type *name* which by default is XHTML
* compliant. Setting *open* to true will create an open tag compatible
* with HTML 4.0 and below. Add HTML attributes by passing an attributes
* array to *options*. For attributes with no value like (disabled and
* readonly), give it a value of true in the *options* array.
*
* Examples:
*
*   this.tag('br')
*    # => <br />
*   this.tag ('br', false, true)
*    # => <br>
*   this.tag ('input', jQuery({type:'text',disabled:true }) )
*    # => <input type="text" disabled="disabled" />
*/
WYMeditor.XmlHelper.prototype.tag = function(name, options, open)
{
  options = options || false;
  open = open || false;
  return '<'+name+(options ? this.tagOptions(options) : '')+(open ? '>' : ' />');
};

/*
* @name contentTag
* @description
* Returns a XML block tag of type *name* surrounding the *content*. Add
* XML attributes by passing an attributes array to *options*. For attributes
* with no value like (disabled and readonly), give it a value of true in
* the *options* array. You can use symbols or strings for the attribute names.
*
*   this.contentTag ('p', 'Hello world!' )
*    # => <p>Hello world!</p>
*   this.contentTag('div', this.contentTag('p', "Hello world!"), jQuery({class : "strong"}))
*    # => <div class="strong"><p>Hello world!</p></div>
*   this.contentTag("select", options, jQuery({multiple : true}))
*    # => <select multiple="multiple">...options...</select>
*/
WYMeditor.XmlHelper.prototype.contentTag = function(name, content, options)
{
  options = options || false;
  return '<'+name+(options ? this.tagOptions(options) : '')+'>'+content+'</'+name+'>';
};

/*
* @name cdataSection
* @description
* Returns a CDATA section for the given +content+.  CDATA sections
* are used to escape blocks of text containing characters which would
* otherwise be recognized as markup. CDATA sections begin with the string
* <tt>&lt;![CDATA[</tt> and } with (and may not contain) the string
* <tt>]]></tt>.
*/
WYMeditor.XmlHelper.prototype.cdataSection = function(content)
{
  return '<![CDATA['+content+']]>';
};


/*
* @name escapeOnce
* @description
* Returns the escaped +xml+ without affecting existing escaped entities.
*
*  this.escapeOnce( "1 > 2 &amp; 3")
*    # => "1 &gt; 2 &amp; 3"
*/
WYMeditor.XmlHelper.prototype.escapeOnce = function(xml)
{
  return this._fixDoubleEscape(this.escapeEntities(xml));
};

/*
* @name _fixDoubleEscape
* @description
* Fix double-escaped entities, such as &amp;amp;, &amp;#123;, etc.
*/
WYMeditor.XmlHelper.prototype._fixDoubleEscape = function(escaped)
{
  return escaped.replace(/&amp;([a-z]+|(#\d+));/ig, "&$1;");
};

/*
* @name tagOptions
* @description
* Takes an array like the one generated by Tag.parseAttributes
*  [["src", "http://www.editam.com/?a=b&c=d&amp;f=g"], ["title", "Editam, <Simplified> CMS"]]
* or an object like {src:"http://www.editam.com/?a=b&c=d&amp;f=g", title:"Editam, <Simplified> CMS"}
* and returns a string properly escaped like
* ' src = "http://www.editam.com/?a=b&amp;c=d&amp;f=g" title = "Editam, &lt;Simplified&gt; CMS"'
* which is valid for strict XHTML
*/
WYMeditor.XmlHelper.prototype.tagOptions = function(options)
{
  var xml = this;
  xml._formated_options = '';

  for (var key in options) {
    var formated_options = '';
    var value = options[key];
    if(typeof value != 'function' && value.length > 0) {

      if(parseInt(key) == key && typeof value == 'object'){
        key = value.shift();
        value = value.pop();
      }
      if(key != '' && value != ''){
        xml._formated_options += ' '+key+'="'+xml.escapeOnce(value)+'"';
      }
    }
  }
  return xml._formated_options;
};

/*
* @name escapeEntities
* @description
* Escapes XML/HTML entities <, >, & and ". If seccond parameter is set to false it
* will not escape ". If set to true it will also escape '
*/
WYMeditor.XmlHelper.prototype.escapeEntities = function(string, escape_quotes)
{
  this._entitiesDiv.innerHTML = string;
  this._entitiesDiv.textContent = string;
  var result = this._entitiesDiv.innerHTML;
  if(typeof escape_quotes == 'undefined'){
    if(escape_quotes != false) result = result.replace('"', '&quot;');
    if(escape_quotes == true)  result = result.replace('"', '&#039;');
  }
  return result;
};

/*
* Parses a string conatining tag attributes and values an returns an array formated like
*  [["src", "http://www.editam.com"], ["title", "Editam, Simplified CMS"]]
*/
WYMeditor.XmlHelper.prototype.parseAttributes = function(tag_attributes)
{
  // Use a compounded regex to match single quoted, double quoted and unquoted attribute pairs
  var result = [];
  var matches = tag_attributes.split(/((=\s*")(")("))|((=\s*\')(\')(\'))|((=\s*[^>\s]*))/g);
  if(matches.toString() != tag_attributes){
    for (var k in matches) {
      var v = matches[k];
      if(typeof v != 'function' && v.length != 0){
        var re = new RegExp('(\\w+)\\s*'+v);
        if(match = tag_attributes.match(re) ){
          var value = v.replace(/^[\s=]+/, "");
          var delimiter = value.charAt(0);
          delimiter = delimiter == '"' ? '"' : (delimiter=="'"?"'":'');
          if(delimiter != ''){
            value = delimiter == '"' ? value.replace(/^"|"+$/g, '') :  value.replace(/^'|'+$/g, '');
          }
          tag_attributes = tag_attributes.replace(match[0],'');
          result.push([match[1] , value]);
        }
      }
    }
  }
  return result;
};

/**
* XhtmlValidator for validating tag attributes
*
* @author Bermi Ferrer - http://bermi.org
*/
WYMeditor.XhtmlValidator = {
  "_attributes":
  {
    "core":
    {
      "except":[
      "base",
      "head",
      "html",
      "meta",
      "param",
      "script",
      "style",
      "title"
      ],
      "attributes":[
      "class",
      "id",
      "style",
      "title",
      "accesskey",
      "tabindex"
      ]
    },
    "language":
    {
      "except":[
      "base",
      "br",
      "hr",
      "iframe",
      "param",
      "script"
      ],
      "attributes":
      {
        "dir":[
        "ltr",
        "rtl"
        ],
        "0":"lang",
        "1":"xml:lang"
      }
    },
    "keyboard":
    {
      "attributes":
      {
        "accesskey":/^(\w){1}$/,
        "tabindex":/^(\d)+$/
      }
    }
  },
  "_events":
  {
    "window":
    {
      "only":[
      "body"
      ],
      "attributes":[
      "onload",
      "onunload"
      ]
    },
    "form":
    {
      "only":[
      "form",
      "input",
      "textarea",
      "select",
      "a",
      "label",
      "button"
      ],
      "attributes":[
      "onchange",
      "onsubmit",
      "onreset",
      "onselect",
      "onblur",
      "onfocus"
      ]
    },
    "keyboard":
    {
      "except":[
      "base",
      "bdo",
      "br",
      "frame",
      "frameset",
      "head",
      "html",
      "iframe",
      "meta",
      "param",
      "script",
      "style",
      "title"
      ],
      "attributes":[
      "onkeydown",
      "onkeypress",
      "onkeyup"
      ]
    },
    "mouse":
    {
      "except":[
      "base",
      "bdo",
      "br",
      "head",
      "html",
      "meta",
      "param",
      "script",
      "style",
      "title"
      ],
      "attributes":[
      "onclick",
      "ondblclick",
      "onmousedown",
      "onmousemove",
      "onmouseover",
      "onmouseout",
      "onmouseup"
      ]
    }
  },
  "_tags":
  {
    "a":
    {
      "attributes":
      {
        "0":"charset",
        "1":"coords",
        "2":"href",
        "3":"hreflang",
        "4":"name",
        "rel":/^(alternate|designates|stylesheet|start|next|prev|contents|index|glossary|copyright|chapter|section|subsection|appendix|help|bookmark| |shortcut|icon)+$/,
        "rev":/^(alternate|designates|stylesheet|start|next|prev|contents|index|glossary|copyright|chapter|section|subsection|appendix|help|bookmark| |shortcut|icon)+$/,
        "shape":/^(rect|rectangle|circ|circle|poly|polygon)$/,
        "5":"type"
      }
    },
    "0":"abbr",
    "1":"acronym",
    "2":"address",
    "area":
    {
      "attributes":
      {
        "0":"alt",
        "1":"coords",
        "2":"href",
        "nohref":/^(true|false)$/,
        "shape":/^(rect|rectangle|circ|circle|poly|polygon)$/
      },
      "required":[
      "alt"
      ]
    },
    "3":"b",
    "base":
    {
      "attributes":[
      "href"
      ],
      "required":[
      "href"
      ]
    },
    "bdo":
    {
      "attributes":
      {
        "dir":/^(ltr|rtl)$/
      },
      "required":[
      "dir"
      ]
    },
    "4":"big",
    "blockquote":
    {
      "attributes":[
      "cite"
      ]
    },
    "5":"body",
    "6":"br",
    "button":
    {
      "attributes":
      {
        "disabled":/^(disabled)$/,
        "type":/^(button|reset|submit)$/,
        "0":"value"
      },
      "inside":"form"
    },
    "7":"caption",
    "8":"cite",
    "9":"code",
    "col":
    {
      "attributes":
      {
        "align":/^(right|left|center|justify)$/,
        "0":"char",
        "1":"charoff",
        "span":/^(\d)+$/,
        "valign":/^(top|middle|bottom|baseline)$/,
        "2":"width"
      },
      "inside":"colgroup"
    },
    "colgroup":
    {
      "attributes":
      {
        "align":/^(right|left|center|justify)$/,
        "0":"char",
        "1":"charoff",
        "span":/^(\d)+$/,
        "valign":/^(top|middle|bottom|baseline)$/,
        "2":"width"
      }
    },
    "10":"dd",
    "del":
    {
      "attributes":
      {
        "0":"cite",
        "datetime":/^([0-9]){8}/
      }
    },
    "11":"div",
    "12":"dfn",
    "13":"dl",
    "14":"dt",
    "15":"em",
    "fieldset":
    {
      "inside":"form"
    },
    "form":
    {
      "attributes":
      {
        "0":"action",
        "1":"accept",
        "2":"accept-charset",
        "3":"enctype",
        "method":/^(get|post)$/
      },
      "required":[
      "action"
      ]
    },
    "head":
    {
      "attributes":[
      "profile"
      ]
    },
    "16":"h1",
    "17":"h2",
    "18":"h3",
    "19":"h4",
    "20":"h5",
    "21":"h6",
    "22":"hr",
    "html":
    {
      "attributes":[
      "xmlns"
      ]
    },
    "23":"i",
    "img":
    {
      "attributes":[
      "alt",
      "src",
      "height",
      "ismap",
      "longdesc",
      "usemap",
      "width"
      ],
      "required":[
      "alt",
      "src"
      ]
    },
    "input":
    {
      "attributes":
      {
        "0":"accept",
        "1":"alt",
        "checked":/^(checked)$/,
        "disabled":/^(disabled)$/,
        "maxlength":/^(\d)+$/,
        "2":"name",
        "readonly":/^(readonly)$/,
        "size":/^(\d)+$/,
        "3":"src",
        "type":/^(button|checkbox|file|hidden|image|password|radio|reset|submit|text)$/,
        "4":"value"
      },
      "inside":"form"
    },
    "ins":
    {
      "attributes":
      {
        "0":"cite",
        "datetime":/^([0-9]){8}/
      }
    },
    "24":"kbd",
    "label":
    {
      "attributes":[
      "for"
      ],
      "inside":"form"
    },
    "25":"legend",
    "26":"li",
    "link":
    {
      "attributes":
      {
        "0":"charset",
        "1":"href",
        "2":"hreflang",
        "media":/^(all|braille|print|projection|screen|speech|,|;| )+$/i,
        //next comment line required by Opera!
        /*"rel":/^(alternate|appendix|bookmark|chapter|contents|copyright|glossary|help|home|index|next|prev|section|start|stylesheet|subsection| |shortcut|icon)+$/i,*/
        "rel":/^(alternate|appendix|bookmark|chapter|contents|copyright|glossary|help|home|index|next|prev|section|start|stylesheet|subsection| |shortcut|icon)+$/i,
        "rev":/^(alternate|appendix|bookmark|chapter|contents|copyright|glossary|help|home|index|next|prev|section|start|stylesheet|subsection| |shortcut|icon)+$/i,
        "3":"type"
      },
      "inside":"head"
    },
    "map":
    {
      "attributes":[
      "id",
      "name"
      ],
      "required":[
      "id"
      ]
    },
    "meta":
    {
      "attributes":
      {
        "0":"content",
        "http-equiv":/^(content\-type|expires|refresh|set\-cookie)$/i,
        "1":"name",
        "2":"scheme"
      },
      "required":[
      "content"
      ]
    },
    "27":"noscript",
    "object":
    {
      "attributes":[
      "archive",
      "classid",
      "codebase",
      "codetype",
      "data",
      "declare",
      "height",
      "name",
      "standby",
      "type",
      "usemap",
      "width"
      ]
    },
    "28":"ol",
    "optgroup":
    {
      "attributes":
      {
        "0":"label",
        "disabled": /^(disabled)$/
      },
      "required":[
      "label"
      ]
    },
    "option":
    {
      "attributes":
      {
        "0":"label",
        "disabled":/^(disabled)$/,
        "selected":/^(selected)$/,
        "1":"value"
      },
      "inside":"select"
    },
    "29":"p",
    "param":
    {
      "attributes":
      {
        "0":"type",
        "valuetype":/^(data|ref|object)$/,
        "1":"valuetype",
        "2":"value"
      },
      "required":[
      "name"
      ]
    },
    "30":"pre",
    "q":
    {
      "attributes":[
      "cite"
      ]
    },
    "31":"samp",
    "script":
    {
      "attributes":
      {
        "type":/^(text\/ecmascript|text\/javascript|text\/jscript|text\/vbscript|text\/vbs|text\/xml)$/,
        "0":"charset",
        "defer":/^(defer)$/,
        "1":"src"
      },
      "required":[
      "type"
      ]
    },
    "select":
    {
      "attributes":
      {
        "disabled":/^(disabled)$/,
        "multiple":/^(multiple)$/,
        "0":"name",
        "1":"size"
      },
      "inside":"form"
    },
    "32":"small",
    "33":"span",
    "34":"strong",
    "style":
    {
      "attributes":
      {
        "0":"type",
        "media":/^(screen|tty|tv|projection|handheld|print|braille|aural|all)$/
      },
      "required":[
      "type"
      ]
    },
    "35":"sub",
    "36":"sup",
    "table":
    {
      "attributes":
      {
        "0":"border",
        "1":"cellpadding",
        "2":"cellspacing",
        "frame":/^(void|above|below|hsides|lhs|rhs|vsides|box|border)$/,
        "rules":/^(none|groups|rows|cols|all)$/,
        "3":"summary",
        "4":"width"
      }
    },
    "tbody":
    {
      "attributes":
      {
        "align":/^(right|left|center|justify)$/,
        "0":"char",
        "1":"charoff",
        "valign":/^(top|middle|bottom|baseline)$/
      }
    },
    "td":
    {
      "attributes":
      {
        "0":"abbr",
        "align":/^(left|right|center|justify|char)$/,
        "1":"axis",
        "2":"char",
        "3":"charoff",
        "colspan":/^(\d)+$/,
        "4":"headers",
        "rowspan":/^(\d)+$/,
        "scope":/^(col|colgroup|row|rowgroup)$/,
        "valign":/^(top|middle|bottom|baseline)$/
      }
    },
    "textarea":
    {
      "attributes":[
      "cols",
      "rows",
      "disabled",
      "name",
      "readonly"
      ],
      "required":[
      "cols",
      "rows"
      ],
      "inside":"form"
    },
    "tfoot":
    {
      "attributes":
      {
        "align":/^(right|left|center|justify)$/,
        "0":"char",
        "1":"charoff",
        "valign":/^(top|middle|bottom)$/,
        "2":"baseline"
      }
    },
    "th":
    {
      "attributes":
      {
        "0":"abbr",
        "align":/^(left|right|center|justify|char)$/,
        "1":"axis",
        "2":"char",
        "3":"charoff",
        "colspan":/^(\d)+$/,
        "4":"headers",
        "rowspan":/^(\d)+$/,
        "scope":/^(col|colgroup|row|rowgroup)$/,
        "valign":/^(top|middle|bottom|baseline)$/
      }
    },
    "thead":
    {
      "attributes":
      {
        "align":/^(right|left|center|justify)$/,
        "0":"char",
        "1":"charoff",
        "valign":/^(top|middle|bottom|baseline)$/
      }
    },
    "37":"title",
    "tr":
    {
      "attributes":
      {
        "align":/^(right|left|center|justify|char)$/,
        "0":"char",
        "1":"charoff",
        "valign":/^(top|middle|bottom|baseline)$/
      }
    },
    "38":"tt",
    "39":"ul",
    "40":"var"
  },

  // Temporary skiped attributes
  skiped_attributes : [],
  skiped_attribute_values : [],

  getValidTagAttributes: function(tag, attributes)
  {
    var valid_attributes = {};
    var possible_attributes = this.getPossibleTagAttributes(tag);
    for(var attribute in attributes) {
      var value = attributes[attribute];
      var h = WYMeditor.Helper;
      if(!h.contains(this.skiped_attributes, attribute) && !h.contains(this.skiped_attribute_values, value)){
        if (typeof value != 'function' && h.contains(possible_attributes, attribute)) {
          if (this.doesAttributeNeedsValidation(tag, attribute)) {
            if(this.validateAttribute(tag, attribute, value)){
              valid_attributes[attribute] = value;
            }
          }else{
            valid_attributes[attribute] = value;
          }
        }
      }
    }
    return valid_attributes;
  },
  getUniqueAttributesAndEventsForTag : function(tag)
  {
    var result = [];

    if (this._tags[tag] && this._tags[tag]['attributes']) {
      for (k in this._tags[tag]['attributes']) {
        result.push(parseInt(k) == k ? this._tags[tag]['attributes'][k] : k);
      }
    }
    return result;
  },
  getDefaultAttributesAndEventsForTags : function()
  {
    var result = [];
    for (var key in this._events){
      result.push(this._events[key]);
    }
    for (var key in this._attributes){
      result.push(this._attributes[key]);
    }
    return result;
  },
  isValidTag : function(tag)
  {
    if(this._tags[tag]){
      return true;
    }
    for(var key in this._tags){
      if(this._tags[key] == tag){
        return true;
      }
    }
    return false;
  },
  getDefaultAttributesAndEventsForTag : function(tag)
  {
    var default_attributes = [];
    if (this.isValidTag(tag)) {
      var default_attributes_and_events = this.getDefaultAttributesAndEventsForTags();

      for(var key in default_attributes_and_events) {
        var defaults = default_attributes_and_events[key];
        if(typeof defaults == 'object'){
          var h = WYMeditor.Helper;
          if ((defaults['except'] && h.contains(defaults['except'], tag)) || (defaults['only'] && !h.contains(defaults['only'], tag))) {
            continue;
          }

          var tag_defaults = defaults['attributes'] ? defaults['attributes'] : defaults['events'];
          for(var k in tag_defaults) {
            default_attributes.push(typeof tag_defaults[k] != 'string' ? k : tag_defaults[k]);
          }
        }
      }
    }
    return default_attributes;
  },
  doesAttributeNeedsValidation: function(tag, attribute)
  {
    return this._tags[tag] && ((this._tags[tag]['attributes'] && this._tags[tag]['attributes'][attribute]) || (this._tags[tag]['required'] &&
     WYMeditor.Helper.contains(this._tags[tag]['required'], attribute)));
  },
  validateAttribute : function(tag, attribute, value)
  {
    if ( this._tags[tag] &&
      (this._tags[tag]['attributes'] && this._tags[tag]['attributes'][attribute] && value.length > 0 && !value.match(this._tags[tag]['attributes'][attribute])) || // invalid format
      (this._tags[tag] && this._tags[tag]['required'] && WYMeditor.Helper.contains(this._tags[tag]['required'], attribute) && value.length == 0) // required attribute
    ) {
      return false;
    }
    return typeof this._tags[tag] != 'undefined';
  },
  getPossibleTagAttributes : function(tag)
  {
    if (!this._possible_tag_attributes) {
      this._possible_tag_attributes = {};
    }
    if (!this._possible_tag_attributes[tag]) {
      this._possible_tag_attributes[tag] = this.getUniqueAttributesAndEventsForTag(tag).concat(this.getDefaultAttributesAndEventsForTag(tag));
    }
    return this._possible_tag_attributes[tag];
  }
};


/**
*    Compounded regular expression. Any of
*    the contained patterns could match and
*    when one does, it's label is returned.
*
*    Constructor. Starts with no patterns.
*    @param boolean case    True for case sensitive, false
*                            for insensitive.
*    @access public
*    @author Marcus Baker (http://lastcraft.com)
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.ParallelRegex = function(case_sensitive)
{
  this._case = case_sensitive;
  this._patterns = [];
  this._labels = [];
  this._regex = null;
  return this;
};


/**
*    Adds a pattern with an optional label.
*    @param string pattern      Perl style regex, but ( and )
*                                lose the usual meaning.
*    @param string label        Label of regex to be returned
*                                on a match.
*    @access public
*/
WYMeditor.ParallelRegex.prototype.addPattern = function(pattern, label)
{
  label = label || true;
  var count = this._patterns.length;
  this._patterns[count] = pattern;
  this._labels[count] = label;
  this._regex = null;
};

/**
*    Attempts to match all patterns at once against
*    a string.
*    @param string subject      String to match against.
*
*    @return boolean             True on success.
*    @return string match         First matched portion of
*                                subject.
*    @access public
*/
WYMeditor.ParallelRegex.prototype.match = function(subject)
{
  if (this._patterns.length == 0) {
    return [false, ''];
  }
  var matches = subject.match(this._getCompoundedRegex());

  if(!matches){
    return [false, ''];
  }
  var match = matches[0];
  for (var i = 1; i < matches.length; i++) {
    if (matches[i]) {
      return [this._labels[i-1], match];
    }
  }
  return [true, matches[0]];
};

/**
*    Compounds the patterns into a single
*    regular expression separated with the
*    "or" operator. Caches the regex.
*    Will automatically escape (, ) and / tokens.
*    @param array patterns    List of patterns in order.
*    @access private
*/
WYMeditor.ParallelRegex.prototype._getCompoundedRegex = function()
{
  if (this._regex == null) {
    for (var i = 0, count = this._patterns.length; i < count; i++) {
      this._patterns[i] = '(' + this._untokenizeRegex(this._tokenizeRegex(this._patterns[i]).replace(/([\/\(\)])/g,'\\$1')) + ')';
    }
    this._regex = new RegExp(this._patterns.join("|") ,this._getPerlMatchingFlags());
  }
  return this._regex;
};

/**
* Escape lookahead/lookbehind blocks
*/
WYMeditor.ParallelRegex.prototype._tokenizeRegex = function(regex)
{
  return regex.
  replace(/\(\?(i|m|s|x|U)\)/,     '~~~~~~Tk1\$1~~~~~~').
  replace(/\(\?(\-[i|m|s|x|U])\)/, '~~~~~~Tk2\$1~~~~~~').
  replace(/\(\?\=(.*)\)/,          '~~~~~~Tk3\$1~~~~~~').
  replace(/\(\?\!(.*)\)/,          '~~~~~~Tk4\$1~~~~~~').
  replace(/\(\?\<\=(.*)\)/,        '~~~~~~Tk5\$1~~~~~~').
  replace(/\(\?\<\!(.*)\)/,        '~~~~~~Tk6\$1~~~~~~').
  replace(/\(\?\:(.*)\)/,          '~~~~~~Tk7\$1~~~~~~');
};

/**
* Unscape lookahead/lookbehind blocks
*/
WYMeditor.ParallelRegex.prototype._untokenizeRegex = function(regex)
{
  return regex.
  replace(/~~~~~~Tk1(.{1})~~~~~~/,    "(?\$1)").
  replace(/~~~~~~Tk2(.{2})~~~~~~/,    "(?\$1)").
  replace(/~~~~~~Tk3(.*)~~~~~~/,      "(?=\$1)").
  replace(/~~~~~~Tk4(.*)~~~~~~/,      "(?!\$1)").
  replace(/~~~~~~Tk5(.*)~~~~~~/,      "(?<=\$1)").
  replace(/~~~~~~Tk6(.*)~~~~~~/,      "(?<!\$1)").
  replace(/~~~~~~Tk7(.*)~~~~~~/,      "(?:\$1)");
};


/**
*    Accessor for perl regex mode flags to use.
*    @return string       Perl regex flags.
*    @access private
*/
WYMeditor.ParallelRegex.prototype._getPerlMatchingFlags = function()
{
  return (this._case ? "m" : "mi");
};



/**
*    States for a stack machine.
*
*    Constructor. Starts in named state.
*    @param string start        Starting state name.
*    @access public
*    @author Marcus Baker (http://lastcraft.com)
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.StateStack = function(start)
{
  this._stack = [start];
  return this;
};

/**
*    Accessor for current state.
*    @return string       State.
*    @access public
*/
WYMeditor.StateStack.prototype.getCurrent = function()
{
  return this._stack[this._stack.length - 1];
};

/**
*    Adds a state to the stack and sets it
*    to be the current state.
*    @param string state        New state.
*    @access public
*/
WYMeditor.StateStack.prototype.enter = function(state)
{
  this._stack.push(state);
};

/**
*    Leaves the current state and reverts
*    to the previous one.
*    @return boolean    False if we drop off
*                       the bottom of the list.
*    @access public
*/
WYMeditor.StateStack.prototype.leave = function()
{
  if (this._stack.length == 1) {
    return false;
  }
  this._stack.pop();
  return true;
};


// GLOBALS
WYMeditor.LEXER_ENTER = 1;
WYMeditor.LEXER_MATCHED = 2;
WYMeditor.LEXER_UNMATCHED = 3;
WYMeditor.LEXER_EXIT = 4;
WYMeditor.LEXER_SPECIAL = 5;


/**
*    Accepts text and breaks it into tokens.
*    Some optimisation to make the sure the
*    content is only scanned by the PHP regex
*    parser once. Lexer modes must not start
*    with leading underscores.
*
*    Sets up the lexer in case insensitive matching
*    by default.
*    @param Parser parser  Handling strategy by reference.
*    @param string start            Starting handler.
*    @param boolean case            True for case sensitive.
*    @access public
*    @author Marcus Baker (http://lastcraft.com)
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.Lexer = function(parser, start, case_sensitive)
{
  start = start || 'accept';
  this._case = case_sensitive || false;
  this._regexes = {};
  this._parser = parser;
  this._mode = new WYMeditor.StateStack(start);
  this._mode_handlers = {};
  this._mode_handlers[start] = start;
  return this;
};

/**
*    Adds a token search pattern for a particular
*    parsing mode. The pattern does not change the
*    current mode.
*    @param string pattern      Perl style regex, but ( and )
*                                lose the usual meaning.
*    @param string mode         Should only apply this
*                                pattern when dealing with
*                                this type of input.
*    @access public
*/
WYMeditor.Lexer.prototype.addPattern = function(pattern, mode)
{
  var mode = mode || "accept";
  if (typeof this._regexes[mode] == 'undefined') {
    this._regexes[mode] = new WYMeditor.ParallelRegex(this._case);
  }
  this._regexes[mode].addPattern(pattern);
  if (typeof this._mode_handlers[mode] == 'undefined') {
    this._mode_handlers[mode] = mode;
  }
};

/**
*    Adds a pattern that will enter a new parsing
*    mode. Useful for entering parenthesis, strings,
*    tags, etc.
*    @param string pattern      Perl style regex, but ( and )
*                                lose the usual meaning.
*    @param string mode         Should only apply this
*                                pattern when dealing with
*                                this type of input.
*    @param string new_mode     Change parsing to this new
*                                nested mode.
*    @access public
*/
WYMeditor.Lexer.prototype.addEntryPattern = function(pattern, mode, new_mode)
{
  if (typeof this._regexes[mode] == 'undefined') {
    this._regexes[mode] = new WYMeditor.ParallelRegex(this._case);
  }
  this._regexes[mode].addPattern(pattern, new_mode);
  if (typeof this._mode_handlers[new_mode] == 'undefined') {
    this._mode_handlers[new_mode] = new_mode;
  }
};

/**
*    Adds a pattern that will exit the current mode
*    and re-enter the previous one.
*    @param string pattern      Perl style regex, but ( and )
*                                lose the usual meaning.
*    @param string mode         Mode to leave.
*    @access public
*/
WYMeditor.Lexer.prototype.addExitPattern = function(pattern, mode)
{
  if (typeof this._regexes[mode] == 'undefined') {
    this._regexes[mode] = new WYMeditor.ParallelRegex(this._case);
  }
  this._regexes[mode].addPattern(pattern, "__exit");
  if (typeof this._mode_handlers[mode] == 'undefined') {
    this._mode_handlers[mode] = mode;
  }
};

/**
*    Adds a pattern that has a special mode. Acts as an entry
*    and exit pattern in one go, effectively calling a special
*    parser handler for this token only.
*    @param string pattern      Perl style regex, but ( and )
*                                lose the usual meaning.
*    @param string mode         Should only apply this
*                                pattern when dealing with
*                                this type of input.
*    @param string special      Use this mode for this one token.
*    @access public
*/
WYMeditor.Lexer.prototype.addSpecialPattern =  function(pattern, mode, special)
{
  if (typeof this._regexes[mode] == 'undefined') {
    this._regexes[mode] = new WYMeditor.ParallelRegex(this._case);
  }
  this._regexes[mode].addPattern(pattern, '_'+special);
  if (typeof this._mode_handlers[special] == 'undefined') {
    this._mode_handlers[special] = special;
  }
};

/**
*    Adds a mapping from a mode to another handler.
*    @param string mode        Mode to be remapped.
*    @param string handler     New target handler.
*    @access public
*/
WYMeditor.Lexer.prototype.mapHandler = function(mode, handler)
{
  this._mode_handlers[mode] = handler;
};

/**
*    Splits the page text into tokens. Will fail
*    if the handlers report an error or if no
*    content is consumed. If successful then each
*    unparsed and parsed token invokes a call to the
*    held listener.
*    @param string raw        Raw HTML text.
*    @return boolean           True on success, else false.
*    @access public
*/
WYMeditor.Lexer.prototype.parse = function(raw)
{
  if (typeof this._parser == 'undefined') {
    return false;
  }

  var length = raw.length;
  var parsed;
  while (typeof (parsed = this._reduce(raw)) == 'object') {
    var raw = parsed[0];
    var unmatched = parsed[1];
    var matched = parsed[2];
    var mode = parsed[3];

    if (! this._dispatchTokens(unmatched, matched, mode)) {
      return false;
    }

    if (raw == '') {
      return true;
    }
    if (raw.length == length) {
      return false;
    }
    length = raw.length;
  }
  if (! parsed ) {
    return false;
  }

  return this._invokeParser(raw, WYMeditor.LEXER_UNMATCHED);
};

/**
*    Sends the matched token and any leading unmatched
*    text to the parser changing the lexer to a new
*    mode if one is listed.
*    @param string unmatched    Unmatched leading portion.
*    @param string matched      Actual token match.
*    @param string mode         Mode after match. A boolean
*                                false mode causes no change.
*    @return boolean             False if there was any error
*                                from the parser.
*    @access private
*/
WYMeditor.Lexer.prototype._dispatchTokens = function(unmatched, matched, mode)
{
  mode = mode || false;

  if (! this._invokeParser(unmatched, WYMeditor.LEXER_UNMATCHED)) {
    return false;
  }

  if (typeof mode == 'boolean') {
    return this._invokeParser(matched, WYMeditor.LEXER_MATCHED);
  }
  if (this._isModeEnd(mode)) {
    if (! this._invokeParser(matched, WYMeditor.LEXER_EXIT)) {
      return false;
    }
    return this._mode.leave();
  }
  if (this._isSpecialMode(mode)) {
    this._mode.enter(this._decodeSpecial(mode));
    if (! this._invokeParser(matched, WYMeditor.LEXER_SPECIAL)) {
      return false;
    }
    return this._mode.leave();
  }
  this._mode.enter(mode);

  return this._invokeParser(matched, WYMeditor.LEXER_ENTER);
};

/**
*    Tests to see if the new mode is actually to leave
*    the current mode and pop an item from the matching
*    mode stack.
*    @param string mode    Mode to test.
*    @return boolean        True if this is the exit mode.
*    @access private
*/
WYMeditor.Lexer.prototype._isModeEnd = function(mode)
{
  return (mode === "__exit");
};

/**
*    Test to see if the mode is one where this mode
*    is entered for this token only and automatically
*    leaves immediately afterwoods.
*    @param string mode    Mode to test.
*    @return boolean        True if this is the exit mode.
*    @access private
*/
WYMeditor.Lexer.prototype._isSpecialMode = function(mode)
{
  return (mode.substring(0,1) == "_");
};

/**
*    Strips the magic underscore marking single token
*    modes.
*    @param string mode    Mode to decode.
*    @return string         Underlying mode name.
*    @access private
*/
WYMeditor.Lexer.prototype._decodeSpecial = function(mode)
{
  return mode.substring(1);
};

/**
*    Calls the parser method named after the current
*    mode. Empty content will be ignored. The lexer
*    has a parser handler for each mode in the lexer.
*    @param string content        Text parsed.
*    @param boolean is_match      Token is recognised rather
*                                  than unparsed data.
*    @access private
*/
WYMeditor.Lexer.prototype._invokeParser = function(content, is_match)
{

  if (!/ +/.test(content) && ((content === '') || (content == false))) {
    return true;
  }
  var current = this._mode.getCurrent();
  var handler = this._mode_handlers[current];
  var result;
  eval('result = this._parser.' + handler + '(content, is_match);');
  return result;
};

/**
*    Tries to match a chunk of text and if successful
*    removes the recognised chunk and any leading
*    unparsed data. Empty strings will not be matched.
*    @param string raw         The subject to parse. This is the
*                               content that will be eaten.
*    @return array/boolean      Three item list of unparsed
*                               content followed by the
*                               recognised token and finally the
*                               action the parser is to take.
*                               True if no match, false if there
*                               is a parsing error.
*    @access private
*/
WYMeditor.Lexer.prototype._reduce = function(raw)
{
  var matched = this._regexes[this._mode.getCurrent()].match(raw);
  var match = matched[1];
  var action = matched[0];
  if (action) {
    var unparsed_character_count = raw.indexOf(match);
    var unparsed = raw.substr(0, unparsed_character_count);
    raw = raw.substring(unparsed_character_count + match.length);
    return [raw, unparsed, match, action];
  }
  return true;
};



/**
* This are the rules for breaking the XHTML code into events
* handled by the provided parser.
*
*    @author Marcus Baker (http://lastcraft.com)
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.XhtmlLexer = function(parser)
{
  jQuery.extend(this, new WYMeditor.Lexer(parser, 'Text'));

  this.mapHandler('Text', 'Text');

  this.addTokens();

  this.init();

  return this;
};


WYMeditor.XhtmlLexer.prototype.init = function()
{
};

WYMeditor.XhtmlLexer.prototype.addTokens = function()
{
  this.addCommentTokens('Text');
  this.addScriptTokens('Text');
  this.addCssTokens('Text');
  this.addTagTokens('Text');
};

WYMeditor.XhtmlLexer.prototype.addCommentTokens = function(scope)
{
  this.addEntryPattern("<!--", scope, 'Comment');
  this.addExitPattern("-->", 'Comment');
};

WYMeditor.XhtmlLexer.prototype.addScriptTokens = function(scope)
{
  this.addEntryPattern("<script", scope, 'Script');
  this.addExitPattern("</script>", 'Script');
};

WYMeditor.XhtmlLexer.prototype.addCssTokens = function(scope)
{
  this.addEntryPattern("<style", scope, 'Css');
  this.addExitPattern("</style>", 'Css');
};

WYMeditor.XhtmlLexer.prototype.addTagTokens = function(scope)
{
  this.addSpecialPattern("<\\s*[a-z0-9:\-]+\\s*>", scope, 'OpeningTag');
  this.addEntryPattern("<[a-z0-9:\-]+"+'[\\\/ \\\>]+', scope, 'OpeningTag');
  this.addInTagDeclarationTokens('OpeningTag');

  this.addSpecialPattern("</\\s*[a-z0-9:\-]+\\s*>", scope, 'ClosingTag');

};

WYMeditor.XhtmlLexer.prototype.addInTagDeclarationTokens = function(scope)
{
  this.addSpecialPattern('\\s+', scope, 'Ignore');

  this.addAttributeTokens(scope);

  this.addExitPattern('/>', scope);
  this.addExitPattern('>', scope);

};

WYMeditor.XhtmlLexer.prototype.addAttributeTokens = function(scope)
{
  this.addSpecialPattern("\\s*[a-z-_0-9]*:?[a-z-_0-9]+\\s*(?=\=)\\s*", scope, 'TagAttributes');

  this.addEntryPattern('=\\s*"', scope, 'DoubleQuotedAttribute');
  this.addPattern("\\\\\"", 'DoubleQuotedAttribute');
  this.addExitPattern('"', 'DoubleQuotedAttribute');

  this.addEntryPattern("=\\s*'", scope, 'SingleQuotedAttribute');
  this.addPattern("\\\\'", 'SingleQuotedAttribute');
  this.addExitPattern("'", 'SingleQuotedAttribute');

  this.addSpecialPattern('=\\s*[^>\\s]*', scope, 'UnquotedAttribute');
};



/**
* XHTML Parser.
*
* This XHTML parser will trigger the events available on on
* current SaxListener
*
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.XhtmlParser = function(Listener, mode)
{
  var mode = mode || 'Text';
  this._Lexer = new WYMeditor.XhtmlLexer(this);
  this._Listener = Listener;
  this._mode = mode;
  this._matches = [];
  this._last_match = '';
  this._current_match = '';

  return this;
};

WYMeditor.XhtmlParser.prototype.parse = function(raw)
{
  this._Lexer.parse(this.beforeParsing(raw));
  return this.afterParsing(this._Listener.getResult());
};

WYMeditor.XhtmlParser.prototype.beforeParsing = function(raw)
{
  if(raw.match(/class="MsoNormal"/) || raw.match(/ns = "urn:schemas-microsoft-com/)){
    // Usefull for cleaning up content pasted from other sources (MSWord)
    this._Listener.avoidStylingTagsAndAttributes();
  }
  return this._Listener.beforeParsing(raw);
};

WYMeditor.XhtmlParser.prototype.afterParsing = function(parsed)
{
  if(this._Listener._avoiding_tags_implicitly){
    this._Listener.allowStylingTagsAndAttributes();
  }
  return this._Listener.afterParsing(parsed);
};


WYMeditor.XhtmlParser.prototype.Ignore = function(match, state)
{
  return true;
};

WYMeditor.XhtmlParser.prototype.Text = function(text)
{
  this._Listener.addContent(text);
  return true;
};

WYMeditor.XhtmlParser.prototype.Comment = function(match, status)
{
  return this._addNonTagBlock(match, status, 'addComment');
};

WYMeditor.XhtmlParser.prototype.Script = function(match, status)
{
  return this._addNonTagBlock(match, status, 'addScript');
};

WYMeditor.XhtmlParser.prototype.Css = function(match, status)
{
  return this._addNonTagBlock(match, status, 'addCss');
};

WYMeditor.XhtmlParser.prototype._addNonTagBlock = function(match, state, type)
{
  switch (state){
    case WYMeditor.LEXER_ENTER:
    this._non_tag = match;
    break;
    case WYMeditor.LEXER_UNMATCHED:
    this._non_tag += match;
    break;
    case WYMeditor.LEXER_EXIT:
    switch(type) {
      case 'addComment':
      this._Listener.addComment(this._non_tag+match);
      break;
      case 'addScript':
      this._Listener.addScript(this._non_tag+match);
      break;
      case 'addCss':
      this._Listener.addCss(this._non_tag+match);
      break;
    }
  }
  return true;
};

WYMeditor.XhtmlParser.prototype.OpeningTag = function(match, state)
{
  switch (state){
    case WYMeditor.LEXER_ENTER:
    this._tag = this.normalizeTag(match);
    this._tag_attributes = {};
    break;
    case WYMeditor.LEXER_SPECIAL:
    this._callOpenTagListener(this.normalizeTag(match));
    break;
    case WYMeditor.LEXER_EXIT:
    this._callOpenTagListener(this._tag, this._tag_attributes);
  }
  return true;
};

WYMeditor.XhtmlParser.prototype.ClosingTag = function(match, state)
{
  this._callCloseTagListener(this.normalizeTag(match));
  return true;
};

WYMeditor.XhtmlParser.prototype._callOpenTagListener = function(tag, attributes)
{
  var  attributes = attributes || {};
  this.autoCloseUnclosedBeforeNewOpening(tag);

  if(this._Listener.isBlockTag(tag)){
    this._Listener._tag_stack.push(tag);
    this._Listener.fixNestingBeforeOpeningBlockTag(tag, attributes);
    this._Listener.openBlockTag(tag, attributes);
    this._increaseOpenTagCounter(tag);
  }else if(this._Listener.isInlineTag(tag)){
    this._Listener.inlineTag(tag, attributes);
  }else{
    this._Listener.openUnknownTag(tag, attributes);
    this._increaseOpenTagCounter(tag);
  }
  this._Listener.last_tag = tag;
  this._Listener.last_tag_opened = true;
  this._Listener.last_tag_attributes = attributes;
};

WYMeditor.XhtmlParser.prototype._callCloseTagListener = function(tag)
{
  if(this._decreaseOpenTagCounter(tag)){
    this.autoCloseUnclosedBeforeTagClosing(tag);

    if(this._Listener.isBlockTag(tag)){
      var expected_tag = this._Listener._tag_stack.pop();
      if(expected_tag == false){
        return;
      }else if(expected_tag != tag){
        tag = expected_tag;
      }
      this._Listener.closeBlockTag(tag);
    }else{
      this._Listener.closeUnknownTag(tag);
    }
  }else{
    this._Listener.closeUnopenedTag(tag);
  }
  this._Listener.last_tag = tag;
  this._Listener.last_tag_opened = false;
};

WYMeditor.XhtmlParser.prototype._increaseOpenTagCounter = function(tag)
{
  this._Listener._open_tags[tag] = this._Listener._open_tags[tag] || 0;
  this._Listener._open_tags[tag]++;
};

WYMeditor.XhtmlParser.prototype._decreaseOpenTagCounter = function(tag)
{
  if(this._Listener._open_tags[tag]){
    this._Listener._open_tags[tag]--;
    if(this._Listener._open_tags[tag] == 0){
      this._Listener._open_tags[tag] = undefined;
    }
    return true;
  }
  return false;
};

WYMeditor.XhtmlParser.prototype.autoCloseUnclosedBeforeNewOpening = function(new_tag)
{
  this._autoCloseUnclosed(new_tag, false);
};

WYMeditor.XhtmlParser.prototype.autoCloseUnclosedBeforeTagClosing = function(tag)
{
  this._autoCloseUnclosed(tag, true);
};

WYMeditor.XhtmlParser.prototype._autoCloseUnclosed = function(new_tag, closing)
{
  var closing = closing || false;
  if(this._Listener._open_tags){
    for (var tag in this._Listener._open_tags) {
      var counter = this._Listener._open_tags[tag];
      if(counter > 0 && this._Listener.shouldCloseTagAutomatically(tag, new_tag, closing)){
        this._callCloseTagListener(tag, true);
      }
    }
  }
};

WYMeditor.XhtmlParser.prototype.getTagReplacements = function()
{
  return this._Listener.getTagReplacements();
};

WYMeditor.XhtmlParser.prototype.normalizeTag = function(tag)
{
  tag = tag.replace(/^([\s<\/>]*)|([\s<\/>]*)$/gm,'').toLowerCase();
  var tags = this._Listener.getTagReplacements();
  if(tags[tag]){
    return tags[tag];
  }
  return tag;
};

WYMeditor.XhtmlParser.prototype.TagAttributes = function(match, state)
{
  if(WYMeditor.LEXER_SPECIAL == state){
    this._current_attribute = match;
  }
  return true;
};

WYMeditor.XhtmlParser.prototype.DoubleQuotedAttribute = function(match, state)
{
  if(WYMeditor.LEXER_UNMATCHED == state){
    this._tag_attributes[this._current_attribute] = match;
  }
  return true;
};

WYMeditor.XhtmlParser.prototype.SingleQuotedAttribute = function(match, state)
{
  if(WYMeditor.LEXER_UNMATCHED == state){
    this._tag_attributes[this._current_attribute] = match;
  }
  return true;
};

WYMeditor.XhtmlParser.prototype.UnquotedAttribute = function(match, state)
{
  this._tag_attributes[this._current_attribute] = match.replace(/^=/,'');
  return true;
};



/**
* XHTML Sax parser.
*
*    @author Bermi Ferrer (http://bermi.org)
*/
WYMeditor.XhtmlSaxListener = function()
{
  this.output = '';
  this.helper = new WYMeditor.XmlHelper();
  this._open_tags = {};
  this.validator = WYMeditor.XhtmlValidator;
  this._tag_stack = [];
  this.avoided_tags = [];

  this.entities = {
    '&nbsp;':'&#160;','&iexcl;':'&#161;','&cent;':'&#162;',
    '&pound;':'&#163;','&curren;':'&#164;','&yen;':'&#165;',
    '&brvbar;':'&#166;','&sect;':'&#167;','&uml;':'&#168;',
    '&copy;':'&#169;','&ordf;':'&#170;','&laquo;':'&#171;',
    '&not;':'&#172;','&shy;':'&#173;','&reg;':'&#174;',
    '&macr;':'&#175;','&deg;':'&#176;','&plusmn;':'&#177;',
    '&sup2;':'&#178;','&sup3;':'&#179;','&acute;':'&#180;',
    '&micro;':'&#181;','&para;':'&#182;','&middot;':'&#183;',
    '&cedil;':'&#184;','&sup1;':'&#185;','&ordm;':'&#186;',
    '&raquo;':'&#187;','&frac14;':'&#188;','&frac12;':'&#189;',
    '&frac34;':'&#190;','&iquest;':'&#191;','&Agrave;':'&#192;',
    '&Aacute;':'&#193;','&Acirc;':'&#194;','&Atilde;':'&#195;',
    '&Auml;':'&#196;','&Aring;':'&#197;','&AElig;':'&#198;',
    '&Ccedil;':'&#199;','&Egrave;':'&#200;','&Eacute;':'&#201;',
    '&Ecirc;':'&#202;','&Euml;':'&#203;','&Igrave;':'&#204;',
    '&Iacute;':'&#205;','&Icirc;':'&#206;','&Iuml;':'&#207;',
    '&ETH;':'&#208;','&Ntilde;':'&#209;','&Ograve;':'&#210;',
    '&Oacute;':'&#211;','&Ocirc;':'&#212;','&Otilde;':'&#213;',
    '&Ouml;':'&#214;','&times;':'&#215;','&Oslash;':'&#216;',
    '&Ugrave;':'&#217;','&Uacute;':'&#218;','&Ucirc;':'&#219;',
    '&Uuml;':'&#220;','&Yacute;':'&#221;','&THORN;':'&#222;',
    '&szlig;':'&#223;','&agrave;':'&#224;','&aacute;':'&#225;',
    '&acirc;':'&#226;','&atilde;':'&#227;','&auml;':'&#228;',
    '&aring;':'&#229;','&aelig;':'&#230;','&ccedil;':'&#231;',
    '&egrave;':'&#232;','&eacute;':'&#233;','&ecirc;':'&#234;',
    '&euml;':'&#235;','&igrave;':'&#236;','&iacute;':'&#237;',
    '&icirc;':'&#238;','&iuml;':'&#239;','&eth;':'&#240;',
    '&ntilde;':'&#241;','&ograve;':'&#242;','&oacute;':'&#243;',
    '&ocirc;':'&#244;','&otilde;':'&#245;','&ouml;':'&#246;',
    '&divide;':'&#247;','&oslash;':'&#248;','&ugrave;':'&#249;',
    '&uacute;':'&#250;','&ucirc;':'&#251;','&uuml;':'&#252;',
    '&yacute;':'&#253;','&thorn;':'&#254;','&yuml;':'&#255;',
    '&OElig;':'&#338;','&oelig;':'&#339;','&Scaron;':'&#352;',
    '&scaron;':'&#353;','&Yuml;':'&#376;','&fnof;':'&#402;',
    '&circ;':'&#710;','&tilde;':'&#732;','&Alpha;':'&#913;',
    '&Beta;':'&#914;','&Gamma;':'&#915;','&Delta;':'&#916;',
    '&Epsilon;':'&#917;','&Zeta;':'&#918;','&Eta;':'&#919;',
    '&Theta;':'&#920;','&Iota;':'&#921;','&Kappa;':'&#922;',
    '&Lambda;':'&#923;','&Mu;':'&#924;','&Nu;':'&#925;',
    '&Xi;':'&#926;','&Omicron;':'&#927;','&Pi;':'&#928;',
    '&Rho;':'&#929;','&Sigma;':'&#931;','&Tau;':'&#932;',
    '&Upsilon;':'&#933;','&Phi;':'&#934;','&Chi;':'&#935;',
    '&Psi;':'&#936;','&Omega;':'&#937;','&alpha;':'&#945;',
    '&beta;':'&#946;','&gamma;':'&#947;','&delta;':'&#948;',
    '&epsilon;':'&#949;','&zeta;':'&#950;','&eta;':'&#951;',
    '&theta;':'&#952;','&iota;':'&#953;','&kappa;':'&#954;',
    '&lambda;':'&#955;','&mu;':'&#956;','&nu;':'&#957;',
    '&xi;':'&#958;','&omicron;':'&#959;','&pi;':'&#960;',
    '&rho;':'&#961;','&sigmaf;':'&#962;','&sigma;':'&#963;',
    '&tau;':'&#964;','&upsilon;':'&#965;','&phi;':'&#966;',
    '&chi;':'&#967;','&psi;':'&#968;','&omega;':'&#969;',
    '&thetasym;':'&#977;','&upsih;':'&#978;','&piv;':'&#982;',
    '&ensp;':'&#8194;','&emsp;':'&#8195;','&thinsp;':'&#8201;',
    '&zwnj;':'&#8204;','&zwj;':'&#8205;','&lrm;':'&#8206;',
    '&rlm;':'&#8207;','&ndash;':'&#8211;','&mdash;':'&#8212;',
    '&lsquo;':'&#8216;','&rsquo;':'&#8217;','&sbquo;':'&#8218;',
    '&ldquo;':'&#8220;','&rdquo;':'&#8221;','&bdquo;':'&#8222;',
    '&dagger;':'&#8224;','&Dagger;':'&#8225;','&bull;':'&#8226;',
    '&hellip;':'&#8230;','&permil;':'&#8240;','&prime;':'&#8242;',
    '&Prime;':'&#8243;','&lsaquo;':'&#8249;','&rsaquo;':'&#8250;',
    '&oline;':'&#8254;','&frasl;':'&#8260;','&euro;':'&#8364;',
    '&image;':'&#8465;','&weierp;':'&#8472;','&real;':'&#8476;',
    '&trade;':'&#8482;','&alefsym;':'&#8501;','&larr;':'&#8592;',
    '&uarr;':'&#8593;','&rarr;':'&#8594;','&darr;':'&#8595;',
    '&harr;':'&#8596;','&crarr;':'&#8629;','&lArr;':'&#8656;',
    '&uArr;':'&#8657;','&rArr;':'&#8658;','&dArr;':'&#8659;',
    '&hArr;':'&#8660;','&forall;':'&#8704;','&part;':'&#8706;',
    '&exist;':'&#8707;','&empty;':'&#8709;','&nabla;':'&#8711;',
    '&isin;':'&#8712;','&notin;':'&#8713;','&ni;':'&#8715;',
    '&prod;':'&#8719;','&sum;':'&#8721;','&minus;':'&#8722;',
    '&lowast;':'&#8727;','&radic;':'&#8730;','&prop;':'&#8733;',
    '&infin;':'&#8734;','&ang;':'&#8736;','&and;':'&#8743;',
    '&or;':'&#8744;','&cap;':'&#8745;','&cup;':'&#8746;',
    '&int;':'&#8747;','&there4;':'&#8756;','&sim;':'&#8764;',
    '&cong;':'&#8773;','&asymp;':'&#8776;','&ne;':'&#8800;',
    '&equiv;':'&#8801;','&le;':'&#8804;','&ge;':'&#8805;',
    '&sub;':'&#8834;','&sup;':'&#8835;','&nsub;':'&#8836;',
    '&sube;':'&#8838;','&supe;':'&#8839;','&oplus;':'&#8853;',
    '&otimes;':'&#8855;','&perp;':'&#8869;','&sdot;':'&#8901;',
    '&lceil;':'&#8968;','&rceil;':'&#8969;','&lfloor;':'&#8970;',
    '&rfloor;':'&#8971;','&lang;':'&#9001;','&rang;':'&#9002;',
    '&loz;':'&#9674;','&spades;':'&#9824;','&clubs;':'&#9827;',
    '&hearts;':'&#9829;','&diams;':'&#9830;'};

    this.block_tags = ["a", "abbr", "acronym", "address", "area", "b",
    "base", "bdo", "big", "blockquote", "body", "button",
    "caption", "cite", "code", "col", "colgroup", "dd", "del", "div",
    "dfn", "dl", "dt", "em", "fieldset", "form", "head", "h1", "h2",
    "h3", "h4", "h5", "h6", "html", "i", "ins",
    "kbd", "label", "legend", "li", "map", "noscript",
    "object", "ol", "optgroup", "option", "p", "param", "pre", "q",
    "samp", "script", "select", "small", "span", "strong", "style",
    "sub", "sup", "table", "tbody", "td", "textarea", "tfoot", "th",
    "thead", "title", "tr", "tt", "ul", "var", "extends"];


    this.inline_tags = ["br", "hr", "img", "input"];

    return this;
};

WYMeditor.XhtmlSaxListener.prototype.shouldCloseTagAutomatically = function(tag, now_on_tag, closing)
{
  var closing = closing || false;
  if(tag == 'td'){
    if((closing && now_on_tag == 'tr') || (!closing && now_on_tag == 'td')){
      return true;
    }
  }
  if(tag == 'option'){
    if((closing && now_on_tag == 'select') || (!closing && now_on_tag == 'option')){
      return true;
    }
  }
  return false;
};

WYMeditor.XhtmlSaxListener.prototype.beforeParsing = function(raw)
{
  this.output = '';
  return raw;
};

WYMeditor.XhtmlSaxListener.prototype.afterParsing = function(xhtml)
{
  xhtml = this.replaceNamedEntities(xhtml);
  xhtml = this.joinRepeatedEntities(xhtml);
  xhtml = this.removeEmptyTags(xhtml);
  xhtml = this.removeBrInPre(xhtml);
  return xhtml;
};

WYMeditor.XhtmlSaxListener.prototype.replaceNamedEntities = function(xhtml)
{
  for (var entity in this.entities) {
    xhtml = xhtml.replace(new RegExp(entity, 'g'), this.entities[entity]);
  }
  return xhtml;
};

WYMeditor.XhtmlSaxListener.prototype.joinRepeatedEntities = function(xhtml)
{
  var tags = 'em|strong|sub|sup|acronym|pre|del|address';
  return xhtml.replace(new RegExp('<\/('+tags+')><\\1>' ,''),'').
  replace(new RegExp('(\s*<('+tags+')>\s*){2}(.*)(\s*<\/\\2>\s*){2}' ,''),'<\$2>\$3<\$2>');
};

WYMeditor.XhtmlSaxListener.prototype.removeEmptyTags = function(xhtml)
{
  return xhtml.replace(new RegExp('<('+this.block_tags.join("|").replace(/\|td/,'').replace(/\|th/, '')+')>(<br \/>|&#160;|&nbsp;|\\s)*<\/\\1>' ,'g'),'');
};

WYMeditor.XhtmlSaxListener.prototype.removeBrInPre = function(xhtml)
{
  var matches = xhtml.match(new RegExp('<pre[^>]*>(.*?)<\/pre>','gmi'));
  if(matches) {
    for(var i=0; i<matches.length; i++) {
      xhtml = xhtml.replace(matches[i], matches[i].replace(new RegExp('<br \/>', 'g'), String.fromCharCode(13,10)));
    }
  }
  return xhtml;
};

WYMeditor.XhtmlSaxListener.prototype.getResult = function()
{
  return this.output;
};

WYMeditor.XhtmlSaxListener.prototype.getTagReplacements = function()
{
  return {'b':'strong', 'i':'em'};
};

WYMeditor.XhtmlSaxListener.prototype.addContent = function(text)
{
  this.output += text;
};

WYMeditor.XhtmlSaxListener.prototype.addComment = function(text)
{
  if(this.remove_comments){
    this.output += text;
  }
};

WYMeditor.XhtmlSaxListener.prototype.addScript = function(text)
{
  if(!this.remove_scripts){
    this.output += text;
  }
};

WYMeditor.XhtmlSaxListener.prototype.addCss = function(text)
{
  if(!this.remove_embeded_styles){
    this.output += text;
  }
};

WYMeditor.XhtmlSaxListener.prototype.openBlockTag = function(tag, attributes)
{
  this.output += this.helper.tag(tag, this.validator.getValidTagAttributes(tag, attributes), true);
};

WYMeditor.XhtmlSaxListener.prototype.inlineTag = function(tag, attributes)
{
  this.output += this.helper.tag(tag, this.validator.getValidTagAttributes(tag, attributes));
};

WYMeditor.XhtmlSaxListener.prototype.openUnknownTag = function(tag, attributes)
{
  //this.output += this.helper.tag(tag, attributes, true);
};

WYMeditor.XhtmlSaxListener.prototype.closeBlockTag = function(tag)
{
  this.output = this.output.replace(/<br \/>$/, '')+this._getClosingTagContent('before', tag)+"</"+tag+">"+this._getClosingTagContent('after', tag);
};

WYMeditor.XhtmlSaxListener.prototype.closeUnknownTag = function(tag)
{
  //this.output += "</"+tag+">";
};

WYMeditor.XhtmlSaxListener.prototype.closeUnopenedTag = function(tag)
{
  this.output += "</"+tag+">";
};

WYMeditor.XhtmlSaxListener.prototype.avoidStylingTagsAndAttributes = function()
{
  this.avoided_tags = ['div','span'];
  this.validator.skiped_attributes = ['style'];
  this.validator.skiped_attribute_values = ['MsoNormal','main1']; // MS Word attributes for class
  this._avoiding_tags_implicitly = true;
};

WYMeditor.XhtmlSaxListener.prototype.allowStylingTagsAndAttributes = function()
{
  this.avoided_tags = [];
  this.validator.skiped_attributes = [];
  this.validator.skiped_attribute_values = [];
  this._avoiding_tags_implicitly = false;
};

WYMeditor.XhtmlSaxListener.prototype.isBlockTag = function(tag)
{
  return !WYMeditor.Helper.contains(this.avoided_tags, tag) && WYMeditor.Helper.contains(this.block_tags, tag);
};

WYMeditor.XhtmlSaxListener.prototype.isInlineTag = function(tag)
{
  return !WYMeditor.Helper.contains(this.avoided_tags, tag) && WYMeditor.Helper.contains(this.inline_tags, tag);
};

WYMeditor.XhtmlSaxListener.prototype.insertContentAfterClosingTag = function(tag, content)
{
  this._insertContentWhenClosingTag('after', tag, content);
};

WYMeditor.XhtmlSaxListener.prototype.insertContentBeforeClosingTag = function(tag, content)
{
  this._insertContentWhenClosingTag('before', tag, content);
};

WYMeditor.XhtmlSaxListener.prototype.fixNestingBeforeOpeningBlockTag = function(tag, attributes)
{
    if(tag != 'li' && (tag == 'ul' || tag == 'ol') && this.last_tag && !this.last_tag_opened && this.last_tag == 'li'){
      this.output = this.output.replace(/<\/li>$/, '');
      this.insertContentAfterClosingTag(tag, '</li>');
    }
};

WYMeditor.XhtmlSaxListener.prototype._insertContentWhenClosingTag = function(position, tag, content)
{
  if(!this['_insert_'+position+'_closing']){
    this['_insert_'+position+'_closing'] = [];
  }
  if(!this['_insert_'+position+'_closing'][tag]){
    this['_insert_'+position+'_closing'][tag] = [];
  }
  this['_insert_'+position+'_closing'][tag].push(content);
};

WYMeditor.XhtmlSaxListener.prototype._getClosingTagContent = function(position, tag)
{
  if( this['_insert_'+position+'_closing'] &&
      this['_insert_'+position+'_closing'][tag] &&
      this['_insert_'+position+'_closing'][tag].length > 0){
        return this['_insert_'+position+'_closing'][tag].pop();
  }
  return '';
};


/********** CSS PARSER **********/


WYMeditor.WymCssLexer = function(parser, only_wym_blocks)
{
  var only_wym_blocks = (typeof only_wym_blocks == 'undefined' ? true : only_wym_blocks);

  jQuery.extend(this, new WYMeditor.Lexer(parser, (only_wym_blocks?'Ignore':'WymCss')));

  this.mapHandler('WymCss', 'Ignore');

  if(only_wym_blocks == true){
    this.addEntryPattern("/\\\x2a[<\\s]*WYMeditor[>\\s]*\\\x2a/", 'Ignore', 'WymCss');
    this.addExitPattern("/\\\x2a[<\/\\s]*WYMeditor[>\\s]*\\\x2a/", 'WymCss');
  }

  this.addSpecialPattern("[\\sa-z1-6]*\\\x2e[a-z-_0-9]+", 'WymCss', 'WymCssStyleDeclaration');

  this.addEntryPattern("/\\\x2a", 'WymCss', 'WymCssComment');
  this.addExitPattern("\\\x2a/", 'WymCssComment');

  this.addEntryPattern("\x7b", 'WymCss', 'WymCssStyle');
  this.addExitPattern("\x7d", 'WymCssStyle');

  this.addEntryPattern("/\\\x2a", 'WymCssStyle', 'WymCssFeedbackStyle');
  this.addExitPattern("\\\x2a/", 'WymCssFeedbackStyle');

  return this;
};

WYMeditor.WymCssParser = function()
{
  this._in_style = false;
  this._has_title = false;
  this.only_wym_blocks = true;
  this.css_settings = {'classesItems':[], 'editorStyles':[], 'dialogStyles':[]};
  return this;
};

WYMeditor.WymCssParser.prototype.parse = function(raw, only_wym_blocks)
{
  var only_wym_blocks = (typeof only_wym_blocks == 'undefined' ? this.only_wym_blocks : only_wym_blocks);
  this._Lexer = new WYMeditor.WymCssLexer(this, only_wym_blocks);
  this._Lexer.parse(raw);
};

WYMeditor.WymCssParser.prototype.Ignore = function(match, state)
{
  return true;
};

WYMeditor.WymCssParser.prototype.WymCssComment = function(text, status)
{
  if(text.match(/end[a-z0-9\s]*wym[a-z0-9\s]*/mi)){
    return false;
  }
  if(status == WYMeditor.LEXER_UNMATCHED){
    if(!this._in_style){
      this._has_title = true;
      this._current_item = {'title':WYMeditor.Helper.trim(text)};
    }else{
      if(this._current_item[this._current_element]){
        if(!this._current_item[this._current_element].expressions){
          this._current_item[this._current_element].expressions = [text];
        }else{
          this._current_item[this._current_element].expressions.push(text);
        }
      }
    }
    this._in_style = true;
  }
  return true;
};

WYMeditor.WymCssParser.prototype.WymCssStyle = function(match, status)
{
  if(status == WYMeditor.LEXER_UNMATCHED){
    match = WYMeditor.Helper.trim(match);
    if(match != ''){
      this._current_item[this._current_element].style = match;
    }
  }else if (status == WYMeditor.LEXER_EXIT){
    this._in_style = false;
    this._has_title = false;
    this.addStyleSetting(this._current_item);
  }
  return true;
};

WYMeditor.WymCssParser.prototype.WymCssFeedbackStyle = function(match, status)
{
  if(status == WYMeditor.LEXER_UNMATCHED){
    this._current_item[this._current_element].feedback_style = match.replace(/^([\s\/\*]*)|([\s\/\*]*)$/gm,'');
  }
  return true;
};

WYMeditor.WymCssParser.prototype.WymCssStyleDeclaration = function(match)
{
  match = match.replace(/^([\s\.]*)|([\s\.*]*)$/gm, '');

  var tag = '';
  if(match.indexOf('.') > 0){
    var parts = match.split('.');
    this._current_element = parts[1];
    var tag = parts[0];
  }else{
    this._current_element = match;
  }

  if(!this._has_title){
    this._current_item = {'title':(!tag?'':tag.toUpperCase()+': ')+this._current_element};
    this._has_title = true;
  }

  if(!this._current_item[this._current_element]){
    this._current_item[this._current_element] = {'name':this._current_element};
  }
  if(tag){
    if(!this._current_item[this._current_element].tags){
      this._current_item[this._current_element].tags = [tag];
    }else{
      this._current_item[this._current_element].tags.push(tag);
    }
  }
  return true;
};

WYMeditor.WymCssParser.prototype.addStyleSetting = function(style_details)
{
  for (var name in style_details){
    var details = style_details[name];
    if(typeof details == 'object' && name != 'title'){
      if(typeof details.expressions == "undefined") details.expressions = [];
      if(typeof details.tags == "undefined") details.tags = [];
      this.css_settings.classesItems.push({
        'name': WYMeditor.Helper.trim(details.name),
        'title': style_details.title,
        'expr' : WYMeditor.Helper.trim((details.expressions||details.tags).join(', '))
      });
      if(details.feedback_style){
        this.css_settings.editorStyles.push({
          'name': '.'+ WYMeditor.Helper.trim(details.name),
          'css': details.feedback_style
        });
      }
      if(details.style){
        this.css_settings.dialogStyles.push({
          'name': '.'+ WYMeditor.Helper.trim(details.name),
          'css': details.style
        });
      }
    }
  }
};

/********** HELPERS **********/

// Returns true if it is a text node with whitespaces only
jQuery.fn.isPhantomNode = function() {
  if (this[0].nodeType == 3)
    return !(/[^\t\n\r ]/.test(this[0].data));

  return false;
};

WYMeditor.isPhantomNode = function(n) {
  if (n.nodeType == 3)
    return !(/[^\t\n\r ]/.test(n.data));

  return false;
};

WYMeditor.isPhantomString = function(str) {
    return !(/[^\t\n\r ]/.test(str));
};

// Returns the Parents or the node itself
// jqexpr = a jQuery expression
jQuery.fn.parentsOrSelf = function(jqexpr) {
  var n = this;

  if (n[0].nodeType == 3)
    n = n.parents().slice(0,1);

//  if (n.is(jqexpr)) // XXX should work, but doesn't (probably a jQuery bug)
  if (n.filter(jqexpr).size() == 1)
    return n;
  else
    return n.parents(jqexpr).slice(0,1);
};

// String & array helpers

WYMeditor.Helper = {

    //replace all instances of 'old' by 'rep' in 'str' string
    replaceAll: function(str, old, rep) {
        var rExp = new RegExp(old, "g");
        return(str.replace(rExp, rep));
    },

    //insert 'inserted' at position 'pos' in 'str' string
    insertAt: function(str, inserted, pos) {
        return(str.substr(0,pos) + inserted + str.substring(pos));
    },

    //trim 'str' string
    trim: function(str) {
        return str.replace(/^(\s*)|(\s*)$/gm,'');
    },

    //return true if 'arr' array contains 'elem', or false
    contains: function(arr, elem) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === elem) return true;
        }
        return false;
    },

    //return 'item' position in 'arr' array, or -1
    indexOf: function(arr, item) {
        var ret=-1;
        for(var i = 0; i < arr.length; i++) {
            if (arr[i] == item) {
                ret = i;
                break;
            }
        }
	    return(ret);
    },

    //return 'item' object in 'arr' array, checking its 'name' property, or null
    findByName: function(arr, name) {
        for(var i = 0; i < arr.length; i++) {
            var item = arr[i];
            if(item.name == name) return(item);
        }
        return(null);
    }
};


/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2005 - 2009 Jean-Francois Hovinne, http://www.wymeditor.org/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File Name:
 *        jquery.wymeditor.explorer.js
 *        MSIE specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne a-t wymeditor dotorg)
 *        Bermi Ferrer (wymeditor a-t bermi dotorg)
 *        Frédéric Palluel-Lafleur (fpalluel a-t gmail dotcom)
 *        Jonatan Lundin (jonatan.lundin _at_ gmail.com)
 */

WYMeditor.WymClassExplorer = function(wym) {

    this._wym = wym;
    this._class = "className";
    this._newLine = "\r\n";

};

WYMeditor.WymClassExplorer.prototype.initIframe = function(iframe) {

    //This function is executed twice, though it is called once!
    //But MSIE needs that, otherwise designMode won't work.
    //Weird.
    
    this._iframe = iframe;
    this._doc = iframe.contentWindow.document;
    
    //add css rules from options
    var styles = this._doc.styleSheets[0];
    var aCss = eval(this._options.editorStyles);

    this.addCssRules(this._doc, aCss);

    this._doc.title = this._wym._index;

    //set the text direction
    jQuery('html', this._doc).attr('dir', this._options.direction);
    
    //init html value
    jQuery(this._doc.body).html(this._wym._html);
    
    //handle events
    var wym = this;
    
    this._doc.body.onfocus = function()
      {wym._doc.designMode = "on"; wym._doc = iframe.contentWindow.document;};
    this._doc.onbeforedeactivate = function() {wym.saveCaret();};
    this._doc.onkeyup = function() {
      wym.saveCaret();
      wym.keyup();
    };
    this._doc.onclick = function() {wym.saveCaret();};
    
    this._doc.body.onbeforepaste = function() {
      wym._iframe.contentWindow.event.returnValue = false;
    };
    
    this._doc.body.onpaste = function() {
      wym._iframe.contentWindow.event.returnValue = false;
      wym.paste(window.clipboardData.getData("Text"));
    };
    
    //callback can't be executed twice, so we check
    if(this._initialized) {
      
      //pre-bind functions
      if(jQuery.isFunction(this._options.preBind)) this._options.preBind(this);
      
      //bind external events
      this._wym.bindEvents();
      
      //post-init functions
      if(jQuery.isFunction(this._options.postInit)) this._options.postInit(this);
      
      //add event listeners to doc elements, e.g. images
      this.listen();
    }
    
    this._initialized = true;
    
    //init designMode
    this._doc.designMode="on";
    try{
        // (bermi's note) noticed when running unit tests on IE6
        // Is this really needed, it trigger an unexisting property on IE6
        this._doc = iframe.contentWindow.document; 
    }catch(e){}
};

WYMeditor.WymClassExplorer.prototype._exec = function(cmd,param) {
    switch(cmd) {
    
    case WYMeditor.INDENT: case WYMeditor.OUTDENT:
    
        var container = this.findUp(this.container(), WYMeditor.LI);
        if(container) {
            var ancestor = container.parentNode.parentNode;
            if(container.parentNode.childNodes.length>1
              || ancestor.tagName.toLowerCase() == WYMeditor.OL
              || ancestor.tagName.toLowerCase() == WYMeditor.UL)
              this._doc.execCommand(cmd);
        }
    break;
    default:
        if(param) this._doc.execCommand(cmd,'false',param);
        else this._doc.execCommand(cmd);
    break;
	}
    this.listen();
};

WYMeditor.WymClassExplorer.prototype.selected = function() {

    var caretPos = this._iframe.contentWindow.document.caretPos;
        if(caretPos!=null) {
            if(caretPos.parentElement!=undefined)
              return(caretPos.parentElement());
        }
};

WYMeditor.WymClassExplorer.prototype.saveCaret = function() {

    this._doc.caretPos = this._doc.selection.createRange();
};

WYMeditor.WymClassExplorer.prototype.addCssRule = function(styles, oCss) {

    styles.addRule(oCss.name, oCss.css);
};

WYMeditor.WymClassExplorer.prototype.insert = function(html) {

    // Get the current selection
    var range = this._doc.selection.createRange();

    // Check if the current selection is inside the editor
    if ( jQuery(range.parentElement()).parents( this._options.iframeBodySelector ).is('*') ) {
        try {
            // Overwrite selection with provided html
            range.pasteHTML(html);
        } catch (e) { }
    } else {
        // Fall back to the internal paste function if there's no selection
        this.paste(html);
    }
};

WYMeditor.WymClassExplorer.prototype.wrap = function(left, right) {

    // Get the current selection
    var range = this._doc.selection.createRange();

    // Check if the current selection is inside the editor
    if ( jQuery(range.parentElement()).parents( this._options.iframeBodySelector ).is('*') ) {
        try {
            // Overwrite selection with provided html
            range.pasteHTML(left + range.text + right);
        } catch (e) { }
    }
};

WYMeditor.WymClassExplorer.prototype.unwrap = function() {

    // Get the current selection
    var range = this._doc.selection.createRange();

    // Check if the current selection is inside the editor
    if ( jQuery(range.parentElement()).parents( this._options.iframeBodySelector ).is('*') ) {
        try {
            // Unwrap selection
            var text = range.text;
            this._exec( 'Cut' );
            range.pasteHTML( text );
        } catch (e) { }
    }
};

//keyup handler
WYMeditor.WymClassExplorer.prototype.keyup = function() {
  this._selected_image = null;
};

WYMeditor.WymClassExplorer.prototype.keydown = function(evt) {
  if(evt.keyCode == 13 && evt.shiftKey) {
    evt.preventDefault();
    wym.insert('<br>');
    return false;
  }
};

WYMeditor.WymClassExplorer.prototype.setFocusToNode = function(node) {
    var range = this._doc.selection.createRange();
    range.moveToElementText(node);
    range.collapse(false);
    range.move('character',-1);
    range.select();
    node.focus();
};

/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2005 - 2009 Jean-Francois Hovinne, http://www.wymeditor.org/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File Name:
 *        jquery.wymeditor.mozilla.js
 *        Gecko specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne a-t wymeditor dotorg)
 *        Volker Mische (vmx a-t gmx dotde)
 *        Bermi Ferrer (wymeditor a-t bermi dotorg)
 *        Frédéric Palluel-Lafleur (fpalluel a-t gmail dotcom)
 */

WYMeditor.WymClassMozilla = function(wym) {

    this._wym = wym;
    this._class = "class";
    this._newLine = "\n";
};

WYMeditor.WymClassMozilla.prototype.initIframe = function(iframe) {

    this._iframe = iframe;
    this._doc = iframe.contentDocument;
    
    //add css rules from options
    
    var styles = this._doc.styleSheets[0];    
    var aCss = eval(this._options.editorStyles);
    
    this.addCssRules(this._doc, aCss);

    this._doc.title = this._wym._index;

    //set the text direction
    jQuery('html', this._doc).attr('dir', this._options.direction);
    
    //init html value
    this.html(this._wym._html);
    
    //init designMode
    this.enableDesignMode();
    
    //pre-bind functions
    if(jQuery.isFunction(this._options.preBind)) this._options.preBind(this);
    
    //bind external events
    this._wym.bindEvents();
    
    //bind editor keydown events
    jQuery(this._doc).bind("keydown", this.keydown);
    
    //bind editor keyup events
    jQuery(this._doc).bind("keyup", this.keyup);
    
    //bind editor focus events (used to reset designmode - Gecko bug)
    jQuery(this._doc).bind("focus", this.enableDesignMode);
    
    //post-init functions
    if(jQuery.isFunction(this._options.postInit)) this._options.postInit(this);
    
    //add event listeners to doc elements, e.g. images
    this.listen();
};

/* @name html
 * @description Get/Set the html value
 */
WYMeditor.WymClassMozilla.prototype.html = function(html) {

  if(typeof html === 'string') {
  
    //disable designMode
    try { this._doc.designMode = "off"; } catch(e) { };
    
    //replace em by i and strong by bold
    //(designMode issue)
    html = html.replace(/<em(\b[^>]*)>/gi, "<i$1>")
      .replace(/<\/em>/gi, "</i>")
      .replace(/<strong(\b[^>]*)>/gi, "<b$1>")
      .replace(/<\/strong>/gi, "</b>");

    //update the html body
    jQuery(this._doc.body).html(html);
    
    //re-init designMode
    this.enableDesignMode();
  }
  else return(jQuery(this._doc.body).html());
};

WYMeditor.WymClassMozilla.prototype._exec = function(cmd,param) {

    if(!this.selected()) return(false);

    switch(cmd) {
    
    case WYMeditor.INDENT: case WYMeditor.OUTDENT:
    
        var focusNode = this.selected();    
        var sel = this._iframe.contentWindow.getSelection();
        var anchorNode = sel.anchorNode;
        if(anchorNode.nodeName == "#text") anchorNode = anchorNode.parentNode;
        
        focusNode = this.findUp(focusNode, WYMeditor.BLOCKS);
        anchorNode = this.findUp(anchorNode, WYMeditor.BLOCKS);
        
        if(focusNode && focusNode == anchorNode
          && focusNode.tagName.toLowerCase() == WYMeditor.LI) {

            var ancestor = focusNode.parentNode.parentNode;

            if(focusNode.parentNode.childNodes.length>1
              || ancestor.tagName.toLowerCase() == WYMeditor.OL
              || ancestor.tagName.toLowerCase() == WYMeditor.UL)
                this._doc.execCommand(cmd,'',null);
        }

    break;
    
    default:

        if(param) this._doc.execCommand(cmd,'',param);
        else this._doc.execCommand(cmd,'',null);
    }
    
    //set to P if parent = BODY
    var container = this.selected();
    if(container.tagName.toLowerCase() == WYMeditor.BODY)
        this._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
    
    //add event handlers on doc elements

    this.listen();
};

/* @name selected
 * @description Returns the selected container
 */
WYMeditor.WymClassMozilla.prototype.selected = function() {

    var sel = this._iframe.contentWindow.getSelection();
    var node = sel.focusNode;
    if(node) {
        if(node.nodeName == "#text") return(node.parentNode);
        else return(node);
    } else return(null);
};

WYMeditor.WymClassMozilla.prototype.addCssRule = function(styles, oCss) {

    styles.insertRule(oCss.name + " {" + oCss.css + "}",
        styles.cssRules.length);
};


//keydown handler, mainly used for keyboard shortcuts
WYMeditor.WymClassMozilla.prototype.keydown = function(evt) {
  
  //'this' is the doc
  var wym = WYMeditor.INSTANCES[this.title];
  var container = null;  

  if(evt.ctrlKey){
    if(evt.keyCode == 66){
      //CTRL+b => STRONG
      wym._exec(WYMeditor.BOLD);
      return false;
    }
    if(evt.keyCode == 73){
      //CTRL+i => EMPHASIS
      wym._exec(WYMeditor.ITALIC);
      return false;
    }
  } else if(evt.keyCode == 13) {
    if(!evt.shiftKey){
      //fix PRE bug #73
      container = wym.selected();
      if(container && container.tagName.toLowerCase() == WYMeditor.PRE) {
        evt.preventDefault();
        wym.insert('<p></p>');
      }
    }
  }
};

//keyup handler, mainly used for cleanups
WYMeditor.WymClassMozilla.prototype.keyup = function(evt) {

  //'this' is the doc
  var wym = WYMeditor.INSTANCES[this.title];
  
  wym._selected_image = null;
  var container = null;

  if(evt.keyCode == 13 && !evt.shiftKey) {
  
    //RETURN key
    //cleanup <br><br> between paragraphs
    jQuery(wym._doc.body).children(WYMeditor.BR).remove();
  }
  
  else if(evt.keyCode != 8
       && evt.keyCode != 17
       && evt.keyCode != 46
       && evt.keyCode != 224
       && !evt.metaKey
       && !evt.ctrlKey) {
      
    //NOT BACKSPACE, NOT DELETE, NOT CTRL, NOT COMMAND
    //text nodes replaced by P
    
    container = wym.selected();
    var name = container.tagName.toLowerCase();

    //fix forbidden main containers
    if(
      name == "strong" ||
      name == "b" ||
      name == "em" ||
      name == "i" ||
      name == "sub" ||
      name == "sup" ||
      name == "a"

    ) name = container.parentNode.tagName.toLowerCase();

    if(name == WYMeditor.BODY) wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);
  }
};

WYMeditor.WymClassMozilla.prototype.enableDesignMode = function() {
    if(this.designMode == "off") {
      try {
        this.designMode = "on";
        this.execCommand("styleWithCSS", '', false);
      } catch(e) { }
    }
};

WYMeditor.WymClassMozilla.prototype.setFocusToNode = function(node) {
    var range = document.createRange();
    range.selectNode(node);
    var selected = this._iframe.contentWindow.getSelection();
    selected.addRange(range);
    selected.collapse(node, node.childNodes.length);
    this._iframe.contentWindow.focus();
};

WYMeditor.WymClassMozilla.prototype.openBlockTag = function(tag, attributes)
{
  var attributes = this.validator.getValidTagAttributes(tag, attributes);

  // Handle Mozilla styled spans
  if(tag == 'span' && attributes.style){
    var new_tag = this.getTagForStyle(attributes.style);
    if(new_tag){
      this._tag_stack.pop();
      var tag = new_tag;
      this._tag_stack.push(new_tag);
      attributes.style = '';
    }else{
      return;
    }
  }
  
  this.output += this.helper.tag(tag, attributes, true);
};

WYMeditor.WymClassMozilla.prototype.getTagForStyle = function(style) {

  if(/bold/.test(style)) return 'strong';
  if(/italic/.test(style)) return 'em';
  if(/sub/.test(style)) return 'sub';
  if(/sub/.test(style)) return 'super';
  return false;
};

/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2005 - 2009 Jean-Francois Hovinne, http://www.wymeditor.org/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File Name:
 *        jquery.wymeditor.opera.js
 *        Opera specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne a-t wymeditor dotorg)
 */

WYMeditor.WymClassOpera = function(wym) {

    this._wym = wym;
    this._class = "class";
    this._newLine = "\r\n";
};

WYMeditor.WymClassOpera.prototype.initIframe = function(iframe) {

    this._iframe = iframe;
    this._doc = iframe.contentWindow.document;
    
    //add css rules from options
    var styles = this._doc.styleSheets[0];    
    var aCss = eval(this._options.editorStyles);

    this.addCssRules(this._doc, aCss);

    this._doc.title = this._wym._index;

    //set the text direction
    jQuery('html', this._doc).attr('dir', this._options.direction);
    
    //init designMode
    this._doc.designMode = "on";

    //init html value
    this.html(this._wym._html);
    
    //pre-bind functions
    if(jQuery.isFunction(this._options.preBind)) this._options.preBind(this);
    
    //bind external events
    this._wym.bindEvents();
    
    //bind editor keydown events
    jQuery(this._doc).bind("keydown", this.keydown);
    
    //bind editor events
    jQuery(this._doc).bind("keyup", this.keyup);
    
    //post-init functions
    if(jQuery.isFunction(this._options.postInit)) this._options.postInit(this);
    
    //add event listeners to doc elements, e.g. images
    this.listen();
};

WYMeditor.WymClassOpera.prototype._exec = function(cmd,param) {

    if(param) this._doc.execCommand(cmd,false,param);
    else this._doc.execCommand(cmd);
    
    this.listen();
};

WYMeditor.WymClassOpera.prototype.selected = function() {

    var sel=this._iframe.contentWindow.getSelection();
    var node=sel.focusNode;
    if(node) {
        if(node.nodeName=="#text")return(node.parentNode);
        else return(node);
    } else return(null);
};

WYMeditor.WymClassOpera.prototype.addCssRule = function(styles, oCss) {

    styles.insertRule(oCss.name + " {" + oCss.css + "}",
        styles.cssRules.length);
};

//keydown handler
WYMeditor.WymClassOpera.prototype.keydown = function(evt) {
  
  //'this' is the doc
  var wym = WYMeditor.INSTANCES[this.title];
  var sel = wym._iframe.contentWindow.getSelection();
  startNode = sel.getRangeAt(0).startContainer;

  //Get a P instead of no container
  if(!jQuery(startNode).parentsOrSelf(
                WYMeditor.MAIN_CONTAINERS.join(","))[0]
      && !jQuery(startNode).parentsOrSelf('li')
      && evt.keyCode != WYMeditor.KEY.ENTER
      && evt.keyCode != WYMeditor.KEY.LEFT
      && evt.keyCode != WYMeditor.KEY.UP
      && evt.keyCode != WYMeditor.KEY.RIGHT
      && evt.keyCode != WYMeditor.KEY.DOWN
      && evt.keyCode != WYMeditor.KEY.BACKSPACE
      && evt.keyCode != WYMeditor.KEY.DELETE)
      wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);

};

//keyup handler
WYMeditor.WymClassOpera.prototype.keyup = function(evt) {

  //'this' is the doc
  var wym = WYMeditor.INSTANCES[this.title];
  wym._selected_image = null;
};

// TODO: implement me
WYMeditor.WymClassOpera.prototype.setFocusToNode = function(node) {

};

/*
 * WYMeditor : what you see is What You Mean web-based editor
 * Copyright (c) 2005 - 2009 Jean-Francois Hovinne, http://www.wymeditor.org/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 *
 * For further information visit:
 *        http://www.wymeditor.org/
 *
 * File Name:
 *        jquery.wymeditor.safari.js
 *        Safari specific class and functions.
 *        See the documentation for more info.
 *
 * File Authors:
 *        Jean-Francois Hovinne (jf.hovinne a-t wymeditor dotorg)
 *        Scott Lewis (lewiscot a-t gmail dotcom)
 */

WYMeditor.WymClassSafari = function(wym) {

    this._wym = wym;
    this._class = "class";
    this._newLine = "\n";
};

WYMeditor.WymClassSafari.prototype.initIframe = function(iframe) {

    this._iframe = iframe;
    this._doc = iframe.contentDocument;
    
    //add css rules from options
    
    var styles = this._doc.styleSheets[0];    
    var aCss = eval(this._options.editorStyles);
    
    this.addCssRules(this._doc, aCss);

    this._doc.title = this._wym._index;

    //set the text direction
    jQuery('html', this._doc).attr('dir', this._options.direction);

    //init designMode
    this._doc.designMode = "on";
    
    //init html value
    this.html(this._wym._html);
    
    //pre-bind functions
    if(jQuery.isFunction(this._options.preBind)) this._options.preBind(this);
    
    //bind external events
    this._wym.bindEvents();
    
    //bind editor keydown events
    jQuery(this._doc).bind("keydown", this.keydown);
    
    //bind editor keyup events
    jQuery(this._doc).bind("keyup", this.keyup);
    
    //post-init functions
    if(jQuery.isFunction(this._options.postInit)) this._options.postInit(this);
    
    //add event listeners to doc elements, e.g. images
    this.listen();
};

WYMeditor.WymClassSafari.prototype._exec = function(cmd,param) {

    if(!this.selected()) return(false);

    switch(cmd) {
    
    case WYMeditor.INDENT: case WYMeditor.OUTDENT:
    
        var focusNode = this.selected();    
        var sel = this._iframe.contentWindow.getSelection();
        var anchorNode = sel.anchorNode;
        if(anchorNode.nodeName == "#text") anchorNode = anchorNode.parentNode;
        
        focusNode = this.findUp(focusNode, WYMeditor.BLOCKS);
        anchorNode = this.findUp(anchorNode, WYMeditor.BLOCKS);
        
        if(focusNode && focusNode == anchorNode
          && focusNode.tagName.toLowerCase() == WYMeditor.LI) {

            var ancestor = focusNode.parentNode.parentNode;

            if(focusNode.parentNode.childNodes.length>1
              || ancestor.tagName.toLowerCase() == WYMeditor.OL
              || ancestor.tagName.toLowerCase() == WYMeditor.UL)
                this._doc.execCommand(cmd,'',null);
        }

    break;

    case WYMeditor.INSERT_ORDEREDLIST: case WYMeditor.INSERT_UNORDEREDLIST:

        this._doc.execCommand(cmd,'',null);

        //Safari creates lists in e.g. paragraphs.
        //Find the container, and remove it.
        var focusNode = this.selected();
        var container = this.findUp(focusNode, WYMeditor.MAIN_CONTAINERS);
        if(container) jQuery(container).replaceWith(jQuery(container).html());

    break;
    
    default:

        if(param) this._doc.execCommand(cmd,'',param);
        else this._doc.execCommand(cmd,'',null);
    }
    
    //set to P if parent = BODY
    var container = this.selected();
    if(container && container.tagName.toLowerCase() == WYMeditor.BODY)
        this._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P);

    //add event handlers on doc elements
    this.listen();
};

/* @name selected
 * @description Returns the selected container
 */
WYMeditor.WymClassSafari.prototype.selected = function() {

    var sel = this._iframe.contentWindow.getSelection();
    var node = sel.focusNode;
    if(node) {
        if(node.nodeName == "#text") return(node.parentNode);
        else return(node);
    } else return(null);
};

WYMeditor.WymClassSafari.prototype.addCssRule = function(styles, oCss) {

    styles.insertRule(oCss.name + " {" + oCss.css + "}",
        styles.cssRules.length);
};


//keydown handler, mainly used for keyboard shortcuts
WYMeditor.WymClassSafari.prototype.keydown = function(evt) {
  
  //'this' is the doc
  var wym = WYMeditor.INSTANCES[this.title];
  
  if(evt.ctrlKey){
    if(evt.keyCode == 66){
      //CTRL+b => STRONG
      wym._exec(WYMeditor.BOLD);
      return false;
    }
    if(evt.keyCode == 73){
      //CTRL+i => EMPHASIS
      wym._exec(WYMeditor.ITALIC);
      return false;
    }
  }
  else if(evt.keyCode == 13 && evt.shiftKey) {
    evt.preventDefault();
    wym.insert('<br>');
    return false;
  }
};

//keyup handler, mainly used for cleanups
WYMeditor.WymClassSafari.prototype.keyup = function(evt) {

  //'this' is the doc
  var wym = WYMeditor.INSTANCES[this.title];
  
  wym._selected_image = null;
  var container = null;

  if(evt.keyCode == 13 && !evt.shiftKey) {
  
    //RETURN key
    //cleanup <br><br> between paragraphs
    jQuery(wym._doc.body).children(WYMeditor.BR).remove();
    
    //fix PRE bug #73
    container = wym.selected();
    if(container && container.tagName.toLowerCase() == WYMeditor.PRE)
        wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P); //create P after PRE
  }

  //fix #112
  if(evt.keyCode == 13 && evt.shiftKey) {
    wym._exec('InsertLineBreak');
  }
  
  if(evt.keyCode != 8
       && evt.keyCode != 17
       && evt.keyCode != 46
       && evt.keyCode != 224
       && !evt.metaKey
       && !evt.ctrlKey) {
      
    //NOT BACKSPACE, NOT DELETE, NOT CTRL, NOT COMMAND
    //text nodes replaced by P
    
    container = wym.selected();
    var name = container.tagName.toLowerCase();

    //fix forbidden main containers
    if(
      name == "strong" ||
      name == "b" ||
      name == "em" ||
      name == "i" ||
      name == "sub" ||
      name == "sup" ||
      name == "a" ||
      name == "span" //fix #110

    ) name = container.parentNode.tagName.toLowerCase();

    if(name == WYMeditor.BODY || name == WYMeditor.DIV) wym._exec(WYMeditor.FORMAT_BLOCK, WYMeditor.P); //fix #110 for DIV
  }
};

WYMeditor.WymClassSafari.prototype.setFocusToNode = function(node) {
    var range = this._iframe.contentDocument.createRange();
    range.selectNode(node);
    var selected = this._iframe.contentWindow.getSelection();
    selected.addRange(range);
    selected.collapse(node, node.childNodes.length);
    this._iframe.contentWindow.focus();
};

WYMeditor.WymClassSafari.prototype.openBlockTag = function(tag, attributes)
{
  var attributes = this.validator.getValidTagAttributes(tag, attributes);

  // Handle Safari styled spans
  if(tag == 'span' && attributes.style) {
    var new_tag = this.getTagForStyle(attributes.style);
    if(new_tag){
      this._tag_stack.pop();
      var tag = new_tag;
      this._tag_stack.push(new_tag);
      attributes.style = '';
      
      //should fix #125 - also removed the xhtml() override
      if(typeof attributes['class'] == 'string')
        attributes['class'] = attributes['class'].replace(/apple-style-span/gi, '');
    
    } else {
      return;
    }
  }
  
  this.output += this.helper.tag(tag, attributes, true);
};

WYMeditor.WymClassSafari.prototype.getTagForStyle = function(style) {

  if(/bold/.test(style)) return 'strong';
  if(/italic/.test(style)) return 'em';
  if(/sub/.test(style)) return 'sub';
  if(/super/.test(style)) return 'sup';
  return false;
};
/*
 * A few useful plugins for Wildfire Specific Functionality
 * ADDS:
 *    1. Link interceptor to give a choice between regular urls and file urls
 *    2. Insert Video Button
 *    3. Insert Audio Button
 *    4. Overwrite default image insert to be awesome
 */


//Extend WYMeditor
wildfire_containersItems = [
    {'name': 'P', 'title': 'Paragraph', 'css': 'wym_containers_p'},
    {'name': 'H3', 'title': 'Main_Heading', 'css': 'wym_containers_h3'},
    {'name': 'H4', 'title': 'Sub_Heading', 'css': 'wym_containers_h4'},
    {'name': 'H5', 'title': 'Small_Heading', 'css': 'wym_containers_h5'},
    {'name': 'PRE', 'title': 'Preformatted', 'css': 'wym_containers_pre'},
    {'name': 'BLOCKQUOTE', 'title': 'Blockquote','css': 'wym_containers_blockquote'}
];
/******** Overides of base WYMeditor Object ****************/
WYMeditor.MAIN_CONTAINERS = new Array("p","h3","h4","h5","h6","pre","blockquote", "address");

WYMeditor.editor.prototype.wildfire = function() {
  var wym = this;


  /*************Additions to language code***************/
  WYMeditor.STRINGS['en'].Source_Code = 'Source code';
  WYMeditor.STRINGS['en'].Main_Heading = 'Main Heading';
  WYMeditor.STRINGS['en'].Sub_Heading = 'Sub Heading';
  WYMeditor.STRINGS['en'].Small_Heading = 'Small Heading';
  /*******************************************/
  updateHTML = jQuery(".wym_containers").html();
  jQuery(".wym_containers").html(wym.replaceStrings(updateHTML));
  jQuery(this._box).find(this._options.containerSelector).click(function() {
    wym.container(jQuery(this).attr(WYMeditor.NAME));
    return(false);
  });

  WYMeditor.BLOCKS = new Array("address", "blockquote", "div", "dl",
   "fieldset", "form", "h3", "h4", "h5", "h6", "hr",
   "noscript", "ol", "p", "pre", "table", "ul", "dd", "dt",
   "li", "tbody", "td", "tfoot", "th", "thead", "tr");

  /****** Allow more things through the xhtml parse *******/
  wym.parser._Listener.validator._tags.a.attributes[7]="target";
  wym.parser._Listener.validator._tags.embed = {
    "attributes":[
    "allowscriptaccess",
    "allowfullscreen",
    "height",
    "src",
    "type",
    "width",
    "flashvars",
    "scale"
    ]
  };
  wym.parser._Listener.validator._tags.param = {
      "attributes":
    {
      "0":"name",
      "1":"type",
      "valuetype":/^(data|ref|object)$/,
      "2":"valuetype",
      "3":"value"
    },
    "required":[
    "name"
    ]
  };
  wym.parser._Listener.block_tags = ["a", "abbr", "acronym", "address", "area", "b",
    "base", "bdo", "big", "blockquote", "body", "button",
    "caption", "cite", "code", "col", "colgroup", "dd", "del", "div",
    "dfn", "dl", "dt", "em", "fieldset", "form", "head", "h1", "h2",
    "h3", "h4", "h5", "h6", "html", "i", "ins",
    "kbd", "label", "legend", "li", "map", "noscript",
    "object", "ol", "optgroup", "option", "p", "pre", "q",
    "samp", "script", "select", "small", "span", "strong", "style",
    "sub", "sup", "table", "tbody", "td", "textarea", "tfoot", "th",
    "thead", "title", "tr", "tt", "ul", "var", "extends"];
  wym.parser._Listener.inline_tags = ["br", "hr", "img", "input", "embed", "param"];
  
  
  WYMeditor.WymClassMozilla.prototype.html = function(html) {

    if(typeof html === 'string') {
      //disable designMode
      try { this._doc.designMode = "off"; } catch(e) { };
      //replace em by i and strong by bold
      //(designMode issue)
        html = html.replace(/<em(\b[^>]*)>/gi, "<i$1>").replace(/<\/em>/gi, "</i>")
          .replace(/<strong(\b[^>]*)>/gi, "<b$1>")
          .replace(/<\/strong>/gi, "</b>");
      //update the html body
      jQuery(this._doc.body).html(html);
      //re-init designMode
      this.enableDesignMode();
    }
    else return(jQuery(this._doc.body).html());
  };

  WYMeditor.editor.prototype.toggleHtml_old =  WYMeditor.editor.prototype.toggleHtml;
  WYMeditor.editor.prototype.toggleHtml = function() { 
    this.toggleHtml_old();
    var html_box = jQuery(".wym_html");
    if(html_box.is(':visible')){
      html_box.css("height","50%");
      jQuery(".wym_iframe").css("height","50%");
    }else{
      html_box.css("height","");
      jQuery(".wym_iframe").css("height","100%");
    }
  };
  
  jQuery(wym._box).find(".wym_tools_superscript").remove();
  jQuery(wym._box).find(".wym_tools_subscript").remove();
  jQuery(wym._box).find(".wym_tools_preview").remove();
  jQuery(wym._box).find(".wym_classes").removeClass("wym_panel").addClass("wym_dropdown");

  /*******************************************/
  /* Overwrite default link insert */
  /*******************************************/

  jQuery(wym._box).find(".wym_tools_link a").unbind("click").click(function(){
    jQuery.get(file_options_location, function(response){
      jQuery("#link_file").replaceWith(response);
      jQuery("#link_dialog #link_file").change(link_dialog_file_choose);
      var insert_dialog = jQuery("#link_dialog");
      insert_dialog.dialog('option', 'title', 'Insert Link');
      insert_dialog.data('execute_on_insert',function(){
        var theURL = insert_dialog.find("#link_url").val();
        var str_target = insert_dialog.find("#link_target").val();
        if(theURL.length) {
          wym.wrap("<a href = '" + theURL + "' " + ( str_target ? ( "target='" + str_target + "'" ) : "" ) + ">", "</a>");
        }
      });
      insert_dialog.dialog("open");
    });
    return false;
  });
  
  jQuery("#link_dialog").dialog({width:400});

  /*******************************************/
  /* Video Insertion Button */
  /*******************************************/

  var vidhtml = wym_button("video", "Insert a Video");
  jQuery(wym._box).find(".wym_tools_image").after(vidhtml);
  jQuery(wym._box).find(".wym_tools_video a").click(function(){
    jQuery.get(file_options_location+"/?mime_type=video", function(response){
      jQuery("#link_file").replaceWith(response);
      jQuery("#link_dialog #link_file").change(link_dialog_file_choose);
      var insert_dialog = jQuery("#link_dialog");
      insert_dialog.dialog('option', 'title', 'Insert a Video');
      insert_dialog.data('execute_on_insert',function(){
        var theURL = insert_dialog.find("#link_url").val();
        var str_target = insert_dialog.find("#link_target").val();
        if(theURL.length) {
          wym.insert("<a class='wildfire_video' href='" + theURL + "' " + ( str_target ? ( "target='" + str_target + "' " ) : "" ) + "><img class='fallback' src='/images/cms/wildfirevideo.gif' alt='Download video file: " + theURL + "' /></a>");
        }
      });
      insert_dialog.dialog("open");
    });
    return false;
  });
  
  /*******************************************/
  /* Flash Insertion Button */
  /*******************************************/

  var flashhtml = wym_button("flash", "Insert a Flash Movie");
  jQuery(wym._box).find(".wym_tools_image").after(flashhtml);
  jQuery(wym._box).find(".wym_tools_flash a").click(function(){
    jQuery.get(file_options_location+"/?mime_type=shockwave", function(response){
      jQuery("#link_file").replaceWith(response);
      jQuery("#link_dialog #link_file").change(link_dialog_file_choose);
      var insert_dialog = jQuery("#link_dialog");
      insert_dialog.dialog('option', 'title', 'Insert a Flash File');
      insert_dialog.data('execute_on_insert',function(){
        var theURL = insert_dialog.find("#link_url").val();
        var str_target = insert_dialog.find("#link_target").val();
        if(theURL.length) {
          wym.insert("<a class='wildfire_flash' href='" + theURL + "' " + ( str_target ? ( "target='" + str_target + "' " ) : "" ) + "><img src='/images/cms/flash_placeholder.png' alt='Flash file: " + theURL + "' /></a>");
        }
      });
      insert_dialog.dialog("open");
    });
    return false;
  });

  /*******************************************/
  /* Audio Insertion Button */
  /*******************************************/

  var audhtml = wym_button("audio", "Insert Audio");
  jQuery(wym._box).find(".wym_tools_video").after(audhtml);
  jQuery(wym._box).find(".wym_tools_audio a").click(function(){
    jQuery.get(file_options_location+"/?mime_type=audio", function(response){
      jQuery("#link_file").replaceWith(response);
      jQuery("#link_dialog #link_file").change(link_dialog_file_choose);
      var insert_dialog = jQuery("#link_dialog");
      insert_dialog.dialog('option', 'title', 'Insert Audio');
      insert_dialog.data('execute_on_insert',function(){
        var theURL = insert_dialog.find("#link_url").val();
        var str_target = insert_dialog.find("#link_target").val();
        if(theURL.length) {
          wym.insert("<a class='wildfire_audio' href='" + theURL + "' " + ( str_target ? ( "target='" + str_target + "' " ) : "" ) + "><img src='/images/cms/googleaudioplayer.gif' alt='Download audio file: " + theURL + "' /></a>");
        }
      });
      insert_dialog.dialog("open");
    });
    return false;
  });

  /*******************************************/
  /* CSV Table Insertion Button */
  /*******************************************/

  var audhtml = wym_button("csv_table", "Insert CSV Data Table");
  jQuery(wym._box).find(".wym_tools_audio").after(audhtml);
  jQuery(wym._box).find(".wym_tools_csv_table a").click(function(){
    jQuery.get(file_options_location+"/?mime_type=text", function(response){
      jQuery("#link_file").replaceWith(response);
      jQuery("#link_dialog #link_file").change(link_dialog_file_choose);
      var insert_dialog = jQuery("#link_dialog");
      insert_dialog.dialog('option', 'title', 'Insert CSV Data Table');
      insert_dialog.data('execute_on_insert',function(){
        var theURL = insert_dialog.find("#link_url").val();
        var str_target = insert_dialog.find("#link_target").val();
        if(theURL.length) {
          wym.insert("<a class='wildfire_csv_table' href='" + theURL + "' " + ( str_target ? ( "target='" + str_target + "' " ) : "" ) + "><img src='/images/cms/table_placeholder.jpg' alt='Download csv file: " + theURL + "' /></a>");
        }
      });
      insert_dialog.dialog("open");
    });
    return false;
  });

  /*******************************************/
  /* Inline Image Insertion Button */
  /*******************************************/
  jQuery(wym._box).find(".wym_tools_image a").unbind("click").click(function(){
    popup_file_browse_dialog(wym);
    return false;
  });
  
  initialise_inline_image_edit(wym);

  /*******************************************/
  /* Overwrite default paste from word */
  /*******************************************/
  jQuery(wym._box).find(".wym_tools_paste a").unbind("click").click(function(){
    var paste_dialog = jQuery('#paste_word');
    paste_dialog.data("wym",wym);
    paste_dialog.dialog({width:540});
    paste_dialog.dialog("open");
    return false;
  });

  /*******************************************/
  /* Table Insertion Button */
  /*******************************************/
  jQuery(wym._box).find(".wym_tools_table a").unbind("click").click(function(){
    var table_dialog = jQuery("#table_dialog");
    table_dialog.data("wym",wym);
    table_dialog.dialog({width:340});
    table_dialog.dialog("open");
  });
  jQuery(wym._box).find(".wym_tools_class").unbind("hover").hover(
    function(){$(this).find("ul").toggleClass("wym_classes_hidden");},
    function(){$(this).find("ul").toggleClass("wym_classes_hidden");}
  );
};

function wym_button(name, title) {
  var html = "<li class='wym_tools_"+name+"'>"
              + "<a name='"+name+"' href='#' title='"+title+"'>"
              + title
              + "</a></li>";
  return html;
}

function popup_file_browse_dialog(wym,existing_image){
  jQuery.get(file_browser_location, {mime_type:file_mime_type}, function(response){
    jQuery(".image_display").html(response);
    
    init_inline_image_select(wym);
    
    var insert_dialog = jQuery(".inline_image_dialog");
    insert_dialog.data('wym',wym);
    if(existing_image && existing_image.length){
      existing_image.attr("width",existing_image.attr("width")); //needed so that the new image source with lower res will be the correct size
      insert_dialog.find(".selected_image img").attr("src", existing_image.attr("src")).css("width","90px");
      insert_dialog.find(".meta_description").val(existing_image.attr("alt"));
      
      var existing_flow = "flow_left";
      if(existing_image.hasClass("flow_right")) existing_flow = "flow_right";
      else if(existing_image.hasClass("flow_normal")) existing_flow = "flow_normal";
      jQuery('input:radio[name=flow]').val([existing_flow]);
      
      insert_dialog.data('existing_image',existing_image);
    }
    insert_dialog.dialog('option', 'title', 'Insert an Image');
    insert_dialog.dialog("open");
  });
}

function initialise_inline_image_edit(wym) {
  jQuery(wym._doc).find("img.inline_image").unbind("dblclick").dblclick(function(){
    popup_file_browse_dialog(wym,jQuery(this));
  });
}

function init_inline_image_select(wym) {
  jQuery(".image_display .add_image a").click(function(){
    jQuery(".inline_image_dialog .selected_image img").attr("src", "/show_image/"+jQuery(this).parent().parent().attr("id")+"/90.jpg");
  });
}

WYMeditor.editor.prototype.computeBasePath = function() { return "/javascripts/wymeditor/"; };