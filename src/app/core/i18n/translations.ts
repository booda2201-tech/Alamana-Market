export type SiteLanguage = 'ar' | 'en';

export type TranslationKey =
  | 'nav.home'
  | 'nav.products'
  | 'nav.new'
  | 'nav.about'
  | 'nav.contact'
  | 'nav.orders'
  | 'nav.login'
  | 'nav.menu'
  | 'nav.country'
  | 'nav.categories'
  | 'nav.language'
  | 'country.kuwait'
  | 'country.oman'
  | 'country.turkey'
  | 'country.egypt'
  | 'common.home'
  | 'common.products'
  | 'common.loading'
  | 'common.kg'
  | 'common.currency'
  | 'common.country'
  | 'common.undefined'
  | 'common.retry'
  | 'product.new'
  | 'product.weight'
  | 'product.discount'
  | 'product.addToCart'
  | 'product.overview'
  | 'product.details'
  | 'product.categoryUses'
  | 'product.descriptionTitle'
  | 'product.noDescription'
  | 'product.category'
  | 'product.status'
  | 'product.statusNew'
  | 'product.statusAvailable'
  | 'product.detailsTitle'
  | 'product.detailsSubtitle'
  | 'product.noDetails'
  | 'product.categoryFallback'
  | 'product.categoryDefaultText'
  | 'product.notAvailable.title'
  | 'product.notAvailable.message'
  | 'product.notAvailable.browse'
  | 'product.notAvailable.backHome'
  | 'products.title'
  | 'products.description'
  | 'products.sections'
  | 'products.extraFilters'
  | 'products.newOnly'
  | 'products.searchPlaceholder'
  | 'products.count'
  | 'products.noResults'
  | 'products.noResultsHint'
  | 'products.noAdProducts'
  | 'products.clearFilters'
  | 'products.viewDetails'
  | 'products.all'
  | 'home.badge'
  | 'home.titleLine1'
  | 'home.titleLine2'
  | 'home.subtitle'
  | 'home.browseProducts'
  | 'home.aboutUs'
  | 'home.solutionsTitle'
  | 'home.solutionsSubtitle'
  | 'home.viewAll'
  | 'home.browseCategory'
  | 'home.noCategoryImage'
  | 'home.bestSellers'
  | 'home.bestSellersDesc'
  | 'home.bestSellerBadge'
  | 'home.addToCart'
  | 'home.noBestSellers'
  | 'home.viewAllProducts'
  | 'home.adsBadge'
  | 'home.adsTitle'
  | 'home.adsSubtitle'
  | 'home.latestAds'
  | 'home.adFallbackTitle'
  | 'home.adFallbackDesc'
  | 'home.shopNow'
  | 'home.adLabel'
  | 'home.randomProducts'
  | 'home.randomProductsDesc'
  | 'home.specialPick'
  | 'home.noRandomProducts'
  | 'home.platinumTitle1'
  | 'home.platinumTitle2'
  | 'home.platinumDesc'
  | 'home.exploreSolutions'
  | 'home.viewProduct'
  | 'home.heroFallbackImage'
  | 'home.featureQuality'
  | 'home.featureQualityDesc'
  | 'home.featureDelivery'
  | 'home.featureDeliveryDesc'
  | 'home.featureTrust'
  | 'home.featureTrustDesc'
  | 'footer.supplyMaterials'
  | 'footer.waterproofing'
  | 'footer.adhesives'
  | 'footer.consulting'
  | 'footer.about'
  | 'footer.whatWeDo'
  | 'footer.locations'
  | 'footer.contactUs'
  | 'footer.newsletter'
  | 'footer.emailPlaceholder'
  | 'footer.subscribe'
  | 'footer.rights'
  | 'footer.terms'
  | 'footer.privacy'
  | 'cart.added'
  | 'cart.addFailed'
  | 'cart.title'
  | 'cart.emptyTitle'
  | 'cart.emptyDesc'
  | 'cart.emptyCountryTitle'
  | 'cart.emptyCountryDesc'
  | 'cart.browse'
  | 'cart.login'
  | 'cart.summary'
  | 'cart.productsLabel'
  | 'cart.delivery'
  | 'cart.free'
  | 'cart.total'
  | 'cart.checkout'
  | 'cart.continueShopping'
  | 'cart.loginRequired'
  | 'cart.loadFailed'
  | 'cart.updateFailed'
  | 'cart.decreaseFailed'
  | 'cart.removeFailed'
  | 'cart.removed'
  | 'checkout.backToCart'
  | 'checkout.title'
  | 'checkout.success'
  | 'checkout.backToShop'
  | 'checkout.deliveryTitle'
  | 'checkout.paymentTitle'
  | 'checkout.summary'
  | 'checkout.quantity'
  | 'checkout.deliveryFee'
  | 'checkout.grandTotal'
  | 'checkout.confirm'
  | 'checkout.confirming'
  | 'checkout.fullName'
  | 'checkout.email'
  | 'checkout.phone'
  | 'checkout.country'
  | 'checkout.governorate'
  | 'checkout.city'
  | 'checkout.district'
  | 'checkout.street'
  | 'checkout.building'
  | 'checkout.floor'
  | 'checkout.apartment'
  | 'checkout.landmark'
  | 'checkout.selectCountry'
  | 'checkout.selectGovernorate'
  | 'checkout.selectCity'
  | 'checkout.selectDistrict'
  | 'checkout.loginRequired'
  | 'checkout.loadCartFailed'
  | 'checkout.locationsFailed'
  | 'checkout.paymentFailed'
  | 'checkout.submitFailed'
  | 'orders.title'
  | 'orders.empty'
  | 'orders.total'
  | 'orders.selectedProducts'
  | 'orders.summary'
  | 'orders.orderNumber'
  | 'orders.orderDate'
  | 'orders.status'
  | 'orders.quantity'
  | 'orders.units'
  | 'orders.loginRequired'
  | 'orders.loadFailed'
  | 'login.title'
  | 'login.subtitle'
  | 'login.email'
  | 'login.password'
  | 'login.forgot'
  | 'login.emailInvalid'
  | 'login.passwordRequired'
  | 'login.submit'
  | 'login.submitting'
  | 'login.remember'
  | 'login.noAccount'
  | 'login.createAccount'
  | 'login.backHome'
  | 'login.success'
  | 'login.tokenError'
  | 'login.failed'
  | 'signup.title'
  | 'signup.subtitle'
  | 'signup.fullName'
  | 'signup.fullNameInvalid'
  | 'signup.terms'
  | 'signup.termsRequired'
  | 'signup.submit'
  | 'signup.submitting'
  | 'signup.hasAccount'
  | 'signup.login'
  | 'signup.passwordRequired'
  | 'signup.passwordMin'
  | 'signup.passwordLower'
  | 'signup.passwordUpper'
  | 'signup.passwordSpecial'
  | 'signup.success'
  | 'signup.failed'
  | 'contact.title'
  | 'contact.subtitle'
  | 'contact.mainOffice'
  | 'contact.address'
  | 'contact.phone'
  | 'contact.email'
  | 'contact.emailFallback'
  | 'contact.hours'
  | 'contact.hoursValue'
  | 'contact.formTitle'
  | 'contact.name'
  | 'contact.company'
  | 'contact.subject'
  | 'contact.subjectPlaceholder'
  | 'contact.subjectSales'
  | 'contact.subjectSupport'
  | 'contact.subjectOther'
  | 'contact.message'
  | 'contact.send'
  | 'contact.sending'
  | 'contact.messagePlaceholder'
  | 'contact.successSent'
  | 'about.heroTitle1'
  | 'about.heroTitle2'
  | 'about.heroDesc'
  | 'about.mission'
  | 'about.missionText'
  | 'about.vision'
  | 'about.visionText'
  | 'about.storyTitle'
  | 'about.storyP1'
  | 'about.storyP2'
  | 'about.storyP3'
  | 'about.statYears'
  | 'about.statProjects'
  | 'about.statClients'
  | 'about.statBranches';

