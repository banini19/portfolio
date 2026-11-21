// 사이트에 보이는 프로젝트 목록입니다. 위에서부터 순서대로 보입니다.
// 그림 이름은 originals/<slug>/ 안의 파일 이름(확장자 빼고)과 같습니다.
// picks는 첫 화면(바탕화면) 창 안에 보이는 주요 그림입니다. 첫 그림은 폴더 아이콘에도 보입니다. 누르면 세부 페이지로 갑니다.
// parts가 있으면 여러 작업을 한 프로젝트로 묶습니다(CeREELs). 각 part의 slug가 그림 폴더 이름입니다.
// 다른 폴더의 그림은 "폴더/그림"처럼 씁니다.
// intro는 어썸피스 3쪽 종이 표지 그림입니다(지금은 화면에 쓰지 않음. assets/draw.js와 함께 보관).
// 추가 방법은 README.md를 보세요.
window.PROJECTS = [
  {
    "slug": "cereels",
    "kicker": "CeREELs IP · 2025.03 – 2026.08",
    "title": "CeREELs IP",
    "desc": "청담미디어 CeREELs에서 한 작업을 모았습니다. 오디 IP(유튜브 숏츠 시리즈 Odie in Seoul Inferno, 중학생 오디 애니메이션 기획, 게임 Odie Odyssey)와 다른 CeREELs IP, 새 IP 작업입니다.",
    "type": "회사 작업 · 청담미디어 CeREELs",
    "picks": [
      "odie-seoul-inferno/poster-main",
      "odie-seoul-inferno/background-02",
      "odie-seoul-inferno/episode-01",
      "odie-seoul-inferno/episode-04",
      "odie-seoul-inferno/background-01",
      "odie-middle-school/concept-01",
      "odie-middle-school/concept-03",
      "odie-middle-school/bg-hallway",
      "odie-odyssey/poster-final",
      "odie-odyssey/seoul-station",
      "odie-odyssey/title-03",
      "cereels-other-ips/ella-gator-01",
      "cereels-other-ips/asset-04",
      "cereels-other-ips/asset-09",
      "cereels-new-ip/concept-01"
    ],
    "color": "#2f3f8f",
    "intro": {
      "words": "CeREELs IP 2025.03 – 2026.08",
      "paper": "cereels/cover-paper",
      "title": "cereels/cover-title",
      "drawing": "cereels/cover-characters"
    },
    "parts": [
      {
        "slug": "odie-seoul-inferno",
        "kicker": "CeREELs IP · 2025 – 2026",
        "title": "Odie in Seoul Inferno",
        "desc": "단테 '신곡'의 지옥을 서울 직장인 오디의 하루로 옮긴 유튜브 숏츠 2D 컷아웃 애니메이션 시리즈입니다.",
        "role": "Storyboard · Asset · Animating · Edit · Thumbnail · YouTube 관리",
        "hero": "poster-main",
        "sketches": [
          "poster-sketch-01",
          "poster-sketch-02",
          "poster-sketch-03",
          "poster-sketch-04",
          "poster-sketch-05",
          "poster-sketch-06",
          "poster-rough"
        ],
        "gallery": [
          "episode-01",
          "episode-02",
          "episode-03",
          "episode-04",
          "episode-05",
          "character-01",
          "character-02",
          "character-03",
          "character-04",
          "character-05",
          "character-06",
          "character-07",
          "character-08",
          "character-09",
          "character-10",
          "character-11",
          "character-12",
          "background-01",
          "background-02",
          "background-03",
          "background-04",
          "background-05",
          "background-06",
          "background-07",
          "background-08",
          "background-09",
          "background-10",
          "background-11",
          "background-12",
          "boardgame-01",
          "boardgame-02",
          "boardgame-03",
          "goods-01",
          "goods-02",
          "goods-03",
          "goods-04"
        ]
      },
      {
        "slug": "odie-middle-school",
        "kicker": "CeREELs IP",
        "title": "중학생 오디 애니메이션 기획",
        "desc": "중학생 오디 애니메이션 기획 단계의 캐릭터 디자인, 배경 디자인 및 컨셉아트 작업입니다.",
        "role": "캐릭터 디자인 · 배경 디자인 · 컨셉아트",
        "hero": "concept-01",
        "sketches": [
          "sketch-01",
          "turnaround-01",
          "turnaround-02",
          "expression-01"
        ],
        "gallery": [
          "concept-02",
          "concept-03",
          "bg-odie-house",
          "bg-classroom",
          "bg-hallway",
          "bg-classroom-layout",
          "char-odie",
          "char-taemi",
          "char-sumin",
          "char-eustis",
          "char-heesu",
          "acting-pose-01",
          "acting-pose-02"
        ]
      },
      {
        "slug": "odie-odyssey",
        "kicker": "CeREELs IP",
        "title": "Odie Odyssey",
        "desc": "Odie IP 게임 포스터 및 기타 디자인 작업입니다.",
        "role": "게임 포스터 · 타이틀 디자인 · 배경 디자인",
        "hero": "poster-final",
        "sketches": [
          "poster-thumbnails",
          "stage0-sketch-01",
          "stage0-sketch-02"
        ],
        "gallery": [
          "poster-color-01",
          "poster-color-02",
          "poster-color-03",
          "seoul-station",
          "title-01",
          "title-02",
          "title-03",
          "title-04",
          "title-05",
          "title-06"
        ]
      },
      {
        "slug": "cereels-other-ips",
        "kicker": "CeREELs IP",
        "title": "Supernova · 곰탕 · Ella Gator",
        "desc": "CeREELs의 다른 IP 작품에서 맡은 에셋 선화 · 채색 · 배경 작업입니다.",
        "role": "에셋 선화 · 채색 · 배경",
        "hero": "ella-gator-01",
        "sketches": [
          "layout-sketch-01"
        ],
        "gallery": [
          "asset-01",
          "asset-02",
          "asset-03",
          "asset-04",
          "asset-05",
          "asset-06",
          "asset-07",
          "asset-08",
          "asset-09",
          "asset-10"
        ]
      },
      {
        "slug": "cereels-new-ip",
        "kicker": "CeREELs IP",
        "title": "New IP",
        "desc": "신규 IP 기획 단계의 캐릭터 · 배경 시안입니다.",
        "role": "캐릭터 · 배경 시안",
        "hero": "concept-01",
        "sketches": [
          "concept-sketch-01",
          "concept-sketch-02",
          "concept-sketch-03",
          "concept-sketch-04",
          "concept-sketch-05",
          "concept-sketch-06",
          "concept-sketch-07",
          "concept-sketch-08"
        ],
        "gallery": []
      }
    ]
  },
  {
    "slug": "circus-wonderland",
    "kicker": "Circus Cabaret · 2023",
    "title": "Circus in Wonderland",
    "desc": "'이상한 나라의 앨리스' 콘셉트의 서커스 페스티벌 홍보 애니메이션과 메인 이미지입니다. 거인이 서커스 랜드를 발견한 모습을 요청받아, 거인을 페스티벌을 찾아오는 사람들로 해석해 평범하고 중성적으로 디자인했습니다. 서커스 랜드의 요정들은 줄무늬 패턴과 별 모양을 참고했습니다.",
    "role": "메인 이미지 · 캐릭터 디자인 · 홍보 애니메이션",
    "type": "의뢰 작업",
    "hero": "main-image",
    "picks": [
      "main-image",
      "scene-giant",
      "animation-02",
      "animation-12"
    ],
    "sketches": [
      "idea-sketch-01",
      "idea-sketch-02",
      "idea-sketch-03",
      "idea-sketch-04",
      "sketch-01",
      "sketch-02",
      "sketch-03"
    ],
    "gallery": [
      "main-image-inside",
      "banner-in-use",
      "scene-giant",
      "animation-01",
      "animation-02",
      "animation-03",
      "animation-04",
      "animation-05",
      "animation-06",
      "animation-07",
      "animation-08",
      "animation-09",
      "animation-10",
      "animation-11",
      "animation-12"
    ],
    "color": "#b9413a"
  },
  {
    "slug": "circus-world",
    "kicker": "Circus Cabaret · 2022",
    "title": "Circus World",
    "desc": "지루해 하던 사람들이 서커스 세계에 빨려 들어가는 서커스 페스티벌 홍보 애니메이션입니다. 지루한 일상은 흑백으로, 서커스 세계에 들어서며 몸에 색이 채워지도록 연출했습니다.",
    "role": "홍보 애니메이션 · 스토리보드 · 연출",
    "type": "의뢰 작업",
    "hero": "scene-circus",
    "picks": [
      "scene-circus",
      "animation-07",
      "animation-11",
      "animation-09"
    ],
    "sketches": [
      "storyboard",
      "sketch-01",
      "sketch-02",
      "sketch-03",
      "sketch-04",
      "sketch-05",
      "sketch-06"
    ],
    "gallery": [
      "animation-01",
      "animation-02",
      "animation-03",
      "animation-04",
      "animation-05",
      "animation-06",
      "animation-07",
      "animation-08",
      "animation-09",
      "animation-10",
      "animation-11"
    ],
    "color": "#efcd78"
  },
  {
    "slug": "asteroid",
    "kicker": "Short Film · 2024",
    "title": "소행성",
    "desc": "개인 단편 애니메이션입니다. (2024.11 – 12)",
    "role": "개인 작업 · 2D 애니메이션",
    "type": "개인 작업",
    "hero": "scene-moon",
    "picks": [
      "scene-moon",
      "scene-04",
      "scene-09",
      "scene-11"
    ],
    "sketches": [
      "character",
      "house"
    ],
    "gallery": [
      "scene-01",
      "scene-02",
      "scene-03",
      "scene-04",
      "scene-05",
      "scene-06",
      "scene-07",
      "scene-08",
      "scene-09",
      "scene-10",
      "scene-11"
    ],
    "color": "#3a3a46"
  },
  {
    "slug": "snow-goblin",
    "kicker": "Short Film · 2021",
    "title": "눈도깨비",
    "desc": "개인 단편 애니메이션입니다. (2021.09 – 12)",
    "role": "개인 작업 · 2D 애니메이션",
    "type": "개인 작업",
    "hero": "scene-forest",
    "picks": [
      "scene-forest",
      "scene-04",
      "scene-09",
      "scene-03"
    ],
    "sketches": [
      "goblin",
      "boy",
      "necklace"
    ],
    "gallery": [
      "scene-01",
      "scene-02",
      "scene-03",
      "scene-04",
      "scene-05",
      "scene-06",
      "scene-07",
      "scene-08",
      "scene-09",
      "scene-10",
      "scene-11"
    ],
    "color": "#d9e1e8"
  },
  {
    "slug": "myoya-gokdong",
    "kicker": "Short Film · 2019",
    "title": "묘야곡동",
    "desc": "개인 단편 애니메이션입니다. (2019.04 – 06)",
    "role": "개인 작업 · 2D 애니메이션",
    "type": "개인 작업",
    "hero": "scene-cats",
    "picks": [
      "scene-cats",
      "scene-04",
      "scene-09",
      "scene-11"
    ],
    "sketches": [
      "characters",
      "lantern"
    ],
    "gallery": [
      "scene-01",
      "scene-02",
      "scene-03",
      "scene-04",
      "scene-05",
      "scene-06",
      "scene-07",
      "scene-08",
      "scene-09",
      "scene-10",
      "scene-11"
    ],
    "color": "#3b2e4a"
  },
  {
    "slug": "monggae-monggae",
    "kicker": "Short Film · 2018 – 2019",
    "title": "몽개몽개",
    "desc": "개인 단편 애니메이션입니다. (2018.11 – 2019.01)",
    "role": "개인 작업 · 2D 애니메이션",
    "type": "개인 작업",
    "hero": "scene-underwater",
    "picks": [
      "scene-underwater",
      "scene-02",
      "scene-05",
      "scene-10"
    ],
    "sketches": [
      "boy",
      "room"
    ],
    "gallery": [
      "scene-01",
      "scene-02",
      "scene-03",
      "scene-04",
      "scene-05",
      "scene-06",
      "scene-07",
      "scene-08",
      "scene-09",
      "scene-10",
      "scene-11"
    ],
    "color": "#2b8c9a"
  },
  {
    "slug": "character-design",
    "kicker": "Personal · Character Design",
    "title": "Character Design",
    "desc": "캐릭터 시트 · 라인업 · 포즈",
    "role": "캐릭터 디자인 · 일러스트",
    "type": "개인 작업",
    "hero": "lineup-beach",
    "picks": [
      "lineup-beach",
      "circus-performers",
      "blue-cloaks",
      "white-robe",
      "chef-sheet"
    ],
    "sketches": [
      "sketch-01",
      "sketch-02",
      "sketch-03"
    ],
    "gallery": [
      "chef-sheet",
      "chef-scene",
      "white-robe",
      "blue-cloaks",
      "circus-performers"
    ],
    "color": "#7db7da"
  },
  {
    "slug": "ssukki-haeppugi",
    "kicker": "Personal · Character Design",
    "title": "쑤끼 · 해뿌기",
    "desc": "동물들이 사는 세계, 느릿하고 내향적인 토끼와 급하고 외향적인 거북이의 이야기입니다. 쑤끼(토끼)는 조용하고 예민한 마이웨이, 해뿌기(거북이)는 말 많고 스피드를 즐깁니다.",
    "role": "캐릭터 디자인 · 응용 이미지 · 굿즈",
    "type": "개인 작업",
    "hero": "characters",
    "picks": [
      "characters",
      "emoticon-05",
      "goods-02"
    ],
    "sketches": [
      "design-process-01",
      "design-process-02",
      "design-process-03",
      "design-process-04"
    ],
    "gallery": [
      "emoticon-01",
      "emoticon-02",
      "emoticon-03",
      "emoticon-04",
      "emoticon-05",
      "emoticon-06",
      "emoticon-07",
      "emoticon-08",
      "emoticon-09",
      "emoticon-10",
      "emoticon-11",
      "emoticon-12",
      "goods-01",
      "goods-02",
      "goods-03",
      "goods-04",
      "goods-05",
      "goods-06"
    ],
    "color": "#cde6c4"
  },
  {
    "slug": "drawing",
    "kicker": "Personal · Drawing",
    "title": "인체 · 동작 드로잉",
    "desc": "인체와 동작을 관찰한 드로잉입니다.",
    "role": "드로잉",
    "type": "개인 작업",
    "hero": "drawing-main",
    "picks": [
      "drawing-main",
      "drawing-05",
      "drawing-02"
    ],
    "sketches": [],
    "gallery": [
      "drawing-01",
      "drawing-02",
      "drawing-03",
      "drawing-04",
      "drawing-05",
      "drawing-06",
      "drawing-07",
      "drawing-08"
    ],
    "color": "#efe9df"
  }
];
