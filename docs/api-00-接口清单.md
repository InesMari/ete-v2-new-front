# API 接口清单（前端调用事实源）

> 本文档由 `docs/tools/extract-api.js` 脚本自动生成。
> **修改入口**：请修改脚本后重新执行 `node docs/tools/extract-api.js`，勿直接编辑本文档。
> 数据来源：`src` 下全部 `.js`/`.vue` 文件中 `common.postUrl("beanName","methodName",...)` 与 `$refs.xxx.load("beanName","methodName",...)` 调用。
> 接口名约定：`beanName` 为后端服务标识，`methodName` 为服务方法名（与后端 Dubbo/Http 服务对应）。
> 统计：共扫描 1780 个文件，提取去重后接口调用 1764 个，特殊 URL 调用 0 次。

## notFindPage

### notFindPage/notFindPage.vue

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

## pt

### pt/base

共 61 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | cacheRefreshTF | queryAllRefreshCaches | 1 | base/cache/cacheRefresh.js |
| 2 | cacheRefreshTF | refreshAllCaches | 1 | base/cache/cacheRefresh.js |
| 3 | cacheRefreshTF | refreshCache | 1 | base/cache/cacheRefresh.js |
| 4 | commonTF | deleteDictionaryDataById | 1 | base/dictionary/dictionaryManage.js |
| 5 | commonTF | getFeeChangeSwitch | 1 | base/dictionary/dictionaryManage.js |
| 6 | commonTF | getSysStaticData | 5 | hc/qa/addQuestion.js |
| 7 | commonTF | getSysStaticDataByCodeTypes | 2 | auth/permission/permissionInfo.js |
| 8 | commonTF | loadSysStaticDataGroupByCodeType | 1 | base/dictionary/dictionaryManage.js |
| 9 | commonTF | queryDictionaryDataPage | 1 | base/dictionary/dictionaryManage.js |
| 10 | commonTF | saveOrUpdateDictionary | 1 | base/dictionary/dictionaryManage.js |
| 11 | commonTF | switchFeeChange | 1 | base/dictionary/dictionaryManage.js |
| 12 | customerTF | queryCustomerListNoPage | 1 | usr/regionOrg/changeRegionOrg.js |
| 13 | entityTF | loadEntityTree | 2 | auth/role/addRoleEntity.js |
| 14 | entityTF | loadEntityTreeNew | 1 | auth/entityButton/entityButton.js |
| 15 | hcQuestionTF | delQuestionInfo | 1 | hc/qa/questionManage.js |
| 16 | hcQuestionTF | getQuestionInfoDetail | 2 | hc/qa/addQuestion.js |
| 17 | hcQuestionTF | queryQuestionInfoPage | 1 | hc/qa/questionManage.js |
| 18 | hcQuestionTF | saveQuestionInfo | 1 | hc/qa/addQuestion.js |
| 19 | menuTF | queryAuthMenuList | 1 | auth/permission/permissionInfo.js |
| 20 | permissionService | bindUserPermissionById | 1 | auth/permission/permissionManage.js |
| 21 | permissionService | deletePermissionById | 1 | auth/permission/permissionManage.js |
| 22 | permissionService | loadPermissionById | 1 | auth/permission/permissionInfo.js |
| 23 | permissionService | loadPermissionList | 1 | usr/staff/staffManage.js |
| 24 | permissionService | loadPermissionPage | 1 | auth/permission/permissionManage.js |
| 25 | permissionService | saveOrUpdatePermission | 1 | auth/permission/permissionInfo.js |
| 26 | positionService | deletePosition | 1 | usr/position/positionManage.js |
| 27 | positionService | loadPositionStaff | 1 | usr/position/positionManage.js |
| 28 | positionService | queryPositionList | 1 | usr/staff/staffManage.js |
| 29 | positionService | queryPositionPage | 1 | usr/position/positionManage.js |
| 30 | positionService | saveOrUpdatePosition | 1 | usr/position/positionManage.js |
| 31 | regionOrgTF | addOrgInfo | 1 | usr/regionOrg/regionOrgManage.js |
| 32 | regionOrgTF | addStaffInfo | 1 | usr/regionOrg/regionOrgManage.js |
| 33 | regionOrgTF | bidRelSubsidiary | 1 | usr/regionOrg/regionOrgManage.js |
| 34 | regionOrgTF | delRegionInfo | 1 | usr/regionOrg/regionOrgManage.js |
| 35 | regionOrgTF | getOrgInfoList | 3 | auth/permission/permissionInfo.js |
| 36 | regionOrgTF | getOrgTreeList | 1 | usr/regionOrg/regionOrgManage.js |
| 37 | regionOrgTF | queryAllRegionOrgs | 1 | usr/staff/staffManage.js |
| 38 | regionOrgTF | queryOrgData | 2 | usr/regionOrg/changeRegionOrg.js |
| 39 | regionOrgTF | queryRegionData | 1 | usr/regionOrg/regionOrgManage.js |
| 40 | regionOrgTF | queryRegionSelect | 2 | usr/regionOrg/changeRegionOrg.js |
| 41 | regionOrgTF | queryStaffData | 3 | auth/permission/permissionManage.js |
| 42 | regionOrgTF | upOrgInfo | 1 | usr/regionOrg/regionOrgManage.js |
| 43 | roleTF | commonSaveRoleOrEntity | 2 | auth/role/addRoleEntity.js |
| 44 | roleTF | deleteRoleInfo | 1 | auth/role/roleManage.js |
| 45 | roleTF | loadCurrentEntityIdAllRoleList | 1 | auth/entityButton/entityButton.js |
| 46 | roleTF | loadRoleInfoList | 1 | auth/role/roleManage.js |
| 47 | roleTF | loadRoleInfoListNoAdmin | 1 | auth/entityButton/entityButton.js |
| 48 | roleTF | loadRoleInfoListNoPage | 2 | auth/role/roleManage.js |
| 49 | roleTF | saveRoleEntityRel | 1 | auth/entityButton/entityButton.js |
| 50 | selectStaticDataTF | selectCity | 1 | base/dictionary/dictionaryManage.js |
| 51 | shShareholderTF | delShareholderInfo | 1 | base/sh/shareholderManage.js |
| 52 | shShareholderTF | getShareholderDetailInfo | 1 | base/sh/addShareholder.js |
| 53 | shShareholderTF | queryShareholderInfoPage | 1 | base/sh/shareholderManage.js |
| 54 | shShareholderTF | updateShareholderState | 1 | base/sh/shareholderManage.js |
| 55 | staffTF | changeUserSts | 1 | usr/staff/staffManage.js |
| 56 | staffTF | delStaff | 1 | usr/staff/staffManage.js |
| 57 | staffTF | getStaff | 1 | usr/staff/staffManage.js |
| 58 | staffTF | getUserName | 1 | usr/staff/staffManage.js |
| 59 | staffTF | queryStaffs | 1 | usr/staff/staffManage.js |
| 60 | userTF | getUserName | 1 | base/sh/addShareholder.js |
| 61 | userTF | kickAllUserEnds | 1 | usr/staff/staffManage.js |

### pt/biz

共 42 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | assetsAllocatServiceImpl | deleteAssetsAllocatById | 1 | biz/allocat/assetsAllocatManage.js |
| 2 | assetsAllocatServiceImpl | getSelectOrgData | 1 | biz/allocat/commonAssetsAllocat.js |
| 3 | assetsAllocatServiceImpl | getUserSelectData | 1 | biz/allocat/commonAssetsAllocat.js |
| 4 | assetsAllocatServiceImpl | loadAssetsAllocatById | 1 | biz/allocat/commonAssetsAllocat.js |
| 5 | assetsAllocatServiceImpl | loadAssetsAllocatPage | 1 | biz/allocat/assetsAllocatManage.js |
| 6 | assetsAllocatServiceImpl | loadOpLog | 1 | allocat/detail/assetsAllocatOpLog.js |
| 7 | assetsAllocatServiceImpl | saveOrUpdateAssetsAllocat | 1 | biz/allocat/commonAssetsAllocat.js |
| 8 | assetsAllocatServiceImpl | verifyAssetsAllocatById | 1 | biz/allocat/assetsAllocatManage.js |
| 9 | branchCfgService | loadClaimBranchCfgByBranchTypeOrderDefault | 1 | biz/claim/processSet.js |
| 10 | branchCfgService | loadPurchaseBranchCfgByBranchTypeOrderDefault | 1 | biz/purchase/processSet.js |
| 11 | branchCfgService | saveOrUpdateBranchCfg | 2 | biz/claim/processSet.js |
| 12 | claimApplyServiceImpl | deleteClaimApplyById | 1 | biz/claim/itemClaimApplyManage.js |
| 13 | claimApplyServiceImpl | loadClaimApplyById | 1 | biz/claim/commonItemClaimApply.js |
| 14 | claimApplyServiceImpl | loadClaimApplyPage | 1 | biz/claim/itemClaimApplyManage.js |
| 15 | claimApplyServiceImpl | loadOpLog | 1 | claim/detail/itemClaimApplyOpLog.js |
| 16 | claimApplyServiceImpl | saveOrUpdateClaimApply | 1 | biz/claim/commonItemClaimApply.js |
| 17 | claimApplyServiceImpl | verifyClaimApplyById | 1 | biz/claim/itemClaimApplyManage.js |
| 18 | commonTF | getGrowthNum | 2 | allocat/add/addAssetsAllocat.js |
| 19 | commonTF | getSysStaticData | 9 | biz/allocat/assetsAllocatManage.js |
| 20 | customerTF | queryCustomerListNoPage | 1 | biz/quote/queryQuoteCommon.js |
| 21 | purchaseApplyServiceImpl | deletePurchaseApplyById | 1 | biz/purchase/purchaseApplyManage.js |
| 22 | purchaseApplyServiceImpl | donePurchaseApply | 1 | biz/purchase/purchaseApplyManage.js |
| 23 | purchaseApplyServiceImpl | generatePayApplyCheck | 1 | biz/purchase/purchaseApplyManage.js |
| 24 | purchaseApplyServiceImpl | getSysStaticDataForSpecify | 1 | biz/purchase/commonPurchaseApply.js |
| 25 | purchaseApplyServiceImpl | loadOpLog | 1 | purchase/detail/purchaseApplyOpLog.js |
| 26 | purchaseApplyServiceImpl | loadPurchaseApplyById | 1 | biz/purchase/commonPurchaseApply.js |
| 27 | purchaseApplyServiceImpl | loadPurchaseApplyPage | 1 | biz/purchase/purchaseApplyManage.js |
| 28 | purchaseApplyServiceImpl | saveOrUpdatePurchaseApply | 1 | biz/purchase/commonPurchaseApply.js |
| 29 | purchaseApplyServiceImpl | verifyPurchaseApplyById | 1 | biz/purchase/purchaseApplyManage.js |
| 30 | regionOrgTF | getOrgInfoList | 1 | biz/purchase/processSet.js |
| 31 | schemeService | deleteGiftSchemeById | 1 | biz/gift/giftManage.js |
| 32 | schemeService | generateShareQrCode | 1 | biz/gift/shareGift.js |
| 33 | schemeService | loadGiftSchemeById | 3 | biz/gift/addGift.js |
| 34 | schemeService | loadGiftSchemePage | 1 | biz/gift/giftManage.js |
| 35 | schemeService | loadGiftSchemeShareListBySchemeId | 1 | biz/gift/giftReg.js |
| 36 | schemeService | loadGiftSchemeSubInfoListBySchemeId | 1 | biz/gift/shareGift.js |
| 37 | schemeService | recordGiftSchemeDelivery | 1 | biz/gift/giftReg.js |
| 38 | schemeService | saveOrUpdateGiftScheme | 1 | biz/gift/addGift.js |
| 39 | supplierTF | queryAllSupplierList | 1 | biz/quote/queryQuoteCommon.js |
| 40 | userTF | loadAllUser | 2 | biz/claim/processSet.js |
| 41 | userTF | loadCurrentOrgUserList | 2 | biz/claim/commonItemClaimApply.js |
| 42 | ZCQuoteNewTF | queryQuotePage | 1 | biz/quote/queryQuoteCommon.js |

### pt/cm

共 105 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | applicationService | deleteApplication | 1 | cm/customer/applicationManage.js |
| 2 | applicationService | queryApplicationPage | 1 | cm/customer/applicationManage.js |
| 3 | applicationService | saveOrUpdateApplication | 1 | cm/customer/applicationManage.js |
| 4 | cmBusinessCooperationTF | dealCmBusinessCooperationInfo | 1 | cm/customer/cmBusinessCooperationManage.js |
| 5 | cmBusinessCooperationTF | queryCmBusinessCooperationInfoPage | 1 | cm/customer/cmBusinessCooperationManage.js |
| 6 | cmCustTimeLimitTF | delCmCustTimeLimitInfo | 1 | cm/customer/cmCustTimeLimitManage.js |
| 7 | cmCustTimeLimitTF | queryCmCustTimeLimitInfoPage | 1 | cm/customer/cmCustTimeLimitManage.js |
| 8 | commonTF | getRemindEmails | 1 | cm/contract/customerContract.js |
| 9 | commonTF | getSplitAddress | 1 | cm/customer/workInfoManage.js |
| 10 | commonTF | getSysStaticData | 23 | cm/contract/contractDetail.js |
| 11 | commonTF | getSysStaticDataByCodeTypes | 5 | cm/contract/contract.js |
| 12 | contractReviewTF | addPrintTimes | 2 | contract/review/customerContractInfo.js |
| 13 | contractReviewTF | cancelReviewContractInfo | 2 | contract/review/customerContractReviewManage.js |
| 14 | contractReviewTF | delContractReviewInfo | 2 | contract/review/customerContractReviewManage.js |
| 15 | contractReviewTF | getContractReviewInfo | 2 | contract/review/customerContractInfo.js |
| 16 | contractReviewTF | queryAllContracts | 1 | cm/contract/contract.js |
| 17 | contractReviewTF | queryAllReviewUsersTemp | 3 | contract/review/customerContractInfo.js |
| 18 | contractReviewTF | queryCustomerContractReviewPage | 1 | contract/review/customerContractReviewManage.js |
| 19 | contractReviewTF | querySupplierContractReviewPage | 1 | contract/review/supplierContractReviewManage.js |
| 20 | contractReviewTF | reviewContractInfo | 2 | contract/review/customerContractInfo.js |
| 21 | contractReviewTF | revokeContractReviewInfo | 1 | contract/review/supplierContractReviewManage.js |
| 22 | contractReviewTF | saveContractReviewInfo | 2 | contract/review/customerContractInfo.js |
| 23 | contractReviewTF | sendOffRegisterContractReviewInfo | 2 | contract/review/customerContractReviewManage.js |
| 24 | contractService | deleteContract | 1 | cm/contract/contract.js |
| 25 | contractService | getContractDetail | 1 | cm/contract/contractDetail.js |
| 26 | contractService | queryCustomerStatisticsData | 1 | cm/contract/customerContract.js |
| 27 | contractService | queryStatisticsData | 1 | cm/contract/contract.js |
| 28 | contractService | renewal | 1 | cm/contract/contract.js |
| 29 | contractService | saveOrUpdateContract | 1 | cm/contract/contract.js |
| 30 | customerTF | getCustomerDetailInfo | 3 | cm/customer/addCustomer.js |
| 31 | customerTF | loadCustomerList | 4 | customer/quote/addCustomerZCQuote.js |
| 32 | customerTF | queryCustomerCollect | 1 | cm/customer/customerDetail.js |
| 33 | customerTF | queryCustomerList | 3 | cm/customer/customerManage.js |
| 34 | customerTF | queryCustomerListNoPage | 13 | cm/contract/contractDetail.js |
| 35 | customerTF | updateCustomerState | 3 | cm/customer/customerManage.js |
| 36 | devPurchaseOrderService | queryDeliveryWorkId | 3 | cm/contract/contract.js |
| 37 | interfaceService | deleteInterface | 1 | cm/customer/interfaceManage.js |
| 38 | interfaceService | getApplicationExternalInterfaceList | 1 | cm/customer/interfaceManage.js |
| 39 | interfaceService | queryInterfacePage | 1 | cm/customer/interfaceManage.js |
| 40 | interfaceService | saveOrUpdateInterface | 1 | cm/customer/interfaceManage.js |
| 41 | quoteLDNewTF | cancelVerifyQuote | 1 | customer/quote/quoteManageLD.js |
| 42 | quoteLDNewTF | delQuoteInfo | 1 | customer/quote/quoteManageLD.js |
| 43 | quoteLDNewTF | queryLDQuoteData | 2 | customer/quote/quoteManageLD.js |
| 44 | quoteLDNewTF | queryQuoteInfoById | 2 | customer/quote/addQuoteInfoLD.js |
| 45 | quoteLDNewTF | upQuoteInfo | 1 | customer/quote/upQuoteInfoLD.js |
| 46 | quoteLDNewTF | verifyQuote | 1 | customer/quote/quoteManageVerifyLD.js |
| 47 | quoteSheetTF | cancelConfirmQuoteSheet | 1 | cm/quoteSheet/tsQuoteSheetManage.js |
| 48 | quoteSheetTF | confirmQuoteSheet | 1 | cm/quoteSheet/tsQuoteSheetManage.js |
| 49 | quoteSheetTF | delQuoteSheet | 1 | cm/quoteSheet/tsQuoteSheetManage.js |
| 50 | quoteSheetTF | generateQuoteSheet | 1 | cm/quoteSheet/tsQuoteSheetManage.js |
| 51 | quoteSheetTF | queryQuoteSheet | 2 | cm/quoteSheet/quoteSheetCommon.js |
| 52 | quoteSheetTF | queryQuoteSheetPage | 1 | cm/quoteSheet/tsQuoteSheetManage.js |
| 53 | quoteSheetTF | queryQuoteSheetRptPage | 1 | cm/quoteSheet/tsQuoteSheetRptManage.js |
| 54 | quoteSheetTF | saveQuoteSheet | 1 | cm/quoteSheet/addQuoteSheet.js |
| 55 | quoteSheetTF | verifyQuoteSheet | 1 | cm/quoteSheet/tsQuoteSheetManage.js |
| 56 | regionOrgTF | getOrgInfoList | 8 | cm/contract/contract.js |
| 57 | regionOrgTF | getRegionInfoList | 5 | cm/customer/addCustomer.js |
| 58 | regionOrgTF | getStaffInfoList | 5 | cm/customer/addCustomer.js |
| 59 | regionOrgTF | queryStaffData | 2 | cm/contract/customerContract.js |
| 60 | resVehicleInfoTF | queryAllVehicleNoPage | 1 | cm/contract/contractDetail.js |
| 61 | routeTF | addRoute | 1 | customer/route/addRoute.js |
| 62 | routeTF | changeRouteSts | 1 | customer/route/routeManage.js |
| 63 | routeTF | checkedExistSameRoute | 1 | customer/route/commonRoute.js |
| 64 | routeTF | loadRouteById | 2 | customer/route/showRoute.js |
| 65 | routeTF | loadRouteDataByTenantId | 1 | customer/route/routeManage.js |
| 66 | routeTF | updateRoute | 1 | customer/route/updateRoute.js |
| 67 | selectStaticDataTF | getCityId | 3 | cm/customer/addStorehouse.js |
| 68 | selectStaticDataTF | getDistrictId | 3 | cm/customer/addStorehouse.js |
| 69 | selectStaticDataTF | getProvinceId | 3 | cm/customer/addStorehouse.js |
| 70 | selectStaticDataTF | selectCity | 3 | cm/customer/addStorehouse.js |
| 71 | selectStaticDataTF | selectDistrict | 3 | cm/customer/addStorehouse.js |
| 72 | selectStaticDataTF | selectProvince | 3 | cm/customer/addStorehouse.js |
| 73 | storeHouseBizTF | delStoreHouseUser | 1 | cm/customer/storehouseManage.js |
| 74 | storeHouseBizTF | queryStoreHouseList | 5 | contract/review/customerContractInfo.js |
| 75 | storeHouseBizTF | queryStoreHouseUserList | 1 | cm/customer/storehouseManage.js |
| 76 | supplierTF | getBusinessLicenseInfo | 3 | cm/customer/addCustomer.js |
| 77 | supplierTF | queryAllSupplierList | 3 | cm/contract/contract.js |
| 78 | supplierTF | queryInvoiceFlgSupplier | 1 | cm/customer/storehouseManage.js |
| 79 | userTF | getUserName | 4 | cm/customer/addCustomer.js |
| 80 | wmsQuoteSheetTF | addQuoteSheet | 1 | cm/quoteSheet/quoteSheetCommon.js |
| 81 | wmsQuoteSheetTF | queryQuoteSheetCustomerHisByTenantId | 1 | cm/quoteSheet/quoteSheetCommon.js |
| 82 | workDetailService | deleteWorkDetail | 1 | cm/customer/workInfoManageDetail.js |
| 83 | workDetailService | queryWorkDetailPage | 1 | cm/customer/workInfoManageDetail.js |
| 84 | workDetailService | saveOrUpdateWorkDetail | 1 | cm/customer/workInfoManageDetail.js |
| 85 | workGoodsTF | addGoodsInfo | 1 | cm/customer/goodsInfoManage.js |
| 86 | workGoodsTF | addStorehouse | 1 | cm/customer/addStorehouse.js |
| 87 | workGoodsTF | addWorkInfo | 1 | cm/customer/workInfoManage.js |
| 88 | workGoodsTF | checkWorkDistance | 2 | cm/customer/addStorehouse.js |
| 89 | workGoodsTF | delGoodsInfo | 1 | cm/customer/goodsInfoManage.js |
| 90 | workGoodsTF | delWorkInfo | 1 | cm/customer/workInfoManage.js |
| 91 | workGoodsTF | delWorkStorehouseInfo | 1 | cm/customer/storehouseManage.js |
| 92 | workGoodsTF | disableWorkStorehouseInfo | 1 | cm/customer/storehouseManage.js |
| 93 | workGoodsTF | queryGoodsData | 1 | cm/customer/goodsInfoManage.js |
| 94 | workGoodsTF | queryGoodsDataByTenantId | 4 | customer/quote/addCustomerZCQuote.js |
| 95 | workGoodsTF | queryGoodsInfoById | 1 | cm/customer/goodsInfoManage.js |
| 96 | workGoodsTF | queryStorehouseData | 1 | cm/customer/storehouseManage.js |
| 97 | workGoodsTF | queryWorkData | 1 | cm/customer/workInfoManage.js |
| 98 | workGoodsTF | queryWorkDataSelect | 5 | customer/quote/addCustomerZCQuote.js |
| 99 | workGoodsTF | queryWorkInfoById | 2 | cm/customer/addStorehouse.js |
| 100 | ZCQuoteNewTF | cancelVerifyQuote | 1 | customer/quote/customerZCQuoteManage.js |
| 101 | ZCQuoteNewTF | deleteQuoteByQuoteId | 1 | customer/quote/customerZCQuoteManage.js |
| 102 | ZCQuoteNewTF | loadQuoteDataByQuoteId | 3 | customer/quote/addCustomerZCQuote.js |
| 103 | ZCQuoteNewTF | queryQuote | 1 | customer/quote/customerZCQuoteManage.js |
| 104 | ZCQuoteNewTF | saveCmSectionQuoteData | 1 | customer/quote/addCustomerZCQuote.js |
| 105 | ZCQuoteNewTF | verifyQuote | 1 | customer/quote/customerZCQuoteManage.js |

### pt/dataReport

