# 메뉴 추천 — 행복한 하루

Spring Data JPA REST API와 React를 연결한 메뉴 추천·관리 실습 프로젝트입니다. 가을 분위기의 UI, 메뉴별 음식 일러스트, 등록·조회·수정·삭제 기능을 포함합니다.

## 구성

```text
mini/
├─ artboards/                화면 설계와 디자인 기록
├─ chap06-spring-data-jpa/   Spring Boot 백엔드
├─ menu-app/                 Vite + React 프론트엔드
├─ .gitignore
├─ AGENTS.md
├─ CLAUDE.md
├─ README.md
└─ api-docs.json             OpenAPI 명세
```

## 주요 기능

- 메뉴 목록, 페이징과 정렬
- 이름·가격·카테고리 검색
- 메뉴 상세 조회
- 메뉴 등록·수정·삭제
- URL 쿼리스트링으로 검색 조건 유지
- 메뉴별 음식 이미지와 반응형 화면

## 실행 방법

MySQL을 실행하고 `chap06-spring-data-jpa/sql`의 SQL 파일 두 개를 순서대로 적용합니다.

백엔드:

```powershell
cd chap06-spring-data-jpa
.\gradlew.bat bootRun
```

프론트엔드:

```powershell
cd menu-app
npm install
npm run dev
```

브라우저에서 `http://localhost:5173`을 엽니다.

## 확인 명령

```powershell
cd menu-app
npm run lint
npm run build
```
