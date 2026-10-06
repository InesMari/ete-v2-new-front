<template>
  <div id="pickTacticsInfoManage">
    <select-work v-show="showSelWork"></select-work>
    <div class="search-list clearfix" v-show="!showSelWork">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
<!--        <div class="item">-->
<!--          <label class="label">所属货主：</label>-->
<!--          <div class="input-text">-->
<!--            <el-input v-model="loadParam.srcTenantName" placeholder="所属货主" type="text"-->
<!--                      autocomplete="new-password"></el-input>-->
<!--          </div>-->
<!--        </div>-->
        <div class="item">
          <label class="label">策略名称：</label>
          <div class="input-text">
            <el-input v-model="loadParam.tacticsName" placeholder="策略名称" type="text"
                      autocomplete="new-password"></el-input>
          </div>
        </div>
      </div>
      <div class="search-btn clearfix">
        <div class="btn">
          <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
        </div>
        <div class="btn">
          <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
        </div>
      </div>
      <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
      <div class="search-bot">
        <img src="@/static/image/search-bot.png" alt="">
        <i class="icon el-icon-arrow-down"></i>
        <i class="icon el-icon-arrow-up"></i>
      </div>
    </div>
    <div class="table-content" v-show="!showSelWork">
      <div class="table-title">
        <h3>
          <span>拣货策略列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
          <el-tooltip effect="light" content="拣货策略列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="toAddPickTactics(true)"  v-entity="1005068">新建策略</el-button>
          <el-button type="primary" plain size="mini" @click="toUpPickTactics()" v-entity="1005069">修改策略</el-button>
          <el-button type="danger" plain size="mini" @click="delPickTactics()" v-entity="1005070">删除策略</el-button>
        </div>
      </div>
      <tableCommon tableName="pickTacticsInfoManageTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" :singleSelect="true" @dblclickItem="dblclickItem"></tableCommon>
    </div>
    <!-- 新增 拣货策略 -->
    <el-dialog :title="title" class="strategyDialog" :visible.sync="showPickTactics" width="1000px" :close-on-click-modal="false" :close-on-press-escape="false" @close="toAddPickTactics(false)">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item item50">
            <label class="label-term">策略编码</label>
            <div class="input-text">
              <el-input v-model="pickTactics.tacticsNum" placeholder="没有手动输入自动生成" :disabled="isLock"></el-input>
            </div>
          </li>
<!--          <li class="item item50">-->
<!--            <label class="label-term"><em>*</em>所属货主</label>-->
<!--            <div class="input-text">-->
<!--              <el-select v-model="pickTactics.srcTenantId" placeholder="请选择所属货主" clearable filterable :disabled="isLock">-->
<!--                <el-option v-for="item in srcTenantData" :key="item.wId" :label="item.name" :value="item.wId"></el-option>-->
<!--              </el-select>-->
<!--            </div>-->
<!--          </li>-->
          <li class="item item50">
            <label class="label-term"><em>*</em>策略名称</label>
            <div class="input-text">
              <el-input v-model="pickTactics.tacticsName" placeholder="请输入拣货策略名称" :disabled="isLock"></el-input>
            </div>
          </li>
        </ul>
        <div class="clearfix">
          <div class="strategyList fl">
            <h5>策略纬度<span class="fr">{{strategyTable.length}}/{{strategyList.length}}</span></h5>
            <div class="innerList">
              <div class="item clearfix" v-for="(item,index) in strategyList" :key="index">
                  <el-checkbox v-model="item.isShow" @change="$forceUpdate();initStrategyTable();">{{item.codeName}}</el-checkbox>
              </div>
            </div>
          </div>
          <div class="strategyTable fr">
            <el-checkbox class="strategyDefault" v-model="pickTactics.isDefaultFlag" @change="$forceUpdate()">是否默认</el-checkbox>
            <div class="innerTable">
              <div class="tr thead">
                <div class="td" style="width:30%">优先级</div>
                <div class="td" style="width:30%">策略纬度</div>
                <div class="td" style="width:20%">升序</div>
                <div class="td" style="width:20%">降序</div>
              </div>
              <vuedraggable v-model="strategyTable">
                  <transition-group :name="'strategyTable'" type="transition">
                    <div class="tr" v-for="(item,index) in strategyTable" :key="index">
                      <div class="td" style="width:30%">{{index+1}}</div>
                      <div class="td" style="width:30%">{{item.codeName}}</div>
                      <div class="td" style="width:20%">
                        <el-switch v-model="item.ascend" @change="changeAscend(index)"></el-switch>
                      </div>
                      <div class="td" style="width:20%">
                        <el-switch v-model="item.descend" @change="changeDescend(index)"></el-switch>
                      </div>
                    </div>
                  </transition-group>
              </vuedraggable>
            </div>
          </div>
        </div>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="toAddPickTactics(false)">取消</el-button>
          <el-button type="primary" size="mini" @click="savePickTactics()" v-show="!isLock">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import pickTacticsInfoManage from './pickTacticsInfoManage.js'

export default pickTacticsInfoManage
</script>
<style lang="scss">
#pickTacticsInfoManage{
  .strategyDialog{
    .strategyList{
      width: 170px;
      border:$border;
      border-radius: 6px;
      h5{
        line-height: 40px;
        padding:0 12px 0 24px;
        font-size: 16px;
        background: #eaedf4;
        span{
          font-size: 12px;
          color: #999;
        }
      }
      .innerList{
        padding: 10px 24px;
        .item{
          margin:8px 0;
          cursor: pointer;
          line-height: 22px;
        }
      }
    }
    .strategyTable{
      width: calc(100% - 190px);
      box-sizing: border-box;
      border:$border;
      padding:15px 24px;
      min-height: 280px;
      .innerTable{
        margin-top: 20px;
        border-top: $border;
        border-left: $border;
        .tr{
          overflow: hidden;
          cursor: pointer;
          &.thead{
            background: #d1e9ff;
          }
          .td{
            float: left;
            line-height: 50px;
            text-align: center;
            border-bottom: $border;
            border-right: $border;
            box-sizing: border-box;
          }
        }
      }
    }
  }
}
</style>

