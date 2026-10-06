<template>
  <div id="stockStorageManage">
    <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="stockStorageManageSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>在库管理列表-按库位</span>
          <el-tooltip effect="light" content="在库管理列表-按库位" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" v-entity="1005148" @click="showAllocat()">移库操作</el-button>
          <el-button type="primary" plain size="mini" v-entity="1005240" @click="freeze()">冻结操作</el-button>
          <el-button type="primary" plain size="mini" v-entity="1005219" @click="unfreeze()">解冻操作</el-button>
<!--          <el-button type="primary" plain size="mini" v-entity="1005118" @click="batchGenerateBar()">批量生成条码</el-button>-->
<!--          <el-button type="primary" plain size="mini" v-entity="1005119" @click="generateBar()">生成条码</el-button>-->
          <el-button type="primary" plain size="mini" v-entity="1005120" @click="viewQrcodeBars()">查看条码</el-button>
<!--          <el-button type="primary" plain size="mini" v-entity="1005125" @click="printQrcodeBars()">打印条码</el-button>-->
<!--          <el-button type="primary" plain size="mini" v-entity="1005116" @click="modify()">批次修改</el-button>-->
<!--          <el-button type="primary" plain size="mini" v-entity="1005188" @click="modify2()">生产日期修改</el-button>-->
          <el-button type="primary" plain size="mini" v-entity="1005036" @click="download">导出Excel</el-button>
            <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
        </div>
      </div>
      <tableCommon tableName="stockStorageManageTable" ref="table" :head="head" :showNum="true"
                   @dblclickItem="dbViewQrcodeBars"
                   :showSetTable="true" :single-select="false" >
        <template v-slot:default="{item, code}">
          <el-input v-model="item.sapStockNums" type="text" v-mydouble4val placeholder=""
                    @change="saveSapStockNums(item)" v-if="code=='sapStockNums'" ></el-input>
        </template>
      </tableCommon>
    </div>
    <el-dialog title="批次修改" :visible.sync="modifyDialogShow3" :close-on-click-modal="false" :close-on-press-escape="false" width="750px" @close="close3()">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item item50">
            <label class="label-term">批次号</label>
            <div class="input-text">
              <el-input v-model="info.batchNum"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">ASN</label>
            <div class="input-text">
              <el-input v-model="info.asn"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">供应商批次号</label>
            <div class="input-text">
              <el-input v-model="info.supplierBatchNum"></el-input>
            </div>
          </li>
        </ul>
        <div class="table-content">
          <div class="table-title">
            <h3>
              <span>已选择库存列表</span>
            </h3>
          </div>
          <tableCommon tableName="stockStorageManageTable2" ref="table2" :head="head" :showNum="true" :showSelect="false" :showSetTable="false" >
          </tableCommon>
        </div>

        <div class="page-bot-btn ">
          <el-button size="mini" @click="close3()">关闭</el-button>
          <el-button type="primary" size="mini" @click="save3()">提交</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="批次修改" :visible.sync="modifyDialogShow" :close-on-click-modal="false" :close-on-press-escape="false" width="750px" @close="close()">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item item50">
            <label class="label-term">物料编码</label>
            <div class="input-text">{{info.materialNum}}
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">所属货主</label>
            <div class="input-text">{{info.srcTenantName}}
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">到货厂商</label>
            <div class="input-text">{{info.fromTenantName}}
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">库区</label>
            <div class="input-text">{{info.reservoirName}}
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">库位</label>
            <div class="input-text">{{info.storageCode}}
            </div>
          </li>
          <!--          <li class="item item50">-->
          <!--            <label class="label-term">入库日期</label>-->
          <!--            <div class="input-text">{{info.inDate}}-->
          <!--            </div>-->
          <!--          </li>-->
          <li class="item item50">
            <label class="label-term">生产日期</label>
            <div class="input-text">{{info.produceDate}}
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">供应商批次号</label>
            <div class="input-text">
              <el-input v-model="info.supplierBatchNum"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">批次号</label>
            <div class="input-text">
              <el-input v-model="info.batchNum"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">ASN</label>
            <div class="input-text">
              <el-input v-model="info.asn"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>调整数量</label>
            <div class="input-text">
              <el-input v-model="info.stockNums" v-mydoubleval></el-input>
            </div>
          </li>
          <li class="item item50"  v-if="useSapStockNums">
            <label class="label-term"><em>*</em>调整SAP库存数量</label>
            <div class="input-text">
              <el-input v-model="info.sapStockNums" v-mydoubleval></el-input>
            </div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="close()">关闭</el-button>
          <el-button type="primary" size="mini" @click="saveBatchNumModfiy()">提交</el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog title="生产日期修改" :visible.sync="modifyDialogShow2" :close-on-click-modal="false" :close-on-press-escape="false" width="750px" @close="close2()">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item item50">
            <label class="label-term">物料编码</label>
            <div class="input-text">{{info.materialNum}}
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">所属货主</label>
            <div class="input-text">{{info.srcTenantName}}
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">到货厂商</label>
            <div class="input-text">{{info.fromTenantName}}
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">库区</label>
            <div class="input-text">{{info.reservoirName}}
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">库位</label>
            <div class="input-text">{{info.storageCode}}
            </div>
          </li>
