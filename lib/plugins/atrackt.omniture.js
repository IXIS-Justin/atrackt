/*
Atrackt Omniture Plugin
https://github.com/brewster1134/atrackt
@author Ryan Brewster
@version 0.0.6
*/


(function() {
  window.Atrackt.registerPlugin('omniture', {
    send: function(obj, options) {
      var arg, _ref, _ref1;

      obj.categories = (_ref = obj.categories) != null ? _ref.join(this.options.delimiters.category) : void 0;
      obj = this.translatePropMap(obj);
      if (typeof s === "undefined" || s === null) {
        return console.log('SITE CATALYST SCRIPT NOT LOADED!', obj);
      }
      this.buildSObject(obj);
      if (options.page && (s.t != null)) {
        s.t();
      } else if (s.tl != null) {
        arg = ((_ref1 = options.el) != null ? _ref1.attr('href') : void 0) ? options.el[0] : true;
        s.tl(arg, 'o', this.buildLinkName(obj));
      }
      return obj;
    },
    options: {
      charReplaceRegex: /[^\x20-\x7E]/g,
      version: 14,
      delimiters: {
        linkName: '/',
        category: '|'
      },
      linkTrackVars: ['products', 'events'],
      propMap: {
        location: 'prop1',
        categories: 'prop2',
        value: 'prop3',
        event: 'prop4'
      }
    },
    buildSObject: function(obj) {
      var key, linkTrackVars, value;

      switch (this.options.version) {
        case 14:
          linkTrackVars = this.options.linkTrackVars;
          for (key in obj) {
            value = obj[key];
            linkTrackVars.push(key);
          }
          s.linkTrackVars = linkTrackVars.join(',');
          $.extend(s, obj);
          break;
        case 15:
          s.contextData = obj;
      }
      return s;
    },
    buildLinkName: function(obj) {
      var linkName;

      linkName = [obj[this.options.propMap.location], obj[this.options.propMap.categories], obj[this.options.propMap.value]];
      return linkName.join(this.options.delimiters.linkName);
    },
    translatePropMap: function(obj) {
      var _globalData,
        _this = this;

      if (this.options.version > 14) {
        return obj;
      }
      _globalData = {};
      $.each(obj, function(k, v) {
        return _globalData[_this.keyLookup(k)] = v != null ? typeof v.replace === "function" ? v.replace(_this.options.charReplaceRegex, '') : void 0 : void 0;
      });
      return _globalData;
    },
    keyLookup: function(key) {
      var _newKey;

      _newKey = this.options.propMap[key];
      if (!_newKey) {
        console.log("NO MAPPING FOR: " + key);
      }
      return _newKey || key;
    }
  });

}).call(this);