<template>
    <div id="doneInspectTask" class="doneInspectTaskPage">
        <div class="common-info" v-show="type==2">
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">巡检任务编号</td>
                    <td class="value">{{info.taskNum}}</td>
                    <td class="label">巡检事项</td>
                    <td class="value">{{info.inspectionItem}}</td>
                    <td class="label">任务状态</td>
                    <td class="value">{{info.taskStateName}}</td>
                </tr>
                <tr>
                    <td class="label">巡检设备</td>
                    <td class="value">{{info.equipment}}</td>
                    <td class="label">设备编号</td>
                    <td class="value">{{info.equipmentNum}}</td>
                    <td class="label">执行人</td>
                    <td class="value">{{info.executorStr}}</td>
                </tr>
                <tr>
                    <td class="label">规定巡检时间</td>
                    <td class="value">{{info.stipulateDate}}</td>
                    <td class="label">实际巡检时间</td>
                    <td class="value">{{info.actualDate}}</td>
                    <td class="label">实际巡检人</td>
                    <td class="value">{{info.actualUserName}}</td>
                </tr>
                <tr>
                    <td class="label">备注</td>
                    <td class="value" colspan="5">{{info.remark}}</td>
                </tr>
                <tr>
                    <td class="label">点检备注</td>
                    <td class="value" colspan="5">
                      <el-input v-model="info.submitRemark" placeholder="请输入点检备注"></el-input>
                    </td>
                </tr>
            </table>
            <h3 class="common-title mt_20"><span class="title-name">巡检信息</span></h3> 
            <!-- 车辆            -->
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="80">序号</th>
                        <th width="120">巡检项目</th>
                        <th width="300">检查基准</th>
                        <th width="300">巡检要求</th>
                        <th width="120">巡检方法</th>
                        <th width="130">检查结果</th>
                        <th width="200">异常巡检情况</th>
                        <th width="80">图片</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in standardDtlList">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.inspectItem }}</td>
                        <td>{{ item.content }}</td>
                        <td>{{ item.inspectRequire }}</td>
                        <td>{{ item.inspectMethodName }}</td>
                        <td v-show="item.type == 1">
                          <el-radio-group v-model="item.contentAnswer">
                            <el-radio v-for="item in inspectItemStsData" :label="item.codeValue" :key="item.codeValue" >{{item.codeName}}</el-radio>
                          </el-radio-group>
                        </td>
                        <td v-show="item.type != 1">
                          <el-input v-model="item.contentAnswer" placeholder="请输入检查结果" @blur="cleanFile(index)"></el-input>
                        </td>
                        <td>
                          <el-input v-model="item.exceContent" placeholder="请输入异常巡检情况" :disabled="item.type == 1&&item.contentAnswer!='0'"></el-input>
                        </td>
                        <td>
                          <myFileModel :ref="'file' + index"
                                       :disabled="item.type == 1&&item.contentAnswer!='0'"
                                       @successCallback="successCallback" @delCallback="delCallback"
                                       :componentId="'file' + index" clickType="text" ></myFileModel>
                        </td>
                    </tr>
                </tbody>
            </table>
            <h3 class="common-title mt_20"><span class="title-name">附加图片</span></h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="80">序号</th>
                        <th>附加图片名称</th>
                        <th width="200">查看图片</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in imgList">
                        <td>{{ index + 1 }}</td>
                        <td> {{ item.imgName }}</td>
                        <td @click="seeBigImg(item)">
                          <myFileModel :ref="'file' + index"
                                       @successCallback="successCallback2" @delCallback="delCallback2"
                                       :componentId="'file' + index" clickType="text" ></myFileModel>
                        </td>
                    </tr>
                </tbody>            
            </table>
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="save">提交</el-button>
            </div>
        </div>

      <div class="common-info" v-show="type==1">
        <div class="scanInfo">
          <div class="label">请扫码</div>
          <el-input class="text" ref="equipmentInput" type="text" v-model="equipmentNum" maxlength="10" placeholder="请扫设备二维码" @keyup.enter.native="scanCode" v-auto-select autofocus></el-input>
        </div>
        <div class="scanTip">说明 ： 扫码后，自动跳转巡检明细界面</div>
      </div>

    </div>
</template>

<script>
	import doneInspectTask from './doneInspectTask.js'
	export default doneInspectTask
</script>
<style lang="scss" scoped>
.doneInspectTaskPage{
    .tableCommon{
        border:$border;
    }
  .common-info{
    min-height: 100%;
    box-sizing: border-box;
  }
  .scanInfo {
    padding-top: 10vh;
    display: flex;
    align-items: center;
    justify-content: center;

    .label {
      font-size: 16px;
    }

    .text {
      font-size: 16px;
      border-radius: 3px;
      padding: 8px 12px;
      width: 300px;
      margin-left: 20px;
    }
  }
  .scanTip{
    text-align: center;
    margin-top: 50px;
    color: $main-color;
    font-size: 30px;
    line-height: 1;
  }
}
</style>
