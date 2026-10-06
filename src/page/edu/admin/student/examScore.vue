<template>
    <div id="examScore" class="examScorePage">
      <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery" :query="query" searchKey="examScoreSearch"/>

      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>考试评卷</span>
                </h3>
            </div>
            <tableCommon tableName="examScoreTable" ref="table" :showSelect="false" :singleSelect="true" :showNum="true" :showSetTable="false" :head="head" @dblclickItem="toDetail">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link" @click.stop="againExam(item)" v-if="item.markState != 9">简答题评分</a>
                    <span v-else>-</span>
                </template>
            </tableCommon>
        </div>
    </div>
</template>
  
<script>
import examScore from "./examScore.js";
export default examScore;
</script>
<style lang="scss"  scoped></style>
  