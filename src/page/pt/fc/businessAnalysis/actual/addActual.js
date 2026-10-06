export default {
    name: 'addActual',
    data() {
        return {
            projectNames: [],
            info: {
                dtls: []
            },
            orgData:[],
            disabled:this.$route.query.id?true:false,
            adjust:this.$route.query.adjust,
        }
    },

    mounted() {
        this.initData();
    },
    /**
     * 组件
     */
    components: {

    },
    methods: {
        /**
         * 初始化数据
         */
        async initData() {
            this.orgData = await this.common.postUrl("fcBudgetTF", "queryWorkOrgList", {});
            this.projectNames = await this.common.postUrl("fcBudgetTF", "queryFcAttrInfoList", {});
            this.projectNames.forEach(item => {
                if (item.valueSourceType != 1) {
                    item.disable = true;
                }
                item.show = true;
                if(this.adjust==1){
                    if(item.attrCode=='code00000007'||item.attrCode=='code00000009'||item.attrCode=='code00000010'||item.attrCode=='code00000011'){
                        item.show = true;
                    }else{
                        item.show = false;
                    }
                }else{
                    if(item.attrCode=='code00000009'||item.attrCode=='code00000010'||item.attrCode=='code00000011'){
                        item.show = false;
                    }
                }
            });            
            if(this.$route.query.id){
                this.info = await this.common.postUrl("fcActualTF", "getFcActualInfo", {id:this.$route.query.id});
            }else{
                for(let i=1;i<13;i++){
                    this.info.dtls.push({
                        name: i+"月",
                        width:"80"
                    })
                }
                this.info.dtls.push({
                    name: "合计",
                    width:"100"
                })
            }
            this.$forceUpdate();
            this.$nextTick(()=>{
                this.common.tableStretch(this.$refs.table)
            })
        },
        forceUpdate() {
            this.$forceUpdate();
        },
        getCurrentIptIdx(index){
            this.currentHdIndex = index;
        },
        toCalcRowsTotal(item, monthData, index){
            const timer = setTimeout(() => {
                if(this.currentHdIndex != index || document.activeElement.tagName !=="INPUT") this.calcRowsTotal(item, monthData, index);
                clearTimeout(timer);
            }, 500);
        },
        // 请求后台计算竖行数据
        async calcRowsTotal(item, monthData, index) {
            monthData.orgId = this.info.orgId;
            monthData.year = this.info.year;
            monthData.month = index+1;
            monthData.adjust = this.adjust;
            item.total = 0;
            let data = await this.common.postUrl("fcActualTF", "resolveValue", monthData);
            this.info.dtls[index] = data;
            this.info.dtls[12] = await this.common.postUrl("fcBudgetTF", "calTotalMap", {dtls:this.info.dtls});
            this.$forceUpdate();
        },
        async save() {
            this.info.adjust = this.adjust;
            await this.common.postUrl("fcActualTF", "saveFcActualInfo", this.info, null, null, null, true);
            this.$message.success("保存成功");
            this.close();
        },
        close(){
            this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId,true);            

        },
    },
}
