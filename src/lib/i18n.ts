export type Locale = "mn";

export const defaultLocale: Locale = "mn";

export type TranslationSchema = {
  common: {
    appName: string;
    loading: string;
  };
  nav: {
    doctors: string;
    book: string;
    appointments: string;
    admin: string;
    signOut: string;
    logIn: string;
    signUp: string;
  };
  home: {
    title: string;
    description: string;
    bookCta: string;
    browseCta: string;
    benefitsTitle: string;
    benefitFast: string;
    benefitNoConflict: string;
    benefitCompare: string;
    previewTitle: string;
    previewDescription: string;
    footerTagline: string;
  };
  booking: {
    title: string;
    subtitle: string;
    doctor: string;
    selectDoctor: string;
    date: string;
    slots: string;
    service: string;
    notes: string;
    confirm: string;
    continue: string;
    back: string;
    selectedSummary: string;
    selectedSlot: string;
    chooseDoctorStep: string;
    chooseTimeStep: string;
    confirmStep: string;
    noSlots: string;
    success: string;
    failed: string;
    instantFeedback: string;
  };
  doctors: {
    title: string;
    subtitle: string;
    years: string;
    rating: string;
    book: string;
    viewProfile: string;
  };
  doctorProfile: {
    scheduleTitle: string;
    scheduleSubtitle: string;
    availableSlots: string;
    noSlots: string;
    bookNow: string;
    notFound: string;
    backToDoctors: string;
  };
  admin: {
    title: string;
    subtitle: string;
    sidebarDoctors: string;
    sidebarAppointments: string;
    sidebarCalendar: string;
    sidebarSettings: string;
    todayAppointments: string;
    totalBookings: string;
    pending: string;
    completed: string;
    doctors: string;
    patients: string;
    day: string;
    week: string;
    filtersTitle: string;
    filterDoctor: string;
    filterStatus: string;
    filterDate: string;
    searchPlaceholder: string;
    noResults: string;
    all: string;
    confirm: string;
    cancel: string;
    complete: string;
  };
  auth: {
    loginTitle: string;
    registerTitle: string;
    loginSubtitle: string;
    registerSubtitle: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    signIn: string;
    createAccount: string;
    noAccount: string;
    hasAccount: string;
    goToRegister: string;
    goToLogin: string;
    signingIn: string;
    creatingAccount: string;
    passwordHint: string;
    passwordsDoNotMatch: string;
    accountCreated: string;
    invalidCredentials: string;
    registrationFailed: string;
  };
  appointments: {
    title: string;
    subtitle: string;
    upcoming: string;
    past: string;
    cancelled: string;
    empty: string;
    cancel: string;
    cancelling: string;
  };
};

