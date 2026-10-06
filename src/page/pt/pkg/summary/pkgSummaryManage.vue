<template>
  <div id="pkgSummaryManage">
    <div class="search-list clearfix">
      <div class="search-form clearfix">
        <div class="item">
          <label class="label">包装名称：</label>
          <div class="input-text">
            <el-input v-model="query.fuzName" placeholder="搜索包装名称" type="text"></el-input>
          </div>
        </div>
<!--        <div class="item">-->
<!--          <label class="label">使用客户：</label>-->
<!--          <div class="input-text">-->
<!--            <el-input v-model="query.custName" placeholder="搜索使用客户" type="text"></el-input>-->
<!--          </div>-->
<!--        </div>-->
        <div class="item">
          <label class="label">包装类型：</label>
          <div class="input-text">
            <el-select v-model="query.packType" placeholder="请选择"  clearable>
              <el-option v-for="item in packTypeOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
              </el-option>
            </el-select>
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
    </div>


    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>包装汇总</span>
          <el-tooltip effect="light" content="包装汇总列表" placement="right">
<!--            <img class="tip" src="@/static/image/tip.png" alt="">-->
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="showAddDialog(true)" v-entity="1004010">新增包装</el-button>
          <el-button type="primary" plain size="mini" @click="displayDialog(2)" v-entity="1004011">修改包装</el-button>
          <el-button type="danger" plain size="mini" @click="delPgkInfo()" v-entity="1004012">删除包装</el-button>
          <el-button type="primary" plain size="mini" @click="showAllocateDialog(true)" v-entity="1004013">内部调拨</el-button>
          <el-button type="primary" plain size="mini" @click="toShowPkgBizDetail()" v-entity="1004014">库存明细</el-button>
          <el-button type="primary" plain size="mini" @click="toPackMonitor()" v-entity="1004015">查看库存位置</el-button>
        </div>
      </div>
      <tableCommon tableName="pkgSummaryManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head" :doQrySum="true" :singleSelect="true">
        <template v-slot:default="{item}">
          <a href="javascript:void(0);" v-show="item.packImgId" class="link" @click.stop="showPkgImg(item)" style="margin: 0 10px;">查看</a>
        </template>
      </tableCommon>
    </div>

    <!-- 查看大图 -->
    <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    <!-- 新建包装 开始-->
    <el-dialog :title="title" :visible.sync="isShowAddDialog" width="600px" :close-on-click-modal="false" :close-on-press-escape="false" @close="showAddDialog(false)">
      <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item90">
              <label class="label-term"><em>*</em>包装名称</label>
              <div class="input-text">
                <el-input v-model="pkgInfo.name" placeholder="必填"></el-input>
              </div>
            </li>
            <li class="item item90">
              <label class="label-term"><em>*</em>包装类型</label>
              <div class="input-text">
                <el-select v-model="pkgInfo.packType" placeholder="请选择" clearable>
                  <el-option v-for="item in packTypeOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item item90">
              <label class="label-term">包装配件</label>
              <div class="input-text">
                <el-select v-model="pkgInfo.packComponents" placeholder="请选择" clearable multiple>
                  <el-option v-for="item in packComponentOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item item90">
              <label class="label-term">长</label>
              <div class="input-text">
                <el-input v-model="pkgInfo.length" placeholder="包装长度(mm)"></el-input>
              </div>
            </li>
            <li class="item item90">
              <label class="label-term">宽</label>
              <div class="input-text">
                <el-input v-model="pkgInfo.width" placeholder="包装宽度(mm)"></el-input>
              </div>
            </li>
            <li class="item item90">
              <label class="label-term">高</label>
              <div class="input-text">
                <el-input v-model="pkgInfo.height" placeholder="包装高度(mm)"></el-input>
              </div>
            </li>
          </ul>

        <ul class="content clearfix">
          <li class="item img-upload">
            <label class="label-term">包装图片</label>
            <div class="input-text">
              <myFileModel ref="pkgImg" @successCallback="successCallback" :disabledEdit="false" :disabledDel="false"></myFileModel>
            </div>
          </li>
        </ul>

        <div class="page-bot-btn ">
          <el-button size="mini" @click="showAddDialog(false)">关闭</el-button>
          <el-button type="primary" size="mini" @click="savePkgData" >提交</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 新建包装 结束-->



    <!-- 内部调拨 开始-->
    <el-dialog  title="内部调拨" :visible.sync="isShowAllocateDialog" :close-on-click-modal="false" :close-on-press-escape="false"
               width="600px" @close="showAllocateDialog(false)">
      <div class="common-info" style="border:none;padding:0;">
