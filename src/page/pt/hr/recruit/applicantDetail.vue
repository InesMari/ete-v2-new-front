<template>
  <div class="applicantDetail" id="applicantDetail">
    <div class="common-info flex">
      <h3 class="common-title"><span class="title-name">个人信息</span></h3>
      <ul class="content clearfix">
        <li class="item">
          <label class="label-term">姓名：</label>
          <div class="input-text">{{ info.userName }}</div>
        </li>
        <li class="item">
          <label class="label-term">手机号：</label>
          <div class="input-text">{{ info.billId }}</div>
        </li>
        <li class="item">
          <label class="label-term">邮箱：</label>
          <div class="input-text">{{ info.email }}</div>
        </li>
        <li class="item">
          <label class="label-term">目前所在城市：</label>
          <div class="input-text">{{ info.currentCity }}</div>
        </li>
        <li class="item">
          <label class="label-term">期望工作的城市：</label>
          <div class="input-text">{{ info.hopeWorkCity }}</div>
        </li>
      </ul>
      <h3 class="common-title"><span class="title-name">工作经历</span></h3>
      <div v-for="item in info.works">
        <ul class="content clearfix">
          <li class="item">
            <label class="label-term">公司名称：</label>
            <div class="input-text">{{ item.companyName }}</div>
          </li>
          <li class="item">
            <label class="label-term">时间：</label>
            <div class="input-text">{{ item.startDate }}至{{ item.endDate }}</div>
          </li>
          <li class="item">
            <label class="label-term">职务：</label>
            <div class="input-text">{{ item.positionName }}</div>
          </li>
          <li class="item item100">
            <label class="label-term">职务描述：</label>
            <div class="input-text">{{ item.positionDesc }}</div>
          </li>
        </ul>
      </div>
      <h3 class="common-title"><span class="title-name">项目经历</span></h3>
      <div v-for="item in info.projects">
        <ul class="content clearfix">
          <li class="item">
            <label class="label-term">项目名称：</label>
            <div class="input-text">{{ item.projectName }}</div>
          </li>
          <li class="item">
            <label class="label-term">时间：</label>
            <div class="input-text">{{ item.startDate }}至{{ item.endDate }}</div>
          </li>
        </ul>
        <ul class="content clearfix">
          <li class="item item100">
            <label class="label-term">职责描述：</label>
            <div class="input-text">{{ item.projectDesc }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
    
    <script>
import applicantDetail from "./applicantDetail.js";
export default applicantDetail;
</script>
<style lang="scss" scoped>
.applicantDetail {
  height: auto !important;
  /deep/ .common-info {
    .item{
      width: 33.333%;
      margin-right: 0;
      .label-term{
        width: 100px;
      }
      .input-text{
        word-break: break-all;
        padding:10px 0;
        line-height: 20px;
      }
    }
    .item100{
      width: 100%;
    }
  }
  .common-title{
    margin-bottom: 10px;
  }
}
</style>