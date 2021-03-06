import "./app.global.scss";
import styles from "./app.module.scss";
import Main from "./Main";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navigation";
import Header from "./components/Navigation/Header";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import { grey, green } from "@material-ui/core/colors";
import { useStore } from "./store";
import SnackbarComponent from "./components/SnackbarComponent";

const App = () => {
  const { darkMode } = useStore();

  // https://material-ui.com/customization/color/ för att se fler färger
  const theme = createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        light: green[300],
        main: green[400],
        dark: green[500],
        contrastText: "#fff",
      },
      secondary: {
        light: grey[200],
        main: grey[300],
        dark: grey[400],
        contrastText: "#000",
      },
    },
    typography: {
      fontFamily: ["Montserrat", "sans-serif"].join(","),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.container}>
        <Router>
          <SnackbarComponent />
          <Header />
          <Navbar />
          <Main />
        </Router>
      </div>
    </ThemeProvider>
  );
};

export default App;
