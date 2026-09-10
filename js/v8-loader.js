/* ==========================================================
   V8 LOADER
   Busca a configuração do projeto no V8 Admin Universal e
   aplica os dados (contato, redes, SEO, scripts) nos
   elementos marcados com data-v8-field / data-v8-form.
   Não altera estrutura, textos de conteúdo ou serviços —
   apenas os campos que o V8 Admin gerencia.
   ========================================================== */
(function () {
  "use strict";

  var API_BASE = "https://v8adminuniversal.aisermelk.workers.dev";
  var projectId = document.body.getAttribute("data-v8-project");

  if (!projectId || projectId === "COLOCAR_PROJECT_ID_AQUI") {
    console.warn("[V8 Loader] data-v8-project não definido — carregamento cancelado.");
    return;
  }

  fetch(API_BASE + "/api/public/config/" + encodeURIComponent(projectId))
    .then(function (res) {
      if (!res.ok) throw new Error("Falha ao buscar configuração (" + res.status + ")");
      return res.json();
    })
    .then(function (data) {
      var project = data && data.ok && data.project ? data.project : null;
      if (!project) {
        console.warn("[V8 Loader] Configuração indisponível para o projeto: " + projectId);
        return;
      }
      applyConfig(project);
    })
    .catch(function (err) {
      console.warn("[V8 Loader] Não foi possível carregar a configuração:", err);
    });

  function applyConfig(project) {
    var contact = project.contact || {};
    var social = project.social || {};
    var seo = project.seo || {};
    var content = project.content || {};
    var scripts = project.scripts || {};

    // Logo
    if (project.logoUrl) {
      document.querySelectorAll('[data-v8-field="logo"]').forEach(function (el) {
        el.src = project.logoUrl;
      });
    }

    // Nome da empresa
    if (project.name) {
      document.querySelectorAll('[data-v8-field="company-name"]').forEach(function (el) {
        el.textContent = project.name;
      });
    }

    // WhatsApp
    if (contact.whatsapp) {
      var digits = String(contact.whatsapp).replace(/\D/g, "");
      var waLink = "https://wa.me/" + digits;
      document.querySelectorAll('[data-v8-field="whatsapp-link"]').forEach(function (el) {
        el.href = waLink;
      });
      document.querySelectorAll('[data-v8-field="whatsapp-text"]').forEach(function (el) {
        el.textContent = contact.whatsapp;
      });
    }

    // E-mail
    if (contact.email) {
      document.querySelectorAll('[data-v8-field="email"]').forEach(function (el) {
        el.href = "mailto:" + contact.email;
        el.textContent = contact.email;
      });
    }

    // Instagram
    if (social.instagram) {
      document.querySelectorAll('[data-v8-field="instagram"]').forEach(function (el) {
        el.href = "https://www.instagram.com/" + social.instagram.replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "");
        if (!el.textContent || el.textContent.trim() === "") {
          el.textContent = "@" + social.instagram.replace(/^@/, "");
        }
      });
    }

    // Rodapé / textos administráveis
    if (content.footerText) {
      document.querySelectorAll('[data-v8-field="footer-text"]').forEach(function (el) {
        el.textContent = content.footerText;
      });
    }

    // SEO
    if (seo.title) document.title = seo.title;
    setMeta("description", seo.description);
    setMeta("og:title", seo.ogTitle || seo.title, true);
    setMeta("og:description", seo.ogDescription || seo.description, true);
    setMeta("og:image", seo.ogImage, true);

    // Scripts de rastreamento (Pixel / GA / Tag Manager)
    if (scripts.gaId) injectGA(scripts.gaId);
    if (scripts.pixelId) injectPixel(scripts.pixelId);
    if (scripts.gtmId) injectGTM(scripts.gtmId);
  }

  function setMeta(name, value, isProperty) {
    if (!value) return;
    var attr = isProperty ? "property" : "name";
    var el = document.querySelector('meta[' + attr + '="' + name + '"]');
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", value);
  }

  function injectGA(id) {
    var s1 = document.createElement("script");
    s1.async = true;
    s1.src = "https://www.googletagmanager.com/gtag/js?id=" + id;
    document.head.appendChild(s1);

    var s2 = document.createElement("script");
    s2.text =
      "window.dataLayer = window.dataLayer || [];" +
      "function gtag(){dataLayer.push(arguments);}" +
      "gtag('js', new Date());" +
      "gtag('config', '" + id + "');";
    document.head.appendChild(s2);
  }

  function injectPixel(id) {
    var s = document.createElement("script");
    s.text =
      "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?" +
      "n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;" +
      "n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;" +
      "t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script'," +
      "'https://connect.facebook.net/en_US/fbevents.js');" +
      "fbq('init', '" + id + "');fbq('track', 'PageView');";
    document.head.appendChild(s);
  }

  function injectGTM(id) {
    var s = document.createElement("script");
    s.text =
      "(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});" +
      "var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';" +
      "j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);" +
      "})(window,document,'script','dataLayer','" + id + "');";
    document.head.appendChild(s);
  }
})();
