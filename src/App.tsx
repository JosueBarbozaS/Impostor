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
          playerNames={gameState.playerNames} // ← Agregar esta prop
        />
      )}
    </div>
  );
}

function getWordsForCategories(categories: Category[]): string[] {
  const allWords: string[] = [];
  const wordsByCategory: Record<Category, string[]> = {
    lugares: [
      'París', 'Londres', 'Roma', 'Tokio', 'Nueva York', 'Barcelona', 'Berlín', 'Ámsterdam', 'Miami', 'Los Ángeles',
      'Machu Picchu', 'Gran Cañón', 'Torre Eiffel', 'Estatua Libertad', 'Coliseo', 'Muralla China', 'Taj Mahal', 'Cristo Redentor', 'Pirámides', 'Stonehenge',
      'Playa', 'Montaña', 'Bosque', 'Desierto', 'Isla', 'Volcán', 'Río', 'Cascada', 'Lago', 'Selva', 'Valle', 'Cueva', 'Pantano', 'Cañón', 'Arrecife',
      'Costa Rica', 'México', 'Argentina', 'Brasil', 'Chile', 'Colombia', 'Perú', 'España', 'Italia', 'Francia', 'Canadá', 'Japón', 'China', 'India', 'Australia', 'Alemania', 'Inglaterra', 'Rusia', 'Corea', 'Egipto',
      'Guanacaste', 'Puntarenas', 'Limón', 'Cartago', 'San José', 'Arenal', 'Manuel Antonio', 'Tortuguero', 'Monteverde', 'Jacó'
    ],
    comida: [
      'Gallo Pinto', 'Casado', 'Olla Carne', 'Chifrijo', 'Ceviche', 'Tamal', 'Arroz Leche', 'Tres Leches', 'Patacones', 'Chorreadas', 'Picadillo', 'Arroz Pollo', 'Pozol', 'Sopa Negra', 'Enyucados', 'Prestiños', 'Cajetas', 'Melcochas', 'Churchill', 'Granizado',
      'Pizza', 'Hamburguesa', 'Sushi', 'Tacos', 'Pasta', 'Ensalada', 'Helado', 'Paella', 'Empanada', 'Burrito', 'Hot Dog', 'Sandwich', 'Papas Fritas', 'Pollo Frito', 'Carne Asada', 'Costillas', 'Alitas', 'Nachos', 'Quesadilla', 'Enchiladas',
      'Lasagna', 'Ramen', 'Curry', 'Falafel', 'Hummus', 'Tostadas', 'Flan', 'Brownie', 'Waffles', 'Crepes', 'Panqueques', 'Donas', 'Galletas', 'Pastel', 'Pie', 'Muffins', 'Tiramisú', 'Cheesecake', 'Macarrones', 'Éclair',
      'Café', 'Chocolate', 'Jugo Natural', 'Horchata', 'Refresco', 'Agua', 'Té', 'Leche', 'Batido', 'Smoothie', 'Fresco', 'Agua Dulce', 'Pinolillo', 'Imperial', 'Cerveza', 'Vino', 'Limonada', 'Naranjada', 'Pipas', 'Copo'
    ],
    objetos: [
      'Teléfono', 'Computadora', 'Tablet', 'Audífonos', 'Cargador', 'Reloj', 'Lentes', 'Mochila', 'Paraguas', 'Llaves', 'Billetera', 'Cartera', 'Cinturón', 'Collar', 'Anillo', 'Pulsera', 'Aretes', 'Bufanda', 'Sombrero', 'Camisa',
      'Libro', 'Cuaderno', 'Lápiz', 'Bolígrafo', 'Marcador', 'Tijeras', 'Pegamento', 'Regla', 'Calculadora', 'Sacapuntas', 'Borrador', 'Engrapadora', 'Perforadora', 'Crayones', 'Acuarelas', 'Pincel', 'Compás', 'Cartuchera', 'Folder', 'Resaltador',
      'Cama', 'Mesa', 'Silla', 'Sofá', 'Escritorio', 'Estante', 'Lámpara', 'Espejo', 'Almohada', 'Manta', 'Colchón', 'Closet', 'Cajonera', 'Librero', 'Mecedora', 'Televisor', 'Ventilador', 'Cortinas', 'Alfombra', 'Cuadro',
      'Cuchara', 'Tenedor', 'Cuchillo', 'Plato', 'Vaso', 'Taza', 'Olla', 'Sartén', 'Refrigerador', 'Microondas', 'Licuadora', 'Horno', 'Cafetera', 'Tostadora', 'Batidora', 'Exprimidor', 'Escurridor', 'Tabla Cortar', 'Colador', 'Tetera',
      'Pelota', 'Raqueta', 'Bicicleta', 'Patines', 'Cuerda', 'Pesas', 'Gorra', 'Zapatos', 'Camiseta', 'Shorts', 'Tenis', 'Botas', 'Sandalias', 'Pantuflas', 'Traje Baño', 'Toalla', 'Cepillo', 'Peine', 'Secadora', 'Plancha'
    ],
    animales: [
      'Perro', 'Gato', 'Pájaro', 'Pez', 'Conejo', 'Hamster', 'Tortuga', 'Iguana', 'Caballo', 'Vaca', 'Cerdo', 'Gallina', 'Oveja', 'Cabra', 'Burro', 'Pato', 'Ganso', 'Pavo', 'Loro', 'Canario',
      'León', 'Tigre', 'Elefante', 'Jirafa', 'Mono', 'Cebra', 'Hipopótamo', 'Rinoceronte', 'Cocodrilo', 'Canguro', 'Oso', 'Lobo', 'Zorro', 'Leopardo', 'Pantera', 'Guepardo', 'Gorila', 'Orangután', 'Lémur', 'Koala',
      'Delfín', 'Ballena', 'Tiburón', 'Pulpo', 'Medusa', 'Estrella Mar', 'Caballito Mar', 'Tortuga Marina', 'Foca', 'Pingüino', 'Morsa', 'Mantarraya', 'Langosta', 'Cangrejo', 'Camarón', 'Almeja', 'Coral', 'Atún', 'Salmón', 'Anguila',
      'Águila', 'Búho', 'Colibrí', 'Guacamaya', 'Tucán', 'Quetzal', 'Gaviota', 'Cisne', 'Flamenco', 'Pelícano', 'Halcón', 'Cuervo', 'Pavo Real', 'Avestruz', 'Cigüeña', 'Paloma', 'Gorrión', 'Perezoso', 'Jaguar', 'Puma',
      'Mariposa', 'Abeja', 'Hormiga', 'Araña', 'Escarabajo', 'Mariquita', 'Saltamontes', 'Grillo', 'Libélula', 'Mosquito', 'Mosca', 'Avispa', 'Cucaracha', 'Luciérnaga', 'Caracol', 'Lombriz', 'Rana', 'Sapo', 'Serpiente', 'Lagartija'
    ],
    cantantes: [
      'Shakira', 'Bad Bunny', 'Karol G', 'Daddy Yankee', 'J Balvin', 'Maluma', 'Ozuna', 'Anuel AA', 'Nicky Jam', 'Wisin Y Yandel', 'Rauw Alejandro', 'Myke Towers', 'Jhay Cortez', 'Sech', 'Farruko',
      'Taylor Swift', 'Drake', 'Ariana Grande', 'Ed Sheeran', 'Billie Eilish', 'The Weeknd', 'Dua Lipa', 'Harry Styles', 'Bruno Mars', 'Post Malone', 'Travis Scott', 'Eminem', 'Kanye West', 'Kendrick Lamar', 'SZA',
      'Beyoncé', 'Rihanna', 'Adele', 'Coldplay', 'Maroon 5', 'Katy Perry', 'Lady Gaga', 'Justin Bieber', 'Shawn Mendes', 'Camila Cabello', 'Miley Cyrus', 'Selena Gomez', 'Demi Lovato', 'The Chainsmokers', 'Marshmello',
      'Ricardo Arjona', 'Juanes', 'Carlos Vives', 'Fonseca', 'Andrés Cepeda', 'Jesse Joy', 'Morat', 'Sebastián Yatra', 'Maná', 'Café Tacvba', 'Reik', 'Sin Bandera', 'Camilo', 'Manuel Turizo', 'Grupo Frontera',
      'Selena', 'Jenni Rivera', 'Ana Gabriel', 'Luis Miguel', 'Chayanne', 'Ricky Martin', 'Enrique Iglesias', 'Gloria Estefan', 'Marc Anthony', 'Jennifer Lopez', 'Romeo Santos', 'Prince Royce', 'Aventura', 'Don Omar', 'Tego Calderón'
    ],
    deportes: [
      'Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Ciclismo', 'Atletismo', 'Boxeo', 'Golf', 'Voleibol', 'Béisbol', 'Surf', 'Skate', 'Rugby', 'Hockey', 'Karate', 'Taekwondo', 'Judo', 'Esgrima', 'Gimnasia', 'Polo',
      'Messi', 'Cristiano Ronaldo', 'Neymar', 'Mbappé', 'Haaland', 'Lewandowski', 'Modric', 'Benzema', 'Salah', 'De Bruyne', 'Vinicius Jr', 'Pedri', 'Gavi', 'Bellingham', 'Kane',
      'LeBron James', 'Michael Jordan', 'Kobe Bryant', 'Stephen Curry', 'Kevin Durant', 'Giannis', 'Shaquille ONeal', 'Magic Johnson', 'Larry Bird', 'Tim Duncan', 'Luka Doncic', 'Ja Morant', 'Jayson Tatum', 'Damian Lillard', 'Anthony Davis',
      'Rafael Nadal', 'Roger Federer', 'Novak Djokovic', 'Serena Williams', 'Naomi Osaka', 'Carlos Alcaraz', 'Andy Murray', 'Maria Sharapova', 'Iga Swiatek', 'Daniil Medvedev', 'Venus Williams', 'Simona Halep', 'Stefanos Tsitsipas', 'Alexander Zverev', 'Casper Ruud',
      'Usain Bolt', 'Michael Phelps', 'Simone Biles', 'Katie Ledecky', 'Allyson Felix', 'Eliud Kipchoge', 'Floyd Mayweather', 'Manny Pacquiao', 'Canelo Álvarez', 'Tyson Fury', 'Muhammad Ali', 'Mike Tyson', 'Serena Williams', 'Nadia Comaneci', 'Carl Lewis'
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
      'París', 'Londres', 'Roma', 'Tokio', 'Nueva York', 'Barcelona', 'Berlín', 'Ámsterdam', 'Miami', 'Los Ángeles',
      'Machu Picchu', 'Gran Cañón', 'Torre Eiffel', 'Estatua Libertad', 'Coliseo', 'Muralla China', 'Taj Mahal', 'Cristo Redentor', 'Pirámides', 'Stonehenge',
      'Playa', 'Montaña', 'Bosque', 'Desierto', 'Isla', 'Volcán', 'Río', 'Cascada', 'Lago', 'Selva', 'Valle', 'Cueva', 'Pantano', 'Cañón', 'Arrecife',
      'Costa Rica', 'México', 'Argentina', 'Brasil', 'Chile', 'Colombia', 'Perú', 'España', 'Italia', 'Francia', 'Canadá', 'Japón', 'China', 'India', 'Australia', 'Alemania', 'Inglaterra', 'Rusia', 'Corea', 'Egipto',
      'Guanacaste', 'Puntarenas', 'Limón', 'Cartago', 'San José', 'Arenal', 'Manuel Antonio', 'Tortuguero', 'Monteverde', 'Jacó'
    ],
    comida: [
      'Gallo Pinto', 'Casado', 'Olla Carne', 'Chifrijo', 'Ceviche', 'Tamal', 'Arroz Leche', 'Tres Leches', 'Patacones', 'Chorreadas', 'Picadillo', 'Arroz Pollo', 'Pozol', 'Sopa Negra', 'Enyucados', 'Prestiños', 'Cajetas', 'Melcochas', 'Churchill', 'Granizado',
      'Pizza', 'Hamburguesa', 'Sushi', 'Tacos', 'Pasta', 'Ensalada', 'Helado', 'Paella', 'Empanada', 'Burrito', 'Hot Dog', 'Sandwich', 'Papas Fritas', 'Pollo Frito', 'Carne Asada', 'Costillas', 'Alitas', 'Nachos', 'Quesadilla', 'Enchiladas',
      'Lasagna', 'Ramen', 'Curry', 'Falafel', 'Hummus', 'Tostadas', 'Flan', 'Brownie', 'Waffles', 'Crepes', 'Panqueques', 'Donas', 'Galletas', 'Pastel', 'Pie', 'Muffins', 'Tiramisú', 'Cheesecake', 'Macarrones', 'Éclair',
      'Café', 'Chocolate', 'Jugo Natural', 'Horchata', 'Refresco', 'Agua', 'Té', 'Leche', 'Batido', 'Smoothie', 'Fresco', 'Agua Dulce', 'Pinolillo', 'Imperial', 'Cerveza', 'Vino', 'Limonada', 'Naranjada', 'Pipas', 'Copo'
    ],
    objetos: [
      'Teléfono', 'Computadora', 'Tablet', 'Audífonos', 'Cargador', 'Reloj', 'Lentes', 'Mochila', 'Paraguas', 'Llaves', 'Billetera', 'Cartera', 'Cinturón', 'Collar', 'Anillo', 'Pulsera', 'Aretes', 'Bufanda', 'Sombrero', 'Camisa',
      'Libro', 'Cuaderno', 'Lápiz', 'Bolígrafo', 'Marcador', 'Tijeras', 'Pegamento', 'Regla', 'Calculadora', 'Sacapuntas', 'Borrador', 'Engrapadora', 'Perforadora', 'Crayones', 'Acuarelas', 'Pincel', 'Compás', 'Cartuchera', 'Folder', 'Resaltador',
      'Cama', 'Mesa', 'Silla', 'Sofá', 'Escritorio', 'Estante', 'Lámpara', 'Espejo', 'Almohada', 'Manta', 'Colchón', 'Closet', 'Cajonera', 'Librero', 'Mecedora', 'Televisor', 'Ventilador', 'Cortinas', 'Alfombra', 'Cuadro',
      'Cuchara', 'Tenedor', 'Cuchillo', 'Plato', 'Vaso', 'Taza', 'Olla', 'Sartén', 'Refrigerador', 'Microondas', 'Licuadora', 'Horno', 'Cafetera', 'Tostadora', 'Batidora', 'Exprimidor', 'Escurridor', 'Tabla Cortar', 'Colador', 'Tetera',
      'Pelota', 'Raqueta', 'Bicicleta', 'Patines', 'Cuerda', 'Pesas', 'Gorra', 'Zapatos', 'Camiseta', 'Shorts', 'Tenis', 'Botas', 'Sandalias', 'Pantuflas', 'Traje Baño', 'Toalla', 'Cepillo', 'Peine', 'Secadora', 'Plancha'
    ],
    animales: [
      'Perro', 'Gato', 'Pájaro', 'Pez', 'Conejo', 'Hamster', 'Tortuga', 'Iguana', 'Caballo', 'Vaca', 'Cerdo', 'Gallina', 'Oveja', 'Cabra', 'Burro', 'Pato', 'Ganso', 'Pavo', 'Loro', 'Canario',
      'León', 'Tigre', 'Elefante', 'Jirafa', 'Mono', 'Cebra', 'Hipopótamo', 'Rinoceronte', 'Cocodrilo', 'Canguro', 'Oso', 'Lobo', 'Zorro', 'Leopardo', 'Pantera', 'Guepardo', 'Gorila', 'Orangután', 'Lémur', 'Koala',
      'Delfín', 'Ballena', 'Tiburón', 'Pulpo', 'Medusa', 'Estrella Mar', 'Caballito Mar', 'Tortuga Marina', 'Foca', 'Pingüino', 'Morsa', 'Mantarraya', 'Langosta', 'Cangrejo', 'Camarón', 'Almeja', 'Coral', 'Atún', 'Salmón', 'Anguila',
      'Águila', 'Búho', 'Colibrí', 'Guacamaya', 'Tucán', 'Quetzal', 'Gaviota', 'Cisne', 'Flamenco', 'Pelícano', 'Halcón', 'Cuervo', 'Pavo Real', 'Avestruz', 'Cigüeña', 'Paloma', 'Gorrión', 'Perezoso', 'Jaguar', 'Puma',
      'Mariposa', 'Abeja', 'Hormiga', 'Araña', 'Escarabajo', 'Mariquita', 'Saltamontes', 'Grillo', 'Libélula', 'Mosquito', 'Mosca', 'Avispa', 'Cucaracha', 'Luciérnaga', 'Caracol', 'Lombriz', 'Rana', 'Sapo', 'Serpiente', 'Lagartija'
    ],
    cantantes: [
      'Shakira', 'Bad Bunny', 'Karol G', 'Daddy Yankee', 'J Balvin', 'Maluma', 'Ozuna', 'Anuel AA', 'Nicky Jam', 'Wisin Y Yandel', 'Rauw Alejandro', 'Myke Towers', 'Jhay Cortez', 'Sech', 'Farruko',
      'Taylor Swift', 'Drake', 'Ariana Grande', 'Ed Sheeran', 'Billie Eilish', 'The Weeknd', 'Dua Lipa', 'Harry Styles', 'Bruno Mars', 'Post Malone', 'Travis Scott', 'Eminem', 'Kanye West', 'Kendrick Lamar', 'SZA',
      'Beyoncé', 'Rihanna', 'Adele', 'Coldplay', 'Maroon 5', 'Katy Perry', 'Lady Gaga', 'Justin Bieber', 'Shawn Mendes', 'Camila Cabello', 'Miley Cyrus', 'Selena Gomez', 'Demi Lovato', 'The Chainsmokers', 'Marshmello',
      'Ricardo Arjona', 'Juanes', 'Carlos Vives', 'Fonseca', 'Andrés Cepeda', 'Jesse Joy', 'Morat', 'Sebastián Yatra', 'Maná', 'Café Tacvba', 'Reik', 'Sin Bandera', 'Camilo', 'Manuel Turizo', 'Grupo Frontera',
      'Selena', 'Jenni Rivera', 'Ana Gabriel', 'Luis Miguel', 'Chayanne', 'Ricky Martin', 'Enrique Iglesias', 'Gloria Estefan', 'Marc Anthony', 'Jennifer Lopez', 'Romeo Santos', 'Prince Royce', 'Aventura', 'Don Omar', 'Tego Calderón'
    ],
    deportes: [
      'Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Ciclismo', 'Atletismo', 'Boxeo', 'Golf', 'Voleibol', 'Béisbol', 'Surf', 'Skate', 'Rugby', 'Hockey', 'Karate', 'Taekwondo', 'Judo', 'Esgrima', 'Gimnasia', 'Polo',
      'Messi', 'Cristiano Ronaldo', 'Neymar', 'Mbappé', 'Haaland', 'Lewandowski', 'Modric', 'Benzema', 'Salah', 'De Bruyne', 'Vinicius Jr', 'Pedri', 'Gavi', 'Bellingham', 'Kane',
      'LeBron James', 'Michael Jordan', 'Kobe Bryant', 'Stephen Curry', 'Kevin Durant', 'Giannis', 'Shaquille ONeal', 'Magic Johnson', 'Larry Bird', 'Tim Duncan', 'Luka Doncic', 'Ja Morant', 'Jayson Tatum', 'Damian Lillard', 'Anthony Davis',
      'Rafael Nadal', 'Roger Federer', 'Novak Djokovic', 'Serena Williams', 'Naomi Osaka', 'Carlos Alcaraz', 'Andy Murray', 'Maria Sharapova', 'Iga Swiatek', 'Daniil Medvedev', 'Venus Williams', 'Simona Halep', 'Stefanos Tsitsipas', 'Alexander Zverev', 'Casper Ruud',
      'Usain Bolt', 'Michael Phelps', 'Simone Biles', 'Katie Ledecky', 'Allyson Felix', 'Eliud Kipchoge', 'Floyd Mayweather', 'Manny Pacquiao', 'Canelo Álvarez', 'Tyson Fury', 'Muhammad Ali', 'Mike Tyson', 'Serena Williams', 'Nadia Comaneci', 'Carl Lewis'
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
      'París': 'Romance', 'Londres': 'Niebla', 'Roma': 'Eterno', 'Tokio': 'Futuro', 'Nueva York': 'Vertical', 
      'Barcelona': 'Gaudí', 'Berlín': 'Muro', 'Ámsterdam': 'Canales', 'Miami': 'Sol', 'Los Ángeles': 'Sueños',
      'Machu Picchu': 'Incas', 'Gran Cañón': 'Abismo', 'Torre Eiffel': 'Hierro', 'Estatua Libertad': 'Antorcha', 
      'Coliseo': 'Gladiadores', 'Muralla China': 'Dragón', 'Taj Mahal': 'Amor', 'Cristo Redentor': 'Abrazo', 
      'Pirámides': 'Eternidad', 'Stonehenge': 'Misterio',
      'Playa': 'Arena', 'Montaña': 'Altura', 'Bosque': 'Verde', 'Desierto': 'Calor', 'Isla': 'Aislamiento', 
      'Volcán': 'Fuego', 'Río': 'Fluir', 'Cascada': 'Caída', 'Lago': 'Calma', 'Selva': 'Vida',
      'Costa Rica': 'Puravida', 'México': 'Azteca', 'Argentina': 'Tango', 'Brasil': 'Carnaval', 'Chile': 'Largo', 
      'Colombia': 'Café', 'Perú': 'Incas', 'España': 'Fiesta', 'Italia': 'Dolce', 'Francia': 'Elegancia',
      'Guanacaste': 'Playas', 'Puntarenas': 'Puerto', 'Limón': 'Caribe', 'Cartago': 'Ruinas', 'San José': 'Capital', 
      'Arenal': 'Volcán', 'Manuel Antonio': 'Parque', 'Tortuguero': 'Tortugas', 'Monteverde': 'Nubes', 'Jacó': 'Surf'
    },
    comida: {
      'Gallo Pinto': 'Mañana', 'Casado': 'Completo', 'Olla Carne': 'Caldo', 'Chifrijo': 'Bar', 'Ceviche': 'Limón', 
      'Tamal': 'Navidad', 'Arroz Leche': 'Postre', 'Tres Leches': 'Húmedo', 'Patacones': 'Plátano', 'Chorreadas': 'Maíz',
      'Pizza': 'Italia', 'Hamburguesa': 'Rápida', 'Sushi': 'Japón', 'Tacos': 'México', 'Pasta': 'Italiana', 
      'Ensalada': 'Verde', 'Helado': 'Frío', 'Paella': 'España', 'Empanada': 'Rellena', 'Burrito': 'Enrollado',
      'Lasagna': 'Capas', 'Ramen': 'Sopa', 'Curry': 'Especias', 'Falafel': 'Garbanzo', 'Hummus': 'Pasta', 
      'Tostadas': 'Crujiente', 'Flan': 'Caramelo', 'Brownie': 'Chocolate', 'Waffles': 'Cuadros', 'Crepes': 'Fina',
      'Café': 'Mañana', 'Chocolate': 'Cacao', 'Jugo Natural': 'Fruta', 'Horchata': 'Arroz', 'Refresco': 'Gas', 
      'Agua': 'Vital', 'Té': 'Infusión', 'Leche': 'Blanca', 'Batido': 'Mezcla', 'Smoothie': 'Saludable'
    },
    objetos: {
      'Teléfono': 'Voz', 'Computadora': 'Código', 'Tablet': 'Toque', 'Audífonos': 'Privado', 'Cargador': 'Vida', 
      'Reloj': 'Circulo', 'Lentes': 'Enfoque', 'Mochila': 'Viaje', 'Paraguas': 'Protección', 'Llaves': 'Acceso',
      'Libro': 'Mundos', 'Cuaderno': 'Secretos', 'Lápiz': 'Trazo', 'Bolígrafo': 'Fluir', 'Marcador': 'Resalte', 
      'Tijeras': 'Separar', 'Pegamento': 'Unión', 'Regla': 'Línea', 'Calculadora': 'Lógica', 'Sacapuntas': 'Agudeza',
      'Cama': 'Sueños', 'Mesa': 'Encuentro', 'Silla': 'Pausa', 'Sofá': 'Comodidad', 'Escritorio': 'Creación', 
      'Estante': 'Orden', 'Lámpara': 'Iluminación', 'Espejo': 'Verdad', 'Almohada': 'Nube', 'Manta': 'Abrazo',
      'Cuchara': 'Cóncavo', 'Tenedor': 'Púas', 'Cuchillo': 'Filo', 'Plato': 'Circular', 'Vaso': 'Cilíndrico', 
      'Taza': 'Asa', 'Olla': 'Hondo', 'Sartén': 'Plano', 'Refrigerador': 'Frío', 'Microondas': 'Rápido',
      'Pelota': 'Esfera', 'Raqueta': 'Golpe', 'Bicicleta': 'Ruedas', 'Patines': 'Deslizar', 'Cuerda': 'Salto', 
      'Pesas': 'Fuerza', 'Gorra': 'Visera', 'Zapatos': 'Pies', 'Camiseta': 'Algodón', 'Shorts': 'Corto'
    },
    animales: {
      'Perro': 'Lealtad', 'Gato': 'Independencia', 'Pájaro': 'Volar', 'Pez': 'Nadar', 'Conejo': 'Saltar', 
      'Hamster': 'Rueda', 'Tortuga': 'Lento', 'Iguana': 'Escamas', 'Caballo': 'Veloz', 'Vaca': 'Leche',
      'León': 'Rey', 'Tigre': 'Rayas', 'Elefante': 'Grande', 'Jirafa': 'Alto', 'Mono': 'Árbol', 'Cebra': 'Blanco', 
      'Hipopótamo': 'Agua', 'Rinoceronte': 'Cuerno', 'Cocodrilo': 'Dientes', 'Canguro': 'Salto',
      'Delfín': 'Inteligente', 'Ballena': 'Gigante', 'Tiburón': 'Aleta', 'Pulpo': 'Tentáculos', 'Medusa': 'Transparente', 
      'Estrella Mar': 'Cinco', 'Caballito Mar': 'Cola', 'Tortuga Marina': 'Mar', 'Foca': 'Aplauso', 'Pingüino': 'Hielo',
      'Águila': 'Vuelo', 'Búho': 'Noche', 'Colibrí': 'Pequeño', 'Guacamaya': 'Colores', 'Tucán': 'Pico', 
      'Quetzal': 'Plumas', 'Gaviota': 'Mar', 'Cisne': 'Elegante', 'Flamenco': 'Rosa', 'Pelícano': 'Bolsas',
      'Mariposa': 'Alas', 'Abeja': 'Miel', 'Hormiga': 'Trabajo', 'Araña': 'Telaraña', 'Escarabajo': 'Cascarón', 
      'Mariquita': 'Puntos', 'Saltamontes': 'Verde', 'Grillo': 'Canto', 'Libélula': 'Alas', 'Mosquito': 'Picar'
    },
    cantantes: {
      'Shakira': 'Caderas', 'Bad Bunny': 'Conejo', 'Karol G': 'Bichota', 'Daddy Yankee': 'Gasolina', 'J Balvin': 'Colores', 
      'Maluma': 'Hawái', 'Ozuna': 'Sombrero', 'Anuel AA': 'Real', 'Nicky Jam': 'Perdón', 'Wisin Y Yandel': 'Rakata',
      'Taylor Swift': 'Eras', 'Drake': 'Toronto', 'Ariana Grande': 'Pony', 'Ed Sheeran': 'Ginger', 'Billie Eilish': 'Verde', 
      'The Weeknd': 'After', 'Dua Lipa': 'Future', 'Harry Styles': 'Fruta', 'Bruno Mars': 'Funk', 'Post Malone': 'Tatuajes',
      'Beyoncé': 'Reina', 'Rihanna': 'Umbrella', 'Adele': 'Hello', 'Coldplay': 'Yellow', 'Maroon 5': 'Moves', 
      'Katy Perry': 'Firework', 'Lady Gaga': 'Poker', 'Justin Bieber': 'Baby', 'Shawn Mendes': 'Señorita', 'Camila Cabello': 'Havana',
      'Ricardo Arjona': 'Poeta', 'Juanes': 'Rock', 'Carlos Vives': 'Vallenato', 'Fonseca': 'Romántico', 'Andrés Cepeda': 'Suave', 
      'Jesse Joy': 'Hermanos', 'Morat': 'Banda', 'Sebastián Yatra': 'Joven', 'Maná': 'Español', 'Café Tacvba': 'Experimental',
      'Selena': 'Tejano', 'Jenni Rivera': 'Diva', 'Ana Gabriel': 'Potente', 'Luis Miguel': 'Sol', 'Chayanne': 'Guapo', 
      'Ricky Martin': 'Movimiento', 'Enrique Iglesias': 'Héroe', 'Gloria Estefan': 'Ritmo', 'Marc Anthony': 'Salsa', 'Jennifer Lopez': 'Triple'
    },
    deportes: {
      'Fútbol': 'Balón', 'Baloncesto': 'Canasta', 'Tenis': 'Raqueta', 'Natación': 'Agua', 'Ciclismo': 'Bici', 
      'Atletismo': 'Correr', 'Boxeo': 'Guantes', 'Golf': 'Hoyo', 'Voleibol': 'Red', 'Béisbol': 'Bate',
      'Rugby': 'Oval', 'Hockey': 'Palo', 'Surf': 'Ola', 'Skate': 'Tabla', 'Karate': 'Arte', 'Judo': 'Caída', 
      'Esgrima': 'Espada', 'Gimnasia': 'Flexibilidad', 'Polo': 'Caballo', 'Taekwondo': 'Patada',
      'Messi': 'Argentina', 'Cristiano Ronaldo': 'Portugal', 'Neymar': 'Brasil', 'Mbappé': 'Francia', 'Haaland': 'Noruega', 
      'Lewandowski': 'Polonia', 'Modric': 'Croacia', 'Benzema': 'Francia', 'Salah': 'Egipto', 'De Bruyne': 'Bélgica',
      'LeBron James': 'Lakers', 'Michael Jordan': 'Bulls', 'Kobe Bryant': 'Mamba', 'Stephen Curry': 'Warriors', 'Kevin Durant': 'Nets', 
      'Giannis': 'Bucks', 'Shaquille ONeal': 'Diesel', 'Magic Johnson': 'Showtime', 'Larry Bird': 'Celtics', 'Tim Duncan': 'Spurs',
      'Rafael Nadal': 'España', 'Roger Federer': 'Suiza', 'Novak Djokovic': 'Serbia', 'Serena Williams': 'USA', 'Naomi Osaka': 'Japón', 
      'Carlos Alcaraz': 'Joven', 'Andy Murray': 'Reino Unido', 'Maria Sharapova': 'Rusia', 'Iga Swiatek': 'Polonia', 'Daniil Medvedev': 'Rusia',
      'Usain Bolt': 'Jamaica', 'Michael Phelps': 'Natación', 'Simone Biles': 'Gimnasia', 'Katie Ledecky': 'Agua', 'Allyson Felix': 'Velocidad', 
      'Eliud Kipchoge': 'Maratón', 'Floyd Mayweather': 'Dinero', 'Manny Pacquiao': 'Filipinas', 'Canelo Álvarez': 'México', 'Tyson Fury': 'Gigante'
    }
  };
  
  return clues[category]?.[word] || 'Misterio';
}


export default App;
