const root = document.documentElement;

const colorPicker = document.getElementById("colorPicker");
const radius = document.getElementById("radius");
const spacing = document.getElementById("spacing");
const resetBtn = document.getElementById("reset");
let textContrast = '0, 0%, 100%';

// HEX → HSL
function hexToHSL(H) {
    let r = 0, g = 0, b = 0;

    if (H.length == 7) {
        r = "0x" + H[1] + H[2];
        g = "0x" + H[3] + H[4];
        b = "0x" + H[5] + H[6];
    }

    r /= 255;
    g /= 255;
    b /= 255;

    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0, s = 0, l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    textContrast = l > 60 ? '0, 0%, 0%' : '0, 0%, 100%';

    return { h, s, l, textContrast };
}

// APPLY THEME
function applyTheme({ h, s, l, radiusVal, spacingVal, textContrastVal }) {
    root.style.setProperty('--theme-color-primary-h', h);
    root.style.setProperty('--theme-color-primary-s', s + '%');
    root.style.setProperty('--theme-color-primary-l', l + '%');

    root.style.setProperty('--radius', radiusVal + 'px');
    root.style.setProperty('--spacing', spacingVal + 'px');
    root.style.setProperty('--contrast-text', textContrastVal);
}

// SAVE
function saveTheme(data) {
    localStorage.setItem("theme", JSON.stringify(data));
}

// LOAD
function loadTheme() {
    const saved = localStorage.getItem("theme");
    if (!saved) return;

    const data = JSON.parse(saved);
    applyTheme(data);

    radius.value = data.radiusVal;
    spacing.value = data.spacingVal;
    textContrast.value = data.textContrastVal;
}

// EVENTS
colorPicker.addEventListener("input", (e) => {
    const hsl = hexToHSL(e.target.value);

    const data = {
        ...hsl,
        radiusVal: radius.value,
        spacingVal: spacing.value,
        textContrastVal: textContrast,
    };

    applyTheme(data);
    saveTheme(data);
});

radius.addEventListener("input", () => {
    const data = getCurrent();
    applyTheme(data);
    saveTheme(data);
});

spacing.addEventListener("input", () => {
    const data = getCurrent();
    applyTheme(data);
    saveTheme(data);
});

resetBtn.addEventListener("click", () => {
    localStorage.removeItem("theme");
    radius.value = 0;
    spacing.value = 0;
    location.reload();
});

// helper
function getCurrent() {
    return {
        h: getComputedStyle(root).getPropertyValue('--theme-color-primary-h'),
        s: parseFloat(getComputedStyle(root).getPropertyValue('--theme-color-primary-s')),
        l: parseFloat(getComputedStyle(root).getPropertyValue('--theme-color-primary-l')),
        radiusVal: radius.value,
        spacingVal: spacing.value,
        textContrastVal: textContrast,
    };
}

// INIT
loadTheme();