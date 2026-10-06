<template>
  <div class="manage" id="newsDetail">
    <div class="common-info">
      <h3>{{ info.title }}</h3>
      <div class="date">{{ info.createDate }}</div>
      <div class="content" v-html="info.content"></div>
    </div>
  </div>
</template>
  
  <script>
import newsDetail from "./newsDetail.js";
export default newsDetail;
</script>
  <style lang="scss" scoped>
.manage {
  .common-info {
    width: 65vw;
    padding: 2vw 3vw;
    margin: 5vh auto;
    box-sizing: border-box;
    background: #fff;
    .nav {
      color: #999;
      font-size: 0.8vw;
      margin-bottom: 2vh;
      display: block;
      &:hover {
        text-decoration: underline;
        color: blue;
      }
    }
    h3 {
      font-weight: bold;
      font-size: 1.2vw;
      line-height: 1;
    }
    .date {
      font-size: 0.6vw;
      margin: 2vh 0;
      color: #999;
      line-height: 1;
    }
    /deep/ .content {
      img {
        max-width: 100%;
      }
      p {
        margin-bottom: 1vh;
      }
    }
  }
}
</style>