<!--        <em style="font-size:14px;padding-left:22px;">注：从A客户调拨到B客户，确定调拨之后会更新包装库存，并且开始重新计费</em>-->
        <em style="font-size:14px;padding-left:22px;">注：调拨之后会更新包装库存，并且开始重新计费</em>
        <ul class="content clearfix" style="margin-top:10px;">
          <li class="item item90">
            <label class="label-term"><em>*</em>客户名称</label>
            <div class="input-text">
              <el-select v-model="pkgAllocateInfo.custTenantId" placeholder="请选择" @change="selectContractCust" clearable filterable>
                <el-option v-for="item in custTenantOptions" :key="item.custTenantId" :label="item.name" :value="item.custTenantId" >
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="item item90">
            <label class="label-term"><em>*</em>包装名称</label>
            <div class="input-text">
              <el-select v-model="pkgAllocateInfo.packId" placeholder="请选择" clearable filterable>
                <el-option v-for="item in pkgOptions" :key="item.pkgId" :label="item.pkgName" :value="item.pkgId" >
                </el-option>
              </el-select>
            </div>
          </li>
<!--          <li class="item item90">-->
<!--            <label class="label-term"><em>*</em>出库地</label>-->
<!--            <div class="input-text">-->
<!--              <el-select v-model="pkgAllocateInfo.outWorkId" placeholder="作业点" clearable>-->
<!--                <el-option v-for="item in outWorkNodeOptions" :key="item.workId" :label="item.workName" :value="item.workId" >-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </div>-->
<!--          </li>-->
          <li class="item item90">
            <label class="label-term"><em>*</em>交付地</label>
            <div class="input-text">
              <el-select v-model="pkgAllocateInfo.receiptWorkId" placeholder="客户作业点" clearable>
                <el-option v-for="item in inWorkNodeOptions" :key="item.workId" :label="item.workName" :value="item.workId" >
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="item item90">
            <label class="label-term"><em>*</em>调拨数量</label>
            <div class="input-text">
              <el-input v-model="pkgAllocateInfo.allocatQuantity" placeholder="请输入调拨数量"></el-input>
            </div>
          </li>
          <li class="item item90">
            <label class="label-term"><em>*</em>开始计费</label>
            <div class="input-text">
              <el-date-picker v-model="pkgAllocateInfo.chargeDate" type="date" placeholder="开始计费日期"
                              value-format="yyyy-MM-dd"></el-date-picker>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>包装明细</label>
          </li>
          <li class="item item100" style="margin-top:10px;margin-left: 100px;">
            <my-import ref="myImport" :handle-success="importPkgAllocateSuccess" :noneDialog="true" template="/download/pkg_allocate.xls" title="内部调拨"
                       tip="仅允许导入“xls”或“xlsx”格式文件！" bean="pkgPackInfoTF" method="allocateHandler" repeatCheckNums="0" :param="pkgAllocateInfo"></my-import>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="showAllocateDialog(false)">关闭</el-button>
          <el-button type="primary" size="mini" @click="submitPkgAllocateData()">确认</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 内部调拨 结束-->

  </div>
</template>

<script>
import pkgSummaryManage from './pkgSummaryManage.js'
export default pkgSummaryManage
</script>


<style scoped>
</style>
