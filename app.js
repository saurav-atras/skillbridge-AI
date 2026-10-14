// GEMINI API KEY (Starts with AIzaSy... or leave empty for offline smart fallback)
const GEMINI_API_KEY = ""; 

// Comprehensive Internship Dataset
const allInternships = [
  { id: 1, category: "tech", type: "Remote", title: "AI / ML Developer Intern", company: "TechNova AI", location: "Remote", stipend: "₹18,000 / mo", duration: "3 Months", tags: ["Python", "PyTorch", "APIs"], hot: true },
  { id: 2, category: "tech", type: "Hybrid", title: "Frontend React Developer", company: "Creative Web Studio", location: "Bengaluru", stipend: "₹12,000 / mo", duration: "2 Months", tags: ["React", "Tailwind", "JS"], hot: false },
  { id: 3, category: "data", type: "Remote", title: "Data Analyst Intern", company: "DataMetrics Inc", location: "Remote", stipend: "₹15,000 / mo", duration: "6 Months", tags: ["SQL", "Python", "PowerBI"], hot: true },
  { id: 4, category: "tech", type: "In-Office", title: "Backend Node.js Engineer", company: "CloudScale Systems", location: "Hyderabad", stipend: "₹20,000 / mo", duration: "3 Months", tags: ["Node.js", "MongoDB", "Express"], hot: false },
  { id: 5, category: "data", type: "Remote", title: "Machine Learning Associate", company: "NeuroTech Labs", location: "Remote", stipend: "₹22,000 / mo", duration: "4 Months", tags: ["TensorFlow", "Scikit-Learn"], hot: true },
  { id: 6, category: "tech", type: "Remote", title: "UI/UX & Product Design Intern", company: "PixelCraft", location: "Remote", stipend: "₹10,000 / mo", duration: "2 Months", tags: ["Figma", "Prototyping"], hot: false }
];

// Project Ideas Dataset
const projectIdeas = [
  { title: "AI Resume Analyzer SaaS", tag: "Full-Stack + AI", desc: "Build an application that takes PDF resumes and parses skills using Gemini API.", level: "Advanced" },
  { title: "Real-time Collaboration Canvas", tag: "Frontend + WebSockets", desc: "Multi-user drawing and node-based mindmapping board using React and Socket.io.", level: "Intermediate" },
  { title: "Automated E-commerce API", tag: "Backend Systems", desc: "RESTful architecture with JWT authentication, Stripe webhooks, and Redis caching.", level: "Intermediate" }
];

// Toast Notification System
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  
  const toast = document.createElement("div");
  const bg = type === "success" ? "bg-slate-900 text-white" : "bg-red-600 text-white";
  const icon = type === "success" ? "fa-circle-check text-emerald-400" : "fa-triangle-exclamation text-amber-300";

  toast.className = `${bg} px-4 py-3 rounded-xl shadow-xl border border-white/10 text-xs font-semibold flex items-center gap-3 transition-all transform translate-y-2`;
  toast.innerHTML = `<i class="fa-solid ${icon} text-base"></i> <span>${message}</span>`;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Modal Toggle Helper
function toggleModal(modalId, show) {
  const modal = document.getElementById(modalId);
  if (modal) {
    if (show) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    } else {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    }
  }
}

// Gemini API Integration with Fallback
async function fetchGeminiResponse(userPrompt) {
  if (!GEMINI_API_KEY || !GEMINI_API_KEY.startsWith("AIzaSy")) {
    await new Promise(r => setTimeout(r, 600));
    return generateSmartOfflineReply(userPrompt);
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `You are SkillBridge AI Career Mentor. Keep answers actionable, short, and student-focused.\n\nUser Question: ${userPrompt}` }] }]
      })
    });
    
    const data = await response.json();
    if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      return generateSmartOfflineReply(userPrompt);
    }
  } catch (error) {
    return generateSmartOfflineReply(userPrompt);
  }
}