共 78 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | answerService | loadAnswerById | 1 | dataReport/questionnaire/answerDetail.js |
| 2 | answerService | loadAnswerQuestionDataByQuestionnaireId | 1 | dataReport/questionnaire/answerSheetStatistics.js |
| 3 | answerService | queryAnswerDataGroupByPutUser | 1 | dataReport/questionnaire/answerSheetStatisticsByCustomerService.js |
| 4 | answerService | queryAnswerPage | 1 | dataReport/questionnaire/answerSheetManager.js |
| 5 | answerService | queryAnswerPageGroupByPutUser | 1 | dataReport/questionnaire/answerSheetStatisticsByCustomerService.js |
| 6 | commonTF | getSysStaticData | 6 | sales/actual/fcActualSalesDetail.js |
| 7 | customerTF | loadCustomerList | 2 | sales/actual/fcActualSalesDetail.js |
| 8 | customerTF | queryCustomerListNoPage | 1 | dataReport/kanban/retentionCustomer.js |
| 9 | fcActualSalesTF | delFcActualSalesInfo | 1 | sales/actual/fcActualSalesManage.js |
| 10 | fcActualSalesTF | getFcActualSalesInfo | 1 | sales/actual/fcActualSalesDetail.js |
| 11 | fcActualSalesTF | queryAllSalesStatisticsInfo | 1 | sales/budgetAchievement/budgetAchievement.js |
| 12 | fcActualSalesTF | queryFcActualSalesList | 1 | sales/actual/fcActualSalesManage.js |
| 13 | fcActualSalesTF | queryFcActualSalesPage | 1 | sales/actual/fcActualSalesManage.js |
| 14 | fcAnalysisTF | cancelVerifyFcAnalysisDtl | 1 | dataReport/operatingData/operatingDataMonthDetailMixin.js |
| 15 | fcAnalysisTF | deleteFcAnalysisDtlInfo | 1 | dataReport/operatingData/operatingDataMonthDetailMixin.js |
| 16 | fcAnalysisTF | deleteFcAnalysisInfo | 1 | dataReport/operatingData/operatingDataMixin.js |
| 17 | fcAnalysisTF | getFcAnalysisDtlInfo | 1 | dataReport/operatingData/operatingDataMonthDetailMixin.js |
| 18 | fcAnalysisTF | getFcAnalysisDtlList | 1 | dataReport/operatingData/operatingDataMonthDetailMixin.js |
| 19 | fcAnalysisTF | getFcAnalysisInfo | 1 | dataReport/operatingData/operatingDataDetailMixin.js |
| 20 | fcAnalysisTF | queryFcAnalysisInfoPage | 1 | dataReport/operatingData/operatingDataMixin.js |
| 21 | fcAnalysisTF | queryFcAnalysisSummaryInfoDtl | 1 | operatingData/summary/operatingDataSummaryDetail.js |
| 22 | fcAnalysisTF | queryFcAnalysisSummaryInfoPage | 1 | operatingData/summary/operatingDataSummary.js |
| 23 | fcAnalysisTF | resolveValue | 1 | dataReport/operatingData/operatingDataMonthDetailMixin.js |
| 24 | fcAnalysisTF | saveFcAnalysisActualInfo | 1 | dataReport/operatingData/operatingDataMonthDetailMixin.js |
| 25 | fcAnalysisTF | verifyFcAnalysisDtl | 1 | dataReport/operatingData/operatingDataMonthDetailMixin.js |
| 26 | fcBudgetSalesTF | delFcBudgetSalesInfo | 1 | sales/budget/fcBudgetSalesManage.js |
| 27 | fcBudgetSalesTF | getFcBudgetSalesInfo | 1 | sales/budget/fcBudgetSalesDetail.js |
| 28 | fcBudgetSalesTF | queryFcBudgetSalesPage | 1 | sales/budget/fcBudgetSalesManage.js |
| 29 | fcBudgetSalesTF | verifyFcBudgetSalesInfo | 1 | sales/budget/fcBudgetSalesDetail.js |
| 30 | fcExamineTF | getThisYearFcExamineInfo | 1 | pt/dataReport/examineCenter.js |
| 31 | fcTF | queryDataReportStatisticsInfo | 1 | pt/dataReport/dataReport.js |
| 32 | orderService | getUserCustomerViewRelList | 1 | dataReport/kanban/retentionCustomer.js |
| 33 | orderService | loadOrderCount | 1 | pt/dataReport/systemData.js |
| 34 | orderService | queryDispatchOrderListForScreen | 1 | dataReport/kanban/orderBoard.js |
| 35 | orderService | queryOrderListForScreen | 1 | dataReport/kanban/orderBoard.js |
| 36 | orderService | queryPrepDispatchOrderListForScreen | 1 | dataReport/kanban/orderBoard.js |
| 37 | orderService | saveOrUpdateUserCustomerViewRelList | 1 | dataReport/kanban/retentionCustomer.js |
| 38 | ordWaybillTF | loadWaybillCount | 1 | pt/dataReport/systemData.js |
| 39 | questionnaireService | deleteQuestionnaireById | 1 | dataReport/questionnaire/questionnaireManager.js |
| 40 | questionnaireService | loadQuestionnaireById | 1 | dataReport/questionnaire/addQuestionnaire.js |
| 41 | questionnaireService | putQuestionnaire | 1 | dataReport/questionnaire/questionnaireManager.js |
| 42 | questionnaireService | queryQuestionnaireList | 2 | dataReport/questionnaire/answerSheetManager.js |
| 43 | questionnaireService | queryQuestionnairePage | 1 | dataReport/questionnaire/questionnaireManager.js |
| 44 | questionnaireService | queryQuestionnaireQuestionList | 1 | dataReport/questionnaire/answerSheetStatistics.js |
| 45 | questionnaireService | saveOrUpdateQuestionnaire | 1 | dataReport/questionnaire/addQuestionnaire.js |
| 46 | questionnaireTemplateService | deleteQuestionnaireTemplateById | 1 | questionnaire/template/questionnaireTemplateManager.js |
| 47 | questionnaireTemplateService | loadQuestionnaireTemplateById | 2 | dataReport/questionnaire/addQuestionnaire.js |
| 48 | questionnaireTemplateService | queryQuestionnaireTemplateList | 1 | dataReport/questionnaire/addQuestionnaire.js |
| 49 | questionnaireTemplateService | queryQuestionnaireTemplatePage | 1 | questionnaire/template/questionnaireTemplateManager.js |
| 50 | questionnaireTemplateService | saveOrUpdateQuestionnaireTemplate | 1 | questionnaire/template/addQuestionnaireTemplate.js |
| 51 | regionOrgTF | queryAllOrgData | 2 | sales/actual/fcActualSalesDetail.js |
| 52 | regionOrgTF | queryRegionSelect | 2 | sales/actual/fcActualSalesDetail.js |
| 53 | rptFeeReportTF | loadPayableCount | 1 | pt/dataReport/systemData.js |
| 54 | rptFeeReportTF | loadReceivableCount | 1 | pt/dataReport/systemData.js |
| 55 | storeHouseBizTF | queryStoreHouseList | 7 | dataReport/kanban/inspectData.js |
| 56 | sysLogTF | querySysLogPage | 1 | pt/dataReport/sysLogInfoManage.js |
| 57 | vehicleBenefitAccountingService | loadOwnVehicleAttendanceData | 1 | pt/dataReport/systemData.js |
| 58 | wmsCostService | loadWarehouseCostIncomeBarData | 1 | dataReport/kanban/warehouseCostIncome.js |
| 59 | wmsCostService | loadWarehouseCostIncomeLineData | 1 | dataReport/kanban/warehouseCostIncome.js |
| 60 | wmsCostService | loadWarehouseCostIncomeListData | 1 | dataReport/kanban/warehouseCostIncome.js |
| 61 | wmsCostService | loadWarehouseCostIncomePieData | 1 | dataReport/kanban/warehouseCostIncome.js |
| 62 | wmsCostService | queryWmsCostReportPage | 1 | pt/dataReport/storageFeeSummarManage.js |
| 63 | wmsDataReportService | loadWmsDataByCondition | 1 | dataReport/kanban/wmsOperate.js |
| 64 | wmsDataReportService | queryWmsUninventoryStockDtlPage | 1 | dataReport/kanban/uninventoryStockStorageManage.js |
| 65 | wmsExamineTF | delWmsExamineItemCfg | 1 | dataReport/wmsExamine/wmsExamineItemCfgManage.js |
| 66 | wmsExamineTF | getOrderDetail | 1 | dataReport/wmsExamine/wmsOrderExamineDetail.js |
| 67 | wmsExamineTF | queryWmsExamineInfoId | 1 | pt/dataReport/examineCenter.js |
| 68 | wmsExamineTF | queryWmsExamineInfoList | 1 | dataReport/wmsExamine/wmsExamineDTLStatisticsManage.js |
| 69 | wmsExamineTF | queryWmsExamineItemCfgList | 1 | dataReport/wmsExamine/wmsExamineDTLStatisticsManage.js |
| 70 | wmsExamineTF | queryWmsExamineItemCfgPage | 1 | dataReport/wmsExamine/wmsExamineItemCfgManage.js |
| 71 | wmsExamineTF | queryWmsExamineItemDtlPage | 1 | dataReport/wmsExamine/wmsExamineDTLStatisticsManage.js |
| 72 | wmsExamineTF | queryWmsExamineItemStatistics | 1 | dataReport/wmsExamine/wmsExamineDTLStatisticsManage.js |
| 73 | wmsExamineTF | queryWmsExamineItemStatisticsPage | 1 | dataReport/wmsExamine/wmsExamineItemStatisticsManage.js |
| 74 | wmsExamineTF | queryWmsExamineStatisticsPage | 1 | dataReport/wmsExamine/wmsExamineStatisticsManage.js |
| 75 | wmsExamineTF | saveWmsExamineItemCfg | 1 | dataReport/wmsExamine/wmsExamineItemCfgManage.js |
| 76 | wmsInspectionSummaryService | loadHasDoneInspectionTaskData | 1 | dataReport/kanban/inspectData.js |
| 77 | wmsInspectionSummaryService | loadInspectionTaskByCondition | 1 | dataReport/kanban/inspectData.js |
| 78 | wmsInspectionSummaryService | loadInspectionTaskGroupByWorkBarData | 1 | dataReport/kanban/inspectData.js |

### pt/device

共 51 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | commonTF | getSysStaticData | 12 | device/contract/deviceContractManage.js |
| 2 | customerTF | queryCustomerListNoPage | 1 | device/devicePurchaseManage/devicePurchaseManage.js |
| 3 | devAllocatDeviceService | delAllocatDevice | 1 | device/deviceAllocateManage/deviceAllocateManage.js |
| 4 | devAllocatDeviceService | queryAllocatDevicePage | 1 | device/deviceAllocateManage/deviceAllocateManage.js |
| 5 | devAllocatDeviceService | queryAllPurchaseOrderDevices | 1 | device/deviceAllocateManage/deviceAllocateManage.js |
| 6 | devAllocatDeviceService | returnAllocatDevice | 1 | device/deviceAllocateManage/deviceAllocateManage.js |
| 7 | devAllocatDeviceService | verifyAllocatDevice | 1 | device/deviceAllocateManage/deviceAllocateManage.js |
| 8 | devCostService | queryDeviceCostPage | 1 | device/deviceFeeMain/deviceCostManage.js |
| 9 | deviceBaseService | delDeviceInfo | 1 | device/maintenance/maintenanceManage.js |
| 10 | deviceBaseService | queryDeviceInfoList | 2 | device/contract/deviceContractManage.js |
| 11 | deviceBaseService | queryDeviceInfoPage | 1 | device/maintenance/maintenanceManage.js |
| 12 | deviceContractService | deleteDevContract | 1 | device/contract/deviceContractManage.js |
| 13 | deviceContractService | queryContractDeviceList | 1 | device/devicePurchaseManage/addDevicePurchase.js |
| 14 | deviceContractService | queryContractTenant | 4 | device/deviceAllocateManage/deviceAllocateManage.js |
| 15 | deviceContractService | queryDevContractDeviceDtlListByContractId | 1 | device/contract/deviceContractManage.js |
| 16 | deviceContractService | queryDeviceContractPage | 1 | device/contract/deviceContractManage.js |
| 17 | deviceContractService | saveOrUpdateDevContract | 1 | device/contract/deviceContractManage.js |
| 18 | deviceRecordService | queryDeviceRecordFeeDtlPage | 1 | device/record/outDeviceFeeDtlManage.js |
| 19 | deviceRecordService | queryDeviceRecordFeeSumPage | 1 | device/record/outDeviceFeeSumManage.js |
| 20 | deviceRecordService | queryDeviceRecordPage | 5 | device/deviceOpLog/deviceOpLog.js |
| 21 | deviceRecordService | saveOutDeviceRecordConfirmById | 2 | device/record/outDeviceClearUpRecordManage.js |
| 22 | devIncomeService | queryDeviceIncomePage | 1 | device/deviceFeeMain/deviceIncomeManage.js |
| 23 | devPurchaseOrderService | delDevPurchaseOrderInfo | 1 | device/devicePurchaseManage/devicePurchaseManage.js |
| 24 | devPurchaseOrderService | getDevPurchaseOrderInfo | 2 | device/devicePurchaseManage/addDevicePurchase.js |
| 25 | devPurchaseOrderService | getPurchaseOrderDtl | 1 | device/devicePurchaseManage/devicePurchaseManage.js |
| 26 | devPurchaseOrderService | queryDeliveryWorkId | 2 | device/deviceAllocateManage/deviceAllocateManage.js |
| 27 | devPurchaseOrderService | queryDevPurchaseOrderDeliveryDtl | 1 | device/devicePurchaseManage/devicePurchaseManage.js |
| 28 | devPurchaseOrderService | queryDevPurchaseOrderPage | 1 | device/devicePurchaseManage/devicePurchaseManage.js |
| 29 | devPurchaseOrderService | queryPurchaseOrderData | 1 | device/deviceBusinessManage/deviceBusinessManage.js |
| 30 | devPurchaseOrderService | querySupplierTenants | 2 | device/devicePurchaseManage/addDevicePurchase.js |
| 31 | devPurchaseOrderService | selfConfirmPurchaseOrderInfo | 1 | device/devicePurchaseManage/devicePurchaseManage.js |
| 32 | devPurchaseOrderService | uploadPoOrderFile | 1 | device/devicePurchaseManage/devicePurchaseManage.js |
| 33 | palletRecordService | deletePalletRecordById | 1 | device/palletRecord/palletRecordManage.js |
| 34 | palletRecordService | getPalletRecordList | 1 | device/palletRecord/palletRecordInfo.js |
| 35 | palletRecordService | loadPalletRecordInfoById | 1 | device/palletRecord/palletRecordInfo.js |
| 36 | palletRecordService | queryPalletRecordPage | 1 | device/palletRecord/palletRecordManage.js |
| 37 | palletRecordService | savePalletRecord | 1 | device/palletRecord/palletRecordInfo.js |
| 38 | pkgContractTF | getPackCust | 1 | device/contract/deviceContractManage.js |
| 39 | purchaseApplyServiceImpl | getPurchaseApply | 1 | device/devicePurchaseManage/addDevicePurchase.js |
| 40 | purFeeApplyTF | getFeeApply | 1 | device/devicePurchaseManage/addDevicePurchase.js |
| 41 | purFeeApplyTF | getFeeApplyDtl | 1 | device/devicePurchaseManage/addDevicePurchase.js |
| 42 | stockDeviceService | queryDeviceStockPage | 1 | device/deviceBusinessManage/deviceBusinessManage.js |
| 43 | stockDeviceService | queryDeviceStockSummaryDetailHisPage | 1 | device/deviceSummaryManage/deviceStoreDetailHisManage.js |
| 44 | stockDeviceService | queryDeviceStockSummaryDetailPage | 1 | device/deviceSummaryManage/deviceStoreDetailManage.js |
| 45 | stockDeviceService | queryDeviceStockSummaryDetailPageForMap | 1 | device/deviceSummaryManage/deviceMonitor.js |
| 46 | stockDeviceService | queryDeviceStockSummaryPage | 1 | device/deviceSummaryManage/deviceSummaryManage.js |
| 47 | stockDeviceService | saveDeviceReovery | 1 | device/deviceBusinessManage/deviceBusinessManage.js |
| 48 | storeHouseBizTF | queryStoreHouseList | 13 | device/contract/deviceContractManage.js |
| 49 | supplierTF | queryInvoiceFlgSupplier | 1 | device/devicePurchaseManage/devicePurchaseManage.js |
| 50 | userTF | getRelSubsidiary | 1 | device/contract/deviceContractManage.js |
| 51 | wmsPackMaterialTF | deletePackMaterialRecord | 1 | device/record/deviceRegisterRecordManage.js |

### pt/enum.js

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### pt/exc

共 10 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | commonTF | getRemindEmails | 1 | pt/exc/exceptionManage.js |
| 2 | commonTF | getSysStaticData | 3 | pt/exc/addException.js |
| 3 | customerTF | loadCustomerList | 2 | pt/exc/addException.js |
| 4 | exceptionTF | delExceptionInfo | 1 | pt/exc/exceptionManage.js |
| 5 | exceptionTF | doneExceptionInfo | 1 | pt/exc/exceptionHandle.js |
| 6 | exceptionTF | getExceptionInfo | 4 | pt/exc/addException.js |
| 7 | exceptionTF | queryExceptionInfoPage | 1 | pt/exc/exceptionManage.js |
| 8 | exceptionTF | saveExceptionInfo | 1 | pt/exc/addException.js |
| 9 | exceptionTF | verifyExceptionInfo | 1 | pt/exc/exceptionDetail.js |
| 10 | regionOrgTF | queryStaffData | 1 | pt/exc/exceptionManage.js |

### pt/fc

