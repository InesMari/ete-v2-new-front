<template>
  <div id="warehousingDetail" class="warehousingDetailPage">
    <div class="common-info">
      <h3 class="common-title"><span class="title-name">入库基础信息</span></h3>
      <table
        class="fillTbale"
        width="100%"
        border="0"
        cellspacing="0"
        cellpadding="0"
      >
        <tr>
          <td class="label">货主</td>
          <td class="value">xxxxx</td>
          <td class="label">到货厂商</td>
          <td class="value">xxxxx</td>
          <td class="label">ASN</td>
          <td class="value">xxxxx</td>
          <td class="label">是否为退货</td>
          <td class="value">否</td>
        </tr>
        <tr>
          <td class="label">预计入库时间</td>
          <td class="value">xxxxx</td>
          <td class="label">实际入库日期</td>
          <td class="value">xxxxx</td>
          <td class="label">入库单备注</td>
          <td class="value" colspan="3">xxxxx</td>
        </tr>
      </table>

      <table
        class="tableCommon mt_20"
        width="100%"
        border="0"
        cellspacing="0"
        cellpadding="0"
      >
        <thead>
          <tr>
            <th>批次号</th>
            <th>供应商批次号</th>
            <th>物料编码</th>
            <th>物料描述</th>
            <th>规格名称</th>
            <th>入库数量</th>
            <th>管理单位</th>
            <th>箱数</th>
            <th>托数</th>
            <th>生产日期</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>合计：</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="red fw">0</td>
            <td></td>
            <td class="red fw">88</td>
            <td class="red fw">1259</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <table
        class="tableCommon mt_20"
        width="50%"
        border="0"
        cellspacing="0"
        cellpadding="0"
      >
        <thead>
          <tr>
            <th>可回收包材</th>
            <th>所属用户</th>
            <th>入库数量</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
          </tr>
        </tbody>
      </table>

      <h3 class="common-title mt_20"><span class="title-name">物料入库情况</span></h3>
      <table
        class="tableCommon"
        width="100%"
        border="0"
        cellspacing="0"
        cellpadding="0"
      >
        <thead>
          <tr>
            <th>批次号</th>
            <th>供应商批次号</th>
            <th>物料编码</th>
            <th>物料描述</th>
            <th>生产日期</th>
            <th>管理单位</th>
            <th>库区</th>
            <th>库位</th>
            <th>实际入库数量</th>
            <th>是否冻结库存</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
            <td>xxxxxx</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>合计：</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="red fw">1259</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script>
// import warehousingDetail from './warehousingDetail.js'
// export default warehousingDetail
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
.warehousingDetailPage{
    .tableCommon{
        border:$border;
    }
}
</style>
