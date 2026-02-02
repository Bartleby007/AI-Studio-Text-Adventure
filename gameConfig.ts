import { GameWorld } from './types.ts';

export const INITIAL_WORLD: GameWorld = {
  startRoom: 'circle_of_light',
  rooms: {
    'circle_of_light': {
      id: 'circle_of_light',
      name: 'Circle of Light',
      description: 'You are standing in a circle of light. All around you is an impenetrable darkness. The circle of light has a faint rainbow around its perimeter.',
      exits: {
        n: 'sandy_shores',
        ne: 'sandy_shores',
        e: 'sandy_shores',
        se: 'sandy_shores',
        s: 'sandy_shores',
        sw: 'sandy_shores',
        w: 'sandy_shores',
        nw: 'sandy_shores'
      },
      items: []
    },
    'sandy_shores': {
      id: 'sandy_shores',
      name: 'Sandy Shores',
      description: 'You arrive at the edge of the water. There is a circle burned into the sand that sparkles with many colors in the sunlight. The beach extends to the east and west. The ocean waves crash from the south. The sand dunes extend endlessly to the north.',
      exits: {
        w: 'oceanside_beach_w1',
        e: 'oceanside_beach_e1',
        n: 'rolling_dunes'
      },
      items: [],
      events: [
        {
          trigger: 'onEnter',
          conditionFlag: '!left_circle',
          action: 'message',
          params: { 
            message: 'You step across the rainbow light on the ground. Bright sunlight greets you as you walk out up the beach with the ocean crashing behind you.',
            setFlag: 'left_circle' 
          }
        }
      ]
    },
    'rolling_dunes': {
      id: 'rolling_dunes',
      name: 'Rolling Dunes',
      description: 'You trudge through the hot sand. The dunes extend in every direction as far as you can see. The ocean is to the south.',
      exits: {
        s: 'sandy_shores',
        n: 'sandstorm'
      },
      items: []
    },
    'sandstorm': {
      id: 'sandstorm',
      name: 'Sandstorm',
      description: 'You enter a swirling sandstorm. The blowing sand blinds you and you lose all sense of direction.',
      exits: {
        n: 'rolling_dunes',
        ne: 'rolling_dunes',
        e: 'rolling_dunes',
        se: 'rolling_dunes',
        s: 'rolling_dunes',
        sw: 'rolling_dunes',
        w: 'rolling_dunes',
        nw: 'rolling_dunes'
      },
      items: [],
      events: [
        {
          trigger: 'onUseItem',
          triggerId: 'green_conch_shell',
          action: 'message',
          params: {
            message: 'You put your ear up to the shell and can hear the ocean. The whirling sandstorm suddenly calms as the winds settle down with a quiet stillness in the air.'
          }
        },
        {
          trigger: 'onUseItem',
          triggerId: 'green_conch_shell',
          action: 'updateExit',
          params: {
            roomId: 'rolling_dunes',
            direction: 'n',
            targetRoomId: 'salt_plains'
          }
        },
        {
          trigger: 'onUseItem',
          triggerId: 'green_conch_shell',
          action: 'updateExit',
          params: {
            roomId: 'salt_plains',
            direction: 's',
            targetRoomId: 'rolling_dunes'
          }
        },
        {
          trigger: 'onUseItem',
          triggerId: 'green_conch_shell',
          action: 'moveRoomItems',
          params: {
            sourceRoomId: 'sandstorm',
            targetRoomId: 'salt_plains'
          }
        },
        {
          trigger: 'onUseItem',
          triggerId: 'green_conch_shell',
          action: 'teleport',
          params: {
            targetRoomId: 'salt_plains'
          }
        }
      ]
    },
    'oceanside_beach_e1': {
      id: 'oceanside_beach_e1',
      name: 'Oceanside Beach',
      description: 'You are walking along the sandy beach. Large waves crash to the south of you. There are rolling sand dunes to the north.',
      exits: {
        w: 'sandy_shores',
        e: 'oceanside_beach_e2'
      },
      items: []
    },
    'oceanside_beach_e2': {
      id: 'oceanside_beach_e2',
      name: 'Oceanside Beach',
      description: 'You are walking along the sandy beach. Large rocks emerge out of the sand throughout the beach.',
      exits: {
        w: 'oceanside_beach_e1',
        e: 'oceanside_beach_e3'
      },
      items: []
    },
    'oceanside_beach_e3': {
      id: 'oceanside_beach_e3',
      name: 'Oceanside Beach',
      description: 'You are walking along the beach. The sand meets the edge of a rocky shore continuing to the east.',
      exits: {
        w: 'oceanside_beach_e2',
        e: 'cliffs_base'
      },
      items: []
    },
    'cliffs_base': {
      id: 'cliffs_base',
      name: "Cliff's Base",
      description: 'You are at the base of a towering sheer rock face. The cliffs extend off into the dunes. Occaisionally you hear a muffled boom rolling across the waves.',
      exits: {
        w: 'oceanside_beach_e3'
      },
      items: ['shovel']
    },
    'oceanside_beach_w1': {
      id: 'oceanside_beach_w1',
      name: 'Oceanside Beach',
      description: 'You are walking along the sandy beach. Large waves crash to the south of you. There are rolling sand dunes to the north.',
      exits: {
        e: 'sandy_shores',
        w: 'oceanside_beach_w2'
      },
      items: []
    },
    'oceanside_beach_w2': {
      id: 'oceanside_beach_w2',
      name: 'Oceanside Beach',
      description: 'You are walking along the sandy beach. There are piles of seaweed scattered around the tide lines.',
      exits: {
        e: 'oceanside_beach_w1',
        w: 'oceanside_beach_w3'
      },
      items: []
    },
    'oceanside_beach_w3': {
      id: 'oceanside_beach_w3',
      name: 'Oceanside Beach',
      description: 'You are walking along the sandy beach. Loose seashells mix into the sand around you.',
      exits: {
        e: 'oceanside_beach_w2',
        w: 'oceanside_beach_w4'
      },
      items: []
    },
    'oceanside_beach_w4': {
      id: 'oceanside_beach_w4',
      name: 'Oceanside Beach',
      description: 'You are walking along the sandy beach. Sparse areas of grass can be seen around the sand dunes.',
      exits: {
        e: 'oceanside_beach_w3',
        w: 'oceanside_beach_w5'
      },
      items: []
    },
    'oceanside_beach_w5': {
      id: 'oceanside_beach_w5',
      name: 'Oceanside Beach',
      description: 'You are walking along the sandy beach. Low shrubs with prickly spines grow out of the dunes here and there.',
      exits: {
        e: 'oceanside_beach_w4',
        w: 'sandy_forest'
      },
      items: [],
      events: [
        {
          trigger: 'onUseItem',
          triggerId: 'shovel',
          conditionFlag: '!conch_uncovered',
          action: 'addItem',
          params: {
            itemId: 'green_conch_shell',
            message: 'You dig deep into the soft sand... Clink! Your shovel hits something hard. You clear away the sand to reveal a beautiful Green Conch Shell!',
            setFlag: 'conch_uncovered'
          }
        },
        {
          trigger: 'onEnter',
          conditionItem: 'glowing_stone',
          conditionFlag: '!conch_uncovered',
          action: 'message',
          params: {
            message: 'The Glowing Stone vibrates faintly in your hand.'
          }
        }
      ]
    },
    'sandy_forest': {
      id: 'sandy_forest',
      name: 'Sandy Forest',
      description: 'There are scattered trees growing along the beach and into the dunes. The roots of the trees curl up out of the sand covered in long thorns.',
      exits: {
        e: 'oceanside_beach_w5',
        w: 'tangled_roots'
      },
      items: []
    },
    'tangled_roots': {
      id: 'tangled_roots',
      name: 'Tangled Roots',
      description: 'The tree roots tangle together making the beach impassable.',
      exits: {
        e: 'sandy_forest'
      },
      items: ['glowing_stone']
    },
    'salt_plains': {
      id: 'salt_plains',
      name: 'Salt Plains',
      description: 'You are in a wide open plain filled with scrubby grass. You smell a salty breeze as you walk through the mix of sand and grass.',
      exits: {},
      items: []
    }
  },
  items: {
    'shovel': {
      id: 'shovel',
      name: 'Shovel',
      description: 'A wood handled shovel. Handy for digging holes and turning over dirt in your garden.',
      canTake: true,
      defaultUseMessage: 'You dig for a while, but find nothing new.'
    },
    'glowing_stone': {
      id: 'glowing_stone',
      name: 'Glowing Stone',
      description: 'A smooth flat stone that fits comfortably in the palm of your hand. The stone emits a pale blue light and feels slightly warm.',
      canTake: true,
      defaultUseMessage: 'You stare at the stone for a few minutes but nothing happens.'
    },
    'green_conch_shell': {
      id: 'green_conch_shell',
      name: 'Green Conch Shell',
      description: 'A large green conch shell that used to be home to some unknown sea creature.',
      canTake: true,
      defaultUseMessage: 'You put your ear up to the shell and can hear the ocean. The sound gradually fades into a deep silence for a few seconds.'
    }
  }
};