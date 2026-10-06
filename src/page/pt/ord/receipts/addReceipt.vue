<template>
    <div id="addReceipt" class="addReceiptPage">
      <div class="search-list clearfix">
        <div class="search-form clearfix">
          <div class="item">
            <label class="label">供应商名称</label>
            <div class="input-text">
              <el-input v-model="query.supplierName" placeholder="供应商名称" type="text"></el-input>
            </div>
          </div>
          <div class="item">
            <label class="label">客户名称</label>
            <div class="input-text">
              <el-input v-model="query.tenantName" placeholder="客户名称" type="text"></el-input>
            </div>
          </div>
          <div class="item">
            <label class="label">线路名称</label>
            <div class="input-text">
              <el-input v-model="query.routeName" placeholder="线路名称" type="text"></el-input>
            </div>
          </div>
          <div class="item">
            <label class="label">车牌号码</label>
            <div class="input-text">
              <el-input v-model="query.plateNumber" placeholder="订单号/客户单号" type="text"></el-input>
            </div>
          </div>
        </div>
        <div class="search-btn clearfix">
          <div class="btn">
            <el-button type="primary" plain size="mini" @click="doQuery" icon="el-icon-search">查询</el-button>
          </div>
          <div class="btn">
            <el-button type="danger" plain size="mini" @click="clear()" icon="el-icon-close">清空</el-button>
          </div>
        </div>
        <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
        <div class="search-bot">
          <img src="@/static/image/search-bot.png" alt="">
          <i class="icon el-icon-arrow-down"></i>
          <i class="icon el-icon-arrow-up"></i>
        </div>
      </div>
      <div class="common-info">
        <ul class="content clearfix" style="width:700px;margin:0 auto;">
          <img class="switch" src="@/static/image/switch.png" alt="" @click="doSwitch">
          <li class="item item100" :class="showSelect?'top':'bottom'">
            <label class="label-term"><em>*</em>派车单号</label>
            <div class="input-text">
              <el-select v-if="showSelect" v-model="receipts.waybillId" placeholder="请输入派车单号搜索" filterable clearable remote :remote-method="remoteSearchWaybill"
                         @change="changeWaybill" :disabled="isEditWaybill">
                <el-option v-for="item in waybillData" :key="item.waybillId" :label="item.waybillNum" :value="item.waybillId"></el-option>
              </el-select>
              <el-select v-if="!showSelect" v-model="receipts.waybillId" placeholder="请选择派车单号" clearable @change="changeWaybill(receipts.waybillId, true)" >
                <el-option v-for="item in waybillData" :key="item.waybillId" :label="item.waybillNum" :value="item.waybillId"></el-option>
              </el-select>

            </div>
          </li>
          <li class="item item100" :class="!showSelect?'top':'bottom'">
            <label class="label-term"><em>*</em>订单号</label>
            <div class="input-text">
              <el-select v-if="showSelect" v-model="receipts.orderId" placeholder="请选择订单号" clearable @change="changeWaybillOrder(receipts.orderId)" >
                <el-option v-for="item in orderData" :key="item.orderId" :label="item.orderNum" :value="item.orderId"></el-option>
              </el-select>
              <el-select v-if="!showSelect" v-model="receipts.orderId" placeholder="请输入订单号搜索" filterable clearable remote :remote-method="remoteSearchOrder"
                         @change="changeWaybillOrder(receipts.orderId, true)" :disabled="isEditOrder">
                <el-option v-for="item in orderData" :key="item.waybillId" :label="item.orderNum" :value="item.orderId"></el-option>
              </el-select>

            </div>
          </li>
          <li class="item item100">
            <label class="label-term">客户</label>
            <div class="input-text">
              <el-input v-model="receipts.tenantName" maxlength="100" placeholder="客户" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>作业点</label>
            <div class="input-text">
              <el-select v-model="receipts.waybillWorkId" placeholder="作业点" @change="changeWaybillWork" filterable clearable >
                <el-option v-for="item in waybillWorkData" :key="item.waybillWorkId"  :label="item.workName" :value="item.waybillWorkId"></el-option>
              </el-select>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term">详细地址</label>
            <div class="input-text">
              <el-input v-model="receipts.workAddressStr" maxlength="50" placeholder="详细地址" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>单据类型</label>
            <div class="input-text">
              <el-radio v-model="receipts.receiptsType" label="1">回单</el-radio>
              <el-radio v-model="receipts.receiptsType" label="2">过磅单</el-radio>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>单据图片</label>
            <div class="input-text">
              <myFileModel class="fl" ref="receiptsImg1"  @successCallback="setImgData" style="margin:0 10px 10px 0;"></myFileModel>
              <myFileModel class="fl" ref="receiptsImg2"  @successCallback="setImgData" style="margin:0 10px 10px 0;"></myFileModel>
              <myFileModel class="fl" ref="receiptsImg3"  @successCallback="setImgData" style="margin:0 10px 10px 0;"></myFileModel>
              <myFileModel class="fl" ref="receiptsImg4"  @successCallback="setImgData" style="margin:0 10px 10px 0;"></myFileModel>
              <myFileModel class="fl" ref="receiptsImg5"  @successCallback="setImgData" style="margin:0 10px 10px 0;"></myFileModel>
            </div>
          </li>
        </ul>
      </div>
      <div class="page-bot-btn ">
        <el-button size="mini" @click="changeReceiptsShow(false)">关闭</el-button>
        <el-button type="primary" size="mini" @click="addReceipts()">确定上传</el-button>
      </div>
  </div>
</template>

<script>
    import addReceipt from './addReceipt.js'

    export default addReceipt
</script>
<style lang="scss">
.addReceiptPage{
  .content{
    padding-top: 100px;
    position: relative;
    .switch{
      position: absolute;
      left: -15px;
      top: 30px;
      width: 30px;
      cursor: pointer;
    }
    .top,.bottom{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      transition: 0.5s all;
    }
    .bottom{
      top:50px;
    }
  }
  .myFileModel .avatar-uploader{
    .el-upload{
      width: 110px;
    }
    .avatar-uploader-icon{
      width: 110px;
    }
  }
}
</style>
