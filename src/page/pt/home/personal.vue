<template>
    <div id="personal" class="personalPage">
        <div class="head">
            <img src="@/static/image/personal.png" class="headIcon" alt="">
            <div class="text">个人资料</div>
        </div>
        <div class="info">
            <div class="item">
                <div class="label">用户名：</div>
                <div class="text">{{userName}}</div>
            </div>
            <div class="item">
                <div class="label">登录账号：</div>
                <div class="text">{{billId}}</div>
            </div>
            <div class="item">
                <div class="label">登录密码：</div>
                <div class="text">********</div>
                <el-button size="mini" type="success" @click="changePassword">修改</el-button>
            </div>
            <div class="item">
                <div class="label">我的收货地址：</div>
                <div class="text">{{showAddress}}</div>
                <el-button size="mini" type="primary" @click="showModifyAddress">修改</el-button>
            </div>
            <div class="item">
                <div class="label">银行卡：</div>
                <div class="text">{{bankInfo.bankCard}}</div>
                <el-button size="mini" type="primary" @click="showModifyBank">{{ showBankUpdate ? "修改" : "新增"}}</el-button>
            </div>
        </div>
        <div class="bot-btn">
            <el-button @click="closePage()">关闭</el-button>
        </div>

        <!-- 修改地址 -->
        <el-dialog title="修改收货地址提示" :visible.sync="showDialog" :close-on-click-modal="false"
                   :close-on-press-escape="false" width="400px" @close="showDialog=false">
          <div class="common-info siteEditDialog" style="border:none;padding:0;">
            <ul class="content clearfix">
              <li class="item item100">
                <label class="label-term">请修改或输入您的收货地址</label>
                <div class="input-text">
                  <el-input v-model="address"></el-input>
                </div>
              </li>
            </ul>
            <div class="page-bot-btn " style="padding-right:0px">
              <el-button type="primary" size="small" @click="save">确认修改</el-button>
            </div>
          </div>
        </el-dialog>

        <!-- 新增 begin -->
        <el-dialog :title="title" :visible.sync="showModify" width="660px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="openDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>银行卡号</label>
                        <div class="input-text">
                            <el-input v-model="bankInfo.bankCard" maxlength="30" v-mynumval placeholder="请输入银行卡号"
                                      :disabled="isLock"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>开户行</label>
                        <div class="input-text">
                            <el-select v-model="bankInfo.bankDeposit" placeholder="请选择开户行" filterable clearable
                                       :disabled="isLock">
                                <el-option v-for="item in bankDepositData" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>开户手机号</label>
                        <div class="input-text">
                            <el-input v-model="bankInfo.bankPhone" maxlength="11" placeholder="开户手机号"
                                      :disabled="isLock"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>支行名称</label>
                        <div class="input-text">
                            <el-input v-model="bankInfo.bankSubName" maxlength="64" placeholder="请输入支行名称"
                                      :disabled="isLock"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>开户名字</label>
                        <div class="input-text">
                            <el-input v-model="bankInfo.bankAccountName" maxlength="50" placeholder="请输入开户名字"
                                      :disabled="isLock"></el-input>
                        </div>
                    </li>
                    <li class="item item100" >
                        <label class="label-term"><em>*</em>身份证号</label>
                        <div class="input-text">
                            <el-input v-model="bankInfo.userPayeeCard" maxlength="50" placeholder="请输入身份证号"
                                      :disabled="isLock" ></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveBankInfoForMySelf()" v-if="!isLock">确认</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 新增 end -->
    </div>
</template>

<script>

import myFileModel from "@/components/myFileModel/myFileModel.vue";

