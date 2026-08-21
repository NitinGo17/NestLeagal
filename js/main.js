/* NESTLEGAL - MAIN.JS */

/* Safe UUID fallback - works on file:// protocol where crypto.randomUUID is unavailable */
function safeUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try { return crypto.randomUUID(); } catch(e) {}
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0;
    var v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

var SERVICES = [
  ["01","Divorce & Litigation","Divorce litigation involves legal proceedings to end a marriage, including disputes regarding maintenance, property, custody, or other issues."],
  ["02","Civil Rights Litigation","Civil rights litigation deals with violations of an individual's basic legal rights, including discrimination or denial of legal rights."],
  ["03","Eviction Suits","Legal proceedings relating to the removal of a tenant from a property when lawful grounds for eviction exist."],
  ["04","Will Writing","Preparing a legal document stating how a person wants their assets distributed, ensuring wishes are clearly recorded."],
  ["05","Mutual Consent Divorce","A divorce sought when both spouses agree to end their marriage, including agreement on maintenance and child custody."],
  ["06","Property Dispute Litigation","Disagreements concerning ownership or possession of property between family members, buyers, sellers, or other parties."],
  ["07","Partition Suits","Filed when co-owners seek separate shares in jointly owned property, commonly used for family or inherited property."],
  ["08","Domestic Violence Cases","Legal remedies for persons facing violence or abuse within a domestic relationship, including protection and relief."],
  ["09","Child Custody Cases","Legal and physical care of a child after a family dispute or separation, determined by the child's best interests."],
  ["10","Maintenance & Alimony Cases","Financial support for an eligible spouse or family member, considering income, needs, and financial circumstances."],
  ["11","Anticipatory Bail","A legal remedy available to a person who fears arrest, protecting against unnecessary or unlawful detention."],
  ["12","Dowry Harassment Cases","Cases involving allegations of harassment or cruelty connected with dowry demands, with criminal and family-law consequences."],
  ["13","Senior Citizen Legal Matters","Protecting the rights and interests of elderly persons, including property, maintenance, inheritance, and family issues."],
  ["14","Corporate Cases","Legal disputes and issues concerning companies, including shareholder disputes, contractual matters, and commercial conflicts."],
  ["15","Labour Cases","Disputes between employees and employers relating to termination, wages, working conditions, and employment rights."],
  ["16","Gratuity Claims","Statutory payment available to eligible employees after qualifying service, including eligibility and calculation disputes."],
  ["17","Recovery of Money Suit","Legal recovery of money owed by another person or entity arising from loans, unpaid invoices, contracts, or obligations."],
  ["18","Company Law Matters","Legal issues relating to the formation and operation of companies, including governance, compliance, and disputes."],
  ["19","Cyber Crime Cases","Offences committed using computers, mobile devices, or the internet, including online fraud, hacking, and identity theft."],
  ["20","Defamation Cases","False statements that harm the reputation of an individual or organisation, seeking civil or criminal remedies."],
  ["21","Judicial Separation","Spouses legally living separately without dissolving the marriage, with the marital relationship continuing legally."]
];

var NAV_LINKS = [
  ["index.html", "index", "Home"],
  ["about.html", "about", "About"],
  ["services.html", "services", "Services"],
  ["courts.html", "courts", "Courts"],
  ["blogs.html", "blogs", "Blogs"],
  ["contact.html", "contact", "Contact"]
];

