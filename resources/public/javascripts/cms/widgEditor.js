/*
**    File: widgEdit.js
**    Created by: Cameron Adams (http://www.themaninblue.com/)
**    Created on: 2005-01-16
**    Last modified: 2005-03-09
**
**    File modified and enhanced by Ross Riley (http://www.sorrylies.com)
**/

/******************************************************************************
**    CONFIGURATION VARIABLES
******************************************************************************/

/* Location of stylesheet file for editor content */
var widgStylesheet = "/stylesheets/cms/widget-content.css";

/* Items to appear in toolbar. */
var widgToolbarItems = new Array();

widgToolbarItems.push("bold");
widgToolbarItems.push("italic");
widgToolbarItems.push("hyperlink");
widgToolbarItems.push("unorderedlist");
widgToolbarItems.push("orderedlist");
widgToolbarItems.push("hr");
widgToolbarItems.push("separator");

widgToolbarItems.push("blockformat");
widgToolbarItems.push("separator");
widgToolbarItems.push("video");
// widgToolbarItems.push("image");


/* Options on block format select element. Consists of string pairs (option value, option label) */
var widgSelectBlockOptions = new Array();

widgSelectBlockOptions.push("", "Change block type");
widgSelectBlockOptions.push("<h3>", "Heading");
widgSelectBlockOptions.push("<h4>", "Subheading");
widgSelectBlockOptions.push("<h6>", "Quote");
widgSelectBlockOptions.push("<p>", "Paragraph");

/* If widgInsertParagraphs = true, when content is submitted paragraphs will be
** inserted around text without a parent element. Mozilla does not
** automatically do this, so if this is set to false you will end up with some
** plain text blocks. Uses a double <br /> as a pargraph marker.
*/

var widgInsertParagraphs = true;

/* If widgAutoClean = true, when content is pasted into the WYSIWYG view, it
** will automatically be cleaned. If widgAutoClean = false, the user will be
** prompted as to whether they wish to clean the content.
*/

var widgAutoClean = true;

/******************************************************************************
**    END CONFIGURATION
******************************************************************************/

function widgInit()
{
	/* Detects if designMode is available, and also if browser is IE or Mozilla (excludes Safari) */
	if (typeof(document.designMode) == "string" && (document.all || document.designMode == "off"))
	{
		var theTextareas = document.getElementsByTagName("textarea");
		
		for (var i = 0; i < theTextareas.length; i++)
		{
			var theTextarea = theTextareas[i];
			
			if (theTextarea.className.classExists("widgEditor"))
			{
				if (theTextarea.id == "")
				{
					theTextarea.id = theTextarea.name;
				}
				
				
				setTimeout("new widgEditor('" + theTextarea.id + "')", 500 * (i));
				
			}
		}
	}
	else
	{
		return false;
	}
	
	return true;
}




function widgEditor(replacedTextareaID)
{
	var self = this;
	
	this.theTextarea = document.getElementById(replacedTextareaID);
	this.theContainer = document.createElement("div");
	this.theIframe = document.createElement("iframe");
	this.theInput = document.createElement("input");
	this.theExtraInput = document.createElement("input");
	this.IE = false;
	this.locked = true;
	this.pasteCache = "";
	this.wysiwyg = true;
	
	if (document.all)
	{
		this.IE = true;
	}
	
	if (this.theTextarea.id == null)
	{
		this.theTextarea.id = this.theTextarea.name;
	}
	
	this.theTextarea.style.visibility = "hidden";

	/* Modify DOM objects for editor */
	this.theContainer.id = this.theTextarea.id + "WidgContainer";
	this.theContainer.className = "widgContainer";
	
	this.theIframe.id = this.theTextarea.id + "WidgIframe";
	this.theIframe.className = "widgIframe";
	
	this.theInput.type = "hidden";
	this.theInput.id = this.theTextarea.id;
	this.theInput.name = this.theTextarea.name;
	this.theInput.value = this.theTextarea.value;

	this.theToolbar = new widgToolbar(this);
	
	/* An extra input to determine if the submitted data is from the normal textarea or from the widgEditor */
	this.theExtraInput.type = "hidden";	

/*   These lines removed from original - was breaking array named elements
	this.theExtraInput.id = this.theTextarea.id + "WidgEditor";
	this.theExtraInput.name = this.theTextarea.name + "WidgEditor";
	this.theExtraInput.value = "true"; */
	
	this.theTextarea.id += "WidgTextarea";
	this.theTextarea.name += "WidgTextarea";
	
	this.theContainer.appendChild(this.theToolbar.theList);
	this.theContainer.appendChild(this.theIframe);
	this.theContainer.appendChild(this.theInput);
	this.theContainer.appendChild(this.theExtraInput);
	this.theContainer.style.visibility = "hidden";

	this.theInput.widgEditorObject = this;
	
	this.theTextarea.parentNode.replaceChild(this.theContainer, this.theTextarea);

	/* Fill editor with old textarea content */
	this.writeDocument(this.theInput.value);
	
	/* Make editor editable */
	this.initEdit();
	
	/* Attach onsubmit to parent form */
	this.modifyFormSubmit();
	editor_initialised();
	return true;
}




