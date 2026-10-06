<template>
    <div id="bookDetail" class="bookDetailPage">
        <div class="main_content">
            <div class="course">
                <div class="courseList">
                    <div class="item">
                        <div class="content">
                            <div class="coverImg">
                                <img :src="info.imgUrl" alt="">
                            </div>
                            <div class="dec">
                                <div class="title">{{info.bookName}}</div>
                                <div class="text">作&emsp;&emsp;者：{{info.bookAuthor}}</div>
                                <div class="text textFlex">推荐指数：<el-rate v-model="info.recommendIndex" disabled></el-rate></div>
                                <div class="text">书籍借阅：{{ info.borrowOrgName }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="introduce">
                    <div class="tabs clearfix">
                        <div class="tab" :class="currentIndex==index?'active':''" v-for="(item,index) in tabs" @click="changeTab(index)">{{item.name}}</div>
                    </div>
                    <div class="textView" v-html="content"></div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script>
import bookDetail from "./bookDetail.js";
export default bookDetail;
</script>
<style lang="scss" src="./bookDetail.scss" scoped></style>
  