// Offline Smart Mentor Intelligence
function generateSmartOfflineReply(query) {
  const q = query.toLowerCase();
  if (q.includes("resume") || q.includes("ats")) {
    return "💡 **3 Golden Resume Rules for 2026:**\n1. Quantify achievements (e.g. 'Improved speed by 35%').\n2. Include active GitHub links for every mentioned project.\n3. Keep strictly to a single-page clean layout.";
  } else if (q.includes("interview") || q.includes("prep")) {
    return "🎯 **Interview Quick Guide:**\n• Structure project explanations using STAR method (Situation, Task, Action, Result).\n• Practice live coding for HashMaps, Arrays, and REST API calls.\n• Always prepare 2 smart questions regarding company tech stack.";
  } else if (q.includes("backend") || q.includes("node") || q.includes("roadmap")) {
    return "🚀 **Recommended Backend Roadmap:**\n1. Language: JavaScript (ES6+) or Python\n2. Framework: Express.js or FastApi\n3. Database: PostgreSQL (SQL) + Redis (Cache)\n4. DevOps: Docker containerization & GitHub Actions CI/CD.";
  } else {
    return `SkillBridge AI Mentor: "Great focus on '${query}'! Focus on building 2 live portfolio projects and deployment on Vercel/Render over theoretical reading."`;
  }
}

// Render Internship Cards
function renderInternships(filter = "all", searchQuery = "") {
  const container = document.getElementById("internships-container");
  if (!container) return;

  container.innerHTML = "";

  const filtered = allInternships.filter(item => {
    const matchesFilter = filter === "all" ? true :
                          filter === "remote" ? item.type === "Remote" :
                          item.category === filter;
    
    const matchesSearch = searchQuery === "" || 
                          item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="col-span-3 text-center py-12 bg-white rounded-2xl border"><p class="text-slate-500 font-semibold text-sm">No matching internships found. Try searching another keyword!</p></div>`;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between relative group";
    
    card.innerHTML = `
      <div>
        <div class="flex justify-between items-start mb-3">
          <span class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md ${item.type === 'Remote' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'}">${item.type}</span>
          ${item.hot ? '<span class="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-800"><i class="fa-solid fa-fire mr-1"></i>Hot</span>' : ''}
        </div>
        <h3 class="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition">${item.title}</h3>
        <p class="text-xs font-semibold text-indigo-600 mb-4">${item.company} • ${item.location}</p>
        
        <div class="flex items-center justify-between text-xs text-slate-500 font-medium py-2 px-3 bg-slate-50 rounded-xl mb-4">
          <span><i class="fa-solid fa-money-bill-wave text-emerald-600 mr-1.5"></i>${item.stipend}</span>
          <span><i class="fa-solid fa-clock text-slate-400 mr-1.5"></i>${item.duration}</span>
        </div>

        <div class="flex flex-wrap gap-1.5 mb-6">
          ${item.tags.map(t => `<span class="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">${t}</span>`).join('')}
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button data-title="${item.title}" class="apply-now-btn flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm transition">
          Apply Now
        </button>
        <button class="bookmark-btn p-2.5 text-slate-400 hover:text-indigo-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition" title="Save Listing">
          <i class="fa-regular fa-bookmark text-sm"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  // Attach Event Listeners to New Buttons
  document.querySelectorAll(".apply-now-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const title = e.currentTarget.getAttribute("data-title");
      showToast(`Application started for "${title}"!`);
    });
  });

  document.querySelectorAll(".bookmark-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.currentTarget.classList.toggle("text-indigo-600");
      e.currentTarget.innerHTML = e.currentTarget.classList.contains("text-indigo-600") ? '<i class="fa-solid fa-bookmark text-sm"></i>' : '<i class="fa-regular fa-bookmark text-sm"></i>';
      showToast("Saved to your bookmarks!");
    });
  });
}

