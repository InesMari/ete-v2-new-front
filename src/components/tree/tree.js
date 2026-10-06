/*
    treedata        树对象
    label           名称展示的字段
    editItem        是否开启双击编辑
    haveTotal       是否有子节点统计
    total           子节点统计字段
*/
export default {
    name: 'tree',
    props:["treedata","label",'editItem','haveTotal','total'],
    data() {
        return {
            
        }
    },
    mounted(){
        
    },
    methods:{
        //打开下个节点
        openTab(item){
            item.isShow = item.isShow?false:true;
            this.$forceUpdate();
        },
        // 选择节点
        selectItem(item){
            this.currentItem = item;
            this.$emit("selectItem",item);//往上递归触发方法
            this.recursionClean(this.treedata);//清理选中状态
            this.$emit("cleanSelectItem",item);//清理选中状态
            this.$set(item,"active",true);  //设置选中状态
        },
        //清理选中状态
        cleanSelectItem(){
            this.$emit("cleanSelectItem");
            this.recursionClean(this.treedata);
        },
        //递归清理选中状态和正在编辑的新增菜单
        recursionClean(item){
            item.forEach((el,index) => {
                el.active = false;//清理选中状态
                // if(el.isEdit){  //处理编辑中的节点
                //     if(el.isAddLower){  //清理正在编辑的新增菜单        
                //         item.splice(index,1);
                //     }else{  //取消编辑状态
                //         el.isEdit =false;
                //     }
                // }
                if(this.common.isNotBlank(el.children)){
                    this.recursionClean(el.children);
                }
            });
            this.$forceUpdate();
        },
        hoverItem(item){
            this.$emit("hoverItem",item);
        },
        //双击处理
        dblclickItem(item){
            if(item.type!=2) return;    //type为2的时候才可以编辑
            if(this.editItem=="true"){
                item.itemLabelCache = item[this.label];
                this.$set(item,"isEdit",true);
            }else{
                this.$emit("dblclickItem",item);
            }
        },
        disableItem(item){
            this.$emit("disableCallback",item);
        },
        saveItem(item){
            this.doOther = true;
            this.$emit("saveItem",item);
        },
        cancelItem(item){
            this.doOther = true;    //避免blur事件的触发
            if(this.common.isBlank(item.itemLabelCache)){   //为空处理
                item[this.label] = "未命名"
            }else{
                item[this.label] = item.itemLabelCache;
            }
            item.isEdit = false;
            if(item.isAddLower){    //取消新增处理
                this.treedata.splice(this.treedata.length-1,1);
                if(this.treedata.length==0){//长度为0时清空父级的item
                    this.$emit("cleanParent",this.treedata);
                }
            }
        },
        isChangeItem(item){
            let timer = setTimeout(() => {  //添加延时器看是否有其他操作
                if(!this.doOther){
                    this.saveItem(item);
                }
                this.doOther = false;
                clearTimeout(timer);
            },300)
        },
        //添加下级
        addLower(item){
            //如果正在添加下级，则取消本次操作(children可能为null可能为[])
            if(this.common.isNotBlank(item.children)&&item.children.length>0&&item.children[item.children.length-1].isEdit) return;
            let obj = {
                isEdit:true,
                children:null,
                isShow:true,
                isAddLower:true,//是否新增状态
            };
            if(this.common.isBlank(item.children)){
                item.children = [];
            }
            item.children.push(obj);
            this.$set(item,"isShow",true);
        },
        //清空父级的item
        cleanParent(item){
            item = null
        },
        //刷新树(后台重新请求后调用该方法,赋值当前页面树的选中,展开状态)
        resetTree(data){
            this.eachData(this.treedata,data);
            this.$forceUpdate();
            return data;
        },
        //刷新树的递归操作
        eachData(oldData,newData){
            oldData.forEach((el,index) => {
                if(this.common.isNotBlank(newData[index])){
                    newData[index].isShow = el.isShow;
                    newData[index].active = el.active;
                }
                // if(el[this.label]==this.currentItem[this.label]){ //重新定位到选中的节点
                //     this.selectItem(el);
                // }
                if(el.children!=null){
                    this.eachData(el.children,newData[index].children);
                }
            })
        }
    }
}