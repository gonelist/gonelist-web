<template>
  <div id="footer">
    <span>
      Powered by
      <a :href="versionUrl"
        >GONEList <b>{{ version }}</b></a
      >
      | Theme —
      <a href="https://github.com/Sillywa/gonelist-web">GONEList-web</a>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    version: String
  },
  computed: {
    versionUrl() {
      return (
        "https://github.com/gonelist/gonelist/releases/tag/" + this.version
      );
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less">
#footer {
  margin: 20px 0;
  text-align: center;

  a {
    text-decoration: none;
    border-bottom: 1px solid #999;
    color: #555;
    word-wrap: break-word;
    outline: none;
    font-weight: bold;
  }
}
</style>