// Render Interactive Roadmap
function renderRoadmap(pathKey) {
  const display = document.getElementById("roadmap-display");
  if (!display) return;

  const roadmaps = {
    fullstack: {
      title: "Full-Stack Web Engineering Path",
      duration: "4 Months Prep",
      steps: [
        { title: "HTML5, Tailwind CSS & JavaScript ES6+", desc: "Master Async/Await, DOM, and responsive design systems." },
        { title: "Frontend Framework (React.js)", desc: "State management, Hooks, React Router, and Component Architecture." },
        { title: "Backend API Engine (Node & Express)", desc: "REST API routes, Middleware, JWT auth, and database integration." },
        { title: "Deployment & Capstone Project", desc: "Host on Vercel/Render with CI/CD and custom domain." }
      ]
    },
    dataai: {
      title: "Data Science & AI Intelligence Path",
      duration: "5 Months Prep",
      steps: [
        { title: "Python Fundamentals & Data Structures", desc: "List comprehensions, functions, and file handling." },
        { title: "Data Manipulation (Pandas & NumPy)", desc: "Cleaning, merging, and exploratory data analysis." },
        { title: "Machine Learning Foundations", desc: "Scikit-learn, Regression, Classification models." },
        { title: "Generative AI & LLMs", desc: "Prompt engineering, Gemini API integration, and Vector databases." }
      ]
    },
    cloud: {
      title: "Cloud & DevOps Systems Path",
      duration: "3 Months Prep",
      steps: [
        { title: "Linux Shell Scripting & Command Line", desc: "File permissions, Bash scripts, and SSH key security." },
        { title: "Docker Containerization", desc: "Writing Dockerfiles, multi-stage builds, and Docker Compose." },
        { title: "Cloud Platforms (AWS/GCP)", desc: "EC2 instances, S3 buckets, and IAM roles management." },
        { title: "CI/CD Pipelines", desc: "Automated testing and deployment via GitHub Actions." }
      ]
    }
  };

  const selected = roadmaps[pathKey] || roadmaps.fullstack;

  display.innerHTML = `
    <div class="flex justify-between items-center mb-6 border-b pb-4">
      <div>
        <h3 class="font-extrabold text-slate-900 text-xl">${selected.title}</h3>
        <p class="text-xs text-indigo-600 font-semibold mt-0.5">Estimated Duration: ${selected.duration}</p>
      </div>
      <button id="download-roadmap-btn" class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-4 py-2 rounded-xl transition">
        <i class="fa-solid fa-download mr-1.5"></i>Save Steps
      </button>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${selected.steps.map((s, idx) => `
        <div class="p-4 bg-slate-50 rounded-xl border border-slate-200/70 flex gap-3">
          <span class="w-7 h-7 rounded-lg bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0">${idx + 1}</span>
          <div>
            <h4 class="font-bold text-slate-900 text-sm">${s.title}</h4>
            <p class="text-xs text-slate-600 mt-1 leading-relaxed">${s.desc}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById("download-roadmap-btn")?.addEventListener("click", () => showToast("Roadmap steps saved to your profile!"));
}

