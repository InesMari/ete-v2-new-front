  import tableCommon from "@/components/table/tableCommon.vue";
  import myFileModel from '@/components/myFileModel/myFileModel.vue';
  import fileViewer from '@/components/myFile/file-viewer.vue';
  import myImport from "@/components/myImport/myImport";
  import searchList from "@/components/searchList/searchList.vue";
  import enumData from "@/page/pt/enum";
  
  export default {
      name: 'driverManage',
      data()
      {
          return {
              head: [
                  {"name": "司机名称", "code": "driverName", "width": "120", "type": "text"},
                  {"name": "查看图片", "code": "", "width": "200", "type": "diy"},
                  {"name": "手机号", "code": "driverPhone", "width": "150", "type": "text"},
                  {"name": "身份证号", "code": "idCard", "width": "180", "type": "text"},
                  {"name": "驾驶证号", "code": "driverLicence", "width": "150", "type": "text"},
                  {"name": "准驾车型", "code": "driverClass", "width": "90", "type": "text"},
                  {"name": "默认车辆", "code": "plateNumber", "width": "90", "type": "text"},
                  {"name": "创建人", "code": "createUserName", "width": "120", "type": "text"},
                  {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
                  {"name": "司机状态", "code": "stsName", "width": "90", "type": "diyColorTd"},
                  // {"name": "完成单数", "code": "waybillCount", "width": "90", "type": "text"},
                  // {"name": "准时率", "code": "waybillOnTimeRate", "width": "90", "type": "text"},
                  // {"name": "提货准时率", "code": "lastPickUpWaybillOnTimeRate", "width": "90", "type": "text"},
                  // {"name": "卸货准时率", "code": "lastDeliveryWaybillOnTimeRate", "width": "90", "type": "text"},
                  // {"name": "手工操作率", "code": "opWaybillRate", "width": "90", "type": "text"},
                  {"name": "资质审核", "code": "authStateInternalName", "width": "90", "type": "text"},
                  {"name": "审核备注", "code": "authRemarkInternal", "width": "100", "type": "text"},
              ],
              query: this.initQuery(),
              dic_biz_audit_state: [],
              dic_whether: [],
              dic_sts: [],
              srcList: [],
              supplierData: [],
              uploadOpen: false,
              userId: this.common.userInfo().userId,
              showSync: false,
              idCardNum:'',
              impParam:{},
          }
      },
      /**
       * 组件
       */
      components: {
          myFileModel,
          fileViewer,
          tableCommon,
          myImport,
          searchList
      },
      /**
       * 初始化
       */
      mounted()
      {
          this.initData();
          this.doQuery();
      },
      /**
       * 绑定函数
       */
      methods: {
          initQuery()
          {
              return this.query = {
                  driverName: '',
                  driverPhone: '',
                  internalAudit: '',
                  thirdAudit: '',
                  thirdSign: '',
                  sts: '',
                  tenantId: this.$route.query.supplierId ? parseInt(this.$route.query.supplierId) : null,
              }
          },
          /**
           * 查询列表
           * query  空值时，默认为页面配置参this.query，传值时为传值参
           */
          async doQuery(query = this.query)
          {
              this.uploadOpen=false;
              let {items} = await this.$refs.table.load("driverTF", "queryDriverInfoList", query);
              items.forEach((el) =>
              {
                  if (el.sts == 0)
                  {
                      el.disabled = true;
                  }
              })
              this.$refs.table.resetData(items);
          },
          /**
           * 初始化数据
           */
          async initData()
          {
              let data = await this.common.postUrl("commonTF", "getSysStaticDataByCodeTypes", {codeType: "STS,BIZ_AUDIT_STATE"});
              this.dic_biz_audit_state = data.BIZ_AUDIT_STATE;
              this.dic_sts = data.STS;
              this.supplierOptions = await this.common.postUrl("supplierTF", "getSupplierSelectData", {});
              this.supplierData = await this.common.postUrl("supplierTF", "queryAllSupplierList", {});
          },
          dblclickItem(data)
          {
              this.openPage(0, data);
          },
          /**
           * 显示弹出框
           * type 1 新增  2 修改  0 查看  4 内部审核
           */
          openPage(type, data)
          {

              let param = {};
              let title = "";
              let urlPath = "/pt/res/driverInfo.vue";
              if (type == 1)
              {
                  param.time = new Date().getTime();
                  title = "新增司机";
              } else if (type == 2)
              {
                  let selectData = this.$refs.table.getSelectItem();
                  if (selectData.length !== 1)
                  {
                      this.$message.error("请选择一条需要修改的司机数据!");
                      return false;
                  }
                  data = selectData[0];
                  param.time = data.id;
                  param.id = data.id;
                  title = "修改司机";
              } else if (type == 4)
              {
                  let selectData = this.$refs.table.getSelectItem();
                  if (selectData.length !== 1)
                  {
                      this.$message.error("请选择一条需要审核的司机数据!");
                      return false;
                  }
                  data = selectData[0];
                  param.time = data.id;
                  param.id = data.id;
                  title = "审核司机";
              } else if (type == 0)
              {
                  param.time = data.id + "detail";
                  param.id = data.id;
                  title = "查看司机";
                  urlPath = "/pt/res/driverInfoMain.vue";
              } else
              {
                  this.$message.error("请刷新试试！");
                  return false;
              }
              this.$emit("openTab", {
                  urlId: 'driver' + param.time,
                  query: {
                      id: param.id,
                      type,
                      logId: param.id,
                      logType: enumData.LOG_TYPE.DRIVER,
                  },
                  urlName: title,
                  urlPathName: "/res",
                  urlPath: urlPath
              });
          },
          copyPassword()
          {
              let that = this;
              let array = this.$refs.table.getSelectItem();
              if (array.length !== 1)
              {
                  this.$message.error("请选择一条数据");
                  return false;
              }
              this.common.postUrl("driverTF", 'getDriverPassword', {userId: array[0].userId}, function (data)
              {
                  if (data)
                  {
                      that.$copyText(data).then(function ()
                      {
                          that.$message.success("复制成功！");
                      });
                  }
              }, null, '', true);
          },
          updateState()
          {
              let that = this;
              let array = this.$refs.table.getSelectItem();
              if (array.length !== 1)
              {
                  this.$message.error("请选择一条数据");
                  return false;
              }
              let driverIds = '';
              let driverName = '';
              for (let i = 0; i < array.length; i++)
              {
                  driverIds += ',' + array[i].id;
                  driverName += ',' + array[i].driverName;
              }
              driverIds = driverIds.substr(1);
              driverName = driverName.substr(1);
              let state = array[0].sts == 1 ? 0 : 1;
              let info = '';
              if (array[0].sts == 1)
              {
                  info = '禁用';
              }
              else if (array[0].sts == 0)
              {
                  info = '启用';
              }
              this.common.postUrl("driverTF", 'updateDriverState', {driverIds, state, driverName}, function (data)
              {
                  if (data)
                  {
                      that.doQuery();
                      that.$message.success(info + "成功！");
                  }
              }, null, '', true);
          },

          /**
           * 显示身份证照片
           * @param data
           */
          showIdCardImg(data)
          {
              if (!data.idCardFrontImgPath && !data.idCardBackImgPath)
              {
                  // this.$message.error("没有图片~");
                  return;
              }
              this.srcList = [];
              this.srcList.push(data.idCardFrontImgUrl, data.idCardBackImgUrl);
              this.$refs.viewer.show();
          },
          /**
           * 显示司机驾照照片
           * @param data
           */
          showDriverLicenceImg(data)
          {
              if (!data.driverLicenceFrontImg && !data.idCardBackImgPath)
              {
                  // this.$message.error("没有图片~");
                  return;
              }
              this.srcList = [];
              this.srcList.push(data.driverLicenceFrontImgUrl, data.driverLicenceBackImgUrl);
              this.$refs.viewer.show();
          },
          /**
           * 显示司机从业资格证
           * @param data
           */
          showQualifyCertImgUrl(data)
          {
              if (!data.qualifyCertImgUrl)
              {
                  // this.$message.error("没有图片~");
                  return;
              }
              this.srcList = [];
              this.srcList.push(data.qualifyCertImgUrl);
              this.$refs.viewer.show();
          },
          openSync(flag){
              this.showSync = flag;
              this.idCardNum = '';
              this.$forceUpdate();
          },
          syncDriver(){
              let that = this;
              this.common.postUrl("driverTF", 'syncDriver', {idCardNum:this.idCardNum}, function (data)
              {
                  if (data)
                  {
                      that.$message.success("同步成功！");
                      that.openSync(false);
                      that.doQuery();
                  }
              }, null, '', true);
          },
      },
      computed: {
          formData() {
            return [
              {"name":"司机名称","model":"driverName","type":"input","isshow":true},
              {"name":"身份证号","model":"idCard","type":"input","isshow":true},
              {"name":"供应商","model":"tenantId","type":"select","options":this.supplierData,"label":"supplierName","value":"tenantId","method":"doQuery","isshow":true},
              {"name":"手机号","model":"driverPhone","type":"input","isshow":true},
              {"name":"司机状态","model":"sts","type":"select","options":this.dic_sts,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
              {"name":"资质审核状态","model":"internalAudit","type":"select","options":this.dic_biz_audit_state,"label":"codeName","value":"codeValue","method":"doQuery","isshow":true},
            ]
          }
      },
  }