function initShell() {
  var page = location.pathname.split("/").pop().replace(".html", "") || "index";

  document.querySelectorAll(".nav-links").forEach(function(el) {
    el.innerHTML = NAV_LINKS.map(function(link) {
      var href = link[0], key = link[1], label = link[2];
      var cls = key === page ? ' class="active"' : "";
      return '<a href="' + href + '" data-page="' + key + '"' + cls + ">" + label + "</a>";
    }).join("");
  });

  document.querySelectorAll("[data-menu]").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var menu = document.querySelector(".nav-links");
      if (!menu) return;
      var isOpen = menu.classList.toggle("open");
      document.body.classList.toggle("menu-open", isOpen);
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  document.querySelectorAll(".nav-links a").forEach(function(a) {
    a.addEventListener("click", function() {
      var menu = document.querySelector(".nav-links");
      if (menu) menu.classList.remove("open");
      document.body.classList.remove("menu-open");
      document.querySelectorAll("[data-menu]").forEach(function(btn) {
        btn.setAttribute("aria-expanded", "false");
      });
    });
  });

  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      var menu = document.querySelector(".nav-links");
      if (menu) menu.classList.remove("open");
      document.body.classList.remove("menu-open");
      document.querySelectorAll("[data-menu]").forEach(function(btn) {
        btn.setAttribute("aria-expanded", "false");
      });
    }
  });

  document.querySelectorAll("[data-year]").forEach(function(e) {
    e.textContent = new Date().getFullYear();
  });

  document.querySelectorAll("[data-services]").forEach(function(container) {
    container.innerHTML = SERVICES.map(function(service) {
      var n = service[0], t = escapeHTML(service[1]), d = escapeHTML(service[2]);
      return '<article class="service-card reveal">' +
        '<span class="service-number">' + n + "</span>" +
        "<h3>" + t + "</h3>" +
        "<p>" + d + "</p>" +
        "</article>";
    }).join("");
  });

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  }, { threshold: 0.08 });

  document.querySelectorAll(".reveal").forEach(function(e) {
    observer.observe(e);
  });
}

/* =========================================================
   SEED BLOGS - 6 articles of 200-300 words each
   ========================================================= */