共 303 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | bankTF | queryAllBankInfoList | 2 | receipts/add/addPayOrder.js |
| 2 | bankTF | queryBankInfoBytenantId | 2 | ownVehicleBill/add/addOwnVehicleBillDetail.js |
| 3 | commissionService | changeProfitState | 1 | fc/custBill/commissionManage.js |
| 4 | commissionService | payRegistration | 1 | fc/custBill/commissionManage.js |
| 5 | commissionService | queryCommissionDtlPage | 1 | fc/custBill/commissionDtlManage.js |
| 6 | commissionService | queryCommissionPage | 1 | fc/custBill/commissionManage.js |
| 7 | commonTF | getAccrualMonth | 2 | fc/supplierBill/commonBillDetail.js |
| 8 | commonTF | getBaiduDistance | 1 | fc/standardCost/transportationCostInfo.js |
| 9 | commonTF | getBillDate | 2 | fc/storehouse/storeHouseBillDetail.js |
| 10 | commonTF | getSysStaticData | 31 | fc/accrual/accrualInfoManage.js |
| 11 | commonTF | getSysStaticDataByCodeTypes | 21 | fc/custBill/commissionDtlManage.js |
| 12 | contractService | queryAllContracts | 2 | receipts/add/addPayOrder.js |
| 13 | contractService | queryInsuranceContractList | 1 | fc/accrual/saveInsuranceInfo.js |
| 14 | customerTF | queryCustomerData | 3 | custBill/add/addCustomerBillMain.js |
| 15 | customerTF | queryCustomerListNoPage | 7 | fc/custBill/confirmedBill.js |
| 16 | fcAccrualTF | queryFcAccrualInfoPage | 1 | fc/accrual/accrualInfoManage.js |
| 17 | fcAccrualTF | queryFcAccrualStatisticsInfo | 1 | fc/accrual/accrualStatisticsInfo.js |
| 18 | fcAccrualTF | queryFcAccrualStatisticsInfoPage | 1 | fc/accrual/accrualStatisticsManage.js |
| 19 | fcActualTF | cancelVerifyFcActualDtl | 1 | businessAnalysis/actual/actualDetail.js |
| 20 | fcActualTF | deleteFcActualInfo | 1 | businessAnalysis/actual/actualManage.js |
| 21 | fcActualTF | getFcActualInfo | 2 | businessAnalysis/actual/actualDetail.js |
| 22 | fcActualTF | queryFcActualInfoPage | 1 | businessAnalysis/actual/actualManage.js |
| 23 | fcActualTF | resolveValue | 1 | businessAnalysis/actual/addActual.js |
| 24 | fcActualTF | saveFcActualInfo | 1 | businessAnalysis/actual/addActual.js |
| 25 | fcActualTF | verifyFcActualDtl | 1 | businessAnalysis/actual/actualDetail.js |
| 26 | fcAdvanceTF | delPayInfo | 1 | fc/register/payAdvanceManage.js |
| 27 | fcAdvanceTF | delReceiveInfo | 1 | fc/register/receiveAdvanceManage.js |
| 28 | fcAdvanceTF | queryPayDetail | 1 | fc/register/payAdvanceManage.js |
| 29 | fcAdvanceTF | queryPayInfoById | 1 | fc/register/payAdvanceManage.js |
| 30 | fcAdvanceTF | queryPayVancePage | 1 | fc/register/payAdvanceManage.js |
| 31 | fcAdvanceTF | queryReceiveDetail | 1 | fc/register/receiveAdvanceManage.js |
| 32 | fcAdvanceTF | queryReceiveInfoById | 1 | fc/register/receiveAdvanceManage.js |
| 33 | fcAdvanceTF | queryReceiveVancePage | 1 | fc/register/receiveAdvanceManage.js |
| 34 | fcAdvanceTF | querySupplierAllSubmitInvoice | 1 | fc/register/payAdvanceManage.js |
| 35 | fcAdvanceTF | savePayInfo | 1 | fc/register/payAdvanceManage.js |
| 36 | fcAdvanceTF | saveReceiveInfo | 1 | fc/register/receiveAdvanceManage.js |
| 37 | fcAdvanceTF | saveVerification | 1 | fc/register/receiveAdvanceManage.js |
| 38 | fcAdvanceTF | saveVerificationPay | 1 | fc/register/payAdvanceManage.js |
| 39 | fcApplyInvoiceTF | cancleApplyInvoiceBatch | 1 | fc/invoice/applyInvoiceManage.js |
| 40 | fcApplyInvoiceTF | queryApplyInvoiceById | 1 | fc/invoice/applyInvoiceManage.js |
| 41 | fcApplyInvoiceTF | queryApplyInvoicePage | 1 | fc/invoice/applyInvoiceManage.js |
| 42 | fcApplyInvoiceTF | revokeInvoicingBatch | 1 | fc/invoice/applyInvoiceManage.js |
| 43 | fcApplyInvoiceTF | verifyInvoice | 1 | fc/invoice/applyInvoiceManage.js |
| 44 | fcApplyInvoiceTF | verifyInvoiceBatch | 1 | fc/invoice/applyInvoiceManage.js |
| 45 | fcApplyInvoiceTF | verifySure | 1 | fc/invoice/applyInvoiceManage.js |
| 46 | fcApplyInvoiceTF | verifySureBatch | 1 | fc/invoice/applyInvoiceManage.js |
| 47 | fcBudgetTF | calTotalMap | 2 | businessAnalysis/actual/addActual.js |
| 48 | fcBudgetTF | cancelVerifyFcBudgetInfo | 1 | businessAnalysis/budget/budgetManage.js |
| 49 | fcBudgetTF | deleteFcBudgetInfo | 1 | businessAnalysis/budget/budgetManage.js |
| 50 | fcBudgetTF | getFcBudgetInfo | 2 | businessAnalysis/budget/budgetDetail.js |
| 51 | fcBudgetTF | queryFcAttrInfoList | 4 | businessAnalysis/actual/actualDetail.js |
| 52 | fcBudgetTF | queryFcBudgetInfoPage | 1 | businessAnalysis/budget/budgetManage.js |
| 53 | fcBudgetTF | queryWorkOrgList | 4 | businessAnalysis/actual/actualManage.js |
| 54 | fcBudgetTF | resolveValue | 1 | businessAnalysis/budget/budgetModify.js |
| 55 | fcBudgetTF | saveFcBudgetInfo | 1 | businessAnalysis/budget/budgetModify.js |
| 56 | fcBudgetTF | verifyFcBudgetInfo | 1 | businessAnalysis/budget/budgetDetail.js |
| 57 | fcCollectionRegistrationTF | batchSureReceive | 1 | fc/register/collectionRegistration.js |
| 58 | fcCollectionRegistrationTF | cancleReceiveFee | 2 | fc/register/collectionRegistration.js |
| 59 | fcCollectionRegistrationTF | loadBillNoReceiveData | 1 | fc/register/ARManage.js |
| 60 | fcCollectionRegistrationTF | loadBillReceiveData | 1 | fc/register/collectionRegistration.js |
| 61 | fcCollectionRegistrationTF | queryReceiveRecord | 2 | fc/register/collectionRegistration.js |
| 62 | fcCollectionRegistrationTF | sureReceiveNew | 1 | fc/register/collectionRegistration.js |
| 63 | fcCollectionRegistrationTF | updateLastReceiveDate | 1 | fc/register/collectionRegistration.js |
| 64 | fcCostAccountTF | delCostAccount | 1 | fc/invoice/costAccountManage.js |
| 65 | fcCostAccountTF | queryAddCostWaybillData | 1 | fc/invoice/costAccountManage.js |
| 66 | fcCostAccountTF | queryCostAccountById | 1 | fc/invoice/costAccountManage.js |
| 67 | fcCostAccountTF | queryCostAccountDetail | 1 | fc/invoice/costAccountManage.js |
| 68 | fcCostAccountTF | queryCostAccountPage | 1 | fc/invoice/costAccountManage.js |
| 69 | fcCostAccountTF | saveCostAccount | 1 | fc/invoice/costAccountManage.js |
| 70 | fcCostAccountTF | verifySure | 1 | fc/invoice/costAccountManage.js |
| 71 | fcCustBillTF | cancelVerifyMakeupInfo | 1 | fc/billMakeup/billMakeupFeeList.js |
| 72 | fcCustBillTF | checkVerifyMakeupInfo | 1 | fc/billMakeup/billMakeupFeeList.js |
| 73 | fcCustBillTF | deleteFcCustomerBill | 1 | fc/custBill/unconfirmedBill.js |
| 74 | fcCustBillTF | delMakeupInfo | 1 | fc/billMakeup/billMakeupFeeList.js |
| 75 | fcCustBillTF | loadAllCustomerRequestRemark | 1 | fc/custBill/confirmedBill.js |
| 76 | fcCustBillTF | loadOrderBillSupplementFeeData | 1 | fc/billMakeup/billMakeupFeeList.js |
| 77 | fcCustBillTF | loadOrderFeeData | 1 | fc/custBill/commonSelectBillItem.js |
| 78 | fcCustBillTF | loadPackLeaseFeeData | 1 | fc/custBill/commonSelectBillItem.js |
| 79 | fcCustBillTF | loadProjectsundryFeeData | 1 | fc/custBill/commonSelectBillItem.js |
| 80 | fcCustBillTF | loadStorehouseFeeData | 1 | fc/custBill/commonSelectBillItem.js |
| 81 | fcCustBillTF | queryCustomerBillDetailList | 2 | fc/custBill/unconfirmedBill.js |
| 82 | fcCustBillTF | queryCustomerBillInvoiceDetail | 1 | fc/custBill/confirmedBill.js |
| 83 | fcCustBillTF | queryCustomerBillInvoiceInfo | 1 | fc/custBill/confirmedBill.js |
| 84 | fcCustBillTF | queryCustomerBillPage | 5 | fc/custBill/confirmedBill.js |
| 85 | fcCustBillTF | revokeBillApplyInvoice | 1 | fc/custBill/confirmedBill.js |
| 86 | fcCustBillTF | revokeBillConfirm | 1 | fc/custBill/confirmedBill.js |
| 87 | fcCustBillTF | saveBillApplyInvoice | 1 | fc/custBill/confirmedBill.js |
| 88 | fcCustBillTF | saveMakeupInfo | 2 | fc/billMakeup/billMakeupFeeList.js |
| 89 | fcCustBillTF | saveOrUpdateCustBill | 2 | custBill/add/addCustomerBillMain.js |
| 90 | fcCustBillTF | saveWriteoffFee | 1 | fc/custBill/confirmedBill.js |
| 91 | fcCustBillTF | sureFcCustomerBill | 1 | fc/custBill/unconfirmedBill.js |
| 92 | fcCustBillTF | verifyMakeupInfo | 1 | fc/billMakeup/billMakeupFeeList.js |
| 93 | fcExamineTF | delFcExamineItemInfo | 1 | examine/item/fcExamineItemInfoManage.js |
| 94 | fcExamineTF | queryFcExamineInfoPage | 1 | fc/examine/fcExamineInfoManage.js |
| 95 | fcExamineTF | queryFcExamineItemInfoList | 1 | fc/examine/fcExamineDetail.js |
| 96 | fcExamineTF | queryFcExamineItemInfoPage | 1 | examine/item/fcExamineItemInfoManage.js |
| 97 | fcExamineTF | saveFcExamineItemInfo | 1 | examine/item/fcExamineItemInfoManage.js |
| 98 | fcExpenditureRegisterTF | batchSaveSupplierBillRegister | 1 | fc/register/expenditureRegisterManage.js |
| 99 | fcExpenditureRegisterTF | cancleSupplierInvoiceRegister | 2 | fc/register/expenditureRegisterManage.js |
| 100 | fcExpenditureRegisterTF | querySupplierAllPayData | 1 | fc/register/expenditureRegisterRecord.js |
| 101 | fcExpenditureRegisterTF | querySupplierBillDetail | 1 | fc/register/expenditureRegisterManage.js |
| 102 | fcExpenditureRegisterTF | querySupplierBillInvoice | 1 | fc/register/expenditureRegisterManage.js |
| 103 | fcExpenditureRegisterTF | querySupplierBillPayData | 1 | fc/register/expenditureRegisterManage.js |
| 104 | fcExpenditureRegisterTF | saveSupplierBillRegister | 1 | fc/register/expenditureRegisterManage.js |
| 105 | fcInsuranceTF | deleteInsuranceInfo | 1 | fc/accrual/insuranceManage.js |
| 106 | fcInsuranceTF | getInsuranceInfo | 1 | fc/accrual/saveInsuranceInfo.js |
| 107 | fcInsuranceTF | queryInsuranceInfoPage | 1 | fc/accrual/insuranceManage.js |
| 108 | fcInsuranceTF | saveInsuranceInfo | 1 | fc/accrual/saveInsuranceInfo.js |
| 109 | fcInsuranceTF | verifyInsuranceInfo | 1 | fc/accrual/saveInsuranceInfo.js |
| 110 | fcPayTF | addPrintTimes | 1 | receipts/print/payOrderDetail.js |
| 111 | fcPayTF | applyFcPayInfo | 1 | receipts/detail/payOrderDetail.js |
| 112 | fcPayTF | cancelFcPayInfo | 1 | fc/receipts/fcPayManage.js |
| 113 | fcPayTF | cancelPayRegist | 1 | fc/receipts/fcPayManage.js |
| 114 | fcPayTF | cancelReceiveReceiptById | 1 | fc/receipts/fcPayManage.js |
| 115 | fcPayTF | delFcBankInfo | 2 | receipts/add/addPayOrder.js |
| 116 | fcPayTF | delFcPayInfo | 1 | fc/receipts/fcPayManage.js |
| 117 | fcPayTF | getAllBaseVerifyExt | 1 | fc/receipts/fcPayManage.js |
| 118 | fcPayTF | getReceiveStates | 1 | fc/receipts/fcPayManage.js |
| 119 | fcPayTF | invalidFcPayInfo | 1 | fc/receipts/fcPayManage.js |
| 120 | fcPayTF | loadFcPayBillDataByBillIds | 1 | fc/supplierBill/confirmedBill.js |
| 121 | fcPayTF | loadFcPayInfoById | 1 | receipts/add/addPayOrder.js |
| 122 | fcPayTF | loadFcPayInfoForPrintById | 2 | receipts/detail/payOrderDetail.js |
| 123 | fcPayTF | loadOpLog | 1 | receipts/detail/payOrderOpLog.js |
| 124 | fcPayTF | multipleInvoice | 1 | receipts/add/addPayOrder.js |
| 125 | fcPayTF | oneKeyCancelFcPayInfo | 1 | fc/receipts/fcPayManage.js |
| 126 | fcPayTF | payRegist | 1 | fc/receipts/fcPayManage.js |
| 127 | fcPayTF | queryFcBankInfo | 2 | receipts/add/addPayOrder.js |
| 128 | fcPayTF | queryFcPayInfoPage | 1 | fc/receipts/fcPayManage.js |
| 129 | fcPayTF | receiveReceiptById | 1 | fc/receipts/fcPayManage.js |
| 130 | fcPayTF | revokePayById | 1 | fc/receipts/fcPayManage.js |
| 131 | fcPrjSundryFeeBillBizTF | queryFcPrjSundryFeeBillById | 1 | fc/sundry/prjSundryFeeManage.js |
| 132 | fcPrjSundryFeeBillBizTF | queryFcPrjSundryFeeBillList | 1 | fc/sundry/paymentRegist.js |
| 133 | fcPrjSundryFeeBillBizTF | queryFcPrjSundryFeeBillPage | 1 | fc/sundry/prjSundryFeeManage.js |
| 134 | fcPrjSundryFeeBillBizTF | updateStateToInvalid | 1 | fc/sundry/prjSundryFeeManage.js |
| 135 | fcReportTF | getFcCumulativeAnalysisReportInfo | 1 | businessAnalysis/report/cumulativeAnalysisReport.js |
| 136 | fcReportTF | getFcIncomeCostReportInfo | 1 | businessAnalysis/report/incomeCostReport.js |
| 137 | fcReportTF | getFcMonthlySummaryReportInfo | 1 | businessAnalysis/report/monthlySummaryReport.js |
| 138 | fcReportTF | getFcNetProfitAchievementReportInfo | 1 | businessAnalysis/report/netProfitAchievementReport.js |
| 139 | fcReportTF | loadBusinessResultsAnalysis | 1 | businessAnalysis/report/allBaseAnalysisSummary.js |
| 140 | fcReportTF | loadBusinessResultsAnalysisByOrgId | 1 | businessAnalysis/report/specificBaseAnalysisSummary.js |
| 141 | fcReportTF | loadSameMonthComparisonAnalysis | 1 | businessAnalysis/report/compareAnalysisSummary.js |
| 142 | fcStoreHouseBillBizTF | queryFcStoreHouseBillShareDtlPage | 1 | fc/storehouse/storeHouseBillShareDtl.js |
| 143 | fcSubmitInvoiceTF | cancleSubmitInvoice | 1 | fc/invoice/submitInvoiceManage.js |
| 144 | fcSubmitInvoiceTF | delFcSubmitInvoice | 1 | fc/supplierBill/confirmedBill.js |
| 145 | fcSubmitInvoiceTF | queryFcSubmitInvoice | 1 | fc/supplierBill/confirmedBill.js |
| 146 | fcSubmitInvoiceTF | querySubmitInvoiceById | 1 | fc/invoice/submitInvoiceManage.js |
| 147 | fcSubmitInvoiceTF | querySubmitInvoicePage | 1 | fc/invoice/submitInvoiceManage.js |
| 148 | fcSubmitInvoiceTF | queryUpSubmitInvoice | 1 | fc/invoice/submitInvoiceManage.js |
| 149 | fcSubmitInvoiceTF | saveUpSubmitInvoice | 1 | fc/invoice/submitInvoiceManage.js |
| 150 | fcSubmitInvoiceTF | updateFcSubmitInvoice | 1 | fc/supplierBill/confirmedBill.js |
| 151 | fcSubmitInvoiceTF | verifyInvoice | 1 | fc/invoice/submitInvoiceManage.js |
| 152 | fcSupplierBillTF | addFcSupplierBillInfo | 1 | supplierBill/add/addSupplierBillMain.js |
| 153 | fcSupplierBillTF | batchAddFcSubmitInvoice | 1 | fc/supplierBill/confirmedBill.js |
| 154 | fcSupplierBillTF | cancelVerifyMakeupInfo | 1 | fc/supplierBill/feeChangeManage.js |
| 155 | fcSupplierBillTF | checkVerifyMakeupInfo | 1 | fc/supplierBill/feeChangeManage.js |
| 156 | fcSupplierBillTF | confirmFcSupplierBillInfo | 1 | fc/supplierBill/unconfirmedBill.js |
| 157 | fcSupplierBillTF | delFcSupplierBillInfo | 1 | fc/supplierBill/unconfirmedBill.js |
| 158 | fcSupplierBillTF | delMakeupInfo | 1 | fc/supplierBill/feeChangeManage.js |
| 159 | fcSupplierBillTF | getAllFcSupplierBillInfo | 4 | supplierBill/detail/billDetail.js |
| 160 | fcSupplierBillTF | getFcSupplierBillInfos | 1 | receipts/add/addPayOrder.js |
| 161 | fcSupplierBillTF | loadInvoiceCommitBillList | 1 | receipts/add/addPayOrder.js |
| 162 | fcSupplierBillTF | queryAllBillCustTenantInfo | 2 | fc/supplierBill/feeChangeManage.js |
| 163 | fcSupplierBillTF | queryAllNoSupplyInvoiceFee | 1 | fc/supplierBill/confirmedBill.js |
| 164 | fcSupplierBillTF | queryBillFeeChangePageForBill | 1 | fc/supplierBill/feeChangeManage.js |
| 165 | fcSupplierBillTF | queryConfirmedFcSupplierBillInfo | 1 | fc/supplierBill/confirmedBill.js |
| 166 | fcSupplierBillTF | queryFcSupplierBillInfo | 1 | fc/supplierBill/unconfirmedBill.js |
| 167 | fcSupplierBillTF | queryInvoiceTypeData | 1 | fc/supplierBill/confirmedBill.js |
| 168 | fcSupplierBillTF | queryMakeupShareDatas | 1 | fc/supplierBill/feeChangeManage.js |
| 169 | fcSupplierBillTF | queryNoPayFcSupplierBillInfo | 1 | fc/register/APManage.js |
| 170 | fcSupplierBillTF | queryOrdWaybillPageForBill | 1 | fc/supplierBill/commonSelectBillItem.js |
| 171 | fcSupplierBillTF | queryPackCostPageForBill | 1 | fc/supplierBill/commonSelectBillItem.js |
| 172 | fcSupplierBillTF | queryPaySupplierBillPage | 1 | fc/register/expenditureRegisterManage.js |
| 173 | fcSupplierBillTF | queryStorehouseBillPageForBill | 1 | fc/supplierBill/commonSelectBillItem.js |
| 174 | fcSupplierBillTF | querySupplierBankDataNoPage | 2 | fc/invoice/submitInvoiceManage.js |
| 175 | fcSupplierBillTF | revokeFcSupplierBillInfo | 1 | fc/supplierBill/confirmedBill.js |
| 176 | fcSupplierBillTF | saveMakeupInfo | 2 | fc/supplierBill/feeChangeManage.js |
| 177 | fcSupplierBillTF | updateFcSupplierBillInfo | 1 | supplierBill/update/updateSupplierBillMain.js |
| 178 | fcSupplierBillTF | verifyMakeupInfo | 1 | fc/supplierBill/feeChangeManage.js |
| 179 | fcSupplierBillTF | writeoffFcSupplierBillInfo | 1 | fc/supplierBill/confirmedBill.js |
| 180 | fcTF | queryStatisticsInfo | 1 | fc/financialCenter/financialCenter.js |
| 181 | fcThirdPayFeeTF | addFcThirdPayFeeInfo | 2 | fc/g7Bill/payApply.js |
| 182 | fcThirdPayFeeTF | delFcThirdPayFeeInfo | 2 | fc/g7Bill/payApplyManage.js |
| 183 | fcThirdPayFeeTF | getCurrentOperatorAllChildRegions | 1 | fc/g7Bill/payApply.js |
| 184 | fcThirdPayFeeTF | payFcThirdPayFeeInfo | 2 | fc/g7Bill/payApplyRegister.js |
| 185 | fcThirdPayFeeTF | queryFcThirdPayFeeInfoForPrint | 2 | fc/g7Bill/payApplyPrint.js |
| 186 | fcThirdPayFeeTF | queryFcThirdPayFeeInfoPage | 6 | fc/g7Bill/payApplyManage.js |
| 187 | fcThirdPayFeeTF | queryOrdWaybillForG7Page | 1 | fc/g7Bill/payApply.js |
| 188 | fcThirdPayFeeTF | queryOrdWaybillForGDPage | 1 | fc/gdBill/payApply.js |
| 189 | fcThirdPayFeeTF | querySupplierBankDataNoPage | 4 | fc/g7Bill/payApply.js |
| 190 | fcThirdPayFeeTF | updateFcThirdPayFeeInfo | 2 | fc/g7Bill/payApplyManage.js |
| 191 | fcThirdPayFeeTF | verifyFcThirdPayFeeInfo | 2 | fc/g7Bill/payApplyVerify.js |
| 192 | insuranceRebateIncomeService | confirmInsuranceRebateIncome | 1 | fc/sporadic/insuranceRebate.js |
| 193 | insuranceRebateIncomeService | confirmInsuranceRebateIncomes | 1 | fc/sporadic/insuranceRebateIncomeManage.js |
| 194 | insuranceRebateIncomeService | deleteInsuranceRebateIncome | 1 | fc/sporadic/insuranceRebateIncomeManage.js |
| 195 | insuranceRebateIncomeService | loadInsuranceRebateIncomeById | 1 | fc/sporadic/insuranceRebate.js |
| 196 | insuranceRebateIncomeService | loadInsuranceRebateIncomeSummary | 1 | fc/sporadic/insuranceRebateSummary.js |
| 197 | insuranceRebateIncomeService | queryInsuranceRebateIncomePage | 1 | fc/sporadic/insuranceRebateIncomeManage.js |
| 198 | insuranceRebateIncomeService | queryInsuranceRebateIncomeSummaryPage | 1 | fc/sporadic/insuranceIncomeSummaryManage.js |
| 199 | insuranceRebateIncomeService | saveOrUpdateInsuranceRebateIncome | 1 | fc/sporadic/insuranceRebate.js |
| 200 | ownVehicleBillTF | deleteOwnVehicleBill | 1 | fc/ownVehicleBill/ownVehicleUnconfirmedBill.js |
| 201 | ownVehicleBillTF | loadOwnVehiclePayRecord | 1 | fc/ownVehicleBill/ownVehicleConfirmedBill.js |
| 202 | ownVehicleBillTF | payOwnVehicleFee | 1 | fc/ownVehicleBill/ownVehicleConfirmedBill.js |
| 203 | ownVehicleBillTF | queryOwnVehicleBillDetail | 2 | ownVehicleBill/detail/ownVehicleBillDetail.js |
| 204 | ownVehicleBillTF | queryOwnVehicleBillPage | 2 | fc/ownVehicleBill/ownVehicleConfirmedBill.js |
| 205 | ownVehicleBillTF | queryOwnVehiclePayableFee | 1 | fc/ownVehicleBill/ownVehicleConfirmedBill.js |
| 206 | ownVehicleBillTF | queryWaybillPageForOwnVehicleBill | 2 | fc/ownVehicleBill/commonOwnVehicleSelectBillItem.js |
| 207 | ownVehicleBillTF | queryWaybillPageForOwnVehicleBillList | 1 | ownVehicleBill/update/updateOwnVehicleBillMain.js |
| 208 | ownVehicleBillTF | revokePayRecord | 1 | fc/ownVehicleBill/ownVehicleConfirmedBill.js |
| 209 | ownVehicleBillTF | saveOwnVehicleBill | 1 | ownVehicleBill/add/addOwnVehicleBillMain.js |
| 210 | ownVehicleBillTF | sureOwnVehicleBill | 1 | fc/ownVehicleBill/ownVehicleUnconfirmedBill.js |
| 211 | ownVehicleBillTF | updateOwnVehicleBill | 1 | ownVehicleBill/update/updateOwnVehicleBillMain.js |
| 212 | purchaseApplyServiceImpl | loadPurchaseApplyListByIds | 2 | receipts/add/addPayOrder.js |
| 213 | purPayPlanTF | queryPurPayPlanDtlByIds | 2 | receipts/add/addPayOrder.js |
| 214 | regionOrgTF | getOrgInfoList | 4 | examine/item/fcExamineItemInfoManage.js |
| 215 | regionOrgTF | queryAllWorkOrgData | 2 | fc/accrual/accrualInfoManage.js |
| 216 | regionOrgTF | queryOrgData | 1 | examine/item/fcExamineItemInfoManage.js |
| 217 | regionOrgTF | queryOrgDataList | 1 | fc/accrual/saveInsuranceInfo.js |
| 218 | regionOrgTF | queryOrgSel | 2 | receipts/add/addPayOrder.js |
| 219 | regionOrgTF | queryRegionSelect | 3 | examine/item/fcExamineItemInfoManage.js |
| 220 | requestServiceImpl | cancelPayRegist | 1 | fc/receipts/requestFeeManage.js |
| 221 | requestServiceImpl | cancelReceiveReceiptById | 1 | fc/receipts/requestFeeManage.js |
| 222 | requestServiceImpl | cancelVerifyRequestFeeById | 1 | fc/receipts/requestFeeManage.js |
| 223 | requestServiceImpl | deleteRequestFeeById | 1 | fc/receipts/requestFeeManage.js |
| 224 | requestServiceImpl | getAllBaseVerifyExt | 1 | fc/receipts/requestFeeManage.js |
| 225 | requestServiceImpl | getReceiveStates | 1 | fc/receipts/requestFeeManage.js |
| 226 | requestServiceImpl | increaseRequestFeePrintById | 2 | receipts/detail/requestFeeDetail.js |
| 227 | requestServiceImpl | invalidRequestFeeById | 1 | fc/receipts/requestFeeManage.js |
| 228 | requestServiceImpl | loadOpLog | 1 | receipts/detail/requestFeeOpLog.js |
| 229 | requestServiceImpl | loadPayRecordPage | 3 | fc/receipts/fcPayManage.js |
| 230 | requestServiceImpl | loadRequestFeeById | 3 | receipts/add/addRequestFee.js |
| 231 | requestServiceImpl | loadRequestFeeByIds | 1 | receipts/add/addPayOrder.js |
| 232 | requestServiceImpl | loadRequestFeePage | 1 | fc/receipts/requestFeeManage.js |
| 233 | requestServiceImpl | oneKeyCancelFcPayReqInfo | 1 | fc/receipts/requestFeeManage.js |
| 234 | requestServiceImpl | payRegist | 1 | fc/receipts/requestFeeManage.js |
| 235 | requestServiceImpl | receiveReceiptById | 1 | fc/receipts/requestFeeManage.js |
| 236 | requestServiceImpl | refundConfirm | 1 | fc/receipts/requestFeeManage.js |
| 237 | requestServiceImpl | revokePayById | 1 | fc/receipts/requestFeeManage.js |
| 238 | requestServiceImpl | saveOrUpdateRequestFee | 1 | receipts/add/addRequestFee.js |
| 239 | requestServiceImpl | verifyRequestFeeById | 1 | receipts/detail/requestFeeDetail.js |
| 240 | scrapService | deleteScrap | 1 | fc/sporadic/scrapManage.js |
| 241 | scrapService | loadScrapById | 1 | fc/sporadic/scrapInfo.js |
| 242 | scrapService | loadScrapInfoList | 1 | fc/sporadic/wasteDisposal.js |
| 243 | scrapService | queryScrapPage | 1 | fc/sporadic/scrapManage.js |
| 244 | scrapService | saveOrUpdateScrap | 1 | fc/sporadic/scrapInfo.js |
| 245 | selectStaticDataTF | getCityId | 1 | fc/standardCost/transportationCostInfo.js |
| 246 | selectStaticDataTF | getDistrictId | 1 | fc/standardCost/transportationCostInfo.js |
| 247 | selectStaticDataTF | getProvinceId | 1 | fc/standardCost/transportationCostInfo.js |
| 248 | selectStaticDataTF | selectCity | 1 | fc/standardCost/transportationCostInfo.js |
| 249 | selectStaticDataTF | selectDistrict | 1 | fc/standardCost/transportationCostInfo.js |
| 250 | selectStaticDataTF | selectProvince | 1 | fc/standardCost/transportationCostInfo.js |
| 251 | standardCostBaseService | deleteStandardCostBase | 1 | fc/standardCost/oilManage.js |
| 252 | standardCostBaseService | loadStandardCostBase | 1 | fc/standardCost/otherInfo.js |
| 253 | standardCostBaseService | loadStandardCostBaseInfoList | 1 | fc/standardCost/transportationCostInfo.js |
| 254 | standardCostBaseService | queryStandardCostBasePage | 1 | fc/standardCost/oilManage.js |
| 255 | standardCostBaseService | saveOrUpdateStandardCostBase | 2 | fc/standardCost/oilManage.js |
| 256 | standardCostOperateFeeService | deleteStandardCostOperateFee | 1 | fc/standardCost/operateFeeManage.js |
| 257 | standardCostOperateFeeService | loadStandardCostOperateFeeById | 1 | fc/standardCost/operateFeeInfo.js |
| 258 | standardCostOperateFeeService | loadStandardCostOperateFeeDetailListById | 1 | fc/standardCost/workCostInfo.js |
| 259 | standardCostOperateFeeService | queryStandardCostOperateFeeList | 1 | fc/standardCost/workCostInfo.js |
| 260 | standardCostOperateFeeService | queryStandardCostOperateFeePage | 1 | fc/standardCost/operateFeeManage.js |
| 261 | standardCostOperateFeeService | saveOrUpdateStandardCostOperateFee | 1 | fc/standardCost/operateFeeInfo.js |
| 262 | standardCostTransportationService | deleteStandardCostTransportation | 2 | fc/standardCost/transportationCostOutManage.js |
| 263 | standardCostTransportationService | loadStandardCostTransportationById | 2 | fc/standardCost/transportationCostInfo.js |
| 264 | standardCostTransportationService | queryStandardCostTransportationPage | 2 | fc/standardCost/transportationCostOutManage.js |
| 265 | standardCostTransportationService | saveOrUpdateStandardCostTransportation | 2 | fc/standardCost/transportationCostInfo.js |
| 266 | standardCostWarehousingService | deleteStandardCostWarehousing | 1 | fc/standardCost/warehousingCostManage.js |
| 267 | standardCostWarehousingService | loadStandardCostWarehousingById | 1 | fc/standardCost/storehouseCostInfo.js |
| 268 | standardCostWarehousingService | queryStandardCostWarehousingPage | 1 | fc/standardCost/warehousingCostManage.js |
| 269 | standardCostWarehousingService | saveOrUpdateStandardCostWarehousing | 1 | fc/standardCost/storehouseCostInfo.js |
| 270 | standardCostWorkService | deleteStandardCostWork | 1 | fc/standardCost/workCostManage.js |
| 271 | standardCostWorkService | loadStandardCostWorkById | 1 | fc/standardCost/workCostInfo.js |
| 272 | standardCostWorkService | queryStandardCostWorkPage | 1 | fc/standardCost/workCostManage.js |
| 273 | standardCostWorkService | saveOrUpdateStandardCostWork | 1 | fc/standardCost/workCostInfo.js |
| 274 | storeHouseBizTF | getActiveStoreHouseInfo | 1 | fc/storehouse/wmsFeeIncomeManage.js |
| 275 | storeHouseBizTF | getLeasingCustomer | 1 | fc/storehouse/wmsFeeIncomeManage.js |
| 276 | storeHouseBizTF | queryStoreHouseList | 12 | fc/sporadic/scrapInfo.js |
| 277 | supplierTF | getSupplierBankInfo | 1 | fc/sundry/prjSundryFeeManage.js |
| 278 | supplierTF | queryAllSupplierList | 11 | fc/invoice/costAccountManage.js |
| 279 | userTF | getRelSubsidiary | 2 | receipts/add/addPayOrder.js |
| 280 | userTF | loadCurrentOrgUserList | 2 | receipts/add/addPayOrder.js |
| 281 | wasteDisposalIncomeService | confirmWasteDisposalIncome | 1 | fc/sporadic/wasteDisposal.js |
| 282 | wasteDisposalIncomeService | confirmWasteDisposalIncomes | 1 | fc/sporadic/wasteDisposalIncomeManage.js |
| 283 | wasteDisposalIncomeService | deleteWasteDisposalIncome | 1 | fc/sporadic/wasteDisposalIncomeManage.js |
| 284 | wasteDisposalIncomeService | loadWasteDisposalIncomeById | 1 | fc/sporadic/wasteDisposal.js |
| 285 | wasteDisposalIncomeService | loadWasteDisposalIncomeSummary | 1 | fc/sporadic/wasteDisposalSummary.js |
| 286 | wasteDisposalIncomeService | queryWasteDisposalIncomePage | 1 | fc/sporadic/wasteDisposalIncomeManage.js |
| 287 | wasteDisposalIncomeService | queryWasteDisposalIncomeSummaryPage | 1 | fc/sporadic/wasteIncomeSummaryManage.js |
| 288 | wasteDisposalIncomeService | saveOrUpdateWasteDisposalIncome | 1 | fc/sporadic/wasteDisposal.js |
| 289 | wmsCostService | deleteWmsFeeCostById | 1 | fc/storehouse/storeHouseBillManage.js |
| 290 | wmsCostService | loadFeeCostDataById | 1 | fc/storehouse/storeHouseBillDetail.js |
| 291 | wmsCostService | loadStoreHouseData | 1 | fc/storehouse/storeHouseBillDetail.js |
| 292 | wmsCostService | queryWmsFeeCostPage | 1 | fc/storehouse/storeHouseBillManage.js |
| 293 | wmsCostService | saveFeeCost | 1 | fc/storehouse/storeHouseBillDetail.js |
| 294 | wmsFeeCostItemDtlService | queryFeeCostItemDtlPage | 1 | fc/storehouse/storeHouseBillDetail.js |
| 295 | wmsFeeIncomeTF | addOrUpdateWmsfee | 1 | fc/storehouse/wmsFeeIncomeManage.js |
| 296 | wmsFeeIncomeTF | delWmsFee | 1 | fc/storehouse/wmsFeeIncomeManage.js |
| 297 | wmsFeeIncomeTF | queryWmsFeeIncome | 1 | fc/storehouse/wmsFeeIncomeManage.js |
| 298 | wmsFeeIncomeTF | queryWmsFeeIncomeDetail | 1 | fc/storehouse/wmsFeeIncomeDtlManage.js |
| 299 | wmsFeeIncomeTF | queryWmsFeeIncomeRentDetail | 1 | fc/storehouse/wmsFeeIncomeRentDtlManage.js |
| 300 | wmsFeeIncomeTF | queryWmsFeeIncomeRentStatementById | 1 | fc/storehouse/wmsFeeIncomeRentStatement.js |
| 301 | wmsQuoteSheetTF | queryItemType | 1 | fc/storehouse/wmsFeeIncomeManage.js |
| 302 | wmsStorehouseTF | queryAssetFeeDetailList | 1 | fc/storehouse/storeHouseBillDetail.js |
| 303 | wmsStorehouseTF | queryStorehouseFeeDetailList | 1 | fc/storehouse/storeHouseBillDetail.js |

### pt/home

