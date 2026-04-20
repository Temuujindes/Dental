export type Locale = "en" | "mn";

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
  en: {
    common: {
      appName: "DentaBook",
      loading: "Loading..."
    },
    nav: {
      doctors: "Doctors",
      book: "Book",
      appointments: "My Appointments",
      admin: "Admin",
      signOut: "Sign out",
      logIn: "Log in",
      signUp: "Sign up"
    },
    home: {
      title: "Dental booking made simple",
      description:
        "Book appointments with trusted dentists, manage upcoming visits, and let your clinic team handle confirmations with the admin dashboard.",
      bookCta: "Book Appointment",
      browseCta: "Browse Doctors",
      benefitsTitle: "Why clinics choose DentaBook",
      benefitFast: "Fast booking in a few taps",
      benefitNoConflict: "Conflict-free scheduling system",
      benefitCompare: "Compare doctors before booking",
      previewTitle: "Top rated specialists",
      previewDescription: "Explore profiles, ratings, and expertise before confirming your visit.",
      footerTagline: "Premium dental scheduling platform for modern clinics."
    },
    booking: {
      title: "Book Appointment",
      subtitle: "Choose a dentist, pick a time, and confirm your visit.",
      doctor: "Doctor",
      selectDoctor: "Select doctor",
      date: "Date",
      slots: "Available time slots",
      service: "Service",
      notes: "Notes",
      confirm: "Confirm Booking",
      continue: "Continue",
      back: "Back",
      selectedSummary: "You selected",
      selectedSlot: "Selected slot",
      chooseDoctorStep: "Choose Doctor",
      chooseTimeStep: "Date & Time",
      confirmStep: "Confirm",
      noSlots: "No available slots for this date.",
      success: "Appointment booked successfully.",
      failed: "Unable to book appointment.",
      instantFeedback: "Instant confirmation and quick status updates."
    },
    doctors: {
      title: "Our Doctors",
      subtitle: "Book with experienced dental specialists.",
      years: "years exp.",
      rating: "rating",
      book: "Book appointment",
      viewProfile: "View profile"
    },
    doctorProfile: {
      scheduleTitle: "Weekly schedule",
      scheduleSubtitle: "Pick a day and see available times instantly.",
      availableSlots: "Available time slots",
      noSlots: "No slots available for this day.",
      bookNow: "Book Now",
      notFound: "Doctor not found.",
      backToDoctors: "Back to doctors"
    },
    admin: {
      title: "Admin Dashboard",
      subtitle: "Manage clinic operations from one clean workspace.",
      sidebarDoctors: "Doctors",
      sidebarAppointments: "Appointments",
      sidebarCalendar: "Calendar",
      sidebarSettings: "Settings",
      todayAppointments: "Today appointments",
      totalBookings: "Total bookings",
      pending: "Pending",
      completed: "Completed",
      doctors: "Doctors",
      patients: "Patients",
      day: "Day",
      week: "Week",
      filtersTitle: "Filters",
      filterDoctor: "Doctor",
      filterStatus: "Status",
      filterDate: "Date",
      searchPlaceholder: "Search patient / doctor / service",
      noResults: "No matching appointments found.",
      all: "ALL",
      confirm: "Confirm",
      cancel: "Cancel",
      complete: "Complete"
    },
    auth: {
      loginTitle: "Log in",
      registerTitle: "Register",
      loginSubtitle: "Sign in to manage your bookings quickly.",
      registerSubtitle: "Create your account to book with top dental specialists.",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm password",
      fullName: "Full name",
      signIn: "Sign In",
      createAccount: "Create account",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      goToRegister: "Create one",
      goToLogin: "Go to login",
      signingIn: "Signing in...",
      creatingAccount: "Creating account...",
      passwordHint: "Use at least 8 characters.",
      passwordsDoNotMatch: "Passwords do not match.",
      accountCreated: "Account created successfully. Please log in.",
      invalidCredentials: "Invalid credentials",
      registrationFailed: "Registration failed"
    },
    appointments: {
      title: "My Appointments",
      subtitle: "Track upcoming visits and manage booking status.",
      upcoming: "UPCOMING",
      past: "PAST",
      cancelled: "CANCELLED",
      empty: "No appointments in this section yet.",
      cancel: "Cancel",
      cancelling: "Cancelling..."
    }
  },
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
      benefitFast: "Хэдхэн товшилтоор хурдан booking",
      benefitNoConflict: "Давхцалгүй цагийн систем",
      benefitCompare: "Эмч нарыг харьцуулж сонгох боломж",
      previewTitle: "Өндөр үнэлгээтэй эмч нар",
      previewDescription: "Профайл, үнэлгээ, туршлагаа харьцуулж байгаад цаг захиалаарай.",
      footerTagline: "Орчин үеийн шүдний эмнэлэгт зориулсан premium захиалгын систем."
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