type TranslationMap = Record<TranslationKey, string>;

export const TRANSLATIONS: Record<SiteLanguage, TranslationMap> = {
  ar: {
    'nav.home': 'الرئيسية',
    'nav.products': 'منتجاتنا',
    'nav.new': 'جديد',
    'nav.about': 'من نحن',
    'nav.contact': 'تواصل معنا',
    'nav.orders': 'الطلبات السابقة',
    'nav.login': 'تسجيل الدخول',
    'nav.menu': 'القائمة',
    'nav.country': 'البلد',
    'nav.categories': 'أقسام المنتجات',
    'nav.language': 'اللغة',
    'country.kuwait': 'الكويت',
    'country.oman': 'عمان',
    'country.turkey': 'تركيا',
    'country.egypt': 'مصر',
    'common.home': 'الرئيسية',
    'common.products': 'المنتجات',
    'common.loading': 'جاري التحميل...',
    'common.kg': 'كجم',
    'common.currency': 'د.ك',
    'common.country': 'البلد',
    'common.undefined': 'غير محدد',
    'common.retry': 'حاول مرة أخرى',
    'product.new': 'جديد',
    'product.weight': 'الوزن',
    'product.discount': 'خصم',
    'product.addToCart': 'إضافة إلى سلة المشتريات',
    'product.overview': 'نظرة عامة',
    'product.details': 'تفاصيل المنتج',
    'product.categoryUses': 'الفئة والاستخدامات',
    'product.descriptionTitle': 'وصف المنتج',
    'product.noDescription': 'لا يوجد وصف متاح حالياً.',
    'product.category': 'الفئة',
    'product.status': 'الحالة',
    'product.statusNew': 'منتج جديد',
    'product.statusAvailable': 'متاح',
    'product.detailsTitle': 'كل ما تحتاج معرفته عن المنتج',
    'product.detailsSubtitle': 'معلومات مرتبة تساعدك تختار وتستخدم المنتج بالطريقة الصحيحة.',
    'product.noDetails': 'لا توجد تفاصيل إضافية لهذا المنتج حالياً.',
    'product.categoryFallback': 'فئة المنتج',
    'product.categoryDefaultText': 'هذا المنتج ضمن مجموعة منتجات الأمانة المختارة بعناية لتلبية احتياجات مشاريع البناء والتشطيبات.',
    'product.notAvailable.title': 'المنتج غير متوفر في هذا البلد',
    'product.notAvailable.message': 'هذا المنتج غير متاح حالياً في {{country}}. يمكنك تصفح منتجات أخرى متوفرة في بلدك.',
    'product.notAvailable.browse': 'تصفح المنتجات',
    'product.notAvailable.backHome': 'العودة للرئيسية',
    'products.title': 'منتجاتنا',
    'products.description': 'استكشف مجموعتنا الكاملة من مواد البناء عالية الجودة المصممة لتحمل أصعب الظروف.',
    'products.sections': 'الأقسام',
    'products.extraFilters': 'تصفية إضافية',
    'products.newOnly': 'منتجات جديدة فقط',
    'products.searchPlaceholder': 'ابحث عن منتج بالاسم العربي أو الإنجليزي...',
    'products.count': 'منتج',
    'products.noResults': 'لا توجد نتائج بحث',
    'products.noResultsHint': 'جرب البحث بكلمات أخرى أو تغيير خيارات التصفية',
    'products.noAdProducts': 'لا توجد منتجات مرتبطة بهذا الإعلان حالياً',
    'products.clearFilters': 'مسح التصفية',
    'products.viewDetails': 'عرض التفاصيل',
    'products.all': 'جميع المنتجات',
    'home.badge': 'الجودة والثقة في البناء',
    'home.titleLine1': 'أساس قوي لـ',
    'home.titleLine2': 'مستقبل مستدام',
    'home.subtitle': 'الأمانة لمواد البناء توفر أحدث حلول العزل المائي ولواصق البلاط المتطورة للمشاريع الإنشائية. دقة متناهية واعتمادية لا تضاهى.',
    'home.browseProducts': 'تصفح المنتجات',
    'home.aboutUs': 'تعرف علينا',
    'home.solutionsTitle': 'حلول متكاملة للبناء',
    'home.solutionsSubtitle': 'نقدم مجموعة واسعة من مواد البناء والكيماويات المتخصصة لتلبية احتياجات مشاريعك.',
    'home.viewAll': 'عرض الكل',
    'home.browseCategory': 'تصفح المنتجات',
    'home.noCategoryImage': 'لا توجد صورة',
    'home.bestSellers': 'الأكثر طلباً',
    'home.bestSellersDesc': 'المنتجات التي يثق بها كبار المقاولين والمشاريع',
    'home.bestSellerBadge': 'الأكثر طلباً',
    'home.addToCart': 'أضف للسلة',
    'home.noBestSellers': 'لا توجد منتجات الأكثر طلباً حالياً.',
    'home.viewAllProducts': 'عرض جميع المنتجات',
    'home.adsBadge': 'إعلانات الأمانة',
    'home.adsTitle': 'أحدث العروض والمشاريع',
    'home.adsSubtitle': 'تابع آخر أخبار الأمانة، عروض مواد البناء، المشاريع المميزة، ونصائح استخدام منتجاتنا.',
    'home.latestAds': 'أحدث إعلانات الأمانة',
    'home.adFallbackTitle': 'إعلان جديد من الأمانة لمواد البناء',
    'home.adFallbackDesc': 'اكتشف أحدث عروض ومشاريع الأمانة في مواد البناء واللواصق والعوازل.',
    'home.shopNow': 'تسوق الآن',
    'home.adLabel': 'الإعلان',
    'home.randomProducts': 'منتجات مختارة',
    'home.randomProductsDesc': 'منتجات عشوائية من أحدث التشكيلة المتاحة',
    'home.specialPick': 'اقتراح خاص',
    'home.noRandomProducts': 'لا توجد منتجات عشوائية حالياً.',
    'home.platinumTitle1': 'أداء احترافي يبدأ',
    'home.platinumTitle2': 'من بلاتينيوم فيكس',
    'home.platinumDesc': 'تقنيات متطورة في لواصق البلاط والبورسلين توفر قوة تحمل عالية وثباتًا يدوم.',
    'home.exploreSolutions': 'استكشف الحلول',
    'home.viewProduct': 'عرض المنتج',
    'home.heroFallbackImage': 'https://res.cloudinary.com/dvo2qoi4s/image/upload/v1778065815/56_pwctbn.png',
    'home.featureQuality': 'جودة معتمدة',
    'home.featureQualityDesc': 'منتجاتنا خاضعة لأدق اختبارات الجودة ومطابقة للمواصفات العالمية',
    'home.featureDelivery': 'توصيل سريع',
    'home.featureDeliveryDesc': 'نضمن وصول الطلبات لموقع العمل في أسرع وقت ممكن',
    'home.featureTrust': 'ضمان الأمانة',
    'home.featureTrustDesc': 'نلتزم بأعلى معايير المصداقية والشفافية مع عملائنا',
    'footer.supplyMaterials': 'توريد مواد البناء',
    'footer.waterproofing': 'حلول العزل المائي',
    'footer.adhesives': 'مواد التأسيس واللواصق',
    'footer.consulting': 'استشارات هندسية',
    'footer.about': 'شريكك الموثوق في توريد مواد البناء العالية الجودة. نقدم حلولاً متكاملة من لواصق البلاط والعوازل المائية والكيماويات الخاصة بالبناء.',
    'footer.whatWeDo': 'ما نقوم به',
    'footer.locations': 'أين توجد',
    'footer.contactUs': 'تواصل معنا',
    'footer.newsletter': 'اشترك في نشرتنا البريدية',
    'footer.emailPlaceholder': 'البريد الإلكتروني',
    'footer.subscribe': 'اشتراك',
    'footer.rights': 'شركة الأمانة لمواد البناء. جميع الحقوق محفوظة.',
    'footer.terms': 'الشروط والأحكام',
    'footer.privacy': 'سياسة الخصوصية',
    'cart.added': 'تمت إضافة المنتج إلى السلة',
    'cart.addFailed': 'تعذر إضافة المنتج للسلة',
    'cart.title': 'سلة المشتريات',
    'cart.emptyTitle': 'سلة المشتريات فارغة',
    'cart.emptyDesc': 'لم تقم بإضافة أي منتجات بعد. تصفح منتجاتنا واكتشف حلول البناء الحديثة.',
    'cart.emptyCountryTitle': 'لا توجد سلة في هذا البلد',
    'cart.emptyCountryDesc': 'سلتك في {country} فارغة حالياً. تصفح المنتجات المتاحة في هذا البلد وأضف ما يناسبك.',
    'cart.browse': 'تصفح المنتجات',
    'cart.login': 'تسجيل الدخول',
    'cart.summary': 'ملخص الطلب',
    'cart.productsLabel': 'المنتجات',
    'cart.delivery': 'التوصيل',
    'cart.free': 'مجاني',
    'cart.total': 'الإجمالي',
    'cart.checkout': 'إتمام الطلب',
    'cart.continueShopping': 'متابعة التسوق',
    'cart.loginRequired': 'لازم تسجل دخول أولاً علشان تشوف السلة.',
    'cart.loadFailed': 'تعذر تحميل السلة حالياً. حاول مرة أخرى.',
    'cart.updateFailed': 'تعذر تحديث الكمية حالياً.',
    'cart.decreaseFailed': 'تعذر تقليل الكمية حالياً.',
    'cart.removeFailed': 'تعذر حذف المنتج من السلة.',
    'cart.removed': 'تم حذف المنتج من السلة',
    'checkout.backToCart': 'العودة للسلة',
    'checkout.title': 'إتمام الطلب',
    'checkout.success': 'تم استلام طلبك بنجاح',
    'checkout.backToShop': 'العودة للتسوق',
    'checkout.deliveryTitle': 'بيانات التوصيل',
    'checkout.paymentTitle': 'طريقة الدفع',
    'checkout.summary': 'ملخص الطلب',
    'checkout.quantity': 'الكمية',
    'checkout.deliveryFee': 'رسوم التوصيل',
    'checkout.grandTotal': 'الإجمالي المطلوب',
    'checkout.confirm': 'تأكيد الطلب',
    'checkout.confirming': 'جاري التأكيد...',
    'checkout.fullName': 'الاسم الكامل',
    'checkout.email': 'البريد الإلكتروني',
    'checkout.phone': 'رقم الهاتف',
    'checkout.country': 'البلد',
    'checkout.governorate': 'المحافظة',
    'checkout.city': 'المدينة',
    'checkout.district': 'الحي',
    'checkout.street': 'الشارع',
    'checkout.building': 'المبنى',
    'checkout.floor': 'الدور',
    'checkout.apartment': 'الشقة',
    'checkout.landmark': 'علامة مميزة (اختياري)',
    'checkout.selectCountry': 'اختر البلد',
    'checkout.selectGovernorate': 'اختر المحافظة',
    'checkout.selectCity': 'اختر المدينة',
    'checkout.selectDistrict': 'اختر الحي',
    'checkout.loginRequired': 'لازم تسجل دخول أولاً لإتمام الطلب.',
    'checkout.loadCartFailed': 'تعذر تحميل بيانات السلة.',
    'checkout.locationsFailed': 'تعذر تحميل بيانات المناطق.',
    'checkout.paymentFailed': 'تعذر تحميل طرق الدفع.',
    'checkout.submitFailed': 'تعذر إتمام الطلب حالياً. حاول مرة أخرى.',
    'orders.title': 'الطلبات السابقة',
    'orders.empty': 'لا توجد طلبات سابقة حتى الآن.',
    'orders.total': 'الإجمالي',
    'orders.selectedProducts': 'المنتجات المختارة',
    'orders.summary': 'ملخص الطلب',
    'orders.orderNumber': 'رقم الطلب',
    'orders.orderDate': 'تاريخ الطلب',
    'orders.status': 'الحالة',
    'orders.quantity': 'الكمية',
    'orders.units': 'وحدات',
    'orders.loginRequired': 'لازم تسجل دخول أولاً لعرض الطلبات.',
    'orders.loadFailed': 'تعذر تحميل الطلبات السابقة حالياً.',
    'login.title': 'تسجيل الدخول',
    'login.subtitle': 'مرحباً بك مجدداً في الأمانة',
    'login.email': 'البريد الإلكتروني',
    'login.password': 'كلمة المرور',
    'login.forgot': 'نسيت كلمة المرور؟',
    'login.emailInvalid': 'أدخل بريد إلكتروني صحيح.',
    'login.passwordRequired': 'كلمة المرور مطلوبة.',
    'login.submit': 'دخول',
    'login.submitting': 'جاري تسجيل الدخول...',
    'login.remember': 'تذكرني على هذا الجهاز',
    'login.noAccount': 'ليس لديك حساب؟',
    'login.createAccount': 'أنشئ حسابك الآن',
    'login.backHome': 'العودة للرئيسية',
    'login.success': 'تم تسجيل الدخول بنجاح. جاري تحويلك...',
    'login.tokenError': 'تم تسجيل الدخول لكن لم يتم استلام token من الخادم.',
    'login.failed': 'فشل تسجيل الدخول. تأكد من البيانات وحاول مرة أخرى.',
    'signup.title': 'إنشاء حساب جديد',
    'signup.subtitle': 'انضم إلى عملاء الأمانة واستمتع بأفضل مواد البناء',
    'signup.fullName': 'الاسم الكامل',
    'signup.fullNameInvalid': 'الاسم الكامل مطلوب (3 حروف على الأقل).',
    'signup.terms': 'أوافق على الشروط والأحكام وسياسة الخصوصية',
    'signup.termsRequired': 'يجب الموافقة على الشروط والأحكام.',
    'signup.submit': 'إنشاء الحساب',
    'signup.submitting': 'جاري إنشاء الحساب...',
    'signup.hasAccount': 'لديك حساب بالفعل؟',
    'signup.login': 'سجل دخولك',
    'signup.passwordRequired': 'كلمة المرور مطلوبة.',
    'signup.passwordMin': 'كلمة المرور لازم تكون 8 أحرف على الأقل.',
    'signup.passwordLower': 'لازم تحتوي على حرف صغير واحد على الأقل (a-z).',
    'signup.passwordUpper': 'لازم تحتوي على حرف كبير واحد على الأقل (A-Z).',
    'signup.passwordSpecial': 'لازم تحتوي على رمز خاص واحد على الأقل (مثل !@#$).',
    'signup.success': 'تم إنشاء الحساب بنجاح. جاري تحويلك لتسجيل الدخول...',
    'signup.failed': 'حدث خطأ أثناء إنشاء الحساب. حاول مرة أخرى.',
    'contact.title': 'تواصل معنا',
    'contact.subtitle': 'نحن هنا للإجابة على استفساراتكم وتقديم الدعم الفني اللازم لمشروعك.',
    'contact.mainOffice': 'الإدارة الرئيسية',
    'contact.address': 'الكويت، الشويخ الصناعية، شارع البنوك، مجمع مواد البناء، مبنى ٤، الطابق الثاني',
    'contact.phone': 'الهاتف',
    'contact.email': 'البريد الإلكتروني',
    'contact.emailFallback': 'info@alamana.com.kw',
    'contact.hours': 'ساعات العمل',
    'contact.hoursValue': 'السبت - الخميس: ٨ صباحاً - ٨ مساءً',
    'contact.formTitle': 'أرسل لنا رسالة',
    'contact.name': 'الاسم الكامل',
    'contact.company': 'الشركة (اختياري)',
    'contact.subject': 'الموضوع',
    'contact.subjectPlaceholder': 'اختر موضوع الرسالة',
    'contact.subjectSales': 'استفسار مبيعات',
    'contact.subjectSupport': 'دعم فني واستشارة هندسية',
    'contact.subjectOther': 'أخرى',
    'contact.message': 'الرسالة',
    'contact.send': 'إرسال الرسالة',
    'contact.sending': 'جاري الإرسال...',
    'contact.messagePlaceholder': 'كيف يمكننا مساعدتك؟',
    'contact.successSent': 'تم إرسال رسالتك بنجاح! سيتواصل معك أحد ممثلي خدمة العملاء في أقرب وقت ممكن.',
    'about.heroTitle1': 'نبني الحاضر،',
    'about.heroTitle2': 'ونؤسس للمستقبل',
    'about.heroDesc': 'شركة الأمانة لمواد البناء، الخيار الأول والموثوق للمقاولين والمهندسين منذ أكثر من عقدين.',
    'about.mission': 'رسالتنا',
    'about.missionText': 'توفير أحدث التقنيات ومواد البناء عالية الجودة مع دعم فني متخصص لمشاريع مستدامة وآمنة.',
    'about.vision': 'رؤيتنا',
    'about.visionText': 'أن نكون الشريك الاستراتيجي الأبرز في قطاع البناء والتشييد والاسم المرادف للثقة والجودة.',
    'about.storyTitle': 'مسيرة حافلة بالنجاح والإنجازات',
    'about.storyP1': 'تأسست شركة الأمانة لمواد البناء برؤية واضحة تهدف إلى الارتقاء بمعايير البناء من خلال توفير منتجات فائقة الجودة.',
    'about.storyP2': 'بفضل التزامنا بالجودة وشراكاتنا مع كبرى العلامات العالمية، نجحنا في كسب ثقة شريحة واسعة من المقاولين.',
    'about.storyP3': 'يضم فريقنا نخبة من المهندسين والخبراء الفنيين الذين يقدمون استشارات متخصصة لاختيار الحلول الأمثل.',
    'about.statYears': 'سنوات الخبرة',
    'about.statProjects': 'مشروع منجز',
    'about.statClients': 'عميل راضٍ',
    'about.statBranches': 'فرع محلي'
  },
  en: {
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.new': 'New',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.orders': 'Orders',
    'nav.login': 'Sign In',
    'nav.menu': 'Menu',
    'nav.country': 'Country',
    'nav.categories': 'Product Categories',
    'nav.language': 'Language',
    'country.kuwait': 'Kuwait',
    'country.oman': 'Oman',
    'country.turkey': 'Turkey',
    'country.egypt': 'Egypt',
    'common.home': 'Home',
    'common.products': 'Products',
    'common.loading': 'Loading...',
    'common.kg': 'kg',
    'common.currency': 'KWD',
    'common.country': 'Country',
    'common.undefined': 'Not specified',
    'common.retry': 'Try again',
    'product.new': 'New',
    'product.weight': 'Weight',
    'product.discount': 'Discount',
    'product.addToCart': 'Add to Cart',
    'product.overview': 'Overview',
    'product.details': 'Product Details',
    'product.categoryUses': 'Category & Uses',
    'product.descriptionTitle': 'Product Description',
    'product.noDescription': 'No description available at the moment.',
    'product.category': 'Category',
    'product.status': 'Status',
    'product.statusNew': 'New Product',
    'product.statusAvailable': 'Available',
    'product.detailsTitle': 'Everything you need to know',
    'product.detailsSubtitle': 'Organized information to help you choose and use the product correctly.',
    'product.noDetails': 'No additional details for this product at the moment.',
    'product.categoryFallback': 'Product Category',
    'product.categoryDefaultText': 'This product is part of Alamana\'s carefully selected range for construction and finishing projects.',
    'product.notAvailable.title': 'Product not available in this country',
    'product.notAvailable.message': 'This product is currently not available in {{country}}. You can browse other products available in your country.',
    'product.notAvailable.browse': 'Browse Products',
    'product.notAvailable.backHome': 'Back to Home',
    'products.title': 'Our Products',
    'products.description': 'Explore our full range of high-quality building materials designed for demanding conditions.',
    'products.sections': 'Categories',
    'products.extraFilters': 'More Filters',
    'products.newOnly': 'New products only',
    'products.searchPlaceholder': 'Search by Arabic or English product name...',
    'products.count': 'products',
    'products.noResults': 'No results found',
    'products.noResultsHint': 'Try different keywords or change your filters',
    'products.noAdProducts': 'No products linked to this advertisement at the moment',
    'products.clearFilters': 'Clear filters',
    'products.viewDetails': 'View Details',
    'products.all': 'All Products',
    'home.badge': 'Quality & Trust in Construction',
    'home.titleLine1': 'A strong foundation for',
    'home.titleLine2': 'a sustainable future',
    'home.subtitle': 'Alamana Building Materials provides advanced waterproofing solutions and tile adhesives for construction projects with unmatched precision and reliability.',
    'home.browseProducts': 'Browse Products',
    'home.aboutUs': 'About Us',
    'home.solutionsTitle': 'Integrated Building Solutions',
    'home.solutionsSubtitle': 'We offer a wide range of building materials and specialty chemicals for your project needs.',
    'home.viewAll': 'View All',
    'home.browseCategory': 'Browse Products',
    'home.noCategoryImage': 'No image',
    'home.bestSellers': 'Best Sellers',
    'home.bestSellersDesc': 'Products trusted by leading contractors and projects',
    'home.bestSellerBadge': 'Best Seller',
    'home.addToCart': 'Add to Cart',
    'home.noBestSellers': 'No best sellers available at the moment.',
    'home.viewAllProducts': 'View All Products',
    'home.adsBadge': 'Alamana Ads',
    'home.adsTitle': 'Latest Offers & Projects',
    'home.adsSubtitle': 'Follow Alamana news, building material offers, featured projects, and product usage tips.',
    'home.latestAds': 'Latest Alamana Ads',
    'home.adFallbackTitle': 'New Alamana Building Materials Ad',
    'home.adFallbackDesc': 'Discover the latest Alamana offers in building materials, adhesives, and waterproofing.',
    'home.shopNow': 'Shop Now',
    'home.adLabel': 'Ad',
    'home.randomProducts': 'Selected Products',
    'home.randomProductsDesc': 'Random picks from the latest available collection',
    'home.specialPick': 'Special Pick',
    'home.noRandomProducts': 'No random products available at the moment.',
    'home.platinumTitle1': 'Professional performance starts',
    'home.platinumTitle2': 'with Platinum Fix',
    'home.platinumDesc': 'Advanced tile and porcelain adhesive technology with high strength and long-lasting stability.',
    'home.exploreSolutions': 'Explore Solutions',
    'home.viewProduct': 'View Product',
    'home.heroFallbackImage': 'https://res.cloudinary.com/dvo2qoi4s/image/upload/v1778065815/56_pwctbn.png',
    'home.featureQuality': 'Certified Quality',
    'home.featureQualityDesc': 'Our products undergo strict quality testing and meet international standards',
    'home.featureDelivery': 'Fast Delivery',
    'home.featureDeliveryDesc': 'We ensure orders reach your job site as quickly as possible',
    'home.featureTrust': 'Alamana Guarantee',
    'home.featureTrustDesc': 'We are committed to the highest standards of trust and transparency',
    'footer.supplyMaterials': 'Building Materials Supply',
    'footer.waterproofing': 'Waterproofing Solutions',
    'footer.adhesives': 'Primers & Adhesives',
    'footer.consulting': 'Engineering Consultations',
    'footer.about': 'Your trusted partner in high-quality building materials supply, from tile adhesives and waterproofing to specialty construction chemicals.',
    'footer.whatWeDo': 'What We Do',
    'footer.locations': 'Our Locations',
    'footer.contactUs': 'Contact Us',
    'footer.newsletter': 'Subscribe to our newsletter',
    'footer.emailPlaceholder': 'Email address',
    'footer.subscribe': 'Subscribe',
    'footer.rights': 'Alamana Building Materials. All rights reserved.',
    'footer.terms': 'Terms & Conditions',
    'footer.privacy': 'Privacy Policy',
    'cart.added': 'Product added to cart',
    'cart.addFailed': 'Could not add product to cart',
    'cart.title': 'Shopping Cart',
    'cart.emptyTitle': 'Your cart is empty',
    'cart.emptyDesc': 'You have not added any products yet. Browse our catalog and discover modern building solutions.',
    'cart.emptyCountryTitle': 'No cart in this country',
    'cart.emptyCountryDesc': 'Your cart in {country} is empty. Browse products available in this country and add what you need.',
    'cart.browse': 'Browse Products',
    'cart.login': 'Sign In',
    'cart.summary': 'Order Summary',
    'cart.productsLabel': 'Products',
    'cart.delivery': 'Delivery',
    'cart.free': 'Free',
    'cart.total': 'Total',
    'cart.checkout': 'Checkout',
    'cart.continueShopping': 'Continue Shopping',
    'cart.loginRequired': 'Please sign in to view your cart.',
    'cart.loadFailed': 'Could not load cart. Please try again.',
    'cart.updateFailed': 'Could not update quantity.',
    'cart.decreaseFailed': 'Could not decrease quantity.',
    'cart.removeFailed': 'Could not remove item from cart.',
    'cart.removed': 'Item removed from cart',
    'checkout.backToCart': 'Back to Cart',
    'checkout.title': 'Checkout',
    'checkout.success': 'Your order was received successfully',
    'checkout.backToShop': 'Back to Shopping',
    'checkout.deliveryTitle': 'Delivery Details',
    'checkout.paymentTitle': 'Payment Method',
    'checkout.summary': 'Order Summary',
    'checkout.quantity': 'Qty',
    'checkout.deliveryFee': 'Delivery Fee',
    'checkout.grandTotal': 'Grand Total',
    'checkout.confirm': 'Place Order',
    'checkout.confirming': 'Confirming...',
    'checkout.fullName': 'Full Name',
    'checkout.email': 'Email',
    'checkout.phone': 'Phone Number',
    'checkout.country': 'Country',
    'checkout.governorate': 'Governorate',
    'checkout.city': 'City',
    'checkout.district': 'District',
    'checkout.street': 'Street',
    'checkout.building': 'Building',
    'checkout.floor': 'Floor',
    'checkout.apartment': 'Apartment',
    'checkout.landmark': 'Landmark (optional)',
    'checkout.selectCountry': 'Select country',
    'checkout.selectGovernorate': 'Select governorate',
    'checkout.selectCity': 'Select city',
    'checkout.selectDistrict': 'Select district',
    'checkout.loginRequired': 'Please sign in to complete checkout.',
    'checkout.loadCartFailed': 'Could not load cart data.',
    'checkout.locationsFailed': 'Could not load location data.',
    'checkout.paymentFailed': 'Could not load payment methods.',
    'checkout.submitFailed': 'Could not place order. Please try again.',
    'orders.title': 'Previous Orders',
    'orders.empty': 'No previous orders yet.',
    'orders.total': 'Total',
    'orders.selectedProducts': 'Selected Products',
    'orders.summary': 'Order Summary',
    'orders.orderNumber': 'Order Number',
    'orders.orderDate': 'Order Date',
    'orders.status': 'Status',
    'orders.quantity': 'Quantity',
    'orders.units': 'units',
    'orders.loginRequired': 'Please sign in to view your orders.',
    'orders.loadFailed': 'Could not load previous orders.',
    'login.title': 'Sign In',
    'login.subtitle': 'Welcome back to Alamana',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.forgot': 'Forgot password?',
    'login.emailInvalid': 'Enter a valid email address.',
    'login.passwordRequired': 'Password is required.',
    'login.submit': 'Sign In',
    'login.submitting': 'Signing in...',
    'login.remember': 'Remember me on this device',
    'login.noAccount': 'Don\'t have an account?',
    'login.createAccount': 'Create your account',
    'login.backHome': 'Back to Home',
    'login.success': 'Signed in successfully. Redirecting...',
    'login.tokenError': 'Signed in but no token was received from the server.',
    'login.failed': 'Sign in failed. Check your credentials and try again.',
    'signup.title': 'Create Account',
    'signup.subtitle': 'Join Alamana customers and get the best building materials',
    'signup.fullName': 'Full Name',
    'signup.fullNameInvalid': 'Full name is required (at least 3 characters).',
    'signup.terms': 'I agree to the Terms & Conditions and Privacy Policy',
    'signup.termsRequired': 'You must agree to the terms and conditions.',
    'signup.submit': 'Create Account',
    'signup.submitting': 'Creating account...',
    'signup.hasAccount': 'Already have an account?',
    'signup.login': 'Sign in',
    'signup.passwordRequired': 'Password is required.',
    'signup.passwordMin': 'Password must be at least 8 characters.',
    'signup.passwordLower': 'Must include at least one lowercase letter (a-z).',
    'signup.passwordUpper': 'Must include at least one uppercase letter (A-Z).',
    'signup.passwordSpecial': 'Must include at least one special character (e.g. !@#$).',
    'signup.success': 'Account created. Redirecting to sign in...',
    'signup.failed': 'Could not create account. Please try again.',
    'contact.title': 'Contact Us',
    'contact.subtitle': 'We are here to answer your questions and provide the technical support your project needs.',
    'contact.mainOffice': 'Head Office',
    'contact.address': 'Kuwait, Shuwaikh Industrial, Banks Street, Building Materials Complex, Building 4, 2nd Floor',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.emailFallback': 'info@alamana.com.kw',
    'contact.hours': 'Working Hours',
    'contact.hoursValue': 'Saturday - Thursday: 8 AM - 8 PM',
    'contact.formTitle': 'Send Us a Message',
    'contact.name': 'Full Name',
    'contact.company': 'Company (optional)',
    'contact.subject': 'Subject',
    'contact.subjectPlaceholder': 'Select a subject',
    'contact.subjectSales': 'Sales inquiry',
    'contact.subjectSupport': 'Technical support & engineering consultation',
    'contact.subjectOther': 'Other',
    'contact.message': 'Message',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.messagePlaceholder': 'How can we help you?',
    'contact.successSent': 'Your message was sent successfully! Our team will contact you as soon as possible.',
    'about.heroTitle1': 'Building the present,',
    'about.heroTitle2': 'founding the future',
    'about.heroDesc': 'Alamana Building Materials — the trusted choice for contractors and engineers for over two decades.',
    'about.mission': 'Our Mission',
    'about.missionText': 'Providing the latest technologies and high-quality building materials with specialized technical support for safe, sustainable projects.',
    'about.vision': 'Our Vision',
    'about.visionText': 'To be the leading strategic partner in construction across the region, synonymous with trust, quality, and innovation.',
    'about.storyTitle': 'A track record of success',
    'about.storyP1': 'Alamana was founded with a clear vision to raise building standards by supplying premium-quality products.',
    'about.storyP2': 'Through our commitment to quality and global brand partnerships, we have earned the trust of a wide range of contractors.',
    'about.storyP3': 'Our team includes engineers and technical experts who provide specialized consultations for the best solutions.',
    'about.statYears': 'Years of Experience',
    'about.statProjects': 'Completed Projects',
    'about.statClients': 'Satisfied Clients',
    'about.statBranches': 'Local Branches'
  }
};
