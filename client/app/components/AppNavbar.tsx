import { Navbar } from "@blueprintjs/core";
import Link from "next/link";

export const AppNavBar = () => {
  return (
    <Navbar>
      <Navbar.Group>
        <Navbar.Heading>
          <Link href="/">Home</Link>
        </Navbar.Heading>
      </Navbar.Group>
    </Navbar>
  );
};
