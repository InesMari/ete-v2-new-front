<template>
  <div id="exceptionPrint">
    <div class="common-info">
      <div id="printTable">
        <div class="topView">
          <img class="logo" src="@/static/image/logo.png" alt="" />
          <div class="num">表单号：{{ info.exceptionNum }}</div>
        </div>
        <div class="table-view">
          <div class="table-title">异常速报书</div>
          <div class="item spec">
            <div class="title">1、发生时间</div>
            <div class="text">{{ info.incidentDate }}</div>
          </div>
          <div class="item spec">
            <div class="title">2、发生地点</div>
            <div class="text">{{ info.incidentAddress }}</div>
          </div>
          <div class="item spec">
            <div class="title">3、产生后果</div>
            <div class="text">
              {{ info.party }}
            </div>
          </div>
            <div class="item spec">
                <div class="title">4、当事人</div>
                <div class="text">
                    {{ info.discoverer }}
                </div>
            </div>
          <div class="item">
            <div class="title">5、异常事故描述及损失情况（包含人员受伤、物品损失等）：</div>
            <div class="text" style="min-height: 30px;">{{ info.incidentProcess }}</div>
          </div>

            <div class="item">
                <div class="title">6、问题描述：</div>
                <div class="text" style="min-height: 30px;">{{ info.problemDescribe }}</div>
            </div>

          <div class="item">
            <div class="title">7、异常事故现场图片：</div>
            <div class="img-view">
              <img class="img" :src="item.fileUrl" v-for="(item, index) in imgList" :key="index" />
            </div>
          </div>
          <div class="item">
            <div class="title">8、现场应急处理措施</div>
            <div class="text" style="min-height: 30px;">{{ info.emergencyTreatment }}</div>
          </div>
          <div class="item">
            <div class="title">9、请求协助内容：</div>
            <div class="text" style="min-height: 30px;">{{ info.assistContent }}</div>
          </div>
          <div class="item">
            <div class="title">10、现场是否向保险公司报案：</div>
            <div class="text">
              <div class="sure">
                <input type="checkbox" :checked="info.whetherReport == 1" style="margin-right: 10px;pointer-events: none;">是
                <span style="margin-left: 40px;">保险种类：{{ info.insureClass }}</span>
                <span style="margin-left: 15px;">报案号：{{ info.reportNum }}</span>
              </div>
              <input type="checkbox" :checked="info.whetherReport == 0" style="margin-right: 10px;">否
            </div>
          </div>
        </div>
        <div class="sign">
          <div>当事人签名：<span class="line"></span></div>
          <div>部门主管签名：<span class="line"></span></div>
          <div>部门经理签名：<span class="line"></span></div>
        </div>
        <div class="tip">注：异常事故上报书在事发后1小时内在“异常中心”上报异常；纸质异常事故上报书须在24小时内经当事人、仓库主管、部门经理签名确认并提交至公司安委办(总部安全管理)存档。</div>
      </div>
      <div class="bot-btn">
        <el-button type="primary" @click="print">打印</el-button>
      </div>
    </div>
  </div>
</template>
    
<script>
import exceptionPrint from './exceptionPrint.js'
export default exceptionPrint
</script>
<style lang="scss" scoped>
#exceptionPrint {
  height: auto !important;
  ;

  /deep/ .common-info {}

  .topView {
    position: relative;
    margin-bottom: 10px;

    .logo {
      height: 50px;
    }

    .num {
      position: absolute;
      bottom: 10px;
      right: 0;
      font-size: 14px;
      font-weight: bold;
      color: #000;
    }
  }

  .table-view {
    border: 1px solid #000;

    .table-title {
      line-height: 50px;
      font-size: 18px;
      text-align: center;
      font-weight: bold;
      border-bottom: 1px solid #000;
      color: #000;
    }

    .item {
      border-bottom: 1px solid #000;

      &:last-child {
        border: none;
      }

      .title {
        line-height: 35px;
        padding-left: 20px;
        font-size: 14px;
        color: #000;
        font-weight: bold;
      }

      .text {
        font-size: 14px;
        color: #000;
        line-height: 25px;
        padding: 0 20px 10px;

        .sure {
          font-size: 14px;
          color: #000;

          span {
            display: inline-block;
            min-width: 40%;
          }
        }
      }

      .img-view {
        padding: 10px 20px;

        img {
          margin-right: 10px;
          width: 120px;
          height: 120px;
        }
      }

      &.spec {
        display: flex;

        .title {
          width: 100px;
          border-right: 1px solid #000;
        }

        .text {
          flex: 1;
          padding-left: 20px;
          font-size: 14px;
          line-height: 35px;
          padding: 0 0 0 20px;
        }
      }
    }
  }

  .sign {
    display: flex;
    margin: 10px 0;

    div {
      line-height: 35px;
      font-size: 14px;
      color: #000;
      flex: 1;
    }
  }

  .tip {
    color: #000;
    font-size: 14px;
  }
}</style>