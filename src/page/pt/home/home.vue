<template>
  <div id="home" class="homePage" @click="hideDom">
    <div class="home_main">
      <!-- 侧边栏 -->
      <div class="slide_bar fl" :style="isshowNav?'':'width:64px'">
        <div class="logo2" v-show="isshowNav">
          <img class="logo2-icon" src="@/static/image/logo.png" alt="">
        </div>
        <div class="logo3" v-show="!isshowNav">
          <img class="logo2-icon" src="@/static/image/logo3.png" alt="">
        </div>
        <navMenu ref="navMenu" @openTab="openTab" @navMenuSwitch="navMenuSwitch"></navMenu>
      </div>
      <!-- 侧边栏结束 -->
      <div class="home_main_right fr" :style="isshowNav?'':'width:calc(100% - 64px)'">
      <!-- 右侧 -->
        <!-- 右侧头部 -->
        <div class="header">
          <div class="marquee">
            <img src="@/static/image/marquee.png" alt="">
            <div style="overflow:hidden;">
              <el-carousel height="30px" :interval="5000" indicator-position="none" arrow="never">
                <el-carousel-item v-for="item in marqueeList">
                  <h3 class="small">{{item.content}}&nbsp;&nbsp;<a class="link" @click="doSomething(item)">查看详情</a></h3>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
          <div>
            <el-tooltip class="item" effect="dark" content="薪资系统" placement="bottom">
              <img class="xz_icon" src="@/static/image/xz_icon.png" alt="" @click="toSalary">
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="帮助中心" placement="bottom">
              <i class="el-icon-question fl helpCenterIcon" @click="isshowHelpCenter = true"></i>
            </el-tooltip>
            <a class="operate fl" @click="showOperationDialog = true" href="javascript:;" title="操作教程" style="position:relative;left:20px;">
              <img class="sop-icon" src="@/static/image/sop.png" alt="">
            </a>
            <el-popover
              placement="top"
              width="300"
              trigger="hover"
              popper-class="home-collectList">
              <div class="collectList clearfix">
                <div class="item" v-for="(item,index) in userMenuLabel" :key="index" @click="toUserMenuLabel(item)">
                  <i class="el-icon-error" @click.stop="delUserMenuLabel(item.id)"></i>
                  <a>{{item.menuName}}</a>
                </div>
                <div class="noData" v-if="userMenuLabel.length == 0">暂无收藏菜单</div>
              </div>
              <img class="collect-icon fl" src="@/static/image/star1.png" slot="reference" alt="">
            </el-popover>
            <div class="home-el-dropdown-menu fl">
              <img class="message-icon" src="@/static/image/message.png" alt="" @click="showAgency">
              <span class="numTip" v-show="todo.totalSum > 0" @click="showAgency"><span>{{todo.totalSum}}</span></span>
            </div>
            <div class="infoList fl" @click.stop="showInfoList">
              <p class="name">{{userName}}</p>
              <ul v-show="isshowInfoList">
                <li @click="toPersonal">个人资料</li>
