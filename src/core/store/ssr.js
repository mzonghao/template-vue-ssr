export default function () {
  return {
    state: {
      content: {}
    },
    mutations: {
      prefetch(state, playload) {
        Object.assign(state.content, {
          ...state.content,
          [playload.name]: playload.content
        });
      }
    }
  };
}
