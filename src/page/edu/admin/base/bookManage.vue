<template>
    <div id="bookManage" class="bookManagePage">
        <div class="main_content">
            <div class="course">
                <div class="opView" @keydown.enter="doQuery">
                    <el-button type="primary" plain @click="addBook">新增</el-button>
                    <el-button type="primary" plain @click="editBook">修改</el-button>
                    <el-button type="primary" plain @click="delBook">删除</el-button>
                    <el-button type="primary" plain @click="bookDetail">查看</el-button>
                    <el-input class="fr" placeholder="搜索书籍" suffix-icon="el-icon-search" v-model="info.bookName"></el-input>
                </div>
                <div class="courseList">
                    <div class="item" v-for="item in list">
                        <el-checkbox v-model="item.isSelect"></el-checkbox>
                        <div class="content">
                            <div class="coverImg">
                                <img :src="item.imgUrl" alt="">
                            </div>
                            <div class="dec">
                                <div class="title">{{item.bookName}}</div>
                                <div class="text">作&emsp;&emsp;者：{{item.bookAuthor}}</div>
                                <div class="text textFlex">推荐指数：<el-rate v-model="item.recommendIndex" disabled></el-rate></div>
                                <div class="text">书籍借阅：{{ item.borrowOrgName }}</div>
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
    </div>
</template>
  
<script>
import bookManage from "./bookManage.js";
export default bookManage;
</script>
<style lang="scss" src="./bookManage.scss" scoped></style>
  