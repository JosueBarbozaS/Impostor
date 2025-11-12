import { useState } from 'react';
import { User, ChevronRight } from 'lucide-react';

interface PlayerNamingProps {
  playerCount: number;
  initialNames: string[];
  onNamesSubmit: (names: string[]) => void;
}

function PlayerNaming({ playerCount, initialNames, onNamesSubmit }: PlayerNamingProps) {
  const [names, setNames] = useState<string[]>(
    initialNames.length > 0 
      ? initialNames 
      : Array.from({ length: playerCount }, (_, i) => `Jugador ${i + 1}`)
  );

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleSubmit = () => {
    onNamesSubmit(names);
  };

  return (
    <div className="w-full max-w-sm mx-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 space-y-5 border border-gray-700">
        {/* Header más compacto */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <User className="w-12 h-12 text-purple-500" />
          </div>
          <h1 className="text-2xl font-bold text-white">Nombres de Jugadores</h1>
          <p className="text-gray-300 text-sm">Asigna nombres a cada jugador</p>
        </div>

        {/* Lista de jugadores con scroll mejorado */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {names.map((name, index) => (
            <div key={index} className="space-y-1">
              <label className="text-gray-200 font-semibold text-sm">
                Jugador {index + 1}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 font-semibold text-white placeholder-gray-400"
                placeholder={`Jugador ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Botón más compacto */}
        <button
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 border border-purple-500"
        >
          Continuar al juego
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default PlayerNaming;