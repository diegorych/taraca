export type ManifestoSnapshot = {
  src: string;
  alt: string;
};

/** Instantáneas en vivo para la pila del manifiesto. Rutas bajo /public. */
export const manifestoSnapshots: ManifestoSnapshot[] = [
  {
    src: "/images/manifesto/taraca-live-01.png",
    alt: "Jorge Drexler cantando en micrófono durante un ensayo en estudio",
  },
  {
    src: "/images/manifesto/taraca-live-02.png",
    alt: "Dúo cantando en directo con fondo rústico de madera",
  },
  {
    src: "/images/manifesto/taraca-live-03.png",
    alt: "Percusión y micrófono en sesión íntima",
  },
  {
    src: "/images/manifesto/taraca-live-04.png",
    alt: "Jorge Drexler con guitarra cantando en perfil",
  },
];
