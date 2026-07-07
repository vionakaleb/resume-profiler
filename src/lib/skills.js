export const STOPWORDS = new Set(
  `a an the and or but if then than this that these those with without within into onto from for of to in on at by as is are was were be been being have has had do does did will would shall should can could may might must not no nor so such own same other more most some any all each few many our your their his her its we you they he she it i me us them my mine ours yours role roles team teams work working works ability strong excellent good great proven plus etc using used use across over under about per via you'll we're you're including include includes required require requirements responsibilities responsible looking ideal candidate candidates experience experiences year years month months day days new help helps build building built make makes made join joining company companies position opportunity opportunities skill skills knowledge understanding ensure ensuring deliver delivering develop developing development developer engineer engineers`
    .split(/\s+/)
    .filter(Boolean),
);

export const SKILL_DICTIONARY = {
  javascript: { display: "JavaScript", mishearings: ["java script"] },
  typescript: {
    display: "TypeScript",
    mishearings: ["type script", "touch screen"],
  },
  react: { display: "React", mishearings: ["react js", "react.js"] },
  "react native": { display: "React Native", mishearings: ["React 90"] },
  "next.js": {
    display: "Next.js",
    mishearings: ["next js", "next yes", "next day yes"],
  },
  nextjs: { display: "Next.js", mishearings: [] },
  angular: {
    display: "Angular",
    mishearings: ["and your love", "and year", "end year"],
  },
  vue: {
    display: "Vue",
    mishearings: ["few", "view", "view js", "vue js", "vue.js"],
  },
  vuex: { display: "Vuex", mishearings: ["few hours"] },
  laravel: { display: "Laravel", mishearings: ["waterfall"] },
  svelte: { display: "Svelte", mishearings: ["svelt", "felt"] },
  redux: { display: "Redux", mishearings: ["ree ducks", "reader"] },
  "node.js": {
    display: "Node.js",
    mishearings: ["node js", "no js", "note js", "nod js"],
  },
  nodejs: { display: "Node.js", mishearings: [] },
  express: { display: "Express", mishearings: [] },
  graphql: {
    display: "GraphQL",
    mishearings: ["graph ql", "graph cool", "graph kool"],
  },
  rest: { display: "REST", mishearings: [] },
  php: { display: "PHP", mishearings: ["BHB"] },
  python: { display: "Python", mishearings: [] },
  java: { display: "Java", mishearings: [] },
  golang: { display: "Golang", mishearings: ["go lang", "go language"] },
  rust: { display: "Rust", mishearings: [] },
  "c++": { display: "C++", mishearings: ["c plus plus", "c++"] },
  html: { display: "HTML", mishearings: [] },
  css: { display: "CSS", mishearings: [] },
  sass: { display: "Sass", mishearings: [] },
  tailwind: {
    display: "Tailwind",
    mishearings: ["tail wind", "tailwinds", "tell me"],
  },
  bootstrap: { display: "Bootstrap", mishearings: [] },
  webpack: { display: "Webpack", mishearings: ["web pack"] },
  vite: { display: "Vite", mishearings: ["veet", "veet js", "fight"] },
  jest: { display: "Jest", mishearings: ["just"] },
  cypress: { display: "Cypress", mishearings: [] },
  playwright: {
    display: "Playwright",
    mishearings: ["play right", "play write"],
  },
  "testing library": { display: "Testing Library", mishearings: [] },
  mongodb: { display: "MongoDB", mishearings: ["mongo db", "mongo"] },
  mysql: {
    display: "MySQL",
    mishearings: ["my sql", "my sequel", "my secret"],
  },
  postgresql: {
    display: "PostgreSQL",
    mishearings: [
      "post gress",
      "postgres",
      "post gress sql",
      "postgre sql",
      "or Square SQL",
    ],
  },
  redis: { display: "Redis", mishearings: ["read is", "reddish"] },
  firebase: { display: "Firebase", mishearings: ["fire base"] },
  aws: { display: "AWS", mishearings: [] },
  azure: { display: "Azure", mishearings: [] },
  gcp: { display: "GCP", mishearings: [] },
  docker: { display: "Docker", mishearings: ["doctor"] },
  kubernetes: { display: "Kubernetes", mishearings: ["kube", "cube"] },
  "ci/cd": { display: "CI/CD", mishearings: ["ci cd", "cicd"] },
  git: { display: "Git", mishearings: ["Egypt"] },
  github: { display: "GitHub", mishearings: ["git hub"] },
  gitlab: { display: "GitLab", mishearings: ["git lab"] },
  agile: { display: "Agile", mishearings: [] },
  scrum: { display: "Scrum", mishearings: [] },
  figma: { display: "Figma", mishearings: ["fig ma"] },
  accessibility: { display: "Accessibility", mishearings: [] },
  responsive: { display: "Responsive", mishearings: [] },
  performance: { display: "Performance", mishearings: [] },
  microservices: { display: "Microservices", mishearings: ["micro services"] },
  websocket: { display: "WebSocket", mishearings: ["web socket"] },
  "three.js": { display: "Three.js", mishearings: ["three js"] },
  webgl: { display: "WebGL", mishearings: ["web GL", "web gal"] },
  "machine learning": { display: "Machine Learning", mishearings: [] },
  "power bi": { display: "Power BI", mishearings: ["power by"] },
  sql: { display: "SQL", mishearings: ["sequel"] },
  nosql: { display: "NoSQL", mishearings: ["no sql", "no sequel"] },
  code: { display: "Code", mishearings: ["cold"] },

  "tanstack query": {
    display: "Tanstack Query",
    mishearings: ["then stop query"],
  },
};

export const KNOWN_SKILLS = Object.keys(SKILL_DICTIONARY);