<!--                <li @click="showModifyDialog=true">修改密码</li>-->
                <li class="haveChild" @click="showChiildList">切换组织
                  <div class="chiildList" v-show="isshowChiildList">
                    <div class="child" :class="{'active':orgId==item.id}" v-for="(item,index) in orgList" @click="selOrg(item)" :key="index">{{item.regionName+'-'+item.orgName}}</div>
                  </div>
                </li>
                <li @click="logout">注销退出</li>
              </ul>
            </div>
          </div>
        </div>
        <!-- 右侧头部结束 -->
        <!-- 主体页面 -->
        <div class="main_content" >
          <div class="tabs clearfix">
            <myTab ref="myTab"></myTab>
          </div>
          <div class="main_frame" ref="mainFrame">
            <!-- 生命周期保持的页面 -->
            <transition name="fade-transform" mode="out-in">
              <keep-alive :include='keepAlivePage'>
                <router-view :key="$route.meta.id" @openTab="openTab" @closeTab="closeTab" @closeToOther="closeToOther" @refreshTab="refreshTab" @closeOthers="closeOthers"></router-view>
              </keep-alive>
            </transition>
            <!-- 切换结束生命周期的页面 -->
            <!-- <router-view :key="$route.meta.id" @openTab="openTab" @closeTab="closeTab" @closeToOther="closeToOther" @refreshTab="refreshTab" v-if="!$route.meta.keep"></router-view> -->
          </div>
        </div>
        <!-- 主体页面 结束 -->

        <el-dialog title="初次登陆，需要您重置密码" :visible.sync="showDialog" :close-on-click-modal="false"
                   :close-on-press-escape="false" width="340px" :show-close="false">
          <div class="common-info" style="border:none;padding:0;">
            <ul class="content clearfix">
              <li class="item item100">
                <label class="label-term">新密码</label>
                <div class="input-text">
                  <el-input type="password" v-model="password" autocomplete="new-password"></el-input>
                </div>
              </li>
              <li class="item item100">
                <label class="label-term">确认密码</label>
                <div class="input-text">
                  <el-input type="password" v-model="confirmPassword" autocomplete="new-password"></el-input>
                </div>
              </li>
            </ul>
            <div class="page-bot-btn " style="padding-right:0px">
              <el-button type="primary" size="mini" @click="modifyPasswordFirst">确认修改</el-button>
            </div>
          </div>
        </el-dialog>

        <el-dialog title="提示" :visible.sync="showOrgDialog" :close-on-click-modal="false"
                   :close-on-press-escape="false" width="450px" :show-close="false">
          <div class="common-info" style="border:none;padding:0;">
            <ul class="content clearfix" style="text-align: center;">
              <li class="item item100" style="margin-top: -10px;">
                你登录的账号存在多个组织，请选择当前业务组织后再进行操作
              </li>
              <li class="item item100" style="margin-top: 10px;">
                <el-radio-group v-model="orgId" style="text-align: left;" >
                    <el-radio style="display: block;margin-bottom: 10px;" :label="item.id"  v-for="item in orgList" :value="item.id" :key="item.id">{{item.regionName+'-'+item.orgName }}</el-radio>
                </el-radio-group>
              </li>
            </ul>
            <div class="page-bot-btn " style="padding-right:0px">
              <el-button type="primary" size="mini" @click="selOrgDlg">确认</el-button>
            </div>
          </div>
        </el-dialog>

        <el-dialog title="修改密码" :visible.sync="showModifyDialog" :close-on-click-modal="false"
                   :close-on-press-escape="false" width="400px" @close="showModifyDialog=false">
          <div class="common-info" style="border:none;padding:0;">
            <ul class="content clearfix">
              <li class="item item100">
                <label class="label-term">手机号码</label>
                <div class="input-text">
                  <el-input v-model="billId" :disabled="true"></el-input>
                </div>
              </li>
              <li class="item item100">
                <label class="label-term">验证码</label>
                <div class="input-text" style="display:flex;">
                  <el-input v-model="smsVaildCode" style="flex: 1;margin-right: 10px;"></el-input>
                  <el-button @click="sendSmsValidCode" :disabled="!stamp">{{msg}}</el-button>
                </div>
              </li>
              <li class="item item100">
                <label class="label-term">新密码</label>
                <div class="input-text">
                  <el-input type="password" v-model="password" autocomplete="new-password"></el-input>
                </div>
              </li>
              <li class="item item100">
                <label class="label-term">确认密码</label>
                <div class="input-text">
                  <el-input type="password" v-model="confirmPassword" autocomplete="new-password"></el-input>
                </div>
              </li>
            </ul>
            <div class="page-bot-btn " style="padding-right:0px">
              <el-button type="primary" size="mini" @click="smsModifyPassword">确认修改</el-button>
            </div>
          </div>
        </el-dialog>

        <!-- 选择操作手册 -->
        <el-dialog title="操作手册章节" class="operationDialog" :visible.sync="showOperationDialog" :close-on-click-modal="false"
                   :close-on-press-escape="false" width="400px" @close="showOperationDialog=false">
          <div class="operationList">            
            <a href="/static/pdf/operationManual.pdf" download class="item">下载全平台操作手册</a>
            <a class="item" v-for="(item,index) in operationList" :href="'/static/pdf/operation/'+item.url" target="_blank">{{index+1}}、{{item.name}}</a>
            <a href="/static/pdf/易迁易平台小助手教程.pdf" class="item">易迁易平台小助手教程</a>
            <a href="/static/pdf/司机小程序定位设置.pdf" class="item">司机小程序定位设置</a>
          </div>
        </el-dialog>

        <el-dialog title="新功能上线通知" :visible.sync="noticeFlag" :close-on-click-modal="false"  :show-close="false"
                   :close-on-press-escape="false" width="450px" @close="noticeFlag=false">
          <div class="common-info" style="border:none;padding:0;">
            <ul class="content clearfix">
              <li class="item item100">
                <label class="label-term">需求标题：</label>
                <div class="input-text"> {{ noticeInfo.title }} </div>
              </li>
              <li class="item item100">
                <label class="label-term">需求编号：</label>
                <div class="input-text">
                  <a class="link" @click="viewRequirement">{{ noticeInfo.requirementNum }}</a>
                </div>
              </li>
              <li class="item item100">
                <label class="label-term">上线日期：</label>
                <div class="input-text"> {{ noticeInfo.onlineDate }} </div>
              </li>
            </ul>
            <div class="page-bot-btn " style="padding-right:0px">
              <el-button type="primary" size="mini" @click="noticeSubmit">{{ noticeBtnStr }}</el-button>
            </div>
            <div style="color: red;float: right;">{{noticeSecStr}}</div>
          </div>
        </el-dialog>

        <!-- 待办事项 -->
        <div class="popup agencyPopup" :class="{'show':isshowAgency}" v-if="loadEntityEnd">
          <div class="popup_bj" @click="closeAgency"></div>
          <div class="popup_content" style="width:400px">
              <div class="agencyTable" v-entity="1010001">
                <div class="agencyTitle"><i class="el-icon-warning-outline"></i>待办事项</div>
                <div class="item" v-entity="1010002">
                    <div class="type">费用</div>
                    <div class="con">
                        <el-button @click="gotoSupplierQuoteZCList()" v-entity="1010004">供应商整车新报价<span class="tipNum" v-show="todo.supplierZCQuote > 0"><span>{{todo.supplierZCQuote}}</span></span></el-button>
                        <el-button @click="gotoSupplierQuoteLDList()" v-entity="1010005">供应商零担新报价<span class="tipNum" v-show="todo.supplierLDSum > 0"><span>{{todo.supplierLDSum}}</span></span></el-button>
                        <el-button @click="gotoCustomerQuoteZCList()" v-entity="1010006">客户整车新报价<span class="tipNum" v-show="todo.customerZCQuoteSum > 0"><span>{{todo.customerZCQuoteSum}}</span></span></el-button>
                        <el-button @click="gotoCustomerQuoteLDList()" v-entity="1010007">客户零担新报价<span class="tipNum" v-show="todo.customerLDSum > 0"><span>{{todo.customerLDSum}}</span></span></el-button>
                        <el-button @click="gotoIncomeFeeManage" v-entity="1010008">收入费用异动审核<span class="tipNum" v-show="todo.incomeFeeSum > 0"><span>{{todo.incomeFeeSum}}</span></span></el-button>
                        <el-button @click="gotoCostFeeManage" v-entity="1010009">成本费用异动审核<span class="tipNum" v-show="todo.costFeeSum > 0"><span>{{todo.costFeeSum}}</span></span></el-button>
                        <el-button @click="gotoFeeChangeManage(1)" v-entity="1006165">收入费用补录审核<span class="tipNum" v-show="todo.incomeFeeChangeSum > 0"><span>{{todo.incomeFeeChangeSum}}</span></span></el-button>
                        <el-button @click="gotoFeeChangeManage(2)" v-entity="1006163">成本费用补录审核<span class="tipNum" v-show="todo.costFeeChangeSum > 0"><span>{{todo.costFeeChangeSum}}</span></span></el-button>
                    </div>
                </div>
                <div class="item" v-entity="1010003">
                    <div class="type">订单</div>
                    <div class="con">
                        <el-button @click="gotoTodoOrder" v-entity="1010010">客户新订单处理<span class="tipNum" v-show="todo.orderSum > 0"><span>{{todo.orderSum}}</span></span></el-button>
