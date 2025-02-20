export const arrayItemModifier = (elements, identifiers, modifierFunction) => {
  const indexElement = elements.findIndex((i) => i[identifiers.array] == identifiers.element)
  if (indexElement !== -1) {
    const updatedElement = modifierFunction(elements[indexElement])
    elements.splice(indexElement, 1, updatedElement)
  }
}
