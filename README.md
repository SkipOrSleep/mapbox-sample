mapbox-sample
=============

このアプリは、ReactによるMapbox実装の技術検証を目的としたものです。次の機能を含みます：

- Mapbox
  - Mapbox GL JSによる地図の表示
  - クエリストリングによるlat、lon、zoom、pitch、bearingの指定
  - 入力ダイアログによるAPIアクセストークンの指定
  - Geocoding APIによる住所検索
  - なお地図描画のための[スタイルデータ](./mapbox-sample/public/style_streets_japanese.json)は、日本語化のためにカスタマイズされています
- OpenStreetMap
  - React-Leafletによる地図の表示
  - クエリストリングによるlat、lon、zoomの指定
  - Geocoding APIによる住所検索

docker-composeにより起動できますが、各種モジュールは手動インストールが必要です：
```shell-session
$ git clone https://github.com/SkipOrSleep/mapbox-sample.git
$ cd mapbox-sample
$ docker-compose -f docker-compose.yml build mapbox-sample
$ docker-compose -f docker-compose.yml up -d mapbox-sample
$ docker-compose -f docker-compose.yml exec mapbox-sample /bin/bash
$ cd mapbox-sample
$ npm install react-router-dom react-responsive leaflet react-leaflet leaflet-control-geocoder mapbox-gl circle-to-polygon @material-ui/core
```