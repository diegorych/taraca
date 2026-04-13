(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/providers/LenisProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LenisProvider",
    ()=>LenisProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lenis$2f$dist$2f$lenis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lenis/dist/lenis.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function LenisProvider({ children }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LenisProvider.useEffect": ()=>{
            const lenis = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lenis$2f$dist$2f$lenis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
                autoRaf: true,
                duration: 2.4,
                easing: {
                    "LenisProvider.useEffect": (t)=>1 - Math.pow(1 - t, 4)
                }["LenisProvider.useEffect"],
                wheelMultiplier: 2,
                touchMultiplier: 2
            });
            return ({
                "LenisProvider.useEffect": ()=>lenis.destroy()
            })["LenisProvider.useEffect"];
        }
    }["LenisProvider.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(LenisProvider, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = LenisProvider;
var _c;
__turbopack_context__.k.register(_c, "LenisProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/providers/IntroSequenceProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IntroSequenceProvider",
    ()=>IntroSequenceProvider,
    "useIntroSequence",
    ()=>useIntroSequence
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
const IntroSequenceContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function IntroSequenceProvider({ children }) {
    _s();
    const [showHeader, setShowHeader] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "IntroSequenceProvider.useMemo[value]": ()=>({
                showHeader,
                setShowHeader
            })
    }["IntroSequenceProvider.useMemo[value]"], [
        showHeader
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IntroSequenceContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/providers/IntroSequenceProvider.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
_s(IntroSequenceProvider, "Pisbe0i+UA+CmOsZ8p1xqjNIVZg=");
_c = IntroSequenceProvider;
function useIntroSequence() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(IntroSequenceContext);
    if (!context) {
        throw new Error("useIntroSequence must be used within IntroSequenceProvider");
    }
    return context;
}
_s1(useIntroSequence, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "IntroSequenceProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/providers/NavbarScrollProvider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NavbarScrollProvider",
    ()=>NavbarScrollProvider,
    "useNavbarScroll",
    ()=>useNavbarScroll
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const NavbarScrollContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
function sectionFillsViewportHeight(el) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    return rect.top <= 1 && rect.bottom >= vh - 1;
}
function NavbarScrollProvider({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const isHome = pathname === "/";
    const tracklistSectionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [tracklistLayoutToken, setTracklistLayoutToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [tracklistFillsViewport, setTracklistFillsViewport] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const markTracklistMounted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "NavbarScrollProvider.useCallback[markTracklistMounted]": ()=>{
            setTracklistLayoutToken({
                "NavbarScrollProvider.useCallback[markTracklistMounted]": (t)=>t + 1
            }["NavbarScrollProvider.useCallback[markTracklistMounted]"]);
        }
    }["NavbarScrollProvider.useCallback[markTracklistMounted]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "NavbarScrollProvider.useLayoutEffect": ()=>{
            if (!isHome) {
                return;
            }
            const el = tracklistSectionRef.current;
            if (!el) {
                return;
            }
            const update = {
                "NavbarScrollProvider.useLayoutEffect.update": ()=>{
                    setTracklistFillsViewport(sectionFillsViewportHeight(el));
                }
            }["NavbarScrollProvider.useLayoutEffect.update"];
            const raf = requestAnimationFrame({
                "NavbarScrollProvider.useLayoutEffect.raf": ()=>update()
            }["NavbarScrollProvider.useLayoutEffect.raf"]);
            window.addEventListener("scroll", update, {
                passive: true
            });
            document.addEventListener("scroll", update, {
                passive: true,
                capture: true
            });
            window.addEventListener("resize", update);
            const ro = new ResizeObserver({
                "NavbarScrollProvider.useLayoutEffect": ()=>update()
            }["NavbarScrollProvider.useLayoutEffect"]);
            ro.observe(el);
            return ({
                "NavbarScrollProvider.useLayoutEffect": ()=>{
                    cancelAnimationFrame(raf);
                    window.removeEventListener("scroll", update);
                    document.removeEventListener("scroll", update, true);
                    window.removeEventListener("resize", update);
                    ro.disconnect();
                }
            })["NavbarScrollProvider.useLayoutEffect"];
        }
    }["NavbarScrollProvider.useLayoutEffect"], [
        isHome,
        pathname,
        tracklistLayoutToken
    ]);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "NavbarScrollProvider.useMemo[value]": ()=>({
                tracklistSectionRef,
                tracklistFillsViewport,
                markTracklistMounted
            })
    }["NavbarScrollProvider.useMemo[value]"], [
        tracklistFillsViewport,
        markTracklistMounted
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavbarScrollContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/providers/NavbarScrollProvider.tsx",
        lineNumber: 85,
        columnNumber: 5
    }, this);
}
_s(NavbarScrollProvider, "xrXVQz8npCq446NX3ganLRndlAc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = NavbarScrollProvider;
function useNavbarScroll() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(NavbarScrollContext);
    if (!ctx) {
        throw new Error("useNavbarScroll must be used within NavbarScrollProvider");
    }
    return ctx;
}
_s1(useNavbarScroll, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "NavbarScrollProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/layout/CustomCursor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomCursor",
    ()=>CustomCursor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const CURSOR_CLASS = "use-custom-cursor";
function closestInteractive(el) {
    if (!el || !(el instanceof Element)) return null;
    return el.closest([
        "a[href]",
        "button",
        '[role="button"]',
        '[role="link"]',
        "[data-cursor-interactive]",
        "summary",
        "label",
        'input:not([type="hidden"])',
        "select",
        "textarea"
    ].join(", "));
}
function isLightCursorZone(el) {
    if (!el || !(el instanceof Element)) return false;
    return el.closest("[data-cursor-light-bg]") != null;
}
function isInteractiveTarget(el) {
    const t = closestInteractive(el);
    if (!t) return false;
    if (t.hasAttribute("data-cursor-skip")) return false;
    if (t instanceof HTMLAnchorElement) {
        const href = t.getAttribute("href");
        if (href == null || href === "") return false;
    }
    if (t instanceof HTMLButtonElement && t.disabled) return false;
    if (t instanceof HTMLInputElement) {
        if (t.disabled) return false;
        if (t.type === "hidden") return false;
    }
    if (t instanceof HTMLSelectElement && t.disabled) return false;
    if (t instanceof HTMLTextAreaElement && t.disabled) return false;
    if (t.getAttribute("aria-disabled") === "true") return false;
    return true;
}
function CustomCursor() {
    _s();
    const ringRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pos = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0
    });
    const raf = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const filledRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const lightBgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [live, setLive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [filled, setFilled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [lightBg, setLightBg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"])({
        "CustomCursor.useLayoutEffect": ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            if (!window.matchMedia("(pointer: fine)").matches) return;
            const root = document.documentElement;
            const { body } = document;
            root.classList.add(CURSOR_CLASS);
            body.classList.add(CURSOR_CLASS);
            const flush = {
                "CustomCursor.useLayoutEffect.flush": ()=>{
                    raf.current = 0;
                    const ring = ringRef.current;
                    const { x, y } = pos.current;
                    if (ring) {
                        ring.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
                    }
                    const hit = document.elementFromPoint(x, y);
                    const nextFilled = isInteractiveTarget(hit);
                    if (nextFilled !== filledRef.current) {
                        filledRef.current = nextFilled;
                        setFilled(nextFilled);
                    }
                    const nextLight = isLightCursorZone(hit);
                    if (nextLight !== lightBgRef.current) {
                        lightBgRef.current = nextLight;
                        setLightBg(nextLight);
                    }
                }
            }["CustomCursor.useLayoutEffect.flush"];
            pos.current = {
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            };
            flush();
            setLive(true);
            const onMove = {
                "CustomCursor.useLayoutEffect.onMove": (e)=>{
                    pos.current.x = e.clientX;
                    pos.current.y = e.clientY;
                    setVisible(true);
                    if (raf.current === 0) {
                        raf.current = requestAnimationFrame(flush);
                    }
                }
            }["CustomCursor.useLayoutEffect.onMove"];
            const onHide = {
                "CustomCursor.useLayoutEffect.onHide": ()=>setVisible(false)
            }["CustomCursor.useLayoutEffect.onHide"];
            const onVisibility = {
                "CustomCursor.useLayoutEffect.onVisibility": ()=>{
                    if (document.visibilityState === "hidden") onHide();
                }
            }["CustomCursor.useLayoutEffect.onVisibility"];
            window.addEventListener("pointermove", onMove, {
                passive: true
            });
            window.addEventListener("blur", onHide);
            document.addEventListener("visibilitychange", onVisibility);
            return ({
                "CustomCursor.useLayoutEffect": ()=>{
                    root.classList.remove(CURSOR_CLASS);
                    body.classList.remove(CURSOR_CLASS);
                    window.removeEventListener("pointermove", onMove);
                    window.removeEventListener("blur", onHide);
                    document.removeEventListener("visibilitychange", onVisibility);
                    if (raf.current) cancelAnimationFrame(raf.current);
                }
            })["CustomCursor.useLayoutEffect"];
        }
    }["CustomCursor.useLayoutEffect"], []);
    const ringPalette = lightBg ? filled ? "h-3.5 w-3.5 border-0 bg-black/85 md:h-4 md:w-4" : "h-9 w-9 border-2 border-black/55 bg-transparent md:h-10 md:w-10" : filled ? "h-3.5 w-3.5 border-0 bg-white/90 md:h-4 md:w-4" : "h-9 w-9 border-2 border-white/75 bg-transparent md:h-10 md:w-10";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: ringRef,
        className: [
            "pointer-events-none fixed left-0 top-0 z-[10050] rounded-full will-change-transform",
            "transition-[width,height,opacity,border-width,background-color,border-color]",
            "duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
            ringPalette,
            live && visible ? "opacity-100" : "opacity-0"
        ].join(" "),
        style: {
            transform: "translate3d(-100px, -100px, 0)"
        },
        "aria-hidden": true
    }, void 0, false, {
        fileName: "[project]/components/layout/CustomCursor.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
_s(CustomCursor, "1koDKotixltOaynBXQ7k5b2dOio=");
_c = CustomCursor;
var _c;
__turbopack_context__.k.register(_c, "CustomCursor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/layout/Navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Navbar",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2f$IntroSequenceProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/providers/IntroSequenceProvider.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2f$NavbarScrollProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/providers/NavbarScrollProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
/** Logo e icono de menú en tracklist (fondo claro), mismo asset con tinte */ const TRACKLIST_HEADER_ACCENT = "#5F5229";
const maskContain = {
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "100% auto",
    maskSize: "100% auto"
};
const Navbar = ()=>{
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const { showHeader } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2f$IntroSequenceProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIntroSequence"])();
    const { tracklistFillsViewport } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2f$NavbarScrollProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavbarScroll"])();
    const isHome = pathname === "/";
    /** En home puede ocultarse hasta que termine la intro; en otras rutas siempre visible */ const isVisible = !isHome || showHeader;
    /** Mismo logo e icono que en hero, tinte en tracklist cuando la sección llena el viewport */ const headerIconsTracklist = isHome && tracklistFillsViewport;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: `fixed top-0 left-0 right-0 z-[70] will-change-transform transition-transform duration-[380ms] ease-out ${isVisible ? "translate-y-0" : "-translate-y-full pointer-events-none"}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between px-6 md:px-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    className: "pointer-events-auto",
                    children: headerIconsTracklist ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "block h-[29px] w-[150px] max-w-full md:w-[188px]",
                        style: {
                            backgroundColor: TRACKLIST_HEADER_ACCENT,
                            WebkitMaskImage: "url(/images/drexler-logo.svg)",
                            maskImage: "url(/images/drexler-logo.svg)",
                            ...maskContain
                        },
                        role: "img",
                        "aria-label": "Jorge Drexler"
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Navbar.tsx",
                        lineNumber: 42,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/drexler-logo.svg",
                        alt: "Jorge Drexler",
                        width: 188,
                        height: 29,
                        className: "h-auto w-[150px] md:w-[188px]",
                        priority: true
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Navbar.tsx",
                        lineNumber: 54,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/layout/Navbar.tsx",
                    lineNumber: 40,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    "aria-label": "Abrir menu",
                    className: "pointer-events-auto inline-flex items-center justify-center",
                    children: headerIconsTracklist ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "block h-3 w-[41px]",
                        style: {
                            backgroundColor: TRACKLIST_HEADER_ACCENT,
                            WebkitMaskImage: "url(/images/menu-icon.svg)",
                            maskImage: "url(/images/menu-icon.svg)",
                            ...maskContain
                        },
                        role: "img",
                        "aria-label": "Menu"
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Navbar.tsx",
                        lineNumber: 71,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/images/menu-icon.svg",
                        alt: "Menu",
                        width: 41,
                        height: 12,
                        className: "h-3 w-[41px]",
                        priority: true
                    }, void 0, false, {
                        fileName: "[project]/components/layout/Navbar.tsx",
                        lineNumber: 83,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/components/layout/Navbar.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/layout/Navbar.tsx",
            lineNumber: 39,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/layout/Navbar.tsx",
        lineNumber: 32,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Navbar, "f37PYbmyRaG3eppddk9yb4q1RZQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2f$IntroSequenceProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIntroSequence"],
        __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$providers$2f$NavbarScrollProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavbarScroll"]
    ];
});
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_dfd6efc4._.js.map