import requests
from bs4 import BeautifulSoup
import pandas as pd
import webbrowser
import os
import time
import tempfile

# 사용자로부터 쉼표로 구분된 약품 이름들을 입력받습니다.
input_medicine_names = input("검색어를 입력하세요: ")
# 입력된 검색어들을 쉼표로 구분하여 리스트에 추가
medicine_names = [name.strip() for name in input_medicine_names.split(',')]

# 약품 정보를 저장할 빈 데이터프레임 리스트를 생성합니다.
df_medicines_list = []

for medicine_name in medicine_names:
    encoded_medicine_name = requests.utils.quote(medicine_name)
    url = f"https://nedrug.mfds.go.kr/searchDrug?sort=&sortOrder=false&searchYn=true&ExcelRowdata=&page=1&searchDivision=detail&itemName=&itemEngName=&entpName=&entpEngName=&ingrName1={medicine_names}Name2=&ingrName3=&ingrEngName=&itemSeq=&stdrCodeName=&atcCodeName=&indutyClassCode=&sClassNo=&narcoticKindCode=&cancelCode=&etcOtcCode=&makeMaterialGb=&searchConEe=AND&eeDocData=&searchConUd=AND&udDocData=&searchConNb=AND&nbDocData=&startPermitDate=&endPermitDate="
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    search_name = soup.select("#con_body > div.mediWrap.m-search > div.r_sec_md > div.table_scroll > table > tbody > tr > td:nth-child(2) > span:nth-child(2) > a")
    search_property = soup.select("#con_body > div.mediWrap.m-search > div.r_sec_md > div.table_scroll > table > tbody > tr > td:nth-child(12) > span:nth-child(2)")
    
    temp_df = pd.DataFrame({'약품명': [tag.get_text(strip=True) for tag in search_name], 
                            '성분명': [tag.get_text(strip=True) for tag in search_property]})
    
    # 결과 데이터프레임 리스트에 추가합니다.
    df_medicines_list.append(temp_df)

css_style = """
<style>
    body { font-family: Noto Sans Korean; margin: 20px; }
    h1 { color: blue; }
    table.dataframe { border-collapse: collapse; width: 100%; }
    table.dataframe th, table.dataframe td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    table.dataframe th { background-color: #f2f2f2; }
    a { color: #337ab7; text-decoration: none; }
    a:hover { text-decoration: underline; }
    table { width: 100%; table-layout: fixed;}   
    th:nth-child(1), td:nth-child(1) { width: 5%; text-align: center; }
    th:nth-child(2), td:nth-child(2), th:nth-child(3), td:nth-child(3) { width: 47.5%; }
</style>

"""

# 허브 페이지의 내용을 준비합니다.
hub_page_content = f"<html><head><title>약품 검색 결과</title>{css_style}</head><body><h1>약품 검색 결과</h1>"

# 각 검색 결과에 대해 임시 파일을 생성하고, 허브 페이지에 데이터 프레임과 링크를 추가합니다.
for idx, df_medicines in enumerate(df_medicines_list):
    df_html = df_medicines.to_html(border=0, classes='dataframe')
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".html", mode='w', encoding='utf-8')
    temp_file_content = f"<html><head><title>{medicine_names[idx]}</title>{css_style}</head><body><h1>{medicine_names[idx]}</h1>{df_html}<br><a href='#{medicine_names[idx]}'>Back to Hub Page</a></body></html>"
    temp_file.write(temp_file_content)
    temp_file.close()
    
    # 허브 페이지에 링크와 데이터 프레임을 추가합니다.
    hub_page_content += f"<h2 id='{medicine_names[idx]}'>{medicine_names[idx]}</h2>{df_html}<br><a href='file://{temp_file.name}'>{medicine_name}</a><br><br>"

hub_page_content += "</body></html>"

# 허브 페이지 파일 생성
hub_page_file = tempfile.NamedTemporaryFile(delete=False, suffix=".html", mode='w', encoding='utf-8')
hub_page_file.write(hub_page_content)
hub_page_path = hub_page_file.name
hub_page_file.close()

# 허브 페이지를 웹브라우저에서 엽니다.
webbrowser.open('file://' + os.path.realpath(hub_page_path))
time.sleep(3)
os.remove(hub_page_path)

# css styles 세워보기 
