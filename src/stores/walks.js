import { create } from "zustand";
import { produce } from "immer";
import * as simpleStatistics from "simple-statistics";

/**
 * Calculates linear regression for each attribute in the walk.
 * @param {object} walk - The walk object.
 * @returns {object} - The updated walk object with regression values.
 */
const calculateLinearRegressions = (walk) => {
  walk.attributes.forEach((attribute) => {
    const scores = attribute.steps;
    const steps = scores.map((score, index) => [index - 5, score]);
    const regression = simpleStatistics.linearRegression(steps);
    attribute.slope = regression.m;
    attribute.intercept = regression.b;
    attribute.r2 = simpleStatistics.rSquared(
      steps,
      (x) => regression.m * x + regression.b
    );
  });
  return walk;
};

// Create an instance of AbortController for cancelling fetch requests
let controller = new AbortController();

/**
 * Custom store for managing walks-related data and actions.
 * Uses Zustand library for state management.
 */
const useWalks = create((set, get) => ({
  space: 'z',
  direction: 'Eyeglasses',
  walks: [],
  selectedWalks: [],
  loading: false,
  error: false,
  errorMessage: '',

  /**
   * Sets the selected walks.
   * @param {Array} selectedWalks - The array of selected walks.
   */
  setSelectedWalks: (selectedWalks) => set(produce(state => { state.selectedWalks = selectedWalks })),

  /**
   * Sets the loading state.
   * @param {boolean} loading - The loading state value.
   */
  setLoading: (loading) => set(produce(state => { state.loading = loading })),

  /**
   * Sets the error state and error message.
   * @param {boolean} error - The error state value.
   * @param {string} errorMessage - The error message.
   */
  setError: (error, errorMessage) => set(produce(state => {
    state.error = error;
    state.errorMessage = errorMessage;
  })),


  /**
   * Fetches walks data from the API based on space, direction, and number of chunks.
   * @param {string} space - The space value.
   * @param {string} direction - The direction value.
   * @param {number} chunks - The number of chunks.
   */
  getWalks: async (space, direction, chunks = 10) => {
    try {
      for (let chunk = 0; chunk < chunks; chunk++) {
        try {
          // const response = await fetch(`/api/walks?space=${space}&direction=${direction}&chunk=${chunk}`, { signal: controller.signal });

          const url = process.env.NODE_ENV === 'production'
            ? `https://gan-disentanglement.vercel.app/chunks/${space}/${direction}/${chunk}.json`
            : `http://localhost:3000/chunks/${space}/${direction}/${chunk}.json`;

          const response = await fetch(url, { signal: controller.signal });


          if (!response.ok) throw new Error("Network response was not ok");

          const walks = await response.json();
          const updatedWalks = walks.map(calculateLinearRegressions);

          set(state => produce(state, draftState => {
            draftState.walks.push(...updatedWalks);
          }));
        } catch (error) {
          console.error("Fetch failed:", error);
          set(produce(state => {
            state.loading = false;
            state.error = true;
            state.errorMessage = error.message;
          }));
        }
      }
      set(produce(state => { state.loading = false; }));
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
   * Sets the space value (z or w) and triggers the fetch for corresponding walks.
   * @param {string} space - The space value.
   */
  setSpace: (space) => {
    const { direction } = get();
    get().setSpaceAndDirection(space, direction);
  },

  /**
   * Sets the direction value and triggers the fetch for corresponding walks.
   * @param {string} direction - The direction value.
   */
  setDirection: (direction) => {
    const { space } = get();
    get().setSpaceAndDirection(space, direction);
  },

  /**
   * Sets the space and direction values and triggers the fetch for corresponding walks.
   * @param {string} space - The space value.
   * @param {string} direction - The direction value.
   */
  setSpaceAndDirection: (space, direction) => {
    if (get().loading) {
      // throw Error("already loading...");
      console.log("already loading...")
      return;
    }
    set(produce(state => {
      state.space = space;
      state.direction = direction;
      state.loading = true;
      state.walks = [];
      state.selectedWalks = [];
    }));

    get().getWalks(space, direction);
  }
}));

export default useWalks;
