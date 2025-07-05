export const colors = {
  light: {
    background: "rgb(255, 255, 255)",
    text: {
      primary: "rgb(17, 24, 39)",
      secondary: "rgb(107, 114, 128)",
      muted: "rgb(156, 163, 175)",
    },
    card: {
      background: "rgb(249, 250, 251)",
      hover: "rgb(243, 244, 246)",
    },
    border: "rgb(229, 231, 235)",
    input: {
      background: "rgb(243, 244, 246)",
      placeholder: "rgb(107, 114, 128)",
    },
  },
  dark: {
    background: "rgb(21, 28, 23)",
    text: {
      primary: "rgb(255, 255, 255)",
      secondary: "rgb(209, 213, 219)",
      muted: "rgb(156, 163, 175)",
    },
    card: {
      background: "rgb(35, 45, 38)",
      hover: "rgb(45, 55, 48)",
    },
    border: "rgb(55, 65, 58)",
    input: {
      background: "rgb(35, 45, 38)",
      placeholder: "rgb(156, 163, 175)",
    },
  },
} as const;

// Tailwind CSS custom color classes for easy use in components
export const tailwindColors = {
  background: "bg-white dark:bg-[rgb(21,28,23)]",
  text: {
    primary: "text-gray-900 dark:text-white",
    secondary: "text-gray-600 dark:text-gray-300",
    muted: "text-gray-500 dark:text-gray-400",
  },
  card: {
    background: "bg-gray-50 dark:bg-[rgb(35,45,38)]",
    hover: "hover:bg-gray-100 dark:hover:bg-[rgb(45,55,48)]",
  },
  border: "border-gray-200 dark:border-[rgb(55,65,58)]",
  input: {
    background: "bg-gray-100 dark:bg-[rgb(35,45,38)]",
    placeholder: "placeholder-gray-500 dark:placeholder-gray-400",
  },
} as const;
