import type { Preview } from "@storybook/react-vite";
import "../src/theme.css";
import "./preview.css";

const preview: Preview = {
  parameters: {
    a11y: {
      test: "error",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    layout: "centered",
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundations",
          "Components",
          ["Actions", "Forms", "Feedback", "Navigation", "Layout"],
        ],
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
