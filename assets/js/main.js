(function () {
    var page = document.body.dataset.page;
    var prefetchedPages = {};
    var THEME_KEY = 'satpuda-theme';

    if (page) {
        document.querySelectorAll('.nav-link[data-page]').forEach(function (el) {
            el.classList.remove('active');
        });
        document.querySelectorAll('.nav-link[data-page="' + page + '"]').forEach(function (el) {
            el.classList.add('active');
        });
    }

    var RELEASE_API = 'https://api.github.com/repos/roshanghogale/exes-for-satpuda-core/releases/latest';
    var RELEASE_BASE = 'https://github.com/roshanghogale/exes-for-satpuda-core/releases/download/';
    var FALLBACK_VERSION = 'v1.0.0';

    function formatSize(bytes) {
        if (!bytes) return '~90 MB';
        return '~' + Math.round(bytes / (1024 * 1024)) + ' MB';
    }

    function setText(id, text) {
        var el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function getPreferredTheme() {
        try {
            var saved = localStorage.getItem(THEME_KEY);
            if (saved === 'light' || saved === 'dark') return saved;
        } catch (e) {}
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches
            ? 'light'
            : 'dark';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {}

        var toggles = document.querySelectorAll('[data-theme-toggle]');
        toggles.forEach(function (btn) {
            btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
            btn.setAttribute('title', theme === 'light' ? 'Dark theme' : 'Light theme');
        });
    }

    function initThemeToggle() {
        applyTheme(getPreferredTheme());

        document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var current = document.documentElement.getAttribute('data-theme') || 'dark';
                applyTheme(current === 'light' ? 'dark' : 'light');
            });
        });
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

    /* ---------------------------------------------------------------
       ENQUIRY FORM
       Delivery runs through FormSubmit.co, which needs no account:
       the first real submission emails ENQUIRY_EMAIL an activation
       link. Click it once and every later enquiry is delivered.
       To move to another provider (Web3Forms, Formspree, a Pages
       Function), change ENQUIRY_ENDPOINT only - nothing else here
       depends on the provider.
    --------------------------------------------------------------- */
    var ENQUIRY_EMAIL = 'satpudacoreprivatelimited@gmail.com';
    var ENQUIRY_ENDPOINT = 'https://formsubmit.co/ajax/' + ENQUIRY_EMAIL;

    function fieldOf(input) {
        return input.closest('.field');
    }

    function showFieldError(input, message) {
        var field = fieldOf(input);
        if (!field) return;
        field.classList.add('has-error');
        var msgEl = field.querySelector('.field-error');
        if (msgEl) msgEl.textContent = message;
        input.setAttribute('aria-invalid', 'true');
    }

    function clearFieldError(input) {
        var field = fieldOf(input);
        if (!field) return;
        field.classList.remove('has-error');
        input.removeAttribute('aria-invalid');
    }

    function digitsOnly(value) {
        return (value || '').replace(/\D/g, '');
    }

    // Accepts 9325485954, 093254 85954, +91 93254-85954 and similar.
    function normalisePhone(value) {
        var digits = digitsOnly(value);
        if (digits.length === 12 && digits.indexOf('91') === 0) digits = digits.slice(2);
        else if (digits.length === 11 && digits.charAt(0) === '0') digits = digits.slice(1);
        return digits;
    }

    function validateField(input) {
        var value = (input.value || '').trim();
        var name = input.name;

        if (name === 'name') {
            if (!value) return 'Please enter your full name.';
            if (value.length < 2) return 'Please enter your full name.';
            return '';
        }

        if (name === 'phone') {
            if (!value) return 'Please enter your phone number.';
            var phone = normalisePhone(value);
            if (phone.length !== 10) return 'Enter a 10-digit mobile number.';
            if (!/^[6-9]/.test(phone)) return 'Enter a valid 10-digit Indian mobile number.';
            return '';
        }

        if (name === 'email') {
            if (!value) return '';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'Enter a valid email address, or leave this blank.';
            return '';
        }

        if (name === 'city') {
            if (!value) return 'Please enter your city or district.';
            return '';
        }

        if (name === 'service') {
            if (!value) return 'Please choose the service you need.';
            return '';
        }

        if (name === 'requirements') {
            if (!value) return 'Please describe what you need.';
            if (value.length < 20) return 'Please add a little more detail (at least 20 characters).';
            return '';
        }

        return '';
    }

    function setStatus(statusEl, type, html) {
        if (!statusEl) return;
        statusEl.className = 'form-status is-visible is-' + type;
        statusEl.innerHTML = html;
        statusEl.setAttribute('role', type === 'error' ? 'alert' : 'status');
    }

    function initEnquiryForm() {
        var form = document.getElementById('enquiry-form');
        if (!form) return;

        var statusEl = document.getElementById('form-status');
        var submitBtn = form.querySelector('[type="submit"]');
        var submitLabel = submitBtn ? submitBtn.innerHTML : '';
        var inputs = Array.prototype.slice.call(
            form.querySelectorAll('input[name], select[name], textarea[name]')
        ).filter(function (el) {
            return el.name.charAt(0) !== '_';
        });
        var attempted = false;

        inputs.forEach(function (input) {
            var revalidate = function () {
                if (!attempted) return;
                var error = validateField(input);
                if (error) showFieldError(input, error);
                else clearFieldError(input);
            };
            input.addEventListener('input', revalidate);
            input.addEventListener('change', revalidate);
            input.addEventListener('blur', function () {
                var error = validateField(input);
                if (error) showFieldError(input, error);
                else clearFieldError(input);
            });
        });

        form.addEventListener('submit', function (event) {
            event.preventDefault();
            attempted = true;

            var firstInvalid = null;
            inputs.forEach(function (input) {
                var error = validateField(input);
                if (error) {
                    showFieldError(input, error);
                    if (!firstInvalid) firstInvalid = input;
                } else {
                    clearFieldError(input);
                }
            });

            // Validation failed: keep every value the visitor typed.
            if (firstInvalid) {
                setStatus(statusEl, 'error', '<strong>Please check the highlighted fields</strong>Your details are still here \u2013 fix the marked fields and send again.');
                firstInvalid.focus();
                if (firstInvalid.scrollIntoView) {
                    firstInvalid.scrollIntoView({ block: 'center', behavior: 'smooth' });
                }
                return;
            }

            var payload = {};
            inputs.forEach(function (input) {
                var value = (input.value || '').trim();
                // Skip blank optionals so the enquiry email has no empty rows.
                if (value) payload[input.name] = value;
            });

            var honey = form.querySelector('input[name="_honey"]');
            if (honey && honey.value) return; // bot

            payload._subject = 'Website enquiry: ' + (payload.service || 'General') + ' - ' + payload.name;
            payload._template = 'table';
            payload._captcha = 'false';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="bi bi-arrow-repeat"></i> Sending\u2026';
            }
            setStatus(statusEl, 'success', 'Sending your enquiry...');

            fetch(ENQUIRY_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(function (res) {
                    if (!res.ok) throw new Error('submit failed');
                    return res.json().catch(function () { return {}; });
                })
                .then(function () {
                    setStatus(
                        statusEl,
                        'success',
                        '<strong>Thank you \u2013 your enquiry has been sent.</strong>' +
                        'We have received your requirements and will get back to you on the number you gave us, usually within one working day. ' +
                        'For anything urgent, message us on <a href="https://wa.me/919325485954" target="_blank" rel="noopener">WhatsApp</a> or call +91-93254 85954.'
                    );
                    form.reset();
                    attempted = false;
                    inputs.forEach(clearFieldError);
                    if (statusEl && statusEl.scrollIntoView) {
                        statusEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
                    }
                })
                .catch(function () {
                    var body = [
                        'Name: ' + payload.name,
                        'Phone: ' + payload.phone,
                        'Email: ' + (payload.email || '-'),
                        'City / District: ' + payload.city,
                        'Service needed: ' + payload.service,
                        'Budget: ' + (payload.budget || 'Not specified'),
                        'Timeline: ' + (payload.timeline || 'Not specified'),
                        '',
                        'Requirements:',
                        payload.requirements
                    ].join('\n');

                    var mailto = 'mailto:' + ENQUIRY_EMAIL +
                        '?subject=' + encodeURIComponent(payload._subject) +
                        '&body=' + encodeURIComponent(body);

                    setStatus(
                        statusEl,
                        'error',
                        '<strong>We could not send that automatically.</strong>' +
                        'Nothing you typed has been lost. Please ' +
                        '<a href="' + mailto + '">send it by email instead</a> ' +
                        '(opens with your details filled in), or message us on ' +
                        '<a href="https://wa.me/919325485954" target="_blank" rel="noopener">WhatsApp</a>.'
                    );
                })
                .then(function () {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = submitLabel;
                    }
                });
        });
    }

    initThemeToggle();
    initPagePrefetch();
    initDownloads();
    initEnquiryForm();
})();
