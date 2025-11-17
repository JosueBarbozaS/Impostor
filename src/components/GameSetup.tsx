import { useState } from 'react';
import { Users, Sparkles, Ghost, HelpCircle, CheckSquare, Square, UserX } from 'lucide-react';
import { Category } from '../App';

interface GameSetupProps {
  onStart: (playerCount: number, impostorCount: number, selectedCategories: Category[], gameMode: 'basic' | 'withClues') => void;
}

function GameSetup({ onStart }: GameSetupProps) {
  const [playerCount, setPlayerCount] = useState(3);
  const [impostorCount, setImpostorCount] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['lugares', 'comida', 'objetos', 'animales', 'cantantes', 'deportes']);
  const [gameMode, setGameMode] = useState<'basic' | 'withClues'>('basic');

  const handleStart = () => {
    if (selectedCategories.length === 0) {
      alert('¡Selecciona al menos una categoría!');
      return;
    }
    onStart(playerCount, impostorCount, selectedCategories, gameMode);
  };

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

  const handlePlayerCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      const newCount = Math.min(10, Math.max(3, value));
      setPlayerCount(newCount);
      // Ajustar impostores si excede el nuevo máximo
      if (impostorCount > Math.floor(newCount / 2)) {
        setImpostorCount(Math.max(1, Math.floor(newCount / 2)));
      }
    }
  };

  const handleImpostorCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      const maxImpostors = Math.floor(playerCount / 2);
      setImpostorCount(Math.min(maxImpostors, Math.max(1, value)));
    }
  };

  const incrementPlayers = () => {
    if (playerCount < 10) {
      const newCount = playerCount + 1;
      setPlayerCount(newCount);
      // Ajustar impostores si es necesario
      if (impostorCount > Math.floor(newCount / 2)) {
        setImpostorCount(Math.max(1, Math.floor(newCount / 2)));
      }
    }
  };

  const decrementPlayers = () => {
    if (playerCount > 3) {
      const newCount = playerCount - 1;
      setPlayerCount(newCount);
      // Ajustar impostores si es necesario
      if (impostorCount > Math.floor(newCount / 2)) {
        setImpostorCount(Math.max(1, Math.floor(newCount / 2)));
      }
    }
  };

  const incrementImpostors = () => {
    const maxImpostors = Math.floor(playerCount / 2);
    if (impostorCount < maxImpostors) {
      setImpostorCount(impostorCount + 1);
    }
  };

  const decrementImpostors = () => {
    if (impostorCount > 1) {
      setImpostorCount(impostorCount - 1);
    }
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

  return (
    <div className="w-full max-w-sm mx-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-6 space-y-5 border border-gray-700">
        {/* Header más compacto */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Ghost className="w-12 h-12 text-purple-500" />
          </div>
          
          <p className="text-gray-300 text-sm">¡Encuentra al impostor!</p>
        </div>

        <div className="space-y-4">
          {/* Selector de número de jugadores */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-200 font-semibold text-sm">
              <Users className="w-4 h-4" />
              Número de jugadores
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={decrementPlayers}
                disabled={playerCount <= 3}
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors border border-gray-600"
              >
                -
              </button>
              <input
                type="number"
                min="3"
                max="10"
                value={playerCount}
                onChange={handlePlayerCountChange}
                className="flex-1 px-3 py-2 bg-gray-700 border-2 border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 font-semibold text-white text-center placeholder-gray-400"
              />
              <button
                onClick={incrementPlayers}
                disabled={playerCount >= 10}
                className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors border border-gray-600"
              >
                +
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center">Mínimo 3, máximo 10</p>
          </div>

          

          {/* Selector de modo de juego */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-gray-200 font-semibold text-sm">
              <HelpCircle className="w-4 h-4" />
              Modo de Juego
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setGameMode('basic')}
                className={`p-3 rounded-lg font-semibold transition-all flex flex-col items-center gap-1 text-xs ${
                  gameMode === 'basic'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-105 border border-purple-500'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Básico</span>
              </button>
              <button
                onClick={() => setGameMode('withClues')}
                className={`p-3 rounded-lg font-semibold transition-all flex flex-col items-center gap-1 text-xs ${
                  gameMode === 'withClues'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg scale-105 border border-purple-500'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Con Pistas</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center">
              {gameMode === 'basic' 
                ? 'Solo palabra vs impostor' 
                : 'El impostor recibe una pista'
              }
            </p>
          </div>

          {/* Selector de categorías con mejor espaciado */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-gray-200 font-semibold text-sm">Categorías</label>
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
            
            {/* Grid de categorías con más espacio */}
            <div className="grid grid-cols-2 gap-2">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`p-2 rounded-lg font-semibold transition-all flex items-center gap-2 text-xs border min-h-[4px] ${
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
        </div>

        {/* Botón principal más compacto */}
        <button
          onClick={handleStart}
          disabled={selectedCategories.length === 0}
          className={`w-full py-2 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transform transition-all flex items-center justify-center gap-2 border ${
            selectedCategories.length === 0
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed border-gray-600'
              : 'bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:scale-105 border-purple-500'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          {selectedCategories.length === 0 ? 'Selecciona categorías' : '¡Comenzar Juego!'}
        </button>
      </div>
    </div>
  );
}

export default GameSetup;
