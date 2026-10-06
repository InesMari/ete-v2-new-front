import fileViewer from '@/components/myFile/file-viewer.vue';
export default {
    name: 'waybillLog',
    props:{opLogList:{type: Array}},
    data()
    {
        return {
            srcList: [],
        }
    },
    mounted()
    {
    },
    components: {
        fileViewer,
    },
    methods:
        {
            init(){
            },
            /**
             * @param e
             */
            showBig(e)
            {
                if (e.target.nodeName === 'A')
                {
                    let imgId = e.currentTarget.dataset.id;
                    let imgPath = e.currentTarget.dataset.type;
                    let imgPathUrl = e.currentTarget.dataset.num;
                    if(this.common.isBlank(imgPathUrl)){
                        this.$message.error("没有图片~");
                        return false;
                    }
                    this.srcList=[];
                    this.srcList.push(imgPathUrl);
			        this.$refs.viewer.show();
                }
                else if (e.target.nodeName === 'IMG')
                {
                    let imgPathUrl = e.target.src;
                    if(this.common.isBlank(imgPathUrl)){
                        this.$message.error("没有图片~");
                        return false;
                    }
                    this.srcList = [];
                    this.srcList.push(imgPathUrl);
                    this.$refs.viewer.show();
                }
            },
        },

}
