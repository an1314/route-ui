<template>
  <div id="app">
    <div class="amap-wrapper">
      <el-amap
        vid="amapDemo"
        ref="amap"
        :center="map.center"
        :map-manager="amapManager"
        :zoom="map.zoom"
        :events="map.events"
        class="amap-demo"
      >
        <!-- 信息窗体 -->
        <el-amap-info-window
          :position="infowindow.position"
          :content="infowindow.content"
          :visible="infowindow.visible"
          :events="infowindow.events"
        ></el-amap-info-window>
      </el-amap>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      amapManager: this.amapManager(),
      // 地图相关信息
      map: {
        zoom: 12,
        center: [121.59996, 31.197646],
        mapStyle: 'light',
        events: {
          init: (map)=> {
            var amap = this.$refs.amap.$$getInstance(); 
            amap.setMapStyle("amap://styles/grey")
            AMapUI.loadUI(["overlay/SimpleMarker"], function(SimpleMarker) {
              const marker = new SimpleMarker({
                iconLabel: "A",
                iconStyle: "red",
                map: map,
                position: map.getCenter()
              });
            });
          }
        }
      },
      // 信息窗体相关信息
      infowindow:{
        position: [121.59996, 31.197646],
        content: "vue-amap向你问好！",
        visible: true,
        events:{
          open: () => {
            setTimeout(() => {
              this.$set(this.infowindow, 'visible', false)
            }, 1000)
            
          }
        }
      },

    };
  },
  mounted() {}
};
</script>

<style>
.amap-wrapper {
  width: 500px;
  min-width: 500px;
  height: 500px;
  min-height: 500px;
}
</style>