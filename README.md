# UUID Generator

HTML, CSS, JavaScript로 만든 정적 UUID 생성기입니다. 백엔드와 데이터베이스가 필요하지 않습니다.

## 기능
- UUID 길이 선택: 8자 / 16자 / 32자
- 하이픈 포함 옵션
- 한 번에 1개 / 5개 / 10개 생성
- 개별 복사 및 전체 복사
- 모바일 화면 대응

## 로컬 실행
`index.html` 파일을 브라우저에서 열면 됩니다. 클립보드 복사 기능과 `crypto.randomUUID()`는 브라우저의 보안 컨텍스트 정책에 따라 로컬 파일 환경에서 제한될 수 있으므로, 배포 환경에서는 HTTPS를 사용하세요.

## GitHub Pages 배포
1. GitHub에서 `uuid-generator`라는 Public 저장소를 만듭니다.
2. 이 폴더의 파일을 저장소 루트에 push 합니다.
3. 저장소의 **Settings → Pages**로 이동합니다.
4. **Build and deployment**에서 **Deploy from a branch**를 선택합니다.
5. Branch를 `main`, 폴더를 `/(root)`로 선택하고 저장합니다.
6. 배포 완료 후 `https://<github-username>.github.io/uuid-generator/` 주소로 접속합니다.

## 참고
8자 또는 16자로 잘라낸 값은 표준 UUID 전체보다 충돌 가능성이 높습니다. 짧은 값을 보안 토큰이나 전역적으로 유일해야 하는 식별자로 사용하지 마세요.
