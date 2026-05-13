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

`interface-audits` एक ऑडिट दिशानिर्देशों और उन निष्पादन योग्य कौशल का संग्रह है जो उन्हें चलाते हैं। प्रत्येक ऑडिट एक विशिष्ट प्रकार की उपयोगकर्ता-सामना करने वाली विफलता को पकड़ता है जिसे सामान्य पहुंच स्कैनिंग उपकरण चूक जाते हैं। स्कैनर WCAG (वेब कंटेंट एक्सेसिबिलिटी गाइडलाइन्स) के उल्लंघन को पकड़ते हैं; ये ऑडिट उन इंटरफेस को पकड़ते हैं जो **स्कैनर में सफल होते हैं लेकिन फिर भी उपयोगकर्ताओं को परेशानी का सामना करना पड़ता है**।

इस लाइब्रेरी में पहला ऑडिट **संज्ञानात्मक भार (Cognitive Load)** है, जो भार के स्थानांतरण को पकड़ता है: ऐसे इंटरफेस जो स्मृति, खोज, विश्वास, सत्यापन, नेविगेशन, कॉन्फ़िगरेशन, स्रोत पुनर्प्राप्ति, दृश्य डिकोडिंग, समय, पुनर्प्राप्ति/रद्द करना, या सुविधाओं के नुकसान पर बोझ डालते हैं।

प्रत्येक ऑडिट में चार चीजें शामिल होती हैं:

1. **दिशानिर्देश (Rubric)** — सिद्धांत, अनुभाग, गंभीरता नियम ([`audits/cognitive-load/RUBRIC.md`](audits/cognitive-load/RUBRIC.md))
2. **कौशल (Skill)** — आह्वान अनुबंध और प्रक्रिया ([`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md))
3. **स्कीमा (Schema)** — निष्कर्षों और स्कोरकार्ड के लिए JSON स्कीमा ([`shared/schemas/`](shared/schemas/))
4. **सबूत (Evidence)** — कम से कम एक पूर्ण दबाव परीक्षण या परीक्षण रन ([`audits/cognitive-load/evidence/`](audits/cognitive-load/evidence/))

बिना किसी सबूत के, कोई आधिकारिक ऑडिट नहीं होता है। स्थिति मशीन के लिए [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) देखें।

## स्थापना

अधिकांश उपयोगकर्ता इस रिपॉजिटरी को "स्थापित" नहीं करते हैं - वे इसे पढ़ते हैं। ऑडिट मार्कडाउन दिशानिर्देश और कौशल हैं जिन्हें [Claude](https://claude.ai) या किसी अन्य संगत AI रनर द्वारा व्याख्यायित किया जाता है, जिसमें उपयुक्त MCP (मशीन-पठनीय प्रोटोकॉल) उपकरण (ब्राउज़र नेविगेशन, स्क्रीनशॉट, DOM रीड) शामिल हैं।

उन रखरखावकर्ताओं के लिए जो स्थानीय सत्यापन टूल (स्कीमा सत्यापन, लिंक जांच, शिपचेक ऑडिट) चलाना चाहते हैं:

```bash
git clone https://github.com/dogfood-lab/interface-audits.git
cd interface-audits
npm install        # installs ajv, ajv-formats, glob (dev-only)
npm run verify     # runs schema + link + shipcheck checks
```

**आवश्यकताएं:** सत्यापन टूल के लिए Node 20+। स्वयं ऑडिट प्लेटफ़ॉर्म-स्वतंत्र मार्कडाउन हैं।

## उपयोग

### एक ऑडिट चलाना

Claude (या एक संगत रनर) के माध्यम से आह्वान करें:

> `<target-url-or-surface>` पर संज्ञानात्मक-भार ऑडिट चलाएं।

पूर्ण ट्रिगर सूची, इनपुट, आउटपुट और प्रक्रिया के लिए [`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md) देखें।

### मौजूदा ऑडिट पढ़ना

पिछले ऑडिट रन `audits/<name>/evidence/<run-id>/` के अंतर्गत मौजूद होते हैं और उनमें तीन फाइलें होती हैं:

- `<audit>-findings.md` — दिशानिर्देश प्रारूप में पूर्ण निष्कर्ष
- `<audit>-scorecard.json` — प्रत्येक अनुभाग के लिए पास/चेतावनी/विफल + सारांश
- `remediation-priority-list.md` — गंभीरता × लाभ के आधार पर क्रमबद्ध निष्कर्ष

वर्तमान ऑडिट और उनके संबंधित प्रमाण नीचे दी गई तालिका [Current audits](#current-audits) में दिए गए हैं।

### एक नया ऑडिट बनाना

एक नया ऑडिट पांच जीवनचक्र अवस्थाओं से गुजरता है: ड्राफ्ट → दबाव परीक्षण → स्थिर → परीक्षण → संशोधित। स्थिति मशीन के लिए [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) देखें, प्रक्रिया के लिए [`shared/pressure-test-protocol.md`](shared/pressure-test-protocol.md) देखें, और `audits/cognitive-load/` में संज्ञानात्मक-भार ऑडिट को एक संदर्भ कार्यान्वयन के रूप में देखें।

## खतरे का क्षेत्र

जब कोई ऑडिट कौशल आह्वान किया जाता है, तो रनर (उपयुक्त MCP उपकरणों के साथ Claude) उपयोगकर्ता द्वारा प्रदान किए गए लक्ष्य के विरुद्ध संचालन करता है:

- **नेटवर्क से बाहर डेटा भेजना** — केवल उस लक्षित यूआरएल पर, जिसे उपयोगकर्ता ने निर्दिष्ट किया है। अन्य सेवाओं को कॉल नहीं किया जाता है।
- **डीओएम (DOM) और स्क्रीनशॉट कैप्चर** — यह सुविधा पृष्ठ के डीओएम को पढ़ सकती है, स्क्रीनशॉट ले सकती है और रिस्पॉन्सिव सीएसएस (CSS) कक्षाओं का निरीक्षण कर सकती है। कैप्चर की गई सामग्री में लक्षित यूआरएल पर उपयोगकर्ता के प्रमाणित सत्र में दिखाई देने वाली कोई भी चीज़ शामिल हो सकती है, जिसमें नाम, संदेश निकाय और खाता स्थिति शामिल हैं।
- **स्थानीय फ़ाइल लेखन** — साक्ष्य फ़ाइलें केवल रिपॉजिटरी के वर्किंग ट्री के अंतर्गत `audits/<नाम>/evidence/<रन-आईडी>/` में लिखी जाती हैं। यह सुविधा इस दायरे से बाहर कुछ भी नहीं लिखती है।
- **साक्ष्य का कोई बाहरी प्रसारण नहीं** — साक्ष्य फ़ाइलें स्थानीय डिस्क पर ही रहती हैं, जब तक कि उपयोगकर्ता स्पष्ट रूप से उन्हें कमिट (commit) और पुश (push) नहीं करता है।
- **कोई टेलीमेट्री (telemetry) नहीं, कोई गुप्त जानकारी प्रबंधन नहीं** — यह रिपॉजिटरी कोई विश्लेषण एकत्र नहीं करती है और कोई भी क्रेडेंशियल (credentials) नहीं पढ़ती है।

किसी सार्वजनिक रिपॉजिटरी में साक्ष्य फ़ाइलों को कमिट करने से पहले, उपयोगकर्ता यह सुनिश्चित करने के लिए जिम्मेदार है कि क्या कैप्चर किया गया है। पूर्ण खतरे के मॉडल, भेद्यता रिपोर्टिंग नीति और दायरे के लिए [`SECURITY.md`](SECURITY.md) देखें।

## वर्तमान ऑडिट

| ऑडिट | स्थिति | पकड़े गए मामले | साक्ष्य |
|---|---|---|---|
| [cognitive-load](audits/cognitive-load/) | फ्रीज्ड (Frozen) v0.2 + एक बार आंतरिक परीक्षण किया गया | लोड शिफ्ट (load displacement), छिपी हुई जटिलता, एआई (AI) पर विश्वास का बोझ, स्थिति परिवर्तन विफलता | PT0 (claude.ai), PT1 (GitHub), PT2-doc-fallback (Outlook), Dogfood-1 (research-os handbook) |

## ऑडिट परिवार

प्रत्येक ऑडिट को यह घोषित करना होगा कि *यह ऑडिट किस समस्या को पकड़ता है जिसे सामान्य स्कैनर (generic scanners) मिस (miss) करते हैं?* संज्ञानात्मक भार (Cognitive Load) के लिए, उत्तर है लोड शिफ्ट (load displacement)।

इस परिवार में भविष्य के ऑडिट में लो-विज़न (Low-Vision) (वास्तविक घनत्व के तहत दृश्य पहुंच), स्क्रीन रीडर टास्क (स्क्रीन रीडर टास्क) (कार्य निरंतरता, केवल एआरआईए (ARIA) वैधता नहीं), रंग निर्भरता, मोटर एक्सेस, गति संवेदनशीलता और एआई (AI) विश्वास सतह शामिल हो सकते हैं। ऑडिट को वास्तविक लक्ष्य के आधार पर, एक-एक करके जोड़ा जाता है, अटकलों के आधार पर नहीं।

## रिपॉजिटरी संरचना

```
interface-audits/
├── README.md
├── CHANGELOG.md                       # monorepo events
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
└── audits/
    └── cognitive-load/                # first audit
        ├── README.md
        ├── RUBRIC.md
        ├── CHANGELOG.md
        ├── skill/SKILL.md
        ├── schemas/finding.extensions.json
        └── evidence/                  # pressure tests + dogfood runs
```

## यह क्या नहीं है

- यह डब्ल्यूसीएजी (WCAG) अनुपालन स्कैनर नहीं है (इसके लिए [axe](https://www.deque.com/axe/), [Lighthouse](https://developer.chrome.com/docs/lighthouse), [Pa11y](https://pa11y.org/) का उपयोग करें)।
- यह दृश्य डिजाइन समीक्षा नहीं है।
- यह सामान्य पहुंच योग्यता जांच सूची नहीं है।
- यह प्रकाशित एनपीएम (npm) पैकेज नहीं है (अभी तक — `package.json` में `private: true` घोषित है जब तक कि एक रनर पैकेज अलग से नहीं बनाया जाता)।

इस रिपॉजिटरी में मौजूद ऑडिट उन इंटरफेस पर चलने के लिए डिज़ाइन किए गए हैं जो **स्कैनर में पास हो जाते हैं लेकिन फिर भी उपयोगकर्ताओं को संघर्ष करना पड़ता है।**

## योगदान

यह रिपॉजिटरी वर्तमान में [dogfood-lab](https://github.com/dogfood-lab) द्वारा अनुरक्षित है। बाहरी योगदान का स्वागत है — किसी भी नए ऑडिट या नियम में बदलाव पर चर्चा करने के लिए पहले एक मुद्दा (issue) खोलें। जीवनचक्र के अनुसार: कोई साक्ष्य नहीं, कोई आधिकारिक ऑडिट नहीं।

## लाइसेंस

[एमआईटी (MIT)](LICENSE) — कॉपीराइट (c) 2026 dogfood-lab।

---

<p align="center">
  <em>Part of <a href="https://github.com/dogfood-lab">dogfood-lab</a> — sister to <a href="https://github.com/mcp-tool-shop-org">mcp-tool-shop-org</a>.</em>
</p>
