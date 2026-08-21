/* NESTLEGAL SHARED BLOG UTILITIES */

var BLOG_STORAGE_KEY = "nestlegal_blogs";

var DEFAULT_CATEGORIES = [
  "Civil Litigation",
  "Criminal Law",
  "Family Law",
  "Property Law",
  "Cyber Crime",
  "Contracts",
  "Legal Advice",
  "General Legal Insight"
];

function getBlogs() {
  try {
    return JSON.parse(localStorage.getItem(BLOG_STORAGE_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveBlogs(blogs) {
  localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(blogs));
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHTML(value) {
  if (value === null || value === undefined) return "";
  var s = String(value);
  var a = String.fromCharCode(38);  /* & */
  return s
    .replace(/&/g, a + "amp;")
    .replace(/</g, a + "lt;")
    .replace(/>/g, a + "gt;")
    .replace(/"/g, a + "quot;")
    .replace(/'/g, a + "#39;");
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

/**
 * Populates localStorage with sample published articles the first time
 * the site is opened, so the blog grid on the homepage and the full
 * listing on blogs.html are never empty out of the box.
 *
 * Safe to call on every page load — it only writes data when storage
 * is completely empty, so it will never overwrite or duplicate any
 * articles created later through the admin dashboard.
 */
function seedBlogs() {
  var existing = getBlogs();
  if (existing.length) return;

  var now = new Date();

  function daysAgo(n) {
    var d = new Date(now.getTime());
    d.setDate(d.getDate() - n);
    return d.toISOString();
  }

  var sample = [
    {
      id: "seed-1",
      slug: "understanding-civil-litigation-basics",
      title: "Understanding the Basics of Civil Litigation",
      excerpt: "A plain-language look at how civil disputes move through the court system, from filing to resolution.",
      category: "Civil Litigation",
      tags: ["Litigation", "Civil Procedure"],
      author: "NestLegal",
      coverImage: "",
      status: "published",
      featured: true,
      order: 1,
      publishedAt: daysAgo(3),
      updatedAt: daysAgo(3),
      content:
        "<p>Civil litigation refers to the legal process through which individuals or organisations resolve non-criminal disputes. Understanding the stages involved can help parties approach a matter with realistic expectations.</p>" +
        "<h3>Filing the Claim</h3>" +
        "<p>A civil matter typically begins when one party files a complaint outlining the dispute and the relief sought.</p>" +
        "<h3>Response and Discovery</h3>" +
        "<p>The opposing party responds, after which both sides exchange relevant information and evidence during the discovery phase.</p>" +
        "<h3>Resolution</h3>" +
        "<p>Many matters settle before trial, though some proceed to a full hearing where a judge determines the outcome.</p>"
    },
    {
      id: "seed-2",
      slug: "property-disputes-what-to-know",
      title: "Property Disputes: What Owners Should Know",
      excerpt: "Common causes of property disputes and the practical first steps toward resolving them.",
      category: "Property Law",
      tags: ["Property", "Ownership"],
      author: "NestLegal",
      coverImage: "",
      status: "published",
      featured: true,
      order: 2,
      publishedAt: daysAgo(7),
      updatedAt: daysAgo(7),
      content:
        "<p>Property disputes can arise from boundary disagreements, title issues, inheritance matters, or breaches of sale agreements.</p>" +
        "<h3>Common Triggers</h3>" +
        "<p>Unclear documentation and undisclosed encumbrances are frequent sources of conflict between parties.</p>" +
        "<h3>Early Steps</h3>" +
        "<p>Gathering title documents and any correspondence related to the property is an important first step before pursuing legal advice.</p>"
    },
    {
      id: "seed-3",
      slug: "navigating-family-law-matters",
      title: "Navigating Family Law Matters with Clarity",
      excerpt: "An overview of how family law matters are approached, with an emphasis on clear communication.",
      category: "Family Law",
      tags: ["Family", "Divorce", "Custody"],
      author: "NestLegal",
      coverImage: "",
      status: "published",
      featured: true,
      order: 3,
      publishedAt: daysAgo(12),
      updatedAt: daysAgo(12),
      content:
        "<p>Family law matters are often emotionally difficult as well as legally complex. A considered approach can make the process easier to manage.</p>" +
        "<h3>Common Matters</h3>" +
        "<p>These include divorce, child custody, maintenance and division of marital property.</p>" +
        "<h3>Approach</h3>" +
        "<p>Clear documentation and early legal guidance often lead to more efficient resolutions.</p>"
    },
    {
      id: "seed-4",
      slug: "cyber-crime-reporting-guide",
      title: "What to Do If You're a Victim of Cyber Crime",
      excerpt: "Practical steps to take immediately after discovering fraud, hacking, or online harassment.",
      category: "Cyber Crime",
      tags: ["Cyber Crime", "Fraud"],
      author: "NestLegal",
      coverImage: "",
      status: "published",
      featured: false,
      order: 4,
      publishedAt: daysAgo(18),
      updatedAt: daysAgo(18),
      content:
        "<p>Cyber crime cases require quick action to preserve evidence and limit further harm.</p>" +
        "<h3>Immediate Steps</h3>" +
        "<p>Preserve screenshots, transaction records and any communication related to the incident.</p>" +
        "<h3>Reporting</h3>" +
        "<p>Matters can typically be reported through dedicated cyber crime portals or the local police station.</p>"
    },
    {
      id: "seed-5",
      slug: "contract-essentials-what-to-check",
      title: "Contract Essentials: What to Check Before You Sign",
      excerpt: "The key clauses worth reviewing carefully before entering into any agreement.",
      category: "Contracts",
      tags: ["Contracts", "Agreements"],
      author: "NestLegal",
      coverImage: "",
      status: "published",
      featured: false,
      order: 5,
      publishedAt: daysAgo(25),
      updatedAt: daysAgo(25),
      content:
        "<p>A contract sets out the rights and obligations of each party, so careful review before signing is essential.</p>" +
        "<h3>Key Clauses</h3>" +
        "<p>Pay particular attention to termination conditions, indemnity clauses and dispute resolution mechanisms.</p>" +
        "<h3>When to Seek Advice</h3>" +
        "<p>Higher-value or long-term agreements generally benefit from a legal review before execution.</p>"
    },
    {
      id: "seed-6",
      slug: "when-to-seek-legal-advice",
      title: "When Should You Actually Seek Legal Advice?",
      excerpt: "Signs that a situation has moved from a personal matter to one requiring professional legal input.",
      category: "Legal Advice",
      tags: ["Legal Advice"],
      author: "NestLegal",
      coverImage: "",
      status: "published",
      featured: false,
      order: 6,
      publishedAt: daysAgo(30),
      updatedAt: daysAgo(30),
      content:
        "<p>Not every dispute requires a lawyer, but some situations carry risks that are easy to underestimate.</p>" +
        "<h3>Warning Signs</h3>" +
        "<p>Formal notices, financial exposure, or matters involving contracts and property are strong indicators that advice is warranted.</p>" +
        "<h3>Getting Started</h3>" +
        "<p>An initial consultation can clarify whether formal legal action is necessary or whether the matter can be resolved directly.</p>"
    }
  ];

  saveBlogs(sample);
}