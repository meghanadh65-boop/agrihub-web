import { createContext, useContext, useEffect, useState } from "react";

const translations = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.shop": "Shop",
    "nav.services": "Services",
    "nav.drone": "Drone",
    "nav.harvester": "Harvester",
    "nav.tractor": "Tractor",
    "nav.workforce": "Workforce",
    "nav.contact": "Contact",
    "nav.orders": "My Orders",
    "nav.login": "Login",
    "cta.book": "Book Now",
    "cta.shop": "Shop Now",
    "cta.explore": "Explore Services",
    "cta.viewAll": "View All",
    "hero.tag": "Empowering Farmers",
    "hero.title": "Everything your farm needs, in one place",
    "hero.subtitle":
      "Quality seeds, crop protection, and on-demand agri services — drone, harvester, tractor and skilled workforce, delivered to your village.",
    "home.categories": "Shop by Category",
    "home.services": "Our Services",
    "home.featured": "Featured Products",
    "home.why": "Why farmers choose FLTY",
    "home.offers": "Offers & Deals",
    "footer.tagline": "Farming, made simpler.",
    "footer.rights": "All rights reserved.",
    "common.search": "Search products, seeds, fertilizers…",
    "common.name": "Full name",
    "common.phone": "Phone number",
    "common.email": "Email",
    "common.location": "Village / Location",
    "common.date": "Preferred date",
    "common.acres": "Land size (acres)",
    "common.notes": "Notes",
    "common.submit": "Submit Booking",
    "common.message": "Your message",
    "book.title": "Book a Service",
    "book.success": "Booking Confirmed!",
    "book.successSub": "Our team will contact you within 2 hours.",
  },
  hi: {
    "nav.home": "होम",
    "nav.about": "हमारे बारे में",
    "nav.shop": "दुकान",
    "nav.services": "सेवाएं",
    "nav.drone": "ड्रोन",
    "nav.harvester": "हार्वेस्टर",
    "nav.tractor": "ट्रैक्टर",
    "nav.workforce": "श्रमिक",
    "nav.contact": "संपर्क",
    "nav.orders": "मेरे ऑर्डर",
    "nav.login": "लॉगिन",
    "cta.book": "अभी बुक करें",
    "cta.shop": "खरीदारी करें",
    "cta.explore": "सेवाएं देखें",
    "cta.viewAll": "सभी देखें",
    "hero.tag": "किसानों को सशक्त बनाना",
    "hero.title": "आपके खेत की हर ज़रूरत, एक जगह",
    "hero.subtitle":
      "गुणवत्ता बीज, फसल सुरक्षा और मांग पर कृषि सेवाएँ — ड्रोन, हार्वेस्टर, ट्रैक्टर और कुशल श्रमिक, आपके गाँव तक।",
    "home.categories": "श्रेणी अनुसार खरीदें",
    "home.services": "हमारी सेवाएं",
    "home.featured": "विशेष उत्पाद",
    "home.why": "किसान FLTY क्यों चुनते हैं",
    "home.offers": "ऑफर और डील्स",
    "footer.tagline": "खेती, अब आसान।",
    "footer.rights": "सर्वाधिकार सुरक्षित।",
    "common.search": "उत्पाद, बीज, उर्वरक खोजें…",
    "common.name": "पूरा नाम",
    "common.phone": "फ़ोन नंबर",
    "common.email": "ईमेल",
    "common.location": "गाँव / स्थान",
    "common.date": "पसंदीदा तारीख",
    "common.acres": "भूमि (एकड़)",
    "common.notes": "टिप्पणी",
    "common.submit": "बुकिंग सबमिट करें",
    "common.message": "आपका संदेश",
    "book.title": "सेवा बुक करें",
    "book.success": "बुकिंग की पुष्टि हुई!",
    "book.successSub": "हमारी टीम 2 घंटे में आपसे संपर्क करेगी।",
  },
  te: {
    "nav.home": "హోమ్",
    "nav.about": "గురించి",
    "nav.shop": "షాప్",
    "nav.services": "సేవలు",
    "nav.drone": "డ్రోన్",
    "nav.harvester": "హార్వెస్టర్",
    "nav.tractor": "ట్రాక్టర్",
    "nav.workforce": "కూలీలు",
    "nav.contact": "సంప్రదించండి",
    "nav.orders": "నా ఆర్డర్లు",
    "nav.login": "లాగిన్",
    "cta.book": "బుక్ చేయండి",
    "cta.shop": "కొనుగోలు",
    "cta.explore": "సేవలు చూడండి",
    "cta.viewAll": "అన్నీ చూడండి",
    "hero.tag": "రైతులకు సాధికారత",
    "hero.title": "మీ వ్యవసాయ అవసరాలు అన్నీ ఒకే చోట",
    "hero.subtitle":
      "నాణ్యమైన విత్తనాలు, పంట రక్షణ మరియు అవసరమైనప్పుడు వ్యవసాయ సేవలు — డ్రోన్, హార్వెస్టర్, ట్రాక్టర్ మరియు నైపుణ్య కూలీలు.",
    "home.categories": "వర్గం ద్వారా షాప్",
    "home.services": "మా సేవలు",
    "home.featured": "ఫీచర్డ్ ఉత్పత్తులు",
    "home.why": "రైతులు FLTY ఎందుకు ఎంచుకుంటారు",
    "home.offers": "ఆఫర్లు",
    "footer.tagline": "వ్యవసాయం, ఇప్పుడు సులభం.",
    "footer.rights": "అన్ని హక్కులూ ప్రత్యేకించబడ్డాయి.",
    "common.search": "ఉత్పత్తులు, విత్తనాలు, ఎరువులు వెతకండి…",
    "common.name": "పూర్తి పేరు",
    "common.phone": "ఫోన్ నంబర్",
    "common.email": "ఇమెయిల్",
    "common.location": "గ్రామం / ప్రాంతం",
    "common.date": "ప్రాధాన్య తేదీ",
    "common.acres": "భూమి (ఎకరాలు)",
    "common.notes": "గమనికలు",
    "common.submit": "బుకింగ్ సమర్పించు",
    "common.message": "మీ సందేశం",
    "book.title": "సేవను బుక్ చేయండి",
    "book.success": "బుకింగ్ నిర్ధారించబడింది!",
    "book.successSub": "మా బృందం 2 గంటల్లో మిమ్మల్ని సంప్రదిస్తుంది.",
  },
};

const I18nCtx = createContext({ lang: "en", setLang: () => {}, t: (k) => k });

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("flty-lang") : null;
    if (saved && translations[saved]) setLangState(saved);
  }, []);

  const setLang = (l) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("flty-lang", l);
  };
  const t = (k) => translations[lang][k] ?? translations.en[k] ?? k;
  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export const useI18n = () => useContext(I18nCtx);

export const languageOptions = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "te", label: "తెలుగు" },
];
