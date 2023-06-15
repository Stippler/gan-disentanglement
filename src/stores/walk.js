import { create } from "zustand";
import { produce } from "immer";

let controller = new AbortController()

/**
 * Custom store for managing walk-related data and actions.
 * Uses Zustand library for state management.
 */
const useWalk = create((set, get) => ({
    space: 'z',
    direction: 'Eyeglasses',
    walk: 0,
    walkData: null,
    loading: false,
    error: false,
    errorMessage: '',
    start: 0,
    current: 10,
    end: 99,
    /**
     * Sets the start value for the walk sequence.
     * @param {number} start - The start value.
     */
    setStart: (start) => {
        set(produce(state => {
            state.start = start
        }));
    },
    /**
     * Sets the current value.
     * @param {number} current - The current value.
     */
    setCurrent: (current) => {
        set(produce(state => {
            state.current = current
        }));
    },
    /**
     * Sets the end value.
     * @param {number} end - The end value.
     */
    setEnd: (end) => {
        set(produce(state => {
            state.end = end
        }));
    },
    /**
     * Fetches walk data from the API.
     */
    getWalk: async () => {
        set(produce(state => {
            state.loading = true;
            state.walkData = null;
            state.error = false;
            state.errorMessage = '';
        }));

        try {
            const { space, direction, walk } = get();
            const chunk = Math.floor(walk / 10);
            const url = process.env.NODE_ENV === 'production'
                ? `https://gan-disentanglement.vercel.app/chunks/${space}/${direction}/${chunk}.json`
                : `http://localhost:3000/chunks/${space}/${direction}/${chunk}.json`;

            const response = await fetch(url, { signal: controller.signal });
            // const response = await fetch(`/api/walk?space=${space}&direction=${direction}&walk=${walk}`, { signal: controller.signal });

            if (!response.ok) throw new Error("Network response was not ok");

            let walks = await response.json();
            let walkData = walks[walk % 10];

            set(produce(state => {
                state.walkData = walkData;
                state.loading = false;
            }));
        } catch (error) {
            console.error("Fetch failed:", error);
            set(produce(state => {
                state.loading = false;
                state.error = true;
                state.errorMessage = error.message;
            }));
        }
    },
    /**
     * Sets the space, direction, and walk values and fetches the corresponding walk data. 
     * @param {string} space - The space value. Either z (latent) or w (style) space.
     * @param {string} direction - The direction value. One of 30 possible attributes. 
     * @param {number} walk - The walk value (Index of the walk).
     */
    setSpaceDirectionWalk: (space, direction, walk) => {
        controller.abort();
        controller = new AbortController();

        set(produce(state => {
            state.space = space;
            state.direction = direction;
            state.walk = walk;
            state.loading = true;
            state.walks = [];
        }));

        get().getWalk(space, direction, walk);
    }
}));

export default useWalk;

