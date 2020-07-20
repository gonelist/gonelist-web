<template>
  <div ref="aplayer"></div>
</template>
<script>
import "aplayer/dist/APlayer.min.css";
import APlayer from "aplayer";

export default {
  data() {
    return {
      ap: null,
      options: {
        mini: false,
        fixed: false,
        autoplay: false,
        theme: "#FADFA3",
        loop: "none",
        preload: "auto",
        volume: 0.7
      }
    };
  },
  methods: {
    play(audio) {
      console.log("现在播放：", audio);
      this.closeNotice();
      this.ap = new APlayer({
        container: this.$refs.aplayer,
        ...this.options,
        audio: [audio]
      });
      this.$Notice.info({
        name: "audio",
        title: "音频",
        //desc: `正在播放${audio.name}，点击右上角可关闭`,
        duration: 0,
        render: h => {
          return h("span", [
            "正在播放",
            h("strong", audio.fullName),
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
      this.ap.on("error", () => {
        this.closeNotice();
        this.$Message.error("音频播放出错，请重试");
        this.close();
      });
      this.ap.play();
    },
    switch(audio) {
      this.closeNotice();
      // this.ap.list.add(audio)
      // this.ap.seek(0)
      // this.ap.skipForward()
      // this.ap.list.remove(0)
      this.play(audio);
    },
    close() {
      this.closeNotice();
      this.ap.pause();
      this.$emit("closeAudio");
    },
    closeNotice() {
      this.$Notice.close("audio");
    }
  }
};
</script>
<style>
.aplayer {
  position: fixed;
  left: 0;
  bottom: 0;
}
@media (max-width: 768px) {
  .aplayer {
    width: 100%;
  }
}
@media (min-width: 769px) {
  .aplayer {
    width: 400px;
  }
}
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
    height: 200px;
    position: absolute;
    left: 10%;
    top: 50%;
    margin: -100px 0 0 0;
} */

/* .close {
  text-align: right;
  height:50px;
  box-sizing: border-box;
  line-height: 50px;
  font-weight: bold;
  font-size: 18px;
}
.close span {
  cursor: pointer;
} */
</style>
