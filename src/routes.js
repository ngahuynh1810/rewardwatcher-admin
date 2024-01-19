import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
// import BlogPage from 'src/pages/BlogPage';
// import ProductsPage from 'src/pages/ProductsPage';
import {
  DashboardAppPage,
  LoginPage,
  UserFormPage,
  UserPage,
  Page404,
  CategoryList,
  CategoryForm,
  StoreForm,
  StoreList,
  CashbackCardForm,
  CashbackCardList,
  BannerList,
  BannerForm,
  CashbackShopForm,
  CashbackShopList,
  CashbackWebsiteForm,
  CashbackWebsiteList,
  CompanyForm,
  CouponForm,
  CouponList,
  GroupCategoryForm,
  GroupCategoryList,
  SessionDealForm,
  SessionDealList,
  SessionStoreList,
  SessionStoreForm,
  TopStoreForm,
  TopStoreList,
  StoreTitleForm,
  StoreTitleList,
  SubscribeForm,
  SubscribeList,
  CouponTitleForm,
  CouponTitleList,
  TopStoreTitleForm,
  TopStoreTitleList,
  CashbackCardTitleForm,
  CashbackCardTitleList
} from 'src/pages';
// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/category" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        // { path: 'user/create', element: <UserFormPage /> },
        // { path: 'user/:id', element: <UserFormPage/> },
        // { path: 'user', element: <UserPage /> },

        { path: 'group-categories/create', element: <GroupCategoryForm /> },
        { path: 'group-categories/:id', element: <GroupCategoryForm/> },
        { path: 'group-categories', element: <GroupCategoryList /> },

        { path: 'category/create', element: <CategoryForm /> },
        { path: 'category/:id', element: <CategoryForm/> },
        { path: 'category', element: <CategoryList /> },


        { path: 'store-title/create', element: <StoreTitleForm /> },
        { path: 'store-title/:id', element: <StoreTitleForm/> },
        { path: 'store-title', element: <StoreTitleList /> },

        { path: 'store/create', element: <StoreForm /> },
        { path: 'store/:id', element: <StoreForm/> },
        { path: 'store', element: <StoreList /> },

        { path: 'cashback-card-title/create', element: <CashbackCardTitleForm /> },
        { path: 'cashback-card-title/:id', element: <CashbackCardTitleForm/> },
        { path: 'cashback-card-title', element: <CashbackCardTitleList /> },

        { path: 'cashback-card/create', element: <CashbackCardForm /> },
        { path: 'cashback-card/:id', element: <CashbackCardForm/> },
        { path: 'cashback-card', element: <CashbackCardList /> },

        { path: 'subscribe/create', element: <SubscribeForm /> },
        { path: 'subscribe/:id', element: <SubscribeForm/> },
        { path: 'subscribe', element: <SubscribeList /> },

        { path: 'banner/create', element: <BannerForm /> },
        { path: 'banner/:id', element: <BannerForm/> },
        { path: 'banner', element: <BannerList /> },

        { path: 'cashback-shop/create', element: <CashbackShopForm /> },
        { path: 'cashback-shop/:id', element: <CashbackShopForm/> },
        { path: 'cashback-shop', element: <CashbackShopList /> },
         
        { path: 'cashback-website/create', element: <CashbackWebsiteForm /> },
        { path: 'cashback-website/:id', element: <CashbackWebsiteForm/> },
        { path: 'cashback-website', element: <CashbackWebsiteList /> },

        { path: 'coupon-title/create', element: <CouponTitleForm /> },
        { path: 'coupon-title/:id', element: <CouponTitleForm/> },
        { path: 'coupon-title', element: <CouponTitleList /> },

        { path: 'coupon/create', element: <CouponForm /> },
        { path: 'coupon/:id', element: <CouponForm/> },
        { path: 'coupon', element: <CouponList /> },

        { path: 'season-store/create', element: <SessionStoreForm /> },
        { path: 'season-store/:id', element: <SessionStoreForm/> },
        { path: 'season-store', element: <SessionStoreList /> },

        { path: 'top-store-title/create', element: <TopStoreTitleForm /> },
        { path: 'top-store-title/:id', element: <TopStoreTitleForm/> },
        { path: 'top-store-title', element: <TopStoreTitleList /> },

        { path: 'top-store/create', element: <TopStoreForm /> },
        { path: 'top-store/:id', element: <TopStoreForm/> },
        { path: 'top-store', element: <TopStoreList /> },

        { path: 'season-deal/create', element: <SessionDealForm /> },
        { path: 'season-deal/:id', element: <SessionDealForm/> },
        { path: 'season-deal', element: <SessionDealList /> },

        { path: 'company', element: <CompanyForm/> },
        // { path: 'products', element: <ProductsPage /> },
        // { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/overview/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/dashboard/app" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
