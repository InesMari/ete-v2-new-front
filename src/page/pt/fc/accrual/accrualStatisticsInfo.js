import cosole from "decimal.js";

export default {
    name: 'accrualStatisticsInfo',
    props: [],
    data() {
        return {
            info:{
                orgName:'',
                accrualMonth:'',
            },
            dataList:[],
            head:[
                {name:'序号',code:"idx",width:"50"},
                {name:'成本类别',code:"accrualCostTypeName",width:"90"},
                {name:'成本费目',code:"accrualCostSubTypeName",width:"110"},
                {name:'供应商',code:"tenantName",width:"160"},
                {name:'未税金额',code:"totalFee",width:"90"},
                {name:'税率',code:"taxRate",width:"60"},
                {name:'税金',code:"totalTax",width:"90"},
                {name:'含税金额',code:"totalFeeWithTax",width:"90"},
                {name:'未税月账单金额',code:"amountNoTax",width:"90"},
                {name:'月账单金额',code:"amount",width:"90"},
                {name:'差异',code:"diff",width:"90"},
                {name:'请付款金额',code:"payFee",width:"90"},
                {name:'差异',code:"noPayFee",width:"90"},
            ]
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.doQuery();
    },

    /**
     * 组件
     */
    components: {
    },

    /**
     * 绑定函数
     */
    methods: {
        /**
         *
         */
        async doQuery() {
            let dataList = await this.common.postUrl("fcAccrualTF", "queryFcAccrualStatisticsInfo", this.$route.query);
            this.info.accrualMonth = dataList[0].accrualMonth;
            this.info.orgName = dataList[0].orgName;
            this.dataList = dataList;
            let accrualCostType = dataList[0].accrualCostType;
            let accrualCostTypeRowspan = 0;//需要合并多少个单元格
            let accrualCostTypeRowspanIdx = 0;//参数放在第几行数据
            let accrualCostSubType = dataList[0].accrualCostSubType;
            let accrualCostSubTypeRowspan = 0;//需要合并多少个单元格
            let accrualCostSubTypeRowspanIdx = 0;//参数放在第几行数据

            let totalFee = 0;
            let totalTax = 0;
            let totalFeeWithTax = 0;
            let amountNoTax = 0;
            let amount = 0;
            let diff = 0;
            let payFee = 0;
            let noPayFee = 0;

            let idx = 1;
            for (let i = 0; i < this.dataList.length; i++) {
                let data = this.dataList[i];
                data.showAccrualCostType = true;
                data.showAccrualCostSubType = true;

                if(accrualCostType!=data.accrualCostType){
                    this.dataList[accrualCostTypeRowspanIdx].idx = idx;
                    idx++;
                    if(accrualCostTypeRowspan>1){
                        this.dataList[accrualCostTypeRowspanIdx].accrualCostTypeRowspan=accrualCostTypeRowspan;
                    }
                    accrualCostTypeRowspan=1;
                    accrualCostTypeRowspanIdx=i;
                    accrualCostType = data.accrualCostType;

                    if(accrualCostSubTypeRowspan>1){
                        this.dataList[accrualCostSubTypeRowspanIdx].accrualCostSubTypeRowspan=accrualCostSubTypeRowspan;
                    }
                    accrualCostSubTypeRowspan=1;
                    accrualCostSubTypeRowspanIdx=i;
                    accrualCostSubType = data.accrualCostSubType;
                }else{
                    if(accrualCostTypeRowspan>0){
                        data.showAccrualCostType = false;
                    }
                    accrualCostTypeRowspan++;

                    if(accrualCostSubType!=data.accrualCostSubType){
                        if(accrualCostSubTypeRowspan>1){
                            this.dataList[accrualCostSubTypeRowspanIdx].accrualCostSubTypeRowspan=accrualCostSubTypeRowspan;
                        }
                        accrualCostSubTypeRowspan=1;
                        accrualCostSubTypeRowspanIdx=i;
                        accrualCostSubType = data.accrualCostSubType;
                    }else{
                        if(accrualCostSubTypeRowspan>0){
                            data.showAccrualCostSubType = false;
                        }
                        accrualCostSubTypeRowspan++;
                    }
                }

                totalFee = this.common.accAdd(totalFee,data.totalFee);
                totalTax = this.common.accAdd(totalTax,data.totalTax);
                totalFeeWithTax = this.common.accAdd(totalFeeWithTax,data.totalFeeWithTax);
                amountNoTax = this.common.accAdd(amountNoTax,data.amountNoTax);
                amount = this.common.accAdd(amount,data.amount);
                diff = this.common.accAdd(diff,data.diff);
                payFee = this.common.accAdd(payFee,data.payFee);
                noPayFee = this.common.accAdd(noPayFee,data.noPayFee);
            }
            if(accrualCostTypeRowspan>1){
                this.dataList[accrualCostTypeRowspanIdx].accrualCostTypeRowspan=accrualCostTypeRowspan;
            }
            if(accrualCostTypeRowspan>0){
                this.dataList[accrualCostTypeRowspanIdx].idx = idx;
            }
            if(accrualCostSubTypeRowspan>1){
                this.dataList[accrualCostSubTypeRowspanIdx].accrualCostSubTypeRowspan=accrualCostSubTypeRowspan;
            }
            this.dataList.push({idx:'合计',showAccrualCostType:true,accrualCostTypeRowspan:0,showAccrualCostSubType:true,accrualCostSubTypeRowspan:0,totalFee:totalFee,totalTax:totalTax,totalFeeWithTax:totalFeeWithTax,amountNoTax:amountNoTax,amount:amount,diff:diff,payFee:payFee,noPayFee:noPayFee});
            this.$forceUpdate();
            console.log(this.dataList);
        },
         
        downloadExcelFile(){
            this.common.shade.show();
            // 前端导出
            import('@/utils/excelOut').then(excel => {
                //表头对应字段
                let filterVal = []
                this.head.forEach(el => {
                    filterVal.push(el.code);
                })
                const title = ['仓库成本计提详情'];
                const info = new Array(12);
                info[0] = this.info.orgName;
                info[11] = this.info.accrualMonth;
                const head = this.head.map(el => el.name);;
                const dataList = this.dataList.map(v => filterVal.map(j => v[j]))
                dataList.forEach(list => {
                    list.forEach((item,index) => {
                        if(this.common.isBlank(item)){
                            list[index] = ''
                        }
                    })
                })
                let data = [title,info,head,...dataList]
                let merges = [
                    'A1:M1',
                    'A2:B2',
                    'L2:M2',
                ]
                console.log(this.dataList)
                this.dataList.forEach((el,index)=>{
                    if(el.accrualCostTypeRowspan>0){
                        merges.push('A'+(index+4)+':A'+(index+el.accrualCostTypeRowspan+3))
                        merges.push('B'+(index+4)+':B'+(index+el.accrualCostTypeRowspan+3))
                    }
                    if(el.accrualCostSubTypeRowspan>0){
                        merges.push('C'+(index+4)+':C'+(index+el.accrualCostSubTypeRowspan+3))
                    }
                })
                excel.export_json_to_excel({
                    data,
                    filename:'仓库成本计提详情',   // 文件名
                    autoWidth: true,
                    merges,
                    noBg:true,
                    setStyle:function(data,dataInfo){
                        for (let b in dataInfo) {
                            if (b.indexOf('3') == 1 && b.length<3) {
                                dataInfo[b].s.fill.fgColor = { rgb: "99ccff" }
                            }
                            if(b.indexOf('2') == 1 && b.length<3){
                                dataInfo[b].s.border = undefined;
                            }
                            if(b.indexOf('1') == 1 && b.length<3){                                
                                dataInfo[b].s.border = undefined;
                            }
                        }
                    }
                })
                this.common.shade.hide();
            })
        }

    },

}
