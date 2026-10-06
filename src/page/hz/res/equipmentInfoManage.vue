<template>
    <div id="hzEquipmentInfoManage" class="hzEquipmentInfoManagePage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="hzEquipmentInfoManageSearch"></searchList>
        <!--        设备列表        -->
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>设备列表</span>
                    <el-tooltip effect="light" content="设备列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
            </div>
            <tableCommon tableName="hzEquipmentInfoManageTable" ref="table" :head="head" :single-select="true" :showNum="true" :showSetTable="true">
              <template v-slot:default="{item}">
                <a href="javascript:void(0);" class="link" @click.stop="toMonitor(item)" style="margin: 0 10px;">查看位置</a>
              </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
    import equipmentInfoManage from './equipmentInfoManage.js'
    export default equipmentInfoManage
</script>
<style lang="scss">
.hzEquipmentInfoManagePage{
  .search-form {
    .item {
      .el-textarea__inner {
        height: 30px;
        border:none;
        resize: none;
        line-height: 20px;
        &::placeholder{
          font-size: 12px;
          line-height: 24px;
        }
      }
    }
  }
  .equipmentFocus{
    position: relative;
    z-index: 99;
    .el-textarea__inner {
      height: 60px!important;
      border: 1px solid #DCDFE6!important;
      box-sizing: border-box;
    }
  }
  // 子锁清单
  .lockDialog{
    .lockList{
      text-align: center;
      .item{
        display: inline-block;
        width: 200px;
        margin-bottom: 15px;
        .lockIcon{
          cursor: pointer;
          margin:0 auto;
          width: 95px;
          height: 95px;
          border-radius: 50%;
          border:1px solid #ccc;
          text-align: center;
          box-sizing: border-box;
          padding-top: 12px;
          .rotate{
            animation:rotateAnim 1s linear infinite;
          }
        }
        .name{
          padding-left: 27px;
          text-align: left;
          .el-input{
            display: inline-block;
            width: 100px;
            .el-input__inner{
              border:none;
              line-height: 28px;
              padding:0 3px;
              height: 28px;
            }
          }
        }
        .num{
          padding-left: 27px;
          text-align: left;
        }
      }
    }
  }
  @keyframes rotateAnim{
    0%{-webkit-transform:rotate(0deg);}
    25%{-webkit-transform:rotate(-90deg);}
    50%{-webkit-transform:rotate(-180deg);}
    75%{-webkit-transform:rotate(-270deg);}
    100%{-webkit-transform:rotate(-360deg);}
  }
}
</style>
