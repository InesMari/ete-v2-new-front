
export default {
    name: 'selectWork',
    data() {
        return {
            selWorkId:-1,
            workList:[]
        }
    },
    mounted() {
        this.init();
    },
    components: {

    },
    methods: {
        init(){
            let that = this;
            let userInfo = this.common.userInfo();
            this.selWorkId =userInfo.workId;
            this.common.postUrl('wmsBaseTF','getAllWorkStore',{},function (data) {
                that.workList = data;
            });
        },
        selTenant(item){
            let that = this;
            this.common.postUrl("wmsBaseTF", "selWork", {workId:item.workId}, function (data) {
                if(data) {
                    //不显示
                    let userInfo = that.common.userInfo();
                    userInfo.workId = item.workId;
                    userInfo.workName = item.workName;
                    userInfo.linkmanName = item.linkmanName;
                    userInfo.bill = item.bill;
                    userInfo.useSapStockNums = item.useSapStockNums;
                    localStorage.setItem("userInfo", JSON.stringify(userInfo));
                    that.$parent.selWork();
                }
            });
        },
    }
}
