import { Themes } from "./components/Layout/Themes";
import { StoreProvider } from "./lib/store";
import Routes from "./Routes";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

function App() {
  return (
    <StoreProvider>
      <Themes>
        <Routes />
      </Themes>
    </StoreProvider>
  );
}

export default App;