function seedBlogs() {
  if (getBlogs().length) return;
  var now = new Date().toISOString();

  var b1 = {
    id: safeUUID(),
    title: "Understanding Divorce Litigation: What You Need to Know",
    excerpt: "Divorce litigation is a legal process that dissolves a marriage through the court. Understanding the stages, from filing to final order, helps reduce uncertainty.",
    category: "Family Law",
    tags: ["Divorce", "Family", "Litigation"],
    author: "NestLegal",
    status: "published",
    featured: true,
    order: 1,
    coverImage: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1400&q=80",
    content: "<p>Divorce litigation is the legal process through which a marriage is formally dissolved by a court. It is often a difficult and emotionally taxing experience, but understanding the process can help reduce uncertainty and anxiety.</p><h2>Grounds for Divorce</h2><p>Depending on the applicable personal law, a divorce may be sought on specific grounds such as cruelty, desertion, adultery, or irretrievable breakdown of the marriage. In cases where both spouses agree to end the marriage, a mutual consent divorce can be filed, which is generally faster and less adversarial.</p><h2>The Legal Process</h2><p>The process begins with the filing of a petition before the appropriate family court. The petitioner sets out the grounds for divorce and the relief sought, which may include maintenance, child custody, and division of property. The other spouse is then served with the petition and given an opportunity to respond.</p><p>The court may pass interim orders for maintenance, child custody, or protection during the pendency of the proceedings. These temporary arrangements can significantly affect the positions of both parties while the matter is being resolved.</p><h2>Final Order</h2><p>After considering the evidence, arguments, and applicable law, the court passes a final order dissolving the marriage and addressing all connected issues such as custody, maintenance, and property division. A properly presented case, supported by clear evidence and sound legal arguments, can make a meaningful difference to the outcome. Consulting a lawyer at the earliest stage ensures that your rights are protected throughout the proceedings.</p>",
    createdAt: now, updatedAt: now, publishedAt: now
  };

  var b2 = {
    id: safeUUID(),
    title: "Property Disputes: How to Protect Your Ownership Rights",
    excerpt: "Property disputes can arise between family members, buyers, sellers, or co-owners. Understanding the legal framework and acting early can protect your interests.",
    category: "Property Law",
    tags: ["Property", "Dispute", "Litigation"],
    author: "NestLegal",
    status: "published",
    featured: true,
    order: 2,
    coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80",
    content: "<p>Property disputes are among the most common and complex legal matters in India. They can arise between family members over inherited property, between buyers and sellers over transactions, or between co-owners seeking partition of jointly held assets.</p><h2>Common Types of Property Disputes</h2><p>Disputes may concern ownership, possession, boundaries, tenancy, or unauthorised occupation. Inherited property disputes are particularly common, especially when a will is unclear, contested, or absent. Partition suits are filed when co-owners wish to separate their shares in jointly owned property.</p><h2>The Importance of Documentation</h2><p>Title deeds, sale agreements, mutation records, property tax receipts, and encumbrance certificates are all critical documents in establishing ownership. A lawyer examines these documents to determine the strength of your claim and identifies any defects or irregularities that may affect your rights.</p><h2>Legal Remedies</h2><p>Depending on the nature of the dispute, legal remedies may include filing a suit for declaration of title, recovery of possession, partition, or injunction to prevent unauthorised construction or transfer. In some cases, a legal notice may be sufficient to resolve the matter without resorting to full litigation.</p><h2>Acting Early</h2><p>Delay in addressing a property dispute can weaken your legal position. Records may be lost, witnesses may become unavailable, and adverse possession claims may strengthen over time. Consulting a lawyer at the first sign of a dispute ensures that your rights are documented and protected from the outset.</p>",
    createdAt: now, updatedAt: now, publishedAt: now
  };

  var b3 = {
    id: safeUUID(),
    title: "Cyber Crime: Legal Remedies for Online Fraud and Hacking",
    excerpt: "As digital transactions increase, cyber crime has become a serious threat. Knowing the legal remedies available can help victims protect their rights and recover losses.",
    category: "Cyber Crime",
    tags: ["Cyber Crime", "Fraud", "Digital"],
    author: "NestLegal",
    status: "published",
    featured: true,
    order: 3,
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80",
    content: "<p>Cyber crime covers a wide range of offences committed using computers, mobile devices, or the internet. As digital payments, online banking, and social media become part of daily life, the risk of falling victim to cyber crime has increased significantly.</p><h2>Common Types of Cyber Crime</h2><p>Online fraud is the most frequently reported cyber offence. It includes phishing scams, fake investment schemes, UPI fraud, and fraudulent e-commerce transactions. Other common offences include hacking, identity theft, unauthorised access to data, cyberstalking, and the spreading of defamatory or obscene content online.</p><h2>Legal Framework</h2><p>Cyber crimes in India are primarily governed by the Information Technology Act, along with relevant provisions of the Indian Penal Code. The law provides for both criminal punishment and civil remedies, depending on the nature and severity of the offence.</p><h2>What to Do If You Are a Victim</h2><p>If you are a victim of cyber crime, the first step is to preserve all evidence. Take screenshots of fraudulent messages, save transaction records, and note down the timeline of events. Report the incident to the cyber crime cell or through the National Cyber Crime Reporting Portal.</p><p>Consulting a lawyer is essential to understand the available legal remedies, file a formal complaint, and pursue recovery of lost funds. Prompt action increases the chances of tracing the offender and recovering the money. In many cases, banks and payment platforms may also be held liable if they failed to implement adequate security measures.</p>",
    createdAt: now, updatedAt: now, publishedAt: now
  };

  var b4 = {
    id: safeUUID(),
    title: "Child Custody: What the Court Considers",
    excerpt: "Child custody cases are decided based on the welfare and best interests of the child. Understanding the factors the court considers can help parents prepare.",
    category: "Family Law",
    tags: ["Child Custody", "Family", "Legal Advice"],
    author: "NestLegal",
    status: "published",
    featured: false,
    order: 4,
    coverImage: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1400&q=80",
    content: "<p>Child custody cases arise when parents separate, divorce, or dispute the care and upbringing of a child. The court's primary consideration in any custody matter is the welfare and best interests of the child, not the preferences or rights of the parents.</p><h2>Types of Custody</h2><p>Custody may be physical (where the child lives) or legal (the right to make decisions about the child's education, health, and upbringing). A court may grant sole custody to one parent, joint custody to both, or visitation rights to the non-custodial parent. In some cases, guardianship may be granted to a third party, such as a grandparent.</p><h2>Factors the Court Considers</h2><p>The court considers several factors when deciding custody, including the age and gender of the child, the financial stability of each parent, the child's existing living arrangements, the emotional bond between the child and each parent, and the ability of the parent to provide a safe and nurturing environment. In some cases, the court may also consider the child's own preference, depending on the child's age and maturity.</p><h2>The Legal Process</h2><p>Custody proceedings begin with an application before the family court. The court may appoint a counsellor or welfare officer to assess the home environment and the child's relationship with each parent. Interim custody may be granted while the case is ongoing. A lawyer represents the parent's case, presents relevant evidence, and argues for an arrangement that serves the child's best interests.</p><p>It is important to approach custody matters with honesty and cooperation, as the court values a parent's willingness to support the child's relationship with the other parent.</p>",
    createdAt: now, updatedAt: now, publishedAt: now
  };

  var b5 = {
    id: safeUUID(),
    title: "Anticipatory Bail: Protecting Yourself from Unlawful Arrest",
    excerpt: "Anticipatory bail is a legal remedy that protects a person who fears arrest. Understanding when and how to seek it can prevent unnecessary detention.",
    category: "Criminal Law",
    tags: ["Bail", "Criminal", "Legal Advice"],
    author: "NestLegal",
    status: "published",
    featured: false,
    order: 5,
    coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1400&q=80",
    content: "<p>Anticipatory bail is a legal remedy available to a person who has reason to believe that they may be arrested on accusations of a non-bailable offence. It is a pre-arrest protection that allows the person to seek bail in anticipation of arrest, rather than waiting to be taken into custody first.</p><h2>When to Apply</h2><p>An application for anticipatory bail is made before the appropriate court, usually a Sessions Court or the High Court, under the relevant provisions of the Code of Criminal Procedure. The applicant must demonstrate that they have reason to fear arrest based on a specific accusation or complaint.</p><h2>What the Court Considers</h2><p>The court considers several factors when deciding whether to grant anticipatory bail, including the nature and seriousness of the alleged offence, whether the accusation appears to be motivated or frivolous, the applicant's criminal history, the likelihood of the applicant fleeing from justice, and whether the applicant is likely to tamper with evidence or influence witnesses.</p><h2>Conditions and Protections</h2><p>If anticipatory bail is granted, the court may impose conditions such as requiring the person to cooperate with the investigation, not leave the country without permission, or not contact witnesses. The protection remains in effect as long as the conditions are complied with.</p><h2>The Importance of Early Action</h2><p>Waiting until an arrest is imminent can limit your legal options. If you have reason to believe that a false or exaggerated complaint may be filed against you, consulting a lawyer immediately allows them to prepare and file the anticipatory bail application promptly. This protects your liberty and gives you time to build a proper defence.</p>",
    createdAt: now, updatedAt: now, publishedAt: now
  };

  var b6 = {
    id: safeUUID(),
    title: "Will Writing: Securing Your Family's Future",
    excerpt: "A properly drafted will can prevent family disputes and ensure your assets are distributed according to your wishes. Understanding the legal requirements is essential.",
    category: "General Legal Insight",
    tags: ["Will Writing", "Estate", "Planning"],
    author: "NestLegal",
    status: "published",
    featured: false,
    order: 6,
    coverImage: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=1400&q=80",
    content: "<p>A will is a legal document that expresses how a person wishes their assets and property to be distributed after their death. A properly drafted will can prevent family disputes, reduce the risk of litigation, and provide clarity and certainty for the family during a difficult time.</p><h2>Why You Need a Will</h2><p>Without a will, the distribution of your assets is governed by the applicable personal succession laws, which may not reflect your wishes. A will gives you control over who receives your property, in what proportions, and under what conditions. It also allows you to appoint a guardian for minor children and name an executor to manage your estate.</p><h2>Key Legal Requirements</h2><p>For a will to be legally valid, it must be in writing, signed by the person making it (the testator), and witnessed by at least two witnesses. The witnesses should not be beneficiaries under the will. The language should be clear, unambiguous, and consistent throughout the document. The testator must be of sound mind and act voluntarily, without coercion or undue influence.</p><h2>Common Mistakes to Avoid</h2><p>Many wills are challenged in court due to unclear language, improper witnessing, or allegations that the testator was pressured. Other common mistakes include failing to update the will after major life events such as marriage, divorce, or the birth of a child, and failing to account for all assets.</p><h2>The Value of Legal Assistance</h2><p>A lawyer ensures that your will meets all statutory requirements, accurately reflects your intentions, and is drafted in a manner that minimises the risk of future disputes. Legal assistance is particularly important when the estate is complex, involves multiple properties, or includes business interests.</p>",
    createdAt: now, updatedAt: now, publishedAt: now
  };

  saveBlogs([b1, b2, b3, b4, b5, b6]);
}