/* Clean pasted content */
widgEditor.prototype.cleanPaste = function()
{
	if (widgAutoClean)
	{
		var matchedHead = "";
		var matchedTail = "";
		var newContent = this.theIframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML;
		var newContentStart = 0;
		var newContentFinish = 0;
		var newSnippet = "";
		var tempNode = document.createElement("div");

		/* Find start of both strings that matches */
		for (newContentStart = 0; newContent.charAt(newContentStart) == this.pasteCache.charAt(newContentStart); newContentStart++)
		{
			matchedHead += this.pasteCache.charAt(newContentStart);
		}
		
		/* If newContentStart is inside a HTML tag, move to opening brace of tag */
		for (var i = newContentStart; i >= 0; i--)
		{
			if (this.pasteCache.charAt(i) == "<")
			{
				newContentStart = i;
				matchedHead = this.pasteCache.substring(0, newContentStart);
				
				break;
			}
			else if(this.pasteCache.charAt(i) == ">")
			{
				break;
			}
		}

		newContent = newContent.reverse();
		this.pasteCache = this.pasteCache.reverse();

		/* Find end of both strings that matches */
		for (newContentFinish = 0; newContent.charAt(newContentFinish) == this.pasteCache.charAt(newContentFinish); newContentFinish++)
		{
			matchedTail += this.pasteCache.charAt(newContentFinish);
		}

		/* If newContentFinish is inside a HTML tag, move to closing brace of tag */
		for (var i = newContentFinish; i >= 0; i--)
		{
			if (this.pasteCache.charAt(i) == ">")
			{
				newContentFinish = i;
				matchedTail = this.pasteCache.substring(0, newContentFinish);
				
				break;
			}
			else if(this.pasteCache.charAt(i) == "<")
			{
				break;
			}
		}

		matchedTail = matchedTail.reverse();

		/* If there's no difference in pasted content */
		if (newContentStart == newContent.length - newContentFinish)
		{
			return false;
		}    
		newContent = newContent.reverse();
		newSnippet = newContent.substring(newContentStart, newContent.length - newContentFinish);
		newSnippet = newSnippet.validTags();

		/* Replace opening bold tags with strong */
		newSnippet = newSnippet.replace(/<b(\s+|>)/g, "<strong$1");
		/* Replace closing bold tags with closing strong */
		newSnippet = newSnippet.replace(/<\/b(\s+|>)/g, "</strong$1");

		/* Replace italic tags with em */
		newSnippet = newSnippet.replace(/<i(\s+|>)/g, "<em$1");
		/* Replace closing italic tags with closing em */
		newSnippet = newSnippet.replace(/<\/i(\s+|>)/g, "</em$1");
		
		/* Remove unwanted tags */

		

		/* Strip out unaccepted attributes */
		newSnippet = newSnippet.replace(/<[^>]*>/g, function(match)
			{
				match = match.replace(/ ([^=]+)="[^"]*"/g, function(match2, attributeName)
					{
						if (attributeName == "alt" || attributeName == "href" || attributeName == "src" || attributeName == "title" || attributeName == "style")
						{
							return match2;
						}

						return "";
					});

				return match;
			}
			);

		tempNode.innerHTML = newSnippet;

		acceptableChildren(tempNode);
		
		this.theInput.value = matchedHead + tempNode.innerHTML + matchedTail;

		/* Final cleanout for MS Word cruft */
		this.theInput.value = this.theInput.value.replace(/<\?xml[^>]*>/g, "");
		this.theInput.value = this.theInput.value.replace(/<[^ >]+:[^>]*>/g, "");
		this.theInput.value = this.theInput.value.replace(/<\/[^ >]+:[^>]*>/g, "");

		this.refreshDisplay();
		
		/* Convert semantics to spans in Mozilla */
		if (!this.IE)
		{
			this.convertSPANs(true);
		}
	}
	
	return true;
};




/* Clean the HTML code of the content area */
widgEditor.prototype.cleanSource = function()
{
	var theHTML = "";
	
	if (this.wysiwyg)
	{
		theHTML = this.theIframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML;
	}
	else
	{
		theHTML = this.theTextarea.value;
	}

	theHTML = theHTML.validTags();
	
	/* Remove leading and trailing whitespace */
	theHTML = theHTML.replace(/^\s+/, "");
	theHTML = theHTML.replace(/\s+$/, "");
	
	/* Remove style attribute inside any tag  - taken out for now - add back in if probs with copying and pasting from other sources*/ 
	/* theHTML = theHTML.replace(/ style="[^"]*"/g, ""); */

	/* Replace improper BRs and hrs */
	theHTML = theHTML.replace(/<br>/g, "<br />");
	theHTML = theHTML.replace(/<hr>/g, "<hr />");
	
	/* Remove BRs right before the end of blocks */
	theHTML = theHTML.replace(/<br \/>\s*<\/(h1|h2|h3|h4|h5|h6|li|p|address|pre|div|hr)/g, "</$1");
	
	/* Replace improper IMGs */
	theHTML = theHTML.replace(/(<img [^>]+[^\/])>/g, "$1 />");
	
	/* Remove empty tags */
	// theHTML = theHTML.replace(/(<[^\/]>|<[^\/][^>]*[^\/]>)\s*<\/[^>]*>/g, ""); 

  /* Add extra hooks to h6 tags */
	theHTML = theHTML.replace(/<h6>/g, "<h6><span>");
	theHTML = theHTML.replace(/<\/h6>/g, "</span></h6>");
	
	/* Strip double spans */
  theHTML = theHTML.replace(/<span><span>/g, "<span>");
	theHTML = theHTML.replace(/<\/span><\/span>/g, "</span>");
  
  /* Remove empty paragraphs */
   theHTML = theHTML.replace(/(<p>)\s*<\/p>/g, "");
	
	
	if (this.wysiwyg)
	{
		this.theIframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML = theHTML;
	}
	else
	{
		this.theTextarea.value = theHTML;
	}
	
	this.theInput.value = theHTML;
	
	return true;
};




