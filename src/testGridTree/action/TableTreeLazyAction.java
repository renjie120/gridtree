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

/**
 * �����ر������ʾ:��ѯָ���ĸ��ڵ�������ӽڵ�.
 * �ڵ���ڵ�ǰ���+�ŵ�ʱ��,���ύ�����action����.
 * connect me:419723443@qq.com
 */
public class TableTreeLazyAction   extends Action { 
	 // ÿҳ����
    private static int DEFAULT_PAGE_SIZE = 10;
	/**
	 * �����صı����ʾ������.
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 */
    public ActionForward execute(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response) {
	  	String parentId = request.getParameter("pId");
    	//GridTreeDao dao = new GridTreeDao();
		List list = new ArrayList();		
		try {
			/*
			//��ѯ�ӽڵ㼯��
			list = dao.getListByParent(parentId);
			// ���ù�����ķ����õ�json�ַ�����
			String jsonStr = GridTreeUtil.getJsonStr(list);
			*/
			StringBuffer buf  =new StringBuffer();
			String page  ="--��"+parentId+"�ĺ���...";	
			buf.append("[");
			buf.append("{\"disid\":\"10"+parentId+"\",\"disparentId\":\""+parentId+"\",\"disname\":\"����10"+page+"\",\"isLeaf\":\"1\"},");
			buf.append(" {\"disid\":\"12"+parentId+"\",\"disparentId\":\""+parentId+"\",\"disname\":\"����12"+page+"\",\"isLeaf\":\"0\"},  ");	
			buf.append(" {\"disid\":\"13"+parentId+"\",\"disparentId\":\""+parentId+"\",\"disname\":\"����13"+page+"\",\"isLeaf\":\"0\"}, ");
			buf.append("{\"disid\":\"14"+parentId+"\",\"disparentId\":\""+parentId+"\",\"disname\":\"����14"+page+"\",\"isLeaf\":\"1\"},");
			buf.append(" {\"disid\":\"15"+parentId+"\",\"disparentId\":\""+parentId+"\",\"disname\":\"����15"+page+"\",\"isLeaf\":\"0\"} ");	
			buf.append("]");
			
			String jsonStr = buf.toString();
			response.setContentType("text/html; charset=UTF-8");
			System.out.println("�������Ӵ�:"+jsonStr);
			PrintWriter out = response.getWriter();
			out.println(jsonStr);
		} catch (Exception e) {
			e.printStackTrace();
		}		
		return null;
	}
}
