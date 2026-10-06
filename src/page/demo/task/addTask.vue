<template>
  <div id="addTask" class="addTaskPage">
    <div class="common-info">
        <div class="editView">
            <el-input v-model="info.title" placeholder="请输入标题"></el-input>
            <WangEditor ref="wangEditor"></WangEditor>
            <div class="submitView clearfix">
                <el-checkbox class="fl" v-model="isNext">继续新建下一个</el-checkbox>
                <div class="fr">
                    <el-button size="small" @click="close">关闭</el-button>
                    <el-button size="small" type="primary" @click="submit">提交</el-button>
                </div>
            </div>
        </div>
        <div class="categoryView">
            <div class="item">
                <div class="label"><em>*</em>是否采纳：</div>
                <div class="value">
                    <el-select v-model="inputvalue" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="item">
                <div class="label"><em>*</em>状态：</div>
                <div class="value">
                    <el-select v-model="inputvalue" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="item">
                <div class="label"><em>*</em>负责人：</div>
                <div class="value">
                    <el-select v-model="inputvalue" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="item">
                <div class="label"><em>*</em>优先级：</div>
                <div class="value">
                    <el-select v-model="inputvalue" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="item">
                <div class="label"><em>*</em>迭代：</div>
                <div class="value">
                    <el-select v-model="inputvalue" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="item">
                <div class="label"><em>*</em>需求人：</div>
                <div class="value">
                    <el-select v-model="inputvalue" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="item">
                <div class="label">需求部门：</div>
                <div class="value">xxx</div>
            </div>  
            <div class="item">
                <div class="label">计划开始：</div>
                <div class="value">
                    <el-date-picker v-model="inputvalue" type="date" placeholder="开始时间" value-format="yyyy-MM-DD"></el-date-picker>
                </div>
            </div>
            <div class="item">
                <div class="label">计划完成：</div>
                <div class="value">
                    <el-date-picker v-model="inputvalue" type="date" placeholder="完成时间" value-format="yyyy-MM-DD"></el-date-picker>
                </div>
            </div>
            <div class="item">
                <div class="label">附件：</div>
                <div class="value">
                    <myFileModel ref="file" @successCallback="fileCallback"></myFileModel>
                    <div class="fileList" v-show="fileList.length>0">
                        <div class="fileItem" v-for="(item,index) in fileList">
                            <img class="fileIco" src="@/static/image/fileIco.png" alt="">
                            <div class="fileInfo">
                                <div class="fileName">{{ item.fileName }}</div>
                                <div class="nameTime">张三<span class="date">2018-01-01 12:00</span></div>
                            </div>
                            <i class="el-icon-download" @click="download(index)"></i>
                            <i class="el-icon-delete" @click="delFile(index)"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import addTask from './addTask.js'
export default addTask
</script>
<style lang="scss" scoped>
.addTaskPage{
    /deep/ .common-info{
        display: flex;
        .editView{
            flex: 1;
            .el-input{
                margin-bottom: 20px;
            }
            .submitView{
                margin-top: 10px;
                line-height: 32px;
            }
        }
        .categoryView{
            width: 350px;
            margin-left: 20px;
            .item{
                display: flex;
                margin-bottom: 10px;
                .label{
                    width: 70px;
                    line-height: 40px;
                    text-align: right;
                    // margin-right: 10px;
                }
                .value{
                    flex:1;
                    min-width: 0;
                    line-height: 40px;
                }
                .el-select{
                    width: 100%;
                }
                .el-date-editor.el-input{
                    width: 100%;
                }
            }
            .myFileModel{
                .avatar-uploader{
                    .el-upload,.avatar-uploader-icon{
                        width:80px;
                        height: 80px;
                        line-height: 80px;
                    }
                    .avatar-uploader-inner>img{
                        display: none;
                    }
                }
            }
            .fileList{
                margin-top: 10px;                
                .fileItem{
                    display: flex;
                    margin-bottom: 10px;
                    padding: 10px;
                    background: #f2f5f7;
                    align-items: center;
                    .fileIco{
                        width: 50px;
                        height: 50px;
                    }
                    .el-icon-delete{
                        font-size: 16px;
                        cursor: pointer;
                        &:hover{
                            color: red;
                        }
                    }
                    .el-icon-download{
                        font-size: 16px;
                        margin-right: 8px;
                        cursor: pointer;
                        &:hover{
                            color: #00d500;
                        }
                    }
                    .fileInfo{
                        margin-left: 5px;
                        flex: 1;
                        min-width: 0;
                        .fileName{
                            margin-bottom: 5px;
                            color: #333;
                            font-size: 13px;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                        .nameTime{
                            color: #999;
                            .date{
                                margin-left: 10px;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>