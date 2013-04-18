// Generated by CoffeeScript 1.4.0

/*
Atrackt Tracking Library
@version 0.4.0
@author Ryan Brewster
*/


(function() {

  if (window.console == null) {
    window.console = {
      log: function() {}
    };
  }

  window.Atrackt = {
    plugins: {},
    registerPlugin: function(name, options) {
      var _this = this;
      this.plugins[name] = options;
      return $(function() {
        return _this._bindEvents(options.events);
      });
    },
    track: function(data) {
      var pluginData, pluginName, _ref, _results;
      _ref = this.plugins;
      _results = [];
      for (pluginName in _ref) {
        pluginData = _ref[pluginName];
        _results.push(pluginData.send(this._getTrackObject(data)));
      }
      return _results;
    },
    refresh: function() {
      var pluginData, pluginName, _ref, _results;
      _ref = this.plugins;
      _results = [];
      for (pluginName in _ref) {
        pluginData = _ref[pluginName];
        _results.push(this._bindEvents(pluginData.events));
      }
      return _results;
    },
    _debug: function() {
      return this._urlParams('debugTracking') === 'true';
    },
    _getTrackObject: function(data) {
      var $el, _base;
      if (data instanceof jQuery) {
        $el = data;
        if (typeof (_base = $el.data('track-function')) === "function") {
          _base();
        }
        $el.data('track-object', {
          location: this._getLocation(),
          categories: this._getCategories($el),
          value: this._getValue($el),
          event: this._getEvent($el)
        });
        return $el.data('track-object');
      } else if (data instanceof Object) {
        $.extend(data, {
          location: this._getLocation()
        });
        return data;
      } else {
        console.log('DATA IS NOT TRACKABLE', data);
        return false;
      }
    },
    _getLocation: function() {
      return $('body').data('track-location') || $(document).attr('title') || document.URL;
    },
    _getCategories: function($el) {
      var catArray;
      catArray = [];
      if ($el.data('track-cat')) {
        catArray.unshift($el.data('track-cat'));
      }
      $el.parents('[data-track-cat]').each(function() {
        return catArray.unshift($(this).data('track-cat'));
      });
      return catArray;
    },
    _getValue: function($el) {
      return $el.attr('title') || $el.attr('name') || $el.text() || $el.val() || $el.attr('id') || $el.attr('class');
    },
    _getEvent: function($el) {
      return $el.data('track-event');
    },
    _bindEvents: function(eventsObject) {
      var eventType, selectorArray, selectors, _results;
      if (!eventsObject) {
        return false;
      }
      _results = [];
      for (eventType in eventsObject) {
        selectorArray = eventsObject[eventType];
        selectors = $(selectorArray.join(','));
        selectors.each(function(index, selector) {
          return $(selector).data('track-event', eventType);
        });
        if ($(document).livequery != null) {
          _results.push(selectors.livequery(function() {
            return Atrackt._initEl($(this));
          }));
        } else {
          _results.push(selectors.each(function() {
            return Atrackt._initEl($(this));
          }));
        }
      }
      return _results;
    },
    _initEl: function($el) {
      $el.on(this._getEvent($el), function() {
        return Atrackt.track($el);
      });
      if (this._debug()) {
        return this._debugEl($el);
      }
    },
    _urlParams: function(key) {
      var paramString, params;
      if (key == null) {
        key = null;
      }
      params = {};
      paramString = window.location.search.substring(1);
      $.each(paramString.split('&'), function(i, param) {
        var paramObject;
        paramObject = param.split('=');
        return params[paramObject[0]] = paramObject[1];
      });
      if (key) {
        return params[key];
      } else {
        return params;
      }
    },
    _debugConsole: function() {
      var _this = this;
      return $(function() {
        $('body').addClass('tracking-debug');
        return Atrackt.debugConsole = $('<div id="tracking-debug">').append('<div id="tracking-debug-content">' + '<div id="tracking-location">Location: ' + _this._getLocation() + '</div>' + '<div id="tracking-current-element">Hover over an element to see the tracked data associated with it.</div>' + '<table class="table" id="tracking-elements">' + '<thead><tr>' + '<th>Categories</th>' + '<th>Value</th>' + '<th>Event</th>' + '<th>Error</th>' + '</tr></thead>' + '<tbody></tbody>' + '</table>' + '</div>' + '</div>').prependTo('body');
      });
    },
    _debugEl: function($el) {
      var matchingBodyEls, matchingConsoleEls, mathingEls, _consoleBody, _consoleCurrentElement, _elId;
      this._getTrackObject($el);
      _elId = this._debugElementId($el);
      $el.attr('id', _elId);
      _consoleCurrentElement = Atrackt.debugConsole.find('#tracking-current-element');
      _consoleBody = Atrackt.debugConsole.find('#tracking-elements tbody');
      _consoleBody.append('<tr class="tracking-element" id=' + _elId + '>' + '<td class="tracking-categories">' + $el.data('track-object').categories + '</td>' + '<td class="tracking-value">' + $el.data('track-object').value + '</td>' + '<td class="tracking-event">' + $el.data('track-object').event + '</td>' + '<td class="tracking-error"></td>' + '</tr>');
      mathingEls = $('body #' + _elId);
      matchingConsoleEls = mathingEls.filter('.tracking-element');
      matchingBodyEls = mathingEls.not('.tracking-element');
      if (matchingBodyEls.length > 1) {
        console.log('THERE ARE DUPLICATE ELEMENTS!', matchingBodyEls);
        matchingConsoleEls.addClass('error');
        matchingConsoleEls.find('.tracking-error').append('DUPLICATE');
      }
      matchingConsoleEls.hover(function() {
        $el.addClass('tracking-highlight');
        return $('html, body').stop().animate({
          scrollTop: $el.offset().top - $('#tracking-debug').height() - 20
        }, 500);
      }, function() {
        return $el.removeClass('tracking-highlight');
      });
      return $el.hover(function() {
        $(this).addClass('tracking-highlight');
        return _consoleCurrentElement.html(JSON.stringify($(this).data('track-object')));
      }, function() {
        return $(this).removeClass('tracking-highlight');
      });
    },
    _debugElementId: function($el) {
      var idArray, _categories, _ctaValue, _event;
      console.log($el.data());
      _categories = $el.data('track-object').categories;
      _ctaValue = $el.data('track-object').value;
      _event = $el.data('track-object').event;
      idArray = [];
      if (_categories) {
        idArray.push(_categories);
      }
      if (_ctaValue) {
        idArray.push(_ctaValue);
      }
      if (_event) {
        idArray.push(_event);
      }
      return idArray.join().toLowerCase().replace(/[^\w]/g, '');
    }
  };

  Atrackt.refresh();

  if (Atrackt._debug()) {
    Atrackt._debugConsole();
  }

}).call(this);