共 27 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | bankTF | queryMyBankInfo | 1 | pt/home/personal.vue |
| 2 | bankTF | saveBankInfoForMySelf | 1 | pt/home/personal.vue |
| 3 | commonTF | getSysStaticData | 1 | pt/home/personal.vue |
| 4 | hcQuestionTF | queryAllQuestionList | 1 | pt/home/home.js |
| 5 | homeCollectTF | queryHomeBrokenData | 1 | pt/home/toMain.js |
| 6 | homeCollectTF | queryHomeCollectData | 1 | pt/home/toMain.js |
| 7 | homeCollectTF | queryHomeCustomerCityData | 1 | pt/home/toMain.js |
| 8 | homeCollectTF | queryHomeCustomerData | 1 | pt/home/toMain.js |
| 9 | homeCollectTF | queryHomeMarqueeList | 1 | pt/home/home.js |
| 10 | menuTF | loadMenuTree | 1 | pt/home/navMenu.js |
| 11 | projRequirementTF | queryRemindOnlineInfo | 1 | pt/home/home.js |
| 12 | projRequirementTF | saveReadRemindOnlineInfo | 1 | pt/home/home.js |
| 13 | roleTF | getUserAllEntityIds | 1 | pt/home/home.js |
| 14 | sysSearchParamConfigTF | loadSysSearchParamConfigList | 1 | pt/home/home.js |
| 15 | userTF | delUserMenu | 1 | pt/home/navMenu.js |
| 16 | userTF | delUserMenuLabel | 1 | pt/home/home.js |
| 17 | userTF | getWorkInfo | 1 | pt/home/home.js |
| 18 | userTF | loadTodoData | 1 | pt/home/home.js |
| 19 | userTF | logout | 1 | pt/home/home.js |
| 20 | userTF | modifyPasswordFirst | 1 | pt/home/home.js |
| 21 | userTF | queryUserMenuLabelData | 1 | pt/home/home.js |
| 22 | userTF | saveUserMenu | 1 | pt/home/navMenu.js |
| 23 | userTF | selOrg | 1 | pt/home/home.js |
| 24 | userTF | sendWsMsg | 1 | pt/home/home.js |
| 25 | userTF | setUserAddress | 1 | pt/home/personal.vue |
| 26 | userTF | smsModifyPassword | 1 | pt/home/home.js |
| 27 | userTF | webPtSendPasswordSmsValidCode | 1 | pt/home/home.js |

### pt/hr

共 20 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | commonTF | getSysStaticData | 4 | hr/cost/hrManagementCostDetail.js |
| 2 | hrManagementCostTF | changePassword | 1 | hr/cost/hrManagementCostManage.js |
| 3 | hrManagementCostTF | checkPassword | 1 | hr/cost/hrManagementCostManage.js |
| 4 | hrManagementCostTF | deleteManagementCost | 1 | hr/cost/hrManagementCostManage.js |
| 5 | hrManagementCostTF | queryManagementCostDetail | 1 | hr/cost/hrManagementCostDetail.js |
| 6 | hrManagementCostTF | queryManagementCostPage | 1 | hr/cost/hrManagementCostManage.js |
| 7 | hrManagementCostTF | saveManagementCost | 1 | hr/cost/hrManagementCostDetail.js |
| 8 | hrNewsTF | delNews | 1 | hr/news/newsManage.js |
| 9 | hrNewsTF | getNewsDetail | 2 | hr/news/addNews.js |
| 10 | hrNewsTF | queryNewsPage | 1 | hr/news/newsManage.js |
| 11 | hrNewsTF | saveNews | 1 | hr/news/addNews.js |
| 12 | hrNewsTF | setTopFlag | 1 | hr/news/newsManage.js |
| 13 | hrRecruitInfoTF | delHrRecruitInfo | 1 | hr/recruit/recruitManage.js |
| 14 | hrRecruitInfoTF | publishHrRecruitInfo | 1 | hr/recruit/recruitManage.js |
| 15 | hrRecruitInfoTF | queryHrApplicantInfoDetail | 1 | hr/recruit/applicantDetail.js |
| 16 | hrRecruitInfoTF | queryHrApplicantInfoPage | 1 | hr/recruit/applicantManage.js |
| 17 | hrRecruitInfoTF | queryHrRecruitInfoDetail | 2 | hr/recruit/addRecruit.js |
| 18 | hrRecruitInfoTF | queryHrRecruitInfoPage | 1 | hr/recruit/recruitManage.js |
| 19 | hrRecruitInfoTF | saveHrRecruitInfo | 1 | hr/recruit/addRecruit.js |
| 20 | hrRecruitInfoTF | updateHrApplicantInfoState | 1 | hr/recruit/applicantManage.js |

### pt/login

共 3 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | userTF | webPtgetShowCode | 1 | pt/login/login.js |
| 2 | userTF | webPtSendLoginSmsValidCode | 1 | pt/login/login.js |
| 3 | userTF | webPtSendPasswordSmsValidCode | 1 | pt/login/forgetPassword.js |

### pt/operateLog

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### pt/ord

共 155 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | catlVehicleService | deleteCatlVehicleById | 1 | ord/catlVehicle/catlVehicleManage.js |
| 2 | catlVehicleService | queryCatlVehiclePage | 1 | ord/catlVehicle/catlVehicleManage.js |
| 3 | catlVehicleService | saveOrUpdateCatlVehicle | 1 | ord/catlVehicle/catlVehicleManage.js |
| 4 | commonTF | checkDateLimit | 2 | ord/order/orderManage.js |
| 5 | commonTF | getOwnSupplierTenantIds | 2 | dispatch/subpage/waybillInfo.js |
| 6 | commonTF | getSysStaticData | 17 | ord/cdt/coInitiated.js |
| 7 | commonTF | getSysStaticDataByCodeTypes | 13 | ord/dispatch/selStock.js |
| 8 | commonTF | getTaxPoint | 1 | ord/transit/transitManage.js |
| 9 | customerTF | queryCustomerListNoPage | 5 | ord/order/commonOrder.js |
| 10 | driverTF | selDriverInfoListByCond | 5 | dispatch/subpage/transitWaybillInfo.js |
| 11 | fileCommonTF | doDel | 2 | dispatch/subpage/receipts.js |
| 12 | incomeTF | cancelStatement | 1 | ord/order/incomeFeeStatementManage.js |
| 13 | incomeTF | loadIncomeFeeStatementInfo | 1 | ord/order/incomeFeeStatementManage.js |
| 14 | incomeTF | loadIncomeFeeStatementPage | 1 | ord/order/incomeFeeStatementManage.js |
| 15 | incomeTF | loadOrderIncomeStatementData | 1 | ord/order/incomeFeeStatementManage.js |
| 16 | incomeTF | updateOrdOrderFeeIncomeStatement | 1 | ord/order/incomeFeeStatementManage.js |
| 17 | incomeTF | verifyNoPass | 1 | ord/order/incomeFeeStatementManage.js |
| 18 | incomeTF | verifyPass | 1 | ord/order/incomeFeeStatementManage.js |
| 19 | modifyRecordTF | loadOrderModifyRecordData | 1 | order/orderDetail/modifyRecord.js |
| 20 | modifyRecordTF | loadWaybillModifyRecordData | 1 | detail/subpage/modifyRecord.js |
| 21 | ordCatlOrderTF | getAcctInfos | 1 | ord/order/catlOrderPlanManage.js |
| 22 | ordCatlOrderTF | getOrdCatlOrderInfo | 2 | ord/dispatch/dispatch.js |
| 23 | ordCatlOrderTF | queryCatlOrderPage | 1 | ord/order/catlOrderPlanManage.js |
| 24 | ordCatlOrderTF | saveAcctInfos | 1 | ord/order/catlOrderPlanManage.js |
| 25 | ordDispatchTF | addOrdDispatchInfo | 1 | ord/dispatch/dispatch.js |
| 26 | ordDispatchTF | getDispatchTypeName | 3 | ord/dispatch/dispatchManage.js |
| 27 | ordDispatchTF | queryAllOrdStockGoodsDetailList | 3 | dispatch/subpage/transitWaybillInfo.js |
| 28 | ordDispatchTF | queryOrdDispatchPage | 1 | ord/dispatch/dispatchManage.js |
| 29 | ordDispatchTF | queryOrdStockGoodsDetailList | 4 | dispatch/subpage/orderStock.js |
| 30 | ordDispatchTF | queryOrdStockPage | 3 | ord/dispatch/dispatch.js |
| 31 | ordDispatchTF | selWorkInfoListByCond | 3 | dispatch/subpage/orderStock.js |
| 32 | orderCdtRegionServiceImpl | cancelCdtRegionOrder | 1 | ord/cdt/coInitiated.js |
| 33 | orderCdtRegionServiceImpl | queryCdtRegionOrderInfoList | 1 | ord/cdt/coInitiated.js |
| 34 | orderCdtRegionServiceImpl | queryCdtRegionOrderToMySelfInfoList | 1 | ord/cdt/collaborativeWarehousing.js |
| 35 | orderService | cancelReceiveFeeByOrderId | 1 | ord/order/orderReturnManage.js |
| 36 | orderService | cancelReceiveFeeByOrderIds | 1 | ord/order/orderReturnFeeManage.js |
| 37 | orderService | queryOrderInfo | 1 | order/orderDetail/orderInfo.js |
| 38 | orderService | queryOrderInfoListForReceive | 1 | ord/order/orderReturnManage.js |
| 39 | orderService | queryOrderInfoListForReceiveFee | 2 | ord/order/orderReturnFeeManage.js |
| 40 | orderService | queryOrderTimeLimitPage | 1 | pt/ord/ordTimeLimitManage.js |
| 41 | orderService | rceiveOrder | 1 | order/orderDetail/orderInfo.js |
| 42 | orderService | receiveFeeByOrderIds | 1 | ord/order/orderReturnManage.js |
| 43 | orderService | refuseOrder | 1 | order/orderDetail/orderInfo.js |
| 44 | orderTF | cancelOrder | 1 | ord/order/orderManage.js |
| 45 | orderTF | getOrderDistance | 2 | ord/order/commonOrder.js |
| 46 | orderTF | loadOrderIncomeChangeData | 1 | ord/order/incomeChangeCustomer.js |
| 47 | orderTF | loadOrderOpLogData | 1 | order/orderDetail/operateLog.js |
| 48 | orderTF | queryOrderInfo | 7 | ord/order/copyOrder.js |
| 49 | orderTF | queryOrderInfoData | 2 | ord/receipts/addReceipt.js |
| 50 | orderTF | queryOrderInfoList | 2 | ord/order/orderManage.js |
| 51 | orderTF | queryOrderStockData | 1 | ord/order/orderManage.js |
| 52 | orderTF | queryOrdStockData | 1 | ord/order/ordStockManage.js |
| 53 | orderTF | receiveOrder | 1 | todo/detail/receiveOrRefuseOrderDetail.js |
| 54 | orderTF | refuseOrder | 2 | todo/detail/receiveOrRefuseOrderDetail.js |
| 55 | orderTF | saveOrdOrderFeeIncomeStatement | 2 | ord/order/incomeChange.js |
| 56 | orderTF | saveOrUpdateOrder | 4 | ord/order/addOrder.js |
| 57 | orderTF | verifyOrder | 1 | ord/order/orderManage.js |
| 58 | ordPlanTF | cancelPlanInfo | 1 | ord/plan/ordPlanManage.js |
| 59 | ordPlanTF | deletePlanById | 1 | ord/plan/ordPlanManage.js |
| 60 | ordPlanTF | getOrderContByPlanId | 1 | ord/plan/ordPlanManage.js |
| 61 | ordPlanTF | loadPlanInfoByPlanId | 4 | ord/plan/addPlan.js |
| 62 | ordPlanTF | queryOrdPlanData | 1 | ord/plan/ordPlanManage.js |
| 63 | ordPlanTF | saveOrdPlanInfo | 1 | ord/plan/addPlan.js |
| 64 | ordPlanTF | syncOrder | 1 | ord/plan/ordPlanManage.js |
| 65 | ordWaybillTF | appealWaybill | 1 | ord/waybill/waybillManage.js |
| 66 | ordWaybillTF | cancelConfirmMileage | 1 | ord/waybill/waybillMileageManage.js |
| 67 | ordWaybillTF | cancelConfirmOrdWaybillVehicleCheck | 1 | ord/vehicleCheck/vehicleCheckManage.js |
| 68 | ordWaybillTF | cancelWaybills | 2 | ord/transit/transitList.js |
| 69 | ordWaybillTF | changeSupplier | 1 | ord/waybill/waybillManage.js |
| 70 | ordWaybillTF | clearMileage | 1 | ord/waybill/waybillMileageManage.js |
| 71 | ordWaybillTF | confirmMileage | 1 | ord/waybill/waybillMileageManage.js |
| 72 | ordWaybillTF | confirmOrdWaybillVehicleCheck | 1 | ord/vehicleCheck/vehicleCheckDetail.js |
| 73 | ordWaybillTF | delOrdWaybillFeeCostApply | 1 | ord/waybill/feeChangeManage.js |
| 74 | ordWaybillTF | feeChange | 3 | ord/transit/transitList.js |
| 75 | ordWaybillTF | generateWaybillInfoQrCode | 1 | ord/waybill/waybillManage.js |
| 76 | ordWaybillTF | getAllWorkNode | 1 | waybill/subpage/workNode.js |
| 77 | ordWaybillTF | getOrdWaybillFeeCostApplyDetail | 1 | ord/waybill/feeChangeManage.js |
| 78 | ordWaybillTF | getOrdWaybillVehicleCheckInfo | 1 | ord/vehicleCheck/vehicleCheckDetail.js |
| 79 | ordWaybillTF | getWaybillDataByOrderId | 3 | ord/order/orderManage.js |
| 80 | ordWaybillTF | opWorkNode | 1 | waybill/subpage/workNode.js |
| 81 | ordWaybillTF | queryOrdWaybillData | 1 | waybill/feeChange/feeChange.js |
| 82 | ordWaybillTF | queryOrdWaybillFeeCostApply | 1 | ord/waybill/feeChangeManage.js |
| 83 | ordWaybillTF | queryOrdWaybillList | 3 | ord/receipts/addReceipt.js |
| 84 | ordWaybillTF | queryOrdWaybillMileageInfoPage | 1 | ord/waybill/waybillMileageManage.js |
| 85 | ordWaybillTF | queryOrdWaybillPage | 1 | ord/waybill/waybillManage.js |
| 86 | ordWaybillTF | queryOrdWaybillTerminatePage | 1 | ord/waybill/waybillTerminateManage.js |
| 87 | ordWaybillTF | queryOrdWaybillVehicleCheckPage | 1 | ord/vehicleCheck/vehicleCheckManage.js |
| 88 | ordWaybillTF | queryOrdWaybillVehiclePage | 1 | ord/order/ordWaybillVehicleManage.js |
| 89 | ordWaybillTF | queryWaybillInfo | 4 | waybill/detail/waybillDetail.js |
| 90 | ordWaybillTF | receiveReceiptById | 1 | ord/waybill/waybillManage.js |
| 91 | ordWaybillTF | receiveReceiptByIds | 1 | ord/waybill/receiptScan.js |
| 92 | ordWaybillTF | saveMileage | 1 | ord/waybill/waybillMileageManage.js |
| 93 | ordWaybillTF | smsReminderDriverDeliver | 1 | ord/waybill/waybillManage.js |
| 94 | ordWaybillTF | syncWaybill | 1 | ord/waybill/waybillManage.js |
| 95 | ordWaybillTF | transG7NtoccGround | 1 | ord/waybill/waybillManage.js |
| 96 | ordWaybillTF | updateOrdWaybillFeeCostApply | 1 | ord/waybill/feeChangeManage.js |
| 97 | ordWaybillTF | updateWaybill | 1 | waybill/update/updateWaybill.js |
| 98 | ordWaybillTF | verifyOrdWaybillFeeCostApply | 1 | ord/waybill/feeChangeManage.js |
| 99 | ordWaybillTF | verifyOrdWaybillTerminate | 1 | ord/waybill/waybillTerminateManage.js |
| 100 | ordWaybillTF | verifyWaybill | 2 | ord/transit/transitList.js |
| 101 | ordWaybillTransitLogTF | queryOrdWaybillTransitLog | 2 | ord/transit/transitList.js |
| 102 | ordWaybillTransitLogTF | queryOrdWaybillTransitLogPage | 1 | ord/transit/transitTrackRecord.js |
| 103 | ordWaybillTransitLogTF | saveTransitLog | 2 | ord/transit/transitList.js |
| 104 | quoteLDNewTF | querySupplierLDBestQuote | 1 | dispatch/subpage/transitWaybillInfo.js |
| 105 | receiptsTF | addReceipts | 4 | ord/order/orderManage.js |
| 106 | receiptsTF | cancelSureReceipts | 1 | ord/receipts/receiptsManage.js |
| 107 | receiptsTF | deleteReceipts | 1 | ord/receipts/receiptsManage.js |
| 108 | receiptsTF | insertReceipts | 1 | ord/receipts/addReceipt.js |
| 109 | receiptsTF | loadWaybillOrderInfoByWaybillId | 4 | ord/receipts/addReceipt.js |
| 110 | receiptsTF | loadWaybillWorkInfoByWaybillId | 5 | ord/order/orderManage.js |
| 111 | receiptsTF | queryReceiptsInfoData | 1 | ord/receipts/receiptsManage.js |
| 112 | receiptsTF | sureReceipts | 1 | ord/receipts/receiptsManage.js |
| 113 | regionOrgTF | getOrgInfoList | 3 | pt/ord/ordTimeLimitManage.js |
| 114 | regionOrgTF | getRegionInfoList | 1 | ord/order/commonOrder.js |
| 115 | regionOrgTF | queryRegionSelect | 1 | ord/order/orderManage.js |
| 116 | resOwnVehicleScheduleTF | queryOwnVehicleSchedulePage | 1 | pt/ord/ownVehicleScheduleManage.js |
| 117 | resVehicleInfoTF | confirmVehicleCheck | 1 | ord/vehicleCheck/ownVehicleCheckDetail.js |
| 118 | resVehicleInfoTF | getVehicleCheckInfo | 1 | ord/vehicleCheck/ownVehicleCheckDetail.js |
| 119 | resVehicleInfoTF | queryVehicleCheckPage | 1 | ord/vehicleCheck/ownVehicleCheckManage.js |
| 120 | resVehicleInfoTF | queryVehicleInfoList | 1 | ord/catlVehicle/catlVehicleManage.js |
| 121 | resVehicleInfoTF | selVehicleInfoListByCond | 5 | dispatch/subpage/transitWaybillInfo.js |
| 122 | routeTF | loadGoodsByRouteId | 2 | ord/order/commonOrder.js |
| 123 | routeTF | loadRouteById | 1 | ord/plan/addPlan.js |
| 124 | routeTF | loadRouteSelectByTenantId | 3 | ord/order/commonOrder.js |
| 125 | routeTF | loadWorkByRouteId | 2 | ord/order/commonOrder.js |
| 126 | scheduleService | deleteScheduleById | 1 | pt/ord/scheduleManage.js |
| 127 | scheduleService | queryScheduleData | 1 | pt/ord/scheduleManage.js |
| 128 | scheduleService | querySchedulePage | 1 | pt/ord/scheduleManage.js |
| 129 | scheduleService | queryUnMatchListGroupByRouteId | 1 | pt/ord/scheduleTodoManage.js |
| 130 | scheduleService | saveOrUpdateSchedule | 1 | pt/ord/scheduleManage.js |
| 131 | scheduleService | syncMatch | 1 | pt/ord/scheduleManage.js |
| 132 | selectStaticDataTF | getCityId | 1 | ord/order/commonOrder.js |
| 133 | selectStaticDataTF | getDistrictId | 1 | ord/order/commonOrder.js |
| 134 | selectStaticDataTF | getProvinceId | 1 | ord/order/commonOrder.js |
| 135 | selectStaticDataTF | selectCity | 3 | ord/order/commonOrder.js |
| 136 | selectStaticDataTF | selectDistrict | 3 | ord/order/commonOrder.js |
| 137 | selectStaticDataTF | selectProvince | 3 | ord/order/commonOrder.js |
| 138 | supplierTF | getSupplierDetailInfo | 1 | ord/transit/transitManage.js |
| 139 | supplierTF | queryAllSupplierList | 8 | dispatch/subpage/orderStock.js |
| 140 | transitManageTF | getAdditionalBillTotalFee | 1 | ord/transit/transitManage.js |
| 141 | transitManageTF | getOrdPieceGoodsInfo | 1 | ord/transit/transitManage.js |
| 142 | transitManageTF | loadAdditionalBillList | 1 | ord/transit/transitManage.js |
| 143 | transitManageTF | loadTransitWaybillOrderWorkData | 1 | ord/transit/transitManage.js |
| 144 | transitManageTF | loadWaybillStatementList | 3 | ord/transit/transitList.js |
| 145 | transitManageTF | ordTransitChg | 1 | ord/transit/transitManage.js |
| 146 | transitManageTF | queryOrdTransitDetail | 1 | ord/transit/transitManage.js |
| 147 | transitManageTF | queryOrdTransitPage | 1 | ord/transit/transitList.js |
| 148 | vehicleScheduleService | queryVehicleScheduleUnMatchList | 1 | pt/ord/scheduleManage.js |
| 149 | workGoodsTF | addGoodsInfo | 1 | ord/order/commonOrder.js |
| 150 | workGoodsTF | addWorkInfo | 1 | ord/order/commonOrder.js |
| 151 | workGoodsTF | checkWorkDistance | 1 | ord/order/commonOrder.js |
| 152 | workGoodsTF | queryGoodsDataByTenantId | 2 | ord/order/commonOrder.js |
| 153 | workGoodsTF | queryWorkDataSelect | 4 | dispatch/subpage/orderStock.js |
| 154 | ZCQuoteNewTF | matchOrderFee | 2 | ord/order/commonOrder.js |
| 155 | ZCQuoteNewTF | querySupplierZCBestQuote | 1 | dispatch/subpage/waybillInfo.js |

### pt/pkg

共 37 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | commonTF | getSysStaticData | 7 | business/opLog/PDAOpLogBase.js |
| 2 | commonTF | getSysStaticDataByCodeTypes | 1 | pkg/summary/pkgSummaryManage.js |
| 3 | customerTF | queryCustomerListNoPage | 1 | pt/pkg/packPurchaseManage.js |
| 4 | pkgBusinessTF | queryAllPkgNameNoPage | 2 | business/opLog/PDAOpLogDetail.js |
| 5 | pkgBusinessTF | queryCustWorkPackPage | 1 | pkg/business/packMonitor.js |
| 6 | pkgBusinessTF | queryOpLogPage | 1 | business/opLog/artificialOp.js |
| 7 | pkgBusinessTF | queryPackStoreDetailPage | 1 | pkg/business/packStoreDetailManage.js |
| 8 | pkgBusinessTF | queryPkgBusinessPage | 1 | pkg/business/packBusinessManage.js |
| 9 | pkgBusinessTF | queryPkgCustomerList | 3 | business/opLog/PDAOpLogDetail.js |
| 10 | pkgBusinessTF | queryPkgObjectPage | 1 | pkg/business/packObjectManage.js |
| 11 | pkgContractTF | delContract | 1 | pkg/contract/packContractManage.js |
| 12 | pkgContractTF | getContractPackInfoByCustId | 1 | pkg/summary/pkgSummaryManage.js |
| 13 | pkgContractTF | getPackContractCust | 1 | pkg/summary/pkgSummaryManage.js |
| 14 | pkgContractTF | getPackCust | 1 | pkg/contract/packContractManage.js |
| 15 | pkgContractTF | getPackInfo | 1 | pkg/contract/packContractManage.js |
| 16 | pkgContractTF | queryPkgContractDtlPage | 1 | pkg/contract/packContractManage.js |
| 17 | pkgContractTF | queryPkgContractPage | 1 | pkg/contract/packContractManage.js |
| 18 | pkgFeeTF | addPackIncome | 1 | pkg/fc/packIncomeManage.js |
| 19 | pkgFeeTF | getPackContractCust | 1 | pkg/fc/packIncomeManage.js |
| 20 | pkgFeeTF | queryCostShareInfo | 1 | pkg/fc/packCostManage.js |
| 21 | pkgFeeTF | queryPackCostPage | 1 | pkg/fc/packCostManage.js |
| 22 | pkgFeeTF | queryPackIncomePage | 1 | pkg/fc/packIncomeManage.js |
| 23 | pkgLogTF | queryPkgLogBase | 1 | business/opLog/PDAOpLogBase.js |
| 24 | pkgLogTF | queryPkgLogRel | 1 | business/opLog/PDAOpLogDetail.js |
| 25 | pkgPackInfoTF | delPkgPackInfo | 1 | pkg/summary/pkgSummaryManage.js |
| 26 | pkgPackInfoTF | getPkgOutWorkNodeList | 1 | pkg/summary/pkgSummaryManage.js |
| 27 | pkgPackInfoTF | queryPkgPackInfoPage | 1 | pkg/summary/pkgSummaryManage.js |
| 28 | purchaseTF | beginCalculateFee | 1 | pt/pkg/packPurchaseManage.js |
| 29 | purchaseTF | deletePurchase | 1 | pt/pkg/packPurchaseManage.js |
| 30 | purchaseTF | loadPackNameData | 1 | pt/pkg/packPurchaseManage.js |
| 31 | purchaseTF | loadPurchaseDeliverData | 1 | pt/pkg/packPurchaseManage.js |
| 32 | purchaseTF | loadPurchaseDeliverWorkData | 1 | pt/pkg/packPurchaseManage.js |
| 33 | purchaseTF | queryPurchasePage | 1 | pt/pkg/packPurchaseManage.js |
| 34 | purchaseTF | saveOrUpdatePurchase | 1 | pt/pkg/packPurchaseManage.js |
| 35 | purchaseTF | sureReceivedByTableData | 1 | pt/pkg/packPurchaseManage.js |
| 36 | supplierTF | queryInvoiceFlgSupplier | 1 | pt/pkg/packPurchaseManage.js |
| 37 | workGoodsTF | queryWorkDataSelect | 3 | pkg/business/packBusinessManage.js |

### pt/proj

