
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
        w: 'oceanside_beach_w1'
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
      items: []
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
      items: []
    }
  },
  items: {
  }
};
