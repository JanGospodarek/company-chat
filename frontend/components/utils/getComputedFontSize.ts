export const tailwindFontsSizes = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
];
const getComputedFontSize = (
  properity: string,
  computeTo: { fontSize: "large" | "normal" }
) => {
  if (computeTo === undefined) return properity;
  const properityName = properity.split("-")[0];
  const currentFontSize = properity.split("-")[1];
  console.log(currentFontSize);
  const currentIndex = tailwindFontsSizes.indexOf(currentFontSize);
  console.log(currentIndex);
  if (currentIndex === -1) return properity;
  if (
    currentIndex < tailwindFontsSizes.length - 1 &&
    computeTo.fontSize === "large"
  )
    return `${properityName}-${tailwindFontsSizes[currentIndex + 1]}`;
  else if (currentIndex > 0 && computeTo.fontSize === "normal")
    // return `${properityName}-${tailwindFontsSizes[currentIndex - 1]}`;
    return properity;
  else return properity;
};
export default getComputedFontSize;
