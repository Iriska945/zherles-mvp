'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ru' | 'kk' | 'en';

const translations = {
  ru: {
    // Common
    'app.title': 'ЖЕРЛЕС',
    'app.tagline': 'Кросс-маркетинг локального бизнеса',
    'app.resetDemo': 'Сбросить демо',
    'app.dataResetFeedback': 'Данные сброшены!',
    'app.districtAlmaty': 'район, Алматы',
    'app.save': 'Сохранить',
    'app.cancel': 'Отмена',
    
    // Header
    'header.b2b': 'B2B Бизнес',
    'header.passport': 'Паспорт',
    'header.cabinet': 'Кабинет',
    
    // Landing Page
    'landing.hero.badge': 'Платформа Көрші-маршрутов',
    'landing.hero.live': 'LIVE: {count} заведений в коалиции',
    'landing.hero.title': 'Взаимный обмен клиентами',
    'landing.hero.desc': 'Создавайте совместные акции с соседями в {district} районе и привлекайте новых гостей без затрат на таргетинг.',
    'landing.hero.btn.b2b': 'Запустить Көрші-маршрут',
    'landing.hero.btn.b2c': 'Паспорт района для жителей',
    
    'landing.metrics.business': 'Ваш бизнес',
    'landing.metrics.partners': 'Партнеров в районе',
    'landing.metrics.activeLinks': '{count} активных Көрші-связей',
    'landing.metrics.campaigns': 'Запущенных акций',
    'landing.metrics.campaignsSub': 'Көрші-маршрутов',
    'landing.metrics.clients': 'Привлечено клиентов',
    'landing.metrics.clientsSub': 'в CRM базе',
    
    'landing.banner.b2b.badge': 'Для предпринимателей',
    'landing.banner.b2b.title': 'Объединяйтесь с соседями по району',
    'landing.banner.b2b.desc': 'Запустите бесплатный обмен кросс-промоциями. Выберите соседа и обменивайтесь постоянными клиентами без бюджета на маркетинг.',
    'landing.banner.b2b.btn.dashboard': 'Перейти в Дашборд',
    'landing.banner.b2b.btn.connect': 'Подключить бизнес',
    
    'landing.banner.b2c.badge': 'Для жителей микрорайона',
    'landing.banner.b2c.title': 'Цифровой Паспорт Вашего района',
    'landing.banner.b2c.desc': 'Откройте для себя скидки, спецпредложения и подарки от проверенных кофеен, салонов и спортивных клубов вашего микрорайона в одном удобном QR-паспорте.',
    'landing.banner.b2c.btn': 'Открыть Паспорт района',
    
    // Map
    'map.title': 'Интерактивная карта Алматы',
    'map.heading': 'Локальные партнеры микрорайона',
    'map.hint': 'Кликните на пин или карточку заведения, чтобы открыть его Паспорт района.',
    'map.allDistricts': 'Все районы',
    'map.districtActive': 'Район: {district}',
    'map.placesCount': '{count} мест',
    'map.coalitionTitle': 'Заведения в коалиции ({count})',
    'map.coalitionSub': 'Нажмите для подробного паспорта',
    'map.yourBusiness': 'Ваш бизнес',
    'map.avgCheck': 'Средний чек',
    'map.openPassport': 'Открыть Паспорт заведения',
    'map.matching': 'Совместимость {score}%',
    
    // B2C Cabinet
    'cabinet.title': 'Личный кабинет Көрші',
    'cabinet.subtitle': 'Накапливайте бонусы, поднимайте уровень и получайте повышенную скидку в заведениях Алматы',
    'cabinet.login': 'Вход',
    'cabinet.register': 'Регистрация',
    'cabinet.phone': 'Номер телефона',
    'cabinet.name': 'Ваше имя',
    'cabinet.email': 'Email (необязательно)',
    'cabinet.password': 'Пароль',
    'cabinet.btn.register': 'Создать аккаунт',
    'cabinet.btn.login': 'Войти',
    'cabinet.welcomeBonus': 'При регистрации на ваш счет автоматически зачисляется +200 баллов в качестве приветственного бонуса!',
    
    'cabinet.welcomeUser': 'С возвращением,',
    'cabinet.level': 'Уровень',
    'cabinet.balance': 'Мои бонусы',
    'cabinet.discount': 'Сетевая скидка',
    'cabinet.visits': 'Посещения',
    'cabinet.history': 'История бонусов',
    'cabinet.noTransactions': 'Транзакций пока нет',
    'cabinet.activeCoupons': 'Активные купоны ({count})',
    'cabinet.noCoupons': 'У вас нет активных купонов. Получите их, посещая заведения партнеров!',
    'cabinet.logout': 'Выйти',
    'cabinet.toNextLevel': 'До следующего уровня: {points} баллов',
    'cabinet.maxLevel': 'Максимальный уровень достигнут!',
    
    // Tiers
    'tier.new': 'Сосед-Новичок',
    'tier.active': 'Активный Көрші',
    'tier.honored': 'Почетный Көрші',
    'tier.legend': 'Легенда Района',

    // Product Explanation
    'explain.title': 'Как работает ЖЕРЛЕС?',
    'explain.heading': 'Как работают Көрші-маршруты?',
    'explain.step1.title': 'Локальная коалиция',
    'explain.step1.desc': 'Неконкурирующие заведения одного микрорайона (кофейня, барбершоп, фитнес, цветы) объединяются в партнерскую сеть без рекламных расходов.',
    'explain.step2.title': 'Запуск Көрші-маршрута',
    'explain.step2.desc': 'Бизнесы обмениваются взаимными акциями. Клиент кофейни получает купон со скидкой в салон, а гость салона — подарок в кофейне.',
    'explain.step3.title': 'Паспорт района для жителей',
    'explain.step3.desc': 'Жители микрорайона получают единый цифровой Паспорт с бонусами и привилегиями, обеспечивая регулярный и лояльный клиентопоток.',

    // B2C Passport
    'passport.title': 'Паспорт района',
    'passport.desc': 'Единый эко-паспорт района. Скидки и бонусы в лучших локальных заведениях.',
    'passport.hasPin': 'Есть PIN-код?',
    'passport.quickRedeem': 'Погашение за 2 сек',
    'passport.enter': 'Ввести',
    'passport.myStatus': 'Мой статус',
    'passport.networkDiscount': 'Скидка сети',
    'passport.visits': 'Визитов: {count}',
    'passport.goal': 'Цель: {count}',
    'passport.holidayBonuses': 'Праздничные бонусы',
    'passport.pinSelected': 'Выбран бонус по PIN:',
    'passport.reset': 'Сбросить',
    'passport.activeOffers': 'Активные предложения района ({count})',
    'passport.dealActive': 'Активен',
    'passport.minSpend': 'При чеке от {amount} ₸',
    'passport.showPinToCashier': 'ПИН-код для показа кассиру:',
    'passport.qrPinCode': 'QR / PIN код',
    'passport.redeem': 'Погасить',
    'passport.shareOffer': 'Поделиться предложением:',
    'passport.redeemByPinButton': 'Погасить бонус по PIN-коду',
    'passport.loading': 'Загрузка Паспорта района...',
    'passport.showQrPrompt': 'Покажите QR на кассе',
    'passport.cashierInstruction': 'Кассир отсканирует QR или введет PIN-код',
    'passport.pinForRedeem': 'ПИН-код для гашения',
    'passport.goToRedemption': 'Перейти к гашению бонуса',
    'passport.shareCode': 'Поделиться этим кодом:'
  },
  kk: {
    // Common
    'app.title': 'ЖЕРЛЕС',
    'app.tagline': 'Жергілікті бизнестің кросс-маркетингі',
    'app.resetDemo': 'Демоны тазарту',
    'app.districtAlmaty': 'ауданы, Алматы',
    'app.save': 'Сақтау',
    'app.cancel': 'Бас тарту',
    
    // Header
    'header.b2b': 'B2B Бизнес',
    'header.passport': 'Паспорт',
    'header.cabinet': 'Кабинет',
    
    // Landing Page
    'landing.hero.badge': 'Көрші-маршруттар платформасы',
    'landing.hero.live': 'LIVE: коалицияда {count} мекеме',
    'landing.hero.title': 'Клиенттермен өзара алмасу',
    'landing.hero.desc': 'Жергілікті заведениелермен бірлескен акциялар жасап, жаңа қонақтарды маркетингтік шығынсыз тартыңыз ({district} ауданы).',
    'landing.hero.btn.b2b': 'Көрші-маршрутты бастау',
    'landing.hero.btn.b2c': 'Тұрғындарға арналған аудан паспорты',
    
    'landing.metrics.business': 'Сіздің бизнесіңіз',
    'landing.metrics.partners': 'Аудандағы серіктестер',
    'landing.metrics.activeLinks': '{count} белсенді Көрші-байланыс',
    'landing.metrics.campaigns': 'Басталған акциялар',
    'landing.metrics.campaignsSub': 'Көрші-маршруттар',
    'landing.metrics.clients': 'Тартылған клиенттер',
    'landing.metrics.clientsSub': 'CRM базасында',
    
    'landing.banner.b2b.badge': 'Кәсіпкерлер үшін',
    'landing.banner.b2b.title': 'Аудан бойынша көршілермен бірігіңіз',
    'landing.banner.b2b.desc': 'Тегін кросс-промоциялармен алмасуды бастаңыз. Көршіңізді таңдап, маркетингтік бюджетсіз тұрақты клиенттермен алмасыңыз.',
    'landing.banner.b2b.btn.dashboard': 'Дашбордқа өту',
    'landing.banner.b2b.btn.connect': 'Бизнесті қосу',
    
    'landing.banner.b2c.badge': 'Аудан тұрғындары үшін',
    'landing.banner.b2c.title': 'Ауданыңыздың сандық Паспорты',
    'landing.banner.b2c.desc': 'Бір ыңғайлы QR-паспортта ауданыңыздағы сенімді кофеханалар, салондар мен спорт клубтарының жеңілдіктері мен сыйлықтарын ашыңыз.',
    'landing.banner.b2c.btn': 'Аудан паспортын ашу',
    
    // Map
    'map.title': 'Алматының интерактивті картасы',
    'map.heading': 'Ауданның жергілікті серіктестері',
    'map.hint': 'Аудан паспортын ашу үшін мекеменің пинін немесе картасын басыңыз.',
    'map.allDistricts': 'Барлық аудандар',
    'map.districtActive': 'Аудан: {district}',
    'map.placesCount': '{count} орын',
    'map.coalitionTitle': 'Коалициядағы мекемелер ({count})',
    'map.coalitionSub': 'Толық паспортты көру үшін басыңыз',
    'map.yourBusiness': 'Сіздің бизнесіңіз',
    'map.avgCheck': 'Орташа чек',
    'map.openPassport': 'Мекеме паспортын ашу',
    'map.matching': 'Сәйкестік {score}%',
    
    // B2C Cabinet
    'cabinet.title': 'Көршінің жеке кабинеті',
    'cabinet.subtitle': 'Алматы мекемелерінде бонустар жинап, деңгейіңізді көтеріңіз және жоғары жеңілдіктер алыңыз',
    'cabinet.login': 'Кіру',
    'cabinet.register': 'Тіркелу',
    'cabinet.phone': 'Телефон нөмірі',
    'cabinet.name': 'Сіздің есіміңіз',
    'cabinet.email': 'Email (міндетті емес)',
    'cabinet.password': 'Құпия сөз',
    'cabinet.btn.register': 'Тіркелу',
    'cabinet.btn.login': 'Кіру',
    'cabinet.welcomeBonus': 'Тіркелген кезде шотыңызға автоматты түрде +200 сәлемдесу бонусы аударылады!',
    
    'cabinet.welcomeUser': 'Қош келдіңіз,',
    'cabinet.level': 'Деңгей',
    'cabinet.balance': 'Менің бонустарым',
    'cabinet.discount': 'Желілік жеңілдік',
    'cabinet.visits': 'Бару саны',
    'cabinet.history': 'Бонустар тарихы',
    'cabinet.noTransactions': 'Әзірге транзакциялар жоқ',
    'cabinet.activeCoupons': 'Белсенді купондар ({count})',
    'cabinet.noCoupons': 'Сізде белсенді купондар жоқ. Серіктес мекемелерге барып, оларды алыңыз!',
    'cabinet.logout': 'Шығу',
    'cabinet.toNextLevel': 'Келесі деңгейге дейін: {points} ұпай',
    'cabinet.maxLevel': 'Максималды деңгейге жеттіңіз!',
    
    // Tiers
    'tier.new': 'Көрші-Жаңадан келген',
    'tier.active': 'Белсенді Көрші',
    'tier.honored': 'Құрметті Көрші',
    'tier.legend': 'Аудан аңызы',

    // Product Explanation
    'explain.title': 'ЖЕРЛЕС қалай жұмыс істейді?',
    'explain.heading': 'Көрші-маршруттар қалай жұмыс істейді?',
    'explain.step1.title': '1. Мекемелерге барыңыз',
    'explain.step1.desc': 'Коалицияның кез келген мүшесінен (мысалы, Zebra Coffee) тапсырыс беріңіз.',
    'explain.step2.title': '2. Кросс-купондар алыңыз',
    'explain.step2.desc': 'Көрші мекемелерге (мысалы, барбершоп немесе гүл салоны) жеңілдік QR-купонын алыңыз.',
    'explain.step3.title': '3. Ортақ бонустар жинаңыз',
    'explain.step3.desc': 'Аудандағы Көрші мәртебеңізді көтеріп, 20%-ға дейін тұрақты желілік жеңілдік алыңыз!',

    // B2C Passport
    'passport.title': 'Аудан паспорты',
    'passport.desc': 'Ауданның бірыңғай эко-паспорты. Үздік жергілікті мекемелердегі жеңілдіктер мен бонустар.',
    'passport.hasPin': 'PIN-код бар ма?',
    'passport.quickRedeem': '2 сек ішінде өтеу',
    'passport.enter': 'Енгізу',
    'passport.myStatus': 'Менің мәртебем',
    'passport.networkDiscount': 'Желілік жеңілдік',
    'passport.visits': 'Барулар: {count}',
    'passport.goal': 'Мақсат: {count}',
    'passport.holidayBonuses': 'Мерекелік бонустар',
    'passport.pinSelected': 'PIN бойынша бонус таңдалды:',
    'passport.reset': 'Тазарту',
    'passport.activeOffers': 'Ауданның белсенді ұсыныстары ({count})',
    'passport.dealActive': 'Белсенді',
    'passport.minSpend': 'Чек сомасы {amount} ₸ бастап',
    'passport.showPinToCashier': 'Кассирге көрсетуге арналған ПИН-код:',
    'passport.qrPinCode': 'QR / PIN код',
    'passport.redeem': 'Өтеу',
    'passport.shareOffer': 'Ұсыныспен бөлісу:',
    'passport.redeemByPinButton': 'Бонусты PIN-код арқылы өтеу',
    'passport.loading': 'Аудан паспорты жүктелуде...',
    'passport.showQrPrompt': 'Кассада QR көрсетіңіз',
    'passport.cashierInstruction': 'Кассир QR-кодты сканерлейді немесе PIN-кодты енгізеді',
    'passport.pinForRedeem': 'Өтеуге арналған ПІН-код',
    'passport.goToRedemption': 'Бонусты өтеуге өту',
    'passport.shareCode': 'Бұл кодпен бөлісу:'
  },
  en: {
    // Common
    'app.title': 'ZHERLES',
    'app.tagline': 'Local Business Cross-Marketing',
    'app.resetDemo': 'Reset Demo',
    'app.districtAlmaty': 'district, Almaty',
    'app.save': 'Save',
    'app.cancel': 'Cancel',
    
    // Header
    'header.b2b': 'B2B Business',
    'header.passport': 'Passport',
    'header.cabinet': 'Cabinet',
    
    // Landing Page
    'landing.hero.badge': 'Korshi-Routes Platform',
    'landing.hero.live': 'LIVE: {count} venues in coalition',
    'landing.hero.title': 'Mutual Customer Exchange',
    'landing.hero.desc': 'Create collaborative campaigns with neighbor venues in {district} district and acquire new guests without marketing costs.',
    'landing.hero.btn.b2b': 'Launch Korshi-Route',
    'landing.hero.btn.b2c': 'District Passport for Residents',
    
    'landing.metrics.business': 'Your Business',
    'landing.metrics.partners': 'Partners in District',
    'landing.metrics.activeLinks': '{count} active Korshi-links',
    'landing.metrics.campaigns': 'Active Campaigns',
    'landing.metrics.campaignsSub': 'Korshi-routes',
    'landing.metrics.clients': 'Customers Acquired',
    'landing.metrics.clientsSub': 'in CRM database',
    
    'landing.banner.b2b.badge': 'For Entrepreneurs',
    'landing.banner.b2b.title': 'Unite with District Neighbors',
    'landing.banner.b2b.desc': 'Launch free cross-promotion exchanges. Select a neighbor business and share regular clients without marketing budgets.',
    'landing.banner.b2b.btn.dashboard': 'Go to Dashboard',
    'landing.banner.b2b.btn.connect': 'Connect Business',
    
    'landing.banner.b2c.badge': 'For Neighborhood Residents',
    'landing.banner.b2c.title': 'Your District Digital Passport',
    'landing.banner.b2c.desc': 'Discover discounts, special offers, and gifts from verified coffee shops, salons, and sports clubs in your neighborhood in one convenient QR-passport.',
    'landing.banner.b2c.btn': 'Open District Passport',
    
    // Map
    'map.title': 'Interactive Map of Almaty',
    'map.heading': 'Local Neighborhood Partners',
    'map.hint': 'Click on a pin or venue card to open its District Passport.',
    'map.allDistricts': 'All districts',
    'map.districtActive': 'District: {district}',
    'map.placesCount': '{count} places',
    'map.coalitionTitle': 'Venues in Coalition ({count})',
    'map.coalitionSub': 'Click for detailed passport',
    'map.yourBusiness': 'Your Business',
    'map.avgCheck': 'Avg Check',
    'map.openPassport': 'Open Venue Passport',
    'map.matching': 'Compatibility {score}%',
    
    // B2C Cabinet
    'cabinet.title': 'Korshi Personal Account',
    'cabinet.subtitle': 'Accumulate points, tier up, and get enhanced discounts at Almaty local spots',
    'cabinet.login': 'Log In',
    'cabinet.register': 'Sign Up',
    'cabinet.phone': 'Phone Number',
    'cabinet.name': 'Your Name',
    'cabinet.email': 'Email (optional)',
    'cabinet.password': 'Password',
    'cabinet.btn.register': 'Create Account',
    'cabinet.btn.login': 'Log In',
    'cabinet.welcomeBonus': 'Upon registration, +200 welcome points are automatically credited to your account!',
    
    'cabinet.welcomeUser': 'Welcome back,',
    'cabinet.level': 'Tier',
    'cabinet.balance': 'My Points',
    'cabinet.discount': 'Network Discount',
    'cabinet.visits': 'Visits',
    'cabinet.history': 'Points History',
    'cabinet.noTransactions': 'No transactions yet',
    'cabinet.activeCoupons': 'Active Coupons ({count})',
    'cabinet.noCoupons': 'You have no active coupons. Get them by visiting partner venues!',
    'cabinet.logout': 'Log Out',
    'cabinet.toNextLevel': 'To next tier: {points} points',
    'cabinet.maxLevel': 'Maximum tier reached!',
    
    // Tiers
    'tier.new': 'Neighbor-Novice',
    'tier.active': 'Active Korshi',
    'tier.honored': 'Honored Korshi',
    'tier.legend': 'District Legend',

    // Product Explanation
    'explain.title': 'How ZHERLES Works',
    'explain.heading': 'How Korshi-routes work?',
    'explain.step1.title': '1. Visit partner spots',
    'explain.step1.desc': 'Order at any coalition member (e.g., Zebra Coffee).',
    'explain.step2.title': '2. Get cross-coupons',
    'explain.step2.desc': 'Receive a QR coupon for discounts to neighbors (e.g., nearby barbershop or flower salon).',
    'explain.step3.title': '3. Collect global rewards',
    'explain.step3.desc': 'Raise your Korshi status in the district and secure a permanent network discount up to 20%!',

    // B2C Passport
    'passport.title': 'District Passport',
    'passport.desc': 'Unified eco-passport of the district. Discounts and bonuses at the best local spots.',
    'passport.hasPin': 'Have a PIN code?',
    'passport.quickRedeem': 'Redeem in 2 sec',
    'passport.enter': 'Enter',
    'passport.myStatus': 'My Status',
    'passport.networkDiscount': 'Network Discount',
    'passport.visits': 'Visits: {count}',
    'passport.goal': 'Goal: {count}',
    'passport.holidayBonuses': 'Holiday Bonuses',
    'passport.pinSelected': 'Bonus selected by PIN:',
    'passport.reset': 'Reset',
    'passport.activeOffers': 'Active District Offers ({count})',
    'passport.dealActive': 'Active',
    'passport.minSpend': 'Min bill {amount} ₸',
    'passport.showPinToCashier': 'PIN code to show cashier:',
    'passport.qrPinCode': 'QR / PIN Code',
    'passport.redeem': 'Redeem',
    'passport.shareOffer': 'Share Offer:',
    'passport.redeemByPinButton': 'Redeem Bonus by PIN Code',
    'passport.loading': 'Loading District Passport...',
    'passport.showQrPrompt': 'Show QR at checkout',
    'passport.cashierInstruction': 'Cashier will scan the QR or enter the PIN code',
    'passport.pinForRedeem': 'PIN Code for Redemption',
    'passport.goToRedemption': 'Go to Bonus Redemption',
    'passport.shareCode': 'Share this code:'
  }
};

