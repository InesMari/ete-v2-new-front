<template>
    <div class="recruitDetail" id="recruitDetail">
      <div class="common-info flex">
        <!-- 职位、薪资 -->
        <div class="title">{{ info.positionName }}<span class="salary">{{ info.salary }}</span></div>
        <!-- 标签 -->
        <div class="tag clearfix"><span v-for="item in info.tagArray ">{{ item }}</span></div>
        <h3>职位描述：</h3>
        <div class="dec" v-html="info.positionDesc"></div>
        <h3>任职要求：</h3>
        <div class="dec" v-html="info.requirementDesc"></div>
        <h3>工作城市：</h3>
        <div class="dec">{{ info.workCity }}</div>
        <h3>工作地址：</h3>
        <div class="dec">{{ info.workAddress }}</div>
      </div>
    </div>
  </template>
    
    <script>
    import recruitDetail from './recruitDetail.js'
    export default recruitDetail
  </script>
<style lang="scss" scoped>
  .recruitDetail {
    height: auto!important;
    /deep/ .common-info{
      height: 100%;
      padding: 30px 50px;
      box-sizing: border-box;
      /deep/ .item{
        .label-term{
          width: 120px;
        }
        .input-text{
          line-height: 20px;
          padding: 10px 0;
        }
      }
      .title{
        color: #333;
        font-size: 20px;
        font-weight: bold;
        line-height: 28px;
        .salary{
          color: orange;
          margin-left: 30px;
          vertical-align: middle;
        }
      }
      .tag{
        margin-top: 5px;
        span{
          margin-right: 8px;
          font-size: 14px;
          color: #666;
          line-height: 20px;
          float: left;
          padding: 4px 12px;
          white-space: nowrap;
          background: #f8f8f8;
          border-radius: 4px;
        }
      }
      h3{
        color: #333;
        font-size: 14px;
        font-weight: bold;
        line-height: 28px;
        margin-top: 20px;
      }
      .dec{
        color: #333;
        line-height: 28px;
        font-size: 14px;
        p{
          font-size: 14px;
          color: #333;
        }
      }
    }
  }
  </style>