<!--          <li class="item item50">-->
<!--            <label class="label-term">入库日期</label>-->
<!--            <div class="input-text">{{info.inDate}}-->
<!--            </div>-->
<!--          </li>-->
          <li class="item item50">
            <label class="label-term">供应商批次号</label>
            <div class="input-text">{{info.supplierBatchNum}}
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">批次号</label>
            <div class="input-text">{{info.batchNum}}
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">ASN</label>
            <div class="input-text">{{info.asn}}
            </div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>调整数量</label>
            <div class="input-text">{{info.stockNums}}
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">生产日期</label>
            <div class="input-text">
              <el-date-picker @input="$forceUpdate()" v-model="info.produceDate" type="date"
                              placeholder="选择日期" align="right"
                              format="yyyy-MM-dd" value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="close2()">关闭</el-button>
          <el-button type="primary" size="mini" @click="save2()">提交</el-button>
        </div>
      </div>
    </el-dialog>


    <el-dialog class="dialog" title="移库操作" :visible.sync="dialogShow" width="70%"
               :close-on-click-modal="false" :close-on-press-escape="false" @close="showDialog(false)">
      <div  class="table_height orderInfo">
        <div class="common-info" style="border:none;padding:0;margin-top: -15px;">
          <ul class="content clearfix">
            <li class="item item50">
              <label class="label-term">物料编码：</label>
              <div class="input-text">{{allocatInfo.materialNum}}</div>
            </li>
            <li class="item item50">
              <label class="label-term">所属货主：</label>
              <div class="input-text">{{allocatInfo.srcTenantName}}</div>
            </li>
          </ul>
          <ul class="content clearfix">
            <li class="item item50">
              <label class="label-term">到货厂商：</label>
              <div class="input-text">{{allocatInfo.fromTenantName}}</div>
            </li>
            <li class="item item50">
              <label class="label-term">批次号：</label>
              <div class="input-text">{{allocatInfo.batchNum}}</div>
            </li>
          </ul>
          <ul class="content clearfix">
            <li class="item item50">
              <label class="label-term">原库区：</label>
              <div class="input-text">{{allocatInfo.reservoirName}}</div>
            </li>
            <li class="item item50">
              <label class="label-term">原库位：</label>
              <div class="input-text">{{allocatInfo.storageCode}}</div>
            </li>
          </ul>
          <ul class="content clearfix">
            <li class="item item50">
              <label class="label-term">供应商批次号：</label>
              <div class="input-text">{{allocatInfo.supplierBatchNum}}</div>
            </li>
            <li class="item item50">
              <label class="label-term">是否扫码：</label>
              <div class="input-text">{{allocatInfo.scanQrcodeName}}</div>
            </li>
          </ul>
          <ul class="content clearfix">
            <li class="item item50">
              <label class="label-term">库存数量：</label>
              <div class="input-text">{{allocatInfo.stockNums}}</div>
            </li>
            <li class="item item50" v-if="useSapStockNums">
              <label class="label-term">SAP库存数量：</label>
              <div class="input-text">{{allocatInfo.sapStockNums}}</div>
            </li>
          </ul>
        </div>
        <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
          <thead>
          <tr>
            <th width="60">序号</th>
            <th width="80"><em>*</em>新库区</th>
            <th width="80"><em>*</em>新库位</th>
            <th width="80"><em>*</em>移库数量</th>
            <th width="80" v-if="useSapStockNums"><em>*</em>SAP移库数量</th>
            <th width="80">移库托数</th>
            <th width="80">是否冻结</th>
            <th width="150">备注</th>
            <th width="50" v-show="allocatInfo.scanQrcode==0&&allocatInfo.newScanQrcode==0">
              <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
                <span @click="add()" class="add"></span>
              </el-tooltip>
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in allocatInfo.items">
            <td>{{index+1}}</td>
            <td>
              <el-select v-model="item.toReservoirId" @change="loadStorageListByReservoirId(item)" filterable clearable placeholder="请选择新库区">
                <el-option v-for="data in newReservoirList" :key="data.reservoirId" :label="data.reservoirName" :value="data.reservoirId"/>
              </el-select>
            </td>
            <td>
              <el-select v-model="item.toStorageId" @change="forceUpdate" filterable clearable placeholder="请选择新库位">
                <el-option v-for="data in item.newStorageList" :key="data.storageId" :label="data.storageCode" :value="data.storageId"/>
              </el-select>
            </td>
            <td>
              <el-input v-model="item.nums" type="text" v-mydouble4val placeholder="请输入移库数量" @input="forceUpdate" :disabled="allocatInfo.scanQrcode==1||allocatInfo.newScanQrcode==1"></el-input>
            </td>
            <td v-if="useSapStockNums">
              <el-input v-model="item.sapNums" type="text" v-mydouble4val placeholder="请输入SAP移库数量" @input="forceUpdate" :disabled="allocatInfo.scanQrcode==1||allocatInfo.newScanQrcode==1"></el-input>
            </td>
            <td>
              <el-input v-model="item.palletNums" type="text" v-mydouble4val placeholder="请输入移库托数" @input="forceUpdate" ></el-input>
            </td>
            <td>
              <div class="switchDiv">
                <el-switch v-model="item.freezeState == 1" @change="changeSwitch(item)" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                <span class="name">{{item.freezeState == 1 ? "是" : "否"}}</span>
              </div>
            </td>
            <td>
              <el-input v-model="item.remark" type="text" maxlength="200" placeholder="请输入移库备注"  @input="forceUpdate" ></el-input>
            </td>
            <td v-show="allocatInfo.scanQrcode==0&&allocatInfo.newScanQrcode==0">
              <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000' v-show="index>0">
                <span @click="remove(index)" class="del"></span>
              </el-tooltip>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="bot-btn">
        <el-button size="mini" @click="dialogShow=false">关闭</el-button>
        <el-button size="mini" type="primary" @click="sureRecord">确定移库</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import stockStorageManage from './stockStorageManage.js'
export default stockStorageManage
</script>

<style lang="scss">
#stockStorageManage{
  .dialog{
    .common-info .content > .item .label-term{
      width: 90px;
    }
    .common-info .content > .item .input-text{
      width: calc(100% - 100px);
    }
    .tableCommon{
      table-layout: fixed;
      .el-input__inner{
        text-align: center;
      }
      .el-date-editor.el-input{
        width: 100%;
      }
    }
    .add{
      vertical-align: middle;
      @include add;
    }
    .del{
      vertical-align: middle;
      @include del;
    }
    .switchDiv {
      padding: 2px 8px;
      border: 1px solid $main-color;
      border-radius: 3px;
      color: $main-color;
      display: inline-block;
      margin-left: 10px;
      vertical-align: top;
      cursor: pointer;

      .name {
        vertical-align: middle;
        margin-left: 8px;
      }

      // &:hover{
      //   color: #fff;
      //   background: $main-color;
      // }
    }
  }
}
</style>
