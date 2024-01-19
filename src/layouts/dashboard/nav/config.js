// component
import SvgColor from '../../../components/svg-color';
import CategoryTwoToneIcon from '@mui/icons-material/CategoryTwoTone';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';
import DiscountIcon from '@mui/icons-material/Discount';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StoreIcon from '@mui/icons-material/Store';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import EmailIcon from '@mui/icons-material/Email';
// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;
const TOP_STORE = "Featured Stores Section"
const SEASON_DEAL = "Season Deal"
const CASHBACK = "CASHBACK"
const MANAGE = "Manage"
const BANNER_SECTION = "Banner section"
const STORE_SECTION = "Store section"
const SEASON_SECTION = "Season section"
const COUPON_SECTION = "Coupon section"
const CASHBACK_CARD_SECTION = "Cashback Card section"
const UN_SECTION = ""
const navConfig = [
  {
    title: 'overview',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
    section: UN_SECTION
  },
  {
    title: 'group categories',
    path: '/dashboard/group-categories',
    icon: <GroupWorkIcon/>,
    section: CASHBACK
  },
  {
    title: 'category',
    path: '/dashboard/category',
    icon: <CategoryTwoToneIcon/>,
    section: CASHBACK
  },
  {
    title: 'cashback website',
    path: '/dashboard/cashback-website',
    icon:  <LanguageIcon/>,
    section: CASHBACK
  },
  
  {
    title: 'cashback for store',
    path: '/dashboard/cashback-shop',
    icon: <CurrencyExchangeIcon/>,
    section: CASHBACK
  },
  {
    title: 'company',
    path: '/dashboard/company',
    icon: <BusinessIcon/>,
    section: MANAGE
  },
  {
    title: 'subscribe',
    path: '/dashboard/subscribe',
    icon: <EmailIcon/>,
    section: MANAGE
  },
  // {
  //   title: 'banner titlle',
  //   path: '/dashboard/banner-title',
  //   icon: <AdUnitsIcon/>,
  //   section: BANNER_SECTION
  // },
  {
    title: 'banner',
    path: '/dashboard/banner',
    icon: <AdUnitsIcon/>,
    section: BANNER_SECTION
  },
  {
    title: 'store title',
    path: '/dashboard/store-title',
    icon: <StoreIcon/>,
    section: STORE_SECTION
  },
  {
    title: 'store',
    path: '/dashboard/store',
    icon: <StoreIcon/>,
    section: STORE_SECTION
  },
  {
    title: 'Featured Stores title',
    path: '/dashboard/top-store-title',
    icon: <WhatshotIcon/>,
    section: TOP_STORE
  },
  {
    title: 'Featured Stores',
    path: '/dashboard/top-store',
    icon: <StoreIcon/>,
    section: TOP_STORE
  },
  {
    title: 'Season deal',
    path: '/dashboard/season-deal',
    icon: <WhatshotIcon/>,
    section: SEASON_DEAL
  },

   
 
  {
    title: 'Coupon title',
    path: '/dashboard/coupon-title',
    icon: <DiscountIcon/>,
    section: COUPON_SECTION
  },
  {
    title: 'coupon',
    path: '/dashboard/coupon',
    icon: <DiscountIcon/>,
    section: COUPON_SECTION
  },
  {
    title: 'cashback card title',
    path: '/dashboard/cashback-card-title',
    icon: <CreditCardIcon/>,
    section: CASHBACK_CARD_SECTION
  },
  {
    title: 'cashback card',
    path: '/dashboard/cashback-card',
    icon: <CreditCardIcon/>,
    section: CASHBACK_CARD_SECTION
  },
  {
    title: 'Season Store',
    path: '/dashboard/season-store',
    icon: <StoreIcon/>,
    section: SEASON_DEAL
  },
  
  
  // {
  //   title: 'product',
  //   path: '/dashboard/products',
  //   icon: icon('ic_cart'),
  // },
  // {
  //   title: 'blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic_blog'),
  // },
  // {
  //   title: 'login',
  //   path: '/login',
  //   icon: icon('ic_lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic_disabled'),
  // },
];

export default navConfig;
