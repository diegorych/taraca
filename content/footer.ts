/** Bloques de contacto (texto del sitio oficial). */
export const footerContactColumns = [
  {
    id: "col-1",
    blocks: [
      {
        title: "Management",
        lines: ['Jesús "Presser" Martos'],
        links: [{ label: "management@jorgedrexler.com", href: "mailto:management@jorgedrexler.com" }],
      },
      {
        title: "Oficina / comunicación",
        lines: [],
        links: [{ label: "contacto@jorgedrexler.com", href: "mailto:contacto@jorgedrexler.com" }],
      },
    ],
  },
  {
    id: "col-2",
    blocks: [
      {
        title: "Contratación en América",
        lines: ["La Buena Fortuna · Nelson «Polo» Montalvo"],
        links: [
          {
            label: "+1 (787) 379-9096 / +1 (787) 230-1783 (oficina)",
            href: "tel:+17873799096",
          },
          {
            label: "management@labuenafortuna.com",
            href: "mailto:management@labuenafortuna.com",
          },
        ],
      },
    ],
  },
  {
    id: "col-3",
    blocks: [
      {
        title: "Contratación en España / Europa",
        lines: ["Solido Show · Carlos Cancho"],
        links: [
          { label: "+34 630 942 211", href: "tel:+34630942211" },
          {
            label: "www.solidoshow.com",
            href: "https://www.solidoshow.com",
          },
          {
            label: "cancho@solidoshow.com",
            href: "mailto:cancho@solidoshow.com",
          },
        ],
      },
    ],
  },
] as const;

export const footerSocialLinks = [
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/jorgedrexler/",
    IconName: "Instagram" as const,
  },
  {
    id: "x",
    label: "X (Twitter)",
    href: "https://twitter.com/jorgedrexler",
    IconName: "X" as const,
  },
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/jorgedrexler",
    IconName: "Facebook" as const,
  },
  {
    id: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/user/jorgedrexler",
    IconName: "Youtube" as const,
  },
] as const;

export const footerLegalLines = {
  copyright: "Copyright © 2026 Sony Music Entertainment España, S.L.",
  links: [
    { label: "Política de privacidad y cookies", href: "#" },
    { label: "Condiciones generales", href: "#" },
  ],
} as const;
