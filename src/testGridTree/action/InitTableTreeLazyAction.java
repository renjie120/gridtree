package testGridTree.action;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts.action.Action;
import org.apache.struts.action.ActionForm;
import org.apache.struts.action.ActionForward;
import org.apache.struts.action.ActionMapping;

import testGridTree.GridTreeUtil;

/**
 * ��ʾ�����ر����:��һ����ʾִ�е�action,Ҳ����initLazy.
 * ��;��:ֻ��ѯ����Ӧ����ʾ�ĵ�һ��Ľڵ�.
 * connect me:419723443@qq.com
 */
public class InitTableTreeLazyAction  extends Action {
	// ÿҳ����
	private static int DEFAULT_PAGE_SIZE = 10;
	/**
	 * ִ�з���.
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 */
	  public ActionForward execute(ActionMapping mapping, ActionForm form,
				HttpServletRequest request, HttpServletResponse response) {
		//GridTreeDao dao = new GridTreeDao();
		List list = new ArrayList();
		// �������
		int totalNum = 0;
		int[] rowStartEnd;
		int len = 0;
		try {
			/*
			totalNum = dao.getFirstLevelCount(); 
			// ���ù�����ķ���������ʼ�к���ֹ�У�Ϊǰ���ͺ󿪵ģ���
			rowStartEnd = GridTreeUtil.getStartAndEndInfo(request, totalNum,
					DEFAULT_PAGE_SIZE);
			list = dao.getList(rowStartEnd[0], rowStartEnd[1]);

			// ���ù�����ķ����õ�json�ַ�����
			String jsonStr = GridTreeUtil.getJsonStr(list, request);
			*/
			
			
			StringBuffer buf  =new StringBuffer();
			//��һ��:��һ���������.
			totalNum = 10;
			//�ڶ���:��ʾ����ʼ��,�ͽ�����.
			//�ڵ����ҳ��ť��ʱ��,�ᴫ��gtstart��������̨.
			rowStartEnd = GridTreeUtil.getStartAndEndInfo(request, totalNum,
					DEFAULT_PAGE_SIZE);	
			//������:��ѯlist--demoʡ��.
			
			//���Ĳ�:�γ�json��.------������ģ���json
			int n = 1;
			if (request.getParameter("gtpage") != null)  
				n = Integer.parseInt(request.getParameter("gtpage"));
			String page  ="--���Ե�"+n+"ҳ";	
			buf.append("{total:"+ request.getAttribute("gtcount") + ",page:"+ request.getAttribute("gtpage")+",");
			buf.append(" data:[{\"disid\":\"10\",\"disparentId\":\"\",\"disname\":\"����"+page+"\",\"isLeaf\":\"1\"},"); 
			buf.append(" {\"disid\":\"11\",\"disparentId\":\"\",\"disname\":\"��ǿ���ʲ"+page+"\",\"isLeaf\":\"0\"},      ");	
			buf.append(" {\"disid\":\"12\",\"disparentId\":\"\",\"disname\":\"���"+page+"\",\"isLeaf\":\"1\"}]} ");

			String jsonStr = buf.toString();
			response.setContentType("text/html; charset=UTF-8");
			System.out.println("json��:" + jsonStr);
			PrintWriter out = response.getWriter();
			out.println(jsonStr); 
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	} 
}
