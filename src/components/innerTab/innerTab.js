export default {
    name: 'innerTab',
    props:[
        'tabs'
    ],
    data(){
        return{
            tabList:[]
        }
    },
    mounted(){
        this.tabList = this.common.copyObj(this.tabs);
    },
    methods:{
        selTab(tab){
            this.tabList.forEach(el => {
                el.active = false;
            });
            tab.active = true;
            this.$forceUpdate();
            this.$emit("selectCallback",tab);
            this.common.setSearchIsshowAll();
        },
        refresh(){
            this.tabList = this.common.copyObj(this.tabs);
        }
    },
    watch:{
        tabs:{
            handler(n){
                this.tabList = this.common.copyObj(n);
            },
            deep:true
        }
    }
}