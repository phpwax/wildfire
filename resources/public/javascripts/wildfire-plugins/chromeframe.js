/**
 * Chrome Frame IE Bar
 * 
 * Modified for usage with Chrome Frame
 * Renamed classes to avoid conflict with existing any ones.
 * Based on plugin from IE6Update plugin and ActiveBar2, with ideas
 * from http://www.sliceratwork.com/integrate-google-chrome-frame-in-ie
 *
 * Copyright (C) 2010 caesar2k
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 * 
 * * * * * * * * * * * *
 *
 * IE6Update is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3 of the License.
 *
 * IE6Update is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Activebar2; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * * * * * * * * * * * *
 *
 * This is code is derived from Activebar2
 *
 * Activebar2 is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; version 3 of the License.
 *
 * Activebar2 is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Activebar2; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * You may contact the author by mail: jakob@php.net
 *
 * Or write to:
 * Jakob Westhoff
 * Kleiner Floraweg 35
 * 44229 Dortmund
 * Germany
 *
 * The latest version of ActiveBar can be obtained from:
 * http://www.westhoffswelt.de/
 *
 * @package Core
 * @version $Revision$
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPL
 */

try {
  document.execCommand("BackgroundImageCache", true, true);
} catch(err) {}

(function($) {
  $.iso_language = function(){
    var lang = window.navigator.language || navigator.userLanguage;
    
    if ((matches = lang.match(/(\w{2})\-(\w{2})/))){
      matches.shift();
      matches[0] = matches[0].toLowerCase();
      matches[1] = matches[1].toUpperCase();
    } else if(!(matches = lang.match(/^(\w{2})$/))) {
      matches = ['en','US'];
    } else {
      matches.shift();
    }
    return matches.join('-');
  }
  
  $.fn.activebar = function(options) {
    // Merge the specified options with the default ones
    options = $.extend({}, $.fn.activebar.defaults, options);

    var lang = $.iso_language();

    options.language = (options.language === true)?lang:options.language;
    msi = options.use_msi?'&msi=true':'';

    $.fn.activebar.iframe = $('<iframe src="' + (options.url + options.language + msi) + '" frameborder="0" border="0" style="border:none"></iframe>');
    $.fn.activebar.old_overflow = $('body').css('overflow');

    if ( $.fn.activebar.container === null ) {
      $.fn.activebar.container = initializeActivebar(options);
    }
    
    // Update the style values according to the provided options
    setOptionsOnContainer($.fn.activebar.container, options);

    // If the activebar is currently visible hide it
    $.fn.activebar.hide();

    // Remove all elements from the activebar content, which might be there
    $.fn.activebar.container.find('.chromeframecontent').empty();

    // Use all provided elements as new content source
    $(this).each( function() {
      $('.chromeframecontent', $.fn.activebar.container).append(this);
    });

    // Remove any "gotoURL" function
    $.fn.activebar.container.unbind('click');

    // Add a new "gotoURL" function if one has been supplied
    if(options.url !== null) {
      $.fn.activebar.container.click(function() {
        $.fn.activebar.showiframe(options)
      });
    }

    $.fn.activebar.container_height =
      $.fn.activebar.container.height() +
      (
       parseInt($.fn.activebar.container.css('paddingBottom')) +
       parseInt($.fn.activebar.container.css('paddingTop')) +
       parseInt($.fn.activebar.container.css('borderBottomWidth'))
      );
     
    // Update the position based on the new content data height
    $.fn.activebar.container.css('top', '-' + ($.fn.activebar.container_height) + 'px');

    // Show the activebar
    if(options.preload){
      var load = {
        a:0,
        b:0,
        c:0,
        d:0
      }

      function preloadInit(){
        if(load.a && load.b && load.c && load.d){
          $.fn.activebar.show();
        }
      }

      $('<img src="' + options.icons_path + 'icon.png" class="chromeframenormal">')
      .load(function(){
        load.a=1;
        preloadInit()
      });
      $('<img src="' + options.icons_path + 'icon-over.png" class="chromeframenormal">')
      .load(function(){
        load.b=1;
        preloadInit()
      });
      $('<img src="' + options.icons_path + 'close.png" class="chromeframenormal">')
      .load(function(){
        load.c=1;
        preloadInit()
      });
      $('<img src="' + options.icons_path + 'close-over.png" class="chromeframenormal">')
      .load(function(){
        load.d=1;
        preloadInit()
      });

    }else{
      $.fn.activebar.show();
    }

  };

  $.fn.activebar.iframe = null;

  $.fn.activebar.showiframe = function(options){
    if ($.fn.activebar.iframestate === true) return;

    $('body')
    .append($.fn.activebar.iframe)
    .css({'overflow':'hidden'});
    
    $.fn.activebar.iframe.css({
      'top': $.fn.activebar.container_height + 'px',
      'left': '0px',
      'height': '100%',
      'width': '100%',
      'display': 'block',
      'position': 'fixed',
      'zIndex': '9998',
      'overflow': 'visible'
    });
    
    $(window).triggerHandler('resize');
    $.fn.activebar.iframestate = true;
  };
	
  /**
     * Default options used if nothing more specific is provided.
     */
  $.fn.activebar.defaults = {
    'background': '#ffffe1',
    'border': '#666',
    'language': true,
    'highlight': '#3399ff',
    'font': 'Bitstream Vera Sans,verdana,sans-serif',
    'fontColor': 'InfoText',
    'fontSize': '11px',
    'icons_path' : '',
    'use_msi': true,
    'url': 'http://www.google.com/chromeframe/eula.html?hl=',
    'preload': true
  };

  $.fn.activebar.scroll_func = function() {
    var $window = $(window);
    $.fn.activebar.container.stop(true, true);
    if ($.fn.activebar.state == 3) {
      // Activebar is visible
      $.fn.activebar.container.css('top', $window.scrollTop() + 'px');
      $.fn.activebar.iframe.css({
        'top': ($window.scrollTop() + $.fn.activebar.container_height) + 'px',
        'position': 'absolute',
        'height': ($window.height() - $.fn.activebar.container_height) + 'px',
        'width': $window.width() + 'px'
      });
    } else {
      // Activebar is hidden
      $.fn.activebar.container.css('top', ($window.scrollTop() - $.fn.activebar.container_height) + 'px');
      $.fn.activebar.iframe.css('top', '0px');
    }
  }
  
  $.fn.activebar.resize_func = function(){
    $(window).triggerHandler('scroll');
  }

  /**
     * Indicator in which state the activebar currently is
     * 0: Moved in (hidden)
     * 1: Moving in (hiding)
     * 2: Moving out (showing)
     * 3: Moved out (shown)
     */
  $.fn.activebar.state = 0;
  /**
   * Visibility of iframe
   */
  $.fn.activebar.iframestate = false;

  /**
     * Activebar container object which holds the shown content
     */
  $.fn.activebar.container = null;

  /**
     * Show the activebar by moving it in
     */
  $.fn.activebar.show = function() {
    if ( $.fn.activebar.state > 1 ) {
      // Already moving out or visible. Do Nothing.
      return;
    }

    $.fn.activebar.state = 2;
    $.fn.activebar.container.css('display', 'block');

    var height = $.fn.activebar.container.height();
    $.fn.activebar.container.animate({
      'top': '+=' + ($.fn.activebar.container_height) + 'px'
    }, height * 20, 'linear', function() {
      $.fn.activebar.state = 3;
    });
  };

  /**
     * Hide the activebar by moving it out
     */
  $.fn.activebar.hide = function() {
    if ($.fn.activebar.state < 2) {
      // Already moving in or hidden. Do nothing.
      return;
    }
		
    $.fn.activebar.iframe.remove();
    $.fn.activebar.iframestate = false;
    $.cookie('refuseChromeInstall', '1');
    
    $.fn.activebar.state = 1;

    var height = $.fn.activebar.container.height();
    $.fn.activebar.container.animate({
      'top': '-=' + ($.fn.activebar.container_height) + 'px'
    }, height * 20, 'linear', function() {
      $.fn.activebar.container.css('display', 'none');
      $.fn.activebar.visible = false;
      $('body').css('overflow', $.fn.activebar.old_overflow);

      $(window)
      .triggerHandler('resize')
      .unbind('scroll', $.fn.activebar.scroll_func)
      .unbind('resize', $.fn.activebar.resize_func);
    });
  };

  /****************************************************************
     * Private function only accessible from within this plugin
     ****************************************************************/

  /**
      * Create the a basic activebar container object and return it
      */
  function initializeActivebar(options) {
    // Create the container object
    var container = $('<div/>').attr('id', 'activebar-container');

    // Set the needed css styles
    container.css({
      'display': 'none',
      'position': 'fixed',
      'zIndex': '9999',
      'top': '0px',
      'left': '0px',
      'cursor': 'default',
      'padding': '4px',
      'font-size' : '9px',
      'background': options.background,
      'borderBottom': '1px solid ' + options.border,
      'color': options.fontColor
    });

    var $window = $(window);

    // Make sure the bar has always the correct width
    $window.bind('resize', function() {
      container.width($(this).width());
    });

    // Set the initial bar width
    $window.triggerHandler('resize');

    // The IE prior to version 7.0 does not support position fixed. However
    // the correct behaviour can be emulated using a hook to the scroll
    // event. This is a little choppy, but it works.
    if (!window.XMLHttpRequest){
      // Position needs to be changed to absolute, because IEs fallback
      // for fixed is static, which is quite useless here.
      container.css('position', 'absolute');

      $window
      .bind('scroll', $.fn.activebar.scroll_func)
      .bind('resize', $.fn.activebar.resize_func);
    }

    // Add the icon container
    container.append(
      $('<div></div>' ).attr('class', 'icon' )
      .css({
        'float': 'left',
        'width': '16px',
        'height': '16px',
        'margin': '0 4px 0 0',
        'padding': '0'
      })
      .append('<img src="'+(options.icons_path)+'icon.png" class="chromeframenormal">')
      .append('<img src="'+(options.icons_path)+'icon-over.png" class="chromeframehover">')
      );

    // Add the close button
    container.append(
      $( '<div></div>' ).attr( 'class', 'close' )
      .css({
        'float': 'right',
        'margin': '0 5px 0 0 ',
        'width': '16px',
        'height': '16px'
      })
      .click(function(event) {
        $.fn.activebar.hide();
        event.stopPropagation();
      })
      .append('<img src="'+(options.icons_path)+'close.png" class="chromeframenormal">')
      .append('<img src="'+(options.icons_path)+'close-over.png" class="chromeframehover">')
      );

    // Create the initial content container
    container.append(
      $('<div></div>').attr( 'class', 'chromeframecontent')
      .css({
        'margin': '0px 8px',
        'paddingTop': '1px'
      })
      );
				
    $('.chromeframehover', container).hide();
    $('body').prepend(container);

    return container;
  }

  /**
      * Set the provided options on the given activebar container object
      */
  function setOptionsOnContainer( container, options ) {
    // Register functions to change between normal and highlight background
    // color on mouseover
    container.unbind( 'mouseenter mouseleave' );
    container.hover(
      function() {
        $(this).css({
          backgroundColor: options.highlight,
          color: "#FFFFFF"
        }).addClass('chromeframehover');
        $('.chromeframehover', container).show();
        $('.chromeframenormal', container).hide();
      },
      function() {
        $(this).css( {
          'backgroundColor': options.background,
          color: "#000000"
        } ).removeClass('chromeframehover');
        $('.chromeframehover', container).hide();
        $('.chromeframenormal', container).show();
      }
      );

    // Set the content font styles
    $( '.chromeframecontent', container ).css({
      'fontFamily': options.font,
      'fontSize': options.fontSize
    });
  }

})(jQuery);

