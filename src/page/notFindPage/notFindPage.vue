<template>
  <div id="notFindPage" class="notFindPage">
      <img src="@/static/image/v2_q1infu.png" alt="">
      <div class="txt">
          <h4>404</h4>
          <p>抱歉，你访问的页面不存在</p>
          <p>请联系上级领导，或反馈系统设计部</p>
      </div>
  </div>
</template>

<script>
export default {
    name: 'notFindPage',
    data() {
        return {}
    },
}

</script>

<style lang="scss">
.notFindPage{
    text-align: center;
    box-sizing: border-box;
    padding-top: 12%;
    .txt{
        margin: 70px 0 0 50px;
        display: inline-block;
        vertical-align: top;
        text-align: left;
        h4{
            font-size: 100px;
        line-height: 1;
        }
        p{
            margin-top: 40px;
            font-size: 20px;
            line-height: 1;
        }
    }
}
</style>
