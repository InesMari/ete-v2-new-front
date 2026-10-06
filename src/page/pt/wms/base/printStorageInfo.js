import lodopUtil from "@/utils/lodop/lodop-business.js"
import printJS from 'print-js'
export default {
    name: 'printStorageInfo',
    data() {
        return {
            param: this.$route.query,
        }
    },
    mounted() {
        this.initData();
    },
    methods: {
        // 初始化页面数据 - 修改或复制时调用
        async initData(){

        },
        /**
         * 打印条码
         */
        printCode(){   
            let imgDom = `
                <img border='0' src='${this.param.qrImgPath}'/>
            `;
            let tDom = `
                <div>
                    <p style="line-height: 5px;text-align: center;font-size:9px;">库区：${this.param.reservoirName}</p>
                    <p style="line-height: 5px;text-align: center;font-size:9px;">库位：${this.param.storageCode}</p>
                </div>
            `
            lodopUtil.printQrcode(imgDom,tDom);
        },
        /**
         * 关闭当前页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
    },
}
