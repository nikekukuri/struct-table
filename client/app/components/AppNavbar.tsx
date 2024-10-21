import { Navbar } from "@blueprintjs/core";
import Link from "next/link";

export const AppNavBar = () => {
  return (
    <Navbar fixedToTop className="py-2 border-b-2 border-gray-500">
      <Navbar.Group>
        <Navbar.Heading className="px-4 space-x-4">
          <Link href="/">Home</Link>
          <Link href="/table">Table</Link>
          <Link href="/graph">Graph</Link>
          <Link href="/generate">Generate</Link>
        </Navbar.Heading>
      </Navbar.Group>
    </Navbar>
  );
};