共 42 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | commonTF | getSysStaticData | 10 | proj/bug/addBug.js |
| 2 | customerTF | queryCustomerListNoPage | 2 | proj/requirement/addRequirement.js |
| 3 | fileCommonTF | doDel | 3 | proj/bug/addBug.js |
| 4 | projBugTF | addBugFile | 1 | proj/bug/bugDetail.js |
| 5 | projBugTF | addProjBugInfo | 1 | proj/bug/addBug.js |
| 6 | projBugTF | delBugFile | 1 | proj/bug/bugDetail.js |
| 7 | projBugTF | delBugInfo | 1 | proj/bug/bugManage.js |
| 8 | projBugTF | getProjBugInfoDetail | 1 | proj/bug/bugDetail.js |
| 9 | projBugTF | queryBugInfoList | 2 | proj/bug/addBug.js |
| 10 | projBugTF | queryLogList | 1 | proj/bug/bugDetail.js |
| 11 | projBugTF | queryProjBugInfoPage | 3 | proj/bug/bugDetail.js |
| 12 | projBugTF | transBugToTask | 1 | proj/bug/bugManage.js |
| 13 | projBugTF | updateBugInfoByField | 3 | proj/bug/bugDetail.js |
| 14 | projIterationTF | addIterationInfo | 1 | pt/proj/projManageMain.vue |
| 15 | projIterationTF | delIterationInfo | 1 | pt/proj/projManageMain.vue |
| 16 | projIterationTF | queryProjIterationInfoList | 10 | proj/bug/addBug.js |
| 17 | projIterationTF | queryProjIterationRelItemInfoPage | 1 | proj/iteration/iterationManage.js |
| 18 | projIterationTF | updateIterationInfoByField | 1 | pt/proj/projManageMain.vue |
| 19 | projRequirementTF | addRequirementFile | 1 | proj/requirement/requirementDetail.js |
| 20 | projRequirementTF | addRequirementInfo | 1 | proj/requirement/addRequirement.js |
| 21 | projRequirementTF | confirmRequirementInfo | 1 | proj/requirement/requirementManage.js |
| 22 | projRequirementTF | delRequirementFile | 1 | proj/requirement/requirementDetail.js |
| 23 | projRequirementTF | delRequirementInfo | 1 | proj/requirement/requirementManage.js |
| 24 | projRequirementTF | getRequirementInfoDetail | 2 | proj/requirement/requirementDetail.js |
| 25 | projRequirementTF | queryLogList | 1 | proj/requirement/requirementDetail.js |
| 26 | projRequirementTF | queryRequirementInfoList | 2 | proj/task/addTask.js |
| 27 | projRequirementTF | queryRequirementPage | 1 | proj/requirement/requirementManage.js |
| 28 | projRequirementTF | updateRequirementInfoByField | 2 | proj/requirement/requirementDetail.js |
| 29 | projTaskTF | addProjTaskInfo | 1 | proj/task/addTask.js |
| 30 | projTaskTF | addTaskFile | 1 | proj/task/taskDetail.js |
| 31 | projTaskTF | delTaskFile | 1 | proj/task/taskDetail.js |
| 32 | projTaskTF | delTaskInfo | 1 | proj/task/taskManage.js |
| 33 | projTaskTF | getProjTaskInfoDetail | 1 | proj/task/taskDetail.js |
| 34 | projTaskTF | queryLogList | 1 | proj/task/taskDetail.js |
| 35 | projTaskTF | queryProjTaskInfoPage | 3 | proj/requirement/requirementDetail.js |
| 36 | projTaskTF | queryTaskInfoList | 4 | proj/bug/addBug.js |
| 37 | projTaskTF | transTaskToBug | 1 | proj/task/taskManage.js |
| 38 | projTaskTF | updateTaskInfoByField | 3 | proj/requirement/requirementDetail.js |
| 39 | regionOrgTF | getOrgInfoList | 2 | proj/requirement/addRequirement.js |
| 40 | userTF | getRelSubsidiary | 2 | proj/requirement/addRequirement.js |
| 41 | userTF | loadCurrentOrgUserList | 2 | proj/requirement/addRequirement.js |
| 42 | userTF | loadDevDeptOrgUserList | 5 | proj/bug/addBug.js |

### pt/purchase

共 90 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | assetTF | autoGenerateAssetFeeDetails | 1 | purchase/asset/saveAssetInfo.js |
| 2 | assetTF | deleteAssetInfo | 1 | purchase/asset/assetInfoManage.js |
| 3 | assetTF | discontinueAssetInfo | 1 | purchase/asset/saveAssetInfo.js |
| 4 | assetTF | getAssetDepreciation | 1 | purchase/asset/saveAssetInfo.js |
| 5 | assetTF | getAssetDepreciationDetailInfo | 1 | purchase/asset/assetDepreciationDetail.js |
| 6 | assetTF | getAssetFeeDetailInfo | 1 | purchase/asset/assetFeeDetail.js |
| 7 | assetTF | getAssetInfo | 1 | purchase/asset/saveAssetInfo.js |
| 8 | assetTF | getAssetSubClassData | 3 | purchase/asset/assetInfoManage.js |
| 9 | assetTF | loadOpLog | 1 | purchase/asset/assetInfoOpLog.js |
| 10 | assetTF | queryAssetDepreciationDetailPage | 1 | purchase/asset/assetDepreciationManage.js |
| 11 | assetTF | queryAssetFeeDetailPage | 1 | purchase/asset/assetFeeManage.js |
| 12 | assetTF | queryAssetFeeSumPage | 1 | purchase/asset/assetFeeSumManage.js |
| 13 | assetTF | queryAssetInfoPage | 1 | purchase/asset/assetInfoManage.js |
| 14 | assetTF | returnBorrowAsset | 1 | purchase/asset/assetInfoManage.js |
| 15 | assetTF | saveAssetInfo | 1 | purchase/asset/saveAssetInfo.js |
| 16 | assetTF | verifyAssetInfo | 1 | purchase/asset/saveAssetInfo.js |
| 17 | bankTF | queryBankInfoBytenantId | 2 | purchase/feeInfo/purFeeInfo.js |
| 18 | commonTF | getBillDate | 1 | purchase/purOrder/purchaseOrderInWarehouse.js |
| 19 | commonTF | getRemindEmails | 1 | purchase/allot/allotManage.js |
| 20 | commonTF | getSysCfgByCfgName | 1 | purchase/feeApply/addFeeApply.js |
| 21 | commonTF | getSysStaticData | 18 | purchase/allot/allotManage.js |
| 22 | commonTF | getSysStaticDataByCodeTypes | 4 | purchase/asset/assetDepreciationManage.js |
| 23 | contractService | queryContractList | 3 | purchase/asset/saveAssetInfo.js |
| 24 | deviceBaseService | queryDeviceInfoList | 1 | purchase/feeInfo/purFeeInfo.js |
| 25 | deviceContractService | queryContractDeviceDtlList | 1 | purchase/purOrder/addPurOrder.js |
| 26 | deviceContractService | queryContractTenant | 5 | purchase/allot/allotManage.js |
| 27 | deviceContractService | queryDeviceContractList | 1 | purchase/asset/saveAssetInfo.js |
| 28 | devPurchaseOrderService | queryDeliveryWorkId | 10 | purchase/allot/allotManage.js |
| 29 | purBranchCfgService | loadPurchaseBranchCfgByBranchTypeOrderDefault | 1 | purchase/feeApply/processSet.js |
| 30 | purBranchCfgService | saveOrUpdateBranchCfg | 1 | purchase/feeApply/processSet.js |
| 31 | purFeeApplyTF | delPurFeeApplyInfo | 1 | purchase/feeApply/feeApplyManage.js |
| 32 | purFeeApplyTF | getPurFeeApplyInfo | 3 | purchase/feeApply/addFeeApply.js |
| 33 | purFeeApplyTF | loadPurFeeApplyData | 3 | purchase/allot/allotManage.js |
| 34 | purFeeApplyTF | loadPurFeeApplyDtlData | 1 | purchase/purOrder/addPurOrder.js |
| 35 | purFeeApplyTF | queryPurFeeApplyInfoPage | 1 | purchase/feeApply/feeApplyManage.js |
| 36 | purFeeApplyTF | savePurFeeApplyInfo | 1 | purchase/feeApply/addFeeApply.js |
| 37 | purFeeApplyTF | verifyInfo | 1 | purchase/feeApply/examFeeApply.js |
| 38 | purFeeApplyTF | writeOffFeeApply | 1 | purchase/feeApply/writeOffFeeApply.js |
| 39 | purFeeBaseService | deletePurFeeById | 1 | purchase/feeInfo/feeInfoManage.js |
| 40 | purFeeBaseService | getSysStaticDataForSpecify | 1 | purchase/feeApply/addFeeApply.js |
| 41 | purFeeBaseService | loadPurFeeById | 1 | purchase/feeInfo/purFeeInfo.js |
| 42 | purFeeBaseService | queryAllPurFeeList | 1 | purchase/asset/saveAssetInfo.js |
| 43 | purFeeBaseService | queryPurFeeList | 1 | purchase/feeApply/addFeeApply.js |
| 44 | purFeeBaseService | queryPurFeePage | 1 | purchase/feeInfo/feeInfoManage.js |
| 45 | purFeeBaseService | saveOrUpdatePurFee | 1 | purchase/feeInfo/purFeeInfo.js |
| 46 | purPayPlanTF | getPurPayPlanInfo | 1 | purchase/paymentPlan/paymentPlanDetail.js |
| 47 | purPayPlanTF | queryPurPayPlanInfoCostSumDetailPage | 1 | purchase/costSum/costSumDetailManage.js |
| 48 | purPayPlanTF | queryPurPayPlanInfoCostSumPage | 1 | purchase/costSum/costSumManage.js |
| 49 | purPayPlanTF | queryPurPayPlanInfoGroupFeeType | 1 | purchase/paymentPlan/paymentPlanSummaryFee.js |
| 50 | purPayPlanTF | queryPurPayPlanInfoGroupFeeTypePage | 1 | purchase/paymentPlan/paymentPlanSummaryFee.js |
| 51 | purPayPlanTF | queryPurPayPlanInfoGroupOrg | 1 | purchase/paymentPlan/paymentPlanSummaryWork.js |
| 52 | purPayPlanTF | queryPurPayPlanInfoGroupOrgPage | 1 | purchase/paymentPlan/paymentPlanSummaryWork.js |
| 53 | purPayPlanTF | queryPurPayPlanInfoPage | 1 | purchase/paymentPlan/paymentPlanManage.js |
| 54 | purPurchaseOrderDeliveryService | loadPurPurchaseOrderDeliveryById | 1 | purchase/inOrder/inOrderDetail.js |
| 55 | purPurchaseOrderDeliveryService | queryPurInStockPage | 1 | purchase/inOrder/purchaseInOrderManage.js |
| 56 | purPurchaseOrderDeliveryService | queryPurOutStockPage | 1 | purchase/outOrder/purchaseOutOrderManage.js |
| 57 | purPurchaseOrderDeliveryService | savePurPurchaseOrderDelivery | 1 | purchase/purOrder/purchaseOrderInWarehouse.js |
| 58 | purPurchaseOrderDeliveryService | savePurPurchaseOrderDeliveryConfirm | 1 | purchase/inOrder/purchaseInOrderManage.js |
| 59 | purPurchaseService | cancelVerifyPurPurchase | 1 | purchase/purOrder/purchaseOrderManage.js |
| 60 | purPurchaseService | deletePurPurchaseById | 1 | purchase/purOrder/purchaseOrderManage.js |
| 61 | purPurchaseService | loadPurPurchaseById | 3 | purchase/purOrder/addPurOrder.js |
| 62 | purPurchaseService | queryPurPurchaseDtlPage | 1 | purchase/purOrder/purchaseOrderDtlManage.js |
| 63 | purPurchaseService | queryPurPurchaseList | 1 | purchase/asset/saveAssetInfo.js |
| 64 | purPurchaseService | queryPurPurchasePage | 1 | purchase/purOrder/purchaseOrderManage.js |
| 65 | purPurchaseService | saveOrUpdatePurPurchase | 1 | purchase/purOrder/addPurOrder.js |
| 66 | purPurchaseService | savePurPurchaseFile | 1 | purchase/purOrder/purchaseOrderManage.js |
| 67 | purPurchaseService | verifyPurPurchase | 1 | purchase/purOrder/addPurOrder.js |
| 68 | purStockService | deleteConsuming | 1 | purchase/consuming/consumingManage.js |
| 69 | purStockService | deletePurAllocatById | 1 | purchase/allot/allotManage.js |
| 70 | purStockService | loadPurPurchaseOutById | 1 | purchase/outOrder/outOrderDetail.js |
| 71 | purStockService | loadPurStockById | 1 | purchase/inventory/inventoryDetail.js |
| 72 | purStockService | queryPurAllocatePage | 1 | purchase/allot/allotManage.js |
| 73 | purStockService | queryPurConsumingListByAssetId | 1 | purchase/asset/assetConsumingDetail.js |
| 74 | purStockService | queryPurConsumingPage | 1 | purchase/consuming/consumingManage.js |
| 75 | purStockService | queryPurStockPage | 1 | purchase/inventory/inventoryManage.js |
| 76 | purStockService | saveAllotReturn | 1 | purchase/allot/allotManage.js |
| 77 | purStockService | saveConsuming | 1 | purchase/asset/assetInfoManage.js |
| 78 | purStockService | saveConsumingBack | 1 | purchase/consuming/consumingManage.js |
| 79 | purStockService | savePurAllocate | 2 | purchase/asset/assetInfoManage.js |
| 80 | purStockService | updatePurAllocate | 1 | purchase/allot/allotManage.js |
| 81 | purStockService | verifyConsuming | 1 | purchase/consuming/consumingManage.js |
| 82 | purStockService | verifyPurAllocat | 1 | purchase/allot/allotManage.js |
| 83 | regionOrgTF | getOrgInfoList | 16 | purchase/allot/allotManage.js |
| 84 | regionOrgTF | getStaffInfoList | 2 | purchase/asset/assetInfoManage.js |
| 85 | regionOrgTF | queryStaffData | 1 | purchase/allot/allotManage.js |
| 86 | shShareholderTF | getShareholderStaffs | 1 | purchase/feeApply/processSet.js |
| 87 | supplierTF | queryAllSupplierList | 7 | purchase/asset/assetDepreciationManage.js |
| 88 | userTF | getRelSubsidiary | 1 | purchase/feeApply/addFeeApply.js |
| 89 | userTF | loadAllUser | 2 | purchase/feeApply/processSet.js |
| 90 | userTF | loadCurrentOrgUserList | 2 | purchase/feeApply/addFeeApply.js |

### pt/res

