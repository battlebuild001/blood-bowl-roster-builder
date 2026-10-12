# Blood Bowl 2025 로스터 빌더

Blood Bowl 2025 팀의 시작 로스터를 구성하고, 규칙 자료를 확인할 수 있는 정적 웹앱입니다.

## 실행

별도 빌드나 패키지 설치 없이 `dist/`를 정적 파일 서버로 제공하면 됩니다.

```bash
python3 -m http.server 8000 --directory dist
```

브라우저에서 `http://localhost:8000`을 여세요. 로스터는 브라우저의 로컬 저장소에 저장되며 JSON으로 내보내거나 불러올 수 있습니다.

## 구성

- `dist/`: 배포되는 HTML, CSS, JavaScript와 팀·스킬 데이터
- `data/`: 팀·스킬 데이터의 읽기 쉬운 JSON 원본
- `scripts/`: 원문 자료에서 데이터 파일을 생성하는 스크립트
- `.openai/hosting.json`: 현재 Sites 배포 설정

팀·규칙 정보의 출처는 [Blood Bowl Base BB2025](https://bloodbowlbase.ru/bb2025/teams/)와 [BB Roster](https://bbroster.com/new-team)입니다. 스킬 사전에는 Blood Bowl Base 원문 링크와 한국어 번역을 함께 표시합니다.

현재 공개 웹앱: https://blood-bowl-roster-builder.brightlyric16.chatgpt.site/

이 저장소는 프로젝트 소스와 Git 이력을 보관합니다. 위 공개 웹앱은 기존 Sites 배포를 계속 사용합니다.
