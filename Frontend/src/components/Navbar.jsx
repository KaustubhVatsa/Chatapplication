import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="
      backdrop-blur-lg fixed w-full top-0 z-40 
      hover:opacity-90 transition-all duration-300 ease-in-out"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all transform hover:scale-105"
            >
              <div className="size-9 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold">Convo</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="btn btn-sm gap-2 hover:scale-105 transition-all transform"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to="/profile"
                  className="btn btn-sm gap-2 hover:scale-105 transition-all transform"
                >
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  className="flex gap-2 items-center hover:scale-105 transition-all transform"
                  onClick={logout}
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
