import requests
from bs4 import BeautifulSoup
import pandas as pd
import math

input_medicine_name = input("검색어를 입력하세요: ").strip()
encoded_medicine_name = requests.utils.quote(input_medicine_name)

# 첫 페이지의 응답을 가져와서 총 결과 수를 계산합니다.
initial_url = f"https://nedrug.mfds.go.kr/searchDrug?sort=&sortOrder=false&searchYn=true&ExcelRowdata=&page=1&searchDivision=detail&itemName={encoded_medicine_name}"
initial_response = requests.get(initial_url)
initial_soup = BeautifulSoup(initial_response.text, 'html.parser')

# 총 결과값을 가져오는 선택자를 사용
total_results_text = initial_soup.select_one('#con_body > div.mediWrap.m-search > div.r_sec_md > div.search_top.mb10 > p > strong').text
total_results = int(total_results_text.replace(",", ""))  # 쉼표 제거 후 정수 변환
items_per_page = 15  # 한 페이지에 표시되는 데이터 수
total_pages = math.ceil(total_results / items_per_page)  # 전체 페이지 수 계산

# 약품 정보를 저장할 데이터프레임을 초기화합니다.
df_medicines = pd.DataFrame(columns=['약품명', '성분명'])

# 모든 페이지를 순회하며 데이터 수집
for page in range(1, total_pages + 1):
    url = f"https://nedrug.mfds.go.kr/searchDrug?sort=&sortOrder=false&searchYn=true&ExcelRowdata=&page={page}&searchDivision=detail&itemName={encoded_medicine_name}"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # 웹 페이지 구조에 맞게 적절한 CSS 선택자를 사용하여 데이터 추출
    # 예시 코드에서는 실제 데이터 추출 부분이 생략되어 있으므로, 실제 데이터를 추출하는 코드를 추가해야 합니다.
    
    # 예시: 데이터 추출 및 데이터프레임에 추가하는 코드

# 최종 데이터프레임 출력
print(df_medicines)
