export type Locale = "en" | "mn";

export const defaultLocale: Locale = "en";

export type TranslationSchema = {
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
  };
  doctors: {
    title: string;
    subtitle: string;
    years: string;
    rating: string;
    book: string;
  };
  auth: {
    loginTitle: string;
    registerTitle: string;
    email: string;
    password: string;
    fullName: string;
    signIn: string;
    createAccount: string;
    invalidCredentials: string;
    registrationFailed: string;
  };
};

export const messages: Record<Locale, TranslationSchema> = {
  en: {
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
      browseCta: "Browse Doctors"
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
      failed: "Unable to book appointment."
    },
    doctors: {
      title: "Our Doctors",
      subtitle: "Book with experienced dental specialists.",
      years: "years exp.",
      rating: "rating",
      book: "Book now"
    },
    auth: {
      loginTitle: "Log in",
      registerTitle: "Register",
      email: "Email",
      password: "Password",
      fullName: "Full name",
      signIn: "Sign In",
      createAccount: "Create account",
      invalidCredentials: "Invalid credentials",
      registrationFailed: "Registration failed"
    }
  },
  mn: {
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
      title: "Шүдний эмнэлгийн цаг захиалгыг хялбаршууллаа",
      description:
        "Итгэлтэй эмч дээр онлайнаар цаг захиалж, удахгүй болох үзлэгээ удирдаж, админ самбараар баталгаажуулалтыг хянаарай.",
      bookCta: "Цаг захиалах",
      browseCta: "Эмч үзэх"
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
      failed: "Цаг захиалах үед алдаа гарлаа."
    },
    doctors: {
      title: "Манай эмч нар",
      subtitle: "Туршлагатай шүдний эмч нартай цаг товлоорой.",
      years: "жил ажилласан",
      rating: "үнэлгээ",
      book: "Цаг авах"
    },
    auth: {
      loginTitle: "Нэвтрэх",
      registerTitle: "Бүртгүүлэх",
      email: "Имэйл",
      password: "Нууц үг",
      fullName: "Овог нэр",
      signIn: "Нэвтрэх",
      createAccount: "Бүртгэл үүсгэх",
      invalidCredentials: "Имэйл эсвэл нууц үг буруу байна",
      registrationFailed: "Бүртгэл амжилтгүй боллоо"
    }
  }
};

