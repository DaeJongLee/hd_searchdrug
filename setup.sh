#!/bin/bash

# 가상 환경 생성
python3 -m venv .venv

# 가상 환경 활성화
source .venv/bin/activate

# pip 업그레이드
pip install --upgrade pip

# requirements.txt 파일에서 패키지 설치
pip install -r requirements.txt
