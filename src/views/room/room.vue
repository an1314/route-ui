<template>
  <div>
    <el-container style="height:100vh">
      <el-aside width="200px">人员信息框</el-aside>
      <el-container>
        <el-header>头部</el-header>
        <el-main>
          <el-row style="height:65%">
            <p v-for="(messageObj, index) in messageList" :key="index">
              <label>{{messageObj.fromUserId}}:</label>
              <label>{{messageObj.message}}</label>
            </p>
          </el-row>
          <el-row style="height:35%; background-color:red">
            <el-input v-model="message" type="textarea" :row="4"></el-input>
            <el-button @click="sendMessage">提交1c</el-button>
          </el-row>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "room",
  data() {
    return {
      userId: null,
      messageList: [],
      message: "",
      ws: null
    };
  },
  methods: {
    sendMessage() {
      let message = {
        toUserId: this.userId == "2" ? "1" : "2",
        message: this.message,
        fromUserId: this.userId
      };
      this.messageList.push(message);
      if (this.ws) this.ws.send(JSON.stringify(message));
      this.message = "";
    }
  },
  mounted() {
    let userId = this.$route.query.userId;
    if (userId) {
      this.userId = userId;
      var ws = new WebSocket(`ws://192.168.2.92:8080/imserver/${userId}`);

      ws.onopen = function(evt) {
        alert(`用户${userId}连接成功`);
      };

      ws.onmessage = event => {
        if (typeof event.data === "string") {
          try {
            let message = JSON.parse(event.data);
            this.messageList.push(message);
          } catch (e) {
            alert("信息解析出错");
          }
        }
      };

      //[【于指定连接关闭后的回调函数。】
      ws.onclose = function(evt) {
        //console.log("Connection closed.");
      };

      this.ws = ws;
      //发送文本
    }
  }
};
</script>