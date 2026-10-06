import printJS from 'print-js'
export default {
    name: 'inspectionPrintCode',
    data() {
        return {
            codeList:[],
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
         * 加载订单数据
         */
        async doQuery()
        {
            let {id} = this.$route.query;
            this.codeList = await this.common.postUrl("wmsInspectionAppointService", "loadWmsInspectionAppointDtlListDataByAppointId",{id},null, null, null, true);
        },
        changeSelect(item){
            if(item.sts==0) return;
            item.ischecked = !item.ischecked;
            this.$forceUpdate();
        },
        // 全选
        selectAll(){
            this.codeList.forEach(item => {
                if(item.sts!=0){
                    item.ischecked = true;
                }
            })
            this.$forceUpdate();
        },
        // 打印条码
        print(){
            // 删除已插入的node节点
            let delNode = document.getElementById("printTagId");
            if(this.common.isNotBlank(delNode)) document.body.removeChild(delNode);
            let tag = "";
            this.codeList.forEach(item => {
                if(item.ischecked){
                    let innerDom;
                    if(item.equipmentIdx){
                        innerDom = `<div class="num">${ item.equipmentIdx }</div>`
                    }else{
                        innerDom = `<div class="equipmentNum">${ item.equipmentNum }</div>`
                    }
                    let dom = `
                        <div class="codeItem outTag">
                            <img class="code" src="${item.qrcodeFileUrl}" alt="">
                            <div class="item">
                                <label class="label">设备名称：</label>
                                <div class="text">${item.equipment}</div>
                            </div>
                            <div class="item">
                                <label class="label">设备编号：</label>
                                <div class="text">${item.equipmentNum}</div>
                            </div>
                            ${innerDom}
                        </div> 
                    `
                    tag += dom;
                }
            })            
            if (this.common.isBlank(tag)) {
                this.$message.error("请至少选择一个标签！");
                return;
            }
            let view = document.createElement("div");
            view.style.display = "none";
            view.innerHTML = tag;
            view.id = 'printTagId';
            document.body.appendChild(view);
            printJS({
                printable: printTagId,
                type: 'html',
                css: './static/css/printInspectionCode.css',  //真实路径/public//static/css/printInspectionCode.css
                scanStyles: false,
            })  
        },
        /**
         * 关闭当前页面
         */
        close()
        {
            this.$emit("closeTab",this.$route.meta.id);
            this.$parent.$emit("closeTab",this.$route.meta.id);
        },
    },
}
