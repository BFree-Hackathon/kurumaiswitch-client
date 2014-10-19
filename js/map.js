var map;
//現在地のマーカーの情報
var myPosition;
//マーカーを配列で保持
var markersArray = [];

//0ならボタンのマーカー非表示、1ならボタンのマーカー表示中
var flag = 0;

//ボタンのマーカーの色分け(いいね!:緑、条件付きでいいね:黄、アウト!!:赤)の設定
//いいね！
var nicePinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FE7569");

//条件付きでいいね
var okPinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|FEFE29");

//アウト!!
var badPinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|29CEFE");

function initialize() {
  //地図の初期中心地点をクライアントの現在地にする。
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    $("comment").html("Geolocationに失敗しました");
  }
}

function successCallback(pos) {
  var latitude = pos.coords.latitude;
  var longitude = pos.coords.longitude;
  view_map(latitude, longitude);
  load_from_DB()
}

function errorCallback() {
  $("#comment").html("位置情報の取得に失敗しました。");
}

function view_map(x, y) {
  //現在地
  var myLatLng = new google.maps.LatLng(x, y);
  //地図の情報
  var mapOptions = {
    center: myLatLng,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  //地図作成
  map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

  myPosition = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: "Your Position!!!!"
  });

  //地図にマーカーを表示
  myPosition.setMap(map);
}

//データベースからボタン情報を取得する
//取得データ{lat:緯度, lng:経度, evaluation:評価(いいね!:1、条件付きいいね:2、アウト!!:0)}
function load_from_DB() {
  if (flag == 0) flag = 1;

  API.getInfo()
    .done(function(data) {
      var infoList = JSON.parse(data);
      console.log('getInfo: success');
      console.log(infoList);
      addMarker(infoList);
    })
    .fail(function() {
      console.log('getInfo: error');
    })
}

//dataはjsonの配列と仮定[{lat:○,long:○,evaluation:○},{lat:○,long:○,evaluation:○}...]
function addMarker(infoList) {
  var marker;
  var icon;
  var lat, lng;
  for (var i = 0, len = infoList.length; i < len; i++) {
    var info = infoList[i];
    lat = info.lat;
    lng = info.lng;

    //evaluationによって色分け
    switch (infoList[i].evaluation) {
      case 0:
        icon = badPinImage;
        break;
      case 1:
        icon = nicePinImage;
        break;
      case 2:
        icon = okPinImage;
    }
    //マーカー作成
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(lat, lng),
      icon: icon,
      animation: google.maps.Animation.DROP,
      map: map
    });
    //マーカーを管理している配列に新しいマーカーをプッシュ
    markersArray.push(marker);

    marker.setMap(map);
  }
}
