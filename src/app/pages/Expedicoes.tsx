import { MapPin } from "lucide-react";
import { PageWrapper, PageTitle } from "../components";
import { DESTINATIONS } from "../data";

export default function Expedicoes() {
  return (
    <PageWrapper>
      <PageTitle sub="Os destinos que guiam cada aporte e cada quilômetro">Rotas de Expedição</PageTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {DESTINATIONS.map(d => (
          <div
            key={d.name}
            className="group relative rounded-2xl overflow-hidden border border-white/7 hover:border-white/20 transition-all duration-300 bg-stone-950"
            style={{ aspectRatio: "16/10" }}
          >
            <img
              src={d.img}
              alt={d.alt}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

            {/* Tag */}
            <div className="absolute top-4 left-4">
              <span
                className={`text-xs px-2.5 py-1 rounded-full border font-mono tracking-widest ${d.tagCls}`}
                style={{ fontSize: "0.6rem" }}
              >
                {d.tag}
              </span>
            </div>

            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="text-white font-bold text-lg leading-tight mb-1"
                style={{ fontFamily: "'Exo 2', sans-serif" }}>
                {d.name}
              </p>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-white/35" />
                <p className="text-white/35 text-xs font-mono">{d.loc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Motivational footer */}
      <div className="mt-8 text-center space-y-2">
        <p className="text-white/15 text-xs font-mono tracking-widest uppercase">
          Cada real aportado é um quilômetro mais próximo
        </p>
        <p className="text-white/8 text-xs font-mono">
          Atacama · Patagônia · Escócia · Nova Zelândia · EUA
        </p>
      </div>
    </PageWrapper>
  );
}
