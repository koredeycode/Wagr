import Link from "next/link";

const Header = ({ showSignin }: { showSignin: boolean }) => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-between whitespace-nowrap border-b border-border px-6 md:px-10 py-4">
      <Link href={"/"}>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-foreground">Wagr</h1>
        </div>
      </Link>

      <div className="flex items-center gap-4">
        {showSignin && (
          <Link
            href="/sign-in"
            className="btn-primary flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden h-10 px-6 text-sm font-semibold"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
