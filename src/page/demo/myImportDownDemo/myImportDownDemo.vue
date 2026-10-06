<template>
    <div class="videoDemo" id="videoDemo">                            
      <el-dialog title="预算数据导入" :visible.sync="showModify" :close-on-click-modal="false" :close-on-press-escape="false" width="620px" @close="showModifyDialog(false)">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item50">
              <label class="label-term"><em>*</em>车牌所在列</label>
              <div class="input-text">
                <el-input type="number" v-model="importInfo.plateNumberIndex" placeholder="请输入"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">目的地所在列</label>
              <div class="input-text">
                <el-input type="number" v-model="importInfo.addressStrIndex" placeholder="请输入"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>车辆位置写入列</label>
              <div class="input-text">
                <el-input type="number" v-model="importInfo.gpsLocationIndex" placeholder="请输入"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>距离目的地写入列</label>
              <div class="input-text">
                <el-input type="number" v-model="importInfo.distanceIndex" placeholder="请输入"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>预计到达时间写入列</label>
              <div class="input-text">
                <el-input type="number" v-model="importInfo.durationIndex" placeholder="请输入"></el-input>
              </div>
            </li>
            <li class="item item100" style="margin-top:10px;">
              <label class="label-term"><em>*</em>上传数据</label>
              <div class="input-text">              
                <myImportDown ref="myBudgetImport" :handle-success="myImportBudgetCallback" :param="importInfo" :noneDialog="true" title="上传excel"
                    bean="sinoiovBusinessTF" method="importVehiclePositionExcel" downMethod="exportVehiclePositionExcelResult" :show-file-list="false"></myImportDown>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="showModifyDialog(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="saveReovery()">确定</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
  </template>
    
<script>  
import myImportDown from '@/components/myImportDown/myImportDown.vue';
export default{
    name: "myImportDownDemo",
    components: {
        myImportDown
    },
    data() {
        return {
            importInfo:{},
            showModify:true,
        };
    },
    mounted() {
        
    },
    methods: {        
        myImportBudgetCallback() {
            this.$message.success("上传成功");
        },
        showModifyDialog(tag){
            this.showModify = tag;
        },
    }
    
}
</script>
<style lang="scss" scoped>
    
  </style>