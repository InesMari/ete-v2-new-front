<template>
  <div id="list">
    <div class="search-list clearfix">
      <div class="search-form clearfix">
        <div class="item">
            <label class="label">电话</label>
          <div class="input-text">
            <el-input v-model="inputvalue" v-mynumval placeholder="请输入" type="text" autocomplete="new-password"></el-input>
          </div>
        </div>
        <div class="item">
            <label class="label">电话</label>
          <div class="input-text">
            <el-select v-model="selectValue" placeholder="请选择" @change="changeSel">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
          <label class="label">骚东西{{selectValue}}</label>
          <div class="input-text" style="position:relative;">
            <el-select v-model="selectValue" placeholder="请选择" @change="changeSel">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <input v-if="selectValue==1" style="position:absolute;top:10%;height:70%;width:60px;padding:0 5px;left:55px;border:1px solid #eee;border-radius:5px;"></input>
          </div>
        </div>
        <div class="item">
            <label class="label">电话</label>
          <div class="input-text">
            <el-time-picker v-model="time" placeholder="选择时间"></el-time-picker>
          </div>
        </div>
        <div class="item">
            <label class="label">电话</label>
          <div class="input-text">
            <el-date-picker v-model="datetime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </div>
        </div>
        <div class="item daterange">
            <label class="label">电话</label>
          <div class="input-text">
            <el-date-picker v-model="daterange" type="datetimerange" :default-time="['00:00:00','23:59:59']" range-separator="-" start-placeholder="开始时间"
              end-placeholder="结束时间" value-format="yyyy-MM-dd" @change="daterangeChange()"></el-date-picker>
          </div>
        </div>
      </div>
      <div class="search-btn clearfix">
        <div class="btn">
          <el-button type="primary" plain size="mini" icon="el-icon-search">搜索</el-button>
        </div>
        <div class="btn">
          <el-button type="danger" plain size="mini" icon="el-icon-close">清空</el-button>
        </div>
      </div>
    </div>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>列表</span>
          <el-tooltip effect="light" content="Right Center 提示文字" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn">
          <el-button type="primary" plain size="mini" @click="showLock()">子锁清单</el-button>
          <el-button type="primary" plain size="mini" @click="toShowPayRegister()">付款登记</el-button>
          <el-button type="primary" plain size="mini" @click="addTickerLog()">新增票据记账</el-button>
          <el-button type="primary" plain size="mini" @click="upload()">导入</el-button>
          <el-button type="primary" plain size="mini" @click="checkInfo()">公司资料</el-button>
          <el-button type="primary" plain size="mini" @click="invoice()">权限配置</el-button>
          <el-button type="primary" plain size="mini" @click="addClient()">新增客户</el-button>
          <el-button type="primary" plain size="mini" @click="operateLog()">操作记录</el-button>
        </div>
      </div>
      <tableCommon tableName="listTable" ref="table" :head="head" :showSetTable="false"></tableCommon>
    </div>
    <!-- 操作记录 -->
    <commonOpLog ref="operate" :id="1" :type="1"></commonOpLog>
    <!-- 子锁清单 -->
    <el-dialog class="lockDialog" title="子锁清单" :visible.sync="isshowLock" width="840px">
      <ul class="lockList">
        <li class="item">
          <div class="lockIcon">
            <img src="@/static/image/lock1.jpg" alt="">
            <p>点击解锁</p>
          </div>
          <div class="name">
            子锁名称：<el-input v-model="inputvalue" placeholder="可自定义输入"></el-input>
          </div>
          <div class="num">子锁编号：E0562164</div>
        </li>
        <li class="item">
          <div class="lockIcon">
            <img class="rotate" src="@/static/image/lock2.jpg" alt="">
            <p>正在解锁</p>
          </div>
          <div class="name">
            子锁名称：<el-input v-model="inputvalue" placeholder="可自定义输入"></el-input>
          </div>
          <div class="num">子锁编号：E0562164</div>
        </li>
        <li class="item">
          <div class="lockIcon">
            <img src="@/static/image/lock3.jpg" alt="">
            <p>已解锁</p>
          </div>
          <div class="name">
            子锁名称：<el-input v-model="inputvalue" placeholder="可自定义输入"></el-input>
          </div>
          <div class="num">子锁编号：E0562164</div>
        </li>
      </ul>
      <div class="page-bot-btn ">
          <el-button size="mini">关闭</el-button>
          <el-button type="primary" size="mini">确认</el-button>
      </div>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog class="uploadDialog" title="导入" :visible.sync="showUpload" width="400px">
      <div class="uploadCommon">
        <div class="uploadContent">
          <i class="el-icon-upload"></i>
          <div class="uploadText">点击上传文件</div>
          <div class="uploadTips">（只能上传xxx格式文件）</div>
        </div>
        <ul class="uploadList">
          <li>
            <i class="el-icon-document"></i>
            xxxxxxxx
            <i class="el-icon-close"></i>
          </li>
          <li>
            <i class="el-icon-document"></i>
            xxxxxxxx
            <i class="el-icon-close"></i>
          </li>
        </ul>
      </div>
      <div class="page-bot-btn ">
          <el-button size="mini">关闭</el-button>
          <el-button type="primary" size="mini">确认</el-button>
      </div>
    </el-dialog>
    <!-- 查看资料 -->
    <div class="popup" :class="{'show':showCheckInfo}">
      <!-- 遮罩层 -->
      <div class="popup_bj" @click="closeCheckInfo"></div>
      <!-- 内容 -->
      <div class="popup_content" style="width:700px;">
        <div class="common-info" style="border:none;padding:0;">
          <h3 class="common-title mb_20"><span class="title-name">公司信息</span></h3>
          <ul class="content clearfix" style="padding:0 12px;margin-bottom:20px;">
              <li class="item item50">
                  <label class="label-term">公司名称</label>
                  <div class="input-text">
                      <el-input v-model="inputvalue"></el-input>
                  </div>
              </li>
              <li class="item item50">
                  <label class="label-term">地址</label>
                  <div class="input-text">
                      <el-input v-model="inputvalue"></el-input>
                  </div>
              </li>
              <li class="item item50">
                  <label class="label-term">管理员</label>
                  <div class="input-text">
                      <el-input v-model="inputvalue"></el-input>
                  </div>
              </li>
              <li class="item item50">
                  <label class="label-term">联系电话</label>
                  <div class="input-text">
                      <el-input v-model="inputvalue"></el-input>
                  </div>
              </li>
          </ul>
          <h3 class="common-title mb_20"><span class="title-name">开票信息</span></h3>
          <ul class="content clearfix" style="padding:0 12px;">
              <li class="item item50">
                  <label class="label-term">发票资质类型</label>
                  <div class="input-text">
                      <el-input v-model="inputvalue"></el-input>
                  </div>
              </li>
              <li class="item item50">
                  <label class="label-term">纳税人识别号</label>
                  <div class="input-text">
                      <el-input v-model="inputvalue"></el-input>
                  </div>
              </li>
              <li class="item item50">
                  <label class="label-term">注册地址</label>
                  <div class="input-text">
                      <el-input v-model="inputvalue"></el-input>
                  </div>
              </li>
              <li class="item item50">
                  <label class="label-term">注册电话</label>
                  <div class="input-text">
                      <el-input v-model="inputvalue"></el-input>
                  </div>
              </li>
              <li class="item item50">
                  <label class="label-term">注册银行</label>
                  <div class="input-text">
                      <el-input v-model="inputvalue"></el-input>
                  </div>
              </li>
              <li class="item item50">
                  <label class="label-term">卡户名</label>
                  <div class="input-text">
                      <el-input v-model="inputvalue"></el-input>
                  </div>
              </li>
              <li class="item item50">
                  <label class="label-term">账号</label>
                  <div class="input-text">
                      <el-input v-model="inputvalue"></el-input>
                  </div>
              </li>
          </ul>
          <ul class="content clearfix" style="padding:0 12px;">
            <li class="item item50 img-upload">
              <label class="label-term">营业执照</label>
              <div class="input-text">
                <myFileModel></myFileModel>
              </div>
            </li>
            <li class="item item50 img-upload">
              <label class="label-term">开票资料</label>
              <div class="input-text">
                <myFileModel></myFileModel>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 权限配置 -->
    <div class="popup" :class="{'show':showLimitDeploy}">
      <div class="popup_bj" @click="closeLimitDeploy"></div>
      <div class="popup_content" style="width:40%">
        <limitDeploy v-if="showLimitDeploy"></limitDeploy>
      </div>
    </div>
    <!-- 付款登记 -->
    <el-dialog title="付款登记" :visible.sync="showPayRegister" width="810px">
      <div style="line-height:50px;color:red;font-size:16px;">账单编号：EB202012000001，账单月份：2020-12</div>
      
      <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #e8e8e8;">
        <thead>
          <tr>
            <th width="100">收款人</th>
            <th width="150">开户卡号</th>
            <th width="150">开户行</th>
            <th width="150">支行名称</th>
            <th width="150">手机号码</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>张三</td>
            <td>123321123321</td>
            <td>肖某银行</td>
            <td>萝岗分行</td>
            <td>180222325332</td>
          </tr>
        </tbody>
      </table>
      <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #e8e8e8;margin-top:15px;">
        <thead>
          <tr>
            <th width="50">序号</th>
            <th width="150">付款渠道</th>
            <th width="150">需付款金额</th>
            <th width="150">付款金额</th>
            <th width="150">实际付款日期</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>科技</td>
            <td>100</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>1</td>
            <td>科技</td>
            <td>100</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>1</td>
            <td>科技</td>
            <td>100</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>1</td>
            <td>科技</td>
            <td>100</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="fw red">合计</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <div class="page-bot-btn ">
          <el-button size="mini">关闭</el-button>
          <el-button type="primary" size="mini">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import list from './list.js'
