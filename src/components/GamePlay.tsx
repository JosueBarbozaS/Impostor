import { Eye, ChevronRight, Sparkles, User, Shield, Ghost, Lock } from 'lucide-react';
import { GameState } from '../App';
import { useState, useEffect } from 'react';

interface GamePlayProps {
  gameState: GameState;
  onRevealCard: () => void;
  onNextPlayer: () => void;
}

function GamePlay({ gameState, onRevealCard, onNextPlayer }: GamePlayProps) {
  const isImpostor = gameState.currentPlayerIndex === gameState.impostorIndex;
  const currentPlayerName = gameState.playerNames[gameState.currentPlayerIndex];
  const [showRole, setShowRole] = useState(false);
  const [isNewPlayer, setIsNewPlayer] = useState(true);

  useEffect(() => {
    setShowRole(false);
    setIsNewPlayer(true);
    
    const timer = setTimeout(() => {
      setIsNewPlayer(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [gameState.currentPlayerIndex]);

  const handleReveal = () => {
    setShowRole(true);
    onRevealCard();
  };

  const handleNext = () => {
    setShowRole(false);
    setIsNewPlayer(true);
    onNextPlayer();
  };

  if (!showRole) {
    return (
      <div className="w-full max-w-sm mx-4">
        {/* Header del jugador actual */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center gap-2 bg-gray-700/80 backdrop-blur-sm px-4 py-3 rounded-full border border-gray-600 transition-all duration-500 ${
            isNewPlayer ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
          }`}>
            <User className="w-5 h-5 text-purple-400" />
            <p className="text-white font-bold text-lg">
              {currentPlayerName}
            </p>
            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
            <p className="text-gray-300 text-xs">
              {gameState.currentPlayerIndex + 1} de {gameState.playerCount}
            </p>
          </div>
        </div>

        {/* Tarjeta de revelación */}
        <div className={`perspective-1000 transition-all duration-700 ${
          isNewPlayer ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}>
          <div className="relative w-full h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl shadow-2xl"></div>
            <div className="absolute inset-3 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-inner"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent from-40% to-black/20 to-80% rounded-2xl"></div>
            
            {/* Elementos decorativos */}
            <div className="absolute top-4 left-4 opacity-20">
              <Lock className="w-6 h-6 text-white animate-float" />
            </div>
            <div className="absolute bottom-4 right-4 opacity-20">
              <Lock className="w-6 h-6 text-white animate-float" style={{ animationDelay: '1s' }} />
            </div>
            <div className="absolute top-4 right-6 opacity-15">
              <Shield className="w-5 h-5 text-white animate-float" style={{ animationDelay: '2s' }} />
            </div>
            <div className="absolute bottom-5 left-5 opacity-15">
              <Ghost className="w-6 h-6 text-white animate-float" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Botón de revelar */}
            <button
              onClick={handleReveal}
              className="relative w-full h-full flex flex-col items-center justify-center space-y-6 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <div className="relative bg-white/20 backdrop-blur-sm rounded-full p-5 border border-white/30 group-hover:border-white/50 transition-all duration-300">
                  <Eye className="w-12 h-12 text-white transform group-hover:scale-110 transition-transform" />
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-white text-2xl font-bold tracking-wide">
                  TOCA PARA REVELAR
                </p>
                <p className="text-gray-300 text-base font-medium">
                  Solo {currentPlayerName} puede ver esto
                </p>
              </div>

              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -translate-y-1 group-hover:translate-y-80 transition-transform duration-1000"></div>
            </button>

            {/* Esquinas decorativas */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-tl-2xl rounded-br-2xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-white/10 to-transparent rounded-tr-2xl rounded-bl-2xl"></div>
          </div>
        </div>

        {/* Texto de ayuda */}
        <div className={`text-center mt-4 transition-all duration-500 ${
          isNewPlayer ? 'opacity-0' : 'opacity-100'
        }`}>
          <p className="text-gray-400 text-xs">
            Presiona el botón para ver tu rol secreto
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-4">
      {/* Header del jugador actual */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gray-700/80 backdrop-blur-sm px-4 py-3 rounded-full border border-gray-600">
          <User className="w-5 h-5 text-purple-400" />
          <p className="text-white font-bold text-lg">
            {currentPlayerName}
          </p>
          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
          <p className="text-gray-300 text-xs">
            {gameState.currentPlayerIndex + 1} de {gameState.playerCount}
          </p>
        </div>
      </div>

      {/* Tarjeta de rol revelado */}
      <div className="perspective-1000 animate-fade-in">
        <div className="relative w-full h-80">
          {isImpostor ? (
            <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-red-800 rounded-2xl shadow-2xl"></div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 rounded-2xl shadow-2xl"></div>
          )}
          
          <div className={`absolute inset-3 rounded-xl shadow-inner ${
            isImpostor 
              ? 'bg-gradient-to-br from-red-500/80 to-red-700/80' 
              : 'bg-gradient-to-br from-green-500/80 to-green-700/80'
          }`}></div>
          
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-white text-center space-y-4">
            {isImpostor ? (
              <>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-md animate-pulse"></div>
                  <Ghost className="w-16 h-16 relative z-10 transform hover:scale-110 transition-transform" />
                </div>
                <div className="space-y-3">
                  <p className="text-2xl font-bold tracking-wide bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                    ¡ERES EL IMPOSTOR!
                  </p>
                  
                  {gameState.impostorClue && (
                    <div className="bg-black/40 backdrop-blur-sm px-3 py-2 rounded-lg border border-yellow-400/50">
                      <p className="text-yellow-300 text-xs font-semibold">💡 Pista:</p>
                      <p className="text-yellow-200 text-base font-bold">{gameState.impostorClue}</p>
                    </div>
                  )}
                  
                  <div className="bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                    <p className="text-base font-semibold opacity-90">
                      {gameState.impostorClue ? '¡Usa la pista para adivinar!' : 'No sabes la palabra secreta'}
                    </p>
                    <p className="text-sm opacity-80 mt-1">
                      ¡Observa y adivina!
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-1">
                  {[0, 1, 2].map(i => (
                    <div 
                      key={i}
                      className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-md"></div>
                  <Shield className="w-16 h-16 relative z-10 transform hover:scale-110 transition-transform" />
                </div>
                <div className="space-y-3">
                  <p className="text-xl font-bold tracking-wide bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                    ERES TRIPULANTE
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs opacity-80 font-medium">
                      La palabra secreta es:
                    </p>
                    <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl border border-white/30 transform hover:scale-105 transition-transform">
                      <p className="text-3xl font-bold tracking-wide bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                        {gameState.secretWord}
                      </p>
                    </div>
                    <p className="text-base opacity-80 font-semibold">
                      ¡Memorízala bien!
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-1">
                  {[0, 1, 2].map(i => (
                    <Sparkles 
                      key={i}
                      className="w-4 h-4 text-yellow-300 animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Esquinas decorativas */}
          <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-white/15 to-transparent rounded-tl-2xl rounded-br-2xl"></div>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-white/15 to-transparent rounded-tr-2xl rounded-bl-2xl"></div>
        </div>
      </div>

      {/* Botón siguiente jugador */}
      <div className="text-center mt-6 animate-fade-in">
        <button
          onClick={handleNext}
          className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center gap-2 mx-auto group border border-purple-500"
        >
          <div className="relative">
            <ChevronRight className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white/20 rounded-full blur-sm group-hover:blur transition-all"></div>
          </div>
          Siguiente
        </button>
        <p className="text-gray-400 text-xs mt-2">
          Pasa el dispositivo a {gameState.currentPlayerIndex + 2 > gameState.playerCount ? 
          'la siguiente ronda' : 
          gameState.playerNames[gameState.currentPlayerIndex + 1]}
        </p>
      </div>
    </div>
  );
}

export default GamePlay;