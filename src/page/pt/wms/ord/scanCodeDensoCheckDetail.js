export default {
    name: 'scanCodeDensoCheckDetail',
    data()
    {
        return {
            info:{},
        }
    },
    mounted()
    {
        this.initData();
    },
    components: {
        
    },
    methods: {
        initData(){
            this.info = JSON.parse(window.sessionStorage.getItem("scanCodeDensoCheckDetail"));
            this.info.materialCodeNumArr = this.info.materialCodeNums.split(",");
        },
        /**
         * 导出
         */
        downloadExcel() {
            let filename = "电装扫码校验详情";
            let headList = [
                {"name":"序号","code":"index"},
                {"name":"产品标签","code":"materialCodeNum"},
            ];
            let tableData = this.info.materialCodeNumArr.map((el,index)=>{
                return {
                    index: index+1,
                    materialCodeNum: el,
                }
            })
            this.common.frontDownloadExcelFile(filename,headList,tableData);
        },
    },
}