widgEditor.prototype.convertSPANs = function(theSwitch)
{
	if (theSwitch)
	{
		/* Replace styled spans with their semantic equivalent */
		var theSPANs = this.theIframe.contentWindow.document.getElementsByTagName("span");
	
		while(theSPANs.length > 0)
		{
			var theChildren = new Array();
			var theReplacementElement = null;
			var theParentElement = null;
			
			for (var j = 0; j < theSPANs[0].childNodes.length; j++)
			{
				theChildren.push(theSPANs[0].childNodes[j].cloneNode(true));
			}
			
			/* Detect type of span style */
			switch (theSPANs[0].getAttribute("style"))
			{
				case "font-weight: bold;":
					theReplacementElement = this.theIframe.contentWindow.document.createElement("strong");
					theParentElement = theReplacementElement;
					
					break;
				
				case "font-style: italic;":
					theReplacementElement = this.theIframe.contentWindow.document.createElement("em");
					theParentElement = theReplacementElement;
					
					break;
					
				case "font-weight: bold; font-style: italic;":
					theParentElement = this.theIframe.contentWindow.document.createElement("em");
					theReplacementElement = this.theIframe.contentWindow.document.createElement("strong");
					theReplacementElement.appendChild(theParentElement);
					
					break;
					
				case "font-style: italic; font-weight: bold;":
					theParentElement = this.theIframe.contentWindow.document.createElement("strong");
					theReplacementElement = this.theIframe.contentWindow.document.createElement("em");
					theReplacementElement.appendChild(theParentElement);
					
					break;
					
				default:
					replaceNodeWithChildren(theSPANs[0]);
				
					break;
			}
			
			if (theReplacementElement != null)
			{
				for (var j = 0; j < theChildren.length; j++)
				{
					theParentElement.appendChild(theChildren[j]);
				}

				theSPANs[0].parentNode.replaceChild(theReplacementElement, theSPANs[0]);
			}
			
			theSPANs = this.theIframe.contentWindow.document.getElementsByTagName("span");
		}
	}
	else
	{
		/* Replace em and strong tags with styled spans */
		var theEMs = this.theIframe.contentWindow.document.getElementsByTagName("em");
		
		while(theEMs.length > 0)
		{
			var theChildren = new Array();
			var theSpan = this.theIframe.contentWindow.document.createElement("span");
			
			theSpan.setAttribute("style", "font-style: italic;");
			
			for (var j = 0; j < theEMs[0].childNodes.length; j++)
			{
				theChildren.push(theEMs[0].childNodes[j].cloneNode(true));
			}
			
			for (var j = 0; j < theChildren.length; j++)
			{
				theSpan.appendChild(theChildren[j]);
			}

			theEMs[0].parentNode.replaceChild(theSpan, theEMs[0]);
			theEMs = this.theIframe.contentWindow.document.getElementsByTagName("em");
		}
		
		var theSTRONGs = this.theIframe.contentWindow.document.getElementsByTagName("strong");
		
		while(theSTRONGs.length > 0)
		{
			var theChildren = new Array();
			var theSpan = this.theIframe.contentWindow.document.createElement("span");
			
			theSpan.setAttribute("style", "font-weight: bold;");
			
			for (var j = 0; j < theSTRONGs[0].childNodes.length; j++)
			{
				theChildren.push(theSTRONGs[0].childNodes[j].cloneNode(true));
			}
			
			for (var j = 0; j < theChildren.length; j++)
			{
				theSpan.appendChild(theChildren[j]);
			}

			theSTRONGs[0].parentNode.replaceChild(theSpan, theSTRONGs[0]);
			theSTRONGs = this.theIframe.contentWindow.document.getElementsByTagName("strong");
		}
	}
	
	return true;
};




/* Check for pasted content */
widgEditor.prototype.detectPaste = function(e)
{
	var keyPressed = null;
	var theEvent = null;
	
	if (e)
	{
		theEvent = e;
	}
	else
	{
		theEvent = event;
	}
	
	if (theEvent.ctrlKey && theEvent.keyCode == 86 && this.wysiwyg)
	{
		var self = this;
		
		this.pasteCache = this.theIframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML;

		/* Because Mozilla can't access the clipboard directly, must rely on timeout to check pasted differences in main content */
		setTimeout(function(){self.cleanPaste(); return true;}, 100);
	}

	return true;
};




/* Turn on document editing */
widgEditor.prototype.initEdit = function()
{
	var self = this;
	
	try
	{
		this.theIframe.contentWindow.document.designMode = "on";
	}
	catch (e)
	{
		/* setTimeout needed to counteract Mozilla bug whereby you can't immediately change designMode on newly created iframes */
		setTimeout(function(){self.initEdit();}, 250);
			
		return false;
	}
	
	if (!this.IE)
	{
		this.convertSPANs(true);
	}
	
	this.theContainer.style.visibility = "visible";
	this.theTextarea.style.visibility = "visible";
	
	/* Mozilla event capturing */
	if (typeof document.addEventListener == "function")
	{
		this.theIframe.contentWindow.document.addEventListener("mouseup", function(){widgToolbarCheckState(self); return true;}, false);
		this.theIframe.contentWindow.document.addEventListener("keyup", function(){widgToolbarCheckState(self); return true;}, false);
		this.theIframe.contentWindow.document.addEventListener("keydown", function(e){self.detectPaste(e); return true;}, false);
	}
	/* IE event capturing */
	else
	{
		this.theIframe.contentWindow.document.attachEvent("onmouseup", function(){widgToolbarCheckState(self); return true;});
		this.theIframe.contentWindow.document.attachEvent("onkeyup", function(){widgToolbarCheckState(self); return true;});
		this.theIframe.contentWindow.document.attachEvent("onkeydown", function(e){self.detectPaste(e); return true;}, false);
	}
	
	this.locked = false;

	return true;	
};




