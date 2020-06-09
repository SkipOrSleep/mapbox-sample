import React, { Component } from 'react'
import { Map, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';
import './openstreetmap.css';

L.Icon.Default.imagePath = '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/';

export default class OpenStreetMap extends Component {
    constructor(props) {
      super(props);

      var lat = '35';
      var lon = '135';
      var zoom = '15';

      // url query ex: http://localhost:3000/mapbox-sample/openstreetmap?lat=35&lon=135&zoom=15
      const qs = this.props.qs;
      if (JSON.stringify(qs) === '{}') {
        window.alert('Specify (lat, lon, zoom) in url parameter.')
      }

      if (typeof qs.lat !== 'undefined') {
          lat = qs.lat
      }
      if (typeof qs.lon !== 'undefined') {
          lon = qs.lon
      }
      if (typeof qs.zoom !== 'undefined') {
          zoom = qs.zoom
      }

      this.state = {
        lat: lat,
        lon: lon,
        zoom: zoom,
        addr: '',
        licence: ''
      };

      // 住所検索処理
      this.throwAddrApi = this.throwAddrApi.bind(this);
      this.throwAddrApi(this, lat, lon ,zoom)

      this.mapContainer = React.createRef();
    }

    // 住所検索処理
    throwAddrApi(_this, lat, lon ,zoom) {
      // query ex: https://nominatim.openstreetmap.org/reverse?format=json&lat=35&lon=135&zoom=15addressdetails=1
      const query = 'https://nominatim.openstreetmap.org/reverse?format=json&lat='
                  + lat
                  + '&lon='
                  + lon
                  + '&zoom='
                  + zoom
                  + '&addressdetails=1';

      // 住所取得APIのエラーハンドラ
      var onHandleErrors = function(response) {
        if (!response.ok) {
          _this.setState({
            addr: response.status + ' ' + response.statusText
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
          addr: responseJson.display_name,
          licence: responseJson.licence
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
      //     addr = ステータスコード, licence = エラーメッセージ
      fetch(query)
        .then(onHandleErrors)
        .then(onDefault)
        .then(onSuccess)
        .catch(onFailure);
    }


    componentDidMount = async() => {
      const lat = this.state.lat;
      const lon = this.state.lon;
      const zoom = this.state.zoom;

      // OpenStreetMap 本家
      const attribution = "&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

      // OpenStreetMap CartoDB
      // const attribution = "&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors &amp;copy <a href=&quot;http://cartodb.com/attributions&quot;>CartoDB</a>, CartoDB <a href=&quot;http://cartodb.com/attributions&quot;>attributions</a>"
      // const url = "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"

      const layer = new L.tileLayer(url, {attribution: attribution});

      var map = L.map(
        this.mapContainer,
        {
          center: [lat, lon],
          zoom: zoom,
          layers: [layer],
          zoomControl:false
        }
      );

      L.control.zoom({position:'topright'}).addTo(map);

      L.control.scale({imperial: false}).addTo(map);

      L.circle([lat, lon], {radius: 300}).addTo(map);

      var marker = L.marker([lat, lon]).addTo(map);

      var popup = L.popup()
        .setLatLng([lat, lon])
        .setContent('<p>Marker Clicked!!!</p>')
        .openOn(map);

      marker.bindPopup(popup).closePopup();
    }

    render() {
      return (
        <div className="App">
          <div ref={el => this.mapContainer = el} className="leaflet-container" />

          <div className="attributionContainer">
            lat：{this.state.lat}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            lon：{this.state.lon}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            zoom：{this.state.zoom}
            <br />
            addr：{this.state.addr}
            <br />
            licence：{this.state.licence}
          </div>
        </div>
      );
    }
}
