<template>
  <!-- <div class="player-content">
        <div class="player">
          <div class="close"><span @click="close"> 关闭</span></div>

        </div>
      </div> -->

  <div ref="dplayer"></div>
</template>
<script>
import DPlayer from "dplayer";

export default {
  data() {
    return {
      dp: undefined,
      options: {
        autoplay: false,
        theme: "#b7daff",
        loop: false,
        screenshot: false,
        hotkey: true,
        preload: "auto",
        volume: 0.7
      },
      name: ""
    };
  },
  mounted() {
    if (!this.dp) {
      this.$nextTick(() => {
        this.dp = new DPlayer({
          container: this.$refs.dplayer,
          ...this.options,
          video: {
            type: "auto"
          }
        });
      });
    }
  },
  methods: {
    play(video) {
      console.log("现在播放：", video.playUrl);
      this.name = video.name;
      this.closeNotice();
      this.dp.switchVideo({
        url: video.playUrl
        // pic: 'second.png',
        // thumbnails: 'second.jpg',
      });
      this.$Notice.info({
        name: "video",
        title: "视频",
        //desc: `正在播放${audio.name}，点击右上角可关闭`,
        duration: 0,
        render: h => {
          return h("span", [
            "正在播放视频",
            h("strong", this.name),
            h(
              "p",
              {
                style: "paddingTop:10px"
              },
              "点击右上角可关闭"
            )
          ]);
        },
        onClose: () => {
          this.close();
        }
      });
      this.dp.on("error", () => {
        this.closeNotice();
        this.close();
        this.$Message.error("视频播放出错，请重试");
      });
      this.dp.play();
    },
    switch(video) {
      this.name = video.name;

      this.dp.switchVideo({
        url: video.playurl
      });
      this.play(video);
    },
    close() {
      this.closeNotice();
      this.dp.pause();
      //this.dp.destroy()
      this.$emit("closeVideo");
    },
    closeNotice() {
      this.$Notice.close("video");
    }
  }
};
</script>
<style>
/* .player-content {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9;
          background: rgba(128,128,128,0.48);
        }
        .player {
            width: 80%;
            height: 450px;
            position: absolute;
            left: 10%;
            top: 50%;
            margin: -225px 0 0 0;
        }
        .close {
          text-align: right;
          height:50px;
          box-sizing: border-box;
          line-height: 50px;
          font-weight: bold;
          font-size: 18px;
        }
        .close span {
          cursor: pointer;
        }
        .dplayer {
            height: 400px;
        } */
.dplayer {
  position: fixed !important;
  left: 0;
  bottom: 0;
  height: 300px;
  z-index: 10;
}

@media (max-width: 768px) {
  .dplayer {
    width: 100%;
  }
}

@media (min-width: 769px) {
  .dplayer {
    width: 600px;
  }
}
</style>
