import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import fileViewer from '@/components/myFile/file-viewer.vue';
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
	name: 'outDeviceClearUpRecordManage',
	data()
	{
		return {
			head: [
				{"name": "整理单号", "code": "recordNum", "width": "150", "type": "text"},
				{"name": "供应商", "code": "supplierTenantName", "width": "200", "type": "text"},
				{"name": "登记类型", "code": "dealTypeName", "width": "120", "type": "text"},
				{"name": "登记数量", "code": "dealNum", "width": "120", "type": "text"},
				// {"name": "仓库", "code": "srcWorkName", "width": "120", "type": "text"},
				{"name": "回单附件", "code": "file", "width": "110", "type": "diy"},
				{"name": "整理日期", "code": "actualDate", "width": "150", "type": "text"},
				{"name": "确认状态", "code": "confirmStateName", "width": "150", "type": "text"},
				{"name": "确认时间", "code": "confirmDate", "width": "150", "type": "text"},
				{"name": "确认人", "code": "confirmUserName", "width": "150", "type": "text"},
				{"name": "创建人", "code": "createUserName", "width": "180", "type": "text"},
				{"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
				{"name": "备注", "code": "remark", "width": "120", "type": "text"},
			],
			query: this.initQuery(this.$route.query.feeCostIds),
			pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
			srcList: [],	//图片列表
			workData: [],
			confirmData: [],
			dialogShow: false,
			info: this.initInfo(),
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
			query.type = 2;
			query.dealType = 13;
			await this.$refs.table.load("deviceRecordService", "queryDeviceRecordPage", query);
		},
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
			this.confirmData = [];
			this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
			let confirmData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "CONFIRM_STATE"});
			for (let i = 0; i < confirmData.length; i++)
			{
				if (confirmData[i].codeValue != 2)
				{
					this.confirmData.push(confirmData[i]);
				}
			}
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
				useTenantName: '',
				dealType: '',
				createDate: null,
				confirmState: null,
			};
		},
		initInfo()
		{
			return this.info = {
				id:null,
				recordNum:null,
				actualDate:null,
				dealNum:null,
				remark:null,
			};
		},
		/**
		 * 打开详情
		 * @param item
		 */
		openDetail(item)
		{
			this.$emit("openTab",{
				urlId: 'outDeviceClearUp' + item.id,
				query: {id: item.id, type: 0},
				urlName: "客户器具整理详情",
				urlPathName: "/outDeviceClearUp",
				urlPath: "/pt/wms/device/outDeviceClearUp.vue"});
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
		openConfirm(flag)
		{
			this.initInfo();
			if (flag)
			{
				let selectData = this.$refs.table.getSelectItem();
				if (selectData.length != 1)
				{
					this.$message.error("请至少选择一条数据！");
					return false;
				}
				if (selectData[0].confirmState != 0)
				{
					this.$message.error("不是待确认的数据不能操作！");
					return false;
				}
				this.info = selectData[0];
			}
			this.dialogShow = flag;
			this.$forceUpdate();
		},
		async saveOutDeviceRecordConfirm()
		{
			if (this.common.isBlank(this.info.id))
			{
				this.$message.error("请重新选择整理记录！");
				return false;
			}
			let param = {id: this.info.id};
			await this.common.postUrl("deviceRecordService", "saveOutDeviceRecordConfirmById", param, null,null,'',true);
			this.$message.success("确认成功！");
			this.openConfirm(false);
			this.doQuery();
		},
		/**
		 * 导出
		 */
		download() {
			if (this.common.isBlank(this.query.createDate))
			{
				this.$message.error("请选择一个不超过365天的整理时间再导出！");
				return false;
			}
			if (this.common.isNotBlank(this.query.startCreateDate))
			{
				let start = new Date(this.query.startCreateDate);
				let end = new Date(this.query.endCreateDate);
				start.setTime(start.getTime() + 1000 * 60 * 60 * 24 * 365);
				if (start.getTime() < end.getTime())
				{
					this.$message.error("导出的整理开始时间:" + this.query.startCreateDate + " 和整理结束时间：" + this.query.endCreateDate + "相差不能超过365天！");
					return false;
				}
			}
			this.$refs.table.downloadExcelFile();
		},
	},
}
