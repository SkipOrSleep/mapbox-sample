import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl';
import './mapbox.css';

export default class OpenStreetMap extends Component {
  constructor(props) {
    super(props);

    var lat = '35';
    var lon = '135';
    var zoom = '15';
    var pitch = '0';
    var bearing = '0';

    // url ex: http://localhost:3000/mapbox-sample/mapbox?lat=35&lon=135&zoom=15&pitch=60&bearing=180
    const qs = this.props.qs;
    if (JSON.stringify(qs) === '{}') {
      window.alert('Specify (lat, lon, zoom, pitch, bearing) in url parameter.')
    }

    if (typeof qs.lat !== 'undefined') {
        lat = qs.lat;
    }
    if (typeof qs.lon !== 'undefined') {
        lon = qs.lon;
    }
    if (typeof qs.zoom !== 'undefined') {
        zoom = qs.zoom;
    }
    if (typeof qs.pitch !== 'undefined') {
        pitch = qs.pitch;
    }
    if (typeof qs.bearing !== 'undefined') {
        bearing = qs.bearing;
    }

    this.state = {
      lat: lat,
      lon: lon,
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
      addr: '',
      licence: ''
    };

    mapboxgl.accessToken = window.prompt("Mapboxのアクセストークンを入力して下さい", "");;
    this.mapContainer = React.createRef();

    // 住所検索処理
    this.throwAddrApi = this.throwAddrApi.bind(this);
    this.throwAddrApi(this, lat, lon)
  }

  // 住所検索処理
  throwAddrApi(_this, lat, lon) {
    // query ex: https://api.mapbox.com/geocoding/v5/mapbox.places/135,35.json?types=address&access_token=<your_access_token>
    const query = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'
                + lon
                + ','
                + lat
                + '.json?types=address&access_token='
                + mapboxgl.accessToken;

    // 住所取得APIのエラーハンドラ
    var onHandleErrors = function(response) {
      if (!response.ok) {
        _this.setState({
          addr: response.status + ' ' + response.statusText + ' : ' + query
        })
        return response.json().then(function(err) {
          throw Error(err.message);
        });
      } else {
        return response;
      }
    };

    // 住所取得APIの成功時/失敗時の共通処理
    var onDefault = function(response) {
      return response.json();
    };

    // 住所取得APIの成功時
    var onSuccess = function(responseJson) {
      _this.setState({
        addr: responseJson.features[0].place_name,
        licence: responseJson.attribution
      })
    };

    // 住所取得APIの失敗時
    var onFailure = function(err) {
      _this.setState({
        licence: err.message
      })
    };

    // APIの戻りが200 OKの場合：
    //     addr = 住所, licence = ライセンス
    // それ以外の場合：
    //     addr = ステータスコードとAPIのクエリ, licence = エラーメッセージ
    fetch(query)
      .then(onHandleErrors)
      .then(onDefault)
      .then(onSuccess)
      .catch(onFailure);
  }

  componentDidMount = async() => {
    // create map
    const lat = this.state.lat;
    const lon = this.state.lon;
    const zoom = this.state.zoom;
    const pitch = this.state.pitch;
    const bearing = this.state.bearing;

    // 地図の日本語化のため、自前で定義したstyleファイルを利用する
    // ここで取得した style_streets_japanese.json を mapboxgl.Map() のコンストラクタにセットする
    const style = await fetch('http://localhost:3000/mapbox-sample/style_streets_japanese.json').then(res => res.json());

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: style,
      center: [lon, lat],
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
      attributionControl: false,
      logoPosition: 'top-left'
    });

    // マップナビゲーションコントローラ（ズームイン・ズームアウト用のプラスマイナスボタン）の表示
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // アトリビューション（ライセンス表示）の場所変更
    // なお、Mapbox logoの場所変更はmapオブジェクトのコンストラクタで行う。
    map.addControl(new mapboxgl.AttributionControl(), 'bottom-right');

    // マップスケールコントローラ（縮尺）の表示
    map.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    // giojson形式の円形（実際には正128角形のポリゴン）を作成
    const circleToPolygon = require('circle-to-polygon');
    var polygon = circleToPolygon([Number(lon), Number(lat)], 300, 128);

    map.on('load', function() {
      // 円のレイヤー
      map.addLayer({
        id: "circleLayer",
        type: "fill",
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              "type": "Feature",
              "properties": {},
              "geometry": polygon
            }]
          }
        },
        layout: {},
        paint: {
          'fill-color': '#0000cc',
          'fill-opacity': 0.3
        }
      });

      // 円の縁の線のレイヤー
      map.addLayer({
        id: "circleEdgeLayer",
        type: "line",
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              "type": "Feature",
              "properties": {},
              "geometry": polygon
            }]
          }
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#0000cc',
          'line-width': 3
        }
      });

      // 円の真ん中のアイコンのレイヤー
      map.loadImage(
        'http://localhost:3000/mapbox-sample/location.png',
        function(error, image) {
          if (error) throw error;
          map.addImage('location', image);
          map.addLayer({
            'id': 'marker',
            'type': 'symbol',
            'source': {
              'type': 'geojson',
              'data': {
                'type': 'FeatureCollection',
                'features': [{
                  'type': 'Feature',
                  'properties': {},
                  'geometry': {
                    'type': 'Point',
                    'coordinates': [lon, lat]
                  }
                }]
              }
            },
            'layout': {
              'icon-image': 'location',
              'icon-size': 0.3
            }
          });
        }
      );
    });

    // Change the cursor to a pointer when the it enters a feature in the 'symbols' layer.
    map.on('mouseenter', 'marker', function() {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'marker', function() {
      map.getCanvas().style.cursor = '';
    });

    // Center the map on the coordinates of any clicked symbol from the 'symbols' layer.
    map.on('click', 'marker', function(e) {
      // map.flyTo({ center: e.features[0].geometry.coordinates });
      var string = 'Marker Clicked!!!';
      new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat([lon, lat])
        .setHTML('<p>' + string + '</p>')
        .addTo(map);
    });
  }

  render() {
    return (
      <div className="App">
        <div ref={el => this.mapContainer = el} className="mapContainer" />

        <div className="attributionContainer">
          lat：{this.state.lat}&emsp;
          lon：{this.state.lon}&emsp;
          zoom：{this.state.zoom}&emsp;
          pitch：{this.state.pitch}&emsp;
          bearing：{this.state.bearing}
          <br />
          addr：{this.state.addr}
          <br />
          licence：{this.state.licence}
        </div>
      </div>
    );
  }
}
