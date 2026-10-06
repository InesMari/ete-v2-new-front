<template>
    <div id="examRecord" class="examRecordPage">
        <div class="common-info">
            <div class="integral">
                <img src="@/static/image/login_box_bg.png" alt="">
                <div class="content">
                    <div class="name">{{ userName }}</div>
                    <div class="info clearfix">
                        <span>总学分：<em>{{info.scoreSum}}</em></span>
                        <span>总排名：<em>{{info.ranking}}</em></span>
                    </div>
                </div>
            </div>
            <div class="tipShow">本日获得学分：{{info.todayScoreSum}}分；本周获得学分：{{info.weekScoreSum}}分；本月获得学分：{{info.monthScoreSum}}分；</div>
        </div>
        
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>考试记录</span>
                </h3>
            </div>
            <tableCommon tableName="examRecordTable" ref="table" :showSelect="false" :singleSelect="true" :showNum="true" :showSetTable="false" :head="head" @dblclickItem="toDetail">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link" @click.stop="againExam(item)">重新答题</a>
                </template>
            </tableCommon>
        </div>
    </div>
</template>
  
<script>
import examRecord from "./examRecord.js";
export default examRecord;
</script>
<style lang="scss" src="./examRecord.scss" scoped></style>
  