/* QLU Mail 激活码管理 - 后台侧边栏菜单注入（内嵌 iframe 模式） */
(function () {
    if (window.__qluKeysInjected) return;
    window.__qluKeysInjected = true;

    var frame = null;
    var syncTimer = null;

    function getMenu() { return document.querySelector('.n-menu'); }
    function ourItem() { return document.getElementById('qlu-keys-menu-item'); }

    /* ---------- 内嵌 iframe ---------- */
    function buildFrame() {
        if (frame) return frame;
        frame = document.createElement('iframe');
        frame.id = 'qlu-keys-frame';
        frame.src = '/custom/keys.html?embed=1';
        frame.style.cssText = [
            'display:none', 'position:fixed', 'z-index:900',
            'border:none', 'background:#f7f8fa', 'width:0', 'height:0',
        ].join(';');
        document.body.appendChild(frame);
        return frame;
    }

    function layoutFrame() {
        if (!frame || frame.style.display === 'none') return;
        var left = 0, top = 0;
        var sider = document.querySelector('.n-layout-sider');
        var header = document.querySelector('.n-layout-header');
        if (sider) {
            var r = sider.getBoundingClientRect();
            if (r.width > 0) left = r.right;
        }
        if (header) {
            var h = header.getBoundingClientRect();
            if (h.height > 0 && h.height < 120) top = Math.max(top, h.bottom);
        }
        frame.style.left = left + 'px';
        frame.style.top = top + 'px';
        frame.style.width = Math.max(0, window.innerWidth - left) + 'px';
        frame.style.height = Math.max(0, window.innerHeight - top) + 'px';
    }

    function showFrame() {
        buildFrame();
        frame.style.display = 'block';
        layoutFrame();
        syncTimer = setInterval(layoutFrame, 400);   /* 覆盖侧栏折叠/窗口缩放 */
        window.addEventListener('resize', layoutFrame);
        markSelected(true);
    }

    function hideFrame() {
        if (frame) frame.style.display = 'none';
        if (syncTimer) { clearInterval(syncTimer); syncTimer = null; }
        markSelected(false);
    }

    function toggle() {
        if (frame && frame.style.display !== 'none') { hideFrame(); return; }
        showFrame();
    }

    /* ---------- 菜单项选中态 ---------- */
    function paintItem(item, selected) {
        var header = item && item.querySelector('.n-menu-item-content-header');
        if (!header) return;
        header.style.color = selected ? '#2080f0' : '';
        header.style.fontWeight = selected ? '600' : '';
        var content = item.querySelector('.n-menu-item-content');
        if (content) content.style.background = selected ? 'rgba(32,128,240,.08)' : '';
        item.classList.toggle('n-menu-item--selected', !!selected);
    }

    function markSelected(on) {
        var it = ourItem();
        if (it) paintItem(it, on);
        if (!on) return;
        /* 取消其他菜单项的选中高亮 */
        document.querySelectorAll('.n-menu .n-menu-item--selected').forEach(function (el) {
            if (el.id !== 'qlu-keys-menu-item') el.classList.remove('n-menu-item--selected');
        });
    }

    /* 其他菜单被点击时收回内嵌页 */
    document.addEventListener('click', function (e) {
        var item = e.target.closest && e.target.closest('.n-menu-item');
        if (item && item.id !== 'qlu-keys-menu-item') hideFrame();
    }, true);

    /* ---------- 菜单项注入 ---------- */
    function tryInject() {
        var menu = getMenu();
        if (!menu) return false;
        var item = ourItem();
        if (!item) {
            var base = menu.querySelector('.n-menu-item');
            if (!base) return false;
            item = base.cloneNode(true);
            item.id = 'qlu-keys-menu-item';
            item.classList.remove('n-menu-item--selected');
            item.removeAttribute('style');
            var header = item.querySelector('.n-menu-item-content-header');
            if (header) header.textContent = '激活码管理';
            item.querySelectorAll('svg,i,[class*="icon"]').forEach(function (e) { e.remove(); });
            item.title = 'QLU Mail 激活码管理';
            item.style.cursor = 'pointer';
            item.addEventListener('click', function (e) {
                e.stopPropagation();
                toggle();
            });
            menu.appendChild(item);
        }
        if (frame && frame.style.display !== 'none') paintItem(item, true);
        return true;
    }

    var obs = new MutationObserver(function () { tryInject(); });
    function start() {
        tryInject();
        obs.observe(document.body, { childList: true, subtree: true });
        setTimeout(function () { obs.disconnect(); }, 30000);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', start);
    } else {
        start();
    }
})();