共 202 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | bankTF | cancleBankInfo | 1 | pt/res/bankManage.js |
| 2 | bankTF | queryBankInfoById | 1 | pt/res/bankManage.js |
| 3 | bankTF | queryBankManageData | 1 | pt/res/bankManage.js |
| 4 | bankTF | saveBankInfo | 1 | pt/res/bankManage.js |
| 5 | bizAuthInfoTF | updateAuditState | 2 | pt/res/driverInfo.js |
| 6 | commonTF | getSysStaticData | 26 | pt/res/addStoreHouseSale.js |
| 7 | commonTF | getSysStaticDataByCodeTypes | 22 | pt/res/driverInfo.js |
| 8 | commonTF | querySysStaticDataHeads | 1 | res/ownVehicleCost/vehicleFixedCostManage.js |
| 9 | contractService | queryCustomerContractList | 1 | pt/res/addStoreHouseSale.js |
| 10 | contractService | queryStorageEquipmentContractList | 4 | res/equipment/storeEquipmentInfo.js |
| 11 | customerTF | loadCustomerList | 4 | pt/res/addStoreHouseSale.js |
| 12 | customerTF | queryCustomerListNoPage | 7 | res/quote/addQuoteInfoLD.js |
| 13 | driverAssessmentService | deleteDriverAssessmentById | 1 | res/ownVehicle/driverAssessmentManage.js |
| 14 | driverAssessmentService | queryDriverAssessmentInfoById | 1 | res/ownVehicle/driverAssessmentInfo.js |
| 15 | driverAssessmentService | queryDriverAssessmentPage | 1 | res/ownVehicle/driverAssessmentManage.js |
| 16 | driverAssessmentService | saveOrUpdateDriverAssessment | 1 | res/ownVehicle/driverAssessmentInfo.js |
| 17 | driverTF | delDriver | 1 | res/ownVehicle/ownDriverManage.js |
| 18 | driverTF | getDriverPassword | 1 | pt/res/driverManage.js |
| 19 | driverTF | getDrivingLicenseOcrData | 2 | pt/res/driverInfo.js |
| 20 | driverTF | getIdCardOcrData | 3 | pt/res/driverInfo.js |
| 21 | driverTF | loadDriverByIdCard | 1 | res/ownVehicle/ownDriverInfo.js |
| 22 | driverTF | queryAllDriverList | 4 | res/ownVehicle/driverAssessmentInfo.js |
| 23 | driverTF | queryDriverInfoById | 2 | pt/res/driverInfo.js |
| 24 | driverTF | queryDriverInfoList | 1 | pt/res/driverManage.js |
| 25 | driverTF | queryOwnDriverInfoList | 1 | res/ownVehicle/ownDriverManage.js |
| 26 | driverTF | resignForDriver | 1 | res/ownVehicle/ownDriverManage.js |
| 27 | driverTF | saveDriverProcess | 2 | pt/res/driverInfo.js |
| 28 | driverTF | syncDriver | 1 | pt/res/driverManage.js |
| 29 | driverTF | updateDriverState | 2 | pt/res/driverManage.js |
| 30 | equipmentTF | addEquipmentInfo | 1 | pt/res/equipmentInfoManage.js |
| 31 | equipmentTF | bandEquipment | 1 | pt/res/equipmentInfoManage.js |
| 32 | equipmentTF | cancleBandEquipment | 1 | pt/res/equipmentInfoManage.js |
| 33 | equipmentTF | checkBandPlateNumber | 1 | pt/res/equipmentInfoManage.js |
| 34 | equipmentTF | checkOpenLockStateByEquipmentNumber | 1 | pt/res/equipmentInfoManage.js |
| 35 | equipmentTF | delEquipmentInfo | 1 | pt/res/equipmentInfoManage.js |
| 36 | equipmentTF | getGpsEquipmentList | 1 | pt/res/vehicleManage.js |
| 37 | equipmentTF | queryEquipmentByNumberData | 1 | pt/res/equipmentInfoManage.js |
| 38 | equipmentTF | queryEquipmentData | 1 | pt/res/equipmentInfoManage.js |
| 39 | equipmentTF | queryEquipmentInfoById | 1 | pt/res/equipmentInfoManage.js |
| 40 | equipmentTF | queryLockLog | 1 | pt/res/equipmentInfoManage.js |
| 41 | equipmentTF | queryVehicleEquipment | 2 | res/ownVehicle/ownVehicleManage.js |
| 42 | equipmentTF | remoteOpenLockByEquipmentNumber | 1 | pt/res/equipmentInfoManage.js |
| 43 | equipmentTF | remoteOpenSubLockByLockId | 1 | pt/res/equipmentInfoManage.js |
| 44 | equipmentTF | saveLockIP | 1 | pt/res/equipmentInfoManage.js |
| 45 | equipmentTF | saveSubLockName | 1 | pt/res/equipmentInfoManage.js |
| 46 | equipmentTF | saveVehicleEquipment | 2 | res/ownVehicle/ownVehicleManage.js |
| 47 | equipmentTF | sellEquipment | 1 | pt/res/equipmentInfoManage.js |
| 48 | fcPersonnelCostTF | delFcPersonnelCostInfo | 1 | res/ownVehicleCost/staffCostManage.js |
| 49 | fcPersonnelCostTF | queryDriverOrSupercargoList | 1 | res/ownVehicleCost/staffCostManage.js |
| 50 | fcPersonnelCostTF | queryFcPersonnelCostPage | 1 | res/ownVehicleCost/staffCostManage.js |
| 51 | fcPersonnelCostTF | queryFcPersonnelCostShare | 1 | res/ownVehicleCost/staffCostManage.js |
| 52 | fcPersonnelCostTF | saveFcPersonnelCostInfo | 1 | res/ownVehicleCost/staffCostManage.js |
| 53 | fcPersonnelCostTF | verifyFcPersonnelCostInfo | 1 | res/ownVehicleCost/staffCostManage.js |
| 54 | JT70TF | addRfidCardDirect | 1 | pt/res/equipmentInfoManage.js |
| 55 | JT70TF | delRfidCardDirect | 1 | pt/res/equipmentInfoManage.js |
| 56 | JT70TF | qryRfidCard | 1 | pt/res/equipmentInfoManage.js |
| 57 | JT70TF | qryRfidCardDirect | 1 | pt/res/equipmentInfoManage.js |
| 58 | monitorTF | getAllGpsInfoList | 1 | pt/res/vehicleMonitorTrack.js |
| 59 | monitorTF | vehicleMonitor | 2 | pt/res/vehicleMonitor.js |
| 60 | monitorTF | vehicleMonitorSaaS | 1 | pt/res/vehicleMonitorSaaS.js |
| 61 | orderTF | getWorkListDistance | 1 | res/sectionQuote/commonSectionQuote.js |
| 62 | quoteLDNewTF | delQuoteInfo | 1 | res/quote/quoteManageLD.js |
| 63 | quoteLDNewTF | queryLDQuoteData | 2 | res/quote/quoteManageLD.js |
| 64 | quoteLDNewTF | queryQuoteInfoById | 2 | res/quote/addQuoteInfoLD.js |
| 65 | quoteLDNewTF | upQuoteInfo | 1 | res/quote/upQuoteInfoLD.js |
| 66 | quoteLDNewTF | verifyQuote | 1 | res/quote/quoteManageVerifyLD.js |
| 67 | quoteService | deleteWmsQuoteByQuoteId | 1 | res/quote/supplierWMSQuoteManage.js |
| 68 | quoteService | loadWmsQuoteDataByQuoteId | 2 | res/quote/addSupplierWMSQuote.js |
| 69 | quoteService | queryWmsQuotePage | 1 | res/quote/supplierWMSQuoteManage.js |
| 70 | quoteService | saveCmSectionQuoteBase | 1 | res/quote/addSupplierWMSQuote.js |
| 71 | quoteService | verifyWmsQuote | 1 | res/quote/supplierWMSQuoteManage.js |
| 72 | quoteTF | addQuoteInfo | 1 | quote/old/addSupplierQuoteLD.js |
| 73 | quoteTF | cancleQuoteInfo | 1 | quote/old/supplierQuoteManageLD.js |
| 74 | quoteTF | changeZCQuoteSts | 1 | quote/old/supplierQuoteManageZC.js |
| 75 | quoteTF | deleteZCQuote | 1 | quote/old/supplierQuoteManageZC.js |
| 76 | quoteTF | queryLDQuoteById | 1 | quote/old/upSupplierQuoteLD.js |
| 77 | quoteTF | queryLDQuoteData | 1 | quote/old/supplierQuoteManageLD.js |
| 78 | quoteTF | querySuplierZCQuoteData | 1 | quote/old/supplierQuoteManageZC.js |
| 79 | quoteTF | saveZCQuote | 1 | quote/old/addSupplierQuoteZC.js |
| 80 | quoteTF | updateZCQuote | 1 | quote/old/supplierQuoteManageZC.js |
| 81 | quoteTF | upQuoteInfo | 1 | quote/old/upSupplierQuoteLD.js |
| 82 | resVehicleInfoTF | getRoadTransportCertificate | 3 | res/ownVehicle/ownTrailerInfo.js |
| 83 | resVehicleInfoTF | getVehicleLicenseInfo | 3 | res/ownVehicle/ownTrailerInfo.js |
| 84 | resVehicleInfoTF | getVehicleLicenseInfoBack | 3 | res/ownVehicle/ownTrailerInfo.js |
| 85 | resVehicleInfoTF | loadVehicleInfoById | 2 | res/ownVehicle/ownTrailerRecord.js |
| 86 | resVehicleInfoTF | queryAllVehicleNoPage | 9 | pt/res/equipmentInfoManage.js |
| 87 | resVehicleInfoTF | queryOwnVehicleInfoListByCond | 2 | res/ownVehicle/ownTrailerManage.js |
| 88 | resVehicleInfoTF | queryVehicleInfoById | 3 | res/ownVehicle/ownTrailerInfo.js |
| 89 | resVehicleInfoTF | queryVehicleInfoListByCond | 1 | pt/res/vehicleManage.js |
| 90 | resVehicleInfoTF | queryVehicleNoGpsInfoList | 1 | pt/res/vehicleNoGpsManage.js |
| 91 | resVehicleInfoTF | saveVehicleInfo | 3 | res/ownVehicle/ownTrailerInfo.js |
| 92 | resVehicleInfoTF | syncVehicleInfo | 1 | pt/res/vehicleManage.js |
| 93 | resVehicleInfoTF | updateVehicleState | 3 | res/ownVehicle/ownTrailerManage.js |
| 94 | routeTF | loadGoodsByRouteId | 1 | res/sectionQuote/commonSectionQuote.js |
| 95 | routeTF | loadRouteSelectByTenantId | 1 | res/sectionQuote/commonSectionQuote.js |
| 96 | routeTF | loadWorkByRouteId | 1 | res/sectionQuote/commonSectionQuote.js |
| 97 | sectionQuoteService | audit | 1 | res/sectionQuote/sectionQuoteDetail.js |
| 98 | sectionQuoteService | batchSectionQuote | 1 | res/sectionQuote/batchSectionQuote.js |
| 99 | sectionQuoteService | deleteSectionQuoteById | 1 | res/sectionQuote/sectionQuoteManage.js |
| 100 | sectionQuoteService | generateSupplierQuote | 1 | res/sectionQuote/generateSectionQuote.js |
| 101 | sectionQuoteService | initiateAudit | 1 | res/sectionQuote/sectionQuoteDetail.js |
| 102 | sectionQuoteService | loadSectionQuoteById | 1 | res/sectionQuote/updateSectionQuote.js |
| 103 | sectionQuoteService | loadSectionQuoteDataById | 3 | res/sectionQuote/batchSectionQuote.js |
| 104 | sectionQuoteService | queryBidCountBySectionQuoteId | 1 | res/sectionQuote/sectionQuoteManage.js |
| 105 | sectionQuoteService | querySectionQuotePage | 1 | res/sectionQuote/sectionQuoteManage.js |
| 106 | sectionQuoteService | saveOrUpdateSectionQuote | 2 | res/sectionQuote/addSectionQuote.js |
| 107 | selectStaticDataTF | getCityId | 2 | res/quote/addQuoteInfoLD.js |
| 108 | selectStaticDataTF | getDistrictId | 2 | res/quote/addQuoteInfoLD.js |
| 109 | selectStaticDataTF | getProvinceId | 2 | res/quote/addQuoteInfoLD.js |
| 110 | selectStaticDataTF | selectCity | 3 | res/quote/addQuoteInfoLD.js |
| 111 | selectStaticDataTF | selectDistrict | 3 | res/quote/addQuoteInfoLD.js |
| 112 | selectStaticDataTF | selectProvince | 3 | res/quote/addQuoteInfoLD.js |
| 113 | sinoiovBusinessTF | queryVehicle | 1 | pt/res/equipmentInfoManage.js |
| 114 | sinoiovBusinessTF | queryVehiclePositionPage | 1 | pt/res/vehiclePositionManage.js |
| 115 | storeHouseBizTF | queryCmStoreHouseSaleRelById | 2 | pt/res/addStoreHouseSale.js |
| 116 | storeHouseBizTF | queryCmStoreHouseSaleRelPage | 1 | pt/res/storeHouseSaleManage.js |
| 117 | storeHouseBizTF | queryStoreHouseList | 13 | res/equipment/storeEquipmentInfo.js |
| 118 | storeHouseBizTF | queryStoreHouseSaleDetailPage | 1 | res/workContract/workContractInfo.js |
| 119 | storeHouseBizTF | renewal | 1 | pt/res/storeHouseSaleManage.js |
| 120 | storeHouseBizTF | saveCmStoreHouseSaleRel | 1 | pt/res/addStoreHouseSale.js |
| 121 | storeHouseBizTF | updateStateToInvalid | 1 | pt/res/storeHouseSaleManage.js |
| 122 | supercargoService | deleteSupercargoById | 1 | res/ownVehicle/supercargoManage.js |
| 123 | supercargoService | querySupercargoInfoById | 1 | res/ownVehicle/supercargoInfo.js |
| 124 | supercargoService | querySupercargoPage | 1 | res/ownVehicle/supercargoManage.js |
| 125 | supercargoService | resignForSupercargo | 1 | res/ownVehicle/supercargoManage.js |
| 126 | supercargoService | saveOrUpdateSupercargo | 1 | res/ownVehicle/supercargoInfo.js |
| 127 | supplierTF | getSupplierSelectData | 2 | pt/res/driverInfo.js |
| 128 | supplierTF | queryAllSupplierList | 34 | pt/res/bankManage.js |
| 129 | tenantTF | getHzTenantList | 1 | pt/res/storeHouseSaleManage.js |
| 130 | vehicleAnnualInspectionTF | deleteVehicleAnnualInspectionInfo | 1 | res/ownVehicleCost/vehicleAnnualInspectionManage.js |
| 131 | vehicleAnnualInspectionTF | getVehicleAnnualInspectionInfo | 1 | res/ownVehicleCost/vehicleAnnualInspectionInfo.js |
| 132 | vehicleAnnualInspectionTF | queryVehicleAnnualInspectionPage | 1 | res/ownVehicleCost/vehicleAnnualInspectionManage.js |
| 133 | vehicleAnnualInspectionTF | saveVehicleAnnualInspectionInfo | 1 | res/ownVehicleCost/vehicleAnnualInspectionInfo.js |
| 134 | vehicleAnnualInspectionTF | verifyVehicleAnnualInspectionById | 1 | res/ownVehicleCost/vehicleAnnualInspectionInfo.js |
| 135 | vehicleBenefitAccountingService | getOwnVehicleBenefitAccountingInfo | 1 | res/ownVehicleCost/ownVehicleBenefitAccountingPrint.js |
| 136 | vehicleBenefitAccountingService | getOwnVehicleStatisticInfo | 1 | res/ownVehicle/ownVehicleStatistics.js |
| 137 | vehicleBenefitAccountingService | queryOwnVehicleFatigueDrivingPage | 1 | res/ownVehicle/ownVehicleStatistics.js |
| 138 | vehicleBenefitAccountingService | queryOwnVehicleFinishWaybillRankList | 1 | res/ownVehicle/ownVehicleStatistics.js |
| 139 | vehicleBenefitAccountingService | queryOwnVehicleOfflinePage | 1 | res/ownVehicle/ownVehicleStatistics.js |
| 140 | vehicleBenefitAccountingService | queryVehicleBenefitAccountingPage | 1 | res/ownVehicleCost/ownVehicleBenefitAccounting.js |
| 141 | vehicleFixedCostService | deleteVehicleFixedCostById | 1 | res/ownVehicleCost/vehicleFixedCostManage.js |
| 142 | vehicleFixedCostService | queryVehicleFixedCostInfoById | 1 | res/ownVehicleCost/vehicleFixedCostInfo.js |
| 143 | vehicleFixedCostService | queryVehicleFixedCostPage | 1 | res/ownVehicleCost/vehicleFixedCostManage.js |
| 144 | vehicleFixedCostService | saveOrUpdateVehicleFixedCost | 1 | res/ownVehicleCost/vehicleFixedCostInfo.js |
| 145 | vehicleFixedCostService | verifyVehicleFixedCostById | 1 | res/ownVehicleCost/vehicleFixedCostInfo.js |
| 146 | vehicleMileageService | loadVehicleMileageSumData | 1 | res/ownVehicle/ownVehicleStatistics.js |
| 147 | vehicleMileageService | queryVehicleMileagePage | 1 | res/ownVehicle/ownVehicleMileage.js |
| 148 | vehicleMileageService | updateVehicleMileageInfo | 1 | res/ownVehicle/ownVehicleMileage.js |
| 149 | vehicleRepairCostService | deleteVehicleRepairCostById | 1 | res/ownVehicleCost/vehicleRepairCostManage.js |
| 150 | vehicleRepairCostService | queryVehicleRepairCostInfoById | 1 | res/ownVehicleCost/vehicleRepairCostInfo.js |
| 151 | vehicleRepairCostService | queryVehicleRepairCostPage | 1 | res/ownVehicleCost/vehicleRepairCostManage.js |
| 152 | vehicleRepairCostService | recognizeReceiptNumber | 1 | res/ownVehicleCost/vehicleRepairCostInfo.js |
| 153 | vehicleRepairCostService | saveOrUpdateVehicleRepairCost | 1 | res/ownVehicleCost/vehicleRepairCostInfo.js |
| 154 | vehicleRepairCostService | verifyVehicleRepairCostById | 1 | res/ownVehicleCost/vehicleRepairCostInfo.js |
| 155 | vehicleScheduleService | queryVehicleScheduleData | 2 | pt/res/vehicleScheduleHistoryManage.js |
| 156 | vehicleScheduleService | queryVehicleSchedulePage | 2 | pt/res/vehicleScheduleHistoryManage.js |
| 157 | vehicleWaybillCostService | deleteVehicleWaybillCostById | 1 | res/ownVehicleCost/vehicleWaybillCostManage.js |
| 158 | vehicleWaybillCostService | queryVehicleWaybillCostInfoById | 1 | res/ownVehicleCost/vehicleWaybillCostInfo.js |
| 159 | vehicleWaybillCostService | queryVehicleWaybillCostPage | 1 | res/ownVehicleCost/vehicleWaybillCostManage.js |
| 160 | vehicleWaybillCostService | recognizeReceiptNumber | 1 | res/ownVehicleCost/vehicleWaybillCostInfo.js |
| 161 | vehicleWaybillCostService | saveOrUpdateVehicleWaybillCost | 1 | res/ownVehicleCost/vehicleWaybillCostInfo.js |
| 162 | vehicleWaybillCostService | verifyVehicleWaybillCostById | 1 | res/ownVehicleCost/vehicleWaybillCostInfo.js |
| 163 | vehicleWorkService | deleteVehicleWork | 1 | pt/res/vehicleWorkManage.js |
| 164 | vehicleWorkService | loadVehicleWorkRecordInfoById | 1 | pt/res/vehicleWorkMonitor.js |
| 165 | vehicleWorkService | queryVehicleWorkPage | 1 | pt/res/vehicleWorkManage.js |
| 166 | vehicleWorkService | queryVehicleWorkRecordPage | 1 | pt/res/vehicleWorkRecordManage.js |
| 167 | vehicleWorkService | saveOrUpdateVehicleWork | 1 | pt/res/vehicleWorkManage.js |
| 168 | wmsEquipmentPurchaseService | deleteEquipmentPurchase | 1 | res/equipment/storeEquipmentManage.js |
| 169 | wmsEquipmentPurchaseService | loadWmsEquipmentPurchaseInfo | 1 | res/equipment/storeEquipmentInfo.js |
| 170 | wmsEquipmentPurchaseService | queryWmsEquipmentPurchasePage | 1 | res/equipment/storeEquipmentManage.js |
| 171 | wmsEquipmentPurchaseService | saveOrUpdateWmsEquipmentPurchase | 1 | res/equipment/storeEquipmentInfo.js |
| 172 | wmsFeeItemService | queryFeeItemList | 1 | res/workContract/workContractInfo.js |
| 173 | wmsQuoteSheetTF | queryAllFeeItems | 1 | pt/res/addStoreHouseSale.js |
| 174 | wmsQuoteSheetTF | queryAllQuoteSheets | 2 | pt/res/addStoreHouseSale.js |
| 175 | wmsQuoteSheetTF | queryQuoteSheetDetailById | 1 | pt/res/addStoreHouseSale.js |
| 176 | wmsStorehouseTF | autoGenerateStorehouseFeeDetails | 1 | res/wmsStorehouse/saveStorehouseFee.js |
| 177 | wmsStorehouseTF | delStorehouseFee | 1 | res/wmsStorehouse/wmsStoreHouseFeeManage.js |
| 178 | wmsStorehouseTF | getStorehouseFee | 1 | res/wmsStorehouse/saveStorehouseFee.js |
| 179 | wmsStorehouseTF | getStorehouseFeeDetail | 1 | res/wmsStorehouse/wmsStorehouseFeeDetail.js |
| 180 | wmsStorehouseTF | queryStorehouseFeeDetailPage | 1 | res/wmsStorehouse/wmsStoreHouseFeeDetailManage.js |
| 181 | wmsStorehouseTF | queryStorehouseFeePage | 1 | res/wmsStorehouse/wmsStoreHouseFeeManage.js |
| 182 | wmsStorehouseTF | saveStorehouseFee | 1 | res/wmsStorehouse/saveStorehouseFee.js |
| 183 | wmsStorehouseTF | verifyStorehouseFee | 1 | res/wmsStorehouse/saveStorehouseFee.js |
| 184 | workContractService | deleteWorkContractById | 1 | pt/res/supplierWmsWorkContractManage.js |
| 185 | workContractService | loadWorkContractById | 1 | res/workContract/workContractInfo.js |
| 186 | workContractService | queryWorkContractDetailPage | 1 | res/workContract/supplierWmsWorkContractDetailManage.js |
| 187 | workContractService | queryWorkContractHead | 1 | res/workContract/supplierWmsWorkContractDetailManage.js |
| 188 | workContractService | queryWorkContractPage | 1 | pt/res/supplierWmsWorkContractManage.js |
| 189 | workContractService | saveOrUpdateWorkContract | 1 | res/workContract/workContractInfo.js |
| 190 | workContractService | verifyWorkContractById | 1 | pt/res/supplierWmsWorkContractManage.js |
| 191 | workGoodsTF | addWorkInfo | 2 | res/quote/addQuoteInfoLD.js |
| 192 | workGoodsTF | checkWorkDistance | 2 | res/quote/addQuoteInfoLD.js |
| 193 | workGoodsTF | queryGoodsDataByTenantId | 4 | res/quote/addQuoteInfoLD.js |
| 194 | workGoodsTF | queryWorkDataSelect | 7 | res/quote/addQuoteInfoLD.js |
| 195 | workGoodsTF | queryWorkStorehouseData | 1 | quote/old/addSupplierQuoteLD.js |
| 196 | workGoodsTF | queryWorkStorehouseDataNoPage | 1 | quote/old/addSupplierQuoteLD.js |
| 197 | ZCQuoteNewTF | deleteQuoteByQuoteId | 1 | res/quote/supplierZCQuoteManage.js |
| 198 | ZCQuoteNewTF | loadQuoteDataByQuoteId | 5 | res/quote/addSupplierZCQuote.js |
| 199 | ZCQuoteNewTF | queryQuote | 2 | res/quote/supplierZCQuoteManage.js |
| 200 | ZCQuoteNewTF | saveCmSectionQuoteData | 1 | res/quote/addSupplierZCQuote.js |
| 201 | ZCQuoteNewTF | updateQuoteExpireDate | 1 | res/quote/supplierZCQuoteManage.js |
| 202 | ZCQuoteNewTF | verifyQuote | 1 | res/quote/supplierZCQuoteVerify.js |

### pt/rpt

共 21 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | commonTF | getSysStaticData | 7 | rpt/feeReport/meetDetailReport.js |
| 2 | customerTF | queryCustomerListNoPage | 4 | rpt/base/budgetManage.js |
| 3 | rptBudgetInfoTF | addModifyRptBudgetInfoDetail | 1 | rpt/base/budgetManage.js |
| 4 | rptBudgetInfoTF | queryRptBudgetInfoDetail | 1 | rpt/base/budgetManage.js |
| 5 | rptBudgetInfoTF | queryRptBudgetInfoPage | 1 | rpt/base/budgetManage.js |
| 6 | rptCustOperationTF | queryOperationBudgetDiffCustPage | 1 | rpt/operationBudgetDiff/diffCustReport.js |
| 7 | rptCustOperationTF | queryOperationBudgetDiffMonthPage | 1 | rpt/operationBudgetDiff/diffMonthReport.js |
| 8 | rptCustOperationTF | queryRptCustOperationInfoPage | 1 | rpt/custOperation/custOperationReport.js |
| 9 | rptFeeReportTF | getHeader | 1 | rpt/feeReport/overdueFeeDetailReport.js |
| 10 | rptFeeReportTF | getMeetHeader | 1 | rpt/feeReport/meetOverdueFeeDetailReport.js |
| 11 | rptFeeReportTF | queryMeetDetailReportData | 1 | rpt/feeReport/meetDetailReport.js |
| 12 | rptFeeReportTF | queryMeetOverdueFeeDetailReportPage | 1 | rpt/feeReport/meetOverdueFeeDetailReport.js |
| 13 | rptFeeReportTF | queryMeetTotalReportData | 1 | rpt/feeReport/meetTotalReport.js |
| 14 | rptFeeReportTF | queryOverdueFeeDetailReportPage | 1 | rpt/feeReport/overdueFeeDetailReport.js |
| 15 | rptFeeReportTF | queryReceivableDetailReportPage | 1 | rpt/feeReport/receivableDetailReport.js |
| 16 | rptFeeReportTF | queryReceivableTotalReportPage | 1 | rpt/feeReport/receivableTotalReport.js |
| 17 | transportReportTF | loadCustomerOperationDetailPage | 1 | rpt/transportReport/customerOperationDetail.js |
| 18 | transportReportTF | loadCustomerOperationSummaryPage | 1 | rpt/transportReport/customerOperationSummary.js |
| 19 | transportReportTF | loadOrderOperationReportPage | 1 | rpt/transportReport/orderOperationReport.js |
| 20 | transportReportTF | loadSupplierOperationDetailPage | 1 | rpt/transportReport/supplierOperationDetail.js |
| 21 | transportReportTF | loadSupplierOperationSummaryPage | 1 | rpt/transportReport/supplierOperationSummary.js |

### pt/sp

共 35 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | commonTF | getSysStaticData | 3 | pt/sp/addSupplier.js |
| 2 | selectStaticDataTF | getCityId | 1 | pt/sp/supplierAddressManage.js |
| 3 | selectStaticDataTF | getDistrictId | 1 | pt/sp/supplierAddressManage.js |
| 4 | selectStaticDataTF | getProvinceId | 1 | pt/sp/supplierAddressManage.js |
| 5 | selectStaticDataTF | selectCity | 1 | pt/sp/supplierAddressManage.js |
| 6 | selectStaticDataTF | selectDistrict | 1 | pt/sp/supplierAddressManage.js |
| 7 | selectStaticDataTF | selectProvince | 1 | pt/sp/supplierAddressManage.js |
| 8 | storeHouseBizTF | queryStoreHouseList | 2 | pt/sp/addSupplier.js |
| 9 | supplierTF | addSupplierDriverRel | 1 | sp/subpage/supplierDriver.js |
| 10 | supplierTF | addSupplierVehicleRel | 1 | sp/subpage/supplierVehicle.js |
| 11 | supplierTF | delSupplierDriverRel | 1 | sp/subpage/supplierDriver.js |
| 12 | supplierTF | delSupplierVehicleRel | 1 | sp/subpage/supplierVehicle.js |
| 13 | supplierTF | getBusinessLicenseInfo | 1 | pt/sp/addSupplier.js |
| 14 | supplierTF | getSupplierDetailInfo | 2 | pt/sp/showSupplier.js |
| 15 | supplierTF | loadStorehouseSupplierDataByTenantId | 1 | pt/sp/storehouseSupplierDetail.js |
| 16 | supplierTF | loadStorehouseSupplierSpecifyDayDataByTenantId | 1 | pt/sp/storehouseSupplierDetail.js |
| 17 | supplierTF | loadSupplierDataByTenantId | 1 | pt/sp/supplierDetail.js |
| 18 | supplierTF | loadSupplierSpecifyDayDataByTenantId | 1 | pt/sp/supplierDetail.js |
| 19 | supplierTF | queryAllSupplierList | 1 | pt/sp/supplierAddressManage.js |
| 20 | supplierTF | queryDriverInfoListNoRelByCond | 1 | sp/subpage/supplierDriver.js |
| 21 | supplierTF | querySupplierDriverInfoListByCond | 1 | sp/subpage/supplierDriver.js |
| 22 | supplierTF | querySupplierList | 2 | pt/sp/storehouseSupplierManage.js |
| 23 | supplierTF | querySupplierVehicleInfoListByCond | 1 | sp/subpage/supplierVehicle.js |
| 24 | supplierTF | queryVehicleInfoListNoRelByCond | 1 | sp/subpage/supplierVehicle.js |
| 25 | supplierTF | updateSupplierDataById | 1 | pt/sp/storehouseSupplierManage.js |
| 26 | supplierTF | updateSupplierState | 1 | pt/sp/supplierManage.js |
| 27 | supplierTF | verifySupplier | 1 | pt/sp/updateSupplier.js |
| 28 | userTF | getUserName | 1 | pt/sp/addSupplier.js |
| 29 | workGoodsTF | addWorkInfo | 1 | pt/sp/supplierAddressManage.js |
| 30 | workGoodsTF | delWorkInfo | 1 | pt/sp/supplierAddressManage.js |
| 31 | workGoodsTF | queryAllSupplierWorkData | 1 | pt/sp/supplierAddressManage.js |
| 32 | workOrderService | loadRecentHalfAYearWorkOrderBarData | 1 | pt/sp/storehouseSupplierDetail.js |
| 33 | workOrderService | loadRecentHalfAYearWorkOrderFeeItemTypeLineData | 1 | pt/sp/storehouseSupplierDetail.js |
| 34 | workOrderService | loadRecentHalfAYearWorkOrderFeeLineData | 1 | pt/sp/storehouseSupplierDetail.js |
| 35 | workOrderService | loadRecentHalfAYearWorkOrderPieData | 1 | pt/sp/storehouseSupplierDetail.js |

### pt/wms

