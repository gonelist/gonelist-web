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
        autoplay: false,
        theme: "#FADFA3",
        loop: "all",
        order: "random",
        preload: "auto",
        volume: 0.7,
        mutex: true,
        listFolded: false,
        listMaxHeight: 90
      }
    };
  },
  methods: {
    init() {
      this.closeNotice();
      this.ap = new APlayer({
        container: this.$refs.aplayer,
        ...this.options,
        audio: []
      });
    },
    updateList(list) {
      this.closeNotice();
      this.ap.list.clear();
      this.ap.list.add(list);
      this.ap.play();
    },
    play(index) {
      this.closeNotice();
      console.log(index);
      this.ap.list.switch(index);
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
  z-index: 100000000;
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
