import lodopUtil from "@/utils/lodop/lodop-business.js"
import printJS from 'print-js'

export default {
    name: 'codePrintView',
    data() {
        return {
            codeList:[],
            simpleFlag:this.$route.query.simpleFlag==1?true:false,
        }
    },
    /**
     * 初始化
     */
    mounted() {
        this.initInfo();
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
        initInfo(){
            let that = this;
            this.common.postUrl("wmsStockMaterialTF", 'queryStockMaterialQrcodeList', {isNew: this.$route.query.isNew,ids:this.$route.query.ids,stockMaterialDtlId:this.$route.query.stockMaterialDtlId}, function (data) {
                data.forEach(item => {
                    item.selVal = item.batchNum
                    if(that.common.isNotBlank(item.produceDate)){
                        item.produceDateShow = item.produceDate.substr(0,10)
                    }
                })
                that.codeList = data;
            });
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
        /**
         * 打印条码
         */
        printCode(){
            // 删除已插入的node节点
            let delNode = document.getElementById("printQrCodesId");
            if(this.common.isNotBlank(delNode)) document.body.removeChild(delNode);
            let tag = "";
            this.codeList.forEach(item => {    
                let selDom = "";
                if(item.selVal == item.batchNum){
                    selDom = `<p class="printQrCodeP" style="line-height: 1;text-align: center;font-size:9px;">批次号：${item.batchNum}</p>`
                }else if(item.selVal == item.supplierBatchNum){
                    selDom = `<p class="printQrCodeP" style="line-height: 1;text-align: center;font-size:9px;">供应商批次号：${item.supplierBatchNum}</p>`
                }else if(item.selVal == item.asn){
                    selDom = `<p class="printQrCodeP" style="line-height: 1;text-align: center;font-size:9px;">ASN：${item.asn}</p>`
                }
                let domTwo = "";
                if(this.common.isNotBlank(item.produceDateShow)){
                    domTwo = `
                        <p class="printQrCodeP" style="line-height: 1;text-align: center;font-size:9px;">
                            <span style="margin-right:10px;">物料数量：${item.nums}</span>
                            <span>生产日期：${item.produceDateShow}</span>
                        </p>
                    `
                }else{
                    domTwo = `
                        <p class="printQrCodeP" style="line-height: 1;text-align: center;font-size:9px;">
                            <span>物料数量：${item.nums}</span>
                        </p>
                    `
                }
                let dom = `
                    <div class="printQrCodeView">
                        <img border='0' src='${item.qrcodeUrl}' class="img" style="margin-top:1mm;width:100%;"/>
                        <div>
                            <p class="printQrCodeP" style="line-height: 1;text-align: center;font-size:9px;">物料编码：${item.materialNum}</p>
                            ${domTwo}
                            ${selDom}
                        </div>
                    </div>
                `
                tag += dom;
                // lodopUtil.printQrcode(imgDom,tDom);
            })
            let view = document.createElement("div");
            console.log(view)
            view.style.display = "none";
            view.innerHTML = tag;
            view.id = 'printQrCodesId';
            document.body.appendChild(view);
            printJS({
                printable: printQrCodesId,
                type: 'html',
                css: './static/css/print.css',  //真实路径/public//static/css/print.css
                scanStyles: false
            })
        },
    },
}
