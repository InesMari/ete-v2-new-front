import myFileModel from '@/components/myFileModel/myFileModel.vue'
import enumData from "@/page/pt/enum";
import printJS from 'print-js'

export default {
    name: 'requestFeePrintDetail',
    data()
    {
        return {
            requestDatas:[],
            map: enumData.yuanMap,
            stateEnumData: enumData.FC_STS,
            list: [],
            // type: this.$route.query.type,
        }
    },
    mounted()
    {
        this.queryIds();
    },
    methods: {
        initMoney()
        {
            let moneyArray = [];
            for(let i = 0;i < 9; i++)
                moneyArray.push('');
            return moneyArray;
        },
        queryIds(){
            this.requestDatas = [];
            this.$route.query.selectData.forEach(item => {
                this.loadRequestFeeById(item);
            })
        },
        async loadRequestFeeById(item)
        {
            let data = await this.common.postUrl("requestServiceImpl", "loadRequestFeeById", item);
            if (data.payFee > 0) data.moneyArray = this.chnageMoney(String(data.payFee));
            data.verifyList = new Array();
            let i = 0;
            data.verifyUsers.forEach(item => {
                data.verifyList[i++] = item;
            })
            data.verifyList.reverse();
            this.requestDatas.push(data)
        },
        chnageMoney(data)
        {
            let none = '—';
            let yuan = '￥';
            let moneyArray = this.initMoney();

            if (this.common.isNotBlank(data) && !isNaN(data))
            {
                let money = this.common.accMul(data, 100);
                let moneyStr = money.toString(); //转换为字符串
                let zero = false;
                let j = 0;//￥放的位置

                for (let i = moneyStr.length - 1; i >= 0; i--)
                {
                    let num = parseInt(moneyStr.charAt(i));
                    if (num > 0)
                        zero = true;
                    if (zero || num != 0)
                        moneyArray[j] = this.map.get(String(num));
                    else
                        moneyArray[j] = none;
                    j++;
                }
                //处理￥
                if(j <= moneyArray.length - 1)
                    moneyArray[j] = yuan;
                else
                    moneyArray[j - 1] = yuan + moneyArray[j - 1];
            }
            return moneyArray;
        },
        /**
         * 打印
         */
        async print(type){
            if(type == 'A4'){
            var css = './static/css/printA4.css';  //真实路径/public//static/css/printA4.css
            }else if(type == 'A5'){
            var css = './static/css/printA5.css';  //真实路径/public//static/css/printA5.css
            } 
            printJS({
                printable: 'printTable',
                type: 'html',
                css,  //真实路径/public//static/css/printA5.css
                scanStyles: false
            })
            this.$route.query.selectData.forEach(async item => {
                await this.increaseRequestFeePrintById(item);
            })
            this.queryIds();
        },
        /**
         * 打印调用自增打印次数
         */
        async increaseRequestFeePrintById(item)
        {
            await this.common.postUrl("requestServiceImpl", "increaseRequestFeePrintById", item);
        },
        closePage() {
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId);
        },
    },
    components: {
        myFileModel,
        enumData
    },
}
