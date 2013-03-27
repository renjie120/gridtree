<%@ page language="java" import="java.util.*" pageEncoding="GB18030"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>"> 
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page"> 
  </head>
  
  <body>
    <a href='gridTree/MyJsp.jsp'>前台表格树示例123</a><br>
    <a href='gridTree/MyJspForJava.jsp'>后台表格树</a><br>
    <a href='gridTree/MyLazyTree.jsp'>懒加载树示例1</a><br>
     <a href='gridTree/MyLazyTree2.jsp'>懒加载树示例2(lazyPage:true)</a><br>
     <a href='gridTree/MyLazyTree3.jsp'>懒加载树示例3(lazyMorePage:true)</a><br>
      <a href='gridTree/MyLazyTree4.jsp'>最新表格树4</a><br>
       <a href='gridTree/ShandongLazyTree.jsp'>山东表格树</a><br>
     <a href='myMethod.html'>属性说明文档</a><br>
     <a href='myApi.html'>方法API文档</a><br>
     <a href='http://lishuiqing1987.j38.80data.com/demo/demo1.rar'>1.0版本demo下载</a><br>
	 <a href='http://lishuiqing1987.j38.80data.com/demo/demo2.rar'>2.0版本demo下载</a><br>
	 <a href='http://code.google.com/p/gridtree-jquery-plugin-demo/'>google code</a><br>
  </body>
</html>
