const ADMIN_KEY = "nestlegal_admin_session";

let selectedId = null;


/* =========================================================
   BLOG STORAGE
   ========================================================= */

/* Safe UUID fallback */
function safeUUID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    try { return safeUUID(); } catch(e) {}
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0;
    var v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


function blogs() {
  return JSON.parse(
    localStorage.getItem("nestlegal_blogs") || "[]"
  );
}


function setBlogs(x) {
  localStorage.setItem(
    "nestlegal_blogs",
    JSON.stringify(x)
  );
}


/* =========================================================
   ADMIN SESSION
   ========================================================= */

function isAdmin() {
  return (
    sessionStorage.getItem(ADMIN_KEY) === "true"
  );
}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c])
  );
}


/* =========================================================
   RENDER ADMIN BLOG LIST
   ========================================================= */

function renderAdminList() {

  const list =
    document.querySelector("#adminBlogList");

  if (!list) return;


  const data = blogs().sort(
    (a, b) =>
      (a.order || 999) -
      (b.order || 999)
  );


  list.innerHTML = data.length

    ? data
        .map(
          (b, i) => `
            <button
              data-id="${b.id}"
              class="${b.id === selectedId ? "active" : ""}"
            >

              <strong>
                ${i + 1}.
                ${esc(b.title || "Untitled")}
              </strong>

              <br>

              <span
                class="status-pill ${b.status}"
              >
                ${b.status}
              </span>

            </button>
          `
        )
        .join("")

    : `
        <p style="color:#716865">
          No blogs yet.
        </p>
      `;


  list
    .querySelectorAll("button")
    .forEach(btn => {

      btn.onclick = () => {

        selectedId =
          btn.dataset.id;

        loadEditor(selectedId);

        renderAdminList();

      };

    });

}


/* =========================================================
   LOAD BLOG INTO EDITOR
   ========================================================= */

function loadEditor(id) {

  const b =
    blogs().find(
      x => x.id === id
    );


  if (!b) {

    clearEditor();

    return;

  }


  for (
    const [k, v]
    of Object.entries({
      title: b.title,
      excerpt: b.excerpt,
      category: b.category,
      author: b.author,
      tags: (b.tags || []).join(", "),
      coverImage: b.coverImage,
      content: b.content
    })
  ) {

    const el =
      document.querySelector(
        `[name="${k}"]`
      );

    if (el) {
      el.value = v || "";
    }

  }


  document.querySelector(
    "#featured"
  ).checked = !!b.featured;


  document.querySelector(
    "#status"
  ).value = b.status || "draft";


  document.querySelector(
    "#editor"
  ).innerHTML = b.content || "";

}


/* =========================================================
   CLEAR EDITOR
   ========================================================= */

function clearEditor() {

  selectedId = null;

  const form =
    document.querySelector("#blogForm");

  const editor =
    document.querySelector("#editor");

  const featured =
    document.querySelector("#featured");

  const status =
    document.querySelector("#status");

  if (form) {
    form.reset();
  }

  if (featured) {
    featured.checked = false;
  }

  if (status) {
    status.value = "draft";
  }

  if (editor) {
    editor.innerHTML = "";
  }

  /* Reset author after form reset */
  const author =
    document.querySelector('[name="author"]');

  if (author) {
    author.value = "NestLegal";
  }

}

function newBlog() {

  /* Clear any currently selected article */
  clearEditor();


  /* Remove active article selection */
  renderAdminList();


  /* Scroll to the editor */
  const form =
    document.querySelector("#blogForm");

  if (form) {

    form.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }


  /* Focus the title field */
  const title =
    document.querySelector(
      '[name="title"]'
    );

  if (title) {

    setTimeout(() => {
      title.focus();
    }, 500);

  }


  /* Show confirmation */
  flash(
    "Ready to create a new blog."
  );

}

/* =========================================================
   COLLECT FORM DATA
   ========================================================= */

