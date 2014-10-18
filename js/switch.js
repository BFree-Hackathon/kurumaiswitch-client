
(function(window, document, navigator, $, API) {
  if (!('geolocation' in navigator)) {
    window.alert('位置情報が利用できません．対応ブラウザでご利用ください．');
    return;
  }

  var niceButton, okButton, badButton, loading;

  // サーバーに送信するための情報
  var Info = function(latitude, longitute, evaluation) {
    this.lat = latitude;
    this.long = longitute;
    this.evaluation = evaluation;
  };

  // 送信履歴
  var PostHistories = [];

  /*  Event Listener
     ============================================= */

  window.onload = function() {
    niceButton = $('#nice-button');
    okButton = $('#ok-button');
    badButton = $('#bad-button');
    loading = $('#button-loading');

    niceButton.add(okButton).add(badButton)
      .on('click', onClickButton(onCreateInfo));
  };

  function onCreateInfo(info) {
    API.postInfo(info)
      .done(function() {
        console.log('success');
      })
      .fail(function() {
        console.log('error');
      })
      .always(function() {
        loading.removeClass('active');
      });
  }

  function onClickButton(cb) {
    return function(event) {
      loading.addClass('active');
      navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        var evaluation = parseInt(event.target.value);
        var info = new Info(latitude, longitude, evaluation);
        cb(info);
      }, onErrorGeo);
    };
  }

  function onErrorGeo() {
    window.alert('現在位置情報が利用できません．後ほどお試しください．');
  }

})(window, document, navigator, jQuery, API);
