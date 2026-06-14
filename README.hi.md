<p align="center">
  <a href="README.ja.md">日本語</a> | <a href="README.zh.md">中文</a> | <a href="README.es.md">Español</a> | <a href="README.fr.md">Français</a> | <a href="README.md">English</a> | <a href="README.it.md">Italiano</a> | <a href="README.pt-BR.md">Português (BR)</a>
</p>

<p align="center">
  <img src="./.brand/readme.png" alt="interface-audits — Reduce the Burden. Improve the Experience." width="400">
</p>

<p align="center">
  <a href="https://github.com/dogfood-lab/interface-audits/actions/workflows/verify.yml"><img src="https://github.com/dogfood-lab/interface-audits/actions/workflows/verify.yml/badge.svg" alt="verify"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License"></a>
  <a href="https://dogfood-lab.github.io/interface-audits/"><img src="https://img.shields.io/badge/handbook-live-2da44e?logo=github" alt="Handbook"></a>
  <a href="./SHIP_GATE.md"><img src="https://img.shields.io/badge/shipcheck-passed-2da44e" alt="Shipcheck passed"></a>
</p>

<p align="center"><em>Proof-backed audits for human-facing product surfaces.</em></p>

---

## यह क्या है

`interface-audits` ऑडिट मानदंडों और उन निष्पादन योग्य कौशल का एक संग्रह है जो उन्हें चलाते हैं। प्रत्येक ऑडिट उपयोगकर्ता के सामने आने वाली विशिष्ट प्रकार की विफलता को पकड़ता है, जिसे सामान्य एक्सेसिबिलिटी स्कैनर अनदेखा कर देते हैं। स्कैनर WCAG उल्लंघनों को पकड़ते हैं; ये ऑडिट ऐसे इंटरफेस को पकड़ते हैं जो **स्कैनर में तो पास हो जाते हैं, लेकिन फिर भी उपयोगकर्ताओं को खोज करने के लिए मजबूर करते हैं**।

इस संग्रह में पहला ऑडिट **संज्ञानात्मक भार (Cognitive Load)** है, जो भार विस्थापन को पकड़ता है: ऐसे इंटरफेस जो स्मृति, खोज, विश्वास, सत्यापन, नेविगेशन, कॉन्फ़िगरेशन, स्रोत पुनर्प्राप्ति, दृश्य डिकोडिंग, समय, पुनर्प्राप्ति/पूर्ववत या सुविधा हानि पर बोझ डालते हैं।

प्रत्येक ऑडिट में चार चीजें शामिल होती हैं:

