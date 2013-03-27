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
 * ��ͨ�����:���˴���Ĳ���,����������Ҫ����GridTreeUtil�еķ���.
 * connect me:419723443@qq.com
 */
public class TableTreeAction   extends Action {
	// ÿҳ����
	private static int DEFAULT_PAGE_SIZE = 10; 
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
			//���ҵ�����Ҫ��������:��ѯ��һ��Ľڵ������!!
			totalNum = dao.getFirstLevelCount();			
			
			// ������ù�����ķ���:������ʼ�к���ֹ��.
			rowStartEnd = GridTreeUtil.getStartAndEndInfo(request, totalNum,
					DEFAULT_PAGE_SIZE);			
			
			//���ҵ�����Ҫ��������:��ѯ��ʾ��һҳ��ʾ�����Ľڵ��Լ��ӽڵ�!
			list = dao.getCommonList(rowStartEnd[0], rowStartEnd[1]);
			
			// ������ù�����ķ���:�õ�json�ַ�����
			String jsonStr = GridTreeUtil.getJsonStr(list, request);	
			*/
			 	
			
			StringBuffer buf  =new StringBuffer();
			//��һ��:��һ���������.
			totalNum = 5;
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
			buf.append(" data:[{\"disid\":\"10\",\"disparentId\":\"\",\"disname\":\"����"+page+"\"},");
			buf.append(" {\"disid\":\"11\",\"disparentId\":\"\",\"disname\":\"����"+page+"\"},      "); 
			buf.append(" {\"disid\":\"12\",\"disparentId\":\"\",\"disname\":\"���"+page+"\"},      ");
			buf.append(" {\"disid\":\"4211\",\"disparentId\":\"10\",\"disname\":\"�人"+page+"\"},"); 
			buf.append(" {\"disid\":\"4212\",\"disparentId\":\"10\",\"disname\":\"����"+page+"\"},");
			buf.append(" {\"disid\":\"4213\",\"disparentId\":\"10\",\"disname\":\"����"+page+"\"},  ");		
			buf.append(" {\"disid\":\"4214\",\"disparentId\":\"10\",\"disname\":\"�Ƹ�"+page+"\"},  ");
			buf.append(" {\"disid\":\"4215\",\"disparentId\":\"10\",\"disname\":\"����"+page+"\"},");
			buf.append(" {\"disid\":\"4216\",\"disparentId\":\"10\",\"disname\":\"�˲�"+page+"\"},  ");		
			buf.append(" {\"disid\":\"4217\",\"disparentId\":\"10\",\"disname\":\"�差"+page+"\"},  ");
			buf.append(" {\"disid\":\"4218\",\"disparentId\":\"10\",\"disname\":\"��ʯ"+page+"\"},");
			buf.append(" {\"disid\":\"4219\",\"disparentId\":\"10\",\"disname\":\"ʮ��"+page+"\"},  ");		
			buf.append(" {\"disid\":\"4220\",\"disparentId\":\"10\",\"disname\":\"Т��"+page+"\"},  "); 
			buf.append(" {\"disid\":\"1101\",\"disparentId\":\"11\",\"disname\":\"����"+page+"\"},  ");		
			buf.append(" {\"disid\":\"1201\",\"disparentId\":\"12\",\"disname\":\"���"+page+"\"},  ");
			buf.append(" {\"disid\":\"1102\",\"disparentId\":\"11\",\"disname\":\"�йش�"+page+"\"},  ");		
			buf.append(" {\"disid\":\"1202\",\"disparentId\":\"12\",\"disname\":\"��򿪷���"+page+"\"}  ");
			buf.append("]}  ");

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