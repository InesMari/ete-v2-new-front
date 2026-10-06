<template>
  <div id="taskDetail" class="taskDetailPage">
    <div class="common-info">
        <div class="editView">
            <el-input v-model="info.title" placeholder="请输入标题"></el-input>
            <div class="task-info">
                <div class="title">
                    任务内容
                    <div class="fr">
                        <el-button size="mini" @click="reEdit" v-show="!isEdit">编辑</el-button>
                        <el-button size="mini" @click="cancel" v-show="isEdit">取消</el-button>
                        <el-button size="mini" @click="submit" v-show="isEdit" type="primary">保存</el-button>
                    </div>
                </div>
                <div style="padding-bottom: 10px;" v-show="!isEdit" v-html="info.content"></div>
                <WangEditor ref="wangEditor" height="300" v-show="isEdit"></WangEditor>
            </div>
            <div class="task-info task-info2">
                <div class="title">
                    任务反馈
                    <div class="fr">
                        <el-button size="mini">取消</el-button>
                        <el-button size="mini" type="primary">保存</el-button>
                    </div>
                </div>
                <WangEditor ref="wangEditor2" height="300"></WangEditor>
            </div>
            <div class="history">
                <div class="title">动态记录</div>
                <div class="list">
                    <div class="item" v-for="item in new Array(5)">
                        <div class="tag">刘</div>
                        <div class="content">
                            <div class="name">刘德华<span class="date">2023-03-06</span></div>
                            <div class="desc">将状态从待处理置为开发完成</div>
                        </div>
                    </div>
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
            <div class="item">
                <div class="label">反馈附件：</div>
                <div class="value">
                    <myFileModel @successCallback="fileCallback"></myFileModel>
                </div>
            </div>
        </div>
    </div>
        <!-- <div class="bot-btn">            
            <el-button type="primary" @click="submit">保存</el-button>
        </div> -->
  </div>
</template>

<script>
import taskDetail from './taskDetail.js'
export default taskDetail
</script>
<style lang="scss" scoped>
.taskDetailPage{
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
            .title{
                font-size: 14px;
                font-weight: bold;
            }
            .task-info{
                .title{
                    margin-bottom: 10px;
                    line-height: 30px;
                }
            }
            .task-info2{
                border-top: 1px dashed $border-color;
                margin-top: 10px;
                padding-top: 10px;
            }
            .history{
                margin-top: 20px;
                .list{
                    margin-top: 20px;
                    position: relative;
                    &::after{
                        content: '';
                        position: absolute;
                        left: 15px;
                        top: 0;
                        border-left: $border;
                        height: calc(100% - 60px);
                        z-index: 3;
                    }
                    .item{
                        position: relative;
                        z-index: 9;
                        display: flex;
                        margin-bottom: 10px;
                        &:first-child{
                            .tag{
                                color: #fff;
                                background: $main-color;
                            }
                        }
                        .tag{
                            width: 30px;
                            background: #eee;
                            // color: #fff;
                            text-align: center;
                            height: 30px;
                            line-height: 30px;
                            border-radius: 50%;
                        }
                        .content{
                            flex: 1;
                            margin-left: 10px;
                            // &:hover{
                            //     background: #f9f9f9;
                            // }
                            .name{
                                color:#adadad;
                                font-size: 14px;
                                line-height: 30px;
                                font-weight: bold;
                                .date{
                                    font-size: 12px;
                                    margin-left: 10px;
                                }
                            }
                            .desc{
                                line-height: 40px;
                                color:#adadad;
                                font-size: 14px;
                            }
                        }
                    }
                }
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