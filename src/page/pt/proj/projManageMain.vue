<template>
    <div class="projManageMain" id="projManageMain">
        <div class="projManageLeft" v-show="showIt">
            <div class="addView">
                <el-button size="mini" icon="el-icon-plus" type="text" @click="addIt" v-entity="1007102">新建迭代</el-button>
            </div>
            <div class="list">
                <el-scrollbar>
                    <div class="item" :class="item.state==0 ?'disabled':''" v-for="item in itList" :style="itId === item.id ?'background-color: #def1ff':''" @click="doQueryItRelItem(item)">
                        <div class="title">{{ item.name }}
                          <el-popconfirm
                              confirm-button-text='确认'
                              cancel-button-text='取消'
                              icon="el-icon-info"
                              icon-color="red"
                              title="确认删除迭代吗？"
                              @confirm="delIt(item)"
                              v-if="item.state==1"
                              v-entity="1007104">
                            <span class="detail fr"  slot="reference"><img src="/static/image/del.jpg" style="height: 15px;width: 15px;"/></span>
                          </el-popconfirm>
                          <span class="state" v-if="item.state==0">完成</span>
                        </div>
                        <div class="date">{{ item.startDate }} ~ {{ item.endDate }} <span class="detail fr" @click="viewIt(item)">详情 ></span></div>
                        <div class="progressBar">
                            <el-progress :percentage="item.percentage" :show-text="false"></el-progress>
                            <span class="number">{{ item.doneNum }}/{{ item.totalNum }}</span>
                        </div>
                    </div>
                </el-scrollbar>
            </div>
        </div>
        <div class="projManageRight">
            <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
            <keep-alive>
                <component ref="ref" :is="componentName" @openTab="openTab" style="height: calc(100% - 41px)"></component>
            </keep-alive>
        </div>

      <!-- 新增迭代 begin-->
      <el-dialog :title="!modifyFlag?'新建迭代':'迭代详情'" :visible.sync="showItFlag" width="540px" :close-on-click-modal="false" :close-on-press-escape="false">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item100">
              <label class="label-term"><em>*</em>迭代名称</label>
              <div class="input-text">
                <el-input v-model="info.name" maxlength="50" placeholder="" :disabled="itDisabled" @change="updateInfoByField('name')"></el-input>
              </div>
            </li>
          </ul>
          <ul class="content clearfix">
            <li class="item">
              <label class="label-term"><em>*</em>开始日期</label>
              <div class="input-text">
                <el-date-picker v-model="info.startDate" type="date" placeholder="" value-format="yyyy-MM-dd" :disabled="itDisabled" @change="updateInfoByField('startDate')"></el-date-picker>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>结束日期</label>
              <div class="input-text">
                <el-date-picker v-model="info.endDate" type="date" placeholder="" value-format="yyyy-MM-dd" :disabled="itDisabled" @change="updateInfoByField('endDate')"></el-date-picker>
              </div>
            </li>
          </ul>
          <ul class="content clearfix"  v-if="modifyFlag">
            <li class="item item100">
              <label class="label-term">状态</label>
              <div class="input-text">
                <el-switch v-model="info.state == 1" @change="changeInfoSwitch(info)" :disabled="itDisabled"  active-color="#13ce66" inactive-color="#ff4949"/>
                <span class="name">{{ info.state == 1 ? "开启" : "关闭" }}</span>
              </div>
            </li>
          </ul>

          <ul class="content clearfix">
            <li class="item item100">
              <label class="label-term">备注</label>
              <div class="input-text">
                <el-input v-model="info.contentDesc" type="textarea" maxlength="200" placeholder="" :disabled="itDisabled" @change="updateInfoByField('contentDesc')"></el-input>
              </div>
            </li>
          </ul>
          <ul class="content clearfix">
            <li class="item item25">
              <label class="label-term">总工时</label>
              <div class="input-text" style="color: red">{{info.totalWorkHoursNum}}</div>
            </li>
            <li class="item item25">
              <label class="label-term">外部需求工时</label>
              <div class="input-text" style="color: red">{{info.innerWorkHoursNum}}</div>
            </li>
            <li class="item item25">
              <label class="label-term">内部需求工时</label>
              <div class="input-text" style="color: red">{{info.outWorkHoursNum}}</div>
            </li>
            <li class="item item25">
              <label class="label-term">产品需求工时</label>
              <div class="input-text" style="color: red">{{info.prodWorkHoursNum}}</div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="showItFlag=false;">关闭</el-button>
            <el-button type="primary" size="mini" @click="saveIt()" v-if="!modifyFlag">提交</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 新增迭代 end-->

    </div>
