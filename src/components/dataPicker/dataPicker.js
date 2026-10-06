/*
    model            
    placeholder      

    ****
    方法：
    filterSelectCallback    选择后回调
*/
export default {
    name: 'dataPicker',
    props:['model','startPlaceholder','endPlaceholder'],
    data() {
        return {
            pickerOptions:{     //日期时间快捷键配置
              shortcuts: [
                {
                  text: '今天',
                  onClick(picker) {              
                    var start = new Date(new Date(new Date().toLocaleDateString()).getTime()); // 当天0点
                    var end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1); // 当天23:59
                    picker.$emit('pick', [start,end]);
                  }
                },
                {
                  text: '昨天',
                  onClick(picker) {              
                    var start = new Date(new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000); // 昨天0点
                    var end = new Date(new Date(new Date().toLocaleDateString()).getTime() - 1); // 昨天23:59
                    picker.$emit('pick', [start,end]);
                  }
                },
                {
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                },
                {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                },
                {
                    text: '上个月',
                    onClick(picker) {
                        const date = new Date();
                        let year = date.getFullYear();
                        let month = date.getMonth();
                        const start = new Date(year+"-"+month+"-1 00:00");
                        let days = new Date(year,month,0).getDate();
                        const end = new Date(year+"-"+month+"-"+days+" 23:59:59");
                        picker.$emit('pick', [start, end]);
                    }
                },
              ]
            },
        }
    },
    mounted(){
    },
    methods:{
        callback(){
            this.$emit('callback',this.model);
        }
        
    },
    // watch:{
    //     list:{
    //         handler(n,o){
    //             this.listData = this.common.copyObj(n);
    //         }
    //     }
    // }
}