# 메뉴 추천 프로젝트 작업 지침

이 저장소는 Spring Data JPA 백엔드와 React 프론트엔드로 구성된다.

## 프로젝트 구조

- `chap06-spring-data-jpa`: Spring Boot REST API, `localhost:8080`
- `menu-app`: Vite + React 화면, `localhost:5173`
- `artboards`: 화면 설계와 디자인 참고 자료
- `api-docs.json`: 백엔드 OpenAPI 명세

## 프론트엔드 규칙

- 서버 요청은 `menu-app/src/api`에만 작성한다.
- 주소에 대응하는 화면은 `pages`, 공통 화면 조각은 `components`에 둔다.
- 검색어, 카테고리, 정렬, 페이지 번호는 URL 쿼리스트링으로 관리한다.
- 색상과 간격은 `menu-app/src/tokens.css`의 디자인 토큰을 우선 사용한다.
- 이미지 파일은 `menu-app/public`에 둔다.
- 변경 후 `npm run lint`와 `npm run build`를 실행한다.

## 백엔드 규칙

- 엔티티를 API에 직접 반환하지 않고 DTO를 사용한다.
- 정상 응답은 `ResponseMessage`, 오류는 `ErrorResponse` 형식을 유지한다.
- 변경 후 `gradlew.bat compileJava` 또는 관련 테스트를 실행한다.

## 실행

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
