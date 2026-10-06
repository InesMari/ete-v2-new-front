<template>
    <div id="addShareholder" class="addShareholderPage">
      <div class="common-info">
        <div class="clearfix">
        <div class="ipt-info fl">
          <ul class="content clearfix">
            <li class="item">
              <label class="label-term"><em>*</em>股东名称</label>
              <div class="input-text">
                <el-input v-model="info.tenantName" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>股东简称</label>
              <div class="input-text">
                <el-input v-model="info.abbreviationName" maxlength="5" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>股东管理员</label>
              <div class="input-text">
                <el-input v-model="info.linkman" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>股东管理员账号</label>
              <div class="input-text">
                <el-input v-model="info.linkPhone" placeholder="手机号码或者邮箱" :disabled="isLock"></el-input>
              </div>
            </li>

            <li class="item">
              <label class="label-term"><em>*</em>股东类型</label>
              <div class="input-text">
                <el-select v-model="info.shareholderType" clearable filterable placeholder="请选择" :disabled="isLock">
                  <el-option v-for="item in shareholderTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>地址</label>
              <div class="input-text">
                <el-input v-model="info.address" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>所属中心</label>
              <div class="input-text">
                <el-select v-model="info.orgIds" clearable filterable multiple placeholder="请选择" :disabled="isLock">
                  <el-option
                      v-for="item in orgData"
                      :key="item.id"
                      :label="item.orgName"
                      :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </li>
          </ul>
        </div>
        </div>
      <div class="bot-btn">
        <el-button @click="closeAddShareholder()">关闭</el-button>
        <el-button type="primary" @click="addShareholder()" v-if="!isLock && !isUpdate">确定新增</el-button>
        <el-button type="primary" @click="addShareholder()" v-if="!isLock && isUpdate">确定修改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
    import addShareholder from './addShareholder.js'

    export default addShareholder
</script>
<style lang="scss" scoped>
.addShareholderPage{
    /deep/ .common-info{
        .content > .item .label-term {
            float: left;
            width: 100px;
            height: 40px;
            padding-right: 10px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            display: -webkit-flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: end;
            -ms-flex-pack: end;
            justify-content: flex-end;
            text-align: right;
        }
        .content > .item .input-text {
            float: left;
            width: calc(100% - 110px);
            line-height: 40px;
            position: relative;
        }
    }
    /deep/ .ipt-info{
        width: calc(100% - 270px);
        .item{
            width: 48%;
        }
        .item100{
            width:98%;
        }
        .el-textarea__inner{
            width:100%;
        }
    }
    /deep/ .upload-info{
        width: 250px;
        .label-term{
            line-height: 40px;
        }
        .myFileModel .avatar-uploader{
            .el-upload{
                width: 250px;
                height: 200px;
            }
            .avatar-uploader-icon{
                width: 250px;
                height: 200px;
                line-height: 200px;
                font-size: 70px;
            }
        }
        .fileModelLock{
          .el-upload-dragger{
            background: #F5F7FA;
          }
        }
    }
}
</style>
