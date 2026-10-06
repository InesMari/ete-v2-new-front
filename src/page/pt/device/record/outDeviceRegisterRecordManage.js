import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import fileViewer from '@/components/myFile/file-viewer.vue';
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
	name: 'outDeviceFeeDtlManage',
	data()
	{
		return {
			head: [
				{"name": "登记单号", "code": "recordNum", "width": "150", "type": "text"},
				{"name": "供应商", "code": "supplierTenantName", "width": "200", "type": "text"},
				{"name": "登记类型", "code": "dealTypeName", "width": "120", "type": "text"},
				{"name": "登记数量", "code": "dealNum", "width": "120", "type": "text"},
				{"name": "来源地", "code": "srcWorkName", "width": "120", "type": "text"},
				{"name": "交付地", "code": "destWorkName", "width": "120", "type": "text"},
				{"name": "回单附件", "code": "file", "width": "110", "type": "diy"},
				{"name": "实际日期", "code": "actualDate", "width": "150", "type": "text"},
				{"name": "创建人", "code": "createUserName", "width": "180", "type": "text"},
				{"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
				{"name": "备注", "code": "remark", "width": "120", "type": "text"},
			],
			query: this.initQuery(this.$route.query.feeCostIds),
			pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
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
			query.type = 2;
			query.dealType = 4;
			await this.$refs.table.load("deviceRecordService", "queryDeviceRecordPage", query);
		},
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
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
				useTenantName: '',
				dealType: '',
				createDate: null,
			};
		},
		/**
		 * 打开详情
		 * @param item
		 */
		openDetail(item)
		{
			this.$emit("openTab",{
				urlId: 'outDeviceRegister' + item.id,
				query: {id: item.id, type: 0},
				urlName: "外部器具登记",
				urlPathName: "/outDeviceRegister",
				urlPath: "/pt/wms/device/outDeviceRegister.vue"});
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
			this.$refs.table.downloadExcelFile();
		},
	},
}