// Content translation map — for dynamic data like business categories, names, addresses, districts
const contentMap: Record<string, Record<string, string>> = {
  // Categories
  'Кофейня & Пекарня': { kk: 'Кофехана & Нан пісіру', en: 'Coffee & Bakery' },
  'Барбершоп & Мужской уход': { kk: 'Барбершоп & Ер адам күтімі', en: "Barbershop & Men's Grooming" },
  'Спорт & Фитнес': { kk: 'Спорт & Фитнес', en: 'Sports & Fitness' },
  'Цветы & Подарки': { kk: 'Гүлдер & Сыйлықтар', en: 'Flowers & Gifts' },
  'Выпечка & Десерты': { kk: 'Наубайхана & Десерттер', en: 'Pastry & Desserts' },
  'Кофейня': { kk: 'Кофехана', en: 'Coffee Shop' },

  // Business names (brand names kept as-is, only descriptive parts translated)
  'Urban Coffee': { kk: 'Urban Coffee', en: 'Urban Coffee' },
  'Барбершоп "ManCave"': { kk: 'Барбершоп "ManCave"', en: 'Barbershop "ManCave"' },
  'Фитнес-клуб "FitLife"': { kk: 'Фитнес-клуб "FitLife"', en: 'Fitness Club "FitLife"' },
  'Цветочная студия "Flora"': { kk: 'Гүл студиясы "Flora"', en: 'Flower Studio "Flora"' },
  'Пекарня "Croissant Co"': { kk: 'Наубайхана "Croissant Co"', en: 'Bakery "Croissant Co"' },

  // Districts
  'Алмалинский': { kk: 'Алмалы', en: 'Almaly' },
  'Медеуский': { kk: 'Медеу', en: 'Medeu' },
  'Бостандыкский': { kk: 'Бостандық', en: 'Bostandyk' },
  'Алмалинский район': { kk: 'Алмалы ауданы', en: 'Almaly District' },
  
  // Addresses
  'ул. Байтурсынова 88, Алмалинский район': { kk: 'Байтұрсынов к-сі 88, Алмалы ауданы', en: '88 Baitursynov St., Almaly District' },
  
  // Common phrases appearing in dynamic data
  'Прямой визит': { kk: 'Тікелей бару', en: 'Direct visit' },
  'Скидка 20% на спешелти раф при покупке десерта': { kk: 'Десерт сатып алғанда спешелти рафқа 20% жеңілдік', en: '20% off specialty raf with dessert purchase' },
  'Спецпредложение для партнеров': { kk: 'Серіктестерге арнайы ұсыныс', en: 'Special offer for partners' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
  tc: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru');

  useEffect(() => {
    const savedLang = localStorage.getItem('zherles_language') as Language;
    if (savedLang && (savedLang === 'ru' || savedLang === 'kk' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('zherles_language', lang);
  };

  const t = (key: string, variables?: Record<string, string | number>): string => {
    const dict = translations[language] || translations['ru'];
    let text = dict[key as keyof typeof dict] || key;
    
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    
    return text;
  };

  // Translate content/data strings (categories, names, addresses, districts)
  const tc = (text: string): string => {
    if (language === 'ru') return text;
    const mapped = contentMap[text];
    if (mapped && mapped[language]) return mapped[language];
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tc }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
