const tailwindFontsSizes = [
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
  computeTo: { fontSize: "large" | "normal"; isInitial: boolean }
) => {
  if (computeTo.isInitial) return properity;

  const properityName = properity.split("-")[0];
  const currentFontSize = properity.split("-")[1];

  const currentIndex = tailwindFontsSizes.indexOf(currentFontSize);
  console.log(currentIndex, currentFontSize, properityName);
  if (currentIndex === -1) return properity;
  if (
    currentIndex < tailwindFontsSizes.length - 1 &&
    computeTo.fontSize === "large"
  )
    return `${properityName}-${tailwindFontsSizes[currentIndex + 1]}`;
  else if (currentIndex > 0 && computeTo.fontSize === "normal")
    return `${properityName}-${tailwindFontsSizes[currentIndex - 1]}`;
};
export default getComputedFontSize;
