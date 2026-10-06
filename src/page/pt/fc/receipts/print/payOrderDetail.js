import myFileModel from '@/components/myFileModel/myFileModel.vue'
import enumData from "@/page/pt/enum";
import printJS from 'print-js'

export default {
  name: 'payOrderDetail',
  data() {
    return {
      payOrderDatas:[],
    }
  },
  mounted() {
    this.queryIds();
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
    initChineseMoney(){
      let chineseMoney = [];
      for(var i=0;i<9;i++){
        chineseMoney.push('');
      }
      return chineseMoney;
    },
    queryIds(){
        this.payOrderDatas = [];
        this.$route.query.ids.forEach(id => {
          this.loadFcPayInfoById(id);
        })
    },
    /**
     * 加载数据
     * @returns {Promise<void>}
     */
    async loadFcPayInfoById(id)
    {
      let data = await this.common.postUrl("fcPayTF", "loadFcPayInfoForPrintById", {id});
      if (data.payFee > 0){
        this.changeNumMoneyToChinese(data);
      }
      for (let i = 0; i < 3; i++) {
        if(this.common.isNotBlank(data.projectList[i])){
          data['project'+(i+1)]=data.projectList[i];
        }else{
          data['project'+(i+1)]={}
        }
      }
        data.verifyList = new Array();
        let i = 0;
        data.verifyUsers.forEach(item => {
            data.verifyList[i++] = item;
        })
        data.verifyList.reverse();
      this.payOrderDatas.push(data);
    },
    changeNumMoneyToChinese(data){
      let cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
      let none = '—';
      let yuan = '￥';
      data.chineseMoney = this.initChineseMoney();
      if(!data.payFee){
        return;
      }
      let money = this.common.accMul(data.payFee,100);
      let moneyStr = money.toString(); //转换为字符串
      let zero = false;
      let j = 0;
      for (let i = moneyStr.length-1; i >=0 ; i--) {
        let num = parseInt(moneyStr.charAt(i));
        if(num>0){
          zero = true;
        }
        if(zero||num!=0){
          data.chineseMoney[j]=cnNums[num]+'';
        }else{
          data.chineseMoney[j]=none;
        }
        j++;
      }
      if(j<=data.chineseMoney.length-1){
        data.chineseMoney[j]=yuan;
      }else{
        data.chineseMoney[j-1]=yuan+data.chineseMoney[j-1];
      }
    },
    closePage() {
      this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId);
    },
    async print(type){
      if(type == 'A4'){
        var css = './static/css/printA4.css';  //真实路径/public//static/css/printA4.css
      }else if(type == 'A5'){
        var css = './static/css/printA5.css';  //真实路径/public//static/css/printA5.css
      }
      console.log(css)
      printJS({
          printable: 'printTable',
          type: 'html',
          css,
          scanStyles: false
      })
      this.payOrderDatas.forEach(async item => {
        await this.addPrintTimes(item)
      })
      this.queryIds();
    },
    /**
     * 打印调用自增打印次数
     */
    async addPrintTimes(item){
        await this.common.postUrl("fcPayTF", "addPrintTimes", item);
    },

  },
  components: {
    myFileModel
  },
}
