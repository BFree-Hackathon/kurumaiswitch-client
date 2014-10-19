(function(window, $) {
  var kHost = 'http://lod.lisra.jp:3333';

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
      var url = kHost + '/allinfo';
      console.log('GET info from', url);
      return $.ajax({
        url: url,
        type: 'GET'
      });
    }
  };

})(window, jQuery);
