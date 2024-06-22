from flask import Flask, request, render_template, jsonify
import sqlite3
import pandas as pd
from bs4 import BeautifulSoup

app = Flask(__name__)

# 데이터베이스 연결 함수
def get_db_connection():
    conn = sqlite3.connect('drug_info_search_db.db')
    conn.row_factory = sqlite3.Row
    return conn

# 메인 페이지 및 검색 폼
@app.route('/')
def index():
    return render_template('index.html', results=None)

# 검색 결과 처리 엔드포인트
@app.route('/search', methods=['POST'])
def search():
    queries = request.form.getlist('query')
    columns = request.form.getlist('column')
    operators = request.form.getlist('operator')

    if not queries or not columns or len(queries) != len(columns):
        return "No search terms provided or mismatched queries and columns", 400

    conditions = []
    params = []

    for i in range(len(queries)):
        condition = f"{columns[i]} LIKE ?"
        conditions.append(condition)
        params.append(f"%{queries[i]}%")

        # 다음 조건이 존재하면 AND 또는 OR 연산자를 추가
        if i < len(queries) - 1:
            if i < len(operators):
                conditions.append(operators[i])
            else:
                return "Mismatch between number of queries and operators", 400

    # SQL 쿼리 조건 문자열 생성
    condition_str = ' '.join(conditions)

    conn = get_db_connection()
    try:
        # SQL 쿼리 실행
        query = f"""
        SELECT 품목구분, 업체명, 제품명, 주성분, 첨가제, 상태 
        FROM drug_info 
        WHERE {condition_str}
        """
        df = pd.read_sql_query(query, conn, params=params)
        if not df.empty:
            # 데이터프레임을 HTML로 변환
            df_html = df.to_html(classes='data', index=False, escape=False)

            # data-column 속성 추가
            soup = BeautifulSoup(df_html, 'html.parser')
            for idx, row in enumerate(soup.find_all('tr')):
                if idx == 0:  # 헤더 행
                    for th in row.find_all('th'):
                        th['data-column'] = th.get_text()
                else:  # 데이터 행
                    for col_idx, td in enumerate(row.find_all('td')):
                        td['data-column'] = df.columns[col_idx]
            df_html = str(soup)

            results = df_html
        else:
            results = "No results found."
    except Exception as e:
        results = f"Error occurred: {e}"
    finally:
        conn.close()

    return results

if __name__ == '__main__':
    app.run(debug=True)
