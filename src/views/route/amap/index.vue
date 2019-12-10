<template>
  <div class="amap-wrapper">
    <el-amap
      :vid="'amapDemo' + (Math.floor(Math.random()* 10000) +1).toString().padStart(5, '0')"
      ref="amap"
      :center="map.center"
      :map-manager="map.amapManager"
      :zoom="map.zoom"
      :events="map.events"
      class="amap-demo"
    >
      <!-- 信息窗体 -->
      <el-amap-info-window
        :position="infowindow.position"
        :contentRender="infoWindowRender"
        :visible="infowindow.visible"
        :events="infowindow.events"
      ></el-amap-info-window>
      <!-- 未检索到经纬度的点列表 -->
      <el-card class="box-card" v-show="noLocationMarkers.list.length">
        <div slot="header" class="clearfix">
          <span>未检索到的点</span>
        </div>
        <div v-for="(markerObject, index) in noLocationMarkers.list" :key="index">
          <i class="el-icon-location" style="color: red">
            {{markerObject[noLocationMarkers.searchParams]}}
            <el-button @click="createNoPositionMarker(markerObject, index)">定位</el-button>
          </i>
        </div>
      </el-card>
    </el-amap>
  </div>
</template>

<script>
import VueAMap from "vue-amap";
import PersonInfoWindow from "./components/infowindow/personinfowindow.vue";
import StoreInfoWindow from "./components/infowindow/storeinfowindow.vue";
import StoreInfoWindowForLnglat from "./components/infowindow/storeinfowindowforlnglat.vue";

// 引入高德地图
VueAMap.initAMapApiLoader({
  key: "be0033b34b86f49ed93917c0a16b1277",
  plugin: ["AMap.Scale", "AMap.OverView", "AMap.ToolBar", "AMap.MapType"],
  v: "1.4.4",
  uiVersion: "1.0.11"
});