/* Add elements to a paragraph and inserts the paragraph before a given element in the body */
widgEditor.prototype.insertNewParagraph = function(elementArray, succeedingElement)
{
	var theBody = this.theIframe.contentWindow.document.getElementsByTagName("body")[0];
	var theParagraph = this.theIframe.contentWindow.document.createElement("p");
	
	for (var i = 0; i < elementArray.length; i++)
	{
		theParagraph.appendChild(elementArray[i]);
	}
	
	if (typeof(succeedingElement) != "undefined")
	{
		theBody.insertBefore(theParagraph, succeedingElement);
	}
	else
	{
		theBody.appendChild(theParagraph);
	}
	
	return true;
};




/* Add submit listener to parent form */
widgEditor.prototype.modifyFormSubmit = function()
{
	var self = this;
	var theForm = this.theContainer.parentNode;
	var oldOnsubmit = null;
	
	/* Find the parent form element */
	while (theForm.nodeName.toLowerCase() != "form")
	{
		theForm = theForm.parentNode;
	}

	/* Add onsubmit without overwriting existing function calls */
	oldOnsubmit = theForm.onsubmit;

	if (typeof theForm.onsubmit != "function")
	{
		theForm.onsubmit = function()
		{
			return self.updateWidgInput();
		};
	}
	else
	{
		theForm.onsubmit = function()
		{
			self.updateWidgInput();

			return oldOnsubmit();			
		};
	}

	return true;
};




/* Format the HTML with paragraphs. Any parentless text is enclosed in a paragraph, double breaks are paragraph markers */
widgEditor.prototype.paragraphise = function()
{
	if (widgInsertParagraphs && this.wysiwyg)
	{
		var theBody = this.theIframe.contentWindow.document.getElementsByTagName("body")[0];

	

		var removedElements = new Array();

		for (var i = 0; i < theBody.childNodes.length; i++)
		{
			if (theBody.childNodes[i].nodeName.isInlineName())
			{
				removedElements.push(theBody.childNodes[i].cloneNode(true));
				theBody.removeChild(theBody.childNodes[i]);
				i--;
			}
			else if (theBody.childNodes[i].nodeName.toLowerCase() == "br")
			{
				if (i + 1 < theBody.childNodes.length)
				{
					/* If the current break tag is followed by another break tag */
					if (theBody.childNodes[i + 1].nodeName.toLowerCase() == "br")
					{
						/* Remove consecutive break tags */
						while (i < theBody.childNodes.length && theBody.childNodes[i].nodeName.toLowerCase() == "br")
						{
							theBody.removeChild(theBody.childNodes[i]);
						}

						if (removedElements.length > 0)
						{
							this.insertNewParagraph(removedElements, theBody.childNodes[i]);
							removedElements = new Array();
						}
					}
					/* If the break tag appears before a block element */
					else if (!theBody.childNodes[i + 1].nodeName.isInlineName())
					{
						theBody.removeChild(theBody.childNodes[i]);
					}
					else if (removedElements.length > 0)
					{
						removedElements.push(theBody.childNodes[i].cloneNode(true));

						theBody.removeChild(theBody.childNodes[i]);
					}
					else
					{
						theBody.removeChild(theBody.childNodes[i]);
					}

					i--;
				}
				else
				{
					theBody.removeChild(theBody.childNodes[i]);
				}
			}
			else if (removedElements.length > 0)
			{
				this.insertNewParagraph(removedElements, theBody.childNodes[i]);

				removedElements = new Array();
			}
		}

		if (removedElements.length > 0)
		{
			this.insertNewParagraph(removedElements);
		}
	}
	
	return true;
};




/* Update hidden input to reflect editor contents, for submission */
widgEditor.prototype.refreshDisplay = function()
{
	if (this.wysiwyg)
	{
		this.theIframe.contentWindow.document.getElementsByTagName("body")[0].innerHTML	= this.theInput.value;
	}
	else
	{
		this.theTextarea.value = this.theInput.value;
	}

	return true;
};




/* Switch between WYSIWYG and HTML source */
widgEditor.prototype.switchMode = function()
{
	if (!this.locked)
	{
		this.locked = true;
		
		/* Switch to HTML source */
		if (this.wysiwyg)
		{
			this.updateWidgInput();
			this.theTextarea.value = this.theInput.value;	
			this.theContainer.replaceChild(this.theTextarea, this.theIframe);
			this.theToolbar.disable();
			this.wysiwyg = false;
			this.locked = false;
		}
		/* Switch to WYSIWYG */
		else
		{
			this.updateWidgInput();
			this.theContainer.replaceChild(this.theIframe, this.theTextarea);
			this.writeDocument(this.theInput.value);
			this.theToolbar.enable();
			this.initEdit();
			this.wysiwyg = true;
			initialise_inline_image_edit();
		}
	}
			
	return true;
};




/* Update hidden input to reflect editor contents, for submission */
widgEditor.prototype.updateWidgInput = function()
{
	if (this.wysiwyg)
	{
		/* Convert spans to semantics in Mozilla */
		if (!this.IE)
		{
			this.convertSPANs(true);
		}
		
		this.paragraphise();		
		this.cleanSource();
	}
	else
	{
		this.theInput.value = this.theTextarea.value;
	}
	return true;
};




/* Write initial content to editor */
widgEditor.prototype.writeDocument = function(documentContent)
{
	/* HTML template into which the HTML Editor content is inserted */
	var documentTemplate = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head><link rel='stylesheet' type='text/css' href='INSERT:STYLESHEET:END' /></head><body id='iframeBody' style='font-family:Arial; font-size:13px'>INSERT:CONTENT:END</body></html>";	
	/* Insert dynamic variables/content into document */
	documentTemplate = documentTemplate.replace(/INSERT:STYLESHEET:END/, widgStylesheet);
	documentTemplate = documentTemplate.replace(/INSERT:CONTENT:END/, documentContent);
	
	this.theIframe.contentWindow.document.open();
	this.theIframe.contentWindow.document.write(documentTemplate);
	this.theIframe.contentWindow.document.close();
	
	return true;
};




