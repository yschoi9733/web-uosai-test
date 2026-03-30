# UOS AI Chatbot Web Frontend

이 프로젝트는 Vite, React, TypeScript를 기반으로 구축된 UOS AI 챗봇의 웹 프론트엔드 인터페이스입니다. `fastapi-uosai-test` 백엔드와 연동하여 실시간 AI 채팅 기능을 제공합니다.

## 주요 기능

- **실시간 스트리밍 응답**: `fetch` API의 스트림 판독기를 사용하여 AI의 답변을 실시간으로 화면에 출력합니다.
- **반응형 디자인**: Tailwind CSS v4를 사용하여 모바일과 데스크톱 모두에 최적화된 UI를 제공합니다.
- **다크 모드 지원**: 시스템 설정 및 환경에 맞춘 다크 모드 스타일링이 적용되어 있습니다.
- **자동 스크롤**: 새로운 메시지가 추가되거나 답변이 길어질 때 자동으로 하단으로 스크롤됩니다.

## 기술 스택

- **Framework**: React 19
- **Build Tool**: Vite 8
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (with `@tailwindcss/vite`)
- **Linting & Formatting**: ESLint, Prettier

## 시작하기

### 1. 사전 준비

이 프론트엔드는 백엔드 서버와 통신합니다. 먼저 `fastapi-uosai-test` 서버가 실행 중인지 확인하세요.
- 기본 백엔드 주소: `http://localhost:8000/chat`

### 2. 의존성 설치

프로젝트 루트 디렉토리에서 필요한 패키지를 설치합니다.

```bash
npm install
```

### 3. 개발 서버 실행

로컬 개발 서버를 실행합니다.

```bash
npm run dev
```

서버가 실행되면 터미널에 표시된 주소(기본값: `http://localhost:5173`)로 접속하여 채팅을 시작할 수 있습니다.

## 주요 스크립트

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드 (TypeScript 타입 체크 포함)
- `npm run lint`: ESLint를 통한 코드 린팅
- `npm run format`: Prettier를 통한 코드 포맷팅

---
Created by Gemini CLI.
