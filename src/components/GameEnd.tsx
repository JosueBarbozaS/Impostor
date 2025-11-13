import { useState } from 'react';
import { RotateCcw, Sparkles, Users, CheckSquare, Square } from 'lucide-react';
import { Category } from '../App';

interface GameEndProps {
  onRestart: () => void;
  onNewPlayers: () => void;
  onRestartWithNewCategories: (categories: Category[]) => void;
  currentCategories: Category[];
  playerNames: string[];
}

function GameEnd({ onRestart, onNewPlayers, onRestartWithNewCategories, currentCategories, playerNames }: GameEndProps) {
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(currentCategories);
  
  // Elegir un jugador aleatorio para empezar
  const randomStarterIndex = Math.floor(Math.random() * playerNames.length);
  const startingPlayer = playerNames[randomStarterIndex];

  const toggleCategory = (category: Category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const selectAllCategories = () => {
    setSelectedCategories(['lugares', 'comida', 'objetos', 'animales', 'cantantes', 'deportes']);
  };

  const clearAllCategories = () => {
    setSelectedCategories([]);
  };

  const handleCategoryRestart = () => {
    if (selectedCategories.length === 0) {
      alert('¡Selecciona al menos una categoría!');
      return;
    }
    onRestartWithNewCategories(selectedCategories);
    setShowCategorySelector(false);
  };

  const allCategories: Category[] = ['lugares', 'comida', 'objetos', 'animales', 'cantantes', 'deportes'];

  const categoryEmojis: Record<Category, string> = {
    lugares: '🏖️',
    comida: '🍕',
    objetos: '📱',
    animales: '🐶',
    cantantes: '🎤',
    deportes: '⚽'
  };

  if (showCategorySelector) {
    return (
      <div className="w-full max-w-sm mx-4">
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 space-y-5 border border-gray-700">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Elegir Categorías</h2>
            <p className="text-gray-300 text-sm">Selecciona una o varias categorías</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-gray-200 font-semibold text-sm">Categorías disponibles</label>
              <div className="flex gap-1">
                <button
                  onClick={selectAllCategories}
                  className={`text-xs px-2 py-1 rounded transition-colors border ${
                    selectedCategories.length === allCategories.length
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-500'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={clearAllCategories}
                  className={`text-xs px-2 py-1 rounded transition-colors border ${
                    selectedCategories.length === 0
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-500'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
                  }`}
                >
                  Ninguna
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`p-2 rounded-lg font-semibold transition-all flex items-center gap-2 text-xs border min-h-[48px] ${
                    selectedCategories.includes(category)
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-105 border-purple-500'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600'
                  }`}
                >
                  {selectedCategories.includes(category) ? (
                    <CheckSquare className="w-3 h-3 flex-shrink-0" />
                  ) : (
                    <Square className="w-3 h-3 flex-shrink-0" />
                  )}
                  <span>{categoryEmojis[category]}</span>
                  <span className="text-left flex-1">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                </button>
              ))}
            </div>
            
            <p className="text-xs text-gray-400 text-center">
              {selectedCategories.length === 0 
                ? '⚠️ Selecciona al menos una categoría'
                : `Seleccionadas: ${selectedCategories.length} categoría(s)`
              }
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleCategoryRestart}
              disabled={selectedCategories.length === 0}
              className={`w-full py-3 rounded-lg font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 border ${
                selectedCategories.length === 0
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed border-gray-600'
                  : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-xl transform hover:scale-105 border-purple-500'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              Jugar con {selectedCategories.length} categoría(s)
            </button>
            <button
              onClick={() => setShowCategorySelector(false)}
              className="w-full bg-gray-700 text-gray-300 py-3 rounded-lg font-bold hover:bg-gray-600 transition-all border border-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 space-y-5 text-center border border-gray-700">
        {/* Icono principal */}
        <div className="flex justify-center">
          <Sparkles className="w-16 h-16 text-purple-500 animate-pulse" />
        </div>

        {/* Título y descripción */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white">¡Comienza la ronda de pistas!</h1>
          <p className="text-gray-300 text-base">
            Todos los jugadores han visto su tarjeta.
          </p>
          <p className="text-sm text-purple-400 font-semibold">
            Categorías activas: {currentCategories.map(cat => cat.charAt(0).toUpperCase() + cat.slice(1)).join(', ')}
          </p>
        </div>

        {/* Información del jugador que empieza */}
        <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-xl p-4 border border-purple-500/30">
          <p className="text-white font-semibold text-sm mb-2">🎮 ¿Quién empieza?</p>
          <p className="text-2xl font-bold text-purple-300 bg-black/30 py-2 px-4 rounded-lg">
            {startingPlayer}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            ¡Elige al azar! {startingPlayer} dará la primera pista
          </p>
        </div>

        {/* Instrucciones del juego */}
        <div className="bg-gray-700/50 rounded-xl p-4 space-y-3 border border-gray-600">
          <p className="text-white font-semibold text-base">¿Cómo jugar?</p>
          <ul className="text-left text-gray-300 space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">1.</span>
              <span><strong>{startingPlayer}</strong> da la primera pista sobre la palabra</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">2.</span>
              <span>Siguen los demás en orden</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">3.</span>
              <span>El impostor debe disimular e intentar adivinar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">4.</span>
              <span>Al final, voten quién es el impostor</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">5.</span>
              <span>Revelen quién era el impostor y si acertaron</span>
            </li>
          </ul>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <button
            onClick={onRestart}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 border border-purple-500"
          >
            <RotateCcw className="w-5 h-5" />
            Jugar otra ronda
          </button>

          <button
            onClick={() => setShowCategorySelector(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 border border-purple-500"
          >
            <Sparkles className="w-5 h-5" />
            Nuevas categorías
          </button>

          <button
            onClick={onNewPlayers}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2 border border-purple-500"
          >
            <Users className="w-5 h-5" />
            Cambiar jugadores
          </button>
        </div>

        {/* Consejo */}
        <div className="pt-4 border-t border-gray-600">
          <p className="text-gray-400 text-xs">
            💡 <strong>Consejo:</strong> El impostor debe observar las pistas de los demás para adivinar la palabra
          </p>
        </div>
      </div>
    </div>
  );
}

export default GameEnd;
