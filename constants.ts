
import { ItemSymbol, type BoardItem, type BetOption } from './types';

const BOARD_DATA: { symbol: ItemSymbol; multiplier?: number; label?: string }[] = [
    // Top Row (8 items)
    { symbol: ItemSymbol.Bell, multiplier: 2 },
    { symbol: ItemSymbol.Orange },
    { symbol: ItemSymbol.Bell },
    { symbol: ItemSymbol.Bar, multiplier: 50 },
    { symbol: ItemSymbol.JP },
    { symbol: ItemSymbol.Bar, multiplier: 100 },
    { symbol: ItemSymbol.Apple },
    { symbol: ItemSymbol.Grape },
    
    // Right Column (4 items)
    { symbol: ItemSymbol.Watermelon, multiplier: 2 },
    { symbol: ItemSymbol.Watermelon },
    { symbol: ItemSymbol.OnceMore },
    { symbol: ItemSymbol.Apple },

    // Bottom Row (8 items)
    { symbol: ItemSymbol.Orange, multiplier: 2 },
    { symbol: ItemSymbol.Orange },
    { symbol: ItemSymbol.Bell },
    { symbol: ItemSymbol.Seven, multiplier: 2 },
    { symbol: ItemSymbol.Seven },
    { symbol: ItemSymbol.Apple },
    { symbol: ItemSymbol.Grape, multiplier: 2 },
    { symbol: ItemSymbol.Star },

    // Left Column (4 items)
    { symbol: ItemSymbol.Star, multiplier: 2 },
    { symbol: ItemSymbol.Star },
    { symbol: ItemSymbol.OnceMore },
    { symbol: ItemSymbol.Apple },
];


const SYMBOL_LABELS: Record<ItemSymbol, string> = {
  [ItemSymbol.Orange]: '橘子',
  [ItemSymbol.Bell]: '金鐘',
  [ItemSymbol.Apple]: '蘋果',
  [ItemSymbol.Watermelon]: '西瓜',
  [ItemSymbol.Seven]: '77',
  [ItemSymbol.Star]: '星星',
  [ItemSymbol.Bar]: 'BAR',
  [ItemSymbol.Grape]: '葡萄',
  [ItemSymbol.OnceMore]: 'ONCE MORE',
  [ItemSymbol.JP]: 'JP',
  [ItemSymbol.Big]: 'BIG',
  [ItemSymbol.Small]: 'SMALL',
};

const getBaseSymbol = (symbol: ItemSymbol): ItemSymbol => {
  if (symbol === ItemSymbol.JP) return ItemSymbol.Bar;
  return symbol;
};

export const BOARD_ITEMS: BoardItem[] = BOARD_DATA.map((item, index) => {
    let label = item.label || SYMBOL_LABELS[item.symbol];
    if (item.symbol === ItemSymbol.Bar && item.multiplier) {
        label = `${label} x${item.multiplier}`;
    } else if (item.multiplier && item.symbol !== ItemSymbol.Bar) {
        label = `${SYMBOL_LABELS[item.symbol]} x${item.multiplier}`;
    }

    return {
        id: index,
        symbol: item.symbol,
        label: label,
        baseSymbol: getBaseSymbol(item.symbol),
        multiplier: item.multiplier
    }
});

export const BET_OPTIONS: BetOption[] = [
  { symbol: ItemSymbol.Bar, payout: 100, label: 'BAR BAR BAR' },
  { symbol: ItemSymbol.Seven, payout: 40, label: '77' },
  { symbol: ItemSymbol.Star, payout: 30, label: '星星' },
  { symbol: ItemSymbol.Watermelon, payout: 20, label: '西瓜' },
  { symbol: ItemSymbol.Bell, payout: 20, label: '金鐘' },
  { symbol: ItemSymbol.Grape, payout: 15, label: '葡萄' },
  { symbol: ItemSymbol.Orange, payout: 10, label: '橘子' },
  { symbol: ItemSymbol.Apple, payout: 5, label: '蘋果' },
];
