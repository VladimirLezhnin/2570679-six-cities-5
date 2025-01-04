type NavigateFunctionType = (path: string) => void;

let navigateFunction: NavigateFunctionType | null = null;

export const setNavigateFunction = (navigate: NavigateFunctionType) => {
  navigateFunction = navigate;
};

export const navigateTo = (path: string) => {
  if (navigateFunction) {
    navigateFunction(path);
  }
};