export default {
    name: 'personal',
    components: {myFileModel},
    data() {
        return {
            userName:this.common.userInfo().userName,
            billId:this.common.userInfo().billId,
            showDialog:false,
            showAddress:this.common.userInfo().address,
            address:'',

            bankInfo: this.initInfo(),
            showBankUpdate: false,
            fileArray: [
                {
                    fileId:null,
                    filePath:null,
                },
                {
                    fileId:null,
                    filePath:null,
                },
                {
                    fileId:null,
                    filePath:null,
                },
            ],
            title: "新增银行卡",
            showModify: false,//银行卡弹窗
            isLock: false,
            bankDepositData: [],//开户行
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init()
        {
            let that = this;
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "BANK_DEPOSIT"}, function (data) {
                that.bankDepositData = data;
            });
            this.loadBankInfo();
        },
        initInfo()
        {
            return{
                id: null,
                bankType: '2',
                bankCard: null,//银行卡号
                bankDeposit: null,//开户行
                bankPhone: null,//开户手机号
                bankSubName: null,//支行名称
                bankAccountName: null,//开户名字
                userPayeeCard: null,//身份证号
            }
        },
        loadBankInfo()
        {
            let that = this;
            that.common.postUrl("bankTF", "queryMyBankInfo", {}, function (data) {
                if (data.info)
                {
                    that.bankInfo = data.info;
                }
                else
                {
                    that.bankInfo = that.initInfo();
                }
                if (that.bankInfo.bankDeposit)
                {
                    that.bankInfo.bankDeposit = that.bankInfo.bankDeposit + "";
                }
                that.showBankUpdate = that.common.isNotBlank(that.bankInfo.bankCard);
                that.$nextTick(()=>{
                    if (that.showModify && data.files)
                    {
                        for(let i = 0; i < data.files.length; i++)
                        {
                            let item = data.files[i];
                            if (that.common.isNotBlank(item.fileId))
                            {
                                that.fileArray[i].fileId = item.fileId;
                                that.fileArray[i].filePath = item.filePath;
                                eval('that.$refs.file' + i + '[0].initDate(' + item.fileId + ')')
                            }
                        }
                    }
                })
            });
        },
        changePassword(){
            this.$parent.showModifyDialog = true;
        },
        showModifyAddress(){
          this.showDialog=true;
          this.address = this.showAddress;
          this.$forceUpdate();
        },
        showModifyBank(){
            this.showModify = true;
            if (this.showBankUpdate)
            {
                this.title = "修改银行卡";
                this.loadBankInfo();
            }
            else
            {
                this.title = "新增银行卡";
                this.bankInfo = this.initInfo();
            }
        },
        openDialog(flag)
        {
            this.showModify = flag;
        },
        successCallback(imgData)
        {
            let componentId = imgData.componentId
            this.fileArray[componentId].fileId = imgData.flowId;
            this.fileArray[componentId].filePath = imgData.storePath;
        },
        delCallback(componentId)
        {
            this.fileArray[componentId].fileId = "";
            this.fileArray[componentId].filePath = "";

        },
        closePage()
        {
            this.$emit("closeTab", this.$route.meta.id,true);
        },
        saveBankInfoForMySelf() {
            let param = this.common.copyObj(this.bankInfo);

            if(this.common.isBlank(param.bankCard)){
                this.$message.error("请输入银行卡号！");
                return;
            }
            if(this.common.isBlank(param.bankDeposit) || param.bankDeposit<0){
                this.$message.error("请选择开户行！");
                return;
            }
            if(this.common.isBlank(param.bankPhone)){
                this.$message.error("请输入开户手机号！");
                return;
            }
            if(param.bankPhone.length!=11){
                this.$message.error("请输入有效的开户手机号！");
                return false;
            }
            if(this.common.isBlank(param.bankSubName)){
                this.$message.error("请输入支行名称！");
                return;
            }
            if(this.common.isBlank(param.bankAccountName)){
                this.$message.error("请输入开户名字！");
                return;
            }
            if(this.common.isBlank(param.userPayeeCard)){
                this.$message.error("请输入身份证号！");
                return;
            }
            let hasFile = false;
            for (let i = 0; i < this.fileArray.length; i++)
            {
                let item = this.fileArray[i];
                if (this.common.isNotBlank(item.fileId))
                {
                    hasFile = true;
                }
            }
            param.fileArray = this.fileArray;
            let that = this;
            that.common.postUrl("bankTF", "saveBankInfoForMySelf", param, function (data) {
                if (that.common.isNotBlank(data)) {
                    that.showBankUpdate = true;
                    that.openDialog(false);
                    that.$message.success(that.bankInfo.id>0 ? "修改成功!" : "新增成功!");
                }
            },null,'',true);
        },

        save(){
          let that = this;
          this.common.postUrl("userTF", "setUserAddress", {address:this.address}, function ()
          {
            let userInfo = that.common.userInfo();
            userInfo.address = that.address;
            localStorage.setItem("userInfo",JSON.stringify(userInfo));
            that.showAddress = that.address;
            that.showDialog=false;
            that.$message.success("修改成功!");
          });
        },
    },
}
</script>
<style lang="scss" scoped>
.personalPage{
    background: #fff;
    .head{
        padding: 40px 0px;
        padding-right: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border-bottom: 1px dashed $border-color;
        .headIcon{
            width: 100px;
        }
        .text{
            font-size: 18px;
            margin-top: 20px;
        }
    }
    .info{
        padding-right: 100px;
        width: 680px;
        margin:40px auto;
        .item{
            display: flex;
            .label{
                width: 115px;
                text-align: right;
                font-size: 16px;
                line-height: 20px;
                padding: 12px 0;
            }
            .text{
                flex: 1;
                font-size: 16px;
                line-height: 20px;
                padding: 12px 0;
            }
            /deep/ .el-button{
                width: 60px;
                padding: 3px 15px;
                height: 30px;
                margin-top: 7px;
                margin-left: 20px;
            }
        }
    }
    .bot-btn{
        margin-top: 100px;
        margin-left: 20px;
        padding-right: 100px;
    }
    .siteEditDialog .content > .item {
        .label-term{
            width: 100%;
            justify-content: center;
            font-size: 14px;
        }
        .input-text{
            width: 100%;
        }
    }
}
</style>