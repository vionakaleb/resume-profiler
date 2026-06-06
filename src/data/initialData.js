const SEP = "\u00A0\u00A0|\u00A0\u00A0";

export const initialData = {
  name: "VIONA Z. A. KALEB",
  headline: "Software Engineer",
  location: "Jakarta, Indonesia",
  email: "",
  phone: "",
  website: "https://viona-kaleb.vercel.app/",
  linkedin: "",
  summary:
    "A frontend-focused Software Engineer with 7+ years of expertise. Building production web applications across banking, fintech, e-commerce and logistics. With deep expertise in Next.js, React, Angular and Vue. Backed by fullstack experience with Node.js, Express, GraphQL and PHP. Founded the frontend system of a UK fintech platform serving 1.2M+ trading accounts. Shipped 3D wayfinding solutions installed across major Singapore landmarks. Now helping digitalize operations across 1,000+ branches at Indonesia's largest state-owned bank. Holds a Master's in Information Technology with a Machine Learning focus.",
  experience: [
    {
      title: "Web Developer",
      org: "Bank Mandiri",
      location: "Jakarta, Indonesia",
      dates: "Dec 2023 \u2013 Present",
      bullets: [
        "Build and maintain Smart Branch, the digital branch platform for Indonesia's largest state-owned bank, helping digitalize banking operations across 1,000+ branches nationwide and cut fraud by 85%.",
        "Develop features for KOPRA, the bank's wholesale banking platform, supporting annual transaction volume above IDR 10,000 trillion.",
      ],
    },
  ],
  education: [
    {
      title: "Master of Science in Information Technology",
      org: "President University",
      location: "Cikarang, Indonesia" + SEP + "EQF Level 7",
      dates: "",
      bullets: ["Specialization in Machine Learning."],
    },
    {
      title: "Bachelor of Science in Information Technology",
      org: "President University",
      location: "Cikarang, Indonesia" + SEP + "EQF Level 6",
      dates: "",
      bullets: [
        "Awarded a Bachelor's scholarship for being one of the top graduates at school, funded by the government and the campus.",
      ],
    },
  ],
  certifications: [],
  achievements: [],
  projects: [],
  skills: [
    { label: "Languages", value: "TypeScript, JavaScript, Python, PHP, SQL" },
  ],
  languages: [
    { name: "Indonesian", level: "Native" },
    {
      name: "English",
      level: "C1 Advanced",
    },
  ],
};

export const SECTION_SEP = SEP;

export function blankEntry() {
  return { title: "", org: "", location: "", dates: "", bullets: [""] };
}
