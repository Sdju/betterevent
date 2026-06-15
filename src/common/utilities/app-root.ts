let root: HTMLElement | null = null;

export const setAppRoot = (element: HTMLElement) => {
  root = element;
  element.setAttribute("data-betterevent-app", "");
};

export const getAppRoot = () => root;
