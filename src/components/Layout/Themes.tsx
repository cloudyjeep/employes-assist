import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const themeLight = createTheme({
  palette: {
    mode: "light", // Bisa diubah ke 'dark' untuk tema gelap
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#555555",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          borderWidth: 2,
          fontWeight: 600,
          "& .MuiTouchRipple-root": { borderRadius: 6 },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        InputLabelProps: { shrink: true },
      },
      styleOverrides: {
        root: {
          "& .MuiFormLabel-root": {
            top: 14,
            fontSize: 18,
            fontWeight: 600,
            zIndex: 2,
          },

          "& .MuiInputBase-root": {
            paddingTop: 12,
            "> .MuiInputBase-input": {
              zIndex: 1,
              paddingBottom: 12,
            },
            fieldset: {
              borderRadius: 8,
              backgroundColor: "#dae6ff",
              legend: { display: "none" },
            },
          },

          ".MuiInputBase-root fieldset": {
            borderWidth: 0,
          },
          "&.Mui-focused .MuiInputBase-root fieldset": {
            borderWidth: 2,
          },
        },
      },
    },
  },
});

export const Themes: FC<{}> = (props) => {
  return (
    <ThemeProvider theme={themeLight}>
      <CssBaseline />
      {props.children}
    </ThemeProvider>
  );
};
