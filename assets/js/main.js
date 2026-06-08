(function () {
    var page = document.body.dataset.page;
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

    function initDownloads() {
        var versionEl = document.getElementById('release-version');
        if (!versionEl) return;

        var win10 = document.getElementById('download-win10');
        var win7 = document.getElementById('download-win7');

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
                        if (asset.name === 'SatpudaCore.exe') {
                            if (win10) win10.href = url;
                            setText('win10-size', formatSize(asset.size));
                        }
                        if (asset.name === 'SatpudaCore_Win7.exe') {
                            if (win7) win7.href = url;
                            setText('win7-size', formatSize(asset.size));
                        }
                    });
                }
            })
            .catch(function () {
                setText('release-version', FALLBACK_VERSION);
                setText('win10-size', '~127 MB');
                setText('win7-size', '~127 MB');
            });
    }

    initDownloads();
})();
