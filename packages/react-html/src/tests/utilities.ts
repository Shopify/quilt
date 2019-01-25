export function findMeta(wrapper, props) {
  return wrapper.findWhere(component => {
    const propsArray = Object.keys(props);
    return (
      propsArray.filter(prop => component.prop(prop) === props[prop]).length ===
      propsArray.length
    );
  });
}
