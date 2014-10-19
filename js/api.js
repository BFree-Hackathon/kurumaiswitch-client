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
          lat: info.latitude,
          lng: info.longitude,
          evaluation: info.evaluation
        }
      });
    },
    postComment: function(infoId, body) {
      var url = kHost + '/comment';

      console.log('POST comment to', url);
      console.log('infoId=' + infoId + ', body=' + body);

      return $.ajax({
        url: url,
        type: 'POST',
        data: {
          infoId: infoId,
          body: body
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
