import { lazy } from "react";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  ScrollRestoration
} from "react-router-dom";
import AuthGuard from "@/helpers/guards/AuthGuard";
import NotFound from "@/components/NotFound";
import Layout from "@/components/layout/Layout";
import WelcomeGuard from "@/helpers/guards/WelcomeGuard";
import AuthLayout from "@/components/layout/AuthLayout";
import RoleBasedGuard from "@/helpers/guards/RoleBasedGuard";
import Donate from "@/pages/donate";

import { Roles } from "@/helpers/constants";
import Loadable from "@/helpers/loading/Loadable";
import RouterParamProvider from "@/contexts/router/RouterParamContext";

const AnalyticsPage = Loadable(lazy(() => import("@/pages/analytics")));
const Notification = Loadable(
  lazy(() => import("@/pages/donate/notification"))
);
const SavePost = Loadable(lazy(() => import("@/pages/user/saved")));
const SearchCommentInTopic = Loadable(
  lazy(() => import("@/pages/topic/search/comments"))
);
const SearchCommentInUser = Loadable(
  lazy(() => import("@/pages/user/search/comments"))
);
const QRCode = Loadable(lazy(() => import("@/pages/donate/qrcode")));
const Popular = Loadable(lazy(() => import("@/pages/popular")));
const Memebers = Loadable(lazy(() => import("@/pages/manager/members")));
const Welcome = Loadable(lazy(() => import("@/pages/welcome")));
const Register = Loadable(lazy(() => import("@/pages/auth/register")));
const ConfirmEmail = Loadable(lazy(() => import("@/pages/auth/confirm-email")));
const ChangePassword = Loadable(
  lazy(() => import("@/pages/auth/reset-password/change-password"))
);
const SubmitPage = Loadable(lazy(() => import("@/pages/submit")));
const Comments = Loadable(lazy(() => import("@/pages/topic/comments")));
const TopcicManager = Loadable(lazy(() => import("@/pages/manager/topics")));
const CategoryManager = Loadable(
  lazy(() => import("@/pages/manager/categories"))
);
const ResetPassword = Loadable(
  lazy(() => import("@/pages/auth/reset-password"))
);
const Profile = Loadable(lazy(() => import("@/pages/user")));
const ProfileSettings = Loadable(
  lazy(() => import("@/pages/settings/profile"))
);
const SignIn = Loadable(lazy(() => import("@/pages/auth/signin")));
const Home = Loadable(lazy(() => import("@/pages/home")));
const TopicDetail = Loadable(lazy(() => import("@/pages/topic")));
const Topics = Loadable(lazy(() => import("@/pages/topics")));
const UserPosts = Loadable(lazy(() => import("@/pages/user/posts")));
const UserOverview = Loadable(lazy(() => import("@/pages/user/overview")));
const UserTrash = Loadable(lazy(() => import("@/pages/user/trash")));
const Attachment = Loadable(
  lazy(() => import("@/pages/topic/comments/attachment"))
);
const SearchPosts = Loadable(lazy(() => import("@/pages/search/posts")));
const SearchTopics = Loadable(lazy(() => import("@/pages/search/topics")));
const SearchPostInTopic = Loadable(
  lazy(() => import("@/pages/topic/search/posts"))
);
const SearchComments = Loadable(lazy(() => import("@/pages/search/comments")));
const SearchPeople = Loadable(lazy(() => import("@/pages/search/people")));
const SearchPostInUser = Loadable(
  lazy(() => import("@/pages/user/search/posts"))
);
const SignOut = Loadable(lazy(() => import("@/pages/auth/signout")));
const ListReport = Loadable(lazy(() => import("@/pages/manager/report/list")));
const Search = Loadable(lazy(() => import("@/pages/search")));
const SearchLayout = Loadable(
  lazy(() => import("@/components/layout/SearchLayout"))
);
const ModeratorPage = Loadable(lazy(() => import("@/pages/topic/moderator")));
const Test = Loadable(lazy(() => import("@/pages/test")));
const Response = Loadable(
  lazy(() => import("@/pages/manager/report/response"))
);