</template>

<script>
import notFindPage from "@/page/notFindPage/notFindPage.vue"
import innerTab from "@/components/innerTab/innerTab.vue"
import requirementManage from './requirement/requirementManage.vue'
import taskManage from './task/taskManage.vue'
import bugManage from './bug/bugManage.vue'
import iterationManage from "./iteration/iterationManage.vue";

export default {
    name: 'projManageMain',
    props: [],
    data() {
        return {
          tabs: this.initTabs(),
          componentName: this.initComponent(),
          showIt:false,
          itList:[],
          itId:'',
          showItFlag:false,
          info:{},
          oldInfo:{},
          itDisabled:false,
          modifyFlag:false,
        }
    },
    mounted() {        
        this.$refs.ref.doQuery();
    },
    methods: {
      async selectCallback(data) {
        this.tab = data;
        this.componentName = data.router;
        if (data.name == '迭代管理') {
          this.showIt = true;
          await this.doQueryItList();
          this.$parent.$refs.navMenu.navMenuSwitchTab(false);
        } else {
          this.showIt = false;
          this.$parent.$refs.navMenu.navMenuSwitchTab(true);
        }
      },
      /** 切换是否退货 */
      changeInfoSwitch(item) {
        item.state = item.state == 1 ? 0 : 1;
        this.updateInfoByField('state');
        this.$forceUpdate();
      },

      addIt(){
        this.info={};
        this.modifyFlag = false;
        this.itDisabled = false;
        this.showItFlag = true;
        this.$forceUpdate();
      },
      delIt(item){
        let that = this;
        if(item.totalNum>0){
          that.$message.error("该迭代下有关联项目，不能删除！");
          return;
        }
        this.common.postUrl("projIterationTF", "delIterationInfo", {id:item.id}, function (data) {
          if (that.common.isNotBlank(data)) {
            that.$message.success("删除成功！");
            that.doQueryItList();
          }
        },null,'',true);
      },
      viewIt(item){
        this.itDisabled = true;
        let entityIds = localStorage.getItem("entityIds").split(",");
        entityIds.forEach(item => {
          if(item == 1007103){
            this.itDisabled = false;
          }
        });
        this.info = item;
        this.oldInfo = this.common.copyObj(item);
        this.modifyFlag = true;
        this.showItFlag = true;
        this.$forceUpdate();
      },
      updateInfoByField(field){
        if(!this.modifyFlag){
          return;
        }
        let param = {
          id:this.info.id,
          fieldName:field,
          fieldValue:this.info[field]
        };
        if(field == 'name' && this.common.isBlank(this.info.name)){
          this.$message.error("名称不能为空");
          this.info[field] = this.oldInfo[field];
          return;
        }
        if(field == 'startDate' && this.common.isBlank(this.info.startDate)){
          this.$message.error("开始日期不能为空");
          this.info[field] = this.oldInfo[field];
          return;
        }
        if(field == 'endDate' && this.common.isBlank(this.info.endDate)){
          this.$message.error("结束日期不能为空");
          this.info[field] = this.oldInfo[field];
          return;
        }
        if (field == 'startDate' || field == 'endDate') {
          if (this.common.isNotBlank(this.info.startDate) && this.common.isNotBlank(this.info.endDate) && this.info.startDate > this.info.endDate) {
            this.$message.error("结束日期不能小于日期时间！");
            this.info[field] = this.oldInfo[field];
            return;
          }
        }

        let that = this;
        this.common.postUrl("projIterationTF", "updateIterationInfoByField", param, function (data) {
          if (that.common.isNotBlank(data)) {
            that.doQueryItList();
          }
        },null,'',true);
        this.$forceUpdate();
      },

      async saveIt() {
        if(this.common.isBlank(this.info.name)){
          this.$message.error("名称不能为空");
          return;
        }
        if(this.common.isBlank(this.info.startDate)){
          this.$message.error("开始时间不能为空");
          return;
        }
        if(this.common.isBlank(this.info.endDate)){
          this.$message.error("结束日期不能为空");
          return;
        }
        if(this.info.startDate>this.info.endDate){
          this.$message.error("结束日期不能小于开始日期！");
          return;
        }
        let that  = this;
        this.common.postUrl("projIterationTF", "addIterationInfo", this.info, function (data) {
          if (that.common.isNotBlank(data)) {
            that.$message.success("新增成功！");
            that.showItFlag = false;
            that.doQueryItList();
          }
        },null,'',true);
      },
      async doQueryItList() {
        this.itList = await this.common.postUrl("projIterationTF", 'queryProjIterationInfoList', {});
        if (this.itList.length > 0) {
          this.itId = this.itList[0].id;
          this.$nextTick(() => {
            this.$refs.ref.itId = this.itId;
            this.$refs.ref.doQuery();
          });
        }
      },
        doQueryItRelItem(item){
          this.itId = item.id;
          this.$refs.ref.itId = this.itId;
          this.$refs.ref.doQuery();
        },
        /**
         * 往上层调用打开页面的
         * @returns {*}
         */
        openTab(item) {
            this.$emit('openTab', item);
        },
        /**
         * 初始化tabs
         * @returns {*}
         */
        initTabs() {
            this.tabs = [];
            let entityIds = localStorage.getItem("entityIds").split(",");
            let set = new Set();
            entityIds.forEach(item => {
                if (item == 1007085 && !set.has("需求管理")) {
                    this.tabs.push({name: "需求管理", active: false, router: 'requirementManage'});
                    set.add("需求管理");
                }else if(item == 1007086 && !set.has("任务管理")) {
                  this.tabs.push({name: "任务管理", active: false, router: 'taskManage'});
                  set.add("任务管理");
                }else if(item == 1007087 && !set.has("缺陷管理")) {
                  this.tabs.push({name: "缺陷管理", active: false, router: 'bugManage'});
                  set.add("缺陷管理");
                }else if(item == 1007088 && !set.has("迭代管理")) {
                  this.tabs.push({name: "迭代管理", active: false, router: 'iterationManage'});
                  set.add("迭代管理");
                }
            })
            if (this.tabs.length === 0)
                this.componentName = 'notFindPage';
            return this.tabs;
        },
        /**
         * 初始化组件
         * @returns {*}
         */
        initComponent()
        {
            if (this.tabs.length > 0)
                this.tabs[0].active = true;
            return this.tabs[0].router;
        },
    },
    components: {
      requirementManage,
      taskManage,
      bugManage,
      iterationManage,
      notFindPage,
      innerTab
    }
}
</script>
<style lang="scss" scoped>
.projManageMain{
    display: flex;
    /deep/ .projManageLeft{
        width: 240px;
        background-color: #fff;
        margin-right: 30px;
        border: $border;
        box-sizing: border-box;
        .addView{
            padding: 10px;
            border-bottom: $border;
            margin-bottom: 5px;
            // text-align: center;
        }
        .list{
            height: calc(100% - 55px);
            .el-scrollbar{
                height: 100%;
                .el-scrollbar__wrap{
                    overflow-x: hidden;
                }
            }
            .item{
                padding: 10px 16px;
                border-bottom: $border;
                &.disabled{
                  .title{
                    color: #999;
                  }
                  .el-progress-bar__inner{
                    background-color: #999;
                  }
                }
                &:hover{
                    background: #f7f7ff;
                    border-radius: 5px;
                    cursor: pointer;
                }
                .title{
                    font-size: 14px;
                    margin-bottom: 5px;
                    .state{
                      color: $main-color;
                      background-color: #e0edf9;
                      float: right;
                      border-radius: 3px;
                      padding: 1px 6px;
                      font-size: 12px;
                      line-height: 18px;
                    }
                }
                .date{
                    color: #999;
                }
                .progressBar{
                    display: flex;
                    align-items: center;
                    margin-top: 10px;
                    padding-top: 4px;
                    border-top: 1px dashed $border-color;
                    .el-progress{
                        flex: 1;
                    }
                    .number{
                        margin-left: 20px;
                        color: #999;
                    }
                }
            }
        }
    }
    .projManageRight{
        height: 100%;
        flex: 1;
    }
}
</style>