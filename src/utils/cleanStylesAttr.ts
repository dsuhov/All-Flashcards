export const cleanStylesAttr = (html: string) => {
  return html.replace(/\s*style\s*=\s*['"]*['"]/gi, '');
};
