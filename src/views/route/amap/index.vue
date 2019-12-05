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
    </el-amap>
  </div>
</template>

<script>
import VueAMap from "vue-amap";
import PersonInfoWindow from "./components/infowindow/personinfowindow.vue";

// 引入高德地图
VueAMap.initAMapApiLoader({
  key: "be0033b34b86f49ed93917c0a16b1277",
  plugin: ["AMap.Scale", "AMap.OverView", "AMap.ToolBar", "AMap.MapType"],
  v: "1.4.4",
  uiVersion: "1.0.11"
});

export default {
  components: {
    PersonInfoWindow
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
                this.createSvgMarker(
                  {
                    store: {
                      lnglat: [121.59996, 31.197646]
                    },
                    color: "red"
                  },
                  "0"
                );
                let users = [
                  {
                    storecode: "H09100800343",
                    usercode: "S180713007",
                    visitdate: null,
                    storename: "济南华联超市经七路店",
                    storetype: "Super Low",
                    storeaddress: "济南市经七路槐荫广场地下",
                    rmnamecn: null,
                    srmnamecn: null,
                    latitude: null,
                    longitude: null,
                    lnglat: [116.982615, 36.655672]
                  },
                  {
                    storecode: "H09100900234",
                    usercode: "S180713007",
                    visitdate: null,
                    storename: "济南华联将军店",
                    storetype: "Super Low",
                    storeaddress: "济南市桑园路7号",
                    rmnamecn: null,
                    srmnamecn: null,
                    latitude: null,
                    longitude: null,
                    lnglat: [117.073683, 36.702219]
                  },
                  {
                    storecode: "H09100900248",
                    usercode: "S180713007",
                    visitdate: null,
                    storename: "济南华联华强店",
                    storetype: "Super Low",
                    storeaddress: "济南历城区山大路口西北角",
                    rmnamecn: null,
                    srmnamecn: null,
                    latitude: null,
                    longitude: null,
                    lnglat: [117.054341, 36.663559]
                  },
                  {
                    storecode: "H09101000653",
                    usercode: "S180713007",
                    visitdate: null,
                    storename: "济南华联超市解放东店",
                    storetype: "Super High",
                    storeaddress: "解放东路东段",
                    rmnamecn: null,
                    srmnamecn: null,
                    latitude: null,
                    longitude: null,
                    lnglat: [117.078962, 36.665701]
                  },
                  {
                    storecode: "H09101000968",
                    usercode: "S180713007",
                    visitdate: null,
                    storename: "济南华联超市大明店",
                    storetype: "CVS",
                    storeaddress: "济南市历下区明湖家具",
                    rmnamecn: null,
                    srmnamecn: null,
                    latitude: null,
                    longitude: null,
                    lnglat: [117.055685, 36.695629]
                  },
                  {
                    storecode: "H09101100229",
                    usercode: "S180713007",
                    visitdate: null,
                    storename: "济南华联超市经八路店",
                    storetype: "Super High",
                    storeaddress: "济南市中区经八路",
                    rmnamecn: null,
                    srmnamecn: null,
                    latitude: null,
                    longitude: null,
                    lnglat: [116.992093, 36.648682]
                  },
                  {
                    storecode: "H09101100237",
                    usercode: "S180713007",
                    visitdate: null,
                    storename: "济南华联超市舜耕店",
                    storetype: "Super High",
                    storeaddress: "济南市中区舜耕山庄",
                    rmnamecn: null,
                    srmnamecn: null,
                    latitude: null,
                    longitude: null,
                    lnglat: [117.023415, 36.636564]
                  },
                  {
                    storecode: "H09101100400",
                    usercode: "S180713007",
                    visitdate: null,
                    storename: "济南华联超市伟东新都店",
                    storetype: "Super High",
                    storeaddress:
                      "济南市中区八里洼5号伟东新都一区南门向东50米（舜耕路西100米）",
                    rmnamecn: null,
                    srmnamecn: null,
                    latitude: null,
                    longitude: null,
                    lnglat: [117.010382, 36.619868]
                  },
                  {
                    storecode: "H09101200139",
                    usercode: "S180713007",
                    visitdate: null,
                    storename: "济南华联超市药山店",
                    storetype: "Super High",
                    storeaddress: "济南天桥区药山",
                    rmnamecn: null,
                    srmnamecn: null,
                    latitude: null,
                    longitude: null,
                    lnglat: [116.974883, 36.710958]
                  },
                  {
                    storecode: "H09101200140",
                    usercode: "S180713007",
                    visitdate: null,
                    storename: "济南华联馆驿街店",
                    storetype: "Super High",
                    storeaddress: "济南市馆驿街",
                    rmnamecn: null,
                    srmnamecn: null,
                    latitude: null,
                    longitude: null,
                    lnglat: [117.007603, 36.666605]
                  },
                  {
                    storecode: "H17370102130099",
                    usercode: "S180713007",
                    visitdate: null,
                    storename: "济南华联超市黄金九九店",
                    storetype: "Super High",
                    storeaddress: "济南市历下区夜旅游路浆水泉路交叉路口西北角",
                    rmnamecn: null,
                    srmnamecn: null,
                    latitude: null,
                    longitude: null,
                    lnglat: [117.083139, 36.640554]
                  }
                ];
                this.createMassMarker({
                  users,
                  img: require("@/assets/markers/00baff.png")
                });
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
          open: () => {
            
          },
          close: () => {
            this.$set(this.infowindow, "visible", false);
          }
        }
      }
    };
  },
  methods: {
    infoWindowRender(h, node, instance) {
      return h(PersonInfoWindow, {
        props: {
          data: [
            {
              label: "SB",
              value: "范文龙"
            }
          ]
        }
      });
    },
    // 创建SvgMarker
    createSvgMarker(options, number) {
      let shape = new this.markerObject.SvgMarker.Shape["Circle"]({
        height: 17,
        fillColor: options.color
      });
      let setting = {
        map: this.amap,
        position: options.store.lnglat,
        iconLabel: {
          innerHTML: number,
          style: { top: "3px" }
        },
        extData: {
          store: options.store,
          routeNumber: options.routeNumber,
          sequence: options.index
        }
      };

      let svgMarker = new this.markerObject.SvgMarker(shape, setting);
      svgMarker.on("click", event => {
        this.$set(this.infowindow, "position", [
          event.lnglat.O,
          event.lnglat.P
        ]);
        this.$set(this.infowindow, "visible", true);
      });
      // 缓存 SvgMarker
      this.mapOverlaies.svgMarkers.push(svgMarker);
    },
    /**
     * 绘制海量点标记
     */
    createMassMarker(options) {
      let mass = new AMap.MassMarks(options.users, {
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
        this.$set(this.infowindow, "visible", true);
      });
      mass.setMap(this.amap);
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
      var massMarker = this.mapOverlaies.massMarker;
      while (massMarker.length != 0) {
        var mass = massMarker.pop();
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
  height: 500px;
  min-width: 500px;
  min-height: 500px;
}
</style>