let hierarchy = 1;
export default {
    name: 'areaMatch',
    data() {
        return {
            options: [],
            props:{
                label: 'name',
                value: 'id',
            }
        }
    },
    mounted(){
        let that = this;
        this.common.postUrl("api/sysStaticDataBO.ajax?cmd=selectProvince","",function(data){
            data.items.forEach(el => {
                el.children = [];
                el.hierarchy = 1;
            });
            that.options = data.items;
        })
    },
    methods: {
        handleItemChange(id){
            hierarchy = 1;
            this.checkHierarchy(this.options,id);
            console.log(hierarchy);
            // let that=this;
            // let url = "api/sysStaticDataBO.ajax?cmd=selectCity&provinceId="+id;
            // this.common.postUrl(url,"",function(data){       
            //     data.items.forEach(el => {
            //         el.children = [];
            //     });         
            //     that.options.forEach(el=>{
            //         if(el.id == id.toString()){
            //             el.children = data.items;
            //         }
            //     })
            //     console.log(data);
            //     // that.regionData=data.items;
            // });
        },
        checkHierarchy(el,id){
            el.forEach(obj=>{
                if(obj.id == id.toString()){
                    hierarchy = obj.hierarchy;
                }
                if(obj.children.length>0){
                    this.checkHierarchy(obj.children,id);
                }
            })
        }
    }
}