
export enum ItemSymbol {
  Orange = 'ORANGE',
  Bell = 'BELL',
  Apple = 'APPLE',
  Watermelon = 'WATERMELON',
  Seven = 'SEVEN',
  Star = 'STAR',
  Bar = 'BAR',
  Grape = 'GRAPE',
  
  // Special non-bettable symbols
  OnceMore = 'ONCE_MORE',
  JP = 'JP', 
  
  Big = 'BIG', 
  Small = 'SMALL'
}

export interface BoardItem {
  id: number;
  symbol: ItemSymbol;
  label: string;
  baseSymbol: ItemSymbol; 
  multiplier?: number; 
}

export interface BetOption {
  symbol: ItemSymbol;
  payout: number;
  label: string;
}

export enum GameState {
  Idle,
  Spinning,
  Result,
  Gambling,
  Bonus,
}
