<template>
    <div id="addCourse" class="addCoursePage">
        <div class="common-info">
            <div class="innerTab clearfix">
                <div class="innerItem" :class="showType==1?'active':''" @click="changeTab(1)">
                    <p class="inline"><i class="el-icon-collection-tag"></i> 课程管理</p>
                </div>
                <div class="innerItem" :class="showType==2?'active':''" @click="changeTab(2)">
                    <p class="inline"><i class="el-icon-message"></i> 课程章节</p>
                </div>
            </div>
            <div class="courseInfo" v-show="showType==1">
                <ul class="content clearfix" style="width:620px;">
                    <li class="item">
                        <label class="label-term"><em>*</em>课程标题</label>
                        <div class="input-text">
                            <el-input v-model="course.baseInfo.courseName" placeholder="请填写20个字以内的标题" maxlength="20" show-word-limit></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>课程分类</label>
                        <div class="input-text">
                            <el-select v-model="course.baseInfo.oneClass" clearable filterable placeholder="请选择"
                                        @change="courseOneClassChange">
                                <el-option v-for="item in courseOneClass" :key="item.codeValue"
                                            :label="item.codeName"
                                            :value="item.codeValue">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item" v-if="courseTwoClassShow.length > 1">
                        <label class="label-term">二级分类</label>
                        <div class="input-text">
                            <el-select v-model="course.baseInfo.twoClass" clearable filterable placeholder="请选择" @change="forceUpdate">
                                <el-option v-for="item in courseTwoClassShow" :key="item.codeValue"
                                            :label="item.codeName"
                                            :value="item.codeValue">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>课程类型</label>
                        <div class="input-text">
                            <el-radio-group v-model="course.baseInfo.isRequired" @change="onCourseTypeChange">
                                <el-radio label="1">必修课</el-radio>
                                <el-radio label="2">选修课</el-radio>
                            </el-radio-group>
                        </div>
                    </li>
                    <li class="item" v-if="course.baseInfo.isRequired == '2'">
                        <label class="label-term"><em>*</em>指定学习岗位</label>
                        <div class="input-text">
                            <div v-if="course.positions && course.positions.length > 0" class="selected-positions">
                                <span class="positions-count">已选择 {{ course.positions.length }} 个岗位：</span>
                                <span class="positions-names">{{ course.positions.map(p => p.positionName).join('、') }}</span>
                            </div>
                            <el-button type="primary" plain size="mini" icon="el-icon-plus" @click="openPositionsDialog">选择岗位</el-button>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>课程讲师</label>
                        <div class="input-text">
                            <el-select v-model="course.baseInfo.lecturers" :multiple="true" clearable filterable placeholder="请选择">
                                <el-option v-for="item in staffData" :key="item.userId"
                                            :label="item.staffName"
                                            :value="item.userId">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>学分</label>
                        <div class="input-text">
                            <el-select v-model="course.baseInfo.credit" clearable filterable placeholder="请选择">
                                <el-option v-for="item in creditData" :key="item.codeValue"
                                            :label="item.codeName"
                                            :value="item.codeValue">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item uploadImg">
                        <label class="label-term">学习相关文件</label>
                        <div class="input-text">
                            <div class="clearfix">
                                <myFileModel class="fl" v-for="(item,index) in course.baseInfo.files" supportFiles="pdf" :key="index" :ref="'file'+index" :componentId="index" @successCallback="fileCallback"></myFileModel>
                            </div>
                            <div><em>(仅支持PDF文件，大小不超过2M。)</em></div>
                        </div>
                    </li>
                    <li class="item uploadImg">
                        <label class="label-term">上传封面</label>
                        <div class="input-text">
                            <myFileModel ref="imgCover" supportFiles="img" @successCallback="imgCoverCallback"></myFileModel>
                            <div><em>(支持jpg、jpeg、png等格式的图片，建议尺寸400*300像素，大小不超过2M。)</em></div>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix">
                    <li class="item">
                        <label class="label-term">课程简介</label>
                        <div class="input-text">
                            <WangEditor ref="wangEditor"></WangEditor>
                        </div>
                    </li>
                </ul>
                <div class="bot-btn">
                    <el-button type="primary" @click="changeTab(2)">下一步</el-button>
                </div>
            </div>
            <div class="chapterInfo" v-show="showType==2">
                <div class="content">
                    <div class="chapterList">
                        <div class="title">新建章节</div>
                        <div class="list">                        
                            <el-button type="primary" size="mini" icon="el-icon-plus" @click="addCourse">新建章节</el-button>
                            <div class="item" v-for="(file,index) in course.chapters" :class="currentChapter==index?'active':''">
                                <div class="innerTitle" @click="changeCourse(index)">
                                    第{{index+1}}章：{{ file.chapterTitle }}
                                    <i class="el-icon-close" @click.stop="delCourse(index)"></i>
                                </div>
                                <div class="innerItem" v-for="item in file.files">
                                    <i class="el-icon-document" v-if="item.fileType=='pdf' || item.isVideo == 0"></i>
                                    <i class="el-icon-caret-right" v-if="item.fileType=='mp4' || item.isVideo == 1"></i>
                                    {{ item.fileName }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="addChapter">
                        <div class="title">编辑框</div>
                        <div class="inner_con">
                            <div class="label">标题：</div>
                            <el-input v-model="course.chapters[currentChapter].chapterTitle" type="text" placeholder="请输入标题"></el-input>
                            <div class="label">章节简介：</div>
                            <el-input v-model="course.chapters[currentChapter].introduction" type="textarea" placeholder="请输入章节简介"></el-input>
                            <div class="label">课件<span class="zt_999">（请上传pdf或者mp4文件）</span>：</div>
                            <div class="uploadCommon">
                                <ul class="uploadList">
                                    <li v-for="(item,index) in course.chapters[currentChapter].files">
                                        <i class="el-icon-document" v-if="item.fileType=='pdf' || item.isVideo == 0"></i>
                                        <i class="el-icon-caret-right" v-if="item.fileType=='mp4' || item.isVideo == 1"></i>
                                        {{ item.fileName }}
                                        <span class="file-duration" v-if="item.duration > 0" @click="editDuration(index)">({{ formatDuration(item.duration) }}，点击修改)</span>
                                        <span class="file-duration unset" v-else @click="editDuration(index)">(点击设置时长)</span>
                                        <i class="el-icon-close" @click="delChapter(index)"></i>
                                    </li>
                                </ul>
                            </div>
                            <myFileModel ref="addChapter" supportFiles="pdf,mp4" @successCallback="chapterCallback"></myFileModel>
                            <video id="myVideo" :src="videoSrc" style="display:none;" ></video>
                            
                            <!-- 非视频文件时长设置对话框 -->
                            <el-dialog title="设置课件时长" :visible.sync="showDurationDialog" width="500px" :close-on-click-modal="false">
                                <div class="duration-dialog-content">
                                    <h5 class="file-name" style="text-align: center;margin-bottom: 20px;font-size: 14px;font-weight: bold;">{{ durationForm.fileName }}</h5>
                                    <el-form label-width="100px">
                                        <el-form-item label="学习时长" style="margin: 0;">
                                            <div style="display: flex; align-items: center; gap: 10px;">
                                                <el-input-number v-model="durationForm.minutes" :min="0" :max="600" placeholder="分钟" style="width: 140px;"></el-input-number>
                                                <span>分</span>
                                                <el-input-number v-model="durationForm.seconds" :min="0" :max="59" placeholder="秒" style="width: 140px;"></el-input-number>
                                                <span>秒</span>
                                            </div>
                                        </el-form-item>
                                    </el-form>
                                </div>
                                <div slot="footer" style="text-align: center;">
                                    <el-button @click="showDurationDialog = false">取消</el-button>
                                    <el-button type="primary" @click="confirmDuration">确定</el-button>
                                </div>
                            </el-dialog>
                        </div>
                    </div>
                </div>
                <div class="bot-btn">
                    <el-button type="primary" @click="changeTab(1)">上一步</el-button>
                    <el-button type="primary" @click="save">保存</el-button>
                </div>
            </div>
        </div>
        <!-- 指定学习岗位弹窗 -->
        <el-dialog class="operateDialog" title="添加指定学习岗位" :visible.sync="isPositionsDialog" width="1200px">
            <dbTable ref="dbTable" :head="dbHead" onlyId="id"></dbTable>
            <div class="bot-btn">
                <el-button size="mini" @click="isPositionsDialog = false">关闭</el-button>
                <el-button size="mini" type="primary" @click="savePositions">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import addCourse from './addCourse.js'
export default addCourse
</script>


<style lang="scss" scoped src="./addCourse.scss"></style>