共 303 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | assetTF | queryWmsEquipmentPurchaseList | 1 | inspect/inspectAssign/addInspectAssign.js |
| 2 | commonTF | getSysStaticData | 40 | allocat/qrcode/qrcodeManage.js |
| 3 | commonTF | getSysStaticDataByCodeTypes | 13 | wms/base/wmsConsignorTenantManage.js |
| 4 | customerTF | loadCustomerList | 3 | wms/quoteSheet/quoteSheetCommon.js |
| 5 | customerTF | queryCustomerListNoPage | 1 | wms/base/wmsConsignorTenantManage.js |
| 6 | deviceBaseService | delDeviceInfo | 1 | wms/device/outDeviceManage.js |
| 7 | deviceBaseService | queryDeviceInfoList | 8 | base/packMaterial/wmsPackMaterialRegister.js |
| 8 | deviceBaseService | queryDeviceInfoPage | 1 | wms/device/outDeviceManage.js |
| 9 | deviceBaseService | saveDeviceInfo | 1 | wms/device/outDeviceManage.js |
| 10 | deviceContractService | queryCustWorkInfo | 2 | wms/device/outDeviceClearUp.js |
| 11 | deviceRecordService | getDeviceRecoveryCostList | 1 | base/packMaterial/wmsPackMaterialRegister.js |
| 12 | deviceRecordService | getDeviceRecoveryFeeList | 1 | base/packMaterial/wmsPackMaterialRegister.js |
| 13 | deviceRecordService | loadDeviceRecordById | 3 | wms/device/outDeviceClearUp.js |
| 14 | deviceRecordService | saveOrUpdateDevRecord | 1 | base/packMaterial/wmsPackMaterialRegister.js |
| 15 | deviceRecordService | saveOrUpdateOutDeviceRecord | 1 | wms/device/outDeviceRegister.js |
| 16 | driverTF | selDriverInfoListByCond | 2 | wms/base/wmsVehicleManage.js |
| 17 | quoteService | matchCost | 1 | wms/waybill/wmsWaybill.js |
| 18 | regionOrgTF | getOrgInfoList | 2 | wms/fee/fixPersonCostManage.js |
| 19 | regionOrgTF | queryStaffData | 1 | wms/sensor/sensorInfoManage.js |
| 20 | resMonitorDeviceTF | queryMonitorPage | 1 | wms/monitor/deviceMonitorManage.js |
| 21 | resMonitorDeviceTF | toSyncMonitorName | 1 | wms/monitor/deviceMonitorManage.js |
| 22 | resMonitorDeviceTF | updateMonitorName | 1 | wms/monitor/deviceMonitorManage.js |
| 23 | resVehicleInfoTF | selVehicleInfoListByCond | 2 | wms/base/wmsVehicleManage.js |
| 24 | selectStaticDataTF | getCityId | 1 | wms/base/wmsArrivalManufacturerTenantManage.js |
| 25 | selectStaticDataTF | getDistrictId | 1 | wms/base/wmsArrivalManufacturerTenantManage.js |
| 26 | selectStaticDataTF | getProvinceId | 1 | wms/base/wmsArrivalManufacturerTenantManage.js |
| 27 | selectStaticDataTF | selectDistrict | 1 | wms/base/wmsArrivalManufacturerTenantManage.js |
| 28 | sensorTF | deleteSensorInfo | 1 | wms/sensor/sensorInfoManage.js |
| 29 | sensorTF | getBasicSettingsInfo | 1 | wms/sensor/sensorInfoManage.js |
| 30 | sensorTF | getSensorAcctInfo | 1 | wms/sensor/sensorInfoManage.js |
| 31 | sensorTF | getSensorDataReport | 2 | wms/sensor/humitureLogPrintFd.js |
| 32 | sensorTF | querySensorDataPage | 1 | wms/sensor/sensorDataInfoManage.js |
| 33 | sensorTF | querySensorPage | 1 | wms/sensor/sensorInfoManage.js |
| 34 | sensorTF | saveSensorAcctInfo | 1 | wms/sensor/sensorInfoManage.js |
| 35 | sensorTF | saveSensorInfo | 1 | wms/sensor/sensorInfoManage.js |
| 36 | stockDeviceService | queryDeviceStockPage | 3 | wms/base/wmsPackMaterialManage.js |
| 37 | stockDeviceService | queryDeviceStockPageForInventory | 1 | inventory/device/deviceInventoryManage.js |
| 38 | stockDeviceService | queryDeviceStockPageForInventoryLog | 1 | inventory/device/deviceInventoryManageLog.js |
| 39 | stockDeviceService | saveDeviceInventory | 1 | inventory/device/deviceInventoryManage.js |
| 40 | storeHouseBizTF | queryStoreHouseList | 18 | wms/appoint/appointManage.js |
| 41 | supplierTF | queryAllSupplierList | 11 | base/packMaterial/wmsPackMaterialRegister.js |
| 42 | sysLogTF | querySysLogPage | 1 | pt/wms/sysLogInfoManage.js |
| 43 | userTF | loadCurrentOrgUserList | 1 | inventory/stock/addStockInventory.js |
| 44 | userTF | loadWorkUserList | 1 | inspect/inspectAssign/addInspectAssign.js |
| 45 | wmsAllocatTF | freeze | 1 | wms/allocat/stockStorageManage.js |
| 46 | wmsAllocatTF | loadAllocatInfo | 1 | wms/allocat/printAllocatOrder.js |
| 47 | wmsAllocatTF | queryAllocatMaterialPage | 1 | wms/allocat/wmsAllocatMaterialManage.js |
| 48 | wmsAllocatTF | queryAllocatUsableMaterialList | 2 | wms/allocat/wmsAllocatMaterialManage.js |
| 49 | wmsAllocatTF | queryMaterialListForOutOrder | 1 | wms/ord/outOrderConfirm.js |
| 50 | wmsAllocatTF | saveAllocat | 1 | wms/allocat/wmsAllocatMaterialManage.js |
| 51 | wmsAllocatTF | saveAllocatNew | 1 | wms/allocat/stockStorageManage.js |
| 52 | wmsAllocatTF | unfreeze | 1 | wms/allocat/stockStorageManage.js |
| 53 | wmsAppointTF | cancelWmsAppoint | 1 | wms/appoint/appointManage.js |
| 54 | wmsAppointTF | queryWmsAppointInfoList | 1 | wms/ord/addOrUpdateInOrder.js |
| 55 | wmsAppointTF | queryWmsAppointInfoPage | 2 | wms/appoint/appointManage.js |
| 56 | wmsAppointTF | updateWmsAppointFromTenantName | 1 | wms/appoint/appointManage.js |
| 57 | wmsAppointTF | updateWmsAppointInfoState | 1 | wms/appoint/appointManage.js |
| 58 | wmsAppointTF | wmsAppointInfoCheckInByStaff | 1 | wms/appoint/appointManage.js |
| 59 | wmsBaseTF | getAllWorkStore | 5 | wms/inventory/inventoryCfgManage.js |
| 60 | wmsBaseTF | getWorkStoreChildByWorkId | 3 | wms/board/appointmentBoard.js |
| 61 | wmsBaseTF | queryHomeCollectData | 3 | wms/base/wmsConsignorTenantCenter.js |
| 62 | wmsBaseTF | queryHomeInStokeData | 3 | wms/base/wmsConsignorTenantCenter.js |
| 63 | wmsBaseTF | queryHomeOutStokeData | 3 | wms/base/wmsConsignorTenantCenter.js |
| 64 | wmsBaseTF | queryOutMaterialData | 2 | wms/base/wmsConsignorTenantCenter.js |
| 65 | wmsBaseTF | queryOutMaterialDataByCondition | 2 | wms/board/warehousingCenterBoard.js |
| 66 | wmsBaseTF | queryStockMaterialData | 2 | wms/base/wmsConsignorTenantCenter.js |
| 67 | wmsBaseTF | selWork | 1 | pt/wms/selectWork.js |
| 68 | wmsCostService | deleteFeeCostOperate | 1 | wms/fee/feeOpManage.js |
| 69 | wmsCostService | queryWmsFeeCostOperateById | 1 | wms/fee/printFeeOp.js |
| 70 | wmsCostService | queryWmsFeeCostOperatePage | 1 | wms/fee/feeOpManage.js |
| 71 | wmsCostService | saveOrUpdateFeeCostOperate | 1 | wms/fee/feeOpManage.js |
| 72 | wmsCostService | uploadCredentialFile | 1 | wms/fee/feeOpManage.js |
| 73 | wmsCustAppointTF | queryWmsAppointInfoPage | 1 | wms/appoint/custAppointManage.js |
| 74 | wmsCustAppointTF | updateWmsAppointInfoState | 1 | wms/appoint/custAppointManage.js |
| 75 | wmsDeliveryNoticeTF | getWmsEmailFetchConfig | 1 | pt/wms/deliveryNoticeManage.js |
| 76 | wmsDeliveryNoticeTF | processWmsDeliveryNotice | 1 | pt/wms/deliveryNoticeManage.js |
| 77 | wmsDeliveryNoticeTF | queryWmsDeliveryNoticePage | 1 | pt/wms/deliveryNoticeManage.js |
| 78 | wmsDeliveryNoticeTF | saveWmsEmailFetchConfig | 1 | pt/wms/deliveryNoticeManage.js |
| 79 | wmsFeeItemService | deleteFeeItem | 1 | wms/base/wmsFeeItemManage.js |
| 80 | wmsFeeItemService | loadFeeItemList | 1 | wms/base/wmsFeeItemManage.js |
| 81 | wmsFeeItemService | queryFeeItemPage | 1 | wms/base/wmsFeeItemManage.js |
| 82 | wmsFeeItemService | saveOrUpdateFeeItem | 1 | wms/base/wmsFeeItemManage.js |
| 83 | wmsFeeItemService | verifyFeeItem | 1 | wms/base/wmsFeeItemManage.js |
| 84 | wmsInOrderTF | addOrUpdateInOrder | 3 | wms/ord/addOrUpdateInOrder.js |
| 85 | wmsInOrderTF | addPrintTimes | 1 | wms/ord/printInOrder.js |
| 86 | wmsInOrderTF | checkFeeConfirm | 1 | wms/ord/inOrderManage.js |
| 87 | wmsInOrderTF | checkNewQrcode | 1 | wms/ord/inOrderManage.js |
| 88 | wmsInOrderTF | delInOrder | 1 | wms/ord/inOrderManage.js |
| 89 | wmsInOrderTF | feeConfirm | 1 | wms/ord/inOrderFeeConfirm.js |
| 90 | wmsInOrderTF | inOrderDeal | 1 | wms/ord/inOrderConfirm.js |
| 91 | wmsInOrderTF | inOrderModify | 1 | wms/ord/inOrderModify.js |
| 92 | wmsInOrderTF | loadStockQrcodeByCondition | 1 | wms/ord/printTagCode.js |
| 93 | wmsInOrderTF | queryCustQrcodeList | 6 | wms/ord/inOrderConfirm.js |
| 94 | wmsInOrderTF | queryInOrderDtlPage | 1 | wms/ord/inOrderDtlManage.js |
| 95 | wmsInOrderTF | queryInOrderPage | 1 | wms/ord/inOrderManage.js |
| 96 | wmsInOrderTF | queryStockQrcodeList | 6 | wms/ord/inOrderConfirm.js |
| 97 | wmsInOrderTF | queryWmsInOrderInfoForConfirm | 1 | wms/ord/inOrderConfirm.js |
| 98 | wmsInOrderTF | queryWmsInOrderInfoForPrint | 1 | wms/ord/printInOrder.js |
| 99 | wmsInOrderTF | queryWmsInOrderInfoForUpdate | 1 | wms/ord/addOrUpdateInOrder.js |
| 100 | wmsInOrderTF | queryWmsInOrderInfoForView | 4 | wms/ord/inOrderDetail.js |
| 101 | wmsInOrderTF | queryWmsMaterialInfoList | 1 | wms/ord/addOrUpdateInOrder.js |
| 102 | wmsInOrderTF | updateInOrderMaterial | 1 | wms/ord/inOrderDetailUpdate.js |
| 103 | wmsInOrderTF | updateInOrderState | 1 | wms/ord/inOrderManage.js |
| 104 | wmsInspectionAppointService | deleteWmsInspectionAppointById | 1 | inspect/inspectAssign/inspectAssignManage.js |
| 105 | wmsInspectionAppointService | loadWmsInspectionAppointDataById | 2 | inspect/inspectAssign/addInspectAssign.js |
| 106 | wmsInspectionAppointService | loadWmsInspectionAppointDtlListDataByAppointId | 1 | inspect/inspectAssign/inspectionPrintCode.js |
| 107 | wmsInspectionAppointService | queryWmsInspectionAppointPage | 1 | inspect/inspectAssign/inspectAssignManage.js |
| 108 | wmsInspectionAppointService | saveOrUpdateWmsInspectionAppoint | 1 | inspect/inspectAssign/addInspectAssign.js |
| 109 | wmsInspectionExceptionRecordService | deleteWmsInspectionExceptionRecordById | 1 | inspect/inspectReg/inspectRegGoods.js |
| 110 | wmsInspectionExceptionRecordService | loadWmsInspectionExceptionRecordDataById | 1 | inspect/inspectReg/addInspectRegGoods.js |
| 111 | wmsInspectionExceptionRecordService | queryWmsInspectionExceptionRecordPage | 1 | inspect/inspectReg/inspectRegGoods.js |
| 112 | wmsInspectionExceptionRecordService | saveOrUpdateWmsInspectionExceptionRecord | 1 | inspect/inspectReg/addInspectRegGoods.js |
| 113 | wmsInspectionIncomeRecordService | deleteWmsInspectionIncomeRecordById | 1 | inspect/inspectReg/inspectRegIncome.js |
| 114 | wmsInspectionIncomeRecordService | loadWmsInspectionIncomeRecordDataById | 1 | inspect/inspectReg/addInspectRegIncome.js |
| 115 | wmsInspectionIncomeRecordService | queryWmsInspectionIncomeRecordPage | 1 | inspect/inspectReg/inspectRegIncome.js |
| 116 | wmsInspectionIncomeRecordService | saveOrUpdateWmsInspectionIncomeRecord | 1 | inspect/inspectReg/addInspectRegIncome.js |
| 117 | wmsInspectionStandardService | deleteWmsInspectionStandardById | 1 | inspect/inspectNorm/inspectNormManage.js |
| 118 | wmsInspectionStandardService | loadWmsInspectionStandardDataById | 2 | inspect/inspectNorm/addInspectNorm.js |
| 119 | wmsInspectionStandardService | queryWmsInspectionStandardList | 2 | inspect/inspectAssign/addInspectAssign.js |
| 120 | wmsInspectionStandardService | queryWmsInspectionStandardPage | 1 | inspect/inspectNorm/inspectNormManage.js |
| 121 | wmsInspectionStandardService | saveOrUpdateWmsInspectionStandard | 1 | inspect/inspectNorm/addInspectNorm.js |
| 122 | wmsInspectionSummaryService | loadWmsInspectionSummaryDataById | 1 | inspect/inspectSummary/inspectSummaryDetail.js |
| 123 | wmsInspectionSummaryService | queryWmsInspectionSummaryPage | 1 | inspect/inspectSummary/inspectSummaryManage.js |
| 124 | wmsInspectionTaskService | loadWmsInspectionTaskDataById | 2 | inspect/inspectTask/doneInspectTask.js |
| 125 | wmsInspectionTaskService | queryWmsInspectionTaskPage | 1 | inspect/inspectTask/inspectTaskManage.js |
| 126 | wmsInspectionTaskService | queryWmsInspectionTaskStatisticsDtl | 1 | inspect/inspectSummary/inspectionDetail.js |
| 127 | wmsInspectionTaskService | queryWmsInspectionTaskStatisticsPage | 1 | inspect/inspectSummary/inspectStatisticsManageByMonth.js |
| 128 | wmsInspectionTaskService | queryWmsInspectionTaskStatisticsYearDtl | 1 | inspect/inspectSummary/inspectionDetail2.js |
| 129 | wmsInspectionTaskService | queryWmsInspectionTaskStatisticsYearPage | 1 | inspect/inspectSummary/inspectStatisticsManageByYear.js |
| 130 | wmsInspectionTaskService | saveOrUpdateWmsInspectionTask | 1 | inspect/inspectTask/doneInspectTask.js |
| 131 | wmsInteriorMaterialTF | deleteInteriorMaterial | 1 | wms/base/wmsInteriorMaterialBaseManage.js |
| 132 | wmsInteriorMaterialTF | interiorMaterialRegister | 1 | wms/base/wmsInteriorMaterialManage.js |
| 133 | wmsInteriorMaterialTF | queryInteriorMaterialBaseList | 1 | wms/base/wmsInteriorMaterialManage.js |
| 134 | wmsInteriorMaterialTF | queryInteriorMaterialBasePage | 1 | wms/base/wmsInteriorMaterialBaseManage.js |
| 135 | wmsInteriorMaterialTF | queryInteriorMaterialLogPage | 1 | wms/base/wmsInteriorMaterialLogManage.js |
| 136 | wmsInteriorMaterialTF | queryInteriorMaterialPage | 1 | wms/base/wmsInteriorMaterialManage.js |
| 137 | wmsInteriorMaterialTF | saveOrUpdateInteriorMaterial | 1 | wms/base/wmsInteriorMaterialBaseManage.js |
| 138 | wmsInventoryTF | delWmsInventory | 1 | wms/inventory/inventoryManage.js |
| 139 | wmsInventoryTF | delWmsInventoryCfg | 1 | wms/inventory/inventoryCfgManage.js |
| 140 | wmsInventoryTF | qryWmsInventory | 2 | wms/inventory/allInventoryManage.js |
| 141 | wmsInventoryTF | qryWmsInventoryCfg | 1 | wms/inventory/inventoryCfgManage.js |
| 142 | wmsInventoryTF | qryWmsInventoryCfgForAdd | 1 | wms/inventory/inventoryManage.js |
| 143 | wmsInventoryTF | qryWmsInventoryCfgPage | 1 | wms/inventory/inventoryCfgManage.js |
| 144 | wmsInventoryTF | qryWmsInventoryPage | 2 | wms/inventory/allInventoryManage.js |
| 145 | wmsMaterialPickTF | batchNumBatchModfiy | 1 | wms/allocat/stockStorageManage.js |
| 146 | wmsMaterialPickTF | batchNumModfiy | 1 | wms/allocat/stockStorageManage.js |
| 147 | wmsMaterialPickTF | delMaterialInfo | 1 | wms/base/materialInfoManage.js |
| 148 | wmsMaterialPickTF | delPickTactice | 1 | wms/base/pickTacticsInfoManage.js |
| 149 | wmsMaterialPickTF | produceDateModfiy | 1 | wms/allocat/stockStorageManage.js |
| 150 | wmsMaterialPickTF | queryMaterialInfoById | 1 | wms/base/materialInfoManage.js |
| 151 | wmsMaterialPickTF | queryMaterialPage | 2 | wms/base/materialInfoManage.js |
| 152 | wmsMaterialPickTF | queryPickTacticeById | 1 | wms/base/pickTacticsInfoManage.js |
| 153 | wmsMaterialPickTF | queryPickTacticsPage | 1 | wms/base/pickTacticsInfoManage.js |
| 154 | wmsMaterialPickTF | querySpecsTypeDataList | 1 | wms/base/materialInfoManage.js |
| 155 | wmsMaterialPickTF | queryStockDtlPage | 1 | wms/allocat/stockDtlManage.js |
| 156 | wmsMaterialPickTF | queryStockDtlSummaryPage | 1 | wms/allocat/stockDtlSummaryManage.js |
| 157 | wmsMaterialPickTF | queryStockMaterialPage | 1 | wms/allocat/stockMaterialManage.js |
| 158 | wmsMaterialPickTF | queryStockStorageList | 1 | wms/ord/addOrUpdateOutOrder.js |
| 159 | wmsMaterialPickTF | queryStockStoragePage | 1 | wms/allocat/stockStorageManage.js |
| 160 | wmsMaterialPickTF | queryStockStorageSelPage | 1 | wms/ord/addOrUpdateOutOrder.js |
| 161 | wmsMaterialPickTF | saveMaterial | 1 | wms/base/materialInfoManage.js |
| 162 | wmsMaterialPickTF | savePickTactics | 1 | wms/base/pickTacticsInfoManage.js |
| 163 | wmsMaterialPickTF | saveSapStockNums | 1 | wms/allocat/stockStorageManage.js |
| 164 | wmsOutOrderTF | addOrUpdateOutOrder | 1 | wms/ord/addOrUpdateOutOrder.js |
| 165 | wmsOutOrderTF | addPrintTimes | 1 | wms/ord/printOutOrder.js |
| 166 | wmsOutOrderTF | checkFeeConfirm | 1 | wms/ord/outOrderManage.js |
| 167 | wmsOutOrderTF | checkWmsStockQrcodeScanState | 1 | wms/ord/outOrderManage.js |
| 168 | wmsOutOrderTF | checkWmsStockQrcodeSplitState | 1 | wms/ord/outOrderManage.js |
| 169 | wmsOutOrderTF | delOutOrder | 1 | wms/ord/outOrderManage.js |
| 170 | wmsOutOrderTF | feeConfirm | 1 | wms/ord/outOrderFeeConfirm.js |
| 171 | wmsOutOrderTF | getOutCostList | 2 | wms/ord/outOrderConfirm.js |
| 172 | wmsOutOrderTF | getOutSaleFeeList | 2 | wms/ord/outOrderConfirm.js |
| 173 | wmsOutOrderTF | loadOutOrderSortingMaterialData | 1 | wms/ord/outOrderConfirm.js |
| 174 | wmsOutOrderTF | outOrderAllocat | 1 | wms/ord/outOrderConfirm.js |
| 175 | wmsOutOrderTF | outOrderDeal | 1 | wms/ord/outOrderConfirm.js |
| 176 | wmsOutOrderTF | queryOutOrderDtlPage | 1 | wms/ord/outOrderDtlManage.js |
| 177 | wmsOutOrderTF | queryOutOrderKanbanPage | 1 | wms/board/todayPlanBoard.js |
| 178 | wmsOutOrderTF | queryOutOrderPage | 1 | wms/ord/outOrderManage.js |
| 179 | wmsOutOrderTF | queryStockListForTactics | 1 | wms/ord/outOrderConfirm.js |
| 180 | wmsOutOrderTF | queryWmsOutOrderInfoForPrint | 1 | wms/ord/printOutOrder.js |
| 181 | wmsOutOrderTF | queryWmsOutOrderInfoForUpdate | 1 | wms/ord/addOrUpdateOutOrder.js |
| 182 | wmsOutOrderTF | queryWmsOutOrderInfoForView | 3 | wms/ord/outOrderConfirm.js |
| 183 | wmsOutOrderTF | queryWmsWaybillKanbanPage | 1 | wms/board/deliveryBoard.js |
| 184 | wmsOutOrderTF | sureAllocat | 1 | wms/ord/outOrderConfirm.js |
| 185 | wmsPackMaterialTF | deletePackMaterial | 1 | wms/base/wmsPackMaterialBaseManage.js |
| 186 | wmsPackMaterialTF | deletePackMaterialChange | 1 | base/packMaterial/wmsPackMaterialRegisterChangeManage.js |
| 187 | wmsPackMaterialTF | deletePackMaterialRecord | 1 | base/packMaterial/wmsPackMaterialRecordManage.js |
| 188 | wmsPackMaterialTF | loadPackMaterialRegisterByRecordId | 1 | base/packMaterial/wmsPackMaterialChange.js |
| 189 | wmsPackMaterialTF | queryPackMaterialBaseList | 1 | wms/ord/outOrderManage.js |
| 190 | wmsPackMaterialTF | queryPackMaterialBasePage | 1 | wms/base/wmsPackMaterialBaseManage.js |
| 191 | wmsPackMaterialTF | queryPackMaterialChangePage | 1 | base/packMaterial/wmsPackMaterialRegisterChangeManage.js |
| 192 | wmsPackMaterialTF | queryPackMaterialRecordPage | 1 | base/packMaterial/wmsPackMaterialRecordManage.js |
| 193 | wmsPackMaterialTF | saveOrUpdatePackMaterial | 1 | wms/base/wmsPackMaterialBaseManage.js |
| 194 | wmsPackMaterialTF | savePackMaterialChange | 1 | base/packMaterial/wmsPackMaterialChange.js |
| 195 | wmsPackMaterialTF | verifyPackMaterialChange | 1 | base/packMaterial/wmsPackMaterialRegisterChangeManage.js |
| 196 | wmsPersonCostService | deleteWmsPersonCost | 2 | wms/fee/fixPersonCostManage.js |
| 197 | wmsPersonCostService | queryFixWmsPersonCostPage | 1 | wms/fee/fixPersonCostManage.js |
| 198 | wmsPersonCostService | queryLaborWmsPersonCostPage | 1 | wms/fee/personServiceCostManage.js |
| 199 | wmsPersonCostService | saveOrUpdateWmsFixPersonCost | 1 | wms/fee/fixPersonCostManage.js |
| 200 | wmsPersonCostService | saveOrUpdateWmsServicePersonCost | 1 | wms/fee/personServiceCostManage.js |
| 201 | wmsQrcodeTF | delQrcode | 1 | wms/ord/preQrcodeManage.js |
| 202 | wmsQrcodeTF | generateQrcode | 1 | wms/ord/preQrcodeManage.js |
| 203 | wmsQrcodeTF | queryQrcodeList | 1 | wms/ord/preCodePrintView.js |
| 204 | wmsQrcodeTF | queryQrcodePage | 1 | wms/ord/preQrcodeManage.js |
| 205 | wmsQuoteSheetTF | addQuoteSheet | 1 | wms/quoteSheet/quoteSheetCommon.js |
| 206 | wmsQuoteSheetTF | cancelConfirmQuoteSheet | 1 | wms/quoteSheet/wmsQuoteSheetManage.js |
| 207 | wmsQuoteSheetTF | confirmQuoteSheet | 1 | wms/quoteSheet/wmsQuoteSheetManage.js |
| 208 | wmsQuoteSheetTF | delQuoteSheet | 1 | wms/quoteSheet/wmsQuoteSheetManage.js |
| 209 | wmsQuoteSheetTF | getCostWithTax | 1 | wms/quoteSheet/quoteSheetCommon.js |
| 210 | wmsQuoteSheetTF | modifyQuoteSheet | 1 | wms/quoteSheet/quoteSheetCommon.js |
| 211 | wmsQuoteSheetTF | queryAllFeeItems | 1 | wms/quoteSheet/addQuoteSheet.js |
| 212 | wmsQuoteSheetTF | queryFeeItems | 1 | wms/quoteSheet/quoteSheetCommon.js |
| 213 | wmsQuoteSheetTF | queryQuoteSheet | 2 | wms/quoteSheet/addQuoteSheet.js |
| 214 | wmsQuoteSheetTF | queryQuoteSheetCustomerHisByTenantId | 1 | wms/quoteSheet/quoteSheetCommon.js |
| 215 | wmsQuoteSheetTF | queryQuoteSheetHead | 1 | wms/quoteSheet/wmsQuoteSheetRptManage.js |
| 216 | wmsQuoteSheetTF | queryQuoteSheetPage | 1 | wms/quoteSheet/wmsQuoteSheetManage.js |
| 217 | wmsQuoteSheetTF | queryQuoteSheetRptPage | 1 | wms/quoteSheet/wmsQuoteSheetRptManage.js |
| 218 | wmsQuoteSheetTF | verifyQuoteSheet | 1 | wms/quoteSheet/wmsQuoteSheetManage.js |
| 219 | wmsReceiptsService | cancelSureWmsReceipts | 1 | wms/receipts/receiptsManage.js |
| 220 | wmsReceiptsService | deleteWmsReceipts | 1 | wms/receipts/receiptsManage.js |
| 221 | wmsReceiptsService | queryWmsReceiptsPage | 1 | wms/receipts/receiptsManage.js |
| 222 | wmsReceiptsService | saveOrUpdateWmsReceipts | 1 | wms/receipts/receiptsManage.js |
| 223 | wmsReceiptsService | sureWmsReceipts | 1 | wms/receipts/receiptsManage.js |
| 224 | wmsReservoirTF | delReservoirInfo | 1 | wms/base/reservoirInfoManage.js |
| 225 | wmsReservoirTF | delStorageInfo | 1 | wms/base/storageInfoManage.js |
| 226 | wmsReservoirTF | getReservoirDataSel | 5 | wms/allocat/stockStorageManage.js |
| 227 | wmsReservoirTF | queryBlankStorageList | 1 | wms/ord/inOrderConfirm.js |
| 228 | wmsReservoirTF | queryReservoirInfoById | 1 | wms/base/reservoirInfoManage.js |
| 229 | wmsReservoirTF | queryReservoirPage | 1 | wms/base/reservoirInfoManage.js |
| 230 | wmsReservoirTF | queryStorageInfoById | 1 | wms/base/storageInfoManage.js |
| 231 | wmsReservoirTF | queryStorageListByReservoirId | 3 | wms/allocat/stockStorageManage.js |
| 232 | wmsReservoirTF | queryStoragePage | 1 | wms/base/storageInfoManage.js |
| 233 | wmsReservoirTF | saveReservoir | 1 | wms/base/reservoirInfoManage.js |
| 234 | wmsReservoirTF | saveStorage | 1 | wms/base/storageInfoManage.js |
| 235 | wmsScanCodeCheckDensoTF | queryScanCodeCheckInfoPage | 1 | wms/ord/scanCodeDensoCheckManage.js |
| 236 | wmsScanCodeCheckTF | queryScanCodeCheckInfoPage | 1 | wms/ord/scanCodeCheckManage.js |
| 237 | wmsStockInventoryService | deleteWmsStockInventory | 1 | inventory/stock/stockInventoryManage.js |
| 238 | wmsStockInventoryService | inventoryWmsStock | 1 | inventory/stock/addStockInventory.js |
| 239 | wmsStockInventoryService | loadWmsStockInventoryById | 2 | inventory/stock/addStockInventory.js |
| 240 | wmsStockInventoryService | queryWmsStockInventoryPage | 1 | inventory/stock/stockInventoryManage.js |
| 241 | wmsStockInventoryService | saveOrUpdateWmsStockInventory | 1 | inventory/stock/addStockInventory.js |
| 242 | wmsStockInventoryService | verifyWmsStockInventory | 1 | inventory/stock/stockInventoryManage.js |
| 243 | wmsStockMaterialTF | batchGenerateBar | 1 | allocat/qrcode/batchGenerateBar.js |
| 244 | wmsStockMaterialTF | custQrcodeModify | 1 | allocat/qrcode/viewCustQrcodeBars.js |
| 245 | wmsStockMaterialTF | generateBar | 1 | allocat/qrcode/generateBar.js |
| 246 | wmsStockMaterialTF | getCustQrcodeInfo | 1 | allocat/qrcode/viewCustQrcodeBars.js |
| 247 | wmsStockMaterialTF | getStockMaterialNewQrcodeList | 1 | wms/ord/addOrUpdateOutOrder.js |
| 248 | wmsStockMaterialTF | getStockMaterialQrcodeInfo | 1 | allocat/qrcode/viewQrcodeBars.js |
| 249 | wmsStockMaterialTF | mergeGenerateBar | 1 | allocat/qrcode/mergeGenerateBar.js |
| 250 | wmsStockMaterialTF | qrcodeModify | 2 | allocat/qrcode/qrcodeManage.js |
| 251 | wmsStockMaterialTF | queryAllocatScanQrcodePage | 1 | wms/scancodeLog/allocatScanQrcodeManage.js |
| 252 | wmsStockMaterialTF | queryOrderScanQrcodePage | 1 | wms/scancodeLog/orderScanQrcodeManage.js |
| 253 | wmsStockMaterialTF | queryStockMaterialQrcodeInfo | 1 | allocat/qrcode/codeDetail.js |
| 254 | wmsStockMaterialTF | queryStockMaterialQrcodeList | 2 | allocat/qrcode/codePrintView.js |
| 255 | wmsStockMaterialTF | queryStockMaterialQrcodePage | 1 | allocat/qrcode/qrcodeManage.js |
| 256 | wmsStockMaterialTF | queryStockStorageList | 2 | allocat/qrcode/batchGenerateBar.js |
| 257 | wmsTenantTF | deleteArrivalManufacturer | 1 | wms/base/wmsArrivalManufacturerTenantManage.js |
| 258 | wmsTenantTF | deleteConsignor | 1 | wms/base/wmsConsignorTenantManage.js |
| 259 | wmsTenantTF | loadConsignorTenantById | 1 | wms/base/wmsConsignorTenantCenter.js |
| 260 | wmsTenantTF | queryArrivalManufacturerTenantList | 9 | wms/base/materialInfoManage.js |
| 261 | wmsTenantTF | queryArrivalManufacturerTenantPage | 1 | wms/base/wmsArrivalManufacturerTenantManage.js |
| 262 | wmsTenantTF | queryConsignorTenantList | 4 | wms/base/materialInfoManage.js |
| 263 | wmsTenantTF | queryConsignorTenantPage | 1 | wms/base/wmsConsignorTenantManage.js |
| 264 | wmsTenantTF | saveOrUpdateArrivalManufacturer | 1 | wms/base/wmsArrivalManufacturerTenantManage.js |
| 265 | wmsTenantTF | saveOrUpdateConsignor | 1 | wms/base/wmsConsignorTenantManage.js |
| 266 | wmsTimeLimitTF | getWmsTimeLimitConfigInfo | 1 | wms/ord/timeLimitManage.js |
| 267 | wmsTimeLimitTF | getWmsTimeLimitInfo | 2 | wms/ord/addOrUpdateOutOrder.js |
| 268 | wmsTimeLimitTF | isTimeout | 2 | wms/ord/outOrderConfirm.js |
| 269 | wmsTimeLimitTF | queryWmsTimeLimitPage | 1 | wms/ord/timeLimitManage.js |
| 270 | wmsTimeLimitTF | queryWmsTimeLimitRemindPage | 1 | wms/ord/timeLimitRemindManage.js |
| 271 | wmsTimeLimitTF | saveWmsTimeLimitInfo | 1 | wms/ord/timeLimitManage.js |
| 272 | wmsVehicleTF | deleteWmsVehicleInfo | 1 | wms/base/wmsVehicleManage.js |
| 273 | wmsVehicleTF | queryWmsVehicleInfoPage | 1 | wms/base/wmsVehicleManage.js |
| 274 | wmsVehicleTF | saveOrUpdateWmsVehicleInfo | 1 | wms/base/wmsVehicleManage.js |
| 275 | wmsVisitService | queryWmsVisitPage | 1 | wms/visit/visitManage.js |
| 276 | wmsWarningTF | delWarning | 1 | wms/base/warningManage.js |
| 277 | wmsWarningTF | getWarningSum | 1 | pt/wms/warehousingCenter.js |
| 278 | wmsWarningTF | queryWarningPage | 1 | wms/base/warningManage.js |
| 279 | wmsWarningTF | updateWarningState | 1 | wms/base/warningManage.js |
| 280 | wmsWaybillService | deleteWmsWaybillInfoById | 1 | wms/waybill/wmsWaybillManage.js |
| 281 | wmsWaybillService | getDeliverySaleFeeList | 2 | waybill/subpage/feeInfo.js |
| 282 | wmsWaybillService | getWmsWaybillAbleCostList | 2 | waybill/subpage/costList.js |
| 283 | wmsWaybillService | loadWmsWaybillInfoByWmsWaybillId | 4 | wms/waybill/printWaybill.js |
| 284 | wmsWaybillService | loadWmsWaybillReceiptsListByWaybillId | 1 | wms/waybill/wmsWaybillManage.js |
| 285 | wmsWaybillService | queryOutOrderMaterialListPage | 1 | wms/waybill/selStock.js |
| 286 | wmsWaybillService | queryWaybillFromTenantByWaybillId | 2 | wms/receipts/receiptsManage.js |
| 287 | wmsWaybillService | queryWmsWaybillList | 2 | wms/ord/addOrUpdateInOrder.js |
| 288 | wmsWaybillService | queryWmsWaybillPage | 1 | wms/waybill/wmsWaybillManage.js |
| 289 | wmsWaybillService | saveOrUpdateWmsReceipts | 1 | wms/waybill/wmsWaybillManage.js |
| 290 | wmsWaybillService | saveOrUpdateWmsWaybill | 1 | wms/waybill/wmsWaybill.js |
| 291 | wmsWaybillService | sureWmsWaybillInfoById | 2 | wms/waybill/wmsWaybillInfo.js |
| 292 | workDetailService | queryWorkDetailListByWorkId | 1 | wms/ord/addOrUpdateOutOrder.js |
| 293 | workGoodsTF | getWorkStoreQrcode | 1 | pt/wms/warehousingCenter.js |
| 294 | workGoodsTF | getWorkStoreVisitQrcode | 1 | pt/wms/warehousingCenter.js |
| 295 | workGoodsTF | queryWorkDataSelect | 7 | base/packMaterial/wmsPackMaterialRegister.js |
| 296 | workGoodsTF | saveUseSapStockNums | 1 | pt/wms/warehousingCenter.js |
| 297 | workOrderService | confirmWorkOrderById | 1 | wms/workOrder/wmsWorkOrderManage.js |
| 298 | workOrderService | loadWorkOrderById | 1 | wms/workOrder/workOrderInfo.js |
| 299 | workOrderService | loadWorkOrderFileListById | 1 | wms/workOrder/wmsWorkOrderManage.js |
| 300 | workOrderService | loadWorkOrderMonthData | 1 | wms/workOrder/wmsWorkOrderDetail.js |
| 301 | workOrderService | queryWorkOrderGroupByPage | 1 | wms/workOrder/wmsWorkOrderSettleSumManage.js |
| 302 | workOrderService | queryWorkOrderPage | 1 | wms/workOrder/wmsWorkOrderManage.js |
| 303 | workOrderService | saveOrUpdateWorkOrderForWechat | 1 | wms/workOrder/wmsWorkOrderManage.js |