function collect() {

  const f =
    new FormData(
      document.querySelector(
        "#blogForm"
      )
    );


  return {

    title:
      f.get("title").trim(),

    excerpt:
      f.get("excerpt").trim(),

    category:
      f.get("category"),

    author:
      f.get("author").trim() ||
      "NestLegal",

    tags:
      f
        .get("tags")
        .split(",")
        .map(x => x.trim())
        .filter(Boolean),

    coverImage:
      f.get("coverImage").trim(),

    content:
      document.querySelector(
        "#editor"
      ).innerHTML,

    status:
      document.querySelector(
        "#status"
      ).value,

    featured:
      document.querySelector(
        "#featured"
      ).checked

  };

}


/* =========================================================
   SAVE BLOG
   ========================================================= */

function save(statusOverride = null) {

  const data = collect();


  if (!data.title) {

    alert(
      "A blog title is required."
    );

    return;

  }


  const all = blogs();

  const now =
    new Date().toISOString();


  let existing =
    all.find(
      x => x.id === selectedId
    );


  /* ===============================================
     UPDATE EXISTING BLOG
     =============================================== */

  if (existing) {

    Object.assign(
      existing,
      data,
      {
        updatedAt: now
      }
    );


    if (
      data.status === "published" &&
      !existing.publishedAt
    ) {

      existing.publishedAt =
        now;

    }

  }


  /* ===============================================
     CREATE NEW BLOG
     =============================================== */

  else {

    existing = {

      ...data,

      id:
        safeUUID(),

      slug:
        slugify(data.title),

      order:
        all.length + 1,

      createdAt:
        now,

      updatedAt:
        now,

      publishedAt:
        data.status === "published"
          ? now
          : null

    };


    all.push(existing);

    selectedId =
      existing.id;

  }


  /* ===============================================
     STATUS OVERRIDE
     =============================================== */

  if (statusOverride) {

    existing.status =
      statusOverride;

  }


  setBlogs(all);

  renderAdminList();

  loadEditor(
    existing.id
  );

  flash(
    "Saved successfully."
  );

}


/* =========================================================
   SLUG GENERATOR
   ========================================================= */

function slugify(s) {

  return s
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /(^-|-$)/g,
      ""
    );

}


/* =========================================================
   STATUS MESSAGE
   ========================================================= */

function flash(t) {

  const e =
    document.querySelector(
      "#adminStatus"
    );


  e.textContent = t;


  e.className =
    "form-status success";


  setTimeout(
    () => {
      e.textContent = "";
    },
    2500
  );

}