// Render Project Ideas
function renderProjects() {
  const container = document.getElementById("projects-container");
  if (!container) return;
  container.innerHTML = "";

  projectIdeas.forEach(p => {
    const card = document.createElement("div");
    card.className = "bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition";
    card.innerHTML = `
      <div>
        <div class="flex justify-between items-center mb-3">
          <span class="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700">${p.tag}</span>
          <span class="text-[10px] font-semibold text-slate-400">${p.level}</span>
        </div>
        <h3 class="font-bold text-slate-900 text-base mb-2">${p.title}</h3>
        <p class="text-xs text-slate-600 leading-relaxed mb-6">${p.desc}</p>
      </div>
      <button class="build-project-btn bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs py-2.5 rounded-xl transition">
        Get Project Blueprint
      </button>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll(".build-project-btn").forEach(btn => {
    btn.addEventListener("click", () => showToast("Project Architecture Guide copied to clipboard!"));
  });
}

// DOM Initializer
document.addEventListener("DOMContentLoaded", () => {
  renderInternships();
  renderRoadmap("fullstack");
  renderProjects();

  // Search Bar Functionality
  const handleSearch = () => {
    const input = document.getElementById("hero-search-input")?.value.trim();
    renderInternships("all", input);
    document.getElementById("internships")?.scrollIntoView({ behavior: "smooth" });
  };

  document.getElementById("hero-search-btn")?.addEventListener("click", handleSearch);
  document.getElementById("search-trigger-btn")?.addEventListener("click", () => {
    document.getElementById("hero-search-input")?.focus();
    document.getElementById("hero-search-input")?.scrollIntoView({ behavior: "smooth" });
  });

  // Internship Filter Buttons
  const filterBtns = document.querySelectorAll(".filter-tab");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      filterBtns.forEach(b => {
        b.classList.remove("active-tab", "bg-white", "text-indigo-600", "shadow-sm");
        b.classList.add("text-slate-600");
      });
      const target = e.currentTarget;
      target.classList.add("active-tab", "bg-white", "text-indigo-600", "shadow-sm");
      renderInternships(target.getAttribute("data-filter"));
    });
  });

  // Roadmap Path Selectors
  const pathBtns = document.querySelectorAll(".path-btn");
  pathBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      pathBtns.forEach(b => {
        b.classList.remove("bg-indigo-600", "text-white");
        b.classList.add("bg-white", "text-slate-700");
      });
      const target = e.currentTarget;
      target.classList.remove("bg-white", "text-slate-700");
      target.classList.add("bg-indigo-600", "text-white");
      renderRoadmap(target.getAttribute("data-path"));
    });
  });

  // Random Project Button
  document.getElementById("random-project-btn")?.addEventListener("click", () => {
    const random = projectIdeas[Math.floor(Math.random() * projectIdeas.length)];
    showToast(`Suggested Project: "${random.title}"`);
  });

  // FAQ Accordion
  document.querySelectorAll(".faq-toggle").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const content = e.currentTarget.nextElementSibling;
      const icon = e.currentTarget.querySelector("i");
      
      content.classList.toggle("hidden");
      icon.classList.toggle("rotate-45");
    });
  });

  // Newsletter Submit
  document.getElementById("newsletter-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletter-email").value;
    if (email) {
      showToast("Successfully subscribed to weekly internship alerts!");
      document.getElementById("newsletter-email").value = "";
    }
  });

  // Auth Modals
  document.getElementById("open-login-btn")?.addEventListener("click", () => toggleModal("login-modal", true));
  document.getElementById("close-login-btn")?.addEventListener("click", () => toggleModal("login-modal", false));
  document.getElementById("open-signup-btn")?.addEventListener("click", () => toggleModal("signup-modal", true));
  document.getElementById("close-signup-btn")?.addEventListener("click", () => toggleModal("signup-modal", false));

  document.getElementById("login-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    toggleModal("login-modal", false);
    document.getElementById("auth-buttons")?.classList.add("hidden");
    document.getElementById("user-menu")?.classList.remove("hidden");
    document.getElementById("user-menu")?.classList.add("flex");
    document.getElementById("user-email-display").textContent = email.split('@')[0];
    showToast(`Logged in as ${email}`);
  });

  document.getElementById("logout-btn")?.addEventListener("click", () => {
    document.getElementById("user-menu")?.classList.add("hidden");
    document.getElementById("auth-buttons")?.classList.remove("hidden");
    showToast("Logged out successfully");
  });

  // AI MODAL FEATURES
  const aiModalContent = document.getElementById("ai-modal-content");
  document.getElementById("close-ai-btn")?.addEventListener("click", () => toggleModal("ai-modal", false));

  // 1. Smart ATS Scanner
  document.getElementById("open-ats-tool")?.addEventListener("click", () => {
    aiModalContent.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center space-x-3 border-b pb-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold"><i class="fa-solid fa-file-contract"></i></div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">ATS Resume Scanner Pro</h3>
            <p class="text-xs text-slate-500">Real-time keyword matching against job requirements.</p>
          </div>
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Target Engineering Role</label>
          <input type="text" id="ats-role" class="w-full border rounded-xl p-2.5 text-xs focus:outline-indigo-600" placeholder="e.g. Full-Stack Developer">
        </div>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1">Resume Content / Skills Text</label>
          <textarea id="ats-text" rows="5" class="w-full border rounded-xl p-2.5 text-xs focus:outline-indigo-600" placeholder="Paste your resume text or skills list here..."></textarea>
        </div>
        <button id="run-ats-btn" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition">Analyze ATS Score</button>
        <div id="ats-report" class="hidden p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2"></div>
      </div>
    `;
    toggleModal("ai-modal", true);

    document.getElementById("run-ats-btn")?.addEventListener("click", () => {
      const text = document.getElementById("ats-text").value.trim();
      const report = document.getElementById("ats-report");
      if (!text) return showToast("Please paste your resume text first!", "error");

      const targetKeywords = ["javascript", "react", "python", "git", "sql", "node", "api", "tailwind", "aws", "docker"];
      let matched = [];
      let missing = [];

      targetKeywords.forEach(kw => {
        if (text.toLowerCase().includes(kw)) matched.push(kw);
        else missing.push(kw);
      });

      const score = Math.round((matched.length / targetKeywords.length) * 100);

      report.classList.remove("hidden");
      report.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold text-slate-900 text-xs">ATS Compatibility Index:</span>
          <span class="text-lg font-extrabold ${score >= 60 ? 'text-emerald-600' : 'text-amber-600'}">${score}% Match</span>
        </div>
        <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
          <div class="bg-indigo-600 h-full transition-all duration-500" style="width: ${score}%"></div>
        </div>
        <p class="text-xs text-emerald-700 font-medium"><strong>Detected Keywords:</strong> ${matched.join(", ") || "None"}</p>
        <p class="text-xs text-red-600 font-medium"><strong>Missing Critical Skills:</strong> ${missing.join(", ")}</p>
      `;
    });
  });

  // 2. Skill Gap Calculator
  document.getElementById("open-skill-tool")?.addEventListener("click", () => {
    aiModalContent.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center space-x-3 border-b pb-3">
          <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold"><i class="fa-solid fa-chart-line"></i></div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">Skill Gap Analyzer</h3>
            <p class="text-xs text-slate-500">Rate your current confidence level (1 = Beginner, 5 = Master):</p>
          </div>
        </div>
        
        <div class="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Frontend (HTML/CSS/JS/React)</span>
              <span id="s1-val" class="text-indigo-600">3</span>
            </div>
            <input type="range" id="s1" min="1" max="5" value="3" class="w-full accent-indigo-600">
          </div>
          <div>
            <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Backend & REST APIs (Node/Express)</span>
              <span id="s2-val" class="text-indigo-600">2</span>
            </div>
            <input type="range" id="s2" min="1" max="5" value="2" class="w-full accent-indigo-600">
          </div>
          <div>
            <div class="flex justify-between text-xs font-bold text-slate-700 mb-1">
              <span>Databases (SQL/MongoDB)</span>
              <span id="s3-val" class="text-indigo-600">2</span>
            </div>
            <input type="range" id="s3" min="1" max="5" value="2" class="w-full accent-indigo-600">
          </div>
        </div>

        <button id="calc-gap-btn" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl text-xs shadow-md transition">Generate Skill Gap Report</button>
        <div id="gap-report" class="hidden p-4 rounded-xl bg-purple-50 border border-purple-200"></div>
      </div>
    `;
    toggleModal("ai-modal", true);

    ['s1', 's2', 's3'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', (e) => {
        document.getElementById(`${id}-val`).textContent = e.target.value;
      });
    });

    document.getElementById("calc-gap-btn")?.addEventListener("click", () => {
      const v1 = parseInt(document.getElementById("s1").value);
      const v2 = parseInt(document.getElementById("s2").value);
      const v3 = parseInt(document.getElementById("s3").value);
      const avg = Math.round(((v1 + v2 + v3) / 15) * 100);

      const report = document.getElementById("gap-report");
      report.classList.remove("hidden");
      report.innerHTML = `
        <div class="text-center mb-2">
          <span class="text-xs font-bold text-purple-700 uppercase">Industry Readiness Index</span>
          <p class="text-3xl font-extrabold text-purple-900">${avg}%</p>
        </div>
        <p class="text-xs text-slate-700 font-medium">• ${v2 < 3 ? 'Priority Step: Strengthen Express REST API routes and JWT authentication.' : 'Solid core foundations! Build 1 full-stack capstone project now.'}</p>
      `;
    });
  });

  // 3. Gemini Chatbot Tool
  document.getElementById("open-chatbot-tool")?.addEventListener("click", () => {
    aiModalContent.innerHTML = `
      <div class="flex flex-col h-[480px]">
        <div class="flex items-center space-x-3 border-b pb-3 mb-3">
          <div class="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-sm"><i class="fa-solid fa-robot"></i></div>
          <div>
            <h3 class="font-bold text-slate-900 text-sm">Gemini AI Career Mentor</h3>
            <p class="text-[10px] text-emerald-600 font-semibold">• Active Assistant</p>
          </div>
        </div>

        <div id="chat-box" class="flex-grow border rounded-xl p-3 overflow-y-auto bg-slate-50 space-y-3 text-xs">
          <div class="bg-indigo-100 text-indigo-950 p-3 rounded-xl max-w-[85%] leading-relaxed">
            Hello! I am your SkillBridge AI Career Mentor. Ask me anything about resume improvements, technical interview preparation, or career roadmaps.
          </div>
        </div>

        <!-- Quick Prompt Chips -->
        <div class="flex gap-1.5 my-2 overflow-x-auto pb-1 text-[10px]" id="prompt-chips">
          <button class="chip bg-slate-200 hover:bg-indigo-100 text-slate-700 px-2.5 py-1 rounded-lg shrink-0 font-semibold transition">Resume Tips</button>
          <button class="chip bg-slate-200 hover:bg-indigo-100 text-slate-700 px-2.5 py-1 rounded-lg shrink-0 font-semibold transition">Interview Prep</button>
          <button class="chip bg-slate-200 hover:bg-indigo-100 text-slate-700 px-2.5 py-1 rounded-lg shrink-0 font-semibold transition">Backend Roadmap</button>
        </div>

        <div class="flex gap-2">
          <input type="text" id="chat-input" class="w-full border rounded-xl p-2.5 text-xs focus:outline-indigo-600" placeholder="Type your career question...">
          <button id="send-chat-btn" class="bg-pink-600 hover:bg-pink-700 text-white px-4 rounded-xl text-xs font-bold transition">Send</button>
        </div>
      </div>
    `;
    toggleModal("ai-modal", true);

    const chatBox = document.getElementById("chat-box");
    const chatInput = document.getElementById("chat-input");

    const sendMessage = async (textToSend) => {
      const query = textToSend || chatInput.value.trim();
      if (!query) return;

      chatBox.innerHTML += `<div class="bg-slate-800 text-white p-3 rounded-xl max-w-[85%] ml-auto text-right leading-relaxed">${query}</div>`;
      if (!textToSend) chatInput.value = "";
      chatBox.scrollTop = chatBox.scrollHeight;

      const loadingId = `load-${Date.now()}`;
      chatBox.innerHTML += `<div id="${loadingId}" class="bg-indigo-50 text-indigo-600 italic p-3 rounded-xl max-w-[85%]">Gemini AI is analyzing...</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;

      const reply = await fetchGeminiResponse(query);
      document.getElementById(loadingId)?.remove();

      chatBox.innerHTML += `<div class="bg-indigo-100 text-indigo-950 p-3 rounded-xl max-w-[85%] leading-relaxed whitespace-pre-wrap">${reply}</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;
    };

    document.getElementById("send-chat-btn")?.addEventListener("click", () => sendMessage());
    chatInput?.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

    document.querySelectorAll(".chip").forEach(chip => {
      chip.addEventListener("click", (e) => sendMessage(e.target.textContent));
    });
  });

  // Footer Modal Handlers
  document.querySelectorAll(".footer-modal-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const type = e.target.getAttribute("data-type");
      aiModalContent.innerHTML = `
        <div class="p-2 space-y-3">
          <h3 class="text-xl font-bold text-slate-900 uppercase">${type} Handbook</h3>
          <p class="text-xs text-slate-600 leading-relaxed">SkillBridge AI platform guide and best practices for candidate applications in 2026.</p>
        </div>
      `;
      toggleModal("ai-modal", true);
    });
  });
});