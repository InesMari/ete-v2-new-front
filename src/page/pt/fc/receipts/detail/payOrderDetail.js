import myFileModel from '@/components/myFileModel/myFileModel.vue'
import enumData from "@/page/pt/enum";
import lodopUtil from "@/utils/lodop/lodop-business.js"
import mySimpleFileModelList from "@/components/myFileModel/mySimpleFileModelList.vue";

export default {
  name: 'payOrderDetail',
  data() {
    return {
      project1:this.getProject(),
      project2:this.getProject(),
      project3:this.getProject(),
      info:{
        payFee:'',
        borrowFee:'',
        actualPayFee:'',
        payType:2,
        expectDate:'',
        bankAccountName:'',
        bankDeposit:'',
        bankCard:'',
        projectList:[],
        receiptsList:[],
        payee:'',
        orgName:'',
        createDate:'',
        verifyUsers:[],
      },
      verifyList:[],
      payTypeOptions:[],
      chineseMoney:[],
      saveFlag: false,
      type: this.$route.query.type,
      currentApplyStep: this.$route.query.currentApplyStep,//1 部门审批  2 财务审批  3 总经理审批 9 审批完
      isFromApply: this.common.isNotBlank(this.$route.query.applyIds),
      verifyRemark: null,
    }
  },
  mounted() {
    this.initData();
    this.initChineseMoney();
    if (this.common.isNotBlank(this.$route.query.id)){
      this.$nextTick(() => {
        this.loadFcPayInfoById();
      });
    }
  },
  methods: {
    getProject(){
      return {
        payProject:'',
        custTenantId:'',
        businessDate:'',
        payFee:'',
        payRemark:'',
      }
    },
    async initData() {
      let that = this;
      this.common.postUrl("commonTF", "getSysStaticData", {codeType: "APPLY_PAY_TYPE"}, function (data) {
        that.payTypeOptions = data;
      });
    },
    initChineseMoney(){
      this.chineseMoney = [];
      for(var i=0;i<9;i++){
        this.chineseMoney.push('');
      }
    },
    /**
     * 加载数据
     * @returns {Promise<void>}
     */
    async loadFcPayInfoById()
    {
      this.info = await this.common.postUrl("fcPayTF", "loadFcPayInfoForPrintById", this.$route.query);

      if (this.info.payFee > 0){
        this.changeNumMoneyToChinese();
      }
      let that = this;
      this.info.payType = this.info.payType+'';
      for (let i = 0; i < this.info.projectList.length; i++) {
        if (this.common.isNotBlank(this.info.projectList[i].applyId))
        {
          this.isFromApply = true;
        }
        this['project'+(i+1)]=this.info.projectList[i];
        this['project'+(i+1)].payProject = this.info.projectList[i].payProject+'';
        this['project'+(i+1)].custTenantId = this.info.projectList[i].custTenantId+'';
      }
      this.$nextTick(() => {
        if (this.common.isNotBlank(this.info.receiptsList)) {
          for (let i = 0; i < this.info.receiptsList.length; i++) {
            eval("that.$refs.file" + i + "[0].initDate(" + that.info.receiptsList[i].imgId + ")");
          }
        }
      });
        this.verifyList = new Array();
        let i = 0;
        this.info.verifyUsers.forEach(item => {
            this.verifyList[i++] = item;
        })
        this.verifyList.reverse();
        this.$refs.invoiceNum.initFileList(this.info.invoiceNumList);
      this.$refs.other.initFileList(this.info.otherList);
    },
    calTotalFee(){
      this.info.payFee = this.common.accAdd(this.project1.payFee,this.project2.payFee);
      this.info.payFee = this.common.accAdd(this.info.payFee,this.project3.payFee);
      this.info.mustPayFee = this.common.accAdd(this.project1.mustPayFee,this.project2.mustPayFee);
      this.info.mustPayFee = this.common.accAdd(this.info.mustPayFee,this.project3.mustPayFee);
      this.info.deduction = this.common.accAdd(this.project1.deduction,this.project2.deduction);
      this.info.deduction = this.common.accAdd(this.info.deduction,this.project3.deduction);
      this.calActualPayFee();
      this.changeNumMoneyToChinese();
    },
    calActualPayFee(){
      this.info.actualPayFee = this.common.accSub(this.info.payFee,this.info.borrowFee);
    },
    changeNumMoneyToChinese(){
      let cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
      let none = '—';
      let yuan = '￥';
      this.initChineseMoney();
      if(!this.info.payFee){
        return;
      }
      let money = this.common.accMul(this.info.payFee,100);
      let moneyStr = money.toString(); //转换为字符串
      let zero = false;
      let j = 0;
      for (let i = moneyStr.length-1; i >=0 ; i--) {
        let num = parseInt(moneyStr.charAt(i));
        if(num>0){
          zero = true;
        }
        if(zero||num!=0){
          this.chineseMoney[j]=cnNums[num]+'';
        }else{
          this.chineseMoney[j]=none;
        }
        j++;
      }
      if(j<=this.chineseMoney.length-1){
        this.chineseMoney[j]=yuan;
      }else{
        this.chineseMoney[j-1]=yuan+this.chineseMoney[j-1];
      }
    },
    closePage() {
      this.$parent.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId);
    },
    /**
     * 审核
     * @param type 1通过并流转 2通过并完结 3不通过
     * @returns {Promise<boolean>}
     */
    async verifyRequestFee(type)
    {
      if (this.common.isBlank(this.info.id)){
        this.$message.error("网络异常,关闭当前页面重新选择付款单审核!");
        return false;
      }
      if (!(enumData.FC_STS.WAIT == this.info.state || enumData.FC_STS.DOING == this.info.state)){
        this.$message.error("只有未审核和审核中的付款单才可以审核！");
        return false;
      }

      let param = {
        id: this.info.id,
        type,
        applyRemark: this.verifyRemark,
      };
      await this.common.postUrl("fcPayTF", "applyFcPayInfo", param);
      this.$message.success("审核成功！");
      this.closePage();
    },
    clickItem(param, type) {
      if (type == 1) {
        if (this.info.feeApplySrc == 2) {
          this.$emit("openTab", {
            query: {id: param.applyId},
            urlId: "paymentPlanDetail" + param.applyId,
            urlName: "查看费用清单",
            urlPathName: "/paymentPlanDetail",
            urlPath: "/pt/purchase/paymentPlan/paymentPlanDetail.vue"
          });
        } else {
          this.$emit("openTab", {
            query: {id: param.applyId},
            urlId: "purchaseDetail" + param.applyId,
            urlName: "查看采购费用申请",
            urlPathName: "/purchaseDetail",
            urlPath: "/pt/biz/purchase/detail/purchaseApplyDetailMain.vue"
          });
        }
      } else {
        this.$emit("openTab", {
          urlId: "requestFeeDetail" + param,
          urlName: '查看请款单',
          urlPathName: '/requestFeeDetail',
          query: {id: param, type: '0'},
          urlPath: "/pt/fc/receipts/detail/requestFeeDetailMain.vue",
        });
      }
    },
    goto(item)
    {
      this.$emit('openTab', {
        urlName: '账单明细',
        urlId: 'confirmSupplierBillDetail_' + item.billId,
        urlPathName: "/fc",
        urlPath: "/pt/fc/supplierBill/detail/confirmBillDetail.vue",
        query: {fcSupplierBillId: item.billId},
      });
    },
    viewContractReview(data){
      let item = {
        urlName: '查看合同',
        urlId: "contractDetail" + data.contractId,
        urlPathName: "/contractDetail",
        urlPath: "/pt/cm/contract/contractDetail.vue",
        query: {type:3,contractType:data.contractType,id:data.contractId},
      }
      this.$emit('openTab', item);
    },

  },
  components: {
    mySimpleFileModelList,
    myFileModel
  },
}
