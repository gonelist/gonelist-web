<template>
  <!-- <div class="player-content">
    <div class="player">
      <div class="close"><span @click="close"> 关闭</span></div>
      
    </div>
  </div> -->

  <div ref="dplayer"></div>
  
</template>
<script>
  import 'dplayer/dist/DPlayer.min.css';
  import DPlayer from 'dplayer';

  export default {
    data() {
      return {
        dp: null,
        options: {
          autoplay: false,
          theme: "#b7daff",
          loop: false,
          screenshot: false,
          hotkey: true,
          preload: 'auto',
          volume: 0.7
        }
      }
    },
    methods: {
      play(url) {
        console.log("现在播放：",url)
        this.dp = new DPlayer({
            container: this.$refs.dplayer,
            ...this.options,
            video: {
                url: url,
            }
        });
        this.dp.on('play', function () {
            console.log('playering');
        });
        this.dp.on('error',() => {
          this.close()
          alert('视频播放出错，请重试');
        });
        this.dp.play()
      },
      switch(url) {
        this.dp.switchVideo({
          url: url
        })
        this.dp.play()
      },
      close() {
        this.dp.pause()
        this.$emit("closeVideo")
      }
    }
  }

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
  position: fixed;
  left: 0;
  bottom: 0;
  width: 600px;
  height: 300px;
}
</style>