import { useState } from 'react';
import GameSetup from './components/GameSetup';
import GamePlay from './components/GamePlay';
import GameEnd from './components/GameEnd';
import PlayerNaming from './components/PlayerNaming';

export type Category = 'lugares' | 'comida' | 'objetos' | 'animales' | 'cantantes' | 'deportes';

export interface GameState {
  phase: 'setup' | 'naming' | 'playing' | 'ended';
  playerCount: number;
  playerNames: string[];
  selectedCategories: Category[];
  secretWord: string;
  impostorIndex: number;
  currentPlayerIndex: number;
  cardRevealed: boolean;
  gameMode: 'basic' | 'withClues';
  impostorClue?: string;
}

function App() {
  const [gameState, setGameState] = useState<GameState>({
    phase: 'setup',
    playerCount: 3,
    playerNames: [],
    selectedCategories: ['lugares', 'comida', 'objetos', 'animales', 'cantantes', 'deportes'],
    secretWord: '',
    impostorIndex: -1,
    currentPlayerIndex: 0,
    cardRevealed: false,
    gameMode: 'basic',
  });

  const startGame = (playerCount: number, selectedCategories: Category[], gameMode: 'basic' | 'withClues') => {
    setGameState({
      phase: 'naming',
      playerCount,
      playerNames: [],
      selectedCategories,
      secretWord: '',
      impostorIndex: -1,
      currentPlayerIndex: 0,
      cardRevealed: false,
      gameMode,
    });
  };

  const handleNamesSubmit = (playerNames: string[]) => {
    const words = getWordsForCategories(gameState.selectedCategories);
    const secretWord = words[Math.floor(Math.random() * words.length)];
    const impostorIndex = Math.floor(Math.random() * playerNames.length);
    const impostorClue = gameState.gameMode === 'withClues' 
      ? getClueForWord(secretWord, getCategoryForWord(secretWord))
      : undefined;

    setGameState({
      phase: 'playing',
      playerCount: playerNames.length,
      playerNames,
      selectedCategories: gameState.selectedCategories,
      secretWord,
      impostorIndex,
      currentPlayerIndex: 0,
      cardRevealed: false,
      gameMode: gameState.gameMode,
      impostorClue,
    });
  };

  const revealCard = () => {
    setGameState({ ...gameState, cardRevealed: true });
  };

  const nextPlayer = () => {
    if (gameState.currentPlayerIndex + 1 >= gameState.playerCount) {
      setGameState({ ...gameState, phase: 'ended' });
    } else {
      setGameState({
        ...gameState,
        currentPlayerIndex: gameState.currentPlayerIndex + 1,
        cardRevealed: false,
      });
    }
  };

  const resetGame = () => {
    const currentNames = gameState.playerNames;
    
    if (currentNames.length > 0) {
      const words = getWordsForCategories(gameState.selectedCategories);
      const secretWord = words[Math.floor(Math.random() * words.length)];
      const impostorIndex = Math.floor(Math.random() * currentNames.length);
      const impostorClue = gameState.gameMode === 'withClues' 
        ? getClueForWord(secretWord, getCategoryForWord(secretWord))
        : undefined;

      setGameState({
        phase: 'playing',
        playerCount: currentNames.length,
        playerNames: currentNames,
        selectedCategories: gameState.selectedCategories,
        secretWord,
        impostorIndex,
        currentPlayerIndex: 0,
        cardRevealed: false,
        gameMode: gameState.gameMode,
        impostorClue,
      });
    } else {
      setGameState({
        phase: 'setup',
        playerCount: 3,
        playerNames: [],
        selectedCategories: ['lugares', 'comida', 'objetos', 'animales', 'cantantes', 'deportes'],
        secretWord: '',
        impostorIndex: -1,
        currentPlayerIndex: 0,
        cardRevealed: false,
        gameMode: 'basic',
      });
    }
  };

  const completelyRestart = () => {
    setGameState({
      phase: 'setup',
      playerCount: 3,
      playerNames: [],
      selectedCategories: ['lugares', 'comida', 'objetos', 'animales', 'cantantes', 'deportes'],
      secretWord: '',
      impostorIndex: -1,
      currentPlayerIndex: 0,
      cardRevealed: false,
      gameMode: 'basic',
    });
  };

  const restartWithNewCategories = (newCategories: Category[]) => {
    const words = getWordsForCategories(newCategories);
    const secretWord = words[Math.floor(Math.random() * words.length)];
    const impostorIndex = Math.floor(Math.random() * gameState.playerNames.length);
    const impostorClue = gameState.gameMode === 'withClues' 
      ? getClueForWord(secretWord, getCategoryForWord(secretWord))
      : undefined;

    setGameState({
      phase: 'playing',
      playerCount: gameState.playerNames.length,
      playerNames: gameState.playerNames,
      selectedCategories: newCategories,
      secretWord,
      impostorIndex,
      currentPlayerIndex: 0,
      cardRevealed: false,
      gameMode: gameState.gameMode,
      impostorClue,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
      {gameState.phase === 'setup' && <GameSetup onStart={startGame} />}
      {gameState.phase === 'naming' && (
        <PlayerNaming 
          playerCount={gameState.playerCount}
          initialNames={gameState.playerNames}
          onNamesSubmit={handleNamesSubmit}
        />
      )}
      {gameState.phase === 'playing' && (
        <GamePlay
          gameState={gameState}
          onRevealCard={revealCard}
          onNextPlayer={nextPlayer}
        />
      )}
      {gameState.phase === 'ended' && (
        <GameEnd 
          onRestart={resetGame}
          onNewPlayers={completelyRestart}
          onRestartWithNewCategories={restartWithNewCategories}
          currentCategories={gameState.selectedCategories}
        />
      )}
    </div>
  );
}

function getWordsForCategories(categories: Category[]): string[] {
  const allWords: string[] = [];
  const wordsByCategory: Record<Category, string[]> = {
    lugares: [
      'París', 'Londres', 'Roma', 'Tokio', 'Nueva York', 'Sydney', 'Dubái', 'Barcelona', 'Berlín', 'Ámsterdam',
      'Machu Picchu', 'Gran Cañón', 'Torre Eiffel', 'Estatua Libertad', 'Coliseo', 'Muralla China', 'Taj Mahal', 'Cristo Redentor', 'Big Ben', 'Ópera Sydney',
      'Playa', 'Montaña', 'Bosque', 'Desierto', 'Isla', 'Volcán', 'Río', 'Cascada', 'Lago', 'Selva',
      'Costa Rica', 'México', 'Argentina', 'Brasil', 'Chile', 'Colombia', 'Perú', 'España', 'Italia', 'Francia',
      'Guanacaste', 'Puntarenas', 'Limón', 'Cartago', 'San José', 'Arenal', 'Manuel Antonio', 'Tortuguero', 'Monteverde', 'Jacó'
    ],
    comida: [
      'Gallo Pinto', 'Casado', 'Olla Carne', 'Chifrijo', 'Ceviche', 'Tamal', 'Arroz Leche', 'Tres Leches', 'Patacones', 'Chorreadas',
      'Pizza', 'Hamburguesa', 'Sushi', 'Tacos', 'Pasta', 'Ensalada', 'Helado', 'Paella', 'Empanada', 'Burrito',
      'Gallo Pinto', 'Chifrijo', 'Casado', 'Olla Carne', 'Chorreadas', 'Tamal', 'Patacones', 'Ceviche', 'Arroz Leche', 'Tres Leches',
      'Lasagna', 'Ramen', 'Curry', 'Falafel', 'Hummus', 'Tostadas', 'Flan', 'Brownie', 'Waffles', 'Crepes',
      'Café', 'Chocolate', 'Jugo Natural', 'Horchata', 'Refresco', 'Agua', 'Té', 'Leche', 'Batido', 'Smoothie'
    ],
    objetos: [
      'Teléfono', 'Computadora', 'Tablet', 'Audífonos', 'Cargador', 'Reloj', 'Lentes', 'Mochila', 'Paraguas', 'Llaves',
      'Libro', 'Cuaderno', 'Lápiz', 'Bolígrafo', 'Marcador', 'Tijeras', 'Pegamento', 'Regla', 'Calculadora', 'Mochila',
      'Cama', 'Mesa', 'Silla', 'Sofá', 'Escritorio', 'Estante', 'Lámpara', 'Espejo', 'Almohada', 'Manta',
      'Cuchara', 'Tenedor', 'Cuchillo', 'Plato', 'Vaso', 'Taza', 'Olla', 'Sartén', 'Refrigerador', 'Microondas',
      'Pelota', 'Raqueta', 'Bicicleta', 'Patines', 'Cuerda', 'Pesas', 'Guantes', 'Gorra', 'Zapatos', 'Camiseta'
    ],
    animales: [
      'Perro', 'Gato', 'Pájaro', 'Pez', 'Conejo', 'Hamster', 'Tortuga', 'Iguana', 'Caballo', 'Vaca',
      'León', 'Tigre', 'Elefante', 'Jirafa', 'Mono', 'Cebra', 'Hipopótamo', 'Rinoceronte', 'Cocodrilo', 'Canguro',
      'Delfín', 'Ballena', 'Tiburón', 'Pulpo', 'Medusa', 'Estrella Mar', 'Caballito Mar', 'Tortuga Marina', 'Foca', 'Pingüino',
      'Águila', 'Búho', 'Colibrí', 'Guacamaya', 'Tucán', 'Quetzal', 'Gaviota', 'Pato', 'Cisne', 'Flamenco',
      'Mariposa', 'Abeja', 'Hormiga', 'Araña', 'Escarabajo', 'Mariquita', 'Saltamontes', 'Grillo', 'Libélula', 'Mosquito'
    ],
    cantantes: [
      'Shakira', 'Bad Bunny', 'Karol G', 'Daddy Yankee', 'J Balvin', 'Maluma', 'Ozuna', 'Anuel AA', 'Nicky Jam', 'Wisin Y Yandel',
      'Taylor Swift', 'Drake', 'Ariana Grande', 'Ed Sheeran', 'Billie Eilish', 'The Weeknd', 'Dua Lipa', 'Harry Styles', 'Bruno Mars', 'Post Malone',
      'Beyoncé', 'Rihanna', 'Adele', 'Coldplay', 'Maroon 5', 'Katy Perry', 'Lady Gaga', 'Justin Bieber', 'Shawn Mendes', 'Camila Cabello',
      'Ricardo Arjona', 'Juanes', 'Carlos Vives', 'Fonseca', 'Andrés Cepeda', 'Jesse Joy', 'Morat', 'Sebastián Yatra', 'Maná', 'Café Tacvba',
      'Selena', 'Jenni Rivera', 'Ana Gabriel', 'Luis Miguel', 'Chayanne', 'Ricky Martin', 'Enrique Iglesias', 'Gloria Estefan', 'Marc Anthony', 'Jennifer Lopez'
    ],
    deportes: [
      'Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Ciclismo', 'Atletismo', 'Boxeo', 'Golf', 'Voleibol', 'Béisbol',
      'Messi', 'Cristiano Ronaldo', 'Neymar', 'Mbappé', 'Haaland', 'Lewandowski', 'Modric', 'Benzema', 'Salah', 'De Bruyne',
      'LeBron James', 'Michael Jordan', 'Kobe Bryant', 'Stephen Curry', 'Kevin Durant', 'Giannis', 'Shaquille ONeal', 'Magic Johnson', 'Larry Bird', 'Tim Duncan',
      'Rafael Nadal', 'Roger Federer', 'Novak Djokovic', 'Serena Williams', 'Naomi Osaka', 'Carlos Alcaraz', 'Andy Murray', 'Maria Sharapova', 'Iga Swiatek', 'Daniil Medvedev',
      'Usain Bolt', 'Michael Phelps', 'Simone Biles', 'Katie Ledecky', 'Allyson Felix', 'Eliud Kipchoge', 'Floyd Mayweather', 'Manny Pacquiao', 'Canelo Álvarez', 'Tyson Fury'
    ],
  };

  categories.forEach(category => {
    allWords.push(...wordsByCategory[category]);
  });

  return allWords;
}

function getCategoryForWord(word: string): Category {
  const wordsByCategory: Record<Category, string[]> = {
    lugares: [
      'París', 'Londres', 'Roma', 'Tokio', 'Nueva York', 'Sydney', 'Dubái', 'Barcelona', 'Berlín', 'Ámsterdam',
      'Machu Picchu', 'Gran Cañón', 'Torre Eiffel', 'Estatua Libertad', 'Coliseo', 'Muralla China', 'Taj Mahal', 'Cristo Redentor', 'Big Ben', 'Ópera Sydney',
      'Playa', 'Montaña', 'Bosque', 'Desierto', 'Isla', 'Volcán', 'Río', 'Cascada', 'Lago', 'Selva',
      'Costa Rica', 'México', 'Argentina', 'Brasil', 'Chile', 'Colombia', 'Perú', 'España', 'Italia', 'Francia',
      'Guanacaste', 'Puntarenas', 'Limón', 'Cartago', 'San José', 'Arenal', 'Manuel Antonio', 'Tortuguero', 'Monteverde', 'Jacó'
    ],
    comida: [
      'Gallo Pinto', 'Casado', 'Olla Carne', 'Chifrijo', 'Ceviche', 'Tamal', 'Arroz Leche', 'Tres Leches', 'Patacones', 'Chorreadas',
      'Pizza', 'Hamburguesa', 'Sushi', 'Tacos', 'Pasta', 'Ensalada', 'Helado', 'Paella', 'Empanada', 'Burrito',
      'Gallo Pinto', 'Chifrijo', 'Casado', 'Olla Carne', 'Chorreadas', 'Tamal', 'Patacones', 'Ceviche', 'Arroz Leche', 'Tres Leches',
      'Lasagna', 'Ramen', 'Curry', 'Falafel', 'Hummus', 'Tostadas', 'Flan', 'Brownie', 'Waffles', 'Crepes',
      'Café', 'Chocolate', 'Jugo Natural', 'Horchata', 'Refresco', 'Agua', 'Té', 'Leche', 'Batido', 'Smoothie'
    ],
    objetos: [
      'Teléfono', 'Computadora', 'Tablet', 'Audífonos', 'Cargador', 'Reloj', 'Lentes', 'Mochila', 'Paraguas', 'Llaves',
      'Libro', 'Cuaderno', 'Lápiz', 'Bolígrafo', 'Marcador', 'Tijeras', 'Pegamento', 'Regla', 'Calculadora', 'Mochila',
      'Cama', 'Mesa', 'Silla', 'Sofá', 'Escritorio', 'Estante', 'Lámpara', 'Espejo', 'Almohada', 'Manta',
      'Cuchara', 'Tenedor', 'Cuchillo', 'Plato', 'Vaso', 'Taza', 'Olla', 'Sartén', 'Refrigerador', 'Microondas',
      'Pelota', 'Raqueta', 'Bicicleta', 'Patines', 'Cuerda', 'Pesas', 'Guantes', 'Gorra', 'Zapatos', 'Camiseta'
    ],
    animales: [
      'Perro', 'Gato', 'Pájaro', 'Pez', 'Conejo', 'Hamster', 'Tortuga', 'Iguana', 'Caballo', 'Vaca',
      'León', 'Tigre', 'Elefante', 'Jirafa', 'Mono', 'Cebra', 'Hipopótamo', 'Rinoceronte', 'Cocodrilo', 'Canguro',
      'Delfín', 'Ballena', 'Tiburón', 'Pulpo', 'Medusa', 'Estrella Mar', 'Caballito Mar', 'Tortuga Marina', 'Foca', 'Pingüino',
      'Águila', 'Búho', 'Colibrí', 'Guacamaya', 'Tucán', 'Quetzal', 'Gaviota', 'Pato', 'Cisne', 'Flamenco',
      'Mariposa', 'Abeja', 'Hormiga', 'Araña', 'Escarabajo', 'Mariquita', 'Saltamontes', 'Grillo', 'Libélula', 'Mosquito'
    ],
    cantantes: [
      'Shakira', 'Bad Bunny', 'Karol G', 'Daddy Yankee', 'J Balvin', 'Maluma', 'Ozuna', 'Anuel AA', 'Nicky Jam', 'Wisin Y Yandel',
      'Taylor Swift', 'Drake', 'Ariana Grande', 'Ed Sheeran', 'Billie Eilish', 'The Weeknd', 'Dua Lipa', 'Harry Styles', 'Bruno Mars', 'Post Malone',
      'Beyoncé', 'Rihanna', 'Adele', 'Coldplay', 'Maroon 5', 'Katy Perry', 'Lady Gaga', 'Justin Bieber', 'Shawn Mendes', 'Camila Cabello',
      'Ricardo Arjona', 'Juanes', 'Carlos Vives', 'Fonseca', 'Andrés Cepeda', 'Jesse Joy', 'Morat', 'Sebastián Yatra', 'Maná', 'Café Tacvba',
      'Selena', 'Jenni Rivera', 'Ana Gabriel', 'Luis Miguel', 'Chayanne', 'Ricky Martin', 'Enrique Iglesias', 'Gloria Estefan', 'Marc Anthony', 'Jennifer Lopez'
    ],
    deportes: [
      'Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Ciclismo', 'Atletismo', 'Boxeo', 'Golf', 'Voleibol', 'Béisbol',
      'Messi', 'Cristiano Ronaldo', 'Neymar', 'Mbappé', 'Haaland', 'Lewandowski', 'Modric', 'Benzema', 'Salah', 'De Bruyne',
      'LeBron James', 'Michael Jordan', 'Kobe Bryant', 'Stephen Curry', 'Kevin Durant', 'Giannis', 'Shaquille ONeal', 'Magic Johnson', 'Larry Bird', 'Tim Duncan',
      'Rafael Nadal', 'Roger Federer', 'Novak Djokovic', 'Serena Williams', 'Naomi Osaka', 'Carlos Alcaraz', 'Andy Murray', 'Maria Sharapova', 'Iga Swiatek', 'Daniil Medvedev',
      'Usain Bolt', 'Michael Phelps', 'Simone Biles', 'Katie Ledecky', 'Allyson Felix', 'Eliud Kipchoge', 'Floyd Mayweather', 'Manny Pacquiao', 'Canelo Álvarez', 'Tyson Fury'
    ],
  };

  for (const [category, words] of Object.entries(wordsByCategory)) {
    if (words.includes(word)) {
      return category as Category;
    }
  }

  return 'lugares';
}

function getClueForWord(word: string, category: Category): string {
  const clues: Record<Category, Record<string, string>> = {
    lugares: {
      'París': 'Torre', 'Londres': 'Big', 'Roma': 'Coliseo', 'Tokio': 'Anime', 'Nueva York': 'Apple', 'Sydney': 'Conchas', 'Dubái': 'Rascacielos', 'Barcelona': 'Gaudí', 'Berlín': 'Muro', 'Ámsterdam': 'Bicicletas',
      'Machu Picchu': 'Incas', 'Gran Cañón': 'Colorado', 'Torre Eiffel': 'Hierro', 'Estatua Libertad': 'Antorcha', 'Coliseo': 'Gladiadores', 'Muralla China': 'Larga', 'Taj Mahal': 'Mármol', 'Cristo Redentor': 'Brazos', 'Big Ben': 'Reloj', 'Ópera Sydney': 'Velas',
      'Playa': 'Arena', 'Montaña': 'Cima', 'Bosque': 'Árboles', 'Desierto': 'Arena', 'Isla': 'Agua', 'Volcán': 'Lava', 'Río': 'Corriente', 'Cascada': 'Salto', 'Lago': 'Espejo', 'Selva': 'Tropical',
      'Costa Rica': 'Pura Vida', 'México': 'Sombrero', 'Argentina': 'Tango', 'Brasil': 'Carnaval', 'Chile': 'Andes', 'Colombia': 'Café', 'Perú': 'Incas', 'España': 'Flamenco', 'Italia': 'Pizza', 'Francia': 'Baguette',
      'Guanacaste': 'Playas', 'Puntarenas': 'Puerto', 'Limón': 'Caribe', 'Cartago': 'Ruinas', 'San José': 'Capital', 'Arenal': 'Volcán', 'Manuel Antonio': 'Parque', 'Tortuguero': 'Tortugas', 'Monteverde': 'Nubes', 'Jacó': 'Surf'
    },
    comida: {
      'Gallo Pinto': 'Desayuno', 'Casado': 'Completo', 'Olla Carne': 'Caldo', 'Chifrijo': 'Bar', 'Ceviche': 'Limón', 'Tamal': 'Navidad', 'Arroz Leche': 'Postre', 'Tres Leches': 'Dulce', 'Patacones': 'Plátano', 'Chorreadas': 'Maíz',
      'Pizza': 'Queso', 'Hamburguesa': 'Pan', 'Sushi': 'Arroz', 'Tacos': 'Tortilla', 'Pasta': 'Italia', 'Ensalada': 'Verde', 'Helado': 'Frío', 'Paella': 'Azafrán', 'Empanada': 'Rellena', 'Burrito': 'Frijoles',
      'Lasagna': 'Capas', 'Ramen': 'Japón', 'Curry': 'Especias', 'Falafel': 'Garbanzos', 'Hummus': 'Puré', 'Tostadas': 'Crujiente', 'Flan': 'Huevo', 'Brownie': 'Chocolate', 'Waffles': 'Cuadros', 'Crepes': 'Fina',
      'Café': 'Mañana', 'Chocolate': 'Cacao', 'Jugo Natural': 'Fruta', 'Horchata': 'Arroz', 'Refresco': 'Gas', 'Agua': 'Vital', 'Té': 'Infusión', 'Leche': 'Blanca', 'Batido': 'Mezcla', 'Smoothie': 'Saludable'
    },
    objetos: {
      'Teléfono': 'Llamar', 'Computadora': 'Pantalla', 'Tablet': 'Táctil', 'Audífonos': 'Música', 'Cargador': 'Energía', 'Reloj': 'Tiempo', 'Lentes': 'Ver', 'Mochila': 'Escuela', 'Paraguas': 'Lluvia', 'Llaves': 'Abrir',
      'Libro': 'Leer', 'Cuaderno': 'Escribir', 'Lápiz': 'Grafito', 'Bolígrafo': 'Tinta', 'Marcador': 'Resaltar', 'Tijeras': 'Cortar', 'Pegamento': 'Unir', 'Regla': 'Medir', 'Calculadora': 'Números', 'Mochila': 'Espalda',
      'Cama': 'Dormir', 'Mesa': 'Comer', 'Silla': 'Sentar', 'Sofá': 'Descansar', 'Escritorio': 'Trabajar', 'Estante': 'Libros', 'Lámpara': 'Luz', 'Espejo': 'Reflejo', 'Almohada': 'Cabeza', 'Manta': 'Calor',
      'Cuchara': 'Sopa', 'Tenedor': 'Pinchar', 'Cuchillo': 'Cortar', 'Plato': 'Comida', 'Vaso': 'Líquido', 'Taza': 'Café', 'Olla': 'Cocinar', 'Sartén': 'Freír', 'Refrigerador': 'Frío', 'Microondas': 'Calentar',
      'Pelota': 'Jugar', 'Raqueta': 'Golpear', 'Bicicleta': 'Pedales', 'Patines': 'Ruedas', 'Cuerda': 'Saltar', 'Pesas': 'Fuerza', 'Guantes': 'Manos', 'Gorra': 'Cabeza', 'Zapatos': 'Pies', 'Camiseta': 'Algodón'
    },
    animales: {
      'Perro': 'Mejor amigo', 'Gato': 'Ronroneo', 'Pájaro': 'Volar', 'Pez': 'Nadar', 'Conejo': 'Saltar', 'Hamster': 'Rueda', 'Tortuga': 'Lento', 'Iguana': 'Escamas', 'Caballo': 'Galopar', 'Vaca': 'Leche',
      'León': 'Rey', 'Tigre': 'Rayas', 'Elefante': 'Trompa', 'Jirafa': 'Cuello', 'Mono': 'Árboles', 'Cebra': 'Rayas', 'Hipopótamo': 'Río', 'Rinoceronte': 'Cuerno', 'Cocodrilo': 'Dientes', 'Canguro': 'Bolsa',
      'Delfín': 'Inteligente', 'Ballena': 'Grande', 'Tiburón': 'Aleta', 'Pulpo': 'Tentáculos', 'Medusa': 'Picar', 'Estrella Mar': 'Brazos', 'Caballito Mar': 'Cola', 'Tortuga Marina': 'Caparazón', 'Foca': 'Aplaudir', 'Pingüino': 'Hielo',
      'Águila': 'Vista', 'Búho': 'Noche', 'Colibrí': 'Pequeño', 'Guacamaya': 'Colores', 'Tucán': 'Pico', 'Quetzal': 'Plumas', 'Gaviota': 'Mar', 'Pato': 'Nadar', 'Cisne': 'Elegante', 'Flamenco': 'Rosa',
      'Mariposa': 'Alas', 'Abeja': 'Miel', 'Hormiga': 'Trabajadora', 'Araña': 'Telaraña', 'Escarabajo': 'Cascarón', 'Mariquita': 'Puntos', 'Saltamontes': 'Saltar', 'Grillo': 'Cantar', 'Libélula': 'Alas', 'Mosquito': 'Picar'
    },
    cantantes: {
      'Shakira': 'Hips', 'Bad Bunny': 'Reggaetón', 'Karol G': 'Bichota', 'Daddy Yankee': 'Gasolina', 'J Balvin': 'Colores', 'Maluma': 'Hawái', 'Ozuna': 'Sombrero', 'Anuel AA': 'Real', 'Nicky Jam': 'Perdón', 'Wisin Y Yandel': 'Rakata',
      'Taylor Swift': 'Eras', 'Drake': 'Toronto', 'Ariana Grande': 'Pony', 'Ed Sheeran': 'Ginger', 'Billie Eilish': 'Verde', 'The Weeknd': 'After', 'Dua Lipa': 'Future', 'Harry Styles': 'Fruta', 'Bruno Mars': 'Funk', 'Post Malone': 'Tatuajes',
      'Beyoncé': 'Queen', 'Rihanna': 'Umbrella', 'Adele': 'Hello', 'Coldplay': 'Yellow', 'Maroon 5': 'Moves', 'Katy Perry': 'Firework', 'Lady Gaga': 'Poker', 'Justin Bieber': 'Baby', 'Shawn Mendes': 'Señorita', 'Camila Cabello': 'Havana',
      'Ricardo Arjona': 'Historia', 'Juanes': 'A Dios', 'Carlos Vives': 'Colombia', 'Fonseca': 'Bossa', 'Andrés Cepeda': 'Mejor', 'Jesse Joy': 'Espacio', 'Morat': 'Amor', 'Sebastián Yatra': 'Traicionera', 'Maná': 'Labios', 'Café Tacvba': 'Futuro',
      'Selena': 'Bidi', 'Jenni Rivera': 'Divina', 'Ana Gabriel': 'Luna', 'Luis Miguel': 'Romance', 'Chayanne': 'Torero', 'Ricky Martin': 'Livin', 'Enrique Iglesias': 'Bailando', 'Gloria Estefan': 'Conga', 'Marc Anthony': 'Vivir', 'Jennifer Lopez': 'Jenny'
    },
    deportes: {
      'Fútbol': 'Balón', 'Baloncesto': 'Canasta', 'Tenis': 'Raqueta', 'Natación': 'Piscina', 'Ciclismo': 'Bicicleta', 'Atletismo': 'Correr', 'Boxeo': 'Guantes', 'Golf': 'Hoyo', 'Voleibol': 'Red', 'Béisbol': 'Bate',
      'Messi': 'Argentina', 'Cristiano Ronaldo': 'Portugal', 'Neymar': 'Brasil', 'Mbappé': 'Francia', 'Haaland': 'Noruega', 'Lewandowski': 'Polonia', 'Modric': 'Croacia', 'Benzema': 'Francia', 'Salah': 'Egipto', 'De Bruyne': 'Bélgica',
      'LeBron James': 'Lakers', 'Michael Jordan': 'Bulls', 'Kobe Bryant': 'Mamba', 'Stephen Curry': 'Warriors', 'Kevin Durant': 'Nets', 'Giannis': 'Bucks', 'Shaquille ONeal': 'Diesel', 'Magic Johnson': 'Showtime', 'Larry Bird': 'Celtics', 'Tim Duncan': 'Spurs',
      'Rafael Nadal': 'España', 'Roger Federer': 'Suiza', 'Novak Djokovic': 'Serbia', 'Serena Williams': 'USA', 'Naomi Osaka': 'Japón', 'Carlos Alcaraz': 'Joven', 'Andy Murray': 'Reino Unido', 'Maria Sharapova': 'Rusia', 'Iga Swiatek': 'Polonia', 'Daniil Medvedev': 'Rusia',
      'Usain Bolt': 'Jamaica', 'Michael Phelps': 'Natación', 'Simone Biles': 'Gimnasia', 'Katie Ledecky': 'Agua', 'Allyson Felix': 'Velocidad', 'Eliud Kipchoge': 'Maratón', 'Floyd Mayweather': 'Dinero', 'Manny Pacquiao': 'Filipinas', 'Canelo Álvarez': 'México', 'Tyson Fury': 'Peso'
    }
  };
  
  return clues[category]?.[word] || 'Misterio';
}

export default App;