/* =========================================================
   RENDER FEATURED BLOGS (HOMEPAGE)
   ========================================================= */

function renderFeaturedBlogs() {
  var container = document.querySelector('[data-blog-list="featured"]');
  if (!container) return;

  seedBlogs();

  var blogs = getBlogs()
    .filter(function(b) { return b.status === "published" && b.featured === true; })
    .sort(function(a, b) { return (a.order || 999) - (b.order || 999); })
    .slice(0, 3);

  if (!blogs.length) {
    container.innerHTML = '<div class="empty">No featured articles available yet.</div>';
    return;
  }

  container.innerHTML = blogs.map(function(blog) {
    var date = formatDate(blog.publishedAt || blog.updatedAt);
var cover = blog.coverImage
  ? '<div class="blog-cover" style="background-image:url(\'' + escapeHTML(blog.coverImage) + '\')"></div>'
  : '<div class="blog-cover"></div>';
    return '<article class="blog-card reveal">' +
      cover +
      '<div class="blog-body">' +
        '<div class="blog-meta">' + escapeHTML(blog.category || "Legal Insight") + " &middot; " + escapeHTML(date) + "</div>" +
        "<h3>" + escapeHTML(blog.title || "Legal Insight") + "</h3>" +
        "<p>" + escapeHTML(blog.excerpt || "") + "</p>" +
        '<a class="btn btn-light" href="blogs.html?read=' + encodeURIComponent(blog.slug || blog.id) + '">Read Article</a>' +
      "</div>" +
    "</article>";
  }).join("");

  // Observe newly injected cards
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  }, { threshold: 0.08 });

  container.querySelectorAll(".reveal").forEach(function(e) {
    observer.observe(e);
  });
}