export const messages: Record<Locale, TranslationSchema> = {
  mn: {
    common: {
      appName: "DentaBook",
      loading: "Ачаалж байна..."
    },
    nav: {
      doctors: "Эмч нар",
      book: "Цаг захиалах",
      appointments: "Миний захиалгууд",
      admin: "Админ",
      signOut: "Гарах",
      logIn: "Нэвтрэх",
      signUp: "Бүртгүүлэх"
    },
    home: {
      title: "Шүдний эмчийн цаг захиалгыг хялбар болгоно",
      description:
        "Итгэлтэй эмч дээр онлайнаар цаг захиалж, удахгүй болох үзлэгээ удирдаж, админ самбараар баталгаажуулалтыг хянаарай.",
      bookCta: "Цаг захиалах",
      browseCta: "Эмч үзэх",
      benefitsTitle: "Яагаад эмнэлгүүд DentaBook сонгодог вэ",
      benefitFast: "Хэдхэн товшилтоор хурдан захиалах",
      benefitNoConflict: "Давхцалгүй цагийн систем",
      benefitCompare: "Эмч нарыг харьцуулж сонгох боломж",
      previewTitle: "Өндөр үнэлгээтэй эмч нар",
      previewDescription: "Профайл, үнэлгээ, туршлагаа харьцуулж байгаад цаг захиалаарай.",
      footerTagline: "Орчин үеийн шүдний эмнэлэгт зориулсан дэвшилтэт захиалгын систем."
    },
    booking: {
      title: "Цаг захиалах",
      subtitle: "Эмчээ сонгоод, цагаа товлон, захиалгаа баталгаажуулна уу.",
      doctor: "Эмч",
      selectDoctor: "Эмч сонгох",
      date: "Огноо",
      slots: "Боломжтой цагууд",
      service: "Үйлчилгээ",
      notes: "Тэмдэглэл",
      confirm: "Захиалгаа батлах",
      continue: "Үргэлжлүүлэх",
      back: "Буцах",
      selectedSummary: "Таны сонголт",
      selectedSlot: "Сонгосон цаг",
      chooseDoctorStep: "Эмч сонгох",
      chooseTimeStep: "Огноо ба цаг",
      confirmStep: "Батлах",
      noSlots: "Энэ өдөр боломжтой цаг алга.",
      success: "Амжилттай цаг захиаллаа.",
      failed: "Цаг захиалах үед алдаа гарлаа.",
      instantFeedback: "Шуурхай баталгаажуулалт болон төлвийн мэдэгдэл."
    },
    doctors: {
      title: "Манай эмч нар",
      subtitle: "Туршлагатай шүдний эмч нартай цаг товлоорой.",
      years: "жил ажилласан",
      rating: "үнэлгээ",
      book: "Цаг захиалах",
      viewProfile: "Профайл харах"
    },
    doctorProfile: {
      scheduleTitle: "7 хоногийн хуваарь",
      scheduleSubtitle: "Өдөр сонгоод боломжтой цагуудыг шууд хараарай.",
      availableSlots: "Боломжтой цагууд",
      noSlots: "Энэ өдөр сул цаг алга.",
      bookNow: "Одоо захиалах",
      notFound: "Эмч олдсонгүй.",
      backToDoctors: "Эмч нар руу буцах"
    },
    admin: {
      title: "Админ самбар",
      subtitle: "Эмнэлгийн үйл ажиллагааг нэг цонхоор удирдана.",
      sidebarDoctors: "Эмч нар",
      sidebarAppointments: "Захиалгууд",
      sidebarCalendar: "Календарь",
      sidebarSettings: "Тохиргоо",
      todayAppointments: "Өнөөдрийн захиалгууд",
      totalBookings: "Нийт захиалга",
      pending: "Хүлээгдэж буй",
      completed: "Дууссан",
      doctors: "Эмч нар",
      patients: "Өвчтөнүүд",
      day: "Өдөр",
      week: "7 хоног",
      filtersTitle: "Шүүлтүүр",
      filterDoctor: "Эмч",
      filterStatus: "Төлөв",
      filterDate: "Огноо",
      searchPlaceholder: "Өвчтөн / эмч / үйлчилгээ хайх",
      noResults: "Тохирох захиалга олдсонгүй.",
      all: "БҮГД",
      confirm: "Батлах",
      cancel: "Цуцлах",
      complete: "Дуусгах"
    },
    auth: {
      loginTitle: "Нэвтрэх",
      registerTitle: "Бүртгүүлэх",
      loginSubtitle: "Захиалгаа хурдан удирдахын тулд нэвтэрнэ үү.",
      registerSubtitle: "Шилдэг шүдний эмч нартай цаг авахын тулд бүртгэл үүсгэнэ үү.",
      email: "Имэйл",
      password: "Нууц үг",
      confirmPassword: "Нууц үг давтах",
      fullName: "Овог нэр",
      signIn: "Нэвтрэх",
      createAccount: "Бүртгэл үүсгэх",
      noAccount: "Бүртгэлгүй юу?",
      hasAccount: "Бүртгэлтэй юу?",
      goToRegister: "Шинээр бүртгүүлэх",
      goToLogin: "Нэвтрэх хэсэг рүү",
      signingIn: "Нэвтэрч байна...",
      creatingAccount: "Бүртгэл үүсгэж байна...",
      passwordHint: "Хамгийн багадаа 8 тэмдэгт оруулна уу.",
      passwordsDoNotMatch: "Нууц үгнүүд таарахгүй байна.",
      accountCreated: "Бүртгэл амжилттай үүслээ. Нэвтэрнэ үү.",
      invalidCredentials: "Имэйл эсвэл нууц үг буруу байна",
      registrationFailed: "Бүртгэл амжилтгүй боллоо"
    },
    appointments: {
      title: "Миний захиалгууд",
      subtitle: "Удахгүй болох үзлэгээ хянаж, төлвөө удирдана уу.",
      upcoming: "ИДЭВХТЭЙ",
      past: "ӨНГӨРСӨН",
      cancelled: "ЦУЦЛАГДСАН",
      empty: "Энэ хэсэгт захиалга байхгүй байна.",
      cancel: "Цуцлах",
      cancelling: "Цуцалж байна..."
    }
  }
};

