/* NESTLEGAL - BLOGS.JS */

function blogCardHTML(b) {
  var date = formatDate(b.publishedAt || b.updatedAt);
  var coverStyle = b.coverImage ? "background-image:url('" + escapeHTML(b.coverImage) + "')" : "";
  return '<article class="blog-card reveal">' +
    '<div class="blog-cover" style="' + coverStyle + '"></div>' +
    '<div class="blog-body">' +
      '<div class="blog-meta">' + escapeHTML(b.category || "Legal Insight") + " &middot; " + escapeHTML(date) + "</div>" +
      "<h3>" + escapeHTML(b.title) + "</h3>" +
      "<p>" + escapeHTML(b.excerpt || "") + "</p>" +
      '<a class="btn btn-light" href="blogs.html?read=' + encodeURIComponent(b.slug || b.id) + '">Read Article</a>' +
    "</div>" +
  "</article>";
}

function renderPublicBlogs() {
  var searchEl = document.querySelector("#blogSearch");
  var catEl = document.querySelector("#blogCategory");
  
  var q = (searchEl ? searchEl.value : "").trim().toLowerCase();
  var cat = (catEl ? catEl.value : "").trim();

  var allBlogs = typeof getBlogs === "function" ? getBlogs() : [];

  var blogs = allBlogs
    .filter(function(b) { return b.status === "published"; })
    .filter(function(b) {
      var matchesCategory = !cat || b.category === cat;
      var searchText = [b.title, b.excerpt, b.category, (b.tags || []).join(" ")].join(" ").toLowerCase();
      var matchesQuery = !q || searchText.indexOf(q) >= 0;
      return matchesCategory && matchesQuery;
    })
    .sort(function(a, b) { return (a.order || 999) - (b.order || 999); });

  var out = document.querySelector("#publicBlogList");
  if (!out) return;

  if (!blogs.length) {
    out.innerHTML = '<div class="empty">No articles match your search.</div>';
    return;
  }

  out.innerHTML = blogs.map(blogCardHTML).join("");

  // Reveal observer for dynamic elements
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  }, { threshold: 0.08 });

  out.querySelectorAll(".reveal").forEach(function(e) {
    observer.observe(e);
  });
}

function showArticle() {
  var key = new URLSearchParams(location.search).get("read");
  if (!key) return;

  var blog = getBlogs().find(function(x) {
    return x.status === "published" && (x.id === key || x.slug === key);
  });

  var listing = document.querySelector("#blogListing");
  var reader = document.querySelector("#articleReader");
  if (!blog || !reader) return;

  if (listing) listing.style.display = "none";
  reader.hidden = false;

  var date = formatDate(blog.publishedAt || blog.updatedAt);
  var coverHTML = blog.coverImage ? '<img class="article-cover" src="' + escapeHTML(blog.coverImage) + '" alt="">' : "";

  reader.innerHTML =
    '<div class="article">' +
      '<a class="kicker" href="blogs.html">&larr; Back to insights</a>' +
      '<div class="article-meta" style="margin-top:28px">' +
        escapeHTML(blog.category || "Legal Insight") + " &middot; " + escapeHTML(date) + " &middot; " + escapeHTML(blog.author || "NestLegal") +
      "</div>" +
      "<h1>" + escapeHTML(blog.title) + "</h1>" +
      coverHTML +
      '<div class="article-content">' + (blog.content || "") + "</div>" +
    "</div>";
}

document.addEventListener("DOMContentLoaded", function() {
  if (typeof seedBlogs === "function") {
    seedBlogs();
  }

  var blogList = document.querySelector("#publicBlogList");
  if (!blogList) return;

  var cats = [];
  var seen = {};
  
  var availableCategories = (typeof DEFAULT_CATEGORIES !== "undefined" ? DEFAULT_CATEGORIES : [])
    .concat(getBlogs().map(function(b) { return b.category; }).filter(Boolean));

  availableCategories.forEach(function(c) {
    if (!seen[c]) { 
      seen[c] = true; 
      cats.push(c); 
    }
  });

  var categorySelect = document.querySelector("#blogCategory");
  if (categorySelect) {
    categorySelect.innerHTML = '<option value="" selected>All categories</option>' +
      cats.map(function(c) {
        return '<option value="' + escapeHTML(c) + '">' + escapeHTML(c) + "</option>";
      }).join("");
    
    categorySelect.value = "";
  }

  var searchInput = document.querySelector("#blogSearch");
  if (searchInput) {
    searchInput.addEventListener("input", renderPublicBlogs);
  }
  if (categorySelect) {
    categorySelect.addEventListener("change", renderPublicBlogs);
  }

  if (new URLSearchParams(location.search).get("read")) {
    showArticle();
  } else {
    renderPublicBlogs();
  }
});