(function($) {
  
  $.chromeframebar = function(options){
    options = $.extend({}, $.chromeframebar.defaults, options);
    $.chromeframebar.hInstallTimeout = null;
    
    $(window).bind('load', function(){
      if (options.force || !$.cookie('refuseChromeInstall')) {
        // This will fire regardless if chrome frame was detected or not
        if(options.timeout !== false){
          $.chromeframebar.hInstallTimeout = window.setTimeout(function(){
            $.chromeframebar.fire(options);
          }, options.timeout);
        }
        
        CFInstall.check({
          //disable the default prompting mechanism
          preventPrompt: true,
          preventInstallDetection: true,
          //if Google Chrome Frame is missing we execute the folowing function
          onmissing: function(){
            //create the notice
            if ($.chromeframebar.hInstallTimeout) {
              window.clearTimeout($.chromeframebar.hInstallTimeout);
            }
            $.chromeframebar.fire(options);
          }
        });
      }
    });
  }
  
  $.chromeframebar.fire = function(options){
    lang = (options.language === true)?$.iso_language():options.language;

    if(typeof options.text[lang] != 'undefined'){
      text = options.text[lang];
    } else {
      text = options.text['en-US'];
    }
    
    $('<div/>').html(text).activebar(options);
  };
  
  $.chromeframebar.defaults = {
    'language': true,
    'text': {
      'en-US': 'Internet Explorer is missing updates required to view this site. Click here to update...',
      'pt-BR': 'Internet Explorer necessita instalar um plugin para visualizar esta página corretamente. Clique aqui para continuar...'
    },
    'timeout': false,
    'force': false
  }
})(jQuery);

(function($) {
  $.cookie = function(name, value, options){
    if (typeof value != 'undefined') { // name and value given, set cookie
      options = options || {};
      if (value === null) {
        value = '';
        options.expires = -1;
      }
      var expires = '';
      if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
        var date;
        if (typeof options.expires == 'number') {
          date = new Date();
          date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
        } else {
          date = options.expires;
        }
        expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
      }
      // CAUTION: Needed to parenthesize options.path and options.domain
      // in the following expressions, otherwise they evaluate to undefined
      // in the packed version for some reason...
      var path = options.path ? '; path=' + (options.path) : '';
      var domain = options.domain ? '; domain=' + (options.domain) : '';
      var secure = options.secure ? '; secure' : '';
      document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else { // only name given, get cookie
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
          var cookie = $.trim(cookies[i]);
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }
    return null;
  }
})(jQuery);