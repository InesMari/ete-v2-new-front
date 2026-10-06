<template>
    <div id="courseManage" class="courseManagePage">
        <div class="main_content">
            <div class="treeView">
                <div class="treeTitle">课程分类</div>
                <div class="courseList">
                    <div class="item" :class="item.active?'active':''" v-for="item in courseOneClassNav" @click="chooseCourse(item)">{{ item.codeName }}</div>
                </div>
            </div>
            <div class="course">
                <div class="opView" @keydown.enter="doQuery">
                    <el-button type="primary" plain icon="el-icon-plus" @click="addCourse">新增</el-button>
                    <el-button type="primary" plain icon="el-icon-delete" @click="delCourse">删除</el-button>
                    <el-button type="primary" plain @click="openClassChange">移到分类</el-button>   
                    <el-input class="fr" placeholder="搜索课程" suffix-icon="el-icon-search" v-model="info.courseName"></el-input> 
                </div>
                <div class="courseList">
                    <div class="item" v-for="item in list">
                        <img src="@/static/image/set_top.png" v-if="item.topFlag" class="setTop" alt="">
                        <el-checkbox v-model="item.isSelect"></el-checkbox>
                        <div class="content">
                            <div class="coverImg">
                                <img :src="item.imgUrl" alt="">
                            </div>
                            <div class="dec">
                                <div class="title">{{item.courseName}}</div>
                                <div class="text">课程分类：{{item.courseClassName}}{{ item.isRequired == 1?'（必修）':'（选修）' }}</div>
                                <div class="text">课程长约：{{item.durationStr}} |  共{{ item.chapterNums }}个小节</div>
                                <div class="text">学分：{{ item.credit }}</div>
                                <div class="text">{{ item.testId?'已添加试卷':'未添加试卷' }}</div>
                            </div>
                            <div class="totalView">
                                <div class="totalItem">
                                    <div class="total">{{item.studyNums}}</div>
                                    <p>已学习人数</p>
                                </div>
                                <div class="totalItem">
                                    <div class="total">{{item.doneNums}}</div>
                                    <p>通过人数</p>
                                </div>
                            </div>  
                            <div class="opBtns">
                                <el-button type="primary" plain size="mini" @click="addExam(item.id,item.testId)">添加试卷</el-button> 
                                <el-button type="primary" plain size="mini" @click="setTop(item.id,item.topFlag)">{{ item.topFlag?'取消置顶':'置顶课程' }}</el-button> 
                                <el-button type="primary" plain size="mini" @click="editCourse(item.id)">修改课程</el-button> 
                                <el-button type="primary" plain size="mini" @click="courseDetail(item.id)">查看课程</el-button> 
                                <div class="moreBtns">
                                    <el-button type="primary" plain size="mini">更多设置<i class="el-icon-arrow-down"></i></el-button> 
                                    <div class="btnView">
                                        <div class="btn" @click="appointStudy(item)">指定学习</div> 
                                        <div class="btn" @click="learnRecord(item.id)">学习记录</div> 
                                        <div class="btn" @click="examDetail(item.id,item.testId)">查看试卷</div> 
                                        <div class="btn" @click="editExam(item.id,item.testId)">修改试卷</div> 
                                        <div class="btn" @click="delExam(item.testId)">删除试卷</div> 
                                        <div class="btn" @click="checkScore(item.id)">查看考试成绩</div> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="10"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="list.length">
                </el-pagination>
            </div>
        </div>
        <!-- 移动分类 -->
        <el-dialog title="移动分类" :visible.sync="changeClassDialog" width="400px">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">                    
                    <li class="item item100">
                        <label class="label-term"><em>*</em>课程分类</label>
                        <div class="input-text">
                            <el-select v-model="courseOneClassModel" clearable filterable placeholder="请选择"
                                        @change="courseOneClassChange">
                                <el-option v-for="item in courseOneClass" :key="item.codeValue"
                                            :label="item.codeName"
                                            :value="item.codeValue">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100" v-if="courseTwoClassShow.length > 1">
                        <label class="label-term"><em>*</em>二级分类</label>
                        <div class="input-text">
                            <el-select v-model="courseTwoClassModel" clearable filterable placeholder="请选择" @change="forceUpdate">
                                <el-option v-for="item in courseTwoClass" :key="item.codeValue"
                                            :label="item.codeName"
                                            :value="item.codeValue">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
            </div>            
            <div class="page-bot-btn">
                <el-button size="mini" @click="changeClassDialog = false">关闭</el-button>
                <el-button type="primary" size="mini" @click="saveClassChange()">提交</el-button>
            </div>
        </el-dialog>
        <!-- 移动分类 -->
        <!-- 指定学习 -->
        <el-dialog class="operateDialog" title="添加指定学习岗位" :visible.sync="isStudyDialog" width="1200px" > 

            <dbTable ref="dbTable" :head="dbHead" onlyId="id"></dbTable>
            <div class="bot-btn">
                <el-button size="mini" @click="isStudyDialog = false">关闭</el-button>
                <el-button size="mini" type="primary" @click="saveChangeAppointStudy">保存</el-button>
            </div>
        </el-dialog>
        <!-- 指定学习 -->
    </div>
</template>
  
<script>
import courseManage from "./courseManage.js";
export default courseManage;
</script>
<style lang="scss" src="./courseManage.scss" scoped></style>
  