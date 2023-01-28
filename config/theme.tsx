import { createTheme } from "@material-ui/core/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#FFD64B",
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#11cb5f",
    },
  },
  overrides: {
    MuiButton: {
      root: {
        fontSize: 14,
        fontWeight: 700,
        fontFamily: "'Poppins'",
        boxShadow: "none!important",
      },
      containedPrimary: {
        color: "#fff",
      },
    },
    MuiDialog: {
      root: {
        "& .MuiPaper-root": {
          borderRadius: "18px",
        },
      },
    },
  },
});
