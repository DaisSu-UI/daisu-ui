export const e = (section, title, body, description) => ({
  section,
  title,
  body,
  description,
});
export const g = (intro, components, ...examples) => ({
  intro,
  components: components.split(" "),
  examples,
});
