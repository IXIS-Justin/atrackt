###
Atrackt Localytics Plugin
https://github.com/brewster1134/atrackt
@author Ryan Brewster
@version 0.0.3
###

window.Atrackt.registerPlugin 'localytics',
  send: (obj, options) ->
    if @_isUiWebView()
      redirectUrl = @_getRedirectUrl obj, options
      @_redirect redirectUrl
    else
      @_callTagMethod obj, options

  # HTML5 methods
  #
  _callTagMethod: (obj, options) ->
    localyticsSession?.tagEvent options.eventName, obj

  # UIWebView/HTML5 Hybrid methods
  #

  # Check if being run in UIWebView
  #
  _isUiWebView: ->
    /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)

  _getRedirectUrl: (obj, options) ->
    redirectUrl = "localytics://?event=#{options.eventName}"
    redirectUrl += "&attributes=#{JSON.stringify(obj)}" if Object.keys(obj).length
    redirectUrl

  _redirect: (url) ->
    window.location = url if @_isUiWebView()
