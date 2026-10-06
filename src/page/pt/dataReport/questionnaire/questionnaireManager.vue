<template>
    <div id="questionnaireManager">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam"></searchList>

      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>问卷管理列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1007039" @click="toAdd">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1007040" @click="toUpdate">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1007041" @click="del">删除</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1007042" @click="toVisitTemp">详情</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1007043" @click="toCopy">复制</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1007044" @click="toLaunch">投放问卷</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1007045" @click="toQuestionnaireReportMain">数据报表</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1007049" @click="toQuestionnaireTemplate">问卷模板</el-button>
                </div>
            </div>
            <tableCommon tableName="questionnaireManagerTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem"></tableCommon>
        </div>

        <!-- 投放问卷弹窗 -->        
        <el-dialog title="投放确认提示" :visible.sync="questionnaireDialog" width="490px">
            <div style="margin-top:20px;font-weight:bold;font-size:14px;text-align:center;">是否开始投放问卷，问卷投放后不可再修改！</div>
            <div class="page-bot-btn">
                <el-button size="mini" @click="questionnaireDialog = false">关闭</el-button>
                <el-button type="primary" size="mini" @click="toEffect()">提交</el-button>
            </div>
        </el-dialog>

        <!-- 二维码弹窗 -->
        <div class="popup" v-if="showCodeView">
            <div class="codeView">
                <i class="el-icon-error" @click="showCodeView = false"></i>
                <img :src="codeUrl" alt="">
                <a class="button" :href="codeUrl" download>下载二维码</a>
            </div>
        </div>
    </div>
</template>

<script>
import questionnaireManager from './questionnaireManager.js'
export default questionnaireManager
</script>
<style lang="scss" scoped>
#questionnaireManager{
    .popup{
        left: 0;
    }
    .codeView{
        width: 180px;
        padding: 60px 80px 40px;
        background: $main-color;
        border-radius: 10px;
        position: absolute;
        left: 50%;
        top: 50%;
        z-index: 999;
        transform: translate(-50%,-50%);
        text-align: center;
        .el-icon-error{
            position: absolute;
            font-size: 24px;
            cursor: pointer;
            top: 10px;
            right: 10px;
            color: #fff;
        }
        img{
            width: 100%;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .button{
            display: inline-block;
            line-height: 1;
            white-space: nowrap;
            cursor: pointer;
            background: #FFF;
            border: 1px solid #DCDFE6;
            color: #606266;
            text-align: center;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            margin: 0;
            -webkit-transition: .1s;
            transition: .1s;
            font-weight: 500;
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            padding: 12px 20px;
            font-size: 14px;
            text-decoration: none;
            border-radius: 4px;
            &:hover{
                color: #409eff;
                border-color: #c6e2ff;
                background-color: #ecf5ff;
            }
        }
    }
}
</style>