1. **मानदंड (Rubric)** — सिद्धांत, अनुभाग, गंभीरता नियम ([`audits/cognitive-load/RUBRIC.md`](audits/cognitive-load/RUBRIC.md))
2. **कौशल (Skill)** — आह्वान अनुबंध और प्रक्रिया ([`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md))
3. **स्कीमा (Schema)** — निष्कर्षों और स्कोरकार्ड के लिए JSON स्कीमा ([`shared/schemas/`](shared/schemas/))
4. **सबूत (Evidence)** — कम से कम एक पूर्ण दबाव परीक्षण या प्रत्यक्ष उपयोग परीक्षण ([`audits/cognitive-load/evidence/`](audits/cognitive-load/evidence/))

कोई सबूत नहीं, तो कोई आधिकारिक ऑडिट नहीं। स्थिति मशीन के लिए [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) और आगे क्या आने वाला है, इसके लिए [`ROADMAP.md`](ROADMAP.md) देखें।

## स्थापना करें

अधिकांश उपयोगकर्ता इस रिपॉजिटरी को "स्थापित" नहीं करते हैं - वे इसे पढ़ते हैं। ऑडिट मार्कडाउन मानदंड और कौशल होते हैं, जिनकी व्याख्या [Claude](https://claude.ai) या उपयुक्त MCP टूल (ब्राउज़र नेविगेशन, स्क्रीनशॉट, DOM रीड) के साथ संगत किसी अन्य AI रनर द्वारा की जाती है।

उन रखरखावकर्ताओं के लिए जो स्थानीय सत्यापन उपकरण (स्कीमा सत्यापन, लिंक जांच, शिपचेक ऑडिट) चलाना चाहते हैं:

```bash
git clone https://github.com/dogfood-lab/interface-audits.git
cd interface-audits
npm install        # installs ajv, ajv-formats, glob (dev-only)
npm run verify     # runs schema + link + shipcheck checks
```

**आवश्यकताएं:** सत्यापन उपकरणों के लिए Node 20+। स्वयं ऑडिट प्लेटफ़ॉर्म-अज्ञेयवादी मार्कडाउन हैं।

## उपयोग

### ऑडिट चलाना

Claude (या संगत रनर) के माध्यम से आह्वान करें:

> `<target-url-or-surface>` पर संज्ञानात्मक भार ऑडिट चलाएं

पूर्ण ट्रिगर सूची, इनपुट, आउटपुट और प्रक्रिया के लिए [`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md) देखें।

### मौजूदा ऑडिट पढ़ना

पिछले ऑडिट रन `audits/<name>/evidence/<run-id>/` के अंतर्गत मौजूद हैं और उनमें तीन फाइलें होती हैं:

- `<audit>-findings.md` — मानदंड प्रारूप में पूर्ण निष्कर्ष
- `<audit>-scorecard.json` — प्रति-अनुभाग पास/चेतावनी/विफलता + सारांश
- `remediation-priority-list.md` — गंभीरता × लाभ के अनुसार क्रमबद्ध निष्कर्ष

वर्तमान ऑडिट और उनके सबूत नीचे [वर्तमान ऑडिट](#current-audits) तालिका में हैं।

### एक नया ऑडिट बनाना

एक नया ऑडिट पांच जीवनचक्र अवस्थाओं से गुजरता है: मसौदा → दबाव परीक्षण → स्थिर → प्रत्यक्ष उपयोग परीक्षण → संशोधित। स्थिति मशीन के लिए [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md), प्रक्रिया के लिए [`shared/pressure-test-protocol.md`](shared/pressure-test-protocol.md) और संदर्भ कार्यान्वयन के रूप में `audits/cognitive-load/` पर संज्ञानात्मक भार ऑडिट देखें।

## खतरे की सतह

जब एक ऑडिट कौशल को आह्वान किया जाता है, तो रनर (उपयुक्त MCP टूल के साथ क्लाउड) उपयोगकर्ता द्वारा प्रदान किए गए लक्ष्य के विरुद्ध संचालन करता है:

- **नेटवर्क आउटगोइंग** — केवल उस लक्ष्य URL पर जिसे उपयोगकर्ता ने नामित किया है। कौशल अन्य सेवाओं को कॉल नहीं करते हैं।
- **DOM और स्क्रीनशॉट कैप्चर** — कौशल पृष्ठ DOM पढ़ सकता है, स्क्रीनशॉट ले सकता है और उत्तरदायी CSS कक्षाओं का निरीक्षण कर सकता है। कैप्चर की गई सामग्री में कुछ भी शामिल हो सकता है जो लक्ष्य URL पर उपयोगकर्ता के प्रमाणित सत्र में दिखाई देता है, जिसमें नाम, संदेश निकाय और खाता स्थिति शामिल हैं।
- **स्थानीय फ़ाइल लेखन** — सबूत फाइलें केवल रिपॉजिटरी के कार्यशील ट्री के अंतर्गत `audits/<name>/evidence/<run-id>/` में लिखी जाती हैं। कौशल इस दायरे से बाहर कुछ भी नहीं लिखते हैं।
- **सबूत का कोई आउटबाउंड प्रसारण नहीं** — जब तक कि उपयोगकर्ता स्पष्ट रूप से उन्हें कमिट और पुश न करे, सबूत फाइलें स्थानीय डिस्क पर रहती हैं।
- **कोई टेलीमेट्री नहीं, कोई गुप्त जानकारी हैंडलिंग नहीं** — यह रिपॉजिटरी कोई विश्लेषण एकत्र नहीं करता है और कोई क्रेडेंशियल नहीं पढ़ता है।

सार्वजनिक रिपॉजिटरी में सबूत फाइलें कमिट करने से पहले, उपयोगकर्ता को यह समीक्षा करने के लिए जिम्मेदार है कि क्या कैप्चर किया गया था। पूर्ण खतरे मॉडल, भेद्यता रिपोर्टिंग नीति और दायरे के लिए [`SECURITY.md`](SECURITY.md) देखें।

## वर्तमान ऑडिट

| ऑडिट | स्थिति | पकड़ता है | सबूत |
|---|---|---|---|
| [cognitive-load](audits/cognitive-load/) | स्थिर v0.2 + एक बार प्रत्यक्ष उपयोग परीक्षण किया गया | भार विस्थापन, छिपी जटिलता, AI विश्वास का बोझ, स्थिति-परिवर्तन विफलता | PT0 (claude.ai), PT1 (GitHub), PT2-doc-fallback (Outlook), Dogfood-1 (research-os handbook) |
| [low-vision](audits/low-vision/) | दबाव परीक्षण किया गया v0.1.0 | वास्तविक घनत्व के तहत दृश्य पहुंच (ज़ूम/रीफ्लो, फ़ोटो और चार्ट पर कंट्रास्ट, कस्टम थीम के अंतर्गत फोकस, स्थानिक अभिविन्यास) | PT0 (MDN ARIA दस्तावेज़) — 10 निष्कर्ष, 2C/4H, 4/4 कठोर-विफलता पैटर्न को हिट किया |
| [screen-reader-task](audits/screen-reader-task/) | दबाव परीक्षण किया गया v0.1.0 | स्क्रीन रीडर के माध्यम से कार्य निरंतरता और पूर्णता - केवल ARIA वैधता नहीं | PT0 (react.dev/learn) — 13 निष्कर्ष, 2C/5H, 3/4 कठोर-विफलता पैटर्न को हिट किया |
| [color-dependence](audits/color-dependence/) | दबाव परीक्षण किया गया v0.1.0 | केवल रंग द्वारा व्यक्त अर्थ, जिसमें कंट्रास्ट-पास / ह्यू-फेल सीमा शामिल है | PT0 (microsoft/vscode GitHub Actions) — 10 निष्कर्ष, 1C/4H, 3/5 कठोर-विफलता पैटर्न को हिट किया |
| [motor-access](audits/motor-access/) | दबाव परीक्षण किया गया v0.1.0 | मोटर-बाधित उपयोगकर्ताओं के लिए इंटरैक्शन लागत (कीबोर्ड पथ, लक्ष्य आकार, ड्रैग निर्भरता, समय समाप्त, पूर्ववत) | PT0 (GOV.UK डिज़ाइन सिस्टम बहु-चरणीय पैटर्न) — 8 निष्कर्ष + 12 सकारात्मक अवलोकन, 0C/2H |
| [ai-trust-surface](audits/ai-trust-surface/) | दबाव परीक्षण किया गया v0.1.0 | मजबूर विश्वास, अपारदर्शी AI व्यवहार, AI त्रुटियों से कोई पुनर्प्राप्ति नहीं, कोई उत्पत्ति नहीं | PT0 (Bing SSR + प्रथम-पक्ष AI-विश्वास दस्तावेज़) — 9 निष्कर्ष (5H/4M), 4 देखे गए, अनुभाग 7 एक पुनरुत्पादनीय विफलता पर पारित हुआ |
| [motion-sensitivity](audits/motion-sensitivity/) | दबाव परीक्षण किया गया v0.1.0 | वेस्टिबुलर ट्रिगर, एनीमेशन सम्मान, कम गति को प्राथमिकता, फ्लैश/दौरे की सीमाएँ | पीटी0 (लीनियर.ऐप) — 3 निष्कर्ष (1एच/2एल) + 4 सकारात्मक अवलोकन, 0सी |

## ऑडिट परिवार

प्रत्येक ऑडिट को यह घोषित करना होगा कि *यह ऑडिट सामान्य स्कैनर द्वारा अनदेखी की जाने वाली किस समस्या का पता लगाता है?* संज्ञानात्मक भार के लिए, उत्तर है भार विस्थापन।

### भविष्य के ऑडिट (अभी तक तैयार नहीं)

वर्तमान में निर्दिष्ट सभी सात ऑडिट अब रिपॉजिटरी में हैं और **दबाव परीक्षण या उससे बेहतर** हैं (ऊपर *वर्तमान ऑडिट* देखें) — कोई भी मसौदा ऑडिट लंबित नहीं है। हाल ही में जोड़े गए दो, **एआई ट्रस्ट सरफेस** (`एटी`) और **मोशन सेंसिटिविटी** (`एमओ`), एक अध्ययन समूह द्वारा तैयार किए गए थे (अनुसंधान → बाहरी उद्धरण सत्यापन → लेखक) और पिछले चार की तरह ही दबाव परीक्षण किया गया था। आगे के ऑडिट मांग-आधारित हैं, काल्पनिक नहीं — एक समय में एक जोड़ा जाता है, सबूतों के साथ, जब कोई वास्तविक लक्ष्य और अनुसंधान-आधारित मानदंड कार्य को उचित ठहराते हैं। [रोडमैप](ROADMAP.md) उन उम्मीदवारों और जीवनचक्र-विकास कार्यों (पीटी1 → फ्रीज) को ट्रैक करता है जो पहले से ही यहां मौजूद ऑडिट के लिए हैं।

## रिपॉजिटरी संरचना

```
interface-audits/
├── README.md
├── CHANGELOG.md                       # monorepo events
├── ROADMAP.md                         # forward plan: audits, tooling, process rules
├── SECURITY.md                        # threat surface + reporting
├── SHIP_GATE.md                       # shipcheck quality gate
├── SCORECARD.md                       # pre/post-treatment scores
├── LICENSE                            # MIT
├── package.json                       # verify tooling + Node engines
├── verify.sh                          # one-command verification
├── scripts/
│   ├── verify-schemas.mjs             # JSON Schema validation
│   └── verify-links.mjs               # markdown relative-link check
├── shared/                            # cross-audit norms
│   ├── audit-lifecycle.md
│   ├── evidence-states.md
│   ├── severity-model.md
│   ├── finding-format.md
│   ├── pressure-test-protocol.md
│   └── schemas/
│       ├── finding.base.schema.json
│       └── scorecard.base.schema.json
└── audits/                            # one directory per audit; each has the same shape:
    │                                  #   README.md · RUBRIC.md · CHANGELOG.md ·
    │                                  #   skill/SKILL.md · schemas/finding.extensions.json · evidence/
    ├── cognitive-load/                # Frozen v0.2 + Dogfooded
    ├── low-vision/                    # Pressure-tested v0.1.0  (LV)
    ├── screen-reader-task/            # Pressure-tested v0.1.0  (SR)
    ├── color-dependence/              # Pressure-tested v0.1.0  (CD)
    ├── motor-access/                  # Pressure-tested v0.1.0  (MA)
    ├── ai-trust-surface/              # Pressure-tested v0.1.0  (AT)
    └── motion-sensitivity/            # Pressure-tested v0.1.0  (MO)
```

## यह क्या नहीं है

- यह डब्ल्यूसीएजी अनुरूपता स्कैनर नहीं है (इसके लिए [एक्स](https://www.deque.com/axe/), [लाइटहाउस](https://developer.chrome.com/docs/lighthouse), [पी11वाई](https://pa11y.org/) का उपयोग करें)
- यह दृश्य डिजाइन समीक्षा नहीं है
- यह कोई सामान्य पहुंच चेकलिस्ट नहीं है
- यह अभी तक प्रकाशित एनपीएम पैकेज नहीं है (अभी तक — `package.json` में `private: true` घोषित किया गया है जब तक कि एक रनर पैकेज को अलग नहीं कर दिया जाता)

इस रिपॉजिटरी में ऑडिट का उद्देश्य उन इंटरफेस पर लागू करना है जो **स्कैनर पास करते हैं लेकिन फिर भी उपयोगकर्ताओं को खोज करने के लिए मजबूर करते हैं**।

## योगदान

यह रिपॉजिटरी वर्तमान में [डॉगफूड-लैब](https://github.com/dogfood-lab) द्वारा बनाए रखा जाता है। बाहरी योगदान का स्वागत है — किसी भी नए ऑडिट या मानदंड परिवर्तन पर चर्चा करने के लिए पहले एक मुद्दा खोलें। जीवनचक्र के अनुसार: कोई सबूत नहीं, कोई आधिकारिक ऑडिट नहीं।

## लाइसेंस

[एमआईटी](LICENSE) — कॉपीराइट (सी) 2026 डॉगफूड-लैब।

---

<p align="center">
  <em>Part of <a href="https://github.com/dogfood-lab">dogfood-lab</a> — sister to <a href="https://github.com/mcp-tool-shop-org">mcp-tool-shop-org</a>.</em>
</p>
