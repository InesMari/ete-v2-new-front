<template>
  <div id="toMain" class="toMainPage">
    <div class="main" >
      <div class="banner swiper-container" id="banner">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="item in homeData[0]" @click="hotLearn(item.relId)">
            <div class="img" :style="'background-image: url('+item.imgUrl+')'"></div>
            <!-- <img :src="item.imgUrl" alt="" /> -->
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <div class="nav clearfix">
        <div class="navList">
            <el-menu
                class="homeMenu"
                mode="horizontal"
                background-color="#e70b1d"
                active-text-color="#fff"
                text-color="#fff">
                
                <div v-for="(tab1,index1) in courseClassData" :key="index1">
                    <template v-if="tab1.childrens.length==0">
                        <el-menu-item :index="tab1.codeValue+''" @click="queryCourse(tab1)">
                            {{tab1.codeName}}
                        </el-menu-item>
                    </template>
                    
                    <el-submenu v-else :index="tab1.codeValue+''">
                        <template slot="title">
                            <span @click="queryCourse(tab1)">{{tab1.codeName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item  v-for="(tab2,index2) in tab1.childrens" :index="tab1.codeValue+'-'+tab2.codeValue+''" :key="index2" @click="queryCourse(tab2,2)">
                            <span>{{tab2.codeName}}</span>
                        </el-menu-item>
                    </el-submenu>
                </div>
            </el-menu>
        </div>
        <div class="personal" @click="toStudent">个人中心</div>
      </div>
      <!-- 首页 -->
      <div v-show="homeType == 1">
      <div class="hot">
        <div class="homeTitle">热门课程</div>
        <div class="homeNoInfo" v-if="homeData[1].length==0">敬请期待</div>
        <div class="hotList clearfix" v-if="homeData[1].length>0">
          <div class="item" v-for="item in homeData[1]" @click="hotLearn(item.relId)">
            <img :src="item.imgUrl" alt="">
            <div class="name">{{item.content}}</div>
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
            <td width="150">{{ index+1 }}</td>
            <td width="600">{{item.orgName}}</td>
            <td width="300">{{item.userName}}</td>
            <td width="150">{{item.credit}}</td>
          </tr>
        </table>
      </div>
      <div class="teacher">
        <div class="homeTitle">讲师团队</div>
        <div class="homeNoInfo" v-if="homeData[3].length==0">敬请期待</div>
        <div class="swiper-container" id="teacher">
         <div class="swiper-wrapper">
           <div class="swiper-slide" v-for="item in homeData[3]">
              <div class="img" :style="'background-image: url('+item.imgUrl+')'"></div>
            </div>
          </div>
          <!-- <div class="swiper-pagination"></div> -->
        </div>
      </div>
<!--      <div class="result">-->
<!--        <div class="homeTitle">学习成果</div>-->
<!--        <div class="homeNoInfo" v-if="homeData[4].length==0">敬请期待</div>-->
<!--        <div class="swiper-container" id="result">-->
<!--          <div class="swiper-wrapper">-->
<!--            <div class="swiper-slide" v-for="item in homeData[4]">-->
<!--              &lt;!&ndash; <img :src="item.imgUrl" alt="" /> &ndash;&gt;-->
<!--              <div class="img" :style="'background-image: url('+item.imgUrl+')'"></div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div class="swiper-pagination"></div>-->
<!--        </div>-->
<!--      </div>-->
      <div class="books">
        <div class="homeTitle">好书推荐</div>
        <div class="homeNoInfo" v-if="homeData[5].length==0">敬请期待</div>
        <div class="bookList clearfix" v-if="homeData[5].length>0">
          <div class="item" v-for="item in homeData[5]" >
            <img :src="item.imgUrl" alt="" @click="toBookDetail(item.relId)">
            <div class="name">{{item.content}}</div>
          </div>
        </div>
      </div>
        <div class="banner swiper-container" style="margin-top: 20px;" id="banner2">
          <div class="homeNoInfo" v-if="homeData[6].length==0" >敬请期待</div>
          <div class="swiper-wrapper2">
            <div class="swiper-slide" v-for="item in homeData[6]">
              <img :src="item.imgUrl" alt="" style="width: 100%;display: block;"/>
            </div>
          </div>
        </div>
      </div>
      <!-- 课程 -->
      <div v-show="homeType == 2">
        <div class="courseList">
            <div class="clearfix">
                <el-input class="fr" style="width:200px;margin-right:20px;" placeholder="搜索课程"
                          suffix-icon="el-icon-search" v-model="param.searchKey" @input="queryCourse"></el-input>
            </div>
            <div v-if="list.length==0" style="line-height:100px;text-align:center;font-size: 20px;">暂无课程</div>
            <div class="item" v-for="item in list">
                <img src="@/static/image/set_top.png" v-if="item.topFlag" class="setTop" alt="">
                <div class="content">
                    <div class="coverImg">
                        <img :src="item.imgUrl" alt="">
                    </div>
                    <div class="dec">
                        <div class="title">{{ item.courseName }}</div>
                        <div class="text">课程分类：{{item.courseClassName}}</div>
                        <div class="text">课程长约：{{item.durationStr}} |  共{{ item.chapterNums }}个小节</div>
                        <div class="text">学分：{{ item.credit }}</div>
                    </div>
                    <el-button class="btn" type="primary" plain @click="toLearn(item)">立即学习</el-button>
                </div>
            </div>
        </div>
      </div>

      <!-- 书籍推荐 -->
      <bookDetail :id="bookId" v-if="homeType == 3"></bookDetail>

    </div> 
    
  </div>
</template>

<script>
import toMain from "./toMain.js";
export default toMain;
</script>
<style lang="scss" src="./toMain.scss" scoped></style>