const router = createBrowserRouter([
  {
    path: "",
    element: (
      <AuthGuard>
        <WelcomeGuard>
          <RouterParamProvider>
            <Outlet />
            <ScrollRestoration getKey={location => location.pathname} />
          </RouterParamProvider>
        </WelcomeGuard>
      </AuthGuard>
    ),
    children: [
      {
        path: "",
        children: [
          {
            path: "topic/:name",
            children: [
              {
                path: "comments/:id",
                children: [
                  {
                    path: "attachment/:attachmentId",
                    element: <Attachment />
                  }
                ]
              }
            ]
          },
          {
            path: "user/:username",
            children: [
              {
                path: "comments/:id",
                children: [
                  {
                    path: "attachment/:attachmentId",
                    element: <Attachment />
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        path: "",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Navigate to="/home" replace />
          },
          {
            path: "test",
            element: <Test />
          },
          {
            path: "home",
            element: <Home />
          },
          {
            path: "popular",
            element: <Popular />
          },
          {
            path: "topics",
            children: [
              {
                index: true,
                element: <Topics />
              }
            ]
          },
          {
            path: "donate",
            children: [
              {
                index: true,
                element: <Donate />
              },
              {
                path: "qrcode",
                element: <QRCode />
              },
              {
                path: "transaction",
                element: <Notification />
              }
            ]
          },
          {
            path: "manager",
            element: (
              <RoleBasedGuard accessibleRoles={[Roles.ADMIN]}>
                <Outlet />
              </RoleBasedGuard>
            ),
            children: [
              {
                path: "members",
                element: <Memebers />
              },
              {
                path: "analytics",
                element: <AnalyticsPage />
              },
              {
                path: "topics",
                children: [
                  {
                    index: true,
                    element: <TopcicManager />
                  }
                ]
              },
              {
                path: "categories",
                children: [
                  {
                    index: true,
                    element: <CategoryManager />
                  }
                ]
              },
              {
                path: "report",
                element: <ListReport />
              },
              {
                path: "report/:reportId",
                element: <Response />
              }
            ]
          },
          {
            path: "topic/:name",
            children: [
              {
                index: true,
                element: <TopicDetail />
              },
              {
                path: "moderator",
                element: <ModeratorPage />
              },
              {
                path: "submit",
                element: <SubmitPage />
              },
              {
                path: "comments/:id",
                children: [
                  {
                    index: true,
                    element: <Comments />
                  }
                ]
              },
              {
                path: "search",
                element: <SearchLayout />,
                children: [
                  {
                    path: "posts",
                    element: <SearchPostInTopic />
                  },
                  {
                    path: "comments",
                    element: <SearchCommentInTopic />
                  }
                ]
              }
            ]
          },
          {
            path: "user/:username",
            element: <Profile />,
            children: [
              {
                index: true,
                element: <UserOverview />
              },
              {
                path: "posts",
                element: <UserPosts />
              },
              {
                path: "saved",
                element: <SavePost />
              },
              {
                path: "trash",
                element: <UserTrash />
              }
            ]
          },
          {
            path: "user/:username",
            children: [
              {
                path: "search",
                element: <SearchLayout />,
                children: [
                  {
                    path: "posts",
                    element: <SearchPostInUser />
                  },
                  {
                    path: "comments",
                    element: <SearchCommentInUser />
                  }
                ]
              },
              {
                path: "submit",
                element: <SubmitPage />
              },
              {
                path: "comments/:id",
                children: [
                  {
                    index: true,
                    element: <Comments />
                  }
                ]
              }
            ]
          },
          {
            path: "settings",
            children: [
              {
                path: "profile",
                element: <ProfileSettings />
              }
            ]
          },
          {
            path: "submit",
            element: <SubmitPage />
          },
          {
            path: "search",
            element: <Search />,
            children: [
              {
                path: "posts",
                element: <SearchPosts />
              },
              {
                path: "topics",
                element: <SearchTopics />
              },
              {
                path: "comments",
                element: <SearchComments />
              },
              {
                path: "people",
                element: <SearchPeople />
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: "welcome",
    element: (
      <AuthGuard>
        <Welcome />
      </AuthGuard>
    )
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "signin",
        element: <SignIn />
      },
      {
        path: "signout",
        element: <SignOut />
      },
      {
        path: "register",
        element: <Register />
      },
      {
        path: "reset-password",
        children: [
          {
            path: "change-password",
            element: <ChangePassword />
          },
          {
            index: true,
            element: <ResetPassword />
          }
        ]
      },
      {
        path: "confirm-email",
        element: <ConfirmEmail />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

const MyRouterProvider = () => {
  return <RouterProvider router={router} />;
};

export default MyRouterProvider;