/* Toolbar items */
function widgToolbar(theEditor)
{
	var self = this;
	
	this.widgEditorObject = theEditor;
	
	/* Create toolbar ul element */
	this.theList = document.createElement("ul");
	this.theList.id = this.widgEditorObject.theInput.id + "WidgToolbar";
	this.theList.className = "widgToolbar";
	this.theList.widgToolbarObject = this;

	/* Create toolbar items */
	for (var i = 0; i < widgToolbarItems.length; i++)
	{
		switch (widgToolbarItems[i])
		{
			case "bold":
				this.addButton(this.theList.id + "ButtonBold", "widgButtonBold", "Bold", "bold");
				
				break;
				
			case "italic":
				this.addButton(this.theList.id + "ButtonItalic", "widgButtonItalic", "Italic", "italic");
				
				break;
				
			case "hyperlink":
				this.addButton(this.theList.id + "ButtonLink", "widgButtonLink", "Hyperlink", "link");
				
				break;
			case "video":
				this.addButton(this.theList.id + "ButtonVideo", "widgButtonVideo", "Video", "video");
				break;	
				
			case "hr":
				this.addButton(this.theList.id + "ButtonHr", "widgButtonHr", "Break", "inserthr");
				break;
				
			case "unorderedlist":
  			this.addButton(this.theList.id + "ButtonUnordered", "widgButtonUnordered", "Unordered List", "insertunorderedlist");
  			break;	
			
			case "orderedlist":
				this.addButton(this.theList.id + "ButtonOrdered", "widgButtonOrdered", "Ordered List", "insertorderedlist");
				
				break;
				
			case "image":
				this.addButton(this.theList.id + "ButtonImage", "widgButtonImage", "Insert Image", "image");
				
				break;
				
			case "htmlsource":
				this.addButton(this.theList.id + "ButtonHTML", "widgButtonHTML", "HTML Source", "html");
				
				break;
				
			case "blockformat":
				this.addSelect(this.theList.id + "SelectBlock", "widgSelectBlock", widgSelectBlockOptions, "formatblock");
				break;
				
			case "separator":
			  this.addSeparator();
			  break;
			
			default:
			  ar = widgToolbarItems[i];
			  this.addButton(this.theList.id + ar[0], ar[1], ar[2], ar[3]);
			
		}
	}

	return true;
};





/* Add button to toolbar */
widgToolbar.prototype.addButton = function(theID, theClass, theLabel, theAction)
{
	var menuItem = document.createElement("li");
	var theLink = document.createElement("a");
	var theText = document.createTextNode(theLabel);
	
	menuItem.id = theID;
	menuItem.className = "widgEditButton";

	theLink.href = "#";
	theLink.title = theLabel;
	theLink.className = theClass;
	theLink.action = theAction;
	theLink.onclick = widgToolbarAction;
	theLink.onmouseover = widgToolbarMouseover;

	theLink.appendChild(theText);
	menuItem.appendChild(theLink);
	this.theList.appendChild(menuItem);

	return true;
};
widgToolbar.prototype.addSeparator = function() {
  var separator = document.createElement("li");	
	separator.className = "widgSeparator";
	this.theList.appendChild(separator);
};



/* Add select box to toolbar. theContentArray is an array of string pairs (option value, option label) */
widgToolbar.prototype.addSelect = function(theID, theClass, theContentArray, theAction)
{
	var menuItem = document.createElement("li");
	var theSelect = document.createElement("select");
	
	menuItem.className = "widgEditSelect";
	
	theSelect.id = theID;
	theSelect.name = theID;
	theSelect.className = theClass;
	theSelect.action = theAction;
	theSelect.onchange = widgToolbarAction;

	for (var i = 0; i < theContentArray.length; i += 2)
	{
		var theOption = document.createElement("option");
		var theText = document.createTextNode(theContentArray[i + 1]);
		
		theOption.value = theContentArray[i];

		theOption.appendChild(theText);
		theSelect.appendChild(theOption);
	}
	
	menuItem.appendChild(theSelect);
	this.theList.appendChild(menuItem);

	return true;
};




/* Turn off toolbar items */
widgToolbar.prototype.disable = function()
{
	/* Change class to disable buttons using CSS */
	this.theList.className += " widgSource";

	/* Loop through lis */
	for (var i = 0; i < this.theList.childNodes.length; i++)
	{
		var theChild = this.theList.childNodes[i];
		
		if (theChild.nodeName.toLowerCase() == "li" && theChild.className == "widgEditSelect")
		{
			/* Loop through li children to find select */
			for (j = 0; j < theChild.childNodes.length; j++)
			{
				if (theChild.childNodes[j].nodeName.toLowerCase() == "select")
				{
					theChild.childNodes[j].disabled = "disabled";
					
					break;
				}
			}
		}
	}
	
	return true;
};




/* Turn on toolbar items */
widgToolbar.prototype.enable = function()
{
	/* Change class to enable buttons using CSS */
	this.theList.className = this.theList.className.replace(/ widgSource/, "");
	
	/* Loop through lis */
	for (var i = 0; i < this.theList.childNodes.length; i++)
	{
		var theChild = this.theList.childNodes[i];
		
		if (theChild.nodeName.toLowerCase() == "li" && theChild.className == "widgEditSelect")
		{
			/* Loop through li children to find select */
			for (j = 0; j < theChild.childNodes.length; j++)
			{
				if (theChild.childNodes[j].nodeName.toLowerCase() == "select")
				{
					theChild.childNodes[j].disabled = "";
					
					break;
				}
			}
		}
	}
	
	return true;
};




