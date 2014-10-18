var map, myPosition;

//マーカーを配列で保持
var markersArray = [];

//ボタンのマーカーの色分け(いいね!:緑、条件付きでいいね:黄、アウト!!:赤)の設定
//いいね！
var iine = {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "green",
    fillOpacity: 0.8,
    scale: 10
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
        $("comment").append("Geolocationに失敗しました");      
    }       
}

function successCallback(pos){
    var latitude = pos.coords.latitude;
    var longitude = pos.coords.longitude;
    view_map(latitude, longitude);
}

function errorCallback(){
    $("#comment").append("位置情報の取得に失敗しました。");
}

function view_map(x, y){
    //現在地
    var myLatLng = new google.maps.LatLng(x, y);
    
    var mapOptions = {  
        center: myLatLng,  
        zoom: 20,  
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);
    
    myPosition = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: "Your Position!!!!"
    });
    
//    markersArray.push(marker);
    
    marker.setMap(map);
}

function addMarker(){
    var test = new google.maps.Marker({
        position: new google.maps.LatLng(35.176065,136.881111),
        icon: iine,
        animation: google.maps.Animation.DROP,
        map: map
    });
    //マーカーを管理している配列に新しいマーカーをプッシュ
    markersArray.push(test);
    test.setMap(map);
}

function removeMarker(){
    //地図上のマーカーを全て地図上から削除
    if(markersArray){
        for(i in markersArray){
            markersArray[i].setMap(null);
        }
    }
    //マーカーの配列を空に
    markersArray = [];
}
//データベースからボタン情報を取得する
function load_from_DB(){
    //取得する要素: 緯度、経度、評価(いいね！、条件付きいいね!、アウト!!)
}