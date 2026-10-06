<template>
  <div id="ownVehicleCheckDetail">
    <div class="common-info flex" id="printTable" style="padding:0 0 50px;position:relative;">
      <div style="text-align: center;font-weight: bold;font-size: 16px;line-height:70px;">
        <img style="height: 50px;position: absolute;left: 10px;top: 10px;" src="@/static/image/logo.png">自有车辆点检表
      </div>
      <div class="baseTitle"></div>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" class="fillTable" style="margin-bottom: 10px;">
        <tr>
          <td style="width:90px;" class="label">派车单号</td>
          <td class="value">{{ info.waybillNum }}</td>
          <td style="width:90px;" class="label">提交时间</td>
          <td class="value">{{ info.startSubmitDate }}-{{ info.endSubmitDate }}</td>
          <td style="width:90px;" class="label">提交人</td>
          <td class="value">{{ info.createUserName }}</td>
        </tr>
        <tr>
          <td class="label">线路名称</td>
          <td class="value">{{ info.routeName }}</td>
          <td class="label">车头号码</td>
          <td class="value">{{ info.plateNumber }}</td>
          <td class="label">挂车号码</td>
          <td class="value">{{ info.trailerNumber }}</td>
        </tr>
        <tr>
          <td class="label">出车公里数(KM)</td>
          <td class="value">{{ info.startMileage }}</td>
          <td class="label">收车公里数(KM)</td>
          <td class="value">{{ info.endMileage }}</td>
          <td class="label">本单运输里程</td>
          <td class="value">{{ info.mileage }}</td>
        </tr>
        <tr>
          <td class="label">是否有异常</td>
          <td class="value">{{ info.haveErrorName }}</td>
          <td class="label">点检状态</td>
          <td class="value">{{ info.stateName }}</td>
          <td class="label">备注</td>
          <td class="value">{{ info.startSubmitRemark }}。{{ info.endSubmitRemark }}</td>
        </tr>
      </table>
      <div class="filter-buttons" style="text-align: right; margin-bottom: 10px;" v-if="type != 3">
        <el-radio-group v-model="filterType" size="small" @change="setFilter">
          <el-radio-button label="all">显示所有</el-radio-button>
          <el-radio-button label="error">显示异常</el-radio-button>
        </el-radio-group>
      </div>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" class="fillTable">
        <tr>
          <td style="width:100px" class="label">出车前点检项目</td>
          <td style="width:200px" class="label">要求</td>
          <td style="width:50px" class="label">检查结果</td>
          <td style="width:50px" class="label">异常图片</td>
        </tr>
        <tr v-for="item in filteredStartCheckList" :key="item.id">
          <td class="label">{{ item.itemName }}</td>
          <td class="value" v-html="item.requirements"></td>
          <td class="value" :style="item.checkState == 0 ? 'color:red!important' : ''">{{ item.checkStateName }}</td>
          <td class="value">
            <a href="javascript:void(0);" v-if="item.fileUrl" class="link" @click.stop="showImg(item.fileUrl)"
              style="margin: 0 10px;">查看</a>
          </td>
        </tr>
      </table>
      <table width="100%" border="0" cellspacing="0" cellpadding="0" class="fillTable" style="margin-top: 10px;">
        <tr>
          <td style="width:100px" class="label">收车后点检项目</td>
          <td style="width:200px" class="label">要求</td>
          <td style="width:50px" class="label">检查结果</td>
          <td style="width:50px" class="label">异常图片</td>
        </tr>
        <tr v-for="item in filteredEndCheckList" :key="item.id">
          <td class="label">{{ item.itemName }}</td>
          <td class="value" v-html="item.requirements"></td>
          <td class="value" :style="item.checkState == 0 ? 'color:red!important' : ''">{{ item.checkStateName }}</td>
          <td class="value">
            <a href="javascript:void(0);" v-if="item.fileUrl" class="link" @click.stop="showImg(item.fileUrl)"
              style="margin: 0 10px;">查看</a>
          </td>
        </tr>
      </table>

      <ul class="content clearfix mt_20">
        <li class="item" v-if="info.startMileageFileUrl && type != 3">
          <label class="label-term">里程表图片（出车）：</label>
          <div class="input-text">
            <img @click="showImg(info.startMileageFileUrl)" :src="info.startMileageFileUrl" alt="">
          </div>
        </li>
        <li class="item" v-if="info.endMileageFileUrl && type != 3">
          <label class="label-term">里程表图片（收车）：</label>
          <div class="input-text">
            <img @click="showImg(info.endMileageFileUrl)" :src="info.endMileageFileUrl" alt="">
          </div>
        </li>
      </ul>

      <h3 class="common-title" v-if="info.state != 0">
        <span class="title-name">确认或处理情况</span>
      </h3>
      <div class="remarkView" v-if="type == 1">
        <div class="radioView" v-if="info.haveError == 1">
          <el-radio-group v-model="radioState" :disabled="disabledRadio">
            <el-radio :label="1">待跟进</el-radio>
            <el-radio :label="2">已处理</el-radio>
          </el-radio-group>
        </div>
        <el-input class="remarkInput" type="textarea" v-model="remarkInput" placeholder="请输入备注"></el-input>
      </div>
      <div class="logs" v-if="type == 2 || type == 3">
        <div class="item" v-for="(item, index) in info.logs">
          <div class="stepNum">{{ index + 1 }}</div>
          <div class="text">{{ item.stateName }} {{ item.date }}</div>
          <div class="text">{{ item.remark }}</div>
          <div class="text">操作人：{{ item.userName }}</div>
        </div>
      </div>
    </div>


    <div class="bot-btn">
      <el-button type="default" @click="closePage()">关闭</el-button>
      <el-button type="primary" v-if="type == 1" @click="reviewById()">提交</el-button>
      <el-button type="primary" v-if="type == 3" @click="print">打印</el-button>
    </div>

    <!-- 查看大图 -->
    <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
  </div>