/* =========================================================
   TESTIMONIAL CAROUSEL
   Auto-advances every 2 seconds. Pauses on hover.
   ========================================================= */

var testimonialCurrentIndex = 0;
var testimonialAutoTimer = null;

function testimonialCardsPerView() {
  return window.innerWidth <= 600 ? 1 : (window.innerWidth <= 900 ? 2 : 3);
}

function getTestimonialCards() {
  var track = document.querySelector("#testimonialTrack");
  if (!track) return [];
  return Array.prototype.slice.call(track.querySelectorAll(".testimonial-card"));
}

function updateTestimonialPosition() {
  var track = document.querySelector("#testimonialTrack");
  if (!track) return;

  var cards = getTestimonialCards();
  if (!cards.length) return;

  var cardsPerView = testimonialCardsPerView();
  var totalSlides = Math.max(1, Math.ceil(cards.length / cardsPerView));

  if (testimonialCurrentIndex >= totalSlides) testimonialCurrentIndex = 0;
  if (testimonialCurrentIndex < 0) testimonialCurrentIndex = totalSlides - 1;

  var cardWidth = cards[0].offsetWidth;
  var gap = 20;
  var offset = testimonialCurrentIndex * (cardWidth + gap) * cardsPerView;

  track.style.transform = "translateX(-" + offset + "px)";

  var counter = document.querySelector("#testimonialCounter");
  if (counter) {
    counter.textContent = String(testimonialCurrentIndex + 1).padStart(2, "0") + " / " + String(totalSlides).padStart(2, "0");
  }

  var dotsContainer = document.querySelector("#testimonialDots");
  if (dotsContainer) {
    dotsContainer.querySelectorAll(".testimonial-dot").forEach(function(dot, i) {
      if (i === testimonialCurrentIndex) {
        dot.classList.add("active");
        dot.style.width = "24px";
        dot.style.background = "var(--burgundy)";
      } else {
        dot.classList.remove("active");
        dot.style.width = "7px";
        dot.style.background = "rgba(53, 14, 13, .20)";
      }
    });
  }
}

