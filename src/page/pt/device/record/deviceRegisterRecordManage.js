import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import fileViewer from '@/components/myFile/file-viewer.vue';
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
	name: 'deviceRegisterRecordManage',
	data()
	{
		return {
			head: [
				{"name": "登记单号", "code": "recordNum", "width": "150", "type": "text"},
				{"name": "器具名称", "code": "deviceName", "width": "200", "type": "text"},
				{"name": "器具规格", "code": "spec", "width": "200", "type": "text"},
				{"name": "所属人", "code": "srcTenantName", "width": "200", "type": "text"},
				{"name": "使用客户", "code": "useTenantName", "width": "200", "type": "text"},
				{"name": "登记数量", "code": "dealNum", "width": "120", "type": "text"},
				{"name": "在库余量", "code": "stockNum1", "width": "120", "type": "text"},
				{"name": "客户处余量", "code": "stockNum2", "width": "120", "type": "text"},
				{"name": "未回收余量", "code": "stockNum3", "width": "120", "type": "text"},
				{"name": "登记金额", "code": "fee", "width": "120", "type": "text"},
				{"name": "来源地", "code": "srcWorkName", "width": "120", "type": "text"},
				{"name": "交付地", "code": "destWorkName", "width": "120", "type": "text"},
				{"name": "出入库单号", "code": "orderNum", "width": "200", "type": "diy"},
				{"name": "附件", "code": "file", "width": "110", "type": "diy"},
				{"name": "登记/操作类型", "code": "dealTypeName", "width": "200", "type": "text"},
				{"name": "备注", "code": "remark", "width": "120", "type": "text"},
				{"name": "实际时间", "code": "actualDate", "width": "150", "type": "text"},
				{"name": "登记人", "code": "createUserName", "width": "180", "type": "text"},
				{"name": "登记时间", "code": "createDate", "width": "150", "type": "text"},
				{"name": "客户确认状态", "code": "confirmStateName", "width": "100", "type": "text"},
				{"name": "客户确认日期", "code": "confirmDate", "width": "150", "type": "text"},
			],
			query: this.initQuery(this.$route.query.feeCostIds),
			pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
			dealTypeData:[],//登记类型

			srcList: [],	//图片列表
			workData: [],
		}
	},
	/**
	 * 初始化
	 */
	mounted()
	{
		this.doQuery();
		this.initData();
	},
	/**
	 * 组件
	 */
	components: {
		tableCommon,
		enumData,
		fileViewer,
		myFileModel
	},
	/**
	 * 绑定函数
	 */
	methods: {
		/**
		 * 列表查询
		 */
		async doQuery()
		{
			let query = this.query
			if(this.common.isNotBlank(query.createDate) && query.createDate.length === 2){
				query.startCreateDate = query.createDate[0];
				query.endCreateDate = query.createDate[1];
			}else{
				query.startCreateDate = '';
				query.endCreateDate = '';
			}
			query.isLoadWork = 1;
			await this.$refs.table.load("deviceRecordService", "queryDeviceRecordPage", query);
		},
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
			this.dealTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "DEV_DEVICE_OP_TYPE"});
			for (let i = 0; i < this.dealTypeData.length; i++)
			{
				let item = this.dealTypeData[i];
				if (item.codeValue == 6)
				{
					this.dealTypeData.splice(i, 1);
					i--;
				}
			}
			this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
		},
		/**
		 * 初始化查询条件
		 * @returns
		 */
		initQuery(feeCostIds)
		{
			return this.query = {
				feeCostIds:feeCostIds,
				recordNum: '',
				deviceName: '',
				srcTenantName: '',
				dealType: '',
				createDate: null,
			};
		},
		/**
		 * 打开详情
		 * @param data
		 */
		openDetail(item, code)
		{
			if (item.opType == 4)
			{
				this.$emit("openTab",{
					urlId: "inOrderDetail"+item.orderId,
					query: {inOrderId:item.orderId,
						logId: item.orderId,
						logType: enumData.LOG_TYPE.WMS_IN_ORDER,
					},
					urlName: '入库单详情',
					urlPathName: "/inOrderDetail",
					urlPath: '/pt/wms/ord/inOrderDetail.vue'});
			}
			else
			{
				this.$emit("openTab",{
					urlId: "urlId"+item.orderId,
					query: {outOrderId:item.orderId,
						logId: item.orderId,
						logType: enumData.LOG_TYPE.WMS_OUT_ORDER,
					},
					urlName: '出库单详情',
					urlPathName: "/outOrderDetail",
					urlPath: '/pt/wms/ord/outOrderDetail.vue'});
			}
		},

		//待开发
		deletePackMaterialRecord()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要删除的包材登记数据！");
				return false;
			}
			let data = selectData[0];
			let that = this;
			that.$confirm("确认删除这个包材登记？", "提示").then(() =>{
				that.common.postUrl("wmsPackMaterialTF", "deletePackMaterialRecord", data, function (data)
				{
					that.doQuery();
					that.$message.success("删除成功！");
				},null,'',true);
			}).catch(() =>{});

		},
		showImg(data){
			if(!data.fileUrl){
				return;
			}
			let typeList = {
				img:".gif,.GIF,.jpg,.JPG,.png,.PNG,.jpeg,.JPEG,.ico,.ICO",
				table:".xls,.xlsx,.XLS,.XLSX",
				file:"file"
			};
			let fileTypeName = data.fileUrl.substring(data.fileUrl.lastIndexOf('.'), data.fileUrl.length);
			if(typeList['img'].indexOf(fileTypeName)>-1){
				this.srcList=[];
				this.srcList.push(data.fileUrl);
      			this.$refs.viewer.show();
			}else{
				data.fileUrl = data.fileUrl.replace("_big", "");
                let url = data.fileUrl;
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
		/**
		 * 导出
		 */
		download() {
			if (this.common.isBlank(this.query.createDate))
			{
				this.$message.error("请选择一个不超过365天的登记时间再导出！");
				return false;
			}
			if (this.common.isNotBlank(this.query.startCreateDate))
			{
				let start = new Date(this.query.startCreateDate);
				let end = new Date(this.query.endCreateDate);
				start.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 365);
				if (start.getTime() < end.getTime())
				{
					this.$message.error("导出的登记开始时间:" + this.query.startCreateDate + " 和登记结束时间：" + this.query.endCreateDate + "相差不能超过365天！");
					return false;
				}
			}
			this.$refs.table.downloadExcelFile();
		},
	},
}
