
<%@ page language="java" import="java.util.*" pageEncoding="GBK"%>
<table>
  <tr>
    <td><button onclick='reload()'>��ҳˢ��</button> </td>
    <td>$(�����id).reload();</td>
  </tr>
  <tr>
    <td>
      <button onclick='openNode(this)'>չ���ڵ�</button>
      <input style='width:50px' value='2200'>
      <td>$(�����id).open(id);</td>
    </tr>
    <tr>
      <td>
        <button onclick='closeNode(this)'>�رսڵ�</button>
        <input style='width:50px'  value='2200'>
        <td>$(�����id).close(id);</td>
      </tr>
      <tr>
        <td>
          <button onclick='expandAllNodes()'>չ��ȫ���ڵ�</button>
        </td>
      </td>
    </td>
    <td>$(�����id).expandAll();</td>
  </tr>
  <tr>
    <td>
      <button onclick='closeAllNodes()'>�ر�ȫ���ڵ�</button>
    </td>
    <td>$(�����id).closeAll();</td>
  </tr>
  <tr>
    <td>
      <button onclick='setdisable(true)'>���ñ����</button>
    </td>
    <td>$(�����id).disabled(true);</td>
  </tr>
  <tr>
    <td>
      <button onclick='setdisable(false)'>���ñ����</button>
    </td>
    <td>$(�����id).disabled(false);</td>
  </tr>
  <tr>
    <td>
      <button onclick='setHeight(600)'>change�߶�</button>
    </td>
    <td>$(�����id).resetHeight(600);</td>
  </tr>
  <tr>
    <td>
      <button onclick='setWidth(600)'>change���</button>
    </td>
    <td>$(�����id).resetWidth(600);</td>
  </tr>
  <tr>
    <td>
      <button onclick='setJsonData()'>����json��</button>
    </td>
    <td>$(�����id).setJsonData(json);</td>
  </tr>
  <tr>
    <td>
      <button onclick='getPara()'>���������</button>
    </td>
    <td>$(�����id).getPara();</td>
  </tr>
  <tr>
    <td>
      <button onclick='reloadTree()'>��̬ˢ��</button>
    </td>
    <td>$(�����id).reload();</td>
  </tr>
  <tr>
    <td>
      <button onclick='searchTree()'>��ѯ�ڵ�</button>
    </td>
    <td>$(�����id).search(para);</td>
  </tr>
</table>

