<template>
  <div id="examineCenter" class="examineCenterPage">
      <div class="reportList clearfix">
          <div class="item" v-entity="1007029" @click="go('/pt/fc/examine/fcExamineInfoManage.vue', 1007029,  '财务绩效考核')">
              <div class="time"></div>
              <div class="con">
                <div class="name">财务绩效考核</div>
                <div class="introduce">财务部门提供考核指标数据，指标名称可以根据考核需求做年度增减变动调整，月度、年度指标手工填写。</div>
                <ul class="info clearfix">
                    <li class="fl">
                      <el-button @click.stop="go('/pt/fc/examine/fcExamineInfoManage.vue', 1007029,  '财务绩效考核')">列表</el-button>
                    </li>
                    <li class="fr">
                      <el-button  @click.stop="toFcExamineDetail">查看</el-button>
                    </li>
                </ul>
              </div>
          </div>
           <!-- v-entity="1007038" -->
          <div class="item" v-entity="1007038" @click="go('/pt/dataReport/questionnaire/questionnaireManager.vue', 1007038,  '问卷管理')">
              <div class="time"></div>
              <div class="con">
                <div class="name">问卷管理</div>
                <div class="introduce">平台用户通过后台创建问卷模板并投放后，客户通过投放链接提交问卷答案，平台通过客户答卷数据生成相应的问卷报表。</div>
                <ul class="info clearfix">
                    <li class="fl">
                      <el-button @click.stop="go('/pt/dataReport/questionnaire/questionnaireManager.vue', 1007038,  '问卷管理')">列表</el-button>
                    </li>
                    <li class="fr">
                      <el-button  @click.stop="toQuestionnaireReportMain">查看</el-button>
                    </li>
                </ul>
              </div>
          </div>

        <!-- v-entity="1007038" -->
        <div class="item" v-entity="1007050" @click="go('/pt/dataReport/wmsExamine/wmsExamineStatisticsManage.vue', 1007050,  '核查统计')">
          <div class="time"></div>
          <div class="con">
            <div class="name">物流中心绩效考核</div>
            <div class="introduce">用户通过小程序提交相关核查数据，后台根据用户提交的数据与平台运作数据生成相应的绩效统计数据及相关报表。</div>
            <ul class="info clearfix">
              <li class="fl">
                <el-button @click.stop="go('/pt/dataReport/wmsExamine/wmsExamineStatisticsManage.vue', 1007050,  '核查统计')">列表</el-button>
              </li>
              <li class="fr">
                <el-button  @click.stop="toWmsExamineItemStatisticsManage">查看</el-button>
              </li>
            </ul>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import examineCenter from "./examineCenter.js"
  export default examineCenter
</script>
<style lang="scss" src="./examineCenter.scss"></style>
