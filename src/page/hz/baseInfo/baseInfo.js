import myFileModel from '@/components/myFileModel/myFileModel.vue'
export default {
  name: 'baseInfo',
  data() {
    return {
      baseinfo:{
        custName:'',
        address:'',
        linkman:'',
        linkPhone:'',
        regionId:'',
        orgId:'',
        custManage:'',
        invoiceTypeName:'',
        invoiceType:'',
        taxNumber:'',
        regAddress:'',
        regPhone:'',
        regBank:'',
        accountName:'',
        regAccount:'',
        businessLicenseImgUrl:'',
        invoiceInfoImgUrl:'',
      }
    }
  },
  mounted() {
    this.doInit();
  },
  methods: {
    doInit(){
      let that = this;
      this.common.postUrl("customerTF", 'getCustomerDetailInfo', {tenantId:this.common.userInfo().tenantId}, function (data) {
        if(data){
          that.baseinfo = data;
        }
      });
    }
  },
  components: {
    myFileModel,
  },
}