/* Change the status of the selected toolbar item */
widgToolbar.prototype.setState = function(theState, theStatus)
{
	if (theState != "SelectBlock")
	{
		var theButton = document.getElementById(this.theList.id + "Button" + theState);
	
		if (theButton != null)
		{
			if (theStatus == "on")
			{
				theButton.className = theButton.className.addClass("on");
			}
			else
			{
				theButton.className = theButton.className.removeClass("on");
			}
		}
	}
	else
	{
		var theSelect = document.getElementById(this.theList.id + "SelectBlock");
		
		if (theSelect != null)
		{
			theSelect.value = "";
			theSelect.value = theStatus;
		}
	}
			
	return true;	
};





/* Action taken when toolbar item activated */
function widgToolbarAction()
{
	var theToolbar = this.parentNode.parentNode.widgToolbarObject;
	theWidgEditor = theToolbar.widgEditorObject;
	theIframe = theWidgEditor.theIframe;
	theSelection = "";

	/* If somehow a button other than "HTML source" is clicked while viewing HTML source, ignore click */	
	if (!theWidgEditor.wysiwyg && this.action != "html")
	{
		return false;
	}
	
	switch (this.action)
	{
		case "formatblock":
			theIframe.contentWindow.document.execCommand(this.action, false, this.value);
			theWidgEditor.theToolbar.setState("SelectBlock", this.value);
			break;
			
		case "html":
			theWidgEditor.switchMode();
			
			break;
			
		case "link":
			if (this.parentNode.className.classExists("on")) {
				theIframe.contentWindow.document.execCommand("Unlink", false, null);
				theWidgEditor.theToolbar.setState("Link", "off");
			} else {			  
				if (theIframe.contentWindow.document.selection) {
					theSelection = theIframe.contentWindow.document.selection.createRange().text;
					if (theSelection == "") {
						alert("Please select the text you wish to hyperlink.");
						break;
					}
				} else {
					theSelection = theIframe.contentWindow.getSelection();
					if (theSelection == "") {
						alert("Please select the text you wish to hyperlink.");
						break;
					}
				}
        $('#link_dialog').jqmShow();
			}
			
			break;
		
		
			case "video":
				if (this.parentNode.className.classExists("on")) {
					theIframe.contentWindow.document.execCommand("Unlink", false, null);
					theWidgEditor.theToolbar.setState("Link", "off");
				} else {			  
					
	        $('#video_dialog').jqmShow();
				}

				break;
			
		case "image":
		  show_inline_image_browser();

		case "italic":
  		theIframe.contentWindow.document.execCommand(this.action, false, null);
    	break;
    case "bold":
  	  theIframe.contentWindow.document.execCommand(this.action, false, null);
      break;
		case "insertorderedlist":
		case "insertunorderedlist":
			theIframe.contentWindow.document.execCommand(this.action, false, null);
			
			var theAction = this.action.replace(/^./, function(match){return match.toUpperCase();});

			/* Turn off unordered toolbar item if ordered toolbar item was activated */	
			if (this.action == "insertorderedlist")
			{
				theAction = "Ordered";
				theWidgEditor.theToolbar.setState("Unordered", "off");
			}
			
			/* Turn off ordered toolbar item if unordered toolbar item was activated */	
			if (this.action == "insertunorderedlist")
			{
				theAction = "Unordered";
				theWidgEditor.theToolbar.setState("Ordered", "off");
			}
			
			/* If toolbar item was turned on */
			if (theIframe.contentWindow.document.queryCommandState(this.action, false, null))
			{
				theWidgEditor.theToolbar.setState(theAction, "on");
			}
			else
			{
				theWidgEditor.theToolbar.setState(theAction, "off");
			}
		  break;
		case "inserthr":
		  theIframe.contentWindow.document.execCommand("inserthtml", false, "<hr />");
		  break;
		default:
		  var custom_func = eval(this.action);
		  return_val = custom_func();
		  
	}
	
	if (theWidgEditor.wysiwyg == true)
	{
		theIframe.contentWindow.focus();
	}
	else
	{
		theWidgEditor.theTextarea.focus();
	}
	
	return false;	
};




