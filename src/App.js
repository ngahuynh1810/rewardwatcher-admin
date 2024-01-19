import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider  } from "react-redux";
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import store from "./store";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// ----------------------------------------------------------------------
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <Provider store={store}> 
    <HelmetProvider >
      <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider>
          <ScrollToTop />
          <ToastContainer />
          <StyledChart />
          <Router />
        </ThemeProvider>
        </LocalizationProvider>
      </BrowserRouter>
    </HelmetProvider>
    </Provider>
  );
}
