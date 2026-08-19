import { render } from "@testing-library/react";

function customRender(ui, options = {}) {
  return render(ui, options);
}

export * from "@testing-library/react";
export { customRender as render };

// import { render } from "@testing-library/react";

// export function customRender(ui, options) {
//   return render(ui, {
//     ...options,
//     wrapper: ({ children }) => {
//       return children;
//     },
//   });
// }

// export * from "@testing-library/react";
