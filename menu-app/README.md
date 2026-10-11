# Table & Field — Menu Studio

Montage 디자인 토큰을 사용한 React 메뉴 추천 화면입니다. 같은 상위 폴더의 Spring Data JPA 서버와 연결됩니다.

## 실행

```bash
cd menu-app
npm install
npm run dev
```

백엔드는 같은 상위 폴더의 `chap06-spring-data-jpa`를 `localhost:8080`에서 먼저 실행합니다. 프론트엔드는 CORS 설정에 맞춰 `localhost:5173`을 사용합니다.

## 확인

```bash
npm run lint
npm run build
```

검색어·가격·카테고리·정렬·페이지는 URL 쿼리스트링에 남으며, 등록·상세·수정은 각각 독립 라우트로 구성했습니다.