## hz

### hz/base

共 7 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | roleTF | deleteRoleInfo | 1 | auth/role/hzRoleManage.js |
| 2 | roleTF | loadRoleInfoList | 1 | auth/role/hzRoleManage.js |
| 3 | roleTF | loadRoleInfoListNoPage | 1 | usr/staff/staffManage.js |
| 4 | staffTF | delStaff | 1 | usr/staff/staffManage.js |
| 5 | staffTF | getStaff | 1 | usr/staff/staffManage.js |
| 6 | staffTF | getUserName | 1 | usr/staff/staffManage.js |
| 7 | staffTF | queryStaffs | 1 | usr/staff/staffManage.js |

### hz/baseInfo

共 1 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | customerTF | getCustomerDetailInfo | 1 | hz/baseInfo/baseInfo.js |

### hz/bigScreen

共 4 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | commonTF | getSysStaticData | 1 | hz/bigScreen/kanban.js |
| 2 | kanbanTF | loadKanbanPage | 1 | hz/bigScreen/kanban.js |
| 3 | kanbanTF | loadKanbanSum | 1 | hz/bigScreen/kanban.js |
| 4 | workGoodsTF | queryWorkDataSelect | 1 | hz/bigScreen/kanban.js |

### hz/fc

共 5 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | commonTF | getSysStaticData | 1 | fc/bill/confirmedBill.js |
| 2 | customerTF | queryCustomerData | 1 | fc/bill/unconfirmedBill.js |
| 3 | fcCustBillTF | queryCustomerBillDetailList | 1 | fc/bill/unconfirmedBill.js |
| 4 | fcCustBillTF | queryCustomerBillPage | 2 | fc/bill/confirmedBill.js |
| 5 | fcCustBillTF | sureFcCustomerBill | 1 | fc/bill/unconfirmedBill.js |

### hz/home

共 6 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | menuTF | loadMenuTree | 1 | hz/home/navMenu.js |
| 2 | userTF | loadMessageHZ | 1 | hz/home/home.js |
| 3 | userTF | logout | 1 | hz/home/home.js |
| 4 | userTF | modifyPasswordFirst | 1 | hz/home/home.js |
| 5 | userTF | smsModifyPassword | 1 | hz/home/home.js |
| 6 | userTF | webHzSendPasswordSmsValidCode | 1 | hz/home/home.js |

### hz/login

共 4 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | userTF | selTenant | 1 | hz/login/selectTenant.js |
| 2 | userTF | webHzgetShowCode | 1 | hz/login/login.js |
| 3 | userTF | webHzSendLoginSmsValidCode | 1 | hz/login/login.js |
| 4 | userTF | webHzSendPasswordSmsValidCode | 1 | hz/login/forgetPassword.js |

### hz/ord

共 10 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | commonTF | getSysStaticData | 3 | ord/order/orderManage.js |
| 2 | orderTF | batchDeleteMessage | 1 | ord/order/orderMessageManage.js |
| 3 | orderTF | batchReadMessage | 1 | ord/order/orderMessageManage.js |
| 4 | orderTF | cancelOrder | 1 | ord/order/orderManage.js |
| 5 | orderTF | loadOrderMessagePageHZ | 1 | ord/order/orderMessageManage.js |
| 6 | orderTF | queryConsignorOrderInfoList | 1 | ord/order/orderManage.js |
| 7 | orderTF | queryOrderInfo | 4 | ord/order/copyOrderHZ.js |
| 8 | orderTF | saveOrUpdateOrder | 3 | ord/order/addOrderHZ.js |
| 9 | ordWaybillTF | queryOpLogList | 1 | waybill/detail/waybillDetail.js |
| 10 | receiptsTF | queryReceiptsInfoData | 1 | ord/receipts/receiptsManage.js |

### hz/pkg

共 3 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | commonTF | getSysStaticData | 1 | pkg/business/pkgBusinessManage.js |
| 2 | pkgBusinessTF | queryPkgBusinessPage | 1 | pkg/business/pkgBusinessManage.js |
| 3 | pkgBusinessTF | queryPkgObjectPage | 1 | pkg/business/packObjectManage.js |

### hz/res

共 1 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | equipmentTF | queryEquipmentData | 1 | hz/res/equipmentInfoManage.js |

### hz/subCompany

共 6 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | commonTF | getSysStaticData | 1 | hz/subCompany/subCompanyManage.js |
| 2 | customerTF | getCustomerDetailInfo | 1 | hz/subCompany/subCompanyManage.js |
| 3 | customerTF | queryCustomerList | 1 | hz/subCompany/subCompanyManage.js |
| 4 | routeTF | loadRouteDataByTenantId | 1 | hz/subCompany/subCompanyManage.js |
| 5 | routeTF | loadRouteTenantData | 1 | hz/subCompany/subCompanyManage.js |
| 6 | routeTF | saveOrUpdateRouteTenantRel | 1 | hz/subCompany/subCompanyManage.js |

### hz/wms

共 15 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | commonTF | getSysStaticData | 3 | wms/appoint/custAppointManage.js |
| 2 | sensorTF | querySensorDataPage | 1 | wms/sensor/custSensorDataInfoManage.js |
| 3 | wmsBaseTF | getAllWorkStore | 4 | wms/allocat/stockMaterialManageHZ.js |
| 4 | wmsCustAppointTF | delWmsAppoint | 1 | wms/appoint/custAppointManage.js |
| 5 | wmsCustAppointTF | getCustRelWorkStore | 1 | wms/appoint/custAppointManage.js |
| 6 | wmsCustAppointTF | queryWmsAppointInfoPageForCust | 1 | wms/appoint/custAppointManage.js |
| 7 | wmsCustAppointTF | saveWmsAppoint | 1 | wms/appoint/custAppointManage.js |
| 8 | wmsInOrderTF | queryInOrderDtlPage | 1 | wms/ord/inOrderDtlManage.js |
| 9 | wmsInOrderTF | queryInOrderPage | 1 | wms/ord/inOrderManage.js |
| 10 | wmsInOrderTF | queryStockQrcodeList | 2 | wms/ord/inOrderDetail.js |
| 11 | wmsInOrderTF | queryWmsInOrderInfoForView | 1 | wms/ord/inOrderDetail.js |
| 12 | wmsMaterialPickTF | queryStockMaterialPage | 1 | wms/allocat/stockMaterialManageHZ.js |
| 13 | wmsMaterialPickTF | queryStockStoragePage | 1 | wms/allocat/stockStorageManageHZ.js |
| 14 | wmsOutOrderTF | queryOutOrderPage | 1 | wms/ord/outOrderManage.js |
| 15 | wmsOutOrderTF | queryWmsOutOrderInfoForView | 1 | wms/ord/outOrderDetail.js |

## edu

### edu/admin

共 36 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | commonTF | getSysStaticData | 6 | admin/base/classSet.js |
| 2 | eduBookService | delEduBookInfo | 1 | admin/base/bookManage.js |
| 3 | eduBookService | getEduBookInfo | 2 | admin/base/addBook.js |
| 4 | eduBookService | queryAllEduBookInfo | 1 | admin/base/homeManage.js |
| 5 | eduBookService | queryEduBookInfoPage | 1 | admin/base/bookManage.js |
| 6 | eduBookService | saveEduBookInfo | 1 | admin/base/addBook.js |
| 7 | eduCourseService | delEduCourseInfo | 1 | admin/course/courseManage.js |
| 8 | eduCourseService | delEduTestInfo | 1 | admin/course/courseManage.js |
| 9 | eduCourseService | getAllEduCourseInfos | 1 | admin/base/homeManage.js |
| 10 | eduCourseService | getAllPositions | 4 | admin/course/addCourse.js |
| 11 | eduCourseService | getAllSetPositions | 2 | admin/course/addCourse.js |
| 12 | eduCourseService | getEduCourseInfo | 2 | admin/course/addCourse.js |
| 13 | eduCourseService | getEduTestInfo | 4 | admin/exam/addExam.js |
| 14 | eduCourseService | queryEduCourseInfoPage | 1 | admin/course/courseManage.js |
| 15 | eduCourseService | queryEduUserCourseInfoPage | 1 | admin/course/learnRecord.js |
| 16 | eduCourseService | queryEduUserTestInfoPage | 1 | admin/course/checkScore.js |
| 17 | eduCourseService | saveEduCourseInfo | 1 | admin/course/addCourse.js |
| 18 | eduCourseService | saveEduTestInfo | 1 | admin/exam/addExam.js |
| 19 | eduCourseService | updateCourseAppoint | 1 | admin/course/courseManage.js |
| 20 | eduCourseService | updateEduCourseInfoClass | 1 | admin/course/courseManage.js |
| 21 | eduCourseService | updateTopFlag | 1 | admin/course/courseManage.js |
| 22 | eduHomeService | delCourseClass | 1 | admin/base/classSet.js |
| 23 | eduHomeService | getClassTree | 1 | admin/base/classSet.js |
| 24 | eduHomeService | getSysStaticData | 2 | admin/base/homeManage.js |
| 25 | eduHomeService | queryHomeColumn | 1 | admin/base/homeManage.js |
| 26 | eduHomeService | saveCourseClass | 1 | admin/base/classSet.js |
| 27 | eduHomeService | setHomeColumn | 1 | admin/base/homeManage.js |
| 28 | eduTestService | shortAnswerMark | 1 | admin/student/shortAnswerExamination.js |
| 29 | eduUserService | loadAdminHomeData | 1 | admin/home/toMain.js |
| 30 | eduUserService | queryEduUserCreditInfoPage | 1 | admin/student/studentList.js |
| 31 | eduUserService | queryEduUserTestInfoPage | 1 | admin/student/examScore.js |
| 32 | menuTF | loadMenuTree | 1 | admin/home/navMenu.js |
| 33 | regionOrgTF | getOrgInfoList | 3 | admin/base/addBook.js |
| 34 | regionOrgTF | queryStaffData | 1 | admin/course/addCourse.js |
| 35 | sysLogTF | queryEduSysLogPage | 1 | admin/base/sysLogInfoManage.js |
| 36 | userTF | logout | 1 | admin/home/home.js |

### edu/login

共 5 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | userTF | checkSmsValidCode | 1 | edu/login/forgetPassword.js |
| 2 | userTF | smsModifyPassword | 1 | edu/login/forgetPassword.js |
| 3 | userTF | webPtgetShowCode | 1 | edu/login/login.js |
| 4 | userTF | webPtSendLoginSmsValidCode | 1 | edu/login/login.js |
| 5 | userTF | webPtSendPasswordSmsValidCode | 1 | edu/login/forgetPassword.js |

### edu/main

共 5 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | eduBookService | getEduBookInfo | 1 | main/books/bookDetail.js |
| 2 | eduCourseService | getAllEduCourseInfos | 1 | main/home/toMain.js |
| 3 | eduCourseService | queryEduCourseInfoPage | 1 | main/home/toMain.js |
| 4 | eduHomeService | getSysStaticData | 1 | main/home/toMain.js |
| 5 | eduHomeService | queryHomeColumn | 1 | main/home/toMain.js |

### edu/student

共 10 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | eduCourseService | getEduCourseInfo | 1 | student/course/courseDetail.js |
| 2 | eduCourseService | getEduTestInfo | 1 | student/exam/examination.js |
| 3 | eduCourseService | loadLastLearningCourseData | 1 | student/home/toMain.js |
| 4 | eduCourseService | loadStudentCreditData | 1 | student/exam/examRecord.js |
| 5 | eduCourseService | queryCoursePageForStudent | 1 | student/course/myCourse.js |
| 6 | eduCourseService | studyCourse | 1 | student/course/courseDetail.js |
| 7 | eduTestService | exam | 1 | student/exam/examination.js |
| 8 | eduTestService | queryUserTestRecordPage | 1 | student/exam/examRecord.js |
| 9 | eduUserService | loadStudentHomeData | 2 | student/course/myCourse.js |
| 10 | userTF | logout | 1 | student/home/home.js |

## wx

### wx/order

共 4 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | commonTF | getSplitAddress | 1 | wx/order/addOrder.js |
| 2 | commonTF | getSysStaticData | 1 | wx/order/addOrder.js |
| 3 | orderService | checkQRCodeID | 1 | wx/order/addOrder.js |
| 4 | orderService | saveOrder | 1 | wx/order/addOrder.js |

## sh

### sh/base

共 7 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | roleTF | deleteRoleInfo | 1 | auth/role/roleManage.js |
| 2 | roleTF | loadRoleInfoList | 1 | auth/role/roleManage.js |
| 3 | roleTF | loadRoleInfoListNoPage | 1 | usr/staff/staffManage.js |
| 4 | staffTF | delStaff | 1 | usr/staff/staffManage.js |
| 5 | staffTF | getStaff | 1 | usr/staff/staffManage.js |
| 6 | staffTF | getUserName | 1 | usr/staff/staffManage.js |
| 7 | staffTF | queryStaffs | 1 | usr/staff/staffManage.js |

## demo

### demo/addEntity

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/addPaymentOrder

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/addPlan

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/baseInfo

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/billingDetail

共 1 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | staffTF | queryStaffs | 1 | demo/billingDetail/billingDetail.js |

### demo/budget

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/budgetAchievement

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/cashOutOrder

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/claimOrder

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/codeDetail

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/codePrintView

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/contract

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/contrastReport

共 2 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | ordPlanTF | queryOrdPlanData | 1 | demo/contrastReport/contrastReport.js |
| 2 | supplierTF | getSupplierSelectData | 1 | demo/contrastReport/contrastReport.js |

### demo/dataReport

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/dispatchDemo

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/emailTemp

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/financialCenter

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/humitureLogPrint

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/inspectionDetail

共 1 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | wmsInOrderTF | loadStockQrcodeByCondition | 1 | demo/inspectionDetail/inspectionDetail.js |

### demo/inspectionPrintCode

共 1 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | wmsInOrderTF | loadStockQrcodeByCondition | 1 | demo/inspectionPrintCode/inspectionPrintCode.js |

### demo/inspectionScan

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/insuranceRebate

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/inventoryOrdMerge

共 1 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | workGoodsTF | queryWorkData | 1 | demo/inventoryOrdMerge/inventoryOrdMerge.js |

### demo/invoiceManager

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/limitDeploy

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/list

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/listNoSearch

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/monthlyCostDetail

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/myImportDownDemo

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/operateLog

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/orderDetail

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/orderManager

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/printWarehousingOrder

共 1 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | orderTF | queryOrderInfo | 1 | demo/printWarehousingOrder/printWarehousingOrder.js |

### demo/task

共 1 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | menuTF | queryAuthMenuList | 1 | demo/task/addTask.js |

### demo/transportInsurance

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/truckingOrdDetail

共 1 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | staffTF | queryStaffs | 1 | demo/truckingOrdDetail/truckingOrdDetail.js |

### demo/videoDemo

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/videoPlayer

共 1 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | resMonitorDeviceTF | getDeviceStreamUrl | 1 | demo/videoPlayer/videoPlayer.js |

### demo/wangEditorDemo

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/warehousingDetail

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### demo/workReport

共 2 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | ordPlanTF | queryOrdPlanData | 1 | demo/workReport/workReport.js |
| 2 | supplierTF | getSupplierSelectData | 1 | demo/workReport/workReport.js |

### demo/ysMonitor

共 2 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | resMonitorDeviceTF | queryMonitorPage | 1 | demo/ysMonitor/monitorManage.js |
| 2 | resMonitorDeviceTF | updateMonitorName | 1 | demo/ysMonitor/monitorManage.js |

## components

### components/areaMatch

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/auth

共 6 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | entityTF | loadEntityTree | 1 | components/auth/authRoleTree.js |
| 2 | roleTF | commonSaveRoleOrEntity | 1 | components/auth/authRoleTree.js |
| 3 | roleTF | loadCurrentRoleBindableUserList | 1 | components/auth/userRoleList.js |
| 4 | roleTF | loadCurrentRoleBoundUser | 1 | components/auth/userRoleList.js |
| 5 | userTF | deleteUserRoleRel | 1 | components/auth/userRoleList.js |
| 6 | userTF | saveUserRoleRel | 1 | components/auth/userRoleList.js |

### components/commonOpLog

共 1 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | receiptsTF | queryOpLogById | 1 | components/commonOpLog/commonOpLog.js |

### components/dataPicker

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/dateRange

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/dbTable

共 2 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | tableHeadConfigTF | loadSysTableHeadConfigList | 1 | components/dbTable/dbTable.js |
| 2 | tableHeadConfigTF | saveSysTableHeadConfigs | 1 | components/dbTable/dbTable.js |

### components/filterSelect

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/imgsUpload

共 1 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | fileCommonTF | doDel | 1 | components/imgsUpload/imgsUpload.js |

### components/innerTab

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/iptTable

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/lazySelect

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/mapDialog

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/mapTrack

共 1 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | monitorTF | locationHis | 1 | components/mapTrack/mapTrack.js |

### components/monthsPicker

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/mycity

共 5 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | selectStaticDataTF | selectCity | 1 | components/mycity/mycity.js |
| 2 | selectStaticDataTF | selectCityPro | 1 | components/mycity/mycity.js |
| 3 | selectStaticDataTF | selectDistrict | 1 | components/mycity/mycity.js |
| 4 | selectStaticDataTF | selectProvince | 1 | components/mycity/mycity.js |
| 5 | selectStaticDataTF | selectStreet | 1 | components/mycity/mycity.js |

### components/mycityH5

共 4 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | selectStaticDataTF | selectCity | 1 | components/mycityH5/mycityH5.js |
| 2 | selectStaticDataTF | selectDistrict | 1 | components/mycityH5/mycityH5.js |
| 3 | selectStaticDataTF | selectProvince | 1 | components/mycityH5/mycityH5.js |
| 4 | selectStaticDataTF | selectStreet | 1 | components/mycityH5/mycityH5.js |

### components/myElDatePicker

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/myElTree

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/myFile

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/myFileModel

共 1 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | fileCommonTF | doQuery | 1 | components/myFileModel/myFileModel.js |

### components/myImport

共 2 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | baseTF | checkFinishUpload | 1 | components/myImport/myImport.vue |
| 2 | baseTF | clearUploadMap | 1 | components/myImport/myImport.vue |

### components/myImportDown

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/mySelect

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/myTab

共 1 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | userTF | saveUserMenuLabel | 1 | components/myTab/myTab.js |

### components/myTag

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/myWangEditor

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/officeViewer

共 1 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | fileCommonTF | createToken | 1 | components/officeViewer/OfficeViewer.vue |

### components/operateLog

共 1 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | logService | loadLogData | 1 | components/operateLog/operateLog.js |

### components/printSet

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/rankChart

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/scrollSelect

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/scrollTable

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/searchList

共 2 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | sysSearchParamConfigTF | loadSysSearchParamConfigList | 1 | components/searchList/searchList.js |
| 2 | sysSearchParamConfigTF | saveSysTableHeadConfigs | 1 | components/searchList/searchList.js |

### components/seasonPicker

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/simpleTable

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/table

共 2 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | tableHeadConfigTF | loadSysTableHeadConfigList | 1 | components/table/tableCommon.js |
| 2 | tableHeadConfigTF | saveSysTableHeadConfigs | 1 | components/table/tableCommon.js |

### components/trackScheduleDialog

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/tree

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

### components/videoPlayer

共 2 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | resMonitorDeviceTF | getDeviceStreamUrl | 1 | components/videoPlayer/videoPlayer.js |
| 2 | resMonitorDeviceTF | queryLocalRecords | 1 | components/videoPlayer/videoPlayer.js |

### components/wangEditor

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

## utils

### utils/工具函数

共 4 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |
| 1 | baseTF | checkFinishDownLoad | 1 | src/utils/common.js |
| 2 | baseTF | clearDownLoadMap | 1 | src/utils/common.js |
| 3 | baseTF | downloadExcelFile | 1 | src/utils/common.js |
| 4 | fileCommonTF | getFileFullPath | 1 | src/utils/common.js |

## other

### other/基础架构

共 0 个接口调用（去重后）。

| 序号 | BeanName | MethodName | 引用文件数 | 示例文件 |
| --- | --- | --- | --- | --- |

## 动态调用（需人工核对）

> 以下调用使用了变量/模板字符串拼接 bean 或 method，无法静态解析，请人工核对补充：

### components

- `postUrl(url,{"codeType":"DELIVERY_TYPE"})`
- `postUrl(this.beanName,this.methodName,this.loadParam,null,null,"post",true)`
- `postUrl(url,{tableName:this.tableName})`
- `postUrl(url,param)`
- `.load(this, resolve)`
- `postUrl(this.bean,this.downMethod, {importVehiclePositionExcelKey:this.fileId})`
- `postUrl(url,{"codeTypes":codeTypes.join(",")`
- `postUrl(this.beanName,this.methodName+"Sum",this.loadParam,"","","",true)`
- `postUrl(this.beanName,this.methodName,this.loadParam,"",errorFn,"",true)`

### hz

- `postUrl(url,{},function(data)`
- `postUrl(url,{"urlId": tab3.urlId},function (data)`
- `postUrl(url,{"id": tab3.id},function (data)`
- `postUrl(url,{"userId":that.userId},function(data)`
- `postUrl(url,obj,function (data)`
- `postUrl(url,{},function (data)`

### pt

- `postUrl(bean, method, {ids: feeIds})`
- `.load(bean, method, this.param)`
- `postUrl(beanName, method, param, function (data)`

