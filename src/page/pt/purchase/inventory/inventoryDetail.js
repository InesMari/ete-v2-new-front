import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
    name: "inventoryDetail",
    components: {
        fileViewer,
    },
    data() {
        return {
            info: {},
            bigImageUrl:null,
            srcList: [],
        };
    },
    mounted() {
        this.doQuery();
    },
    methods: {
        // 初始化数据
        async doQuery() {
            let data = await this.common.postUrl('purStockService','loadPurStockById',{id:this.$route.query.id});
            this.info = data.info;
            this.$forceUpdate();
        },
        /**
         * 关闭当期页面
         */
        closePage()
        {
            this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
        },
        seeBigImg(url){
            this.bigImageUrl = url;
            this.$refs.viewer2.show();
            this.$forceUpdate();
        },
        showImg(data){
            if(!data.url){
                this.$message.error("没有图片~");
                return;
            }
            let typeList = {
                img:".gif,.GIF,.jpg,.JPG,.png,.PNG,.jpeg,.JPEG,.ico,.ICO",
                table:".xls,.xlsx,.XLS,.XLSX",
                file:"file"
            };
            let fileTypeName = data.url.substring(data.url.lastIndexOf('.'), data.url.length);
            if(typeList['img'].indexOf(fileTypeName)>-1){
                this.srcList=[];
                this.srcList.push(data.url);
                this.$refs.viewer.show();
            }else{
                data.url = data.url.replace("_big", "");
                let url = data.url;
                let fileType = this.common.getFileType('',url);
                if(fileType=='pdf'){   //查看pdf
                    let idx = url.indexOf("?");
                    if(idx>=0){
                        url = url.substring(idx,0);
                    }
                    this.srcList=[];
                    this.srcList.push(url);
                    this.$refs.viewer.show();
                }else if(fileType=='excel'||fileType=='word'||fileType=='ppt'){
                    this.srcList=[];
                    this.srcList.push(url);
                    this.$refs.viewer.show();
                }else{  //下载文件
                    this.common.downloadFile(url)
                }
            }
        },
        toPurOrder(item){
            this.$emit("openTab", {
                query:{id:item.purchaseId,type:0},
                urlId: 'detailPurOrder' + item.purchaseId + 0,
                urlName: '采购单详情',
                urlPathName: '/purFeeDetail',
                urlPath: "/pt/purchase/purOrder/addPurOrder.vue",
            });
        },
        toContract(item){
            let baseTitle = '';
            if(item.contractType==2){
                baseTitle = "供应商-运输";
            }else if(item.contractType==3){
                baseTitle = "供应商-仓储运作";
            }else if(item.contractType==4){
                baseTitle = "供应商-器具容器";
            }else if(item.contractType==5){
                baseTitle = "供应商-保险";
            }
            let title = "查看"+baseTitle+"合同";
            this.$emit('openTab', {
                urlName: title,
                urlId: 'contractDetail'+new Date().getTime(),
                urlPathName: "/contractDetail",
                urlPath: "/pt/cm/contract/contractDetail.vue",
                query: {type:3,contractType:item.contractType,id:item.contractId},
            });
        },
    },
};