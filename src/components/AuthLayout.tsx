import { Link } from "react-router-dom";

// images
import logoLight from '../assets/images/logo-light.png';
import logoDark from '../assets/images/logo-dark.png';

//component

interface AccountLayoutProps {
  pageImage?: any;
  authTitle?: string;
  helpText?: string;
  bottomLinks?: any;
  isCombineForm?: boolean;
  children?: any;
  hasForm?: boolean;
  hasThirdPartyLogin?: boolean;
  userImage?: string;
}

const AuthLayout = ({
  pageImage,
  authTitle,
  helpText,
  bottomLinks,
  isCombineForm,
  children,
  hasForm,
  hasThirdPartyLogin,
  userImage,
}: AccountLayoutProps) => {
  // useEffect(() => {
  //   if (document.body) {
  //     document.body.classList.add('authentication-bg', 'position-relative')
  //   }
  //   return () => {
  //     if (document.body) {
  //       document.body.classList.remove('authentication-bg', 'position-relative')
  //     }
  //   }
  // }, [])

  return (
    <>
      <div className="bg-gradient-to-r from-rose-100 to-teal-100 dark:from-gray-700 dark:via-gray-900 dark:to-black">
        <div className="h-screen w-screen flex justify-center items-center">
          <div className="2xl:w-1/4 lg:w-1/3 md:w-1/2 w-full">
            <div className="card overflow-hidden sm:rounded-md rounded-none">
              <div className="p-6">
                {userImage ? (
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-4 mb-6">
                      <Link to="/" className="block">
                        <img className="h-6 block dark:hidden" src={logoDark} />
                        <img className="h-6 hidden dark:block" src={logoLight} />
                      </Link>
                      <h4 className="text-slate-900 dark:text-slate-200/50 font-semibold">Hi ! Adam </h4>
                    </div>
                    <img src={userImage} alt="user-image" className="h-16 w-16 rounded-full shadow" />
                  </div>
                ) : (
                  <Link to="/" className="block mb-8">
                    <img className="h-6 block dark:hidden" src={logoDark} alt="" />
                    <img className="h-6 hidden dark:block" src={logoLight} alt="" />
                  </Link>
                )}

                {children}

              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default AuthLayout;
