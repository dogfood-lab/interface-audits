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

`interface-audits` ऑडिट मानदंडों और उन निष्पादन योग्य कौशल का एक संग्रह है जो उन्हें चलाते हैं। प्रत्येक ऑडिट उपयोगकर्ता-उन्मुख विफलताओं की एक विशिष्ट श्रेणी को पकड़ता है जिसे सामान्य एक्सेसिबिलिटी स्कैनर अनदेखा करते हैं। स्कैनर WCAG उल्लंघनों को पकड़ते हैं; ये ऑडिट उन इंटरफेस को पकड़ते हैं जो **स्कैनर को पास करते हैं लेकिन फिर भी उपयोगकर्ताओं को खोज करने के लिए मजबूर करते हैं**।

इस लाइब्रेरी में पहला ऑडिट **संज्ञानात्मक भार** है, जो भार विस्थापन को पकड़ता है: ऐसे इंटरफेस जो स्मृति, खोज, विश्वास, सत्यापन, नेविगेशन, कॉन्फ़िगरेशन, स्रोत पुनर्प्राप्ति, दृश्य डिकोडिंग, समय, पुनर्प्राप्ति/पूर्ववत, या सुविधा हानि पर बोझ डालते हैं।

प्रत्येक ऑडिट में चार चीजें शामिल होती हैं:

1. **मानदंड** - सिद्धांत, अनुभाग, गंभीरता नियम ([`audits/cognitive-load/RUBRIC.md`](audits/cognitive-load/RUBRIC.md))
2. **कौशल** - आह्वान अनुबंध और प्रक्रिया ([`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md))
3. **स्कीमा** - निष्कर्षों और स्कोरकार्ड के लिए JSON स्कीमा ([`shared/schemas/`](shared/schemas/))
4. **सबूत** - कम से कम एक पूर्ण दबाव परीक्षण या परीक्षण रन ([`audits/cognitive-load/evidence/`](audits/cognitive-load/evidence/))

कोई सबूत नहीं, कोई आधिकारिक ऑडिट नहीं। राज्य मशीन के लिए [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md) और आगे क्या आने वाला है, इसके लिए [`ROADMAP.md`](ROADMAP.md) देखें।

## इंस्टॉल करें

अधिकांश उपयोगकर्ता इस रिपॉजिटरी को "इंस्टॉल" नहीं करते हैं - वे इसे पढ़ते हैं। ऑडिट मार्कडाउन मानदंड और कौशल हैं जिनकी व्याख्या [Claude](https://claude.ai) या उपयुक्त MCP टूल (ब्राउज़र नेविगेशन, स्क्रीनशॉट, DOM रीड) के साथ किसी अन्य संगत AI रनर द्वारा की जाती है।

उन रखरखावकर्ताओं के लिए जो स्थानीय सत्यापन टूलिंग (स्कीमा सत्यापन, लिंक जांच, शिपचेक ऑडिट) चलाना चाहते हैं:

```bash
git clone https://github.com/dogfood-lab/interface-audits.git
cd interface-audits
npm install        # installs ajv, ajv-formats, glob (dev-only)
npm run verify     # runs schema + link + shipcheck checks
```

**आवश्यकताएं:** सत्यापन टूलिंग के लिए नोड 20+। ऑडिट स्वयं प्लेटफ़ॉर्म-अज्ञेयवादी मार्कडाउन हैं।

## उपयोग

### ऑडिट चलाना

क्लॉड (या संगत रनर) के माध्यम से आह्वान करें:

> `<target-url-or-surface>` पर संज्ञानात्मक-भार ऑडिट चलाएं

पूर्ण ट्रिगर सूची, इनपुट, आउटपुट और प्रक्रिया के लिए [`audits/cognitive-load/skill/SKILL.md`](audits/cognitive-load/skill/SKILL.md) देखें।

### मौजूदा ऑडिट पढ़ना

पिछले ऑडिट रन `audits/<name>/evidence/<run-id>/` के अंतर्गत मौजूद हैं और उनमें तीन फाइलें होती हैं:

- `<audit>-findings.md` - मानदंड प्रारूप में पूर्ण निष्कर्ष
- `<audit>-scorecard.json` - प्रति-अनुभाग पास/चेतावनी/विफल + सारांश
- `remediation-priority-list.md` - गंभीरता × लाभ के अनुसार क्रमबद्ध निष्कर्ष

वर्तमान ऑडिट और उनके सबूत नीचे [वर्तमान ऑडिट](#current-audits) तालिका में हैं।

### एक नया ऑडिट बनाना

एक नया ऑडिट पांच जीवनचक्र अवस्थाओं से गुजरता है: मसौदा → दबाव-परीक्षण → स्थिर → परीक्षण → संशोधित। राज्य मशीन के लिए [`shared/audit-lifecycle.md`](shared/audit-lifecycle.md), प्रक्रिया के लिए [`shared/pressure-test-protocol.md`](shared/pressure-test-protocol.md) और संदर्भ कार्यान्वयन के रूप में `audits/cognitive-load/` पर संज्ञानात्मक-भार ऑडिट देखें।

## खतरे की सतह

जब एक ऑडिट कौशल को आह्वान किया जाता है, तो रनर (उचित MCP टूल के साथ क्लॉड) उपयोगकर्ता द्वारा प्रदान किए गए लक्ष्य के विरुद्ध संचालन करता है:

- **नेटवर्क आउटगोइंग** - केवल उस लक्ष्य URL पर जिसे उपयोगकर्ता ने नामित किया है। कौशल अन्य सेवाओं को कॉल नहीं करते हैं।
- **DOM और स्क्रीनशॉट कैप्चर** - कौशल पृष्ठ DOM को पढ़ सकता है, स्क्रीनशॉट ले सकता है और उत्तरदायी CSS कक्षाओं का निरीक्षण कर सकता है। कैप्चर की गई सामग्री में लक्ष्य URL पर उपयोगकर्ता के प्रमाणित सत्र पर दिखाई देने वाली कोई भी चीज़ शामिल हो सकती है, जिसमें नाम, संदेश निकाय और खाता स्थिति शामिल है।
- **स्थानीय फ़ाइल लेखन** - सबूत फ़ाइलों को केवल रिपॉजिटरी के कार्यशील ट्री के अंतर्गत `audits/<name>/evidence/<run-id>/` में लिखा जाता है। कौशल इस दायरे के बाहर नहीं लिखते हैं।
- **सबूत का कोई आउटबाउंड प्रसारण नहीं** - जब तक कि उपयोगकर्ता स्पष्ट रूप से उन्हें कमिट और पुश न करे, सबूत फ़ाइलें स्थानीय डिस्क पर रहती हैं।
- **कोई टेलीमेट्री नहीं, कोई गुप्त जानकारी नहीं** - यह रिपॉजिटरी कोई विश्लेषिकी एकत्र नहीं करता है और कोई क्रेडेंशियल नहीं पढ़ता है।

सार्वजनिक रिपॉजिटरी में सबूत फ़ाइलों को कमिट करने से पहले, उपयोगकर्ता यह समीक्षा करने के लिए जिम्मेदार है कि क्या कैप्चर किया गया था। पूर्ण खतरे के मॉडल, भेद्यता रिपोर्टिंग नीति और दायरे के लिए [`SECURITY.md`](SECURITY.md) देखें।

## वर्तमान ऑडिट

| ऑडिट | अवस्था | पकड़ता है | सबूत |
|---|---|---|---|
| [cognitive-load](audits/cognitive-load/) | स्थिर v0.2 + एक बार परीक्षण किया गया | भार विस्थापन, छिपी जटिलता, AI विश्वास बोझ, राज्य-स्थानांतरण विफलता | PT0 (claude.ai), PT1 (GitHub), PT2-doc-fallback (Outlook), Dogfood-1 (research-os handbook) |
| [low-vision](audits/low-vision/) | दबाव-परीक्षण v0.1.0 | वास्तविक घनत्व के तहत दृश्य पहुंच (ज़ूम/रीफ़्लो, फ़ोटो और चार्ट पर कंट्रास्ट, कस्टम थीम के तहत फ़ोकस, स्थानिक अभिविन्यास) | PT0 (MDN ARIA दस्तावेज़) - 10 निष्कर्ष, 2C/4H, 4/4 हार्ड-विफलता पैटर्न को हिट किया |
| [screen-reader-task](audits/screen-reader-task/) | दबाव-परीक्षण v0.1.0 | स्क्रीन रीडर के माध्यम से कार्य निरंतरता और पूर्णता - केवल ARIA वैधता नहीं | PT0 (react.dev/learn) - 13 निष्कर्ष, 2C/5H, 3/4 हार्ड-विफलता पैटर्न को हिट किया |
| [color-dependence](audits/color-dependence/) | दबाव-परीक्षण v0.1.0 | केवल रंग द्वारा व्यक्त अर्थ, जिसमें कंट्रास्ट-पास / ह्यू-फेल सीमा शामिल है | PT0 (microsoft/vscode GitHub Actions) - 10 निष्कर्ष, 1C/4H, 3/5 हार्ड-विफलता पैटर्न को हिट किया |
| [motor-access](audits/motor-access/) | दबाव-परीक्षण v0.1.0 | मोटर-बाधित उपयोगकर्ताओं के लिए इंटरैक्शन लागत (कीबोर्ड पथ, लक्ष्य आकार, ड्रैग निर्भरता, समय समाप्त, पूर्ववत) | PT0 (GOV.UK डिज़ाइन सिस्टम बहु-चरणीय पैटर्न) - 8 निष्कर्ष + 12 सकारात्मक अवलोकन, 0C/2H |

## ऑडिट परिवार

प्रत्येक ऑडिट को यह घोषित करना चाहिए कि *यह ऑडिट सामान्य स्कैनर द्वारा अनदेखा किए गए किस बोझ को पकड़ता है?* संज्ञानात्मक भार के लिए, उत्तर भार विस्थापन है।

### प्रगति में मसौदे (2026-06-02 को बनाया गया, अभी तक दबाव-परीक्षण नहीं किया गया)

रिपॉजिटरी में चार मसौदा ऑडिट मौजूद हैं, जिनमें से प्रत्येक में चार तत्वों का पूरा ढांचा (मानदंड + कौशल + स्कीमा + पीटी0 उम्मीदवार की सूची) है, लेकिन इसमें प्रमाण शामिल नहीं हैं। जीवनचक्र के अनुसार, जब तक उनमें कम से कम एक दबाव परीक्षण न हो, तब तक उन्हें ऊपर दी गई *वर्तमान ऑडिट* तालिका में सूचीबद्ध नहीं किया जाता है। प्रत्येक ऑडिट के लिए, ऑडिट-विशिष्ट सुधारों का विवरण देखने के लिए, इसकी चेंजलॉग देखें (उद्धरणों को arXiv/DOI/W3C स्रोतों के विरुद्ध एक पुनर्प्राप्ति ओरेकल द्वारा सत्यापित किया गया था; एक नकली DOI और कई गलत जिम्मेदारियों को कमिट करने से पहले ठीक किया गया)।

| मसौदा ऑडिट | उपसर्ग | पकड़ता है |
|---|---|---|
| [low-vision](audits/low-vision/) | `LV` | वास्तविक घनत्व के तहत दृश्य पहुंच — ज़ूम और रिफ्लो, तस्वीरों और चार्ट पर कंट्रास्ट, कस्टम थीम के तहत फोकस दृश्यता, आवर्धन के तहत स्थानिक अभिविन्यास |
| [screen-reader-task](audits/screen-reader-task/) | `SR` | स्क्रीन रीडर के माध्यम से कार्य *पूर्ण करना* — केवल एआरआईए वैधता ही नहीं |
| [color-dependence](audits/color-dependence/) | `CD` | केवल रंग द्वारा व्यक्त अर्थ — जिसमें कंट्रास्ट-पास / ह्यू-फेल सीमा भी शामिल है, जिसे स्कैनर नहीं देख सकते |
| [motor-access](audits/motor-access/) | `MA` | मोटर-बाधित उपयोगकर्ताओं के लिए इंटरैक्शन लागत — कीबोर्ड पथ, लक्ष्य सटीकता, ड्रैग निर्भरता, समय सीमा का दबाव, पूर्ववत करें |

### भविष्य के ऑडिट (अभी तक तैयार नहीं)

गति संवेदनशीलता (वेस्टिबुलर ट्रिगर, `prefers-reduced-motion`) और एआई ट्रस्ट सरफेस (मजबूर ट्रस्ट, अपारदर्शी एआई व्यवहार, उत्पत्ति) [रोडमैप](ROADMAP.md) पर बने रहेंगे। ऑडिट एक-एक करके जोड़े जाते हैं, प्रमाण के साथ, जब कोई वास्तविक लक्ष्य काम को उचित ठहराता है — केवल अटकलों के आधार पर नहीं।

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

- यह WCAG अनुरूपता स्कैनर नहीं है (इसके लिए [axe](https://www.deque.com/axe/), [Lighthouse](https://developer.chrome.com/docs/lighthouse), [Pa11y](https://pa11y.org/) का उपयोग करें)
- यह दृश्य डिजाइन समीक्षा नहीं है
- यह कोई सामान्य पहुंच चेकलिस्ट नहीं है
- यह अभी तक प्रकाशित npm पैकेज नहीं है (अभी तक — `package.json` में `private: true` घोषित है, जब तक कि एक रनर पैकेज को अलग नहीं किया जाता)

इस रिपॉजिटरी में ऑडिट का उद्देश्य उन इंटरफेस पर लागू करना है जो **स्कैनर को पास करते हैं, लेकिन फिर भी उपयोगकर्ताओं को खोज करने के लिए मजबूर करते हैं**।

## योगदान

यह रिपॉजिटरी वर्तमान में [dogfood-lab](https://github.com/dogfood-lab) द्वारा अनुरक्षित है। बाहरी योगदान का स्वागत है — किसी भी नए ऑडिट या मानदंड परिवर्तन पर चर्चा करने के लिए पहले एक मुद्दा खोलें। जीवनचक्र के अनुसार: कोई प्रमाण नहीं, कोई आधिकारिक ऑडिट नहीं।

## लाइसेंस

[MIT](LICENSE) — कॉपीराइट (c) 2026 dogfood-lab.

---

<p align="center">
  <em>Part of <a href="https://github.com/dogfood-lab">dogfood-lab</a> — sister to <a href="https://github.com/mcp-tool-shop-org">mcp-tool-shop-org</a>.</em>
</p>
