from flask import Flask, request, render_template, jsonify
import sqlite3
import pandas as pd

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
        conditions.append(f"{columns[i]} LIKE ?")
        params.append(f"%{queries[i]}%")

    condition_str = ' AND '.join([f"({c})" for c in conditions])

    conn = get_db_connection()
    try:
        df = pd.read_sql_query(f"SELECT * FROM drug_info WHERE {condition_str}", conn, params=params)
        if not df.empty:
            results = df.to_html(classes='data')
        else:
            results = "No results found."
    except Exception as e:
        results = str(e)
    finally:
        conn.close()
    
    return results

if __name__ == '__main__':
    app.run(debug=True)
