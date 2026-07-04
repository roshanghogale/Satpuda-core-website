(function () {
    var page = document.body.dataset.page;
    var prefetchedPages = {};

    if (page) {
        document.querySelectorAll('[data-page="' + page + '"]').forEach(function (el) {
            el.classList.add('active');
        });
    }

    var RELEASE_API = 'https://api.github.com/repos/roshanghogale/exes-for-satpuda-core/releases/latest';
    var RELEASE_BASE = 'https://github.com/roshanghogale/exes-for-satpuda-core/releases/download/';
    var FALLBACK_VERSION = 'v1.0.0';

    function formatSize(bytes) {
        if (!bytes) return '~127 MB';
        return '~' + Math.round(bytes / (1024 * 1024)) + ' MB';
    }

    function setText(id, text) {
        var el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function isPrefetchableLink(link) {
        if (!link || !link.href) return false;
        if (link.target && link.target !== '_self') return false;
        if (link.hasAttribute('download')) return false;
        if (link.href.indexOf('mailto:') === 0 || link.href.indexOf('tel:') === 0) return false;

        var url = new URL(link.href, window.location.href);
        if (url.origin !== window.location.origin) return false;
        if (url.pathname === window.location.pathname && !url.search && !url.hash) return false;

        return /\.html$/i.test(url.pathname) || url.pathname === '/' || url.pathname.endsWith('/index.html');
    }

    function prefetchPage(url) {
        if (!url || prefetchedPages[url]) return;
        prefetchedPages[url] = true;

        var hint = document.createElement('link');
        hint.rel = 'prefetch';
        hint.href = url;
        hint.as = 'document';
        document.head.appendChild(hint);

        fetch(url, { credentials: 'same-origin' }).catch(function () {
            delete prefetchedPages[url];
        });
    }

    function initPagePrefetch() {
        var links = document.querySelectorAll('a[href]');
        var urls = [];

        links.forEach(function (link) {
            if (!isPrefetchableLink(link)) return;

            var url = new URL(link.href, window.location.href).href;
            urls.push(url);

            link.addEventListener('mouseenter', function () {
                prefetchPage(url);
            }, { passive: true });

            link.addEventListener('focus', function () {
                prefetchPage(url);
            }, { passive: true });

            link.addEventListener('touchstart', function () {
                prefetchPage(url);
            }, { passive: true, once: true });
        });

        var uniqueUrls = Array.from(new Set(urls));
        var warmPages = function () {
            uniqueUrls.slice(0, 4).forEach(prefetchPage);
        };

        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(warmPages, { timeout: 1200 });
        } else {
            window.setTimeout(warmPages, 600);
        }
    }

    function initDownloads() {
        var versionEl = document.getElementById('release-version');
        if (!versionEl) return;

        var installer = document.getElementById('download-installer');

        fetch(RELEASE_API)
            .then(function (res) {
                if (!res.ok) throw new Error('fetch failed');
                return res.json();
            })
            .then(function (data) {
                var version = data.tag_name || FALLBACK_VERSION;
                setText('release-version', version);

                if (data.assets) {
                    data.assets.forEach(function (asset) {
                        var url = RELEASE_BASE + version + '/' + asset.name;
                        if (asset.name === 'SatpudaCoreInstaller.exe') {
                            if (installer) installer.href = url;
                            setText('installer-size', formatSize(asset.size));
                        }
                    });
                }
            })
            .catch(function () {
                setText('release-version', FALLBACK_VERSION);
                setText('installer-size', '~90 MB');
            });
    }

    initPagePrefetch();
    initDownloads();
})();
