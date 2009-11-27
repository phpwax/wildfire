
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
  if(jQuery(".form_datepicker")) jQuery(".form_datepicker").datepicker({changeMonth: true, changeYear: true});
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
var content_page_id;
var model_string;
var init_upload;
var autosaver;
wym_editors = [];
if(typeof(file_browser_location) == "undefined") var file_browser_location = "/admin/files/browse_images";
var file_mime_type = "image";
jQuery(document).ready(function() {
    jQuery("#container").tabs();
    
    jQuery("#page_tab_title").html(jQuery("#cms_content_title").val());
    jQuery("#cms_content_title").keyup(function() {
      jQuery("#page_tab_title").html(jQuery("#cms_content_title").val());
    });
    jQuery("#new_cat_create").click(function() {
      jQuery.ajax({ url: "../../new_category/?cat="+jQuery("#new_cat").val(), 
        complete: function(response){jQuery("#category_list").html(response.responseText); initialise_draggables();}
      });
      return false;
    });   
    initialise_draggables();
    if(jQuery("#copy_permissions_from").length > 0) jQuery("#copy_permissions_from").change(function(){
      jQuery.get("../../copy_permissions_from/"+content_page_id+"?copy_from="+jQuery(this).val(),function(response){
        jQuery("#cat_dropzone").html(response); init_deletes();
      });
      return false;
    });
    jQuery("#link_dialog").dialog({autoOpen:false, title:"Insert a Link", width:"auto", height:"auto"});
    jQuery("#table_dialog").dialog({autoOpen:false, title:"Insert a Table", width:700, height:500});
    jQuery("#video_dialog").dialog({autoOpen:false, title:"Insert a Video", width:700, height:500});
    jQuery("#quick_upload_pane").dialog({autoOpen:false, title:"Upload an Image", width:700,height:500});
    jQuery("#upload_url_pane").dialog({autoOpen:false, title:"Get Image From URL", width:700,height:500});
    
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
          init_upload();
        }
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
  	  var rid = this.id.substr(22)
	  }
    jQuery.get(end_url+content_page_id+"?cat="+rid,function(response){
      jQuery("#cat_dropzone").html(response); init_deletes();
    });
  });
}

function delayed_cat_filter(filter) {
  jQuery("#category_filter").css("background", "white url(/images/cms/indicator.gif) no-repeat right center");
  jQuery.ajax({type: "post", url: "/admin/categories/filters", data: "filter="+filter, 
    complete: function(response){ 
      jQuery("#category_list").html(response.responseText); 
      initialise_draggables();
      if(typeof(t) != "undefined" ) clearTimeout(t); 
      jQuery("#category_filter").css("background", "white");
    }
  });
}

function delayed_image_filter(filter) {
  jQuery("#image_filter").css("background", "white url(/images/cms/indicator.gif) no-repeat right center");
  jQuery.ajax({type: "post", url: "/admin/files/image_filter", data: "mime_type="+file_mime_type+"&filter="+jQuery("#image_filter").val(), 
    complete: function(response){ 
      jQuery("#image_list").html(response.responseText); 
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
  jQuery.get(file_browser_location+"/1/?mime_type="+file_mime_type, function(response){
    jQuery("#image_list").html(response);
    initialise_images();
  });
  jQuery('.jqwysi').wymeditor({
    skinPath: "/stylesheets/wymeditor/wildfire/",
    skin: 'wildfire',
    containersItems: wildfire_containersItems,
    containersHtml:    "<div class='wym_containers wym_section'>"
                        + "<h2>Headings</h2>"
                        + "<ul>"
                        + WYMeditor.CONTAINERS_ITEMS
                        + "</ul>"
                        + "</div>",
    classesHtml:       "<div class='wym_classes wym_section'>"
                        + "<h2>Styling</h2><ul>"
                        + WYMeditor.CLASSES_ITEMS
                        + "</ul></div>",
    postInit: function(wym) {
      wym.wildfire(wym);
      wym_editors.push(wym);
      var handlesel = jQuery(".ui-resizable-handle");
      jQuery(".wym_box").resizable({
        handles: "s"
      });
      jQuery(".wym_box").css("height", "250px");
      jQuery(".wym_area_main, .wym_iframe, iframe").css("height","100%"); 
      jQuery(".wym_iframe").css("height","91%"); 
    }
  });              
  
  if(jQuery('#quicksave').length){
		autosaver = setInterval(function(){autosave_content(wym_editors);},40000);
  	jQuery("#autosave").click(function(){autosave_content(wym_editors);});
	}
});

function wym_button(name, title) {
  var html = "<li class='wym_tools_"+name+"'>"
              + "<a name='"+name+"' href='#'"
              + title
              + "</a></li>";
  return html;
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
    change: function(event, ui) {
      alert(jQuery("#drop_zones").sortable("serialize"));
    }
  });
  
  /*** Setup image pagination ***/
  
  jQuery(".paginate_images").click(function(){
    jQuery.get(file_browser_location+"/"+this.id.substr(12)+'?mime_type='+file_mime_type,{},function(response){
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

function autosave_content(wyms, after_save) {
  for(var i in wyms) wyms[i].update();
  jQuery('#ajaxBusy').hide();
  jQuery.ajax({ 
	  url: "/admin/content/autosave/"+content_page_id, 
	  beforeSend: function(){jQuery("#quicksave").effect("pulsate", { times: 3 }, 1000);},
	  type: "POST",
    processData: false,
    data: jQuery('#content_edit_form').serialize(),
    success: function(response){
      jQuery("#autosave_status").html("Saved at "+response);
      jQuery('#ajaxBusy').hide();
      if(typeof(after_save) == "function") after_save();
	  }
	});
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
    autosave_content(wym_editors, function(){ //do an autosave before a preview
      if(preview_but.hasClass("modal_preview")){
        open_modal_preview(preview_but.attr("href"))
      }else{
        window.open(preview_but.attr("href"));
      }
    });
    return false;
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
  jQuery("#informationcart").verticalCenter();
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
}