</template>

<script>
import ownVehicleCheckDetail from './ownVehicleCheckDetail.js'
export default ownVehicleCheckDetail
</script>
<style lang="scss" scoped>
#ownVehicleCheckDetail {
  padding-bottom: 50px;
  height: auto;

  .filter-buttons {
    margin: 10px 0;

    .el-radio-group {
      margin-right: 10px;
    }
  }

  .fillTable {
    table-layout: fixed;

    td {
      padding: 3px 10px;

      &.label {
        background: #f2f2f2;
        color: #333;
      }

      &.value {
        color: #333;
      }
    }
  }

  .baseTitle {
    text-align: center;
    line-height: 45px;
    color: #333;
    font-size: 14px;
    font-weight: bold;
  }

  .common-info .content>.item {
    align-items: center;

    .label-term {
      width: 160px;
      display: flex;
    }

    .input-text {
      img {
        width: 100%;
        max-width: 150px;
        cursor: pointer;
      }
    }
  }

  .remarkView {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;

    .radioView {
      width: 180px;
    }

    .remarkInput {
      flex: 1;
    }
  }

  .logs {
    display: flex;
    padding: 20px;

    .item {
      width: 200px;
      margin-right: 10px;
      position: relative;

      .stepNum {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 1px solid #000;
        text-align: center;
        line-height: 30px;
        margin-right: 10px;
        margin-bottom: 14px;
        font-size: 14px;
        font-weight: bold;
        background: #fff;
        position: relative;
        z-index: 9;
      }

      .text {
        line-height: 25px;
      }

      &:last-child {
        .stepNum {
          color: #67C23A;
          border-color: #67C23A;
        }

        &::before {
          display: none;
        }
      }

      &::before {
        content: '';
        position: absolute;
        top: 15px;
        left: 0;
        display: block;
        width: calc(100% + 20px);
        height: 2px;
        background: #bfbfbf;
      }
    }
  }
}
</style>