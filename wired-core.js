/* 🧮 통신 3사 인터넷 · TV 위약금 — 상품표 · 산식 (계산기와 강CRM이 같이 써요)
   · 계산기: <script src="wired-core.js"> · 강CRM: /telecom-calc/wired-core.js (같은 사이트)
   · 상품 · 가격이 바뀌면 여기만 고치면 둘 다 바뀌어요 */
(function (g) {
  'use strict';
  const CARRIER_DATA = {
      SK: {
        name: 'SKT',
        color: '#ea580c',
        thresholdDays: 240, 
        baseDenominatorDays: 855, 
        vatExNet: true,   // 💸 SK 해지 문자 확인 (2026-11): 인터넷 · 와이파이(공유기) 반환금은 부가세 뺀 할인액으로 계산 · TV · 셋톱은 부가세 포함
        btnActive: 'border-orange-500 bg-orange-50 text-orange-600 shadow-sm',
        tvTitle: '📺 Btv & 셋톱박스 선택 (3년 약정)',
        bundleTitle: '📱 SK 결합할인 선택 (3년 약정)',
        bundles: [
          { id: 'sk_wire_only', group: 'current', name: '무선결합 미적용 (요즘우리집결합)', wireDisc: { 100: 2200, 500: 5500, 1000: 5500, 2500: 5500, 5000: 5500 }, mobileDisc: 0, desc: '인터넷(최대 -5,500원) + TV(-2,200원) 유선 결합할인 적용', default: true },
          { id: 'sk_family', group: 'current', name: '요즘 가족 결합 (유무선 결합)', wireDisc: { 100: 0, 500: 0, 1000: 0, 2500: 0, 5000: 0 }, mobileDiscSpeed: { 100: 4400, 500: 12100, 1000: 13200, 2500: 13200, 5000: 13200 }, desc: '인터넷 요금 할인 (100M: 4.4천원 / 500M: 1.21만원 / 1G: 1.32만원)' },
          { id: 'sk_on_30', group: 'current', name: 'T끼리 온가족할인 (30년 이상 / 50%)', isRate: true, rate: 0.5, isPenaltyWaived: true, desc: '3년 약정 기준가의 50% 감면 (★결합할인 위약금 전액 면제)' },
          { id: 'sk_on_20', group: 'current', name: 'T끼리 온가족할인 (20~30년 / 30%)', isRate: true, rate: 0.3, isPenaltyWaived: true, desc: '3년 약정 기준가의 30% 감면 (★결합할인 위약금 전액 면제)' },
          { id: 'sk_on_10', group: 'current', name: 'T끼리 온가족할인 (10~20년 / 10%)', isRate: true, rate: 0.1, isPenaltyWaived: true, desc: '3년 약정 기준가의 10% 감면 (★결합할인 위약금 전액 면제)' },
          { id: 'sk_legacy_plan', group: 'legacy', name: '[구] 온가족플랜 (2회선 이상)', wireDisc: { 100: 5500, 500: 11110, 1000: 11110, 2500: 11110, 5000: 11110 }, mobileDisc: 0, desc: '인터넷 요금 정액 감면 (100M: -5,500원 / 500M·1G: -11,110원)' },
          { id: 'sk_legacy_free', group: 'legacy', name: '[구] 온가족프리 (1~4회선)', wireDisc: { 100: 3300, 500: 4400, 1000: 5500, 2500: 5500, 5000: 5500 }, mobileDisc: 3300, hasMobilePenalty: true, desc: '인터넷 할인(-3,300~5,500원) + 모바일 회선당 할인' },
          { id: 'sk_legacy_single', group: 'legacy', name: '[구] 한가족할인 (모바일 1회선)', wireDisc: { 100: 8800, 500: 13200, 1000: 13200, 2500: 13200, 5000: 13200 }, mobileDisc: 0, desc: '인터넷 요금 할인 (100M: -8,800원 / 500M: -13,200원)' },
          { id: 'sk_legacy_allfree', group: 'legacy', name: '[구] 온가족무료 (3회선 인터넷 무료)', wireDisc: { 100: 22000, 500: 22000, 1000: 22000, 2500: 22000, 5000: 22000 }, mobileDisc: 0, desc: '100M 인터넷 기본료 전액 감면 (-22,000원/월)' }
        ],
        tabs: [{ id: 'wifi', name: 'WIFI 결합형' }, { id: 'basic', name: '기본 인터넷' }],
        internet: {
          wifi: [
            { id: 'sk_w500m', name: '기가라이트인터넷 와이파이 (500M)', price: 34100, noContract: 59400, speed: 500, default: true },
            { id: 'sk_w100m', name: '광랜인터넷 와이파이 (100M)', price: 23100, noContract: 46200, speed: 100 },
            { id: 'sk_w1g', name: '기가인터넷 와이파이 (1G)', price: 39600, noContract: 64900, speed: 1000 },
            { id: 'sk_x2.5g', name: '기가프리미엄 X2.5', price: 44000, noContract: 71500, speed: 2500 },
            { id: 'sk_x5g', name: '기가프리미엄 X5', price: 55000, noContract: 77000, speed: 5000 }
          ],
          basic: [
            { id: 'sk_500m', name: '기가라이트 500M', price: 33000, noContract: 49500, speed: 500, default: true },
            { id: 'sk_100m', name: '광랜인터넷 100M', price: 22000, noContract: 36300, speed: 100 },
            { id: 'sk_1g', name: '기가인터넷 1G', price: 38500, noContract: 55000, speed: 1000 }
          ]
        },
        wifiHw: {
          wifi: [
            { id: 'band_giga', name: 'Giga WiFi (기본포함)', price: 0, noContract: 3300, default: true },
            { id: 'wifi7', name: 'Giga WiFi 7 (업그레이드)', price: 1100, noContract: 4400 },   // 📶 무약정 4,400 → 3년 약정 3,300 할인 = 1,100 (SK 가입 화면)
            { id: 'sk_old_giga_free', name: '[구] 기가 와이파이 (기본포함)', price: 0, noContract: 0 },
            { id: 'none', name: '공유기 미적용', price: 0, noContract: 0 }
          ],
          basic: [
            { id: 'band_giga', name: 'band Giga WiFi', price: 1100, noContract: 4400, default: true },
            { id: 'wifi7', name: 'Giga WiFi 7', price: 3300, noContract: 7700 },
            { id: 'sk_old_wifi', name: '[구] 일반 와이파이 (100M)', price: 1100, noContract: 3300 },
            { id: 'sk_old_giga', name: '[구] 기가 와이파이 (Giga)', price: 2200, noContract: 5500 },
            { id: 'sk_old_prem', name: '[구] 기가 와이파이 프리미엄', price: 5500, noContract: 13200 },
            { id: 'none', name: '공유기 미적용', price: 0, noContract: 0 }
          ]
        },
        tv: [
          { id: 'std', name: 'Btv 스탠다드 (235ch)', price: 15400, discountPrice: 13200, noContract: 22000, discount: 2200, default: true },
          { id: 'eco', name: 'Btv 이코노미 (183ch)', price: 12100, discountPrice: 9900, noContract: 18700, discount: 2200 },
          { id: 'all', name: 'Btv ALL (257ch)', price: 18700, discountPrice: 16500, noContract: 25300, discount: 2200 },
          { id: 'all_plus', name: 'B tv All + (257ch)', price: 24200, discountPrice: 22000, noContract: 31900, discount: 2200 },
          { id: 'none', name: 'Btv 미적용', price: 0, discountPrice: 0, noContract: 0, discount: 0 }
        ],
        stb: [
          { id: 'smart3', name: '스마트3 셋톱', price: 4400, noContract: 9900, default: true },
          { id: 'smart3_mini', name: 'Smart 3 mini', price: 4400, noContract: 8800 },
          { id: 'ai5', name: 'AI 5 셋톱', price: 7700, noContract: 12100 },
          { id: 'ai4_vision', name: 'AI 4 Vision', price: 8800, noContract: 13200 },
          { id: 'apple_tv', name: 'Apple TV 4K', price: 6600, noContract: 13200 },
          { id: 'uhd3', name: '[구] UHD3 셋톱', price: 4400, noContract: 8800 },
          { id: 'none', name: '셋톱 미적용', price: 0, noContract: 0 }
        ]
      },
      KT: {
        name: 'KT',
        color: '#dc2626',
        thresholdDays: 180, 
        baseDenominatorDays: 915, 
        btnActive: 'border-red-500 bg-red-50 text-red-600 shadow-sm',
        tvTitle: '📺 지니TV & 기가지니 셋톱 선택 (3년 약정)',
        bundleTitle: '📱 KT 결합할인 선택 (3년 약정)',
        bundles: [
          { id: 'kt_wire_only', group: 'current', name: '무선결합 미적용 (인터넷+TV 유선결합)', wireDisc: { 100: 5500, 500: 5500, 1000: 5500, 2500: 5500 }, mobileDisc: 0, desc: '인터넷 -5,500원 + TV 결합할인 적용', default: true },
          { id: 'kt_total', group: 'current', name: '총액 결합할인 (모바일 결합)', wireDisc: { 100: 5500, 500: 5500, 1000: 5500, 2500: 5500 }, mobileDiscSpeed: { 100: 3300, 500: 5500, 1000: 5500, 2500: 5500 }, desc: '인터넷 총 8.8천~1.1만원 할인 (유선 -5,500 + 모바일기여분)' },
          { id: 'kt_single', group: 'current', name: '프리미엄 싱글결합 (모바일 25% 전용)', wireDisc: { 100: 5500, 500: 5500, 1000: 5500, 2500: 5500 }, mobileDisc: 0, desc: '인터넷 유선 -5,500원 (모바일 청구서에서 월 25% 추가할인)' },
          { id: 'kt_family_50', group: 'current', name: '패밀리 결합 (모회선 50% 할인)', isRate: true, rate: 0.5, isPenaltyWaived: true, desc: '3년 약정 기준가의 50% 감면 (★결합할인 위약금 면제)' },
          { id: 'kt_legacy_olleh', group: 'legacy', name: '[구] 인터넷 뭉치면올레 (2회선 이상)', wireDisc: { 100: 22000, 500: 27500, 1000: 27500, 2500: 27500 }, mobileDisc: 0, desc: '100M 인터넷 무료(-22,000원) / 500M(-27,500원 할인)' },
          { id: 'kt_legacy_lte', group: 'legacy', name: '[구] LTE 뭉치면올레', wireDisc: { 100: 5500, 500: 5500, 1000: 5500, 2500: 5500 }, mobileDisc: 5500, hasMobilePenalty: true, desc: '인터넷 -5,500원 + 모바일 요금제별 할인' },
          { id: 'kt_legacy_fam_wire', group: 'legacy', name: '[구] 우리가족무선결합 (모바일할인 전용)', wireDisc: { 100: 5500, 500: 5500, 1000: 5500, 2500: 5500 }, mobileDisc: 0, desc: '인터넷 유선결합 -5,500원 (모바일 청구서에서 정액할인)' }
        ],
        tabs: [{ id: 'kt_giga_wi', name: '기가 Wi 결합' }, { id: 'kt_safe_pkg', name: '안심인터넷 패키지' }, { id: 'kt_basic', name: '기본 인터넷' }],
        internet: {
          kt_giga_wi: [
            { id: 'kt_basic_wi', name: '인터넷 베이직 와이파이 (500M)', price: 34100, noContract: 55000, speed: 500, default: true },
            { id: 'kt_slim_wi', name: '인터넷 슬림 와이파이 (100M)', price: 23100, noContract: 48400, speed: 100 },
            { id: 'kt_ess_wi', name: '인터넷 에센스 와이파이 (1G)', price: 38500, noContract: 63800, speed: 1000 },
            { id: 'kt_prem_wi', name: '인터넷 프리미엄 와이파이 (2.5G)', price: 44000, noContract: 66000, speed: 2500 }
          ],
          kt_safe_pkg: [
            { id: 'kt_basic_s', name: '인터넷 베이직팩S (500M)', price: 34650, noContract: 49500, speed: 500, default: true },
            { id: 'kt_slim_s', name: '인터넷 슬림팩S (100M)', price: 23650, noContract: 42900, speed: 100 },
            { id: 'kt_ess_s', name: '인터넷 에센스팩S (1G)', price: 40150, noContract: 60500, speed: 1000 }
          ],
          kt_basic: [
            { id: 'kt_b_basic', name: '인터넷 베이직 (500M)', price: 33000, noContract: 46200, speed: 500, default: true },
            { id: 'kt_b_slim', name: '인터넷 슬림 (100M)', price: 22000, noContract: 39600, speed: 100 },
            { id: 'kt_b_ess', name: '인터넷 에센스 (1G)', price: 38500, noContract: 55000, speed: 1000 },
            { id: 'kt_b_slimplus', name: '인터넷 슬림플러스 (200M)', price: 30250, noContract: 41800, speed: 200 },
            { id: 'kt_b_prem', name: '인터넷 프리미엄 (2.5G)', price: 44000, noContract: 60500, speed: 2500 },
            { id: 'kt_b_premplus', name: '인터넷 프리미엄플러스 (5G)', price: 60500, noContract: 82500, speed: 5000 },
          ]
        },
        wifiHw: {
          kt_giga_wi: [
            { id: 'kt_ax', name: '기가 와이파이 홈 ax (기본포함)', price: 0, noContract: 4400, default: true },
            { id: 'kt_wifi7d', name: 'KT WiFi 7D (업그레이드)', price: 1100, noContract: 6600 },
            { id: 'kt_old_giga_free', name: '[구] 기가 와이파이 홈 (기본포함)', price: 0, noContract: 0 },
            { id: 'none', name: '공유기 미적용', price: 0, noContract: 0 }
          ],
          kt_safe_pkg: [
            { id: 'kt_ax', name: '기가 와이파이 홈 ax (기본포함)', price: 0, noContract: 4400, default: true },
            { id: 'kt_wifi7d', name: 'KT WiFi 7D (업그레이드)', price: 1100, noContract: 6600 },
            { id: 'none', name: '공유기 미적용', price: 0, noContract: 0 }
          ],
          kt_basic: [
            { id: 'kt_ax', name: '기가 와이파이 홈 ax', price: 2200, noContract: 4400, default: true },
            { id: 'kt_wifi7d', name: 'KT WiFi 7D', price: 3850, noContract: 6600 },
            { id: 'kt_old_wifi', name: '[구] 홈 와이파이 (100M)', price: 1100, noContract: 3300 },
            { id: 'kt_old_giga', name: '[구] 기가 와이파이 홈', price: 3300, noContract: 5500 },
            { id: 'kt_old_prem', name: '[구] 기가 와이파이 프리미엄', price: 5500, noContract: 11000 },
            { id: 'none', name: '공유기 미적용', price: 0, noContract: 0 }
          ]
        },
        tv: [
          { id: 'kt_disney_all_g', name: '지니 TV 디즈니+ 모든G (255ch/디즈니+)', price: 28100, discountPrice: 21500, noContract: 36630, discount: 6600 },
          { id: 'kt_all_g', name: '지니 TV 모든G (255ch/25만편VOD)', price: 23540, discountPrice: 19800, noContract: 28930, discount: 3740 },
          { id: 'kt_ess', name: '지니 TV 에센스 (268ch)', price: 20240, discountPrice: 16500, noContract: 25300, discount: 3740 },
          { id: 'kt_lite', name: '지니 TV 라이트 (242ch)', price: 15840, discountPrice: 13200, noContract: 19800, discount: 2640, default: true },
          { id: 'kt_basic', name: '지니 TV 베이직 (238ch)', price: 14740, discountPrice: 12100, noContract: 18150, discount: 2640 },
          { id: 'none', name: '미적용', price: 0, discountPrice: 0, noContract: 0, discount: 0 }
        ],
        stb: [
          { id: 'kt_g4', name: '기가지니4 셋톱', price: 6600, noContract: 11000, default: true },
          { id: 'kt_g3', name: '기가지니3 셋톱', price: 4400, noContract: 8800 },
          { id: 'kt_ga', name: '기가지니A 셋톱', price: 3300, noContract: 6600 },
          { id: 'kt_soundbar', name: '지니TV 사운드바', price: 8800, noContract: 13200 },
          { id: 'kt_uhd4', name: '일반 UHD4 셋톱', price: 4400, noContract: 8800 },
          { id: 'kt_g2', name: '[구] 기가지니2', price: 4400, noContract: 8800 },
          { id: 'none', name: '셋톱 미적용', price: 0, noContract: 0 }
        ]
      },
      LG: {
        name: 'LGU+',
        color: '#e11d48',
        thresholdDays: 240,
        baseDenominatorDays: 855,
        btnActive: 'border-rose-500 bg-rose-50 text-rose-600 shadow-sm',
        tvTitle: '📺 U+tv & 셋톱박스 선택 (3년 약정)',
        bundleTitle: '📱 LG 결합할인 선택 (3년 약정)',
        bundles: [
          { id: 'lg_wire_only', group: 'current', name: '무선결합 미적용 (인터넷+TV 유선결합)', wireDisc: { 100: 5500, 200: 5500, 500: 5500, 1000: 5500, 2500: 5500 }, mobileDisc: 0, desc: '인터넷 -5,500원 + TV -2,200원 유선결합 할인 적용', default: true },
          { id: 'lg_cham', group: 'current', name: '참 쉬운 가족결합 (유무선 결합)', wireDisc: { 100: 5500, 200: 5500, 500: 5500, 1000: 5500, 2500: 5500 }, mobileDiscSpeed: { 100: 5500, 200: 5500, 500: 9900, 1000: 13200, 2500: 13200 }, desc: '인터넷 총 1.1만~1.87만원 할인 (유선 -5,500 + 속도별 모바일 추가할인)' },
          { id: 'lg_together', group: 'current', name: 'U+투게더 결합', wireDisc: { 100: 5500, 200: 5500, 500: 5500, 1000: 5500, 2500: 5500 }, mobileDiscSpeed: { 100: 11000, 200: 11000, 500: 11000, 1000: 11000, 2500: 11000 }, desc: '인터넷 11,000원 추가할인' },
          { id: 'lg_legacy_home', group: 'legacy', name: '[구] 한방에Home (한방에홈 1/2)', wireDisc: { 100: 8800, 200: 8800, 500: 11000, 1000: 11000, 2500: 11000 }, mobileDisc: 0, desc: '인터넷 정액 감면 (100M: -8,800원 / 500M·1G: -11,000원)' },
          { id: 'lg_legacy_love', group: 'legacy', name: '[구] 가족무한사랑 (유무선 결합)', wireDisc: { 100: 5500, 200: 5500, 500: 5500, 1000: 5500, 2500: 5500 }, mobileDisc: 5500, hasMobilePenalty: true, desc: '인터넷 -5,500원 + 모바일 총액구간별 할인' },
          { id: 'lg_legacy_yo', group: 'legacy', name: '[구] 한방에yo (한방에YO)', wireDisc: { 100: 5500, 200: 5500, 500: 5500, 1000: 5500, 2500: 5500 }, mobileDisc: 0, desc: '인터넷 기본할인 유지 (모바일 청구서에서 회선당 할인)' }
        ],
        tabs: [
          { id: 'lg_basic', name: '기본상품' }, 
          { id: 'lg_prem_comp', name: '프리미엄 안심 보상' }, 
          { id: 'lg_prem_safe', name: '프리미엄 안심' }, 
          { id: 'lg_smart_giga', name: '스마트기가' }
        ],
        internet: {
          lg_basic: [
            { id: 'lg_b_500', name: '와이파이기본 기가 Slim안심 500M', price: 33000, noContract: 56100, speed: 500, default: true },
            { id: 'lg_b_100', name: '와이파이기본 광랜 안심 100M', price: 22000, noContract: 39600, speed: 100 },
            { id: 'lg_b_200', name: '와이파이기본 안심 200M', price: 25300, noContract: 46200, speed: 200 },
            { id: 'lg_b_1g', name: '와이파이기본 기가 안심 1G', price: 38500, noContract: 64900, speed: 1000 },
            { id: 'lg_b_2_5g', name: '와이파이기본 2.5기가', price: 44000, noContract: 69300, speed: 2500 },
            { id: 'lg_b_2_5g_s', name: '와이파이기본 2.5기가 안심', price: 45100, noContract: 72600, speed: 2500 },
            { id: 'lg_b_5g', name: '와이파이기본 5기가', price: 58300, noContract: 80300, speed: 5000 },
          ],
          lg_prem_comp: [
            { id: 'lg_pc_500', name: '프리미엄 안심 보상 500M', price: 39600, noContract: 74800, speed: 500, default: true },
            { id: 'lg_pc_100', name: '프리미엄 안심 보상 100M', price: 27500, noContract: 51700, speed: 100 },
            { id: 'lg_pc_200', name: '프리미엄 안심 보상 200M', price: 30800, noContract: 58300, speed: 200 },
            { id: 'lg_pc_1g', name: '프리미엄 안심 보상 1G', price: 45100, noContract: 85800, speed: 1000 }
          ],
          lg_prem_safe: [
            { id: 'lg_ps_500', name: '프리미엄 안심 500M', price: 37400, noContract: 70400, speed: 500, default: true },
            { id: 'lg_ps_100', name: '프리미엄 안심 100M', price: 25300, noContract: 47300, speed: 100 },
            { id: 'lg_ps_200', name: '프리미엄 안심 200M', price: 28600, noContract: 53900, speed: 200 },
            { id: 'lg_ps_1g', name: '프리미엄 안심 1기가', price: 42900, noContract: 81400, speed: 1000 }
          ],
          lg_smart_giga: [
            { id: 'lg_sg_500', name: '스마트기가 최대 500M', price: 35200, noContract: 58300, speed: 500, default: true },
            { id: 'lg_sg_1g', name: '스마트기가 최대 1G', price: 40700, noContract: 67100, speed: 1000 },
            { id: 'lg_sg_2_5g', name: '스마트기가 최대 2.5G', price: 47300, noContract: 75900, speed: 2500 }
          ]
        },
        wifiHw: {
          default: [
            { id: 'lg_wifi6_1', name: '기가WiFi6 1대 (기본제공)', price: 0, noContract: 3300, default: true },
            { id: 'lg_wifi_giga', name: '기가WiFi (기본제공)', price: 0, noContract: 3300 },
            { id: 'lg_wifi7_1', name: '기가WiFi7 (기본제공)', price: 0, noContract: 3300 },
            { id: 'lg_wifi6_2', name: '기가WiFi6 2대 (기본제공)', price: 0, noContract: 0 },
            { id: 'lg_wifi_spk', name: '기가WiFi + 스마트홈 스피커 (기본제공)', price: 0, noContract: 0 },
            { id: 'lg_wifi6_spk', name: '기가WiFi6 + 스마트홈 스피커 (기본제공)', price: 0, noContract: 0 },
            { id: 'lg_wifi_prem', name: '기가WiFi 프리미엄', price: 5500, noContract: 11000 },
            { id: 'lg_old_giga_free', name: '[구] 기가 와이파이 (무료)', price: 0, noContract: 0 },
            { id: 'lg_old_wifi', name: '[구] 일반 와이파이 (100M)', price: 1100, noContract: 4400 },
            { id: 'lg_old_giga', name: '[구] 기가 와이파이 (유료)', price: 2200, noContract: 5500 },
            { id: 'none', name: '공유기 미적용', price: 0, noContract: 0 }
          ]
        },
        tv: [
          { id: 'lg_prem', name: '프리미엄 TV (257ch)', price: 18700, discountPrice: 16500, noContract: 22000, discount: 2200, default: true },
          { id: 'lg_adv', name: '고급형 TV (235ch)', price: 17600, discountPrice: 15400, noContract: 20900, discount: 2200 },
          { id: 'lg_basic', name: '기본형 TV (222ch)', price: 16500, discountPrice: 14300, noContract: 20900, discount: 2200 },
          { id: 'lg_tv_basic211', name: '베이직 TV (211ch)', price: 14300, discountPrice: 12100, noContract: 17600, discount: 2200 },
          { id: 'lg_eco', name: '실속형 TV (216ch)', price: 15400, discountPrice: 13200, noContract: 19800, discount: 2200 },
          { id: 'lg_old_std', name: '[구] 일반형 TV', price: 13090, discountPrice: 10890, noContract: 16390, discount: 2200 },
          { id: 'lg_old_basic', name: '[구] 보급형 TV', price: 10890, discountPrice: 8690, noContract: 14190, discount: 2200 },
          { id: 'none', name: 'U+tv 미적용', price: 0, discountPrice: 0, noContract: 0, discount: 0 }
        ],
        stb: [
          { id: 'lg_uhd4', name: '4K UHD4 셋톱', price: 4400, noContract: 9900, default: true },
          { id: 'lg_snd2', name: 'U+ TV 사운드바2', price: 8800, noContract: 14300 },
          { id: 'lg_snd_blk', name: '사운드바 블랙', price: 6600, noContract: 12100 },
          { id: 'lg_uhd3', name: '[구] UHD3 셋톱', price: 4400, noContract: 9900 },
          { id: 'none', name: '셋톱 미적용', price: 0, noContract: 0 }
        ]
      }
    };
  const DAY_M = 30.4167;
  const OLD_RATE_TABLE = {
    LG: [[9, .85], [12, .80], [18, .30], [21, .25], [24, 0], [28, -.10], [32, -.25], [34, -.85], [36, -1.70]],
    KT: [[6, 1], [12, .70], [16, .35], [20, .25], [24, 0], [28, -.10], [32, -.25], [34, -.70], [36, -1.80]],
    SK: [[8, 1], [12, .90], [16, .35], [20, .10], [24, 0], [28, -.15], [32, -.50], [34, -.80], [36, -1.70]]
  };
  // 위약금5 ('23.9~11 개편 이후): 받은 할인 누적 · 기준일 지나면 남은 기간 비율
  function pen5(m, days, ck) {
    if (days <= 0 || m <= 0 || days >= 1095) return 0;
    const c = CARRIER_DATA[ck];
    const acc = (m / DAY_M) * days;
    return days <= c.thresholdDays ? acc : acc * (Math.max(0, 1095 - days) / c.baseDenominatorDays);
  }
  // 위약금4 ('16.04.01 ~ 개편 전): 구간별 할인액 × 반환율의 합
  function pen4(m, days, ck) {
    if (days <= 0 || m <= 0 || days >= 1095) return 0;
    const dd = m / DAY_M, tbl = OLD_RATE_TABLE[ck];
    let p = 0;
    for (let d = 1; d <= days; d++) {
      const mo = Math.ceil(d / DAY_M);
      p += dd * (tbl.find(([upTo]) => mo <= upTo) || tbl[tbl.length - 1])[1];
    }
    return Math.max(0, p);
  }
  // 위약금3 ('16.03.31 이전)
  function pen3(m, days, ck) {
    if (days <= 0 || m <= 0 || days >= 1095) return 0;
    const dd = m / DAY_M;
    if (ck === 'LG') return dd * days;
    if (days <= 365) return days * dd;
    if (days <= 730) return 365 * dd + (days - 365) * dd * 0.5;
    return 365 * dd + 365 * dd * 0.5;
  }
  function penalty(ptype, m, d, ck) { return ptype === '5' ? pen5(m, d, ck) : (ptype === '4' ? pen4(m, d, ck) : pen3(m, d, ck)); }
  const REFORM = { KT: '2023-09-08', SK: '2023-09-27', LG: '2023-11-01' };
  function autoPtype(ck, start) { const s = String(start || '').slice(0, 10); if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null; return s < '2016-04-01' ? '3' : (s < REFORM[ck] ? '4' : '5'); }
  function bundleDiscounts(bundle, intObj) {
    if (bundle.isRate && bundle.rate) return { wire: 0, mobile: Math.round(intObj.price * bundle.rate) };
    const sp = intObj.speed || 500;
    const wire = bundle.wireDisc ? (bundle.wireDisc[sp] || bundle.wireDisc[500] || 0) : 0;
    const mobile = bundle.mobileDiscSpeed ? (bundle.mobileDiscSpeed[sp] || bundle.mobileDiscSpeed[500] || 0) : (bundle.mobileDisc || 0);
    return { wire, mobile };
  }
  const dflt = (list) => (list || []).find(x => x.default) || (list || [])[0];
  const pd = (v) => { const [y, m, d] = String(v).split('-').map(Number); return new Date(y, m - 1, d); };
  const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  /* 강CRM 고객의 상품 이름(인터넷 · TV · 결합)으로 계산기 상품 고르기 — 못 찾으면 계산기 기본값 (matched로 알려줌) */
  function guess(ck, o) {
    const c = CARRIER_DATA[ck]; if (!c) return null;
    const it = String((o && o.internet) || ''), tvt = String((o && o.tv) || ''), cb = String((o && o.combo) || '');
    const sp = /2\.5\s*G|X2\.5/i.test(it) ? 2500 : (/5\s*G|X5|5기가/i.test(it) ? 5000 : (/1\s*G|1기가|기가인터넷|에센스|\b1000\s*M/i.test(it) && !/기가\s*라이트|기가\s*slim|500/i.test(it) ? 1000 : (/200\s*M/i.test(it) ? 200 : (/100\s*M|광랜|슬림/i.test(it) ? 100 : (/500|기가\s*라이트|베이직|slim/i.test(it) ? 500 : 0)))));
    const wantWifi = /와이파이|wi-?fi|wifi|\bWi\b/i.test(it);
    let tab = c.tabs[0].id;
    if (ck === 'LG') { if (/스마트\s*기가/.test(it)) tab = 'lg_smart_giga'; else if (/보상/.test(it)) tab = 'lg_prem_comp'; else if (/프리미엄/.test(it)) tab = 'lg_prem_safe'; else tab = 'lg_basic'; }
    else if (ck === 'KT') tab = /팩\s*S|안심/i.test(it) ? 'kt_safe_pkg' : (wantWifi || !it ? 'kt_giga_wi' : 'kt_basic');
    else tab = wantWifi || !it ? 'wifi' : 'basic';
    if (!c.internet[tab]) tab = c.tabs[0].id;
    const ilist = c.internet[tab];
    const ihit = sp ? ilist.find(x => x.speed === sp) : null, intObj = ihit || dflt(ilist);
    const wlist = c.wifiHw[tab] || c.wifiHw.default || c.wifiHw[Object.keys(c.wifiHw)[0]];
    const norm = (s) => String(s).replace(/\(.*?\)|\s|tv|TV|B\s*tv|지니|U\+|\[구\]/gi, '').toLowerCase();
    const tvs = c.tv.filter(x => x.id !== 'none');
    let tvObj = !tvt.trim() || /^(없음|-|해당없음|미적용)$/.test(tvt.trim()) ? (c.tv.find(x => x.id === 'none') || c.tv[0]) : null, tvHit = !!tvObj;
    if (!tvObj) { const t = norm(tvt); tvObj = tvs.find(x => { const n = norm(x.name); return n && (t.includes(n) || n.includes(t)); }) || null; tvHit = !!tvObj; if (!tvObj) tvObj = dflt(c.tv); }
    const stbObj = tvObj.id === 'none' ? (c.stb.find(x => x.id === 'none') || dflt(c.stb)) : dflt(c.stb);
    const tvCount = /추가|2대|\+\s*1|두\s*대/.test(tvt) ? 2 : 1;
    const KEYS = [[/요즘\s*가족/, 'sk_family'], [/온가족\s*할인|T끼리/, 'sk_on_10'], [/온가족\s*플랜/, 'sk_legacy_plan'], [/온가족\s*프리/, 'sk_legacy_free'], [/한가족/, 'sk_legacy_single'], [/온가족\s*무료/, 'sk_legacy_allfree'],
      [/총액/, 'kt_total'], [/싱글/, 'kt_single'], [/패밀리/, 'kt_family_50'], [/LTE\s*뭉치/, 'kt_legacy_lte'], [/뭉치면/, 'kt_legacy_olleh'], [/우리가족/, 'kt_legacy_fam_wire'],
      [/참\s*쉬운/, 'lg_cham'], [/투게더/, 'lg_together'], [/한방에\s*yo/i, 'lg_legacy_yo'], [/한방에/, 'lg_legacy_home'], [/가족\s*무한/, 'lg_legacy_love']];
    const k = KEYS.find(([re, id]) => re.test(cb) && c.bundles.some(b => b.id === id));
    const bundleObj = k ? c.bundles.find(b => b.id === k[1]) : dflt(c.bundles);
    return { carrier: ck, tab, intId: intObj.id, wifiId: (dflt(wlist) || {}).id, tvId: tvObj.id, stbId: stbObj.id, tvCount, bundleId: bundleObj.id,
      names: { internet: intObj.name, tv: tvObj.id === 'none' ? '' : tvObj.name, bundle: bundleObj.name }, matched: { internet: !!ihit, tv: tvHit, bundle: !!k } };
  }
  /* 위약금 대략값 — 계산기 화면 compute()와 같은 식 (해지 전체 · 사은품 · 직접입력 없음) */
  function estimate(o) {
    const ck = o.carrier, c = CARRIER_DATA[ck]; if (!c || !o.start) return null;
    const end = o.end || ymd(new Date());
    const diff = Math.round((pd(end) - pd(o.start)) / 86400000);
    const days = Math.max(1, Math.min(1095, diff));
    const tab = c.internet[o.tab] ? o.tab : c.tabs[0].id;
    const intObj = (c.internet[tab] || []).find(x => x.id === o.intId) || dflt(c.internet[tab]);
    const wl = c.wifiHw[tab] || c.wifiHw.default || c.wifiHw[Object.keys(c.wifiHw)[0]];
    const wifiObj = wl.find(x => x.id === o.wifiId) || dflt(wl);
    const tvObj = c.tv.find(x => x.id === o.tvId) || c.tv[0], stbObj = c.stb.find(x => x.id === o.stbId) || c.stb[0];
    const two = o.tvCount === 2;
    const tv2 = { price: Math.round(tvObj.price * .5), noContract: Math.round(tvObj.noContract * .5), discount: Math.round((tvObj.discount || 0) * .5) }, stb2 = { price: Math.round(stbObj.price * .5), noContract: Math.round(stbObj.noContract * .5) };
    const bundleObj = c.bundles.find(b => b.id === o.bundleId) || dflt(c.bundles);
    let base = intObj.price + wifiObj.price + tvObj.price + stbObj.price; if (two) base += tv2.price + stb2.price;
    let tvDisc = (tvObj.price > 0 && intObj.price > 0) ? (tvObj.discount || 0) : 0; if (two && tv2.price > 0) tvDisc += tv2.discount;
    const { wire, mobile } = bundleDiscounts(bundleObj, intObj);
    const monthly = Math.max(0, base - tvDisc - wire - mobile);
    const vx = c.vatExNet ? 1 / 1.1 : 1;   // 💸 SK: 인터넷 · 와이파이는 부가세 빼고
    const mIntPlan = Math.max(0, intObj.noContract - intObj.price) * vx;
    let mTvPlan = Math.max(0, tvObj.noContract - tvObj.price); if (two) mTvPlan += Math.max(0, tv2.noContract - tv2.price);
    let mIntBund = bundleObj.isPenaltyWaived ? 0 : wire; if (bundleObj.hasMobilePenalty) mIntBund += mobile;
    const mTvBund = bundleObj.isPenaltyWaived ? 0 : tvDisc;
    const mWifi = Math.max(0, wifiObj.noContract - wifiObj.price) * vx; let mStb = Math.max(0, stbObj.noContract - stbObj.price); if (two) mStb += Math.max(0, stb2.noContract - stb2.price);
    const ptype = o.ptype || autoPtype(ck, o.start) || '5';
    // 📺 TV 약정 시작일이 따로면 (o.tvStart) TV 요금 · TV 결합 · 셋톱은 그 날짜로
    const tvDays = o.tvStart && /^\d{4}-\d{2}-\d{2}$/.test(o.tvStart) ? Math.max(1, Math.min(1095, Math.round((pd(end) - pd(o.tvStart)) / 86400000))) : days;
    const P = (m) => Math.round(penalty(ptype, m, days, ck)), PT = (m) => Math.round(penalty(ptype, m, tvDays, ck));
    const p = { internet: P(mIntPlan), tv: PT(mTvPlan), bundle: P(mIntBund) + PT(mTvBund), equip: P(mWifi) + PT(mStb) };
    const total = p.internet + p.tv + p.bundle + p.equip;
    const endD = pd(o.start); endD.setFullYear(endD.getFullYear() + 3);
    const usedM = Math.min(36, Math.round(days / DAY_M));
    return { carrier: ck, carrierName: c.name, ptype, days, tvDays, diff, usedM, remainM: Math.max(0, 36 - usedM), contractEnd: ymd(endD), monthly, p, total, badDate: diff < 0 };
  }
  /* ✏️ 매장에서 고친 상품 (강CRM 설정 → 유선 상품) — 기본표는 그대로 두고 고친 것 · 추가한 것만 덮어씀
     cfg = { items: { SK: { 'internet.wifi': [{ id, name, price, noContract, speed, hide }], 'wifiHw.wifi': [...], tv: [{ ..., discount }], stb: [...] } } } */
  const BASE = JSON.parse(JSON.stringify(CARRIER_DATA));
  const LIST_KEYS = ['internet', 'wifiHw', 'tv', 'stb'];
  function listOf(c, path) { const [a, t] = String(path || '').split('.'); if (!LIST_KEYS.includes(a)) return null; const L = t ? (c[a] && c[a][t]) : c[a]; return Array.isArray(L) ? L : null; }
  function applyCustom(cfg) {
    Object.keys(BASE).forEach(ck => { const c = CARRIER_DATA[ck], b = JSON.parse(JSON.stringify(BASE[ck])); LIST_KEYS.forEach(k => { c[k] = b[k]; }); });   // 늘 기본표에서 다시
    const items = (cfg && cfg.items) || {}, num = (v) => Math.max(0, Math.round(Number(v) || 0));
    Object.keys(items).forEach(ck => { const c = CARRIER_DATA[ck]; if (!c) return;
      Object.keys(items[ck] || {}).forEach(path => { const L = listOf(c, path), kind = String(path).split('.')[0]; if (!L) return;
        (items[ck][path] || []).forEach(x => { if (!x || !x.id) return; const i = L.findIndex(y => y.id === x.id);
          if (x.hide) { if (i >= 0 && L[i].id !== 'none' && L.length > 2) { const wasDefault = L[i].default; L.splice(i, 1); if (wasDefault && L[0]) L[0].default = true; } return; }
          const v = { name: String(x.name || (i >= 0 ? L[i].name : '') || '상품').slice(0, 60), price: num(x.price), noContract: num(x.noContract), custom: true };
          if (kind === 'tv') { v.discount = num(x.discount); v.discountPrice = Math.max(0, v.price - v.discount); }
          if (kind === 'internet') v.speed = Number(x.speed) > 0 ? Number(x.speed) : (i >= 0 ? L[i].speed : 500);
          if (i >= 0) Object.assign(L[i], v);
          else { const n = { id: String(x.id).slice(0, 40), ...v }, ni = L.findIndex(y => y.id === 'none'); if (ni >= 0) L.splice(ni, 0, n); else L.push(n); }
        });
      });
    });
    return CARRIER_DATA;
  }
  g.WiredCalc = { ver: '2026-11-08b', CARRIER_DATA, BASE, DAY_M, OLD_RATE_TABLE, penalty, autoPtype, bundleDiscounts, guess, estimate, applyCustom, listOf };
})(typeof window !== 'undefined' ? window : globalThis);