/* Check the nesting of the current cursor position/selection */
function widgToolbarCheckState(theWidgEditor, resubmit)
{
	if (!resubmit)
	{
		/* Allow browser to update selection before using the selection */
		setTimeout(function(){widgToolbarCheckState(theWidgEditor, true); return true;}, 500);
	}
	
	var theSelection = null;
	var theRange = null;
	var theParentNode = null;
	var theLevel = 0;
	
	/* Turn off all the buttons */
	var menuListItems = theWidgEditor.theToolbar.theList.childNodes;
	for (var i = 0; i < menuListItems.length; i++)
	{
		menuListItems[i].className = menuListItems[i].className.removeClass("on");
	}
	
	/* IE selections */
	if (theWidgEditor.theIframe.contentWindow.document.selection)
	{
		theSelection = theWidgEditor.theIframe.contentWindow.document.selection;
		theRange = theSelection.createRange();
		try
		{
			theParentNode = theRange.parentElement();
		}
		catch (e)
		{
			return false;
		}
	}
	/* Mozilla selections */
	else
	{
		try
		{
			theSelection = theWidgEditor.theIframe.contentWindow.getSelection();
		}
		catch (e)
		{
			return false;
		}
		
		theRange = theSelection.getRangeAt(0);
		theParentNode = theRange.commonAncestorContainer;
	}
	
	while (theParentNode.nodeType == 3)
	{
		theParentNode = theParentNode.parentNode;
	}
	
	while (theParentNode.nodeName.toLowerCase() != "body")
	{
		switch (theParentNode.nodeName.toLowerCase())
		{
			case "a":
				theWidgEditor.theToolbar.setState("Link", "on");
				
				break;
				
			case "em":
				theWidgEditor.theToolbar.setState("Italic", "on");
				
				break;
				
			case "li":
			
				break;
				
			case "ol":
				theWidgEditor.theToolbar.setState("Ordered", "on");
				theWidgEditor.theToolbar.setState("Unordered", "off");
				
				break;
				
			case "span":
				if (theParentNode.getAttribute("style") == "font-weight: bold;")
				{
					theWidgEditor.theToolbar.setState("Bold", "on");
				}
				else if (theParentNode.getAttribute("style") == "font-style: italic;")
				{
					theWidgEditor.theToolbar.setState("Italic", "on");
				}
				else if (theParentNode.getAttribute("style") == "font-weight: bold; font-style: italic;")
				{
					theWidgEditor.theToolbar.setState("Bold", "on");
					theWidgEditor.theToolbar.setState("Italic", "on");
				}
				else if (theParentNode.getAttribute("style") == "font-style: italic; font-weight: bold;")
				{
					theWidgEditor.theToolbar.setState("Bold", "on");
					theWidgEditor.theToolbar.setState("Italic", "on");
				}
				
				break;
			
			case "strong":
				theWidgEditor.theToolbar.setState("Bold", "on");
				
				break;
			
			case "ul":
				theWidgEditor.theToolbar.setState("Unordered", "on");
				theWidgEditor.theToolbar.setState("Ordered", "off");
				
				break;
			
			default:
				theWidgEditor.theToolbar.setState("SelectBlock", "<" + theParentNode.nodeName.toLowerCase() + ">");
			
				break;
		}
		
		theParentNode = theParentNode.parentNode;
		theLevel++;
	}
	
	return true;			
}




/* Turn off browser status display for toolbar items */
function widgToolbarMouseover()
{
	window.status = "";
	
	return true;
}




function acceptableChildren(theNode)
{
	var theChildren = theNode.childNodes;
	
	for (var i = 0; i < theChildren.length; i++)
	{
		if (!theChildren[i].nodeName.isAcceptedElementName())
		{
			if (!theChildren[i].nodeName.isInlineName())
			{
				if (theNode.nodeName.toLowerCase() == "p")
				{
					acceptableChildren(replaceNodeWithChildren(theNode));
					
					return true;
				}
				
				changeNodeType(theChildren[i], "p");
			}
			else
			{
				replaceNodeWithChildren(theChildren[i]);
			}
				
			i = -1;
		}
	}
	
	for (var i = 0; i < theChildren.length; i++)
	{
		acceptableChildren(theChildren[i]);
	}
	
	return true;
}




/* Change the type of a node, e.g. h3 to p */
function changeNodeType(theNode, nodeType)
{
	var theChildren = new Array();
	var theNewNode = document.createElement(nodeType);
	var theParent = theNode.parentNode;
	
	if (theParent != null)
	{
		for (var i = 0; i < theNode.childNodes.length; i++)
		{
			theChildren.push(theNode.childNodes[i].cloneNode(true));
		}
		
		for (var i = 0; i < theChildren.length; i++)
		{
			theNewNode.appendChild(theChildren[i]);
		}
		
		theParent.replaceChild(theNewNode, theNode);
	}
	
	return true;
}




/* Replace a node with its children -- delete the item and move its children up one level in the hierarchy */
function replaceNodeWithChildren(theNode)
{
	var theChildren = new Array();
	var theParent = theNode.parentNode;
	
	if (theParent != null)
	{
		for (var i = 0; i < theNode.childNodes.length; i++)
		{
			theChildren.push(theNode.childNodes[i].cloneNode(true));
		}
		
		for (var i = 0; i < theChildren.length; i++)
		{
			theParent.insertBefore(theChildren[i], theNode);
		}
		
		theParent.removeChild(theNode);
		
		return theParent;
	}
	
	return true;
}






/* Add a class to a string */
String.prototype.addClass = function(theClass)
{
	if (this != "")
	{
		if (!this.classExists(theClass))
		{
			return this + " " + theClass;
		}
	}
	else
	{
		return theClass;
	}
	
	return this;
};




/* Check if a class exists in a string */
String.prototype.classExists = function(theClass)
{
	var regString = "(^| )" + theClass + "\W*";
	var regExpression = new RegExp(regString);
	
	if (regExpression.test(this))
	{
		return true;
	}
	
	return false;
};




/* Check if a string is the nodeName of an accepted element */
String.prototype.isAcceptedElementName = function()
{
	var elementList = new Array("#text", "a", "em", "h1", "h2", "h3", "h4", "h5", "h6", "img", "li", "ol", "p", "strong", "ul", "address", "pre");
	var theName = this.toLowerCase();
	
	for (var i = 0; i < elementList.length; i++)
	{
		if (theName == elementList[i])
		{
			return true;
		}
	}
	
	return false;
};




/* Check if a string is the nodeName of an inline element */
String.prototype.isInlineName = function()
{
	var inlineList = new Array("#text", "a", "em", "font", "span", "strong", "u");
	var theName = this.toLowerCase();
	
	for (var i = 0; i < inlineList.length; i++)
	{
		if (theName == inlineList[i])
		{
			return true;
		}
	}
	
	return false;
};




/* Remove a class from a string */
String.prototype.removeClass = function(theClass)
{
	var regString = "(^| )" + theClass + "\W*";
	var regExpression = new RegExp(regString);
	
	return this.replace(regExpression, "");
};