<!--                        <el-button  @click="gotoRegionOrder" v-entity="1010011">区域协同订单处理<span class="tipNum" v-show="todo.regionOrderSum > 0"><span>{{todo.regionOrderSum}}</span></span></el-button>-->
                    </div>
                </div>
                  <div class="item" v-entity="1010012">
                      <div class="type">账单</div>
                      <div class="con">
                          <el-button @click="gotoCustomerBill" v-entity="1010029">客户账单待审核<span class="tipNum" v-show="todo.customerBillSum > 0"><span>{{todo.customerBillSum}}</span></span></el-button>
                          <el-button @click="gotoSupplierBill" v-entity="1010030">供应商账单待审核<span class="tipNum" v-show="todo.supplierBillSum > 0"><span>{{todo.supplierBillSum}}</span></span></el-button>
                          <el-button @click="gotoApplyInvoice" v-entity="1010013">客户开票申请<span class="tipNum" v-show="todo.applyInvoiceSum > 0"><span>{{todo.applyInvoiceSum}}</span></span></el-button>
<!--                          <el-button @click="gotoSubmitInvoice" v-entity="1010014">供应商发票提交<span class="tipNum" v-show="todo.submitInvoiceSum > 0"><span>{{todo.submitInvoiceSum}}</span></span></el-button>-->
<!--                          <el-button @click="gotoG7PayApplyVerify" v-entity="1010015">G7付款申请审核<span class="tipNum" v-show="todo.g7PayApplyVerifySum > 0"><span>{{todo.g7PayApplyVerifySum}}</span></span></el-button>-->
<!--                          <el-button @click="gotoGdPayApplyVerify" v-entity="1010016">高登付款申请审核<span class="tipNum" v-show="todo.gdPayApplyVerifySum > 0"><span>{{todo.gdPayApplyVerifySum}}</span></span></el-button>-->
<!--                          <el-button @click="gotoCostAccount" v-entity="1010017">自有车成本记账<span class="tipNum" v-show="todo.costAccountSum > 0"><span>{{todo.costAccountSum}}</span></span></el-button>-->
<!--                          <el-button @click="gotoProjectSundryFeeManage" v-entity="1010028">项目其他费付款<span class="tipNum" v-show="todo.projectSundryFeeCount > 0"><span>{{todo.projectSundryFeeCount}}</span></span></el-button>-->
                          <el-button @click="gotoReceiptsRequestFeeManage" v-entity="1010031">请款单据审核<span class="tipNum" v-show="todo.requestFeeSum > 0"><span>{{todo.requestFeeSum}}</span></span></el-button>
                          <el-button @click="gotoReceiptsFeePayManage" v-entity="1010032">付款单据审核<span class="tipNum" v-show="todo.payFeeSum > 0"><span>{{todo.payFeeSum}}</span></span></el-button>
                      </div>
                    </div>
                  <div class="item" v-entity="1010041">
                    <div class="type">采购</div>
                    <div class="con">
