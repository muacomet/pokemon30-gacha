# 포켓몬 30주년 기념 가챠 (Pokemon 30th Anniversary Gacha)

포켓몬 30주년 기념 1~1025 랜덤 뽑기 사이트입니다.
세레비(Serebii)에서 제공하는 30주년 기념 포켓몬 공식 이미지와 PokeAPI의 한글 이름 데이터를 활용합니다.

## 기능 (Features)
- 1번부터 1025번까지의 포켓몬 중 하나를 랜덤하게 뽑는 애니메이션 제공
- 글래스모피즘(Glassmorphism) 기반의 프리미엄 다크 테마 UI 적용
- 역동적인 3D 카드 뒤집기 및 뽑기 연출 효과
- 포켓몬 번호와 함께 **공식 한글 이름** 표시

## 폴더 구조 (Structure)
- `index.html`: 메인 웹페이지 구조
- `style.css`: 테마, 레이아웃 및 애니메이션 스타일링
- `app.js`: 랜덤 로직, JSON 데이터 로드, DOM 조작 및 카드 시퀀스 처리
- `download.py`: Serebii에서 1025장의 이미지를 `images/` 폴더에 일괄 다운로드하는 Python 스크립트
- `fetch_names.py`: PokeAPI에서 1025마리의 한글 이름을 고속 병렬 다운로드하여 JSON으로 저장하는 스크립트
- `pokemon_names.json`: 포켓몬 ID별 한글 이름이 매핑된 데이터 파일
- `images/`: 포켓몬 이미지 리소스 폴더

## 실행 방법 (How to Run)

### 로컬 테스트
1. 레포지토리를 클론합니다.
2. `download.py` 스크립트를 실행하여 `images/` 폴더에 포켓몬 이미지(1025장)를 다운로드 받습니다. (이미 다운로드 되어있다면 생략 가능)
```bash
python3 download.py
```
3. (선택) `fetch_names.py` 스크립트를 실행하여 최신 한글 이름 데이터를 빌드합니다.
```bash
python3 fetch_names.py
```
4. 터미널에서 로컬 서버를 실행하여 접속합니다.
```bash
python3 -m http.server 8000
```
5. 브라우저에서 `http://localhost:8000` 접속

### GitHub Pages 배포
이 레포지토리를 포크(Fork)하거나 복사한 후, Settings > Pages 메뉴에서 `main` 브랜치를 Source로 지정하여 누구나 무료로 정적 웹사이트 호스팅이 가능합니다.
