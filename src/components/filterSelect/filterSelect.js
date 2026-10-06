/*
    list                下拉框数据
    placeholder         输入提示
    tenantFullName      全称字段
    tenantName          简称字段
    tenantId            id字段

    ****
    方法：
    filterSelectCallback    选择后回调
*/
export default {
    name: 'filterSelect',
    props:["list","placeholder","tenantFullName","tenantName","tenantId"],
    data() {
        return {
            listData:[]
        }
    },
    mounted(){
        //配置全称字段
        if(this.common.isBlank(this.tenantFullName)){
            this.fullName = "tenantFullName"
        }else{
            this.fullName = this.tenantFullName;
        }
        //配置简称字段
        if(this.common.isBlank(this.tenantName)){
            this.name = "tenantName"
        }else{
            this.name = this.tenantName;
        }
        //配置id字段
        if(this.common.isBlank(this.tenantId)){
            this.id = "tenantId"
        }else{
            this.id = this.tenantId;
        }
    },
    methods:{
        dataFilter(data){
            let _this = this;
            this.listData = [];
            this.list.forEach(item => {
                if(item[_this.fullName].toLowerCase().indexOf(data)>-1 || item[_this.name].toLowerCase().indexOf(data)>-1){
                    _this.listData.push(item);
                }
            })
            this.$forceUpdate();
        },
        selectValue(item){
            this.$emit("filterSelectCallback",item);
            this.$forceUpdate();
        }
    },
    watch:{
        list:{
            handler(n,o){
                this.listData = this.common.copyObj(n);
            }
        }
    }
}