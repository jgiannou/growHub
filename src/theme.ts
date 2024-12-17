import { extendTheme } from "@chakra-ui/react";

const borderColor = "#E5E0D1"; // Slightly darker than background for visibility

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "#FCF9E8",
      },
    },
  },
  components: {
    Card: {
      baseStyle: {
        container: {
          bg: "#FCF9E8",
          borderStyle: "dashed",
          borderWidth: "2px",
          borderColor: borderColor,
        },
      },
    },
    Box: {
      baseStyle: {
        borderStyle: "dashed",
        borderWidth: "2px",
        borderColor: borderColor,
      },
    },
  },
  borders: {
    dashed: `2px dashed ${borderColor}`,
  },
});

export default theme;
