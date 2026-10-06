<template>
  <div class="manage" id="questionDetail">
    <div class="common-info">
      <h3>{{info.name}}</h3>
      <div class="date">{{ info.createDate }}</div>
      <div class="content" v-html="info.answer"></div>
    </div>
  </div>
</template>
  
  <script>
  import questionDetail from './questionDetail.js'
  export default questionDetail
</script>
  <style lang="scss" scoped>
.manage {
  .common-info{
    h3{
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 10px;
      color: #333;
    }
    .date{
      font-size: 12px;
      margin-bottom: 20px;
      color: #999;
    }
    /deep/ .content{
      text-align: justify;
      color: #333;
      p{
        line-height:25px;
      }
      ol{
        padding-left: 12px;
        li{
          list-style-type:auto;
        }
      }
    }
  }
  
}
</style>