function buildTestimonialDots() {
  var dotsContainer = document.querySelector("#testimonialDots");
  if (!dotsContainer) return;

  var cards = getTestimonialCards();
  if (!cards.length) return;

  var cardsPerView = testimonialCardsPerView();
  var totalSlides = Math.max(1, Math.ceil(cards.length / cardsPerView));

  var dotsHTML = "";
  for (var d = 0; d < totalSlides; d++) {
    dotsHTML += '<button class="testimonial-dot" data-td="' + d + '" aria-label="Slide ' + (d + 1) + '"></button>';
  }
  dotsContainer.innerHTML = dotsHTML;

  dotsContainer.querySelectorAll("[data-td]").forEach(function(dot) {
    dot.addEventListener("click", function() {
      testimonialCurrentIndex = parseInt(dot.getAttribute("data-td"));
      updateTestimonialPosition();
      restartTestimonialAuto();
    });
  });
}

function testimonialNext() {
  var cards = getTestimonialCards();
  if (!cards.length) return;
  var totalSlides = Math.max(1, Math.ceil(cards.length / testimonialCardsPerView()));
  testimonialCurrentIndex = (testimonialCurrentIndex + 1) % totalSlides;
  updateTestimonialPosition();
}

function testimonialPrev() {
  var cards = getTestimonialCards();
  if (!cards.length) return;
  var totalSlides = Math.max(1, Math.ceil(cards.length / testimonialCardsPerView()));
  testimonialCurrentIndex = (testimonialCurrentIndex - 1 + totalSlides) % totalSlides;
  updateTestimonialPosition();
}

function startTestimonialAuto() {
  stopTestimonialAuto();
  testimonialAutoTimer = setInterval(testimonialNext, 2000);
}

function stopTestimonialAuto() {
  if (testimonialAutoTimer) {
    clearInterval(testimonialAutoTimer);
    testimonialAutoTimer = null;
  }
}

function restartTestimonialAuto() {
  stopTestimonialAuto();
  startTestimonialAuto();
}

function initTestimonialCarousel() {
  var track = document.querySelector("#testimonialTrack");
  if (!track) return;

  buildTestimonialDots();
  testimonialCurrentIndex = 0;
  updateTestimonialPosition();

  var nextBtn = document.querySelector(".testimonial-next");
  var prevBtn = document.querySelector(".testimonial-prev");

  if (nextBtn) {
    nextBtn.addEventListener("click", function() {
      testimonialNext();
      restartTestimonialAuto();
    });
  }
  if (prevBtn) {
    prevBtn.addEventListener("click", function() {
      testimonialPrev();
      restartTestimonialAuto();
    });
  }

  startTestimonialAuto();

  /* Pause on hover */
  var carousel = document.querySelector(".testimonial-carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", stopTestimonialAuto);
    carousel.addEventListener("mouseleave", startTestimonialAuto);
  }

  var resizeTimer;
  window.addEventListener("resize", function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      buildTestimonialDots();
      updateTestimonialPosition();
    }, 250);
  });
}

/* =========================================================
   INITIALISE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function() {
  initShell();
  seedBlogs();
  renderFeaturedBlogs();
  initTestimonialCarousel();
});