export default {
  components: {
    PersonInfoWindow,
    StoreInfoWindow,
    StoreInfoWindowForLnglat
  },
  props: {
    infowindowType: {
      type: String,
      default() {
        return "default";
      }
    }
  },
  data() {
    return {
      amap: {},

      // 存储marker创建对象
      markerObject: {
        SvgMarker: undefined
      },

      // 地图覆盖物缓存对象
      mapOverlaies: {
        massMarkers: [],
        svgMarkers: []
      },

      // 地图相关信息
      map: {
        zoom: 12,
        amapManager: new VueAMap.AMapManager(),
        center: [121.59996, 31.197646],
        //mapStyle: "light",
        events: {
          init: map => {
            this.amap = this.$refs.amap.$$getInstance();
            //this.amap.setMapStyle("amap://styles/grey")
            // 加载高德UI库
            AMapUI.loadUI(["overlay/SvgMarker"], SvgMarker => {
              if (SvgMarker) {
                this.markerObject.SvgMarker = SvgMarker;
                this.$emit("init", ...[this.map, AMap, AMapUI]);
              } else {
                this.$message({
                  showClose: true,
                  message: "高德UI库加载失败",
                  type: "error"
                });
              }
            });
          }
        }
      },
      // 信息窗体相关信息
      infowindow: {
        position: [121.59996, 31.197646],
        visible: false,
        events: {
          open: () => {},
          close: () => {
            this.$set(this.infowindow, "visible", false);
          }
        }
      },

      // 信息窗口显示信息
      infowindowData: undefined,

      // 存储创建点标记所需相关信息
      noLocationMarkers: {
        longitude: "longitude",
        latitude: "latitude",
        searchParams: "name",
        list: []
      }
    };
  },
  methods: {
    // 根据数据集创建 点标记， 无论是否有坐标
    createMarkers(markers, longitude, latitude, searchParams) {
      if (!longitude) {
        longitude = "longitude";
      }
      if (!latitude) {
        latitude = "latitude";
      }
      if (!searchParams) {
        searchParams = "name";
      }
      // 存储创建点标记所需相关信息
      this.noLocationMarkers = {
        longitude,
        latitude,
        searchParams,
        list: []
      };
      markers.forEach(item => {
        if (item[longitude] && item[latitude]) {
          this.createMarker(
            new AMap.LngLat(item[longitude], item[latitude]),
            item,
            longitude,
            latitude
          );
        } else {
          this.createMarker(undefined, item, longitude, latitude, searchParams);
        }
      });
      this.amap.setFitView();
    },
    // 创建需要定位的点标记
    createNoPositionMarker(item, index) {
      let center = this.amap.getCenter();
      Object.assign(item, {
        longitude: center.O,
        latitude: center.P
      });
      var marker = new AMap.Marker({
        map: this.amap,
        content: '<i class="el-icon-location" style="color: red"></i>',
        position: center,
        draggable: true,
        extData: item
      });
      marker.on("click", event => {
        this.$set(this.infowindow, "position", [
          event.lnglat.O,
          event.lnglat.P
        ]);
        this.infowindowData = item;
        this.$set(this.infowindow, "visible", true);
      });

      marker.on("dragend", event => {
        const obj = {};
        obj[this.noLocationMarkers.longitude] = event.lnglat.O;
        obj[this.noLocationMarkers.latitude] = event.lnglat.P;
        Object.assign(item, obj);
      });
      this.noLocationMarkers.list.splice(index, 1);
    },
    // 创建标记 根据坐标值有无
    createMarker(position, item, longitude, latitude, searchParams) {
      if (position) {
        var marker = new AMap.Marker({
          map: this.amap,
          content: '<i class="el-icon-location" style="color: blue"></i>',
          position: position,
          draggable: true,
          extData: item
        });
        marker.on("click", event => {
          this.$set(this.infowindow, "position", [
            event.lnglat.O,
            event.lnglat.P
          ]);
          this.infowindowData = item;
          this.$set(this.infowindow, "visible", true);
        });

        marker.on("dragend", event => {
          const obj = {};
          obj[longitude] = event.lnglat.O;
          obj[latitude] = event.lnglat.P;
          Object.assign(item, obj);
        });
      } else {
        new AMap.PlaceSearch().search(item[searchParams], (status, result) => {
          if (status == "complete") {
            let position = result.poiList.pois[0].location;
            Object.assign(item, {
              longitude: position.O,
              latitude: position.P
            });
            var marker = new AMap.Marker({
              map: this.amap,
              content: '<i class="el-icon-location" style="color: orange"></i>',
              position: position,
              draggable: true,
              extData: item
            });
            marker.on("click", event => {
              this.$set(this.infowindow, "position", [
                event.lnglat.O,
                event.lnglat.P
              ]);
              this.infowindowData = item;
              this.$set(this.infowindow, "visible", true);
            });

            marker.on("dragend", event => {
              const obj = {};
              obj[longitude] = event.lnglat.O;
              obj[latitude] = event.lnglat.P;
              Object.assign(item, obj);
            });
            this.amap.setFitView();
          } else if (status == "error") {
            this.$message({
              message: result,
              type: "error"
            });
          } else {
            this.noLocationMarkers.list.push(item);
            this.$message({
              message: item[searchParams] + "未检索到",
              type: "warning"
            });
          }
        });
      }
    },
    // 信息窗体
    infoWindowRender(h, node, instance) {
      switch (this.infowindowType) {
        case "personInfoWindow":
          return h(PersonInfoWindow, {
            props: {
              data: this.infowindowData
            }
          });
        case "storeInfoWindow":
          return h(StoreInfoWindow, {
            props: {
              data: this.infowindowData
            }
          });
        case "storeinfowindowforlnglat":
          return h(StoreInfoWindowForLnglat, {
            props: {
              data: this.infowindowData
            }
          });
        default:
          break;
      }
    },

    // 根据路线类型绘制路线
    createLine(data, type, color, caseToLnglat, userName) {
      if (!caseToLnglat) {
        caseToLnglat = {
          lon: "longitude",
          lat: "latitude"
        };
      }
      // 绘制点标记
      let lnglatList = data.map((child, index) => {
        Object.assign(child, {
          lnglat: [child[caseToLnglat.lon], child[caseToLnglat.lat]],
          userName: userName
        });
        this.createSvgMarker(
          {
            data: child,
            color: color
          },
          index + 1
        );
        return child.lnglat;
      });
      // 根据type 绘制路线
      switch (type) {
        case "warking":
          this.drawWalking(lnglatList);
          break;
        case "riding":
          this.drawRiding(lnglatList);
          break;
        case "driving":
          this.drawDriving(lnglatList);
          break;
        default:
          this.drawLine(lnglatList);
          break;
      }
    },

    // 创建SvgMarker
    createSvgMarker(options, number) {
      let shape = new this.markerObject.SvgMarker.Shape["Circle"]({
        height: 17,
        fillColor: options.color
      });
      let setting = {
        map: this.amap,
        position: options.data.lnglat,
        iconLabel: {
          innerHTML: number,
          style: { top: "3px" }
        },
        extData: options.data
      };

      let svgMarker = new this.markerObject.SvgMarker(shape, setting);
      svgMarker.on("click", event => {
        this.$set(this.infowindow, "position", [
          event.lnglat.O,
          event.lnglat.P
        ]);
        this.infowindowData = options.data;
        this.$set(this.infowindow, "visible", true);
      });
      // 缓存 SvgMarker
      this.mapOverlaies.svgMarkers.push(svgMarker);
    },
    /**
     * 绘制海量点标记
     */
    createMassMarker(options) {
      let mass = new AMap.MassMarks(options.markers, {
        opacity: 0.7,
        zIndex: 120,
        cursor: "pointer",
        style: {
          url: options.img,
          anchor: new AMap.Pixel(8, 8),
          size: new AMap.Size(15, 15)
        }
      });
      mass.on("click", event => {
        this.$set(this.infowindow, "position", [
          event.data.lnglat.O,
          event.data.lnglat.P
        ]);
        this.infowindowData = event.data;
        this.$set(this.infowindow, "visible", true);
      });
      mass.setMap(this.amap);
      this.amap.setCenter(mass.getData()[0].lnglat);
      // 缓存海量点标记
      this.mapOverlaies.massMarkers.push(mass);
    },
    // 绘制直行路线
    drawLine(lnglatList) {
      new AMap.Polyline({
        map: this.amap,
        stokeColor: "blue",
        path: lnglatList
      });
    },
    // 绘制步行路线
    drawWalking(lnglatList) {
      for (var i = 0; i < lnglatList.length - 1; ) {
        var walking = new AMap.Walking({
          map: this.amap,
          hideMarkers: true,
          autoFitView: false
        });
        walking.search(lnglatList[i], lnglatList[++i]);
      }
    },
    // 绘制骑行路线
    drawRiding(lnglatList) {
      for (var i = 0; i < lnglatList.length - 1; ) {
        var driving = new AMap.Driving({
          map: this.amap,
          hideMarkers: true,
          autoFitView: false
        });
        driving.search(lnglatList[i], lnglatList[++i]);
      }
    },
    /**
     * 绘制驾车路线
     */
    drawDriving(lnglatList) {
      while (lnglatList.length != 1) {
        var waypoints;

        if (lnglatList.length > 18) {
          waypoints = lnglatList.splice(0, 17);
        } else {
          waypoints = lnglatList.splice(0, lnglatList.length - 1);
        }

        var start = waypoints.shift();
        var end = lnglatList[0];

        var driving = new AMap.Driving({
          map: this.amap,
          hideMarkers: true,
          autoFitView: false
        });
        driving.search(start, end, { waypoints: waypoints });
      }
    },
    // 清除地图覆盖物
    clear() {
      // 清除海量点标记
      var massMarkers = this.mapOverlaies.massMarkers;
      while (massMarkers.length != 0) {
        var mass = massMarkers.pop();
        mass.clear();
      }
      this.amap.clearMap();
    }
  },
  mounted() {}
};
</script>

<style>
.amap-wrapper {
  width: 100%;
  height: 200px;
  min-width: 100px;
  min-height: 100px;
}
.box-card {
  position: absolute;
  top: 0px;
  right: 0px;
}
</style>