<template>
  <div id="homeManage" class="homeManagePage toMainPage clearfix">
    <!-- 主页展示 -->
    <el-scrollbar class="main" >
      <div class="banner swiper-container" id="banner" :class="activeModel==0?'activeModel':''" @click="changeAcitve(0)">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="item in homeData[0]">
            <img :src="item.imgUrl" alt="" />
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <div class="nav clearfix">
        <div class="navList">
            <el-menu
                class="homeMenu"
                mode="horizontal"
                background-color="#000"
                active-text-color="#fff"
                text-color="#fff">
                
                <div v-for="(tab1,index1) in courseClassData" :key="index1">
                    <template v-if="tab1.childrens.length==0">
                        <el-menu-item :index="tab1.codeValue+''">
                            {{tab1.codeName}}
                        </el-menu-item>
                    </template>
                    
                    <el-submenu v-else :index="tab1.codeValue+''">
                        <template slot="title">
                            <span style="margin-right:20px;">{{tab1.codeName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item  v-for="(tab2,index2) in tab1.childrens" :index="tab1.codeValue+'-'+tab2.codeValue+''" :key="index2">
                            <span>{{tab2.codeName}}</span>
                        </el-menu-item>
                    </el-submenu>
                </div>
            </el-menu>
        </div>
        <div class="personal fr">个人中心</div>
      </div>
      <div class="hot" :class="activeModel==1?'activeModel':''" @click="changeAcitve(1)">
        <div class="homeTitle">热门课程</div>
        <div class="homeNoInfo" v-if="homeData[1].length==0">请上传信息</div>
        <div class="hotList clearfix" v-if="homeData[1].length>0">
          <div class="item" v-for="item in homeData[1]">
            <img :src="item.imgUrl" alt="">
            <div class="name">{{item.courseName}}</div>
          </div>
        </div>
      </div>
      <div class="rank">
        <div class="homeTitle">学习排名</div>
        <table class="rankTable" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <th>名次</th>
            <th>所属部门</th>
            <th>用户名</th>
            <th>学分</th>
          </tr>
          <tr v-for="(item,index) in homeData[2]">
            <td>{{ index+1 }}</td>
            <td>{{item.orgName}}</td>
            <td>{{item.userName}}</td>
            <td>{{item.credit}}</td>
          </tr>
        </table>
      </div>
<!--      <div class="teacher" :class="activeModel==3?'activeModel':''" @click="changeAcitve(3)">-->
<!--        <div class="homeTitle">讲师团队</div>-->
<!--        <div class="homeNoInfo" v-if="homeData[3].length==0">请上传信息</div>-->
<!--        <div class="teacherList clearfix" v-if="homeData[3].length>0">-->
<!--          <div class="item" v-for="item in homeData[3]">-->
<!--            <img :src="item.imgUrl" alt="">-->
<!--            <div class="name">{{item.content}}</div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
      <div class="banner swiper-container" style="margin-top: 10px;" id="banner" :class="activeModel==3?'activeModel':''" @click="changeAcitve(3)">
        <div class="homeTitle">讲师团队</div>
        <div class="homeNoInfo" v-if="homeData[3].length==0">请上传图片</div>
        <div class="swiper-wrapper2" style="height: 280px;" >
          <div class="swiper-slide" v-for="item in homeData[3]">
            <img :src="item.imgUrl" alt="" />
          </div>
        </div>
      </div>


<!--      <div class="result" :class="activeModel==4?'activeModel':''" @click="changeAcitve(4)">-->
<!--        <div class="homeTitle">学习成果</div>-->
<!--        <div class="homeNoInfo" v-if="homeData[4].length==0">请上传信息</div>-->
<!--        <div class="swiper-container" id="result">-->
<!--          <div class="swiper-wrapper">-->
<!--            <div class="swiper-slide" v-for="item in homeData[4]">-->
<!--              <img :src="item.imgUrl" alt="" />-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
      <div class="books" :class="activeModel==5?'activeModel':''" @click="changeAcitve(5)">
        <div class="homeTitle">好书推荐</div>
        <div class="homeNoInfo" v-if="homeData[5].length==0">请上传信息</div>
        <div class="bookList clearfix" v-if="homeData[5].length>0">
          <div class="item" v-for="item in homeData[5]">
            <img :src="item.imgUrl" alt="">
            <div class="name">{{item.content}}</div>
          </div>
        </div>
      </div>
      <div class="banner swiper-container" style="margin-top: 10px;height: 280px;" id="banner" :class="activeModel==6?'activeModel':''" @click="changeAcitve(6)">
        <div class="homeNoInfo" v-if="homeData[6].length==0">请上传图片</div>
        <div class="swiper-wrapper2">
          <div class="swiper-slide" v-for="item in homeData[6]">
            <img :src="item.imgUrl" alt="" />
          </div>
        </div>
<!--        <div class="swiper-pagination"></div>-->
      </div>
    </el-scrollbar>
    <el-scrollbar class="homeSet">
        <div class="title">{{currentTitle}}</div>
        <div class="uploadList">
          <div class="item" v-for="(colum,index) in currentColumn">
            <i class="el-icon-error" @click="delImg(index)" v-if="currentColumn.length>1"></i>
            <div v-if="activeModel!=1&&activeModel!=5">
              <myFileModel :ref="'imgCover'+index" supportFiles="img" :componentId="index" @successCallback="successCallback"></myFileModel>
            </div>
            <!-- 上传提示 -->
            <div class="tip" v-if="activeModel!=1&&activeModel!=5">{{ tip }}</div>
            
            <div v-if="activeModel==1">请选择课程：</div>

            <el-select v-model="colum.relId" clearable filterable placeholder="请选择" @change="selectCourse($event,index)" v-if="activeModel==0 || activeModel==1">
                <el-option v-for="item in eduCourseData" :key="item.id"
                            :label="item.courseName"
                            :value="item.id">
                </el-option>
            </el-select>

            <div v-if="activeModel==5">请选择书籍：</div>
            <el-select v-model="colum.relId" clearable filterable placeholder="请选择" @change="selectBook($event,index)" v-if="activeModel==5">
              <el-option v-for="item in bookData" :key="item.id"
                         :label="item.bookName"
                         :value="item.id">
              </el-option>
            </el-select>

<!--            <el-input placeholder="请输入介绍" v-model="colum.content" v-if="activeModel==3"></el-input>-->
          </div>
        </div>
        <div class="saveBtn" v-if="currentColumn.length>0">
          <el-button type="primary" plain @click="addImg" v-if="activeModel!=3&&activeModel!=6">添加</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
    </el-scrollbar>
  </div>
</template>

<script>
import homeManage from "./homeManage.js";
export default homeManage;
</script>
<style lang="scss" scoped src="./homeManage.scss"></style>

