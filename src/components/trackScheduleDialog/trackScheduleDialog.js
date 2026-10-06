export default {
    name: 'innerTab',
    props:[
       
    ],
    data(){
        return{
            isshowSchedule:false,
            orderShowData:{},
        }
    },
    mounted(){
        
    },
    methods:{
        showDialog(orderShowData){
            console.log(orderShowData);
            let that = this;
            that.orderShowData = orderShowData;
            let route = {};
            route.outgoingTrackingNum = orderShowData.outgoingTrackingNum;//物流单号
            route.orderId = orderShowData.orderId;//订单号
            that.common.postUrl("api/kdBusinessParamBO.ajax?cmd=queryRoutes", route,function(data){
                let routes = data.items;
                if(that.common.isBlank(routes) || routes.length == 0){
                    that.$message({"type":"success", message: "暂无跟踪信息！"});   
                    return;
                }
                that.isshowSchedule = true;
                that.orderShowData.routes = routes;
            },null,null,true);
        }
    },
}