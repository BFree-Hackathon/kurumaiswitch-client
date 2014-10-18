var map;
//現在地のマーカーの情報
var myPosition;
//マーカーを配列で保持
var markersArray = [];

//0ならボタンのマーカー非表示、1ならボタンのマーカー表示中
var flag = 0;

//ボタンのマーカーの色分け(いいね!:緑、条件付きでいいね:黄、アウト!!:赤)の設定
//いいね！
var iine = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "green",
    fillOpacity: 0.8,
    scale: 1
}
//条件付きでいいね
var conditional_iine = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "yellow",
    fillOpacity: 0.8,
    scale: 1
}
//アウト!!
var out = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "red",
    fillOpacity: 0.8,
    scale: 1
}

function initialize() {
    //地図の初期中心地点をクライアントの現在地にする。
    if(navigator.geolocation){        
        navigator.geolocation.getCurrentPosition(successCallback,errorCallback);
    }else{        
        $("comment").html("Geolocationに失敗しました");      
    }
}

function successCallback(pos){
    var latitude = pos.coords.latitude;
    var longitude = pos.coords.longitude;
    view_map(latitude, longitude);
}

function errorCallback(){
    $("#comment").html("位置情報の取得に失敗しました。");
}

function view_map(x, y){
    //現在地
    var myLatLng = new google.maps.LatLng(x, y);
    //地図の情報
    var mapOptions = {  
        center: myLatLng,  
        zoom: 15,  
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //地図作成
    map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
    
    //イベント 地図の表示領域が変更されたら発火
//    google.maps.event.addEventListener(map, 'idle', function(){
//        if(flag){
//            load_from_DB();
//        }
//    });
    
    myPosition = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: "Your Position!!!!"
    });
    
    //地図にマーカーを表示
    myPosition.setMap(map);
}
  
//function onCreateInfo(info) {
//    API.getInfo()  
//    .done(function() {
//        console.log('success');  
//    })  
//    .fail(function() {
//        console.log('error');  
//    })    
//}

//データベースからボタン情報を取得する
//取得データ{lat:緯度, long:経度, evaluation:評価(いいね!:1、条件付きいいね:2、アウト!!:0)}
function load_from_DB(){
    if(flag == 0) flag = 1;
    
    API.getInfo()  
    .done(function(data) {
        console.log('getInfo: success');
        addMarker(data);
    })  
    .fail(function() {
        console.log('getInfo: error');  
    }) 
}

//dataはjsonの配列と仮定[{lat:○,long:○,evaluation:○},{lat:○,long:○,evaluation:○}...]
function addMarker(data){
    //表示範囲の情報
    var pos = map.getBounds();
    //表示範囲の北東の緯度
    var lat_ne = pos.getNorthEast().lat();
    var lng_ne = pos.getNorthEast().lng();
    var lat_sw = pos.getSouthWest().lat();
    var lng_sw = pos.getSouthWest().lng();
    
    var Info = data.data;
    var marker;
    var icon;
    var lat,lng;
    if(Info){
        for(i in Info){
            lat = data.lat;
            lng = data.lng;
            //表示範囲外だったら表示しない
            if(lat_ne>lat || lng_ne>lng || lat_sw<lat || lng_sw<lng) break;
            //evaluationによって色分け
            switch(Info[i].evaluation){
                    case 0:
                        icon = out;
                        break;
                    case 1:
                        icon = iine;
                        break;
                    case 2:
                        icon = conditional_iine;
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
}

function removeMarker(){
    if(flag == 1) flag = 0;
    
    //地図上のマーカーを全て地図上から削除
    if(markersArray){
        for(i in markersArray){
            markersArray[i].setMap(null);
        }
    }
    //マーカーの配列を空に
    markersArray = [];
}
