import requests
from bs4 import BeautifulSoup
import pandas as pd

# 약품 정보를 저장할 빈 데이터프레임 리스트를 생성합니다.
df_medicines_list = []

# 사용자로부터 쉼표로 구분된 약품 이름들을 입력받습니다.
input_medicine_names = input("검색어를 입력하세요 (쉼표로 구분): ")

# 입력된 검색어들을 쉼표로 구분하여 리스트에 추가
medicine_names = [name.strip() for name in input_medicine_names.split(',')]

for medicine_name in medicine_names:
    encoded_medicine_name = requests.utils.quote(medicine_name)
    url = f"https://nedrug.mfds.go.kr/searchDrug?sort=&sortOrder=false&searchYn=true&ExcelRowdata=&page=1&searchDivision=detail&itemName={encoded_medicine_name}"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    search_name = soup.select("#con_body > div.mediWrap.m-search > div.r_sec_md > div.table_scroll > table > tbody > tr > td:nth-child(2) > span:nth-child(2) > a")
    search_property = soup.select("#con_body > div.mediWrap.m-search > div.r_sec_md > div.table_scroll > table > tbody > tr > td:nth-child(12) > span:nth-child(2)")
    
    temp_df = pd.DataFrame({'약품명': [tag.get_text(strip=True) for tag in search_name], 
                            '성분명': [tag.get_text(strip=True) for tag in search_property]})
    
    # 결과 데이터프레임 리스트에 추가합니다.
    df_medicines_list.append(temp_df)

# 각각의 데이터 프레임을 출력합니다.
for idx, df_medicines in enumerate(df_medicines_list):
    print(f"검색어: {medicine_names[idx]}\n")
    print(df_medicines)
    print("\n")
    
  