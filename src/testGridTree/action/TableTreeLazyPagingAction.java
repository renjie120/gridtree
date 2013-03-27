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

public class TableTreeLazyPagingAction extends Action {
	// ÿҳ����
	private static int DEFAULT_PAGE_SIZE = 10;

	/**
	 * �����صı����ʾ������.
	 * 
	 * @param mapping
	 * @param form
	 * @param request
	 * @param response
	 * @return
	 */
	public ActionForward execute(ActionMapping mapping, ActionForm form,
			HttpServletRequest request, HttpServletResponse response) {
		String parentId = request.getParameter("pId");
		// GridTreeDao dao = new GridTreeDao();
		List list = new ArrayList();
		int totalNum = 0;
		int[] rowStartEnd;
		try {
			/*
			 * totalNum = dao.getListCountByParent(parentId); rowStartEnd =
			 * GridTreeUtil.getStartAndEndInfo(request, totalNum,
			 * DEFAULT_PAGE_SIZE); list =
			 * dao.getListByParent(parentId,rowStartEnd[0],rowStartEnd[1]); //
			 * ���ù�����ķ����õ�json�ַ����� String jsonStr =
			 * GridTreeUtil.getJsonStr(list,request);
			 */

			StringBuffer buf = new StringBuffer();
			int n = 1;
			totalNum = 10;
			int currentPage = 1;
			if (request.getParameter("gtpage") != null)
				n = Integer.parseInt(request.getParameter("gtpage"));
			String page = "--���Ե�" + n + "ҳ";
			buf.append("{total:" + totalNum + ",page:" + n + ",");
			buf.append(" data:[{\"disid\":\"10" + parentId
					+ "\",\"disparentId\":\"" + parentId
					+ "\",\"disname\":\"����" + page + "\",\"isLeaf\":\"1\"},");
			buf.append(" {\"disid\":\"11" + parentId + "\",\"disparentId\":\""
					+ parentId + "\",\"disname\":\"��ǿ���ʲ" + page
					+ "\",\"isLeaf\":\"0\"},      ");
			buf.append(" {\"disid\":\"12" + parentId + "\",\"disparentId\":\""
					+ parentId + "\",\"disname\":\"���" + page
					+ "\",\"isLeaf\":\"1\"}]} ");
			String jsonStr = buf.toString();
			response.setContentType("text/html; charset=UTF-8");
			System.out.println("�������Ӵ�:" + jsonStr);
			PrintWriter out = response.getWriter();
			out.println(jsonStr);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
}