export default list
</script>
<style lang="scss">
.tickerLogDialog{
  .el-textarea{
    textarea{
      height: 89px;
    }
  }
  .table_height{
    border:$border;
  }
}
// 子锁清单
.lockDialog{
  .lockList{
    text-align: center;
    .item{
      display: inline-block;
      width: 200px;
      margin-bottom: 15px;
      .lockIcon{
        cursor: pointer;
        margin:0 auto;
        width: 95px;
        height: 95px;
        border-radius: 50%;
        border:1px solid #ccc;
        text-align: center;
        box-sizing: border-box;
        padding-top: 12px;
        .rotate{
          animation:rotateAnim 1s linear infinite;
        }
      }
      .name{
        padding-left: 27px;
        text-align: left;
        .el-input{
          display: inline-block;
          width: 100px;
          .el-input__inner{
            border:none;
            line-height: 28px;
            padding:0 3px;
            height: 28px;
          }
        }
      }
      .num{
        padding-left: 27px;
        text-align: left;
      }
    }
  }
}
@keyframes rotateAnim{
  0%{-webkit-transform:rotate(0deg);}
  25%{-webkit-transform:rotate(-90deg);}
  50%{-webkit-transform:rotate(-180deg);}
  75%{-webkit-transform:rotate(-270deg);}
  100%{-webkit-transform:rotate(-360deg);}
}
</style>
