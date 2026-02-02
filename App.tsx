
import React, { useState, useEffect, useRef } from 'react';
import { INITIAL_WORLD } from './gameConfig.ts';
import { Direction, GameState, Room, RoomEvent } from './types.ts';

// Component: Compass Button
const NavButton: React.FC<{
  dir: Direction | 'center';
  label: string;
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
}> = ({ dir, label, onClick, disabled, isActive }) => {
  const baseClasses = "flex items-center justify-center p-2 sm:p-3 rounded-lg font-bold transition-all shadow-lg active:scale-95 text-xs sm:text-sm";
  const activeClasses = isActive 
    ? "bg-indigo-600 text-white hover:bg-indigo-500" 
    : "bg-slate-800 text-slate-400 hover:bg-slate-700 opacity-50 cursor-not-allowed";
  
  const centerClasses = "bg-emerald-600 text-white hover:bg-emerald-500";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${dir === 'center' ? centerClasses : activeClasses}`}
    >
      {label}
    </button>
  );
};

export default function App() {
  const [world, setWorld] = useState(INITIAL_WORLD);
  const [state, setState] = useState<GameState>({
    currentRoomId: INITIAL_WORLD.startRoom,
    inventory: [],
    flags: {},
    logs: [{ 
      type: 'narrative', 
      text: INITIAL_WORLD.rooms[INITIAL_WORLD.startRoom].description, 
      timestamp: Date.now() 
    }]
  });
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const currentRoom = world.rooms[state.currentRoomId];

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.logs]);

  const addLog = (text: string, type: 'system' | 'narrative' | 'event' = 'system') => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, { text, type, timestamp: Date.now() }]
    }));
  };

  const isEventConditionsMet = (e: RoomEvent) => {
    if (e.conditionFlag) {
      const isNegated = e.conditionFlag.startsWith('!');
      const flagName = isNegated ? e.conditionFlag.slice(1) : e.conditionFlag;
      const flagValue = !!state.flags[flagName];
      if (isNegated && flagValue) return false;
      if (!isNegated && !flagValue) return false;
    }
    if (e.conditionItem) {
      if (!state.inventory.includes(e.conditionItem)) return false;
    }
    return true;
  };

  const move = (dir: Direction) => {
    const nextRoomId = currentRoom.exits[dir];
    if (nextRoomId && world.rooms[nextRoomId]) {
      const nextRoom = world.rooms[nextRoomId];
      
      const eventLogs: Array<{ type: 'event' | 'system' | 'narrative', text: string, timestamp: number }> = [];
      const newFlags = { ...state.flags };
      
      const onEnterEvents = nextRoom.events?.filter(e => {
        if (e.trigger !== 'onEnter') return false;
        return isEventConditionsMet(e);
      });

      if (onEnterEvents) {
        onEnterEvents.forEach(event => {
          if (event.action === 'message' && event.params.message) {
            eventLogs.push({ type: 'event', text: event.params.message, timestamp: Date.now() });
          }
          if (event.params.setFlag) {
            newFlags[event.params.setFlag] = true;
          }
          if (event.action === 'setFlag') {
            newFlags[event.params.flag] = true;
          }
        });
      }

      setState(prev => ({
        ...prev,
        currentRoomId: nextRoomId,
        flags: newFlags,
        logs: [
          ...prev.logs,
          { type: 'system', text: `\n[Moving ${dir.toUpperCase()}]`, timestamp: Date.now() },
          ...eventLogs,
          { type: 'narrative', text: nextRoom.description, timestamp: Date.now() }
        ]
      }));
    }
  };

  const lookAround = () => {
    addLog(currentRoom.description, 'narrative');
  };

  const pickUpItem = (itemId: string) => {
    const item = world.items[itemId];
    if (!item) return;

    setWorld(prev => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [state.currentRoomId]: {
          ...prev.rooms[state.currentRoomId],
          items: prev.rooms[state.currentRoomId].items.filter(id => id !== itemId)
        }
      }
    }));

    setState(prev => ({
      ...prev,
      inventory: [...prev.inventory, itemId]
    }));

    addLog(`You picked up: ${item.name}`, 'system');
    checkEvents('onPickUp', itemId);
  };

  const useItem = (itemId: string) => {
    const item = world.items[itemId];
    if (!item) return;
    addLog(`You use the ${item.name}...`, 'system');
    const eventTriggered = checkEvents('onUseItem', itemId);
    
    if (!eventTriggered) {
      if (item.defaultUseMessage) {
        addLog(item.defaultUseMessage, 'system');
      } else {
        addLog("Nothing happens.", "system");
      }
    }
    
    setSelectedItemId(null);
  };

  const dropItem = (itemId: string) => {
    const item = world.items[itemId];
    if (!item) return;

    setState(prev => ({
      ...prev,
      inventory: prev.inventory.filter(id => id !== itemId)
    }));

    setWorld(prev => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [state.currentRoomId]: {
          ...prev.rooms[state.currentRoomId],
          items: [...prev.rooms[state.currentRoomId].items, itemId]
        }
      }
    }));

    addLog(`You dropped the ${item.name}.`, 'system');
    setSelectedItemId(null);
  };

  const inspectItem = (itemId: string) => {
    const item = world.items[itemId];
    if (!item) return;
    addLog(`${item.name}: ${item.description}`, 'system');
    setSelectedItemId(null);
  };

  const checkEvents = (trigger: 'onEnter' | 'onUseItem' | 'onPickUp', triggerId?: string, targetRoomOverride?: Room) => {
    const targetRoom = targetRoomOverride || currentRoom;
    const events = targetRoom.events?.filter(e => {
      if (e.trigger !== trigger) return false;
      if (e.triggerId && e.triggerId !== triggerId) return false;
      return isEventConditionsMet(e);
    });
    
    if (!events || events.length === 0) {
      return false;
    }

    events.forEach(event => {
      switch (event.action) {
        case 'unlock':
          setWorld(prev => {
            const newRooms = { ...prev.rooms };
            newRooms[state.currentRoomId].exits[event.params.direction] = event.params.targetRoom;
            return { ...prev, rooms: newRooms };
          });
          break;
        case 'updateExit':
          setWorld(prev => {
            const newRooms = { ...prev.rooms };
            const rId = event.params.roomId;
            if (newRooms[rId]) {
               newRooms[rId].exits[event.params.direction] = event.params.targetRoomId;
            }
            return { ...prev, rooms: newRooms };
          });
          break;
        case 'moveRoomItems':
          setWorld(prev => {
            const newRooms = { ...prev.rooms };
            const sourceId = event.params.sourceRoomId;
            const targetId = event.params.targetRoomId;
            if (newRooms[sourceId] && newRooms[targetId]) {
              const itemsToMove = newRooms[sourceId].items;
              newRooms[targetId].items = [...newRooms[targetId].items, ...itemsToMove];
              newRooms[sourceId].items = [];
            }
            return { ...prev, rooms: newRooms };
          });
          break;
        case 'teleport':
          const tId = event.params.targetRoomId;
          if (world.rooms[tId]) {
            setState(prev => ({
              ...prev,
              currentRoomId: tId,
              logs: [
                ...prev.logs,
                { type: 'narrative', text: world.rooms[tId].description, timestamp: Date.now() }
              ]
            }));
          }
          break;
        case 'addItem':
          setWorld(prev => ({
            ...prev,
            rooms: {
              ...prev.rooms,
              [state.currentRoomId]: {
                ...prev.rooms[state.currentRoomId],
                items: [...prev.rooms[state.currentRoomId].items, event.params.itemId]
              }
            }
          }));
          break;
        case 'setFlag':
          setState(prev => ({ ...prev, flags: { ...prev.flags, [event.params.flag]: true } }));
          break;
      }

      if (event.params.message) {
        addLog(event.params.message, 'event');
      }

      if (event.params.setFlag) {
        setState(prev => ({
          ...prev,
          flags: { ...prev.flags, [event.params.setFlag]: true }
        }));
      }
    });

    return true;
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-slate-900 overflow-hidden border-x border-slate-700 relative">
      <header className="flex-shrink-0 p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center shadow-md z-10 gap-3">
        <div className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg shadow-inner flex-shrink-0">
          <h1 className="text-xs sm:text-sm font-black text-indigo-500 tracking-tighter uppercase italic">Gemini Quest</h1>
        </div>
        <div className="flex-1 flex justify-end overflow-hidden">
          <div className="px-3 sm:px-4 py-1.5 bg-indigo-600/10 border border-indigo-500/40 rounded-xl shadow-lg truncate">
            <h2 className="text-base sm:text-xl font-bold text-white tracking-wide text-right truncate">{currentRoom.name}</h2>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gradient-to-b from-slate-900 to-slate-950">
        {state.logs.map((log, i) => (
          <div 
            key={i} 
            className={`
              p-3 rounded-lg animate-in fade-in duration-500
              ${log.type === 'narrative' ? 'text-slate-200 text-lg leading-relaxed' : ''}
              ${log.type === 'system' ? 'text-indigo-400 text-sm italic font-mono bg-indigo-900/10 border-l-2 border-indigo-500' : ''}
              ${log.type === 'event' ? 'text-emerald-400 font-bold bg-emerald-900/10 border-l-2 border-emerald-500 p-4' : ''}
            `}
          >
            {log.text.split('\n').map((line, j) => (
                <p key={j} className={j > 0 ? "mt-2" : ""}>{line}</p>
            ))}
          </div>
        ))}
        <div ref={logEndRef} />
      </main>

      {selectedItemId && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-800 border border-slate-600 rounded-xl w-full p-4 space-y-4 shadow-2xl">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-indigo-300">{world.items[selectedItemId]?.name}</h2>
                    <p className="text-sm text-slate-400 mt-1 italic">What will you do?</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                    <button 
                        onClick={() => useItem(selectedItemId)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        Use Item
                    </button>
                    <button 
                        onClick={() => inspectItem(selectedItemId)}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 rounded-lg transition-colors"
                    >
                        Inspect
                    </button>
                    <button 
                        onClick={() => dropItem(selectedItemId)}
                        className="bg-red-900/40 hover:bg-red-900/60 text-red-200 font-bold py-3 rounded-lg border border-red-900/50 transition-colors"
                    >
                        Drop
                    </button>
                </div>
                <button 
                    onClick={() => setSelectedItemId(null)}
                    className="w-full text-slate-500 text-sm font-medium py-2 hover:text-slate-300 transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
      )}

      <section className="flex-shrink-0 bg-slate-800 border-t border-slate-700 p-4 space-y-4 shadow-2xl pb-safe">
        <div className="flex flex-wrap gap-2">
          {(currentRoom.items?.length || 0) > 0 && (
            <div className="w-full text-[10px] text-slate-500 uppercase tracking-tighter mb-1">Items in this room</div>
          )}
          {currentRoom.items?.map(itemId => {
            const item = world.items[itemId];
            return (
              <button
                key={itemId}
                onClick={() => pickUpItem(itemId)}
                className="bg-amber-600/20 text-amber-400 border border-amber-600/30 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-amber-600/30 active:scale-95 transition-all"
              >
                Take {item.name}
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="nav-grid">
            <NavButton dir="nw" label="NW" onClick={() => move('nw')} isActive={!!currentRoom.exits.nw} />
            <NavButton dir="n" label="N" onClick={() => move('n')} isActive={!!currentRoom.exits.n} />
            <NavButton dir="ne" label="NE" onClick={() => move('ne')} isActive={!!currentRoom.exits.ne} />
            <NavButton dir="w" label="W" onClick={() => move('w')} isActive={!!currentRoom.exits.w} />
            <NavButton dir="center" label="LOOK" onClick={lookAround} />
            <NavButton dir="e" label="E" onClick={() => move('e')} isActive={!!currentRoom.exits.e} />
            <NavButton dir="sw" label="SW" onClick={() => move('sw')} isActive={!!currentRoom.exits.sw} />
            <NavButton dir="s" label="S" onClick={() => move('s')} isActive={!!currentRoom.exits.s} />
            <NavButton dir="se" label="SE" onClick={() => move('se')} isActive={!!currentRoom.exits.se} />
          </div>

          <div className="bg-slate-900/50 rounded-xl border border-slate-700 p-3 flex flex-col min-h-0">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1.118.994L9 6z" clipRule="evenodd" />
                <path d="M9 11h2v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5h7zM14 11h2v5a2 2 0 01-2 2h-5v-7h7z" />
              </svg>
              Inv
            </h3>
            <div className="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
              {state.inventory.length === 0 ? (
                <div className="text-slate-600 text-[10px] text-center py-4">Empty</div>
              ) : (
                state.inventory.map(itemId => {
                  const item = world.items[itemId];
                  return (
                    <button
                      key={itemId}
                      onClick={() => setSelectedItemId(itemId)}
                      className="w-full text-left bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] p-2 rounded border border-slate-700 transition-colors truncate"
                    >
                      {item.name}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
