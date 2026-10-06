export default {
    /** 打开页面类型 **/
    OPEN_PAGE_TYPE: {
        DETAIL: 0,//查看详情
        ADD: 1,//新增
        UPDATE: 2,//修改
        VERIFY: 3,//审核
        PRINT: 4,//打印
        
        COPY: 6,//复制
    },
    /** 调度类型 **/
    dispatchType: {
        shareDispatch: 1,//拼车调度
        pickTransitDispatch: 2,//提货中转
        fullWholeDispatch: 3,//整车调度
        transitDispatch: 4,//中转调度
    },
    /** 订单类型 **/
    orderType: {
        vehicleOneWay: 1,//整车
        vehicleTwoWay: 2,//整车-返程
        lessThanCarload: 3,//零担
    },
    /** 订单状态 **/
    orderState: {
        /** 0 待调度：该订单下没有运单 **/
        PREP_DISPATCH: 0,

        /** 1 运作中：有运单且调度中；有未完成运单且调度完成 **/
        IN_OPERATION: 1,

        /** 2 已完成：该订单下所有运单都已完成且调度状态调度完成 **/
        FINISHED: 2,

        /** 3 已取消：未派车状态下取消订单 **/
        CANCELLED: 3,

        /** 4 异常中止：已派车、运作中状态下取消订单 **/
        ABORT: 4,

        /** 10 待接单：货主下单，平台未接单 **/
        PREP_RECEIVE: 10,

        /** 11 拒单：货物下单，平台拒单 **/
        REFUSE: 11,
    },
    /** 作业类型 **/
    workType: {
        pretend: 1,//提
        discharge: 2,//卸
        loadingUnloading: 3,//提+卸
    },
    /** 结算方式 **/
    payMode: {
        monthPay: 1,//月结
        pickupPay: 2,//提付
        spotPay: 3,//现付
        receiptPay: 4,//回单付
        multiPay: 5,//多笔付
    },
    /** 订单计费方式 **/
    billingTypeOrder: {
        byVehicle: 1,//按整车
        byVolume: 2,//按体积
        byNetweight: 3,//按净重
        byGrossweight: 4,//按毛重
        count: 5,//按件数
    },
    /** 计费方式 **/
    billingType: {
        byVehicle: 1,//按整车
        byVolume: 2,//按体积
        byWeight: 3,//按重量
    },
    /**
     * 运单状态
     */
    waybillState:{
        /** 0 待派车：未调度车辆 **/
        waitAppointVehicle:0,
        /** 1 待出车：已调度车辆 **/
        waitStartVehicle:1,
        /** 2 运输中：司机小程序点击出车操作；中转跟踪节点 **/
        inWay:2,
        /** 3 已完成：司机小程序点击收车操作；手工完成； **/
        finished:3,
        /** 4 已取消：运单未派车状态下取消运单 **/
        cancelled:4,
        /** 5 异常中止：运单已派车、运作中状态下取消运单 **/
        abort:5,
    },

    /**
     * 中转管理操作类型
     */
    transitOpType: {
        /** '中转跟踪'-1 **/
        track: 1,
        /** '修改中转'-2 **/
        modify: 2,
        /** '查看中转'-3 **/
        view: 3,
        /** '费用异动'-4 **/
        feeMove: 4,
    },

    /**
     * 中转跟踪节点状态
     */
    transitOpNodeState: {
        /** 0	待提货 **/
        waitPickup: 0,
        /** 1	提货中 **/
        pickuping: 1,
        /** 2	运输中 **/
        transiting: 2,
        /** 3	已完成 **/
        completed: 3,
    },

    /** 设备类型 **/
    equipmentType: {
        locate: 1,//定位器
        marking: 2,//部标机
        lock: 3,//电子锁
        bs: 4,//巴蜀
    },
    /**
     * 数据状态
     */
    STS:
    {
        /**有效*/
        VALID: 1,
        /**无效*/
        NULLITY: 0,
    },
    /**
     * 账单确认状态
     */
    FC_CONFIRM_STATE:
    {
        /**未确认**/
        UNCONFIRMED: 0,
        /**已确认**/
        CONFIRMED: 1,
    },
    /**
     * 发票申请状态
     */
    APPLY_INVOICE_STATE:
    {
        NOT_APPLY: 0,//未申请
        PART_APPLY: 1,//部分申请
        ALL_APPLY: 2,//全部申请
    },
    /** 发票审核状态 **/
    verifyState: {
        notReviewed: 0,//未审核
        approved: 1,//审核通过
        noApproved: 2,//审核不通过
    },
    /** 票据类型 **/
    invoiceType: {
        genralVote: 1,//增值税普票
        specialTicket: 2,//增值税专票
    },
    /** 开票状态 **/
    invoiceState: {
        noInvoiced: 0,//未开票
        invoiced: 1,//已开票
    },
    /**
     * 日期选择
     */
    DATE_SHORTCUT_OPTIONS:
    {
        shortcuts: [{
            text: '今天',
            onClick(picker) {
                picker.$emit('pick', new Date());
            }
        }, {
            text: '昨天',
            onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
            }
        }, {
            text: '一周前',
            onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
            }
        }]
    },
    /**
     * 日期范围快捷选项
     */
    DATE_RANGE_SHORTCUT_OPTIONS:
    {
        shortcuts: [{
            text: '最近一天',
            onClick(picker)
            {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近一周',
            onClick(picker)
            {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近一个月',
            onClick(picker)
            {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - 1);
                picker.$emit('pick', [start, end]);
            }
        }, {
            text: '最近三个月',
            onClick(picker)
            {
                const end = new Date();
                const start = new Date();
                start.setMonth(start.getMonth() - 3);
                picker.$emit('pick', [start, end]);
            }
        },{
            text: '本月份',
            onClick(picker)
            {
                const start = new Date();
                const end = new Date();
                start.setDate(1);
                end.setMonth(end.getMonth() + 1);
                end.setDate(0);
                picker.$emit('pick', [start, end]);
            }
        }
        ],
    },
    /**
     * 客户账单选项类型 1 运输订单 2 仓储费用 3 客户其他费用  4  账单补录费用 （后期添加）5包装租赁费用
     *
     * 11 账单操作记录 12 开票申请记录 13 发票审核记录 14 发票开具记录 15 收款登记记录 new
     *
     * 5 账单操作记录 6 开票申请记录 7 发票审核记录 8 发票开具记录 9 收款登记记录   old
     */
    FC_CUST_BILL_ITEM_TYPE:
    {
        ORDER: 1,
        STOREHOUSE: 2,
        PROJECTSUNDRY: 3,
        PACKLEASE: 4,
        BILLSUPPLEMENT: 5,


        /*BILL_OP_RECORD: 5,
        APPLY_INVOICE: 6,
        APPLY_VERIFY: 7,
        INVOICE_ISSUE: 8,
        RECEIVE: 9,*/

        BILL_OP_RECORD: 11,
        APPLY_INVOICE: 12,
        APPLY_VERIFY: 13,
        INVOICE_ISSUE: 14,
        RECEIVE: 15,
    },
    /**
     * 收款登记状态
     */
    RECEIVE_STATE:
    {
        NOT_REGISTER: 0,//未登记
        PART_REGISTER: 1,//部分登记
        REGISTER: 2,//已登记
    },

    /**
     * 客户账单选项类型 1 运输单 2 仓储费用 3 客户其他费用  4  账单补录费用 5 账单操作记录 6 发票提交记录 7 发票审核记录 8 付款登记记录
     */
    FC_SUPPLIER_BILL_ITEM_TYPE: {
            WAYBILL: 1,
            STOREHOUSE: 2,
            PACKCOST: 3,
            // PROJECTSUNDRY: 4,
            BILLSUPPLEMENT: 4,
            BILL_OP_RECORD:5,
            SUBMIT_INVOICE:6,
            VERIFY_INVOICE:7,
            PAY:8,
        },

    SUBMIT_INVOICE_TYPE:{
        WAYBILL: 1,
        STOREHOUSE: 2,
        PROJECTSUNDRY: 3,
        BILLSUPPLEMENT: 4,
    },
    /**
     * 对账状态
     */
    RECONCILIATION_STATE:{
        NO: 0,//未对账
        YES: 1,//已对账
    },
    /**
     * 比较文本
     */
    compareText:[
        {value:'>',label:'>'},
        {value:'<',label:'<'},
        {value:'>=',label:'>='},
        {value:'<=',label:'<='},
        {value:'=',label:'='},
    ],
    /**
     * 车辆属性
     */
    VEHICLE_ATTRIBUTION:
    {
        /**1-平台车辆**/
        PLATFORM_VEHICLE: 1,
        /**2-科技自有车**/
        TECHNOLOGY_OWN_CAR: 2,
        /**3-供应链自有车**/
        SUPPLY_CHAIN_OWN_CAR: 3,
    },
    /**
     * 车辆属性
     */
    PAY_STATE:
    {
        /**0-未付款**/
        NOT_PAY: 0,
        /**1-全部付款**/
        ALL_PAY: 1,
        /**2-部分付款**/
        PART_PAY: 2,
    },
    /**
     * 确认收货
     */
    PURCHASE_ORDER_STATE:
    {
        /**0-未收货**/
        UNRECEIVED: 0,
        /**1-确认收货**/
        SURE_RECEIVED: 1,
        /**2-部分确认收货**/
        PART_SURE_RECEIVED: 2,
        /**9-已取消**/
        CANCELLED: 9,
    },
    /**
     * 货物类型
     */
    GOODS_TYPE:
    {
        /**常规货物*/
        CONVENTIONAL_GOODS: 1,
        /**包装货物*/
        PACK_GOODS: 2,
        /**仓储货物*/
        WAREHOUSE_GOODS: 3,
    },

    /**
     * 租户类型 1 平台 2 货主 3 供应商
     * @author yangliu
     */
    TENANT_TYPE:{
        /**平台*/
        PT: 1,
        /**货主*/
        HZ: 2,
        /**供应商*/
        GYS: 3,
    },
    ORDER_TYPE:
    {
        /**整车*/
        VEHICLE_ONE_WAY: 1,
        /**整车-双程*/
        VEHICLE_TWO_WAY: 2,
        /**零担*/
        LESS_THAN_CARLOAD: 3,
    },
    quoteLevel:
    {
        PRESS_WORK: 1,
        PRESS_REGION: 2,
    },
    /**
     * 报价类型
     * 报价类型 1 客户报价 2 供应商报价
     */
    quoteType:
    {
        CUSTOMER: 1,//客户
        SUPLIER: 2,//供应商
    },
    /**
     * 报价子类型
     * 报价子类型 1 整车报价 2 零担报价
     */
    quoteSubType:
    {
        VEHICLE_ONE_WAY_QUOTE: 1,
        LESS_THAN_CARLOAD_QUOTE: 2,
        WMS_QUOTE: 3,
    },

    /**
     * 供应商类型
     */
    SUPPLIER_TYPE:
    {
        individual: 1,	//个体供应商
        enterprise: 2,	//企业供应商
        dedicated_line: 3,	//专线供应商
    },
    weekDataMap: new Map().set(0, "周日").set(1, "周一").set(2, "周二").set(3, "周三").set(4, "周四").set(5, "周五").set(6, "周六"),
    yuanMap: new Map().set('0', "零").set('1', "壹").set('2', "贰").set('3', "叁").set('4', "肆").set('5', "伍").set('6', "陆").set('7', "柒").set('8', "捌").set('9', "玖"),
    
    /**
     * 供应商类型
     */
    WMS_PACK_OP_TYPE:
    {
        IN_VMI: 1,	//入VMI仓
        RETURN_ARRIVAL_MANUFACTURER: 2,	//返回到货厂商
        DELIVERY_CONSIGNOR: 3,	//配送到货主
        IN_DEAL: 4,	//入库单处理
        OUT_DEAL: 5,	//出库单处理
        CUST_IN_VMI:6,
    },
    /**
     * 单据状态 1 未审核 2 审核中 3 审核完毕 4 已完结 （审核完毕才能打印，打印以后变成已完结）5已付款 9 审核不通过（不能再操作）10已取消 11 已作废
     */
    FC_STS:
    {
        WAIT: 1,
        DOING: 2,
        DONE: 3,
        PRINTED: 4,
        PAYED:5,
        NOT: 9,
        CANCEL: 10,
        INVALID: 11,
    },

    /** 申请审核状态 **/
    applyVerifyState: {
        notReviewed: 0,//未审核
        approving: 1,//审核中
        noApproved: 2,//审核不通过
        approved: 3,//审核完
    },
    /**
     * 请款付款费用类型
     * 1 请款	2 付款
     */
    PAY_TYPE:
    {
        REQ: 1,
        PAY: 2,
    },
    rfqQuoteType:
    {
        ZC: 1,
        LD: 2,
        WMS: 3,
    },
    LOG_TYPE:
    {
        /******************  客户中心  ******************/
        CUSTOMER : 100001,
        ROUTE : 100002,
        WORK : 100003,
        GOODS : 100004,
        QUOTE : 100005,
        WMS_CONTRACT : 100006,
        DEVICE_CONTRACT : 100007,
        WMS_QUOTE_SHEET : 100008,
        QUOTE_SHEET : 100009,

        /******************  资源中心  ******************/
        SUPPLIER : 200001,
        BANK : 200002,
        VEHICLE : 200003,
        DRIVER : 200004,
        GPS : 200005,
        SECTION_QUOTE : 200006,
        WMS_FEE : 200007,
        SUPERCARGO : 200008,
        DRIVER_ASSESSMENT : 200009,
        VEHICLE_FIXED_COST : 200010,
        VEHICLE_WAYBILL_COST : 200011,
        VEHICLE_REPAIR_COST : 200012,
        PERSONNEL_COST : 200013,
        WAYBILL_MILEAGE : 200014,
        WORK_CONTRACT : 200015,
        ANNUAL_INSPECTION : 200016,


        /******************  运输中心  ******************/
        ORDER : 300001,//订单ord_order_op_log
        ORDER_EXT : 300002,

        /******************  仓储中心  ******************/
        RESERVOIR : 400001,
        STORAGE : 400002,
        CONSIGNOR : 400003,
        MATERIAL : 400004,
        WORK_DETAIL : 400005,
        VEHICLE_WORK : 400006,
        WORK_ORDER : 400007,
        WMS_IN_ORDER : 400008,
        WMS_OUT_ORDER : 400009,
        STOCK_MATERIAL_INFO : 400010,
        STOCK_MATERIAL_DTL : 400011,
        STOCK_CODE : 400012,
        STOCK_ALLOCAT : 400013,
        WMS_WAYBILL : 400014,
        WMS_FEE_COST_OPERATE : 400015,
        WMS_APPOINT : 400016,
        CUST_APPOINT : 400017,
        WMS_WAYBILL_RECEIPTS : 400018,
        WMS_STOCK_INVENTORY : 400019,
        WMS_QRCODE : 400020,
        WMS_SENSOR : 400021,
        WMS_FEE_INCOME : 400022,
        WMS_FEE_COST : 400023,


        /******************  器具中心  ******************/
        INSTRUMENT : 50000,//器具中心

        /******************  商务中心  ******************/
        COMMERCIAL : 60000,//商务中心

        /******************  财务中心  ******************/
        FINANCE : 70000,//财务中心

        /******************  行政中心  ******************/
        ADMINISTRATION : 80000,//行政中心

        /******************  文件中心  ******************/
        FILE : 90000,//文件中心

        /******************  采购中心  ******************/
        PURCHASE : 100000,//采购中心

        /******************  数据中心  ******************/
        DATA : 110000,//数据中心

        /******************  异常中心  ******************/
        EXCEPTION : 120000,//异常中心

        /******************  基础  ******************/
        BASE : 130000,//基础
    },
}
