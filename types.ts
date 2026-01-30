
export type Direction = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

export interface GameItem {
  id: string;
  name: string;
  description: string;
  canTake: boolean;
  defaultUseMessage?: string;
  isHidden?: boolean;
}

export interface RoomEvent {
  trigger: 'onEnter' | 'onUseItem' | 'onPickUp';
  triggerId?: string; // e.g. which item ID triggers it
  conditionFlag?: string; // e.g. "!flagName" for false, "flagName" for true
  conditionItem?: string; // e.g. "glowing_stone" to require item in inventory
  action: 'unlock' | 'message' | 'setFlag' | 'removeItem' | 'addItem';
  params: Record<string, any>;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  exits: Partial<Record<Direction, string>>;
  items: string[]; // Array of item IDs
  events?: RoomEvent[];
}

export interface GameWorld {
  startRoom: string;
  rooms: Record<string, Room>;
  items: Record<string, GameItem>;
}

export interface GameState {
  currentRoomId: string;
  inventory: string[];
  flags: Record<string, boolean>;
  logs: Array<{
    type: 'system' | 'narrative' | 'event';
    text: string;
    timestamp: number;
  }>;
}
