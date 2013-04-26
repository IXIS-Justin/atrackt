// Generated by CoffeeScript 1.4.0

/*
Atrackt Tracking Library
https://github.com/brewster1134/atrackt
@version 0.0.7
@author Ryan Brewster
*/


(function() {

  (function($, window, document) {
    if (window.console == null) {
      window.console = {
        log: function() {}
      };
    }
    return window.Atrackt = {
      plugins: {},
      registerPlugin: function(pluginName, attrs) {
        var _this = this;
        if (typeof (attrs != null ? attrs.send : void 0) !== 'function') {
          return console.log("NO SEND METHOD DEFINED");
        }
        console.log('ATRACKT PLUGIN REGISTERED', pluginName, attrs);
        attrs.include || (attrs.include = {});
        attrs.exclude || (attrs.exclude = {});
        attrs.bind = function(eventsObject) {
          var currentSelectors, event, selectors;
          for (event in eventsObject) {
            selectors = eventsObject[event];
            currentSelectors = attrs.include[event] || [];
            attrs.include[event] = _.union(currentSelectors, selectors);
          }
          return $(function() {
            return _this._bind(pluginName);
          });
        };
        attrs.unbind = function(eventsObject) {
          var currentSelectors, event, selectors;
          if (eventsObject != null) {
            for (event in eventsObject) {
              selectors = eventsObject[event];
              currentSelectors = attrs.exclude[event] || [];
              attrs.exclude[event] = _.union(currentSelectors, selectors);
            }
            return $(function() {
              return _this._unbind(pluginName, attrs.exclude);
            });
          } else {
            attrs.include = {};
            attrs.exclude = {};
            return $(function() {
              return _this._unbind(pluginName);
            });
          }
        };
        attrs.setOptions = function(options) {
          var pluginOptions;
          pluginOptions = attrs.options || {};
          return attrs.options = $.extend(true, pluginOptions, options);
        };
        return this.plugins[pluginName] = attrs;
      },
      bind: function(eventsObject) {
        var pluginData, pluginName, _ref, _results;
        _ref = this.plugins;
        _results = [];
        for (pluginName in _ref) {
          pluginData = _ref[pluginName];
          _results.push(pluginData.bind(eventsObject));
        }
        return _results;
      },
      unbind: function(eventsObject) {
        var pluginData, pluginName, _ref, _results;
        _ref = this.plugins;
        _results = [];
        for (pluginName in _ref) {
          pluginData = _ref[pluginName];
          _results.push(pluginData.unbind(eventsObject));
        }
        return _results;
      },
      refresh: function() {
        var pluginData, pluginName, _ref;
        this._debugConsoleReset();
        _ref = this.plugins;
        for (pluginName in _ref) {
          pluginData = _ref[pluginName];
          this._bind(pluginName);
        }
        return true;
      },
      track: function(data, event) {
        var pluginData, pluginName, _ref;
        _ref = this.plugins;
        for (pluginName in _ref) {
          pluginData = _ref[pluginName];
          if (data instanceof jQuery) {
            if (!(event != null) || event.handleObj.namespace === ("atrackt." + pluginName)) {
              pluginData.send(this._getTrackObject(data, {
                event: event != null ? event.type : void 0,
                plugin: pluginName
              }));
            }
          } else if (data instanceof Object) {
            pluginData.send(this._getTrackObject(data, {
              plugin: pluginName
            }));
          }
        }
        return true;
      },
      _bind: function(plugin) {
        var event, excludeObject, excludeSelectors, includeObject, includeSelectors, selectorArray, selectors, _results;
        this._unbind(plugin);
        includeObject = this.plugins[plugin].include;
        excludeObject = this.plugins[plugin].exclude;
        _results = [];
        for (event in includeObject) {
          selectorArray = includeObject[event];
          includeSelectors = selectorArray.join(',');
          excludeSelectors = (excludeObject[event] || []).join(',');
          selectors = $(includeSelectors).not(excludeSelectors);
          selectors.on("" + event + ".atrackt." + plugin, function(e) {
            return Atrackt.track($(this), e);
          });
          _results.push(selectors.each(function() {
            return Atrackt._debugEl($(this), plugin, event);
          }));
        }
        return _results;
      },
      _unbind: function(plugin, eventsObject) {
        var event, eventName, selectorArray, selectors, _results;
        eventName = ".atrackt." + plugin;
        selectors = $('*', 'body');
        if (eventsObject != null) {
          _results = [];
          for (event in eventsObject) {
            selectorArray = eventsObject[event];
            selectors = $(selectorArray.join(','));
            eventName = event.concat(eventName);
            _results.push(selectors.off(eventName));
          }
          return _results;
        } else {
          return selectors.off(eventName);
        }
      },
      _getTrackObject: function(data, additionalData) {
        var $el, trackObject, _base;
        if (additionalData == null) {
          additionalData = {};
        }
        return trackObject = data instanceof jQuery ? ($el = data, $el.data('track-object', {
          location: this._getLocation(),
          categories: this._getCategories($el),
          value: this._getValue($el)
        }), $.extend($el.data('track-object'), additionalData), typeof (_base = $el.data('track-function')) === "function" ? _base($el.data('track-object')) : void 0, $el.data('track-object')) : data instanceof Object ? ($.extend(data, {
          location: this._getLocation()
        }), data) : (console.log('DATA IS NOT TRACKABLE', data), false);
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
      }
    };
  })(jQuery, window, document);

}).call(this);