/* Reverse a string */
String.prototype.reverse = function()
{
	var theString = "";
	
	for (var i = this.length - 1; i >= 0; i--)
	{
		theString += this.charAt(i);
	}
	
	return theString;
};




/* Make tags valid by converting uppercase element and attribute names to lowercase and quoting attributes */
String.prototype.validTags = function()
{
	var theString = this;
	
	/* Replace uppercase element names with lowercase */
	theString = theString.replace(/<[^> ]*/g, function(match){return match.toLowerCase();});
	
	/* Replace uppercase attribute names with lowercase */
	theString = theString.replace(/<[^>]*>/g, function(match)
		{
			match = match.replace(/ [^=]+=/g, function(match2){return match2.toLowerCase();});

			return match;
		});
			
	/* Put quotes around unquoted attributes */
	theString = theString.replace(/<[^>]*>/g, function(match)
		{
			match = match.replace(/( [^=]+=)([^"][^ >]*)/g, "$1\"$2\"");
			
			return match;
		});
		
	return theString;
};
$(document).ready(function(){
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
  widgInit();
  
});

function editor_initialised() {
  initialise_inline_image_edit();
}

function initialise_inline_image_edit() {
  theIframe = $("#cms_content_contentWidgIframe").get(0);
  $("#cms_content_contentWidgIframe").contents().find(".inline_image").dblclick(function(){
    image_to_edit = $(this);
    var image_browser = '<div id="inline_image_browser" class="inline_edit_existing"><div id="inline_close_bar"><h3>Edit Image</h3><a id="inline_close" href="#">x</a></div></div>';
    $("body").append(image_browser);
    $("#inline_image_browser").centerScreen();
    $("#inline_close").click(function(){
      $("#inline_image_browser").remove(); return false;
    });
    $.get("/admin/files/inline_image_edit", function(response){
      $("#inline_image_browser").append(response);
      $("#selected_image img").attr("src", image_to_edit.attr("src")).css("width", "90px");
      $("#image_meta input").removeAttr("disabled");
      $("#meta_description").val(image_to_edit.attr("alt"));
      if(image_to_edit.hasClass("flow_left")) $("#flow_left input").attr("checked", true);
      if(image_to_edit.hasClass("flow_right")) $("#flow_right input").attr("checked", true);
      if(image_to_edit.parent().is("a")) $("#inline_image_link").val(image_to_edit.parent().attr("href"));
      $("#inline_insert .generic_button a").click(function(){
        if($("#flow_normal input").attr("checked")) var img_class = "inline_image flow_normal";
        if($("#flow_left input").attr("checked")) var img_class = "inline_image flow_left";
        if($("#flow_right input").attr("checked")) var img_class = "inline_image flow_right";
        var img_html= '<img style="" src="'+$("#selected_image img").attr("src")+'" class="'+img_class+'" alt="'+$("#meta_description").val()+'" />';
        if($("#inline_image_link").val().length > 1) img_html = '<a href="'+$("#inline_image_link").val()+'">'+img_html+"</a>";
        theIframe.contentWindow.document.execCommand("inserthtml", false, img_html);
    		$("#inline_image_browser").remove(); return false;
    		initialise_inline_image_edit();
      });
    });
  });
}



var inline_image_filter_timer;

function inline_image_filter_post(){
  $.post("/admin/files/image_filter",
    {filter: $("#filter_field").val()}, 
    function(response){ 
      $("#inline_image_browser #image_display").html(response);
      init_inline_image_select();
      clearTimeout(inline_image_filter_timer);
    }
  );
}

function show_inline_image_browser() {
  var image_browser = '<div id="inline_image_browser"><div id="inline_close_bar"><h3>Insert Image</h3><a id="inline_close" href="#">x</a></div></div>';
  $("body").append(image_browser);
  $("#inline_image_browser").centerScreen();
  $("#inline_close").click(function(){
    $("#inline_image_browser").remove(); return false;
  });
  $.get("/admin/files/inline_browse/1/", function(response){
    $("#inline_image_browser").append(response);
    init_inline_image_select();
    
    $("#inline_image_browser #filter_field").keyup(function(e) {
			if (e.which == 8 || e.which == 32 || (65 <= e.which && e.which <= 65 + 25) || (97 <= e.which && e.which <= 97 + 25) || e.which == 160 || e.which == 127) {
				clearTimeout(inline_image_filter_timer);
				inline_image_filter_timer = setTimeout("inline_image_filter_post()", 800);
			}
    });
  });
}

function init_inline_image_select() {  
  $("#image_display .edit_img").remove();
  $("#image_display div img").hover(function(){$(this).css("border", "2px solid #222");}, function(){ $(this).css("border","2px solid white");} );
  $("#image_display div img").click(function(){
    $("#image_meta input").removeAttr("disabled");
    $("#selected_image img").attr("src", "/show_image/"+$(this).parent().attr("id")+"/90.jpg");
    $("#inline_insert .generic_button a").click(function(){
      if($("#flow_normal input").attr("checked")) var img_class = "inline_image flow_normal";
      if($("#flow_left input").attr("checked")) var img_class = "inline_image flow_left";
      if($("#flow_right input").attr("checked")) var img_class = "inline_image flow_right";
      var img_html= '<img style="" src="'+$("#selected_image img").attr("src")+'" class="'+img_class+'" alt="'+$("#meta_description").val()+'" />';
      if($("#inline_image_link").val().length > 1) img_html = '<a href="'+$("#inline_image_link").val()+'">'+img_html+"</a>";
      theIframe.contentWindow.document.execCommand("inserthtml", false, img_html);
  		$("#inline_image_browser").remove(); 
  		initialise_inline_image_edit();
  		return false;
    });
  });
}