import { ShieldAlert } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 text-slate-900">
          <ShieldAlert className="w-5 h-5 text-indigo-600" />
          <span className="font-bold text-lg tracking-tight">
            SystemHub Gateway
          </span>
        </div>
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Enterprise Security Solutions. Built
          by M. Waseem.
        </p>
        <div className="flex gap-4 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-indigo-600 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-indigo-600 transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
