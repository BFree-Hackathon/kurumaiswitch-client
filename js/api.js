(function(window, $) {
  var kHost = 'http://localhost:8080';

  window.API = {
    postInfo: function(info) {
      var url = kHost + '/info';
      console.log('POST info to', url);
      console.log(info);
      return $.ajax({
        url: url,
        type: 'POST',
        data: {
          lat: info.lat,
          long: info.long,
          evaluation: info.evaluation
        }
      });
    },
    getInfo: function(){
      var url = kHost + '/info';
      console.log('GET info from', url);
      var getInfo = $.ajax({
        url: url,
        type: 'GET'
      });
      console.log(getInfo);
      return getInfo;
    }
  };

})(window, jQuery);
