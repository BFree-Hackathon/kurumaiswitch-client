
(function(window, document, navigator, $, vex, API) {
  if (!('geolocation' in navigator)) {
    window.alert('位置情報が利用できません．対応ブラウザでご利用ください．');
    return;
  }

  var niceButton, okButton, badButton, loading;

  // サーバーに送信するための情報
  var Info = function(latitude, longitute, evaluation) {
    this.latitude = latitude;
    this.longitude = longitute;
    this.evaluation = evaluation;
    this.id = 0;
    this.comments = [];
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
      .on('click', function(event) {
        loading.addClass('active');
        navigator.geolocation.getCurrentPosition(function(position) {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          var evaluation = parseInt(event.target.value);
          postInfo(latitude, longitude, evaluation);
        }, onErrorGeo);
      });
  };

  function postInfo(latitude, longitude, evaluation) {
    var info = new Info(latitude, longitude, evaluation);
    API.postInfo(info)
      .done(function(data) {
        info.id = data.id;
        showPostCommentDialog(info);
        PostHistories.push(info);
      })
      .fail(function() {
        showPostErrorDialog();
      })
      .always(function() {
        loading.removeClass('active');
      });
  }

  function postComment(info, body) {
    API.postComment(info.id, body)
      .done(function(data) {
        showPostSuccessDialog();
        info.comments.push(body);
      })
      .fail(function() {
        showPostErrorDialog();
      })
      .always(function() {
        loading.removeClass('active');
      });
  }

  function showPostCommentDialog(info) {
    vex.dialog.open({
      message: '投稿しました！コメントも投稿しますか？',
      input: '<textarea class="comment-textarea" name="body"></textarea>',
      buttons: [
        $.extend({}, vex.dialog.buttons.YES, { text: 'コメントする' }),
        $.extend({}, vex.dialog.buttons.NO, { text: 'キャンセル' })
      ],
      callback: function(data) {
        if (data === false) {
          return console.log('Comment cancelled');
        }
        loading.addClass('active');
        postComment(info, data.body);
      }
    });
  }

  function showPostSuccessDialog() {
    vex.dialog.alert({
      message: '投稿しました！'
    });
  }

  function showPostErrorDialog() {
    vex.dialog.alert({
      message: '投稿に失敗しました．後でやり直してください．'
    });
  }

  function onErrorGeo() {
    window.alert('現在位置情報が利用できません．設定をご確認ください．');
  }

})(window, document, navigator, jQuery, vex, API);