/* =========================================================
   ADMIN APPLICATION INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const loginView = document.querySelector("#loginView");
  const adminApp = document.querySelector("#adminApp");
  const loginForm = document.querySelector("#loginForm");

  if (!loginView || !adminApp) {
    return;
  }


  /* =======================================================
     CHECK CURRENT LOGIN STATE
     ======================================================= */

  const loggedIn =
    sessionStorage.getItem(ADMIN_KEY) === "true";


 if (loggedIn) {

  /* Hide login completely */
  loginView.hidden = true;
  loginView.style.display = "none";

  /* Show dashboard */
  adminApp.hidden = false;
  adminApp.style.display = "block";

  renderAdminList();

} else {

  /* Show login */
  loginView.hidden = false;
  loginView.style.display = "flex";

  /* Hide dashboard */
  adminApp.hidden = true;
  adminApp.style.display = "none";

}


  /* =======================================================
     LOGIN
     ======================================================= */

  if (loginForm) {

    loginForm.addEventListener("submit", (event) => {

      event.preventDefault();


      /*
       * DEVELOPMENT LOGIN
       *
       * This currently accepts any email/password.
       * Replace with Firebase Authentication later.
       */

      sessionStorage.setItem(
  ADMIN_KEY,
  "true"
);


/* Hide login screen */
loginView.hidden = true;
loginView.style.display = "none";


/* Show admin dashboard */
adminApp.hidden = false;
adminApp.style.display = "block";


/* Load articles */
renderAdminList();


/* Clear login fields */
loginForm.reset();

      /* Clear login form */

      loginForm.reset();

    });

  }


  /* =======================================================
     NEW BLOG
     ======================================================= */

  const newBlogButton =
    document.querySelector("#newBlog");

  if (newBlogButton) {

    newBlogButton.addEventListener(
      "click",
       newBlog
     );

  }


  /* =======================================================
     SAVE DRAFT
     ======================================================= */

  const saveDraftButton =
    document.querySelector("#saveDraft");

  if (saveDraftButton) {

    saveDraftButton.addEventListener(
      "click",
      () => save("draft")
    );

  }


  /* =======================================================
     PUBLISH
     ======================================================= */

  const publishButton =
    document.querySelector("#publish");

  if (publishButton) {

    publishButton.addEventListener(
      "click",
      () => save("published")
    );

  }


  /* =======================================================
     DELETE BLOG
     ======================================================= */

  const deleteButton =
    document.querySelector("#deleteBlog");

  if (deleteButton) {

    deleteButton.addEventListener(
      "click",
      () => {

        if (!selectedId) {
          return;
        }


        if (
          confirm(
            "Permanently delete this blog?"
          )
        ) {

          setBlogs(
            blogs().filter(
              blog =>
                blog.id !== selectedId
            )
          );


          clearEditor();
          renderAdminList();

          flash(
            "Blog deleted successfully."
          );

        }

      }
    );

  }


  /* =======================================================
     LOGOUT
     ======================================================= */

  const logoutButton =
    document.querySelector("#logout");

  if (logoutButton) {

    logoutButton.addEventListener(
  "click",
  () => {

    sessionStorage.removeItem(
      ADMIN_KEY
    );


    /* Hide dashboard */
    adminApp.hidden = true;
    adminApp.style.display = "none";


    /* Show login */
    loginView.hidden = false;
    loginView.style.display = "flex";


    /* Clear editor */
    clearEditor();


    /* Clear login fields */
    if (loginForm) {
      loginForm.reset();
    }

  }
);

  }


  /* =======================================================
     PREVENT FORM SUBMISSION
     ======================================================= */

  const blogForm =
    document.querySelector("#blogForm");

  if (blogForm) {

    blogForm.addEventListener(
      "submit",
      event => {
        event.preventDefault();
      }
    );

  }


  /* =======================================================
     RICH TEXT EDITOR
     ======================================================= */

  document
    .querySelectorAll("[data-command]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          document.execCommand(
            button.dataset.command,
            false,
            null
          );

        }
      );

    });


  /* =======================================================
     BLOG PREVIEW
     ======================================================= */

  const previewButton =
    document.querySelector("#preview");

  if (previewButton) {

    previewButton.addEventListener(
      "click",
      () => {

        const data = collect();

        const previewWindow =
          window.open(
            "",
            "_blank"
          );


        if (!previewWindow) {
          alert(
            "Please allow pop-ups to preview the article."
          );
          return;
        }


        previewWindow.document.write(`

          <!doctype html>

          <html>

          <head>

            <title>
              ${esc(data.title)}
            </title>

            <style>

              body {
                max-width: 800px;
                margin: 60px auto;
                padding: 20px;
                font-family: Georgia, serif;
                font-size: 18px;
                line-height: 1.8;
                color: #1e1715;
              }

              h1,
              h2,
              h3 {
                color: #350e0d;
              }

              img {
                max-width: 100%;
                height: auto;
              }

            </style>

          </head>

          <body>

            <h1>
              ${esc(data.title)}
            </h1>

            ${data.content}

          </body>

          </html>

        `);


        previewWindow.document.close();

      }
    );

  }

});



/* =========================================================
   LOGIN EVENT
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  loginInit
);