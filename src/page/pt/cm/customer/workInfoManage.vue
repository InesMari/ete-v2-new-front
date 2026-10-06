<template>
    <div id="workInfoManage">
      <select-work v-show="showSelWork"></select-work>
        <div class="search-list clearfix" v-show="!showSelWork">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">作业点名称：</label>
                    <div class="input-text">
                        <el-input v-model="loadParam.workName" placeholder="作业点名称" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">作业点地址：</label>
                    <div class="input-text">
                        <el-input v-model="loadParam.workAddress" placeholder="作业点地址" type="text"
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
                    <span>作业点列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="作业点列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn"  style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="add(true)" v-entity="1001030" v-if="isWmsWork!=1">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="modify(2)" v-entity="1001033"  v-if="isWmsWork!=1">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="del()" v-entity="1001031"  v-if="isWmsWork!=1">删除</el-button>
<!--                    <el-button type="primary" plain size="mini" @click="modify(1)" v-entity="1001032"  v-if="isWmsWork!=1">查看</el-button>-->
                    <el-button type="primary" plain size="mini" @click="modifyMapDraw()" v-entity="1001034" >查看电子围栏</el-button>
                    <el-button type="primary" plain size="mini" @click="addressLibrary()" v-if="isWmsWork==1">地址库</el-button>
                    <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                </div>
            </div>
            <tableCommon tableName="workInfoManageTable" ref="table" :head="head" :singleSelect="true" :showNum="true" :showSetTable="true" @dblclickItem="dblclickItem"></tableCommon>
        </div>

        <!-- 新增 作业点 -->
        <el-dialog :title="title" :visible.sync="showModify" width="520px" :close-on-click-modal="false" :close-on-press-escape="false" @close="add(false)">
            <div class="identify clearfix" v-if="showIdentify">
                <el-input type="textarea" v-model="identifyText" placeholder="黏贴信息，自动拆分详细地址、联系人、电话" @input="$forceUpdate();"></el-input>
                <el-button size="mini" type="primary" class="fr" @click="identify">识别</el-button>
            </div>
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>名称</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.workName" maxlength="100" placeholder="请输入作业点名称" :disabled="disabled"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>所在地区</label>
                        <div class="input-text">
                            <el-select v-model="workInfo.provinceId" placeholder="省" filterable @change="changeProvinceSelect" disabled style="width:23%;margin-right:2%;">
                                <el-option v-for="item in provinceData" :key="item.id" :label="item.name"
                                           :value="item.id" :disabled="item.disabled"></el-option>
                            </el-select>
                            <el-select v-model="workInfo.cityId" placeholder="市" filterable @change="changeCitySelect" :disabled="isNotDistrict" style="width:23%;margin-right:2%;">
                                <el-option v-for="item in cityData" :key="item.id" :label="item.name"
                                           :value="item.id" :disabled="item.disabled"></el-option>
                            </el-select>
                            <el-select v-model="workInfo.districtId" placeholder="区" filterable :disabled="isNotDistrict" style="width:23%;margin-right:2%;">
                                <el-option v-for="item in districtData" :key="item.id" :label="item.name"
                                           :value="item.id" :disabled="item.disabled"></el-option>
                            </el-select>
                            <el-button type="primary" @click="showMap" style="width:25%;" v-if="!disabled">地图选择</el-button>
                            <map-dialog ref="mapDialog" :isShowMap="isShowMap" :mapPoint="mapPoint" :hideBtn="showMapBotton" @sureCallback="sureWorkAddress" @hideMapBack="hideMapBack" :modal="false"></map-dialog>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>街道地址</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.address" maxlength="200" placeholder="不需要重复填写省/市/区" :disabled="disabled" @input="forceUpdate"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">电子围栏范围</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.electricFence" maxlength="100" :placeholder="electricPlace" :disabled="disabled || isOverlays" style="width:73%;" v-if="!disabled"></el-input>
                            <el-button type="primary" @click="showMapDraw" class="fr" style="width:25%;" v-if="!disabled">手工绘制</el-button>
                            <el-button type="primary" @click="showMapDraw" class="fr" style="width:100%;" v-if="disabled">查看电子围栏范围</el-button>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>类型</label>
                        <div class="input-text">
                            <el-radio v-model="workInfo.workinfoType" label="1" :disabled="disabled">作业点</el-radio>
                            <el-radio v-model="workInfo.workinfoType" label="2" :disabled="disabled">仓库</el-radio>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">联系人</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.linkmanName" maxlength="50" placeholder="请输入联系人" :disabled="disabled"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">联系手机</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.bill" v-mynumval maxlength="11" placeholder="请输入联系手机" :disabled="disabled"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">联系电话</label>
                        <div class="input-text">
                            <el-input v-model="workInfo.phone" maxlength="50" placeholder="请输入联系电话" :disabled="disabled"></el-input>
                        </div>
                    </li>
                    <li class="item item100" v-if="libraryType==1">
                      <label class="label-term"><em>*</em>关联仓库</label>
                      <div class="input-text">
                        <el-select v-model="workInfo.parentIds" placeholder="关联仓库" filterable multiple clearable :disabled="disabled">
                          <el-option v-for="item in workList" :key="item.workId" :label="item.workName"
                                     :value="item.workId" :disabled="item.disabled"></el-option>
                        </el-select>
                      </div>
                    </li>
                  <li class="item item100" v-if="libraryType==1">
                    <label class="label-term">客户作业类型</label>
                    <div class="input-text">
                      <el-select v-model="workInfo.workType" placeholder="客户作业类型" filterable clearable :disabled="disabled">
                        <el-option v-for="item in custWorkTypeData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue" :disabled="item.disabled"></el-option>
                      </el-select>
                    </div>
                  </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="add(false)">关闭</el-button>
                    <el-button type="primary" v-show="!disabled" size="mini" @click="saveWorkInfo()">提交</el-button>
                </div>
            </div>
        </el-dialog>

        <map-dialog ref="mapDialogDraw" mapName="draw" :isShowMap="isShowMapDraw" :mapPoint="mapPointDraw" :drawPoints="drawPoints" :isDraw="isDraw" @sureCallback="sureWorkAddressDraw"
                    @hideMapBack="hideMapBackDraw" :modal="true" :hideBtn="showMapBotton"></map-dialog>
    </div>
</template>

<script>
    import workInfoManage from './workInfoManage.js'

    export default workInfoManage
</script>
<style lang="scss" scoped>
.identify{
    border-bottom: 1px dashed $border-color;
    margin-bottom: 20px;
    /deep/ .el-textarea{
        width: 90%;
        float: right;
        .el-textarea__inner{
            height: 70px;
        }
    }
    /deep/ .el-button{
        margin: 10px 0;
    }
}
</style>
