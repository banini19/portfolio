// 사이트에 보이는 프로젝트 목록입니다. 위에서부터 순서대로 보입니다.
// 그림 이름은 originals/<slug>/ 안의 파일 이름(확장자 빼고)과 같습니다.
// picks는 첫 화면(바탕화면) 창 안에 보이는 주요 그림입니다. 첫 그림은 폴더 아이콘에도 보입니다. 누르면 세부 페이지로 갑니다.
// parts가 있으면 여러 작업을 한 프로젝트로 묶습니다(CeREELs). 각 part의 slug가 그림 폴더 이름입니다.
// 다른 폴더의 그림은 "폴더/그림"처럼 씁니다.
// intro는 어썸피스 3쪽 종이 표지 그림입니다(지금은 화면에 쓰지 않음. assets/draw.js와 함께 보관).
// videos가 있으면 세부 페이지에 영상이 들어갑니다(tools/make_page_videos.py가 만든 video/<slug>/). 대표 그림 hero는 없어도 됩니다. hero에 그림 여러 장을 목록으로 적으면 같은 높이로 나란히 놓입니다(적은 순서대로 왼쪽부터).
// nameBg는 세부 화면 맨 위 제목 뒤에 깔리는 그림 이름(있으면 제목과 검은 띠 글씨가 그림 위에 흰색으로, 띠는 없어짐).
// nameBgAt은 그림의 어느 부분이 보일지(가로% 세로%, 없으면 50% 60%), nameBgDim은 밝은 그림을 어둡게 할 정도(0~1).
// tagline은 세부 화면 검은 띠 왼쪽 글(없으면 kicker). versions(Ver 1 → 2 → 3 그림), turntables(tools/make_turntables.py), process(작업 과정 그림)는 있을 때만 보입니다.
// channel은 세부 화면 맨 위의 유튜브 채널 그림(pic, 누르면 url로). Odie in Seoul Inferno.
// poster는 세부 화면의 Poster 칸: final(완성 포스터, 왼쪽)과 sketches(스케치들, 오른쪽에 줄 맞춰 작은 갤러리).
// times는 같은 자리에서 시간에 따라 빛이 바뀌는 게임 화면(세부 화면 맨 위 "Time of day", 2×2): pic 그림 이름, time 그림 위 시각.
// dressup은 Metaverse 옷 입혀보기(tools/make_dressup.py가 출력하는 줄; 그림은 site/dressup/odie/, 고르는 단추 그림은 --icons로 site/dressup/odie-icons/).
// 노션 포트폴리오에서 옮긴 것(세부 화면): logline(작품 속 한 줄), intent(기획 의도), synopsis(줄거리 문단), film(유튜브 영상 id → Film),
// steps(Process 단계: title, pics. 그림은 같은 높이의 줄로 놓임. cols를 주면 그 칸 수의 격자 — 위아래 짝을 맞출 때).
// 추가 방법은 README.md를 보세요.
window.PROJECTS = [
  {
    "slug": "metaverse",
    "kicker": "Metaverse · 2026",
    "title": "Metaverse",
    "nameBg": "title-bg",
    "tagline": "70–80s Seoul",
    "desc": "",
    "role": "기획 · 디자인 · 3D · AI 활용",
    "times": [
      { "pic": "time-0800", "time": "08:00" },
      { "pic": "time-1830", "time": "18:30" },
      { "pic": "time-1950", "time": "19:50" },
      { "pic": "time-2300", "time": "23:00" }
    ],
    "versions": ["v1", "v2", "v3"],
    "turntables": [
      { "src": "video/metaverse/turntable/bluejacket.mp4", "poster": "video/metaverse/turntable/bluejacket.webp", "size": [364, 734] },
      { "src": "video/metaverse/turntable/postman.mp4", "poster": "video/metaverse/turntable/postman.webp", "size": [288, 734] },
      { "src": "video/metaverse/turntable/grandma.mp4", "poster": "video/metaverse/turntable/grandma.webp", "size": [346, 562] },
      { "src": "video/metaverse/turntable/odie.mp4", "poster": "video/metaverse/turntable/odie.webp", "size": [232, 414] },
      { "src": "video/metaverse/turntable/jindo.mp4", "poster": "video/metaverse/turntable/jindo.webp", "size": [464, 378] },
      { "src": "video/metaverse/turntable/dog.mp4", "poster": "video/metaverse/turntable/dog.webp", "size": [280, 242] },
      { "src": "video/metaverse/turntable/poodle.mp4", "poster": "video/metaverse/turntable/poodle.webp", "size": [230, 194] },
      { "src": "video/metaverse/turntable/bird.mp4", "poster": "video/metaverse/turntable/bird.webp", "size": [126, 96] }
    ],
    "dressup": {"path": "dressup/odie/", "icons": "dressup/odie-icons/", "angles": 8, "size": [448, 838], "hair": ["기본 단발", "낮은 양갈래", "옆가르마 숏컷", "머리띠 올림머리"], "outfit": ["기본 티셔츠", "바다 세일러복", "놀이터 멜빵바지", "개나리 비옷"], "shoes": ["기본 갈색 신발", "찍찍이 운동화", "노란 장화"], "eyes": ["기본 동그란 눈", "가늘게 뜬 눈", "웃는 눈"], "mouth": ["기본 웃는 입", "일자 입", "시무룩한 입"]},
    "process": ["process-02", "process-03"],
    "videos": [
      { "src": "video/metaverse/alley.mp4", "poster": "video/metaverse/alley.webp", "size": [1500, 758] },
      { "src": "video/metaverse/rooftop.mp4", "poster": "video/metaverse/rooftop.webp", "size": [1500, 734] }
    ],
    "color": "#6b8f7e"
  },
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
        "nameBg": "background-01",
        "nameBgAt": "50% 55%",
        "nameBgDim": 0.25,
        "desc": "단테 '신곡'의 지옥을 서울 직장인 오디의 하루로 옮긴 유튜브 숏츠 2D 컷아웃 애니메이션 시리즈입니다.",
        "role": "기획 · 제작",
        "channel": { "pic": "youtube-channel", "url": "https://www.youtube.com/@SeoulInferno.CeREELs", "name": "Seoul Inferno.CeREELs" },
        "poster": {
          "final": "poster-main",
          "sketches": [
            "poster-sketch-01",
            "poster-sketch-02",
            "poster-sketch-03",
            "poster-sketch-04",
            "poster-sketch-05",
            "poster-sketch-06",
            "poster-rough"
          ]
        },
        "gallery": [
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
          "goods-04",
          "odie-middle-school/turnaround-02",
          "odie-middle-school/turnaround-01",
          "odie-middle-school/acting-poses",
          "odie-middle-school/char-lineup",
          "odie-middle-school/expression-01",
          "odie-middle-school/bg-classroom-layout",
          "odie-middle-school/concept-01",
          "odie-middle-school/bg-hallway",
          "odie-middle-school/bg-classroom",
          "odie-middle-school/bg-odie-house",
          "odie-middle-school/concept-03",
          "odie-middle-school/concept-02",
          "odie-odyssey/poster-final"
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
    "nameBg": "animation-08",
    "nameBgAt": "50% 50%",
    "nameBgDim": 0.25,
    "desc": "'이상한 나라의 앨리스' 콘셉트의 서커스 페스티벌 홍보 애니메이션과 메인 이미지입니다. 거인이 서커스 랜드를 발견한 모습을 요청받아, 거인을 페스티벌을 찾아오는 사람들로 해석해 평범하고 중성적으로 디자인했습니다. 서커스 랜드의 요정들은 줄무늬 패턴과 별 모양을 참고했습니다.",
    "role": "메인 이미지 · 캐릭터 디자인 · 홍보 애니메이션",
    "type": "의뢰 작업",
    "film": "eQUTc1C3Kyg",
    "hero": ["main-image-inside", "main-image"],
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
    "nameBg": "animation-11",
    "nameBgAt": "50% 35%",
    "nameBgDim": 0.3,
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
    "nameBg": "scene-moon",
    "nameBgAt": "50% 32%",
    "desc": "개인 단편 애니메이션입니다. (2024.11 – 12)",
    "role": "개인 작업 · 2D 애니메이션",
    "type": "개인 작업",
    "logline": "우주에는 잃어버린 물건들의 행성이 있대",
    "synopsis": ["자고 일어나니 소중한 인형이 사라진 주인공 해솔. 인형을 찾으러 우주로 모험을 떠나는 이야기."],
    "film": "Ty9s1i6ZjTY",
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
    "steps": [
      {"title": "캐릭터 디자인", "pics": ["character-turnaround", "character-lineup"]},
      {"title": "컨셉아트", "pics": ["concept-timetable", "concept-space"]}
    ],
    "color": "#3a3a46"
  },
  {
    "slug": "snow-goblin",
    "kicker": "Short Film · 2021",
    "title": "눈도깨비",
    "nameBg": "scene-08",
    "nameBgAt": "50% 50%",
    "desc": "개인 단편 애니메이션입니다. (2021.09 – 12)",
    "role": "개인 작업 · 2D 애니메이션",
    "type": "개인 작업",
    "intent": "따뜻하고 희망적인 이야기",
    "synopsis": ["눈이 많이 내리는 날 깊은 숲속에서 길을 잃은 주인공은 어느 오두막집을 발견하고, 그곳에서 도깨비를 마주치게 된다. 주인공은 숲속에서 홀로 잃어버린 아이를 기다리는 도깨비의 소문을 떠올렸고 자신이 바로 그 아이라며 거짓말을 하게 된다.", "그 후로 주인공과 도깨비는 오두막에서 함께 지내게 되었지만 그곳은 사람이 살기 적절한 환경이 아니었고, 다시 돌아가겠다는 주인공의 말에 도깨비는 화가 나 폭설을 내리고 만다. 추위에 견디지 못하고 쓰러진 주인공. 도깨비는 그 모습에 정신이 들어 자신의 품에 주인공을 감싸고, 이내 녹아 사라진다.", "아침에 홀로 눈을 뜬 주인공은 어느 새 눈이 녹아 생긴 길을 따라 숲을 내려간다."],
    "film": "GvFfCzSVyAg",
    "hero": "scene-forest",
    "picks": [
      "scene-forest",
      "scene-04",
      "scene-09",
      "scene-03"
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
    "steps": [
      {"title": "캐릭터 발전 과정", "pics": ["dev-01", "dev-02", "dev-03", "dev-04", "dev-05", "dev-06"]},
      {"title": "최종 디자인", "pics": ["final-goblin", "final-boy"]},
      {"title": "이미지 스케치", "pics": ["image-sketch-01", "image-sketch-02"]},
      {"title": "2023 컬러스크립트", "pics": ["color-script"]},
      {"title": "스토리보드", "pics": ["storyboard-01", "storyboard-02", "storyboard-03", "storyboard-04", "storyboard-05", "storyboard-06", "storyboard-07", "storyboard-08", "storyboard-09", "storyboard-10"]}
    ],
    "color": "#d9e1e8"
  },
  {
    "slug": "myoya-gokdong",
    "kicker": "Short Film · 2019",
    "title": "묘야곡동",
    "nameBg": "scene-06",
    "nameBgAt": "50% 50%",
    "desc": "개인 단편 애니메이션입니다. (2019.04 – 06)",
    "role": "개인 작업 · 2D 애니메이션",
    "type": "개인 작업",
    "intent": "다양한 미신들을 가지고 있는 고양이가 실제로 귀신을 보고, 인도하는 역할을 하면 어떨까 하는 생각을 시작으로 기획",
    "synopsis": ["늦은 밤, 눈을 뜬 고양이 건락. 파트너 예복이 들고 온 지도를 따라 함께 망자들을 찾아 나선다. 해가 뜨기 전 망자들을 무사히 저승으로 안내하는 것이 고양이들의 임무. 그 과정을 담은 이야기"],
    "film": "9FO-rePBYXU",
    "hero": "scene-cats",
    "picks": [
      "scene-cats",
      "scene-04",
      "scene-09",
      "scene-11"
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
    "steps": [
      {"title": "캐릭터", "pics": ["design-gunrak-yebok", "design-hasam", "design-grandma"]},
      {"title": "컨셉아트", "pics": ["concept-river", "concept-map", "concept-cats", "concept-village", "concept-props"]}
    ],
    "color": "#3b2e4a"
  },
  {
    "slug": "monggae-monggae",
    "kicker": "Short Film · 2018 – 2019",
    "title": "몽개몽개",
    "nameBg": "scene-08",
    "nameBgAt": "50% 35%",
    "desc": "개인 단편 애니메이션입니다. (2018.11 – 2019.01)",
    "role": "개인 작업 · 2D 애니메이션",
    "type": "개인 작업",
    "intent": "실제로 꾼 꿈을 바탕으로 애니메이션 제작에 목적을 두고 기획",
    "synopsis": ["깊은 밤, 잠들어 있던 주인공은 어딘가에서 들려오는 물 떨어지는 소리에 잠에서 깬다. 비가 오는 건가 싶어 창문을 열어 보았지만, 하늘에선 물 한 방울 떨어지지 않았다. 침대에 누우니 다시 들려오는 물 떨어지는 소리. 소리를 쫓아 가보니 침대 밑의 어디서 생겨났는지 모를 웅덩이에서 들려오는 소리였다. 과연 침대 밑 웅덩이 속에는 무엇이 있을까?"],
    "film": "piAn3BnBvPU",
    "hero": "scene-underwater",
    "picks": [
      "scene-underwater",
      "scene-02",
      "scene-05",
      "scene-10"
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
    "steps": [
      {"title": "컨셉아트", "pics": ["concept-art"]},
      {"title": "캐릭터·배경 디자인", "pics": ["design-boy", "design-faces", "design-room"]},
      {"title": "1-1컷 작업 과정", "pics": ["reference-01", "reference-02", "reference-03", "reference-04", "frame-01", "frame-02", "frame-03", "frame-04"], "cols": 4},
      {"title": "졸업전시회 상영회", "pics": ["screening-01", "screening-02"]}
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
      "chef-sheet",
      "chef-scene",
      "blue-cloaks",
      "forest-tree",
      "camper-van",
      "sixties-kids",
      "yunbok-diary-01",
      "yunbok-diary-02",
      "goblin-kid-01",
      "goblin-kid-02"
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
