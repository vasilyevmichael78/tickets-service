import Link from "next/link";

const Header = ({ currentUser }) => {
  const links = [
    !currentUser && {
      label: "Sign Up",
      href: "/auth/signup",
    },
    !currentUser && {
      label: "Sign In",
      href: "/auth/signin",
    },
    currentUser && {
      label: "Sell Tickets",
      href: "/tickets/new",
    },
    currentUser && {
      label: "My Orders",
      href: "/orders",
    },
    currentUser && {
      label: "Sign Out",
      href: "/auth/signout",
    },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li className="nav-item" key={href}>
          <Link href={href}>
            <a className="navbar-brand text-light ">{label}</a>
          </Link>
        </li>
      );
    });
  return (
    <nav className="navbar navbar-light bg-secondary position-relative">
      <Link href="/">
        <a className="navbar-brand p-2 text-light">GitTix</a>
      </Link>
      <div className="d-flex justify-content-lg-around">
        <ul className="nav d-flex align-items-center p-2">{links}</ul>
      </div>
    </nav>
  );
};
export default Header;