<!--                      <el-button @click="gotoPurchaseApplyManage" v-entity="1010034">采购申请审核<span class="tipNum" v-show="todo.purchaseApplySum > 0"><span>{{todo.purchaseApplySum}}</span></span></el-button>-->
<!--                      <el-button @click="gotoClaimApplyManage" v-entity="1010035">物品领用审核<span class="tipNum" v-show="todo.claimApplySum > 0"><span>{{todo.claimApplySum}}</span></span></el-button>-->
<!--                      <el-button @click="gotoAssetsAllocatManage" v-entity="1010036">固定资产调拨审核<span class="tipNum" v-show="todo.assetsAllocatSum > 0"><span>{{todo.assetsAllocatSum}}</span></span></el-button>-->
                      <el-button @click="gotoPage('/pt/purchase/feeApply/feeApplyManage.vue','feeApplyManage','费用申请审核')" v-entity="1010042">费用申请审核<span class="tipNum" v-show="todo.purFeeApplyInfoSum > 0"><span>{{todo.purFeeApplyInfoSum}}</span></span></el-button>
                      <el-button @click="gotoPage('/pt/purchase/purOrder/purchaseOrderManage.vue','purchaseOrderManage','采购单审核')" v-entity="1010043">采购单审核<span class="tipNum" v-show="todo.purPurchaseSum > 0"><span>{{todo.purPurchaseSum}}</span></span></el-button>
                      <el-button @click="gotoPage('/pt/purchase/consuming/consumingManage.vue','consumingManage','领用审核')"
                                 v-entity="1010044">领用审核<span class="tipNum" v-show="todo.purConsumingSum > 0"><span>{{todo.purConsumingSum}}</span></span></el-button>
                    </div>
                  </div>
                  <div class="item" v-entity="1010033">
                      <div class="type">其他</div>
                      <div class="con">
                          <el-button @click="gotoScheduleTodoManage" v-entity="1010037">运力&计划匹配列表<span class="tipNum" v-show="todo.scheduleSum > 0"><span>{{todo.scheduleSum}}</span></span></el-button>
                          <el-button @click="gotoSectionQuoteManage" v-entity="1010038">询价审计<span class="tipNum" v-show="todo.sectionQuoteAuditSum > 0"><span>{{todo.sectionQuoteAuditSum}}</span></span></el-button>
                          <el-button @click="gotoContractReviewManage(2)" v-entity="1010039">供应商合同评审<span class="tipNum" v-show="todo.contractReviewSum > 0"><span>{{todo.contractReviewSum}}</span></span></el-button>
                          <el-button @click="gotoContractReviewManage(1)" v-entity="1010040">客户合同评审<span class="tipNum" v-show="todo.customerContractReviewSum > 0"><span>{{todo.customerContractReviewSum}}</span></span></el-button>
                      </div>
                  </div>
              </div>
              <div class="page-bot-btn" style="position: relative;">
                  <el-button @click="closeAgency">关闭</el-button>
              </div>
          </div>
        </div>
        <!-- 待办事项 end-->

        
        <!-- 帮助中心 -->
        <div class="popup helpCenterPopup" :class="{'show':isshowHelpCenter}">
          <div class="popup_bj" @click="isshowHelpCenter = false"></div>
          <div class="popup_content" style="width:400px">
            <div class="search" @keydown.enter="filterHelpCenter">
              <el-input type="text" v-model="helpCenterModel" placeholder="输入相关信息"></el-input>
              <el-button type="primary" @click="filterHelpCenter">搜索</el-button>
            </div>
            <div class="quesList">
              <div class="quesType" v-for="typeItem in quesListShow" :key="typeItem.type">
                <h3>{{ typeItem.typeName }}</h3>
                <div class="item" v-for="(item,index) in typeItem.details" :key="item.id" @click="toHelp(item.id)">
                  {{index+1}}、{{ item.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 帮助中心 end-->  

      </div>
      <!-- 右侧 -->
      <!-- 公用遮罩层 -->
      <div class="main-popup" id="mainPopup">
        <div class="main-popup-content">
          <i class="el-icon-loading"></i>
        </div>
      </div>

      <!-- 悬浮菜单开始 -->
      <div class="realTranslationInfos flash" v-if="isShowRealTranslationInfos" @click="setCurrentNoticeInfo">
        <div class="realtranslationBox">
          <img  src="@/static/image/info.png" alt=""
                width="40px" height="40px">
        </div>
        <div style="text-align: center; color: red;">上线通知</div>
      </div>
      <!-- 悬浮菜单结束 -->

      <!-- 聊天悬浮按钮及聊天框 -->
      <chatBox></chatBox>
    </div>
  </div>
</template>

<script>
  import home from "./home.js"
  export default home
</script>

<style lang="scss" src="./home.scss">
</style>
