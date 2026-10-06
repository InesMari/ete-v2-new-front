<template>
    <div id="imgsUpload" class="imgsUploadComponents">
        <el-dialog class="editDialog" title="上传单据" :visible.sync="isshowUploadDialog" width="680px">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item img-upload" v-for="(item,index) in types" :key="index">
                        <div class="input-text">
                            <span class="type">{{item.codeName}}</span>
                            <myFileModel :ref="'file'+item.codeValue" @successCallback="fileCallback" :componentId="item.codeValue"></myFileModel>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="info">
                <div class="title">只能上传jpg/jpeg/png文件</div>
                <div class="fileList">
                    <div class="item clearfix" v-for="(item,index) in imgList" :key="index">
                        <span class="name fl">
                            <i class="el-icon-document-checked"></i>
                            <a href="javascript:;" class="link" @click="showImg(item)">{{item.showName}}</a>
                        </span>
                        <i class="fr el-icon-circle-close" @click="delImg(index)"></i>
                    </div>
                    <div v-if="imgList.length==0" style="line-height:100px;text-align:center;color:#999;font-size:16px;">暂无上传图片</div>
                </div>
            </div>            
            <div v-viewer="{movable: false}" :images="imgSeeList" class="imgsUploadViewer" v-show="false">
                <img v-for="(item,index) in imgSeeList" :key="index" :src="item"/>
            </div>
            <div class="page-bot-btn">
                <el-button size="mini" @click="hide">关闭</el-button>
                <el-button type="primary" size="mini" @click="sure">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import imgsUpload from './imgsUpload.js'
    export default imgsUpload
</script>
<style lang="scss">
.imgsUploadComponents{
    .common-info .content > .item{
        width: 200px;
        min-width: 200px;
        margin:0 1%;
        .input-text{
            float: initial;
            margin:0 auto;
            position: relative;
            width: 162px;
            .type{
                position: absolute;
                bottom:8px;
                left: 50%;
                transform: translateX(-50%);
                -webkit-transform: translateX(-50%);
            }
        }
    }
    .info{
        padding:20px 25px 10px;
        .item{
            line-height: 35px;
            height: 35px;
            font-size: 14px;
            padding:0 12px;
            &:hover{
                background: #efefef;
                .el-icon-circle-close{
                    display: inline;
                }
            }
            .el-icon-document-checked{
                margin-right: 5px;
                color: rgb(34, 194, 34);
                font-size: 18px;
            }
            .el-icon-circle-close{
                font-size: 16px;
                margin-left: 30px;
                font-weight: bold;
                margin-top:9px;
                cursor: pointer;
                vertical-align: middle;
                color: #999;
                &:hover{
                    color:red;
                }
            }
        }
    }
}
</style>