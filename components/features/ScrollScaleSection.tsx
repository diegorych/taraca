"use client";

// --- Tour Content Components ---

const TOUR_DATES = [
  { city: "MAIPÚ, ARG.", venue: "Arena Maipu Stadium", date: "10 ABRIL / 26" },
  { city: "CÓRDOBA, ARG.", venue: "Quality Arena", date: "12 ABRIL / 26" },
  { city: "ROSARIO, ARG.", venue: "Metropolitano", date: "15 ABRIL / 26" },
  { city: "BUENOS AIRES, ARG.", venue: "Movistar Arena", date: "18 ABRIL / 26" },
  { city: "MONTEVIDEO, URU.", venue: "Antel Arena", date: "22 ABRIL / 26" },
  { city: "SANTIAGO, CHI.", venue: "Movistar Arena", date: "25 ABRIL / 26" },
];

const TourDateRow = ({ city, venue, date }: { city: string, venue: string, date: string }) => (
  <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-6 border-b border-black/10 group hover:bg-black/5 transition-colors px-4">
    <div className="mb-2 md:mb-0">
      <h3 className="text-lg font-bold uppercase tracking-wide text-black">{city}</h3>
      <p className="text-sm text-gray-600">{venue}</p>
    </div>
    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
      <span className="text-sm font-medium text-black/80">{date}</span>
      <div className="flex gap-4 text-sm font-bold underline decoration-1 underline-offset-4">
        <a href="#" className="hover:text-gray-600 transition-colors">RSVP</a>
        <a href="#" className="hover:text-gray-600 transition-colors">TICKETS</a>
      </div>
    </div>
  </div>
);

export const ScrollScaleSection = () => {
  return (
    <section
      className="relative -mt-px min-h-screen bg-[#F5F5F0]"
      style={{
        backgroundImage: "url('/images/deco-cuadrado.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="mx-auto w-full max-w-5xl px-6 md:px-12 pt-20 pb-10">
        <div className="mb-12">
          <h2 className="text-5xl md:text-7xl font-bold text-black mb-4 tracking-tighter">
            Tour Taraca 2026
          </h2>
          <p className="text-lg text-gray-600">
            <a href="#" className="underline decoration-1 underline-offset-4 hover:text-black transition-colors">
              Siguenos
            </a>{" "}
            para recibir actualizaciones sobre nuevos espectaculos, musica mas
          </p>
        </div>

        <div className="flex flex-col border-t border-black/10">
          {TOUR_DATES.map((tour, index) => (
            <TourDateRow key={index} {...tour} />
          ))}
        </div>

        <div className="mt-12 text-sm text-gray-500 pb-20">
          No ves un show cerca tuyo?{" "}
          <a href="#" className="underline decoration-1 underline-offset-2 text-black hover:text-gray-600">
            Pide un show
          </a>
        </div>
      </div>
    </section>
  );
};
